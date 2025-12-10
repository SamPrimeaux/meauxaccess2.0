#!/bin/bash
# Find the Meauxbility logo in Cloudflare Images

ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
ACCOUNT_HASH="g7wf09fCONpnidkRnR_5vw"
API_TOKEN="D7SfwPBHfIOj4yn86jT1QVnr7KNHb6K5"

echo "🔍 Fetching last 100 images from Cloudflare Images..."
echo ""

# Fetch images
RESPONSE=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1?per_page=100" \
  -H "Authorization: Bearer ${API_TOKEN}")

# Parse and find logo
echo "$RESPONSE" | python3 << 'PYTHON'
import json
import sys

data = json.load(sys.stdin)

if not data.get('success'):
    print(f"❌ Error: {data.get('errors', 'Unknown error')}")
    sys.exit(1)

images = data.get('result', {}).get('images', [])

print(f"📊 Found {len(images)} images")
print("")
print("🔍 Searching for logo images...")
print("")

logo_candidates = []

for img in images:
    filename = img.get('filename', '').lower()
    image_id = img.get('id', '')
    
    # Check if filename contains logo-related keywords
    if any(keyword in filename for keyword in ['logo', 'wordmark', 'meauxbility', 'brand']):
        variants = img.get('variants', [])
        variant = 'public' if 'public' in variants else (variants[0] if variants else 'public')
        delivery_url = f"https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/{image_id}/{variant}"
        
        logo_candidates.append({
            'id': image_id,
            'filename': img.get('filename', 'N/A'),
            'uploaded': img.get('uploaded', 'N/A'),
            'url': delivery_url
        })

if logo_candidates:
    print("✅ Found logo candidates:")
    print("")
    for i, logo in enumerate(logo_candidates, 1):
        print(f"{i}. {logo['filename']}")
        print(f"   ID: {logo['id']}")
        print(f"   Uploaded: {logo['uploaded']}")
        print(f"   URL: {logo['url']}")
        print("")
    
    # Use the most recent one
    latest = logo_candidates[0]
    print("🎯 Using most recent logo:")
    print(f"   {latest['url']}")
    print("")
    print(f"📝 Update getLogoUrl() default to:")
    print(f"   return '{latest['url']}';")
else:
    print("⚠️  No logo images found in last 100 images")
    print("")
    print("📋 Recent images (first 10):")
    for i, img in enumerate(images[:10], 1):
        print(f"{i}. {img.get('filename', 'N/A')} (ID: {img.get('id', 'N/A')[:20]}...)")
PYTHON
