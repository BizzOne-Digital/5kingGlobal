# 5Kings Global — Website & Admin Platform

A full-stack Next.js (App Router) site for 5Kings Global, backed by MongoDB, with a secure `/admin` dashboard for managing services, products, bookings, contact messages, blog posts, pricing, testimonials, and media — all content-driven from the database, no hardcoded business content.

## Stack

- Next.js 15 (App Router) + React 18 + TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- JWT session auth (httpOnly cookie) via `jose` + `bcryptjs`
- Zod validation on every write
- Media storage entirely in MongoDB via GridFS — no external storage service, no reliance on the local filesystem

## 1. Prerequisites

- Node.js 20+ and npm
- A MongoDB connection string (MongoDB Atlas recommended for production)

## 2. Install

```bash
npm install
```

## 3. Configure environment variables

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

Required values before running the app:

| Variable | What it is |
|---|---|
| `MONGODB_URI` | Your real MongoDB Atlas connection string (`mongodb+srv://...`). **This project ships with no `.env` file and no database wired in** — you must supply your own. |
| `SESSION_SECRET` | A long random string used to sign admin session cookies. Generate one with `openssl rand -base64 48` (or any equivalent) — do not reuse the example value from any documentation. |
| `NEXT_PUBLIC_SITE_URL` | The public URL of the deployed site (e.g. `https://5kingsconcierges.com`). Used for SEO metadata, sitemap, and canonical URLs. Use `http://localhost:3000` for local development. |

Optional (only needed if you want to seed a first admin login — see below):

| Variable | What it is |
|---|---|
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | If set, `npm run seed` will create one admin user with these credentials. Leave unset to skip and create your admin user another way. **Change the password immediately after first login if you use this.** |

Media (images, graphics, and directly-uploaded videos) is stored inside MongoDB itself via GridFS — see the "Media storage" section below. There's nothing extra to configure: it uses the same `MONGODB_URI` as everything else, in both development and production.

## 4. Seed initial content

```bash
npm run seed
```

This is safe to re-run — it only creates records that don't already exist. It seeds:

- Site settings (business name, phone, email, service areas) with the real 5Kings Global contact details
- The 6 real service categories extracted from the current site (Security Systems, HD Cameras & CCTV, Solar Panel Installation, Medical Alert Systems, Fire Alarms, Handyman Services)
- An admin user, **only if** `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` are set in `.env`

It does **not** create fake testimonials, products, pricing plans, or bookings — add those for real through the admin dashboard as they become available.

If you didn't seed an admin user, you can create one manually with a short script using `hashPassword` from `lib/auth/password.ts` and inserting a `User` document with `role: 'admin'` — or add a small one-off `scripts/create-admin.ts` following the same pattern as `scripts/seed.ts`.

## 5. Run it

```bash
npm run dev       # local development, http://localhost:3000
npm run build     # production build — run this before every deploy
npm run start     # run the production build locally
```

Admin dashboard: `/admin/login` (protected — not reachable without a valid session).

## 6. Before going live — checklist

- [ ] Real `MONGODB_URI` set (Atlas, not a local/dev database)
- [ ] Fresh, unique `SESSION_SECRET` generated for this deployment
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real production domain
- [ ] Admin password changed from any seeded/default value
- [ ] Real testimonials, products, and pricing entered through `/admin` (none are pre-loaded)
- [ ] `npm run build` passes with no errors before deploying
- [ ] `.env` is **not** committed to version control (already covered by `.gitignore`)

## Project structure

```
app/
  (site)/        Public marketing pages (home, about, services, products, pricing, booking, blog, contact)
  admin/          Admin login + protected dashboard (route group with its own layout)
  api/            REST API routes (public + /api/admin/* protected routes)
components/       UI library, layout, admin, home-section, cart, and form components
lib/              DB connection, auth, storage abstraction, validation schemas, data-access helpers, utils
models/           Mongoose schemas (User, Service, Product, ProductCategory, Booking, ContactMessage,
                  BlogPost, PricingPlan, Media, Testimonial, SiteSettings)
scripts/seed.ts   Idempotent seed script (see above)
middleware.ts     Route protection for /admin/* and /api/admin/*
```

## Media storage

Every file uploaded through the admin Media Library (images, graphics, and directly-uploaded MP4/WebM video) is stored inside MongoDB itself using **GridFS** — MongoDB's built-in mechanism for storing files larger than its 16MB single-document limit, chunked across a `media.files` / `media.chunks` collection pair in the same database as everything else.

There is deliberately no external storage service involved (no Cloudinary, no S3, nothing to sign up for or configure) and no reliance on the local filesystem. That matters specifically because Vercel's production filesystem is read-only and ephemeral — anything an app writes to disk there vanishes as soon as that request finishes, which is exactly what breaks a naive "save to `/public/uploads`" approach in production. GridFS sidesteps that entirely: uploads, reads, and deletes all go through the same `MONGODB_URI` connection the rest of the app already uses.

How it works, end to end:

- **Upload**: `app/api/media/route.ts` (admin-only) reads the file into a buffer and hands it to `lib/storage/gridfs-provider.ts`, which streams it into GridFS and returns a URL like `/api/media/file/<id>`. A `Media` document is created pointing at that URL.
- **Serve**: `app/api/media/file/[id]/route.ts` is a public route that streams the file's bytes straight back out of GridFS with the correct `Content-Type` and long-lived immutable cache headers (a file's bytes never change after upload — "replacing" an image uploads a new one with a new id rather than overwriting in place). It also supports HTTP Range requests, so uploaded video can be seeked/scrubbed, not just played straight through.
- **Display**: every `<img>`/`<video>` across the site and admin simply points at that same-origin URL — including through `next/image`, which needs no extra configuration for it since it's not an external host.
- **Delete**: removing a Media record also deletes its underlying GridFS file (both the `.files` entry and its `.chunks`), so nothing is left orphaned in the database.

This means production deploys (Vercel or otherwise) need zero extra environment variables or third-party setup for media to work correctly — the same `MONGODB_URI` that powers the rest of the app is the whole story.

## Dependency security

Runs on `next@15.5.25`, which clears the high-severity Next.js/sharp advisories that affected earlier 15.x releases (`npm audit` will show this as clean or near-clean right after `npm install`). One advisory remains open: a `postcss` version bundled *inside* Next's own internal tooling (`node_modules/next/node_modules/postcss`) is flagged high, but it's only used at build time by Next's own pipeline, not by anything reachable at runtime, and the only fix available is upgrading to Next 16 — a major version with breaking changes across the App Router that hasn't been tested against this codebase. Re-run `npm audit` periodically and revisit that upgrade once Next 16 has matured, rather than forcing it now. Do **not** run `npm audit fix --force` without reviewing what it changes first — it will happily jump major versions.

## Notes on content

All business content (services, products, pricing, blog, testimonials, settings) lives in MongoDB and is managed entirely through `/admin` — nothing is hardcoded in the React components. The homepage copy, service descriptions, and contact details were taken directly from the existing 5Kings Global site; everything else (testimonials, product catalog, pricing plans, blog posts) starts empty and is meant to be filled in with real data as it becomes available, not placeholder content.

Stock photography used across the site is placeholder imagery (clearly licensed, royalty-free) meant to be swapped out via the admin Media Library once real photography of the team, vehicles, and completed jobs is available.
