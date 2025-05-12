import httpx
import time
import logging
from typing import Optional
from google import genai
from google.genai import types

from constants import DEFAULT_LOCATION, DEFAULT_MODEL_NAME, TAVUS_API_URL
from config import PROJECT_ID, TAVUS_API_KEY, DEFAULT_GCP_BUCKET

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def generate_video_veo_handler(prompt: str) -> str:
    try:
        logger.info(f"Received video generation request with prompt: {prompt}")
        
        client = genai.Client(vertexai=True, project=PROJECT_ID, location=DEFAULT_LOCATION)
        video_model = DEFAULT_MODEL_NAME

        aspect_ratio = "16:9"
        output_gcs = DEFAULT_GCP_BUCKET

        operation = client.models.generate_videos(
            model=video_model,
            prompt=prompt,
            config=types.GenerateVideosConfig(
                aspect_ratio=aspect_ratio,
                output_gcs_uri=output_gcs,
                number_of_videos=1,
                duration_seconds=5,
                person_generation="allow",
                enhance_prompt=True,
            ),
        )

        while not operation.done:
            time.sleep(15)
            operation = client.operations.get(operation)
            print(operation)

        if not operation.result.generated_videos:
            reasons = getattr(operation.result, 'rai_media_filtered_reasons', [])
            reason_text = "; ".join(reasons) if reasons else "Unknown reason"
            raise Exception(f"Video generation blocked by safety filters. Reason: {reason_text}")    

        uri = operation.result.generated_videos[0].video.uri
        path = uri.replace("gs://", "", 1)
        return path
        
    except Exception as e:
        logger.error(f"Error generating video: {str(e)}", exc_info=True)
        raise Exception(f"Failed to generate video: {str(e)}")
    

async def generate_video_tavus_handler(
    replica_id: str,
    script: str
) -> str:
    try:
        logger.info(f"Generating Tavus video for replica: {replica_id}")
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": TAVUS_API_KEY
        }
        
        payload = {
            "replica_id": 'rb17cf590e15',
            "script": script
        }
        
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
            video_url = video_data.get("hosted_url")
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