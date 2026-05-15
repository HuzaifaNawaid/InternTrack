# InternTrack — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Finalized  
**Project Type:** Full-Stack SaaS Platform  
**Last Updated:** 2025

---

## 1. Project Overview & Identity

### What is InternTrack?

InternTrack ek **centralized internship management platform** hai jo Pakistani university students ko corporate sector se seedha connect karta hai. Abhi students WhatsApp groups, LinkedIn, aur random websites pe internships dhundte hain — sab kuch fragmented aur untracked hota hai.

InternTrack is problem ko solve karta hai by providing:

- Students ke liye ek **smart dashboard** jahan woh apply kar sakein, track kar sakein, aur grow kar sakein
- Companies ke liye ek **hiring pipeline** jahan woh listings post karein aur applicants manage karein
- Admins ke liye ek **control center** jahan platform integrity maintain ho

### Core Identity

| Property | Value |
|----------|-------|
| Platform Name | InternTrack |
| Target Market | Pakistani universities + corporate sector |
| Primary Users | Students, Companies, Admins |
| Platform Type | SaaS (Software as a Service) |
| Design Philosophy | Clean, data-driven, professional |

### User Roles

- **Student** — internship dhundhta hai, apply karta hai, track karta hai
- **Company** — listings post karta hai, applicants manage karta hai
- **Admin** — platform oversee karta hai, users verify/ban karta hai

---

## 2. Technical Stack (Strict Constraints)

### Core Technologies

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14+ (App Router) | TypeScript strict mode |
| Styling | Tailwind CSS | Utility-first, responsive |
| UI Components | Stitch UI | SaaS-grade design system |
| Database | Neon PostgreSQL | Serverless, edge-compatible |
| DB Access | `@neondatabase/serverless` | **Raw SQL only — NO ORMs** |
| Backend Logic | Next.js Server Actions | All mutations + queries |
| Auth | Custom JWT / NextAuth | Role-based sessions |
| Deployment | Vercel | Edge-optimized |

### Hard Constraints

- **NO Prisma, NO Drizzle, NO Sequelize** — raw SQL only, every single query
- All DB calls go through Server Actions (no API routes for mutations)
- Parameterized queries mandatory (`$1, $2` syntax) — SQL injection prevention
- TypeScript strict mode — no `any` types
- Mobile-first responsive design

### Environment Variables Required

```env
DATABASE_URL=postgresql://...@neon.tech/interntrack
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## 3. Database Schema (Raw SQL Architecture)

### Design Principles

- All tables use `UUID` primary keys
- `created_at` / `updated_at` on every table
- Foreign keys enforced at DB level
- No soft deletes — `is_banned` / `is_active` flags instead
- Raw SQL only — all queries written manually

### Tables

#### `users` — Central auth table

```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  is_banned   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

#### `students` — Student profile data

```sql
CREATE TABLE students (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name           TEXT NOT NULL,
  university          TEXT,
  semester            INTEGER,
  skills              TEXT[],
  cv_url              TEXT,
  bio                 TEXT,
  profile_score       INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);
```

#### `companies` — Company profiles

```sql
CREATE TABLE companies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  website      TEXT,
  city         TEXT,
  is_verified  BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
```

#### `listings` — Internship postings

```sql
CREATE TABLE listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID REFERENCES companies(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  city          TEXT,
  stipend       INTEGER,
  skills        TEXT[],
  deadline      DATE NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

#### `applications` — Student applications

```sql
CREATE TABLE applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID REFERENCES students(id) ON DELETE CASCADE,
  listing_id   UUID REFERENCES listings(id) ON DELETE CASCADE,
  status       TEXT DEFAULT 'applied' CHECK (
                 status IN ('applied', 'shortlisted', 'interview', 'offered', 'rejected')
               ),
  applied_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, listing_id)
);
```

#### `reviews` — Company reviews by students

```sql
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES students(id) ON DELETE CASCADE,
  company_id      UUID REFERENCES companies(id) ON DELETE CASCADE,
  culture_rating  INTEGER CHECK (culture_rating BETWEEN 1 AND 5),
  learning_rating INTEGER CHECK (learning_rating BETWEEN 1 AND 5),
  stipend_rating  INTEGER CHECK (stipend_rating BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, company_id)
);
```

### Key SQL Patterns Used

**Deadline badge logic (zero extra table):**

```sql
SELECT
  id,
  title,
  deadline,
  CASE
    WHEN deadline = CURRENT_DATE           THEN 'closing_today'
    WHEN deadline <= CURRENT_DATE + 3      THEN 'closing_soon'
    ELSE                                        'open'
  END AS deadline_badge
FROM listings
WHERE is_active = true;
```

**Student dashboard stats:**

```sql
SELECT
  status,
  COUNT(*) AS count
FROM applications
WHERE student_id = $1
GROUP BY status;
```

**Company average ratings:**

```sql
SELECT
  AVG(culture_rating)  AS avg_culture,
  AVG(learning_rating) AS avg_learning,
  AVG(stipend_rating)  AS avg_stipend,
  COUNT(*)             AS total_reviews
