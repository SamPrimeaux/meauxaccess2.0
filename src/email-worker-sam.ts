/**
 * Email Worker for sam@inneranimalmedia.com
 * 
 * Features:
 * - Email archiving to R2
 * - Smart filtering and categorization
 * - Auto-replies for specific senders
 * - Important email notifications
 * - Dashboard integration
 */

export interface Env {
  EMAIL_ARCHIVE?: R2Bucket; // R2 bucket for email archiving
  KV_EMAIL_LOGS?: KVNamespace; // KV for email logs
  RESEND_API_KEY?: string; // For sending notifications
}

export default {
  async email(message: EmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    try {
      // Get email details
      const from = message.from;
      const to = message.to;
      const subject = message.headers.get('subject') || 'No Subject';
      const date = message.headers.get('date') || new Date().toISOString();

      // Get email content
      const text = await message.text();
      const html = await message.html();

      // Email metadata
      const emailData = {
        id: crypto.randomUUID(),
        from,
        to,
        subject,
        date,
        timestamp: new Date().toISOString(),
        textLength: text.length,
        htmlLength: html?.length || 0,
        hasAttachments: false, // Email Workers don't expose attachments directly
      };

      // 1. Archive to R2 (if configured)
      if (env.EMAIL_ARCHIVE) {
        const emailContent = {
          ...emailData,
          text,
          html,
          headers: Object.fromEntries(message.headers.entries()),
        };

        await env.EMAIL_ARCHIVE.put(
          `emails/${Date.now()}-${emailData.id}.json`,
          JSON.stringify(emailContent, null, 2),
          {
            httpMetadata: {
              contentType: 'application/json',
            },
            customMetadata: {
              from: from,
              to: to,
              subject: subject,
              date: date,
            },
          }
        );
      }

      // 2. Log to KV (if configured)
      if (env.KV_EMAIL_LOGS) {
        await env.KV_EMAIL_LOGS.put(
          `email:${Date.now()}`,
          JSON.stringify(emailData),
          { expirationTtl: 60 * 60 * 24 * 90 } // 90 days
        );

        // Update email count
        const count = await env.KV_EMAIL_LOGS.get('email:count') || '0';
        await env.KV_EMAIL_LOGS.put('email:count', String(parseInt(count) + 1));
      }

      // 3. Smart filtering and categorization
      const isImportant = checkIfImportant(subject, from, text);
      const category = categorizeEmail(subject, from, text);

      // 4. Auto-reply for specific senders
      if (shouldAutoReply(from, subject)) {
        await message.reply({
          subject: 'Re: ' + subject,
          text: generateAutoReply(subject, from),
        });
      }

      // 5. Forward important emails to backup address
      if (isImportant && to === 'sam@inneranimalmedia.com') {
        // Forward to backup email (optional)
        // await message.forward(['backup@example.com']);
      }

      // 6. Send notification for important emails (optional)
      if (isImportant && env.RESEND_API_KEY) {
        await sendImportantEmailNotification(env, emailData);
      }

      // 7. Forward email to destination after processing
      // This ensures emails still reach your inbox
      await message.forward(['meauxbility@gmail.com']);

    } catch (error) {
      console.error('Error processing email:', error);
      // Still try to forward even if processing fails
      try {
        await message.forward(['meauxbility@gmail.com']);
      } catch (forwardError) {
        console.error('Error forwarding email:', forwardError);
      }
    }
  },
};

/**
 * Check if email is important
 */
function checkIfImportant(subject: string, from: string, text: string): boolean {
  const importantKeywords = [
    'URGENT', 'IMPORTANT', 'ASAP', 'CRITICAL',
    'CONTRACT', 'INVOICE', 'PAYMENT', 'LEGAL',
    'DEADLINE', 'MEETING', 'CALL',
  ];

  const subjectUpper = subject.toUpperCase();
  const textUpper = text.toUpperCase();

  return importantKeywords.some(keyword =>
    subjectUpper.includes(keyword) || textUpper.includes(keyword)
  );
}

/**
 * Categorize email
 */
function categorizeEmail(subject: string, from: string, text: string): string {
  const categories = {
    'spam': ['viagra', 'casino', 'lottery', 'winner'],
    'business': ['contract', 'invoice', 'payment', 'proposal'],
    'support': ['help', 'support', 'issue', 'problem'],
    'newsletter': ['newsletter', 'unsubscribe', 'subscribe'],
    'notification': ['notification', 'alert', 'reminder'],
  };

  const content = (subject + ' ' + text).toLowerCase();

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }

  return 'general';
}

/**
 * Check if email should get auto-reply
 */
function shouldAutoReply(from: string, subject: string): boolean {
  // Auto-reply to noreply addresses
  if (from.includes('noreply') || from.includes('no-reply') || from.includes('donotreply')) {
    return false; // Don't auto-reply to noreply addresses
  }

  // Auto-reply to specific senders (optional)
  const autoReplySenders = [
    'info@',
    'contact@',
    'hello@',
  ];

  return autoReplySenders.some(sender => from.toLowerCase().includes(sender));
}

/**
 * Generate auto-reply message
 */
function generateAutoReply(subject: string, from: string): string {
  return `Thank you for your email regarding "${subject}".

I have received your message and will respond as soon as possible.

For urgent matters, please call or text me directly.

Best regards,
Sam Primeaux
Inner Animal Media
sam@inneranimalmedia.com`;
}

/**
 * Send notification for important emails
 */
async function sendImportantEmailNotification(env: Env, emailData: any): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Inner Animal Media <noreply@inneranimalmedia.com>',
        to: 'meauxbility@gmail.com',
        subject: `🔔 Important Email: ${emailData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Important Email Received</h2>
            <p><strong>From:</strong> ${emailData.from}</p>
            <p><strong>Subject:</strong> ${emailData.subject}</p>
            <p><strong>Date:</strong> ${emailData.date}</p>
            <p style="margin-top: 20px;">
              <a href="https://inneranimalmedia.com/dashboard" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                View Dashboard
              </a>
            </p>
          </div>
        `,
      }),
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
