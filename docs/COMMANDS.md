# COMMANDS — royal-streetemporioroyal-engine

## Firma HMAC (ejemplo)
RAW JSON a firmar:
{"target":"github","payload":{"owner":"TU_USER","repo":"royal-streetemporioroyal-engine","path":"backend/hello.txt","content":"hola royal"}}

Generar firma (Linux/macOS/Termux/iSH):
RAW='{"target":"github","payload":{"owner":"TU_USER","repo":"royal-streetemporioroyal-engine","path":"backend/hello.txt","content":"hola royal"}}'
SIG=$(echo -n "$RAW" | openssl dgst -sha256 -hmac "TU_ROYAL_CMD_SECRET" -hex | sed 's/^.* //')

Curl ejemplo (envía al sync engine):
curl -X POST https://api.streetemporioroyal.com/royal/sync \
  -H "Content-Type: application/json" \
  -H "X-Royal-Signature: $SIG" \
  -d "$RAW"

## Ejemplo: actualizar variable en Railway (payload)
RAW='{"target":"railway","payload":{"projectId":"PROJECT_ID","key":"MY_KEY","value":"MY_VALUE"}}'
# Firma + curl como arriba.

## Ejemplo: actualizar env en Vercel
RAW='{"target":"vercel","payload":{"projectId":"VERCEL_PROJECT_ID","key":"NEXT_PUBLIC_API_BASE","value":"https://api.streetemporioroyal.com"}}'

## Nota de seguridad
- Nunca pegues ROYAL_CMD_SECRET en repos públicos.
- Rota el secreto si sospechas exposición.
- Todas las acciones quedan registradas en logs del servicio.
