/**
 * Legacy Header Component
 * Original Meauxbility header with theme support
 */

// Extract just the header parts (not full HTML document)
export const LEGACY_HEADER_STYLES = `
<style>
:root{--teal:#339999;--orange:#FF6B35;--orange-dark:#E85D00;--purple:#9B59B6;--mint:#4AECDC;--nav-h:72px;--nav-hs:60px;--max-w:1440px;--tr:all .3s cubic-bezier(.4,0,.2,1)}
[data-theme=light]{--nav-bg:rgba(255,255,255,.75);--nav-bg-scrolled:rgba(255,255,255,.85);--nav-border:rgba(255,107,53,.15);--nav-text:#0C2D31;--nav-link:#FF6B35;--nav-hover:#E85D00;--nav-hover-bg:rgba(255,107,53,.08);--mobile-bg:rgba(255,255,255,.90);--btn-bg:#FF6B35;--btn-hover:#E85D00;--accent:#FF6B35}
[data-theme=dark]{--nav-bg:rgba(12,45,49,.75);--nav-bg-scrolled:rgba(12,45,49,.85);--nav-border:rgba(74,236,220,.2);--nav-text:rgba(255,255,255,.95);--nav-link:#4AECDC;--nav-hover:#5FDDDC;--nav-hover-bg:rgba(74,236,220,.1);--mobile-bg:rgba(12,45,49,.90);--btn-bg:#9B59B6;--btn-hover:#8E44AD;--accent:#4AECDC}
*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;padding-top:var(--nav-h);color:#0C2D31;line-height:1.6;min-height:100vh;background:#fafafa}
[data-theme=dark] body{background:#0a1f22;color:rgba(255,255,255,.95)}
body.modal-open{overflow:hidden}
.skip-link{position:absolute;top:-100px;left:16px;padding:12px 24px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600;border-radius:8px;z-index:10001;transition:var(--tr)}.skip-link:focus{top:16px}
.nav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);background:var(--nav-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--nav-border);z-index:9999;transition:var(--tr)}
.nav.scrolled{height:var(--nav-hs);background:var(--nav-bg-scrolled);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px)}
.nav-container{max-width:var(--max-w);height:100%;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{display:flex;align-items:center;text-decoration:none;transition:var(--tr)}.nav-logo:hover{transform:scale(.98)}.nav-logo:focus-visible{outline:2px solid var(--accent);outline-offset:4px;border-radius:8px}.nav-logo picture{display:block;width:180px;height:auto;transition:var(--tr)}.nav-logo img{width:100%;height:auto;display:block}.nav.scrolled .nav-logo picture{width:160px}
[data-theme=dark] .nav-logo img{filter:hue-rotate(220deg) saturate(1.2) brightness(1.1)}
.nav-menu{display:flex;align-items:center;gap:4px;list-style:none;height:100%}
.nav-item{position:relative;height:100%;display:flex;align-items:center}
.nav-link{position:relative;padding:10px 18px;color:var(--nav-link);text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;transition:var(--tr);white-space:nowrap;min-height:44px;display:flex;align-items:center;letter-spacing:0.2px}
.nav-link::after{content:'';position:absolute;bottom:8px;left:18px;right:18px;height:0;background:var(--accent);border-radius:2px;transition:height .3s cubic-bezier(.34,1.56,.64,1)}
.nav-link:hover{color:var(--nav-hover);background:var(--nav-hover-bg)}
.nav-link.active,.nav-link[aria-current=page]{color:var(--nav-hover);font-weight:700}
.nav-link.active::after,.nav-link[aria-current=page]::after{height:3px}
.nav-donate{margin-left:12px;padding:11px 26px;background:var(--btn-bg);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;transition:var(--tr);min-height:44px;letter-spacing:.4px;text-decoration:none;display:flex;align-items:center}
.nav-donate:hover{background:var(--btn-hover);transform:translateY(-1px)}
.burger{display:none;background:transparent;border:0;padding:8px;cursor:pointer;position:relative;z-index:10001;min-width:44px;min-height:44px;border-radius:8px;transition:var(--tr)}.burger:hover{background:var(--nav-hover-bg)}.burger span{display:block;width:24px;height:3px;background:var(--nav-link);margin:4px 0;transition:var(--tr);border-radius:2px}.burger.open span:nth-child(1){transform:rotate(45deg) translate(6px,6px)}.burger.open span:nth-child(2){opacity:0}.burger.open span:nth-child(3){transform:rotate(-45deg) translate(6px,-6px)}
.mobile-menu{position:fixed;inset:0;background:var(--mobile-bg);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);transform:translateY(-100%);opacity:0;visibility:hidden;transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .3s ease;z-index:9998;display:flex;flex-direction:column;padding:84px 24px 24px;overflow-y:auto}.mobile-menu.open{transform:translateY(0);opacity:1;visibility:visible}
.mobile-nav{display:flex;flex-direction:column;gap:2px;list-style:none;margin-bottom:24px}
.mobile-item{border-bottom:1px solid var(--nav-border);padding:16px 0;min-height:56px}
.mobile-link{color:var(--nav-link);text-decoration:none;font-size:16px;font-weight:600;transition:var(--tr);letter-spacing:0.1px;display:flex;align-items:center;position:relative}
.mobile-link.active{color:var(--nav-hover);font-weight:700}
.mobile-link.active::after{content:'';position:absolute;left:0;bottom:-16px;right:0;height:3px;background:var(--accent);border-radius:2px}
.mobile-donate{background:var(--btn-bg);color:#fff;margin-top:24px;cursor:pointer;font-size:16px;font-weight:700;padding:18px 24px;border-radius:10px;transition:var(--tr);min-height:60px;letter-spacing:.6px;border:none;width:100%;text-decoration:none;display:flex;align-items:center;justify-content:center}
.mobile-donate:hover{background:var(--btn-hover);transform:translateY(-1px)}
@media(max-width:980px){.nav-container{padding:0 20px}.nav-menu,.nav-donate{display:none}.burger{display:block}.theme-toggle{top:90px;right:20px}}
@media(max-width:640px){.nav-container{padding:0 16px}.nav-logo picture{width:150px}.nav.scrolled .nav-logo picture{width:135px}.mobile-link{font-size:15px}.theme-toggle{top:85px;right:16px;padding:8px 16px;font-size:12px}}
@media(max-width:380px){.nav-logo picture{width:130px}.nav.scrolled .nav-logo picture{width:120px}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
*:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
</style>
`;

