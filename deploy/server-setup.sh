#!/usr/bin/env bash
# Provisioning VPS PPID Kabupaten Sorong (Ubuntu 22.04). Aman dijalankan ulang.
#   sudo bash /var/www/ppid-kabsor/deploy/server-setup.sh
set -euo pipefail

APP_DIR=/var/www/ppid-kabsor
APP_USER=ppid
DEPLOY_USER=ubuntu
DB_NAME=ppid_kabsor_db
DB_USER=ppid_user
ENV_DIR=/etc/ppid-kabsor
ENV_FILE=$ENV_DIR/backend.env
SSL_SNIPPET=/etc/nginx/snippets/ppid-kabsor-ssl.conf
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"

[ "$(id -u)" -eq 0 ] || { echo "Jalankan dengan sudo"; exit 1; }
cd /

echo "==> Zona waktu & paket sistem"
timedatectl set-timezone Asia/Jayapura
export DEBIAN_FRONTEND=noninteractive
apt-get update -q
apt-get install -y -q nginx postgresql python3-venv rsync ufw certbot ssl-cert openssl curl

echo "==> User & direktori aplikasi"
id -u "$APP_USER" >/dev/null 2>&1 ||
  useradd --system --no-create-home --home-dir /nonexistent --shell /usr/sbin/nologin "$APP_USER"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 755 \
  "$APP_DIR" "$APP_DIR/backend" "$APP_DIR/dist" "$APP_DIR/dist/public" "$APP_DIR/client" "$APP_DIR/client/public"
install -d -o "$APP_USER" -g "$APP_USER" -m 755 "$APP_DIR/client/public/uploads"
install -d -m 755 /var/www/letsencrypt

echo "==> Secret backend ($ENV_FILE)"
install -d -m 700 "$ENV_DIR"
if [ ! -f "$ENV_FILE" ]; then
  (
    umask 077
    {
      printf 'DATABASE_URL=postgresql://%s:%s@127.0.0.1:5432/%s\n' "$DB_USER" "$(openssl rand -hex 24)" "$DB_NAME"
      printf 'SESSION_SECRET=%s\n' "$(openssl rand -hex 32)"
    } > "$ENV_FILE"
  )
fi
chmod 600 "$ENV_FILE"
DB_PASS="$(sed -n 's#^DATABASE_URL=postgresql://[^:]*:\([^@]*\)@.*#\1#p' "$ENV_FILE")"

echo "==> PostgreSQL"
systemctl enable --now postgresql
sudo -u postgres psql -v ON_ERROR_STOP=1 -q <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASS';
  ELSE
    ALTER ROLE $DB_USER LOGIN PASSWORD '$DB_PASS';
  END IF;
END
\$\$;
SQL
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 ||
  sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"

echo "==> Python virtualenv"
[ -x "$APP_DIR/venv/bin/python" ] || sudo -u "$DEPLOY_USER" python3 -m venv "$APP_DIR/venv"
sudo -u "$DEPLOY_USER" "$APP_DIR/venv/bin/pip" install -q --upgrade pip

echo "==> Service systemd"
install -m 644 "$SRC_DIR/systemd/ppid-backend.service" /etc/systemd/system/ppid-backend.service
systemctl daemon-reload
systemctl enable ppid-backend

echo "==> Nginx"
[ -f /etc/ssl/certs/ssl-cert-snakeoil.pem ] || make-ssl-cert generate-default-snakeoil
if [ ! -f "$SSL_SNIPPET" ]; then
  cat > "$SSL_SNIPPET" <<'EOF'
# Sertifikat sementara (self-signed); deploy/enable-ssl.sh menggantinya dengan Let's Encrypt.
ssl_certificate     /etc/ssl/certs/ssl-cert-snakeoil.pem;
ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
EOF
fi
install -m 644 "$SRC_DIR/nginx/ppid-kabsor.conf" /etc/nginx/sites-available/ppid-kabsor
ln -sfn /etc/nginx/sites-available/ppid-kabsor /etc/nginx/sites-enabled/ppid-kabsor
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx || systemctl restart nginx

echo "==> Firewall (UFW)"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "==> Izin sudo terbatas untuk deploy.sh"
RULE_TMP="$(mktemp)"
echo "$DEPLOY_USER ALL=(root) NOPASSWD: /usr/bin/systemctl restart ppid-backend" > "$RULE_TMP"
visudo -cf "$RULE_TMP"
install -m 440 -o root -g root "$RULE_TMP" /etc/sudoers.d/60-ppid-deploy
rm -f "$RULE_TMP"

echo "==> Setup server selesai"
