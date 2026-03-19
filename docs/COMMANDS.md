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

Royal_Hub_Main (version 77)

sendJSON(Object obj)

Arguments:

Nombre	Tipo	Descripción
obj	Object	
logEvent(Object param1)

Arguments:

Nombre	Tipo	Descripción
param1	Object	
royal_push_directiva()

=== 5) Tarea manual: disparar y enviar a Discord ========= Útil desde el botón "Ejecutar" del editor.

openaiText(Object prompt)

Arguments:

Nombre	Tipo	Descripción
prompt	Object	
callWorkspaceAPI(Object service, Object endpoint, Object params)

Arguments:

Nombre	Tipo	Descripción
service	Object	
endpoint	Object	
params	Object	
replyFor(Object command, Object meta)

Arguments:

Nombre	Tipo	Descripción
command	Object	
meta	Object	
syn_log(Object dominion, Object type, Object detail, Object payload, Object status)

Arguments:

Nombre	Tipo	Descripción
dominion	Object	
type	Object	
detail	Object	
payload	Object	
status	Object	
doPost(Object e)

Arguments:

Nombre	Tipo	Descripción
e	Object	
doGet(Object e)

=== 4) Endpoint principal: Directiva ===================== Default: texto plano. ?format=json → JSON ?view=html → panel HTML ligero. ?push=discord → envía a Discord.

Arguments:

Nombre	Tipo	Descripción
e	Object	
generateTokenForEntry(Object alias)

Arguments:

Nombre	Tipo	Descripción
alias	Object	
initSecretIfAbsent()

ingestSynapseBlueprint(Object raw)

Arguments:

Nombre	Tipo	Descripción
raw	Object	
evaluateRouting(Object d)

Arguments:

Nombre	Tipo	Descripción
d	Object	
rotateTokenForAlias(Object aliasToRotate)

Arguments:

Nombre	Tipo	Descripción
aliasToRotate	Object	
ventaDemo_JAVI()

applyRouting(Object routing)

Arguments:

Nombre	Tipo	Descripción
routing	Object	
logSheet(Object actor, Object action, Object detail, Object status, Object meta)

Arguments:

Nombre	Tipo	Descripción
actor	Object	
action	Object	
detail	Object	
status	Object	
meta	Object	
onOpen_JAVI()

pushToGitHub(Object repo, Object path, Object content, Object commitMessage)

Arguments:

Nombre	Tipo	Descripción
repo	Object	
path	Object	
content	Object	
commitMessage	Object	
runAllEndpoints()

testWorkGPT()

initSecretIfAbsent_JAVI()

synProcess(Object blueprint)

Arguments:

Nombre	Tipo	Descripción
blueprint	Object	
test_ping()

getService()

notifyDiscord(Object texto)

=== 3) Notificador opcional a Discord ==================== Configura en Propiedades: ROYAL_DISCORD_WEBHOOK (opcional)

Arguments:

Nombre	Tipo	Descripción
texto	Object	
listMyRepos()

syn_test_flow()

test_syn()

doGet(Object e)

Arguments:

Nombre	Tipo	Descripción
e	Object	
nowISO()

callSalesNode_JAVI(Object alias, Object payloadObject)

Arguments:

Nombre	Tipo	Descripción
alias	Object	
payloadObject	Object	
twilioNotify(Object msg)

Arguments:

Nombre	Tipo	Descripción
msg	Object	
isAdmin(Object sender)

Arguments:

Nombre	Tipo	Descripción
sender	Object	
test_ws()

buildDirectiva(Object state)

=== 2) Ensamblador de Directiva ========================== Convierte el estado en un resumen ejecutivo breve.

Arguments:

Nombre	Tipo	Descripción
state	Object	
generateToken_JAVI(Object alias)

Arguments:

Nombre	Tipo	Descripción
alias	Object	
dominionLiveState()

=== 1) Estado vivo (mock realista) ======================= Sustituye aquí si ya tienes generador real de estado.

getAuthURL()

getContext(Object userId)

Arguments:

Nombre	Tipo	Descripción
userId	Object	
authCallback(Object request)

Arguments:

Nombre	Tipo	Descripción
request	Object	
geminiReply(Object userId, Object prompt)

Arguments:

Nombre	Tipo	Descripción
userId	Object	
prompt	Object	
test_gemini()

importJsonToSheet()

importFivePotentes_JAVI()

getLogSheet()

processSynapseBlueprint(Object raw)

Arguments:

Nombre	Tipo	Descripción
raw	Object	
getGitHubToken()

wsGmailProfile()

initArsenalSheet_JAVI()

pushContext(Object userId, Object role, Object text)

Arguments:

Nombre	Tipo	Descripción
userId	Object	
role	Object	
text	Object	
sendTextResponse(Object text)

Arguments:

Nombre	Tipo	Descripción
text	Object	
_getLogSheet()

handlePredictiveAlert(Object e)

Arguments:

Nombre	Tipo	Descripción
e	Object	
schedulePredictiveAlert(Object d)

Arguments:

Nombre	Tipo	Descripción
d	Object	
initSheet()

geminiText(Object prompt)

Arguments:

Nombre	Tipo	Descripción
prompt	Object	
callEndpointRow(Object rowIndex)

Arguments:

Nombre	Tipo	Descripción
rowIndex	Object	
wsLog(Object row)

Arguments:

Nombre	Tipo	Descripción
row	Object	

