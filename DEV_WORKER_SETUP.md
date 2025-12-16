# 🚀 MeauxAccess 2.0 Dev Worker

## ✅ Deployment Complete

**Dev Worker URL**: https://meauxaccess-dashboard-dev.meauxbility.workers.dev

**Version ID**: `5a75406c-d09c-4620-aa85-4eaf354e1298`

---

## 📋 Quick Commands

### Deploy Dev Worker
```bash
npm run dev:deploy
# or
./deploy-dev.sh
# or
wrangler deploy --config wrangler.dev.toml
```

### Run Locally
```bash
npm run dev:local
```

### View Logs
```bash
npm run dev:tail
```

### Deploy Production
```bash
npm run deploy:prod
```

---

## 🔧 Configuration

**Config File**: `wrangler.dev.toml`

**Environment**: `dev`

**Bindings**:
- ✅ **5 D1 Databases** (shared with production)
- ✅ **15 R2 Buckets** (shared with production)
- ✅ **5 KV Namespaces** (shared with production)

---

## 🔐 Optional Secrets

To set secrets for the dev worker:

```bash
wrangler secret put SECRET_NAME --config wrangler.dev.toml
```

**Available Secrets** (optional):
- `CLOUDFLARE_API_TOKEN` - For Cloudflare API access
- `CLOUDFLARE_IMAGES_API_TOKEN` - For Cloudflare Images
- `OPENAI_API_KEY` - For ChatGPT integration
- `RESEND_API_KEY` - For email notifications
- `GEMINI_API_KEY` - For Gemini integration
- `ANTHROPIC_API_KEY` - For Claude integration

---

## 🌐 Features Available

### Core Services (Cloudflare-Native)
- ✅ **R2 Storage** - 15 buckets connected
- ✅ **D1 Databases** - 5 databases connected
- ✅ **KV Storage** - 5 namespaces connected
- ✅ **Cloudflare Images** - Account hash configured
- ✅ **Cloudflare Stream** - Customer ID configured

### Dashboards & UI
- ✅ MeauxAccess Dashboard
- ✅ iAccess Dashboard (13-page platform)
- ✅ Media Gallery
- ✅ Dev Search Assistant
- ✅ Photo Gallery

### APIs
- ✅ Media Gallery API
- ✅ Photo Gallery API
- ✅ Clients API
- ✅ Projects API
- ✅ Email Template API

---

## 🎯 Validation Checklist

- [ ] Visit dev URL and verify dashboard loads
- [ ] Test media gallery functionality
- [ ] Verify R2 bucket access
- [ ] Test D1 database queries
- [ ] Check KV namespace operations
- [ ] Test API endpoints
- [ ] Verify Cloudflare Images integration
- [ ] Test authentication flows (if configured)

---

## 📝 Notes

- **Shared Resources**: Dev worker uses the same D1, R2, and KV resources as production for validation
- **Environment**: Set to `dev` - code can check `env.ENVIRONMENT` to adjust behavior
- **No Custom Domain**: Dev worker uses `.workers.dev` subdomain
- **GitHub**: Project is at `https://github.com/SamPrimeaux/meauxaccess2.0.git`

---

## 🔄 Next Steps

1. **Validate**: Visit the dev URL and test all features
2. **Refine**: Make changes and redeploy with `npm run dev:deploy`
3. **Test Locally**: Use `npm run dev:local` for faster iteration
4. **Monitor**: Use `npm run dev:tail` to watch logs
5. **Deploy to Prod**: When ready, use `npm run deploy:prod`

---

**Last Updated**: December 16, 2025

