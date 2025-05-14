from google.cloud import storage
from datetime import timedelta
from external_api_services import generate_video_veo_handler, generate_video_tavus_handler, generate_response_from_claude_handler

class VideoGenerationService:
    def __init__(self):
        pass

    async def generate_video_veo_service(self, prompt: str) -> str:
        return await generate_video_veo_handler(prompt=prompt)

    def generate_signed_url(self, bucket_name, blob_name, expiration_minutes=60):
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)

        if not blob.exists():
            raise FileNotFoundError(f"The blob '{blob_name}' does not exist in bucket '{bucket_name}'.")

        url = blob.generate_signed_url(
            expiration=timedelta(minutes=expiration_minutes),
            method="GET"
        )
        return url

    
    async def generate_video_tavus_service(
        self,
        replica_id: str,
        script: str,
    ) -> str:
        return await generate_video_tavus_handler(
            replica_id=replica_id,
            script=script
        )

    async def generate_response_from_claude_service(self, query: str) -> str:
        return await generate_response_from_claude_handler(query=query)