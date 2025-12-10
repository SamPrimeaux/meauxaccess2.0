# ?? MeauxCloud Platform - Complete Reference Guide

## ?? All Live URLs

### **Main Platform:**

#### **MeauxMCP Worker (Primary):**
- **Dashboard**: https://meauxmcp.meauxbility.workers.dev/dashboard
- **Learning Platform**: https://meauxmcp.meauxbility.workers.dev/dashboard/learning
- **iAccess (GODMODE)**: https://meauxmcp.meauxbility.workers.dev/iaccess
- **Health Check**: https://meauxmcp.meauxbility.workers.dev/health
- **MCP Endpoint**: https://meauxmcp.meauxbility.workers.dev/mcp

#### **Via Vercel Proxy (meauxxx.com):**
- **Dashboard**: https://meauxxx.com/dashboard
- **Learning Platform**: https://meauxxx.com/dashboard/learning
- **iAccess**: https://meauxxx.com/iaccess

#### **iautodidact.org (Custom Domain):**
- **Home**: https://iautodidact.org
- **www**: https://www.iautodidact.org
- **Dashboard**: https://iautodidact.org/dashboard
- **Learning**: https://iautodidact.org/dashboard/learning
- **About**: https://iautodidact.org/about
- **Portfolio**: https://iautodidact.org/portfolio
- **Coaching**: https://iautodidact.org/coaching
- **Community**: https://iautodidact.org/community
- **Contact**: https://iautodidact.org/contact

#### **R2 Public URLs:**
- **Vercel Dashboard**: https://pub-ae968de3091f4c5c89f37fe9381f9319.r2.dev/vercel-deployments-dashboard.html
- **Learning Dashboard**: https://pub-ae968de3091f4c5c89f37fe9381f9319.r2.dev/learning-dashboard.html
- **Course Data**: https://pub-ae968de3091f4c5c89f37fe9381f9319.r2.dev/courses/meauxcloud-course.json

### **API Endpoints:**

#### **Course & Learning:**
- `GET /api/courses/meauxcloud` - Get course data
- `POST /api/chat` - Learning assistant chat
- `POST /api/remaster` - HTML remaster service
- `POST /api/wrangler/execute` - CLI command execution

#### **AI Helpers:**
- `POST /api/helper/chatgpt` - ChatGPT integration
- `POST /api/helper/claude` - Claude integration
- `POST /api/helper/cloudflare-ai` - Cloudflare AI
- `POST /api/helper/wrangler` - Wrangler CLI

#### **OpenAI Tracking:**
- `GET /api/openai/summary` - Usage summary
- `POST /api/openai/send-summary` - Send weekly report

#### **Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Check session

---

## ?? Team Members with SSH Access

### **1. Sam Primeaux** (Admin)
- **Email**: sam@meauxbility.org
- **SSH Public Key**: 
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIX+Xi6EBzx1xWNOcJ0GZ9jPhLrdJ2lCWx/eCvN/R7Bi sam@meauxbility.org
  ```
- **Key Files**: 
  - Private: `/tmp/sam_ssh_key`
  - Public: `/tmp/sam_ssh_key.pub`
- **Status**: ? Ready for installation

### **2. Connor** (Developer)
- **Email**: connor@meauxbility.org
- **SSH Public Key**: 
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEKB/ENgjI76Tggz4c1jNYauG+rdzkqsDsEdyWSkV6eQ connor@meauxbility.org
  ```
- **Key Files**: 
  - Private: `/tmp/connor_ssh_key`
  - Public: `/tmp/connor_ssh_key.pub`
- **Status**: ? Ready for installation

### **3. Fred** (Developer)
- **Email**: fred@meauxbility.org
- **SSH Public Key**: 
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHU9eklbU7NZzXMbZLj6RkF4fIEIVrMmZ1Jfax1SswlK fred@meauxbility.org
  ```
- **Key Files**: 
  - Private: `/tmp/fred_ssh_key`
  - Public: `/tmp/fred_ssh_key.pub`
- **Status**: ? Ready for installation

### **4. Amber** (Developer)
- **Email**: amber@meauxbility.org
- **SSH Public Key**: 
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO+gaDkZMXWmLpia7rWVT0XUzqdb/A8DJADq/drBc7hQ amber@meauxbility.org
  ```
- **Key Files**: 
  - Private: `/tmp/amber_ssh_key`
  - Public: `/tmp/amber_ssh_key.pub`
- **Status**: ? Ready for installation

### **Installation Instructions:**
1. Copy all public keys above
2. On your server, add to `~/.ssh/authorized_keys`
3. Set permissions: `chmod 600 ~/.ssh/authorized_keys`
4. Test connection: `ssh -i /path/to/private_key user@server.com`

---

## ?? HTML Remaster System - How to Use

### **What It Does:**
Automatically remasters and optimizes any HTML file you provide with:
- ? MeauxCloud branding
- ? Cloudflare optimizations
- ? Responsive design
- ? Dark mode support
- ? Optional CLI terminal
- ? Optional chat assistant
- ? Optional browser preview
- ? Image optimization
- ? Performance enhancements
- ? Automatic R2 upload

