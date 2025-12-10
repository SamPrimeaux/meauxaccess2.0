#!/bin/bash

# Backup MeauxPhoto Gallery Script
# Saves gallery files to meauxphoto-content R2 bucket
# Usage: ./backup-meauxphoto-gallery.sh

set -e

echo "📦 Starting MeauxPhoto Gallery Backup..."
echo ""

# Configuration
BUCKET_NAME="meauxphoto-content"
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
R2_ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
BACKUP_DIR="meauxphoto-gallery-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"

# Files to backup
FILES=(
  "src/media-gallery.html.ts"
  "src/media-gallery-api.ts"
  "src/meauxaccess-dashboard.ts"
  "wrangler.meauxaccess-dashboard-production.toml"
)

# Create backup directory structure
mkdir -p "${BACKUP_PATH}"

echo "📋 Files to backup:"
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ⚠️  $file (not found)"
  fi
done
echo ""

# Copy files to backup directory
echo "📥 Copying files to backup directory..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Create directory structure in backup
    dir=$(dirname "$file")
    mkdir -p "${BACKUP_PATH}/${dir}"
    cp "$file" "${BACKUP_PATH}/${file}"
    echo "  ✅ Copied: $file"
  fi
done
echo ""

# Create README with backup info
cat > "${BACKUP_PATH}/README.md" << EOF
# MeauxPhoto Gallery Backup

**Backup Date**: $(date)
**Timestamp**: ${TIMESTAMP}

## Files Included

- \`src/media-gallery.html.ts\` - Gallery HTML/CSS/JS
- \`src/media-gallery-api.ts\` - Gallery API endpoints
- \`src/meauxaccess-dashboard.ts\` - Main worker with routing
- \`wrangler.meauxaccess-dashboard-production.toml\` - Worker configuration

## Gallery Features

- Image and video viewing (819 images, 42 videos)
- Search functionality
- Metadata editing
- Project organization
- OpenAI remastering
- Bulk delete operations

## Access

- **URL**: \`/meauxphoto\` or \`/media-gallery\`
- **Production**: \`meauxbility.org/meauxphoto\`

## Restore Instructions

1. Extract files from R2 bucket
2. Copy files to their original locations
3. Deploy with: \`wrangler deploy --config wrangler.meauxaccess-dashboard-production.toml\`

## R2 Bucket Info

- **Bucket**: \`meauxphoto-content\`
- **S3 API**: \`${R2_ENDPOINT}/${BUCKET_NAME}\`
- **Public URL**: \`https://pub-79dcb071a17a49428c8ec3192e514166.r2.dev\`
EOF

echo "📝 Created README.md"
echo ""

# Check if wrangler is available
if ! command -v wrangler &> /dev/null; then
  echo "⚠️  Wrangler CLI not found. Installing dependencies..."
  npm install -g wrangler
fi

# Upload to R2 using wrangler
echo "☁️  Uploading to R2 bucket: ${BUCKET_NAME}..."
echo ""

# Create a tarball for easier backup
TARBALL="${BACKUP_DIR}/meauxphoto-gallery-${TIMESTAMP}.tar.gz"
tar -czf "${TARBALL}" -C "${BACKUP_DIR}" "${TIMESTAMP}"

echo "📦 Created tarball: ${TARBALL}"
echo ""

# Upload using wrangler R2
echo "Uploading files to R2..."
wrangler r2 object put "${BUCKET_NAME}/backups/meauxphoto-gallery-${TIMESTAMP}.tar.gz" --file="${TARBALL}" || {
  echo "⚠️  Wrangler upload failed. Trying alternative method..."
  echo ""
  echo "📋 Manual upload instructions:"
  echo "   1. Install AWS CLI or use Cloudflare Dashboard"
  echo "   2. Upload files from: ${BACKUP_PATH}"
  echo "   3. Or upload tarball: ${TARBALL}"
  echo ""
  echo "   S3 API Endpoint: ${R2_ENDPOINT}/${BUCKET_NAME}"
  echo ""
  exit 1
}

# Also upload individual files for easier access
echo "Uploading individual files..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    wrangler r2 object put "${BUCKET_NAME}/gallery-scripts/${filename}" --file="$file" || {
      echo "  ⚠️  Failed to upload: $filename"
    }
  fi
done

# Upload README
wrangler r2 object put "${BUCKET_NAME}/backups/README-${TIMESTAMP}.md" --file="${BACKUP_PATH}/README.md" || {
  echo "  ⚠️  Failed to upload README"
}

echo ""
echo "✅ Backup complete!"
echo ""
echo "📊 Backup Summary:"
echo "   📁 Local backup: ${BACKUP_PATH}"
echo "   📦 Tarball: ${TARBALL}"
echo "   ☁️  R2 Bucket: ${BUCKET_NAME}"
echo "   📍 R2 Path: backups/meauxphoto-gallery-${TIMESTAMP}.tar.gz"
echo ""
echo "🔗 Access files at:"
echo "   ${R2_ENDPOINT}/${BUCKET_NAME}/backups/"
echo "   https://pub-79dcb071a17a49428c8ec3192e514166.r2.dev/backups/"
echo ""
