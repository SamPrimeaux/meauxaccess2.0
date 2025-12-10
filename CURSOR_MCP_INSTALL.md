# 🚀 How to Install MCP in Cursor - Step by Step

## ✅ Quick Setup Guide

### **Step 1: Verify Bridge Server Exists**
The bridge server should already be at:
```
~/cloudflare-mcp-bridge/bridge.js
```

If it doesn't exist, it will be created automatically.

### **Step 2: Check Your MCP Config**
Your MCP config is at: `~/.cursor/mcp.json`

Current configuration:
```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "node",
      "args": ["/Users/samprimeaux/cloudflare-mcp-bridge/bridge.js"],
      "env": {
        "CLOUDFLARE_MCP_URL": "https://meauxmcp.meauxbility.workers.dev/mcp",
        "CLOUDFLARE_API_TOKEN": "iD99g0lrGy-ArCW0uUws7svvChQReRjNFFhQHXK4"
      }
    },
    "user-cloudflare": {
      "command": "node",
      "args": ["/Users/samprimeaux/cloudflare-mcp-bridge/bridge.js"],
      "env": {
        "CLOUDFLARE_MCP_URL": "https://meauxmcp.meauxbility.workers.dev/mcp",
        "CLOUDFLARE_API_TOKEN": "iD99g0lrGy-ArCW0uUws7svvChQReRjNFFhQHXK4"
      }
    }
  }
}
```

### **Step 3: Restart Cursor Completely**
1. **Quit Cursor completely** (Cmd+Q on Mac, or File → Exit)
2. **Wait 5 seconds**
3. **Reopen Cursor**

### **Step 4: Verify MCP is Connected**

After restarting, check for MCP status:
- Look for MCP indicator in Cursor's status bar (bottom-right)
- Or try asking in chat: "List all my R2 buckets"

---

## 🔧 Alternative: Use Official Cloudflare MCP Server

If the bridge doesn't work, you can use the official Cloudflare MCP server package:

### **Option A: Official Package (Recommended)**

Update `~/.cursor/mcp.json` to:
```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-cloudflare"
      ],
      "env": {
        "CLOUDFLARE_ACCOUNT_ID": "ede6590ac0d2fb7daf155b35653457b2",
        "CLOUDFLARE_API_TOKEN": "iD99g0lrGy-ArCW0uUws7svvChQReRjNFFhQHXK4"
      }
    }
  }
}
```

This uses the official `@modelcontextprotocol/server-cloudflare` package.

### **Option B: Keep Bridge Server**

If you want to use your custom bridge server (connects to your `meauxmcp` worker), keep the current config.

---

## 🧪 Test the Connection

### **Test 1: Check Bridge Server**
```bash
node /Users/samprimeaux/cloudflare-mcp-bridge/bridge.js <<< '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
```

Should output JSON response from MCP server.

### **Test 2: Test MCP Endpoint Directly**
```bash
curl -X POST "https://meauxmcp.meauxbility.workers.dev/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer iD99g0lrGy-ArCW0uUws7svvChQReRjNFFhQHXK4" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
```

Should return MCP protocol response.

---

## 📋 Troubleshooting

### **Issue: MCP not showing in Cursor**
1. ✅ Check `~/.cursor/mcp.json` exists and is valid JSON
2. ✅ Verify Node.js is installed: `node --version`
3. ✅ Make sure bridge.js is executable: `chmod +x ~/cloudflare-mcp-bridge/bridge.js`
4. ✅ **Restart Cursor completely** (not just reload window)

### **Issue: "Command not found" errors**
- Make sure Node.js is in your PATH
- Try using full path: `/usr/local/bin/node` or `/opt/homebrew/bin/node`

### **Issue: Connection timeout**
- Check MCP server is online: `curl https://meauxmcp.meauxbility.workers.dev/health`
- Verify API token is correct
- Check firewall/network settings

### **Issue: "R2Bucket is not defined"**
- This means the MCP server needs the API token
- Make sure `CLOUDFLARE_API_TOKEN` is set in the env section
- The token should be: `iD99g0lrGy-ArCW0uUws7svvChQReRjNFFhQHXK4`

---

## 🎯 What You Should See After Setup

Once MCP is connected, you can use commands like:
- "List all my R2 buckets"
- "Show me all my Cloudflare workers"
- "Query my D1 database"
- "Upload a file to R2 bucket meauxbilityorgfinal"

The MCP tools will appear in Cursor's autocomplete and be available in chat.

---

## ✅ Current Status

- ✅ Bridge server: `/Users/samprimeaux/cloudflare-mcp-bridge/bridge.js`
- ✅ MCP config: `~/.cursor/mcp.json` (configured)
- ✅ API token: Verified and active
- ✅ MCP server: Online at `https://meauxmcp.meauxbility.workers.dev/mcp`

**Next Step**: Restart Cursor completely!
