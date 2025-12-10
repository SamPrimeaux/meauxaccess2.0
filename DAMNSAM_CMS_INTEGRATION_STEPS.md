# 🔗 damnsam + CMS Integration - Step-by-Step Guide

## ✅ Current Status

**damnsam Worker Bindings:**
- ✅ **R2_WEBSITE** → `meauxbilityorgfinal` (CMS bucket) - **EXISTS!**
- ✅ **KV_CACHE** → `Meauxbility` - EXISTS
- ✅ **KV_CONFIG** → `44096e435f5546fc8e1681eebbea48ce` - **ADDED!**
- ✅ **D1 Databases** → Multiple (DB, meauxxbility, SAAS_DB)
- ✅ **Workers AI** → Bound
- ✅ **Durable Objects** → Bound

**Status**: ✅ **All required bindings are ready!**

**Last Deployment**: `d17eef04-2356-4d29-ae1e-ced0f301bcfa`

---

## 🎯 What We Need to Add

### **1. KV_CONFIG Binding** (If Missing)

**Purpose**: Store header preferences, logo URLs, board member data

**Check if exists:**
- Look in damnsam's bindings for `KV_CONFIG`
- If missing, add it:

```toml
[[kv_namespaces]]
binding = "KV_CONFIG"
id = "44096e435f5546fc8e1681eebbea48ce"
```

**KV Namespace ID**: `44096e435f5546fc8e1681eebbea48ce` (from meauxaccess-dashboard)

---

### **2. Environment Variables** (If Using Cloudflare Images)

Add to damnsam's `wrangler.toml` or as secrets:

```toml
[vars]
CLOUDFLARE_IMAGES_ACCOUNT_HASH = "g7wf09fCONpnidkRnR_5vw"
CLOUDFLARE_ACCOUNT_ID = "ede6590ac0d2fb7daf155b35653457b2"
```

**Secrets to set:**
```bash
wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN --name damnsam
```

---

## 📝 Code to Add to damnsam

### **Step 1: Update Env Interface**

Add to damnsam's `Env` interface:

```typescript
export interface Env {
  // ... existing bindings ...
  
  // CMS Required (check if already exists)
  R2_WEBSITE?: R2Bucket;  // ✅ Already exists!
  KV_CONFIG?: KVNamespace; // ⚠️ Need to add
  KV_CACHE?: KVNamespace; // ✅ Already exists
  
  // Cloudflare Images (optional, for image migration)
  CLOUDFLARE_IMAGES_API_TOKEN?: string;
  CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
}
```

---

### **Step 2: Add CMS Routes**

Add to damnsam's main routing function (wherever you handle routes):

```typescript
// Admin/CMS Routes
if (path === '/admin' || path === '/settings' || path.startsWith('/admin/')) {
  return handleAdminPage(request, env, path, url);
}

// CMS API Routes
if (path === '/api/cms/list' && request.method === 'GET') {
  return handleCMSList(request, env);
}

if (path === '/api/cms/page' && request.method === 'GET') {
  return handleCMSGetPage(request, env);
}

if (path === '/api/cms/upload-page' && request.method === 'POST') {
  return handleCMSUploadPage(request, env, url);
}

if (path === '/api/cms/update-metatags' && request.method === 'POST') {
  return handleCMSUpdateMetatags(request, env, url);
}

if (path === '/api/cms/delete' && request.method === 'DELETE') {
  return handleCMSDelete(request, env);
}

if (path === '/api/cms/rename' && request.method === 'POST') {
  return handleCMSRename(request, env);
}

if (path === '/api/cms/live-urls' && request.method === 'GET') {
  return handleCMSLiveUrls(request, env, url);
}

// Header Settings API (for admin dashboard)
if (path === '/api/admin/header-settings' && request.method === 'GET') {
  return handleGetHeaderSettings(request, env);
}

if (path === '/api/admin/header-settings' && request.method === 'POST') {
  return handleSetHeaderSettings(request, env);
}

// Logo Management API
if (path === '/api/admin/logo' && request.method === 'GET') {
  return handleGetLogo(request, env);
}

if (path === '/api/admin/logo' && request.method === 'POST') {
  return handleUploadLogo(request, env);
}

// Process Logo & Team Page
if (path === '/api/admin/process-logo-and-team' && request.method === 'POST') {
  return handleProcessLogoAndTeam(request, env, url);
}

// Board Members API
if (path === '/api/admin/board-members' && request.method === 'GET') {
  return handleGetBoardMembers(request, env);
}
```

---

### **Step 3: Copy CMS Functions**

Copy these functions from `src/meauxaccess-dashboard.ts` to damnsam:

**Required Functions:**
1. `handleAdminPage()` - Admin dashboard HTML
2. `generateAdminPageHTML()` - Generate admin UI
3. `handleCMSList()` - List all pages
4. `handleCMSGetPage()` - Get page content
5. `handleCMSUploadPage()` - Upload & remaster HTML
6. `handleCMSUpdateMetatags()` - Update metatags
7. `handleCMSDelete()` - Delete file
8. `handleCMSRename()` - Rename file
9. `handleCMSLiveUrls()` - Get live URLs inventory
10. `handleGetHeaderSettings()` - Get header preference
11. `handleSetHeaderSettings()` - Set header preference
12. `handleGetLogo()` - Get logo URL
13. `handleUploadLogo()` - Upload logo
14. `handleProcessLogoAndTeam()` - Process logo & team page
15. `handleGetBoardMembers()` - Get board members

