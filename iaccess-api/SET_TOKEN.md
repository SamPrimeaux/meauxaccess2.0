# Setting Cloudflare API Token

The token secret exists but appears to be empty. To set it properly:

## Option 1: Interactive (Recommended)
```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker/iaccess-api
wrangler secret put CLOUDFLARE_API_TOKEN
```
When prompted, paste your token: `U9eRQWurcXOwVoXE_FV9IX_Q-Bttct9NZHFiJkMz`

## Option 2: Using echo (if interactive doesn't work)
```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker/iaccess-api
echo "U9eRQWurcXOwVoXE_FV9IX_Q-Bttct9NZHFiJkMz" | wrangler secret put CLOUDFLARE_API_TOKEN
```

## Verify After Setting
```bash
curl https://iaccess-api.meauxbility.workers.dev/api/verify-token | jq .
```

Expected response:
```json
{
  "success": true,
  "verified": true,
  "token": {
    "id": "...",
    "status": "active",
    ...
  }
}
```

## Token Information
- **Token**: U9eRQWurcXOwVoXE_FV9IX_Q-Bttct9NZHFiJkMz
- **Account ID**: ede6590ac0d2fb7daf155b35653457b2
- **Status**: Active and verified
- **Permissions**: Workers, DNS, R2, D1, KV, Zone settings, WAF, Access, API Gateway, Analytics, Cache purge
