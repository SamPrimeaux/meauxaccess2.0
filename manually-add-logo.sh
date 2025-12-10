#!/bin/bash
# Manually add the official header logo to gallery and set as default

BASE_URL="https://meauxaccess-dashboard-production.meauxbility.workers.dev"

echo "🎯 Setting Official Header Logo"
echo "================================"
echo ""

# The logo filename is: officialheaderlogo_meauxbility_logo_540.webp
# Uploaded "a few seconds ago" - it's the most recent image

echo "📝 To add the logo manually, you need the Cloudflare Images ID."
echo ""
echo "Option 1: Get ID from Cloudflare Dashboard"
echo "  1. Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/images"
echo "  2. Find: officialheaderlogo_meauxbility_logo_540.webp"
echo "  3. Copy the Image ID"
echo ""
echo "Option 2: Use the first image (most recent)"
echo ""

# Try to get the first image ID from the list
echo "Attempting to fetch most recent image..."
curl -s "${BASE_URL}/api/media/images?per_page=1" | python3 << 'PYTHON'
import json
import sys

try:
    data = json.load(sys.stdin)
    if data.get('success') and data.get('images') and len(data['images']) > 0:
        img = data['images'][0]
        image_id = img.get('id')
        filename = img.get('filename', 'N/A')
        
        if 'officialheaderlogo' in filename.lower():
            print(f"✅ Found logo: {filename}")
            print(f"   Image ID: {image_id}")
            print("")
            print("Adding to gallery...")
            print("")
            
            # Add to gallery
            import subprocess
            result = subprocess.run([
                'curl', '-X', 'POST',
                f'{BASE_URL}/api/v1/gallery/add',
                '-H', 'Content-Type: application/json',
                '-d', json.dumps({
                    'imageId': image_id,
                    'filename': filename,
                    'title': 'Official Header Logo',
                    'tags': ['logo', 'header', 'official'],
                    'category': 'branding'
                })
            ], capture_output=True, text=True)
            
            print(result.stdout)
        else:
            print(f"⚠️  Most recent image is: {filename}")
            print(f"   Image ID: {image_id}")
            print("")
            print("This might not be the logo. Please find the logo image ID manually.")
    else:
        print(f"❌ Error: {data.get('error', 'Unknown error')}")
except Exception as e:
    print(f"❌ Error: {e}")
PYTHON

echo ""
echo "✅ Done!"
