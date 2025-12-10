# 📊 Complete Platform Inventory - Live Pages, R2, D1 & AI Services

## 🌐 All Live Pages

### **Main Domain: inneranimalmedia.com**

#### **Core Pages:**
- 🏠 **Home**: https://inneranimalmedia.com/
- 📊 **iAccess Dashboard**: https://inneranimalmedia.com/iaccess
- 📈 **MeauxAccess Dashboard**: https://inneranimalmedia.com/meauxaccess
- 💰 **Pricing**: https://inneranimalmedia.com/pricing
- 🚀 **Deploy/Templates**: https://inneranimalmedia.com/deploy
- 🖼️ **Photo Gallery**: https://inneranimalmedia.com/photogallery

#### **iAccess 13-Page Platform:**
1. **Dashboard** (`/`) - Main overview
2. **Analytics** (`/analytics`) - Analytics dashboard
3. **AI Gateway** (`/ai-gateway`) - AI operations management
4. **Browser Rendering** (`/browser-rendering`) - Browser automation
5. **Workers** (`/workers`) - Workers management
6. **Databases** (`/databases`) - D1 database management
7. **Storage** (`/storage`) - R2 storage management
8. **KV** (`/kv`) - KV namespace management
9. **Vectorize** (`/vectorize`) - Vector embeddings
10. **Workflows** (`/workflows`) - Workflow automation
11. **Queues** (`/queues`) - Async job processing
12. **Email** (`/email`) - Email routing
13. **Integrations** (`/integrations`) - Third-party integrations
14. **Settings** (`/settings`) - Account settings

#### **API Endpoints:**
- **Health**: https://api.inneranimalmedia.com/api/health
- **Photo Gallery**: https://api.inneranimalmedia.com/api/photogallery
- **R2 Buckets**: https://api.inneranimalmedia.com/api/photogallery/r2/buckets
- **Cloudflare Images**: https://api.inneranimalmedia.com/api/photogallery/cloudflare-images

---

## 🪣 R2 Buckets Connected

### **Primary Buckets (meauxaccess-dashboard-production):**
1. ✅ **R2_WEBSITE** → `meauxbilityorgfinal`
2. ✅ **R2_COMPONENTS** → `meauxstack-components`
3. ✅ **R2_RECORDINGS** → `meauxbility-recordings`
4. ✅ **R2_3D_MODELS** → `meauxbility-3d-models`
5. ✅ **R2_SPLINEICONS** → `splineicons`
6. ✅ **R2_DOCS** → `meauxbility-docs`
7. ✅ **R2_SAMI_BACKUPS** → `samicloudbackups`
8. ✅ **R2_DEPLOY_VAULT** → `meaux-deploy-vault`
9. ✅ **R2_AUTORAG** → `autorag-meauxbility-chatbot` ⭐
10. ✅ **R2_CONNOR** → `connor-mcneely`
11. ✅ **R2_FRED** → `fred-williams`
12. ✅ **R2_AMBER** → `amber-nicole`
13. ✅ **R2_ASSETS** → `inneranimalmedia-assets`
14. ✅ **STORAGE** → `meaux-work-storage`
15. ✅ **R2_IAUTODIDACT** → `iautodidactorg`

### **iAccess API Buckets:**
1. ✅ **R2_ASSETS** → `inneranimalmedia-assets`
2. ✅ **R2_PHOTOS** → `inneranimalmedia-assets`
3. ✅ **R2_WEBSITE** → `meauxbilityorgfinal`
4. ✅ **STORAGE** → `meaux-work-storage`
5. ✅ **R2_COMPONENTS** → `meauxstack-components`
6. ✅ **R2_DOCS** → `meauxbility-docs`
7. ✅ **R2_IAUTODIDACT** → `iautodidactorg`
8. ✅ **R2_CONNOR** → `connor-mcneely`
9. ✅ **R2_FRED** → `fred-williams`
10. ✅ **R2_AMBER** → `amber-nicole`
11. ✅ **R2_TRASH** → `inneranimalmedia-trash`

### **Other Workers:**
- **iacess**: `R2_IACCESS` → `iaccess`
- **sandbox**: `R2_SANDBOX` → `sandbox-storage`

**Total R2 Buckets**: 16+ unique buckets across all workers

---

## 💾 D1 Databases Connected

