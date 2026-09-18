# PPID Kabupaten Sorong - Setup Summary

## ✅ Yang Telah Dibuat

### 🛠️ Scripts Management
- `setup.sh` - Setup lengkap (PostgreSQL + Backend + Frontend)
- `setup_postgresql.sh` - Setup PostgreSQL database dan user
- `setup_backend.sh` - Setup Python backend dan virtual environment
- `start_dev.sh` - Mulai development servers
- `stop_dev.sh` - Stop development servers  
- `restart_dev.sh` - Restart development servers
- `status.sh` - Cek status sistem dan port

### ⚙️ Konfigurasi
- `.env.example` - Template environment variables
- `backend/requirements.txt` - Python dependencies
- `README_DEV.md` - Dokumentasi development

### 🔧 Port Configuration
- **Backend FastAPI**: Port **8891** (tidak bentrok dengan asset app di 8889)
- **Frontend Vite**: Port 5173 (default)
- **Database PostgreSQL**: Port 5432 (default)

### 🗄️ Database Setup
- PostgreSQL sebagai database standar
- Database: `ppid_kabsor_db`
- User: `ppid_user` 
- Password: `ppid_password`
- Auto-create tables dan default admin user

## 🚀 Cara Penggunaan

### Setup Awal (Sekali Saja)
```bash
# Setup lengkap otomatis
./setup.sh

# Atau setup manual step by step:
./setup_postgresql.sh  # Setup PostgreSQL
./setup_backend.sh     # Setup Python backend
```

### Development Sehari-hari
```bash
# Start development servers
./start_dev.sh

# Cek status
./status.sh

# Restart jika ada perubahan
./restart_dev.sh

# Stop servers
./stop_dev.sh
```

## 🔗 Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8891
- **API Documentation**: http://localhost:8891/docs

## 👤 Default Admin
- **Username**: admin
- **Password**: admin123
- **Email**: admin@sorongkab.go.id

## 📋 Environment Variables (.env)
```env
DATABASE_URL=postgresql://ppid_user:ppid_password@localhost:5432/ppid_kabsor_db
BACKEND_PORT=8891
SESSION_SECRET=ppid-kabsor-2024-secret-key
VITE_API_BASE_URL=http://localhost:8891
```

## 🎯 Next Steps
1. Jalankan `./setup.sh` untuk setup lengkap
2. Jalankan `./start_dev.sh` untuk mulai development
3. Akses http://localhost:8891/docs untuk lihat API
4. Login ke admin panel dengan credentials di atas

Semua script sudah dibuat executable dan siap digunakan! 🎉