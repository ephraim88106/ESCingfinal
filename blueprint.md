# Blueprint: EPHRAIM STUDY CAFE - Premium Concierge

## Overview
A modern, framework-less web application for study cafe concierge services, featuring branch selection, inquiry submission, and status tracking. Built with HTML, CSS, and JavaScript, utilizing Firebase for real-time data management.

## Project Outline
- **Design:** Premium, tactile feel with subtle noise textures and multi-layered shadows.
- **Features:**
  - Branch selection (계양직영점, 박촌역점, 부천상동점, 부천신중동점, 부평삼산점).
  - Main dashboard for concierge services.
  - Inquiry/Complain forms for study rooms, lockers, and general inquiries.
  - **Google Tag Manager Integration:**
    - Integrated Google Tag (gtag.js) with ID `G-XE9JJV0QYP` into `index.html` and `admin.html`.
    - Enables tracking and analytics for user interactions across the application.
  - **Payment Info:** Removed inquiry form from the payment screen to streamline the interface, directing users to other specialized inquiry channels if needed.
  - **Brand Story (About Us):**
    - Detailed brand narrative emphasizing premium quality, professional care, and localized identity.
    - Accessible from the branch selection screen footer and main dashboard promo banner.
  - **Phone Number Integration:** Each inquiry form requires a phone number to ensure administrators can contact users for feedback or confirmation.
  - History tracking for user inquiries (stored in `sessionStorage` keys).
  - **Telegram Real-time Notifications:** 
    - Integrated Telegram Bot API to send instant alerts to administrators when a new inquiry is submitted.
    - **Enhanced Category Visibility:** Notifications now include the inquiry category in the header (e.g., `🔔 [에브라임 - 소음]`) for immediate identification.
    - Notifications include branch name, category, seat number, phone number, and content.
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
    - Added mandatory Coupang Partners disclaimer text below all promotional banners for legal compliance.
- **Tech Stack:**
  - HTML5, CSS3 (Modern Baseline features like Variables, Gradients).
  - JavaScript (ES Modules, Async/Await).
  - Firebase Realtime Database (integrated via CDN).
  - Font Awesome for iconography.

## Current Plan: UI Cleanup and Notification Enhancement
1. **Remove Payment Inquiry Form:**
   - Removed the contact input, inquiry textarea, and submit button from the '이용권 요금 안내' screen as requested.
2. **Enhance Telegram Notifications:**
   - Updated the notification payload to include the specific category in the message header for faster recognition by administrators.
3. **Verification:**
   - Confirmed the payment screen is now informative only.
   - Verified that all other inquiry screens still function and capture the necessary category/contact information.
