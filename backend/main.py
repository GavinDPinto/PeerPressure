from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from Python Backend!"}

@app.get("/api")
def read_api():
    return {"data": "This is data from the backend"}