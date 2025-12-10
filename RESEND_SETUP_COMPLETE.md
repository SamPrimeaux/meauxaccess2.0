# ?? Resend Email Setup - Complete Guide

## ?? What Resend Does

Resend enables email notifications for your MeauxMCP dashboard:
- ? Team notifications (welcome messages, feature updates)
- ? Automated alerts
- ? Email notifications when team members are notified

## ?? Step-by-Step Setup

### Step 1: Get Resend API Key

1. **Sign up for Resend:**
   - Go to: https://resend.com
   - Click "Sign Up" (free tier available - 3,000 emails/month)
   - Create account or sign in

2. **Get API Key:**
   - Go to: https://resend.com/api-keys
   - Click "Create API Key"
   - Name it: `MeauxMCP Production`
   - Copy the API key (starts with `re_`)
   - **?? Save it!** You'll only see it once

### Step 2: Verify Domain (Optional but Recommended)

**For production emails, verify your domain:**

1. **Go to:** https://resend.com/domains
2. **Click "Add Domain"**
3. **Enter:** `meauxbility.org` (or your domain)
4. **Add DNS records** shown by Resend:
   - DKIM record (TXT)
   - SPF record (TXT)
   - DMARC record (TXT)

**Note:** If you don't verify a domain, Resend will use their default sending domain (may go to spam).

### Step 3: Set API Key in Cloudflare Worker

**Set the secret in your Cloudflare Worker:**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
wrangler secret put RESEND_API_KEY
# Paste your Resend API key when prompted
```

**Or use environment variable:**
```bash
export RESEND_API_KEY="re_your_api_key_here"
wrangler secret put RESEND_API_KEY
```

### Step 4: Deploy Worker

After setting the secret, deploy:

```bash
wrangler deploy
```

## ? Verify Setup

### Test Email Notification

**Option 1: Via Dashboard**
1. Go to: https://meauxxx.com/dashboard
2. Navigate to "Team" section
3. Click "Send Notification"
4. Fill in:
   - Recipient: Your email
   - Title: "Test Email"
   - Message: "Testing Resend integration"
5. Click "Send Notification"

**Option 2: Via API**
```bash
curl -X POST https://meauxxx.com/api/team/notify \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "your-email@example.com",
    "title": "Test Email",
    "message": "Testing Resend integration"
  }'
```

**Option 3: Via MCP Tool**
Use the `send_team_notification` tool in your MCP client.

## ?? What Happens When Configured

Once `RESEND_API_KEY` is set:

1. **Team Notifications** - Emails sent automatically when:
   - Team members are notified via dashboard
   - Welcome notifications are sent
   - Feature updates are announced

2. **Email Format:**
   - From: `MeauxMCP <noreply@meauxbility.org>`
   - HTML formatted with dashboard link
   - Professional styling

3. **Fallback:**
   - If Resend is not configured, notifications still work
   - They're just stored in KV (no emails sent)

## ?? Current Configuration

**Code Location:**
- `src/team-management.ts` - Email sending logic
- `src/index.ts` - Env interface includes `RESEND_API_KEY`

**Email Template:**
- Styled HTML emails
- Includes dashboard link
- Professional branding

## ?? Resend Limits

**Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Perfect for team notifications!

**Paid Plans:**
- Start at $20/month
- 50,000 emails/month
- Better deliverability

## ?? Troubleshooting

### Emails Not Sending?

1. **Check API Key:**
   ```bash
   # Verify secret is set
   wrangler secret list
   # Should show RESEND_API_KEY
   ```

2. **Check Resend Dashboard:**
   - Go to: https://resend.com/emails
   - Check for failed sends
   - View error messages

3. **Check Worker Logs:**
   ```bash
   wrangler tail
   # Look for email-related errors
   ```

### Domain Verification Issues?

1. **Check DNS Records:**
   - Verify DKIM, SPF, DMARC records are added
   - Wait 24-48 hours for DNS propagation

2. **Use Default Domain:**
   - If domain not verified, Resend uses default
   - May have lower deliverability

## ? Quick Setup Checklist

- [ ] Resend account created
- [ ] API key obtained
- [ ] API key set as Cloudflare Worker secret
- [ ] Worker deployed
- [ ] Test email sent
- [ ] Domain verified (optional but recommended)

## ?? Done!

Once configured, your MeauxMCP dashboard will automatically send email notifications to team members!

**Next:** Test it by sending a notification via the dashboard!
