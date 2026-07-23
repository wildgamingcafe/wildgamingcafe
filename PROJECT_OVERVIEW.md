# Wild Gaming Cafe 🎮
**Project Overview & Development Summary**

Welcome to the internal documentation for **Wild Gaming Cafe**, a premium, high-performance web platform built for a premier Esports and Gaming lounge. This document outlines the project architecture, the core technology stack, and the major milestones achieved during development.

---

## 🛠️ Technology Stack
This platform is built on a cutting-edge, modern web stack designed for speed, scalability, and an ultra-premium user experience.

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Components)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom configured for a pure Dark Mode aesthetic)
- **Database Backend:** [Supabase](https://supabase.com/) (PostgreSQL for Registrations and Events) & Local JSON File-system APIs for rapid MVP prototyping (Hall of Fame, Community Moments).
- **Icons:** [Lucide React](https://lucide.dev/)
- **Media Optimization:** Next.js `<Image>` and `<video>` handlers for blazing-fast asset loading.

---

## 🎨 Design System & Aesthetics
The UI was meticulously crafted to scream "Premium Esports."
- **Deep Dark Mode:** We strictly utilized deep blacks (`#050505`, `#0A0A0A`) rather than generic grays to create contrast.
- **Wild Gaming Yellow:** The brand's signature accent color (`#F4B000`) is used strategically for buttons, alerts, and hover states.
- **Typography:** `Poppins` for punchy, aggressive headers and `Montserrat` for highly readable body text.
- **Aspect Ratios:** Strict enforcement of `16:9` (`aspect-video`) containers ensures all game wallpapers (Valorant, CS2, FC25) look like professional YouTube thumbnails without awkward cropping.

---

## 🚀 Major Modules & Features Built

### 1. The Public Facing Website (Player Portal)
- **Cinematic Entry:** Built a full-screen Intro Video overlay (`IntroVideo.tsx`) that plays seamlessly on the first visit (managed via `sessionStorage`) and fades gracefully into the homepage.
- **Tournament Showcase:** A dynamic, multi-tiered display of tournaments categorizing events into **Ongoing/Live**, **Upcoming**, and **Completed/Archive**. 
- **Automated Registration Forms:** A smart registration page that dynamically scales entry pricing based on whether a user registers as a Solo player or a Full Team, instantly doing the math on the front end.
- **Global Leaderboard & Hall of Fame:** A dedicated tribute to the best players in the cafe (e.g., *Blaze Reapers* holding Rank #1).
- **Game Library & Voting:** A visual grid of games available to play at the cafe, complete with a "Request Game" feature for community feedback.

### 2. The Admin Dashboard (Management Portal)
- **Event Management (CRUD):** A powerful interface (`/admin/events`) to create, update, and manage tournaments. Features custom JSON `rules` payloads to store complex rulesets (team size limits, per-player pricing) safely in Supabase.
- **The Matchmaker & Auto-Shuffler:** The crown jewel of the admin side. A dedicated dashboard for every single tournament (`/admin/events/[id]/registrations`) that allows organizers to track incoming teams. It features a brilliant **Auto-Shuffle** algorithm that automatically groups unassigned Solo players into perfectly sized teams (e.g., 5-man CS2 squads).
- **Global Registrations Tracking:** The "Cashier View" (`/admin/registrations`). An accordion-based UI that groups all incoming registrations by event, allowing front-desk staff to instantly mark players as "Paid" or fix typos in their In-Game Names (IGNs).
- **Soft-Delete Architecture:** Implemented a global Trash system where deleted records are moved to a `status: "Trashed"` state rather than permanent deletion, preventing accidental data loss.

---

## 🔧 Database & Architectural Shifts
Throughout development, the project evolved significantly:
1. **From Static to Dynamic:** We successfully migrated the core tournament data from a static `local-db.json` structure to a robust **Supabase PostgreSQL** architecture.
2. **Cache Busting:** Next.js 15 caches heavily by default. We implemented strict `export const dynamic = 'force-dynamic';` rules on the Registration and Matchmaker dashboards to ensure that when a player pays and registers, the Admin sees it instantly without needing to clear the server cache.
3. **Mock Data Injection:** Built powerful backend Node scripts (`insert_mock_events_v3.mjs`) to programmatically inject beautifully structured mock events and players, ensuring the UI could be thoroughly stress-tested for maximum capacity limits.

---
*Documented on July 23, 2026 for the Wild Gaming Cafe Team.*
