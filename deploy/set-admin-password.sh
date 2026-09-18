#!/usr/bin/env bash
# Ganti password akun CMS (default: admin). Jalankan di VPS:
#   sudo bash /var/www/ppid-kabsor/deploy/set-admin-password.sh [username]
#   sudo bash /var/www/ppid-kabsor/deploy/set-admin-password.sh --generate [username]
set -euo pipefail

APP_DIR=/var/www/ppid-kabsor
[ "$(id -u)" -eq 0 ] || { echo "Jalankan dengan sudo"; exit 1; }

GENERATE=0
if [ "${1:-}" = "--generate" ]; then GENERATE=1; shift; fi
TARGET_USER="${1:-admin}"

if [ "$GENERATE" -eq 1 ]; then
  NEW_PASSWORD="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | cut -c1-20)"
else
  read -rsp "Password baru untuk $TARGET_USER: " NEW_PASSWORD; echo
  read -rsp "Ulangi password: " CONFIRM; echo
  [ "$NEW_PASSWORD" = "$CONFIRM" ] || { echo "Password tidak sama"; exit 1; }
  [ "${#NEW_PASSWORD}" -ge 12 ] || { echo "Password minimal 12 karakter"; exit 1; }
fi

set -a
. /etc/ppid-kabsor/backend.env
set +a
# Tanpa ini Python (sebagai root) menulis __pycache__ milik root ke folder aplikasi,
# yang membuat deploy.sh (user ubuntu) gagal.
export PYTHONPATH="$APP_DIR/backend" PYTHONDONTWRITEBYTECODE=1 TARGET_USER NEW_PASSWORD

"$APP_DIR/venv/bin/python" - <<'PY'
import os

from app.auth import get_password_hash
from app.database import SessionLocal
from app.models import User

db = SessionLocal()
user = db.query(User).filter(User.username == os.environ["TARGET_USER"]).first()
if user is None:
    raise SystemExit("User '%s' tidak ditemukan" % os.environ["TARGET_USER"])
user.password = get_password_hash(os.environ["NEW_PASSWORD"])
db.commit()
db.close()
PY

echo "Password untuk '$TARGET_USER' sudah diganti."
[ "$GENERATE" -eq 0 ] || echo "Password baru: $NEW_PASSWORD"
