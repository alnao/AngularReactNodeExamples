#!/bin/bash

################################################################################
# Azure Functions Books CRUD - Deploy Script
# Crea tutte le risorse Azure necessarie e deploya l'applicazione
################################################################################

# ===== CONFIGURAZIONE VARIABILI =====
RESOURCE_GROUP="alnao-books-functions"
LOCATION="northeurope"  # "westeurope"
STORAGE_ACCOUNT="alnaobooksstorage" #"storageaccount-$(date +%s)"  # Aggiunge timestamp per univocità
COSMOSDB_ACCOUNT="alnao-books-cosmos"
COSMOSDB_DATABASE="BooksDB"
COSMOSDB_CONTAINER="Books"
FUNCTION_APP="alnao-book-functions-api" # "func-books-api-$(date +%s)"  # Aggiunge timestamp per univocità
FUNCTION_RUNTIME="node"
FUNCTION_RUNTIME_VERSION="20"  # Node.js 20 LTS (Node 18 è EOL dal 30/04/2025)
FUNCTION_VERSION="4"
# ====================================

# Nota: Azure Functions v4 supporta Node.js 18, 20 e 22
# Node.js 18 ha raggiunto End-of-Life il 30 aprile 2025
# Usiamo Node.js 20 LTS come versione stabile e supportata

# Nota: Non usiamo "set -e" per gestire manualmente gli errori
# e permettere esecuzioni multiple senza problemi

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🚀 Azure Functions Books CRUD - Deploy"
echo "=================================================="
echo ""
echo -e "${BLUE}Configurazione:${NC}"
echo "  Resource Group:    $RESOURCE_GROUP"
echo "  Location:          $LOCATION"
echo "  Storage Account:   $STORAGE_ACCOUNT"
echo "  Cosmos DB Account: $COSMOSDB_ACCOUNT"
echo "  Function App:      $FUNCTION_APP"
echo ""

# Salva la configurazione per lo script di stop
cat > .azure-config <<EOF
RESOURCE_GROUP="$RESOURCE_GROUP"
LOCATION="$LOCATION"
STORAGE_ACCOUNT="$STORAGE_ACCOUNT"
COSMOSDB_ACCOUNT="$COSMOSDB_ACCOUNT"
COSMOSDB_DATABASE="$COSMOSDB_DATABASE"
COSMOSDB_CONTAINER="$COSMOSDB_CONTAINER"
FUNCTION_APP="$FUNCTION_APP"
EOF

# 1. Verifica prerequisiti
echo -e "${YELLOW}📦 Step 1/8: Verifica prerequisiti...${NC}"

if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI non trovato${NC}"
    echo "Installa con: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
    exit 1
fi
echo -e "${GREEN}✅ Azure CLI: $(az --version | head -1)${NC}"

if ! command -v func &> /dev/null; then
    echo -e "${RED}❌ Azure Functions Core Tools non trovato${NC}"
    echo "Installo con il comando: npm install -g azure-functions-core-tools@4 --unsafe-perm true"
    npm install -g azure-functions-core-tools@4 --unsafe-perm true
    #exit 1
fi
echo -e "${GREEN}✅ Azure Functions Core Tools: $(func --version)${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js non trovato${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# 2. Login Azure
echo ""
echo -e "${YELLOW}📦 Step 2/8: Login Azure...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Effettua il login ad Azure...${NC}"
    az login
fi
SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${GREEN}✅ Subscription attiva: $SUBSCRIPTION${NC}"

# 3. Crea Resource Group
echo ""
echo -e "${YELLOW}📦 Step 3/8: Creazione Resource Group...${NC}"
if az group exists --name "$RESOURCE_GROUP" | grep -q "true"; then
    echo -e "${GREEN}✅ Resource Group '$RESOURCE_GROUP' già esistente${NC}"
else
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --output none
    echo -e "${GREEN}✅ Resource Group '$RESOURCE_GROUP' creato${NC}"
fi

# 4. Crea Storage Account
echo ""
echo -e "${YELLOW}📦 Step 4/8: Creazione Storage Account...${NC}"
if az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${GREEN}✅ Storage Account '$STORAGE_ACCOUNT' già esistente${NC}"
else
    az storage account create \
        --name "$STORAGE_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Standard_LRS \
        --output none 2>&1 || {
        echo -e "${YELLOW}⚠️  Errore nella creazione, probabile esistenza. Verifico...${NC}"
        if az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
            echo -e "${GREEN}✅ Storage Account '$STORAGE_ACCOUNT' già esistente${NC}"
        else
            echo -e "${RED}❌ Errore nella creazione dello Storage Account${NC}"
            exit 1
        fi
    }
    if az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        echo -e "${GREEN}✅ Storage Account '$STORAGE_ACCOUNT' creato${NC}"
    fi
fi

