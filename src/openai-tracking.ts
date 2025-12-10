/**
 * OpenAI Usage Tracking System
 * Tracks all OpenAI API calls, token usage, and costs
 */

export interface OpenAIUsage {
  id: string;
  timestamp: string;
  user: string; // Email or identifier
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  outputLength: number; // Character count of output
  cost: number; // Calculated cost in USD
  prompt: string; // First 200 chars of prompt
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  byModel: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
  byUser: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
}

// OpenAI Pricing (per 1M tokens) - Updated December 2024
// Budget: $40.00/month = ~$9.23/week (assuming 4.33 weeks/month)
const MONTHLY_BUDGET = 40.00;
const WEEKLY_BUDGET = MONTHLY_BUDGET / 4.33; // ~$9.23/week

const PRICING: Record<string, { input: number; output: number }> = {
  // GPT-4o family
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-2024-05-13': { input: 2.50, output: 10.00 },
  'gpt-4o-2024-08-06': { input: 2.50, output: 10.00 },
  'gpt-4o-2024-11-20': { input: 2.50, output: 10.00 },
  'gpt-4o-audio-preview': { input: 2.50, output: 10.00 },
  'gpt-4o-audio-preview-2024-10-01': { input: 2.50, output: 10.00 },
  'gpt-4o-audio-preview-2024-12-17': { input: 2.50, output: 10.00 },
  'gpt-4o-audio-preview-2025-06-03': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-2024-07-18': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-audio-preview': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-audio-preview-2024-12-17': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-search-preview': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-search-preview-2025-03-11': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-transcribe': { input: 0.15, output: 0.60 },
  'gpt-4o-search-preview': { input: 2.50, output: 10.00 },
  'gpt-4o-search-preview-2025-03-11': { input: 2.50, output: 10.00 },
  'gpt-4o-transcribe': { input: 2.50, output: 10.00 },
  'gpt-4o-transcribe-diarize': { input: 2.50, output: 10.00 },

  // GPT-4 Turbo family
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-4-turbo-2024-04-09': { input: 10.00, output: 30.00 },
  'gpt-4-turbo-preview': { input: 10.00, output: 30.00 },
  'gpt-4-0125-preview': { input: 10.00, output: 30.00 },
  'gpt-4-1106-preview': { input: 10.00, output: 30.00 },

  // GPT-4.1 family
  'gpt-4.1': { input: 10.00, output: 30.00 },
  'gpt-4.1-2025-04-14': { input: 10.00, output: 30.00 },
  'gpt-4.1-mini': { input: 0.15, output: 0.60 },
  'gpt-4.1-mini-2025-04-14': { input: 0.15, output: 0.60 },
  'gpt-4.1-nano': { input: 0.15, output: 0.60 },
  'gpt-4.1-nano-2025-04-14': { input: 0.15, output: 0.60 },

  // GPT-5 family
  'gpt-5': { input: 1.25, output: 10.00 },
  'gpt-5-2025-08-07': { input: 1.25, output: 10.00 },
  'gpt-5-chat-latest': { input: 1.25, output: 10.00 },
  'gpt-5-codex': { input: 1.25, output: 10.00 },
  'gpt-5-mini': { input: 0.15, output: 0.60 },
  'gpt-5-mini-2025-08-07': { input: 0.15, output: 0.60 },
  'gpt-5-nano': { input: 0.15, output: 0.60 },
  'gpt-5-nano-2025-08-07': { input: 0.15, output: 0.60 },
  'gpt-5-pro': { input: 10.00, output: 30.00 },
  'gpt-5-pro-2025-10-06': { input: 10.00, output: 30.00 },
  'gpt-5-search-api': { input: 2.50, output: 10.00 },
  'gpt-5-search-api-2025-10-14': { input: 2.50, output: 10.00 },

  // GPT-5.1 family
  'gpt-5.1': { input: 1.25, output: 10.00 },
  'gpt-5.1-2025-11-13': { input: 1.25, output: 10.00 },
  'gpt-5.1-chat-latest': { input: 1.25, output: 10.00 },
  'gpt-5.1-codex': { input: 1.25, output: 10.00 },
  'gpt-5.1-codex-max': { input: 1.25, output: 10.00 },
  'gpt-5.1-codex-mini': { input: 0.15, output: 0.60 },

  // GPT-4 base
  'gpt-4': { input: 30.00, output: 60.00 },
  'gpt-4-0613': { input: 30.00, output: 60.00 },

  // GPT-3.5 family
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'gpt-3.5-turbo-0125': { input: 0.50, output: 1.50 },
  'gpt-3.5-turbo-1106': { input: 0.50, output: 1.50 },
  'gpt-3.5-turbo-16k': { input: 0.50, output: 1.50 },
  'gpt-3.5-turbo-instruct': { input: 1.50, output: 2.00 },
  'gpt-3.5-turbo-instruct-0914': { input: 1.50, output: 2.00 },

  // O1 family (reasoning models)
  'o1': { input: 15.00, output: 60.00 },
  'o1-2024-12-17': { input: 15.00, output: 60.00 },
  'o1-pro': { input: 15.00, output: 60.00 },
  'o1-pro-2025-03-19': { input: 15.00, output: 60.00 },

  // O3 family
  'o3': { input: 2.00, output: 8.00 },
  'o3-2025-04-16': { input: 2.00, output: 8.00 },
  'o3-deep-research': { input: 2.00, output: 8.00 },
  'o3-deep-research-2025-06-26': { input: 2.00, output: 8.00 },
  'o3-mini': { input: 0.15, output: 0.60 },
  'o3-mini-2025-01-31': { input: 0.15, output: 0.60 },
  'o3-pro': { input: 2.00, output: 8.00 },
  'o3-pro-2025-06-10': { input: 2.00, output: 8.00 },

  // O4 family
  'o4-mini': { input: 0.15, output: 0.60 },
  'o4-mini-2025-04-16': { input: 0.15, output: 0.60 },
  'o4-mini-deep-research': { input: 0.15, output: 0.60 },
  'o4-mini-deep-research-2025-06-26': { input: 0.15, output: 0.60 },

  // Audio models
  'gpt-audio': { input: 2.50, output: 10.00 },
  'gpt-audio-2025-08-28': { input: 2.50, output: 10.00 },
  'gpt-audio-mini': { input: 0.15, output: 0.60 },
  'gpt-audio-mini-2025-10-06': { input: 0.15, output: 0.60 },

  // Realtime models
  'gpt-realtime': { input: 2.50, output: 10.00 },
  'gpt-realtime-2025-08-28': { input: 2.50, output: 10.00 },
  'gpt-4o-realtime-preview': { input: 2.50, output: 10.00 },
  'gpt-4o-realtime-preview-latest': { input: 2.50, output: 10.00 },
  'gpt-4o-realtime-preview-2024-10-01': { input: 2.50, output: 10.00 },
  'gpt-4o-realtime-preview-2024-12-17': { input: 2.50, output: 10.00 },
  'gpt-4o-realtime-preview-2025-06-03': { input: 2.50, output: 10.00 },
  'gpt-realtime-mini': { input: 0.15, output: 0.60 },
  'gpt-realtime-mini-2025-10-06': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-realtime-preview': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-realtime-preview-2024-12-17': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-realtime-preview-2025-09-25': { input: 0.15, output: 0.60 },
  'gpt-4o-mini-realtime-preview-latest': { input: 0.15, output: 0.60 },

  // Text models
  'babbage-002': { input: 0.20, output: 0.20 },
  'davinci-002': { input: 2.00, output: 2.00 },
  'chatgpt-4o-latest': { input: 2.50, output: 10.00 },
  'codex-mini-latest': { input: 0.15, output: 0.60 },

  // Embeddings
  'text-embedding-3-large': { input: 0.13, output: 0.13 },
  'text-embedding-3-small': { input: 0.02, output: 0.02 },
  'text-embedding-ada-002': { input: 0.10, output: 0.10 },

  // Moderation
  'omni-moderation-2024-09-26': { input: 0.10, output: 0.10 },
  'omni-moderation-latest': { input: 0.10, output: 0.10 },
  'text-moderation-latest': { input: 0.10, output: 0.10 },
  'text-moderation-stable': { input: 0.10, output: 0.10 },

  // Default fallback
  'default': { input: 10.00, output: 30.00 },
};