**Helper Functions:**
1. `listR2Objects()` - List R2 objects
2. `uploadR2Object()` - Upload to R2
3. `extractImagesFromHTML()` - Extract images
4. `migrateImageToCloudflare()` - Migrate images
5. `remasterShopifyHTML()` - Clean HTML
6. `injectHeader()` - Inject header
7. `enhancePageWithSEO()` - Add SEO tags
8. `getHeaderPreference()` - Get header type
9. `getLogoUrl()` - Get logo URL
10. `escapeHtml()` - Escape HTML
11. `escapeRegex()` - Escape regex
12. `getPageTitleFromPath()` - Get page title
13. `getPageDescriptionFromPath()` - Get page description

---

### **Step 4: Copy Required Imports**

Add to damnsam's imports:

```typescript
// Header components
import { GLASSMORPHIC_HEADER_HTML } from './glassmorphic-header.html';
import { LEGACY_HEADER_STYLES, LEGACY_HEADER_MARKUP, LEGACY_HEADER_SCRIPT } from './legacy-header.html';
import { BOARD_MEMBERS, generateTeamMemberHTML, TEAM_PAGE_HTML_TEMPLATE } from './team-meauxbility.html';
```

**Or copy these files to damnsam:**
- `src/glassmorphic-header.html.ts`
- `src/legacy-header.html.ts`
- `src/team-meauxbility.html.ts`

---

### **Step 5: Update Page Serving Logic**

If damnsam already serves pages from R2_WEBSITE, ensure it uses the header injection and SEO enhancement:

```typescript
// In your page serving function
async function servePage(request: Request, env: Env, path: string, url: URL) {
  // ... existing code to get page from R2_WEBSITE ...
  
  let html = await page.text();
  
  // Inject header (if not already present)
  if (!html.includes('glassmorphic-header') && !html.includes('id="nav"')) {
    const headerType = await getHeaderPreference(env, 'glassmorphic');
    const logoUrl = await getLogoUrl(env);
    html = await injectHeader(html, headerType, logoUrl);
  }
  
  // Enhance with SEO (if not already present)
  if (!html.includes('og:title')) {
    html = await enhancePageWithSEO(html, path, url, env);
  }
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

---

## 🔍 Quick Check: What Already Exists?

### **Check 1: Does damnsam serve pages from R2_WEBSITE?**

Look in damnsam code for:
- `env.R2_WEBSITE.get()`
- Routes like `/pages/*` or serving HTML

**If YES**: Just add CMS admin routes
**If NO**: Add page serving logic + CMS routes

---

### **Check 2: Does KV_CONFIG exist?**

In damnsam bindings, look for:
- `KV_CONFIG` binding

**If YES**: Ready to go!
**If NO**: Add KV_CONFIG binding (ID: `44096e435f5546fc8e1681eebbea48ce`)

---

## 🚀 Deployment Steps

### **1. Add KV_CONFIG Binding** (If Missing)

**Option A: Via Wrangler**
```bash
# Add to wrangler.toml
[[kv_namespaces]]
binding = "KV_CONFIG"
id = "44096e435f5546fc8e1681eebbea48ce"
```

**Option B: Via Cloudflare Dashboard**
1. Go to Workers & Pages → damnsam
2. Settings → Variables → KV Namespace Bindings
3. Add binding: `KV_CONFIG`
4. Select namespace: `44096e435f5546fc8e1681eebbea48ce`

---

### **2. Add Code to damnsam**

1. Copy CMS functions from `meauxaccess-dashboard.ts`
2. Add CMS routes to routing logic
3. Add required imports
4. Update Env interface

---

### **3. Test Locally**

```bash
# Test admin page
curl http://localhost:8787/admin

# Test CMS list
curl http://localhost:8787/api/cms/list
```

---

### **4. Deploy**

```bash
wrangler deploy --name damnsam
```

---

## ✅ After Integration

**Admin Dashboard:**
- `https://www.meauxbility.org/admin` ✅

**CMS APIs:**
- `https://www.meauxbility.org/api/cms/list` ✅
- `https://www.meauxbility.org/api/cms/live-urls` ✅
- All other CMS endpoints ✅

**Page Serving:**
- All pages from `R2_WEBSITE` automatically get:
  - Header injection ✅
  - SEO enhancement ✅
  - Logo integration ✅

---

## 📋 Checklist

- [ ] Check if KV_CONFIG binding exists in damnsam
- [ ] Add KV_CONFIG if missing
- [ ] Copy CMS functions to damnsam
- [ ] Add CMS routes to damnsam routing
- [ ] Add required imports (headers, team page)
- [ ] Update Env interface
- [ ] Test locally
- [ ] Deploy damnsam
- [ ] Test admin dashboard: `https://www.meauxbility.org/admin`
- [ ] Test CMS APIs
- [ ] Verify page serving with headers/SEO

---

## 🆘 Need Help?

**If you share:**
1. damnsam's main routing file
2. Current page serving logic (if any)
3. Whether KV_CONFIG exists

**I can provide:**
- Exact code to add
- Specific line numbers
- Complete integration script

---

**Ready to integrate!** The hard part (R2_WEBSITE binding) is already done! 🎉
