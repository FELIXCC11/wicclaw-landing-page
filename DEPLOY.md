# Deploy WicClaw to Vercel

## One-click deploy (recommended)

```bash
# 1. Initialize git and push to GitHub
git init
git add .
git commit -m "feat: initial WicClaw landing page"
git remote add origin https://github.com/YOUR_USERNAME/wicclaw.git
git push -u origin main

# 2. Go to vercel.com → New Project → Import from GitHub → select wicclaw
# 3. Leave all settings default — Vercel auto-detects Next.js 15
# 4. Click Deploy
```

Vercel builds on Linux so none of the local Windows exFAT issues apply.

## Run locally (requires NTFS drive)

The E: drive is formatted as exFAT, which Windows cannot use for symlinks.
Next.js build requires NTFS. Options:

1. **Copy project to C: drive** (NTFS):
   ```powershell
   Copy-Item -Recurse E:\Projects\wicclaw C:\Projects\wicclaw -Exclude node_modules,.next
   cd C:\Projects\wicclaw
   pnpm install
   pnpm dev
   ```

2. **Use WSL** (Linux filesystem, no restrictions):
   ```bash
   cp -r /mnt/e/Projects/wicclaw ~/Projects/wicclaw
   cd ~/Projects/wicclaw
   pnpm install && pnpm dev
   ```

## Add your assets

Before deploying, place your images in `public/images/`:

| File | Used in |
|------|---------|
| `wicmini-hero.png` ✅ already there | Hero + Core product card |
| `wicmini-exploded.png` ✅ already there | Fleet product card |
| `wicmini-internals.png` ✅ already there | Core gallery tab 2 |
| `wicmini-cooling.png` ✅ already there | Core gallery tab 3 |
| `wicmini-layers.png` ✅ already there | Fleet gallery tab 2 |

Video (`public/videos/wicmini-demo.mp4`) ✅ already there.
