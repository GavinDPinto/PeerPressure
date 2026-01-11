from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import Optional
from datetime import datetime, date, timedelta
import os
from dotenv import load_dotenv
from services.ai.openrouter import call_openrouter
from passlib.context import CryptContext
from jose import JWTError, jwt

# 1. Load Environment Variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# Password hashing with argon2 (more secure and no length limits)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

app = FastAPI()

# 2. CORS Setup
origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Database Connection
client = AsyncIOMotorClient(MONGO_URI)
db = client.resolution_db
resolutions_collection = db.resolutions
stats_collection = db.stats
users_collection = db.users

# --- DATA MODELS ---

class Resolution(BaseModel):
    title: str
    description: Optional[str] = None
    points: int = 10
    
    # New Required Field: 'daily' or 'onetime'
    type: str 
    
    # Optional deadline for one-time tasks
    target_date: Optional[str] = None 
    
    # Internal Defaults
    status: str = "active" # "active", "completed", "archived"
    last_completed_at: Optional[str] = None 
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    user_id: Optional[str] = None  # Will be set by the backend

class AIPrompt(BaseModel):
    prompt: str

class User(BaseModel):
    username: str
    email: str
    password: str  # In production, hash this!
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    email: str

# Password hashing functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# JWT token functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(authorization: Optional[str] = Header(None)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not authorization:
        raise credentials_exception
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise credentials_exception
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except (JWTError, ValueError):
        raise credentials_exception
    
    user = await users_collection.find_one({"username": username})
    if user is None:
        raise credentials_exception
    
    return user

def resolution_helper(resolution) -> dict:
    # Logic to determine if the task is "done for today"
    is_completed_today = False
    
    if resolution["type"] == "daily":
        today_str = date.today().isoformat()
        # Check if the last completion date matches today
        if resolution.get("last_completed_at") and resolution["last_completed_at"].startswith(today_str):
            is_completed_today = True
            
    elif resolution["type"] == "onetime":
        # One-time tasks are done if their status is explicitly 'completed'
        is_completed_today = (resolution["status"] == "completed")

    return {
        "id": str(resolution["_id"]),
        "title": resolution["title"],
        "description": resolution.get("description", ""),
        "points": resolution["points"],
        "type": resolution["type"],
        "target_date": resolution.get("target_date"),
        "status": resolution["status"],
        "completed_today": is_completed_today, # Computed for frontend UI
    }

# --- ROUTES ---

@app.get("/api")
async def check_connection():
    return {"status": "ok", "message": "Backend is running!"}

@app.post("/api/signup", response_model=Token)
async def signup(user: User):
    # Check if username already exists
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Check if email already exists
    existing_email = await users_collection.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    
    # Insert new user
    await users_collection.insert_one(user_dict)
    
    # Create JWT token
    access_token = create_access_token(data={"sub": user.username})
    return Token(
        access_token=access_token,
        token_type="bearer",
        username=user.username,
        email=user.email
    )

@app.post("/api/login", response_model=Token)
async def login(request: LoginRequest):
    # Find user by username
    user = await users_collection.find_one({"username": request.username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Verify password
    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": user["username"]})
    return Token(
        access_token=access_token,
        token_type="bearer",
        username=user["username"],
        email=user["email"]
    )

@app.get("/api/score")
async def get_score(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    stats = await stats_collection.find_one({"_id": user_id})
    if not stats:
        await stats_collection.insert_one({"_id": user_id, "total_points": 0})
        return {"total_points": 0}
    return {"total_points": stats["total_points"]}

@app.get("/api/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Get user stats
    stats = await stats_collection.find_one({"_id": user_id})
    if not stats:
        stats = {"_id": user_id, "total_points": 0, "streak": 67, "level": 67, "tasks_completed": 0, "about": ""}
        await stats_collection.insert_one(stats)
    
    # Ensure streak and level exist (set defaults if missing)
    if "streak" not in stats:
        stats["streak"] = 67
    if "level" not in stats:
        stats["level"] = 67
    if "tasks_completed" not in stats:
        stats["tasks_completed"] = 0
    if "about" not in stats:
        stats["about"] = ""
    
    # Count completed tasks for this user
    tasks_completed = await resolutions_collection.count_documents({
        "user_id": user_id,
        "status": "completed"
    })
    
    # Update tasks_completed in stats if different
    if tasks_completed != stats.get("tasks_completed", 0):
        await stats_collection.update_one(
            {"_id": user_id},
            {"$set": {"tasks_completed": tasks_completed, "streak": stats["streak"], "level": stats["level"]}}
        )
    
    return {
        "username": current_user["username"],
        "email": current_user["email"],
        "total_points": stats.get("total_points", 0),
        "tasks_completed": tasks_completed,
        "streak": stats.get("streak", 67),
        "level": stats.get("level", 67),
        "about": stats.get("about", "")
    }

class UpdateAbout(BaseModel):
    about: str

@app.put("/api/profile/about")
async def update_about(data: UpdateAbout, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Update about field in stats
    await stats_collection.update_one(
        {"_id": user_id},
        {"$set": {"about": data.about}},
        upsert=True
    )
    
    return {"success": True, "about": data.about}

@app.get("/api/resolutions")
async def get_resolutions(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    resolutions = []
    # Fetch only active tasks for this user (hide archived ones)
    async for resolution in resolutions_collection.find({"user_id": user_id, "status": {"$ne": "archived"}}):
        resolutions.append(resolution_helper(resolution))
    return resolutions

@app.post("/api/resolutions")
async def add_resolution(resolution: Resolution, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    # Insert new task into MongoDB with user_id
    resolution_dict = resolution.dict()
    resolution_dict["user_id"] = user_id
    new_res = await resolutions_collection.insert_one(resolution_dict)
    created_res = await resolutions_collection.find_one({"_id": new_res.inserted_id})
    return resolution_helper(created_res)

@app.put("/api/resolutions/{id}/complete")
async def complete_resolution(id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    task = await resolutions_collection.find_one({"_id": ObjectId(id)})
    if not task:
        raise HTTPException(status_code=404, detail="Resolution not found")
    
    # Verify ownership
    if task.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to complete this task")

    today_str = datetime.now().isoformat()
    update_data = {}
    
    # LOGIC: Handle Daily vs One-Time
    if task["type"] == "daily":
        # Daily: Update timestamp so it shows as done for today, but keep status 'active'
        update_data = {"last_completed_at": today_str}
    
    elif task["type"] == "onetime":
        # One-time: Mark as permanently completed
        update_data = {
            "last_completed_at": today_str,
            "status": "completed"
        }

    # Update the task
    await resolutions_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )

    # Add Points to User's Score
    points_to_add = task.get("points", 10)
    await stats_collection.update_one(
        {"_id": user_id},
        {"$inc": {"total_points": points_to_add}}, 
        upsert=True
    )
    
    return {"message": "Task completed!", "points_added": points_to_add}

# --- AI ROUTES ---

@app.post("/api/testai")
async def test_ai(request: AIPrompt):
    """Test endpoint for OpenRouter AI integration"""
    if not request.prompt or not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    try:
        response = await call_openrouter(request.prompt)
        return {"response": response}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"AI Route Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error calling AI service: {str(e)}")