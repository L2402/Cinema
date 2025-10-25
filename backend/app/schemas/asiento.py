from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from decimal import Decimal

class AsientoBase(BaseModel):
    numero: Decimal = Field(..., ge=0)
    estado: Optional[str] = Field(None, max_length=50)
    id_sala: Optional[UUID] = None

class AsientoCreate(AsientoBase):
    pass

class AsientoUpdate(BaseModel):
    numero: Optional[Decimal] = Field(None, ge=0)
    estado: Optional[str] = Field(None, max_length=50)
    id_sala: Optional[UUID] = None

class AsientoResponse(AsientoBase):
    id_asiento: UUID
    
    class Config:
        from_attributes = True