# 5. Crea Cosmos DB Account
echo ""
echo -e "${YELLOW}📦 Step 5/8: Creazione Cosmos DB Account...${NC}"
if az cosmosdb show --name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${GREEN}✅ Cosmos DB Account '$COSMOSDB_ACCOUNT' già esistente${NC}"
else
    echo -e "${YELLOW}⏳ Creazione in corso (può richiedere alcuni minuti)...${NC}"
    az cosmosdb create \
        --name "$COSMOSDB_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --locations regionName="$LOCATION" failoverPriority=0 isZoneRedundant=False \
        --default-consistency-level Session \
        --enable-automatic-failover false \
        --output none 2>&1 || {
        echo -e "${YELLOW}⚠️  Errore nella creazione, probabile esistenza. Verifico...${NC}"
        if az cosmosdb show --name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
            echo -e "${GREEN}✅ Cosmos DB Account '$COSMOSDB_ACCOUNT' già esistente${NC}"
        else
            echo -e "${RED}❌ Errore nella creazione di Cosmos DB${NC}"
            exit 1
        fi
    }
    if az cosmosdb show --name "$COSMOSDB_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        echo -e "${GREEN}✅ Cosmos DB Account '$COSMOSDB_ACCOUNT' creato${NC}"
    fi
fi

# 6. Crea Database e Container Cosmos DB
echo ""
echo -e "${YELLOW}📦 Step 6/8: Creazione Database e Container Cosmos DB...${NC}"

# Database
if az cosmosdb sql database show \
    --account-name "$COSMOSDB_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --name "$COSMOSDB_DATABASE" &> /dev/null; then
    echo -e "${GREEN}✅ Database '$COSMOSDB_DATABASE' già esistente${NC}"
else
    az cosmosdb sql database create \
        --account-name "$COSMOSDB_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --name "$COSMOSDB_DATABASE" \
        --output none 2>&1 || {
        echo -e "${YELLOW}⚠️  Errore nella creazione, verifico esistenza...${NC}"
        if az cosmosdb sql database show \
            --account-name "$COSMOSDB_ACCOUNT" \
            --resource-group "$RESOURCE_GROUP" \
            --name "$COSMOSDB_DATABASE" &> /dev/null; then
            echo -e "${GREEN}✅ Database '$COSMOSDB_DATABASE' già esistente${NC}"
        else
            echo -e "${RED}❌ Errore nella creazione del Database${NC}"
            exit 1
        fi
    }
    if az cosmosdb sql database show \
        --account-name "$COSMOSDB_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --name "$COSMOSDB_DATABASE" &> /dev/null; then
        echo -e "${GREEN}✅ Database '$COSMOSDB_DATABASE' creato${NC}"
    fi
fi

# Container
if az cosmosdb sql container show \
    --account-name "$COSMOSDB_ACCOUNT" \
    --database-name "$COSMOSDB_DATABASE" \
    --resource-group "$RESOURCE_GROUP" \
    --name "$COSMOSDB_CONTAINER" &> /dev/null; then
    echo -e "${GREEN}✅ Container '$COSMOSDB_CONTAINER' già esistente${NC}"
else
    az cosmosdb sql container create \
        --account-name "$COSMOSDB_ACCOUNT" \
        --database-name "$COSMOSDB_DATABASE" \
        --resource-group "$RESOURCE_GROUP" \
        --name "$COSMOSDB_CONTAINER" \
        --partition-key-path "/id" \
        --throughput 400 \
        --output none 2>&1 || {
        echo -e "${YELLOW}⚠️  Errore nella creazione, verifico esistenza...${NC}"
        if az cosmosdb sql container show \
            --account-name "$COSMOSDB_ACCOUNT" \
            --database-name "$COSMOSDB_DATABASE" \
            --resource-group "$RESOURCE_GROUP" \
            --name "$COSMOSDB_CONTAINER" &> /dev/null; then
            echo -e "${GREEN}✅ Container '$COSMOSDB_CONTAINER' già esistente${NC}"
        else
            echo -e "${RED}❌ Errore nella creazione del Container${NC}"
            exit 1
        fi
    }
    if az cosmosdb sql container show \
        --account-name "$COSMOSDB_ACCOUNT" \
        --database-name "$COSMOSDB_DATABASE" \
        --resource-group "$RESOURCE_GROUP" \
        --name "$COSMOSDB_CONTAINER" &> /dev/null; then
        echo -e "${GREEN}✅ Container '$COSMOSDB_CONTAINER' creato${NC}"
    fi
fi

