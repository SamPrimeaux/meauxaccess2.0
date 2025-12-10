# 🚀 V1 Gallery Integration for damnsam Worker

## ✅ What's Ready

- ✅ **API Token Secret** - Already set in damnsam: `CLOUDFLARE_IMAGES_API_TOKEN`
- ✅ **V1 Gallery Code** - Ready to copy
- ✅ **Routes** - Ready to add

---

## 📋 Step-by-Step Integration

### **Step 1: Copy V1 Gallery API File**

1. **Copy the file:**
   - Source: `src/v1-gallery-api.ts` (or `DAMNSAM_v1-gallery-api.ts`)
   - Destination: Add to damnsam worker (as `v1-gallery-api.ts` or inline)

2. **In Cloudflare Dashboard:**
   - Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/damnsam
   - Click **"Quick Edit"** or **"Edit Code"**
   - Add the entire contents of `v1-gallery-api.ts` to your worker

---

### **Step 2: Add Routes to damnsam**

Add these routes to damnsam's main fetch handler (where you handle `path`):

```typescript
// V1 Gallery API Routes
if (path === '/api/v1/gallery' && request.method === 'GET') {
  const { handleV1GalleryList } = await import('./v1-gallery-api');
  return handleV1GalleryList(request, env);
}

if (path === '/api/v1/gallery/add' && request.method === 'POST') {
  const { handleV1GalleryAdd } = await import('./v1-gallery-api');
  return handleV1GalleryAdd(request, env);
}

if (path === '/api/v1/gallery/import' && request.method === 'POST') {
  const { handleV1GalleryBulkImport } = await import('./v1-gallery-api');
  return handleV1GalleryBulkImport(request, env);
}

if (path === '/api/v1/gallery/get' && request.method === 'GET') {
  const { handleV1GalleryGet } = await import('./v1-gallery-api');
  return handleV1GalleryGet(request, env);
}

if (path === '/api/v1/gallery/update' && (request.method === 'PUT' || request.method === 'POST')) {
  const { handleV1GalleryUpdate } = await import('./v1-gallery-api');
  return handleV1GalleryUpdate(request, env);
}

if (path === '/api/v1/gallery/delete' && request.method === 'DELETE') {
  const { handleV1GalleryDelete } = await import('./v1-gallery-api');
  return handleV1GalleryDelete(request, env);
}
```

**OR** if you inline the code instead of importing:

```typescript
// V1 Gallery API Routes
if (path === '/api/v1/gallery' && request.method === 'GET') {
  return handleV1GalleryList(request, env);
}

if (path === '/api/v1/gallery/add' && request.method === 'POST') {
  return handleV1GalleryAdd(request, env);
}

if (path === '/api/v1/gallery/import' && request.method === 'POST') {
  return handleV1GalleryBulkImport(request, env);
}

if (path === '/api/v1/gallery/get' && request.method === 'GET') {
  return handleV1GalleryGet(request, env);
}

if (path === '/api/v1/gallery/update' && (request.method === 'PUT' || request.method === 'POST')) {
  return handleV1GalleryUpdate(request, env);
}

if (path === '/api/v1/gallery/delete' && request.method === 'DELETE') {
  return handleV1GalleryDelete(request, env);
}
```

---

### **Step 3: Update getLogoUrl() Function**

Find your `getLogoUrl()` function in damnsam and replace it with the version from `DAMNSAM_V1_GALLERY_COMPLETE.ts` (see that file for the complete function).

**Key changes:**
- Checks KV cache first
- Queries Cloudflare Images API for `officialheaderlogo`
- Caches result in KV
- No more Shopify CDN URLs

---

### **Step 4: Update injectHeader() Function**

Make sure `injectHeader()` calls `getLogoUrl(env)` and accepts `env` as a parameter.

Update all calls to `injectHeader()` to pass the `env` object.

---

### **Step 5: Ensure Environment Variables**

Make sure damnsam has these in `wrangler.toml` or environment:

```toml
[vars]
CLOUDFLARE_ACCOUNT_ID = "ede6590ac0d2fb7daf155b35653457b2"
CLOUDFLARE_IMAGES_ACCOUNT_HASH = "g7wf09fCONpnidkRnR_5vw"
```

**Secrets (already set):**
- `CLOUDFLARE_IMAGES_API_TOKEN` ✅

**KV Namespaces:**
- `KV_CONFIG` (for storing gallery images and logo cache)

---

### **Step 6: Deploy**

```bash
# If you have damnsam locally
npx wrangler deploy --name damnsam

# Or deploy from Cloudflare Dashboard
# Click "Save and Deploy" in the editor
```

---

### **Step 7: Test**

```bash
# Test gallery list
curl "https://www.meauxbility.org/api/v1/gallery?per_page=5"

# Test bulk import
curl -X POST "https://www.meauxbility.org/api/v1/gallery/import" \
  -H "Content-Type: application/json" \
  -d '{"limit": 819, "category": "imported", "autoTag": true}'
```

---

## 📁 Files to Reference

1. **`DAMNSAM_v1-gallery-api.ts`** - Complete V1 Gallery API code
2. **`DAMNSAM_V1_GALLERY_COMPLETE.ts`** - Integration instructions and getLogoUrl function
3. **`src/v1-gallery-api.ts`** - Original source (same as above)

---

## ✅ After Integration

Once deployed, you can:

1. **Import all images:**
   ```bash
   curl -X POST "https://www.meauxbility.org/api/v1/gallery/import" \
     -H "Content-Type: application/json" \
     -d '{"limit": 819, "category": "imported", "autoTag": true}'
   ```

2. **List gallery:**
   ```bash
   curl "https://www.meauxbility.org/api/v1/gallery?per_page=10"
   ```

3. **Logo will auto-update** - The `getLogoUrl()` function will find `officialheaderlogo_meauxbility_logo_540.webp` automatically

---

**Ready to integrate!** 🚀
