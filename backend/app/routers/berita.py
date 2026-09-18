from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pathlib import Path
import shutil
import re
from ..database import get_db
from ..models import Berita
from ..schemas import BeritaResponse
from ..auth import get_current_admin_user

router = APIRouter(prefix="/berita", tags=["berita"])

UPLOAD_DIR = Path("client/public/uploads")

def generate_slug(judul: str) -> str:
    slug = judul.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')

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

@router.post("/create", response_model=BeritaResponse)
async def create_berita(
    judul: str = Form(...),
    konten: str = Form(...),
    kategori: Optional[str] = Form(None),
    penulis: Optional[str] = Form(None),
    gambar: Optional[UploadFile] = File(None),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    slug = generate_slug(judul)
    
    existing_berita = db.query(Berita).filter(Berita.slug == slug).first()
    if existing_berita:
        import random
        slug = f"{slug}-{random.randint(1000, 9999)}"
    
    gambar_path = None
    if gambar and gambar.filename:
        gambar_path = save_upload_file(gambar, "berita")
    
    new_berita = Berita(
        judul=judul,
        slug=slug,
        konten=konten,
        gambar=gambar_path,
        views=0
    )
    if kategori:
        new_berita.kategori = kategori
    if penulis:
        new_berita.penulis = penulis

    db.add(new_berita)
    db.commit()
    db.refresh(new_berita)
    
    return new_berita

@router.get("/list", response_model=List[BeritaResponse])
def list_berita(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    berita_list = db.query(Berita).order_by(Berita.tanggal_publikasi.desc()).offset(skip).limit(limit).all()
    return berita_list

@router.get("/{slug}", response_model=BeritaResponse)
def get_berita(slug: str, db: Session = Depends(get_db)):
    berita = db.query(Berita).filter(Berita.slug == slug).first()
    
    if not berita:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    
    berita.views += 1
    db.commit()
    db.refresh(berita)
    
    return berita

@router.put("/{berita_id}", response_model=BeritaResponse)
async def update_berita(
    berita_id: int,
    judul: str = Form(...),
    konten: str = Form(...),
    kategori: Optional[str] = Form(None),
    penulis: Optional[str] = Form(None),
    gambar: Optional[UploadFile] = File(None),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    berita = db.query(Berita).filter(Berita.id == berita_id).first()

    if not berita:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")

    # Slug tidak diubah agar tautan berita yang sudah tersebar tetap valid
    berita.judul = judul
    berita.konten = konten
    if kategori:
        berita.kategori = kategori
    if penulis:
        berita.penulis = penulis
    if gambar and gambar.filename:
        berita.gambar = save_upload_file(gambar, "berita")

    db.commit()
    db.refresh(berita)

    return berita

@router.delete("/{berita_id}")
def delete_berita(
    berita_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    berita = db.query(Berita).filter(Berita.id == berita_id).first()
    
    if not berita:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    
    db.delete(berita)
    db.commit()
    
    return {"message": "Berita berhasil dihapus"}
