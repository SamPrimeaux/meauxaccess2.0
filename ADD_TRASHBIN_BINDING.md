# ✅ Add Trashbin R2 Binding to southernpetsanimalrescue Worker

## Quick Steps (2 minutes)

### Via Cloudflare Dashboard:

1. **Go to Worker Settings**:
   - Navigate to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/southernpetsanimalrescue

2. **Click "Settings" tab** (in the top navigation)

3. **Scroll to "Variables and Secrets"** section

4. **Find "R2 Bucket Bindings"** section

5. **Click "Add binding"** button

6. **Fill in the form**:
   - **Variable name**: `R2_TRASHBIN_SOUTHERNPETS`
   - **R2 bucket**: Select `trashbinsouthernpets` from dropdown
   - Click "Save"

7. **Deploy the worker** (if needed):
   - The binding will be active after the next deployment
   - If you see a "Deploy" button, click it

**Done!** ✅

---

## Verify It's Added

After adding, you should see in the "Variables and Secrets" section:

- ✅ `R2_TRASHBIN_SOUTHERNPETS` → `trashbinsouthernpets`

---

## Alternative: Via Wrangler (if you have a config file)

If you create a `wrangler.southernpets.toml` file, add:

```toml
[[r2_buckets]]
binding = "R2_TRASHBIN_SOUTHERNPETS"
bucket_name = "trashbinsouthernpets"
```

Then deploy:
```bash
wrangler deploy --name southernpetsanimalrescue --config wrangler.southernpets.toml
```

---

**That's it!** The trashbin bucket is now bound to your worker and ready to use! 🎉