FROM reviews
WHERE company_id = $1;
```

---

## 4. Feature Modules

### Module 1 — Register / Login with Roles

**Status:** Core (build first)  
**Difficulty:** Easy

- Student registers with `.edu.pk` email or any email
- Company registers and waits for admin verification
- Role selection at signup (student / company)
- Admin account seeded via migration
- JWT session with role stored
- Protected routes via middleware

### Module 2 — Student Public Profile

**Status:** Core  
**Difficulty:** Easy

- Full name, university, semester, bio
- Skills tags (array, multi-select)
- CV upload (PDF — stored as URL)
- Profile completion score (calculated: fields filled / total fields × 100)
- Visible to companies when they view applicants

### Module 3 — Student Application Dashboard

**Status:** Core  
**Difficulty:** Easy

- Colorful stat cards: Total Applied, Shortlisted, Rejected, Offered
- Pie chart showing application status distribution
- Data pulled via `COUNT + GROUP BY` on `applications` table
- One-click apply like LinkedIn (pre-filled from profile)
- Application history list with company name + status badge

### Module 4 — Company Public Page

**Status:** Core  
**Difficulty:** Easy

- Active listings displayed on company's public page
- Average rating (culture, learning, stipend) shown as stars
- Sentiment tags auto-generated from reviews (e.g., "Great Culture", "Low Stipend")
- Student tips / review snippets visible
- All data aggregated from existing tables — no extra schema needed

### Module 5 — Company Kanban Hiring Board

**Status:** Core  
**Difficulty:** Medium

- Company sees all applicants per listing
- Kanban columns: Applied → Shortlisted → Interview → Offered → Rejected
- button-based status update
- Click applicant card → view their public profile 
- Status update via Server Action → raw SQL `UPDATE applications SET status = $1`

### Module 6 — Search & Filter Listings

**Status:** Core  
**Difficulty:** Medium

- Students can search by: role/title, city, stipend range, skills, deadline
- Strategy Pattern for filter composition
- Raw SQL `WHERE` clause built dynamically with parameterized inputs
- Deadline badge shown on every listing card (🔴 🟡 🟢)
- No external search library — pure SQL filtering

### Module 7 — Listing Deadline Badge

**Status:** Core  
**Difficulty:** Easy

- Auto-calculated from `deadline` column
- 🔴 "Closing Today" — deadline = today
- 🟡 "3 Days Left" — deadline within 3 days
- 🟢 "Open" — deadline > 3 days away
- Zero extra table — pure SQL `CASE WHEN` logic
- Shown on all listing cards across the platform

### Module 8 — Company Reviews & Ratings

**Status:** Core  
**Difficulty:** Easy

- Only students who completed an internship can review (verified via `offered` status)
- Rate: Culture (1–5), Learning (1–5), Stipend (1–5)
- Write comment/tip
- All students can read reviews on company public page
- One review per student per company (enforced by `UNIQUE` constraint)

### Module 9 — Admin Analytics Dashboard

**Status:** Core  
**Difficulty:** Medium

- Platform stats: total students, companies, listings this month
- Most applied-to listings (top 5)
- Top reviewed companies (highest avg rating)
- Ban history log
- Manual ban: student (for abusive reviews) or company (for fake listings)
- Visual charts (bar + pie)
- Admin-only access enforced at Server Action level

---

## 5. UI/UX & Design Guidelines (Stitch Integration)

### Design Philosophy

InternTrack ka design **modern SaaS aesthetic** follow karta hai — jaise Notion, Linear, aur Vercel dashboard ka feel. Clean, minimal, professional, aur data-first.

### Color Palette

| Role | Color | Usage |
|------|-------|-------|
| Primary | `#6366F1` (Indigo) | CTAs, active states, links |
| Success | `#22C55E` (Green) | Offered, open badges |
| Warning | `#F59E0B` (Amber) | Closing soon badge |
| Danger | `#EF4444` (Red) | Rejected, closing today |
| Neutral | `#64748B` (Slate) | Secondary text, borders |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, modals |

### Typography

- **Font:** Inter (Google Fonts)
- **Headings:** `font-weight: 700`, tight tracking
- **Body:** `font-weight: 400`, `line-height: 1.6`
- **Labels/Badges:** `font-weight: 500`, uppercase small

### Component Patterns

**Stat Cards (Dashboard)**

```
┌─────────────────────┐
│  📨 Total Applied   │
│                     │
│       24            │
│  ↑ 3 this week      │
└─────────────────────┘
```

- Rounded corners (`rounded-2xl`)
- Subtle shadow (`shadow-sm`)
- Color-coded left border accent
- Icon + label + number + trend

**Listing Card**

```
┌──────────────────────────────┐
│ 🏢 Company Name        🟢 Open│
│ Frontend Intern               │
│ Karachi · Rs. 15,000/mo       │
│ Skills: React, Tailwind       │
│              [Apply Now →]    │
└──────────────────────────────┘
```

