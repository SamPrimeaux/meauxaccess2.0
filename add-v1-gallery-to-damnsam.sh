#!/bin/bash
# Script to add V1 Gallery to damnsam worker

echo "🚀 Adding V1 Gallery to damnsam Worker"
echo "======================================"
echo ""

# Step 1: Copy v1-gallery-api.ts to damnsam (if damnsam has src folder)
echo "📝 Step 1: Copy v1-gallery-api.ts"
echo "   Copy: src/v1-gallery-api.ts"
echo "   To: damnsam worker src folder"
echo ""

# Step 2: Add routes to damnsam
echo "📝 Step 2: Add routes to damnsam's main handler"
echo "   See: DAMNSAM_V1_GALLERY_INTEGRATION.ts"
echo ""

# Step 3: Set API token secret (already done)
echo "✅ Step 3: API Token Secret"
echo "   Already set: CLOUDFLARE_IMAGES_API_TOKEN"
echo ""

# Step 4: Test import
echo "📝 Step 4: Test import"
echo ""
echo "Run this after deploying:"
echo ""
echo "curl -X POST \"https://www.meauxbility.org/api/v1/gallery/import\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"limit\": 819, \"category\": \"imported\", \"autoTag\": true}'"
echo ""

echo "✅ Instructions complete!"
echo ""
echo "Next: Add the routes from DAMNSAM_V1_GALLERY_INTEGRATION.ts to damnsam worker code"
