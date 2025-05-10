import os
from dotenv import load_dotenv

load_dotenv()

def check_environment():
    """Check if required environment variables are set"""
    from dotenv import load_dotenv
    load_dotenv(override=True)
    
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    
    if not project_id:
        raise ValueError("GOOGLE_CLOUD_PROJECT must be set in .env file")
    
    if creds_path:
        if not os.path.exists(creds_path):
            raise ValueError(f"Credentials file not found at: {creds_path}")
    else:
        default_path = os.path.expanduser("~/.config/gcloud/application_default_credentials.json")
        if os.path.exists(default_path):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = default_path
        else:
            raise ValueError(
                "No credentials found. Please either:\n"
                "1. Set GOOGLE_APPLICATION_CREDENTIALS in .env\n"
                "2. Run: gcloud auth application-default login"
            )