# Temariware — Production Deployment Guide

This guide walks you through deploying Temariware from scratch using **only free services**. Total time: ~15 minutes.

## Prerequisites

- A Telegram account
- A GitHub account (free)
- A Vercel account (free, sign in with GitHub)
- A Supabase account (free, sign in with GitHub)

---

## Step 1 — Get the source code (1 min)

You have two options:

### Option A: Download the zip
1. Download `temariware-source.zip` (124KB)
2. Unzip it locally
3. Initialize a git repo and push to GitHub:
   ```bash
   cd temariware-deploy
   git init
   git add .
   git commit -m "Initial commit — Temariware v1"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/temariware.git
   git push -u origin main
   ```

### Option B: Create the GitHub repo first, then upload files
1. Go to https://github.com/new → name it `temariware` → Create
2. Unzip `temariware-source.zip` locally
3. Upload all files via GitHub web UI (or use `git` CLI as above)

---

## Step 2 — Set up Supabase database (3 min)

1. Go to https://supabase.com → **Sign in** → **New project**
2. Pick a name (e.g. `temariware`), set a strong DB password, choose a region close to Ethiopia (e.g. `Frankfurt` or `London`)
3. Wait ~2 min for provisioning to finish
4. Go to **Project Settings** (gear icon bottom-left) → **Database**
5. Find **Connection string** → **URI** format. It looks like:
   ```
   postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you set in step 2. **Save this full string** — it's your `DATABASE_URL`.

---

## Step 3 — Push the database schema to Supabase (1 min)

You need Node.js installed locally for this step. If you don't have it, you can skip — Vercel will run `prisma generate` automatically, but you still need to push the schema once.

```bash
cd temariware-deploy
npm install
# Set DATABASE_URL temporarily in your shell
export DATABASE_URL="postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"
npx prisma db push
```

You should see: `🚀 Your database is now in sync with your Prisma schema.`

**Optional — seed sample jobs:**
```bash
npx tsx scripts/seed.ts
```

---

## Step 4 — Deploy to Vercel (3 min)

1. Go to https://vercel.com → **Sign in with GitHub**
2. Click **Add New** → **Project**
3. Import the `temariware` repo
4. Vercel will auto-detect Next.js — leave defaults
5. Expand **Environment Variables** and add these one by one:

   | Name | Value |
   |------|-------|
   | `TELEGRAM_BOT_TOKEN` | `8532692467:AAGHlA5c6_eXaKiccQ1CEEQXW3BZG_lFRh4` (your real token) |
   | `DATABASE_URL` | (the Supabase URI from step 2) |
   | `ADMIN_TELEGRAM_IDS` | (your personal Telegram user ID from @userinfobot) |
   | `ALERT_CHAT_ID` | `-1002301712168` |

6. Click **Deploy** — wait ~2 min
7. Once deployed, Vercel gives you a URL like `https://temariware-xxx.vercel.app` — **copy it**

---

## Step 5 — Set MINI_APP_URL (30 sec)

1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add one more:
   - Name: `MINI_APP_URL`
   - Value: `https://temariware-xxx.vercel.app` (the URL from step 4)
3. Go to **Deployments** → click the ⋮ menu on the latest → **Redeploy**

---

## Step 6 — Wire the Telegram webhook (30 sec)

Open a terminal and run:

```bash
curl "https://api.telegram.org/bot8532692467:AAGHlA5c6_eXaKiccQ1CEEQXW3BZG_lFRh4/setWebhook?url=https://temariware-xxx.vercel.app/api/bot"
```

(Replace with your real bot token and Vercel URL.)

Expected response:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

Verify:
```bash
curl "https://api.telegram.org/bot8532692467:AAGHlA5c6_eXaKiccQ1CEEQXW3BZG_lFRh4/getWebhookInfo"
```

You should see `"url": "https://temariware-xxx.vercel.app/api/bot"` and `"pending_update_count": 0`.

---

## Step 7 — Test the bot (30 sec)

1. Open Telegram → search `@temariwarebot`
2. Tap **Start** → you should see the welcome message with an **Open app** button
3. Tap **Open app** → the Mini App should load inside Telegram
4. Try `/latest` → should show 5 most recent jobs (or "no jobs yet" if you skipped seeding)
5. Try `/help` → full command list

If everything works, you're live! 🎉

---

## Step 8 — Configure the "Open Temariware" menu button (1 min)

This adds a permanent button in the bot's chat so users can open the Mini App anytime.

1. Open Telegram → `@BotFather`
2. Send `/mybots` → pick `@temariwarebot`
3. **Bot Settings** → **Menu Button** → **Configure menu button**
4. Send the URL: `https://temariware-xxx.vercel.app`
5. Send button text: `Open Temariware`
6. Done — now there's a menu button next to the chat input

---

## Step 9 — Add the bot to your channel (so it can broadcast)

You already gave me the channel ID `-1002301712168`. For the bot to post there:

1. Open your channel in Telegram
2. Tap channel name → **Manage Channel** → **Administrators** → **Add Administrator**
3. Search `@temariwarebot` → add it
4. Give it **Post Messages** permission (and **Edit Messages** if you want it to delete test posts)
5. Save

Now every time you approve a job in the admin panel, the bot will:
- Notify the employer
- Post a rich card to your channel
- Send push alerts to all matching subscribers

---

## Step 10 — Make yourself admin (30 sec)

When you first open the Mini App, the bot reads your Telegram user ID from the `initData`. If your ID is in `ADMIN_TELEGRAM_IDS` (set in Vercel env vars in step 4), you'll automatically see the **Admin** tab in the bottom nav.

If you don't see the Admin tab:
1. Verify your personal ID with `@userinfobot` (it's a positive integer like `712345678`)
2. Make sure it's in `ADMIN_TELEGRAM_IDS` (comma-separated, no spaces)
3. Redeploy on Vercel
4. Reopen the Mini App (close and reopen Telegram to clear cache if needed)

---

## Troubleshooting

### Bot doesn't respond to /start
- Check `getWebhookInfo` — if `pending_update_count > 0`, the webhook URL is wrong or unreachable
- Check Vercel logs: Project → **Logs** → look for `/api/bot` requests
- Verify `TELEGRAM_BOT_TOKEN` is set in Vercel env vars

### Mini App shows "Please open this in Telegram to apply"
- This means the app can't validate `initData`. It only works inside Telegram, not in a regular browser.
- Make sure you opened the app via the bot's "Open app" button or menu button

### "Database connection failed" on Vercel
- Double-check `DATABASE_URL` — must include `?pgbouncer=true&connection_limit=1` at the end for Supabase pooler
- Try the **Direct connection** URI instead of pooled (Supabase shows both)

### Channel broadcast fails with "chat not found"
- The bot hasn't been added to the channel yet. See Step 9.

### Can't see Admin tab
- Your personal user ID isn't in `ADMIN_TELEGRAM_IDS`. Verify with `@userinfobot`.

---

## v2 ideas

- Auto-import jobs from Afriwork / የኛ Tutors channels (Telegram Channel API)
- CV upload to Supabase Storage
- Employer dashboard (see applicants per job)
- Saved/bookmarked jobs
- Daily digest email or Telegram summary
- Reporting system for bad jobs/employers

---

Built for Ethiopian university students. Free forever. 🇪🇹
