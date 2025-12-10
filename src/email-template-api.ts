// Email Template Management API for Southern Pets Animal Rescue
// Allows admins to customize email templates with animal photos

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export interface EmailTemplate {
  id: string;
  type: 'adoption_admin' | 'adoption_customer' | 'tnr_admin' | 'tnr_customer';
  name: string;
  subject: string;
  html: string;
  variables: string[]; // Available template variables
  updatedAt: string;
  updatedBy?: string;
}

// Get animal photos for email
export async function getAnimalPhotosForEmail(
  env: any,
  animalId?: number,
  animalName?: string
): Promise<Array<{ url: string; alt: string; isPrimary: boolean }>> {
  const db = env.DB || env.SOUTHERNPETS_DB;
  if (!db) return [];

  try {
    let photos: any[] = [];

    if (animalId) {
      // Try animal_photos table first
      try {
        const result = await db.prepare(`
          SELECT * FROM animal_photos 
          WHERE animal_id = ?
          ORDER BY is_primary DESC, display_order ASC
          LIMIT 5
        `).bind(animalId).all();
        photos = result.results || [];
      } catch (error) {
        // Try animal_images table (alternative schema)
        try {
          const result = await db.prepare(`
            SELECT * FROM animal_images 
            WHERE animalId = ?
            ORDER BY isPrimary DESC
            LIMIT 5
          `).bind(animalId).all();
          photos = result.results || [];
        } catch (e) {
          // Table doesn't exist
        }
      }
    } else if (animalName) {
      // Get photos by animal name
      const animal = await db.prepare(`
        SELECT id FROM animals WHERE name = ? LIMIT 1
      `).bind(animalName).first<{ id: number }>();

      if (animal) {
        try {
          const result = await db.prepare(`
            SELECT * FROM animal_photos 
            WHERE animal_id = ?
            ORDER BY is_primary DESC, display_order ASC
            LIMIT 5
          `).bind(animal.id).all();
          photos = result.results || [];
        } catch (error) {
          // Try animal_images table
          try {
            const result = await db.prepare(`
              SELECT * FROM animal_images 
              WHERE animalId = ?
              ORDER BY isPrimary DESC
              LIMIT 5
            `).bind(animal.id).all();
            photos = result.results || [];
          } catch (e) {
            // Table doesn't exist
          }
        }
      }
    }

    return photos.map(photo => ({
      url: photo.photo_url || photo.url || photo.cloudflare_image_url || '',
      alt: `${animalName || 'Pet'} - Photo ${photo.id}`,
      isPrimary: (photo.is_primary === 1) || (photo.isPrimary === 1),
    })).filter(p => p.url);
  } catch (error) {
    console.error('Error fetching animal photos:', error);
    return [];
  }
}

