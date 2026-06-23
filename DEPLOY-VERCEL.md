# Deploying Computec to Vercel

The app runs on Vercel's serverless platform, which has **no persistent
filesystem**. The catalog, orders, and settings are therefore stored in
**Upstash Redis** in production. Locally (`npm run dev`) it still uses JSON
files under `/data` — no Redis needed.

## 1. Create the data store (Upstash Redis)

Either path works; both end up giving you two env vars.

- **Easiest — via Vercel:** in your Vercel project → **Storage** → **Marketplace**
  → add **Upstash Redis**. Vercel injects `UPSTASH_REDIS_REST_URL` and
  `UPSTASH_REDIS_REST_TOKEN` (and/or `KV_REST_API_URL` / `KV_REST_API_TOKEN`)
  automatically — the app reads either name.
- **Manual:** create a free database at [upstash.com](https://upstash.com),
  open it, and copy the **REST URL** and **REST TOKEN**.

The app seeds the sample catalog + sample orders into Redis automatically on
first request.

## 2. Set environment variables (Vercel → Settings → Environment Variables)

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | Your dashboard password (used at `/manager-pos/login`) |
| `ADMIN_SESSION_SECRET` | A long random string — sign-in cookie secret. Generate with `openssl rand -hex 32` |
| `UPSTASH_REDIS_REST_URL` | From Upstash (auto-set if you used the Vercel integration) |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash (auto-set if you used the Vercel integration) |
| `SHEET_CSV_URL` *(optional)* | Published Google Sheet CSV, if you want a read-only sheet catalog instead |

Set them for **Production** (and Preview if you want preview deploys to work).

## 3. Deploy

**Option A — Git (recommended):**
1. Push this project to a GitHub/GitLab repo.
2. In Vercel → **Add New → Project** → import the repo.
3. Framework preset auto-detects **Next.js**. No build settings to change.
4. Add the env vars from step 2, then **Deploy**.
   Every push redeploys automatically.

**Option B — Vercel CLI (no Git):**
```bash
npm i -g vercel
vercel login
vercel            # first run links/creates the project
# add env vars in the dashboard (step 2), then:
vercel --prod
```

## 4. After it's live
- Visit `/manager-pos/login` and sign in with `ADMIN_PASSWORD`.
- Add products, manage orders, edit the hero + social links — all persist to Redis.
- (Optional) Put Cloudflare's free CDN in front of your domain for caching.

## Notes
- **Middleware** (admin auth) runs on Vercel's Edge runtime — already compatible.
- The 3D hero and animations are client-side; they add no server load.
- To wipe back to the seed data, delete the `computec:*` keys in the Upstash console.
