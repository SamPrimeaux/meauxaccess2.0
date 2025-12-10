// Southern Pets Animal Rescue - Email Template Worker
// Standalone worker for email template management and photo gallery emails
// Worker Name: southernpets-email-worker

import { default as getSouthernPetsDashboardHTML } from './southernpets-dashboard.html';

export interface Env {
  // Database
  DB?: D1Database;
  SOUTHERNPETS_DB?: D1Database;

  // R2 Storage
  R2_SOUTHERNPETS?: R2Bucket;
  R2_STORAGE?: R2Bucket;

  // Cloudflare Images
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;

  // Email
  RESEND_API_KEY?: string;

  // Config
  PRODUCTION_URL?: string;
}

const CLOUDFLARE_IMAGES_ACCOUNT_HASH = 'g7wf09fCONpnidkRnR_5vw';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Main fetch handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================================
    // EMAIL TEMPLATE EDITOR UI
    // ============================================
    if (path === '/admin/email-templates' || path === '/email-templates') {
      const editorHTML = await generateEmailTemplateEditorHTML();
      return new Response(editorHTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // ============================================
    // EMAIL TEMPLATE API
    // ============================================

    // Get template
    if (path === '/api/email-templates/get' || path === '/api/templates/get') {
      return handleGetTemplate(request, env, url);
    }

    // Save template
    if ((path === '/api/email-templates/save' || path === '/api/templates/save') && request.method === 'POST') {
      return handleSaveTemplate(request, env);
    }

    // List all templates
    if (path === '/api/email-templates/list' || path === '/api/templates/list') {
      return handleListTemplates(request, env);
    }

    // Test email
    if ((path === '/api/email-templates/test' || path === '/api/templates/test') && request.method === 'POST') {
      return handleTestEmail(request, env);
    }

    // ============================================
    // PHOTO GALLERY API (for emails)
    // ============================================

    // Get animal photos for email
    if (path === '/api/email/photos' || path === '/api/photos') {
      return handleGetAnimalPhotos(request, env, url);
    }

    // ============================================
    // DASHBOARD
    // ============================================
    if (path === '/dashboard') {
      return new Response(getSouthernPetsDashboardHTML(), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // ============================================
    // DASHBOARD API ROUTES
    // ============================================

    // Gallery API Routes
    if (path.startsWith('/api/gallery')) {
      const { handleGalleryList, handleGalleryUpload, handleGalleryUpdate, handleGalleryDelete } = await import('./southernpets-gallery-api');

      if (path === '/api/gallery' && request.method === 'GET') {
        return handleGalleryList(request, env);
      }
      if (path === '/api/gallery/upload' && request.method === 'POST') {
        return handleGalleryUpload(request, env);
      }
      if (path === '/api/gallery/update' && request.method === 'POST') {
        return handleGalleryUpdate(request, env);
      }
      if (path === '/api/gallery/delete' && request.method === 'DELETE') {
        return handleGalleryDelete(request, env);
      }
    }

    // Animals API Routes
    if (path.startsWith('/api/animals')) {
      const db = env.DB || env.SOUTHERNPETS_DB;
      if (!db) {
        return new Response(JSON.stringify({ success: false, error: 'Database not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        // GET /api/animals - List all animals
        if (path === '/api/animals' && request.method === 'GET') {
          const animals = await db.prepare('SELECT * FROM animals ORDER BY name').all();

          // Get photos for each animal
          const animalsWithPhotos = await Promise.all((animals.results || []).map(async (animal: any) => {
            const photos = await db.prepare('SELECT * FROM animal_images WHERE animalId = ? ORDER BY isPrimary DESC, uploadedAt DESC')
              .bind(animal.id.toString()).all();
            return {
              ...animal,
              photos: photos.results || []
            };
          }));

          return new Response(JSON.stringify({
            success: true,
            animals: animalsWithPhotos
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // GET /api/animals/:id - Get single animal
        if (path.match(/^\/api\/animals\/\d+$/) && request.method === 'GET') {
          const animalId = path.split('/').pop();
          const animal = await db.prepare('SELECT * FROM animals WHERE id = ?').bind(animalId).first();

          if (!animal) {
            return new Response(JSON.stringify({ success: false, error: 'Animal not found' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const photos = await db.prepare('SELECT * FROM animal_images WHERE animalId = ? ORDER BY isPrimary DESC, uploadedAt DESC')
            .bind(animalId).all();

          return new Response(JSON.stringify({
            success: true,
            animal: {
              ...animal,
              photos: photos.results || []
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // POST /api/animals - Create animal
        if (path === '/api/animals' && request.method === 'POST') {
          const body = await request.json();
          const now = new Date().toISOString();

          const result = await db.prepare(`
            INSERT INTO animals (name, species, breed, age, gender, status, bio, adoption_fee, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            body.name,
            body.species || 'dog',
            body.breed || '',
            body.age || '',
            body.gender || '',
            body.status || 'available',
            body.bio || '',
            body.adoption_fee || (body.species === 'dog' ? 250 : 150),
            now,
            now
          ).run();

          return new Response(JSON.stringify({
            success: true,
            animal: { id: result.meta.last_row_id, ...body }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // PUT /api/animals/:id - Update animal
        if (path.match(/^\/api\/animals\/\d+$/) && request.method === 'PUT') {
          const animalId = path.split('/').pop();
          const body = await request.json();
          const now = new Date().toISOString();

          await db.prepare(`
            UPDATE animals 
            SET name = ?, species = ?, breed = ?, age = ?, gender = ?, status = ?, bio = ?, adoption_fee = ?, updated_at = ?
            WHERE id = ?
          `).bind(
            body.name,
            body.species,
            body.breed,
            body.age,
            body.gender,
            body.status,
            body.bio,
            body.adoption_fee,
            now,
            animalId
          ).run();

          return new Response(JSON.stringify({
            success: true,
            message: 'Animal updated'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Analytics API (placeholder)
    if (path === '/api/analytics/stats' && request.method === 'GET') {
      const db = env.DB || env.SOUTHERNPETS_DB;
      if (!db) {
        return new Response(JSON.stringify({ success: false, error: 'Database not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        // Get stats from database
        const [applications, adoptions, tnr] = await Promise.all([
          db.prepare('SELECT COUNT(*) as count FROM adoption_applications').first<{ count: number }>(),
          db.prepare('SELECT COUNT(*) as count FROM adoption_applications WHERE status = ?').bind('approved').first<{ count: number }>(),
          db.prepare('SELECT COUNT(*) as count FROM tnr_requests').first<{ count: number }>(),
        ]);

        return new Response(JSON.stringify({
          success: true,
          visitors: 2847, // Placeholder - would come from analytics
          applications: applications?.count || 0,
          adoptions: adoptions?.count || 0,
          tnr: tnr?.count || 0,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Emails API (placeholder - would connect to email worker)
    if (path === '/api/emails' && request.method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        emails: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ============================================
    // DEFAULT: Info page
    // ============================================
    return new Response(generateInfoPage(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  },
};

// ============================================
// EMAIL TEMPLATE FUNCTIONS
// ============================================

interface EmailTemplate {
  id: string;
  type: 'adoption_admin' | 'adoption_customer' | 'tnr_admin' | 'tnr_customer';
  name: string;
  subject: string;
  html: string;
  variables: string[];
  updatedAt: string;
  updatedBy?: string;
}

// Get email template
async function handleGetTemplate(request: Request, env: Env, url: URL): Promise<Response> {
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

// Save email template
async function handleSaveTemplate(request: Request, env: Env): Promise<Response> {
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

// List all templates
async function handleListTemplates(request: Request, env: Env): Promise<Response> {
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

// Test email
async function handleTestEmail(request: Request, env: Env): Promise<Response> {
  try {
    const { type, testEmail } = await request.json();

    if (!type) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Template type is required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const template = await getEmailTemplate(env, type) || getDefaultTemplate(type);

    // Render with test data
    const testData = getTestDataForType(type);
    const renderedHTML = renderTemplate(template.html, testData);
    const renderedSubject = renderTemplate(template.subject, testData);

    // Send test email
    if (env.RESEND_API_KEY) {
      const emailResult = await sendEmail(
        env,
        testEmail || 'SouthernPetsAnimalRescue@gmail.com',
        renderedSubject,
        renderedHTML
      );

      return new Response(JSON.stringify({
        success: emailResult.success,
        message: emailResult.success ? 'Test email sent successfully' : 'Failed to send test email',
        error: emailResult.error,
      }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'RESEND_API_KEY not configured',
    }), {
      status: 500,
      headers: corsHeaders,
    });
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

// Get animal photos for email
async function handleGetAnimalPhotos(request: Request, env: Env, url: URL): Promise<Response> {
  try {
    const animalId = url.searchParams.get('animalId');
    const animalName = url.searchParams.get('animalName');

    if (!animalId && !animalName) {
      return new Response(JSON.stringify({
        success: false,
        error: 'animalId or animalName parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const photos = await getAnimalPhotosForEmail(env, animalId ? parseInt(animalId) : undefined, animalName || undefined);
    const galleryHTML = generatePhotoGalleryHTML(photos);

    return new Response(JSON.stringify({
      success: true,
      photos,
      galleryHTML,
      count: photos.length,
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

// ============================================
// DATABASE FUNCTIONS
// ============================================

async function getEmailTemplate(env: Env, type: string): Promise<EmailTemplate | null> {
  const db = env.DB || env.SOUTHERNPETS_DB;
  if (!db) return null;

  try {
    const template = await db.prepare(`
      SELECT * FROM email_templates WHERE type = ? LIMIT 1
    `).bind(type).first<EmailTemplate>();

    if (template && template.variables) {
      try {
        template.variables = JSON.parse(template.variables as any);
      } catch (e) {
        template.variables = [];
      }
    }

    return template || null;
  } catch (error) {
    return null;
  }
}

async function saveEmailTemplate(env: Env, template: Partial<EmailTemplate>): Promise<boolean> {
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

async function listEmailTemplates(env: Env): Promise<EmailTemplate[]> {
  const db = env.DB || env.SOUTHERNPETS_DB;
  if (!db) return [];

  try {
    const result = await db.prepare(`
      SELECT * FROM email_templates ORDER BY type
    `).all<EmailTemplate>();

    const templates = result.results || [];

    // Parse variables JSON
    templates.forEach(template => {
      if (template.variables && typeof template.variables === 'string') {
        try {
          template.variables = JSON.parse(template.variables);
        } catch (e) {
          template.variables = [];
        }
      }
    });

    return templates;
  } catch (error) {
    return [];
  }
}

// ============================================
// PHOTO GALLERY FUNCTIONS
// ============================================

async function getAnimalPhotosForEmail(
  env: Env,
  animalId?: number,
  animalName?: string
): Promise<Array<{ url: string; alt: string; isPrimary: boolean }>> {
  const db = env.DB || env.SOUTHERNPETS_DB;
  if (!db) return [];

  try {
    let photos: any[] = [];

    if (animalId) {
      // Try animal_images table (current schema)
      try {
        const result = await db.prepare(`
          SELECT * FROM animal_images 
          WHERE animalId = ?
          ORDER BY isPrimary DESC
          LIMIT 5
        `).bind(animalId.toString()).all();
        photos = result.results || [];
      } catch (error) {
        // Try animal_photos table (alternative schema)
        try {
          const result = await db.prepare(`
            SELECT * FROM animal_photos 
            WHERE animal_id = ?
            ORDER BY is_primary DESC, display_order ASC
            LIMIT 5
          `).bind(animalId).all();
          photos = result.results || [];
        } catch (e) {
          // Tables don't exist
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
            SELECT * FROM animal_images 
            WHERE animalId = ?
            ORDER BY isPrimary DESC
            LIMIT 5
          `).bind(animal.id.toString()).all();
          photos = result.results || [];
        } catch (error) {
          try {
            const result = await db.prepare(`
              SELECT * FROM animal_photos 
              WHERE animal_id = ?
              ORDER BY is_primary DESC, display_order ASC
              LIMIT 5
            `).bind(animal.id).all();
            photos = result.results || [];
          } catch (e) {
            // Tables don't exist
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

function generatePhotoGalleryHTML(photos: Array<{ url: string; alt: string; isPrimary: boolean }>): string {
  if (photos.length === 0) return '';

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

// ============================================
// EMAIL FUNCTIONS
// ============================================

async function sendEmail(
  env: Env,
  to: string | string[],
  subject: string,
  html: string,
  replyTo?: string
): Promise<{ success: boolean; error?: string }> {
  if (!env.RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Southern Pets Animal Rescue <info@southernpetsanimalrescue.com>',
        to: Array.isArray(to) ? to : [to],
        reply_to: replyTo || 'info@southernpetsanimalrescue.com',
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to send email' };
    }

    const data = await response.json();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// TEMPLATE FUNCTIONS
// ============================================

function getDefaultTemplate(type: string): EmailTemplate {
  const defaults: Record<string, EmailTemplate> = {
    adoption_admin: {
      id: 'default-adoption-admin',
      type: 'adoption_admin',
      name: 'Adoption Application - Admin Notification',
      subject: 'New Adoption Application: {{applicant_name}} - {{animal_name}}',
      html: '<!-- Default template - customize in admin panel -->',
      variables: ['applicant_name', 'animal_name', 'applicant_email', 'applicant_phone', 'photo_gallery', 'submission_id'],
      updatedAt: new Date().toISOString(),
    },
    adoption_customer: {
      id: 'default-adoption-customer',
      type: 'adoption_customer',
      name: 'Adoption Application - Customer Thank You',
      subject: 'Thank You for Your Adoption Application - Southern Pets Animal Rescue',
      html: '<!-- Default template - customize in admin panel -->',
      variables: ['applicant_name', 'animal_name', 'photo_gallery'],
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

function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template;

  // Replace {{variable}} syntax
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, value || '');
  }

  return rendered;
}

function getTestDataForType(type: string): Record<string, any> {
  const testData: Record<string, Record<string, any>> = {
    adoption_admin: {
      applicant_name: 'John Doe',
      animal_name: 'Rolo',
      applicant_email: 'john.doe@example.com',
      applicant_phone: '(337) 555-1234',
      photo_gallery: generatePhotoGalleryHTML([]), // Empty for test
      submission_id: 'TEST-123',
    },
    adoption_customer: {
      applicant_name: 'John Doe',
      animal_name: 'Rolo',
      photo_gallery: generatePhotoGalleryHTML([]),
    },
    tnr_admin: {
      requester_name: 'Jane Smith',
      cat_count: '3',
      requester_email: 'jane.smith@example.com',
    },
    tnr_customer: {
      requester_name: 'Jane Smith',
      cat_count: '3',
    },
  };

  return testData[type] || {};
}

// ============================================
// UI GENERATION
// ============================================

async function generateEmailTemplateEditorHTML(): Promise<string> {
  // Import editor HTML generator
  try {
    const editorModule = await import('./email-template-editor.html');
    if (editorModule && editorModule.generateEmailTemplateEditorHTML) {
      return editorModule.generateEmailTemplateEditorHTML();
    }
  } catch (error) {
    console.error('Error loading editor module:', error);
  }

  // Fallback: Return inline editor HTML
  return getInlineEditorHTML();
}

function getInlineEditorHTML(): string {
  // Inline editor HTML (full implementation)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template Editor - Southern Pets Animal Rescue</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; padding: 20px; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { font-size: 2rem; margin-bottom: 10px; }
    .content { padding: 30px; }
    .template-selector { margin-bottom: 30px; }
    .template-selector label { display: block; font-weight: 600; margin-bottom: 10px; color: #2c3e50; }
    .template-selector select { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; background: white; }
    .template-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2ecc71; }
    .template-info h3 { margin-bottom: 10px; color: #2c3e50; }
    .variables { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .variable-tag { background: #e8f5e9; color: #2e7d32; padding: 6px 12px; border-radius: 6px; font-size: 0.875rem; font-weight: 500; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #2c3e50; }
    .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; font-family: inherit; transition: border-color 0.3s; }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #2ecc71; box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.1); }
    .form-group textarea { min-height: 200px; resize: vertical; }
    .editor-toolbar { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
    .editor-toolbar button { padding: 8px 16px; background: #2ecc71; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.3s; }
    .editor-toolbar button:hover { background: #27ae60; }
    .editor-toolbar button.secondary { background: #95a5a6; }
    .editor-toolbar button.secondary:hover { background: #7f8c8d; }
    .preview-section { margin-top: 30px; border-top: 2px solid #e0e0e0; padding-top: 30px; }
    .preview-section h2 { margin-bottom: 20px; color: #2c3e50; }
    .preview-container { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; max-height: 600px; overflow-y: auto; }
    .preview-container iframe { width: 100%; min-height: 500px; border: none; background: white; }
    .actions { display: flex; gap: 15px; margin-top: 30px; flex-wrap: wrap; }
    .btn { padding: 14px 28px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; flex: 1; min-width: 150px; }
    .btn-primary { background: #2ecc71; color: white; }
    .btn-primary:hover { background: #27ae60; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3); }
    .btn-secondary { background: #95a5a6; color: white; }
    .btn-secondary:hover { background: #7f8c8d; }
    .status { padding: 15px; border-radius: 8px; margin-top: 20px; display: none; }
    .status.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; display: block; }
    .status.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; display: block; }
    @media (max-width: 768px) {
      .content { padding: 20px; }
      .header h1 { font-size: 1.5rem; }
      .actions { flex-direction: column; }
      .btn { width: 100%; }
      .editor-toolbar { flex-direction: column; align-items: stretch; }
      .editor-toolbar button { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Email Template Editor</h1>
      <p>Customize email templates with animal photos and personalization</p>
    </div>
    <div class="content">
      <div class="template-selector">
        <label for="templateType">Select Template Type:</label>
        <select id="templateType">
          <option value="adoption_admin">Adoption Application - Admin Notification</option>
          <option value="adoption_customer">Adoption Application - Customer Thank You</option>
          <option value="tnr_admin">TNR Request - Admin Notification</option>
          <option value="tnr_customer">TNR Request - Customer Thank You</option>
        </select>
      </div>

      <div class="template-info" id="templateInfo">
        <h3>Template Information</h3>
        <p id="templateDescription">Select a template to view details</p>
        <div class="variables" id="variablesList"></div>
      </div>

      <div class="form-group">
        <label for="subject">Email Subject:</label>
        <input type="text" id="subject" placeholder="e.g., New Adoption Application: {{applicant_name}} - {{animal_name}}">
      </div>

      <div class="form-group">
        <label for="htmlContent">Email HTML Content:</label>
        <div class="editor-toolbar">
          <button onclick="insertVariable('applicant_name')">Insert {{applicant_name}}</button>
          <button onclick="insertVariable('animal_name')">Insert {{animal_name}}</button>
          <button onclick="insertVariable('photo_gallery')">Insert {{photo_gallery}}</button>
          <button onclick="insertVariable('applicant_email')">Insert {{applicant_email}}</button>
          <button class="secondary" onclick="previewTemplate()">Preview</button>
          <button class="secondary" onclick="loadDefault()">Load Default</button>
        </div>
        <textarea id="htmlContent" placeholder="Enter HTML content here. Use {{variable_name}} for dynamic content."></textarea>
        <small style="color: #666; margin-top: 5px; display: block;">
          💡 Tip: Use {{photo_gallery}} to automatically include animal photos in the email.
        </small>
      </div>

      <div class="preview-section">
        <h2>Preview</h2>
        <div class="preview-container">
          <iframe id="previewFrame" srcdoc="<p style='padding: 20px; color: #666;'>Click 'Preview' to see your email template</p>"></iframe>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" onclick="saveTemplate()">💾 Save Template</button>
        <button class="btn btn-secondary" onclick="testEmail()">📧 Send Test Email</button>
        <button class="btn btn-secondary" onclick="resetTemplate()">🔄 Reset</button>
      </div>

      <div class="status" id="status"></div>
    </div>
  </div>

  <script>
    let currentTemplate = null;
    const baseUrl = window.location.origin;

    const templateConfigs = {
      adoption_admin: {
        name: 'Adoption Application - Admin Notification',
        description: 'Email sent to admin when someone submits an adoption application',
        variables: ['applicant_name', 'animal_name', 'applicant_email', 'applicant_phone', 'photo_gallery', 'submission_id', 'submitted_at'],
      },
      adoption_customer: {
        name: 'Adoption Application - Customer Thank You',
        description: 'Thank you email sent to customer after submitting adoption application',
        variables: ['applicant_name', 'animal_name', 'photo_gallery'],
      },
      tnr_admin: {
        name: 'TNR Request - Admin Notification',
        description: 'Email sent to admin when someone submits a TNR request',
        variables: ['requester_name', 'cat_count', 'requester_email', 'requester_phone', 'location_address'],
      },
      tnr_customer: {
        name: 'TNR Request - Customer Thank You',
        description: 'Thank you email sent to customer after submitting TNR request',
        variables: ['requester_name', 'cat_count'],
      },
    };

    document.getElementById('templateType').addEventListener('change', async function() {
      await loadTemplate(this.value);
    });

    async function loadTemplate(type) {
      try {
        const response = await fetch(\`\${baseUrl}/api/email-templates/get?type=\${type}\`);
        const data = await response.json();
        
        if (data.success) {
          currentTemplate = data.template;
          document.getElementById('subject').value = currentTemplate.subject || '';
          document.getElementById('htmlContent').value = currentTemplate.html || '';
          
          const config = templateConfigs[type];
          document.getElementById('templateDescription').textContent = config.description;
          
          const variablesList = document.getElementById('variablesList');
          variablesList.innerHTML = config.variables.map(v => 
            \`<span class="variable-tag">{{{\${v}}}}</span>\`
          ).join('');
        }
      } catch (error) {
        console.error('Error loading template:', error);
        showStatus('Error loading template', 'error');
      }
    }

    function insertVariable(variable) {
      const textarea = document.getElementById('htmlContent');
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const textAfter = textarea.value.substring(cursorPos);
      textarea.value = textBefore + \`{{{\${variable}}}}\` + textAfter;
      textarea.focus();
      textarea.setSelectionRange(cursorPos + variable.length + 4, cursorPos + variable.length + 4);
    }

    function previewTemplate() {
      const html = document.getElementById('htmlContent').value;
      let previewHTML = html
        .replace(/\\{\\{applicant_name\\}\\}/g, 'John Doe')
        .replace(/\\{\\{animal_name\\}\\}/g, 'Rolo')
        .replace(/\\{\\{applicant_email\\}\\}/g, 'john.doe@example.com')
        .replace(/\\{\\{applicant_phone\\}\\}/g, '(337) 555-1234')
        .replace(/\\{\\{photo_gallery\\}\\}/g, '<div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;"><p>📸 Photo Gallery (3 photos)</p><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;"><div style="background: #ddd; height: 150px; border-radius: 8px;"></div><div style="background: #ddd; height: 150px; border-radius: 8px;"></div><div style="background: #ddd; height: 150px; border-radius: 8px;"></div></div></div>')
        .replace(/\\{\\{requester_name\\}\\}/g, 'Jane Smith')
        .replace(/\\{\\{cat_count\\}\\}/g, '3');
      
      document.getElementById('previewFrame').srcdoc = previewHTML;
    }

    async function saveTemplate() {
      const type = document.getElementById('templateType').value;
      const subject = document.getElementById('subject').value;
      const html = document.getElementById('htmlContent').value;
      
      if (!subject || !html) {
        showStatus('Subject and HTML content are required', 'error');
        return;
      }

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
      }
    }

    async function testEmail() {
      const type = document.getElementById('templateType').value;
      const testEmail = prompt('Enter email address to send test to:', 'SouthernPetsAnimalRescue@gmail.com');
      
      if (!testEmail) return;

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
      }
    }

    function resetTemplate() {
      if (confirm('Are you sure you want to reset? All unsaved changes will be lost.')) {
        loadTemplate(document.getElementById('templateType').value);
      }
    }

    function loadDefault() {
      if (confirm('Load default template? This will replace your current content.')) {
        loadTemplate(document.getElementById('templateType').value);
        showStatus('Default template loaded', 'success');
      }
    }

    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.textContent = message;
      status.className = 'status ' + type;
      setTimeout(() => {
        status.className = 'status';
      }, 5000);
    }

    loadTemplate(document.getElementById('templateType').value);
  </script>
</body>
</html>`;
}

function generateInfoPage(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template Worker - Southern Pets Animal Rescue</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      min-height: 100vh;
      padding: 40px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 800px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #2c3e50;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }
    .endpoint {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      border-left: 4px solid #2ecc71;
    }
    .endpoint code {
      color: #2ecc71;
      font-weight: 600;
    }
    .btn {
      display: inline-block;
      background: #2ecc71;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin-top: 20px;
      transition: background 0.3s;
    }
    .btn:hover {
      background: #27ae60;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Email Template Worker</h1>
      <p>Southern Pets Animal Rescue</p>
    </div>
    <div class="content">
      <div class="section">
        <h2>🎯 Purpose</h2>
        <p>This worker handles email template management and photo gallery generation for adoption and TNR form submissions.</p>
      </div>

      <div class="section">
        <h2>🔗 Available Endpoints</h2>
        
        <div class="endpoint">
          <strong>Email Template Editor</strong><br>
          <code>GET /admin/email-templates</code><br>
          <small>Visual editor for customizing email templates</small>
        </div>

        <div class="endpoint">
          <strong>Get Template</strong><br>
          <code>GET /api/email-templates/get?type=adoption_admin</code><br>
          <small>Retrieve email template by type</small>
        </div>

        <div class="endpoint">
          <strong>Save Template</strong><br>
          <code>POST /api/email-templates/save</code><br>
          <small>Save custom email template</small>
        </div>

        <div class="endpoint">
          <strong>List Templates</strong><br>
          <code>GET /api/email-templates/list</code><br>
          <small>List all saved templates</small>
        </div>

        <div class="endpoint">
          <strong>Test Email</strong><br>
          <code>POST /api/email-templates/test</code><br>
          <small>Send test email with template</small>
        </div>

        <div class="endpoint">
          <strong>Get Animal Photos</strong><br>
          <code>GET /api/email/photos?animalId=1</code><br>
          <small>Get photos for email gallery</small>
        </div>
      </div>

      <a href="/admin/email-templates" class="btn">Open Email Template Editor</a>
    </div>
  </div>
</body>
</html>
  `;
}
