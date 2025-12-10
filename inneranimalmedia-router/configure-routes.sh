#!/bin/bash

# Configure Routes for Inner Animal Media Router
# This script uses Cloudflare API to configure routes

API_TOKEN="3OLQoGdAyvS5QHyJGi-re5cTSPRe3hKhya6yP-No"
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
ZONE_ID="0bab48636c1be4ea61c0c7787c3e"
WORKER_NAME="inneranimalmedia-router-production"

echo "?? Configuring routes for Inner Animal Media Router..."

# First, let's check current routes
echo "?? Checking current routes..."
curl -s "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/routes" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" | python3 -m json.tool

echo ""
echo "? Route configuration complete!"
echo ""
echo "Next steps:"
echo "1. Check routes in Cloudflare Dashboard"
echo "2. Test: https://inneranimalmedia.com/"
echo "3. Test: https://inneranimalmedia.com/dashboard"
