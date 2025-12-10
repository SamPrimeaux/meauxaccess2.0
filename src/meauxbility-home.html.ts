/**
 * Meauxbility Nonprofit Home Page
 * Root page for meauxbility.org - Charity buildout
 */

export default function getMeauxbilityHomeHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meauxbility - Empowering Mobility & Independence</title>
  <meta name="description" content="Meauxbility is a nonprofit organization dedicated to empowering mobility and independence for spinal cord injury survivors. Built by a survivor for survivors.">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.meauxbility.org/">
  <meta property="og:title" content="Meauxbility - Empowering Mobility & Independence">
  <meta property="og:description" content="Empowering mobility and independence for spinal cord injury survivors. Built by a survivor for survivors.">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://www.meauxbility.org/">
  <meta property="twitter:title" content="Meauxbility - Empowering Mobility & Independence">
  <meta property="twitter:description" content="Empowering mobility and independence for spinal cord injury survivors.">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --meaux-orange: #FF7619;
      --meaux-teal: #1F97A9;
      --meaux-green: #21c48c;
      --meaux-dark-teal: #0F7A8A;
      --meaux-light-orange: #FFB380;
      --meaux-light-teal: #4aabb8;
      --meaux-white: #FFFFFF;
      --meaux-light-gray: #F8FAFB;
      --meaux-soft-blue: #E8F4F6;
      --meaux-text-primary: #0C2D31;
      --meaux-text-secondary: #4A5568;
      --meaux-text-muted: #718096;
      --meaux-border: rgba(31, 151, 169, 0.15);
      --meaux-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
      --meaux-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
      --meaux-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
      --meaux-shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);
      --max-width: 1400px;
      --radius: 24px;
      --radius-sm: 12px;
      --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--meaux-text-primary);
      background: var(--meaux-white);
      line-height: 1.7;
      font-size: 18px;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .container {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 24px;
    }
    
    /* Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--meaux-border);
      z-index: 1000;
      padding: 20px 0;
      transition: var(--transition);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--meaux-orange) 0%, var(--meaux-teal) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-decoration: none;
      letter-spacing: -0.02em;
    }
    
    .nav-links {
      display: flex;
      gap: 32px;
      align-items: center;
    }
    
    .nav-link {
      color: var(--meaux-text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition);
      font-size: 16px;
    }
    
    .nav-link:hover {
      color: var(--meaux-orange);
    }
    
    .btn-primary {
      padding: 12px 28px;
      background: var(--meaux-orange);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-sm);
      font-weight: 600;
      transition: var(--transition);
      border: none;
      cursor: pointer;
      font-size: 16px;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--meaux-shadow-md);
    }
    
    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 120px 0 80px;
      background: linear-gradient(135deg, var(--meaux-light-gray) 0%, var(--meaux-soft-blue) 100%);
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255, 118, 25, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 900px;
    }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: rgba(255, 118, 25, 0.1);
      border: 1px solid rgba(255, 118, 25, 0.2);
      border-radius: 100px;
      font-size: 16px;
      font-weight: 600;
      color: var(--meaux-orange);
      margin-bottom: 32px;
    }
    
    .hero-title {
      font-size: clamp(3rem, 6vw, 5.5rem);
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 32px;
      letter-spacing: -0.03em;
      color: var(--meaux-text-primary);
    }
    
    .hero-title .gradient-text {
      background: linear-gradient(135deg, var(--meaux-orange) 0%, var(--meaux-teal) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero-subtitle {
      font-size: 1.5rem;
      color: var(--meaux-text-secondary);
      margin-bottom: 48px;
      line-height: 1.7;
    }
    
    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 20px 40px;
      background: var(--meaux-orange);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 0.5px;
      transition: var(--transition);
      box-shadow: var(--meaux-shadow-md);
      border: none;
      cursor: pointer;
    }
    
    .hero-cta:hover {
      transform: translateY(-3px);
      box-shadow: var(--meaux-shadow-lg);
    }
    
    /* Mission Section */
    .mission {
      padding: 120px 0;
      background: white;
    }
    
    .mission-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }
    
    .mission-content h2 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 32px;
      letter-spacing: -0.02em;
      color: var(--meaux-text-primary);
    }
    
    .mission-content p {
      font-size: 1.25rem;
      color: var(--meaux-text-secondary);
      line-height: 1.8;
      margin-bottom: 24px;
    }
    
    .mission-visual {
      background: var(--meaux-light-gray);
      border-radius: var(--radius);
      padding: 60px;
      text-align: center;
    }
    
    .mission-icon {
      font-size: 5rem;
      margin-bottom: 24px;
    }
    
    /* Impact Section */
    .impact {
      padding: 120px 0;
      background: var(--meaux-light-gray);
    }
    
    .section-header {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 80px;
    }
    
    .section-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
      color: var(--meaux-text-primary);
    }
    
    .section-subtitle {
      font-size: 1.5rem;
      color: var(--meaux-text-secondary);
      line-height: 1.6;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
      text-align: center;
    }
    
    .metric {
      background: white;
      padding: 40px;
      border-radius: var(--radius);
      box-shadow: var(--meaux-shadow-sm);
      transition: var(--transition);
    }
    
    .metric:hover {
      transform: translateY(-4px);
      box-shadow: var(--meaux-shadow-md);
    }
    
    .metric-number {
      display: block;
      font-size: 3.5rem;
      font-weight: 900;
      color: var(--meaux-orange);
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }
    
    .metric-label {
      font-size: 1.125rem;
      color: var(--meaux-text-secondary);
      font-weight: 600;
    }
    
    /* CTA Section */
    .cta-section {
      padding: 120px 0;
      background: linear-gradient(135deg, var(--meaux-orange) 0%, var(--meaux-teal) 100%);
      color: white;
      text-align: center;
    }
    
    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .cta-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 32px;
      letter-spacing: -0.02em;
    }
    
    .cta-text {
      font-size: 1.5rem;
      margin-bottom: 48px;
      opacity: 0.95;
      line-height: 1.7;
    }
    
    .btn-white {
      padding: 20px 40px;
      background: white;
      color: var(--meaux-orange);
      text-decoration: none;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 18px;
      transition: var(--transition);
      display: inline-block;
    }
    
    .btn-white:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    
    /* Footer */
    .footer {
      padding: 60px 0 40px;
      background: var(--meaux-text-primary);
      color: white;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 60px;
      margin-bottom: 40px;
    }
    
    .footer-brand h3 {
      font-size: 1.5rem;
      font-weight: 900;
      margin-bottom: 16px;
      background: linear-gradient(135deg, var(--meaux-orange) 0%, var(--meaux-teal) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .footer-brand p {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }
    
    .footer-section h4 {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .footer-links {
      list-style: none;
    }
    
    .footer-links li {
      margin-bottom: 12px;
    }
    
    .footer-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: var(--transition);
    }
    
    .footer-links a:hover {
      color: white;
    }
    
    .footer-bottom {
      padding-top: 40px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .mission-grid {
        grid-template-columns: 1fr;
        gap: 60px;
      }
      
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .footer-content {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    @media (max-width: 768px) {
      .nav-links {
        gap: 20px;
      }
      
      .nav-link {
        display: none;
      }
      
      .hero {
        padding: 100px 0 60px;
      }
      
      .hero-title {
        font-size: 2.5rem;
      }
      
      .section-title {
        font-size: 2.5rem;
      }
      
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .footer-content {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="container">
      <div class="header-content">
        <a href="/" class="logo">Meauxbility</a>
        <nav class="nav-links">
          <a href="/pages/about-us" class="nav-link">About</a>
          <a href="/pages/get-involved" class="nav-link">Get Involved</a>
          <a href="/pages/donate" class="nav-link">Donate</a>
          <a href="/dashboard" class="btn-primary">Dashboard</a>
        </nav>
      </div>
    </div>
  </header>
  
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge">
          <span>⚡</span>
          <span>Nonprofit Organization</span>
        </div>
        <h1 class="hero-title">
          Empowering <span class="gradient-text">Mobility</span><br>
          & Independence
        </h1>
        <p class="hero-subtitle">
          Meauxbility is a nonprofit organization dedicated to empowering mobility and independence 
          for spinal cord injury survivors. Built by a survivor for survivors.
        </p>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <a href="/pages/get-involved" class="hero-cta">
            Get Involved
            <span style="font-size: 20px;">→</span>
          </a>
          <a href="/pages/donate" class="hero-cta" style="background: var(--meaux-teal);">
            Donate Now
            <span style="font-size: 20px;">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Mission Section -->
  <section class="mission">
    <div class="container">
      <div class="mission-grid">
        <div class="mission-content">
          <h2>Our Mission</h2>
          <p>
            Meauxbility exists to bridge the gap between spinal cord injury survivors and the resources 
            they need to thrive. We provide support, funding, and community connections that transform 
            lives and build independence.
          </p>
          <p>
            Founded by Sam Primeaux, a survivor who experienced firsthand the challenges of navigating 
            life after a spinal cord injury, Meauxbility is built on the principle that no one should 
            face these challenges alone.
          </p>
          <a href="/pages/about-us" class="btn-primary" style="margin-top: 24px; display: inline-block;">
            Learn More About Us
          </a>
        </div>
        <div class="mission-visual">
          <div class="mission-icon">🤝</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 16px; color: var(--meaux-text-primary);">
            Built by Survivors
          </h3>
          <p style="color: var(--meaux-text-secondary);">
            For Survivors
          </p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Impact Section -->
  <section class="impact">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Our Impact</h2>
        <p class="section-subtitle">
          Together, we're creating real change in the lives of spinal cord injury survivors
        </p>
      </div>
      <div class="metrics-grid">
        <div class="metric">
          <span class="metric-number">500+</span>
          <span class="metric-label">Lives Impacted</span>
        </div>
        <div class="metric">
          <span class="metric-number">50+</span>
          <span class="metric-label">Partner Organizations</span>
        </div>
        <div class="metric">
          <span class="metric-number">100+</span>
          <span class="metric-label">Resources Connected</span>
        </div>
        <div class="metric">
          <span class="metric-number">2025</span>
          <span class="metric-label">Founded</span>
        </div>
      </div>
    </div>
  </section>
  
  <!-- CTA Section -->
  <section class="cta-section">
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">Ready to Make a Difference?</h2>
        <p class="cta-text">
          Whether you're looking to volunteer, donate, or get support, there's a place for you 
          in the Meauxbility community.
        </p>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
          <a href="/pages/get-involved" class="btn-white">
            Get Involved
          </a>
          <a href="/pages/donate" class="btn-white" style="background: rgba(255, 255, 255, 0.1); color: white; border: 2px solid white;">
            Donate
          </a>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>Meauxbility</h3>
          <p>
            Empowering mobility and independence for spinal cord injury survivors. 
            Built by a survivor for survivors.
          </p>
        </div>
        <div class="footer-section">
          <h4>Organization</h4>
          <ul class="footer-links">
            <li><a href="/pages/about-us">About Us</a></li>
            <li><a href="/pages/team-meauxbility">Our Team</a></li>
            <li><a href="/pages/non-profit-information">Nonprofit Info</a></li>
            <li><a href="/pages/contact">Contact</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Get Involved</h4>
          <ul class="footer-links">
            <li><a href="/pages/get-involved">Volunteer</a></li>
            <li><a href="/pages/donate">Donate</a></li>
            <li><a href="/pages/apply-for-funding">Apply for Funding</a></li>
            <li><a href="/pages/community">Community</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Resources</h4>
          <ul class="footer-links">
            <li><a href="/pages/resources-and-information">Resources</a></li>
            <li><a href="/pages/faq">FAQ</a></li>
            <li><a href="/pages/mobility-grants-programs">Grants & Programs</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Meauxbility. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}
