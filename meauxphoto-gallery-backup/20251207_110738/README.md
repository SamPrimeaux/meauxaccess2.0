# MeauxPhoto Gallery Backup

**Backup Date**: Sun Dec  7 11:07:38 CST 2025
**Timestamp**: 20251207_110738

## Files Included

- `src/media-gallery.html.ts` - Gallery HTML/CSS/JS
- `src/media-gallery-api.ts` - Gallery API endpoints
- `src/meauxaccess-dashboard.ts` - Main worker with routing
- `wrangler.meauxaccess-dashboard-production.toml` - Worker configuration

## Gallery Features

- Image and video viewing (819 images, 42 videos)
- Search functionality
- Metadata editing
- Project organization
- OpenAI remastering
- Bulk delete operations

## Access

- **URL**: `/meauxphoto` or `/media-gallery`
- **Production**: `meauxbility.org/meauxphoto`

## Restore Instructions

1. Extract files from R2 bucket
2. Copy files to their original locations
3. Deploy with: `wrangler deploy --config wrangler.meauxaccess-dashboard-production.toml`

## R2 Bucket Info

- **Bucket**: `meauxphoto-content`
- **S3 API**: `https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com/meauxphoto-content`
- **Public URL**: `https://pub-79dcb071a17a49428c8ec3192e514166.r2.dev`