/**
 * Calculate cost based on model and token usage
 */
export function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = PRICING[model] || PRICING['default'];
  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Log OpenAI usage to KV
 */
export async function logUsage(
  env: { KV_NOTIFICATIONS?: KVNamespace },
  usage: Omit<OpenAIUsage, 'id' | 'timestamp' | 'cost'>
): Promise<void> {
  if (!env.KV_NOTIFICATIONS) {
    console.warn('KV_NOTIFICATIONS not configured, skipping usage log');
    return;
  }

  const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const timestamp = new Date().toISOString();
  const cost = calculateCost(usage.model, usage.promptTokens, usage.completionTokens);

  const fullUsage: OpenAIUsage = {
    id,
    timestamp,
    cost,
    ...usage,
  };

  // Store individual usage record
  await env.KV_NOTIFICATIONS.put(
    `openai:usage:${id}`,
    JSON.stringify(fullUsage),
    { expirationTtl: 90 * 24 * 60 * 60 } // 90 days retention
  );

  // Add to daily index
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyKey = `openai:daily:${date}`;
  const dailyData = await env.KV_NOTIFICATIONS.get(dailyKey, 'json') as string[] || [];
  dailyData.push(id);
  await env.KV_NOTIFICATIONS.put(dailyKey, JSON.stringify(dailyData), {
    expirationTtl: 90 * 24 * 60 * 60
  });

  // Add to user index
  const userKey = `openai:user:${usage.user}:${date}`;
  const userData = await env.KV_NOTIFICATIONS.get(userKey, 'json') as string[] || [];
  userData.push(id);
  await env.KV_NOTIFICATIONS.put(userKey, JSON.stringify(userData), {
    expirationTtl: 90 * 24 * 60 * 60
  });

  console.log(`[OpenAI Tracking] Logged usage: ${id} - ${usage.totalTokens} tokens - $${cost.toFixed(4)}`);
}

