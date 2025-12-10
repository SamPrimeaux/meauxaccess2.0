# 🗂️ R2 Bucket Organization Plan - Southern Pets Animal Rescue

## Current Bucket Structure

**Bucket Name**: `southernpetsanimalrescue`  
**Location**: Western North America (WNAM)  
**S3 API**: `https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com/southernpetsanimalrescue`

---

## 📁 Recommended Folder Structure

```
southernpetsanimalrescue/
├── assets/
│   ├── logo/
│   │   └── southernpets-logo.png (or .svg)
│   ├── icons/
│   └── graphics/
├── images/
│   ├── animals/
│   │   ├── dogs/
│   │   │   ├── {animal_id}_{timestamp}_{uuid}.jpg
│   │   │   └── primary/
│   │   └── cats/
│   │       ├── {animal_id}_{timestamp}_{uuid}.jpg
│   │       └── primary/
│   ├── gallery/
│   │   └── {timestamp}_{uuid}.jpg
│   └── thumbnails/
│       └── {image_id}_thumb.jpg
├── code/
│   ├── html/
│   │   ├── pages/
│   │   │   ├── adopt.html
│   │   │   ├── gallery.html
│   │   │   └── index.html
│   │   ├── components/
│   │   └── templates/
│   └── backups/
│       └── html-manifest-{timestamp}.json
├── documents/
│   ├── adoption-forms/
│   └── tnr-forms/
├── backups/
│   └── {date}/
└── trashbin/
    └── {deleted_date}_{uuid}/
```

---

## 🔒 Bucket Lock Rules

### Rule 1: Protect Production Assets
- **Path**: `assets/**`
- **Action**: Prevent deletion
- **Retention**: Indefinite
- **Status**: Lock after validation

### Rule 2: Protect Animal Images
- **Path**: `images/animals/**`
- **Action**: Prevent deletion (soft delete only)
- **Retention**: 30 days minimum
- **Status**: Lock after validation

### Rule 3: Protect Gallery Images
- **Path**: `images/gallery/**`
- **Action**: Prevent deletion (soft delete only)
- **Retention**: 14 days minimum
- **Status**: Lock after validation

### Rule 4: Protect Code/HTML Files
- **Path**: `code/**`
- **Action**: Prevent deletion
- **Retention**: Indefinite (GOVERNANCE mode)
- **Status**: Lock after validation
- **Purpose**: Protect HTML code and templates from accidental deletion

### Rule 5: Protect Documents
- **Path**: `documents/**`
- **Action**: Prevent deletion
- **Retention**: 7 years (legal requirement)
- **Status**: Lock after validation

---

## ✅ Validation Checklist

Before enabling bucket lock:

- [ ] All images uploaded to R2
- [ ] All images organized in proper folders
- [ ] Logo stored in `assets/logo/`
- [ ] Animal photos in `images/animals/`
- [ ] Gallery images in `images/gallery/`
- [ ] Trashbin bucket configured separately
- [ ] Backup strategy in place
- [ ] All content verified and tested

---

## 🚀 Migration Steps

### Step 1: Organize Existing Content

1. **Move logo to assets folder**
   ```bash
   # Logo should be at: assets/logo/southernpets-logo.png
   ```

2. **Organize animal images**
   ```bash
   # Move to: images/animals/{species}/{animal_id}_{timestamp}.jpg
   ```

3. **Organize gallery images**
   ```bash
   # Move to: images/gallery/{timestamp}_{uuid}.jpg
   ```

### Step 2: Update Code References

Update all code to use new folder structure:
- Gallery API upload paths
- Image retrieval paths
- Logo references

### Step 3: Enable Bucket Lock

Once validated, enable bucket lock rules via Cloudflare Dashboard or API.

---

## 📋 Bucket Lock Configuration

### Via Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/r2/buckets/southernpetsanimalrescue
2. Click "Bucket Lock Rules"
3. Add rules for each protected path
4. Set retention periods
5. Enable after validation

### Via API

Use Cloudflare API to configure bucket lock rules programmatically.

---

## 🔐 Security Best Practices

1. **Separate buckets** for different content types
2. **Version control** for important assets
3. **Backup strategy** for critical content
4. **Access controls** via Cloudflare Access
5. **Monitoring** for unauthorized changes

---

## 📊 Current Status

- ✅ Bucket created: `southernpetsanimalrescue`
- ✅ Trashbin bucket: `trashbinsouthernpets`
- ⚠️ Folder structure: Needs organization
- ⚠️ Bucket lock: Not yet enabled
- ⚠️ Custom domain: Not configured (optional)

---

**Next Steps**: Organize content, validate structure, then enable bucket lock rules.
