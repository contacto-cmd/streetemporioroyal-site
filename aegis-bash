#!/bin/bash
# aht.sh - tiny CLI para Street Emporio Royal
BACKEND="${BACKEND_URL:-https://api.streetemporioroyal.com}"
AUTH_TOKEN="$1"  # opcional: pasa token como primer argumento

function create_project() {
  title="$1"; desc="$2"; contact="${3:-contacto@streetemporioroyal.com}"
  curl -s -X POST "$BACKEND/api/submit" -H "Content-Type: application/json" \
   -d "{\"title\":\"$title\",\"desc\":\"$desc\",\"contact\":\"$contact\",\"files\":[]}" | jq
}

function render_project() {
  projectId="$1"; assetUrl="$2"
  curl -s -X POST "$BACKEND/api/render3d" -H "Content-Type: application/json" \
   -d "{\"projectId\":\"$projectId\",\"assetUrl\":\"$assetUrl\",\"params\":{}}" | jq
}

function gen_token() {
  sub="${1:-royal-admin}"
  curl -s -X POST "$BACKEND/api/token" -H "Content-Type: application/json" \
   -d "{\"sub\":\"$sub\",\"scope\":[\"aht:vip\"]}" | jq
}

case "$2" in
  "create") create_project "$3" "$4" "$5" ;;
  "render") render_project "$3" "$4" ;;
  "token") gen_token "$3" ;;
  *) echo "Usage: $0 <token?> create \"Title\" \"Desc\" | render projId assetUrl | token [sub]";;
esac
