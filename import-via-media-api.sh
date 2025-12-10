#!/bin/bash
# Import images via existing /api/media/images endpoint (workaround for API token issues)

echo "🚀 Importing images via Media API endpoint"
echo "=========================================="
echo ""

BASE_URL="https://meauxaccess-dashboard-production.meauxbility.workers.dev"

echo "📊 Step 1: Fetching images from /api/media/images..."
echo ""

# First, get images from media API
MEDIA_RESPONSE=$(curl -s "${BASE_URL}/api/media/images?per_page=100")

echo "$MEDIA_RESPONSE" | python3 << 'PYTHON'
import json
import sys

try:
    data = json.load(sys.stdin)
    if data.get('success') and data.get('images'):
        images = data['images']
        print(f"✅ Found {len(images)} images in Media API")
        print("")
        print("📝 To import these into V1 Gallery, use:")
        print("")
        print("Option 1: Use the Media API endpoint directly")
        print(f"  curl -X POST \"{BASE_URL}/api/v1/gallery/import\" \\")
        print("    -H \"Content-Type: application/json\" \\")
        print("    -d '{\"limit\": 100, \"useMediaAPI\": true, \"category\": \"imported\", \"autoTag\": true}'")
        print("")
        print("Option 2: Import manually via /api/v1/gallery/add for each image")
        print("")
        print("First 5 images:")
        for i, img in enumerate(images[:5], 1):
            print(f"  {i}. {img.get('filename', 'N/A')} (ID: {img.get('id', 'N/A')[:20]}...)")
    else:
        print(f"❌ Error: {data.get('error', 'Unknown error')}")
        print("")
        print("💡 The Media API might also need the API token configured.")
except Exception as e:
    print(f"❌ Parse error: {e}")
    print(sys.stdin.read()[:500])
PYTHON

echo ""
echo "✅ Done!"
