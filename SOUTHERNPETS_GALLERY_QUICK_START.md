# 🚀 Southern Pets Gallery - Quick Start

## ✅ What You Need to Do

### 1. Create Trashbin R2 Bucket (2 minutes)

**Via Dashboard:**
1. Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/r2/buckets
2. Click "Create bucket"
3. Name: `trashbinsouthernpets`
4. Location: Western North America (WNAM)
5. Click "Create bucket"

**Done!** ✅

---

### 2. Run Database Schema (1 minute)

**Via Wrangler CLI:**
```bash
wrangler d1 execute southernpetsanimalrescue --file=./database-southernpets-gallery.sql
```

**Or via Dashboard:**
1. Go to: Workers & Pages → D1 → `southernpetsanimalrescue`
2. Click "Execute SQL"
3. Copy/paste contents of `database-southernpets-gallery.sql`
4. Click "Run"

**Done!** ✅

---

### 3. Add R2 Bindings to Worker (2 minutes)

**Via Dashboard:**
1. Go to: Workers & Pages → `southernpetsanimalrescue` → Settings → Variables and Secrets
2. Scroll to "R2 Bucket Bindings"
3. Click "Add binding"
   - **Variable name**: `R2_TRASHBIN_SOUTHERNPETS`
   - **R2 bucket**: `trashbinsouthernpets`
4. Click "Save"

**Note:** `R2_SOUTHERNPETS` or `R2_STORAGE` should already be bound to `southernpetsanimalrescue` bucket.

**Done!** ✅

---

### 4. Add API Routes to Worker (5 minutes)

You need to add the gallery API routes to your `southernpetsanimalrescue` worker.

**Find your worker file** (likely in `src/` or root):
- Look for the main `fetch` handler
- Add these imports at the top:

```typescript
import {
  handleGalleryList,
  handleGalleryUpload,
  handleGalleryUpdate,
  handleGalleryDelete,
  handleTrashbinList,
  handleTrashbinRestore,
} from './southernpets-gallery-api';
```

**Add routes in your fetch handler** (where you handle `/api/*` paths):

```typescript
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

**Deploy:**
```bash
wrangler deploy --name southernpetsanimalrescue
```

**Done!** ✅

---

### 5. Set Up Scheduled Cleanup (Optional - 3 minutes)

**Option A: Separate Worker (Recommended)**

1. Get your database ID:
   - Go to: Workers & Pages → D1 → `southernpetsanimalrescue`
   - Copy the Database ID

2. Update `wrangler.trashbin-cleanup.toml`:
   - Replace `# database_id` with actual ID

3. Deploy cleanup worker:
   ```bash
   wrangler deploy --config wrangler.trashbin-cleanup.toml
   ```

**Option B: Add to Main Worker**

Add to your main worker's `wrangler.toml`:
```toml
[triggers]
crons = ["0 2 * * *"]  # Daily at 2 AM UTC
```

And add scheduled handler to your worker:
```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // ... your existing fetch handler
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const { handleTrashbinCleanup } = await import('./southernpets-gallery-api');
    await handleTrashbinCleanup(env);
  },
};
```

**Done!** ✅

---

## 🧪 Test It

### Test Upload:
```bash
curl -X POST https://southernpetsanimalrescue.com/api/gallery/upload \
  -F "file=@test.jpg" \
  -F "title=Test Image"
```

### Test List:
```bash
curl https://southernpetsanimalrescue.com/api/gallery
```

### Test Delete:
```bash
curl -X DELETE "https://southernpetsanimalrescue.com/api/gallery/delete?id=IMAGE_ID"
```

### Test Trashbin:
```bash
curl https://southernpetsanimalrescue.com/api/gallery/trashbin
```

---

## 📝 Frontend Update

Update your `/gallery` page to use these endpoints. See `SOUTHERNPETS_GALLERY_SETUP.md` for examples.

**Key endpoints:**
- `GET /api/gallery` - List images
- `POST /api/gallery/upload` - Upload image
- `PUT /api/gallery/update` - Update image
- `DELETE /api/gallery/delete?id=IMAGE_ID` - Delete (move to trashbin)
- `GET /api/gallery/trashbin` - List trashbin items
- `POST /api/gallery/trashbin/restore?id=TRASHBIN_ID` - Restore from trashbin

---

## ✅ Checklist

- [ ] Trashbin R2 bucket created (`trashbinsouthernpets`)
- [ ] Database tables created (`animal_images`, `trashbin_southernpets`)
- [ ] R2 bindings added to worker
- [ ] API routes added to worker
- [ ] Worker deployed
- [ ] Scheduled cleanup configured (optional)
- [ ] Frontend updated to use new endpoints
- [ ] Tested upload/delete/restore

---

**That's it!** Your gallery is now fully functional with trashbin support! 🎉
