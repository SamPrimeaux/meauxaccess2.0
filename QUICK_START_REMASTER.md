# ? Quick Start: HTML Remaster System

## ?? How to Remaster Any HTML File

### **Method 1: Use the Script (Easiest)**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
./remaster-html-example.sh your-file.html
```

This will:
- ? Read your HTML file
- ? Remaster it with all optimizations
- ? Save as `your-file-remastered.html`
- ? Ready to upload to R2

### **Method 2: Via API Directly**

```bash
curl -X POST https://meauxmcp.meauxbility.workers.dev/api/remaster \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<html><body><h1>My Page</h1></body></html>",
    "options": {
      "addMeauxBranding": true,
      "addCLI": true,
      "addChat": true,
      "addBrowser": true,
      "uploadToR2": true,
      "filename": "my-page.html"
    }
  }'
```

### **Method 3: Upload to R2 After Remaster**

```bash
# 1. Remaster the file
./remaster-html-example.sh my-page.html

# 2. Upload to R2
wrangler r2 object put iautodidactorg/my-page.html \
  --file=my-page-remastered.html \
  --content-type="text/html"

# 3. Access via URL
# https://iautodidact.org/my-page.html
```

---

## ? What Gets Added

When you remaster HTML, it automatically:

1. **Adds MeauxCloud Branding**
   - Footer with platform info
   - Meta tags
   - Theme colors

2. **Optimizes for Cloudflare**
   - Performance optimizations
   - CDN-friendly
   - Edge-ready

3. **Adds Interactive Tools** (if enabled)
   - Terminal/CLI panel
   - Chat assistant
   - Browser preview

4. **Responsive Design**
   - Mobile-friendly
   - Tablet support
   - Desktop optimized

5. **Dark Mode**
   - Automatic dark theme
   - Respects system preferences

6. **Image Optimization**
   - Lazy loading
   - Performance hints

---

## ?? Workflow Example

### **Step 1: Create Your HTML**
```html
<!DOCTYPE html>
<html>
<head>
  <title>My New Page</title>
</head>
<body>
  <h1>Welcome to My Page</h1>
  <p>This is my content.</p>
</body>
</html>
```

### **Step 2: Remaster It**
```bash
./remaster-html-example.sh my-page.html
```

### **Step 3: Upload to R2**
```bash
wrangler r2 object put iautodidactorg/my-page.html \
  --file=my-page-remastered.html \
  --content-type="text/html"
```

### **Step 4: Access It**
Visit: https://iautodidact.org/my-page.html

**Done! Your page is live and optimized.** ?

---

## ?? All URLs Reference

See `COMPLETE_PLATFORM_REFERENCE.md` for full URL list.

---

## ?? SSH Keys

All team members have SSH keys ready. See `SSH_KEYS_SETUP.md` for details.

**Everything is ready for easy expansion!** ??
