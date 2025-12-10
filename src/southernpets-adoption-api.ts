// Southern Pets Animal Rescue - Adoption & TNR Form API
// Handles form submissions, validation, and email notifications

import { getLogoUrl } from './southernpets-logo-api';

export interface AdoptionFormData {
  interested_pet?: string;
  first_name: string;
  last_name: string;
  birthday?: string;
  employer_name?: string;
  employer_phone?: string;
  applicant_phone: string;
  applicant_email: string;
  street_address: string;
  street_address_2?: string;
  city: string;
  state: string;
  zip_code: string;
  home_ownership: 'own' | 'rent';
  yard_fenced: 'yes' | 'no' | 'partial';
  pets_allowed: string;
  residence_length: string;
  animal_living_location: 'indoors' | 'outdoors' | 'both';
  move_plan: string;
  household_size: string;
  children_ages?: string;
  alone_hours: string;
  care_responsibility: string;
  household_committed: 'yes' | 'no';
  allergies: 'yes' | 'no';
  animal_role: string[];
  activity_level: 'very_active' | 'moderate' | 'low';
  potty_accidents_plan: string;
  unacceptable_behaviors: string[];
  behavior_handling: string;
  monthly_preventative_budget: string;
  annual_vet_budget: string;
  shelter_history: string;
  previous_application: 'yes' | 'no';
  previous_application_result?: string;
  previous_pets_count: string;
  lost_pet_history: string;
  current_pets: 'yes' | 'no';
  current_pets_list?: string;
  housebreaking_info?: string;
  spay_neuter_info?: string;
  vaccine_info?: string;
  pets_living_location?: 'indoors' | 'outdoors' | 'both';
  heartworm_preventative?: string;
  veterinarian_info?: string;
  signature: string;
  vaccine_initial?: string;
  reference_check_initial?: string;
  mistreatment_initial?: string;
  agreement_signature: string;
  payment_method: 'cash' | 'check' | 'venmo' | 'cashapp' | 'paypal' | 'other';
  donation_amount?: number;
  animal_id?: number;
}

