# 🚀 Inner Animal Media Deployment Platform Guide

## 📋 Overview

Your team now has a complete drag-and-drop deployment platform integrated with Cloudflare Pro account features:

- ✅ **Drag & Drop File Upload** - Upload HTML, CSS, JS, ZIP files, or entire builds
- ✅ **Cloudflare Pages** - Deploy static sites with automatic CDN
- ✅ **Cloudflare Workers** - Deploy dynamic applications at the edge
- ✅ **R2 Storage** - Store and serve static files
- ✅ **Cloudflare Images** - Upload, optimize, and deliver images globally
- ✅ **Dark Glassmorphic Header** - Sitewide header on all pages

---

## 🎯 Access URLs

### **Deployment Platform:**
- 🌐 **Deploy Page**: https://inneranimalmedia.com/deploy
- 🌐 **Pricing Page**: https://inneranimalmedia.com/pricing
- 🌐 **Dashboard**: https://inneranimalmedia.com/iaccess
- 🌐 **Home**: https://inneranimalmedia.com

### **Worker URL:**
- ⚡ https://meauxaccess-dashboard-production.meauxbility.workers.dev/deploy

---

## 🖼️ Cloudflare Images Integration

### **Configuration:**
- **Account ID**: `ede6590ac0d2fb7daf155b35653457b2`
- **Account Hash**: `g7wf09fCONpnidkRnR_5vw`
- **API Token**: ✅ Configured as secret
- **Image Delivery URL**: `https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/<image_id>/<variant_name>`

### **Current Stats:**
- **Images Delivered**: 1,477
- **Images Stored**: 818 / 100,000
- **Status**: ✅ Active

### **Features:**
- ✅ Automatic image optimization
- ✅ Multiple variant generation
- ✅ Global CDN delivery
- ✅ Signed URL support for private images
- ✅ Image upload API endpoint

---

## 📤 Deployment Options

### **1. Cloudflare Pages (Recommended for Static Sites)**
- **Best for**: HTML/CSS/JS static sites
- **Features**:
  - Automatic CDN distribution
  - Custom domain support
  - Build command support
  - Environment variables
  - Preview deployments

**Usage:**
1. Select "Cloudflare Pages" option
2. Upload your HTML/CSS/JS files
3. Enter project name
4. (Optional) Add build command (e.g., `npm run build`)
5. (Optional) Add custom domain
6. Click "Deploy Now"

**Result**: Your site will be available at `https://project-name.pages.dev` or your custom domain.

---

### **2. Cloudflare Worker**
- **Best for**: Dynamic applications, API endpoints
- **Features**:
  - Edge computing
  - Global distribution
  - Low latency
  - Serverless execution

**Usage:**
1. Select "Cloudflare Worker" option
2. Upload your worker code
3. Enter project name
4. Add environment variables if needed
5. Click "Deploy Now"

**Result**: Your worker will be available at `https://project-name.meauxbility.workers.dev`

---

### **3. R2 Storage (Static Files)**
- **Best for**: Static assets, archives, file hosting
- **Features**:
  - Unlimited storage
  - Custom domain serving
  - Direct file access
  - Cost-effective

**Usage:**
1. Select "R2 Storage" option
2. Upload files (supports folders)
3. Enter project name
4. (Optional) Add custom domain
5. Click "Deploy Now"

**Result**: Files accessible at `https://inneranimalmedia.com/deployments/project-name/`

---

### **4. Cloudflare Images**
- **Best for**: Image optimization and delivery
- **Features**:
  - Automatic optimization
  - Multiple size variants
  - Global CDN delivery
  - Signed URLs for private images
  - Image transformation API

**Usage:**
1. Select "Cloudflare Images" option
2. Upload image files (JPG, PNG, GIF, WebP, SVG)
3. (Optional) Enable "Require Signed URLs" for private images
4. Click "Deploy Now"

**Result**: Images optimized and delivered via `https://imagedelivery.net/`

---

## 🔌 API Endpoints

### **File Upload**
```bash
POST /api/deploy/upload
Content-Type: multipart/form-data

FormData:
- file: File object
- path: string (e.g., "deployments/project-name/index.html")
- projectName: string
```

### **Create Deployment**
```bash
POST /api/deploy/create
Content-Type: application/json

{
  "projectName": "my-project",
  "deployType": "pages|worker|r2|images",
  "customDomain": "project.inneranimalmedia.com",
  "buildCommand": "npm run build",
  "envVars": {"KEY": "value"},
  "files": [...],
  "requireSignedURLs": false
}
```

### **List Deployments**
```bash
GET /api/deploy/list
```

**Response:**
```json
{
  "deployments": [
    {
      "name": "my-project",
      "type": "pages",
      "status": "active",
      "createdAt": "2025-01-07T...",
      "fileCount": 15
    }
  ]
}
```

### **Upload Image to Cloudflare Images**
```bash
POST /api/images/upload
Content-Type: multipart/form-data

FormData:
- file: Image file
- requireSignedURLs: boolean (optional)
- metadata: JSON string (optional)
```

