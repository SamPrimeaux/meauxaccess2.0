import { renderBaseLayout } from './base-layout';

export function renderAPIDocsPage(): string {
  const content = `
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">MCP Tools Documentation</h1>
      <p class="page-subtitle">Complete reference for all available Model Context Protocol tools</p>
    </div>
  </div>
</header>

<div class="tabs">
  <a href="/api-docs" class="tab active">All Tools</a>
  <a href="/api-docs/zones" class="tab">Zone Management</a>
  <a href="/api-docs/workers" class="tab">Worker Deployment</a>
  <a href="/api-docs/analytics" class="tab">Analytics</a>
</div>

<div style="display: grid; gap: var(--space-6);">
  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">list_all_zones</h2>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--primary); margin-bottom: var(--space-4);">
      <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-3);">
        List all zones in the Cloudflare account for cross-zone management.
      </div>
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Parameters:</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">None</div>
    </div>
    <div style="padding: var(--space-4); background: var(--bg-hover); border-radius: var(--radius-md);">
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Example Usage:</div>
      <pre style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--text-primary); line-height: 1.6;"><code>"List all my Cloudflare zones"</code></pre>
    </div>
  </div>

  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">deploy_worker_to_zone</h2>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--accent); margin-bottom: var(--space-4);">
      <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-3);">
        Deploy a Cloudflare Worker to a specific zone.
      </div>
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Parameters:</div>
      <ul style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.8; padding-left: var(--space-5);">
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">zoneId</code> (required) - Zone ID to deploy to</li>
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">workerName</code> (required) - Name of the worker</li>
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">script</code> (required) - Worker script code</li>
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">routes</code> (optional) - Array of route patterns</li>
      </ul>
    </div>
    <div style="padding: var(--space-4); background: var(--bg-hover); border-radius: var(--radius-md);">
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Example Usage:</div>
      <pre style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--text-primary); line-height: 1.6;"><code>"Deploy a worker named 'my-api' to inneranimalmedia.com with this code: [paste code]"</code></pre>
    </div>
  </div>

  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">list_all_workers</h2>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--success); margin-bottom: var(--space-4);">
      <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-3);">
        List all workers across all zones in the account.
      </div>
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Parameters:</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">None</div>
    </div>
    <div style="padding: var(--space-4); background: var(--bg-hover); border-radius: var(--radius-md);">
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Example Usage:</div>
      <pre style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--text-primary); line-height: 1.6;"><code>"Show me all my deployed workers"</code></pre>
    </div>
  </div>

  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">get_zone_analytics</h2>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--info); margin-bottom: var(--space-4);">
      <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-3);">
        Get analytics for a specific zone.
      </div>
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Parameters:</div>
      <ul style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.8; padding-left: var(--space-5);">
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">zoneId</code> (required) - Zone ID</li>
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">since</code> (optional) - ISO timestamp for start date (defaults to 7 days ago)</li>
      </ul>
    </div>
    <div style="padding: var(--space-4); background: var(--bg-hover); border-radius: var(--radius-md);">
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Example Usage:</div>
      <pre style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--text-primary); line-height: 1.6;"><code>"Show analytics for inneranimalmedia.com for the last 7 days"</code></pre>
    </div>
  </div>

  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">create_zone_route</h2>
    <div style="padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--warning); margin-bottom: var(--space-4);">
      <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-3);">
        Create a route for a worker in a zone.
      </div>
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Parameters:</div>
      <ul style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.8; padding-left: var(--space-5);">
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">zoneId</code> (required) - Zone ID</li>
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">pattern</code> (required) - Route pattern (e.g., "example.com/*")</li>
        <li><code style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">script</code> (required) - Worker script name</li>
      </ul>
    </div>
    <div style="padding: var(--space-4); background: var(--bg-hover); border-radius: var(--radius-md);">
      <div style="font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary);">Example Usage:</div>
      <pre style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--text-primary); line-height: 1.6;"><code>"Create a route for my-worker on inneranimalmedia.com/*"</code></pre>
    </div>
  </div>

  <div class="card" style="background: linear-gradient(135deg, var(--primary-subtle), var(--bg-elevated)); border: 1px solid var(--primary);">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Quick Start with Claude</h2>
    <div style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-4);">
      Once you've connected Claude Desktop to this MCP server, you can use natural language to manage your Cloudflare infrastructure:
    </div>
    <div style="display: grid; gap: var(--space-3);">
      <div style="padding: var(--space-3); background: var(--bg-surface); border-radius: var(--radius-md);">
        <div style="font-weight: 600; margin-bottom: var(--space-1);">?? "List all my zones"</div>
        <div style="font-size: 0.875rem; color: var(--text-tertiary);">Claude will use the list_all_zones tool</div>
      </div>
      <div style="padding: var(--space-3); background: var(--bg-surface); border-radius: var(--radius-md);">
        <div style="font-weight: 600; margin-bottom: var(--space-1);">?? "Deploy this worker to inneranimalmedia.com"</div>
        <div style="font-size: 0.875rem; color: var(--text-tertiary);">Claude will deploy using deploy_worker_to_zone</div>
      </div>
      <div style="padding: var(--space-3); background: var(--bg-surface); border-radius: var(--radius-md);">
        <div style="font-weight: 600; margin-bottom: var(--space-1);">?? "Show analytics for my main zone"</div>
        <div style="font-size: 0.875rem; color: var(--text-tertiary);">Claude will fetch analytics data</div>
      </div>
    </div>
  </div>
</div>
`;

  return renderBaseLayout('API Documentation', content, 'api-docs');
}
