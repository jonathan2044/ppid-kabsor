# Deployment Produksi - ppid.sorongkab.go.id

VPS Ubuntu 22.04 (zona waktu WIT), login SSH sebagai `ubuntu` memakai key. Alamatnya sengaja tidak ditulis di
repo ini karena repo publik dan IP origin harus tetap tersembunyi di balik Cloudflare. Simpan `ubuntu@<ip-vps>`
di `deploy/server.local` (sudah di-ignore git); file ini dibaca oleh `deploy.sh`.

```
Cloudflare --> Nginx :80/:443 --> /                dist/public (hasil vite build)
                                  /api/*          uvicorn 127.0.0.1:8891 (prefix /api dibuang)
                                  /uploads/*      client/public/uploads (file unggahan)
                                  uvicorn (service ppid-backend, user ppid) --> PostgreSQL 14 (localhost)
```

| Lokasi di VPS | Isi |
|---|---|
| `/var/www/ppid-kabsor/backend` | kode FastAPI (dikirim oleh `deploy.sh`) |
| `/var/www/ppid-kabsor/dist/public` | frontend hasil build |
| `/var/www/ppid-kabsor/client/public/uploads` | file unggahan - **data, jangan dihapus** |
| `/var/www/ppid-kabsor/venv` | virtualenv Python |
| `/etc/ppid-kabsor/backend.env` | `DATABASE_URL` & `SESSION_SECRET` (root, 600) |
| `/etc/nginx/sites-available/ppid-kabsor` | konfigurasi Nginx (sumber: `deploy/nginx/`) |
| `/etc/systemd/system/ppid-backend.service` | service backend (sumber: `deploy/systemd/`) |

## Deploy perubahan

Dari root repo di Mac:

```bash
./deploy/deploy.sh
```

Skrip ini mem-build frontend, mengirim `backend/`, `dist/public/`, dan `deploy/` via rsync, memasang dependency
Python sesuai `backend/constraints.txt`, lalu me-restart backend. Tidak perlu password sudo.
Script data contoh (`backend/insert_*.py`, `update_enum.py`) sengaja tidak dikirim ke server.

Perubahan pada `deploy/nginx/` atau `deploy/systemd/` baru berlaku setelah menjalankan ulang setup di VPS
(butuh password sudo): `sudo bash /var/www/ppid-kabsor/deploy/server-setup.sh`.

## Perintah di VPS

```bash
journalctl -u ppid-backend -f                  # log backend
sudo systemctl restart ppid-backend            # restart backend
sudo tail -f /var/log/nginx/error.log          # log Nginx
sudo bash /var/www/ppid-kabsor/deploy/set-admin-password.sh [username]   # ganti password CMS
sudo -u postgres pg_dump -Fc ppid_kabsor_db > ppid-$(date +%F).dump      # backup database
```

## SSL

Domain di-proxy Cloudflare. Sebelum DNS diarahkan, Nginx memakai sertifikat self-signed (cukup untuk
Cloudflare mode SSL *Full*). Setelah record `A ppid` di Cloudflare mengarah ke IP VPS:

```bash
sudo bash /var/www/ppid-kabsor/deploy/enable-ssl.sh [email-notifikasi]
```

Setelah itu mode SSL Cloudflare bisa dinaikkan ke *Full (strict)*. Perpanjangan otomatis lewat `certbot.timer`.
Origin sengaja tidak me-redirect HTTP ke HTTPS (sudah dilakukan Cloudflare) agar tidak terjadi redirect loop.

## Catatan keamanan

- `POST /api/auth/register` diblokir di Nginx: endpoint ini tidak butuh login dan menerima `role: "admin"`.
- `/api/docs`, `/api/redoc`, `/api/openapi.json` diblokir di produksi.
- File di `/uploads/` selain gambar/PDF dikirim sebagai `application/octet-stream` (dipaksa unduh) untuk
  mencegah XSS lewat file unggahan.
- Firewall UFW hanya membuka SSH, 80, 443. PostgreSQL dan uvicorn hanya mendengar di localhost.
