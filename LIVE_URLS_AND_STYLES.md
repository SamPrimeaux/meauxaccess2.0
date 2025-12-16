# 🌐 Live URLs & Proposed Styles

**Base URL**: `https://meauxaccess-dashboard-dev.meauxbility.workers.dev`

---

## 📊 **Dashboard Routes** (MeauxAccess Theme - Purple)

All dashboard routes use the **MeauxAccess Purple Theme** with consistent styling:

### **Design System:**
- **Primary Color**: `#667eea` (Purple)
- **Primary Dark**: `#5568d3`
- **Primary Light**: `#8b9eff`
- **Theme**: Light/Dark mode support
- **Layout**: Sidebar navigation (260px) + Main content area
- **Typography**: System font stack (San Francisco, Segoe UI, Roboto)
- **Spacing**: 8px base unit system
- **Border Radius**: 8px (standard), 12px (large)
- **Shadows**: Subtle elevation system (sm, md, lg, xl)

---

## 🏠 **Core Dashboard Pages**

### 1. **Dashboard Overview**
**URL**: `/dashboard` or `/`

**Style**:
- **Layout**: Full-width content with 4-column stats grid
- **Components**: 
  - Stat cards with icons (📊, 👥, ☁️, ⚡)
  - Recent activity feed
  - Action buttons (MeauxCloud Theme, Export, New Project)
- **Color Scheme**: Purple primary with neutral backgrounds
- **Typography**: Large page title (1.875rem), subtitle (0.875rem)
- **Cards**: White/dark surface with subtle borders and shadows

---

### 2. **Work Section**

#### **Projects** - `/dashboard/work/projects`
**Style**:
- **Layout**: Grid/list view of project cards
- **Components**: Project cards with thumbnails, badges (12 projects badge)
- **Actions**: "New Project" button (purple primary), "Configure view" button
- **Color**: Purple accent for active states

#### **Board** - `/dashboard/work/board`
**Style**:
- **Layout**: Kanban board (3 columns: To Do, In Progress, Done)
- **Components**: Task cards, drag-and-drop ready
- **Color**: Purple for primary actions, neutral for columns
- **Typography**: Column headers, task titles

#### **Library** - `/dashboard/work/library`
**Style**:
- **Layout**: File browser with categories (Templates, Assets, Documentation)
- **Components**: File cards with icons (📄, 🖼️, 📚)
- **Actions**: "Refresh" and "Upload" buttons
- **Color**: Neutral backgrounds with purple accents

#### **Docs** - `/dashboard/work/docs`
**Style**:
- **Layout**: Document list with metadata
- **Components**: Document cards with "Open" buttons
- **Actions**: "New Doc" button
- **Color**: Consistent with library styling

---

### 3. **MeauxApps Section**

#### **All Apps** - `/dashboard/apps`
**Style**:
- **Layout**: Grid of app cards (3 columns)
- **Components**: Large app icons (📸, 📐, ☁️) with titles
- **Color**: Purple hover states, neutral cards
- **Typography**: App names, descriptions

#### **MeauxPhoto** - `/dashboard/apps/photo`
**Style**:
- **Layout**: Simple centered content
- **Components**: "Open Gallery" button (purple primary)
- **Actions**: Redirects to `/meauxphoto` or `/media-gallery`
- **Color**: Purple primary button

#### **MeauxCAD** - `/dashboard/apps/cad`
**Style**:
- **Layout**: Coming soon placeholder
- **Components**: "New Design" button
- **Color**: Purple accents

#### **MeauxCloud** - `/dashboard/apps/cloud`
**Style**:
- **Layout**: Coming soon placeholder
- **Components**: "Upload Files" button
- **Color**: Purple accents

---

### 4. **MeauxDev Section**

