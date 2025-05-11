import httpx
import logging
from typing import Optional

from external_services import ExternalVideoGenerationService
from constants import DEFAULT_LOCATION, DEFAULT_MODEL_NAME, TAVUS_API_URL
from config import PROJECT_ID, TAVUS_API_KEY

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def generate_video_veo_handler(prompt: str) -> str:
    try:
        logger.info(f"Received video generation request with prompt: {prompt}")
        
        project_id = PROJECT_ID
            
        # Create external service instance
        external_service = ExternalVideoGenerationService(
            project_id=project_id,
            location=DEFAULT_LOCATION
        )
        
        # Generate the video
        logger.info("Generating video...")
        video_url = external_service.generate_video_with_vertex_ai(
            prompt=prompt,
            model_name=DEFAULT_MODEL_NAME
        )
        
        logger.info(f"Video generated successfully: {video_url}")
        return video_url
        
    except Exception as e:
        logger.error(f"Error generating video: {str(e)}", exc_info=True)
        raise Exception(f"Failed to generate video: {str(e)}")
    

async def generate_video_tavus_handler(
    replica_id: str,
    script: str,
    callback_url: Optional[str] = None
) -> str:
    try:
        logger.info(f"Generating Tavus video for replica: {replica_id}")
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": TAVUS_API_KEY
        }
        
        payload = {
            "replica_id": replica_id,
            "script": script
        }
        
        if callback_url:
            payload["callback_url"] = callback_url
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                TAVUS_API_URL,
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            response.raise_for_status()
            video_data = response.json()
            
            # Adjust this based on actual Tavus API response structure
            video_url = video_data.get("video_url") or video_data.get("url")
            if not video_url:
                raise Exception("No video URL in Tavus API response")
            
            logger.info(f"Tavus video generated successfully: {video_url}")
            return video_url
            
    except httpx.HTTPStatusError as e:
        logger.error(f"Tavus API error: {e.response.text}", exc_info=True)
        raise Exception(f"Tavus API error: {e.response.text}")
    except Exception as e:
        logger.error(f"Error generating Tavus video: {str(e)}", exc_info=True)
        raise Exception(f"Failed to generate Tavus video: {str(e)}")