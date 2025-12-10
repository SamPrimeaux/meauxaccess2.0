#!/bin/bash

# Example script to remaster HTML using the API

API_URL="https://meauxmcp.meauxbility.workers.dev/api/remaster"
HTML_FILE="$1"
OUTPUT_FILE="${HTML_FILE%.html}-remastered.html"

if [ -z "$HTML_FILE" ]; then
  echo "Usage: ./remaster-html-example.sh <input.html>"
  exit 1
fi

if [ ! -f "$HTML_FILE" ]; then
  echo "Error: File not found: $HTML_FILE"
  exit 1
fi

echo "?? Remastering $HTML_FILE..."

# Read HTML content
HTML_CONTENT=$(cat "$HTML_FILE")

# Create remaster request
REQUEST_JSON=$(cat <<EOF
{
  "html": $(echo "$HTML_CONTENT" | jq -Rs .),
  "options": {
    "brandName": "MeauxCloud",
    "addMeauxBranding": true,
    "optimizeForCloudflare": true,
    "addCLI": true,
    "addChat": true,
    "addBrowser": true,
    "responsive": true,
    "darkMode": true,
    "uploadToR2": false,
    "filename": "$(basename "$HTML_FILE")"
  }
}
EOF
)

# Call remaster API
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$REQUEST_JSON")

# Extract remastered HTML
REMASTERED=$(echo "$RESPONSE" | jq -r '.remastered')

if [ "$REMASTERED" != "null" ] && [ -n "$REMASTERED" ]; then
  echo "$REMASTERED" > "$OUTPUT_FILE"
  echo "? Remastered HTML saved to: $OUTPUT_FILE"
  echo "?? Size: $(wc -c < "$OUTPUT_FILE") bytes"
else
  echo "? Error: Failed to remaster HTML"
  echo "Response: $RESPONSE"
  exit 1
fi
