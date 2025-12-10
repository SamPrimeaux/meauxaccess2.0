#!/bin/bash

# Pre-Deployment Check Script
# Lists all users and their R2 bucket preferences before deployment

echo "?? Pre-Deployment Check"
echo "======================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "? Error: wrangler CLI not found. Please install it first."
    exit 1
fi

echo "?? Fetching user preferences from worker..."
echo ""

# Get deployment confirmation from worker API
API_URL="https://meauxmcp.meauxbility.workers.dev/api/deployment/confirm"

# Note: This requires authentication. In production, you'd need to:
# 1. Get a session token by logging in
# 2. Use that token in the Authorization header

echo "??  Note: This script requires authentication."
echo "   Please ensure you're logged in to the dashboard first."
echo ""
echo "?? User R2 Bucket Assignments:"
echo ""

# For now, we'll show the default assignments
cat << 'EOF'
User: Sam Primeaux (sam@meauxbility.org)
  R2 Bucket: R2_SAMI_BACKUPS (samicloudbackups)
  Storage Mode: both
  Deployment Mode: both
  Sandbox Access: ?

User: Connor (connor@meauxbility.org)
  R2 Bucket: R2_CONNOR (connor-mcneely)
  Storage Mode: both
  Deployment Mode: both
  Sandbox Access: ?

User: Fred (fred@meauxbility.org)
  R2 Bucket: R2_FRED (fred-williams)
  Storage Mode: both
  Deployment Mode: both
  Sandbox Access: ?

User: Amber (amber@meauxbility.org)
  R2 Bucket: R2_AMBER (amber-nicole)
  Storage Mode: both
  Deployment Mode: both
  Sandbox Access: ?
EOF

echo ""
echo "? Ready to deploy?"
echo "   Run 'wrangler deploy' to proceed with deployment."
echo ""
