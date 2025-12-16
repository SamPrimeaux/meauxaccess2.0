#!/bin/bash

# Deploy MeauxAccess 2.0 Dev Worker
# Cloudflare-native deployment (R2, D1, KV, Workers)

set -e

echo "🚀 Deploying MeauxAccess 2.0 Dev Worker..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI not found. Install with: npm install -g wrangler"
    exit 1
fi

# Check if logged in
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not logged in to Cloudflare. Logging in..."
    wrangler login
fi

echo "📦 Building and deploying dev worker..."
echo ""

# Deploy with dev config
wrangler deploy --config wrangler.dev.toml

echo ""
echo "✅ Dev worker deployed successfully!"
echo ""
echo "🌐 Dev Worker URL: https://meauxaccess-dashboard-dev.meauxbility.workers.dev"
echo ""
echo "📝 Next steps:"
echo "   1. Visit the dev URL to validate"
echo "   2. Check logs: npm run dev:tail"
echo "   3. Test locally: npm run dev:local"
echo ""
echo "💡 To set secrets (optional):"
echo "   wrangler secret put SECRET_NAME --config wrangler.dev.toml"
echo ""

