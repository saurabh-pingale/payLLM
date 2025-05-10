from typing import Optional
from handlers import generate_video_handler, generate_tavus_video_handler

class VideoGenerationService:
    def __init__(self):
        pass

    async def generate_video_handler(self, prompt: str) -> str:
        return await generate_video_handler(prompt=prompt)
    
    async def generate_tavus_video(
        self,
        replica_id: str,
        script: str,
        callback_url: Optional[str] = None
    ) -> str:
        return await generate_tavus_video_handler(
            replica_id=replica_id,
            script=script,
            callback_url=callback_url
        )