# InternTrack (A Smart Platform for Internship Discovery, Tracking & Prep-aration)

> **A centralized internship management platform connecting Pakistani university students with the corporate sector.**

InternTrack replaces the fragmented mess of WhatsApp groups, LinkedIn posts, and random job boards with a single, data-driven SaaS platform. Students find and track internships. Companies manage their hiring pipeline. Admins keep the platform clean and trustworthy.

---

## Overview

Pakistani university students currently rely on scattered, untracked channels to find internships. InternTrack solves this with three purpose-built interfaces:

- **Students** get a smart dashboard to browse listings, one-click apply, and track every application's status.
- **Companies** get a Kanban-style hiring board to post listings and move candidates through a structured pipeline.
- **Admins** get a control center with analytics, user verification, and moderation tools.

| Property | Value |
|---|---|
| Platform Type | Full-Stack SaaS |
| Target Market | Pakistani universities + corporate sector |
| Framework | Next.js 14+ (App Router) |
| Database | Neon PostgreSQL (serverless) |
| Deployment | Vercel |

---

## User Roles

**Student** — Registers with any email, builds a profile, browses and applies to listings, tracks application status, and reviews companies after completing an internship.

**Company** — Registers and awaits admin verification, posts internship listings, and manages applicants through a visual Kanban board.

**Admin** — Seeded via migration. Oversees the platform, verifies company accounts, bans abusive users or fraudulent listings, and views aggregate analytics.

---

## Features

### Authentication & Authorization
- Role-based registration (Student / Company) with JWT sessions
- Admin account seeded via SQL migration
- Protected routes enforced via Next.js middleware
- Every Server Action verifies role before executing any SQL

### Student Dashboard
- Stat cards: Total Applied, Shortlisted, Rejected, Offered
- Pie chart showing application status distribution
- One-click apply (pre-filled from student profile)
- Full application history with company name and status badges

### Student Profile
- Full name, university, semester, bio
- Skills as multi-select tags
- CV upload (PDF, max 5 MB, stored as URL)
- Profile completion score: `fields filled / total fields × 100`

### Internship Listings & Search
- Filter by role/title, city, stipend range, skills, and deadline
- Dynamic `WHERE` clause built with parameterized SQL (no external search library)
- Deadline badges computed entirely in SQL via `CASE WHEN`:
  - 🔴 **Closing Today** — deadline = today
  - 🟡 **Closing Soon** — deadline within 3 days
  - 🟢 **Open** — deadline more than 3 days away

### Company Kanban Hiring Board
- Columns: Applied → Shortlisted → Interview → Offered → Rejected
- Button-based status updates via Server Action (`UPDATE applications SET status = $1`)
- Click any applicant card to view their public profile and CV

### Company Public Page
- Active listings
- Aggregate star ratings: Culture, Learning, Stipend
- Auto-generated sentiment tags (e.g., "Great Culture", "Low Stipend")
- Review snippets from former interns

### Reviews & Ratings
- Only students with `offered` status can submit a review (enforced via query)
- Rate Culture, Learning, and Stipend on a 1–5 scale
- One review per student per company (enforced by `UNIQUE` DB constraint)
- Visible to all users on the company's public page

### Admin Analytics Dashboard
- Platform-wide stats: total students, companies, listings this month
- Top 5 most applied-to listings
- Top reviewed companies by average rating
- Ban/unban any student or company
- Company verification flow
- Visual bar and pie charts

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | TypeScript strict mode |
| Styling | Tailwind CSS | Utility-first, mobile-first |
| UI Components | Stitch UI | SaaS-grade design system |
| Database | Neon PostgreSQL | Serverless, edge-compatible |
| DB Access | `@neondatabase/serverless` | Raw SQL only — no ORMs |
| Backend Logic | Next.js Server Actions | All mutations and queries |
| Auth | Custom JWT / NextAuth | Role-based sessions |
| Deployment | Vercel | Edge-optimized |

**Hard constraints:**
- No Prisma, no Drizzle, no Sequelize — every query is raw SQL
- All DB mutations go through Server Actions (no API routes for mutations)
- Parameterized queries are mandatory (`$1`, `$2` syntax) everywhere
- TypeScript strict mode — no `any` types allowed

---

## Project Structure

```
InternTrack/
├── migrations/          # SQL migration files
├── public/              # Static assets
├── scripts/             # Utility scripts
├── src/
│   └── app/
│       ├── login/
│       ├── register/
│       ├── dashboard/
│       ├── listings/
│       ├── api/
│       └── components/
├── init.sql             # Initial DB schema
├── next.config.ts
├── tsconfig.json
├── package.json
└── PRD.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A Vercel account (for deployment) or any Node.js host

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/HuzaifaNawaid/InternTrack.git
cd InternTrack

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env.local

# 4. Initialize the database
# Run init.sql against your Neon database, then run any files in /migrations

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Author

**Huzaifa Nawaid**  
GitHub: [@HuzaifaNawaid](https://github.com/HuzaifaNawaid)

---

*Built for Pakistani students. Designed for scale.*
