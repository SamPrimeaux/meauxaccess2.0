# 🐾 Southern Pets Animal Rescue Gallery Setup

## ✅ What's Been Created

### Gallery Management API ✅
- **Upload Images**: Upload animal photos to R2
- **List Images**: View all images with pagination and search
- **Update Metadata**: Edit titles, descriptions, animal assignments
- **Delete Images**: Soft delete with trashbin (14-day retention)
- **Restore Images**: Restore deleted images from trashbin

### Trashbin System ✅
- **14-Day Retention**: Deleted images stay in trashbin for 14 days
- **Automatic Cleanup**: Scheduled worker runs daily to permanently delete expired items
- **Restore Function**: Restore images before they expire
- **R2 Storage**: Dedicated trashbin bucket for safe storage

---

## 🚀 Setup Steps

### Step 1: Create R2 Trashbin Bucket

1. **Go to Cloudflare Dashboard**:
   - Navigate to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/r2/buckets

2. **Create New Bucket**:
   - Click "Create bucket"
   - Name: `trashbinsouthernpets`
   - Location: Western North America (WNAM) or your preferred region
   - Click "Create bucket"

### Step 2: Set Up Database Tables

Run the SQL schema to create the tables:

```bash
# Using Wrangler
wrangler d1 execute southernpetsanimalrescue --file=./database-southernpets-gallery.sql

# Or via Cloudflare Dashboard
# Go to: Workers & Pages → D1 → southernpetsanimalrescue → Execute SQL
# Copy and paste contents of database-southernpets-gallery.sql
```

**Tables Created:**
- `animal_images` - Main gallery table
- `trashbin_southernpets` - Trashbin table for soft deletes

### Step 3: Configure Worker Bindings

Add these bindings to your `southernpetsanimalrescue` worker:

**In `wrangler.toml` or via Dashboard:**

```toml
[[r2_buckets]]
binding = "R2_SOUTHERNPETS"
bucket_name = "southernpetsanimalrescue"

[[r2_buckets]]
binding = "R2_TRASHBIN_SOUTHERNPETS"
bucket_name = "trashbinsouthernpets"

[[d1_databases]]
binding = "DB"
database_name = "southernpetsanimalrescue"
database_id = "YOUR_DATABASE_ID"
```

**Or via Dashboard:**
1. Go to: Workers & Pages → `southernpetsanimalrescue` → Settings → Variables and Secrets
2. Add R2 Bucket bindings:
   - `R2_SOUTHERNPETS` → `southernpetsanimalrescue`
   - `R2_TRASHBIN_SOUTHERNPETS` → `trashbinsouthernpets`
3. Add D1 Database binding:
   - `DB` → `southernpetsanimalrescue`

### Step 4: Add API Routes to Worker

Add these routes to your `southernpetsanimalrescue` worker's main handler:

```typescript
import {
  handleGalleryList,
  handleGalleryUpload,
  handleGalleryUpdate,
  handleGalleryDelete,
  handleTrashbinList,
  handleTrashbinRestore,
} from './southernpets-gallery-api';

// In your main fetch handler, add:

// Gallery API Routes
if (path === '/api/gallery' && request.method === 'GET') {
  return handleGalleryList(request, env);
}

if (path === '/api/gallery/upload' && request.method === 'POST') {
  return handleGalleryUpload(request, env);
}

if (path === '/api/gallery/update' && (request.method === 'PUT' || request.method === 'POST')) {
  return handleGalleryUpdate(request, env);
}

if (path === '/api/gallery/delete' && request.method === 'DELETE') {
  return handleGalleryDelete(request, env);
}

// Trashbin API Routes
if (path === '/api/gallery/trashbin' && request.method === 'GET') {
  return handleTrashbinList(request, env);
}

if (path === '/api/gallery/trashbin/restore' && request.method === 'POST') {
  return handleTrashbinRestore(request, env);
}
```

### Step 5: Set Up Scheduled Cleanup Worker

**Option A: Separate Cleanup Worker (Recommended)**

1. **Create `wrangler.trashbin-cleanup.toml`**:
```toml
name = "southernpets-trashbin-cleanup"
main = "src/southernpets-trashbin-cleanup.ts"
compatibility_date = "2024-11-24"
compatibility_flags = ["nodejs_compat"]

account_id = "ede6590ac0d2fb7daf155b35653457b2"

[[d1_databases]]
binding = "DB"
database_name = "southernpetsanimalrescue"
database_id = "YOUR_DATABASE_ID"

[[r2_buckets]]
binding = "R2_TRASHBIN_SOUTHERNPETS"
bucket_name = "trashbinsouthernpets"

[triggers]
crons = ["0 2 * * *"]  # Daily at 2 AM UTC
```

2. **Deploy cleanup worker**:
```bash
wrangler deploy --config wrangler.trashbin-cleanup.toml
```

**Option B: Add Cron to Main Worker**

Add to your main `southernpetsanimalrescue` worker's `wrangler.toml`:

```toml
[triggers]
crons = ["0 2 * * *"]  # Daily at 2 AM UTC
```

And add the scheduled handler:

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // ... existing fetch handler
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const { handleTrashbinCleanup } = await import('./southernpets-gallery-api');
    await handleTrashbinCleanup(env);
  },
};
```

---

## 📡 API Endpoints

### Gallery Management

**List Images:**
```bash
GET /api/gallery?page=1&per_page=50&animalId=123&search=dog
```

**Upload Image:**
```bash
POST /api/gallery/upload
Content-Type: multipart/form-data

