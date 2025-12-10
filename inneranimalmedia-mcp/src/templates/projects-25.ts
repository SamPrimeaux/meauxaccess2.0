import { renderBaseLayout } from './base-layout';

export function renderProjects25Page(workers: any[] = []): string {
  // Get last 25 workers
  const last25Workers = workers.slice(0, 25);

  const content = `
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">Last 25 Workers</h1>
      <p class="page-subtitle">Your most recent Cloudflare Worker deployments</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-secondary" onclick="window.location.href='/projects'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Projects
      </button>
      <button class="btn btn-primary" onclick="window.location.href='/workers'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        View All Workers
      </button>
    </div>
  </div>
</header>

<div class="tabs">
  <a href="/projects-25" class="tab active">Last 25</a>
  <a href="/projects" class="tab">All Projects</a>
  <a href="/workers" class="tab">All Workers</a>
</div>

<div style="margin-bottom: var(--space-6); padding: var(--space-4); background: linear-gradient(135deg, var(--primary-subtle), var(--bg-elevated)); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
  <div style="display: flex; align-items: center; gap: var(--space-3);">
    <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    </div>
    <div style="flex: 1;">
      <div style="font-weight: 700; margin-bottom: 4px; color: var(--text-primary);">Connected to Inner Animal Media</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">
        Showing ${last25Workers.length} of ${workers.length} total workers
        <a href="https://inner-animal-media.pages.dev/" target="_blank" style="color: var(--primary); text-decoration: underline; margin-left: 8px;">Visit Site ?</a>
      </div>
    </div>
  </div>
</div>

<div style="display: grid; gap: var(--space-4);" id="workers-grid">
  ${last25Workers.length > 0 ? last25Workers.map((worker: any, index: number) => {
    const workerId = worker.id || worker.name || `worker-${index}`;
    const createdDate = worker.created_on ? new Date(worker.created_on).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'Unknown';
    const modifiedDate = worker.modified_on ? new Date(worker.modified_on).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : createdDate;

    return `
      <article class="card" style="cursor: pointer; position: relative;" onclick="window.location.href='/workers/${encodeURIComponent(workerId)}'">
        <div style="position: absolute; top: var(--space-4); right: var(--space-4); padding: var(--space-1) var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary);">
          #${index + 1}
        </div>
        <div style="display: flex; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-4);">
          <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--accent-light), var(--bg-elevated)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div style="flex: 1; min-width: 0; padding-right: 60px;">
            <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-1); letter-spacing: -0.01em; line-height: 1.3;">${workerId}</h3>
            <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500; font-family: 'JetBrains Mono', monospace; margin-bottom: var(--space-2);">
              Created: ${createdDate}
            </div>
            ${worker.modified_on && worker.modified_on !== worker.created_on ? `
              <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500;">
                Updated: ${modifiedDate}
              </div>
            ` : ''}
          </div>
          <div style="color: var(--text-tertiary); transition: all var(--transition-base); flex-shrink: 0; position: absolute; right: var(--space-4); top: 50%; transform: translateY(-50%);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>
        <footer style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
          <div style="padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; text-transform: capitalize; letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: var(--space-2); background: rgba(16, 185, 129, 0.1); color: var(--success);">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse 2s infinite;"></span>
            Active
          </div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 500;">
            <a href="https://${workerId}.meauxbility.workers.dev" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">
              View Worker ?
            </a>
          </div>
        </footer>
      </article>
    `;
  }).join('') : `
    <div class="card" style="text-align: center; padding: var(--space-8);">
      <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.5;">?</div>
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-2);">No workers found</h3>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">Workers will appear here once deployed</p>
      <button class="btn btn-primary" onclick="window.location.href='/workers'">View All Workers</button>
    </div>
  `}
</div>

${last25Workers.length >= 25 ? `
  <div style="text-align: center; margin-top: var(--space-8);">
    <a href="/workers" class="btn btn-secondary">
      View All ${workers.length} Workers
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </a>
  </div>
` : ''}

<script>
// Load workers if not already loaded
async function loadWorkers() {
  try {
    const response = await fetch('/api/workers');
    const data = await response.json();
    if (data.workers && data.workers.length > 0) {
      // Workers loaded, page will refresh with data
      if (data.workers.length !== ${last25Workers.length}) {
        window.location.reload();
      }
    }
  } catch (error) {
    console.error('Failed to load workers:', error);
  }
}

// Refresh workers every 30 seconds
setInterval(loadWorkers, 30000);
</script>
`;

  return renderBaseLayout('Last 25 Workers', content, 'projects');
}
