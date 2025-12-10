export default `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plans & Pricing - Inner Animal Media</title>
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
    
    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: 3rem;
    }
    
    .content-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
    }
    
    /* Sidebar Categories */
    .categories-sidebar {
      background: var(--white);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      height: fit-content;
      position: sticky;
      top: 100px;
    }
    
    .categories-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--neutral-500);
      margin-bottom: 1rem;
    }
    
    .category-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 0.25rem;
      color: var(--neutral-700);
      text-decoration: none;
    }
    
    .category-item:hover {
      background: var(--neutral-50);
      color: var(--neutral-900);
    }
    
    .category-item.active {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary);
      font-weight: 500;
    }
    
    .category-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Pricing Cards Grid */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    
    .pricing-card {
      background: var(--white);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      border: 1px solid var(--neutral-200);
    }
    
    .pricing-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border-color: var(--primary-light);
    }
    
    .card-icon {
      width: 48px;
      height: 48px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .card-subtitle {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--neutral-500);
      margin-bottom: 0.5rem;
    }
    
    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: 0.75rem;
    }
    
    .card-description {
      font-size: 0.875rem;
      color: var(--neutral-600);
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    
    .card-image {
      width: 100%;
      height: 180px;
      background: var(--neutral-100);
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .card-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--neutral-300);
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
      transition: border-color 0.2s;
    }
    
    .card-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .input-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }
    
    .input-icon {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--neutral-400);
      width: 20px;
      height: 20px;
    }
    
    .card-price {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: 0.5rem;
    }
    
    .card-price-note {
      font-size: 0.75rem;
      color: var(--neutral-500);
      margin-bottom: 1.5rem;
    }
    
    .card-button {
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: var(--neutral-900);
      color: var(--white);
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .card-button:hover {
      background: var(--neutral-800);
    }
    
    .card-button-primary {
      background: var(--primary);
    }
    
    .card-button-primary:hover {
      background: var(--primary-dark);
    }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .content-layout {
        grid-template-columns: 1fr;
      }
      
      .categories-sidebar {
        position: static;
        margin-bottom: 2rem;
      }
      
      .pricing-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }
    
    @media (max-width: 768px) {
      .header-content {
        padding: 1rem;
      }
      
      .logo-text {
        font-size: 1rem;
      }
      
      .header-btn {
        padding: 0.5rem 1rem;
        font-size: 0.8125rem;
      }
      
      .main-content {
        padding: 2rem 1rem;
      }
      
      .page-title {
        font-size: 2rem;
      }
      
      .pricing-grid {
        grid-template-columns: 1fr;
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
        <a href="/iaccess" class="header-btn header-btn-login">Login</a>
        <a href="/iaccess" class="header-btn header-btn-signup">Sign up</a>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="main-content">
    <div class="container">
      <h1 class="page-title">Explore innerAnimalMedia plans and pricing</h1>
      
      <div class="content-layout">
        <!-- Categories Sidebar -->
        <aside class="categories-sidebar">
          <h2 class="categories-title">Categories</h2>
          <a href="#device-plans" class="category-item active">
            <div class="category-icon">≡</div>
            <span>DEVICE PLANS</span>
          </a>
          <a href="#bundies" class="category-item">
            <div class="category-icon">📦</div>
            <span>Bundies</span>
          </a>
          <a href="#all-access" class="category-item">
            <div class="category-icon">🖥️</div>
            <span>All Access</span>
          </a>
          <a href="#communication" class="category-item">
            <div class="category-icon">✉️</div>
            <span>Communication</span>
          </a>
          <a href="#email" class="category-item">
            <div class="category-icon">📧</div>
            <span>Email</span>
          </a>
          <a href="#hosting" class="category-item">
            <div class="category-icon">🖥️</div>
            <span>Hosting</span>
          </a>
          <a href="#online-store" class="category-item">
            <div class="category-icon">🛍️</div>
            <span>Online Store</span>
          </a>
          <a href="#web-security" class="category-item">
            <div class="category-icon">🔒</div>
            <span>Web Security</span>
          </a>
          <a href="#hire-expert" class="category-item">
            <div class="category-icon">👤</div>
            <span>Hire an Expert</span>
          </a>
        </aside>
        
        <!-- Pricing Cards -->
        <div class="pricing-grid">
          <!-- Get Your Domain Card -->
          <div class="pricing-card">
            <div class="card-icon">🏢</div>
            <div class="card-subtitle">BEST VALUE</div>
            <h3 class="card-title">Get Your Domain</h3>
            <p class="card-description">Find and register the perfect domain name for your business or project.</p>
            <div class="card-image">
              <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 600;">
                www._____.com
              </div>
            </div>
            <div class="input-wrapper">
              <input type="text" class="card-input" placeholder="Type the domain you need">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <button class="card-button card-button-primary">Search Domain</button>
          </div>
          
          <!-- Domain Transfer Card -->
          <div class="pricing-card">
            <div class="card-icon">🏢</div>
            <div class="card-subtitle">DOMAIN TRANSFER</div>
            <h3 class="card-title">Domain Transfer</h3>
            <p class="card-description">Transfer your existing domain to Inner Animal Media for better management and support.</p>
            <div class="card-image">
              <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 600;">
                Transfer
              </div>
            </div>
            <div class="input-wrapper">
              <input type="text" class="card-input" placeholder="Enter domain to transfer">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <button class="card-button card-button-primary">Transfer Now</button>
          </div>
          
          <!-- Discount Domain Club Card -->
          <div class="pricing-card">
            <div class="card-icon">👤</div>
            <div class="card-subtitle">INVESTOR TOOLS</div>
            <h3 class="card-title">Discount Domain Club</h3>
            <p class="card-description">Join our exclusive club for members-only pricing and premium domain management tools.</p>
            <div class="card-price">$9.99</div>
            <div class="card-price-note">per year with annual renewal</div>
            <button class="card-button">Use Plans</button>
          </div>
          
          <!-- Domain Broker SET Card -->
          <div class="pricing-card">
            <div class="card-icon">🏢</div>
            <div class="card-subtitle">DEDICATED SUPPORT</div>
            <h3 class="card-title">Domain Broker SET</h3>
            <p class="card-description">Get the right domain, even if it's currently unavailable. Our brokers will help you acquire it.</p>
            <div class="card-price">$99.99</div>
            <div class="card-price-note">one-time setup fee</div>
            <button class="card-button">Learn More</button>
          </div>
          
          <!-- Find Domain Owner (WHOIS) Card -->
          <div class="pricing-card">
            <div class="card-icon">👤</div>
            <div class="card-subtitle">DOMAIN RESEARCH</div>
            <h3 class="card-title">Find a Domain Owner (WHOIS)</h3>
            <p class="card-description">Look up domain ownership information and contact details using our WHOIS lookup tool.</p>
            <div class="card-image">
              <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 600;">
                WHOIS
              </div>
            </div>
            <div class="input-wrapper">
              <input type="text" class="card-input" placeholder="Enter domain to search">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <button class="card-button card-button-primary">Search WHOIS</button>
          </div>
        </div>
      </div>
    </div>
  </main>
  
  <script>
    // Category navigation
    document.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  </script>
</body>
</html>`;
