# ? Deployment Setup Complete

## ?? What's Been Configured

### **1. User Preferences System** ?
- Each user has their own R2 bucket assignment
- Local/Remote/Both storage mode toggle
- Preferences stored in KV_USERS namespace
- API endpoints for getting/setting preferences

### **2. Sandbox Worker** ?
- New worker: `sandbox` (sandbox.meauxbility.workers.dev)
- Client development environment
- Separate from production worker
- Accessible to paying clients

### **3. Local/Remote Toggle** ?
- Added to dashboard UI
- Users can choose: Local, Remote, or Both
- Preferences saved automatically
- Affects file upload/download behavior

### **4. Deployment Confirmation System** ?
- API endpoint: `/api/deployment/confirm`
- Lists all users and their R2 bucket preferences
- Admin-only access
- Must confirm before deployment

### **5. Routing Updates** ?
- Dashboard accessible at:
  - `https://meauxmcp.meauxbility.workers.dev/dashboard`
  - `https://iautodidact.org/dashboard`
  - `https://meauxxx.com/dashboard`

---

## ?? User R2 Bucket Assignments

### **Sam Primeaux** (Admin)
- **Email**: sam@meauxbility.org
- **R2 Bucket**: `R2_SAMI_BACKUPS` (samicloudbackups)
- **Storage Mode**: Both
- **Deployment Mode**: Both
- **Sandbox Access**: ? Yes

### **Connor** (Developer)
- **Email**: connor@meauxbility.org
- **R2 Bucket**: `R2_CONNOR` (connor-mcneely)
- **Storage Mode**: Both
- **Deployment Mode**: Both
- **Sandbox Access**: ? Yes

### **Fred** (Developer)
- **Email**: fred@meauxbility.org
- **R2 Bucket**: `R2_FRED` (fred-williams)
- **Storage Mode**: Both
- **Deployment Mode**: Both
- **Sandbox Access**: ? No

### **Amber** (Developer)
- **Email**: amber@meauxbility.org
- **R2 Bucket**: `R2_AMBER` (amber-nicole)
- **Storage Mode**: Both
- **Deployment Mode**: Both
- **Sandbox Access**: ? No

---

## ?? How to Deploy

### **Step 1: Review User Preferences**

Before deploying, review user R2 bucket assignments:

**Option A: Via Dashboard**
1. Log in as admin (sam@meauxbility.org)
2. Navigate to "Deployment" in sidebar
3. Click "Review & Deploy"
4. Review all user assignments
5. Click "Confirm & Deploy"

**Option B: Via Script**
```bash
./pre-deploy-check.sh
```

### **Step 2: Deploy Main Worker**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
wrangler deploy
```

### **Step 3: Deploy Sandbox Worker (Optional)**

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker/sandbox-worker
wrangler deploy
```

---

## ?? API Endpoints

### **User Preferences**
- `GET /api/user/preferences` - Get current user's preferences
- `POST /api/user/preferences` - Update current user's preferences

### **Deployment**
- `GET /api/deployment/confirm` - Get deployment confirmation (admin only)
- `POST /api/deployment/execute` - Execute deployment (admin only, requires confirmation)

---

## ?? Local/Remote Toggle

### **How It Works:**
- **Local**: Files stored/accessed from local machine
- **Remote**: Files stored/accessed from Cloudflare R2
- **Both**: Files synced between local and remote

### **Usage:**
1. Log in to dashboard
2. Toggle appears in R2 Storage view header
3. Select your preferred mode
4. Preferences saved automatically

---

## ?? URLs

### **Main Dashboard:**
- https://meauxmcp.meauxbility.workers.dev/dashboard
- https://iautodidact.org/dashboard
- https://meauxxx.com/dashboard

### **Sandbox:**
- https://sandbox.meauxbility.workers.dev

---

## ? Next Steps

1. **Test User Preferences**
   - Log in as each user
   - Verify R2 bucket assignments
   - Test local/remote toggle

2. **Deploy Sandbox Worker**
   - Create R2 bucket: `sandbox-storage`
   - Deploy sandbox worker
   - Configure client access

3. **Configure Custom Domain (Optional)**
   - Add `sandbox.iautodidact.org` route
   - Update DNS if needed

**Everything is ready for deployment!** ??
