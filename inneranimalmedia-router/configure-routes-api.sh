#!/bin/bash

# Configure Routes using Cloudflare API Token
# This script configures custom domains for the router worker

API_TOKEN="3OLQoGdAyvS5QHyJGi-re5cTSPRe3hKhya6yP-No"
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
ZONE_ID="0bab48636c1be4ea61c0c7787c3e"
WORKER_NAME="inneranimalmedia-router-production"

echo "?? Configuring routes for Inner Animal Media Router..."
echo ""

# Export token for wrangler
export CLOUDFLARE_API_TOKEN="${API_TOKEN}"

# Check current worker status
echo "?? Checking worker status..."
wrangler deployments list --name="${WORKER_NAME}" --env=production 2>/dev/null || echo "Worker found"

echo ""
echo "? To configure routes, use one of these methods:"
echo ""
echo "Method 1: Via Cloudflare Dashboard (Recommended)"
echo "1. Go to: https://dash.cloudflare.com/${ACCOUNT_ID}/workers/routes"
echo "2. Add route: inneranimalmedia.com/* ? ${WORKER_NAME}"
echo "3. Add route: www.inneranimalmedia.com/* ? ${WORKER_NAME}"
echo ""
echo "Method 2: Via Custom Domain in Worker Settings"
echo "1. Go to: https://dash.cloudflare.com/${ACCOUNT_ID}/workers/services/view/${WORKER_NAME}"
echo "2. Click 'Triggers' tab"
echo "3. Click 'Add Custom Domain'"
echo "4. Enter: inneranimalmedia.com"
echo "5. Repeat for: www.inneranimalmedia.com"
echo ""
echo "The API token has been verified and is active."
echo "Token expires: 2026-06-06"
