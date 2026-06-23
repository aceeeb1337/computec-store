# Deploying Computec to Vercel — Full Guide

This is the complete, step-by-step guide to put the Computec store live on
Vercel. Follow it top to bottom; it takes ~10–15 minutes.

> **Why a database is needed:** Vercel runs the app on serverless functions,
> which have **no permanent disk**. Locally the app saves the catalog, orders,
> and settings as JSON files under `/data`. In production it saves them to
> **Upstash Redis** instead. The code already switches between the two
> automatically — you just have to connect Redis (Step 3).

---

## What you'll need (all free)
- A **Vercel** account — https://vercel.com (sign up with GitHub or email)
- An **Upstash Redis** database (created from inside Vercel in Step 3)
- **Either** a GitHub account (recommended) **or** nothing extra if you use the
  Vercel CLI route in Step 2B

---

## Step 0 — Generate your session secret (once)
You need a long random string to sign admin login cookies. In PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and keep it somewhere safe — you'll paste it as
`ADMIN_SESSION_SECRET` in Step 4. **Do not commit it to git.**

---

## Step 1 — (Already done) Local git commit
The project is already a git repository with an initial commit. To confirm:

```powershell
cd E:\claude\computec-store
git log --oneline -1
```

If you ever need to commit new changes later:

```powershell
git add -A
git commit -m "your message"
```

---

## Step 2 — Get the code to Vercel

Pick **ONE** of the two routes below.

### Step 2A — Via GitHub (recommended: auto-deploys on every push)

1. **Create the repo on GitHub.** The 403 "permission denied" error happens when
   the repo doesn't exist yet or your saved credentials are stale. Fix both with
   the GitHub CLI:

   - Install it (if not already): `winget install GitHub.cli`
   - **Open a NEW PowerShell window** afterwards (a window open during install
     won't see the `gh` command yet).
   - Then:

   ```powershell
   cd E:\claude\computec-store
   gh auth login
   ```
   Choose: **GitHub.com → HTTPS → Authenticate Git: Yes → Login with a web
   browser**, copy the one-time code, approve it in the browser.

2. **Create the repo and push:**

   ```powershell
   gh repo create computec-store --private
   git push -u origin main
   ```
   - If `origin` is missing, first run:
     `git remote add origin https://github.com/YOURNAME/computec-store.git`
   - If `gh repo create` says "already exists", skip it and just run the push.

3. **Import into Vercel:** go to https://vercel.com → **Add New → Project** →
   select `computec-store` → **Import**. The framework auto-detects **Next.js**;
   leave all build settings as they are. (Don't deploy yet — do Steps 3–4 first,
   then deploy.)

### Step 2B — Via Vercel CLI (no GitHub needed)

```powershell
npm i -g vercel
vercel login          # opens the browser to sign in
cd E:\claude\computec-store
vercel                # links/creates the project and does a first deploy
```

Answer the prompts (accept the defaults; project name `computec-store`). This
gives you a preview URL. You'll still do Steps 3–4, then run `vercel --prod`.

---

## Step 3 — Add the database (Upstash Redis)

1. Open your project in the Vercel dashboard.
2. Go to the **Storage** tab → **Marketplace** → **Upstash** → **Redis**.
3. Create a **free** database and connect it to this project.

Vercel automatically adds the connection env vars
(`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, and/or
`KV_REST_API_URL` + `KV_REST_API_TOKEN`). The app reads either name — no code
changes needed. The sample catalog and sample orders seed themselves into Redis
on the first request.

---

## Step 4 — Set environment variables

In the Vercel project: **Settings → Environment Variables**. Add these for the
**Production** environment (and Preview too, if you want preview deploys to work):

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | A strong password you'll use at `/manager-pos/login` |
| `ADMIN_SESSION_SECRET` | The random string from Step 0 |
| `UPSTASH_REDIS_REST_URL` | Auto-added by Step 3 (verify it's there) |
| `UPSTASH_REDIS_REST_TOKEN` | Auto-added by Step 3 (verify it's there) |
| `SHEET_CSV_URL` *(optional)* | Only if you want a read-only Google Sheet catalog instead of the dashboard-managed one |

---

## Step 5 — Deploy

- **GitHub route:** Vercel → **Deployments** → **Redeploy** (so it picks up the
  env vars). Every future `git push` to `main` auto-deploys.
- **CLI route:** run `vercel --prod` in the project folder.

Wait ~2 minutes for the build to finish.

---

## Step 6 — You're live 🎉

1. Open your `https://your-project.vercel.app` URL — the storefront loads.
2. Go to **`/manager-pos/login`** and sign in with your `ADMIN_PASSWORD`.
3. From the dashboard you can:
   - **Products** tab — add/edit/delete products
   - **Orders** tab — view orders and change their status
   - **Storefront** tab — edit the hero text and your Facebook / WhatsApp /
     Instagram links
4. Place a test order on the storefront and confirm it appears in the Orders tab.

---

## Updating the site later
- **GitHub route:** make changes → `git add -A && git commit -m "..." && git push`.
  Vercel rebuilds and deploys automatically.
- **CLI route:** make changes → `vercel --prod`.

---

## Optional — Custom domain
Vercel → project → **Settings → Domains** → add your domain and follow the DNS
instructions. (You can also proxy it through Cloudflare's free CDN for caching.)

---

## Troubleshooting

**`gh: The term 'gh' is not recognized`**
You installed the GitHub CLI in a window that was already open. Close it and open
a **new** PowerShell window.

**`The requested URL returned error: 403` / "Permission denied" on `git push`**
Either the GitHub repo doesn't exist yet, or your saved credentials are stale.
Run `gh auth login` (Step 2A) — it refreshes credentials — then make sure the
repo exists with `gh repo create computec-store --private`, then push again.
If old credentials are cached: **Control Panel → Credential Manager → Windows
Credentials** → delete any `git:https://github.com` entry and push again.

**`error: remote origin already exists`**
Harmless — the remote is already set. Skip the `git remote add` line and just run
`git push -u origin main`.

**My products/orders/edits disappear after a while in production**
The Upstash env vars aren't set, so the app fell back to the (non-persistent)
file mode. Re-check Step 3 and Step 4, then redeploy.

**Login doesn't work after deploy**
Make sure `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are set in Vercel and you
redeployed after adding them. Changing `ADMIN_SESSION_SECRET` logs everyone out.

**Build fails**
Check the build log in Vercel. Locally, `npm run build` should succeed first.

---

## Reference: what runs where
- **Storefront pages, `/api/*` routes** → Node serverless functions on Vercel.
- **Admin auth middleware** → Vercel Edge runtime (already compatible).
- **3D hero + animations** → run in the visitor's browser (no server load).
- **Data (catalog / orders / settings)** → Upstash Redis in production, local
  files in `npm run dev`.
