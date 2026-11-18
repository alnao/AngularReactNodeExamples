#!/usr/bin/env bash
################################################################################
# AzureFunctionBooks - creazione delle risorse Azure e deploy (AZURE CLI)
#
# ⚠️ Crea risorse sull'abbonamento Azure. I costi sono a consumo: Function App Flex
# Consumption, Cosmos DB serverless, Storage e Log Analytics (vedi README).
#
# Ogni variabile si può cambiare da fuori, per esempio:
#   LOCATION=westeurope ALLOWED_ORIGIN=http://localhost:4200 ./start-all.sh
# Lo script si può rilanciare: le risorse già presenti non vengono ricreate.
################################################################################
set -euo pipefail
cd "$(dirname "$0")"

# ===== CONFIGURAZIONE =====
LOCATION="${LOCATION:-northeurope}"
RESOURCE_GROUP="${RESOURCE_GROUP:-azure-js-AzureFunctionBooks}"
STORAGE_ACCOUNT="${STORAGE_ACCOUNT:-alnaobooksfuncstore}"   # 3-24 caratteri minuscoli, unico in Azure
COSMOSDB_ACCOUNT="${COSMOSDB_ACCOUNT:-alnao-books-cosmosdb}" # unico in Azure
COSMOSDB_DATABASE="${COSMOSDB_DATABASE:-BooksDB}"
COSMOSDB_CONTAINER="${COSMOSDB_CONTAINER:-Books}"
FUNCTION_APP="${FUNCTION_APP:-alnao-books-func-api}"         # unico in Azure, diventa <nome>.azurewebsites.net
LOG_WORKSPACE="${LOG_WORKSPACE:-alnao-books-func-logs}"
APP_INSIGHTS="${APP_INSIGHTS:-alnao-books-func-insights}"
NODE_VERSION="${NODE_VERSION:-22}"
ALLOWED_ORIGIN="${ALLOWED_ORIGIN:-http://localhost:4200}"    # origine del frontend Angular (CORS)

