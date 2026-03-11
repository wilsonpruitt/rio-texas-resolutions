# Río Texas Annual Conference Resolution System

## Overview
Bilingual (EN/ES) resolution submission and tracking system for the Río Texas Annual Conference. Resolutions flow through a three-stage review pipeline: Reviewing Body → Uniting Table → Conference Floor.

## Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Database:** PostgreSQL 16 (Docker on port 5434) + Prisma 7
- **Auth:** NextAuth.js v4 (Credentials provider, JWT strategy)
- **Styling:** Tailwind CSS 4, shadcn/ui
- **i18n:** next-intl with [locale] route segment (EN/ES)
- **Key Libraries:** zod, react-hook-form, @tanstack/react-table, date-fns, sonner, diff, exceljs, nuqs

## Development
```bash
docker start rio-texas-db          # Start PostgreSQL
pnpm dev                            # Start dev server (port 3000)
npx prisma migrate dev --name xxx   # Create migration
npx prisma db seed                  # Seed database
npx prisma generate                 # Regenerate client after schema changes
npx next build                      # Production build
```

## Database
- Docker container: `rio-texas-db` on port 5434
- Connection: `postgresql://postgres:resolutions@localhost:5434/rio_texas_resolutions`
- Prisma 7: no `url` in schema.prisma; connection in `prisma.config.ts`
- Prisma 7: import from `@/generated/prisma/client` (not `@/generated/prisma`)
- Prisma 7: requires `@prisma/adapter-pg` adapter in PrismaClient constructor

## Auth
- Roles (hierarchy): PUBLIC → DELEGATE → REVIEWER → UT_MEMBER → STAFF → ADMIN
- `src/lib/auth-helpers.ts`: `getCurrentUser()`, `hasMinRole()`, `requireMinRole()`
- Seed users: admin/staff/ut-chair/reviewer/delegate/delegado/public @riotexas.org (password: password123)
- Session includes: id, role, preferredLocale

## Resolution Workflow
```
DRAFT → SUBMITTED → UNDER_REVIEW → REVIEWED_CONCUR → UT_PENDING → UT_CONCURRED → ON_CALENDAR → ADOPTED/DEFEATED
                                  → REVIEWED_NONCONCUR (stops)
                                                     → UT_NONCONCURRED → APPEALED (25 sigs) → ON_CALENDAR
```

## Bilingual Architecture
- **UI i18n:** next-intl with `src/messages/en.json` and `src/messages/es.json`
- **Content fields:** `_en`/`_es` suffix (e.g., `title_en`, `title_es`, `currentText_en`, `currentText_es`)
- **Locale helper:** `localizedField(obj, "title", locale)` — falls back to EN
- **Translation workflow:** AWAITING → DRAFT (AI) → REVIEWED → APPROVED
- **AI drafts:** POST `/api/resolutions/[id]/translation/draft` (requires ANTHROPIC_API_KEY)

## Key Directories
```
src/
  app/[locale]/           # All pages under locale segment
    login/, register/     # Auth
    dashboard/            # Petitioner home
    resolutions/          # CRUD + detail
    documents/            # Standing rules browser
    review/[bodyId]/      # Reviewing body workspace
    uniting-table/        # UT dashboard + review
    calendar/[sessionId]/ # Plenary sessions
    admin/                # Pipeline + translations + users
    browse/, results/     # Public pages
  app/api/                # 43 API routes
  components/             # Nav, providers, status badge, diff viewer, section tree
  lib/                    # prisma, auth, deadlines, diff, config, locale-fields
  messages/               # EN/ES translation files
  i18n/                   # next-intl config
```

## Display Numbers
Format: `RT-{year}-{0001}` — assigned on submit, auto-incremented.

## Deadlines (from conference date)
- Submission: -120 days
- Late submission: -60 days
- Reviewing body action: -105 days
- Petitioner final draft: -90 days
- UT action: -95 days
- Pre-Conference Report: -30 days
- Appeal signatures: -30 days

## Reviewing Bodies
- Vision Teams: UPVT, VCVT, DLVT, TCVT
- Admin Agencies: FT, BOT, BOP, CSR, COE, CAH, BOM

## Patterns
- Prisma 7 adapter pattern in `src/lib/prisma.ts` and `prisma/seed.ts`
- Row locking on votes (TODO: add FOR UPDATE when supported by adapter)
- Version snapshots as JSON at each stage
- Public API at `/api/public/*` never exposes DRAFT resolutions
- Notification model tracks communication obligations
- Appeal model with signature threshold (25)
