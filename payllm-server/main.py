import uvicorn
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging

from handlers import generate_video_handler
from config import check_environment

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoGenerationRequest(BaseModel):
    prompt: str
    project_id: Optional[str] = None
    location: Optional[str] = "us-central1"
    model_name: Optional[str] = "videogeneration@001"
    
    class Config:
        protected_namespaces = ()

@app.get("/")
async def root():
    return {"message": "Video Generation API"}

@app.post("/generate-video")
async def generate_video(request: VideoGenerationRequest = Body(...)):
    try:
        video_url = await generate_video_handler(
            prompt=request.prompt,
            project_id=request.project_id,
            location=request.location,
            model_name=request.model_name
        )
        return {"status": "success", "video_url": video_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    check_environment()
    
    logging.info("Starting Video Generation API server on port 8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)