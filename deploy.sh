#!/bin/bash

# Cloudflare MCP Server Deployment Script

echo "?? Deploying Cloudflare MCP Server..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "? Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Install dependencies
echo "?? Installing dependencies..."
npm install

# Deploy to Cloudflare
echo "??  Deploying to Cloudflare Workers..."
wrangler deploy

echo ""
echo "? Deployment complete!"
echo ""
echo "?? Next steps:"
echo "1. Note your worker URL (shown above)"
echo "2. Update CURSOR_SETUP.md with your worker URL"
echo "3. Configure Cursor using CURSOR_SETUP.md"
echo "4. (Optional) Set MCP_AUTH_TOKEN: wrangler secret put MCP_AUTH_TOKEN"
echo ""
