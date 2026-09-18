#!/usr/bin/env bash
# Build frontend, kirim kode ke VPS, lalu restart backend. Jalankan dari Mac (root repo):
#   ./deploy/deploy.sh
#   DEPLOY_SERVER=user@host ./deploy/deploy.sh
set -euo pipefail

APP_DIR=/var/www/ppid-kabsor

cd "$(dirname "$0")/.."

# Alamat VPS disimpan di deploy/server.local (tidak di-commit): repo publik,
# sedangkan IP origin harus tetap tersembunyi di balik Cloudflare.
SERVER="${DEPLOY_SERVER:-$(cat deploy/server.local 2>/dev/null || true)}"
[ -n "$SERVER" ] || { echo "Isi deploy/server.local dengan user@ip-vps, atau set DEPLOY_SERVER"; exit 1; }

echo "==> Build frontend"
NODE_ENV=production npx vite build

echo "==> Upload ke $SERVER"
rsync -az --delete --exclude 'server.local' deploy/ "$SERVER:$APP_DIR/deploy/"
# Script data contoh (insert_*.py menghapus berita & informasi publik) tidak ikut ke produksi
rsync -az --delete \
  --exclude 'venv/' --exclude '__pycache__/' --exclude '*.pyc' \
  --exclude 'insert_*.py' --exclude 'update_enum.py' \
  backend/ "$SERVER:$APP_DIR/backend/"
rsync -az --delete --exclude 'uploads/' dist/public/ "$SERVER:$APP_DIR/dist/public/"

echo "==> Install dependency Python & restart backend"
ssh "$SERVER" "set -e
  find $APP_DIR/deploy $APP_DIR/backend $APP_DIR/dist -user \$(id -un) -exec chmod u+rwX,go+rX,go-w {} +
  $APP_DIR/venv/bin/pip install -q -r $APP_DIR/backend/requirements.txt -c $APP_DIR/backend/constraints.txt
  sudo systemctl restart ppid-backend
  for i in \$(seq 1 30); do
    curl -fsS http://127.0.0.1:8891/api/health >/dev/null 2>&1 && break
    sleep 1
  done
  curl -fsS http://127.0.0.1:8891/api/health && echo"

echo "==> Selesai: https://ppid.sorongkab.go.id"
