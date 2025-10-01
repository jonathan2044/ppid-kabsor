# Cara Menjalankan Backend FastAPI

Untuk development, jalankan perintah ini di terminal terpisah:

```bash
cd backend && python run.py
```

Backend akan jalan di http://localhost:8000
Frontend proxy akan forward /api/* ke backend

Atau jalankan script ini:
```bash
./backend/start_backend.sh
```

## Untuk Production/VPS

Gunakan systemd service atau supervisor untuk menjalankan backend:
```
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Dan configure Nginx untuk proxy:
```nginx
location /api/ {
    proxy_pass http://localhost:8000;
}
```
