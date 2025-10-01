from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base
import enum

class RoleEnum(str, enum.Enum):
    admin = "admin"
    operator = "operator"

class StatusPermohonanEnum(str, enum.Enum):
    menunggu = "menunggu"
    diproses = "diproses"
    selesai = "selesai"
    ditolak = "ditolak"

class StatusKeberatanEnum(str, enum.Enum):
    menunggu = "menunggu"
    diproses = "diproses"
    selesai = "selesai"
    ditolak = "ditolak"

class KategoriInformasiEnum(str, enum.Enum):
    berkala = "berkala"
    serta_merta = "serta_merta"
    setiap_saat = "setiap_saat"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    nama_lengkap = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.operator)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Permohonan(Base):
    __tablename__ = "permohonan"
    
    id = Column(Integer, primary_key=True, index=True)
    nomor_registrasi = Column(String(50), unique=True, nullable=False, index=True)
    nama_pemohon = Column(String(255), nullable=False)
    alamat = Column(Text, nullable=False)
    email = Column(String(255), nullable=False)
    no_telepon = Column(String(20), nullable=False)
    pekerjaan = Column(String(100), nullable=False)
    file_ktp = Column(String(255), nullable=False)
    rincian_informasi = Column(Text, nullable=False)
    tujuan_penggunaan = Column(Text, nullable=False)
    cara_memperoleh = Column(String(50), nullable=False)
    cara_mendapat_salinan = Column(String(50), nullable=False)
    file_pendukung = Column(String(255))
    status = Column(Enum(StatusPermohonanEnum), nullable=False, default=StatusPermohonanEnum.menunggu)
    tanggal_permohonan = Column(DateTime(timezone=True), server_default=func.now())
    tanggal_diproses = Column(DateTime(timezone=True))
    tanggal_selesai = Column(DateTime(timezone=True))
    file_jawaban = Column(String(255))
    catatan_admin = Column(Text)

class Keberatan(Base):
    __tablename__ = "keberatan"
    
    id = Column(Integer, primary_key=True, index=True)
    permohonan_id = Column(Integer, ForeignKey("permohonan.id"), nullable=False)
    nomor_registrasi_keberatan = Column(String(50), unique=True, nullable=False, index=True)
    alasan_keberatan = Column(Text, nullable=False)
    kasus_posisi = Column(Text, nullable=False)
    file_pendukung = Column(String(255))
    status = Column(Enum(StatusKeberatanEnum), nullable=False, default=StatusKeberatanEnum.menunggu)
    tanggal_keberatan = Column(DateTime(timezone=True), server_default=func.now())
    tanggal_diproses = Column(DateTime(timezone=True))
    tanggal_selesai = Column(DateTime(timezone=True))
    file_jawaban = Column(String(255))
    catatan_admin = Column(Text)
    
    permohonan = relationship("Permohonan")

class InformasiPublik(Base):
    __tablename__ = "informasi_publik"
    
    id = Column(Integer, primary_key=True, index=True)
    judul = Column(String(255), nullable=False)
    kategori = Column(Enum(KategoriInformasiEnum), nullable=False)
    deskripsi = Column(Text)
    file_dokumen = Column(String(255), nullable=False)
    tanggal_upload = Column(DateTime(timezone=True), server_default=func.now())
    jumlah_unduhan = Column(Integer, default=0)

class Berita(Base):
    __tablename__ = "berita"
    
    id = Column(Integer, primary_key=True, index=True)
    judul = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    kategori = Column(String(50), default="Berita")
    konten = Column(Text, nullable=False)
    gambar = Column(String(255))
    penulis = Column(String(100), default="Admin PPID")
    tanggal_publikasi = Column(DateTime(timezone=True), server_default=func.now())
    views = Column(Integer, default=0)

class Galeri(Base):
    __tablename__ = "galeri"
    
    id = Column(Integer, primary_key=True, index=True)
    judul = Column(String(255), nullable=False)
    deskripsi = Column(Text)
    file_gambar = Column(String(255), nullable=False)
    tanggal_upload = Column(DateTime(timezone=True), server_default=func.now())

class FAQ(Base):
    __tablename__ = "faq"
    
    id = Column(Integer, primary_key=True, index=True)
    kategori = Column(String(100), default="Umum")
    pertanyaan = Column(Text, nullable=False)
    jawaban = Column(Text, nullable=False)
    urutan = Column(Integer, default=0)

class Pengaturan(Base):
    __tablename__ = "pengaturan"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Text)
    deskripsi = Column(String(255))

class InformasiDikecualikan(Base):
    __tablename__ = "informasi_dikecualikan"
    
    id = Column(Integer, primary_key=True, index=True)
    judul = Column(String(255), nullable=False)
    dasar_hukum = Column(Text, nullable=False)
    penjelasan = Column(Text, nullable=False)
    tanggal_penetapan = Column(DateTime(timezone=True), server_default=func.now())

class DokumenKhusus(Base):
    __tablename__ = "dokumen_khusus"
    
    id = Column(Integer, primary_key=True, index=True)
    nama_dokumen = Column(String(255), nullable=False)
    jenis_dokumen = Column(String(100), nullable=False)
    file_dokumen = Column(String(255), nullable=False)
    deskripsi = Column(Text)
    tanggal_upload = Column(DateTime(timezone=True), server_default=func.now())
