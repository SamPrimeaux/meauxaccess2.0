# ? Quick DNS Setup for meauxxx.com

## ?? Fast Setup (5 Minutes)

### Step 1: Add Domain in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project (or create new)
3. Settings ? Domains ? Add Domain
4. Enter: `meauxxx.com`
5. Copy the DNS records Vercel shows you

### Step 2: Update DNS

**If DNS is on Cloudflare:**

1. Go to: https://dash.cloudflare.com
2. Select `meauxxx.com` zone
3. DNS ? Records ? Add record:

```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy status: Proxied (orange cloud ON)
```

4. Add another record:

```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: Proxied (orange cloud ON)
```

**If DNS is elsewhere:**
- Add CNAME: `@` ? `cname.vercel-dns.com`
- Add CNAME: `www` ? `cname.vercel-dns.com`

### Step 3: Wait & Verify

1. Wait 5-60 minutes for DNS propagation
2. Check: https://dnschecker.org/#CNAME/meauxxx.com
3. Test: https://meauxxx.com

## ? Done!

Once DNS propagates, `meauxxx.com` will:
- Route to Vercel
- Proxy to Cloudflare Worker
- Access all R2/D1/KV resources (on Cloudflare)
- Serve via Cloudflare CDN

**All Cloudflare resources stay on Cloudflare!**
