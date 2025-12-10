#!/bin/bash
# Bulk remaster all provided HTML pages

BASE_URL="https://www.meauxbility.org"
TOKEN="yqLE1H7KFOkFkz26isnLYEXDMMXxv_-RsiRubFzC"

echo "🚀 Bulk Remastering All Pages"
echo "=============================="
echo ""

# Create JSON payload with all pages
# Note: The HTML content should be provided via files or the user will paste them

cat << 'EOF' > /tmp/pages-to-remaster.json
{
  "pages": [
    {
      "html": "PASTE_HOMEPAGE_HTML_HERE",
      "path": "index.html",
      "migrateImages": true
    },
    {
      "html": "PASTE_HOMEPAGE_VARIANT_HTML_HERE",
      "path": "index.html",
      "migrateImages": true
    },
    {
      "html": "PASTE_DONMICHAEL_CAMPAIGN_HTML_HERE",
      "path": "pages/donmichael-our-first-campaign.html",
      "migrateImages": true
    },
    {
      "html": "PASTE_PARTNERS_SECTION_HTML_HERE",
      "path": "pages/accessibility-partners.html",
      "migrateImages": true
    }
  ]
}
EOF

echo "📋 Pages to remaster:"
echo "  1. index.html (Homepage)"
echo "  2. pages/donmichael-our-first-campaign.html"
echo "  3. pages/accessibility-partners.html"
echo ""
echo "⚠️  Note: This script requires the HTML content to be provided."
echo "   Use the API endpoint directly or provide HTML files."
echo ""
echo "API Endpoint: POST $BASE_URL/api/pages/bulk-remaster"
echo ""
