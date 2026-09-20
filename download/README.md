# Temariware — Student Jobs Mini App for Ethiopian Universities

A **Telegram Bot + Mini App** that lets Ethiopian university students discover and apply to tutoring, freelance, part-time and full-time jobs. Built 100% on free-tier services.

**Status:** v1 ready · Tested end-to-end · Lint clean

---

## What's inside

| Layer | Tech | Cost |
|---|---|---|
| Mini App (UI) | Next.js 16 + React 19 + TypeScript + Tailwind + shadcn/ui | Free |
| Bot (alerts, commands) | Telegram Bot API via `/api/bot` webhook | Free |
| Database | Prisma + SQLite (dev) → Supabase Postgres (prod) | Free (500MB) |
| Hosting | Vercel (Next.js) + webhook = bot worker | Free |
| Auth | Telegram WebApp `initData` HMAC validation | Free |
| i18n | EN / አማርኛ / Afaan Oromoo (in-app switcher, persisted per user) | — |

## Features (v1)

### Mini App (`/`)
- **Job feed** with debounced search + filters (subject, location, type, gender)
- **Job detail** with structured facts grid, employer verified badge, urgent-deadline flag
- **One-tap apply** — sends profile (name, university, field, phone, CV) + custom message to employer's Telegram
- **Post a job** — verified-employer-only form with all the fields from your sample posts (subjects, grade, location, salary, hours, gender pref, language req, deadline, contact)
- **My applications** — track status (pending → forwarded → accepted/rejected)
- **Profile** — student info + university info + CV link + alert subscriptions (subjects + locations)
- **Employer verification** — submit company name + Telegram contact + proof URL; admin approves
- **Admin panel** — pending jobs queue, verification requests queue, stats dashboard; approve/reject with reason; broadcasts trigger push alerts to subscribers
- **Language switcher** — EN / Amharic / Afan Oromo, persisted to user profile
- **Telegram-native UX** — haptic feedback, theme colors, sticky bottom nav, expand-to-fullscreen

### Bot (`/api/bot`)
- `/start` — welcome + "Open app" button
- `/latest` — newest 5 jobs with inline Open buttons
- `/search <query>` — search by title/description/subjects/location
- `/subscribe <category>` — get alerts (TUTORING, FREELANCE, ALL, etc.)
- `/unsubscribe <category>`
- `/myapps` — list your applications
- `/postjob` — open the post form (verified employers only)
- `/admin` — admin panel link (admins only)
- `/help` — full command list
- **Push alerts** — when admin approves a job, every matching subscriber gets a Telegram message with a "View & apply" button that deep-links into the Mini App

## File structure

```
src/
├── app/
│   ├── layout.tsx              # Mounts Telegram WebApp SDK + Sonner toaster
│   ├── page.tsx                # Single-page Mini App with view-state nav
│   └── api/
│       ├── bot/route.ts        # Telegram webhook handler (commands + alerts)
│       ├── jobs/route.ts       # GET list (filters) / POST create (verified)
│       ├── jobs/[id]/route.ts  # GET single job
│       ├── jobs/[id]/apply/route.ts  # POST application → forward to employer
│       ├── applications/route.ts  # GET current user's applications
│       ├── me/route.ts         # GET / PATCH profile
│       ├── verify/route.ts     # POST verification request
│       └── admin/
│           ├── route.ts        # GET stats / pending jobs / verifications
│           ├── jobs/[id]/route.ts     # POST approve/reject + broadcast
│           └── verify/[id]/route.ts   # POST approve/reject verification
├── components/mini-app/
│   ├── home-view.tsx           # Job feed + filters
│   ├── job-detail-view.tsx     # Job detail + apply form
│   ├── post-job-view.tsx       # Post job form
│   ├── applications-view.tsx   # My applications list
│   ├── profile-view.tsx        # Profile + verification + alerts
│   └── admin-view.tsx          # Admin panel (tabs: jobs/verify/stats)
├── hooks/
│   └── use-telegram.ts         # Telegram WebApp SDK hook + haptics
└── lib/
    ├── auth.ts                 # initData validation + admin ID check
    ├── telegram.ts             # Bot API client (sendMessage, setMyCommands, etc.)
    ├── i18n.ts                 # EN / AM / OR dictionaries + t() helper
    ├── db.ts                   # Prisma client
    └── client/
        ├── types.ts            # Shared client types
        └── parse-start.ts      # Parse ?startapp= routing

prisma/
└── schema.prisma               # User, Job, Application, Subscription, VerificationRequest

scripts/
└── seed.ts                     # Seed realistic sample jobs (8 jobs + 1 verification)
```

