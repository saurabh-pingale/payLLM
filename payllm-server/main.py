import uvicorn
import logging
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

from config import DEFAULT_GCP_BUCKET_NAME
from models import VideoGenerationRequest, TavusVideoRequest, QueryRequest
from services import VideoGenerationService, TextGenerationService

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

@app.get("/")
async def root():
    return {"message": "working"}

@app.post("/video/veo")
async def generate_video(request: VideoGenerationRequest = Body(...)):
    try:
        service = VideoGenerationService()
        video_url = await service.generate_video_veo_service(request.prompt)
        return {"status": "success", "video_url": video_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/video/veo/signed-url")
async def get_signed_video_url(blob_path: str):
    try:
        service = VideoGenerationService()
        url = service.generate_signed_url(DEFAULT_GCP_BUCKET_NAME, blob_path)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/video/tavus")
async def generate_tavus_video(request: TavusVideoRequest = Body(...)):
    try:
        service = VideoGenerationService()
        video_url = await service.generate_video_tavus_service(
            replica_id=request.replica_id,
            script=request.script
        )
        return {"status": "success", "video_url": video_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/conversation/claude")
async def generate_response_from_claude(request: QueryRequest):
    try:
        service = TextGenerationService()
        message = await service.generate_response_from_claude_service(
            query=request.query
        )
        return {"status": "success", "message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logging.info("Starting Video Generation API server on port 8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)