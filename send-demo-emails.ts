// Demo Email Script for Southern Pets Animal Rescue
// Sends demo adoption and TNR emails to test the system

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_MdbxGJrF_4q6USkGYqgYrttu7RMM3k5P9';
const ADMIN_EMAIL = 'SouthernPetsAnimalRescue@gmail.com';
const DEMO_EMAIL = 'Ambeker1988@gmail.com'; // Amber's email for demo

const logoUrl = 'https://static.wixstatic.com/media/33e096_671c6a950ec34c81b4e787ad92066c26~mv2.png';

// Demo Adoption Email
const demoAdoptionEmail = {
  from: 'Southern Pets Animal Rescue <info@southernpetsanimalrescue.com>',
  to: [ADMIN_EMAIL, DEMO_EMAIL],
  subject: 'Demo: New Adoption Application - John Doe - Rolo',
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: #2ecc71; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .logo { margin-bottom: 20px; }
    .logo img { max-width: 200px; height: auto; filter: brightness(0) invert(1); }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #2ecc71; }
    .section h3 { margin-top: 0; color: #2c3e50; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #555; }
    .value { color: #333; margin-top: 5px; }
    .highlight { background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="${logoUrl}" alt="Southern Pets Animal Rescue Logo">
      </div>
      <h1>🐾 New Adoption Application</h1>
      <p>Submission ID: DEMO-2025-12-08-001</p>
    </div>
    <div class="content">
      <div class="highlight">
        <strong>📋 Application Summary</strong><br>
        <strong>Applicant:</strong> John Doe<br>
        <strong>Pet Interested In:</strong> Rolo<br>
        <strong>Email:</strong> john.doe@example.com<br>
        <strong>Phone:</strong> (337) 555-1234<br>
        <strong>Submitted:</strong> ${new Date().toLocaleString()}
      </div>

      <div class="section">
        <h3>📍 Contact Information</h3>
        <div class="field"><span class="label">Full Name:</span><div class="value">John Doe</div></div>
        <div class="field"><span class="label">Email:</span><div class="value">john.doe@example.com</div></div>
        <div class="field"><span class="label">Phone:</span><div class="value">(337) 555-1234</div></div>
        <div class="field"><span class="label">Address:</span><div class="value">123 Main St<br>Crowley, Louisiana 70526</div></div>
      </div>

      <div class="section">
        <h3>🏠 Housing Information</h3>
        <div class="field"><span class="label">Home Ownership:</span><div class="value">Own</div></div>
        <div class="field"><span class="label">Yard Fenced:</span><div class="value">Yes</div></div>
        <div class="field"><span class="label">Pets Allowed:</span><div class="value">Yes, pets are allowed</div></div>
        <div class="field"><span class="label">Animal Will Live:</span><div class="value">Indoors</div></div>
      </div>

      <div class="section">
        <h3>👨‍👩‍👧‍👦 Household Information</h3>
        <div class="field"><span class="label">Household Size:</span><div class="value">2 adults</div></div>
        <div class="field"><span class="label">Hours Alone Daily:</span><div class="value">4 hours</div></div>
        <div class="field"><span class="label">Care Responsibility:</span><div class="value">I will be primarily responsible</div></div>
        <div class="field"><span class="label">Household Committed:</span><div class="value">Yes</div></div>
        <div class="field"><span class="label">Allergies:</span><div class="value">No</div></div>
        <div class="field"><span class="label">Animal Role:</span><div class="value">Companion</div></div>
        <div class="field"><span class="label">Activity Level:</span><div class="value">Moderate</div></div>
      </div>

      <div class="section">
        <h3>🐕 Pet Experience</h3>
        <div class="field"><span class="label">Previous Pets:</span><div class="value">2 dogs, 1 cat</div></div>
        <div class="field"><span class="label">Current Pets:</span><div class="value">Yes</div></div>
        <div class="field"><span class="label">Current Pets List:</span><div class="value">Golden Retriever, 5 years old, Male</div></div>
      </div>

      <div class="section">
        <h3>💰 Financial Information</h3>
        <div class="field"><span class="label">Monthly Preventative Budget:</span><div class="value">$50</div></div>
        <div class="field"><span class="label">Annual Vet Budget:</span><div class="value">$500</div></div>
        <div class="field"><span class="label">Payment Method:</span><div class="value">Venmo</div></div>
      </div>

      <div class="highlight">
        <strong>✍️ Signatures</strong><br>
        Applicant Signature: John Doe<br>
        Agreement Signature: John Doe
      </div>

      <div class="footer">
        <p><strong>Southern Pets Animal Rescue</strong></p>
        <p>This is a DEMO email to test the email notification system.</p>
        <p>Reply to this email to contact: john.doe@example.com</p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">Submission ID: DEMO-2025-12-08-001</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
};

// Demo TNR Email
const demoTNREmail = {
  from: 'Southern Pets Animal Rescue <info@southernpetsanimalrescue.com>',
  to: [ADMIN_EMAIL, DEMO_EMAIL],
  subject: 'Demo: New TNR Request - Jane Smith - 3 cat(s)',
  html: `
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
    .urgency { display: inline-block; padding: 8px 16px; border-radius: 6px; color: white; font-weight: 600; background: #ffc107; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="${logoUrl}" alt="Southern Pets Animal Rescue Logo">
      </div>
      <h1>🐱 New TNR Request</h1>
      <p>Submission ID: DEMO-TNR-2025-12-08-001</p>
    </div>
    <div class="content">
      <div class="section">
        <h3>👤 Requester Information</h3>
        <div class="field"><span class="label">Name:</span><div class="value">Jane Smith</div></div>
        <div class="field"><span class="label">Email:</span><div class="value">jane.smith@example.com</div></div>
        <div class="field"><span class="label">Phone:</span><div class="value">(337) 555-5678</div></div>
        <div class="field"><span class="label">Preferred Contact:</span><div class="value">Email</div></div>
      </div>

      <div class="section">
        <h3>📍 Location Information</h3>
        <div class="field"><span class="label">Address:</span><div class="value">456 Oak Avenue<br>Rayne, Louisiana 70578</div></div>
      </div>

      <div class="section">
        <h3>🐱 Cat Information</h3>
        <div class="field"><span class="label">Number of Cats:</span><div class="value"><strong>3</strong></div></div>
        <div class="field"><span class="label">Description:</span><div class="value">3 feral cats, 2 adults and 1 kitten, seen in backyard</div></div>
        <div class="field"><span class="label">Urgency Level:</span><div class="value"><span class="urgency">Medium</span></div></div>
        <div class="field"><span class="label">Additional Information:</span><div class="value">Cats appear healthy, been feeding them for 2 weeks</div></div>
      </div>

      <div class="footer">
        <p><strong>Southern Pets Animal Rescue</strong></p>
        <p>This is a DEMO email to test the TNR notification system.</p>
        <p>Reply to this email to contact: jane.smith@example.com</p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">Submission ID: DEMO-TNR-2025-12-08-001</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
};

// Customer Thank You Email (Adoption)
const customerThankYouAdoption = {
  from: 'Southern Pets Animal Rescue <info@southernpetsanimalrescue.com>',
  to: DEMO_EMAIL,
  subject: 'Thank You for Your Adoption Application - Southern Pets Animal Rescue',
  html: `
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
        <p style="font-size: 18px; margin: 0 0 15px 0;"><strong>Dear John,</strong></p>
        <p style="margin: 0 0 15px 0;">Thank you for your interest in adopting <strong>Rolo</strong> from Southern Pets Animal Rescue!</p>
        <p style="margin: 0;">We have received your adoption application and are excited to help you find your perfect companion. Our team will review your application and contact you within 2-3 business days.</p>
      </div>

      <div class="next-steps">
        <h3>📋 What Happens Next?</h3>
        <ul>
          <li><strong>Application Review:</strong> Our team will carefully review your application (typically 1-2 business days)</li>
          <li><strong>Reference Checks:</strong> We may contact your veterinarian, landlord, or other references</li>
          <li><strong>Home Visit:</strong> A representative may schedule a virtual or in-person home visit</li>
          <li><strong>Approval Notification:</strong> You'll receive an email or phone call once your application is approved</li>
          <li><strong>Meet & Greet:</strong> If approved, we'll schedule a time for you to meet Rolo</li>
        </ul>
      </div>

      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 30px 0;">
        <p style="margin: 0; color: #856404;"><strong>💡 Important Reminders:</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404;">
          <li>Adoption fee: <strong>$250</strong> (due upon approval)</li>
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
  `
};

// Send emails
async function sendDemoEmails() {
  try {
    console.log('Sending demo emails...\n');

    // Send adoption admin email
    const adoptionResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demoAdoptionEmail),
    });
    const adoptionResult = await adoptionResponse.json();
    console.log('✅ Demo Adoption Admin Email:', adoptionResult.id || adoptionResult);

    // Send TNR admin email
    const tnrResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demoTNREmail),
    });
    const tnrResult = await tnrResponse.json();
    console.log('✅ Demo TNR Admin Email:', tnrResult.id || tnrResult);

    // Send customer thank you email
    const thankYouResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerThankYouAdoption),
    });
    const thankYouResult = await thankYouResponse.json();
    console.log('✅ Demo Customer Thank You Email:', thankYouResult.id || thankYouResult);

    console.log('\n🎉 All demo emails sent successfully!');
    console.log('Check your inbox at:', ADMIN_EMAIL);
    console.log('Check demo inbox at:', DEMO_EMAIL);
  } catch (error: any) {
    console.error('❌ Error sending emails:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  sendDemoEmails();
}

export { sendDemoEmails };
