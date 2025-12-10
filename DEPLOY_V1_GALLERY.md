# 🚀 Deploy V1 Gallery & Logo Fix

## ⚠️ Before Running Import

The V1 Gallery API endpoints need to be **deployed first**. The code is ready, but not live yet.

---

## 📋 Deployment Steps

### **1. Deploy the Updated Worker**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker

# Deploy to production
npx wrangler deploy --config wrangler.meauxaccess-dashboard-production.toml
```

Or if using the main worker:

```bash
npx wrangler deploy
```

---

### **2. Verify Deployment**

Check that the new endpoints are live:

```bash
# Test gallery list endpoint
curl "https://www.meauxbility.org/api/v1/gallery?per_page=5"

# Should return JSON with images array
```

---

### **3. Run Bulk Import**

Once deployed, run the import:

```bash
./import-all-images-to-gallery.sh
```

Or manually:

```bash
curl -X POST "https://www.meauxbility.org/api/v1/gallery/import" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 819,
    "category": "imported",
    "autoTag": true
  }'
```

---

## ✅ What Gets Deployed

### **Logo Fix:**
- ✅ Auto-finds `officialheaderlogo_meauxbility_logo_540.webp` from Cloudflare Images
- ✅ No more Shopify CDN URLs in headers
- ✅ Caches logo in KV for performance

### **V1 Gallery API:**
- ✅ `/api/v1/gallery` - List images
- ✅ `/api/v1/gallery/add` - Add image
- ✅ `/api/v1/gallery/import` - Bulk import
- ✅ `/api/v1/gallery/get` - Get image
- ✅ `/api/v1/gallery/update` - Update metadata
- ✅ `/api/v1/gallery/delete` - Delete image

---

## 🎯 After Deployment

1. **Import Images:**
   ```bash
   ./import-all-images-to-gallery.sh
   ```

2. **Verify Logo:**
   ```bash
   curl "https://www.meauxbility.org/api/v1/gallery?search=officialheaderlogo"
   ```

3. **Check Gallery:**
   ```bash
   curl "https://www.meauxbility.org/api/v1/gallery?per_page=10"
   ```

---

**Ready to deploy!** 🚀