#### **Dev Console** - `/dashboard/dev`
**Style**:
- **Layout**: Terminal-style interface
- **Components**: Command input, console output area
- **Color**: Dark terminal aesthetic (dark background, green text)
- **Typography**: Monospace font for commands
- **Badge**: "NEW" badge on nav item

#### **Integrations** - `/dashboard/dev/integrations`
**Style**:
- **Layout**: Grid of integration cards
- **Components**: Integration cards (OpenAI, Gemini, Resend) with "Connected" badges
- **Actions**: "Configure" buttons
- **Color**: Green for connected status, purple for actions

---

### 5. **MeauxChat Section**

#### **Talk (Ecosystem Chat)** - `/dashboard/chat`
**Style**:
- **Layout**: Split-pane chat interface
- **Components**: 
  - Channel sidebar (200px)
  - Message area with welcome screen
  - Input area at bottom
- **Color**: Purple for active channels, neutral for messages
- **Typography**: Chat bubbles, timestamps
- **Badge**: "3" unread messages badge

#### **Mail** - `/dashboard/chat/mail`
**Style**:
- **Layout**: Email inbox list
- **Components**: Email cards with sender, subject, date
- **Actions**: "Compose" button
- **Color**: Purple for unread indicators

#### **Calendar** - `/dashboard/chat/calendar`
**Style**:
- **Layout**: Calendar grid view
- **Components**: Month view with date cells
- **Actions**: "New Event" button
- **Color**: Purple for current date, neutral for grid

#### **Meet** - `/dashboard/chat/meet`
**Style**:
- **Layout**: Coming soon placeholder
- **Components**: "New Meeting" button
- **Color**: Purple accents

---

### 6. **AutoMeaux Section**

#### **Automation** - `/dashboard/auto`
**Style**:
- **Layout**: Automation workflow list
- **Components**: Workflow cards
- **Actions**: "New Automation" button
- **Color**: Purple for primary actions

#### **Pipeline** - `/dashboard/auto/pipeline`
**Style**:
- **Layout**: CI/CD pipeline visualization
- **Components**: Pipeline stages, status indicators
- **Actions**: "New Pipeline" button
- **Color**: Green for success, red for failure, purple for actions

#### **Prompts** - `/dashboard/auto/prompts`
**Style**:
- **Layout**: Prompt library grid
- **Components**: Prompt cards (Code Review, Documentation)
- **Actions**: "Use Prompt" buttons, "New Prompt" button
- **Color**: Purple for primary actions

---

### 7. **Email & Clients Section**

#### **Resend Domains** - `/dashboard/resend/domains`
**Style**:
- **Layout**: Domain list with verification status
- **Components**: Domain cards with status badges
- **Actions**: "Refresh" button
- **Color**: Green for verified, yellow for pending
- **Badge**: "8" domains count badge

#### **Email Logs** - `/dashboard/resend/emails`
**Style**:
- **Layout**: Email log table/list
- **Components**: Email rows with status, timestamp
- **Actions**: "Refresh" button
- **Color**: Status colors (sent, failed, pending)

#### **Clients** - `/dashboard/resend/clients`
**Style**:
- **Layout**: Client cards grid
- **Components**: Client cards with name, email, company
- **Actions**: "New Client" button (opens modal)
- **Color**: Purple for primary actions

---

### 8. **Account Section**

#### **Settings** - `/dashboard/account/settings`
**Style**:
- **Layout**: Form-based settings page
- **Components**: 
  - Account settings form (Email, Name, Role)
  - Preferences toggles (Dark Mode, Email Notifications)
- **Actions**: "Save Changes" button
- **Color**: Purple for primary button, neutral for inputs

#### **Vault** - `/dashboard/account/vault`
**Style**:
- **Layout**: Secret list with masked values
- **Components**: Secret cards with lock icons (🔐)
- **Actions**: "View" buttons, "Add Secret" button
- **Color**: Purple for actions, neutral for secrets

---

## 🎨 **Additional Routes**

