#!/bin/bash
# List all files in meauxbilityorgfinal R2 bucket using Cloudflare API

ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
BUCKET_NAME="meauxbilityorgfinal"
TOKEN="yqLE1H7KFOkFkz26isnLYEXDMMXxv_-RsiRubFzC"

echo "🔍 Listing ALL files in meauxbilityorgfinal R2 bucket..."
echo ""

# List objects in bucket
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET_NAME}/objects" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | python3 -c "
import json
import sys

try:
    data = json.load(sys.stdin)
    if data.get('success'):
        objects = data.get('result', {}).get('objects', [])
        print(f'📦 Found {len(objects)} files:\n')
        
        # Group by type
        html_files = []
        js_files = []
        ts_files = []
        other_files = []
        
        for obj in objects:
            key = obj.get('key', '')
            if key.endswith('.html'):
                html_files.append(key)
            elif key.endswith('.js') or key.endswith('.mjs'):
                js_files.append(key)
            elif key.endswith('.ts'):
                ts_files.append(key)
            else:
                other_files.append(key)
        
        if ts_files:
            print('🔷 TypeScript Files (Worker Code?):')
            for f in ts_files:
                print(f'  ✅ {f}')
            print('')
        
        if js_files:
            print('📜 JavaScript Files:')
            for f in js_files[:20]:  # Limit to first 20
                print(f'  - {f}')
            if len(js_files) > 20:
                print(f'  ... and {len(js_files) - 20} more')
            print('')
        
        if html_files:
            print('📄 HTML Pages:')
            for f in html_files[:10]:  # Limit to first 10
                print(f'  - {f}')
            if len(html_files) > 10:
                print(f'  ... and {len(html_files) - 10} more')
            print('')
        
        # Look for worker-related files
        worker_files = [f for f in objects if any(x in f.get('key', '').lower() for x in ['worker', 'damnsam', 'index.ts', 'index.js', 'src/', 'wrangler'])]
        
        if worker_files:
            print('🔧 Potential Worker Code Files:')
            for f in worker_files:
                print(f'  ⚡ {f.get(\"key\")}')
            print('')
        
        print(f'📊 Total: {len(objects)} files')
        
    else:
        errors = data.get('errors', [])
        print('❌ Error:', errors[0].get('message', 'Unknown error') if errors else 'Unknown error')
        print('\nFull response:')
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f'❌ Error: {e}')
    import traceback
    traceback.print_exc()
"