## How to run locally

```bash
# 1. Install deps
bun install

# 2. Set up env (already created for dev)
cat > .env <<EOF
DATABASE_URL=file:/home/z/my-project/db/custom.db
DEV_TELEGRAM_ID=100000003
DEV_TELEGRAM_NAME=Abebe
DEV_TELEGRAM_USERNAME=abebe_student
ADMIN_TELEGRAM_IDS=100000001,100000003
EOF

# 3. Push schema + seed sample data
bun run db:push
bun run scripts/seed.ts

# 4. Start dev server
bun run dev   # http://localhost:3000
```

Without a real bot token, the app runs in **dev mode**: it uses `DEV_TELEGRAM_ID` as the logged-in user and skips Telegram API calls. All UI/API flows still work — bot calls just no-op.

## How to deploy (production, free tier)

### Step 1 — Create the Telegram bot (2 minutes)
1. Open Telegram, search `@BotFather`
2. Send `/newbot` → pick a name like `Temariware Jobs` and username like `temariware_bot`
3. Copy the **bot token** it gives you → `TELEGRAM_BOT_TOKEN`

### Step 2 — Set up Supabase (5 minutes)
1. Sign up at https://supabase.com (free, no credit card)
2. Create a new project
3. Go to **Project Settings → Database → Connection string** → copy the URI
4. Replace `[YOUR-PASSWORD]` with your DB password → that's your `DATABASE_URL`
5. Run locally with that `DATABASE_URL` set:
   ```bash
   DATABASE_URL="postgresql://..." bun run db:push
   bun run scripts/seed.ts   # optional: seed sample data
   ```

### Step 3 — Deploy to Vercel (3 minutes)
1. Push this project to GitHub
2. Go to https://vercel.com → "New Project" → import the repo
3. Add environment variables:
   - `TELEGRAM_BOT_TOKEN` — from step 1
   - `DATABASE_URL` — from step 2
   - `MINI_APP_URL` — your Vercel URL (e.g. `https://temariware.vercel.app`)
   - `ADMIN_TELEGRAM_IDS` — your personal Telegram user ID (ask `@userinfobot` for it)
4. Deploy → copy the production URL

### Step 4 — Wire the bot to Vercel (1 minute)
Set the Telegram webhook to point at your Vercel bot endpoint:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://temariware.vercel.app/api/bot"
```

Verify:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### Step 5 — Configure the Mini App in @BotFather (1 minute)
1. Open `@BotFather` → `/mybots` → pick your bot → **Bot Settings → Menu Button → Configure menu button**
2. Set the URL to your Vercel app: `https://temariware.vercel.app`
3. Set a button text: `Open Temariware`
4. (Optional) Set **Web App URL** under "Domain" if you want `openApp` inline buttons

Now anyone who opens your bot sees a permanent **Open Temariware** menu button that launches the Mini App inside Telegram.

## v2 ideas (post-launch)

- **Auto-import** jobs from Afriwork / የኛ Tutors channels (Telegram Channel scraping — needs channel admin permission or public channel)
- **CV upload** to Supabase Storage instead of Google Drive link
- **Employer dashboard** — see applicants per job, shortlist, message them
- **Saved jobs** — bookmark for later
- **Notifications** — daily/weekly digest email or Telegram summary
- **Categories taxonomy** — replace free-text subjects with a controlled vocabulary
- **Reporting** — flag jobs/employers for review

## Tech notes

- **Why SQLite in dev?** Zero setup, instant onboarding. Schema is portable to Postgres (Supabase) — only `datasource db` in `schema.prisma` changes.
- **Why a single `/` route?** Telegram Mini Apps work best as a single-page experience. View-switching is done in React state, with the Telegram `start_param` driving deep links (e.g. `?startapp=job_abc123`).
- **Auth?** Every API request from the Mini App includes `x-telegram-init-data` header, validated via HMAC-SHA256 against the bot token (per [Telegram spec](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)). In dev mode without a token, a fake user from env vars is used.
- **Bot alerts?** When admin approves a job, `/api/admin/jobs/[id]` queries `Subscription` table for matching subscribers and sends each a `botNewJobAlert` message with a "View & apply" button that deep-links into the Mini App.

---

Built for Ethiopian university students. Free forever. 🇪🇹
