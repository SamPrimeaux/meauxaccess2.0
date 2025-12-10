#!/bin/bash
# Script to update DNS for meauxxx.com to point to Vercel
# Requires: CLOUDFLARE_API_TOKEN with DNS edit permissions

# Configuration
DOMAIN="meauxxx.com"
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
VERCEL_TARGET="cname.vercel-dns.com"

# Check if API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "? Error: CLOUDFLARE_API_TOKEN not set"
  echo "Set it with: export CLOUDFLARE_API_TOKEN='your-token'"
  exit 1
fi

# Get Zone ID for meauxxx.com
echo "?? Finding zone ID for $DOMAIN..."
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" | \
  jq -r '.result[0].id // empty')

if [ -z "$ZONE_ID" ]; then
  echo "? Zone not found for $DOMAIN"
  echo "You may need to add the zone to Cloudflare first"
  exit 1
fi

echo "? Found zone ID: $ZONE_ID"

# Get existing records
echo "?? Checking existing DNS records..."
EXISTING_RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$DOMAIN&type=CNAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

# Delete existing CNAME for root
echo "???  Deleting existing CNAME records for root domain..."
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$DOMAIN&type=CNAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" | \
  jq -r '.result[].id' | \
  while read record_id; do
    if [ ! -z "$record_id" ]; then
      echo "Deleting record: $record_id"
      curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$record_id" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json"
    fi
  done

# Add CNAME for root domain
echo "? Adding CNAME record for root domain..."
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"type\": \"CNAME\",
    \"name\": \"@\",
    \"content\": \"$VERCEL_TARGET\",
    \"proxied\": true,
    \"ttl\": 1
  }" | jq -r '.success, .result.id, .errors'

# Add CNAME for www
echo "? Adding CNAME record for www subdomain..."
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"type\": \"CNAME\",
    \"name\": \"www\",
    \"content\": \"$VERCEL_TARGET\",
    \"proxied\": true,
    \"ttl\": 1
  }" | jq -r '.success, .result.id, .errors'

echo ""
echo "? DNS records updated!"
echo "? Wait 5-60 minutes for DNS propagation"
echo "?? Check status: https://dnschecker.org/#CNAME/$DOMAIN"
