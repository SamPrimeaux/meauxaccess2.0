# 🚀 V1 Gallery - Ready to Paste into damnsam

## ✅ Quick Integration (3 Steps)

### **Step 1: Add V1 Gallery API File**

Copy the **entire contents** of `DAMNSAM_v1-gallery-api.ts` and add it to damnsam as a new file called `v1-gallery-api.ts`

**OR** if damnsam doesn't support multiple files, inline the entire code at the top of your main file.

---

### **Step 2: Add Routes to Main Handler**

Find where you handle routes (look for `if (path === '/api/...')` patterns) and add these **6 routes**:

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

**Note:** If you inlined the code instead of importing, remove the `await import()` lines and just call the functions directly:
```typescript
if (path === '/api/v1/gallery' && request.method === 'GET') {
  return handleV1GalleryList(request, env);
}
```

---

### **Step 3: Update getLogoUrl() Function**

Find your `getLogoUrl()` function in damnsam and **replace it entirely** with this:

```typescript
async function getLogoUrl(env: Env): Promise<string> {
  // Check KV cache first
  if (env.KV_CONFIG) {
    const cachedLogo = await env.KV_CONFIG.get('header:logo:url');
    if (cachedLogo && !cachedLogo.includes('shopify') && !cachedLogo.includes('cdn.shopify')) {
      return cachedLogo;
    }
  }

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw'}/default/public`;
  }

  try {
    // Query Cloudflare Images API for logo
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?per_page=100`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const images = data.result?.images || [];
      
      // Priority: officialheaderlogo > logo > wordmark > meauxbility > brand
      let foundLogo: any = null;
      
      // First pass: look for officialheaderlogo (highest priority)
      for (const img of images) {
        const filename = (img.filename || '').toLowerCase();
        if (filename.includes('officialheaderlogo') || filename.includes('official_header_logo') || filename.includes('official-header-logo')) {
          foundLogo = img;
          break;
        }
      }
      
      // Second pass: look for other logo keywords
      if (!foundLogo) {
        for (const img of images) {
          const filename = (img.filename || '').toLowerCase();
          if (filename.includes('logo') || filename.includes('wordmark') || filename.includes('meauxbility') || filename.includes('brand')) {
            foundLogo = img;
            break;
          }
        }
      }

      if (foundLogo) {
        const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';
        const logoUrl = `https://imagedelivery.net/${accountHash}/${foundLogo.id}/public`;
        
        // Cache in KV
        if (env.KV_CONFIG) {
          await env.KV_CONFIG.put('header:logo:url', logoUrl);
        }
        
        return logoUrl;
      }
    }
  } catch (error) {
    console.error('Error fetching logo from Cloudflare Images:', error);
  }

  // Fallback
  return `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw'}/default/public`;
}
```

**Also update:** Make sure `injectHeader()` function calls `getLogoUrl(env)` and accepts `env` as a parameter. Update all calls to `injectHeader()` to pass the `env` object.

---

## ✅ After Adding Code

1. **Save** in Cloudflare Dashboard
2. **Deploy** damnsam worker
3. **Test import:**
   ```bash
   curl -X POST "https://www.meauxbility.org/api/v1/gallery/import" \
     -H "Content-Type: application/json" \
     -d '{"limit": 819, "category": "imported", "autoTag": true}'
   ```

---

## 📁 Files Reference

- **`DAMNSAM_v1-gallery-api.ts`** - Complete V1 Gallery API code (618 lines)
- **`DAMNSAM_READY_TO_PASTE.md`** - This file (quick reference)
- **`DAMNSAM_V1_GALLERY_COMPLETE.ts`** - Detailed integration guide

---

**That's it!** Copy, paste, deploy, done! 🚀
