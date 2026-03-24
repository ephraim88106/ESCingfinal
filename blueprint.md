# Blueprint: EPHRAIM STUDY CAFE - Premium Concierge

## Overview
A modern, framework-less web application for study cafe concierge services, featuring branch selection, inquiry submission, and status tracking. Built with HTML, CSS, and JavaScript, utilizing Firebase for real-time data management.

## Project Outline
- **Design:** Premium, tactile feel with subtle noise textures and multi-layered shadows.
- **Features:**
  - Branch selection (계양직영점, 박촌역점, 부천상동점, 부천신중동점).
  - Main dashboard for concierge services.
  - Inquiry/Complain forms for payment, study rooms, lockers, and general inquiries.
  - History tracking for user inquiries (stored in `sessionStorage` keys).
  - **Auto-rotating Promotion Banners:** Redesigned with neutral class names (e.g., `promo-banner-container`) to prevent interference from ad-blockers and Cloudflare's Rocket Loader.
- **Tech Stack:**
  - HTML5, CSS3 (Modern Baseline features like Variables, Gradients).
  - JavaScript (ES Modules, Async/Await).
  - Firebase Realtime Database (integrated via CDN).
  - Font Awesome for iconography.

## Current Plan: Fix Banner and Synchronization
1. **Fix Banner Reliability:**
   - Renamed all "ad" related classes to "promo" or "notice" to avoid ad-blocker detection.
   - Moved all JavaScript logic from `index.html` to `main.js`.
   - Wrapped initialization in `DOMContentLoaded` for better reliability in cloud environments.
2. **GitHub Synchronization:**
   - Linked local repository to `https://github.com/ephraim88106/ESCingfinal.git`.
   - Committed all current changes.
   - Pushed to `main` branch.
3. **Deployment:**
   - Configured `firebase.json` and `.firebaserc`.
   - (Pending) Deployment to Firebase Hosting (requires user authentication).
