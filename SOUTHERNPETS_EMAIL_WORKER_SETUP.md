# 📧 Southern Pets Email Worker - Setup Guide

## 🎯 Overview

**Worker Name**: `southernpets-email-worker`  
**Purpose**: Standalone worker for email template management and photo gallery emails  
**Status**: Ready to deploy

---

## ✅ What This Worker Does

1. **Email Template Management**
   - Visual editor for customizing email templates
   - Save/load custom templates
   - Template variables system

2. **Photo Gallery in Emails**
   - Automatically fetches animal photos
   - Generates beautiful gallery HTML
   - Optimized for email clients

3. **Admin Interface**
   - Easy-to-use template editor
   - Mobile responsive
   - Live preview

---

## 🚀 Deployment Steps

### Step 1: Deploy the Worker

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker

# Deploy with specific config
wrangler deploy --config wrangler.southernpets-email.toml
```

### Step 2: Set Secrets

```bash
# Set Resend API key
wrangler secret put RESEND_API_KEY --name southernpets-email-worker

# Set Cloudflare API token (if needed for images)
wrangler secret put CLOUDFLARE_API_TOKEN --name southernpets-email-worker
```

### Step 3: Access the Worker

After deployment, the worker will be available at:
- **Workers.dev URL**: `https://southernpetsemailworker.meauxbility.workers.dev`
- **Admin Editor**: `https://southernpetsemailworker.meauxbility.workers.dev/admin/email-templates`

---

## 📋 Available Endpoints

### Admin Interface
- `GET /admin/email-templates` - Email template editor UI
- `GET /email-templates` - Same as above (short URL)

### Template API
- `GET /api/email-templates/get?type=adoption_admin` - Get template
- `POST /api/email-templates/save` - Save template
- `GET /api/email-templates/list` - List all templates
- `POST /api/email-templates/test` - Send test email

### Photo API
- `GET /api/email/photos?animalId=1` - Get animal photos for email
- `GET /api/email/photos?animalName=Rolo` - Get photos by name

---

## 🔗 Integration with Main Worker

### Option 1: Use as Separate Worker (Recommended)

Keep it separate - no changes to main worker needed!

**Benefits**:
- ✅ No risk to live site
- ✅ Easy to identify (`southernpets-email-worker`)
- ✅ Can update independently
- ✅ Clear separation of concerns

### Option 2: Proxy from Main Worker (Optional)

If you want to access it from main domain:

```typescript
// In your main southernpetsanimalrescue worker
if (path.startsWith('/email-templates') || path.startsWith('/api/email-templates')) {
  // Proxy to email worker
  const emailWorkerUrl = 'https://southernpets-email-worker.YOUR_SUBDOMAIN.workers.dev';
  return fetch(`${emailWorkerUrl}${path}`, request);
}
```

---

## 📧 How to Use

### 1. Access Admin Editor

Go to: `https://southernpets-email-worker.YOUR_SUBDOMAIN.workers.dev/admin/email-templates`

### 2. Customize Templates

- Select template type (adoption_admin, adoption_customer, etc.)
- Edit subject and HTML
- Use `{{photo_gallery}}` to include photos
- Preview before saving
- Save template

### 3. Photos Automatically Included

When adoption forms are submitted:
- System fetches animal photos
- Generates gallery HTML
- Inserts into email automatically

---

## 🎨 Template Variables

Available variables:
- `{{applicant_name}}` - Customer name
- `{{animal_name}}` - Animal name
- `{{photo_gallery}}` - **Automatic photo gallery**
- `{{applicant_email}}` - Email address
- `{{submission_id}}` - Unique ID

---

## 📁 File Organization

```
src/
├── southernpets-email-worker.ts    # Main worker file
├── email-template-editor.html.ts    # Editor UI
└── email-template-api.ts            # Template functions (imported)

wrangler.southernpets-email.toml     # Worker config
```

---

## ✅ Deployment Checklist

- [ ] Deploy worker: `wrangler deploy --config wrangler.southernpets-email.toml`
- [ ] Set RESEND_API_KEY secret
- [ ] Test admin editor access
- [ ] Test template save/load
- [ ] Test photo gallery API
- [ ] Test email sending

---

## 🎯 Benefits of Separate Worker

1. **Safety** - No risk to live site
2. **Clarity** - Easy to identify (`southernpets-email-worker`)
3. **Independence** - Update email features separately
4. **Organization** - Clear separation of concerns
5. **SEO Friendly** - Clean URLs and structure

---

## 📝 Notes

- Worker is **standalone** - doesn't affect main site
- Can be accessed via workers.dev URL
- Can optionally proxy from main domain
- All features work independently
- Easy to identify and manage

---

**Ready to deploy!** 🚀

This worker is completely separate from your main site - safe to deploy and test!
