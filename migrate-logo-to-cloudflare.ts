// One-time script to migrate Southern Pets logo to Cloudflare Images
// Run this to upload the logo from Wix to Cloudflare Images

const CLOUDFLARE_ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '8MNLgVwEBU60rugwptEIhS1Fki4D2RLT8MrIgkcI';
const CLOUDFLARE_IMAGES_ACCOUNT_HASH = 'g7wf09fCONpnidkRnR_5vw';

async function migrateLogo() {
  try {
    console.log('🔄 Migrating logo to Cloudflare Images...\n');

    // Fetch logo from Wix
    const wixLogoUrl = 'https://static.wixstatic.com/media/33e096_671c6a950ec34c81b4e787ad92066c26~mv2.png';
    console.log('📥 Fetching logo from Wix...');
    const logoResponse = await fetch(wixLogoUrl);

    if (!logoResponse.ok) {
      throw new Error(`Failed to fetch logo from Wix: ${logoResponse.statusText}`);
    }

    const logoBlob = await logoResponse.blob();
    console.log('✅ Logo fetched successfully');

    // Upload to Cloudflare Images
    console.log('📤 Uploading to Cloudflare Images...');
    const imageFormData = new FormData();
    imageFormData.append('file', logoBlob, 'southernpets-logo.png');

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
        body: imageFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Cloudflare Images upload failed: ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    const imageId = uploadData.result?.id;
    const variants = uploadData.result?.variants || [];
    const variant = variants.includes('public') ? 'public' : (variants[0] || 'public');
    const logoUrl = `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;

    console.log('\n✅ Logo migrated successfully!');
    console.log('📋 Details:');
    console.log(`   Image ID: ${imageId}`);
    console.log(`   CDN URL: ${logoUrl}`);
    console.log(`   Variants: ${variants.join(', ')}`);
    console.log('\n💡 Update your code to use this URL:');
    console.log(`   ${logoUrl}`);
    console.log('\nOr use the image ID:');
    console.log(`   https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/public`);

    return logoUrl;
  } catch (error: any) {
    console.error('❌ Error migrating logo:', error.message);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateLogo()
    .then(() => {
      console.log('\n🎉 Migration complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    });
}

export { migrateLogo };
