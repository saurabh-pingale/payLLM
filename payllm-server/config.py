import os
from dotenv import load_dotenv

load_dotenv()

#VERTEX
PROJECT_ID=os.environ.get("GOOGLE_CLOUD_PROJECT")
DEFAULT_GCP_BUCKET_NAME=os.environ.get("DEFAULT_GCP_BUCKET_NAME")
DEFAULT_GCP_BUCKET=os.environ.get("DEFAULT_GCP_BUCKET")

#TAVUS
TAVUS_API_KEY = os.environ.get("TAVUS_API_KEY")