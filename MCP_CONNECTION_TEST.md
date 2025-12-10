# 🧪 MCP Connection Test Guide

## ✅ Current Configuration

Your MCP is configured to use the **official Cloudflare MCP server**:
- **Package**: `@modelcontextprotocol/server-cloudflare`
- **Account ID**: `ede6590ac0d2fb7daf155b35653457b2`
- **Config Location**: `~/.cursor/mcp.json`

## 🔄 Step 1: Restart Cursor

**IMPORTANT**: MCP connections only initialize when Cursor starts. You must:

1. **Quit Cursor completely** (Cmd+Q on Mac)
2. **Wait 5 seconds**
3. **Reopen Cursor**

## 🧪 Step 2: Test MCP Connection

After restarting, test the connection in Cursor chat:

### **Test 1: List R2 Buckets**
```
List all my R2 buckets
```

### **Test 2: Check MCP Status**
Look for MCP indicator in Cursor's status bar (bottom-right corner).

### **Test 3: Use MCP Tools Directly**
Try commands like:
- "Show me all my Cloudflare workers"
- "Query my D1 database"
- "Upload a file to R2 bucket meauxbilityorgfinal"

## 🔍 Step 3: Verify Connection (Terminal Test)

If MCP isn't working in Cursor, test the API directly:

```bash
# Test API token
curl "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer iD99g0lrGy-ArCW0uUws7svvChQReRjNFFhQHXK4"

# List R2 buckets
curl "https://api.cloudflare.com/client/v4/accounts/ede6590ac0d2fb7daf155b35653457b2/r2/buckets" \
  -H "Authorization: Bearer iD99g0lrGy-ArCW0uUws7svvChQReRjNFFhQHXK4"
```

## 📋 Expected Results

### ✅ **Success Indicators:**
- MCP tools appear in Cursor's autocomplete
- Commands like "List all my R2 buckets" work automatically
- No errors in Cursor's developer console (Help → Toggle Developer Tools)

### ❌ **Failure Indicators:**
- "MCP server not found" errors
- Commands don't use MCP tools
- Errors in Cursor console about MCP

## 🛠️ Troubleshooting

### Issue: MCP not showing after restart
1. Check `~/.cursor/mcp.json` is valid JSON
2. Verify Node.js is installed: `node --version`
3. Check Cursor logs: Help → Toggle Developer Tools → Console
4. Try reinstalling the package: `npx -y @modelcontextprotocol/server-cloudflare`

### Issue: "Command not found" errors
- Make sure Node.js is in your PATH
- Try using full path to node in `mcp.json`

### Issue: Connection timeout
- Verify API token is correct
- Check network/firewall settings
- Test API directly with curl (see Step 3)

## 📊 Current Status

- ✅ **MCP Config**: Valid JSON at `~/.cursor/mcp.json`
- ✅ **API Token**: Verified and active
- ✅ **Account ID**: Configured correctly
- ⏳ **Cursor Connection**: Requires restart to activate

## 🎯 Next Steps

1. **Restart Cursor** (Cmd+Q, wait, reopen)
2. **Test with**: "List all my R2 buckets"
3. **Check status bar** for MCP indicator
4. **If still not working**, check Cursor console for errors

---

**Your R2 Buckets Receipt**: See `R2_BUCKETS_RECEIPT.txt` for complete inventory (61 buckets total)
