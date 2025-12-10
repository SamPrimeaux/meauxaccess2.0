# 🔗 MCP Dashboard - Bindings Reference

## ✅ Current Bindings (meauxmcp worker)

### **R2 Buckets (14 bound)**
All these buckets are **fully accessible** via the MCP dashboard:

| Binding | Bucket Name | Purpose | Status |
|---------|-------------|---------|--------|
| `R2_WEBSITE` | `meauxbilityorgfinal` | Main nonprofit website assets | ✅ Active |
| `R2_COMPONENTS` | `meauxstack-components` | Shared components library | ✅ Active |
| `R2_RECORDINGS` | `meauxbility-recordings` | Video/audio recordings | ✅ Active |
| `R2_3D_MODELS` | `meauxbility-3d-models` | 3D model assets | ✅ Active |
| `R2_SPLINEICONS` | `splineicons` | Icon library | ✅ Active |
| `R2_DOCS` | `meauxbility-docs` | Documentation | ✅ Active |
| `R2_SAMI_BACKUPS` | `samicloudbackups` | Backup storage | ✅ Active |
| `R2_DEPLOY_VAULT` | `meaux-deploy-vault` | Deployment artifacts | ✅ Active |
| `R2_AUTORAG` | `autorag-meauxbility-chatbot` | AI chatbot data | ✅ Active |
| `R2_CONNOR` | `connor-mcneely` | Connor's workspace | ✅ Active |
| `R2_FRED` | `fred-williams` | Fred's workspace | ✅ Active |
| `R2_AMBER` | `amber-nicole` | Amber's workspace | ✅ Active |
| `R2_ASSETS` | `inneranimalmedia-assets` | Inner Animal Media assets | ✅ Active |
| `STORAGE` | `meaux-work-storage` | General work storage | ✅ Active |
| `R2_IAUTODIDACT` | `iautodidactorg` | iAutodidact assets | ✅ Active |
| `R2_MEAUXPHOTO` | `meauxphoto-content` | **Photo gallery content** | ✅ **NEW** |

### **D1 Databases (5 bound)**
| Binding | Database Name | Purpose |
|---------|---------------|---------|
| `DB` | `meauxstack-saas-db` | Main SaaS database |
| `meauxxbility` | `meauxbility-api-db` | API database |
| `SAAS_DB` | `meauxstack-saas-db` | SaaS database (alias) |
| `MEAUX_WORK_DB` | `meaux-work-db` | Work database |
| `INNERANIMAL_DB` | `inneranimalmedia-assets` | Inner Animal Media DB |

### **KV Namespaces (5 bound)**
| Binding | Namespace ID | Purpose |
|---------|--------------|---------|
| `KV_CACHE` | `eed27546297b4b51b0a6e117d3316d3c` | Cache storage |
| `KV_CONFIG` | `44096e435f5546fc8e1681eebbea48ce` | Configuration |
| `KV_SESSIONS` | `3d059794619f4fb89c3ad7c4348dd780` | User sessions |
| `KV_USERS` | `40cc20516269415daf4c6bac0d9ff43a` | User data |
| `KV_NOTIFICATIONS` | `6832e03107f2432f97d49de44f670ff5` | Notifications |

---

## 🎯 Main Project Buckets (Priority)

These are the **critical buckets** for your main projects:

### **damnsam Worker**
- ✅ `R2_WEBSITE` → `meauxbilityorgfinal` (main site)
- ✅ `R2_MEAUXPHOTO` → `meauxphoto-content` (photo gallery)
- ✅ `STORAGE` → `meaux-work-storage` (general storage)
- ✅ `R2_COMPONENTS` → `meauxstack-components` (shared components)

### **meauxbility.org**
- ✅ `R2_WEBSITE` → `meauxbilityorgfinal` (all site assets)
- ✅ `R2_DOCS` → `meauxbility-docs` (documentation)

---

## 🚀 How to Use in MCP Dashboard

### **1. Access R2 Storage**
1. Go to: `https://meauxmcp.meauxbility.workers.dev`
2. Click **"R2 Storage"** in sidebar
3. All **16 bound buckets** will show with full access
4. Click any bucket to view/upload/manage files

### **2. Using MCP Tools**
The dashboard automatically uses MCP tools:
- `list_r2_buckets` - Lists all buckets (bound + unbound)
- `list_r2_objects` - Lists files in a bucket
- `read_r2_object` - Read/download files
- `upload_r2_object` - Upload files
- `get_r2_bucket_stats` - Get bucket statistics

### **3. Bound vs Unbound**
- **Bound buckets** (16): Full access - list, read, upload, delete
- **Unbound buckets** (45): Visible but need API access or add to `wrangler.toml`

---

## 📝 Adding More Bindings

To add a bucket binding to the MCP worker:

1. **Edit `wrangler.toml`:**
```toml
[[r2_buckets]]
binding = "R2_NEW_BUCKET"
bucket_name = "your-bucket-name"
```

2. **Deploy:**
```bash
npx wrangler deploy --config wrangler.toml
```

3. **The bucket will automatically appear** in the dashboard!

---

## 🔄 Syncing with damnsam

The MCP worker now has **all the same bindings as damnsam** for seamless development:

| damnsam Binding | meauxmcp Binding | Status |
|----------------|------------------|--------|
| `R2_WEBSITE` | `R2_WEBSITE` | ✅ Synced |
| `R2_MEAUXPHOTO` | `R2_MEAUXPHOTO` | ✅ **Just Added** |
| `STORAGE` | `STORAGE` | ✅ Synced |
| `R2_COMPONENTS` | `R2_COMPONENTS` | ✅ Synced |
| All others | All others | ✅ Synced |

---

## ✅ Current Status

**Deployed:** `https://meauxmcp.meauxbility.workers.dev`  
**Version:** `b5a538ad-aa77-48be-b97e-f3c55e29a53b`  
**Bindings:** 16 R2 buckets, 5 D1 databases, 5 KV namespaces

**All main project buckets are now accessible!** 🎉

---

## 💡 Best Practices

1. **Use bound buckets** for active development (faster, direct access)
2. **Add bindings** for buckets you use frequently
3. **Use API** for one-off operations on unbound buckets
4. **Keep bindings synced** between `damnsam` and `meauxmcp` for consistency

---

## 🎯 Quick Reference

**Main Project Buckets:**
- `meauxbilityorgfinal` → `R2_WEBSITE` ✅
- `meauxphoto-content` → `R2_MEAUXPHOTO` ✅
- `meaux-work-storage` → `STORAGE` ✅
- `meauxstack-components` → `R2_COMPONENTS` ✅

**All accessible via:** `https://meauxmcp.meauxbility.workers.dev` → R2 Storage