export const LEGACY_HEADER_MARKUP = `
<a href="#main" class="skip-link">Skip to main content</a>
<header class="nav" id="nav" role="banner">
<div class="nav-container">
<a href="/" class="nav-logo" aria-label="Meauxbility Home">
<picture>
<source srcset="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661" type="image/webp">
<img src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.png?v=1760648662" alt="Meauxbility" width="180" height="180" loading="eager" fetchpriority="high">
</picture>
</a>
<nav aria-label="Main navigation">
<ul class="nav-menu">
<li><a class="nav-link" href="/">Home</a></li>
<li><a class="nav-link" href="/pages/about-us">About</a></li>
<li><a class="nav-link" href="/pages/mobility-grants-programs">Programs</a></li>
<li><a class="nav-link" href="/pages/community">Community</a></li>
<li><a class="nav-link" href="/pages/resources">Resources</a></li>
<li><a class="nav-link" href="/pages/get-involved">Connect</a></li>
<li><a class="nav-donate" href="/pages/donate">Impact</a></li>
</ul>
</nav>
<button class="burger" id="burger" aria-label="Toggle navigation menu" aria-expanded="false">
<span></span><span></span><span></span>
</button>
</div>
</header>
<nav class="mobile-menu" id="mobileMenu" aria-label="Mobile navigation">
<ul class="mobile-nav">
<li class="mobile-item"><a href="/" class="mobile-link">Home</a></li>
<li class="mobile-item"><a href="/pages/about-us" class="mobile-link">About</a></li>
<li class="mobile-item"><a href="/pages/mobility-grants-programs" class="mobile-link">Programs</a></li>
<li class="mobile-item"><a href="/pages/community" class="mobile-link">Community</a></li>
<li class="mobile-item"><a href="/pages/resources" class="mobile-link">Resources</a></li>
<li class="mobile-item"><a href="/pages/get-involved" class="mobile-link">Connect</a></li>
</ul>
<a class="mobile-donate" href="/pages/donate">Impact</a>
</nav>
`;

