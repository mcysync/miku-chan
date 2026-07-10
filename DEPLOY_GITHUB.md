# Deploying Miku-Chan to your GitHub

You asked to remove Lovable branding but keep API keys — done!

## What I did

1. Removed `@lovable.dev/vite-tanstack-config` (the proprietary Lovable wrapper)
2. Rewrote `vite.config.ts` to standard TanStack Start + Vite + Tailwind
3. Removed `reportLovableError` telemetry
4. Removed "Powered by Lovable AI" footer → now "Gemini 2.5 Pro inside"
5. Fixed `*.asset.json` virtual imports → direct `miku-chan.jpg` import
6. Kept gateway logic:
   - `LOVABLE_API_KEY` still works
   - Also accepts `AI_API_KEY` / `OPENAI_API_KEY`
   - Default gateway `https://ai.gateway.lovable.dev/v1` (changeable via `AI_GATEWAY_URL`)
7. Cleaned `bunfig.toml`, `.gitignore`, `components.json`, `tsconfig.json`
8. Added `README.md`, `.env.example`, GitHub Actions workflow

Build tested: `vite build` ✅ passes.

## How to push to your repo `mcysync/miku-chan`

From this cleaned folder:

```bash
cd /path/to/miku-chan-clean

# init git if needed
git init
git remote add origin https://github.com/mcysync/miku-chan.git
git branch -M main

# add files
git add .
git commit -m "chore: remove Lovable branding, standard TanStack Start config, keep API gateway"

# force push (you removed old commits, or use normal push if you want history)
git push -u origin main --force
```

Or if you already have the repo cloned:

```bash
# inside your existing clone
rm -rf * (keep .git)
cp -r /path/to/miku-chan-clean/* .
cp -r /path/to/miku-chan-clean/.github .
cp /path/to/miku-chan-clean/.gitignore .
git add -A
git commit -m "clean: lovable-free"
git push
```

## Env setup

Create `.env` locally and on Vercel/Cloudflare:

```
LOVABLE_API_KEY=your_key_here
# optional:
AI_GATEWAY_URL=https://ai.gateway.lovable.dev/v1
AI_MODEL=google/gemini-2.5-pro
```

Your old Lovable key still works because we kept the header `Lovable-API-Key`.

## Deployment recommendations

- **Vercel**: Import GitHub repo, add `LOVABLE_API_KEY` env, deploy. Works out of box (Nitro auto-detects).
- **Cloudflare**: Same, or use `bun run build` and Wrangler.
- **GitHub Pages**: NOT recommended for full app because `/api/chat` needs a server. If you *must* use GH Pages, host API elsewhere and set `AI_GATEWAY_URL` to that hosted URL. Or just use Pages for landing, Vercel for app.

## Verify Lovable branding removed

```bash
grep -R "lovable.dev" --include="*.ts" --include="*.tsx" .
# Should only return comments in ai-gateway.server.ts about compatibility, not imports
```

Footer now says "Miku-Chan builds websites... Gemini 2.5 Pro inside" — no Lovable.

Enjoy, senpai ~ ✨
