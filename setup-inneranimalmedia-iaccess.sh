#!/bin/bash
# Setup inneranimalmedia.com to serve iAccess platform

set -e

ZONE_ID="0bab48636c1bea4be4ea61c0c7787c3e"
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
WORKER_NAME="iacess"
DOMAIN="inneranimalmedia.com"
API_TOKEN="${CLOUDFLARE_API_TOKEN:-U9eRQWurcXOwVoXE_FV9IX_Q-Bttct9NZHFiJkMz}"

echo "🚀 Setting up inneranimalmedia.com for iAccess platform"
echo "Zone ID: $ZONE_ID"
echo "Account ID: $ACCOUNT_ID"
echo "Worker: $WORKER_NAME"
echo ""

# Step 1: Check existing DNS records
echo "📌 Step 1: Checking existing DNS records..."

DNS_RESPONSE=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${API_TOKEN}")

echo "Current DNS records:"
echo "$DNS_RESPONSE" | jq -r '.result[] | "\(.type) \(.name) -> \(.content) (Proxied: \(.proxied))"'

# Step 2: Add custom domain to worker (using override flag)
echo ""
echo "📌 Step 2: Adding custom domain to worker (with DNS override)..."

CUSTOM_DOMAIN_RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"hostname\": \"${DOMAIN}\",
    \"service\": \"${WORKER_NAME}\",
    \"zone_id\": \"${ZONE_ID}\",
    \"override_existing_dns_record\": true
  }")

echo "$CUSTOM_DOMAIN_RESPONSE" | jq '.'

if echo "$CUSTOM_DOMAIN_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "✅ Custom domain added successfully!"
elif echo "$CUSTOM_DOMAIN_RESPONSE" | jq -e '.errors[0].message' | grep -q "already"; then
  echo "✅ Domain already configured"
else
  echo "⚠️  Response: $CUSTOM_DOMAIN_RESPONSE"
fi

# Step 3: Add www subdomain
echo ""
echo "📌 Step 3: Adding www.${DOMAIN}..."

WWW_RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"hostname\": \"www.${DOMAIN}\",
    \"service\": \"${WORKER_NAME}\",
    \"zone_id\": \"${ZONE_ID}\",
    \"override_existing_dns_record\": true
  }")

echo "$WWW_RESPONSE" | jq '.'

# Step 4: Verify setup
echo ""
echo "📌 Step 4: Verifying custom domains..."

DOMAINS_RESPONSE=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains" \
  -H "Authorization: Bearer ${API_TOKEN}")

echo "Configured custom domains:"
echo "$DOMAINS_RESPONSE" | jq -r '.result[] | "\(.hostname) -> \(.service)"'

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Your iAccess platform will be available at:"
echo "   - https://${DOMAIN}/"
echo "   - https://www.${DOMAIN}/"
echo ""
echo "📋 All 13 pages accessible:"
echo "   - https://${DOMAIN}/ (Dashboard)"
echo "   - https://${DOMAIN}/analytics"
echo "   - https://${DOMAIN}/workers"
echo "   - https://${DOMAIN}/databases"
echo "   - https://${DOMAIN}/storage"
echo "   - https://${DOMAIN}/kv"
echo "   - https://${DOMAIN}/vectorize"
echo "   - https://${DOMAIN}/workflows"
echo "   - https://${DOMAIN}/queues"
echo "   - https://${DOMAIN}/email"
echo "   - https://${DOMAIN}/integrations"
echo "   - https://${DOMAIN}/settings"
echo "   - https://${DOMAIN}/ai-gateway"
echo "   - https://${DOMAIN}/browser-rendering"
echo ""
echo "⏳ SSL certificate will be issued automatically (1-5 minutes)"
echo "📊 All pages will use your Pro zone features"
