// Shared iAccess Platform Components
// Used across all pages for consistency

const IACCESS_CONFIG = {
  API_BASE: 'https://iaccess-api.meauxbility.workers.dev',
  ROUTER_BASE: 'https://iacess.meauxbility.workers.dev',
  ACCOUNT_ID: 'ede6590ac0d2fb7daf155b35653457b2'
};

// API Client
class IAccessAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetch(endpoint, options = {}) {
    const token = localStorage.getItem('iaccess_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Stats
  async getStats() { return this.fetch('/api/stats'); }
  async getAIGatewayStats() { return this.fetch('/api/ai-gateway/stats'); }
  async getBrowserRenderingStats() { return this.fetch('/api/browser-rendering/stats'); }

  // Workers
  async getWorkers() { return this.fetch('/api/workers'); }
  async getWorker(name) { return this.fetch(`/api/workers/${name}`); }
  async getWorkerLogs(name) { return this.fetch(`/api/workers/${name}/logs`); }

  // Databases
  async getDatabases() { return this.fetch('/api/databases'); }
  async queryDatabase(id, sql) { return this.fetch(`/api/databases/${id}/query`, { method: 'POST', body: JSON.stringify({ sql }) }); }

  // Storage
  async getBuckets() { return this.fetch('/api/storage/buckets'); }
  async getBucketObjects(bucket) { return this.fetch(`/api/storage/buckets/${bucket}/objects`); }

  // KV
  async getKVNamespaces() { return this.fetch('/api/kv/namespaces'); }
  async getKVKeys(namespace) { return this.fetch(`/api/kv/namespaces/${namespace}/keys`); }

  // Vectorize
  async getVectorizeIndexes() { return this.fetch('/api/vectorize/indexes'); }

  // Workflows
  async getWorkflows() { return this.fetch('/api/workflows'); }

  // Queues
  async getQueues() { return this.fetch('/api/queues'); }

  // Email
  async getEmailRoutes() { return this.fetch('/api/email/routes'); }

  // Billing
  async getUsage() { return this.fetch('/api/billing/usage'); }
  async getCosts() { return this.fetch('/api/billing/costs'); }
}

const api = new IAccessAPI(IACCESS_CONFIG.API_BASE);

// Navigation helper
function navigateTo(path) {
  window.location.href = `${IACCESS_CONFIG.ROUTER_BASE}${path}`;
}

// Format numbers
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Format bytes
function formatBytes(bytes) {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return bytes + ' B';
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--ia-primary);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Loading spinner
function showLoading(element) {
  element.innerHTML = '<div class="loading-spinner"></div>';
}

// Error handler
function handleError(error, context = '') {
  console.error(`Error ${context}:`, error);
  showToast(`Error: ${error.message}`, 'error');
}

// Export for use in pages
window.IAccessAPI = IAccessAPI;
window.api = api;
window.IACCESS_CONFIG = IACCESS_CONFIG;
window.navigateTo = navigateTo;
window.formatNumber = formatNumber;
window.formatBytes = formatBytes;
window.formatCurrency = formatCurrency;
window.showToast = showToast;
window.handleError = handleError;
