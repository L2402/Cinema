from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class IncidenciaBase(BaseModel):
    fecha_generacion: datetime
    id_usuario: Optional[UUID] = None

class IncidenciaCreate(IncidenciaBase):
    pass

class IncidenciaUpdate(BaseModel):
    fecha_generacion: Optional[datetime] = None
    id_usuario: Optional[UUID] = None

class IncidenciaResponse(IncidenciaBase):
    id_incidencia: UUID
    
    class Config:
        from_attributes = True