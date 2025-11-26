#!/bin/bash

################################################################################
# Azure Functions Books CRUD - Cleanup Script
# Elimina tutte le risorse Azure create dallo script start-all.sh
################################################################################

set -e
RESOURCE_GROUP="alnao-books-functions"

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🛑 Azure Functions Books CRUD - Cleanup"
echo "=================================================="

# Carica la configurazione salvata
if [ ! -f ".azure-config" ]; then
    echo ""
    echo -e "${RED}❌ File .azure-config non trovato${NC}"
    echo -e "${YELLOW}Inserisci manualmente il Resource Group da eliminare:${NC}"
    read -p "Resource Group: " RESOURCE_GROUP
    
    if [ -z "$RESOURCE_GROUP" ]; then
        echo -e "${RED}❌ Resource Group non specificato${NC}"
        exit 1
    fi
else
    source .azure-config
    echo ""
    echo -e "${BLUE}Configurazione caricata da .azure-config${NC}"
fi

echo ""
echo -e "${YELLOW}⚠️  ATTENZIONE: Verranno eliminate le seguenti risorse:${NC}"
echo "  Resource Group:    $RESOURCE_GROUP"
[ -n "$STORAGE_ACCOUNT" ] && echo "  Storage Account:   $STORAGE_ACCOUNT"
[ -n "$COSMOSDB_ACCOUNT" ] && echo "  Cosmos DB Account: $COSMOSDB_ACCOUNT"
[ -n "$FUNCTION_APP" ] && echo "  Function App:      $FUNCTION_APP"
echo ""
echo -e "${RED}⚠️  Questa operazione è IRREVERSIBILE!${NC}"
echo ""
read -p "Sei sicuro di voler continuare? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}❌ Operazione annullata${NC}"
    exit 0
fi

# Verifica Azure CLI
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI non trovato${NC}"
    exit 1
fi

# Verifica login
echo ""
echo -e "${YELLOW}📦 Verifica login Azure...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Effettua il login ad Azure...${NC}"
    az login
fi
SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${GREEN}✅ Subscription attiva: $SUBSCRIPTION${NC}"

# Verifica esistenza Resource Group
echo ""
echo -e "${YELLOW}📦 Verifica Resource Group...${NC}"
if ! az group exists --name "$RESOURCE_GROUP" | grep -q "true"; then
    echo -e "${YELLOW}⚠️  Resource Group '$RESOURCE_GROUP' non trovato${NC}"
    echo -e "${GREEN}✅ Nessuna risorsa da eliminare${NC}"
    rm -f .azure-config
    exit 0
fi

# Mostra risorse nel Resource Group
echo ""
echo -e "${YELLOW}📋 Risorse presenti nel Resource Group:${NC}"
az resource list --resource-group "$RESOURCE_GROUP" --query "[].{Name:name, Type:type}" -o table

echo ""
echo -e "${YELLOW}🗑️  Eliminazione Resource Group e tutte le risorse...${NC}"
echo -e "${YELLOW}⏳ Questa operazione può richiedere alcuni minuti...${NC}"

# Elimina il Resource Group (elimina automaticamente tutte le risorse al suo interno)
az group delete \
    --name "$RESOURCE_GROUP" \
    --yes \
    --no-wait

echo ""
echo -e "${GREEN}✅ Comando di eliminazione inviato${NC}"
echo -e "${YELLOW}⏳ L'eliminazione continuerà in background${NC}"
echo ""
echo -e "${BLUE}Per verificare lo stato dell'eliminazione:${NC}"
echo "  az group show --name $RESOURCE_GROUP"
echo ""
echo -e "${BLUE}Per attendere il completamento:${NC}"
echo "  az group wait --name $RESOURCE_GROUP --deleted"
echo ""

# Opzione per attendere il completamento
read -p "Vuoi attendere il completamento dell'eliminazione? (yes/no): " WAIT_DELETE

if [ "$WAIT_DELETE" == "yes" ]; then
    echo ""
    echo -e "${YELLOW}⏳ Attesa completamento eliminazione...${NC}"
    az group wait --name "$RESOURCE_GROUP" --deleted --timeout 1800 || true
    
    if az group exists --name "$RESOURCE_GROUP" | grep -q "false"; then
        echo -e "${GREEN}✅ Resource Group eliminato con successo${NC}"
    else
        echo -e "${YELLOW}⚠️  L'eliminazione è ancora in corso${NC}"
    fi
fi

# Cleanup file di configurazione
rm -f .azure-config

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Cleanup completato${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}Riepilogo:${NC}"
echo "  ✅ Comando di eliminazione inviato per: $RESOURCE_GROUP"
echo "  ✅ File .azure-config rimosso"
echo ""
echo -e "${YELLOW}Note:${NC}"
echo "  • Le risorse verranno eliminate in background"
echo "  • Verifica su Azure Portal per conferma finale"
echo "  • Potrebbero volerci 5-10 minuti per completare"
echo ""
