import { renderBaseLayout } from './base-layout';

export function renderAnalyticsPage(): string {
  const content = `
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">Analytics</h1>
      <p class="page-subtitle">Monitor performance and usage across your infrastructure</p>
    </div>
    <div class="page-actions">
      <select style="padding: var(--space-3) var(--space-5); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-weight: 600; font-size: 0.9375rem; cursor: pointer;">
        <option>Last 24 hours</option>
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
      </select>
    </div>
  </div>
</header>

<div class="tabs">
  <a href="/analytics" class="tab active">Overview</a>
  <a href="/analytics/zones" class="tab">By Zone</a>
  <a href="/analytics/workers" class="tab">By Worker</a>
  <a href="/analytics/requests" class="tab">Requests</a>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
  <div class="card">
    <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: var(--space-2);">Total Requests</div>
    <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: var(--space-1);" id="total-requests">8.4M</div>
    <div style="font-size: 0.875rem; color: var(--success); font-weight: 600;">+23% from last month</div>
  </div>
  <div class="card">
    <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: var(--space-2);">Avg Response Time</div>
    <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: var(--space-1);" id="avg-response">47ms</div>
    <div style="font-size: 0.875rem; color: var(--success); font-weight: 600;">P95: 89ms ? 6ms faster</div>
  </div>
  <div class="card">
    <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: var(--space-2);">Monthly Costs</div>
    <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: var(--space-1);" id="monthly-costs">$847</div>
    <div style="font-size: 0.875rem; color: var(--success); font-weight: 600;">Est. savings: $1.2K vs AWS</div>
  </div>
  <div class="card">
    <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: var(--space-2);">AI API Calls</div>
    <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: var(--space-1);" id="ai-calls">142K</div>
    <div style="font-size: 0.875rem; color: var(--success); font-weight: 600;">Cache hit: 67% Saved: $2.1K</div>
  </div>
</div>

<div class="card" style="margin-bottom: var(--space-6);">
  <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Request Volume & Performance</h2>
  <div style="height: 300px; background: var(--bg-elevated); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--text-tertiary);">
    <div style="text-align: center;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto var(--space-4); opacity: 0.5;">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      <div>Chart visualization coming soon</div>
      <div style="font-size: 0.875rem; margin-top: var(--space-2);">Real-time analytics data will be displayed here</div>
    </div>
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: var(--space-6);">
  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Service Distribution</h2>
    <div style="display: grid; gap: var(--space-3);">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Workers</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">45% of requests</div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">3.8M</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Storage</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">32% of requests</div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent);">2.7M</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">AI Gateway</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">23% of requests</div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--success);">1.9M</div>
      </div>
    </div>
  </div>

  <div class="card">
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-4);">Cost Breakdown</h2>
    <div style="display: grid; gap: var(--space-3);">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Workers</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">Compute & execution</div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">$342</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">R2 Storage</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">Object storage</div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent);">$198</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md);">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">AI Gateway</div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">AI API calls</div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--success);">$307</div>
      </div>
    </div>
  </div>
</div>
`;

  return renderBaseLayout('Analytics', content, 'analytics');
}
