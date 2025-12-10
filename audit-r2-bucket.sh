#!/bin/bash
# Comprehensive R2 Bucket Audit for meauxbilityorgfinal

ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
BUCKET_NAME="meauxbilityorgfinal"
TOKEN="yqLE1H7KFOkFkz26isnLYEXDMMXxv_-RsiRubFzC"

echo "🔍 R2 Bucket Audit: meauxbilityorgfinal"
echo "=========================================="
echo ""

# Get all objects
echo "📦 Fetching all objects..."
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET_NAME}/objects" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" > /tmp/r2_objects.json

python3 << 'PYTHON_SCRIPT'
import json
import os
from collections import defaultdict
from datetime import datetime

with open('/tmp/r2_objects.json', 'r') as f:
    data = json.load(f)

if not data.get('success'):
    print("❌ Error fetching objects")
    exit(1)

objects = data.get('result', [])
total_files = len(objects)
total_size = sum(obj.get('size', 0) for obj in objects)

print(f"📊 Total Files: {total_files}")
print(f"💾 Total Size: {total_size / 1024 / 1024:.2f} MB")
print("")

# Categorize files
categories = {
    'html_pages': [],
    'images': [],
    'css': [],
    'js': [],
    'assets_3d': [],
    'assets_other': [],
    'apps': [],
    'pages': [],
    'other': []
}

for obj in objects:
    key = obj.get('key', '')
    size = obj.get('size', 0)
    modified = obj.get('last_modified', '')
    
    if key.endswith('.html'):
        if key.startswith('pages/'):
            categories['pages'].append((key, size, modified))
        else:
            categories['html_pages'].append((key, size, modified))
    elif key.endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico')):
        categories['images'].append((key, size, modified))
    elif key.endswith('.css'):
        categories['css'].append((key, size, modified))
    elif key.endswith(('.js', '.mjs')):
        categories['js'].append((key, size, modified))
    elif '3d' in key.lower() or key.endswith(('.glb', '.gltf')):
        categories['assets_3d'].append((key, size, modified))
    elif key.startswith('assets/'):
        categories['assets_other'].append((key, size, modified))
    elif key.startswith('apps/'):
        categories['apps'].append((key, size, modified))
    else:
        categories['other'].append((key, size, modified))

# Print audit report
print("=" * 60)
print("📋 AUDIT REPORT")
print("=" * 60)
print("")

# Pages
print(f"📄 HTML Pages (pages/): {len(categories['pages'])}")
if categories['pages']:
    for key, size, mod in sorted(categories['pages'])[:10]:
        print(f"   - {key} ({size/1024:.1f} KB)")
    if len(categories['pages']) > 10:
        print(f"   ... and {len(categories['pages']) - 10} more")
print("")

# Other HTML
print(f"🌐 Other HTML Files: {len(categories['html_pages'])}")
if categories['html_pages']:
    for key, size, mod in sorted(categories['html_pages'])[:10]:
        print(f"   - {key} ({size/1024:.1f} KB)")
    if len(categories['html_pages']) > 10:
        print(f"   ... and {len(categories['html_pages']) - 10} more")
print("")

# Images
print(f"🖼️  Images: {len(categories['images'])}")
img_size = sum(s for _, s, _ in categories['images'])
print(f"   Total size: {img_size / 1024 / 1024:.2f} MB")
if categories['images']:
    for key, size, mod in sorted(categories['images'])[:10]:
        print(f"   - {key} ({size/1024:.1f} KB)")
    if len(categories['images']) > 10:
        print(f"   ... and {len(categories['images']) - 10} more")
print("")

# CSS
print(f"🎨 CSS Files: {len(categories['css'])}")
if categories['css']:
    for key, size, mod in sorted(categories['css']):
        print(f"   - {key} ({size/1024:.1f} KB)")
print("")

# JavaScript
print(f"📜 JavaScript Files: {len(categories['js'])}")
js_size = sum(s for _, s, _ in categories['js'])
print(f"   Total size: {js_size / 1024 / 1024:.2f} MB")
if categories['js']:
    for key, size, mod in sorted(categories['js'])[:10]:
        print(f"   - {key} ({size/1024:.1f} KB)")
    if len(categories['js']) > 10:
        print(f"   ... and {len(categories['js']) - 10} more")