### **Media Gallery** - `/media-gallery` or `/gallery` or `/meauxphoto`
**Style**:
- **Layout**: Grid of images/videos (50 per page)
- **Components**: 
  - Media thumbnails
  - Search bar
  - Bulk actions toolbar
  - Modal viewer
- **Color**: Purple for actions, neutral for grid
- **Typography**: Image metadata, pagination

### **iAccess Dashboard** - `/iaccess`
**Style**:
- **Theme**: Teal/Orange accent (different from MeauxAccess purple)
- **Layout**: Similar sidebar + main content
- **Pages**: 13-page platform (Analytics, AI Gateway, Workers, Databases, etc.)
- **Color**: Teal primary (`#14b8a6`), Orange accent (`#f97316`)

### **Pricing** - `/pricing`
**Style**:
- **Layout**: Pricing cards grid
- **Components**: Plan cards with features
- **Color**: Purple for primary CTA buttons

### **Deploy/Templates** - `/deploy` or `/templates`
**Style**:
- **Layout**: Template gallery
- **Components**: Template cards with previews
- **Color**: Purple for deploy actions

---

## 🎯 **Common Design Patterns**

### **Navigation**
- **Sidebar**: 260px width, collapsible to 60px
- **Active State**: Purple background (`--primary-alpha`), purple left border
- **Hover State**: Light background (`--neutral-50`)
- **Badges**: Small rounded badges with counts or labels

### **Buttons**
- **Primary**: Purple background (`#667eea`), white text
- **Secondary**: Neutral background, border, text
- **Ghost**: Transparent, text only
- **Hover**: Darker shade, slight elevation

### **Cards**
- **Background**: White (light) / Dark gray (dark mode)
- **Border**: 1px solid `--border-color`
- **Shadow**: `--shadow-sm` for subtle elevation
- **Border Radius**: `--border-radius-lg` (12px)

### **Modals**
- **Overlay**: Semi-transparent black (`rgba(0, 0, 0, 0.5)`)
- **Content**: White/dark surface, rounded corners, shadow-xl
- **Close**: X button in header, click outside to close

### **Forms**
- **Inputs**: Border, rounded, padding
- **Focus**: Purple border, shadow ring
- **Labels**: Medium weight, above inputs

### **Typography**
- **Page Title**: 1.875rem (30px), bold
- **Subtitle**: 0.875rem (14px), secondary color
- **Body**: 0.875rem (14px), regular
- **Small**: 0.75rem (12px), tertiary color

---

## 🌓 **Theme Support**

All pages support **Light** and **Dark** modes:
- **Toggle**: Header icon button
- **Persistence**: Cookie-based storage
- **Transition**: Smooth color transitions (250ms)
- **Dark Mode**: Inverted color scheme with adjusted shadows

---

## 📱 **Responsive Design**

- **Desktop**: Full sidebar + main content
- **Tablet** (< 1200px): Hidden command palette, simplified header
- **Mobile** (< 768px): 
  - Hamburger menu
  - Collapsible sidebar (overlay)
  - Single column layouts
  - Full-width modals

---

## 🎨 **Color Palette Reference**

### **Light Theme**
- Primary: `#667eea` (Purple)
- Background: `#f9fafb` (Neutral-50)
- Surface: `#ffffff` (White)
- Text Primary: `#111827` (Neutral-900)
- Text Secondary: `#6b7280` (Neutral-500)
- Border: `#e5e7eb` (Neutral-200)

### **Dark Theme**
- Primary: `#8b9eff` (Light Purple)
- Background: `#111827` (Neutral-50 inverted)
- Surface: `#1f2937` (Neutral-100 inverted)
- Text Primary: `#ffffff` (White)
- Text Secondary: `#d1d5db` (Neutral-600 inverted)
- Border: `#374151` (Neutral-200 inverted)

---

**Last Updated**: December 16, 2025  
**Version**: Dev Worker (meauxaccess-dashboard-dev)

