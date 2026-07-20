<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:wild-gaming-cafe-rules -->
# Wild Gaming Cafe Architecture & Rules

## 1. Design System & Aesthetics
* **Theme:** Deep dark mode interface (`bg-[#050505]`, `bg-[#0A0A0A]`, `bg-[#111111]`).
* **Accent Color:** Wild Gaming Yellow (`text-accent` / `bg-accent` -> `#F4B000`).
* **Typography:** `Poppins` for headings (`.heading-style`), `Montserrat` for body text.
* **Buttons:** ALWAYS use the global button classes defined in `globals.css`:
  * `.brand-button-primary` -> Solid White (Hover: Yellow)
  * `.brand-button-secondary` -> Solid Yellow (Hover: Darker Yellow)
  * `.brand-button-outline` -> Outline Border (Hover: Yellow border/text)

## 2. Admin Dashboard Architecture
* **Access:** The dashboard is hidden at `/admin`. Never link to it from public navigation.
* **Layout:** The Admin Layout (`app/admin/layout.tsx`) completely strips away the public Navbar and Footer, replacing it with the `Sidebar.tsx` navigation.
* **Data Persistence (MVP):** Use `local-db.json` via Next.js API Routes (`/api/db`) for all CRUD operations. Do NOT use browser-memory storage. Design the API routes so we can easily swap JSON for Supabase later.

## 3. The Trash System (Soft Deletes)
* **Rule:** NEVER immediately permanently delete records from modules (Events, Games, etc).
* **Action:** When deleting, always trigger a Soft Delete by setting `status: "Trashed"`. 
* **API:** Use `PUT /api/db` with `{ collection, id, status: "Trashed" }`.
* **Global Trash:** The Trash Module (`/admin/trash`) handles permanent deletions.

## 4. Media Library Strategy
* **Rule:** NEVER build separate file uploaders inside individual modules.
* **Action:** All image/video fields in Admin modules MUST trigger the shared `MediaPickerModal.tsx`.
* **Storage:** Store BOTH the `imageId` and `imageUrl` in the parent module's database record to allow for fast frontend rendering while maintaining strict database relationships.

## 5. UI Behaviors
* **Scrolling:** Global CSS ensures that `section[id]` has a `scroll-margin-top: 120px` to prevent fixed navbars from hiding section headers. Do not manually add Tailwind scroll margins to sections.
<!-- END:wild-gaming-cafe-rules -->
