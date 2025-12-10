#!/bin/bash
# Build and deploy all iAccess SaaS pages

echo "🚀 Building iAccess SaaS Platform - 13 Pages"

# Upload all HTML pages to R2
echo "📤 Uploading pages to R2..."

cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker

# Main pages
wrangler r2 object put iaccess/index.html --file=iaccess-deploy/index-updated.html --content-type="text/html; charset=utf-8" --remote
wrangler r2 object put iaccess/ai-gateway.html --file=iaccess-deploy/ai-gateway.html --content-type="text/html; charset=utf-8" --remote
wrangler r2 object put iaccess/browser-rendering.html --file=iaccess-deploy/browser-rendering.html --content-type="text/html; charset=utf-8" --remote

# Generated pages
for page in analytics workers databases storage kv vectorize workflows queues email integrations settings; do
  if [ -f "iaccess-deploy/${page}.html" ]; then
    wrangler r2 object put iaccess/${page}.html --file=iaccess-deploy/${page}.html --content-type="text/html; charset=utf-8" --remote
    echo "✅ Uploaded ${page}.html"
  fi
done

# Upload shared components
wrangler r2 object put iaccess/shared-components.js --file=iaccess-deploy/shared-components.js --content-type="application/javascript; charset=utf-8" --remote

echo "✅ All pages uploaded!"
