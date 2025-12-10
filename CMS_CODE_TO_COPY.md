# 📋 CMS Code to Copy to damnsam

## ✅ Prerequisites Complete!

- ✅ R2_WEBSITE binding exists
- ✅ KV_CONFIG binding added
- ✅ Ready to copy code

---

## 📦 What to Copy

### **1. CMS API Handler Functions** (Copy these 7 functions)

From `src/meauxaccess-dashboard.ts`, copy these functions:

1. **`handleCMSList()`** - Lines ~4081-4135
   - Lists all pages and images in R2

2. **`handleCMSGetPage()`** - Lines ~4136-4212
   - Gets page content and extracts metatags

3. **`handleCMSUploadPage()`** - Lines ~4213-4304
   - Uploads and remasters HTML pages

4. **`handleCMSUpdateMetatags()`** - Lines ~4305-4398
   - Updates page metatags

5. **`handleCMSDelete()`** - Lines ~4399-4455
   - Deletes files from R2

6. **`handleCMSRename()`** - Lines ~4456-4530
   - Renames files in R2

7. **`handleCMSLiveUrls()`** - Lines ~4531-4605
   - Generates live URLs inventory

---

### **2. Admin Dashboard Functions** (Copy these 2 functions)

1. **`handleAdminPage()`** - Lines ~2757-2770
   - Handles admin dashboard requests

2. **`generateAdminPageHTML()`** - Lines ~2773-3200+
   - Generates the admin dashboard HTML

---

### **3. Header & Logo Management Functions** (Copy these 5 functions)

1. **`handleGetHeaderSettings()`** - Lines ~3608-3624
   - Gets current header preference

2. **`handleSetHeaderSettings()`** - Lines ~3625-3655
   - Sets header preference

3. **`handleGetLogo()`** - Lines ~3656-3674
   - Gets current logo URL

4. **`handleUploadLogo()`** - Lines ~3675-3772
   - Uploads and optimizes logo

5. **`handleProcessLogoAndTeam()`** - Lines ~3783-4026
   - One-click logo & team page processing

---

### **4. Board Members API** (Copy 1 function)

1. **`handleGetBoardMembers()`** - Lines ~4037-4070
   - Gets board member data

---

### **5. Helper Functions** (Copy these 10+ functions)

1. **`listR2Objects()`** - Lines ~2374-2390
   - Lists R2 objects with pagination

2. **`uploadR2Object()`** - Lines ~2390-2475
   - Uploads content to R2 with proper headers

3. **`extractImagesFromHTML()`** - Lines ~2477-2550
   - Extracts image URLs from HTML

4. **`migrateImageToCloudflare()`** - Lines ~2550-2642
   - Migrates images to Cloudflare Images CDN

5. **`remasterShopifyHTML()`** - Lines ~2739-2754
   - Removes Shopify-specific code

6. **`injectHeader()`** - Lines ~2606-2642
   - Injects header into HTML

7. **`enhancePageWithSEO()`** - Lines ~983-1060
   - Adds SEO metatags to HTML

8. **`getHeaderPreference()`** - Lines ~953-962
   - Gets header type from KV

9. **`getLogoUrl()`** - Lines ~1089-1095
   - Gets logo URL from KV

10. **`escapeHtml()`** - Lines ~1245-1256
    - Escapes HTML characters

11. **`escapeRegex()`** - Lines ~1257-1270
    - Escapes regex special characters

12. **`getPageTitleFromPath()`** - Lines ~1198-1217
    - Gets page title from path

13. **`getPageDescriptionFromPath()`** - Lines ~1219-1238
    - Gets page description from path

14. **`getPageKeywordsFromPath()`** - Lines ~1240-1243
    - Gets page keywords from path

15. **`generateSEOTags()`** - Lines ~1110-1179
    - Generates SEO metatags HTML

16. **`ensureCompleteSEO()`** - Lines ~1180-1196
    - Ensures all SEO tags are present

---

### **6. Required Imports** (Copy these imports)

Add to damnsam's imports:

```typescript
// Header components
import { GLASSMORPHIC_HEADER_HTML } from './glassmorphic-header.html';
import { LEGACY_HEADER_STYLES, LEGACY_HEADER_MARKUP, LEGACY_HEADER_SCRIPT } from './legacy-header.html';
import { BOARD_MEMBERS, generateTeamMemberHTML, TEAM_PAGE_HTML_TEMPLATE } from './team-meauxbility.html';
```

**Or copy these files:**
- `src/glassmorphic-header.html.ts`
- `src/legacy-header.html.ts`
- `src/team-meauxbility.html.ts`

---

### **7. Type Definitions** (Copy these interfaces)

```typescript
interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  url?: string;
}
```

---

## 🔧 Where to Add in damnsam

### **Step 1: Add to Env Interface**

```typescript
export interface Env {
  // ... existing bindings ...
  
  // CMS Required
  R2_WEBSITE?: R2Bucket;
  KV_CONFIG?: KVNamespace;
  KV_CACHE?: KVNamespace;
  
  // Cloudflare Images (optional)
  CLOUDFLARE_IMAGES_API_TOKEN?: string;
  CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
}
```

---

### **Step 2: Add Routes to Main Handler**

Add these routes to damnsam's main routing function (wherever you handle `path`):

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

// Header Settings API
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

### **Step 3: Update Page Serving (If damnsam serves pages)**

If damnsam already serves pages from R2_WEBSITE, update the serving function:

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

## 📝 Quick Copy Checklist

- [ ] Copy all 7 CMS handler functions
- [ ] Copy 2 admin dashboard functions
- [ ] Copy 5 header/logo management functions
- [ ] Copy 1 board members function
- [ ] Copy 16+ helper functions
- [ ] Copy required imports
- [ ] Copy type definitions
- [ ] Add routes to main handler
- [ ] Update Env interface
- [ ] Copy header/team page files (or imports)
- [ ] Test locally
- [ ] Deploy

---

## 🚀 Next Steps

1. **Copy the functions** from `src/meauxaccess-dashboard.ts`
2. **Add the routes** to damnsam's routing
3. **Copy the header/team files** or set up imports
4. **Test locally**: `wrangler dev`
5. **Deploy**: `wrangler deploy --name damnsam`

---

## ✅ After Deployment

**Test these URLs:**
- `https://www.meauxbility.org/admin` - Admin dashboard
- `https://www.meauxbility.org/api/cms/list` - List pages
- `https://www.meauxbility.org/api/cms/live-urls` - Live URLs

**All CMS functionality will be available on damnsam!** 🎉
