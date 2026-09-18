# PPID Kabupaten Sorong - Development Guide

Portal Informasi dan Dokumentasi (PPID) Kabupaten Sorong adalah aplikasi web untuk transparansi informasi publik.

## 🚀 Quick Start

### 1. Setup Database
```bash
# Setup database dan dependencies
./setup_db.sh
```

### 2. Konfigurasi Environment
```bash
# Edit file .env sesuai kebutuhan
cp .env.example .env
nano .env  # atau gunakan editor favorit Anda
```

### 3. Jalankan Development Server
```bash
# Mulai backend (port 8891) dan frontend
./start_dev.sh
```

### 4. Akses Aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8891 (tidak bentrok dengan asset app di 8889)
- **API Documentation**: http://localhost:8891/docs

## 🔄 Management Commands

### Restart Development Servers
```bash
./restart_dev.sh
```

### Stop Development Servers
```bash
./stop_dev.sh
```

## 🗄️ Database Configuration (PostgreSQL Required)

### Local PostgreSQL (Development & Production)
```env
DATABASE_URL=postgresql://ppid_user:ppid_password@localhost:5432/ppid_kabsor_db
```

### Cloud PostgreSQL (Neon, Supabase, etc.)
```env
DATABASE_URL=postgresql://username:password@host.region.neon.tech/database?sslmode=require
```

### Setup PostgreSQL
```bash
# Auto setup PostgreSQL database
./setup_postgresql.sh

# Manual setup
createuser -U postgres ppid_user
createdb -U postgres -O ppid_user ppid_kabsor_db
```

## 📂 Project Structure

```
ppid-kabsor/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── main.py      # FastAPI application
│   │   ├── database.py  # Database configuration
│   │   ├── models.py    # SQLAlchemy models
│   │   ├── auth.py      # Authentication
│   │   └── routers/     # API endpoints
│   ├── run.py           # Server runner
│   └── requirements.txt # Python dependencies
├── client/              # React Frontend
│   └── src/
├── shared/              # Shared schemas
├── server/              # Node.js server (optional)
├── start_dev.sh         # Start development servers
├── restart_dev.sh       # Restart servers
├── stop_dev.sh          # Stop servers
├── setup_db.sh          # Database setup
└── .env.example         # Environment template
```

## 🔑 Default Admin Account

Setelah setup database, buat admin account:

```python
# Jalankan di Python console atau buat script
from backend.app.database import SessionLocal
from backend.app.models import User, RoleEnum
from backend.app.auth import get_password_hash

db = SessionLocal()
admin_user = User(
    username="admin",
    email="admin@sorongkab.go.id",
    password=get_password_hash("admin123"),
    nama_lengkap="Administrator PPID",
    role=RoleEnum.admin
)
db.add(admin_user)
db.commit()
```

## 📋 Features

- ✅ **Permohonan Informasi**: Sistem permohonan informasi publik
- ✅ **Tracking**: Pelacakan status permohonan
- ✅ **Berita**: Manajemen berita dan pengumuman
- ✅ **Galeri**: Galeri foto kegiatan
- ✅ **FAQ**: Frequently Asked Questions
- ✅ **Informasi Publik**: Dokumen berkala, serta merta, setiap saat
- ✅ **Dashboard Admin**: Panel administrasi lengkap
- ✅ **Statistics**: Dashboard statistik real-time
- ✅ **Authentication**: Sistem login admin/operator
- ✅ **File Upload**: Upload dokumen dan gambar

## 🛠️ Development

### Backend Development
```bash
cd backend
source venv/bin/activate  # Jika menggunakan virtual environment
python run.py
```

### Frontend Development
```bash
cd client
npm run dev
```

### Database Migrations
Jika melakukan perubahan model database:
```bash
cd backend
python -c "from app.database import engine, Base; from app import models; Base.metadata.create_all(bind=engine)"
```

## 🔧 Troubleshooting

### Port Sudah Digunakan
```bash
# Kill proses yang menggunakan port 8889
sudo lsof -ti:8889 | xargs kill -9
```

### Database Connection Error
1. Pastikan DATABASE_URL benar di file .env
2. Untuk PostgreSQL, pastikan service berjalan
3. Untuk SQLite, file akan dibuat otomatis

### Permission Denied pada Script
```bash
chmod +x *.sh
```

## 📞 Support

Untuk bantuan teknis, hubungi tim pengembang atau buat issue di repository ini.