export const LEGACY_HEADER_SCRIPT = `
<script>
(()=>{
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const body=document.body;
const darkPages=['about','community','resources'];
function initTheme(){
const path=location.pathname;
let theme='light';
darkPages.forEach(p=>{if(path.includes(p))theme='dark'});
document.documentElement.setAttribute('data-theme',theme);
body.setAttribute('data-theme',theme);
}
initTheme();
const nav=$('#nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',pageYOffset>50),{passive:!0});
const burger=$('#burger'),menu=$('#mobileMenu');
burger.addEventListener('click',()=>{
const open=burger.classList.contains('open');
burger.classList.toggle('open');
burger.setAttribute('aria-expanded',!open);
menu.classList.toggle('open');
body.classList.toggle('modal-open',!open);
});
$$('.mobile-link,.mobile-donate').forEach(l=>l.addEventListener('click',()=>{
burger.classList.remove('open');
burger.setAttribute('aria-expanded','false');
menu.classList.remove('open');
body.classList.remove('modal-open');
}));
function setActive(){
const path=location.pathname;
$$('.nav-link,.mobile-link').forEach(l=>{
l.classList.remove('active');
l.removeAttribute('aria-current');
const href=l.getAttribute('href');
if(href===path||(path==='/'&&href==='/')){
l.classList.add('active');
l.setAttribute('aria-current','page');
}
});
}
addEventListener('DOMContentLoaded',()=>{setActive();initTheme()});
addEventListener('popstate',()=>{setActive();initTheme()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))burger.click()});
})();
</script>
`;

