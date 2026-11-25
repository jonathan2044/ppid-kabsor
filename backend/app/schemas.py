from pydantic import BaseModel, EmailStr, Field
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

USERNAME_POLA = r"^[a-z0-9._-]{3,50}$"
PASSWORD_MIN = 10


class UserCreate(BaseModel):
    username: str = Field(pattern=USERNAME_POLA)
    email: EmailStr
    password: str = Field(min_length=PASSWORD_MIN, max_length=128)
    nama_lengkap: str = Field(min_length=3, max_length=255)
    role: RoleEnum = RoleEnum.operator

class UserUpdate(BaseModel):
    """Perubahan data pengguna oleh admin. Field yang tidak dikirim tidak diubah."""
    email: Optional[EmailStr] = None
    nama_lengkap: Optional[str] = Field(default=None, min_length=3, max_length=255)
    role: Optional[RoleEnum] = None
    is_active: Optional[bool] = None

class UserLogin(BaseModel):
    username: str
    password: str

class PasswordChange(BaseModel):
    """Ganti password sendiri; password lama wajib untuk mencegah penyalahgunaan sesi."""
    password_lama: str
    password_baru: str = Field(min_length=PASSWORD_MIN, max_length=128)

class PasswordReset(BaseModel):
    """Admin menyetel ulang password pengguna lain."""
    password_baru: str = Field(min_length=PASSWORD_MIN, max_length=128)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    nama_lengkap: str
    role: RoleEnum
    is_active: bool
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
