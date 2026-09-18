from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional
from enum import Enum

class RoleEnum(str, Enum):
    admin = "admin"
    operator = "operator"

class StatusPermohonanEnum(str, Enum):
    menunggu = "menunggu"
    diproses = "diproses"
    selesai = "selesai"
    ditolak = "ditolak"

class StatusKeberatanEnum(str, Enum):
    menunggu = "menunggu"
    diproses = "diproses"
    selesai = "selesai"
    ditolak = "ditolak"

class KategoriInformasiEnum(str, Enum):
    berkala = "berkala"
    serta_merta = "serta_merta"
    setiap_saat = "setiap_saat"
    dikecualikan = "dikecualikan"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    nama_lengkap: str
    role: RoleEnum = RoleEnum.operator

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    nama_lengkap: str
    role: RoleEnum
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class PermohonanCreate(BaseModel):
    nama_pemohon: str
    alamat: str
    email: EmailStr
    no_telepon: str
    pekerjaan: str
    rincian_informasi: str
    tujuan_penggunaan: str
    cara_memperoleh: str
    cara_mendapat_salinan: str

class PermohonanResponse(BaseModel):
    id: int
    nomor_registrasi: str
    nama_pemohon: str
    alamat: str
    email: str
    no_telepon: str
    pekerjaan: str
    file_ktp: str
    rincian_informasi: str
    tujuan_penggunaan: str
    cara_memperoleh: str
    cara_mendapat_salinan: str
    file_pendukung: Optional[str]
    status: StatusPermohonanEnum
    tanggal_permohonan: datetime
    tanggal_diproses: Optional[datetime]
    tanggal_selesai: Optional[datetime]
    file_jawaban: Optional[str]
    catatan_admin: Optional[str]

    class Config:
        from_attributes = True

class KeberatanCreate(BaseModel):
    permohonan_id: int
    alasan_keberatan: str
    kasus_posisi: str

class KeberatanResponse(BaseModel):
    id: int
    permohonan_id: int
    nomor_registrasi_keberatan: str
    alasan_keberatan: str
    kasus_posisi: str
    file_pendukung: Optional[str]
    status: StatusKeberatanEnum
    tanggal_keberatan: datetime
    tanggal_diproses: Optional[datetime]
    tanggal_selesai: Optional[datetime]
    file_jawaban: Optional[str]
    catatan_admin: Optional[str]

    class Config:
        from_attributes = True

class InformasiPublikCreate(BaseModel):
    judul: str
    kategori: KategoriInformasiEnum
    deskripsi: Optional[str]

class InformasiPublikResponse(BaseModel):
    id: int
    judul: str
    kategori: KategoriInformasiEnum
    deskripsi: Optional[str]
    file_dokumen: str
    tanggal_upload: datetime
    jumlah_unduhan: int

    class Config:
        from_attributes = True

class BeritaCreate(BaseModel):
    judul: str
    konten: str

class BeritaResponse(BaseModel):
    id: int
    judul: str
    slug: str
    kategori: Optional[str]
    konten: str
    gambar: Optional[str]
    penulis: Optional[str]
    tanggal_publikasi: datetime
    views: int

    class Config:
        from_attributes = True

class GaleriCreate(BaseModel):
    judul: str
    deskripsi: Optional[str]

class GaleriResponse(BaseModel):
    id: int
    judul: str
    deskripsi: Optional[str]
    file_gambar: str
    tanggal_upload: datetime

    class Config:
        from_attributes = True

class FAQCreate(BaseModel):
    pertanyaan: str
    jawaban: str
    kategori: str = "Umum"
    urutan: int = 0

class FAQResponse(BaseModel):
    id: int
    pertanyaan: str
    jawaban: str
    kategori: Optional[str]
    urutan: int

    class Config:
        from_attributes = True

class PengaturanUpdate(BaseModel):
    value: str

class PengaturanResponse(BaseModel):
    id: int
    key: str
    value: Optional[str]
    deskripsi: Optional[str]

    class Config:
        from_attributes = True

class HeroUpdate(BaseModel):
    title: str
    subtitle: str
    bg_image: str

class KontakUpdate(BaseModel):
    alamat: str
    telepon: str
    fax: str
    email: str
    jam_senin_kamis: str
    jam_jumat: str

class ProfilUpdate(BaseModel):
    tentang: str
    visi: str
    misi: List[str]
    tugas_pokok: str
    fungsi: List[str]

class InformasiDikecualikanCreate(BaseModel):
    judul: str
    dasar_hukum: str
    penjelasan: str

class InformasiDikecualikanResponse(BaseModel):
    id: int
    judul: str
    dasar_hukum: str
    penjelasan: str
    tanggal_penetapan: datetime

    class Config:
        from_attributes = True

class DokumenKhususCreate(BaseModel):
    nama_dokumen: str
    jenis_dokumen: str
    deskripsi: Optional[str]

class DokumenKhususResponse(BaseModel):
    id: int
    nama_dokumen: str
    jenis_dokumen: str
    file_dokumen: str
    deskripsi: Optional[str]
    tanggal_upload: datetime

    class Config:
        from_attributes = True