# Tag standard del repository (vedi CLAUDE.md), su tutte le risorse del resource group
TAGS=(
  "Name=azure-js-AzureFunctionBooks"
  "Environment=dev"
  "Project=Development.azure.js-AzureFunctionBooks"
  "Owner=AlNao"
  "CostCenter=dev"
  "ManagedBy=Sh"
)
# Ruolo predefinito di Cosmos DB "Built-in Data Contributor" (lettura e scrittura dei dati)
COSMOS_DATA_CONTRIBUTOR="00000000-0000-0000-0000-000000000002"
# ==========================

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'
step() { echo ""; echo -e "${YELLOW}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }

echo "=================================================="
echo "🚀 AzureFunctionBooks - deploy su Azure"
echo "=================================================="
echo -e "${BLUE}Resource group:${NC} $RESOURCE_GROUP ($LOCATION)"
echo -e "${BLUE}Function App:${NC}   $FUNCTION_APP (Flex Consumption, Node $NODE_VERSION)"
echo -e "${BLUE}Cosmos DB:${NC}      $COSMOSDB_ACCOUNT (serverless) → $COSMOSDB_DATABASE/$COSMOSDB_CONTAINER"
echo -e "${BLUE}Storage:${NC}        $STORAGE_ACCOUNT"
echo -e "${BLUE}CORS:${NC}           $ALLOWED_ORIGIN"

step "1/10 Prerequisiti"
command -v az >/dev/null   || fail "Azure CLI non trovata: https://learn.microsoft.com/cli/azure/install-azure-cli"
command -v func >/dev/null || fail "Azure Functions Core Tools non trovati: npm install -g azure-functions-core-tools@4"
command -v node >/dev/null || fail "Node.js non trovato"
az account show >/dev/null 2>&1 || fail "Nessun login Azure: eseguire 'az login'"
# L'estensione serve per creare Application Insights collegato al workspace Log Analytics
az extension add --name application-insights --upgrade --yes --only-show-errors
ok "Abbonamento: $(az account show --query name -o tsv)"

step "2/10 Resource group"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --tags "${TAGS[@]}" --output none
ok "$RESOURCE_GROUP"

step "3/10 Log Analytics e Application Insights (log delle funzioni)"
az monitor log-analytics workspace create --resource-group "$RESOURCE_GROUP" --workspace-name "$LOG_WORKSPACE" \
  --location "$LOCATION" --retention-time 30 --tags "${TAGS[@]}" --output none
WORKSPACE_ID=$(az monitor log-analytics workspace show --resource-group "$RESOURCE_GROUP" --workspace-name "$LOG_WORKSPACE" --query id -o tsv)
if ! az monitor app-insights component show --app "$APP_INSIGHTS" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
  az monitor app-insights component create --app "$APP_INSIGHTS" --resource-group "$RESOURCE_GROUP" --location "$LOCATION" \
    --workspace "$WORKSPACE_ID" --application-type web --kind web --tags "${TAGS[@]}" --output none
fi
ok "$LOG_WORKSPACE, $APP_INSIGHTS"

step "4/10 Storage account (richiesto dalla Function App)"
if ! az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
  az storage account create --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" --location "$LOCATION" \
    --sku Standard_LRS --kind StorageV2 --min-tls-version TLS1_2 --allow-blob-public-access false \
    --tags "${TAGS[@]}" --output none
fi
ok "$STORAGE_ACCOUNT"

step "5/10 Cosmos DB serverless (può richiedere alcuni minuti)"
if ! az cosmosdb show --name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
  az cosmosdb create --name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" \
    --locations regionName="$LOCATION" failoverPriority=0 isZoneRedundant=False \
    --capabilities EnableServerless --default-consistency-level Session \
    --tags "${TAGS[@]}" --output none
fi
SERVERLESS=$(az cosmosdb show --name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" \
  --query "length(capabilities[?name=='EnableServerless'])" -o tsv)
[ "$SERVERLESS" = "1" ] || fail "L'account $COSMOSDB_ACCOUNT esiste ma non è serverless: usare un altro COSMOSDB_ACCOUNT"
if ! az cosmosdb sql database show --account-name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" --name "$COSMOSDB_DATABASE" >/dev/null 2>&1; then
  az cosmosdb sql database create --account-name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" \
    --name "$COSMOSDB_DATABASE" --output none
fi
if ! az cosmosdb sql container show --account-name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" \
    --database-name "$COSMOSDB_DATABASE" --name "$COSMOSDB_CONTAINER" >/dev/null 2>&1; then
  # Serverless: nessun --throughput, si paga per richiesta
  az cosmosdb sql container create --account-name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" \
    --database-name "$COSMOSDB_DATABASE" --name "$COSMOSDB_CONTAINER" --partition-key-path "/id" --output none
fi
COSMOS_ENDPOINT=$(az cosmosdb show --name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" --query documentEndpoint -o tsv)
ok "$COSMOS_ENDPOINT → $COSMOSDB_DATABASE/$COSMOSDB_CONTAINER"

step "6/10 Function App (Flex Consumption)"
if ! az functionapp show --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
  az functionapp create --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" \
    --storage-account "$STORAGE_ACCOUNT" --flexconsumption-location "$LOCATION" \
    --runtime node --runtime-version "$NODE_VERSION" \
    --app-insights "$APP_INSIGHTS" --tags "${TAGS[@]}" --output none
fi
ok "$FUNCTION_APP"

step "7/10 Identità gestita e permessi su Cosmos DB (nessuna chiave nelle impostazioni)"
PRINCIPAL_ID=$(az functionapp identity assign --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" --query principalId -o tsv)
EXISTING=$(az cosmosdb sql role assignment list --account-name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" \
  --query "length([?principalId=='$PRINCIPAL_ID'])" -o tsv)
if [ "$EXISTING" = "0" ]; then
  az cosmosdb sql role assignment create --account-name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" \
    --role-definition-id "$COSMOS_DATA_CONTRIBUTOR" --principal-id "$PRINCIPAL_ID" --scope "/" --output none
fi
ok "Identità $PRINCIPAL_ID con ruolo Data Contributor su $COSMOSDB_ACCOUNT"

step "8/10 Impostazioni dell'app e CORS"
az functionapp config appsettings set --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" --output none --settings \
  "COSMOS_DB_ENDPOINT=$COSMOS_ENDPOINT" "COSMOS_DB_DATABASE=$COSMOSDB_DATABASE" "COSMOS_DB_CONTAINER=$COSMOSDB_CONTAINER"
ORIGIN_PRESENT=$(az functionapp cors show --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" \
  --query "length(allowedOrigins[?@=='$ALLOWED_ORIGIN'])" -o tsv)
if [ "$ORIGIN_PRESENT" = "0" ]; then
  az functionapp cors add --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" --allowed-origins "$ALLOWED_ORIGIN" --output none
fi
ok "COSMOS_DB_ENDPOINT impostato, CORS per $ALLOWED_ORIGIN"

step "9/10 Tag su tutte le risorse del resource group"
# Comprende anche le risorse create in automatico (piano Flex, regole di avviso di Application Insights)
for RESOURCE_ID in $(az resource list --resource-group "$RESOURCE_GROUP" --query "[].id" -o tsv); do
  az resource tag --ids "$RESOURCE_ID" --tags "${TAGS[@]}" --is-incremental --output none
done
ok "Tag applicati"

step "10/10 Build e pubblicazione del codice"
./scripts/package.sh
(cd .deploy && func azure functionapp publish "$FUNCTION_APP" --no-build)
ok "Codice pubblicato"

HOST=$(az functionapp show --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" --query defaultHostName -o tsv)
API_KEY=$(az functionapp keys list --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" --query functionKeys.default -o tsv)
API_URL="https://$HOST/api/books"

# Configurazione per stop-all.sh e per il frontend (file ignorato da git: contiene la chiave)
cat > .azure-config <<EOF
RESOURCE_GROUP="$RESOURCE_GROUP"
LOCATION="$LOCATION"
FUNCTION_APP="$FUNCTION_APP"
COSMOSDB_ACCOUNT="$COSMOSDB_ACCOUNT"
API_URL="$API_URL"
API_KEY="$API_KEY"
EOF

echo ""
echo "=================================================="
ok "Deploy completato"
echo "=================================================="
echo -e "${BLUE}URL API:${NC} $API_URL"
echo "La chiave (header x-functions-key) è in .azure-config. Prova rapida:"
echo "  source .azure-config && curl -H \"x-functions-key: \$API_KEY\" \$API_URL"
echo "Per cancellare tutto: ./stop-all.sh"
