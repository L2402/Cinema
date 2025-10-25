from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Incidencia
from app.schemas import IncidenciaCreate, IncidenciaUpdate, IncidenciaResponse
from app.utils.dependencies import get_or_404

router = APIRouter()

@router.post("/incidencias", response_model=IncidenciaResponse, status_code=status.HTTP_201_CREATED)
def create_incidencia(incidencia: IncidenciaCreate, db: Session = Depends(get_db)):
    """Crear una nueva incidencia"""
    db_incidencia = Incidencia(**incidencia.model_dump())
    db.add(db_incidencia)
    db.commit()
    db.refresh(db_incidencia)
    return db_incidencia

@router.get("/incidencias", response_model=List[IncidenciaResponse])
def get_incidencias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener lista de incidencias"""
    incidencias = db.query(Incidencia).offset(skip).limit(limit).all()
    return incidencias

@router.get("/incidencias/{id_incidencia}", response_model=IncidenciaResponse)
def get_incidencia(id_incidencia: str, db: Session = Depends(get_db)):
    """Obtener una incidencia por ID"""
    incidencia = get_or_404(db, Incidencia, Incidencia.id_incidencia, id_incidencia, "incidencia")
    return incidencia

@router.put("/incidencias/{id_incidencia}", response_model=IncidenciaResponse)
def update_incidencia(
    id_incidencia: str,
    incidencia_update: IncidenciaUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar una incidencia"""
    incidencia = get_or_404(db, Incidencia, Incidencia.id_incidencia, id_incidencia, "incidencia")
    
    update_data = incidencia_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(incidencia, field, value)
    
    db.commit()
    db.refresh(incidencia)
    return incidencia

@router.delete("/incidencias/{id_incidencia}", status_code=status.HTTP_204_NO_CONTENT)
def delete_incidencia(id_incidencia: str, db: Session = Depends(get_db)):
    """Eliminar una incidencia"""
    incidencia = get_or_404(db, Incidencia, Incidencia.id_incidencia, id_incidencia, "incidencia")
    db.delete(incidencia)
    db.commit()
    return None