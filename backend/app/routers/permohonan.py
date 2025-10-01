from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import shutil
from pathlib import Path
from ..database import get_db
from ..models import Permohonan, StatusPermohonanEnum
from ..schemas import PermohonanResponse
from ..auth import get_current_admin_user

router = APIRouter(prefix="/api/permohonan", tags=["permohonan"])

UPLOAD_DIR = Path("client/public/uploads")

def generate_nomor_registrasi():
    from datetime import datetime
    import random
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_suffix = random.randint(1000, 9999)
    return f"PPID-{timestamp}-{random_suffix}"

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

@router.post("/submit", response_model=PermohonanResponse)
async def submit_permohonan(
    nama_pemohon: str = Form(...),
    alamat: str = Form(...),
    email: str = Form(...),
    no_telepon: str = Form(...),
    pekerjaan: str = Form(...),
    rincian_informasi: str = Form(...),
    tujuan_penggunaan: str = Form(...),
    cara_memperoleh: str = Form(...),
    cara_mendapat_salinan: str = Form(...),
    file_ktp: UploadFile = File(...),
    file_pendukung: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    nomor_registrasi = generate_nomor_registrasi()
    
    ktp_path = save_upload_file(file_ktp, "ktp")
    
    pendukung_path = None
    if file_pendukung:
        pendukung_path = save_upload_file(file_pendukung, "dokumen")
    
    new_permohonan = Permohonan(
        nomor_registrasi=nomor_registrasi,
        nama_pemohon=nama_pemohon,
        alamat=alamat,
        email=email,
        no_telepon=no_telepon,
        pekerjaan=pekerjaan,
        file_ktp=ktp_path,
        rincian_informasi=rincian_informasi,
        tujuan_penggunaan=tujuan_penggunaan,
        cara_memperoleh=cara_memperoleh,
        cara_mendapat_salinan=cara_mendapat_salinan,
        file_pendukung=pendukung_path,
        status=StatusPermohonanEnum.menunggu
    )
    
    db.add(new_permohonan)
    db.commit()
    db.refresh(new_permohonan)
    
    return new_permohonan

@router.get("/track/{nomor_registrasi}", response_model=PermohonanResponse)
def track_permohonan(nomor_registrasi: str, db: Session = Depends(get_db)):
    permohonan = db.query(Permohonan).filter(
        Permohonan.nomor_registrasi == nomor_registrasi
    ).first()
    
    if not permohonan:
        raise HTTPException(status_code=404, detail="Permohonan tidak ditemukan")
    
    return permohonan

@router.get("/list", response_model=List[PermohonanResponse])
def list_permohonan(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    query = db.query(Permohonan)
    
    if status:
        query = query.filter(Permohonan.status == status)
    
    permohonan_list = query.order_by(Permohonan.tanggal_permohonan.desc()).offset(skip).limit(limit).all()
    return permohonan_list

@router.put("/{permohonan_id}/update-status")
def update_permohonan_status(
    permohonan_id: int,
    status: StatusPermohonanEnum,
    catatan_admin: Optional[str] = None,
    file_jawaban: Optional[UploadFile] = File(None),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    permohonan = db.query(Permohonan).filter(Permohonan.id == permohonan_id).first()
    
    if not permohonan:
        raise HTTPException(status_code=404, detail="Permohonan tidak ditemukan")
    
    permohonan.status = status
    
    if status == StatusPermohonanEnum.diproses:
        permohonan.tanggal_diproses = datetime.now()
    elif status in [StatusPermohonanEnum.selesai, StatusPermohonanEnum.ditolak]:
        permohonan.tanggal_selesai = datetime.now()
    
    if catatan_admin:
        permohonan.catatan_admin = catatan_admin
    
    if file_jawaban:
        jawaban_path = save_upload_file(file_jawaban, "jawaban")
        permohonan.file_jawaban = jawaban_path
    
    db.commit()
    db.refresh(permohonan)
    
    return permohonan
