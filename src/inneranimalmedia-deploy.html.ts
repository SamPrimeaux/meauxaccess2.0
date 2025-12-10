export default `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deploy Templates - Inner Animal Media</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary: #3b82f6;
      --primary-dark: #2563eb;
      --primary-light: #60a5fa;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --neutral-50: #f9fafb;
      --neutral-100: #f3f4f6;
      --neutral-200: #e5e7eb;
      --neutral-300: #d1d5db;
      --neutral-400: #9ca3af;
      --neutral-500: #6b7280;
      --neutral-600: #4b5563;
      --neutral-700: #374151;
      --neutral-800: #1f2937;
      --neutral-900: #111827;
      --white: #ffffff;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: var(--neutral-50);
      color: var(--neutral-900);
      line-height: 1.6;
    }
    
    /* Dark Glassmorphic Header */
    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.25rem;
    }
    
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--white);
      text-decoration: none;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .header-btn {
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }
    
    .header-btn-login {
      background: transparent;
      color: var(--white);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .header-btn-login:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    .header-btn-signup {
      background: var(--primary);
      color: var(--white);
    }
    
    .header-btn-signup:hover {
      background: var(--primary-dark);
    }
    
    /* Main Content */
    .main-content {
      margin-top: 80px;
      padding: 3rem 2rem;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .page-header {
      margin-bottom: 3rem;
    }
    
    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: 0.5rem;
    }
    
    .page-subtitle {
      font-size: 1.125rem;
      color: var(--neutral-500);
    }
    
    /* Deployment Section */
    .deploy-section {
      background: var(--white);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }
    
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: 1.5rem;
    }
    
    /* Drag & Drop Zone */
    .drop-zone {
      border: 2px dashed var(--neutral-300);
      border-radius: 12px;
      padding: 4rem 2rem;
      text-align: center;
      background: var(--neutral-50);
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
    }
    
    .drop-zone:hover {
      border-color: var(--primary);
      background: rgba(59, 130, 246, 0.05);
    }
    
    .drop-zone.dragover {
      border-color: var(--primary);
      background: rgba(59, 130, 246, 0.1);
      transform: scale(1.02);
    }
    
    .drop-zone-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .drop-zone-text {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--neutral-700);
      margin-bottom: 0.5rem;
    }
    
    .drop-zone-subtext {
      font-size: 0.875rem;
      color: var(--neutral-500);
      margin-bottom: 1rem;
    }
    
    .drop-zone-formats {
      font-size: 0.75rem;
      color: var(--neutral-400);
    }
    
    .file-input {
      display: none;
    }
    
    .upload-button {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: var(--primary);
      color: var(--white);
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 0.875rem;
    }
    
    .upload-button:hover {
      background: var(--primary-dark);
    }
    
    /* File List */
    .file-list {
      margin-top: 2rem;
    }
    
    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: var(--neutral-50);
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }
    
    .file-icon {
      width: 40px;
      height: 40px;
      background: var(--primary-light);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .file-details {
      flex: 1;
    }
    
    .file-name {
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: 0.25rem;
    }
    
    .file-meta {
      font-size: 0.875rem;
      color: var(--neutral-500);
    }
    
    .file-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      background: transparent;
    }
    
    .btn-icon:hover {
      background: var(--neutral-200);
    }
    
    /* Deployment Options */
    .deploy-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .option-card {
      background: var(--neutral-50);
      border: 2px solid var(--neutral-200);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s;
      cursor: pointer;
    }
    
    .option-card:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .option-card.selected {
      border-color: var(--primary);
      background: rgba(59, 130, 246, 0.05);
    }
    
    .option-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }
    
    .option-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: 0.5rem;
    }
    
    .option-description {
      font-size: 0.875rem;
      color: var(--neutral-600);
      line-height: 1.5;
    }
    
    /* Deployment Form */
    .deploy-form {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--neutral-200);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      font-weight: 600;
      color: var(--neutral-700);
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--neutral-300);
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }
    
    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--neutral-300);
      border-radius: 8px;
      font-size: 0.875rem;
      background: var(--white);
      cursor: pointer;
    }
    
    .form-textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--neutral-300);
      border-radius: 8px;
      font-size: 0.875rem;
      min-height: 100px;
      font-family: 'Monaco', 'Courier New', monospace;
      resize: vertical;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .btn-primary {
      padding: 0.75rem 2rem;
      background: var(--primary);
      color: var(--white);
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary:hover {
      background: var(--primary-dark);
    }
    
    .btn-primary:disabled {
      background: var(--neutral-300);
      cursor: not-allowed;
    }
    
    .btn-secondary {
      padding: 0.75rem 2rem;
      background: var(--neutral-200);
      color: var(--neutral-700);
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-secondary:hover {
      background: var(--neutral-300);
    }
    
    /* Progress Bar */
    .progress-container {
      margin-top: 2rem;
      display: none;
    }
    
    .progress-container.active {
      display: block;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--neutral-200);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--primary-light));
      transition: width 0.3s;
      width: 0%;
    }
    
    .progress-text {
      font-size: 0.875rem;
      color: var(--neutral-600);
      text-align: center;
    }
    
    /* Status Messages */
    .status-message {
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      display: none;
    }
    
    .status-message.active {
      display: block;
    }
    
    .status-message.success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--success);
      color: var(--success);
    }
    
    .status-message.error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--error);
      color: var(--error);
    }
    
    .status-message.info {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid var(--primary);
      color: var(--primary);
    }
    
    /* Deployments List */
    .deployments-section {
      background: var(--white);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-top: 2rem;
    }
    
    .deployment-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: var(--neutral-50);
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }
    
    .deployment-info {
      flex: 1;
    }
    
    .deployment-name {
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: 0.25rem;
    }
    
    .deployment-meta {
      font-size: 0.875rem;
      color: var(--neutral-500);
    }
    
    .deployment-status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .status-active {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }
    
    .status-pending {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .main-content {
        padding: 2rem 1rem;
      }
      
      .page-title {
        font-size: 2rem;
      }
      
      .deploy-options {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <!-- Dark Glassmorphic Header -->
  <header class="site-header">
    <div class="header-content">
      <a href="/" class="logo-section">
        <div class="logo-icon">IA</div>
        <span class="logo-text">INNERANIMALMEDIA</span>
      </a>
      <div class="header-actions">
        <a href="/iaccess" class="header-btn header-btn-login">Dashboard</a>
        <a href="/pricing" class="header-btn header-btn-signup">Pricing</a>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="main-content">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Deploy Templates & Builds</h1>
        <p class="page-subtitle">Upload HTML, static sites, or complete builds and deploy them instantly to inneranimalmedia.com</p>
      </div>
      
      <!-- Upload Section -->
      <div class="deploy-section">
        <h2 class="section-title">Upload Your Build</h2>
        
        <div class="drop-zone" id="dropZone">
          <div class="drop-zone-icon">📦</div>
          <div class="drop-zone-text">Drag & Drop Files Here</div>
          <div class="drop-zone-subtext">or click to browse</div>
          <div class="drop-zone-formats">Supports: HTML, CSS, JS, ZIP, and complete static sites</div>
          <input type="file" id="fileInput" class="file-input" multiple webkitdirectory directory>
          <button class="upload-button" onclick="document.getElementById('fileInput').click()">Choose Files</button>
        </div>
        
        <div class="file-list" id="fileList"></div>
        
        <!-- Progress Bar -->
        <div class="progress-container" id="progressContainer">
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="progress-text" id="progressText">Uploading...</div>
        </div>
        
        <!-- Status Message -->
        <div class="status-message" id="statusMessage"></div>
      </div>
      
      <!-- Deployment Options -->
      <div class="deploy-section">
        <h2 class="section-title">Deployment Options</h2>
        
        <div class="deploy-options">
          <div class="option-card" data-option="worker">
            <div class="option-icon">⚡</div>
            <div class="option-title">Cloudflare Worker</div>
            <div class="option-description">Deploy as a Cloudflare Worker for edge computing and global distribution. Best for dynamic content.</div>
          </div>
          
          <div class="option-card selected" data-option="pages">
            <div class="option-icon">📄</div>
            <div class="option-title">Cloudflare Pages</div>
            <div class="option-description">Deploy as static site on Cloudflare Pages. Perfect for HTML/CSS/JS sites with automatic CDN.</div>
          </div>
          
          <div class="option-card" data-option="r2">
            <div class="option-icon">☁️</div>
            <div class="option-title">R2 Storage</div>
            <div class="option-description">Store files in R2 bucket and serve via custom domain. Great for static assets and archives.</div>
          </div>
          
          <div class="option-card" data-option="images">
            <div class="option-icon">🖼️</div>
            <div class="option-title">Cloudflare Images</div>
            <div class="option-description">Upload and optimize images with automatic resizing, CDN delivery, and variant generation.</div>
          </div>
        </div>
        
        <!-- Deployment Form -->
        <div class="deploy-form">
          <div class="form-group">
            <label class="form-label">Project Name</label>
            <input type="text" class="form-input" id="projectName" placeholder="my-awesome-project">
          </div>
          
          <div class="form-group">
            <label class="form-label">Deployment Type</label>
            <select class="form-select" id="deployType">
              <option value="pages">Cloudflare Pages (Static Site)</option>
              <option value="worker">Cloudflare Worker</option>
              <option value="r2">R2 Storage (Static Files)</option>
              <option value="images">Cloudflare Images (Image Optimization)</option>
            </select>
          </div>
          
          <div class="form-group" id="customDomainGroup">
            <label class="form-label">Custom Domain (optional)</label>
            <input type="text" class="form-input" id="customDomain" placeholder="project.inneranimalmedia.com">
            <small style="color: var(--neutral-500); font-size: 0.75rem; margin-top: 0.25rem; display: block;">
              Leave empty to use default inneranimalmedia.com subdomain
            </small>
          </div>
          
          <div class="form-group" id="imageOptionsGroup" style="display: none;">
            <label class="form-label">
              <input type="checkbox" id="requireSignedURLs" style="margin-right: 0.5rem;">
              Require Signed URLs (for private images)
            </label>
            <small style="color: var(--neutral-500); font-size: 0.75rem; margin-top: 0.25rem; display: block;">
              Enable this to require signature tokens for accessing images
            </small>
          </div>
          
          <div class="form-group" id="buildCommandGroup" style="display: none;">
            <label class="form-label">Build Command (optional)</label>
            <input type="text" class="form-input" id="buildCommand" placeholder="npm run build">
          </div>
          
          <div class="form-group">
            <label class="form-label">Environment Variables (JSON, optional)</label>
            <textarea class="form-textarea" id="envVars" placeholder='{"API_KEY": "value", "ENV": "production"}'></textarea>
          </div>
          
          <div class="form-actions">
            <button class="btn-primary" id="deployButton" disabled>Deploy Now</button>
            <button class="btn-secondary" id="clearButton">Clear Files</button>
          </div>
        </div>
      </div>
      
      <!-- Recent Deployments -->
      <div class="deployments-section">
        <h2 class="section-title">Recent Deployments</h2>
        <div id="deploymentsList">
          <div style="text-align: center; padding: 2rem; color: var(--neutral-500);">
            No deployments yet. Upload files and deploy to get started!
          </div>
        </div>
      </div>
      
      <!-- Cloudflare Images Stats -->
      <div class="deployments-section" style="margin-top: 2rem;">
        <h2 class="section-title">Cloudflare Images</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--neutral-50); padding: 1.5rem; border-radius: 8px;">
            <div style="font-size: 0.875rem; color: var(--neutral-500); margin-bottom: 0.5rem;">Images Delivered</div>
            <div style="font-size: 2rem; font-weight: 700; color: var(--primary);" id="imagesDelivered">-</div>
          </div>
          <div style="background: var(--neutral-50); padding: 1.5rem; border-radius: 8px;">
            <div style="font-size: 0.875rem; color: var(--neutral-500); margin-bottom: 0.5rem;">Images Stored</div>
            <div style="font-size: 2rem; font-weight: 700; color: var(--success);" id="imagesStored">-</div>
            <div style="font-size: 0.75rem; color: var(--neutral-500); margin-top: 0.25rem;">of 100,000</div>
          </div>
          <div style="background: var(--neutral-50); padding: 1.5rem; border-radius: 8px;">
            <div style="font-size: 0.875rem; color: var(--neutral-500); margin-bottom: 0.5rem;">Account Hash</div>
            <div style="font-size: 0.875rem; font-weight: 600; color: var(--neutral-700); font-family: monospace;" id="accountHash">g7wf09fCONpnidkRnR_5vw</div>
            <button class="btn-icon" onclick="copyAccountHash()" style="margin-top: 0.5rem; width: 100%;" title="Copy">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              Copy Hash
            </button>
          </div>
        </div>
        <div style="background: var(--neutral-50); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
          <div style="font-size: 0.875rem; color: var(--neutral-600); margin-bottom: 0.5rem;">Image Delivery URL Format:</div>
          <code style="font-size: 0.75rem; color: var(--primary); background: var(--white); padding: 0.5rem; border-radius: 4px; display: block;">
            https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/&lt;image_id&gt;/&lt;variant_name&gt;
          </code>
        </div>
        <button class="btn-secondary" onclick="loadImages()" style="width: 100%;">View All Images</button>
        <div id="imagesList" style="margin-top: 1rem;"></div>
      </div>
    </div>
  </main>
  
  <script>
    let uploadedFiles = [];
    let selectedOption = 'pages';
    
    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      setupDragAndDrop();
      setupFileInput();
      setupOptionCards();
      setupDeployButton();
      loadDeployments();
    });
    
    // Drag & Drop Setup
    function setupDragAndDrop() {
      const dropZone = document.getElementById('dropZone');
      
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
      });
      
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.add('dragover');
        }, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.remove('dragover');
        }, false);
      });
      
      dropZone.addEventListener('drop', handleDrop, false);
    }
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    }
    
    // File Input Setup
    function setupFileInput() {
      const fileInput = document.getElementById('fileInput');
      fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
      });
    }
    
    // Handle Files
    async function handleFiles(files) {
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        uploadedFiles.push({
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          path: file.webkitRelativePath || file.name
        });
      }
      
      renderFileList();
      updateDeployButton();
    }
    
    // Render File List
    function renderFileList() {
      const fileList = document.getElementById('fileList');
      
      if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
      }
      
      fileList.innerHTML = uploadedFiles.map((item, index) => \`
        <div class="file-item">
          <div class="file-info">
            <div class="file-icon">📄</div>
            <div class="file-details">
              <div class="file-name">\${item.name}</div>
              <div class="file-meta">\${formatFileSize(item.size)} • \${item.type || 'Unknown type'}</div>
            </div>
          </div>
          <div class="file-actions">
            <button class="btn-icon" onclick="removeFile(\${index})" title="Remove">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      \`).join('');
    }
    
    function removeFile(index) {
      uploadedFiles.splice(index, 1);
      renderFileList();
      updateDeployButton();
    }
    
    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    // Option Cards Setup
    function setupOptionCards() {
      document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedOption = card.dataset.option;
          
          // Update deploy type select
          document.getElementById('deployType').value = selectedOption;
          
          // Show/hide form fields based on option
      const buildCommandGroup = document.getElementById('buildCommandGroup');
      const imageOptionsGroup = document.getElementById('imageOptionsGroup');
      const customDomainGroup = document.getElementById('customDomainGroup');
      
      if (selectedOption === 'pages') {
        buildCommandGroup.style.display = 'block';
        imageOptionsGroup.style.display = 'none';
        customDomainGroup.style.display = 'block';
      } else if (selectedOption === 'images') {
        buildCommandGroup.style.display = 'none';
        imageOptionsGroup.style.display = 'block';
        customDomainGroup.style.display = 'none';
      } else {
        buildCommandGroup.style.display = 'none';
        imageOptionsGroup.style.display = 'none';
        customDomainGroup.style.display = 'block';
      }
    });
      });
    }
    
    // Deploy Type Select Change
    document.getElementById('deployType').addEventListener('change', (e) => {
      selectedOption = e.target.value;
      document.querySelectorAll('.option-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.option === selectedOption);
      });
      
      const buildCommandGroup = document.getElementById('buildCommandGroup');
      const imageOptionsGroup = document.getElementById('imageOptionsGroup');
      const customDomainGroup = document.getElementById('customDomainGroup');
      
      if (selectedOption === 'pages') {
        buildCommandGroup.style.display = 'block';
        imageOptionsGroup.style.display = 'none';
        customDomainGroup.style.display = 'block';
      } else if (selectedOption === 'images') {
        buildCommandGroup.style.display = 'none';
        imageOptionsGroup.style.display = 'block';
        customDomainGroup.style.display = 'none';
      } else {
        buildCommandGroup.style.display = 'none';
        imageOptionsGroup.style.display = 'none';
        customDomainGroup.style.display = 'block';
      }
    });
    
    // Update Deploy Button
    function updateDeployButton() {
      const deployButton = document.getElementById('deployButton');
      deployButton.disabled = uploadedFiles.length === 0;
    }
    
    // Setup Deploy Button
    function setupDeployButton() {
      document.getElementById('deployButton').addEventListener('click', handleDeploy);
      document.getElementById('clearButton').addEventListener('click', () => {
        uploadedFiles = [];
        renderFileList();
        updateDeployButton();
        document.getElementById('projectName').value = '';
        document.getElementById('customDomain').value = '';
        document.getElementById('envVars').value = '';
        hideStatus();
      });
    }
    
    // Handle Deployment
    async function handleDeploy() {
      if (uploadedFiles.length === 0) return;
      
      const projectName = document.getElementById('projectName').value || 'untitled-project';
      const deployType = document.getElementById('deployType').value;
      const customDomain = document.getElementById('customDomain').value;
      const buildCommand = document.getElementById('buildCommand').value;
      const envVarsText = document.getElementById('envVars').value;
      const requireSignedURLs = document.getElementById('requireSignedURLs')?.checked || false;
      
      let envVars = {};
      if (envVarsText) {
        try {
          envVars = JSON.parse(envVarsText);
        } catch (e) {
          showStatus('Invalid JSON in environment variables', 'error');
          return;
        }
      }
      
      const deployButton = document.getElementById('deployButton');
      deployButton.disabled = true;
      deployButton.textContent = 'Deploying...';
      
      showProgress(0, 'Preparing files...');
      
      try {
        let uploadResults = [];
        
        // Handle Images deployment separately
        if (deployType === 'images') {
          showProgress(20, 'Uploading images to Cloudflare Images...');
          uploadResults = await uploadImagesToCloudflare(uploadedFiles, requireSignedURLs);
        } else {
          // Upload files to R2 first
          showProgress(20, 'Uploading files to R2...');
          uploadResults = await uploadFilesToR2(uploadedFiles, projectName);
        }
        
        // Deploy based on type
        showProgress(60, 'Deploying to Cloudflare...');
        const deployResult = await deployToCloudflare({
          projectName,
          deployType,
          customDomain,
          buildCommand,
          envVars,
          files: uploadResults,
          requireSignedURLs: deployType === 'images' ? requireSignedURLs : undefined
        });
        
        showProgress(100, 'Deployment complete!');
        showStatus(\`Deployment successful! URL: \${deployResult.url}\`, 'success');
        
        // Reload deployments
        setTimeout(() => {
          loadDeployments();
          resetForm();
        }, 2000);
        
      } catch (error) {
        showStatus(\`Deployment failed: \${error.message}\`, 'error');
        deployButton.disabled = false;
        deployButton.textContent = 'Deploy Now';
      } finally {
        hideProgress();
      }
    }
    
    // Upload Images to Cloudflare Images
    async function uploadImagesToCloudflare(files, requireSignedURLs) {
      const results = [];
      const imageFiles = files.filter(item => {
        const ext = item.name.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
      });
      
      if (imageFiles.length === 0) {
        throw new Error('No image files found. Please upload images (JPG, PNG, GIF, WebP, SVG)');
      }
      
      for (let i = 0; i < imageFiles.length; i++) {
        const item = imageFiles[i];
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('requireSignedURLs', requireSignedURLs.toString());
        
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(\`Failed to upload \${item.name}: \${error.error || 'Unknown error'}\`);
        }
        
        const result = await response.json();
        results.push({
          ...result,
          originalName: item.name,
          path: item.path
        });
        
        showProgress(20 + (i + 1) / imageFiles.length * 40, \`Uploaded \${i + 1}/\${imageFiles.length} images...\`);
      }
      
      return results;
    }
    
    // Upload Files to R2
    async function uploadFilesToR2(files, projectName) {
      const results = [];
      
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('path', \`deployments/\${projectName}/\${item.path}\`);
        formData.append('projectName', projectName);
        
        const response = await fetch('/api/deploy/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(\`Failed to upload \${item.name}\`);
        }
        
        const result = await response.json();
        results.push(result);
        
        showProgress(20 + (i + 1) / files.length * 40, \`Uploaded \${i + 1}/\${files.length} files...\`);
      }
      
      return results;
    }
    
    // Deploy to Cloudflare
    async function deployToCloudflare(config) {
      const response = await fetch('/api/deploy/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Deployment failed');
      }
      
      return await response.json();
    }
    
    // Load Deployments
    async function loadDeployments() {
      try {
        const response = await fetch('/api/deploy/list');
        if (response.ok) {
          const deployments = await response.json();
          renderDeployments(deployments);
        }
      } catch (error) {
        console.error('Failed to load deployments:', error);
      }
    }
    
    function renderDeployments(deployments) {
      const list = document.getElementById('deploymentsList');
      
      if (!deployments || deployments.length === 0) {
        list.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--neutral-500);">No deployments yet.</div>';
        return;
      }
      
      list.innerHTML = deployments.map(deployment => \`
        <div class="deployment-item">
          <div class="deployment-info">
            <div class="deployment-name">\${deployment.name}</div>
            <div class="deployment-meta">
              \${deployment.type} • \${new Date(deployment.createdAt).toLocaleString()} • \${deployment.fileCount || 0} files
            </div>
          </div>
          <div>
            <span class="deployment-status \${deployment.status === 'active' ? 'status-active' : 'status-pending'}">
              \${deployment.status || 'pending'}
            </span>
          </div>
        </div>
      \`).join('');
    }
    
    // Progress Functions
    function showProgress(percent, text) {
      const container = document.getElementById('progressContainer');
      const fill = document.getElementById('progressFill');
      const textEl = document.getElementById('progressText');
      
      container.classList.add('active');
      fill.style.width = percent + '%';
      textEl.textContent = text;
    }
    
    function hideProgress() {
      setTimeout(() => {
        const container = document.getElementById('progressContainer');
        container.classList.remove('active');
      }, 2000);
    }
    
    // Status Functions
    function showStatus(message, type) {
      const statusEl = document.getElementById('statusMessage');
      statusEl.textContent = message;
      statusEl.className = \`status-message active \${type}\`;
      
      if (type === 'success') {
        setTimeout(() => hideStatus(), 5000);
      }
    }
    
    function hideStatus() {
      const statusEl = document.getElementById('statusMessage');
      statusEl.classList.remove('active');
    }
    
    function resetForm() {
      uploadedFiles = [];
      renderFileList();
      updateDeployButton();
      document.getElementById('projectName').value = '';
      document.getElementById('customDomain').value = '';
      document.getElementById('buildCommand').value = '';
      document.getElementById('envVars').value = '';
    }
    
    // Load Images
    async function loadImages() {
      try {
        const response = await fetch('/api/images/list');
        if (response.ok) {
          const data = await response.json();
          renderImages(data.images || []);
        } else {
          showStatus('Failed to load images', 'error');
        }
      } catch (error) {
        showStatus(\`Error: \${error.message}\`, 'error');
      }
    }
    
    function renderImages(images) {
      const list = document.getElementById('imagesList');
      
      if (!images || images.length === 0) {
        list.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--neutral-500);">No images uploaded yet.</div>';
        return;
      }
      
      list.innerHTML = \`
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
          \${images.slice(0, 12).map(image => \`
            <div style="background: var(--white); border-radius: 8px; overflow: hidden; border: 1px solid var(--neutral-200);">
              <div style="aspect-ratio: 1; background: var(--neutral-100); display: flex; align-items: center; justify-content: center;">
                <img src="\${image.deliveryUrls?.[0] || ''}" alt="\${image.filename}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
              </div>
              <div style="padding: 0.75rem;">
                <div style="font-size: 0.75rem; font-weight: 600; color: var(--neutral-900); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  \${image.filename || 'Untitled'}
                </div>
                <div style="font-size: 0.625rem; color: var(--neutral-500); font-family: monospace; word-break: break-all;">
                  \${image.id?.substring(0, 16)}...
                </div>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }
    
    function copyAccountHash() {
      const hash = 'g7wf09fCONpnidkRnR_5vw';
      navigator.clipboard.writeText(hash).then(() => {
        showStatus('Account hash copied to clipboard!', 'success');
      });
    }
    
    // Load images stats on page load
    document.addEventListener('DOMContentLoaded', () => {
      // Set initial stats (you can fetch real stats from API)
      document.getElementById('imagesDelivered').textContent = '1,477';
      document.getElementById('imagesStored').textContent = '818';
    });
  </script>
</body>
</html>`;
