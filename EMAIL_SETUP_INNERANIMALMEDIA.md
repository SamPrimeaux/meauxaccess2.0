# 📧 Email Setup for inneranimalmedia.com

## 🎯 Goal
Create `sam@inneranimalmedia.com` email address with Cloudflare Email Routing

---

## ✅ **Option 1: Cloudflare Email Routing (Recommended - Free)**

### **Step 1: Enable Email Routing in Cloudflare**

1. **Go to Cloudflare Dashboard:**
   - Navigate to: https://dash.cloudflare.com
   - Select your account: `ede6590ac0d2fb7daf155b35653457b2`
   - Click on domain: **inneranimalmedia.com**

2. **Enable Email Routing:**
   - Go to: **Email** → **Email Routing**
   - Click **Get Started** or **Enable Email Routing**
   - Cloudflare will automatically add MX records

### **Step 2: Add Destination Address**

1. **Go to Email Routing → Destinations:**
   - Click **Create destination address**
   - Enter your forwarding email: `sam@meauxbility.org` (or your Gmail)
   - Click **Send verification email**
   - Verify the email by clicking the link

### **Step 3: Create Email Address**

1. **Go to Email Routing → Routing Rules:**
   - Click **Create address**
   - Enter: `sam@inneranimalmedia.com`
   - Select destination: `sam@meauxbility.org` (or your verified email)
   - Click **Save**

**Done!** Emails to `sam@inneranimalmedia.com` will forward to your destination email.

---

## 🔧 **Option 2: Automated Setup via Cloudflare API**

### **Quick Setup Script**

```bash
#!/bin/bash
# setup-sam-email.sh

CLOUDFLARE_API_TOKEN="your_api_token_here"
ZONE_ID="your_zone_id_here"  # Get from: curl -X GET "https://api.cloudflare.com/client/v4/zones?name=inneranimalmedia.com" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
DESTINATION_EMAIL="sam@meauxbility.org"  # Or your Gmail

# 1. Enable Email Routing
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/enable" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json"

# 2. Create destination address
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/addresses" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$DESTINATION_EMAIL\",
    \"tag\": \"sam-forward\"
  }"

# 3. Create routing rule
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Sam Email Forward\",
    \"enabled\": true,
    \"matchers\": [
      {
        \"type\": \"literal\",
        \"field\": \"to\",
        \"value\": \"sam@inneranimalmedia.com\"
      }
    ],
    \"actions\": [
      {
        \"type\": \"forward\",
        \"value\": [\"$DESTINATION_EMAIL\"]
      }
    ]
  }"
```

---

## 📧 **Email Workers (Advanced - Optional)**

### **Use Case: Automated Email Processing**

If you want to process emails automatically (e.g., auto-replies, filtering, forwarding to multiple addresses), you can create Email Workers.

### **Step 1: Create Email Worker**

```typescript
// email-worker.ts
export default {
  async email(message, env, ctx) {
    // Get email details
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get('subject');
    const text = await message.text();
    
    // Example: Auto-reply for specific senders
    if (from.includes('noreply')) {
      return message.reply({
        subject: 'Re: ' + subject,
        text: 'Thank you for your email. This is an automated response.',
      });
    }
    
    // Example: Forward to multiple addresses
    if (to === 'sam@inneranimalmedia.com') {
      await message.forward(['sam@meauxbility.org', 'backup@example.com']);
    }
    
    // Example: Log to KV
    await env.EMAIL_LOGS.put(`email:${Date.now()}`, JSON.stringify({
      from,
      to,
      subject,
      timestamp: new Date().toISOString(),
    }));
    
    // Continue normal processing
    return message;
  },
};
```

### **Step 2: Deploy Email Worker**

```bash
# Create email worker
wrangler init email-worker --type email

# Deploy
wrangler deploy email-worker
```

### **Step 3: Configure Email Routing to Use Worker**

1. Go to **Email Routing → Rules**
2. Edit rule for `sam@inneranimalmedia.com`
3. Add action: **Send to Worker**
4. Select your email worker

---

## 🔍 **Check Current Email Setup**

### **Check MX Records:**

```bash
dig MX inneranimalmedia.com +short
```

Should show Cloudflare Email Routing MX records:
- `route1.mx.cloudflare.net`
- `route2.mx.cloudflare.net`
- `route3.mx.cloudflare.net`

### **Check Email Routing Status:**

```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

---

## 📋 **Quick Setup Checklist**

- [ ] Enable Email Routing in Cloudflare Dashboard
- [ ] Verify destination email (sam@meauxbility.org or Gmail)
- [ ] Create routing rule: `sam@inneranimalmedia.com` → destination
- [ ] Test by sending email to `sam@inneranimalmedia.com`
- [ ] (Optional) Create email worker for automation
- [ ] (Optional) Set up auto-replies or filtering

---

## 🧪 **Test Email**

After setup, test by sending an email:

```bash
# Send test email
echo "Test email from setup script" | mail -s "Test Email" sam@inneranimalmedia.com

# Or use a service like:
# - https://www.mail-tester.com
# - Send from Gmail to sam@inneranimalmedia.com
```

---

## 🔐 **Security Notes**

1. **SPF Record:** Cloudflare automatically adds SPF
2. **DKIM:** Cloudflare handles DKIM signing
3. **DMARC:** Consider adding DMARC policy
4. **Rate Limiting:** Cloudflare Email Routing has limits (check dashboard)

---

## 📊 **Email Worker Examples**

### **Example 1: Auto-Reply**

```typescript
export default {
  async email(message, env, ctx) {
    // Auto-reply to all emails
    return message.reply({
      subject: 'Re: ' + message.headers.get('subject'),
      text: 'Thank you for your email. I will respond shortly.\n\nBest regards,\nSam',
    });
  },
};
```

### **Example 2: Filter and Forward**

```typescript
export default {
  async email(message, env, ctx) {
    const subject = message.headers.get('subject') || '';
    const from = message.from;
    
    // Forward important emails to multiple addresses
    if (subject.includes('URGENT') || subject.includes('Important')) {
      await message.forward([
        'sam@meauxbility.org',
        'team@inneranimalmedia.com',
      ]);
    }
    
    return message;
  },
};
```

### **Example 3: Log to R2**

```typescript
export default {
  async email(message, env, ctx) {
    const emailData = {
      from: message.from,
      to: message.to,
      subject: message.headers.get('subject'),
      date: new Date().toISOString(),
      text: await message.text(),
    };
    
    // Save to R2
    await env.EMAIL_ARCHIVE.put(
      `emails/${Date.now()}.json`,
      JSON.stringify(emailData)
    );
    
    return message;
  },
};
```

---

## 🚀 **Recommended Setup**

**For Most Users:**
1. ✅ Use Cloudflare Email Routing (Option 1)
2. ✅ Forward to existing email (sam@meauxbility.org or Gmail)
3. ✅ Test and verify

**For Advanced Users:**
1. ✅ Use Cloudflare Email Routing
2. ✅ Add Email Worker for automation
3. ✅ Set up logging/archiving
4. ✅ Configure auto-replies if needed

---

## 📞 **Support**

- **Cloudflare Email Routing Docs:** https://developers.cloudflare.com/email-routing/
- **Email Workers Docs:** https://developers.cloudflare.com/workers/runtime-apis/email-workers/
- **Cloudflare Dashboard:** https://dash.cloudflare.com

---

**Next Steps:**
1. Enable Email Routing in Cloudflare Dashboard
2. Create `sam@inneranimalmedia.com` forwarding rule
3. Test email delivery
4. (Optional) Add email worker for automation

---

*Last Updated: January 7, 2025*
