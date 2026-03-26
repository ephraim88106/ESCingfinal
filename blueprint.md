# Blueprint: EPHRAIM STUDY CAFE - Premium Concierge

## Overview
A modern, framework-less web application for study cafe concierge services, featuring branch selection, inquiry submission, and status tracking. Built with HTML, CSS, and JavaScript, utilizing Firebase for real-time data management.

## Project Outline
- **Design:** Premium, tactile feel with subtle noise textures and multi-layered shadows.
- **Features:**
  - Branch selection (계양직영점, 박촌역점, 부천상동점, 부천신중동점).
  - Main dashboard for concierge services.
  - Inquiry/Complain forms for payment, study rooms, lockers, and general inquiries.
  - **Phone Number Integration:** Each inquiry form now requires a phone number to ensure administrators can contact users for feedback or confirmation.
  - History tracking for user inquiries (stored in `sessionStorage` keys).
  - **Telegram Real-time Notifications:** 
    - Integrated Telegram Bot API to send instant alerts to administrators when a new inquiry is submitted.
    - Notifications include branch name, category, seat number, **phone number**, and content.
  - **Admin Dashboard:** Real-time monitoring of inquiries with the ability to mark as completed and view user contact information.
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
   - Primary Hosting: **Cloudflare Pages** (`https://escadmin.pages.dev`)
   - Backend/Database: Firebase Realtime Database (`esc-info-92948`)
   - Status: Active and Automatically updated via GitHub push.