/**
 * Get usage records for a date range
 */
export async function getUsageForPeriod(
  env: { KV_NOTIFICATIONS?: KVNamespace },
  startDate: string,
  endDate: string
): Promise<OpenAIUsage[]> {
  if (!env.KV_NOTIFICATIONS) {
    return [];
  }

  const usageRecords: OpenAIUsage[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Iterate through each day
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split('T')[0];
    const dailyKey = `openai:daily:${date}`;
    const dailyData = await env.KV_NOTIFICATIONS.get(dailyKey, 'json') as string[] | null;

    if (dailyData) {
      for (const id of dailyData) {
        const usageData = await env.KV_NOTIFICATIONS.get(`openai:usage:${id}`, 'json') as OpenAIUsage | null;
        if (usageData) {
          usageRecords.push(usageData);
        }
      }
    }
  }

  return usageRecords.sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

/**
 * Generate weekly summary
 */
export async function generateWeeklySummary(
  env: { KV_NOTIFICATIONS?: KVNamespace }
): Promise<WeeklySummary | null> {
  if (!env.KV_NOTIFICATIONS) {
    return null;
  }

  // Get last 7 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const usageRecords = await getUsageForPeriod(
    env,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  const summary: WeeklySummary = {
    weekStart: startDate.toISOString().split('T')[0],
    weekEnd: endDate.toISOString().split('T')[0],
    totalRequests: usageRecords.length,
    totalTokens: 0,
    totalCost: 0,
    byModel: {},
    byUser: {},
  };

  for (const usage of usageRecords) {
    // Aggregate totals
    summary.totalTokens += usage.totalTokens;
    summary.totalCost += usage.cost;

    // By model
    if (!summary.byModel[usage.model]) {
      summary.byModel[usage.model] = { requests: 0, tokens: 0, cost: 0 };
    }
    summary.byModel[usage.model].requests++;
    summary.byModel[usage.model].tokens += usage.totalTokens;
    summary.byModel[usage.model].cost += usage.cost;

    // By user
    if (!summary.byUser[usage.user]) {
      summary.byUser[usage.user] = { requests: 0, tokens: 0, cost: 0 };
    }
    summary.byUser[usage.user].requests++;
    summary.byUser[usage.user].tokens += usage.totalTokens;
    summary.byUser[usage.user].cost += usage.cost;
  }

  return summary;
}

/**
 * Format weekly summary as HTML email
 */
export function formatWeeklySummaryEmail(summary: WeeklySummary): string {
  const modelRows = Object.entries(summary.byModel)
    .map(([model, data]) => `
      <tr>
        <td><strong>${model}</strong></td>
        <td>${data.requests.toLocaleString()}</td>
        <td>${data.tokens.toLocaleString()}</td>
        <td>$${data.cost.toFixed(4)}</td>
      </tr>
    `).join('');

  const userRows = Object.entries(summary.byUser)
    .map(([user, data]) => `
      <tr>
        <td><strong>${user}</strong></td>
        <td>${data.requests.toLocaleString()}</td>
        <td>${data.tokens.toLocaleString()}</td>
        <td>$${data.cost.toFixed(4)}</td>
      </tr>
    `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
    .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: 600; }
    .total { font-size: 1.2em; font-weight: 700; color: #0EA5E9; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>?? OpenAI Usage Weekly Summary</h1>
      <p>${summary.weekStart} to ${summary.weekEnd}</p>
    </div>

    <div class="summary-box">
      <h2>?? Overall Statistics</h2>
      <table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Total Requests</td>
          <td class="total">${summary.totalRequests.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Total Tokens</td>
          <td class="total">${summary.totalTokens.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Total Cost</td>
          <td class="total">$${summary.totalCost.toFixed(4)}</td>
        </tr>
      </table>
    </div>

    <div class="summary-box">
      <h2>?? Usage by Model</h2>
      <table>
        <tr>
          <th>Model</th>
          <th>Requests</th>
          <th>Tokens</th>
          <th>Cost</th>
        </tr>
        ${modelRows}
      </table>
    </div>

    <div class="summary-box">
      <h2>?? Usage by User</h2>
      <table>
        <tr>
          <th>User</th>
          <th>Requests</th>
          <th>Tokens</th>
          <th>Cost</th>
        </tr>
        ${userRows}
      </table>
    </div>

    <div class="footer">
      <p>This is an automated weekly summary from MeauxMCP OpenAI Tracking System.</p>
      <p>Budget Alert: Current spend is ${((summary.totalCost / WEEKLY_BUDGET) * 100).toFixed(1)}% of $${WEEKLY_BUDGET.toFixed(2)} weekly budget ($${MONTHLY_BUDGET.toFixed(2)}/month).</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send weekly summary email
 */
export async function sendWeeklySummary(
  env: { KV_NOTIFICATIONS?: KVNamespace; RESEND_API_KEY?: string },
  recipient: string = 'sam@meauxbility.org'
): Promise<boolean> {
  const summary = await generateWeeklySummary(env);
  if (!summary || summary.totalRequests === 0) {
    console.log('[OpenAI Tracking] No usage to report this week');
    return false;
  }

  if (!env.RESEND_API_KEY) {
    console.warn('[OpenAI Tracking] RESEND_API_KEY not configured, cannot send email');
    return false;
  }

  const html = formatWeeklySummaryEmail(summary);
  const budgetPercent = ((summary.totalCost / WEEKLY_BUDGET) * 100).toFixed(1);
  const subject = `📊 OpenAI Usage Summary - Week of ${summary.weekStart} ($${summary.totalCost.toFixed(2)} / $${WEEKLY_BUDGET.toFixed(2)} - ${budgetPercent}%)`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MeauxMCP <noreply@meauxbility.org>',
        to: [recipient],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[OpenAI Tracking] Failed to send email:', error);
      return false;
    }

    console.log(`[OpenAI Tracking] Weekly summary sent to ${recipient}`);
    return true;
  } catch (error: any) {
    console.error('[OpenAI Tracking] Error sending email:', error);
    return false;
  }
}