**Response:**
```json
{
  "success": true,
  "imageId": "abc123...",
  "accountHash": "g7wf09fCONpnidkRnR_5vw",
  "variants": ["public", "thumbnail", "avatar"],
  "deliveryUrls": [
    "https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/abc123/public",
    "https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/abc123/thumbnail"
  ]
}
```

### **List Images**
```bash
GET /api/images/list?page=1&per_page=50
```

### **Scan R2 Assets**
```bash
GET /api/r2/scan
```

---

## 🎨 Features

### **Dark Glassmorphic Header**
- Sitewide header on all pages
- Dark theme with blur effect
- Sticky positioning
- Responsive design
- Logo and navigation links

### **Drag & Drop Interface**
- Drag files or folders
- Click to browse
- Multiple file support
- File preview
- Progress tracking

### **Deployment Management**
- View recent deployments
- Track deployment status
- Access deployment URLs
- File count tracking

### **Cloudflare Images Dashboard**
- View image stats
- Browse uploaded images
- Copy account hash
- View delivery URLs

---

## 🔐 Security & Secrets

### **Required Secrets:**
```bash
# Cloudflare Images API Token
wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN --config wrangler.meauxaccess-dashboard-production.toml
# Value: D7SfwPBHfIOj4yn86jT1QVnr7KNHb6K5

# Cloudflare API Token (for Pages/Workers deployment)
wrangler secret put CLOUDFLARE_API_TOKEN --config wrangler.meauxaccess-dashboard-production.toml
```

---

## 📊 Cloudflare Pro Account Features Utilized

### **✅ Workers**
- Edge computing
- Global distribution
- Serverless execution
- Custom domains

### **✅ Pages**
- Static site hosting
- Automatic deployments
- Preview deployments
- Custom domains

### **✅ R2 Storage**
- Object storage
- Unlimited storage
- Custom domain serving
- Direct file access

### **✅ Images**
- Image optimization
- Variant generation
- Global CDN
- Signed URLs
- Transformation API

### **✅ KV Storage**
- Deployment metadata
- Configuration storage
- Fast edge storage

### **✅ D1 Databases**
- Structured data storage
- SQL queries
- Edge database

---

## 🚀 Quick Start

### **Deploy a Static Site:**

1. Go to: https://inneranimalmedia.com/deploy
2. Drag & drop your HTML/CSS/JS files
3. Select "Cloudflare Pages"
4. Enter project name: `my-awesome-site`
5. Click "Deploy Now"
6. Access at: `https://my-awesome-site.pages.dev`

### **Upload and Optimize Images:**

1. Go to: https://inneranimalmedia.com/deploy
2. Drag & drop image files
3. Select "Cloudflare Images"
4. (Optional) Enable "Require Signed URLs"
5. Click "Deploy Now"
6. Get optimized image URLs with variants

### **Deploy a Worker:**

1. Go to: https://inneranimalmedia.com/deploy
2. Upload your worker code
3. Select "Cloudflare Worker"
4. Add environment variables if needed
5. Click "Deploy Now"
6. Access at: `https://project-name.meauxbility.workers.dev`

---

## 📝 File Structure

Deployed files are stored in R2 with this structure:

```
R2_ASSETS (inneranimalmedia-assets)/
├── deployments/
│   ├── project-name-1/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   └── project-name-2/
│       └── ...
└── assets/
    └── ...
```

---

## 🔍 Monitoring & Management

### **View Deployments:**
- Go to `/deploy` page
- Scroll to "Recent Deployments" section
- See all active deployments with status

### **View Images:**
- Go to `/deploy` page
- Scroll to "Cloudflare Images" section
- Click "View All Images"
- See uploaded images with delivery URLs

### **Check R2 Assets:**
- Use `/api/r2/scan` endpoint
- Or access via dashboard

---

## 🎯 Best Practices

1. **Naming Conventions**: Use lowercase, hyphens for project names (e.g., `my-awesome-project`)
2. **File Organization**: Keep related files in folders
3. **Image Optimization**: Use Cloudflare Images for all user-uploaded images
4. **Environment Variables**: Store sensitive data as secrets, not in env vars
5. **Custom Domains**: Set up DNS before deploying with custom domain
6. **Build Commands**: Use for Pages deployments that need compilation

---

## 🆘 Troubleshooting

### **Upload Fails:**
- Check file size limits (R2: 5GB per object)
- Verify R2_ASSETS bucket is configured
- Check worker logs in Cloudflare Dashboard

### **Deployment Fails:**
- Verify API tokens are set as secrets
- Check project name is valid (lowercase, no spaces)
- Review error messages in status display

### **Images Not Uploading:**
- Verify CLOUDFLARE_IMAGES_API_TOKEN is set
- Check image format is supported (JPG, PNG, GIF, WebP, SVG)
- Ensure account hash is correct

---

## 📞 Support

- **Worker Dashboard**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/meauxaccess-dashboard-production
- **R2 Dashboard**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/r2
- **Images Dashboard**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/images

---

**Last Updated**: $(date)
**Worker**: meauxaccess-dashboard-production
**Account**: Inner Animal Media (Pro Plan)
