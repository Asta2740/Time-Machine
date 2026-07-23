# Sushi Date Invite

A small, interactive, mobile-first invitation site. She predicted Spain 2–1
Argentina; reality delivered Spain 1–0. This turns that into a playful
"reality corrected your prediction" reveal that ends in a sushi date invite.

Built with Next.js (App Router) + TypeScript, Tailwind CSS, Framer Motion,
Lucide icons, and Supabase (Postgres) for response storage.

---

## 1. Project structure

```
src/
  app/
    page.tsx              # the invitation itself
    layout.tsx             # fonts, metadata
    globals.css
    admin/                 # private results dashboard
    api/
      visit/route.ts       # logs a page visit, issues CSRF token
      respond/route.ts     # records yes/no answers
      admin/login/route.ts
      admin/logout/route.ts
      cleanup/route.ts     # scheduled retention purge
  components/
    scenes/                 # OpeningScene, PredictionScene, RevealScene,
                             # DecisionScene, YesScene, NoScene
    ui/                      # PetalField, SparkleField, SoundToggle, Button, ...
  lib/
    config.ts                # <-- ALL editable names/dates/copy live here
    ics.ts                    # .ics calendar file generation
    ip.ts, device.ts          # privacy-preserving IP + device handling
    rateLimit.ts, csrf.ts, adminAuth.ts, sanitize.ts
    supabaseAdmin.ts          # server-only Supabase client
  types/
supabase/
  schema.sql                 # run this once in your Supabase project
```

---

## 2. Editing the content

Everything editable — her name, your name, the date options, the time, the
venue, and the football scores — lives in **[`src/lib/config.ts`](src/lib/config.ts)**.

```ts
export const INVITE_CONFIG = {
  herName: "Rowan",
  myName: "Youssef",
  location: "Oak Bay",
  time: "7:00 PM",
  dateOptions: [
    { day: "Saturday", label: "Saturday, July 25, 2026", isoDate: "2026-07-25" },
    { day: "Sunday", label: "Sunday, July 26, 2026", isoDate: "2026-07-26" },
  ],
  prediction: { home: "Spain", away: "Argentina", homeScore: 2, awayScore: 1 },
  actual: { home: "Spain", away: "Argentina", homeScore: 1, awayScore: 0 },
  eventTitle: "Sushi Date at Oak Bay",
  eventDurationMinutes: 120,
};
```

**Important:** the app validates at startup that each `day` actually matches
its `isoDate` (e.g. it will throw a build error if you set `isoDate:
"2026-07-25"` but `day: "Sunday"`, since July 25, 2026 is a Saturday). If you
change the dates, double check the real weekday first.

Scene copy (headlines, button labels, playful lines) lives directly in the
scene components under `src/components/scenes/` — each file is short and
labeled by which screen it renders.

---

## 3. Local development

**Requirements:** Node.js 18.18+ (Node 20+ recommended), npm.

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` (see section 4 for Supabase values). Then:

```bash
npm run dev
```

Visit `http://localhost:3000`. Visit `http://localhost:3000?test=1` for
**test mode**: submissions aren't stored, a "TEST MODE" badge appears, and
two extra buttons let you jump straight to the Yes and No endings to preview
them without playing through the whole flow.

---

## 4. Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the contents of [`supabase/schema.sql`](supabase/schema.sql).
   This creates the `visits` and `responses` tables with Row Level Security
   enabled and **no** public policies — meaning the anon/public API key has
   zero access. All reads and writes happen server-side using the service
   role key.
3. In **Project Settings → API**, copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

The service role key is only ever read in server-only files
(`src/lib/supabaseAdmin.ts`, guarded by the `server-only` package) and is
never sent to the browser.

---

## 5. Environment variables

See [`.env.example`](.env.example) for the full list with descriptions.
Generate random secrets with:

```bash
openssl rand -hex 32
```

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Server-only DB access |
| `IP_HASH_SALT` | Salts the SHA-256 hash used to store IPs privately |
| `STORE_FULL_IP` | `false` (default) stores only a salted hash; `true` stores the raw IP |
| `RETENTION_DAYS` | Auto-delete logs older than this many days (default 30) |
| `ADMIN_PASSWORD` | Password to view `/admin` |
| `ADMIN_SESSION_SECRET` | Signs admin session + CSRF cookies |
| `CRON_SECRET` | Bearer secret for the scheduled `/api/cleanup` route |

---

## 6. Deploying to Vercel

```bash
npm install -g vercel   # if you don't have it
vercel
```

Or connect the repo in the Vercel dashboard. Then:

1. In the Vercel project's **Settings → Environment Variables**, add every
   variable from `.env.example` with real values.
2. Redeploy.
3. `vercel.json` already configures a daily Vercel Cron job that hits
   `/api/cleanup` at 03:00 UTC — Vercel automatically sends
   `Authorization: Bearer $CRON_SECRET`, matching the check in
   `src/app/api/cleanup/route.ts`. No extra setup needed beyond setting the
   `CRON_SECRET` env var.

---

## 7. Privacy & security notes

- The invitation shows a clear notice before the Yes/No buttons: *"Your
  response and basic visit information will be recorded so I know you
  answered."*
- No GPS, contacts, camera, microphone, or advertising cookies are used.
- IPs are read only from trusted proxy headers (`x-forwarded-for` /
  `x-real-ip`) — never from any client-supplied field — and by default are
  stored as a salted SHA-256 hash, not in plaintext. Set `STORE_FULL_IP=true`
  to opt into raw storage.
- All API routes sanitize inputs, use parameterized Supabase queries (no
  string-built SQL), and are rate-limited per IP.
- The `/api/respond` route requires a same-origin, double-submitted CSRF
  token issued via an httpOnly cookie.
- A unique DB constraint on `session_id` prevents duplicate submissions from
  the same page load; the UI also disables the Yes/No buttons while a
  submission is in flight and after it succeeds.
- `/admin` is password-protected, sends `X-Robots-Tag: noindex`, and is never
  linked from the invitation itself.
- Logs older than `RETENTION_DAYS` (30 by default) are purged automatically
  by the scheduled `/api/cleanup` route.

---

## 8. Test mode

Append `?test=1` to the URL. This:

- Shows a small "TEST MODE" badge.
- Skips writing to the `responses`/`visits` tables (the API routes receive
  `test: true` and short-circuit before any DB write).
- Adds two floating buttons to jump directly to the Yes and No endings, so
  you can preview both without playing through the whole sequence.

---

## 9. Pre-send checklist

- [ ] `src/lib/config.ts` has the right names, date options, time, and venue.
- [ ] Ran `npm run dev` and clicked through the full flow at least once on a
      real phone (or Chrome DevTools device emulation).
- [ ] Confirmed `?test=1` mode works and does **not** create rows in
      Supabase (check the `responses` table count before/after).
- [ ] Clicked "Add to Calendar" on the Yes ending and opened the downloaded
      `.ics` file — confirm the title, date, time, and location are correct.
- [ ] Clicked "No" through both playful reactions and confirmed the third
      click submits normally, with no dead-end or unclickable button.
- [ ] Verified `/admin` is unreachable without the password, and that stats
      update after a real (non-test) submission.
- [ ] Checked the site with `prefers-reduced-motion` enabled (OS
      accessibility setting) — animations should stop, content should still
      be fully readable.
- [ ] Confirmed sound is muted by default and the toggle works.
- [ ] Deployed to Vercel, set all env vars, and re-tested the full flow on
      the live URL before sending it to her.
