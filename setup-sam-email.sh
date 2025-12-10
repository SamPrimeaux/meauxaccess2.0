#!/bin/bash
# Setup sam@inneranimalmedia.com email with Cloudflare Email Routing
# Usage: ./setup-sam-email.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📧 Setting up sam@inneranimalmedia.com email${NC}\n"

# Check for API token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo -e "${RED}❌ Error: CLOUDFLARE_API_TOKEN environment variable not set${NC}"
  echo -e "${YELLOW}Set it with: export CLOUDFLARE_API_TOKEN='your_token_here'${NC}"
  exit 1
fi

# Configuration
ZONE_NAME="inneranimalmedia.com"
EMAIL_ADDRESS="sam@inneranimalmedia.com"
DESTINATION_EMAIL="${1:-sam@meauxbility.org}"  # Default or first argument

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Zone: ${ZONE_NAME}"
echo -e "  Email: ${EMAIL_ADDRESS}"
echo -e "  Forwarding to: ${DESTINATION_EMAIL}\n"

# Get Zone ID
echo -e "${BLUE}🔍 Getting Zone ID...${NC}"
ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

ZONE_ID=$(echo "$ZONE_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$ZONE_ID" ]; then
  echo -e "${RED}❌ Error: Could not find zone ID for ${ZONE_NAME}${NC}"
  echo -e "${YELLOW}Response: ${ZONE_RESPONSE}${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Zone ID: ${ZONE_ID}${NC}\n"

# Step 1: Enable Email Routing
echo -e "${BLUE}📧 Step 1: Enabling Email Routing...${NC}"
ENABLE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/email/routing/enable" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

if echo "$ENABLE_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Email Routing enabled${NC}\n"
else
  # Check if already enabled
  if echo "$ENABLE_RESPONSE" | grep -q "already enabled"; then
    echo -e "${YELLOW}⚠️  Email Routing already enabled${NC}\n"
  else
    echo -e "${YELLOW}⚠️  Response: ${ENABLE_RESPONSE}${NC}\n"
  fi
fi

# Step 2: Create destination address
echo -e "${BLUE}📧 Step 2: Creating destination address...${NC}"
DEST_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/email/routing/addresses" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${DESTINATION_EMAIL}\",
    \"tag\": \"sam-forward-$(date +%s)\"
  }")

if echo "$DEST_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Destination address created${NC}"
  echo -e "${YELLOW}⚠️  Check your email (${DESTINATION_EMAIL}) for verification link${NC}\n"
else
  # Check if already exists
  if echo "$DEST_RESPONSE" | grep -q "already exists"; then
    echo -e "${YELLOW}⚠️  Destination address already exists${NC}\n"
  else
    echo -e "${RED}❌ Error creating destination: ${DEST_RESPONSE}${NC}\n"
    exit 1
  fi
fi

# Step 3: Wait for user to verify (optional)
echo -e "${YELLOW}⏳ Waiting 10 seconds for verification...${NC}"
echo -e "${YELLOW}   (If you haven't verified yet, check your email and click the verification link)${NC}\n"
sleep 10

# Step 4: Create routing rule
echo -e "${BLUE}📧 Step 3: Creating routing rule...${NC}"
RULE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/email/routing/rules" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Sam Email Forward\",
    \"enabled\": true,
    \"matchers\": [
      {
        \"type\": \"literal\",
        \"field\": \"to\",
        \"value\": \"${EMAIL_ADDRESS}\"
      }
    ],
    \"actions\": [
      {
        \"type\": \"forward\",
        \"value\": [\"${DESTINATION_EMAIL}\"]
      }
    ]
  }")

if echo "$RULE_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Routing rule created successfully!${NC}\n"
else
  # Check if rule already exists
  if echo "$RULE_RESPONSE" | grep -q "already exists\|duplicate"; then
    echo -e "${YELLOW}⚠️  Routing rule may already exist${NC}\n"
  else
    echo -e "${RED}❌ Error creating rule: ${RULE_RESPONSE}${NC}\n"
    exit 1
  fi
fi

# Step 5: Verify MX records
echo -e "${BLUE}🔍 Step 4: Verifying MX records...${NC}"
MX_RECORDS=$(dig MX ${ZONE_NAME} +short 2>/dev/null || echo "")

if echo "$MX_RECORDS" | grep -q "cloudflare"; then
  echo -e "${GREEN}✅ MX records configured:${NC}"
  echo "$MX_RECORDS" | while read line; do
    echo -e "   ${line}"
  done
else
  echo -e "${YELLOW}⚠️  MX records may not be visible yet (DNS propagation can take time)${NC}"
fi

echo -e "\n${GREEN}✅ Setup Complete!${NC}\n"
echo -e "${BLUE}📧 Email Configuration:${NC}"
echo -e "   From: ${EMAIL_ADDRESS}"
echo -e "   To: ${DESTINATION_EMAIL}"
echo -e "\n${YELLOW}⚠️  Important:${NC}"
echo -e "   1. Verify the destination email address (check ${DESTINATION_EMAIL})"
echo -e "   2. Test by sending an email to ${EMAIL_ADDRESS}"
echo -e "   3. Check spam folder if email doesn't arrive"
echo -e "\n${BLUE}🧪 Test Email:${NC}"
echo -e "   Send a test email to: ${EMAIL_ADDRESS}"
echo -e "   It should forward to: ${DESTINATION_EMAIL}\n"
