#!/bin/bash
# Bulk import all Cloudflare Images into V1 Gallery

echo "🚀 Importing all Cloudflare Images to V1 Gallery"
echo "=================================================="
echo ""

BASE_URL="https://meauxaccess-dashboard-production.meauxbility.workers.dev"
# Alternative: https://www.meauxbility.org (if routed through damnsam worker)

echo "📊 Importing images..."
echo ""

# Import all 819 images
curl -X POST "${BASE_URL}/api/v1/gallery/import" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 819,
    "category": "imported",
    "autoTag": true
  }' | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print(f\"✅ Success!\")
        print(f\"   Imported: {data.get('imported', 0)} images\")
        print(f\"   Skipped: {data.get('skipped', 0)} images\")
        print(f\"\")
        print(f\"📝 Next steps:\")
        print(f\"   1. View gallery: ${BASE_URL}/api/v1/gallery\")
        print(f\"   2. Search logos: ${BASE_URL}/api/v1/gallery?tag=logo\")
        print(f\"   3. Find official logo: ${BASE_URL}/api/v1/gallery?search=officialheaderlogo\")
    else:
        print(f\"❌ Error: {data.get('error', 'Unknown error')}\")
except Exception as e:
    print(f\"❌ Parse error: {e}\")
    print(sys.stdin.read())
"

echo ""
echo "✅ Done!"
