from pydantic import BaseModel

class VideoGenerationRequest(BaseModel):
    prompt: str
    
    class Config:
        protected_namespaces = ()

class TavusVideoRequest(BaseModel):
    replica_id: str
    script: str
    
    class Config:
        protected_namespaces = ()
