import os
from dotenv import load_dotenv

load_dotenv()

#VERTEX
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT")
creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

#TAVUS
TAVUS_API_KEY = os.environ.get("TAVUS_API_KEY")