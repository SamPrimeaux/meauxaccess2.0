# ?? Automated DNS Setup for meauxxx.com

## ?? Quick Setup Options

### Option 1: Automated Script (If DNS is on Cloudflare)

I've created a script that can update DNS automatically:

**Prerequisites:**
- `meauxxx.com` zone exists in Cloudflare
- API token with DNS edit permissions

**Run:**
```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
export CLOUDFLARE_API_TOKEN='your-token-with-dns-permissions'
./update-dns-meauxxx.sh
```

**What it does:**
- ? Finds `meauxxx.com` zone in Cloudflare
- ? Deletes old A/CNAME records
- ? Adds CNAME `@` ? `cname.vercel-dns.com` (proxied)
- ? Adds CNAME `www` ? `cname.vercel-dns.com` (proxied)

### Option 2: Manual Setup (Recommended - More Control)

Follow the step-by-step guide in `DNS_100_PERCENT_SETUP.md`

## ?? First: Check if meauxxx.com is in Cloudflare

**Check current DNS:**
```bash
dig NS meauxxx.com +short
# If shows cloudflare.com nameservers, it's on Cloudflare
```

**Or check Cloudflare Dashboard:**
- https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2
- Look for `meauxxx.com` in your zones

## ? Manual Steps (Most Reliable)

### Step 1: Add Domain to Vercel

1. Go to: https://vercel.com/dashboard
2. Select/create project
3. Settings ? Domains ? Add Domain
4. Enter: `meauxxx.com`
5. **Copy the exact DNS records Vercel shows**

### Step 2: Update DNS

**If on Cloudflare:**
1. Go to: https://dash.cloudflare.com
2. Select `meauxxx.com` zone
3. DNS ? Records
4. Add/Update:
   - CNAME `@` ? `cname.vercel-dns.com` (Proxied ON)
   - CNAME `www` ? `cname.vercel-dns.com` (Proxied ON)

**If NOT on Cloudflare:**
1. Log into your DNS provider
2. Add CNAME: `@` ? `cname.vercel-dns.com`
3. Add CNAME: `www` ? `cname.vercel-dns.com`

### Step 3: Verify

```bash
# Wait 5-60 minutes, then:
dig meauxxx.com CNAME +short
# Should show: cname.vercel-dns.com

# Test connection
curl -I https://meauxxx.com
# Should return 200 OK
```

## ?? What You Need

1. **Vercel Project** - Add `meauxxx.com` domain
2. **DNS Access** - Either:
   - Cloudflare Dashboard access
   - Or DNS provider access
3. **vercel.json** - With proxy rewrites (already created!)

## ?? Quick Checklist

- [ ] Domain added to Vercel
- [ ] DNS records updated
- [ ] DNS propagated (check dnschecker.org)
- [ ] SSL certificate issued (Vercel auto)
- [ ] Test `https://meauxxx.com` works

## ?? After Setup

**100% connection flow:**
```
meauxxx.com ? Vercel ? Cloudflare Worker ? R2/D1/KV
```

All Cloudflare resources stay on Cloudflare! ?
