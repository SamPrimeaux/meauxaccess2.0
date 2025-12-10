#!/bin/bash

# Setup script for inneranimalmedia.com custom domain
# This script configures the domain to route to meauxaccess-dashboard-production worker

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up inneranimalmedia.com for meauxaccess-dashboard-production worker${NC}\n"

# Check for API token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo -e "${RED}❌ Error: CLOUDFLARE_API_TOKEN environment variable is not set${NC}"
  echo -e "${YELLOW}Please set it with: export CLOUDFLARE_API_TOKEN='your-token'${NC}"
  exit 1
fi

ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
WORKER_NAME="meauxaccess-dashboard-production"
DOMAIN="inneranimalmedia.com"
ZONE_NAME="inneranimalmedia.com"

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  Account ID: ${ACCOUNT_ID}"
echo -e "  Worker: ${WORKER_NAME}"
echo -e "  Domain: ${DOMAIN}\n"

# Step 1: Get Zone ID
echo -e "${BLUE}Step 1: Fetching Zone ID for ${DOMAIN}...${NC}"
ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

ZONE_ID=$(echo $ZONE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$ZONE_ID" ]; then
  echo -e "${RED}❌ Error: Could not find zone for ${DOMAIN}${NC}"
  echo -e "${YELLOW}Response: ${ZONE_RESPONSE}${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Zone ID: ${ZONE_ID}${NC}\n"

# Step 2: Get Worker ID
echo -e "${BLUE}Step 2: Fetching Worker ID...${NC}"
WORKER_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/services/${WORKER_NAME}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

WORKER_ID=$(echo $WORKER_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$WORKER_ID" ]; then
  echo -e "${RED}❌ Error: Could not find worker ${WORKER_NAME}${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Worker ID: ${WORKER_ID}${NC}\n"

# Step 3: Add Custom Domain (root)
echo -e "${BLUE}Step 3: Adding custom domain ${DOMAIN}...${NC}"
CUSTOM_DOMAIN_RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/services/${WORKER_NAME}/environments/production/hostnames" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"hostname\":\"${DOMAIN}\",\"zone_id\":\"${ZONE_ID}\"}")

if echo $CUSTOM_DOMAIN_RESPONSE | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Custom domain ${DOMAIN} added successfully${NC}"
else
  echo -e "${YELLOW}⚠️  Response: ${CUSTOM_DOMAIN_RESPONSE}${NC}"
  # Check if already exists
  if echo $CUSTOM_DOMAIN_RESPONSE | grep -q "already exists"; then
    echo -e "${GREEN}✅ Domain already configured${NC}"
  else
    echo -e "${RED}❌ Failed to add custom domain${NC}"
  fi
fi

# Step 4: Add www subdomain
echo -e "\n${BLUE}Step 4: Adding custom domain www.${DOMAIN}...${NC}"
WWW_DOMAIN_RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/services/${WORKER_NAME}/environments/production/hostnames" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"hostname\":\"www.${DOMAIN}\",\"zone_id\":\"${ZONE_ID}\"}")

if echo $WWW_DOMAIN_RESPONSE | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Custom domain www.${DOMAIN} added successfully${NC}"
else
  if echo $WWW_DOMAIN_RESPONSE | grep -q "already exists"; then
    echo -e "${GREEN}✅ Domain already configured${NC}"
  else
    echo -e "${YELLOW}⚠️  Response: ${WWW_DOMAIN_RESPONSE}${NC}"
  fi
fi

# Step 5: DNS Recommendations
echo -e "\n${BLUE}📝 DNS Configuration Notes:${NC}"
echo -e "${YELLOW}The A record currently points to 192.0.2.1 (placeholder).${NC}"
echo -e "${YELLOW}When using Cloudflare Workers custom domains, you can:${NC}"
echo -e "  1. ${GREEN}Remove the A record${NC} - Cloudflare will handle routing automatically"
echo -e "  2. ${GREEN}Keep it${NC} - It won't interfere, but isn't needed"
echo -e "  3. ${GREEN}Update it${NC} - Change to Cloudflare's proxy IP if needed\n"

echo -e "${BLUE}✅ Setup Complete!${NC}\n"
echo -e "${GREEN}Your domain should be accessible at:${NC}"
echo -e "  🌐 https://${DOMAIN}"
echo -e "  🌐 https://www.${DOMAIN}"
echo -e "  🌐 https://${DOMAIN}/pricing"
echo -e "  🌐 https://${DOMAIN}/iaccess\n"
echo -e "${YELLOW}Note: DNS changes may take 5-10 minutes to propagate${NC}\n"
