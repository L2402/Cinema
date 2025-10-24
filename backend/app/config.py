from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: str = '["http://localhost:3000"]'
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Cinema REST API"
    DEBUG: bool = True
    
    @property
    def origins_list(self) -> List[str]:
        """Convierte string JSON a lista de origenes permitidos"""
        try:
            return json.loads(self.ALLOWED_ORIGINS)
        except:
            return [self.FRONTEND_URL]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()