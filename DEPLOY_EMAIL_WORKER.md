# 🚀 Deploy Email Worker - Quick Start

## Worker Name: `southernpetsemailworker`

**Easy to identify**: Clear name for your team  
**Standalone**: Won't affect live site  
**SEO Optimized**: Clean structure and organization

---

## 📋 Deployment Steps

### Step 1: Deploy Worker

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker

wrangler deploy --config wrangler.southernpets-email.toml
```

### Step 2: Set Secrets

```bash
# Resend API key (for sending emails)
wrangler secret put RESEND_API_KEY --name southernpetsemailworker

# Cloudflare API token (optional, for images)
wrangler secret put CLOUDFLARE_API_TOKEN --name southernpetsemailworker
```

### Step 3: Access Admin Editor

After deployment, the worker will be available at:
- **Workers.dev URL**: `https://southernpetsemailworker.meauxbility.workers.dev`
- **Admin Editor**: `https://southernpetsemailworker.meauxbility.workers.dev/admin/email-templates`

---

## ✅ What's Included

- ✅ Email template editor (visual HTML editor)
- ✅ Photo gallery generation (automatic in emails)
- ✅ Template management API
- ✅ Test email sending
- ✅ Mobile responsive design

---

## 🎯 Benefits

1. **Separate from main site** - No risk to live pages
2. **Easy to identify** - Clear name: `southernpetsemailworker`
3. **Human-friendly** - Well organized, easy to navigate
4. **SEO optimized** - Clean URLs and structure
5. **Mobile responsive** - Works on any device

---

**Ready to deploy!** 🚀
