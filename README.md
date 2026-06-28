# T-0 — Setup Guide

## Your credentials (already baked into config.js)

| Item | Value |
|---|---|
| Supabase URL | https://smctblcoeqtnbgwzsihv.supabase.co |
| Project ID | smctblcoeqtnbgwzsihv |
| GitHub Pages | https://omar-c-137.github.io/T-0/ |

---

## Files in this folder

| File | Purpose |
|---|---|
| `index.html` | Landing page |
| `auth.html` | Sign in / Sign up (email + Google) |
| `coach.html` | Coach dashboard |
| `trainee.html` | Trainee dashboard |
| `style.css` | All shared styles |
| `config.js` | Supabase URL + key (already filled) |
| `supabase_schema.sql` | Run **once** in Supabase SQL editor |

---

## Step 1 — Run the database schema (do this first)

1. Go to: https://supabase.com/dashboard/project/smctblcoeqtnbgwzsihv
2. Click **SQL Editor** → **New query**
3. Paste the full contents of `supabase_schema.sql` → **Run**

---

## Step 2 — Enable Google Sign-In in Supabase

1. Supabase dashboard → **Authentication** → **Providers** → **Google** → Enable
2. Enter your Google Client ID:
   `987120778850-jua4bnal1cp5hjqv4o6nojdlajiumvm0.apps.googleusercontent.com`
3. You'll also need the Client Secret from Google Cloud Console
   (APIs & Services → Credentials → your OAuth client)
4. Save

---

## Step 3 — Add redirect URL to Supabase

1. Supabase → **Authentication** → **URL Configuration**
2. Under **Redirect URLs** add:
   `https://omar-c-137.github.io/T-0/auth.html`
3. Also add for local testing:
   `http://localhost:5500/auth.html`

---

## Step 4 — Add redirect URL to Google Cloud Console

1. Go to: https://console.cloud.google.com
2. APIs & Services → Credentials → your OAuth 2.0 Client
3. Under **Authorized redirect URIs** add:
   `https://smctblcoeqtnbgwzsihv.supabase.co/auth/v1/callback`
4. Under **Authorized JavaScript origins** add:
   `https://omar-c-137.github.io`

---

## Step 5 — Push to GitHub Pages

Your repo name must be `T-0` for the URLs to match. If different, update `auth.html` line with `github.io`.

```bash
git init
git add .
git commit -m "T-0 initial deploy"
git branch -M main
git remote add origin https://github.com/omar-c-137/T-0.git
git push -u origin main
```

Then: GitHub repo → **Settings** → **Pages** → Source: `main` branch → **Save**

Live at: `https://omar-c-137.github.io/T-0/`

---

## Step 6 — Create demo accounts

Go to your live site → `auth.html` → Sign Up tab:

| Role | Email | Password |
|---|---|---|
| Coach | coach@t-o.app | Coach123! |
| Trainee | trainee@t-o.app | Train123! |

---

## How the ID system works

1. Trainee signs up → gets a UUID shown on their dashboard
2. Trainee copies their User ID and shares it with coach
3. Coach clicks **+ Add client** → pastes the UUID → confirms
4. Coach writes workout & diet plans for that trainee
5. Trainee sees the plans instantly (read-only)

---

## Role differences

| Feature | Coach | Trainee |
|---|---|---|
| Edit own profile | ✅ | ✅ |
| See & manage clients | ✅ | ❌ |
| Add clients by UUID | ✅ | ❌ |
| Write workout plans | ✅ | ❌ |
| Write diet plans | ✅ | ❌ |
| View own workout plan | ❌ | ✅ |
| View own diet plan | ❌ | ✅ |
| See coach info card | ❌ | ✅ |
