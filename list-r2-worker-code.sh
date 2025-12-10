#!/bin/bash
# List all files in meauxbilityorgfinal R2 bucket to find damnsam worker code

echo "🔍 Listing all files in meauxbilityorgfinal R2 bucket..."
echo ""

# Use the CMS API to list all files
curl -s "https://www.meauxbility.org/api/cms/list" | python3 -c "
import json
import sys

try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print('📄 HTML Pages:')
        for page in data.get('pages', []):
            print(f'  - {page[\"path\"]}')
        
        print('\n🖼️ Images:')
        for img in data.get('images', []):
            print(f'  - {img[\"path\"]}')
        
        print('\n🔍 Looking for worker code files...')
        all_files = data.get('pages', []) + data.get('images', [])
        
        worker_files = [f for f in all_files if any(x in f['path'].lower() for x in ['index.ts', 'index.js', 'worker', 'damnsam', 'src/', '.ts', '.js'])]
        
        if worker_files:
            print('\n✅ Found potential worker code files:')
            for f in worker_files:
                print(f'  - {f[\"path\"]}')
        else:
            print('\n⚠️ No obvious worker code files found in pages/images')
            print('   Worker code might be in root or different location')
    else:
        print('❌ Error:', data.get('error', 'Unknown error'))
except Exception as e:
    print(f'❌ Error parsing response: {e}')
"

echo ""
echo "💡 To see ALL files, check Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com → R2 → meauxbilityorgfinal"
