// Southern Pets Animal Rescue - Adopt Page Generator
// Generates the adopt page with optimized images and bio support

export interface Animal {
    id: number;
    name: string;
    species: 'dog' | 'cat';
    breed?: string;
    age?: string;
    gender?: string;
    status: string;
    description?: string;
    bio?: string; // NEW: Animal bio field
    medical_info?: string;
    special_requirements?: string;
    foster_note?: string;
    spayed_neutered: number;
    vaccines_utd: number;
    rabies: number;
    heartworm_negative: number;
    microchipped: number;
    featured_photo_id?: string;
    featured_photo_url?: string;
    created_at: string;
    updated_at: string;
}

export interface AnimalPhoto {
    id: number;
    animal_id: number;
    photo_url: string;
    cloudflare_image_id: string;
    is_primary: number;
    display_order: number;
    created_at: string;
}

const CLOUDFLARE_IMAGES_ACCOUNT_HASH = 'g7wf09fCONpnidkRnR_5vw';

// Generate adopt page HTML with fixed image display
export async function generateAdoptPage(env: any, url: URL): Promise<string> {
    const db = env.DB || env.SOUTHERNPETS_DB;
    if (!db) {
        throw new Error('Database not configured');
    }

    // Get all available animals
    const animals = await db.prepare(`
    SELECT * FROM animals 
    WHERE status = 'available' 
    ORDER BY species, name
  `).all<Animal>();

    // Get all animal photos
    const photos = await db.prepare(`
    SELECT * FROM animal_photos 
    ORDER BY animal_id, display_order, is_primary DESC
  `).all<AnimalPhoto>();

    // Group photos by animal_id
    const photosByAnimal: Record<number, AnimalPhoto[]> = {};
    photos.results?.forEach(photo => {
        if (!photosByAnimal[photo.animal_id]) {
            photosByAnimal[photo.animal_id] = [];
        }
        photosByAnimal[photo.animal_id].push(photo);
    });

    // Separate dogs and cats
    const dogs = animals.results?.filter(a => a.species === 'dog') || [];
    const cats = animals.results?.filter(a => a.species === 'cat') || [];

    // Generate animal cards HTML
    function generateAnimalCard(animal: Animal): string {
        const photos = photosByAnimal[animal.id] || [];
        const primaryPhoto = photos.find(p => p.is_primary) || photos[0];
        const photoUrl = primaryPhoto?.photo_url ||
            `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${animal.featured_photo_id || animal.featured_cloudflare_image_id}/public`;

        const price = animal.species === 'dog' ? 250 : 150;
        const basicInfo = [
            animal.breed || 'Mixed',
            animal.age,
            animal.gender ? (animal.gender === 'male' ? 'Male' : 'Female') : ''
        ].filter(Boolean).join(' • ');

        // Health & Care items
        const healthItems: string[] = [];
        if (animal.spayed_neutered === 1) {
            healthItems.push(animal.gender === 'male' ? 'Neutered' : 'Spayed');
        }
        if (animal.heartworm_negative === 1) healthItems.push('Heartworm Negative');
        if (animal.rabies === 1) healthItems.push('3-Year Rabies Vaccine');
        if (animal.vaccines_utd === 1) {
            if (animal.species === 'dog') {
                healthItems.push('3 sets of vaccines (DHPP/Bordetella)');
            } else {
                healthItems.push('FVRCP Vaccine');
            }
        }
        if (animal.microchipped === 1) healthItems.push('Microchipped');

        const healthHTML = healthItems.length > 0 ? `
      <div class="animal-health">
        <h4>Health & Care:</h4>
        <ul>
          ${healthItems.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    ` : '';

        const specialNote = animal.special_requirements ? `
      <div class="special-note">${animal.special_requirements}</div>
    ` : '';

        // Build photos JSON for lightbox
        const photosJson = JSON.stringify(photos.map(p => ({
            id: p.id,
            animal_id: p.animal_id,
            photo_url: p.photo_url,
            cloudflare_image_id: p.cloudflare_image_id,
            is_primary: p.is_primary,
            display_order: p.display_order,
            created_at: p.created_at
        })));

        // Animal data JSON for lightbox
        const animalJson = JSON.stringify({
            ...animal,
            photo_url: photoUrl,
            primary_cloudflare_image_id: animal.featured_photo_id || animal.featured_cloudflare_image_id,
            featured_cloudflare_image_id: animal.featured_photo_id || animal.featured_cloudflare_image_id
        });

        return `
      <div class="animal-card">
        <div class="animal-photo">
          <img src="${photoUrl}" 
               alt="${animal.name} - ${animal.breed || 'Mixed'} ${animal.species} available for adoption at Southern Pets Animal Rescue in Acadia Parish, Louisiana" 
               title="${animal.name} - ${animal.breed || 'Mixed'} ${animal.species}" 
               loading="lazy" 
               width="320" 
               height="240">
        </div>
        <h3 class="animal-name">${animal.name}</h3>
        <p class="animal-basic">${basicInfo}</p>
        <div class="animal-price">$${price}</div>
        ${specialNote}
        ${healthHTML}
        <div class="animal-card-actions" style="display: flex; gap: 0.5rem; padding-top: 1rem;">
          <button class="learn-more-btn" 
                  onclick="openAnimalLightbox(${animal.id}, '${animalJson.replace(/'/g, "\\'")}', '${photosJson.replace(/'/g, "\\'")}')" 
                  style="flex: 1; padding: 0.75rem; background: #3498db; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
            Learn More
          </button>
          <button class="adopt-btn" 
                  onclick="openAdoptModal(${animal.id}, '${animal.name}')" 
                  style="flex: 1; padding: 0.75rem; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
            Apply to Adopt
          </button>
        </div>
      </div>
    `;
    }

    // Generate full HTML page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <meta name="description" content="Adopt dogs ($${dogs.length > 0 ? '250' : ''}) and cats ($${cats.length > 0 ? '150' : ''}) from Southern Pets Animal Rescue in Acadia Parish, Louisiana. ${dogs.length} dogs and ${cats.length} cats available for adoption. Find your perfect companion today.">
    <meta name="keywords" content="dog adoption, cat adoption, animal rescue, Acadia Parish Louisiana, pet adoption, rescue dogs, rescue cats, Southern Pets Animal Rescue, adopt a pet, Louisiana animal rescue">
    <meta name="author" content="Southern Pets Animal Rescue">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <title>Adopt a Pet - ${dogs.length} Dogs & ${cats.length} Cats Available | Southern Pets Animal Rescue</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://southernpetsanimalrescue.com/adopt">
    <meta property="og:title" content="Adopt a Pet - ${dogs.length} Dogs & ${cats.length} Cats Available | Southern Pets Animal Rescue">
    <meta property="og:description" content="Adopt dogs and cats from Southern Pets Animal Rescue in Acadia Parish, Louisiana. Find your perfect companion today.">
    <meta property="og:image" content="${dogs[0]?.featured_photo_url || cats[0]?.featured_photo_url || ''}">
    <meta property="og:site_name" content="Southern Pets Animal Rescue">
    <meta property="og:locale" content="en_US">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://southernpetsanimalrescue.com/adopt">
    <meta property="twitter:title" content="Adopt a Pet - Southern Pets Animal Rescue">
    <meta property="twitter:description" content="Adopt dogs and cats from Southern Pets Animal Rescue in Acadia Parish, Louisiana.">
    <meta property="twitter:image" content="${dogs[0]?.featured_photo_url || cats[0]?.featured_photo_url || ''}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://southernpetsanimalrescue.com/adopt">
    
    <!-- DNS Prefetch & Preconnect -->
    <link rel="dns-prefetch" href="https://imagedelivery.net">
    <link rel="dns-prefetch" href="https://static.wixstatic.com">
    <link rel="preconnect" href="https://imagedelivery.net" crossorigin>
    <link rel="preconnect" href="https://static.wixstatic.com" crossorigin>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
            height: 100%;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            height: 100%;
            overflow-x: hidden;
        }

        /* Header */
        .header {
            background-color: white;
            border-bottom: 1px solid #e0e0e0;
            position: sticky;
            top: 0;
            z-index: 1000;
            transition: box-shadow 0.3s ease;
        }

        .header.scrolled {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: #000;
            font-weight: 600;
            font-size: 20px;
        }

        .logo-icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .logo-icon img {
            width: 48px;
            height: 48px;
            object-fit: contain;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            image-rendering: high-quality;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            transition: transform 0.2s ease;
        }
        
        .logo:hover .logo-icon img {
            transform: scale(1.05);
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 16px;
            align-items: center;
        }

        .nav-link {
            text-decoration: none;
            color: #000;
            padding: 10px 16px;
            border-radius: 6px;
            font-weight: 500;
            font-size: 15px;
            transition: all 0.2s ease;
        }

        .nav-link:hover {
            background-color: #f8f9fa;
        }

        .nav-link.active {
            color: #2ecc71;
            background-color: #f0fdf4;
        }

        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
        }

        .hamburger {
            width: 24px;
            height: 18px;
            position: relative;
        }

        .hamburger span {
            display: block;
            height: 2px;
            width: 100%;
            background-color: #000;
            position: absolute;
            transition: all 0.3s ease;
        }

        .hamburger span:nth-child(1) { top: 0; }
        .hamburger span:nth-child(2) { top: 8px; }
        .hamburger span:nth-child(3) { top: 16px; }

        .mobile-menu {
            display: none;
            background-color: white;
            border-top: 1px solid #e0e0e0;
            padding: 20px;
        }

        .mobile-menu.active {
            display: block;
        }

        .mobile-nav-link {
            display: block;
            text-decoration: none;
            color: #000;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            font-weight: 500;
        }

        .mobile-nav-link:last-child {
            border-bottom: none;
        }

        .mobile-nav-link.active {
            color: #2ecc71;
            font-weight: 600;
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            padding: 50px 20px 40px;
            text-align: center;
        }

        .hero-container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .hero-title {
            font-size: 36px;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 1.2;
            margin-bottom: 16px;
        }

        .hero-subtitle {
            font-size: 17px;
            color: #666;
            margin-bottom: 30px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Tab Toggle System */
        .animal-tabs {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 30px;
        }

        .tab-btn {
            background: white;
            border: 2px solid #e0e0e0;
            padding: 14px 32px;
            border-radius: 10px;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
        }

        .tab-btn:hover {
            border-color: #2ecc71;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2);
        }

        .tab-btn.active {
            background: #2ecc71;
            color: white;
            border-color: #2ecc71;
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
        }

        .tab-icon {
            font-size: 22px;
        }

        .tab-count {
            font-size: 14px;
            opacity: 0.8;
        }

        /* Animal Sections */
        .animal-section {
            padding: 50px 20px 60px;
            background-color: white;
            display: none;
        }

        .animal-section.active {
            display: block;
        }

        .section-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .animal-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 20px;
        }

        .animal-card {
            background: white;
            border-radius: 16px;
            padding: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border: 2px solid transparent;
            display: flex;
            flex-direction: column;
        }

        .animal-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            border-color: #2ecc71;
        }

        /* FIXED: Natural aspect ratio for images */
        .animal-photo {
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 18px;
            background: #f0f0f0;
            position: relative;
            min-height: 250px;
            max-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .animal-photo img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: contain;
            object-position: center;
            max-width: 100%;
            max-height: 100%;
        }

        .animal-name {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .animal-basic {
            font-size: 15px;
            color: #666;
            margin-bottom: 14px;
        }

        .animal-price {
            font-size: 26px;
            font-weight: 700;
            color: #2ecc71;
            margin-bottom: 16px;
        }

        .animal-health {
            text-align: left;
            margin-bottom: 18px;
        }

        .animal-health h4 {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1a1a1a;
        }

        .animal-health ul {
            list-style: none;
            padding: 0;
        }

        .animal-health li {
            color: #666;
            padding: 3px 0;
            position: relative;
            padding-left: 18px;
            font-size: 14px;
        }

        .animal-health li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #2ecc71;
            font-weight: bold;
        }

        .special-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 14px;
            font-size: 13px;
            color: #856404;
            font-weight: 500;
        }

        .foster-note {
            background: #e8f4fd;
            border: 1px solid #3498db;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 14px;
            font-size: 13px;
            color: #2c3e50;
            font-weight: 500;
        }

        .adopt-btn {
            background: #2ecc71;
            color: white;
            border: none;
            padding: 13px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            font-size: 16px;
        }

        .adopt-btn:hover {
            background: #27ae60;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
        }

        .adopt-btn:active {
            transform: translateY(0);
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            position: relative;
            background-color: white;
            margin: 2% auto;
            padding: 0;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-header {
            padding: 24px 30px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .close {
            color: #999;
            font-size: 32px;
            font-weight: bold;
            cursor: pointer;
            line-height: 1;
            transition: color 0.2s;
            background: none;
            border: none;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .close:hover {
            color: #000;
        }

        .modal-body {
            padding: 24px 30px 30px;
            position: relative;
            overflow-y: auto;
            flex: 1;
            -webkit-overflow-scrolling: touch;
        }

        /* Donate Section */
        .donate {
            padding: 60px 20px;
            background-color: #f8f9fa;
        }

        .donate-container {
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
        }

        .donate-title {
            font-size: 32px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 16px;
        }

        .donate-subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 40px;
        }

        .donate-methods {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 20px;
        }

        .donate-method {
            background: white;
            padding: 24px 16px;
            border-radius: 12px;
            text-decoration: none;
            color: #333;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            display: block;
        }

        .donate-method:hover {
            background: #000;
            color: white;
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .donate-icon {
            font-size: 28px;
            margin-bottom: 12px;
        }

        .donate-method-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .donate-handle {
            font-size: 12px;
            opacity: 0.8;
        }

        /* Footer */
        .footer {
            background-color: #1a1a1a;
            color: white;
            padding: 50px 20px;
            text-align: center;
        }

        .footer-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .footer-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .footer-description {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #ccc;
        }

        .footer-email {
            color: #2ecc71;
            text-decoration: none;
            font-size: 16px;
            font-weight: 500;
        }

        .footer-email:hover {
            color: white;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }

            .mobile-menu-toggle {
                display: block;
            }

            .nav-container {
                height: 60px;
                padding: 0 16px;
            }

            .logo {
                font-size: 18px;
            }

            .logo-icon {
                width: 32px;
                height: 32px;
            }

            .hero {
                padding: 40px 16px 30px;
            }

            .hero-title {
                font-size: 28px;
            }

            .hero-subtitle {
                font-size: 15px;
            }

            .animal-tabs {
                flex-direction: column;
                gap: 10px;
                margin-top: 24px;
            }

            .tab-btn {
                width: 100%;
                justify-content: center;
                padding: 14px 24px;
            }

            .animal-section {
                padding: 30px 16px 40px;
            }

            .animal-grid {
                grid-template-columns: 1fr;
                gap: 24px;
            }

            .donate {
                padding: 40px 16px;
            }

            .donate-methods {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }

            .modal-content {
                width: 95%;
                margin: 2% auto;
                max-height: 96vh;
            }

            .modal-header {
                padding: 18px 20px;
            }

            .modal-title {
                font-size: 20px;
            }

            .modal-body {
                padding: 18px 20px 24px;
                overflow-y: auto;
            }

            .mobile-menu-toggle.active .hamburger span:nth-child(1) {
                transform: rotate(45deg);
                top: 8px;
            }

            .mobile-menu-toggle.active .hamburger span:nth-child(2) {
                opacity: 0;
            }

            .mobile-menu-toggle.active .hamburger span:nth-child(3) {
                transform: rotate(-45deg);
                top: 8px;
            }
        }

        @media (max-width: 480px) {
            .donate-methods {
                grid-template-columns: 1fr;
            }

            .hero-title {
                font-size: 24px;
            }

            .animal-name {
                font-size: 22px;
            }

            .animal-card {
                padding: 16px;
            }

            .animal-photo {
                min-height: 220px;
                max-height: 350px;
            }

            .animal-price {
                font-size: 22px;
            }

            .animal-health li {
                font-size: 13px;
            }
        }

        /* Accessibility */
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #2ecc71;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 100;
        }

        .skip-link:focus {
            top: 0;
        }

        /* Lightbox Modal Styles */
        .lightbox-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 10000;
            overflow-y: auto;
            padding: 2rem;
        }

        .lightbox-content {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .lightbox-header {
            position: relative;
            background: #2c3e50;
            color: white;
            padding: 1.5rem;
        }

        .lightbox-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .lightbox-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .lightbox-body {
            padding: 2rem;
        }

        .photo-carousel {
            margin-bottom: 2rem;
        }

        .carousel-container {
            position: relative;
            width: 100%;
            max-height: 500px;
            overflow: hidden;
            border-radius: 8px;
            background: #f0f0f0;
        }

        .carousel-images {
            display: flex;
            transition: transform 0.3s ease;
            height: 500px;
        }

        .carousel-images img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            flex-shrink: 0;
        }

        .carousel-prev, .carousel-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.6);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            transition: background 0.2s;
        }

        .carousel-prev:hover, .carousel-next:hover {
            background: rgba(0,0,0,0.8);
        }

        .carousel-prev {
            left: 1rem;
        }

        .carousel-next {
            right: 1rem;
        }

        .carousel-indicators {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
            z-index: 10;
        }

        .carousel-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            background: transparent;
            cursor: pointer;
            transition: background 0.2s;
        }

        .carousel-indicator.active {
            background: white;
        }

        .animal-info-section {
            margin-bottom: 2rem;
        }

        .lightbox-cta {
            text-align: center;
            padding-top: 2rem;
            border-top: 2px solid #e5e7eb;
        }

        .lightbox-adopt-btn {
            background: #2ecc71;
            color: white;
            padding: 1rem 3rem;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
        }

        .lightbox-adopt-btn:hover {
            background: #27ae60;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
        }
    </style>
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header class="header" id="header">
        <nav class="nav-container">
            <a href="/" class="logo">
                <div class="logo-icon">
                    <img src="https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/be0043cf-6599-4d18-67a7-02a7a1e49000/public" 
                         alt="Southern Pets Animal Rescue Logo" 
                         width="48" 
                         height="48"
                         style="width: 48px; height: 48px; object-fit: contain; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
                         loading="eager"
                         fetchpriority="high"
                         onerror="this.src='https://static.wixstatic.com/media/33e096_671c6a950ec34c81b4e787ad92066c26~mv2.png'">
                </div>
                <span>Southern Pets Animal Rescue</span>
            </a>
            
            <ul class="nav-menu">
                <li><a href="/" class="nav-link">Home</a></li>
                <li><a href="/adopt" class="nav-link active">Adopt</a></li>
                <li><a href="/gallery" class="nav-link">Dashboard</a></li>
                <li><a href="/services" class="nav-link">Services</a></li>
            </ul>

            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle mobile menu">
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
        </nav>

        <div class="mobile-menu" id="mobileMenu">
            <a href="/" class="mobile-nav-link">Home</a>
            <a href="/adopt" class="mobile-nav-link active">Adopt</a>
            <a href="/gallery" class="mobile-nav-link">Dashboard</a>
            <a href="/services" class="mobile-nav-link">Services</a>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="main-content">
        <div class="hero-container">
            <h1 class="hero-title">Every Animal Deserves a Loving Home</h1>
            <p class="hero-subtitle">Brothers like these remind us why keeping families together matters. Find your perfect companion today.</p>
            
            <div class="animal-tabs">
                <button class="tab-btn active" data-tab="dogs" aria-label="View dogs for adoption">
                    <span class="tab-icon">🐕</span>
                    <span>Dogs</span>
                    <span class="tab-count">(${dogs.length})</span>
                </button>
                <button class="tab-btn" data-tab="cats" aria-label="View cats for adoption">
                    <span class="tab-icon">🐱</span>
                    <span>Cats</span>
                    <span class="tab-count">(${cats.length})</span>
                </button>
            </div>
        </div>
    </section>

    <!-- Dogs Section -->
    <section class="animal-section active" id="dogs-section">
        <div class="section-container">
            <div class="animal-grid">
                ${dogs.map(animal => generateAnimalCard(animal)).join('')}
            </div>
        </div>
    </section>

    <!-- Cats Section -->
    <section class="animal-section" id="cats-section">
        <div class="section-container">
            <div class="animal-grid">
                ${cats.map(animal => generateAnimalCard(animal)).join('')}
            </div>
        </div>
    </section>

    <!-- Donate Section -->
    <section class="donate">
        <div class="donate-container">
            <h2 class="donate-title">Support Our Rescue Mission</h2>
            <p class="donate-subtitle">Help us continue saving lives and finding forever homes for more animals</p>
            
            <div class="donate-methods">
                <a href="https://venmo.com/SouthernPetsAnimalRescue" target="_blank" rel="noopener" class="donate-method">
                    <div class="donate-icon">💚</div>
                    <div class="donate-method-title">Venmo</div>
                    <div class="donate-handle">@SouthernPetsAnimalRescue</div>
                </a>
                
                <a href="https://cash.app/$SouthernPetsAR" target="_blank" rel="noopener" class="donate-method">
                    <div class="donate-icon">💵</div>
                    <div class="donate-method-title">CashApp</div>
                    <div class="donate-handle">$SouthernPetsAR</div>
                </a>
                
                <a href="https://www.paypal.com/paypalme/Raesrescue" target="_blank" rel="noopener" class="donate-method">
                    <div class="donate-icon">💙</div>
                    <div class="donate-method-title">PayPal</div>
                    <div class="donate-handle">Secure Donation</div>
                </a>
                
                <a href="https://www.amazon.com/hz/wishlist/ls/1N6JJ14LSVAAR?ref_=wl_share" target="_blank" rel="noopener" class="donate-method">
                    <div class="donate-icon">🐕</div>
                    <div class="donate-method-title">Amazon Wishlist</div>
                    <div class="donate-handle">Dogs & General Items</div>
                </a>
                
                <a href="https://www.amazon.com/hz/wishlist/ls/1MKVIZ4UIG78O?ref_=wl_share" target="_blank" rel="noopener" class="donate-method">
                    <div class="donate-icon">🐱</div>
                    <div class="donate-method-title">Amazon Wishlist</div>
                    <div class="donate-handle">Cat & Kitten Items</div>
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <h3 class="footer-title">Southern Pets Animal Rescue</h3>
            <p class="footer-description">
                Southern Pets Animal Rescue is a 501(c)(3) established in 2025. 
                Our goal is community spay/neuter in Acadia Parish, the home base of the rescue. 
                We offer TNR services and resources for keeping families together.
            </p>
            <a href="mailto:SouthernPetsAnimalRescue@gmail.com" class="footer-email">SouthernPetsAnimalRescue@gmail.com</a><br>
            <span style="color: #ccc; font-size: 16px; font-weight: 500;">337-581-7562</span>
        </div>
    </footer>

    <!-- Animal Lightbox Modal - Enhanced with Bio -->
    <div id="animalLightbox" class="lightbox-modal">
        <div class="lightbox-content">
            <div class="lightbox-header">
                <button class="lightbox-close" onclick="closeAnimalLightbox()">&times;</button>
                <h2 id="lightboxAnimalName"></h2>
                <p id="lightboxAnimalBreed"></p>
            </div>
            
            <div class="lightbox-body">
                <!-- Photo Carousel -->
                <div class="photo-carousel">
                    <div class="carousel-container">
                        <div id="carouselImages" class="carousel-images"></div>
                        <button class="carousel-prev" onclick="carouselPrev()">‹</button>
                        <button class="carousel-next" onclick="carouselNext()">›</button>
                        <div class="carousel-indicators" id="carouselIndicators"></div>
                    </div>
                </div>
                
                <!-- Animal Info with Bio -->
                <div class="animal-info-section" id="lightboxAnimalInfo"></div>
                
                <!-- Adoption CTA -->
                <div class="lightbox-cta">
                    <button class="lightbox-adopt-btn" onclick="lightboxAdopt()">Apply to Adopt</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Adoption Modal - Will be included from separate file -->
    <div id="adoptModal" class="modal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="modalTitle">Pet Adoption Application</h2>
                <button class="close" onclick="closeAdoptModal()" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body" id="adoptModalBody">
                <!-- Form will be loaded here -->
            </div>
        </div>
    </div>

    <script>
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        const dogsSection = document.getElementById('dogs-section');
        const catsSection = document.getElementById('cats-section');

        function switchToTab(tab) {
            tabButtons.forEach(btn => {
                if (btn.dataset.tab === tab) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            if (tab === 'dogs') {
                dogsSection.classList.add('active');
                catsSection.classList.remove('active');
            } else {
                catsSection.classList.add('active');
                dogsSection.classList.remove('active');
            }
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.dataset.tab;
                switchToTab(tab);
                const firstCard = tab === 'dogs' ? dogsSection : catsSection;
                firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Check URL parameters
        (function() {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            if (tabParam === 'cats' || tabParam === 'dogs') {
                switchToTab(tabParam);
            }
        })();

        // Animal Lightbox Carousel with Bio
        let currentCarouselIndex = 0;
        let currentCarouselPhotos = [];
        let currentAnimal = null;

        function openAnimalLightbox(animalId, animalJson, photosJson) {
            try {
                currentAnimal = JSON.parse(animalJson);
                currentCarouselPhotos = JSON.parse(photosJson);
                currentCarouselIndex = 0;

                const lightbox = document.getElementById('animalLightbox');
                const nameEl = document.getElementById('lightboxAnimalName');
                const breedEl = document.getElementById('lightboxAnimalBreed');
                const infoEl = document.getElementById('lightboxAnimalInfo');
                const carouselEl = document.getElementById('carouselImages');
                const indicatorsEl = document.getElementById('carouselIndicators');

                nameEl.textContent = currentAnimal.name || 'Unnamed';
                const breed = currentAnimal.breed || 'Mixed';
                const age = currentAnimal.age || '';
                const gender = currentAnimal.gender ? (currentAnimal.gender === 'male' ? 'Male' : 'Female') : '';
                breedEl.textContent = [breed, age, gender].filter(Boolean).join(' • ');

                // Build carousel
                carouselEl.innerHTML = '';
                indicatorsEl.innerHTML = '';
                
                if (currentCarouselPhotos.length > 0) {
                    currentCarouselPhotos.forEach((photo, index) => {
                        const img = document.createElement('img');
                        img.src = photo.photo_url;
                        img.style.width = '100%';
                        img.style.height = '500px';
                        img.style.objectFit = 'contain';
                        img.style.flexShrink = '0';
                        img.alt = (currentAnimal.name || 'Pet') + ' - Photo ' + (index + 1);
                        img.loading = index === 0 ? 'eager' : 'lazy';
                        carouselEl.appendChild(img);

                        const indicator = document.createElement('button');
                        indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
                        indicator.onclick = () => goToCarouselSlide(index);
                        indicatorsEl.appendChild(indicator);
                    });
                    carouselEl.style.width = (currentCarouselPhotos.length * 100) + '%';
                } else {
                    const placeholder = document.createElement('div');
                    placeholder.style.width = '100%';
                    placeholder.style.height = '500px';
                    placeholder.style.display = 'flex';
                    placeholder.style.alignItems = 'center';
                    placeholder.style.justifyContent = 'center';
                    placeholder.style.background = '#f0f0f0';
                    placeholder.style.color = '#999';
                    placeholder.textContent = 'No photos available';
                    carouselEl.appendChild(placeholder);
                }

                // Build animal info with BIO
                const price = currentAnimal.species?.toLowerCase() === 'dog' ? 250 : 150;
                let infoHTML = '<div style="display: grid; gap: 1.5rem;">';
                
                // Adoption Fee
                infoHTML += '<div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;"><strong style="color: #2ecc71; font-size: 1.1rem;">Adoption Fee:</strong> <span style="font-size: 1.2rem; font-weight: 700; color: #2c3e50;">$' + price + '</span></div>';
                
                // Bio Section (NEW)
                if (currentAnimal.bio) {
                    infoHTML += '<div><h3 style="margin: 0 0 0.5rem 0; color: #2c3e50; font-size: 1.2rem;">About ' + (currentAnimal.name || 'This Pet') + '</h3><p style="margin: 0; line-height: 1.8; color: #555; font-size: 1rem;">' + currentAnimal.bio + '</p></div>';
                } else if (currentAnimal.description) {
                    infoHTML += '<div><h3 style="margin: 0 0 0.5rem 0; color: #2c3e50; font-size: 1.2rem;">About ' + (currentAnimal.name || 'This Pet') + '</h3><p style="margin: 0; line-height: 1.8; color: #555; font-size: 1rem;">' + currentAnimal.description + '</p></div>';
                } else {
                    const species = currentAnimal.species?.toLowerCase() === 'dog' ? 'dog' : 'cat';
                    const defaultBio = (currentAnimal.name || 'This pet') + ' is a ' + (currentAnimal.age || '') + ' ' + (currentAnimal.breed || 'mixed breed') + ' ' + species + ' looking for a loving forever home.';
                    infoHTML += '<div><h3 style="margin: 0 0 0.5rem 0; color: #2c3e50; font-size: 1.2rem;">About ' + (currentAnimal.name || 'This Pet') + '</h3><p style="margin: 0; line-height: 1.8; color: #555; font-size: 1rem;">' + defaultBio + '</p></div>';
                }
                
                // Health & Care
                const healthItems = [];
                if (currentAnimal.spayed_neutered == 1) healthItems.push(currentAnimal.gender === 'male' ? 'Neutered' : 'Spayed');
                if (currentAnimal.heartworm_negative == 1) healthItems.push('Heartworm Negative');
                if (currentAnimal.rabies == 1) healthItems.push('3-Year Rabies Vaccine');
                if (currentAnimal.vaccines_utd == 1) {
                    if (currentAnimal.species?.toLowerCase() === 'dog') {
                        healthItems.push('3 sets of vaccines (DHPP/Bordetella)');
                    } else {
                        healthItems.push('FVRCP Vaccine');
                    }
                }
                if (currentAnimal.microchipped == 1) healthItems.push('Microchipped');
                
                if (healthItems.length > 0) {
                    infoHTML += '<div><h3 style="margin: 0 0 0.75rem 0; color: #2c3e50; font-size: 1.2rem;">Health & Care</h3><ul style="margin: 0; padding-left: 1.5rem; line-height: 1.8; color: #555;">';
                    healthItems.forEach(item => {
                        infoHTML += '<li>' + item + '</li>';
                    });
                    infoHTML += '</ul></div>';
                }
                
                // Special Requirements
                if (currentAnimal.special_requirements) {
                    infoHTML += '<div style="background: #fff3cd; padding: 1rem; border-radius: 6px; border-left: 4px solid #ffc107;"><strong style="color: #856404;">Special Requirements:</strong> <span style="color: #856404;">' + currentAnimal.special_requirements + '</span></div>';
                }
                
                // Status
                infoHTML += '<div style="padding: 0.75rem; background: #e8f5e9; border-radius: 6px;"><strong>Status:</strong> <span style="color: #2e7d32; font-weight: 600;">' + (currentAnimal.status || 'available').charAt(0).toUpperCase() + (currentAnimal.status || 'available').slice(1) + '</span></div>';
                
                infoHTML += '</div>';
                infoEl.innerHTML = infoHTML;

                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
                updateCarousel();
            } catch (error) {
                console.error('Error opening lightbox:', error);
            }
        }

        function closeAnimalLightbox() {
            const lightbox = document.getElementById('animalLightbox');
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentCarouselPhotos = [];
            currentAnimal = null;
        }

        function updateCarousel() {
            const carouselEl = document.getElementById('carouselImages');
            const indicators = document.querySelectorAll('.carousel-indicator');
            if (carouselEl && currentCarouselPhotos.length > 0) {
                carouselEl.style.transform = 'translateX(-' + (currentCarouselIndex * (100 / currentCarouselPhotos.length)) + '%)';
                indicators.forEach((ind, i) => {
                    ind.classList.toggle('active', i === currentCarouselIndex);
                });
            }
        }

        function carouselNext() {
            if (currentCarouselPhotos.length > 0) {
                currentCarouselIndex = (currentCarouselIndex + 1) % currentCarouselPhotos.length;
                updateCarousel();
            }
        }

        function carouselPrev() {
            if (currentCarouselPhotos.length > 0) {
                currentCarouselIndex = currentCarouselIndex === 0 ? currentCarouselPhotos.length - 1 : currentCarouselIndex - 1;
                updateCarousel();
            }
        }

        function goToCarouselSlide(index) {
            currentCarouselIndex = index;
            updateCarousel();
        }

        function lightboxAdopt() {
            closeAnimalLightbox();
            if (currentAnimal) {
                openAdoptModal(currentAnimal.id, currentAnimal.name);
            }
        }

        // Close lightbox handlers
        document.addEventListener('click', function(event) {
            const lightbox = document.getElementById('animalLightbox');
            if (event.target === lightbox) {
                closeAnimalLightbox();
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeAnimalLightbox();
            }
        });

        // Mobile menu
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const header = document.getElementById('header');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                mobileMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });

            document.addEventListener('click', function(event) {
                if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });

            const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                });
            });
        }

        // Header scroll effect
        if (header) {
            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset;
                if (currentScroll > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { passive: true });
        }

        // Adoption Modal Functions
        let selectedAnimalId = null;

        async function openAdoptModal(animalId = null, animalName = '') {
            selectedAnimalId = animalId;
            const modal = document.getElementById('adoptModal');
            const modalBody = document.getElementById('adoptModalBody');
            
            if (!modal || !modalBody) return;

            // Load form HTML
            try {
                const response = await fetch('/api/adoption-form');
                if (response.ok) {
                    modalBody.innerHTML = await response.text();
                } else {
                    modalBody.innerHTML = '<p>Error loading form. Please refresh the page.</p>';
                }
            } catch (error) {
                modalBody.innerHTML = '<p>Error loading form. Please refresh the page.</p>';
            }

            modal.classList.add('active');
            modal.style.display = 'flex';
            
            const scrollY = window.scrollY || window.pageYOffset;
            document.body.style.position = 'fixed';
            document.body.style.top = '-' + scrollY + 'px';
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.dataset.scrollY = scrollY.toString();
            
            if (animalName && animalId) {
                setTimeout(() => {
                    const interestedPetField = document.getElementById('interested_pet');
                    if (interestedPetField) {
                        interestedPetField.value = animalName;
                    }
                }, 150);
            }
        }

        function closeAdoptModal() {
            const modal = document.getElementById('adoptModal');
            if (!modal) return;
            
            modal.classList.remove('active');
            modal.style.display = 'none';
            
            const scrollY = document.body.dataset.scrollY || '0';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY, 10));
            }
        }

        window.openAdoptModal = openAdoptModal;
        window.closeAdoptModal = closeAdoptModal;
        window.openAnimalLightbox = openAnimalLightbox;
        window.closeAnimalLightbox = closeAnimalLightbox;
        window.carouselNext = carouselNext;
        window.carouselPrev = carouselPrev;
        window.goToCarouselSlide = goToCarouselSlide;
        window.lightboxAdopt = lightboxAdopt;
    </script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"version":"2024.11.0","token":"fa3e97f59bce48dd8ad8290afe64eb86","r":1,"server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}' crossorigin="anonymous"></script>
</body>
</html>`;

    return html;
}