// Full HTML for reference (not used in injection)
export const LEGACY_HEADER_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meauxbility</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661" type="image/webp">
<style>
:root{--teal:#339999;--orange:#FF6B35;--orange-dark:#E85D00;--purple:#9B59B6;--mint:#4AECDC;--nav-h:72px;--nav-hs:60px;--max-w:1440px;--tr:all .3s cubic-bezier(.4,0,.2,1)}
[data-theme=light]{--nav-bg:rgba(255,255,255,.75);--nav-bg-scrolled:rgba(255,255,255,.85);--nav-border:rgba(255,107,53,.15);--nav-text:#0C2D31;--nav-link:#FF6B35;--nav-hover:#E85D00;--nav-hover-bg:rgba(255,107,53,.08);--mobile-bg:rgba(255,255,255,.90);--btn-bg:#FF6B35;--btn-hover:#E85D00;--accent:#FF6B35}
[data-theme=dark]{--nav-bg:rgba(12,45,49,.75);--nav-bg-scrolled:rgba(12,45,49,.85);--nav-border:rgba(74,236,220,.2);--nav-text:rgba(255,255,255,.95);--nav-link:#4AECDC;--nav-hover:#5FDDDC;--nav-hover-bg:rgba(74,236,220,.1);--mobile-bg:rgba(12,45,49,.90);--btn-bg:#9B59B6;--btn-hover:#8E44AD;--accent:#4AECDC}
*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;padding-top:var(--nav-h);color:#0C2D31;line-height:1.6;min-height:100vh;background:#fafafa}
[data-theme=dark] body{background:#0a1f22;color:rgba(255,255,255,.95)}
body.modal-open{overflow:hidden}
.skip-link{position:absolute;top:-100px;left:16px;padding:12px 24px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600;border-radius:8px;z-index:10001;transition:var(--tr)}.skip-link:focus{top:16px}
.nav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);background:var(--nav-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--nav-border);z-index:9999;transition:var(--tr)}
.nav.scrolled{height:var(--nav-hs);background:var(--nav-bg-scrolled);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px)}
.nav-container{max-width:var(--max-w);height:100%;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{display:flex;align-items:center;text-decoration:none;transition:var(--tr)}.nav-logo:hover{transform:scale(.98)}.nav-logo:focus-visible{outline:2px solid var(--accent);outline-offset:4px;border-radius:8px}.nav-logo picture{display:block;width:180px;height:auto;transition:var(--tr)}.nav-logo img{width:100%;height:auto;display:block}.nav.scrolled .nav-logo picture{width:160px}
[data-theme=dark] .nav-logo img{filter:hue-rotate(220deg) saturate(1.2) brightness(1.1)}
.nav-menu{display:flex;align-items:center;gap:4px;list-style:none;height:100%}
.nav-item{position:relative;height:100%;display:flex;align-items:center}
.nav-link{position:relative;padding:10px 18px;color:var(--nav-link);text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;transition:var(--tr);white-space:nowrap;min-height:44px;display:flex;align-items:center;letter-spacing:0.2px}
.nav-link::after{content:'';position:absolute;bottom:8px;left:18px;right:18px;height:0;background:var(--accent);border-radius:2px;transition:height .3s cubic-bezier(.34,1.56,.64,1)}
.nav-link:hover{color:var(--nav-hover);background:var(--nav-hover-bg)}
.nav-link.active,.nav-link[aria-current=page]{color:var(--nav-hover);font-weight:700}
.nav-link.active::after,.nav-link[aria-current=page]::after{height:3px}
.nav-donate{margin-left:12px;padding:11px 26px;background:var(--btn-bg);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;transition:var(--tr);min-height:44px;letter-spacing:.4px;text-decoration:none;display:flex;align-items:center}
.nav-donate:hover{background:var(--btn-hover);transform:translateY(-1px)}
.burger{display:none;background:transparent;border:0;padding:8px;cursor:pointer;position:relative;z-index:10001;min-width:44px;min-height:44px;border-radius:8px;transition:var(--tr)}.burger:hover{background:var(--nav-hover-bg)}.burger span{display:block;width:24px;height:3px;background:var(--nav-link);margin:4px 0;transition:var(--tr);border-radius:2px}.burger.open span:nth-child(1){transform:rotate(45deg) translate(6px,6px)}.burger.open span:nth-child(2){opacity:0}.burger.open span:nth-child(3){transform:rotate(-45deg) translate(6px,-6px)}
.mobile-menu{position:fixed;inset:0;background:var(--mobile-bg);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);transform:translateY(-100%);opacity:0;visibility:hidden;transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .3s ease;z-index:9998;display:flex;flex-direction:column;padding:84px 24px 24px;overflow-y:auto}.mobile-menu.open{transform:translateY(0);opacity:1;visibility:visible}
.mobile-nav{display:flex;flex-direction:column;gap:2px;list-style:none;margin-bottom:24px}
.mobile-item{border-bottom:1px solid var(--nav-border);padding:16px 0;min-height:56px}
.mobile-link{color:var(--nav-link);text-decoration:none;font-size:16px;font-weight:600;transition:var(--tr);letter-spacing:0.1px;display:flex;align-items:center;position:relative}
.mobile-link.active{color:var(--nav-hover);font-weight:700}
.mobile-link.active::after{content:'';position:absolute;left:0;bottom:-16px;right:0;height:3px;background:var(--accent);border-radius:2px}
.mobile-donate{background:var(--btn-bg);color:#fff;margin-top:24px;cursor:pointer;font-size:16px;font-weight:700;padding:18px 24px;border-radius:10px;transition:var(--tr);min-height:60px;letter-spacing:.6px;border:none;width:100%;text-decoration:none;display:flex;align-items:center;justify-content:center}
.mobile-donate:hover{background:var(--btn-hover);transform:translateY(-1px)}
@media(max-width:980px){.nav-container{padding:0 20px}.nav-menu,.nav-donate{display:none}.burger{display:block}.theme-toggle{top:90px;right:20px}}
@media(max-width:640px){.nav-container{padding:0 16px}.nav-logo picture{width:150px}.nav.scrolled .nav-logo picture{width:135px}.mobile-link{font-size:15px}.theme-toggle{top:85px;right:16px;padding:8px 16px;font-size:12px}}
@media(max-width:380px){.nav-logo picture{width:130px}.nav.scrolled .nav-logo picture{width:120px}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
*:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
</style>
</head>
<body data-theme="light">
<a href="#main" class="skip-link">Skip to main content</a>
<header class="nav" id="nav" role="banner">
<div class="nav-container">
<a href="/" class="nav-logo" aria-label="Meauxbility Home">
<picture>
<source srcset="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661" type="image/webp">
<img src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.png?v=1760648662" alt="Meauxbility" width="180" height="180" loading="eager" fetchpriority="high">
</picture>
</a>
<nav aria-label="Main navigation">
<ul class="nav-menu">
<li><a class="nav-link" href="/">Home</a></li>
<li><a class="nav-link" href="/pages/about-us">About</a></li>
<li><a class="nav-link" href="/pages/mobility-grants-programs">Programs</a></li>
<li><a class="nav-link" href="/pages/community">Community</a></li>
<li><a class="nav-link" href="/pages/resources">Resources</a></li>
<li><a class="nav-link" href="/pages/get-involved">Connect</a></li>
<li><a class="nav-donate" href="/pages/donate">Impact</a></li>
</ul>
</nav>
<button class="burger" id="burger" aria-label="Toggle navigation menu" aria-expanded="false">
<span></span><span></span><span></span>
</button>
</div>
</header>
<nav class="mobile-menu" id="mobileMenu" aria-label="Mobile navigation">
<ul class="mobile-nav">
<li class="mobile-item"><a href="/" class="mobile-link">Home</a></li>
<li class="mobile-item"><a href="/pages/about-us" class="mobile-link">About</a></li>
<li class="mobile-item"><a href="/pages/mobility-grants-programs" class="mobile-link">Programs</a></li>
<li class="mobile-item"><a href="/pages/community" class="mobile-link">Community</a></li>
<li class="mobile-item"><a href="/pages/resources" class="mobile-link">Resources</a></li>
<li class="mobile-item"><a href="/pages/get-involved" class="mobile-link">Connect</a></li>
</ul>
<a class="mobile-donate" href="/pages/donate">Impact</a>
</nav>
<main id="main">
<script>
(()=>{
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const body=document.body;
const darkPages=['about','community','resources'];
function initTheme(){
const path=location.pathname;
let theme='light';
darkPages.forEach(p=>{if(path.includes(p))theme='dark'});
document.documentElement.setAttribute('data-theme',theme);
body.setAttribute('data-theme',theme);
}
initTheme();
const nav=$('#nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',pageYOffset>50),{passive:!0});
const burger=$('#burger'),menu=$('#mobileMenu');
burger.addEventListener('click',()=>{
const open=burger.classList.contains('open');
burger.classList.toggle('open');
burger.setAttribute('aria-expanded',!open);
menu.classList.toggle('open');
body.classList.toggle('modal-open',!open);
});
$$('.mobile-link,.mobile-donate').forEach(l=>l.addEventListener('click',()=>{
burger.classList.remove('open');
burger.setAttribute('aria-expanded','false');
menu.classList.remove('open');
body.classList.remove('modal-open');
}));
function setActive(){
const path=location.pathname;
$$('.nav-link,.mobile-link').forEach(l=>{
l.classList.remove('active');
l.removeAttribute('aria-current');
const href=l.getAttribute('href');
if(href===path||(path==='/'&&href==='/')){
l.classList.add('active');
l.setAttribute('aria-current','page');
}
});
}
addEventListener('DOMContentLoaded',()=>{setActive();initTheme()});
addEventListener('popstate',()=>{setActive();initTheme()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))burger.click()});
})();
</script>
`;
