# 🔒 R2 Bucket Lock Setup Guide - Southern Pets Animal Rescue

## 📋 Overview

Bucket Lock provides **immutability** and **retention policies** for your R2 bucket content. Once enabled, objects cannot be deleted or modified until the retention period expires.

---

## ⚠️ Important: Read Before Enabling

**Bucket Lock is IRREVERSIBLE** until retention expires. Make sure:
- ✅ All content is organized correctly
- ✅ All content is validated and tested
- ✅ You have backups of critical data
- ✅ You understand retention periods

---

## 🗂️ Step 1: Organize Content Structure

### Current Structure (Needs Organization)
```
southernpetsanimalrescue/
├── images/{random_files}
├── {various_unorganized_files}
```

### Target Structure (After Organization)
```
southernpetsanimalrescue/
├── assets/
│   └── logo/
│       └── southernpets-logo.png
├── images/
│   ├── animals/
│   │   ├── dogs/
│   │   └── cats/
│   └── gallery/
└── documents/
    ├── adoption-forms/
    └── tnr-forms/
```

### Run Organization Script

```typescript
// In your worker or via API endpoint
import { organizeR2Bucket, validateBucketStructure } from './r2-organization-script';

// Validate current structure
const validation = await validateBucketStructure(env);
console.log('Current structure:', validation.structure);
console.log('Issues:', validation.issues);

// Organize content
const result = await organizeR2Bucket(env);
console.log('Organized files:', result.organized);
console.log('Errors:', result.errors);
```

---

## ✅ Step 2: Validate Content

### Validation Checklist

- [ ] **Logo exists**: `assets/logo/southernpets-logo.png`
- [ ] **Animal images organized**: `images/animals/dogs/` and `images/animals/cats/`
- [ ] **Gallery images organized**: `images/gallery/`
- [ ] **All images accessible**: Test URLs work
- [ ] **No orphaned files**: All files in proper folders
- [ ] **Backup created**: Critical content backed up

### Run Validation

```bash
# Via API endpoint
curl https://southernpetsanimalrescue.com/api/r2/validate
```

---

## 🔒 Step 3: Configure Bucket Lock Rules

### Rule 1: Protect Assets (Indefinite)

**Path**: `assets/**`  
**Retention**: Indefinite (GOVERNANCE mode)  
**Purpose**: Protect logo and brand assets

```json
{
  "id": "protect-assets",
  "prefix": "assets/",
  "defaultRetention": {
    "mode": "GOVERNANCE",
    "days": 0
  }
}
```

### Rule 2: Protect Animal Images (30 days)

**Path**: `images/animals/**`  
**Retention**: 30 days minimum (GOVERNANCE mode)  
**Purpose**: Protect animal photos with soft delete capability

```json
{
  "id": "protect-animal-images",
  "prefix": "images/animals/",
  "defaultRetention": {
    "mode": "GOVERNANCE",
    "days": 30
  }
}
```

### Rule 3: Protect Gallery Images (14 days)

**Path**: `images/gallery/**`  
**Retention**: 14 days minimum (GOVERNANCE mode)  
**Purpose**: Protect gallery images with soft delete capability

```json
{
  "id": "protect-gallery-images",
  "prefix": "images/gallery/",
  "defaultRetention": {
    "mode": "GOVERNANCE",
    "days": 14
  }
}
```

### Rule 4: Protect Documents (7 years - Compliance)

**Path**: `documents/**`  
**Retention**: 7 years (COMPLIANCE mode)  
**Purpose**: Legal requirement for form submissions

```json
{
  "id": "protect-documents",
  "prefix": "documents/",
  "defaultRetention": {
    "mode": "COMPLIANCE",
    "days": 2555
  }
}
```

---

## 🚀 Step 4: Enable Bucket Lock

### Via Cloudflare Dashboard

1. **Go to R2 Dashboard**:
   - https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/r2/buckets/southernpetsanimalrescue

2. **Click "Bucket Lock Rules"**

3. **Add Each Rule**:
   - Click "Add Rule"
   - Configure prefix and retention
   - Save rule

4. **Review and Enable**:
   - Review all rules
   - Click "Enable Bucket Lock"
   - Confirm activation

### Via API (Programmatic)

```bash
# Note: Bucket Lock API requires special permissions
# Contact Cloudflare support or use dashboard for initial setup

curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/ede6590ac0d2fb7daf155b35653457b2/r2/buckets/southernpetsanimalrescue/lock" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [...]
  }'
```

---

## 📊 Retention Modes Explained

### GOVERNANCE Mode
- ✅ Can be overridden by users with special permissions
- ✅ Flexible for soft deletes
- ✅ Good for: Animal images, gallery images

### COMPLIANCE Mode
- 🔒 Cannot be overridden (even by admins)
- 🔒 Strict legal compliance
- 🔒 Good for: Legal documents, form submissions

---

## 🔐 Security Best Practices

1. **Separate Buckets**:
   - Production: `southernpetsanimalrescue` (locked)
   - Trashbin: `trashbinsouthernpets` (unlocked)
   - Backups: Separate backup bucket

2. **Access Controls**:
   - Use Cloudflare Access for bucket access
   - Limit write permissions
   - Monitor access logs

3. **Versioning**:
   - Enable versioning for critical assets
   - Keep multiple versions of important files

4. **Monitoring**:
   - Set up alerts for lock violations
   - Monitor retention periods
   - Track access patterns

---

## ⚠️ Important Notes

### Before Enabling Lock

- ✅ **Test thoroughly** - Lock cannot be easily undone
- ✅ **Backup everything** - Have off-site backups
- ✅ **Validate structure** - Ensure all files are organized
- ✅ **Test access** - Verify all URLs still work

### After Enabling Lock

- 🔒 **Objects cannot be deleted** until retention expires
- 🔒 **Objects cannot be modified** (new versions can be uploaded)
- 🔒 **Retention cannot be shortened** (only extended)
- ✅ **Read access unchanged** - URLs still work

### Trashbin Strategy

Since bucket lock prevents deletion, use the **separate trashbin bucket**:
- Move deleted items to `trashbinsouthernpets`
- Trashbin bucket is **NOT locked**
- Trashbin cleanup runs automatically (14 days)

---

## 📋 Pre-Lock Checklist

- [ ] Content organized in proper folders
- [ ] All images accessible and tested
- [ ] Logo stored in `assets/logo/`
- [ ] Animal images in `images/animals/`
- [ ] Gallery images in `images/gallery/`
- [ ] Documents in `documents/`
- [ ] Backup created
- [ ] Validation passed
- [ ] Team notified
- [ ] Lock rules reviewed

---

## 🎯 Recommended Timeline

1. **Week 1**: Organize content structure
2. **Week 2**: Validate and test everything
3. **Week 3**: Review lock rules with team
4. **Week 4**: Enable bucket lock (after final validation)

---

## 🆘 Troubleshooting

### Lock Violation Error
- **Cause**: Trying to delete/modify locked object
- **Solution**: Wait for retention to expire, or use trashbin bucket

### Cannot Upload New Version
- **Cause**: Object is locked
- **Solution**: Upload with new key, or wait for retention to expire

### Need to Change Retention
- **Cause**: Retention period too long/short
- **Solution**: Can only extend, not shorten. Plan carefully.

---

**Ready to enable bucket lock? Follow the checklist above!** 🔒
