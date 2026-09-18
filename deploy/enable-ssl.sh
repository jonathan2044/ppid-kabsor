#!/usr/bin/env bash
# Pasang sertifikat Let's Encrypt setelah DNS ppid.sorongkab.go.id mengarah ke VPS ini
# (langsung, atau lewat proxy Cloudflare dengan mode SSL Flexible/Full). Jalankan di VPS:
#   sudo bash /var/www/ppid-kabsor/deploy/enable-ssl.sh [email-notifikasi]
set -euo pipefail

DOMAIN=ppid.sorongkab.go.id
EMAIL="${1:-}"
[ "$(id -u)" -eq 0 ] || { echo "Jalankan dengan sudo"; exit 1; }

if [ -n "$EMAIL" ]; then
  ACCOUNT_ARGS=(--email "$EMAIL" --no-eff-email)
else
  ACCOUNT_ARGS=(--register-unsafely-without-email)
fi

certbot certonly --webroot -w /var/www/letsencrypt -d "$DOMAIN" \
  "${ACCOUNT_ARGS[@]}" --agree-tos --non-interactive \
  --deploy-hook "systemctl reload nginx"

cat > /etc/nginx/snippets/ppid-kabsor-ssl.conf <<EOF
ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
EOF
nginx -t
systemctl reload nginx
echo "Sertifikat aktif untuk $DOMAIN; perpanjangan otomatis lewat certbot.timer."
