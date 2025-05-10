import os
from typing import Optional
import logging

from services import VideoGenerationService

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def generate_video_handler(
    prompt: str,
    project_id: Optional[str] = None,
    location: str = "us-central1",
    model_name: str = "videogeneration@001"
) -> str:
    """
    Handler function for video generation requests
    
    Args:
        prompt: Text prompt for video generation
        project_id: Google Cloud project ID (if None, will use environment variable)
        location: Google Cloud region
        model_name: Vertex AI model name for video generation
        
    Returns:
        URL of the generated video
    """
    try:
        logger.info(f"Received video generation request with prompt: {prompt}")
        
        project_id = project_id or os.environ.get("GOOGLE_CLOUD_PROJECT")
        if not project_id:
            project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
            
        # Create service instance
        service = VideoGenerationService(
            project_id=project_id,
            location=location,
            model_name=model_name
        )
        
        # Generate the video
        logger.info("Generating video...")
        video_url = service.generate_video(prompt)
        
        logger.info(f"Video generated successfully: {video_url}")
        return video_url
        
    except Exception as e:
        logger.error(f"Error generating video: {str(e)}", exc_info=True)
        raise Exception(f"Failed to generate video: {str(e)}")