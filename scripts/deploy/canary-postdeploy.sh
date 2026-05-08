#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${NODE0_HOST:-}" || -z "${NODE0_USER:-}" ]]; then
  echo "NODE0_HOST y NODE0_USER son requeridos" >&2
  exit 1
fi

if [[ ! "${NODE0_HOST}" =~ ^[a-zA-Z0-9._-]+$ || ! "${NODE0_USER}" =~ ^[a-z_][a-z0-9_-]*[$]?$ ]]; then
  echo "NODE0_HOST o NODE0_USER contienen caracteres no permitidos" >&2
  exit 1
fi

TARGET="${NODE0_USER}@${NODE0_HOST}"
echo "[canary] Validación post deploy en ${TARGET}"
ssh -o BatchMode=yes -o ConnectTimeout=10 "${TARGET}" 'systemctl is-active --quiet rdm-digital-api.service && systemctl is-active --quiet ollama.service'
echo "[canary] Validación post deploy completada"
