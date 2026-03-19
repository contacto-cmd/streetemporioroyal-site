👑 COMMANDS — Royal Sync Engine
HMAC Signature Protocol (Authentication)
Every request to the Sovereign Engine must be signed using HMAC-SHA256 to ensure integrity and authority.
1. Prepare the RAW JSON Payload
{
  "target": "github",
  "payload": {
    "owner": "YOUR_USER",
    "repo": "royal-streetemporioroyal-engine",
    "path": "backend/hello.txt",
    "content": "hola royal"
  }
}
2. Generate the Signature (Linux / macOS / Termux)
Run this command in your terminal to generate the $SIG variable:
RAW='{"target":"github","payload":{"owner":"YOUR_USER","repo":"royal-streetemporioroyal-engine","path":"backend/hello.txt","content":"hola royal"}}'
SIG=$(echo -n "$RAW" | openssl dgst -sha256 -hmac "YOUR_ROYAL_CMD_SECRET" -hex | sed 's/^.* //')
3. Execute the Synchronous Command (Curl Example)
Send the payload to the Sync Engine endpoint:
curl -X POST https://api.streetemporioroyal.com/royal/sync \
-H "Content-Type: application/json" \
-H "X-Royal-Signature: $SIG" \
-d "$RAW"
curl -X POST https://api.streetemporioroyal.com/royal/sync \
-H "Content-Type: application/json" \
-H "X-Royal-Signature: $SIG" \
-d "$RAW"
🚀 Integration Examples
A. Update Railway Environment Variables
Payload:
RAW='{"target":"railway","payload":{"projectId":"PROJECT_ID","key":"MY_KEY","value":"MY_VALUE"}}'
Follow the signature + curl steps above)
B. Update Vercel Environment Variables
Payload:
RAW='{"target":"vercel","payload":{"projectId":"VERCEL_PROJECT_ID","key":"NEXT_PUBLIC_API_BASE","value":"https://api.streetemporioroyal.com"}}'
🛡️ Security Protocols
[!CAUTION]
I. SECRET PROTECTION: Never commit your ROYAL_CMD_SECRET to public repositories. Use environment variables only.
II. KEY ROTATION: Rotate your secret immediately if you suspect any exposure.
III. AUDIT LOGS: Every command executed through this engine is recorded in the service logs for sovereign oversight.

