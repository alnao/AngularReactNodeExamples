#!/usr/bin/env bash
################################################################################
# AzureFunctionBooks - cancellazione di tutte le risorse Azure (AZURE CLI)
#
# Cancella l'intero resource group: Function App, Cosmos DB con i dati, Storage,
# Application Insights e Log Analytics. Operazione irreversibile.
# Il resource group si legge da .azure-config (scritto da start-all.sh) oppure:
#   RESOURCE_GROUP=nome-del-gruppo ./stop-all.sh
################################################################################
set -euo pipefail
cd "$(dirname "$0")"

if [ -z "${RESOURCE_GROUP:-}" ] && [ -f .azure-config ]; then
  # shellcheck disable=SC1091
  source .azure-config
fi
RESOURCE_GROUP="${RESOURCE_GROUP:-azure-js-AzureFunctionBooks}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

command -v az >/dev/null || { echo -e "${RED}❌ Azure CLI non trovata${NC}"; exit 1; }
az account show >/dev/null 2>&1 || { echo -e "${RED}❌ Nessun login Azure: eseguire 'az login'${NC}"; exit 1; }

if [ "$(az group exists --name "$RESOURCE_GROUP")" != "true" ]; then
  echo -e "${GREEN}✅ Il resource group '$RESOURCE_GROUP' non esiste: niente da cancellare${NC}"
  rm -f .azure-config
  exit 0
fi

echo -e "${YELLOW}Risorse nel resource group '$RESOURCE_GROUP' ($(az account show --query name -o tsv)):${NC}"
az resource list --resource-group "$RESOURCE_GROUP" --query "[].{Nome:name, Tipo:type}" -o table
echo ""
echo -e "${RED}⚠️  Verranno cancellate tutte, dati compresi. Operazione IRREVERSIBILE.${NC}"
read -r -p "Scrivere il nome del resource group per confermare: " CONFIRM
[ "$CONFIRM" = "$RESOURCE_GROUP" ] || { echo "Annullato"; exit 0; }

echo -e "${YELLOW}⏳ Cancellazione in corso (alcuni minuti)...${NC}"
az group delete --name "$RESOURCE_GROUP" --yes
rm -f .azure-config
echo -e "${GREEN}✅ Resource group '$RESOURCE_GROUP' cancellato${NC}"
