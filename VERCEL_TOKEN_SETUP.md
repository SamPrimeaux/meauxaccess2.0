# ?? Vercel Token Setup - meauxxx.com

## ? Your Credentials

- **Vercel User ID**: `QvknUueIEjU5elqaJ5eUPIZV`
- **Token**: `nSbN81vwke2KYTFsPkYSeodl` (CLOUDFLARECONNECTED)

## ?? Automated Setup Script

I've created a script that will:
1. ? Test your Vercel token
2. ? Create a new Vercel project
3. ? Deploy `vercel.json` with proxy rewrites
4. ? Add `meauxxx.com` domain
5. ? Verify setup

**Run it:**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
./setup-vercel-meauxxx.sh
```

## ?? What the Script Does

1. **Tests token** - Verifies it's valid
2. **Creates project directory** - `vercel-proxy-deploy/`
3. **Creates vercel.json** - With all proxy rewrites
4. **Deploys to Vercel** - Using your token
5. **Adds domain** - `meauxxx.com` via API

## ?? Manual Alternative (If Script Fails)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login

```bash
export VERCEL_TOKEN="nSbN81vwke2KYTFsPkYSeodl"
vercel login --token $VERCEL_TOKEN
```

### Step 3: Deploy

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
mkdir -p vercel-proxy-deploy
cd vercel-proxy-deploy
cp ../vercel.json .
echo '{}' > package.json

# Deploy
vercel --prod --token $VERCEL_TOKEN
```

### Step 4: Add Domain

```bash
vercel domains add meauxxx.com --token $VERCEL_TOKEN
```

**OR** via dashboard:
1. Go to: https://vercel.com/dashboard
2. Find your project
3. Settings ? Domains ? Add Domain
4. Enter: `meauxxx.com`

## ? Verify Token

Test if your token works:

```bash
curl -H "Authorization: Bearer nSbN81vwke2KYTFsPkYSeodl" \
  https://api.vercel.com/v2/user
```

Should return your user info! ?

## ?? Expected Result

After setup:
- ? `meauxxx.com` ? Routes to Vercel
- ? Vercel ? Proxies to Cloudflare Worker
- ? All R2/D1/KV resources stay on Cloudflare
- ? SSL auto-provisions (1-5 minutes)

## ?? Test After Setup

```bash
# Wait 1-5 minutes for SSL, then:
curl -I https://meauxxx.com
# Expected: HTTP/2 200

curl https://meauxxx.com/api/team/members
# Expected: Team members JSON
```

## ?? Need Help?

If the script fails:
1. Check token is valid (use verify command above)
2. Try manual steps
3. Check Vercel dashboard for errors

**Ready to run the automated setup?** ??
