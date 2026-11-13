#!/usr/bin/env bash
# Instala o Brumaval Online numa VPS Ubuntu/Debian limpa (22.04 ou mais nova).
# Uso (como root):  bash install.sh [dominio] [usuario_adm]
#   dominio: opcional. Sem ele, usa <ip-da-vps>.sslip.io (HTTPS grátis, sem comprar domínio).
#   usuario_adm: opcional. Usuário do jogo que pode usar /nivel, /ir, /trazer e /aviso.
# Rodar de novo atualiza o código e reinicia o servidor, sem apagar contas nem personagens.
set -euo pipefail
REPO="https://github.com/matheuspiloti/brumaval.git"
APP=/opt/brumaval
DATA=/var/lib/brumaval
ADMIN="${2:-}"

[ "$(id -u)" = 0 ] || { echo "Rode como root (sudo bash install.sh)"; exit 1; }
export DEBIAN_FRONTEND=noninteractive

echo "==> Pacotes básicos"
apt-get update -y
apt-get install -y curl git python3 ca-certificates gnupg debian-keyring debian-archive-keyring apt-transport-https

if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  echo "==> Node.js 22"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

if ! command -v caddy >/dev/null; then
  echo "==> Caddy (HTTPS automático)"
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y && apt-get install -y caddy
fi

echo "==> Código do jogo"
id brumaval >/dev/null 2>&1 || useradd --system --home "$APP" --shell /usr/sbin/nologin brumaval
git config --global --add safe.directory "$APP" 2>/dev/null || true
if [ -d "$APP/.git" ]; then git -C "$APP" fetch -q origin main && git -C "$APP" reset -q --hard origin/main; else git clone -q "$REPO" "$APP"; fi
(cd "$APP/mmo/server" && npm ci --omit=dev --no-audit --no-fund 2>/dev/null || npm install --omit=dev --no-audit --no-fund)
mkdir -p "$DATA"; chown -R brumaval:brumaval "$APP" "$DATA"

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  if [ -f /etc/brumaval-domain ]; then DOMAIN="$(cat /etc/brumaval-domain)"; else
    IP="$(curl -4 -fsS https://api.ipify.org)"; DOMAIN="${IP//./-}.sslip.io"; fi
fi
echo "$DOMAIN" > /etc/brumaval-domain
if [ -n "$ADMIN" ]; then echo "$ADMIN" > /etc/brumaval-admin; fi
ADMIN="$(cat /etc/brumaval-admin 2>/dev/null || true)"

echo "==> Serviço (reinicia sozinho se cair e ao ligar a VPS)"
cat > /etc/systemd/system/brumaval.service <<EOF
[Unit]
Description=Brumaval Online
After=network.target

[Service]
User=brumaval
WorkingDirectory=$APP/mmo/server
Environment=PORT=8080
Environment=HOST=127.0.0.1
Environment=DATA_DIR=$DATA
Environment=ADMIN_USERS=$ADMIN
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/caddy/Caddyfile <<EOF
$DOMAIN {
  encode gzip
  reverse_proxy 127.0.0.1:8080
}
EOF

if command -v ufw >/dev/null && ufw status | grep -q active; then ufw allow 80/tcp; ufw allow 443/tcp; fi

systemctl daemon-reload
systemctl enable --now brumaval
systemctl restart brumaval
systemctl reload caddy || systemctl restart caddy

sleep 3
if curl -fsS http://127.0.0.1:8080/health >/dev/null; then
  echo
  echo "Pronto! Abra: https://$DOMAIN"
  echo "(o certificado HTTPS pode levar um minuto na primeira vez)"
  [ -n "$ADMIN" ] && echo "Usuário ADM do jogo: $ADMIN (crie a conta com esse nome na tela de entrada)"
  echo "Ver o que o servidor está fazendo:  journalctl -u brumaval -f"
else
  echo "O servidor não respondeu. Veja o erro com: journalctl -u brumaval -n 50"; exit 1
fi
