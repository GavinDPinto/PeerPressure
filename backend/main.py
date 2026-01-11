from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

app = FastAPI()

# CORS Setup
origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
client = AsyncIOMotorClient(MONGO_URI)
db = client.resolution_db
resolutions_collection = db.resolutions
stats_collection = db.stats

# Models
class Resolution(BaseModel):
    title: str
    completed_today: bool = False

def resolution_helper(resolution) -> dict:
    return {
        "id": str(resolution["_id"]),
        "title": resolution["title"],
        "completed_today": resolution["completed_today"],
    }

# --- ROUTES ---

# 1. Connection Test Route
@app.get("/api")
async def check_connection():
    return {"status": "ok", "message": "Backend is running!"}

# 2. Score Route
@app.get("/api/score")
async def get_score():
    stats = await stats_collection.find_one({"_id": "global_stats"})
    if not stats:
        await stats_collection.insert_one({"_id": "global_stats", "total_points": 0})
        return {"total_points": 0}
    return {"total_points": stats["total_points"]}

# 3. Get Resolutions
@app.get("/api/resolutions")
async def get_resolutions():
    resolutions = []
    async for resolution in resolutions_collection.find():
        resolutions.append(resolution_helper(resolution))
    return resolutions

# 4. Add Resolution
@app.post("/api/resolutions")
async def add_resolution(resolution: Resolution):
    new_res = await resolutions_collection.insert_one(resolution.dict())
    created_res = await resolutions_collection.find_one({"_id": new_res.inserted_id})
    return resolution_helper(created_res)

# 5. Complete Resolution (Add Points)
@app.put("/api/resolutions/{id}/complete")
async def complete_resolution(id: str):
    task = await resolutions_collection.find_one({"_id": ObjectId(id)})
    if not task:
        raise HTTPException(status_code=404, detail="Resolution not found")
    
    # Mark task as completed
    await resolutions_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"completed_today": True}}
    )

    # Add 10 points to global score
    await stats_collection.update_one(
        {"_id": "global_stats"},
        {"$inc": {"total_points": 10}}, 
        upsert=True
    )
    
    return {"message": "Points added to global score!"}