print("")

# 3D Assets
print(f"🎮 3D Assets: {len(categories['assets_3d'])}")
assets3d_size = sum(s for _, s, _ in categories['assets_3d'])
print(f"   Total size: {assets3d_size / 1024 / 1024:.2f} MB")
if categories['assets_3d']:
    for key, size, mod in sorted(categories['assets_3d'])[:5]:
        print(f"   - {key} ({size/1024/1024:.2f} MB)")
print("")

# Other Assets
print(f"📦 Other Assets: {len(categories['assets_other'])}")
if categories['assets_other']:
    for key, size, mod in sorted(categories['assets_other'])[:10]:
        print(f"   - {key} ({size/1024:.1f} KB)")
    if len(categories['assets_other']) > 10:
        print(f"   ... and {len(categories['assets_other']) - 10} more")
print("")

# Apps
print(f"📱 Apps: {len(categories['apps'])}")
if categories['apps']:
    for key, size, mod in sorted(categories['apps']):
        print(f"   - {key} ({size/1024:.1f} KB)")
print("")

# Other files
print(f"📁 Other Files: {len(categories['other'])}")
if categories['other']:
    for key, size, mod in sorted(categories['other'])[:20]:
        print(f"   - {key} ({size/1024:.1f} KB)")
    if len(categories['other']) > 20:
        print(f"   ... and {len(categories['other']) - 20} more")
print("")

# Analysis
print("=" * 60)
print("🔍 ANALYSIS")
print("=" * 60)
print("")

# Check for expected pages
expected_pages = [
    'pages/about-us.html',
    'pages/team-meauxbility.html',
    'pages/contact.html',
    'pages/faq.html',
    'pages/apply-for-funding.html',
    'pages/mobility-grants-programs.html',
    'pages/community.html',
    'pages/resources-and-information.html',
    'pages/get-involved.html',
    'pages/donate.html',
    'pages/meauxbility-branding.html',
    'pages/news-media-features.html',
    'pages/non-profit-information.html',
    'pages/sam-primeaux.html',
    'pages/accessibility-partners.html',
]

existing_pages = {key for key, _, _ in categories['pages']}
missing_pages = [p for p in expected_pages if p not in existing_pages]

print(f"✅ Existing Pages: {len(existing_pages)}")
print(f"⚠️  Missing Pages: {len(missing_pages)}")
if missing_pages:
    print("   Missing:")
    for p in missing_pages:
        print(f"   - {p}")
print("")

# Check for large files
large_files = [(k, s, m) for k, s, m in objects if s > 5 * 1024 * 1024]  # > 5MB
if large_files:
    print(f"⚠️  Large Files (>5MB): {len(large_files)}")
    for key, size, mod in sorted(large_files, key=lambda x: x[1], reverse=True)[:10]:
        print(f"   - {key} ({size/1024/1024:.2f} MB)")
    print("")

# Check for old files (not modified recently)
from datetime import datetime, timezone
now = datetime.now(timezone.utc)
old_files = []
for obj in objects:
    mod_str = obj.get('last_modified', '')
    if mod_str:
        try:
            mod_date = datetime.fromisoformat(mod_str.replace('Z', '+00:00'))
            days_old = (now - mod_date).days
            if days_old > 90:
                old_files.append((obj.get('key'), days_old))
        except:
            pass

if old_files:
    print(f"📅 Old Files (>90 days): {len(old_files)}")
    for key, days in sorted(old_files, key=lambda x: x[1], reverse=True)[:10]:
        print(f"   - {key} ({days} days old)")
    print("")

# Structure analysis
print("=" * 60)
print("📂 STRUCTURE ANALYSIS")
print("=" * 60)
print("")

prefixes = defaultdict(int)
for obj in objects:
    key = obj.get('key', '')
    if '/' in key:
        prefix = key.split('/')[0] + '/'
        prefixes[prefix] += 1
    else:
        prefixes['(root)'] += 1

print("Top-level directories:")
for prefix, count in sorted(prefixes.items(), key=lambda x: x[1], reverse=True):
    print(f"   {prefix}: {count} files")

print("")
print("=" * 60)
print("✅ Audit Complete")
print("=" * 60)

PYTHON_SCRIPT

rm -f /tmp/r2_objects.json
