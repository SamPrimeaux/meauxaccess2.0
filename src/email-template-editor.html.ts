// Email Template Editor - Professional iOS-Style UI
// Elegant, simple, Fortune 500 quality design for Southern Pets Animal Rescue

export function generateEmailTemplateEditorHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Templates - Southern Pets Animal Rescue</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #2ecc71;
      --primary-dark: #27ae60;
      --background: #f5f7fa;
      --surface: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #6b7280;
      --border: #e5e7eb;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --radius: 12px;
      --radius-sm: 8px;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--background);
      color: var(--text-primary);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .app-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
      min-height: 100vh;
    }

    /* Header */
    .header {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
    }

    .header-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .header-subtitle {
      font-size: 17px;
      color: var(--text-secondary);
      font-weight: 400;
    }

    /* Main Layout */
    .main-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 24px;
    }

    /* Sidebar */
    .sidebar {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
      height: fit-content;
      position: sticky;
      top: 24px;
    }

    .sidebar-section {
      margin-bottom: 32px;
    }

    .sidebar-section:last-child {
      margin-bottom: 0;
    }

    .sidebar-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .template-list {
      list-style: none;
    }

    .template-item {
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 4px;
      font-size: 15px;
      font-weight: 500;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .template-item:hover {
      background: var(--background);
    }

    .template-item.active {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .template-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    /* Content Area */
    .content-area {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 32px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
    }

    .content-header {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }

    .content-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
      letter-spacing: -0.3px;
    }

    .content-description {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    /* Form Groups */
    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 14px 16px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 15px;
      font-family: inherit;
      background: var(--surface);
      color: var(--text-primary);
      transition: all 0.2s ease;
      -webkit-appearance: none;
      appearance: none;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.1);
    }

    .form-textarea {
      min-height: 300px;
      resize: vertical;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
      line-height: 1.6;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px;
      background: var(--background);
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
      border: 1px solid var(--border);
    }

    .toolbar-btn {
      padding: 8px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toolbar-btn:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .toolbar-btn.secondary {
      background: transparent;
      color: var(--text-secondary);
    }

    .toolbar-btn.secondary:hover {
      background: var(--background);
      color: var(--text-primary);
    }

    /* Variables */
    .variables-section {
      margin-bottom: 24px;
    }

    .variables-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .variable-chip {
      padding: 8px 14px;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border: 1px solid #81c784;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      color: #2e7d32;
      font-family: 'SF Mono', Monaco, monospace;
    }

    /* Preview Section */
    .preview-section {
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid var(--border);
    }

    .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .preview-title {
      font-size: 17px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .preview-container {
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 24px;
      min-height: 400px;
      overflow: auto;
    }

    .preview-iframe {
      width: 100%;
      min-height: 500px;
      border: none;
      background: white;
      border-radius: var(--radius-sm);
    }

    /* Actions */
    .actions-bar {
      display: flex;
      gap: 12px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    .btn {
      padding: 14px 28px;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: inherit;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    .btn-secondary {
      background: var(--surface);
      color: var(--text-primary);
      border: 1.5px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--background);
      border-color: var(--text-secondary);
    }

    .btn-icon {
      font-size: 18px;
    }

    /* Status Messages */
    .status {
      padding: 16px 20px;
      border-radius: var(--radius-sm);
      margin-top: 24px;
      display: none;
      font-size: 15px;
      font-weight: 500;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .status.success {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
      border: 1px solid #81c784;
      display: block;
    }

    .status.error {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
      border: 1px solid #f5c6cb;
      display: block;
    }

    /* Photo Gallery Preview */
    .photo-preview {
      margin: 24px 0;
      padding: 24px;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: var(--radius-sm);
      border: 1px solid #90caf9;
    }

    .photo-preview-title {
      font-size: 15px;
      font-weight: 600;
      color: #1565c0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .photo-grid-preview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .photo-preview-item {
      aspect-ratio: 1;
      background: white;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e0e0e0;
      box-shadow: var(--shadow-sm);
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .main-layout {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .app-container {
        padding: 16px;
      }

      .header {
        padding: 24px;
      }

      .header-title {
        font-size: 28px;
      }

      .content-area {
        padding: 24px;
      }

      .actions-bar {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }

    /* Loading States */
    .loading {
      opacity: 0.6;
      pointer-events: none;
    }

    /* Smooth Transitions */
    * {
      transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Header -->
    <div class="header">
      <h1 class="header-title">Email Templates</h1>
      <p class="header-subtitle">Customize email templates with animal photos and personalization</p>
    </div>

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-label">Templates</div>
          <ul class="template-list">
            <li class="template-item active" data-type="adoption_admin" onclick="selectTemplate('adoption_admin')">
              <span class="template-icon">📧</span>
              <span>Adoption Admin</span>
            </li>
            <li class="template-item" data-type="adoption_customer" onclick="selectTemplate('adoption_customer')">
              <span class="template-icon">✉️</span>
              <span>Adoption Customer</span>
            </li>
            <li class="template-item" data-type="tnr_admin" onclick="selectTemplate('tnr_admin')">
              <span class="template-icon">📬</span>
              <span>TNR Admin</span>
            </li>
            <li class="template-item" data-type="tnr_customer" onclick="selectTemplate('tnr_customer')">
              <span class="template-icon">💌</span>
              <span>TNR Customer</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-label">Quick Actions</div>
          <button class="btn btn-secondary" onclick="previewTemplate()" style="width: 100%; margin-bottom: 8px;">
            <span class="btn-icon">👁️</span>
            <span>Preview</span>
          </button>
          <button class="btn btn-secondary" onclick="loadDefault()" style="width: 100%;">
            <span class="btn-icon">🔄</span>
            <span>Reset</span>
          </button>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="content-area">
        <div class="content-header">
          <h2 class="content-title" id="contentTitle">Adoption Application - Admin Notification</h2>
          <p class="content-description" id="contentDescription">Email sent to admin when someone submits an adoption application</p>
        </div>

        <!-- Variables -->
        <div class="variables-section">
          <div class="form-label">Available Variables</div>
          <div class="variables-grid" id="variablesGrid"></div>
        </div>

        <!-- Subject -->
        <div class="form-group">
          <label class="form-label" for="subject">Email Subject</label>
          <input type="text" id="subject" class="form-input" placeholder="e.g., New Adoption Application: {{applicant_name}} - {{animal_name}}">
        </div>

        <!-- HTML Content -->
        <div class="form-group">
          <label class="form-label" for="htmlContent">Email HTML Content</label>
          <div class="toolbar">
            <button class="toolbar-btn" onclick="insertVariable('applicant_name')">
              <span>{{applicant_name}}</span>
            </button>
            <button class="toolbar-btn" onclick="insertVariable('animal_name')">
              <span>{{animal_name}}</span>
            </button>
            <button class="toolbar-btn" onclick="insertVariable('photo_gallery')">
              <span>📸 {{photo_gallery}}</span>
            </button>
            <button class="toolbar-btn" onclick="insertVariable('applicant_email')">
              <span>{{applicant_email}}</span>
            </button>
            <button class="toolbar-btn secondary" onclick="previewTemplate()">
              <span>👁️ Preview</span>
            </button>
          </div>
          <textarea id="htmlContent" class="form-textarea" placeholder="Enter HTML content here. Use {{variable_name}} for dynamic content."></textarea>
          <small style="display: block; margin-top: 8px; font-size: 13px; color: var(--text-secondary);">
            💡 Use <code style="background: var(--background); padding: 2px 6px; border-radius: 4px; font-family: 'SF Mono', monospace;">{{photo_gallery}}</code> to automatically include animal photos
          </small>
        </div>

        <!-- Photo Gallery Preview -->
        <div class="photo-preview" id="photoPreview" style="display: none;">
          <div class="photo-preview-title">
            <span>📸</span>
            <span>Photo Gallery Preview</span>
          </div>
          <p style="font-size: 14px; color: #1565c0; margin-bottom: 16px;">
            Animal photos will be automatically included when {{photo_gallery}} is used in the template.
          </p>
          <div class="photo-grid-preview" id="photoGridPreview">
            <!-- Photos will be loaded here -->
          </div>
        </div>

        <!-- Preview Section -->
        <div class="preview-section">
          <div class="preview-header">
            <h3 class="preview-title">Preview</h3>
            <button class="toolbar-btn secondary" onclick="previewTemplate()">
              <span>🔄 Refresh</span>
            </button>
          </div>
          <div class="preview-container">
            <iframe id="previewFrame" class="preview-iframe" srcdoc="<div style='padding: 40px; text-align: center; color: #6b7280;'><p style='font-size: 17px;'>Click 'Preview' to see your email template</p></div>"></iframe>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-bar">
          <button class="btn btn-primary" onclick="saveTemplate()">
            <span class="btn-icon">💾</span>
            <span>Save Template</span>
          </button>
          <button class="btn btn-secondary" onclick="testEmail()">
            <span class="btn-icon">📧</span>
            <span>Send Test Email</span>
          </button>
        </div>

        <!-- Status -->
        <div class="status" id="status"></div>
      </main>
    </div>
  </div>

  <script>
    let currentTemplate = null;
    let currentType = 'adoption_admin';
    const baseUrl = window.location.origin;

    const templateConfigs = {
      adoption_admin: {
        name: 'Adoption Application - Admin Notification',
        description: 'Email sent to admin when someone submits an adoption application',
        icon: '📧',
        variables: ['applicant_name', 'animal_name', 'applicant_email', 'applicant_phone', 'photo_gallery', 'submission_id', 'submitted_at'],
      },
      adoption_customer: {
        name: 'Adoption Application - Customer Thank You',
        description: 'Thank you email sent to customer after submitting adoption application',
        icon: '✉️',
        variables: ['applicant_name', 'animal_name', 'photo_gallery'],
      },
      tnr_admin: {
        name: 'TNR Request - Admin Notification',
        description: 'Email sent to admin when someone submits a TNR request',
        icon: '📬',
        variables: ['requester_name', 'cat_count', 'requester_email', 'requester_phone', 'location_address'],
      },
      tnr_customer: {
        name: 'TNR Request - Customer Thank You',
        description: 'Thank you email sent to customer after submitting TNR request',
        icon: '💌',
        variables: ['requester_name', 'cat_count'],
      },
    };

    // Select template
    function selectTemplate(type) {
      currentType = type;
      
      // Update sidebar
      document.querySelectorAll('.template-item').forEach(item => {
        item.classList.remove('active');
      });
      document.querySelector(\`[data-type="\${type}"]\`).classList.add('active');
      
      // Load template
      loadTemplate(type);
    }

    // Load template
    async function loadTemplate(type) {
      try {
        const response = await fetch(\`\${baseUrl}/api/email-templates/get?type=\${type}\`);
        const data = await response.json();
        
        if (data.success) {
          currentTemplate = data.template;
          const config = templateConfigs[type];
          
          // Update UI
          document.getElementById('contentTitle').textContent = config.name;
          document.getElementById('contentDescription').textContent = config.description;
          document.getElementById('subject').value = currentTemplate.subject || '';
          document.getElementById('htmlContent').value = currentTemplate.html || '';
          
          // Update variables
          const variablesGrid = document.getElementById('variablesGrid');
          variablesGrid.innerHTML = config.variables.map(v => 
            \`<span class="variable-chip">{{{\${v}}}}</span>\`
          ).join('');
          
          // Show photo preview if applicable
          if (type.includes('adoption') && currentTemplate.html && currentTemplate.html.includes('{{photo_gallery}}')) {
            document.getElementById('photoPreview').style.display = 'block';
            loadPhotoPreview();
          } else {
            document.getElementById('photoPreview').style.display = 'none';
          }
        }
      } catch (error) {
        console.error('Error loading template:', error);
        showStatus('Error loading template', 'error');
      }
    }

    // Load photo preview
    function loadPhotoPreview() {
      const grid = document.getElementById('photoGridPreview');
      grid.innerHTML = \`
        <div class="photo-preview-item">Photo 1</div>
        <div class="photo-preview-item">Photo 2</div>
        <div class="photo-preview-item">Photo 3</div>
      \`;
    }

    // Insert variable
    function insertVariable(variable) {
      const textarea = document.getElementById('htmlContent');
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const textAfter = textarea.value.substring(cursorPos);
      textarea.value = textBefore + \`{{{\${variable}}}}\` + textAfter;
      textarea.focus();
      textarea.setSelectionRange(cursorPos + variable.length + 4, cursorPos + variable.length + 4);
    }

    // Preview template
    function previewTemplate() {
      const html = document.getElementById('htmlContent').value;
      const subject = document.getElementById('subject').value;
      
      // Replace variables with sample data
      let previewHTML = html
        .replace(/\\{\\{applicant_name\\}\\}/g, 'John Doe')
        .replace(/\\{\\{animal_name\\}\\}/g, 'Rolo')
        .replace(/\\{\\{applicant_email\\}\\}/g, 'john.doe@example.com')
        .replace(/\\{\\{applicant_phone\\}\\}/g, '(337) 555-1234')
        .replace(/\\{\\{photo_gallery\\}\\}/g, generatePhotoGalleryPreview())
        .replace(/\\{\\{requester_name\\}\\}/g, 'Jane Smith')
        .replace(/\\{\\{cat_count\\}\\}/g, '3')
        .replace(/\\{\\{submission_id\\}\\}/g, 'TEST-123')
        .replace(/\\{\\{submitted_at\\}\\}/g, new Date().toLocaleString());
      
      document.getElementById('previewFrame').srcdoc = previewHTML;
    }

    // Generate photo gallery preview
    function generatePhotoGalleryPreview() {
      return \`
        <div style="margin: 30px 0; text-align: center;">
          <h3 style="color: #2c3e50; font-size: 1.2rem; margin-bottom: 20px;">📸 Photo Gallery</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 600px; margin: 0 auto;">
            <div style="aspect-ratio: 1; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">Photo 1</div>
            <div style="aspect-ratio: 1; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">Photo 2</div>
            <div style="aspect-ratio: 1; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">Photo 3</div>
          </div>
          <p style="text-align: center; margin-top: 15px; color: #666; font-size: 14px;">3 photos available</p>
        </div>
      \`;
    }

    // Save template
    async function saveTemplate() {
      const type = currentType;
      const subject = document.getElementById('subject').value;
      const html = document.getElementById('htmlContent').value;
      
      if (!subject || !html) {
        showStatus('Subject and HTML content are required', 'error');
        return;
      }

      const btn = event.target.closest('.btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="btn-icon">⏳</span><span>Saving...</span>';
      btn.disabled = true;

      try {
        const response = await fetch(\`\${baseUrl}/api/email-templates/save\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            name: templateConfigs[type].name,
            subject,
            html,
            variables: templateConfigs[type].variables,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          showStatus('Template saved successfully!', 'success');
        } else {
          showStatus('Error saving template: ' + (data.error || 'Unknown error'), 'error');
        }
      } catch (error) {
        showStatus('Error saving template: ' + error.message, 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }

    // Test email
    async function testEmail() {
      const type = currentType;
      const testEmail = prompt('Enter email address to send test to:', 'SouthernPetsAnimalRescue@gmail.com');
      
      if (!testEmail) return;

      const btn = event.target.closest('.btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="btn-icon">⏳</span><span>Sending...</span>';
      btn.disabled = true;

      try {
        const response = await fetch(\`\${baseUrl}/api/email-templates/test\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, testEmail }),
        });

        const data = await response.json();
        
        if (data.success) {
          showStatus('Test email sent! Check your inbox.', 'success');
        } else {
          showStatus('Error sending test email: ' + (data.error || 'Unknown error'), 'error');
        }
      } catch (error) {
        showStatus('Error sending test email: ' + error.message, 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }

    // Load default
    function loadDefault() {
      if (confirm('Load default template? This will replace your current content.')) {
        loadTemplate(currentType);
        showStatus('Default template loaded', 'success');
      }
    }

    // Show status
    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.textContent = message;
      status.className = 'status ' + type;
      setTimeout(() => {
        status.className = 'status';
      }, 5000);
    }

    // Initialize
    loadTemplate(currentType);
  </script>
</body>
</html>
  `;
}
