# Río Texas Annual Conference Resolution System

## Overview
Bilingual (EN/ES) internal tool for tracking 5-20 resolutions from submission through the pipeline to pre-conference journal inclusion or not-advanced status. Used by Conference Secretary, Assistant to the Bishop, Committee Chairs, and petitioners.

## Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Database:** PostgreSQL (Neon prod, Docker local on port 5434) + Prisma 7
- **Auth:** NextAuth.js v4 (Credentials provider, JWT strategy)
- **Styling:** Tailwind CSS 4, shadcn/ui
- **i18n:** next-intl with [locale] route segment (EN/ES)
- **Key Libraries:** zod, react-hook-form, @tanstack/react-table, date-fns, sonner, diff, exceljs, nuqs

## Development
```bash
docker start rio-texas-db          # Start PostgreSQL (local)
pnpm dev                            # Start dev server (port 3000)
npx prisma db push                  # Push schema to database
npx tsx prisma/seed.ts              # Seed base data
npx tsx prisma/seed-test-resolutions.ts  # Seed test resolutions
npx prisma generate                 # Regenerate client after schema changes
```

## Database
- **Local:** Docker container `rio-texas-db` on port 5434
- **Production:** Neon PostgreSQL (project: `raspy-breeze-49263177`, region: us-east-2)
- Prisma 7: no `url` in schema.prisma; connection in `prisma.config.ts`
- Prisma 7: import from `@/generated/prisma/client` (not `@/generated/prisma`)
- Prisma 7: requires `@prisma/adapter-pg` adapter in PrismaClient constructor

## Auth
- Roles (hierarchy): PETITIONER → COMMITTEE_CHAIR → SECRETARY → ADMIN
- `src/lib/auth-helpers.ts`: `getCurrentUser()`, `hasMinRole()`, `requireMinRole()`
- Seed users: secretary/admin/chair-csr/chair-bot/petitioner1/petitioner2 @riotexas.org (password: password123)
- Session includes: id, role, preferredLocale

## Resolution Pipeline
```
DRAFT → SUBMITTED → UNDER_REVIEW → RECOMMENDED → UT_REVIEW → APPROVED
                                  → NOT_RECOMMENDED (stops)
                                                             → NOT_ADVANCED (stops)
```

## Financial Detection
- `src/lib/financial-detect.ts`: 18 regex patterns scan on submit
- Auto-cites Standing Rule SR-14 for finance committee referral
- Secretary can dismiss false positives or manually flag missed ones

## Bilingual Architecture
- **UI i18n:** next-intl with `src/messages/en.json` and `src/messages/es.json`
- **Content fields:** `_en`/`_es` suffix (e.g., `title_en`, `title_es`, `text_en`, `text_es`)
- **Locale helper:** `localizedField(obj, "title", locale)` — falls back to EN

## Key Directories
```
src/
  app/[locale]/           # All pages under locale segment
    login/                # Auth
    dashboard/            # Role-based home
    resolutions/          # List + detail + edit
    submit/               # Guided 4-step public submission
    guide/                # Walkthrough with test accounts
  app/api/                # 7 API routes
    auth/                 # NextAuth + register
    committees/           # List committees
    resolutions/          # CRUD + submit + assign + recommend + ut-decision
  components/             # Nav, providers, pipeline tracker, status badge, language switcher
  lib/                    # prisma, auth, financial-detect, locale-fields
  messages/               # EN/ES translation files
  i18n/                   # next-intl config
```

## Display Numbers
Format: `RT-{year}-{0001}` — assigned on submit, auto-incremented.

## Committees
- Vision Teams: UPVT, VCVT, DLVT, TCVT
- Admin Agencies: FT, BOT, BOP, CSR, COE, CAH, BOM

## Deployment
- GitHub: `littleeachdayapp-droid/rio-texas-resolutions` (private)
- Vercel: `https://rio-texas-resolutions.vercel.app`
- Env vars on Vercel: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

## Patterns
- Prisma 7 adapter pattern in `src/lib/prisma.ts` and `prisma/seed.ts`
- Visual pipeline tracker: `src/components/resolution-pipeline.tsx`
- Guided submission: 4-step flow (Info → Account → Write → Review)