file: [File]
animalId: "optional-animal-id"
animalName: "optional-animal-name"
title: "Photo Title"
description: "Photo description"
isPrimary: "true" or "false"
```

**Update Image:**
```bash
PUT /api/gallery/update
Content-Type: application/json

{
  "id": "image-id",
  "title": "New Title",
  "description": "New Description",
  "animalId": "animal-id",
  "isPrimary": true
}
```

**Delete Image (Move to Trashbin):**
```bash
DELETE /api/gallery/delete?id=image-id
```

### Trashbin Management

**List Trashbin Items:**
```bash
GET /api/gallery/trashbin
```

**Restore from Trashbin:**
```bash
POST /api/gallery/trashbin/restore?id=trashbin-item-id
```

---

## 🎯 Frontend Integration

Update your gallery page (`/gallery`) to use these endpoints:

### Example: Upload Image

```javascript
async function uploadImage(file, animalId, title, description) {
  const formData = new FormData();
  formData.append('file', file);
  if (animalId) formData.append('animalId', animalId);
  if (title) formData.append('title', title);
  if (description) formData.append('description', description);

  const response = await fetch('/api/gallery/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    console.log('Image uploaded:', data.image);
    // Refresh gallery
    loadGallery();
  }
}
```

### Example: Delete Image

```javascript
async function deleteImage(imageId) {
  if (!confirm('Move this image to trashbin? It will be permanently deleted after 14 days.')) {
    return;
  }

  const response = await fetch(`/api/gallery/delete?id=${imageId}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  if (data.success) {
    alert('Image moved to trashbin. You can restore it within 14 days.');
    loadGallery();
  }
}
```

### Example: Load Gallery

```javascript
async function loadGallery(page = 1, search = '') {
  const url = new URL('/api/gallery', window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('per_page', 50);
  if (search) url.searchParams.set('search', search);

  const response = await fetch(url);
  const data = await response.json();

  if (data.success) {
    displayImages(data.images);
    updatePagination(data.pagination);
  }
}
```

---

## 🗑️ Trashbin Features

### How It Works:
1. **Delete Image**: Click delete → Image moves to trashbin (not permanently deleted)
2. **14-Day Grace Period**: Image stays in trashbin for 14 days
3. **Automatic Cleanup**: After 14 days, image is permanently deleted by scheduled worker
4. **Restore Anytime**: Restore images from trashbin before they expire

### Trashbin Storage:
- **R2 Bucket**: `trashbinsouthernpets`
- **Database Table**: `trashbin_southernpets`
- **Cleanup Schedule**: Daily at 2:00 AM UTC

---

## ✅ Verification

After setup, test:

1. **Upload an image**:
   ```bash
   curl -X POST https://southernpetsanimalrescue.com/api/gallery/upload \
     -F "file=@test.jpg" \
     -F "title=Test Image"
   ```

2. **List images**:
   ```bash
   curl https://southernpetsanimalrescue.com/api/gallery
   ```

3. **Delete an image**:
   ```bash
   curl -X DELETE "https://southernpetsanimalrescue.com/api/gallery/delete?id=IMAGE_ID"
   ```

4. **Check trashbin**:
   ```bash
   curl https://southernpetsanimalrescue.com/api/gallery/trashbin
   ```

5. **Restore from trashbin**:
   ```bash
   curl -X POST "https://southernpetsanimalrescue.com/api/gallery/trashbin/restore?id=TRASHBIN_ID"
   ```

---

## 📊 Database Schema

### `animal_images` Table:
- `id` (TEXT PRIMARY KEY)
- `animalId` (TEXT) - Links to animal if assigned
- `animalName` (TEXT)
- `filename` (TEXT)
- `title` (TEXT)
- `description` (TEXT)
- `url` (TEXT) - R2 public URL
- `thumbnailUrl` (TEXT)
- `uploadedAt` (TEXT)
- `updatedAt` (TEXT)
- `fileSize` (INTEGER)
- `width` (INTEGER)
- `height` (INTEGER)
- `mimeType` (TEXT)
- `isPrimary` (INTEGER) - 1 if primary photo for animal
- `metadata` (TEXT) - JSON string

### `trashbin_southernpets` Table:
- `id` (TEXT PRIMARY KEY)
- `originalId` (TEXT) - Original image ID
- `originalData` (TEXT) - JSON string of AnimalImage
- `deletedAt` (TEXT)
- `expiresAt` (TEXT) - 14 days from deletion
- `originalBucket` (TEXT)
- `originalPath` (TEXT)

---

## 🔧 Troubleshooting

### Images not uploading:
- Check R2 bucket binding: `R2_SOUTHERNPETS` or `R2_STORAGE`
- Verify bucket exists and is accessible
- Check file size limits

### Trashbin not working:
- Verify `trashbinsouthernpets` bucket exists
- Check `R2_TRASHBIN_SOUTHERNPETS` binding
- Ensure database table `trashbin_southernpets` exists

### Cleanup not running:
- Check cron schedule in `wrangler.toml`
- Verify scheduled handler is exported
- Check worker logs for errors

---

**Last Updated**: January 2025  
**Worker**: southernpetsanimalrescue  
**Database**: southernpetsanimalrescue  
**R2 Buckets**: `southernpetsanimalrescue`, `trashbinsouthernpets`
