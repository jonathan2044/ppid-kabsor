from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pathlib import Path
import shutil
from ..database import get_db
from ..models import Galeri
from ..schemas import GaleriResponse
from ..auth import get_current_admin_user

router = APIRouter(prefix="/galeri", tags=["galeri"])

UPLOAD_DIR = Path("client/public/uploads")

def save_upload_file(upload_file: UploadFile, subfolder: str) -> str:
    upload_path = UPLOAD_DIR / subfolder
    upload_path.mkdir(parents=True, exist_ok=True)
    
    file_extension = Path(upload_file.filename).suffix
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    import random
    random_suffix = random.randint(1000, 9999)
    filename = f"{timestamp}_{random_suffix}{file_extension}"
    
    file_path = upload_path / filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return f"/uploads/{subfolder}/{filename}"

@router.post("/upload", response_model=GaleriResponse)
async def upload_galeri(
    judul: str = Form(...),
    deskripsi: Optional[str] = Form(None),
    file_gambar: UploadFile = File(...),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    gambar_path = save_upload_file(file_gambar, "galeri")
    
    new_galeri = Galeri(
        judul=judul,
        deskripsi=deskripsi,
        file_gambar=gambar_path
    )
    
    db.add(new_galeri)
    db.commit()
    db.refresh(new_galeri)
    
    return new_galeri

@router.get("/list", response_model=List[GaleriResponse])
def list_galeri(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    galeri_list = db.query(Galeri).order_by(Galeri.tanggal_upload.desc()).offset(skip).limit(limit).all()
    return galeri_list

@router.get("/{galeri_id}", response_model=GaleriResponse)
def get_galeri(galeri_id: int, db: Session = Depends(get_db)):
    galeri = db.query(Galeri).filter(Galeri.id == galeri_id).first()
    
    if not galeri:
        raise HTTPException(status_code=404, detail="Galeri tidak ditemukan")
    
    return galeri

@router.delete("/{galeri_id}")
def delete_galeri(
    galeri_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    galeri = db.query(Galeri).filter(Galeri.id == galeri_id).first()
    
    if not galeri:
        raise HTTPException(status_code=404, detail="Galeri tidak ditemukan")
    
    db.delete(galeri)
    db.commit()
    
    return {"message": "Galeri berhasil dihapus"}
