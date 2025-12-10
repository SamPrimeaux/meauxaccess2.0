// R2 Organization Script for Southern Pets Animal Rescue
// Organizes existing content and prepares for bucket lock

export interface R2OrganizationPlan {
  bucket: string;
  structure: {
    assets: string[];
    images: string[];
    code: string[];
    documents: string[];
  };
}

const ORGANIZATION_PLAN: R2OrganizationPlan = {
  bucket: 'southernpetsanimalrescue',
  structure: {
    assets: [
      'assets/logo/southernpets-logo.png',
      'assets/icons/',
      'assets/graphics/',
    ],
    images: [
      'images/animals/dogs/',
      'images/animals/cats/',
      'images/gallery/',
      'images/thumbnails/',
    ],
    code: [
      'code/html/pages/',
      'code/html/components/',
      'code/html/templates/',
      'code/backups/',
    ],
    documents: [
      'documents/adoption-forms/',
      'documents/tnr-forms/',
    ],
  },
};

// Organize R2 bucket content
export async function organizeR2Bucket(env: any): Promise<{
  success: boolean;
  organized: number;
  errors: string[];
}> {
  const bucket = env.R2_SOUTHERNPETS;
  if (!bucket) {
    return {
      success: false,
      organized: 0,
      errors: ['R2_SOUTHERNPETS bucket not configured'],
    };
  }

  const errors: string[] = [];
  let organized = 0;

  try {
    // List all objects in bucket
    const objects = await bucket.list();

    // Organize by type
    for (const obj of objects.objects) {
      const key = obj.key;

      // Skip if already organized
      if (key.startsWith('assets/') || key.startsWith('images/') || key.startsWith('code/') || key.startsWith('documents/')) {
        continue;
      }

      try {
        // Determine new location based on file type and name
        let newKey = key;

        // Logo files
        if (key.includes('logo') || key.includes('Logo')) {
          newKey = `assets/logo/${key.split('/').pop() || 'logo.png'}`;
        }
        // Animal images
        else if (key.includes('animal') || key.includes('dog') || key.includes('cat')) {
          const species = key.includes('dog') ? 'dogs' : 'cats';
          newKey = `images/animals/${species}/${key.split('/').pop() || key}`;
        }
        // Gallery images
        else if (key.includes('image') || key.includes('photo') || key.includes('gallery')) {
          newKey = `images/gallery/${key.split('/').pop() || key}`;
        }
        // HTML/Code files
        else if (key.match(/\.(html|htm)$/i) || key.includes('html') || key.includes('template')) {
          if (key.includes('page') || key.includes('Page')) {
            newKey = `code/html/pages/${key.split('/').pop() || key}`;
          } else if (key.includes('component') || key.includes('Component')) {
            newKey = `code/html/components/${key.split('/').pop() || key}`;
          } else {
            newKey = `code/html/${key.split('/').pop() || key}`;
          }
        }
        // Documents
        else if (key.includes('form') || key.includes('document') || key.includes('pdf')) {
          const type = key.includes('adoption') ? 'adoption-forms' : 'tnr-forms';
          newKey = `documents/${type}/${key.split('/').pop() || key}`;
        }
        // Default to images/gallery
        else if (key.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          newKey = `images/gallery/${key.split('/').pop() || key}`;
        }

        // Only move if location changed
        if (newKey !== key) {
          // Get object
          const object = await bucket.get(key);
          if (object) {
            // Copy to new location
            await bucket.put(newKey, object.body, {
              httpMetadata: object.httpMetadata,
              customMetadata: {
                ...object.customMetadata,
                originalKey: key,
                organizedAt: new Date().toISOString(),
              },
            });

            // Delete old location (optional - comment out for safety)
            // await bucket.delete(key);

            organized++;
          }
        }
      } catch (error: any) {
        errors.push(`Failed to organize ${key}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      organized,
      errors,
    };
  } catch (error: any) {
    return {
      success: false,
      organized,
      errors: [error.message],
    };
  }
}

// Validate bucket structure
export async function validateBucketStructure(env: any): Promise<{
  valid: boolean;
  issues: string[];
  structure: Record<string, number>;
}> {
  const bucket = env.R2_SOUTHERNPETS;
  if (!bucket) {
    return {
      valid: false,
      issues: ['R2_SOUTHERNPETS bucket not configured'],
      structure: {},
    };
  }

  const issues: string[] = [];
  const structure: Record<string, number> = {
    assets: 0,
    'images/animals': 0,
    'images/gallery': 0,
    'code/html': 0,
    documents: 0,
    other: 0,
  };

  try {
    const objects = await bucket.list();

    for (const obj of objects.objects) {
      const key = obj.key;

      if (key.startsWith('assets/')) {
        structure.assets++;
      } else if (key.startsWith('images/animals/')) {
        structure['images/animals']++;
      } else if (key.startsWith('images/gallery/')) {
        structure['images/gallery']++;
      } else if (key.startsWith('code/html/')) {
        structure['code/html']++;
      } else if (key.startsWith('documents/')) {
        structure.documents++;
      } else {
        structure.other++;
        if (!key.startsWith('trashbin/')) {
          issues.push(`Unorganized file: ${key}`);
        }
      }
    }

    // Check for required folders
    if (structure.assets === 0) {
      issues.push('No assets folder found');
    }
    if (structure['images/animals'] === 0 && structure['images/gallery'] === 0) {
      issues.push('No images folder found');
    }

    return {
      valid: issues.length === 0,
      issues,
      structure,
    };
  } catch (error: any) {
    return {
      valid: false,
      issues: [error.message],
      structure,
    };
  }
}

// Create bucket lock configuration
export function generateBucketLockConfig(): string {
  return JSON.stringify({
    rules: [
      {
        id: 'protect-assets',
        prefix: 'assets/',
        defaultRetention: {
          mode: 'GOVERNANCE',
          days: 0, // Indefinite
        },
        description: 'Protect all assets (logo, icons, graphics)',
      },
      {
        id: 'protect-animal-images',
        prefix: 'images/animals/',
        defaultRetention: {
          mode: 'GOVERNANCE',
          days: 30,
        },
        description: 'Protect animal photos with 30-day minimum retention',
      },
      {
        id: 'protect-gallery-images',
        prefix: 'images/gallery/',
        defaultRetention: {
          mode: 'GOVERNANCE',
          days: 14,
        },
        description: 'Protect gallery images with 14-day minimum retention',
      },
      {
        id: 'protect-code',
        prefix: 'code/',
        defaultRetention: {
          mode: 'GOVERNANCE',
          days: 0, // Indefinite
        },
        description: 'Protect HTML code and templates from accidental deletion',
      },
      {
        id: 'protect-documents',
        prefix: 'documents/',
        defaultRetention: {
          mode: 'COMPLIANCE',
          days: 2555, // 7 years
        },
        description: 'Protect documents with 7-year compliance retention',
      },
    ],
  }, null, 2);
}
