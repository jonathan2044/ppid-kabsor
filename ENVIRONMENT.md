# PPID Kabupaten Sorong - Environment Documentation

## 🔧 Environment Configuration

### Automatic Environment Setup
Aplikasi ini sudah dikonfigurasi dengan environment yang konsisten:

```bash
# Python Environment
Virtual Environment: /Users/akazaya/project/ppid-kabsor/backend/venv
Python Version: 3.12+
Database: PostgreSQL (localhost:5432/ppid_kabsor_db)

# Port Configuration  
Backend FastAPI: 8891 (tidak bentrok dengan asset app di 8889)
Frontend Vite: 5173
Database PostgreSQL: 5432

# User Configuration
Database User: akazaya (system user)
Admin User: admin / admin123
```

## 🚀 Quick Commands

### Start Application (Recommended)
```bash
./run.sh           # Auto-check prerequisites + start
```

### Manual Controls
```bash
./start_dev.sh     # Start backend + frontend
./stop_dev.sh      # Stop all servers  
./restart_dev.sh   # Restart all servers
```

### Check Status
```bash
./status.sh        # Show server status
```

## 📂 File Structure

```
/Users/akazaya/project/ppid-kabsor/
├── dev_env.sh          # Environment configuration
├── run.sh              # Quick start script
├── start_dev.sh        # Start development servers
├── stop_dev.sh         # Stop servers
├── restart_dev.sh      # Restart servers
├── backend/
│   ├── venv/           # Python virtual environment
│   ├── run.py          # FastAPI server entry point
│   └── app/            # Application code
├── client/
│   ├── src/            # React frontend code
│   └── node_modules/   # Node.js dependencies
└── .env                # Environment variables
```

## 🔍 Troubleshooting

### Common Issues

1. **Virtual Environment Missing**
   ```bash
   ./setup_backend.sh
   ```

2. **Database Connection Failed**
   ```bash
   ./setup_postgresql.sh
   ```

3. **Port Already in Use**
   ```bash
   ./stop_dev.sh
   sleep 2
   ./start_dev.sh
   ```

4. **Node Modules Missing**
   ```bash
   npm install
   ```

## 📝 Environment Variables

File `dev_env.sh` contains all environment configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `BACKEND_PORT`: 8891
- `PYTHON_ENV_PATH`: Path to virtual environment
- Color codes for terminal output

## ✅ Prerequisites Check

Script `run.sh` automatically checks:
- Python virtual environment exists
- Database connection working
- Node.js dependencies installed
- All required services running

**💡 Tip: Use `./run.sh` for hassle-free startup!**