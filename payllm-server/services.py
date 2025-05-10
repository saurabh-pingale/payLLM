import os
from typing import Optional
import uuid
from google.cloud import storage
from google.cloud import aiplatform

class VideoGenerationService:
    def __init__(
        self,
        project_id: Optional[str] = None,
        location: str = "us-central1",
        model_name: str = "videogeneration@001",
    ):
        """
        Initialize the Video Generation Service

        Args:
            project_id: Google Cloud project ID (if None, will use environment variable)
            location: Google Cloud region
            model_name: Vertex AI model name for video generation
        """
        self.project_id = project_id or os.environ.get("GOOGLE_CLOUD_PROJECT")
        self.location = location
        self.model_name = model_name

        if not self.project_id:
            raise ValueError("GOOGLE_CLOUD_PROJECT must be provided")

        print(f"Project ID: {self.project_id}")
        aiplatform.init(
            project=self.project_id, 
            location="asia_southeast1"
        )

    def generate_video(self, prompt: str) -> str:
        """
        Generate a video from the given prompt

        Args:
            prompt: Text prompt for video generation

        Returns:
            URL of the generated video
        """
        return self._generate_video_with_vertex_ai(prompt)

    def _generate_video_with_vertex_ai(self, prompt: str) -> str:
        """Generate video using Vertex AI SDK approach"""
        
        model_resource_name = (
            f"projects/{self.project_id}/locations/{self.location}/publishers/google/models/{self.model_name}"
        )

        # Load the publisher model correctly
        model = aiplatform.Model(model_name=model_resource_name)

        # Prepare the instances for prediction
        instances = [
            {
                "prompt": prompt,
                "sampleCount": 1
            }
        ]

        # Call the predict method
        response = model.predict(instances=instances)

        if hasattr(response, "predictions") and response.predictions:
            if "videoUri" in response.predictions[0]:  # updated key per docs
                return response.predictions[0]["videoUri"]
            else:
                raise Exception("videoUri not found in prediction")
        else:
            raise Exception("No predictions in response")

    def upload_to_storage(self, video_data: bytes, bucket_name: str) -> str:
        """
        Upload video data to Google Cloud Storage

        Args:
            video_data: Binary video data
            bucket_name: GCS bucket name

        Returns:
            Public URL of the uploaded video
        """
        client = storage.Client(project=self.project_id)
        bucket = client.bucket(bucket_name)

        # Generate a unique filename
        filename = f"generated_videos/{uuid.uuid4()}.mp4"
        blob = bucket.blob(filename)

        # Upload the video
        blob.upload_from_string(video_data, content_type="video/mp4")

        # Make it publicly accessible
        blob.make_public()

        # Return the public URL
        return blob.public_url