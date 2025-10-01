from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pathlib import Path
import shutil
from ..database import get_db
from ..models import InformasiPublik, KategoriInformasiEnum
from ..schemas import InformasiPublikResponse
from ..auth import get_current_admin_user

router = APIRouter(prefix="/api/informasi-publik", tags=["informasi_publik"])

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

@router.post("/upload", response_model=InformasiPublikResponse)
async def upload_informasi(
    judul: str = Form(...),
    kategori: KategoriInformasiEnum = Form(...),
    deskripsi: Optional[str] = Form(None),
    file_dokumen: UploadFile = File(...),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    dokumen_path = save_upload_file(file_dokumen, "dokumen")
    
    new_informasi = InformasiPublik(
        judul=judul,
        kategori=kategori,
        deskripsi=deskripsi,
        file_dokumen=dokumen_path,
        jumlah_unduhan=0
    )
    
    db.add(new_informasi)
    db.commit()
    db.refresh(new_informasi)
    
    return new_informasi

@router.get("/list", response_model=List[InformasiPublikResponse])
def list_informasi(
    kategori: Optional[KategoriInformasiEnum] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(InformasiPublik)
    
    if kategori:
        query = query.filter(InformasiPublik.kategori == kategori)
    
    informasi_list = query.order_by(InformasiPublik.tanggal_upload.desc()).offset(skip).limit(limit).all()
    return informasi_list

@router.get("/{informasi_id}", response_model=InformasiPublikResponse)
def get_informasi(informasi_id: int, db: Session = Depends(get_db)):
    informasi = db.query(InformasiPublik).filter(InformasiPublik.id == informasi_id).first()
    
    if not informasi:
        raise HTTPException(status_code=404, detail="Informasi tidak ditemukan")
    
    informasi.jumlah_unduhan += 1
    db.commit()
    db.refresh(informasi)
    
    return informasi

@router.delete("/{informasi_id}")
def delete_informasi(
    informasi_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    informasi = db.query(InformasiPublik).filter(InformasiPublik.id == informasi_id).first()
    
    if not informasi:
        raise HTTPException(status_code=404, detail="Informasi tidak ditemukan")
    
    db.delete(informasi)
    db.commit()
    
    return {"message": "Informasi berhasil dihapus"}
