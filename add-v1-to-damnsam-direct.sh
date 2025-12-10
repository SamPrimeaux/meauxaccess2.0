#!/bin/bash
# Directly add V1 Gallery routes to damnsam via Cloudflare API

API_TOKEN="5Q1hRvuHt5Z2CT2ckpAeQamvMUghFsgTtJpGVSDa"
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
WORKER_NAME="damnsam"

echo "🚀 Adding V1 Gallery to damnsam"
echo "================================"
echo ""

# Get current worker code
echo "📥 Fetching current damnsam worker code..."
CURRENT_CODE=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/javascript" 2>&1)

if echo "$CURRENT_CODE" | grep -q "success.*false"; then
  echo "❌ Cannot fetch worker code via API"
  echo "   You need to add the routes manually in Cloudflare Dashboard"
  echo ""
  echo "📋 Routes to add:"
  echo "   See: DAMNSAM_V1_GALLERY_INTEGRATION.ts"
  exit 1
fi

echo "✅ Worker code fetched"
echo ""
echo "⚠️  Manual steps required:"
echo "   1. Go to: https://dash.cloudflare.com/${ACCOUNT_ID}/workers/services/view/${WORKER_NAME}"
echo "   2. Click 'Quick Edit' or 'Edit Code'"
echo "   3. Add routes from: DAMNSAM_V1_GALLERY_INTEGRATION.ts"
echo "   4. Copy src/v1-gallery-api.ts content into damnsam"
echo "   5. Deploy"
echo ""
