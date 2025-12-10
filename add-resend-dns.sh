#!/bin/bash
# Script to add Resend DNS records via Cloudflare API
# Requires: CLOUDFLARE_API_TOKEN with DNS edit permissions

set -e

# Configuration
DOMAIN="meauxbility.org"
ZONE_ID="2f420b6c582e4ba8d7b1f6ebaf91438b"
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"

# Resend DNS Records
DKIM_RECORD="p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5vo+oI0NR4jUVT3rqXkWiLlq/xdwN40Ki9c8CCrjYUlTrgTerCc/f7vttfnAVz+HK9amSmkgQB0q7PAryi1+PaIAmyxD8ldSayQyubG9Aei3rYYUqyFiqhDPZwJamtZrBk7YuW2nfrmBEM3gI/zl8G0VPEs+zO9NL+fWeClEAswIDAQAB"
SPF_RECORD="v=spf1 include:amazonses.com ~all"
DMARC_RECORD="v=DMARC1; p=none;"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo -e "${RED}? Error: CLOUDFLARE_API_TOKEN not set${NC}"
  echo "Set it with: export CLOUDFLARE_API_TOKEN='your-token'"
  exit 1
fi

echo -e "${GREEN}?? Adding Resend DNS records for $DOMAIN${NC}"
echo ""

# Function to add DNS record
add_record() {
  local type=$1
  local name=$2
  local content=$3
  local priority=${4:-""}
  
  echo -e "${GREEN}? Adding $type record: $name${NC}"
  
  local data="{
    \"type\": \"$type\",
    \"name\": \"$name\",
    \"content\": \"$content\",
    \"ttl\": 1,
    \"proxied\": false
  }"
  
  if [ "$type" = "MX" ] && [ ! -z "$priority" ]; then
    data="{
      \"type\": \"$type\",
      \"name\": \"$name\",
      \"content\": \"$content\",
      \"priority\": $priority,
      \"ttl\": 1,
      \"proxied\": false
    }"
  fi
  
  local response=$(curl -s -X POST \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "$data")
  
  if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}? Successfully added $name${NC}"
  else
    if echo "$response" | grep -q "already exists"; then
      echo -e "${YELLOW}??  Record $name already exists${NC}"
    else
      echo -e "${RED}? Failed to add $name${NC}"
      echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    fi
  fi
  echo ""
}

# Add DKIM record
add_record "TXT" "resend._domainkey" "$DKIM_RECORD"

# Add SPF record
add_record "TXT" "send" "$SPF_RECORD"

# Add MX record for sending
add_record "MX" "send" "feedback-smtp.us-east-1.amazonses.com" "10"

# Add MX record for receiving
add_record "MX" "@" "inbound-smtp.us-east-1.amazonaws.com" "10"

# Add DMARC record
add_record "TXT" "_dmarc" "$DMARC_RECORD"

echo -e "${GREEN}? DNS records added!${NC}"
echo ""
echo "? Wait 5-60 minutes for DNS propagation"
echo "?? Verify records:"
echo "   dig TXT resend._domainkey.$DOMAIN +short"
echo "   dig TXT send.$DOMAIN +short"
echo "   dig MX send.$DOMAIN +short"
echo ""
echo "?? Then verify in Resend: https://resend.com/domains"
