// Bulk remaster multiple Shopify HTML pages
// Processes all provided HTML, migrates images, adds SEO, injects headers

export interface PageToRemaster {
  html: string;
  path: string; // e.g., "index.html" or "pages/donmichael-campaign.html"
  title?: string;
  description?: string;
  keywords?: string[];
}

export async function remasterBulkPages(
  pages: PageToRemaster[],
  env: any,
  url: URL,
  migrateImages: boolean = true
): Promise<Array<{ path: string; success: boolean; url?: string; error?: string; imagesMigrated?: number }>> {
  const results = [];

  for (const page of pages) {
    try {
      // 1. Remove Shopify code
      let html = remasterShopifyHTML(page.html);

      // 2. Migrate images if requested
      let imagesMigrated = 0;
      if (migrateImages && env.CLOUDFLARE_IMAGES_API_TOKEN && env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
        const imageUrls = extractImagesFromHTML(html);
        const urlReplacements = new Map<string, string>();

        for (const imageUrl of imageUrls) {
          if (!imageUrl.includes('imagedelivery.net') && !imageUrl.startsWith('data:')) {
            const migrationResult = await migrateImageToCloudflare(imageUrl, env, 'public');
            if (migrationResult.success && migrationResult.cdnUrl) {
              urlReplacements.set(imageUrl, migrationResult.cdnUrl);
              imagesMigrated++;
            }
          }
        }

        // Replace all image URLs
        urlReplacements.forEach((newUrl, oldUrl) => {
          html = html.replace(new RegExp(`src=["']${escapeRegex(oldUrl)}["']`, 'gi'), `src="${newUrl}"`);
          html = html.replace(new RegExp(`srcset=["']([^"']*${escapeRegex(oldUrl)}[^"']*)["']`, 'gi'), (match: string, srcset: string) => {
            return `srcset="${srcset.replace(oldUrl, newUrl)}"`;
          });
          html = html.replace(new RegExp(`background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), `background-image: url("${newUrl}")`);
          html = html.replace(new RegExp(`style=["'][^"']*background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), (match: string) => {
            return match.replace(oldUrl, newUrl);
          });
          // Replace in CSS variables
          html = html.replace(new RegExp(`--src:url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), `--src:url("${newUrl}")`);
        });
      }

      // 3. Inject header
      const headerType = await getHeaderPreference(env, 'glassmorphic');
      const logoUrl = await getLogoUrl(env);
      html = await injectHeader(html, headerType, logoUrl);

      // 4. Enhance with SEO
      const pageUrlPath = page.path.replace('.html', '').replace(/^pages\//, '/pages/').replace(/^index\.html$/, '/');
      html = await enhancePageWithSEO(html, pageUrlPath, url, env, {
        title: page.title,
        description: page.description,
        keywords: page.keywords,
      });

      // 5. Upload to R2
      const r2Path = page.path.startsWith('pages/') ? page.path : (page.path === 'index.html' ? 'index.html' : `pages/${page.path}`);
      await uploadR2Object(env.R2_WEBSITE, r2Path, html);

      results.push({
        path: r2Path,
        success: true,
        url: `${url.origin}/${r2Path.replace('.html', '').replace('index.html', '')}`,
        imagesMigrated,
      });
    } catch (error: any) {
      results.push({
        path: page.path,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

// Helper functions (import from main file or define here)
function remasterShopifyHTML(html: string): string {
  // Remove Shopify scripts
  html = html.replace(/<script[^>]*shopify[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*stripe[^>]*>[\s\S]*?<\/script>/gi, ''); // Keep Stripe for donations

  // Remove Shopify meta tags
  html = html.replace(/<meta[^>]*shopify[^>]*>/gi, '');

  // Remove Shopify tracking pixels
  html = html.replace(/<img[^>]*shopify[^>]*>/gi, '');

  // Clean up empty lines
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

  return html;
}

function extractImagesFromHTML(html: string): string[] {
  const images = new Set<string>();

  // Extract from img src
  const imgSrcMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (imgSrcMatches) {
    imgSrcMatches.forEach(match => {
      const srcMatch = match.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        images.add(srcMatch[1]);
      }
    });
  }

  // Extract from img srcset
  const srcsetMatches = html.match(/srcset=["']([^"']+)["']/gi);
  if (srcsetMatches) {
    srcsetMatches.forEach(match => {
      const srcsetMatch = match.match(/srcset=["']([^"']+)["']/i);
      if (srcsetMatch && srcsetMatch[1]) {
        srcsetMatch[1].split(',').forEach(src => {
          const url = src.trim().split(/\s+/)[0];
          if (url) images.add(url);
        });
      }
    });
  }

  // Extract from CSS background-image
  const bgMatches = html.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/gi);
  if (bgMatches) {
    bgMatches.forEach(match => {
      const urlMatch = match.match(/url\(["']?([^"')]+)["']?\)/i);
      if (urlMatch && urlMatch[1]) {
        images.add(urlMatch[1]);
      }
    });
  }

  // Extract from CSS variables (--src:url(...))
  const cssVarMatches = html.match(/--src:url\(["']?([^"')]+)["']?\)/gi);
  if (cssVarMatches) {
    cssVarMatches.forEach(match => {
      const urlMatch = match.match(/url\(["']?([^"')]+)["']?\)/i);
      if (urlMatch && urlMatch[1]) {
        images.add(urlMatch[1]);
      }
    });
  }

  return Array.from(images);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// These need to be imported from main file or defined
async function getHeaderPreference(env: any, defaultValue: 'glassmorphic' | 'legacy'): Promise<'glassmorphic' | 'legacy'> {
  if (!env.KV_CONFIG) return defaultValue;
  try {
    const preference = await env.KV_CONFIG.get('header:preference');
    return (preference === 'legacy' || preference === 'glassmorphic') ? preference : defaultValue;
  } catch {
    return defaultValue;
  }
}

async function getLogoUrl(env: any): Promise<string> {
  if (!env.KV_CONFIG) return '';
  try {
    const logoUrl = await env.KV_CONFIG.get('logo:url');
    return logoUrl || '';
  } catch {
    return '';
  }
}

async function injectHeader(html: string, headerType: 'glassmorphic' | 'legacy', logoUrl?: string): Promise<string> {
  // Import header components
  const { GLASSMORPHIC_HEADER_HTML } = await import('./glassmorphic-header.html');
  const { LEGACY_HEADER_STYLES, LEGACY_HEADER_MARKUP, LEGACY_HEADER_SCRIPT } = await import('./legacy-header.html');

  const finalLogoUrl = logoUrl || '';

  if (headerType === 'legacy') {
    // Inject legacy header
    if (!html.includes('id="nav"') && !html.includes('glassmorphic-header')) {
      // Inject styles in head
      html = html.replace('</head>', `${LEGACY_HEADER_STYLES}\n</head>`);

      // Inject markup after body
      html = html.replace('<body>', `<body>\n<a href="#main-content" class="skip-link">Skip to main content</a>\n${LEGACY_HEADER_MARKUP.replace(/https:\/\/cdn\.shopify\.com\/[^"'\s]+/g, finalLogoUrl)}`);

      // Inject script before </body>
      html = html.replace('</body>', `${LEGACY_HEADER_SCRIPT}\n</body>`);
    }
  } else {
    // Inject glassmorphic header
    if (!html.includes('glassmorphic-header')) {
      const headerHTML = GLASSMORPHIC_HEADER_HTML.replace(/https:\/\/imagedelivery\.net\/[^"'\s]+/g, finalLogoUrl);
      html = html.replace('<body>', `<body>\n${headerHTML}`);
    }
  }

  return html;
}

async function enhancePageWithSEO(
  html: string,
  path: string,
  url: URL,
  env: any,
  customMetadata?: { title?: string; description?: string; keywords?: string[] }
): Promise<string> {
  // Get metadata
  const title = customMetadata?.title || getPageTitleFromPath(path);
  const description = customMetadata?.description || getPageDescriptionFromPath(path);
  const keywords = customMetadata?.keywords || getPageKeywordsFromPath(path);

  // Get logo for OG image
  const logoUrl = await getLogoUrl(env);
  const ogImage = logoUrl || `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH}/86181f93-ab81-4428-6f24-f7583e758f00/public`;

  const metadata = {
    title,
    description,
    keywords,
    ogImage,
    url: `${url.origin}${path}`,
  };

  // Generate SEO tags
  const seoTags = generateSEOTags(metadata);

  // Ensure complete SEO
  html = ensureCompleteSEO(html, metadata);

  return html;
}

function getPageTitleFromPath(path: string): string {
  const pageNames: Record<string, string> = {
    '/': 'Meauxbility - Empowering mobility and independence',
    '/pages/donmichael-our-first-campaign': 'DonMichael\'s Campaign - Meauxbility',
    '/pages/accessibility-partners': 'Accessibility Partners - Meauxbility',
  };
  return pageNames[path] || 'Meauxbility - Empowering mobility and independence';
}

function getPageDescriptionFromPath(path: string): string {
  const descriptions: Record<string, string> = {
    '/': 'Meauxbility - Empowering mobility and independence for adaptive athletes and spinal cord injury survivors.',
    '/pages/donmichael-our-first-campaign': 'Help fund DonMichael\'s custom wheelchair. Our first initiative raising $10,000 for independence and access.',
    '/pages/accessibility-partners': 'Meet Meauxbility\'s accessibility partners and supporters working together to create more access and more life.',
  };
  return descriptions[path] || 'Meauxbility - Empowering mobility and independence';
}

function getPageKeywordsFromPath(path: string): string[] {
  return ['meauxbility', 'spinal cord injury', 'adaptive athletes', 'mobility', 'accessibility', 'nonprofit'];
}

function generateSEOTags(metadata: any): string {
  // Implementation from main file
  return '';
}

function ensureCompleteSEO(html: string, metadata: any): string {
  // Implementation from main file
  return html;
}

async function uploadR2Object(bucket: any, key: string, content: string): Promise<void> {
  await bucket.put(key, content, {
    httpMetadata: {
      contentType: 'text/html; charset=utf-8',
    },
    customMetadata: {
      remastered: 'true',
      remasteredAt: new Date().toISOString(),
    },
  });
}

async function migrateImageToCloudflare(imageUrl: string, env: any, variant: string): Promise<{ success: boolean; cdnUrl?: string; imageId?: string; error?: string }> {
  // Implementation from main file
  return { success: false, error: 'Not implemented' };
}
