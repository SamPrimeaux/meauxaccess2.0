// Process and remaster all provided HTML pages
// This script will be used to remaster the pages via the API

const pages = [
  {
    name: "Homepage (Video Hero)",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meauxbility: Where Impossible Becomes Possible</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <!-- Styles and content will be processed -->
</head>
<body>
    <!-- Content -->
</body>
</html>`,
    path: "index.html",
    title: "Meauxbility - Empowering mobility and independence",
    description: "Meauxbility - Empowering mobility and independence for adaptive athletes and spinal cord injury survivors. Built by a survivor for survivors.",
    keywords: ["meauxbility", "spinal cord injury", "adaptive athletes", "mobility", "accessibility", "nonprofit", "501c3"]
  }
];

// This will be called via the API endpoint
console.log(JSON.stringify(pages, null, 2));
