/**
 * Media Gallery Page
 * Comprehensive gallery for viewing, editing, and deleting images and videos
 */

export default function getMediaGalleryHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Media Gallery - Inner Animal Media</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #667eea;
      --primary-dark: #5568d3;
      --primary-light: #8b9eff;
      --bg-primary: #ffffff;
      --bg-secondary: #f7f8fc;
      --text-primary: #1a202c;
      --text-secondary: #718096;
      --border-color: #e2e8f0;
      --success: #10b981;
      --error: #ef4444;
      --warning: #f59e0b;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --radius: 8px;
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
    }

    [data-theme="dark"] {
      --bg-primary: #1a202c;
      --bg-secondary: #2d3748;
      --text-primary: #f7fafc;
      --text-secondary: #a0aec0;
      --border-color: #4a5568;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: var(--bg-secondary);
      color: var(--text-primary);
      line-height: 1.6;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--space-6);
    }

    .header {
      background: var(--bg-primary);
      border-radius: var(--radius);
      padding: var(--space-6);
      margin-bottom: var(--space-6);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .header h1 {
      font-size: 2rem;
      margin-bottom: var(--space-2);
      color: var(--text-primary);
    }

    .header p {
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
    }

    .tabs {
      display: flex;
      gap: var(--space-2);
      border-bottom: 2px solid var(--border-color);
      margin-bottom: var(--space-6);
    }

    .tab {
      padding: var(--space-3) var(--space-6);
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: var(--text-secondary);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .tab:hover {
      color: var(--text-primary);
      background: var(--bg-secondary);
    }

    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .controls {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-6);
      flex-wrap: wrap;
      align-items: center;
    }

    .search-box {
      flex: 1;
      min-width: 200px;
      padding: var(--space-3);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 1rem;
    }

    .btn {
      padding: var(--space-3) var(--space-6);
      border: none;
      border-radius: var(--radius);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-dark);
    }

    .btn-danger {
      background: var(--error);
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-secondary {
      background: var(--bg-primary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
      background: var(--bg-secondary);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .selection-info {
      padding: var(--space-3) var(--space-4);
      background: var(--primary-light);
      color: white;
      border-radius: var(--radius);
      font-weight: 500;
      display: none;
    }

    .selection-info.active {
      display: block;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .media-item {
      background: var(--bg-primary);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 2px solid var(--border-color);
      transition: all 0.2s;
      cursor: pointer;
      position: relative;
    }

    .media-item:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .media-item.selected {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    .media-item input[type="checkbox"] {
      position: absolute;
      top: var(--space-2);
      left: var(--space-2);
      width: 20px;
      height: 20px;
      z-index: 10;
      cursor: pointer;
    }

    .media-thumbnail {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      background: var(--bg-secondary);
      display: block;
    }

    .media-info {
      padding: var(--space-3);
    }

    .media-title {
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: var(--space-1);
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-meta {
      font-size: 0.75rem;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .media-actions {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-2);
      padding-top: var(--space-2);
      border-top: 1px solid var(--border-color);
    }

    .media-actions button {
      flex: 1;
      padding: var(--space-2);
      font-size: 0.75rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-6);
    }

    .pagination button {
      padding: var(--space-2) var(--space-4);
    }

    .pagination-info {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .loading {
      text-align: center;
      padding: var(--space-8);
      color: var(--text-secondary);
    }

    .empty {
      text-align: center;
      padding: var(--space-8);
      color: var(--text-secondary);
    }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: var(--bg-primary);
      border-radius: var(--radius);
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      box-shadow: var(--shadow-lg);
    }

    .modal-header {
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-body {
      padding: var(--space-6);
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-secondary);
    }

    .modal-image {
      max-width: 100%;
      max-height: 70vh;
      display: block;
      margin: 0 auto;
    }

    .modal-video {
      width: 100%;
      max-height: 70vh;
    }

    @media (max-width: 768px) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: var(--space-3);
      }

      .controls {
        flex-direction: column;
      }

      .search-box {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📸 Media Gallery</h1>
      <p>View, edit, and manage all your images and videos</p>
    </div>

    <div class="tabs">
      <button class="tab active" data-tab="images" onclick="switchTab('images')">
        🖼️ Images (<span id="imagesCount">0</span>)
      </button>
      <button class="tab" data-tab="videos" onclick="switchTab('videos')">
        🎥 Videos (<span id="videosCount">0</span>)
      </button>
    </div>

    <div class="controls">
      <input type="text" class="search-box" id="searchInput" placeholder="Search by filename..." oninput="handleSearch()">
      <select class="btn btn-secondary" id="projectFilter" onchange="filterByProject()" style="padding: var(--space-3);">
        <option value="">All Projects</option>
      </select>
      <button class="btn btn-secondary" onclick="selectAll()">Select All</button>
      <button class="btn btn-secondary" onclick="deselectAll()">Deselect None</button>
      <button class="btn btn-primary" id="remasterSelectedBtn" onclick="remasterSelected()" disabled style="background: linear-gradient(135deg, #10A37F 0%, #1a7f64 100%);">
        ✨ Remaster Selected (<span id="selectedCount">0</span>)
      </button>
      <button class="btn btn-danger" id="deleteSelectedBtn" onclick="deleteSelected()" disabled>
        🗑️ Delete Selected (<span id="selectedCount">0</span>)
      </button>
      <button class="btn btn-primary" onclick="refreshGallery()">🔄 Refresh</button>
    </div>

    <div class="selection-info active" id="selectionInfo">
      <span id="selectionText">0 items selected</span>
    </div>

    <div id="galleryContent">
      <div class="loading">Loading media...</div>
    </div>

    <div class="pagination" id="pagination"></div>
  </div>

  <!-- Modal for viewing media -->
  <div class="modal" id="mediaModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modalTitle">Media Preview</h2>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div id="modalContent"></div>
      </div>
    </div>
  </div>

  <!-- Modal for editing metadata -->
  <div class="modal" id="metadataModal">
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h2 id="metadataModalTitle">Edit Metadata</h2>
        <button class="modal-close" onclick="closeMetadataModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="metadataForm" onsubmit="saveMetadata(event)">
          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Title</label>
            <input type="text" id="metadataTitle" class="search-box" placeholder="Image/Video title">
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Description</label>
            <textarea id="metadataDescription" class="search-box" rows="3" placeholder="Description"></textarea>
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Alt Text (SEO)</label>
            <input type="text" id="metadataAltText" class="search-box" placeholder="Alt text for accessibility">
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Meta Description (SEO)</label>
            <textarea id="metadataMetaDescription" class="search-box" rows="2" placeholder="Meta description (120-160 chars)"></textarea>
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Tags (comma-separated)</label>
            <input type="text" id="metadataTags" class="search-box" placeholder="tag1, tag2, tag3">
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Keywords (comma-separated)</label>
            <input type="text" id="metadataKeywords" class="search-box" placeholder="keyword1, keyword2, keyword3">
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Project</label>
            <div style="display: flex; gap: var(--space-2);">
              <select id="metadataProject" class="search-box" style="flex: 1;">
                <option value="">No Project</option>
              </select>
              <input type="text" id="metadataNewProject" class="search-box" placeholder="Or create new project" style="flex: 1;">
            </div>
          </div>
          <div style="display: flex; gap: var(--space-2); margin-top: var(--space-6);">
            <button type="submit" class="btn btn-primary" style="flex: 1;">Save Metadata</button>
            <button type="button" class="btn btn-secondary" onclick="closeMetadataModal()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal for remastering -->
  <div class="modal" id="remasterModal">
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h2>✨ Remaster with OpenAI</h2>
        <button class="modal-close" onclick="closeRemasterModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom: var(--space-4);">
          <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Remaster Prompt</label>
          <textarea id="remasterPrompt" class="search-box" rows="4" placeholder="Describe how you want to remaster this image (e.g., 'Enhance colors, improve lighting, make it more professional')"></textarea>
        </div>
        <div style="margin-bottom: var(--space-4);">
          <label style="display: block; font-weight: 600; margin-bottom: var(--space-2);">Style</label>
          <select id="remasterStyle" class="search-box">
            <option value="natural">Natural</option>
            <option value="vivid">Vivid</option>
          </select>
        </div>
        <div id="remasterPreview" style="margin-bottom: var(--space-4); display: none;">
          <img id="remasterPreviewImg" style="max-width: 100%; border-radius: var(--radius);">
        </div>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn btn-primary" onclick="executeRemaster()" style="flex: 1;">✨ Remaster</button>
          <button class="btn btn-secondary" onclick="closeRemasterModal()">Cancel</button>
        </div>
        <div id="remasterStatus" style="margin-top: var(--space-4);"></div>
      </div>
    </div>
  </div>

  <script>
    let currentTab = 'images';
    let currentPage = 1;
    let perPage = 50;
    let searchQuery = '';
    let selectedItems = new Set();
    let allImages = [];
    let allVideos = [];
    let allProjects = [];
    let currentProjectFilter = '';
    let currentEditingId = null;
    let currentEditingType = null;
    let currentRemasteringUrl = null;

    async function switchTab(tab) {
      currentTab = tab;
      currentPage = 1;
      selectedItems.clear();
      updateSelectionInfo();
      
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector(\`[data-tab="\${tab}"]\`).classList.add('active');
      
      await loadGallery();
    }

    async function loadGallery() {
      const content = document.getElementById('galleryContent');
      content.innerHTML = '<div class="loading">Loading...</div>';

      try {
        const endpoint = currentTab === 'images' 
          ? \`/api/media-gallery/images?page=\${currentPage}&per_page=\${perPage}\${searchQuery ? '&search=' + encodeURIComponent(searchQuery) : ''}\`
          : \`/api/media-gallery/videos?page=\${currentPage}&per_page=\${perPage}\${searchQuery ? '&search=' + encodeURIComponent(searchQuery) : ''}\`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.success) {
          if (currentTab === 'images') {
            allImages = data.images || [];
            // Filter by project if selected
            if (currentProjectFilter) {
              allImages = allImages.filter(img => {
                // This would need metadata loaded separately
                return true; // Placeholder - will enhance with metadata loading
              });
            }
            renderImages(allImages);
            document.getElementById('imagesCount').textContent = data.pagination.total;
          } else {
            allVideos = data.videos || [];
            renderVideos(allVideos);
            document.getElementById('videosCount').textContent = data.pagination.total;
          }
          renderPagination(data.pagination);
        } else {
          content.innerHTML = \`<div class="empty">Error: \${data.error}</div>\`;
        }
      } catch (error) {
        content.innerHTML = \`<div class="empty">Error loading gallery: \${error.message}</div>\`;
      }
    }

    async function loadProjects() {
      try {
        const response = await fetch('/api/media-gallery/projects');
        const data = await response.json();
        
        if (data.success) {
          allProjects = data.projects || [];
          const projectSelect = document.getElementById('projectFilter');
          const metadataProjectSelect = document.getElementById('metadataProject');
          
          // Clear existing options except "All Projects"
          projectSelect.innerHTML = '<option value="">All Projects</option>';
          metadataProjectSelect.innerHTML = '<option value="">No Project</option>';
          
          allProjects.forEach(project => {
            const option1 = document.createElement('option');
            option1.value = project.project_id;
            option1.textContent = \`\${project.project_name} (\${project.media_count})\`;
            projectSelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = project.project_id;
            option2.textContent = project.project_name;
            metadataProjectSelect.appendChild(option2);
          });
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    function filterByProject() {
      currentProjectFilter = document.getElementById('projectFilter').value;
      loadGallery();
    }

    function renderImages(images) {
      const grid = document.getElementById('galleryContent');
      
      if (images.length === 0) {
        grid.innerHTML = '<div class="empty">No images found</div>';
        return;
      }

      grid.innerHTML = \`
        <div class="gallery-grid">
          \${images.map(img => \`
            <div class="media-item \${selectedItems.has(img.id) ? 'selected' : ''}" onclick="toggleSelect('\${img.id}')">
              <input type="checkbox" \${selectedItems.has(img.id) ? 'checked' : ''} onclick="event.stopPropagation(); toggleSelect('\${img.id}')">
              <img src="\${img.thumbnailUrl}" alt="\${img.filename}" class="media-thumbnail" onclick="event.stopPropagation(); viewMedia('\${img.id}', 'image')">
              <div class="media-info">
                <div class="media-title" title="\${img.filename}">\${img.filename}</div>
                <div class="media-meta">
                  <span>\${formatDate(img.uploaded)}</span>
                  <span>\${formatSize(img.size)}</span>
                </div>
                <div class="media-actions">
                  <button class="btn btn-secondary" onclick="event.stopPropagation(); viewMedia('\${img.id}', 'image')">View</button>
                  <button class="btn btn-secondary" onclick="event.stopPropagation(); editMetadata('\${img.id}', 'image')">Edit</button>
                  <button class="btn btn-danger" onclick="event.stopPropagation(); deleteItem('\${img.id}', 'image')">Delete</button>
                </div>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }

    function renderVideos(videos) {
      const grid = document.getElementById('galleryContent');
      
      if (videos.length === 0) {
        grid.innerHTML = '<div class="empty">No videos found</div>';
        return;
      }

      grid.innerHTML = \`
        <div class="gallery-grid">
          \${videos.map(video => \`
            <div class="media-item \${selectedItems.has(video.id) ? 'selected' : ''}" onclick="toggleSelect('\${video.id}')">
              <input type="checkbox" \${selectedItems.has(video.id) ? 'checked' : ''} onclick="event.stopPropagation(); toggleSelect('\${video.id}')">
              <img src="\${video.thumbnailUrl || 'https://via.placeholder.com/300x169?text=Video'}" alt="\${video.filename}" class="media-thumbnail" onclick="event.stopPropagation(); viewMedia('\${video.id}', 'video')">
              <div class="media-info">
                <div class="media-title" title="\${video.filename}">\${video.filename}</div>
                <div class="media-meta">
                  <span>\${formatDate(video.uploaded)}</span>
                  <span>\${formatDuration(video.duration)}</span>
                </div>
                <div class="media-actions">
                  <button class="btn btn-secondary" onclick="event.stopPropagation(); viewMedia('\${video.id}', 'video')">View</button>
                  <button class="btn btn-secondary" onclick="event.stopPropagation(); editMetadata('\${video.id}', 'video')">Edit</button>
                  <button class="btn btn-danger" onclick="event.stopPropagation(); deleteItem('\${video.id}', 'video')">Delete</button>
                </div>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }

    function renderPagination(pagination) {
      const paginationEl = document.getElementById('pagination');
      
      if (!pagination || pagination.totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
      }

      paginationEl.innerHTML = \`
        <button class="btn btn-secondary" \${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(\${currentPage - 1})">Previous</button>
        <span class="pagination-info">Page \${pagination.page} of \${pagination.totalPages} (\${pagination.total} total)</span>
        <button class="btn btn-secondary" \${!pagination.hasMore ? 'disabled' : ''} onclick="goToPage(\${currentPage + 1})">Next</button>
      \`;
    }

    function toggleSelect(id) {
      if (selectedItems.has(id)) {
        selectedItems.delete(id);
      } else {
        selectedItems.add(id);
      }
      updateSelectionInfo();
      loadGallery();
    }

    function selectAll() {
      const items = currentTab === 'images' ? allImages : allVideos;
      items.forEach(item => selectedItems.add(item.id));
      updateSelectionInfo();
      loadGallery();
    }

    function deselectAll() {
      selectedItems.clear();
      updateSelectionInfo();
      loadGallery();
    }

    function updateSelectionInfo() {
      const count = selectedItems.size;
      document.getElementById('selectedCount').textContent = count;
      document.getElementById('selectionText').textContent = \`\${count} item\${count !== 1 ? 's' : ''} selected\`;
      document.getElementById('selectionInfo').classList.toggle('active', count > 0);
      document.getElementById('deleteSelectedBtn').disabled = count === 0;
    }

    async function deleteItem(id, type) {
      if (!confirm(\`Are you sure you want to delete this \${type}?\`)) {
        return;
      }

      try {
        const endpoint = type === 'image'
          ? \`/api/media-gallery/images/delete?id=\${id}\`
          : \`/api/media-gallery/videos/delete?id=\${id}\`;

        const response = await fetch(endpoint, { method: 'DELETE' });
        const data = await response.json();

        if (data.success) {
          selectedItems.delete(id);
          updateSelectionInfo();
          await loadGallery();
        } else {
          alert(\`Error: \${data.error}\`);
        }
      } catch (error) {
        alert(\`Error deleting \${type}: \${error.message}\`);
      }
    }

    async function deleteSelected() {
      if (selectedItems.size === 0) return;
      
      if (!confirm(\`Are you sure you want to delete \${selectedItems.size} item(s)?\`)) {
        return;
      }

      try {
        const ids = Array.from(selectedItems);
        const endpoint = currentTab === 'images'
          ? '/api/media-gallery/images/bulk-delete'
          : '/api/media-gallery/videos/bulk-delete';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });

        const data = await response.json();

        if (data.success) {
          alert(\`Deleted \${data.deleted} item(s). \${data.failed > 0 ? \`Failed: \${data.failed}\` : ''}\`);
          selectedItems.clear();
          updateSelectionInfo();
          await loadGallery();
        } else {
          alert(\`Error: \${data.error}\`);
        }
      } catch (error) {
        alert(\`Error: \${error.message}\`);
      }
    }

    function viewMedia(id, type) {
      const item = (type === 'image' ? allImages : allVideos).find(i => i.id === id);
      if (!item) return;

      const modal = document.getElementById('mediaModal');
      const modalContent = document.getElementById('modalContent');
      const modalTitle = document.getElementById('modalTitle');

      modalTitle.textContent = item.filename || item.title || id;

      if (type === 'image') {
        modalContent.innerHTML = \`<img src="\${item.url}" alt="\${item.filename}" class="modal-image">\`;
      } else {
        modalContent.innerHTML = \`
          <video class="modal-video" controls>
            <source src="https://customer-8y3087qnrzz7ql2e.cloudflarestream.com/\${id}/manifest/video.m3u8" type="application/x-mpegURL">
          </video>
        \`;
      }

      modal.classList.add('active');
    }

    function closeModal() {
      document.getElementById('mediaModal').classList.remove('active');
    }

    async function editMetadata(id, type) {
      currentEditingId = id;
      currentEditingType = type;
      
      // Load existing metadata
      try {
        // For now, we'll start with empty form
        // Could enhance to load existing metadata from API
        document.getElementById('metadataTitle').value = '';
        document.getElementById('metadataDescription').value = '';
        document.getElementById('metadataAltText').value = '';
        document.getElementById('metadataMetaDescription').value = '';
        document.getElementById('metadataTags').value = '';
        document.getElementById('metadataKeywords').value = '';
        document.getElementById('metadataProject').value = '';
        document.getElementById('metadataNewProject').value = '';
      } catch (error) {
        console.error('Error loading metadata:', error);
      }
      
      document.getElementById('metadataModal').classList.add('active');
      document.getElementById('metadataModalTitle').textContent = \`Edit \${type === 'image' ? 'Image' : 'Video'} Metadata\`;
    }

    function closeMetadataModal() {
      document.getElementById('metadataModal').classList.remove('active');
      currentEditingId = null;
      currentEditingType = null;
    }

    async function saveMetadata(event) {
      event.preventDefault();
      
      if (!currentEditingId) return;

      const metadata = {
        title: document.getElementById('metadataTitle').value,
        description: document.getElementById('metadataDescription').value,
        alt_text: document.getElementById('metadataAltText').value,
        meta_description: document.getElementById('metadataMetaDescription').value,
        tags: document.getElementById('metadataTags').value.split(',').map(t => t.trim()).filter(t => t),
        keywords: document.getElementById('metadataKeywords').value.split(',').map(k => k.trim()).filter(k => k),
        project_id: document.getElementById('metadataProject').value || null,
        project_name: document.getElementById('metadataNewProject').value || 
                     (document.getElementById('metadataProject').value ? 
                      document.getElementById('metadataProject').selectedOptions[0]?.textContent.split(' (')[0] : null),
      };

      try {
        const endpoint = currentEditingType === 'image'
          ? '/api/media-gallery/images/metadata'
          : '/api/media-gallery/videos/metadata';

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentEditingId, metadata }),
        });

        const data = await response.json();

        if (data.success) {
          alert('Metadata saved successfully!');
          closeMetadataModal();
          await loadProjects();
          await loadGallery();
        } else {
          alert(\`Error: \${data.error}\`);
        }
      } catch (error) {
        alert(\`Error saving metadata: \${error.message}\`);
      }
    }

    function remasterSelected() {
      if (selectedItems.size === 0 || currentTab !== 'images') {
        alert('Please select images to remaster');
        return;
      }

      const selectedImages = allImages.filter(img => selectedItems.has(img.id));
      if (selectedImages.length === 0) {
        alert('No images selected');
        return;
      }

      // For now, remaster the first selected image
      // Could enhance to batch remaster
      currentRemasteringUrl = selectedImages[0].url;
      document.getElementById('remasterPrompt').value = 'Enhance this image: improve colors, lighting, and overall quality. Make it more professional and polished.';
      document.getElementById('remasterStyle').value = 'natural';
      document.getElementById('remasterPreview').style.display = 'none';
      document.getElementById('remasterStatus').innerHTML = '';
      
      document.getElementById('remasterModal').classList.add('active');
    }

    function closeRemasterModal() {
      document.getElementById('remasterModal').classList.remove('active');
      currentRemasteringUrl = null;
    }

    async function executeRemaster() {
      if (!currentRemasteringUrl) return;

      const prompt = document.getElementById('remasterPrompt').value;
      const style = document.getElementById('remasterStyle').value;
      const statusDiv = document.getElementById('remasterStatus');
      const previewDiv = document.getElementById('remasterPreview');
      const previewImg = document.getElementById('remasterPreviewImg');

      statusDiv.innerHTML = '<div class="loading">Remastering with OpenAI...</div>';

      try {
        const response = await fetch('/api/media-gallery/remaster', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: currentRemasteringUrl,
            prompt: prompt,
            style: style,
          }),
        });

        const data = await response.json();

        if (data.success) {
          statusDiv.innerHTML = \`<div style="color: var(--success); font-weight: 600;">✅ Remastered successfully!</div>\`;
          
          if (data.remasteredUrl) {
            previewImg.src = data.remasteredUrl;
            previewDiv.style.display = 'block';
          }

          if (data.cloudflareImageId) {
            statusDiv.innerHTML += \`<div style="margin-top: var(--space-2); color: var(--text-secondary); font-size: 0.875rem;">Uploaded to Cloudflare Images: \${data.cloudflareImageId}</div>\`;
            setTimeout(() => {
              closeRemasterModal();
              refreshGallery();
            }, 2000);
          }
        } else {
          statusDiv.innerHTML = \`<div style="color: var(--error);">Error: \${data.error}</div>\`;
        }
      } catch (error) {
        statusDiv.innerHTML = \`<div style="color: var(--error);">Error: \${error.message}</div>\`;
      }
    }

    function goToPage(page) {
      currentPage = page;
      loadGallery();
    }

    function handleSearch() {
      searchQuery = document.getElementById('searchInput').value;
      currentPage = 1;
      loadGallery();
    }

    function refreshGallery() {
      selectedItems.clear();
      updateSelectionInfo();
      loadGallery();
    }

    function formatDate(dateString) {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }

    function formatSize(bytes) {
      if (!bytes) return 'Unknown';
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    function formatDuration(seconds) {
      if (!seconds) return 'Unknown';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Load initial gallery and projects
    loadProjects();
    loadGallery();
  </script>
</body>
</html>
  `;
}
