#!/bin/bash

# Setup iautodidact.org custom domain for connor-mcneely worker
# This script adds the custom domain and configures DNS

set -e

ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
WORKER_NAME="connor-mcneely"
DOMAIN="iautodidact.org"
ZONE_ID=""  # Will be fetched or needs to be set

echo "?? Setting up custom domain: $DOMAIN for worker: $WORKER_NAME"

# Check if CLOUDFLARE_API_TOKEN is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "? Error: CLOUDFLARE_API_TOKEN environment variable is not set"
  echo "   Set it with: export CLOUDFLARE_API_TOKEN='your-token'"
  exit 1
fi

# Get Zone ID for iautodidact.org
echo "?? Fetching Zone ID for $DOMAIN..."
ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

ZONE_ID=$(echo $ZONE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$ZONE_ID" ]; then
  echo "? Error: Could not find Zone ID for $DOMAIN"
  echo "   Make sure the domain is added to Cloudflare"
  exit 1
fi

echo "? Zone ID: $ZONE_ID"

# Add custom domain to worker
echo "?? Adding custom domain to worker..."
CUSTOM_DOMAIN_RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$WORKER_NAME/domains" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"hostname\": \"$DOMAIN\",
    \"zone_id\": \"$ZONE_ID\"
  }")

if echo "$CUSTOM_DOMAIN_RESPONSE" | grep -q '"success":true'; then
  echo "? Custom domain added successfully!"
else
  echo "??  Response: $CUSTOM_DOMAIN_RESPONSE"
  echo "   Trying alternative method via routes..."
  
  # Alternative: Add route
  echo "???  Adding route for $DOMAIN..."
  ROUTE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/workers/routes" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"pattern\": \"$DOMAIN/*\",
      \"script\": \"$WORKER_NAME\"
    }")
  
  if echo "$ROUTE_RESPONSE" | grep -q '"success":true'; then
    echo "? Route added successfully!"
  else
    echo "? Failed to add route: $ROUTE_RESPONSE"
    exit 1
  fi
fi

# Add www subdomain route
echo "?? Adding www.$DOMAIN route..."
WWW_ROUTE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/workers/routes" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"pattern\": \"www.$DOMAIN/*\",
    \"script\": \"$WORKER_NAME\"
  }")

if echo "$WWW_ROUTE_RESPONSE" | grep -q '"success":true'; then
  echo "? www.$DOMAIN route added!"
else
  echo "??  www route may already exist or failed: $WWW_ROUTE_RESPONSE"
fi

echo ""
echo "? Setup complete!"
echo ""
echo "?? Next steps:"
echo "   1. Wait 2-5 minutes for DNS propagation"
echo "   2. SSL certificate will be issued automatically"
echo "   3. Test: https://$DOMAIN"
echo "   4. Test: https://www.$DOMAIN"
echo ""
echo "?? URLs:"
echo "   - https://$DOMAIN"
echo "   - https://www.$DOMAIN"
echo "   - https://$WORKER_NAME.meauxbility.workers.dev"
echo ""
