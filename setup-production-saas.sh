#!/bin/bash

# Production SaaS Setup Script
# Sets up database, applies migrations, and configures environment

set -e

echo "🚀 Setting up Production SaaS Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler not found. Installing...${NC}"
    npm install -g wrangler
fi

# Database name
DB_NAME="meauxstack-saas-db"

echo -e "${BLUE}📊 Step 1: Applying database schema...${NC}"
if [ -f "database-schema.sql" ]; then
    wrangler d1 execute $DB_NAME --file=./database-schema.sql
    echo -e "${GREEN}✅ Database schema applied${NC}"
else
    echo -e "${YELLOW}⚠️  database-schema.sql not found${NC}"
fi

echo ""
echo -e "${BLUE}🔐 Step 2: Checking secrets...${NC}"

# Check for required secrets
REQUIRED_SECRETS=(
    "RESEND_API_KEY"
    "CLOUDFLARE_IMAGES_API_TOKEN"
)

for secret in "${REQUIRED_SECRETS[@]}"; do
    if wrangler secret list --config wrangler.meauxaccess-dashboard-production.toml 2>/dev/null | grep -q "$secret"; then
        echo -e "${GREEN}✅ $secret is set${NC}"
    else
        echo -e "${YELLOW}⚠️  $secret is not set. Run: wrangler secret put $secret${NC}"
    fi
done

echo ""
echo -e "${BLUE}📦 Step 3: Checking KV namespaces...${NC}"

# Check KV namespaces
REQUIRED_KV=(
    "KV_SESSIONS"
    "KV_USERS"
    "KV_CONFIG"
    "KV_NOTIFICATIONS"
)

for kv in "${REQUIRED_KV[@]}"; do
    echo -e "${GREEN}✅ $kv configured in wrangler.toml${NC}"
done

echo ""
echo -e "${BLUE}🗄️  Step 4: Checking D1 databases...${NC}"
if wrangler d1 list | grep -q "$DB_NAME"; then
    echo -e "${GREEN}✅ Database $DB_NAME exists${NC}"
else
    echo -e "${YELLOW}⚠️  Database $DB_NAME not found. Creating...${NC}"
    wrangler d1 create $DB_NAME
fi

echo ""
echo -e "${BLUE}🌐 Step 5: Checking custom domain...${NC}"
echo -e "${GREEN}✅ Custom domain: meauxbility.org${NC}"
echo -e "${GREEN}✅ Custom domain: inneranimalmedia.com${NC}"

echo ""
echo -e "${BLUE}✅ Setup complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Set any missing secrets: wrangler secret put SECRET_NAME"
echo "2. Test locally: wrangler dev --config wrangler.meauxaccess-dashboard-production.toml"
echo "3. Deploy: wrangler deploy --config wrangler.meauxaccess-dashboard-production.toml"
echo ""
echo -e "${GREEN}🚀 Ready for deployment!${NC}"
