#!/bin/bash

# Apply Observability Configuration to Worker
# This script uses the Cloudflare API to configure observability settings

API_TOKEN="3OLQoGdAyvS5QHyJGi-re5cTSPRe3hKhya6yP-No"
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
WORKER_NAME="inneranimalmedia-router-production"
ENVIRONMENT="production"

echo "?? Applying observability configuration..."

# Apply observability config via API
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/services/${WORKER_NAME}/environments/${ENVIRONMENT}/observability" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @observability-config.json

echo ""
echo "? Observability configuration applied!"
echo ""
echo "Settings:"
echo "- Logs: Enabled (persist: true, invocation_logs: true)"
echo "- Traces: Disabled"
echo "- Head Sampling Rate: 1"