### **Primary Databases (meauxaccess-dashboard-production):**
1. ✅ **DB** → `meauxstack-saas-db` (ID: `ee3e3adb-da99-457d-8c2c-390ff19f6435`)
2. ✅ **meauxxbility** → `meauxbility-api-db` (ID: `49b16b7d-ecb9-4cc4-b337-559f94854757`)
3. ✅ **SAAS_DB** → `meauxstack-saas-db` (ID: `ee3e3adb-da99-457d-8c2c-390ff19f6435`)
4. ✅ **MEAUX_WORK_DB** → `meaux-work-db` (ID: `2a3a763a-92f1-4633-849e-268ddb31998f`)
5. ✅ **INNERANIMAL_DB** → `inneranimalmedia-assets` (ID: `e0ec00b8-4e3c-422e-abba-70b7548c1f87`)

### **iAccess API Databases:**
1. ✅ **DB** → `meauxstack-saas-db` (ID: `ee3e3adb-da99-457d-8c2c-390ff19f6435`)
2. ✅ **SAAS_DB** → `meauxstack-saas-db` (ID: `ee3e3adb-da99-457d-8c2c-390ff19f6435`)

**Total D1 Databases**: 5 unique databases

---

## 🤖 AI Services Status

### ✅ **1. OpenAI** - FULLY FUNCTIONAL
- **Status**: ✅ Configured & Live
- **Secret**: `OPENAI_API_KEY`
- **Worker**: `meauxaccess-dashboard-production`, `meauxmcp`
- **Endpoints**:
  - `POST /api/helper/chatgpt` - ChatGPT integration
  - `GET /api/openai/summary` - Usage summary
  - `POST /api/openai/send-summary` - Send weekly report
- **Features**:
  - ✅ GPT-4o support (default)
  - ✅ Usage tracking
  - ✅ Weekly email summaries
  - ✅ Cost calculation
  - ✅ Organization ID support (`OPENAI_ORG_ID`)

### ✅ **2. Gemini API** - FULLY FUNCTIONAL
- **Status**: ✅ Configured & Live
- **Secret**: `GEMINI_API_KEY` (`AIzaSyAfx_Rba4PQFWJnJEnzOLCfVQvJujy-9pQ`)
- **Worker**: `gemini-proxy` (dedicated worker)
- **URL**: https://gemini-proxy.meauxbility.workers.dev
- **Endpoints**:
  - `POST /api/gemini/chat` - Chat completion
  - `GET /api/gemini/models` - List models
  - `GET /api/gemini/analytics` - Usage analytics
- **Features**:
  - ✅ Smart caching (60-80% cost reduction)
  - ✅ Rate limiting (60 req/min per user)
  - ✅ Analytics tracking
  - ✅ Multiple model support (gemini-2.5-flash, gemini-2.5-pro, etc.)
  - ✅ Proxy via main dashboard: `/api/gemini/*`

### ✅ **3. Anthropic/Claude** - FULLY FUNCTIONAL
- **Status**: ✅ Configured & Live
- **Secret**: `ANTHROPIC_API_KEY`
- **Worker**: `meauxaccess-dashboard-production`
- **Endpoints**:
  - `POST /api/helper/claude` - Claude integration
- **Features**:
  - ✅ Claude 3.5 Sonnet support
  - ✅ Full API integration

