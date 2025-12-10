/**
 * Team Management System
 * Handles user authentication, team members, and notifications
 */

export interface TeamMember {
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'member';
  createdAt: string;
  lastActive?: string;
  sshAccess: boolean;
  sshKey?: string; // Encrypted SSH key
}

export interface Notification {
  id: string;
  type: 'welcome' | 'feature' | 'alert' | 'update';
  title: string;
  message: string;
  recipient: string;
  createdAt: string;
  read: boolean;
}

// Initialize team members
export const INITIAL_TEAM: TeamMember[] = [
  {
    email: 'sam@meauxbility.org',
    name: 'Sam Primeaux',
    role: 'admin',
    createdAt: new Date().toISOString(),
    sshAccess: true,
  },
  {
    email: 'connor@meauxbility.org',
    name: 'Connor',
    role: 'developer',
    createdAt: new Date().toISOString(),
    sshAccess: true,
  },
  {
    email: 'fred@meauxbility.org',
    name: 'Fred',
    role: 'developer',
    createdAt: new Date().toISOString(),
    sshAccess: true,
  },
  {
    email: 'amber@meauxbility.org',
    name: 'Amber',
    role: 'developer',
    createdAt: new Date().toISOString(),
    sshAccess: true,
  },
  {
    email: 'info@inneranimals.com',
    name: 'Inner Animals Info',
    role: 'admin',
    createdAt: new Date().toISOString(),
    sshAccess: true,
  },
  {
    email: 'meauxbility@gmail.com',
    name: 'Meauxbility Gmail',
    role: 'admin',
    createdAt: new Date().toISOString(),
    sshAccess: true,
  },
];

// Get team member by email
export async function getTeamMember(env: Env, email: string): Promise<TeamMember | null> {
  if (!env.KV_USERS) return null;
  const data = await env.KV_USERS.get(`user:${email}`);
  return data ? JSON.parse(data) : null;
}

// Save team member
export async function saveTeamMember(env: Env, member: TeamMember): Promise<void> {
  if (!env.KV_USERS) return;
  await env.KV_USERS.put(`user:${member.email}`, JSON.stringify(member));
}

// Get all team members
export async function getAllTeamMembers(env: Env): Promise<TeamMember[]> {
  if (!env.KV_USERS) return INITIAL_TEAM;

  // Try to get from KV, fallback to initial team
  const members: TeamMember[] = [];
  for (const member of INITIAL_TEAM) {
    const stored = await getTeamMember(env, member.email);
    if (stored) {
      members.push(stored);
    } else {
      // Initialize new member
      await saveTeamMember(env, member);
      members.push(member);
    }
  }
  return members;
}

// Send notification
export async function sendNotification(
  env: Env,
  notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
): Promise<void> {
  const fullNotification: Notification = {
    ...notification,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  // Store in KV
  if (env.KV_NOTIFICATIONS) {
    await env.KV_NOTIFICATIONS.put(
      `notification:${fullNotification.id}`,
      JSON.stringify(fullNotification)
    );
  }

  // Send email if Resend API key is configured
  if (env.RESEND_API_KEY && notification.recipient) {
    await sendEmailNotification(env, fullNotification);
  }
}

// Send email notification via Resend
async function sendEmailNotification(env: Env, notification: Notification): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Inner Animal Media <noreply@inneranimalmedia.com>',
        to: notification.recipient,
        subject: notification.title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0EA5E9;">${notification.title}</h2>
            <p>${notification.message}</p>
            <p style="margin-top: 30px;">
              <a href="https://inneranimalmedia.com" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Open Dashboard
              </a>
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px;">
              This is an automated notification from Inner Animal Media Platform
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send email:', await response.text());
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// Send welcome notifications to all team members
export async function notifyTeamOfNewFeatures(env: Env): Promise<void> {
  const members = await getAllTeamMembers(env);

  for (const member of members) {
    await sendNotification(env, {
      type: 'welcome',
      title: 'Welcome to MeauxMCP Dashboard! ??',
      message: `
        Hi ${member.name},
        
        You now have access to the MeauxMCP Dashboard with:
        � Secure SSH access for running dev projects
        � R2 Storage management (${await getR2BucketCount(env)} buckets)
        � D1 Database query interface
        � KV Namespace management
        � Cloudflare Workers monitoring
        
        Access your dashboard: https://inneranimalmedia.com
        
        Your role: ${member.role}
        SSH Access: ${member.sshAccess ? 'Enabled' : 'Disabled'}
      `,
      recipient: member.email,
    });
  }
}

// Helper to get R2 bucket count
async function getR2BucketCount(env: any): Promise<number> {
  // This would be implemented based on your bucket detection logic
  return 13; // Approximate count
}

// Type definition for Env
interface Env {
  KV_USERS?: KVNamespace;
  KV_NOTIFICATIONS?: KVNamespace;
  RESEND_API_KEY?: string;
}
