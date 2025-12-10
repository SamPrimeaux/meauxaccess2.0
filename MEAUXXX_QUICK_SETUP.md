# ?? Quick Setup: MeauxMCP on meauxxx.com

## ? Step 1: Add `vercel.json` to Your Vercel Project

Copy the `vercel.json` file from this directory to the **root** of your Vercel project for `meauxxx.com`.

If you don't have a Vercel project yet:
1. Create a new Vercel project
2. Connect it to `meauxxx.com`
3. Add the `vercel.json` file

## ? Step 2: Deploy

Once `vercel.json` is in your project root:

```bash
# If using Vercel CLI
vercel --prod

# Or just push to your connected Git repo
git add vercel.json
git commit -m "Add MeauxMCP proxy"
git push
```

Vercel will automatically redeploy and proxy all requests to your Cloudflare Worker!

## ?? What This Does

- ? `meauxxx.com/` ? Shows MeauxMCP dashboard
- ? `meauxxx.com/mcp/*` ? Proxies MCP API calls  
- ? `meauxxx.com/api/*` ? Proxies team/SSH APIs
- ? `meauxxx.com/iaccess` ? Shows iAccess page
- ? All CORS headers configured

## ?? Important Notes

1. **The dashboard already uses relative paths** (`/mcp`, `/api/team`, etc.) so it will work automatically through the proxy!

2. **No code changes needed** - The dashboard HTML already uses relative API paths, so when accessed via `meauxxx.com`, it will automatically use the proxied endpoints.

3. **After 12/31/2025**, you can:
   - Remove the Vercel proxy
   - Add `meauxxx.com` as a custom domain directly on the Cloudflare Worker
   - Or keep the proxy if you prefer

## ?? Testing

After deployment, test:
- `https://meauxxx.com` - Should show dashboard
- `https://meauxxx.com/mcp` - Should proxy MCP API
- `https://meauxxx.com/api/team/members` - Should show team members

## ?? Done!

Your MeauxMCP dashboard is now accessible at `https://meauxxx.com`!
