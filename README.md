# CMS Starter Kit

A white-label content management starter built with **Next.js 15**, **PostgreSQL**, and a compact admin panel. Use it as the foundation for client websites with branding, SEO, leads/CRM, and role-based module control.

## Features

- PostgreSQL database with SQL migrations (`pg` client — works on local Docker or VPS)
- Generic branding: logos, favicons, colors, company contact details
- Compact admin UI with dedicated pages: Branding, Company, SEO, Analytics, Modules, Leads/CRM
- Lead management with stages, priorities, notes, and activity timeline
- Google Analytics 4 configurable from admin
- **Super Admin role** — enable/disable modules from `/admin/modules` (no separate app)
- Signed JWT admin sessions with `admin` and `super_admin` roles

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set at minimum:

```env
USE_POSTGRES=true
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cms_starter
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=change-me-super
SESSION_SECRET=your-long-random-secret
```

### 3. Start PostgreSQL and run migrations

```bash
npm run db:setup
```

Or manually:

```bash
docker compose up -d postgres
npm run db:migrate
```

### 4. Run the CMS

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Admin roles

| Role | Login env vars | Capabilities |
|------|----------------|--------------|
| **Admin** | `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Content, leads, branding, SEO, analytics |
| **Super Admin** | `SUPER_ADMIN_USERNAME` / `SUPER_ADMIN_PASSWORD` | Everything above + enable/disable modules |

Sign in at `/admin/login` with the appropriate credentials. Super admins see toggles on **Admin → Modules**; regular admins see a read-only module list.

## Project structure

| Path | Purpose |
|------|---------|
| `app/admin/` | Admin panel pages |
| `lib/repo/PostgresRepository.ts` | Data access layer |
| `lib/modules/` | Module registry and enablement |
| `lib/auth.ts` | JWT sessions and role checks |
| `supabase/migrations/` | PostgreSQL schema |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start CMS dev server |
| `npm run db:up` | Start Postgres via Docker |
| `npm run db:migrate` | Apply SQL migrations |
| `npm run db:setup` | Up + migrate |

## Migrating from MongoDB

If you have existing MongoDB data, run (requires `MONGODB_URI` in `.env`):

```bash
npx tsx scripts/migrate-mongo-to-postgres.ts
```

## License

Private / use per your project terms.
