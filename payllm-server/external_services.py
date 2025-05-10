import uuid
from google.cloud import storage
from google.cloud import aiplatform

class ExternalVideoGenerationService:
    def __init__(self, project_id: str, location: str):
        """
        Initialize the External Video Generation Service

        Args:
            project_id: Google Cloud project ID
            location: Google Cloud region
        """
        self.project_id = project_id
        self.location = location
        aiplatform.init(
            project=self.project_id, 
            location=self.location
        )

    def generate_video_with_vertex_ai(self, prompt: str, model_name: str) -> str:
        """Generate video using Vertex AI SDK approach"""
        model_resource_name = (
            f"projects/{self.project_id}/locations/{self.location}/publishers/google/models/{model_name}"
        )

        model = aiplatform.Model(model_name=model_resource_name)

        instances = [
            {
                "prompt": prompt,
                "sampleCount": 1
            }
        ]

        response = model.predict(instances=instances)

        if hasattr(response, "predictions") and response.predictions:
            if "videoUri" in response.predictions[0]:
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