// Generate photo gallery HTML for emails
export function generatePhotoGalleryHTML(photos: Array<{ url: string; alt: string; isPrimary: boolean }>): string {
  if (photos.length === 0) return '';

  const CLOUDFLARE_IMAGES_ACCOUNT_HASH = 'g7wf09fCONpnidkRnR_5vw';

  // Optimize images for email (use Cloudflare Images variants)
  const optimizedPhotos = photos.map(photo => {
    // Extract image ID from URL if it's a Cloudflare Images URL
    const imageIdMatch = photo.url.match(/imagedelivery\.net\/[^/]+\/([^/]+)\//);
    if (imageIdMatch) {
      const imageId = imageIdMatch[1];
      return {
        ...photo,
        thumbnail: `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/thumbnail`,
        medium: `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/medium`,
        full: photo.url,
      };
    }
    return {
      ...photo,
      thumbnail: photo.url,
      medium: photo.url,
      full: photo.url,
    };
  });

  if (optimizedPhotos.length === 1) {
    // Single photo - larger display
    return `
      <div style="margin: 30px 0; text-align: center;">
        <img src="${optimizedPhotos[0].medium}" 
             alt="${optimizedPhotos[0].alt}" 
             style="max-width: 500px; width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
             loading="lazy">
      </div>
    `;
  }

  // Multiple photos - gallery grid
  const gridCols = optimizedPhotos.length <= 2 ? 2 : optimizedPhotos.length <= 4 ? 2 : 3;

  return `
    <div style="margin: 30px 0;">
      <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 1.2rem; text-align: center;">📸 Photo Gallery</h3>
      <div style="display: grid; grid-template-columns: repeat(${gridCols}, 1fr); gap: 15px; max-width: 600px; margin: 0 auto;">
        ${optimizedPhotos.map((photo, index) => `
          <div style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <img src="${photo.thumbnail}" 
                 alt="${photo.alt}" 
                 style="width: 100%; height: 200px; object-fit: cover; display: block;"
                 loading="lazy">
            ${photo.isPrimary ? `
              <div style="position: absolute; top: 8px; right: 8px; background: #2ecc71; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                Primary
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      <p style="text-align: center; margin-top: 15px; color: #666; font-size: 14px;">
        ${optimizedPhotos.length} photo${optimizedPhotos.length > 1 ? 's' : ''} available
      </p>
    </div>
  `;
}

// Get email template
export async function getEmailTemplate(env: any, type: string): Promise<EmailTemplate | null> {
  const db = env.DB || env.SOUTHERNPETS_DB;
  if (!db) return null;

  try {
    const template = await db.prepare(`
      SELECT * FROM email_templates WHERE type = ? LIMIT 1
    `).bind(type).first<EmailTemplate>();

    return template || null;
  } catch (error) {
    // Table might not exist yet
    return null;
  }
}

// Save email template
export async function saveEmailTemplate(env: any, template: Partial<EmailTemplate>): Promise<boolean> {
  const db = env.DB || env.SOUTHERNPETS_DB;
  if (!db) return false;

  try {
    // Create table if it doesn't exist
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        html TEXT NOT NULL,
        variables TEXT,
        updatedAt TEXT NOT NULL,
        updatedBy TEXT
      )
    `).run();

    const now = new Date().toISOString();
    const id = template.id || crypto.randomUUID();

    await db.prepare(`
      INSERT OR REPLACE INTO email_templates 
      (id, type, name, subject, html, variables, updatedAt, updatedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      template.type,
      template.name || template.type,
      template.subject || '',
      template.html || '',
      JSON.stringify(template.variables || []),
      now,
      template.updatedBy || 'admin'
    ).run();

    return true;
  } catch (error) {
    console.error('Error saving template:', error);
    return false;
  }
}

// List all templates
export async function listEmailTemplates(env: any): Promise<EmailTemplate[]> {
  const db = env.DB || env.SOUTHERNPETS_DB;
  if (!db) return [];

  try {
    const result = await db.prepare(`
      SELECT * FROM email_templates ORDER BY type
    `).all<EmailTemplate>();

    return result.results || [];
  } catch (error) {
    return [];
  }
}

// Render template with variables
export function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template;

  // Replace {{variable}} syntax
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, value || '');
  }

  return rendered;
}

// API Handlers

export async function handleGetTemplate(request: Request, env: any, url: URL): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const type = url.searchParams.get('type');
    if (!type) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Type parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const template = await getEmailTemplate(env, type);

    if (!template) {
      // Return default template
      return new Response(JSON.stringify({
        success: true,
        template: getDefaultTemplate(type),
        isDefault: true,
      }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({
      success: true,
      template,
      isDefault: false,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function handleSaveTemplate(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const template: Partial<EmailTemplate> = await request.json();

    if (!template.type) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Template type is required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const saved = await saveEmailTemplate(env, template);

    return new Response(JSON.stringify({
      success: saved,
      message: saved ? 'Template saved successfully' : 'Failed to save template',
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function handleListTemplates(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const templates = await listEmailTemplates(env);

    return new Response(JSON.stringify({
      success: true,
      templates,
      count: templates.length,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Get default template
function getDefaultTemplate(type: string): EmailTemplate {
  const defaults: Record<string, EmailTemplate> = {
    adoption_admin: {
      id: 'default-adoption-admin',
      type: 'adoption_admin',
      name: 'Adoption Application - Admin Notification',
      subject: 'New Adoption Application: {{applicant_name}} - {{animal_name}}',
      html: '<!-- Default template - customize in admin panel -->',
      variables: ['applicant_name', 'animal_name', 'applicant_email', 'applicant_phone'],
      updatedAt: new Date().toISOString(),
    },
    adoption_customer: {
      id: 'default-adoption-customer',
      type: 'adoption_customer',
      name: 'Adoption Application - Customer Thank You',
      subject: 'Thank You for Your Adoption Application - Southern Pets Animal Rescue',
      html: '<!-- Default template - customize in admin panel -->',
      variables: ['applicant_name', 'animal_name'],
      updatedAt: new Date().toISOString(),
    },
    tnr_admin: {
      id: 'default-tnr-admin',
      type: 'tnr_admin',
      name: 'TNR Request - Admin Notification',
      subject: 'New TNR Request: {{requester_name}} - {{cat_count}} cat(s)',
      html: '<!-- Default template - customize in admin panel -->',
      variables: ['requester_name', 'cat_count', 'requester_email'],
      updatedAt: new Date().toISOString(),
    },
    tnr_customer: {
      id: 'default-tnr-customer',
      type: 'tnr_customer',
      name: 'TNR Request - Customer Thank You',
      subject: 'Thank You for Your TNR Request - Southern Pets Animal Rescue',
      html: '<!-- Default template - customize in admin panel -->',
      variables: ['requester_name', 'cat_count'],
      updatedAt: new Date().toISOString(),
    },
  };

  return defaults[type] || defaults.adoption_admin;
}