export interface TNRFormData {
  requester_name: string;
  requester_email: string;
  requester_phone: string;
  location_address: string;
  location_city: string;
  location_state: string;
  location_zip: string;
  cat_description: string;
  cat_count: number;
  urgency_level: 'low' | 'medium' | 'high';
  additional_info?: string;
  preferred_contact_method: 'email' | 'phone' | 'text';
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Validate adoption form
function validateAdoptionForm(data: AdoptionFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.first_name?.trim()) errors.push('First name is required');
  if (!data.last_name?.trim()) errors.push('Last name is required');
  if (!data.applicant_phone?.trim()) errors.push('Phone number is required');
  if (!data.applicant_email?.trim()) errors.push('Email address is required');
  if (!data.street_address?.trim()) errors.push('Street address is required');
  if (!data.city?.trim()) errors.push('City is required');
  if (!data.state?.trim()) errors.push('State is required');
  if (!data.zip_code?.trim()) errors.push('Zip code is required');
  if (!data.home_ownership) errors.push('Home ownership status is required');
  if (!data.yard_fenced) errors.push('Yard fencing status is required');
  if (!data.pets_allowed?.trim()) errors.push('Pets allowed information is required');
  if (!data.residence_length?.trim()) errors.push('Residence length is required');
  if (!data.animal_living_location) errors.push('Animal living location is required');
  if (!data.move_plan?.trim()) errors.push('Move plan is required');
  if (!data.household_size?.trim()) errors.push('Household size is required');
  if (!data.alone_hours?.trim()) errors.push('Alone hours is required');
  if (!data.care_responsibility?.trim()) errors.push('Care responsibility is required');
  if (!data.household_committed) errors.push('Household commitment is required');
  if (!data.allergies) errors.push('Allergies information is required');
  if (!data.animal_role || data.animal_role.length === 0) errors.push('Animal role is required');
  if (!data.activity_level) errors.push('Activity level is required');
  if (!data.potty_accidents_plan?.trim()) errors.push('Potty accidents plan is required');
  if (!data.unacceptable_behaviors || data.unacceptable_behaviors.length === 0) errors.push('Unacceptable behaviors selection is required');
  if (!data.behavior_handling?.trim()) errors.push('Behavior handling plan is required');
  if (!data.monthly_preventative_budget?.trim()) errors.push('Monthly preventative budget is required');
  if (!data.annual_vet_budget?.trim()) errors.push('Annual vet budget is required');
  if (!data.shelter_history?.trim()) errors.push('Shelter history is required');
  if (!data.previous_application) errors.push('Previous application status is required');
  if (!data.previous_pets_count?.trim()) errors.push('Previous pets count is required');
  if (!data.lost_pet_history?.trim()) errors.push('Lost pet history is required');
  if (!data.current_pets) errors.push('Current pets status is required');
  if (!data.signature?.trim()) errors.push('Signature is required');
  if (!data.agreement_signature?.trim()) errors.push('Agreement signature is required');
  if (!data.payment_method) errors.push('Payment method is required');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.applicant_email && !emailRegex.test(data.applicant_email)) {
    errors.push('Valid email address is required');
  }

  // Phone validation (basic)
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  if (data.applicant_phone && !phoneRegex.test(data.applicant_phone.replace(/\s/g, ''))) {
    errors.push('Valid phone number is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate TNR form
function validateTNRForm(data: TNRFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.requester_name?.trim()) errors.push('Requester name is required');
  if (!data.requester_email?.trim()) errors.push('Requester email is required');
  if (!data.requester_phone?.trim()) errors.push('Requester phone is required');
  if (!data.location_address?.trim()) errors.push('Location address is required');
  if (!data.location_city?.trim()) errors.push('Location city is required');
  if (!data.location_state?.trim()) errors.push('Location state is required');
  if (!data.location_zip?.trim()) errors.push('Location zip code is required');
  if (!data.cat_description?.trim()) errors.push('Cat description is required');
  if (!data.cat_count || data.cat_count < 1) errors.push('Cat count must be at least 1');
  if (!data.urgency_level) errors.push('Urgency level is required');
  if (!data.preferred_contact_method) errors.push('Preferred contact method is required');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.requester_email && !emailRegex.test(data.requester_email)) {
    errors.push('Valid email address is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Send email via Resend
async function sendEmail(
  env: any,
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

// Generate adoption form HTML - Import from separate file
export { generateAdoptionFormHTML } from './southernpets-adoption-form-html';

// Handle adoption form submission
export async function handleAdoptionSubmit(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: AdoptionFormData = await request.json();

    // Validate form
    const validation = validateAdoptionForm(data);
    if (!validation.valid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        errors: validation.errors,
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = env.DB || env.SOUTHERNPETS_DB;
    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Get animal name if animal_id provided
    let animalName = data.interested_pet || 'Unknown';
    if (data.animal_id) {
      try {
        const animal = await db.prepare(
          'SELECT name FROM animals WHERE id = ?'
        ).bind(data.animal_id).first<{ name: string }>();
        if (animal) {
          animalName = animal.name;
        }
      } catch (error) {
        // Continue with provided name
      }
    }

    // Save to database
    const submissionId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO adoption_applications (
        id, animal_id, animal_name, first_name, last_name, email, phone,
        address, city, state, zip_code, home_ownership, yard_fenced,
        pets_allowed, residence_length, animal_living_location, move_plan,
        household_size, children_ages, alone_hours, care_responsibility,
        household_committed, allergies, animal_role, activity_level,
        potty_accidents_plan, unacceptable_behaviors, behavior_handling,
        monthly_preventative_budget, annual_vet_budget, shelter_history,
        previous_application, previous_application_result, previous_pets_count,
        lost_pet_history, current_pets, current_pets_list, housebreaking_info,
        spay_neuter_info, vaccine_info, pets_living_location, heartworm_preventative,
        veterinarian_info, signature, agreement_signature, payment_method,
        donation_amount, submitted_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      submissionId,
      data.animal_id || null,
      animalName,
      data.first_name,
      data.last_name,
      data.applicant_email,
      data.applicant_phone,
      data.street_address + (data.street_address_2 ? ' ' + data.street_address_2 : ''),
      data.city,
      data.state,
      data.zip_code,
      data.home_ownership,
      data.yard_fenced,
      data.pets_allowed,
      data.residence_length,
      data.animal_living_location,
      data.move_plan,
      data.household_size,
      data.children_ages || null,
      data.alone_hours,
      data.care_responsibility,
      data.household_committed,
      data.allergies,
      JSON.stringify(data.animal_role),
      data.activity_level,
      data.potty_accidents_plan,
      JSON.stringify(data.unacceptable_behaviors),
      data.behavior_handling,
      data.monthly_preventative_budget,
      data.annual_vet_budget,
      data.shelter_history,
      data.previous_application,
      data.previous_application_result || null,
      data.previous_pets_count,
      data.lost_pet_history,
      data.current_pets,
      data.current_pets_list || null,
      data.housebreaking_info || null,
      data.spay_neuter_info || null,
      data.vaccine_info || null,
      data.pets_living_location || null,
      data.heartworm_preventative || null,
      data.veterinarian_info || null,
      data.signature,
      data.agreement_signature,
      data.payment_method,
      data.donation_amount || 0,
      now,
      'pending'
    ).run();

    // Get animal photos for email gallery
    const { getAnimalPhotosForEmail, generatePhotoGalleryHTML } = await import('./email-template-api');
    const animalPhotos = await getAnimalPhotosForEmail(env, data.animal_id, animalName);
    const photoGalleryHTML = generatePhotoGalleryHTML(animalPhotos);

    // Generate email content with photos
    const adminEmailHTML = await generateAdminAdoptionEmail(data, animalName, submissionId, env, photoGalleryHTML);
    const customerEmailHTML = await generateCustomerThankYouEmail(data, animalName, env, photoGalleryHTML);

    // Send emails
    const adminEmailResult = await sendEmail(
      env,
      'SouthernPetsAnimalRescue@gmail.com', // Primary contact email
      `New Adoption Application: ${data.first_name} ${data.last_name} - ${animalName}`,
      adminEmailHTML,
      data.applicant_email
    );

    const customerEmailResult = await sendEmail(
      env,
      data.applicant_email,
      'Thank You for Your Adoption Application - Southern Pets Animal Rescue',
      customerEmailHTML
    );

    return new Response(JSON.stringify({
      success: true,
      submissionId,
      message: 'Application submitted successfully. You will receive a confirmation email shortly.',
      emailsSent: {
        admin: adminEmailResult.success,
        customer: customerEmailResult.success,
      },
    }), { headers: corsHeaders });
  } catch (error: any) {
    console.error('Adoption submission error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to submit application',
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Handle TNR form submission
export async function handleTNRSubmit(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TNRFormData = await request.json();

    // Validate form
    const validation = validateTNRForm(data);
    if (!validation.valid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        errors: validation.errors,
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = env.DB || env.SOUTHERNPETS_DB;
    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Save to database
    const submissionId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO tnr_requests (
        id, requester_name, requester_email, requester_phone,
        location_address, location_city, location_state, location_zip,
        cat_description, cat_count, urgency_level, additional_info,
        preferred_contact_method, submitted_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      submissionId,
      data.requester_name,
      data.requester_email,
      data.requester_phone,
      data.location_address,
      data.location_city,
      data.location_state,
      data.location_zip,
      data.cat_description,
      data.cat_count,
      data.urgency_level,
      data.additional_info || null,
      data.preferred_contact_method,
      now,
      'pending'
    ).run();

    // Get photos if available (for future use with TNR)
    const { generatePhotoGalleryHTML } = await import('./email-template-api');
    const photoGalleryHTML = ''; // TNR doesn't have specific animal photos yet

    // Generate email content
    const adminEmailHTML = await generateAdminTNREmail(data, submissionId, env, photoGalleryHTML);
    const customerEmailHTML = await generateCustomerTNRThankYouEmail(data, env, photoGalleryHTML);

    // Send emails
    const adminEmailResult = await sendEmail(
      env,
      'SouthernPetsAnimalRescue@gmail.com', // Primary contact email
      `New TNR Request: ${data.requester_name} - ${data.cat_count} cat(s)`,
      adminEmailHTML,
      data.requester_email
    );

    const customerEmailResult = await sendEmail(
      env,
      data.requester_email,
      'Thank You for Your TNR Request - Southern Pets Animal Rescue',
      customerEmailHTML
    );

    return new Response(JSON.stringify({
      success: true,
      submissionId,
      message: 'TNR request submitted successfully. We will contact you soon.',
      emailsSent: {
        admin: adminEmailResult.success,
        customer: customerEmailResult.success,
      },
    }), { headers: corsHeaders });
  } catch (error: any) {
    console.error('TNR submission error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to submit TNR request',
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Generate admin notification email for adoption
async function generateAdminAdoptionEmail(data: AdoptionFormData, animalName: string, submissionId: string, env?: any, photoGalleryHTML?: string): Promise<string> {
  // Get logo from Cloudflare Images
  const logoUrl = env ? await getLogoUrl(env) : 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/be0043cf-6599-4d18-67a7-02a7a1e49000/public';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: #2ecc71; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .logo { margin-bottom: 20px; }
    .logo img { max-width: 200px; height: auto; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #2ecc71; }
    .section h3 { margin-top: 0; color: #2c3e50; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #555; }
    .value { color: #333; margin-top: 5px; }
    .highlight { background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 14px; }
    .button { display: inline-block; background: #2ecc71; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
  </style>
</head>
<body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <img src="${logoUrl}" alt="Southern Pets Animal Rescue Logo" style="max-width: 200px; height: auto; filter: brightness(0) invert(1);">
        </div>
        <h1>🐾 New Adoption Application</h1>
        <p>Submission ID: ${submissionId}</p>
      </div>
    <div class="content">
      <div class="highlight">
        <strong>📋 Application Summary</strong><br>
        <strong>Applicant:</strong> ${data.first_name} ${data.last_name}<br>
        <strong>Pet Interested In:</strong> ${animalName}<br>
        <strong>Email:</strong> ${data.applicant_email}<br>
        <strong>Phone:</strong> ${data.applicant_phone}<br>
        <strong>Submitted:</strong> ${new Date().toLocaleString()}
      </div>

      ${photoGalleryHTML || ''}

      <div class="section">
        <h3>📍 Contact Information</h3>
        <div class="field"><span class="label">Full Name:</span><div class="value">${data.first_name} ${data.last_name}</div></div>
        <div class="field"><span class="label">Email:</span><div class="value">${data.applicant_email}</div></div>
        <div class="field"><span class="label">Phone:</span><div class="value">${data.applicant_phone}</div></div>
        ${data.birthday ? `<div class="field"><span class="label">Birthday:</span><div class="value">${data.birthday}</div></div>` : ''}
        ${data.employer_name ? `<div class="field"><span class="label">Employer:</span><div class="value">${data.employer_name}${data.employer_phone ? ' - ' + data.employer_phone : ''}</div></div>` : ''}
      </div>

      <div class="section">
        <h3>🏠 Housing Information</h3>
        <div class="field"><span class="label">Address:</span><div class="value">${data.street_address}${data.street_address_2 ? ', ' + data.street_address_2 : ''}<br>${data.city}, ${data.state} ${data.zip_code}</div></div>
        <div class="field"><span class="label">Home Ownership:</span><div class="value">${data.home_ownership === 'own' ? 'Own' : 'Rent'}</div></div>
        <div class="field"><span class="label">Yard Fenced:</span><div class="value">${data.yard_fenced === 'yes' ? 'Yes' : data.yard_fenced === 'no' ? 'No' : 'Partially'}</div></div>
        <div class="field"><span class="label">Pets Allowed:</span><div class="value">${data.pets_allowed}</div></div>
        <div class="field"><span class="label">Residence Length:</span><div class="value">${data.residence_length}</div></div>
        <div class="field"><span class="label">Animal Will Live:</span><div class="value">${data.animal_living_location === 'indoors' ? 'Indoors' : data.animal_living_location === 'outdoors' ? 'Outdoors' : 'Both'}</div></div>
        <div class="field"><span class="label">Move Plan:</span><div class="value">${data.move_plan}</div></div>
      </div>

      <div class="section">
        <h3>👨‍👩‍👧‍👦 Household Information</h3>
        <div class="field"><span class="label">Household Size:</span><div class="value">${data.household_size}</div></div>
        ${data.children_ages ? `<div class="field"><span class="label">Children Ages:</span><div class="value">${data.children_ages}</div></div>` : ''}
        <div class="field"><span class="label">Hours Alone Daily:</span><div class="value">${data.alone_hours}</div></div>
        <div class="field"><span class="label">Care Responsibility:</span><div class="value">${data.care_responsibility}</div></div>
        <div class="field"><span class="label">Household Committed:</span><div class="value">${data.household_committed === 'yes' ? 'Yes' : 'No'}</div></div>
        <div class="field"><span class="label">Allergies:</span><div class="value">${data.allergies === 'yes' ? 'Yes' : 'No'}</div></div>
        <div class="field"><span class="label">Animal Role:</span><div class="value">${data.animal_role.join(', ')}</div></div>
        <div class="field"><span class="label">Activity Level:</span><div class="value">${data.activity_level === 'very_active' ? 'Very Active' : data.activity_level === 'moderate' ? 'Moderate' : 'Low'}</div></div>
      </div>

      <div class="section">
        <h3>🐕 Pet Experience</h3>
        <div class="field"><span class="label">Previous Pets:</span><div class="value">${data.previous_pets_count}</div></div>
        <div class="field"><span class="label">Lost Pet History:</span><div class="value">${data.lost_pet_history}</div></div>
        <div class="field"><span class="label">Current Pets:</span><div class="value">${data.current_pets === 'yes' ? 'Yes' : 'No'}</div></div>
        ${data.current_pets === 'yes' && data.current_pets_list ? `<div class="field"><span class="label">Current Pets List:</span><div class="value">${data.current_pets_list}</div></div>` : ''}
        ${data.housebreaking_info ? `<div class="field"><span class="label">Housebreaking Info:</span><div class="value">${data.housebreaking_info}</div></div>` : ''}
        ${data.spay_neuter_info ? `<div class="field"><span class="label">Spay/Neuter Info:</span><div class="value">${data.spay_neuter_info}</div></div>` : ''}
        ${data.vaccine_info ? `<div class="field"><span class="label">Vaccine Info:</span><div class="value">${data.vaccine_info}</div></div>` : ''}
        ${data.veterinarian_info ? `<div class="field"><span class="label">Veterinarian:</span><div class="value">${data.veterinarian_info}</div></div>` : ''}
      </div>

      <div class="section">
        <h3>💰 Financial Information</h3>
        <div class="field"><span class="label">Monthly Preventative Budget:</span><div class="value">${data.monthly_preventative_budget}</div></div>
        <div class="field"><span class="label">Annual Vet Budget:</span><div class="value">${data.annual_vet_budget}</div></div>
        <div class="field"><span class="label">Payment Method:</span><div class="value">${data.payment_method.charAt(0).toUpperCase() + data.payment_method.slice(1)}</div></div>
        ${data.donation_amount && data.donation_amount > 0 ? `<div class="field"><span class="label">Additional Donation:</span><div class="value">$${data.donation_amount.toFixed(2)}</div></div>` : ''}
      </div>

      <div class="section">
        <h3>📝 Application Details</h3>
        <div class="field"><span class="label">Potty Accidents Plan:</span><div class="value">${data.potty_accidents_plan}</div></div>
        <div class="field"><span class="label">Unacceptable Behaviors:</span><div class="value">${data.unacceptable_behaviors.join(', ') || 'None'}</div></div>
        <div class="field"><span class="label">Behavior Handling:</span><div class="value">${data.behavior_handling}</div></div>
        <div class="field"><span class="label">Shelter History:</span><div class="value">${data.shelter_history}</div></div>
        <div class="field"><span class="label">Previous Application:</span><div class="value">${data.previous_application === 'yes' ? 'Yes' : 'No'}${data.previous_application_result ? ' - ' + data.previous_application_result : ''}</div></div>
      </div>

      <div class="highlight">
        <strong>✍️ Signatures</strong><br>
        Applicant Signature: ${data.signature}<br>
        Agreement Signature: ${data.agreement_signature}
      </div>

      <div class="footer">
        <p><strong>Southern Pets Animal Rescue</strong></p>
        <p>This is an automated notification. Please review the application and contact the applicant.</p>
        <p>Reply to this email to contact: ${data.applicant_email}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">Submission ID: ${submissionId}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate customer thank you email for adoption
async function generateCustomerThankYouEmail(data: AdoptionFormData, animalName: string, env?: any, photoGalleryHTML?: string): Promise<string> {
  // Get logo from Cloudflare Images
  const logoUrl = env ? await getLogoUrl(env) : 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/be0043cf-6599-4d18-67a7-02a7a1e49000/public';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white; padding: 40px 20px; text-align: center; }
    .logo { margin-bottom: 20px; }
    .logo img { max-width: 180px; height: auto; filter: brightness(0) invert(1); }
    .content { padding: 40px 20px; }
    .message { background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #2ecc71; }
    .next-steps { background: #e8f5e9; padding: 25px; border-radius: 8px; margin: 30px 0; }
    .next-steps h3 { margin-top: 0; color: #2c3e50; }
    .next-steps ul { margin: 15px 0; padding-left: 20px; }
    .next-steps li { margin: 10px 0; }
    .footer { background: #1a1a1a; color: #ccc; padding: 30px 20px; text-align: center; }
    .footer a { color: #2ecc71; text-decoration: none; }
    .button { display: inline-block; background: #2ecc71; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="${logoUrl}" alt="Southern Pets Animal Rescue Logo">
      </div>
      <h1>🐾 Thank You for Your Application!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.95;">Southern Pets Animal Rescue</p>
    </div>
    <div class="content">
      <div class="message">
        <p style="font-size: 18px; margin: 0 0 15px 0;"><strong>Dear ${data.first_name},</strong></p>
        <p style="margin: 0 0 15px 0;">Thank you for your interest in adopting <strong>${animalName}</strong> from Southern Pets Animal Rescue!</p>
        <p style="margin: 0;">We have received your adoption application and are excited to help you find your perfect companion. Our team will review your application and contact you within 2-3 business days.</p>
      </div>

      ${photoGalleryHTML || ''}

      <div class="next-steps">
        <h3>📋 What Happens Next?</h3>
        <ul>
          <li><strong>Application Review:</strong> Our team will carefully review your application (typically 1-2 business days)</li>
          <li><strong>Reference Checks:</strong> We may contact your veterinarian, landlord, or other references</li>
          <li><strong>Home Visit:</strong> A representative may schedule a virtual or in-person home visit</li>
          <li><strong>Approval Notification:</strong> You'll receive an email or phone call once your application is approved</li>
          <li><strong>Meet & Greet:</strong> If approved, we'll schedule a time for you to meet ${animalName}</li>
        </ul>
      </div>

      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 30px 0;">
        <p style="margin: 0; color: #856404;"><strong>💡 Important Reminders:</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404;">
          <li>Adoption fee: <strong>$${animalName.toLowerCase().includes('dog') ? '250' : '150'}</strong> (due upon approval)</li>
          <li>Payment methods: Cash, Check, Venmo, CashApp, or PayPal</li>
          <li>All animals must be spayed/neutered by 6 months of age</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <p style="margin: 0 0 15px 0;"><strong>Questions?</strong></p>
        <p style="margin: 0;">Email: <a href="mailto:SouthernPetsAnimalRescue@gmail.com">SouthernPetsAnimalRescue@gmail.com</a></p>
        <p style="margin: 10px 0;">Phone: <a href="tel:3375817562">337-581-7562</a></p>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>Southern Pets Animal Rescue</strong></p>
      <p style="margin: 0; font-size: 14px;">501(c)(3) established in 2025</p>
      <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">Acadia Parish, Louisiana</p>
      <p style="margin: 20px 0 0 0; font-size: 12px;">
        <a href="https://southernpetsanimalrescue.com">Visit Our Website</a> | 
        <a href="https://southernpetsanimalrescue.com/adopt">View Available Pets</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate admin notification email for TNR
async function generateAdminTNREmail(data: TNRFormData, submissionId: string, env?: any, photoGalleryHTML?: string): Promise<string> {
  // Get logo from Cloudflare Images
  const logoUrl = env ? await getLogoUrl(env) : 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/be0043cf-6599-4d18-67a7-02a7a1e49000/public';
  const urgencyColors: Record<string, string> = {
    low: '#28a745',
    medium: '#ffc107',
    high: '#dc3545'
  };

  const urgencyLabels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: #3498db; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .logo { margin-bottom: 20px; }
    .logo img { max-width: 200px; height: auto; filter: brightness(0) invert(1); }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #3498db; }
    .section h3 { margin-top: 0; color: #2c3e50; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #555; }
    .value { color: #333; margin-top: 5px; }
    .urgency { display: inline-block; padding: 8px 16px; border-radius: 6px; color: white; font-weight: 600; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <img src="${logoUrl}" alt="Southern Pets Animal Rescue Logo" style="max-width: 200px; height: auto; filter: brightness(0) invert(1);">
        </div>
        <h1>🐱 New TNR Request</h1>
        <p>Submission ID: ${submissionId}</p>
      </div>
    <div class="content">
      <div class="section">
        <h3>👤 Requester Information</h3>
        <div class="field"><span class="label">Name:</span><div class="value">${data.requester_name}</div></div>
        <div class="field"><span class="label">Email:</span><div class="value">${data.requester_email}</div></div>
        <div class="field"><span class="label">Phone:</span><div class="value">${data.requester_phone}</div></div>
        <div class="field"><span class="label">Preferred Contact:</span><div class="value">${data.preferred_contact_method === 'email' ? 'Email' : data.preferred_contact_method === 'phone' ? 'Phone' : 'Text'}</div></div>
      </div>

      <div class="section">
        <h3>📍 Location Information</h3>
        <div class="field"><span class="label">Address:</span><div class="value">${data.location_address}<br>${data.location_city}, ${data.location_state} ${data.location_zip}</div></div>
      </div>

      <div class="section">
        <h3>🐱 Cat Information</h3>
        <div class="field"><span class="label">Number of Cats:</span><div class="value"><strong>${data.cat_count}</strong></div></div>
        <div class="field"><span class="label">Description:</span><div class="value">${data.cat_description}</div></div>
        <div class="field"><span class="label">Urgency Level:</span><div class="value"><span class="urgency" style="background: ${urgencyColors[data.urgency_level]}">${urgencyLabels[data.urgency_level]}</span></div></div>
        ${data.additional_info ? `<div class="field"><span class="label">Additional Information:</span><div class="value">${data.additional_info}</div></div>` : ''}
      </div>

      ${photoGalleryHTML || ''}

      <div class="footer">
        <p><strong>Southern Pets Animal Rescue</strong></p>
        <p>This is an automated notification. Please review the TNR request and contact the requester.</p>
        <p>Reply to this email to contact: ${data.requester_email}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">Submission ID: ${submissionId}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate customer thank you email for TNR
async function generateCustomerTNRThankYouEmail(data: TNRFormData, env?: any, photoGalleryHTML?: string): Promise<string> {
  // Get logo from Cloudflare Images
  const logoUrl = env ? await getLogoUrl(env) : 'https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/be0043cf-6599-4d18-67a7-02a7a1e49000/public';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 40px 20px; text-align: center; }
    .logo { margin-bottom: 20px; }
    .logo img { max-width: 180px; height: auto; filter: brightness(0) invert(1); }
    .content { padding: 40px 20px; }
    .message { background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #3498db; }
    .next-steps { background: #e8f4fd; padding: 25px; border-radius: 8px; margin: 30px 0; }
    .next-steps h3 { margin-top: 0; color: #2c3e50; }
    .next-steps ul { margin: 15px 0; padding-left: 20px; }
    .next-steps li { margin: 10px 0; }
    .footer { background: #1a1a1a; color: #ccc; padding: 30px 20px; text-align: center; }
    .footer a { color: #3498db; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="${logoUrl}" alt="Southern Pets Animal Rescue Logo">
      </div>
      <h1>🐱 Thank You for Your TNR Request!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.95;">Southern Pets Animal Rescue</p>
    </div>
    <div class="content">
      <div class="message">
        <p style="font-size: 18px; margin: 0 0 15px 0;"><strong>Dear ${data.requester_name},</strong></p>
        <p style="margin: 0 0 15px 0;">Thank you for reaching out to Southern Pets Animal Rescue regarding TNR (Trap-Neuter-Return) services for ${data.cat_count} cat(s) in your area.</p>
        <p style="margin: 0;">We have received your request and will review it as soon as possible. Our team will contact you within 2-3 business days to discuss next steps and schedule the TNR service.</p>
      </div>

      ${photoGalleryHTML || ''}

      <div class="next-steps">
        <h3>📋 What Happens Next?</h3>
        <ul>
          <li><strong>Request Review:</strong> Our team will review your TNR request (typically 1-2 business days)</li>
          <li><strong>Contact:</strong> We'll reach out via your preferred method (${data.preferred_contact_method === 'email' ? 'Email' : data.preferred_contact_method === 'phone' ? 'Phone' : 'Text'})</li>
          <li><strong>Scheduling:</strong> We'll work with you to schedule a convenient time for the TNR service</li>
          <li><strong>TNR Service:</strong> Our team will trap, neuter/spay, and return the cats to their location</li>
        </ul>
      </div>

      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 30px 0;">
        <p style="margin: 0; color: #856404;"><strong>💡 About TNR Services:</strong></p>
        <p style="margin: 10px 0 0 0; color: #856404;">TNR (Trap-Neuter-Return) helps control the feral cat population humanely. Cats are trapped, spayed/neutered, vaccinated, and returned to their original location. This prevents overpopulation while keeping cat families together.</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <p style="margin: 0 0 15px 0;"><strong>Questions?</strong></p>
        <p style="margin: 0;">Email: <a href="mailto:SouthernPetsAnimalRescue@gmail.com">SouthernPetsAnimalRescue@gmail.com</a></p>
        <p style="margin: 10px 0;">Phone: <a href="tel:3375817562">337-581-7562</a></p>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>Southern Pets Animal Rescue</strong></p>
      <p style="margin: 0; font-size: 14px;">501(c)(3) established in 2025</p>
      <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">Acadia Parish, Louisiana</p>
      <p style="margin: 20px 0 0 0; font-size: 12px;">
        <a href="https://southernpetsanimalrescue.com">Visit Our Website</a> | 
        <a href="https://southernpetsanimalrescue.com/services">Learn About Our Services</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
