# 💾 HTML Code Backup Guide - Southern Pets Animal Rescue

## 🎯 Overview

Your HTML code is now safely stored in R2 with automatic backup and recovery capabilities. This protects against accidental local data loss.

---

## 📁 Storage Structure

```
southernpetsanimalrescue/
└── code/
    ├── html/
    │   ├── pages/
    │   │   ├── adopt.html
    │   │   ├── gallery.html
    │   │   └── index.html
    │   ├── components/
    │   └── templates/
    └── backups/
        └── html-manifest-{timestamp}.json
```

---

## 🚀 How to Use

### 1. Upload HTML File

**Via API**:
```bash
curl -X POST https://southernpetsanimalrescue.com/api/html/upload \
  -F "file=@adopt.html" \
  -F "path=pages" \
  -F "description=Adopt page with fixed images"
```

**Via Worker Route** (add to your worker):
```typescript
import {
  handleUploadHTML,
  handleListHTML,
  handleGetHTML,
  handleDeleteHTML,
  handleBackupAllHTML,
} from './html-backup-api';

// In your fetch handler:
if (path === '/api/html/upload' && request.method === 'POST') {
  return handleUploadHTML(request, env);
}

if (path === '/api/html/list') {
  return handleListHTML(request, env);
}

if (path === '/api/html/get') {
  return handleGetHTML(request, env, url);
}

if (path === '/api/html/delete' && request.method === 'DELETE') {
  return handleDeleteHTML(request, env);
}

if (path === '/api/html/backup' && request.method === 'POST') {
  return handleBackupAllHTML(request, env);
}
```

---

## 📋 API Endpoints

### Upload HTML File
```bash
POST /api/html/upload
Content-Type: multipart/form-data

Parameters:
- file: HTML file (required)
- path: Subfolder path (optional, e.g., "pages", "components")
- description: Description (optional)
```

**Response**:
```json
{
  "success": true,
  "path": "code/html/pages/adopt.html",
  "url": "https://pub-2de3a237854249aea5ea23c05aee5473.r2.dev/code/html/pages/adopt.html",
  "message": "HTML file uploaded successfully"
}
```

### List All HTML Files
```bash
GET /api/html/list
```

**Response**:
```json
{
  "success": true,
  "files": [
    {
      "key": "code/html/pages/adopt.html",
      "size": 12345,
      "uploaded": "2025-12-08T01:00:00.000Z",
      "url": "https://pub-2de3a237854249aea5ea23c05aee5473.r2.dev/code/html/pages/adopt.html",
      "metadata": {
        "originalFilename": "adopt.html",
        "description": "Adopt page",
        "version": "2025-12-08T01-00-00-000Z"
      }
    }
  ],
  "count": 1
}
```

### Get HTML File
```bash
GET /api/html/get?path=pages/adopt.html
```

**Response**: HTML content (text/html)

### Delete HTML File
```bash
DELETE /api/html/delete
Content-Type: application/json

{
  "path": "pages/adopt.html"
}
```

**Note**: Files are moved to trashbin bucket (14-day retention) before deletion.

### Backup All HTML Files
```bash
POST /api/html/backup
```

**Response**:
```json
{
  "success": true,
  "manifest": {
    "timestamp": "2025-12-08T01:00:00.000Z",
    "files": [...],
    "count": 5
  },
  "manifestPath": "code/backups/html-manifest-1736294400000.json",
  "message": "Backup manifest created for 5 HTML files"
}
```

---

## 🔒 Protection

### Bucket Lock Rule

HTML files are protected by bucket lock:

```json
{
  "id": "protect-code",
  "prefix": "code/",
  "defaultRetention": {
    "mode": "GOVERNANCE",
    "days": 0
  },
  "description": "Protect HTML code and templates from accidental deletion"
}
```

**Benefits**:
- ✅ **Indefinite protection** - Files cannot be deleted
- ✅ **Version history** - Multiple versions can be stored
- ✅ **Recovery** - Easy recovery if local files are lost
- ✅ **Backup manifest** - Complete list of all HTML files

---

## 💡 Best Practices

### 1. Organize by Type
- **Pages**: `code/html/pages/`
- **Components**: `code/html/components/`
- **Templates**: `code/html/templates/`

### 2. Use Descriptive Names
- Include date: `adopt-2025-12-08.html`
- Include version: `adopt-v2.html`
- Include description: `adopt-fixed-images.html`

### 3. Regular Backups
- Run backup weekly: `POST /api/html/backup`
- Keep backup manifests for tracking
- Store critical files in multiple locations

### 4. Version Control
- Upload new versions with timestamps
- Keep old versions for rollback
- Document changes in descriptions

---

## 🔄 Recovery Process

If you accidentally delete local files:

1. **List all HTML files**:
   ```bash
   curl https://southernpetsanimalrescue.com/api/html/list
   ```

2. **Download specific file**:
   ```bash
   curl "https://southernpetsanimalrescue.com/api/html/get?path=pages/adopt.html" > adopt.html
   ```

3. **Or access directly**:
   ```
   https://pub-2de3a237854249aea5ea23c05aee5473.r2.dev/code/html/pages/adopt.html
   ```

4. **Restore from backup manifest**:
   - Get manifest: `code/backups/html-manifest-{timestamp}.json`
   - Download all files listed in manifest

---

## 📊 Current Files

To see what's currently stored:

```bash
curl https://southernpetsanimalrescue.com/api/html/list
```

---

## ✅ Checklist

- [ ] Upload all HTML files to R2
- [ ] Organize by type (pages, components, templates)
- [ ] Create backup manifest
- [ ] Enable bucket lock for `code/` folder
- [ ] Test recovery process
- [ ] Document file locations

---

## 🎯 Recommended Files to Backup

- ✅ `src/southernpets-adopt-page.ts` (generated HTML)
- ✅ Any custom HTML templates
- ✅ Page components
- ✅ Email templates (if stored as HTML)
- ✅ Dashboard HTML

---

**Your HTML code is now safely backed up in R2!** 💾

Even if you delete local files, you can always recover them from R2.
