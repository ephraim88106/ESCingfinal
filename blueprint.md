# Blueprint: EPHRAIM STUDY CAFE - Premium Concierge

## Overview
A modern, framework-less web application for study cafe concierge services, featuring branch selection, inquiry submission, and status tracking. Built with HTML, CSS, and JavaScript, utilizing Firebase for real-time data management.

## Project Outline
- **Design:** Premium, tactile feel with subtle noise textures and multi-layered shadows.
- **Features:**
  - Branch selection (계양직영점, 박촌역점, 부천상동점, 부천신중동점, 부평삼산점).
  - Main dashboard for concierge services.
  - Inquiry/Complain forms for payment, study rooms, lockers, and general inquiries.
  - **Brand Story (About Us):**
    - Detailed brand narrative emphasizing premium quality, professional care, and localized identity.
    - Accessible from the branch selection screen footer and main dashboard promo banner.
  - **Phone Number Integration:** Each inquiry form now requires a phone number to ensure administrators can contact users for feedback or confirmation.
  - History tracking for user inquiries (stored in `sessionStorage` keys).
  - **Telegram Real-time Notifications:** 
    - Integrated Telegram Bot API to send instant alerts to administrators when a new inquiry is submitted.
    - Notifications include branch name, category, seat number, **phone number**, and content.
  - **Premium Admin Dashboard:** 
    - Real-time monitoring of inquiries with prioritized "Pending" status.
    - Advanced filtering by Branch (e.g., 계양직영점) and Category (e.g., 소음, 예약문의).
    - User contact information display with direct "Call" functionality.
    - CSV export feature for data backup and management.
    - Secure password protection (`12123ska`).
  - **AdSense Optimization:**
    - Added rich text sections to the landing screen to increase "publisher content" value.
    - Implemented benefit-driven information architecture to reduce "navigation-only" feel.
    - Added `robots.txt` for better crawler indexing.
    - Optimized header tags (H1, H2) for SEO.
  - **Banner Slideshow Integration:**
    - Integrated a specialized promotional slide within the main dashboard banner.
    - Added an external affiliate link (Coupang) for study-related essential items.
    - Updated CSS animations to support a multi-slide transition (3 slides).
- **Tech Stack:**
  - HTML5, CSS3 (Modern Baseline features like Variables, Gradients).
  - JavaScript (ES Modules, Async/Await).
  - Firebase Realtime Database (integrated via CDN).
  - Font Awesome for iconography.

## Current Plan: Completed Brand Story Enhancement
1. **Update Brand Story Content:**
   - Replaced placeholder text in `#screen-about` with the official brand story.
   - Improved visual layout and typography for better readability and premium feel using Playfair Display and accent styling.
   - Structured content around the three pillars: Premium Standard, Professional Care, and Localized Identity.
2. **Verification:**
   - Verified navigation from both the branch selection screen and the main screen promo banner.
   - Confirmed layout adapts well to the mobile-first design (375px width).
