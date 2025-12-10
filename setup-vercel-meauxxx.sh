#!/bin/bash
# Automated Vercel setup for meauxxx.com
# Uses provided Vercel token to add domain and configure proxy

set -e

# Configuration
VERCEL_TOKEN="nSbN81vwke2KYTFsPkYSeodl"
VERCEL_USER_ID="QvknUueIEjU5elqaJ5eUPIZV"
VERCEL_TEAM_ID="team_eMhajA4eD6XUAGomNi6CnQeZ"
DOMAIN="meauxxx.com"
PROJECT_NAME="meauxxx-mcp-proxy"
WORKER_URL="https://meauxmcp.meauxbility.workers.dev"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}?? Setting up meauxxx.com on Vercel${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}??  Vercel CLI not found. Installing...${NC}"
  npm i -g vercel
fi

# Test token
echo -e "${GREEN}?? Testing Vercel token...${NC}"
USER_INFO=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v2/user")

if echo "$USER_INFO" | grep -q "error"; then
  echo -e "${RED}? Token invalid or expired${NC}"
  echo "$USER_INFO"
  exit 1
fi

echo -e "${GREEN}? Token is valid!${NC}"
echo ""

# Create project directory
PROJECT_DIR="vercel-proxy-deploy"
if [ -d "$PROJECT_DIR" ]; then
  echo -e "${YELLOW}??  Project directory exists, cleaning...${NC}"
  rm -rf "$PROJECT_DIR"
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Copy vercel.json
echo -e "${GREEN}?? Creating vercel.json...${NC}"
cat > vercel.json << 'EOF'
{
  "version": 2,
  "rewrites": [
    {
      "source": "/mcp/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/mcp/:path*"
    },
    {
      "source": "/api/team/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/api/team/:path*"
    },
    {
      "source": "/api/ssh/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/api/ssh/:path*"
    },
    {
      "source": "/api/file/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/api/file/:path*"
    },
    {
      "source": "/iaccess",
      "destination": "https://meauxmcp.meauxbility.workers.dev/iaccess"
    },
    {
      "source": "/health",
      "destination": "https://meauxmcp.meauxbility.workers.dev/health"
    },
    {
      "source": "/dashboard",
      "destination": "https://meauxmcp.meauxbility.workers.dev/"
    },
    {
      "source": "/",
      "destination": "https://meauxmcp.meauxbility.workers.dev/"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
EOF

# Create minimal package.json
echo '{"name":"meauxxx-mcp-proxy","version":"1.0.0"}' > package.json

# Create index.html (fallback)
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=https://meauxmcp.meauxbility.workers.dev/">
</head>
<body>
  <p>Redirecting to MeauxMCP...</p>
</body>
</html>
EOF

echo -e "${GREEN}?? Deploying to Vercel...${NC}"
echo ""

# Deploy using Vercel CLI with token
export VERCEL_TOKEN="$VERCEL_TOKEN"
vercel --prod --token "$VERCEL_TOKEN" --yes --name "$PROJECT_NAME" --team "$VERCEL_TEAM_ID" 2>&1 | tee deploy.log

# Extract deployment URL from log
DEPLOY_URL=$(grep -o 'https://[^ ]*\.vercel\.app' deploy.log | head -1)

if [ -z "$DEPLOY_URL" ]; then
  echo -e "${YELLOW}??  Could not extract deployment URL from log${NC}"
  echo "Check deploy.log for details"
else
  echo ""
  echo -e "${GREEN}? Deployed to: $DEPLOY_URL${NC}"
fi

echo ""
echo -e "${GREEN}?? Adding domain meauxxx.com...${NC}"

# Get project ID first
echo -e "${GREEN}🔍 Finding project ID...${NC}"
PROJECT_INFO=$(curl -s -X GET \
  "https://api.vercel.com/v9/projects/$PROJECT_NAME?teamId=$VERCEL_TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN")

PROJECT_ID=$(echo "$PROJECT_INFO" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ]; then
  echo -e "${YELLOW}⚠️  Project not found, will be created on deploy${NC}"
  PROJECT_ID="$PROJECT_NAME"
fi

# Add domain using API
echo -e "${GREEN}🌐 Adding domain $DOMAIN to project...${NC}"
DOMAIN_RESPONSE=$(curl -s -X POST \
  "https://api.vercel.com/v10/projects/$PROJECT_ID/domains?teamId=$VERCEL_TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$DOMAIN\"}")

if echo "$DOMAIN_RESPONSE" | grep -q "error"; then
  echo -e "${YELLOW}??  Domain may already exist or need manual setup${NC}"
  echo "$DOMAIN_RESPONSE" | jq '.' 2>/dev/null || echo "$DOMAIN_RESPONSE"
  echo ""
  echo -e "${YELLOW}?? Try adding domain manually:${NC}"
  echo "  1. Go to: https://vercel.com/dashboard"
  echo "  2. Find project: $PROJECT_NAME"
  echo "  3. Settings ? Domains ? Add Domain"
  echo "  4. Enter: $DOMAIN"
else
  echo -e "${GREEN}? Domain added successfully!${NC}"
  echo "$DOMAIN_RESPONSE" | jq '.' 2>/dev/null || echo "$DOMAIN_RESPONSE"
fi

echo ""
echo -e "${GREEN}? Setup complete!${NC}"
echo ""
echo "?? Next steps:"
echo "  1. Wait 1-5 minutes for SSL certificate"
echo "  2. Test: curl -I https://$DOMAIN"
echo "  3. Test: curl https://$DOMAIN/api/team/members"
echo ""
echo "?? URLs:"
if [ ! -z "$DEPLOY_URL" ]; then
  echo "  - Deployment: $DEPLOY_URL"
fi
echo "  - Custom Domain: https://$DOMAIN"
echo "  - Dashboard: https://$DOMAIN/dashboard"
echo "  - API: https://$DOMAIN/api/team/members"
echo ""
echo -e "${GREEN}?? All Cloudflare resources (R2, D1, KV) stay on Cloudflare!${NC}"
