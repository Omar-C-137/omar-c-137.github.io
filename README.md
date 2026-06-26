# T-0 — Setup Guide

## What's in this folder

| File | Purpose |
|---|---|
| `index.html` | Landing page |
| `auth.html` | Sign in / Sign up (email + Google) |
| `coach.html` | Coach dashboard (manage clients, write plans) |
| `trainee.html` | Trainee dashboard (view plans, own profile) |
| `style.css` | All shared styles |
| `config.js` | **You fill this in** — Supabase URL + key |
| `supabase_schema.sql` | Run once in Supabase SQL editor |

---

## Step 1 — Create a Supabase project (free)

1. Go to [https://supabase.com](https://supabase.com) → **New project**
2. Pick a name, set a strong password, pick a region (EU or US)
3. Wait ~2 minutes for it to spin up

---

## Step 2 — Run the database schema

1. In your Supabase dashboard → **SQL Editor** → **New query**
2. Paste the entire contents of `supabase_schema.sql`
3. Click **Run**

This creates all tables, RLS policies, and the auto-profile trigger.

---

## Step 3 — Fill in `config.js`

1. Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** → paste as `SUPABASE_URL`
   - **anon / public** key → paste as `SUPABASE_ANON`

```js
const SUPABASE_URL  = 'https://xyzxyzxyz.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Step 4 — Enable Google Auth (optional)

1. Supabase → **Authentication** → **Providers** → **Google** → Enable
2. Follow the Google Cloud Console OAuth setup linked there
3. Add your GitHub Pages URL to **Redirect URLs**:
   `https://YOUR-USERNAME.github.io/YOUR-REPO/auth.html`

If you skip this step, email/password login still works fully.

---

## Step 5 — Deploy to GitHub Pages

```bash
# In your repo root:
git init
git add .
git commit -m "T-O app initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then: GitHub repo → **Settings** → **Pages** → Source: `main` branch → Save

Your site will be live at:
`https://YOUR-USERNAME.github.io/YOUR-REPO/`

---

## Step 6 — Create the two demo users

### Option A — via the app
1. Go to `auth.html` → Sign Up tab
2. Create **Coach** account: `coach@t-o.app` / `Coach123!` → role: Coach
3. Create **Trainee** account: `trainee@t-o.app` / `Train123!` → role: Trainee

### Option B — via Supabase dashboard
Authentication → Users → Invite user (then update their role in the `profiles` table)

---

## How the ID-based client system works

1. **Trainee** signs up → gets a unique UUID (their User ID)
2. Trainee shares their User ID with the coach
3. **Coach** clicks "+ Add client" → pastes the UUID → searches → adds
4. The coach can now write workout & diet plans for that trainee
5. **Trainee** sees the plans in their dashboard (read-only)

The User ID is shown on both dashboards with a one-click copy button.

---

## Role differences at a glance

| Feature | Coach | Trainee |
|---|---|---|
| See own profile | ✅ | ✅ |
| Edit own profile | ✅ | ✅ |
| See client list | ✅ | ❌ |
| Add clients by ID | ✅ | ❌ |
| Edit client data | ✅ | ❌ |
| Write workout plans | ✅ | ❌ |
| Write diet plans | ✅ | ❌ |
| View own workout plan | ❌ | ✅ |
| View own diet plan | ❌ | ✅ |
| See coach info | ❌ | ✅ |