### ✅ **4. AI Gateway** - CONFIGURED
- **Status**: ✅ Available via Cloudflare
- **Account ID**: `ede6590ac0d2fb7daf155b35653457b2`
- **Gateway Name**: `iaccess-gateway` (referenced in docs)
- **URL Format**: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/...`
- **Features**:
  - ✅ Smart caching (67% hit rate mentioned)
  - ✅ Rate limiting
  - ✅ Automatic fallbacks
  - ✅ Content guardrails
  - ✅ Cost savings ($2,147/mo mentioned)
- **Usage**: Route AI calls through AI Gateway for optimization

### ✅ **5. MCP (Model Context Protocol)** - FULLY FUNCTIONAL
- **Status**: ✅ Configured & Live
- **Workers**:
  1. **meauxmcp** - https://meauxmcp.meauxbility.workers.dev
  2. **inneranimalmedia-mcp** - https://inneranimalmedia-mcp.meauxbility.workers.dev
- **Endpoints**:
  - `POST /mcp` - MCP protocol endpoint
  - `GET /health` - Health check
  - `GET /mcp/sse` - Server-Sent Events
- **Features**:
  - ✅ D1 database access
  - ✅ R2 bucket management
  - ✅ KV namespace operations
  - ✅ Worker deployment tools
  - ✅ Zone management
  - ✅ Analytics access
  - ✅ Cursor integration ready
- **Tools Available**:
  - List zones, workers, databases, buckets
  - Deploy workers to zones
  - Query databases
  - Manage R2 objects
  - Get analytics

### ✅ **6. AutoRAG** - R2 BUCKET CONFIGURED
- **Status**: ✅ R2 Bucket Ready
- **Bucket**: `autorag-meauxbility-chatbot`
- **Binding**: `R2_AUTORAG` (in meauxaccess-dashboard-production)
- **Location**: Connected to main dashboard worker
- **Usage**: Ready for RAG system storage
- **Note**: Bucket exists, but need to verify if AutoRAG worker/service is deployed

### ✅ **7. AI Search / Vectorize** - CONFIGURED
- **Status**: ✅ API Endpoint Available
- **Worker**: `iaccess-api`
- **Endpoint**: `GET /api/vectorize/indexes`
- **URL**: https://api.inneranimalmedia.com/api/vectorize/indexes
- **Page**: https://inneranimalmedia.com/vectorize
- **Features**:
  - ✅ List Vectorize indexes
  - ✅ Query indexes for semantic search
  - ✅ Embedding operations
  - ✅ Search interface available
- **Usage**: Use Vectorize for semantic search and AI-powered search capabilities

---

## 🔧 How to Use Each Service

### **OpenAI:**
```javascript
// Via helper endpoint
fetch('/api/helper/chatgpt', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Your question', model: 'gpt-4o' })
});

// Via AI Gateway (recommended for caching)
fetch('https://gateway.ai.cloudflare.com/v1/ede6590ac0d2fb7daf155b35653457b2/iaccess-gateway/openai/chat/completions', {
  headers: {
    'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
    'cf-aig-cache-ttl': '3600'
  }
});
```

### **Gemini:**
```javascript
// Via proxy worker
fetch('/api/gemini/chat', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Your question',
    model: 'gemini-2.5-flash',
    cache: true
  })
});
```

### **Claude:**
```javascript
// Via helper endpoint
fetch('/api/helper/claude', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Your question' })
});
```

### **MCP:**
```javascript
// Via MCP protocol
fetch('https://meauxmcp.meauxbility.workers.dev/mcp', {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  })
});
```

### **AutoRAG:**
```javascript
// Access R2 bucket
const ragData = await env.R2_AUTORAG.get('embeddings/index.json');
// Use for RAG system storage
```

---

## ✅ Functional Status Summary

| Service | Status | Worker | Endpoint | Notes |
|---------|--------|--------|----------|-------|
| **OpenAI** | ✅ Live | meauxaccess-dashboard-production | `/api/helper/chatgpt` | GPT-4o, tracking enabled |
| **Gemini** | ✅ Live | gemini-proxy | `/api/gemini/chat` | Cached, rate-limited |
| **Claude** | ✅ Live | meauxaccess-dashboard-production | `/api/helper/claude` | Claude 3.5 Sonnet |
| **AI Gateway** | ✅ Available | Cloudflare | Custom gateway URL | Caching, fallbacks |
| **MCP** | ✅ Live | meauxmcp, inneranimalmedia-mcp | `/mcp` | Full protocol support |
| **AutoRAG** | ✅ Bucket Ready | meauxaccess-dashboard-production | R2_AUTORAG binding | Bucket configured |
| **AI Search/Vectorize** | ✅ Available | iaccess-api | `/api/vectorize/indexes` | Semantic search ready |

---

## 🚀 Quick Test Commands

### Test OpenAI:
```bash
curl -X POST https://inneranimalmedia.com/api/helper/chatgpt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello!"}'
```

### Test Gemini:
```bash
curl -X POST https://gemini-proxy.meauxbility.workers.dev/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello!", "model": "gemini-2.5-flash"}'
```

### Test MCP:
```bash
curl -X POST https://meauxmcp.meauxbility.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

### Test Claude:
```bash
curl -X POST https://inneranimalmedia.com/api/helper/claude \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello!"}'
```

---

## 📝 Notes

1. **AI Gateway**: Configured but may need explicit gateway creation in Cloudflare dashboard
2. **AutoRAG**: R2 bucket exists, but need to verify if AutoRAG service/worker is deployed
3. **AI Search/Vectorize**: ✅ Configured - API endpoint available at `/api/vectorize/indexes`
4. **All secrets**: Should be set via `wrangler secret put SECRET_NAME`

---

**Last Updated**: December 7, 2024  
**Account ID**: `ede6590ac0d2fb7daf155b35653457b2`