# 7. Crea Function App
echo ""
echo -e "${YELLOW}📦 Step 7/8: Creazione Function App...${NC}"
if az functionapp show --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${GREEN}✅ Function App '$FUNCTION_APP' già esistente${NC}"
else
    az functionapp create \
        --name "$FUNCTION_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --storage-account "$STORAGE_ACCOUNT" \
        --consumption-plan-location "$LOCATION" \
        --runtime "$FUNCTION_RUNTIME" \
        --runtime-version "$FUNCTION_RUNTIME_VERSION" \
        --functions-version "$FUNCTION_VERSION" \
        --os-type Linux \
        --output none 2>&1 || {
        echo -e "${YELLOW}⚠️  Errore nella creazione, verifico esistenza...${NC}"
        if az functionapp show --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
            echo -e "${GREEN}✅ Function App '$FUNCTION_APP' già esistente${NC}"
        else
            echo -e "${RED}❌ Errore nella creazione della Function App${NC}"
            exit 1
        fi
    }
    if az functionapp show --name "$FUNCTION_APP" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        echo -e "${GREEN}✅ Function App '$FUNCTION_APP' creata${NC}"
    fi
fi

# Ottieni Connection String Cosmos DB
COSMOS_CONNECTION_STRING=$(az cosmosdb keys list \
    --name "$COSMOSDB_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --type connection-strings \
    --query "connectionStrings[0].connectionString" -o tsv)

# Configura App Settings
echo -e "${YELLOW}⚙️  Configurazione App Settings...${NC}"
az functionapp config appsettings set \
    --name "$FUNCTION_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --settings \
        "COSMOS_DB_CONNECTION_STRING=$COSMOS_CONNECTION_STRING" \
        "COSMOS_DB_DATABASE=$COSMOSDB_DATABASE" \
        "COSMOS_DB_CONTAINER=$COSMOSDB_CONTAINER" \
    --output none 2>&1 || {
    echo -e "${YELLOW}⚠️  Errore nella configurazione, riprovo...${NC}"
    sleep 5
    az functionapp config appsettings set \
        --name "$FUNCTION_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --settings \
            "COSMOS_DB_CONNECTION_STRING=$COSMOS_CONNECTION_STRING" \
            "COSMOS_DB_DATABASE=$COSMOSDB_DATABASE" \
            "COSMOS_DB_CONTAINER=$COSMOSDB_CONTAINER" \
        --output none || echo -e "${YELLOW}⚠️  App Settings potrebbero non essere configurati correttamente${NC}"
}
echo -e "${GREEN}✅ App Settings configurati${NC}"

# 8. Build e Deploy
echo ""
echo -e "${YELLOW}📦 Step 8/8: Build e Deploy dell'applicazione...${NC}"

# Installa dipendenze
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing dependencies...${NC}"
    npm install || {
        echo -e "${RED}❌ Errore durante l'installazione delle dipendenze${NC}"
        exit 1
    }
fi

# Build
echo -e "${YELLOW}🔨 Building TypeScript...${NC}"
npm run build || {
    echo -e "${RED}❌ Errore durante la build${NC}"
    exit 1
}

# Deploy
echo -e "${YELLOW}🚀 Deploying to Azure...${NC}"
func azure functionapp publish "$FUNCTION_APP" || {
    echo -e "${RED}❌ Errore durante il deploy${NC}"
    echo -e "${YELLOW}Possibili cause:${NC}"
    echo "  - Function App non ancora pronta (attendi 1-2 minuti e riprova)"
    echo "  - Errori di compilazione TypeScript"
    echo "  - Problemi di autenticazione Azure"
    echo ""
    echo -e "${YELLOW}Riprova con: ./start-all.sh${NC}"
    exit 1
}

# 9. Ottieni URL
echo ""
echo "=================================================="
echo -e "${GREEN}✅ Deploy completato con successo!${NC}"
echo "=================================================="
echo ""

FUNCTION_URL=$(az functionapp show \
    --name "$FUNCTION_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --query "defaultHostName" -o tsv)

echo -e "${BLUE}📍 URL API:${NC} https://$FUNCTION_URL/api"
echo ""
echo -e "${BLUE}Endpoints disponibili:${NC}"
echo "  POST   https://$FUNCTION_URL/api/books         - Create book"
echo "  GET    https://$FUNCTION_URL/api/books         - List books"
echo "  GET    https://$FUNCTION_URL/api/books/{id}    - Get book"
echo "  PUT    https://$FUNCTION_URL/api/books/{id}    - Update book"
echo "  DELETE https://$FUNCTION_URL/api/books/{id}    - Delete book"
echo ""
echo -e "${YELLOW}Test rapido:${NC}"
echo "  curl https://$FUNCTION_URL/api/books"
echo ""
echo -e "${YELLOW}Per eliminare tutte le risorse:${NC}"
echo "  ./stop-all.sh"
echo ""
echo "=================================================="

# Salva l'URL per riferimento futuro
echo "API_URL=https://$FUNCTION_URL/api" >> .azure-config
echo -e "${GREEN}✅ Configurazione salvata in .azure-config${NC}"
