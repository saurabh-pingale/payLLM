from typing import Optional
from external_api_services import generate_video_veo_handler, generate_video_tavus_handler

class VideoGenerationService:
    def __init__(self):
        pass

    async def generate_video_veo_service(self, prompt: str) -> str:
        return await generate_video_veo_handler(prompt=prompt)
    
    async def generate_video_tavus_service(
        self,
        replica_id: str,
        script: str,
        callback_url: Optional[str] = None
    ) -> str:
        return await generate_video_tavus_handler(
            replica_id=replica_id,
            script=script,
            callback_url=callback_url
        )