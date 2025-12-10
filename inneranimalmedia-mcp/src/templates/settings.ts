import { renderBaseLayout } from './base-layout';

export function renderSettingsPage(env: any): string {
  const content = `
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure your MCP platform and integrations</p>
    </div>
  </div>
</header>

<div class="tabs">
  <a href="/settings" class="tab active">General</a>
  <a href="/settings/integrations" class="tab">Integrations</a>
  <a href="/settings/security" class="tab">Security</a>
  <a href="/settings/api" class="tab">API Keys</a>
</div>

<div style="display: grid; gap: var(--space-6);">
  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Platform Configuration</h2>
    <div style="display: grid; gap: var(--space-4);">
      <div>
        <label style="display: block; font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Account ID</label>
        <input type="text" value="${env.CLOUDFLARE_ACCOUNT_ID || ''}" readonly style="width: 100%; padding: var(--space-3) var(--space-4); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; font-size: 0.875rem;">
      </div>
      <div>
        <label style="display: block; font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Primary Zone</label>
        <input type="text" value="${env.PRIMARY_ZONE_NAME || 'inneranimalmedia.com'}" readonly style="width: 100%; padding: var(--space-3) var(--space-4); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; font-size: 0.875rem;">
      </div>
    </div>
  </div>

  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Secrets Status</h2>
    <div style="display: grid; gap: var(--space-3);">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">GitHub Token</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">For repository management</div>
        </div>
        <div style="padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; background: rgba(16, 185, 129, 0.1); color: var(--success);">Configured</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Cloudflare API Token</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">For zone and worker management</div>
        </div>
        <div style="padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; background: rgba(16, 185, 129, 0.1); color: var(--success);">Configured</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">MCP Auth Token</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">Optional authentication for MCP endpoint</div>
        </div>
        <div style="padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; background: rgba(245, 158, 11, 0.1); color: var(--warning);">Optional</div>
      </div>
    </div>
  </div>

  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">MCP Endpoint</h2>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Server URL</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: var(--space-4); word-break: break-all;">
        https://mcp.inneranimalmedia.com/mcp
      </div>
      <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-4);">
        Use this URL to connect Claude Desktop or other MCP clients. The endpoint supports JSON-RPC 2.0 protocol.
      </div>
      <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('https://mcp.inneranimalmedia.com/mcp')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>
        Copy URL
      </button>
    </div>
  </div>

  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Claude Desktop Configuration</h2>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: var(--space-4); line-height: 1.6;">
        Add this to your <code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">claude_desktop_config.json</code>:
      </div>
      <pre style="background: var(--bg-hover); padding: var(--space-4); border-radius: var(--radius-md); overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; line-height: 1.6; color: var(--text-primary);"><code>{
  "mcpServers": {
    "inneranimalmedia": {
      "url": "https://mcp.inneranimalmedia.com/mcp",
      "transport": "sse"
    }
  }
}</code></pre>
      <button class="btn btn-secondary" style="margin-top: var(--space-4);" onclick="navigator.clipboard.writeText(JSON.stringify({mcpServers:{inneranimalmedia:{url:'https://mcp.inneranimalmedia.com/mcp',transport:'sse'}}}, null, 2))">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>
        Copy Config
      </button>
    </div>
  </div>
</div>
`;

  return renderBaseLayout('Settings', content, 'settings');
}