### **Method 1: Via API (Recommended)**

```bash
curl -X POST https://meauxmcp.meauxbility.workers.dev/api/remaster \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<html><body><h1>My Page</h1></body></html>",
    "options": {
      "brandName": "MeauxCloud",
      "addMeauxBranding": true,
      "optimizeForCloudflare": true,
      "addCLI": true,
      "addChat": true,
      "addBrowser": true,
      "responsive": true,
      "darkMode": true,
      "uploadToR2": true,
      "filename": "my-page.html"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "remastered": "<remastered HTML>",
  "filename": "my-page-remastered.html",
  "size": 12345
}
```

### **Method 2: Via JavaScript**

```javascript
async function remasterHTML(htmlContent) {
  const response = await fetch('/api/remaster', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      html: htmlContent,
      options: {
        brandName: 'MeauxCloud',
        addMeauxBranding: true,
        addCLI: true,
        addChat: true,
        addBrowser: true,
        uploadToR2: true,
        filename: 'my-page.html'
      }
    })
  });
  
  const result = await response.json();
  return result.remastered; // Optimized HTML
}
```

### **Method 3: Direct Upload (Manual)**

1. **Remaster locally** using the API
2. **Save the remastered HTML**
3. **Upload to R2**:
   ```bash
   wrangler r2 object put iautodidactorg/my-page.html \
     --file=my-page-remastered.html \
     --content-type="text/html"
   ```

---

## ?? Remaster Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `brandName` | string | "MeauxCloud" | Brand name to use |
| `addMeauxBranding` | boolean | true | Add MeauxCloud branding |
| `optimizeForCloudflare` | boolean | true | Cloudflare-specific optimizations |
| `addCLI` | boolean | false | Add terminal/CLI panel |
| `addChat` | boolean | false | Add chat assistant |
| `addBrowser` | boolean | false | Add browser preview |
| `responsive` | boolean | true | Add responsive design |
| `darkMode` | boolean | true | Add dark mode support |
| `uploadToR2` | boolean | false | Auto-upload to R2 |
| `filename` | string | "remastered.html" | Filename for R2 upload |

---

## ?? Safe Expansion Guidelines

### **? DO:**
- ? Use the remaster API for all HTML
- ? Store everything in R2 (100% Cloudflare)
- ? Maintain MeauxCloud branding
- ? Test locally before deploying
- ? Use responsive design
- ? Document new features
- ? Follow existing patterns

### **? DON'T:**
- ? Add external redirects
- ? Use external CDNs
- ? Break existing functionality
- ? Skip testing
- ? Commit secrets to git
- ? Hardcode API keys

---

## ?? Platform Architecture

### **Storage:**
- **R2 Bucket**: `iautodidactorg`
- **All Content**: 100% Cloudflare stored
- **No External Dependencies**: ?

### **Worker:**
- **Name**: `meauxmcp`
- **URL**: https://meauxmcp.meauxbility.workers.dev
- **Routes**: Multiple routes for all features

### **Databases:**
- **D1**: `meauxstack-saas-db` (DB binding)
- **Usage**: Course progress, user data

### **Features:**
- ? Authentication system
- ? Course management
- ? Interactive tools (CLI, Chat, Browser)
- ? HTML remaster system
- ? API integrations (OpenAI, Claude, Resend)
- ? SSH key management

---

## ?? Quick Workflow: Add New HTML Page

### **Step 1: Prepare HTML**
Create your HTML file with content.

### **Step 2: Remaster**
```bash
# Via API
curl -X POST https://meauxmcp.meauxbility.workers.dev/api/remaster \
  -H "Content-Type: application/json" \
  -d @remaster-request.json
```

### **Step 3: Access**
Once uploaded, access via:
- https://iautodidact.org/{filename}
- Or add custom route in worker

**That's it! Your page is live and optimized.** ??

---

## ? Status Summary

- ? Learning platform built and deployed
- ? Course content created (3 levels)
- ? Interactive tools added (CLI, Chat, Browser)
- ? SSH keys generated for all team members
- ? HTML remaster system ready
- ? All URLs documented
- ? Platform ready for expansion

**Your MeauxCloud platform is complete and ready to grow!** ??

---

## ?? Files Created

1. **Course Content:**
   - `src/courses/meauxcloud-course.json` - Course structure
   - `src/courses/learning-dashboard.html` - Learning UI

2. **Remaster System:**
   - `src/html-remaster.ts` - Remaster engine

3. **Documentation:**
   - `PLATFORM_COMPLETE_GUIDE.md` - Complete guide
   - `SSH_KEYS_SETUP.md` - SSH setup instructions
   - `COMPLETE_PLATFORM_REFERENCE.md` - This file

4. **SSH Keys:**
   - `/tmp/sam_ssh_key` & `.pub`
   - `/tmp/connor_ssh_key` & `.pub`
   - `/tmp/fred_ssh_key` & `.pub`
   - `/tmp/amber_ssh_key` & `.pub`

**Everything is ready for your team!** ??