**Kanban Column (Company Board)**

```
┌──────────────┐
│ Shortlisted  │
│     (5)      │
├──────────────┤
│ [Card]       │
│ [Card]       │
│ [Card]       │
└──────────────┘
```

### Stitch Integration Rules

- Use Stitch components for: Buttons, Inputs, Badges, Modals, Tables, Navigation
- Custom Tailwind classes for layout and spacing only
- All form inputs use Stitch `<Input>` component
- Status badges use Stitch `<Badge>` with semantic colors
- Optimistic UI updates on status changes (Next.js `useOptimistic`)

### Responsive Breakpoints

| Breakpoint | Target |
|-----------|--------|
| `sm: 640px` | Mobile landscape |
| `md: 768px` | Tablet |
| `lg: 1024px` | Laptop |
| `xl: 1280px` | Desktop |

### Page Layout Structure

```
[Sidebar Nav] | [Main Content Area]
              |
              | [Page Header]
              | [Stats/Filters]
              | [Content Grid]
              |
```

- Sidebar: 240px fixed, collapsible on mobile
- Content area: max-width 1200px, centered
- Cards: `gap-4` grid, responsive columns

---

## 6. Security & Performance

### SQL Injection Prevention

**Every single query must use parameterized inputs:**

```typescript
// ✅ CORRECT
const result = await sql`
  SELECT * FROM listings
  WHERE city = ${city} AND stipend >= ${minStipend}
`;

// ❌ WRONG — never do this
const result = await sql`
  SELECT * FROM listings WHERE city = '${city}'
`;
```

### Role-Based Access Control (RBAC)

Every Server Action must verify role before executing:

```typescript
// server-action.ts
export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  const session = await getServerSession();

  // Role check — MUST be first line of every protected action
  if (!session || session.user.role !== 'company') {
    throw new Error('Unauthorized');
  }

  // SQL only runs after role is verified
  await sql`
    UPDATE applications
    SET status = ${status}
    WHERE id = ${applicationId}
  `;
}
```

### Role → Permission Matrix

| Action | Student | Company | Admin |
|--------|---------|---------|-------|
| View listings | ✅ | ✅ | ✅ |
| Apply to listing | ✅ | ❌ | ❌ |
| Post listing | ❌ | ✅ | ❌ |
| Move Kanban stage | ❌ | ✅ | ❌ |
| Write review | ✅ | ❌ | ❌ |
| Ban users | ❌ | ❌ | ✅ |
| Verify companies | ❌ | ❌ | ✅ |
| View admin dashboard | ❌ | ❌ | ✅ |

### Performance Optimizations

- **Neon serverless** — connection pooling built-in, no warm-up penalty
- **Next.js Server Components** — zero JS sent to client for data-fetching components
- **SQL indexing** — add indexes on frequently queried columns:

```sql
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_listing_id ON applications(listing_id);
CREATE INDEX idx_listings_company_id     ON listings(company_id);
CREATE INDEX idx_listings_deadline       ON listings(deadline);
CREATE INDEX idx_reviews_company_id      ON reviews(company_id);
```

- **Optimistic UI** — status updates feel instant, Server Action confirms async
- **Pagination** — all list views paginated (20 items per page) via `LIMIT $1 OFFSET $2`

### Input Validation

- All form inputs validated on both client (Zod schema) and server (Server Action)
- File uploads (CV): PDF only, max 5MB, stored via secure URL
- Email validation on register
- Role enum enforced at DB level via `CHECK` constraint

### Error Handling Pattern

```typescript
try {
  const result = await sql`SELECT ...`;
  return { success: true, data: result.rows };
} catch (error) {
  console.error('[DB Error]', error);
  return { success: false, error: 'Something went wrong' };
}
```

---

## Appendix — Build Order Checklist

```
Phase 1 — Foundation
  [ ] Next.js project setup with TypeScript
  [ ] Neon DB connection (db.ts)
  [ ] Run all CREATE TABLE migrations
  [ ] Auth: register + login + session

Phase 2 — Student Core
  [ ] Student profile page
  [ ] CV upload
  [ ] Browse + search listings
  [ ] Apply to listing
  [ ] Student dashboard (stats + pie chart)

Phase 3 — Company Core
  [ ] Company profile + listings CRUD
  [ ] Kanban applicant board
  [ ] View student profile + CV

Phase 4 — Social Proof
  [ ] Company public page
  [ ] Reviews + ratings system
  [ ] Deadline badges on all listing cards

Phase 5 — Admin
  [ ] Admin dashboard + analytics
  [ ] Ban/unban users
  [ ] Company verification flow

Phase 6 — Polish
  [ ] Optimistic UI updates
  [ ] Mobile responsiveness audit
  [ ] Error states + loading skeletons
  [ ] Deploy to Vercel
```

---

*InternTrack PRD v1.0 — Built for Pakistani students, designed for scale.*
