# ? Resend Quick Setup - 3 Steps

## ?? Quick Setup

### Step 1: Get API Key (2 minutes)

1. Go to: https://resend.com
2. Sign up (free - 3,000 emails/month)
3. Go to: https://resend.com/api-keys
4. Click "Create API Key"
5. Copy the key (starts with `re_`)

### Step 2: Set Secret (30 seconds)

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
wrangler secret put RESEND_API_KEY
# Paste your API key when prompted
```

### Step 3: Deploy (1 minute)

```bash
wrangler deploy
```

## ? Test It

Send a test notification:

```bash
curl -X POST https://meauxxx.com/api/team/notify \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "your-email@example.com",
    "title": "Test",
    "message": "Resend is working!"
  }'
```

**Or use the dashboard:**
- Go to: https://meauxxx.com/dashboard
- Team ? Send Notification

## ?? Done!

Emails will now be sent automatically when team members are notified!
