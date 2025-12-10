#!/bin/bash

# Update DNS for iautodidact.org using Cloudflare API
# This script adds CNAME records to point to connor-mcneely worker

set -e

ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
WORKER_NAME="connor-mcneely"
DOMAIN="iautodidact.org"
API_TOKEN="U9eRQWurcXOwVoXE_FV9IX_Q-Bttct9NZHFiJkMz"
TARGET="connor-mcneely.meauxbility.workers.dev"

echo "?? Updating DNS for $DOMAIN"

# Get Zone ID
echo "?? Fetching Zone ID for $DOMAIN..."
ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")

ZONE_ID=$(echo $ZONE_RESPONSE | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['result'][0]['id'] if data.get('success') and data.get('result') else '')" 2>/dev/null)

if [ -z "$ZONE_ID" ]; then
  echo "? Error: Could not find Zone ID for $DOMAIN"
  echo "   Response: $ZONE_RESPONSE"
  exit 1
fi

echo "? Zone ID: $ZONE_ID"

# Check if CNAME records already exist
echo "?? Checking existing DNS records..."
EXISTING_RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&name=$DOMAIN" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")

ROOT_EXISTS=$(echo $EXISTING_RECORDS | python3 -c "import sys, json; data = json.load(sys.stdin); print('true' if data.get('success') and len(data.get('result', [])) > 0 else 'false')" 2>/dev/null)

# Add root domain CNAME (@)
if [ "$ROOT_EXISTS" = "true" ]; then
  echo "??  Root domain CNAME already exists, updating..."
  RECORD_ID=$(echo $EXISTING_RECORDS | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['result'][0]['id'] if data.get('result') else '')" 2>/dev/null)
  
  UPDATE_RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"type\": \"CNAME\",
      \"name\": \"@\",
      \"content\": \"$TARGET\",
      \"proxied\": true,
      \"ttl\": 1
    }")
  
  if echo "$UPDATE_RESPONSE" | grep -q '"success":true'; then
    echo "? Root domain CNAME updated successfully!"
  else
    echo "? Failed to update: $UPDATE_RESPONSE"
    exit 1
  fi
else
  echo "? Adding root domain CNAME (@)..."
  CREATE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"type\": \"CNAME\",
      \"name\": \"@\",
      \"content\": \"$TARGET\",
      \"proxied\": true,
      \"ttl\": 1
    }")
  
  if echo "$CREATE_RESPONSE" | grep -q '"success":true'; then
    echo "? Root domain CNAME added successfully!"
  else
    echo "? Failed to add: $CREATE_RESPONSE"
    exit 1
  fi
fi

# Check if www CNAME exists
WWW_RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&name=www.$DOMAIN" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")

WWW_EXISTS=$(echo $WWW_RECORDS | python3 -c "import sys, json; data = json.load(sys.stdin); print('true' if data.get('success') and len(data.get('result', [])) > 0 else 'false')" 2>/dev/null)

# Add www subdomain CNAME
if [ "$WWW_EXISTS" = "true" ]; then
  echo "??  www CNAME already exists, updating..."
  WWW_RECORD_ID=$(echo $WWW_RECORDS | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['result'][0]['id'] if data.get('result') else '')" 2>/dev/null)
  
  UPDATE_WWW_RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$WWW_RECORD_ID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"type\": \"CNAME\",
      \"name\": \"www\",
      \"content\": \"$TARGET\",
      \"proxied\": true,
      \"ttl\": 1
    }")
  
  if echo "$UPDATE_WWW_RESPONSE" | grep -q '"success":true'; then
    echo "? www CNAME updated successfully!"
  else
    echo "??  Failed to update www: $UPDATE_WWW_RESPONSE"
  fi
else
  echo "? Adding www subdomain CNAME..."
  CREATE_WWW_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"type\": \"CNAME\",
      \"name\": \"www\",
      \"content\": \"$TARGET\",
      \"proxied\": true,
      \"ttl\": 1
    }")
  
  if echo "$CREATE_WWW_RESPONSE" | grep -q '"success":true'; then
    echo "? www CNAME added successfully!"
  else
    echo "??  Failed to add www: $CREATE_WWW_RESPONSE"
  fi
fi

echo ""
echo "? DNS update complete!"
echo ""
echo "?? DNS Records:"
echo "   - @ (root) ? $TARGET (Proxied)"
echo "   - www ? $TARGET (Proxied)"
echo ""
echo "? Wait 2-5 minutes for DNS propagation"
echo "?? Test: https://$DOMAIN"
echo "?? Test: https://www.$DOMAIN"
echo ""
