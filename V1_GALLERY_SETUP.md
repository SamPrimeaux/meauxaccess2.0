# 🖼️ V1 Gallery - Remote Content Storage System

## ✅ What's Been Set Up

### **1. Logo Auto-Discovery Fixed**
- ✅ `getLogoUrl()` now searches Cloudflare Images for `officialheaderlogo` first
- ✅ Prioritizes: `officialheaderlogo` > `logo` > `wordmark` > `meauxbility` > `brand`
- ✅ Automatically caches found logo in KV for performance
- ✅ No more Shopify CDN URLs in headers!

### **2. V1 Gallery API Endpoints**

All endpoints are available at: `https://www.meauxbility.org/api/v1/gallery/*`

#### **List Gallery Images**
```
GET /api/v1/gallery?page=1&per_page=50&category=community&tag=logo&search=meauxbility
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 50)
- `category` - Filter by category
- `tag` - Filter by tag
- `search` - Search in filename, title, description, tags

**Response:**
```json
{
  "success": true,
  "images": [...],
  "pagination": {
    "page": 1,
    "perPage": 50,
    "total": 819,
    "totalPages": 17
  }
}
```

---

#### **Add Image to Gallery**
```
POST /api/v1/gallery/add
```

**Body:**
```json
{
  "imageId": "cloudflare-images-id",
  "filename": "officialheaderlogo_meauxbility_logo_540.webp",
  "title": "Official Header Logo",
  "description": "Main logo for website header",
  "tags": ["logo", "header", "official"],
  "category": "branding",
  "metadata": {
    "custom": "data"
  }
}
```

---

#### **Bulk Import from Cloudflare Images**
```
POST /api/v1/gallery/import
```

**Body:**
```json
{
  "limit": 100,
  "category": "imported",
  "autoTag": true
}
```

**Features:**
- ✅ Imports last N images from Cloudflare Images
- ✅ Auto-detects tags from filename (logo, icon, community, sponsor, hero, official)
- ✅ Skips images already in gallery
- ✅ Sets category automatically

**Response:**
```json
{
  "success": true,
  "imported": 45,
  "skipped": 55,
  "images": [...]
}
```

---

#### **Get Image by ID**
```
GET /api/v1/gallery/get?id=gallery_1234567890_abc123
```

---

#### **Update Image Metadata**
```
PUT /api/v1/gallery/update
```

**Body:**
```json
{
  "id": "gallery_1234567890_abc123",
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["new", "tags"],
  "category": "new-category",
  "metadata": {
    "custom": "updated"
  }
}
```

---

#### **Delete Image from Gallery**
```
DELETE /api/v1/gallery/delete?id=gallery_1234567890_abc123
```

---

## 🚀 Quick Start

### **Step 1: Bulk Import Your Images**

Import all your Cloudflare Images into the gallery:

```bash
curl -X POST https://www.meauxbility.org/api/v1/gallery/import \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 819,
    "category": "imported",
    "autoTag": true
  }'
```

This will:
- ✅ Import all 819 images from Cloudflare Images
- ✅ Auto-tag them based on filename
- ✅ Store metadata in KV
- ✅ Make them searchable and filterable

---

### **Step 2: Find Your Logo**

The system will automatically find `officialheaderlogo_meauxbility_logo_540.webp` and use it for headers.

To manually set it:

```bash
# First, get the image ID from Cloudflare Images
# Then add it to gallery with proper metadata
curl -X POST https://www.meauxbility.org/api/v1/gallery/add \
  -H "Content-Type: application/json" \
  -d '{
    "imageId": "YOUR_IMAGE_ID",
    "filename": "officialheaderlogo_meauxbility_logo_540.webp",
    "title": "Official Header Logo",
    "tags": ["logo", "header", "official"],
    "category": "branding"
  }'
```

---

### **Step 3: Use Gallery in Your Code**

```javascript
// List all images
const response = await fetch('/api/v1/gallery?per_page=100');
const { images } = await response.json();

// Search for logos
const logos = await fetch('/api/v1/gallery?tag=logo&category=branding');
const { images: logoImages } = await logos.json();

// Get specific image
const image = await fetch('/api/v1/gallery/get?id=gallery_123');
const { image: imageData } = await image.json();
```

---

## 📊 Gallery Image Structure

```typescript
{
  id: "gallery_1234567890_abc123",           // Gallery ID
  imageId: "cloudflare-images-id",            // Cloudflare Images ID
  filename: "officialheaderlogo_meauxbility_logo_540.webp",
  title: "Official Header Logo",
  description: "Main logo for website header",
  tags: ["logo", "header", "official"],
  category: "branding",
  uploaded: "2025-12-03T12:00:00Z",
  deliveryUrl: "https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/.../public",
  variants: ["public", "thumbnail", "hero"],
  metadata: {
    custom: "data"
  }
}
```

---

## 🎯 Next Steps

1. **Bulk Import**: Run the import to get all 819 images into the gallery
2. **Organize**: Use categories and tags to organize your content
3. **Search**: Use the search API to find images quickly
4. **Integrate**: Use gallery API in your frontend/backend

---

**All images are stored in KV namespace `KV_CONFIG` under key `v1:gallery:images`**
