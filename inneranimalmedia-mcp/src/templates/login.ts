import { MEAUXSTACK_STYLES } from '../ui/meauxstack-style';

export function renderLoginPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="light">
  <meta name="theme-color" content="#FFFFFF">
  <title>Login | InnerAnimalMedia MCP</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    ${MEAUXSTACK_STYLES}
    
    /* Login Page Specific Styles */
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%);
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.06) 0%, transparent 50%);
      pointer-events: none;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-8);
      box-shadow: var(--shadow-xl);
      position: relative;
      z-index: 1;
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .login-logo {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--space-4);
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
    }

    .login-logo svg {
      width: 44px;
      height: 44px;
      fill: white;
    }

    .login-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: var(--space-2);
      letter-spacing: -0.02em;
    }

    .login-subtitle {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .login-form {
      display: grid;
      gap: var(--space-5);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: 0.01em;
    }

    .form-input {
      width: 100%;
      padding: var(--space-4);
      background: var(--bg-elevated);
      border: 1.5px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 500;
      font-family: inherit;
      transition: all var(--transition-base);
    }

    .form-input:focus {
      outline: none;
      background: var(--bg-surface);
      border-color: var(--primary);
      box-shadow: 0 0 0 4px var(--primary-subtle);
    }

    .form-input::placeholder {
      color: var(--text-tertiary);
    }

    .login-button {
      width: 100%;
      padding: var(--space-4);
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      font-weight: 700;
      font-size: 1rem;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      margin-top: var(--space-2);
    }

    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
    }

    .login-button:active {
      transform: translateY(0);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .login-footer {
      margin-top: var(--space-6);
      text-align: center;
    }

    .login-footer-text {
      font-size: 0.875rem;
      color: var(--text-tertiary);
    }

    .login-footer-link {
      color: var(--primary);
      font-weight: 600;
      text-decoration: none;
      transition: opacity var(--transition-base);
    }

    .login-footer-link:hover {
      opacity: 0.8;
    }

    .error-message {
      padding: var(--space-3) var(--space-4);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--radius-md);
      color: var(--error);
      font-size: 0.875rem;
      font-weight: 500;
      display: none;
      margin-bottom: var(--space-4);
    }

    .error-message.show {
      display: block;
      animation: shake 0.4s ease-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: none;
    }

    .login-button.loading .loading-spinner {
      display: block;
    }

    .login-button.loading .button-text {
      display: none;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .login-card {
        padding: var(--space-6);
      }

      .login-title {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="login-title">Welcome Back</h1>
        <p class="login-subtitle">Sign in to your MCP Platform</p>
      </div>

      <div class="error-message" id="error-message"></div>

      <form class="login-form" id="login-form" method="POST" action="/login">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            class="form-input"
            placeholder="sam@meauxbility.org"
            value="sam@meauxbility.org"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-input"
            placeholder="Enter your password"
            value="1937"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="login-button" id="login-button">
          <span class="loading-spinner"></span>
          <span class="button-text">Sign In</span>
        </button>
      </form>

      <div class="login-footer">
        <p class="login-footer-text">
          Connected to <a href="https://inner-animal-media.pages.dev/" target="_blank" class="login-footer-link">Inner Animal Media</a>
        </p>
      </div>
    </div>
  </div>

  <script>
    const form = document.getElementById('login-form');
    const button = document.getElementById('login-button');
    const errorMsg = document.getElementById('error-message');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Check for error from server
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      if (error === 'invalid') {
        errorMsg.textContent = 'Invalid email or password. Please try again.';
      } else if (error === 'server') {
        errorMsg.textContent = 'Server error. Please try again.';
      } else {
        errorMsg.textContent = 'An error occurred. Please try again.';
      }
      errorMsg.classList.add('show');
      
      // Clear password on error
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }

    // Show loading on submit
    form.addEventListener('submit', (e) => {
      // Validate before submit
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      
      if (!email || !password) {
        e.preventDefault();
        errorMsg.textContent = 'Please enter both email and password.';
        errorMsg.classList.add('show');
        return false;
      }
      
      button.classList.add('loading');
      button.disabled = true;
      errorMsg.classList.remove('show');
    });

    // Check if already logged in
    const cookies = document.cookie.split(';');
    const hasSession = cookies.some(c => c.trim().startsWith('mcp_session=') || c.trim().startsWith('mcp_authenticated='));
    
    if (hasSession || sessionStorage.getItem('mcp_authenticated') === 'true') {
      window.location.href = '/';
    }

    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      button.addEventListener('click', () => {
        navigator.vibrate(10);
      });
    }

    // Auto-focus password field if email is pre-filled
    if (emailInput && emailInput.value && !passwordInput.value) {
      passwordInput.focus();
    }
  </script>
</body>
</html>`;
}
