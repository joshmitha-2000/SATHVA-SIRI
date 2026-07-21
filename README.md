<<<<<<< HEAD
# SATHVA-SIRI
=======
# Sathva Siri — website

A React + Tailwind storefront for Sathva Siri (Malenadu farm goods).

## Run it locally (optional, just to preview)

```bash
npm install
npm run dev
```

Then open the local address it prints (usually http://localhost:5173).

## Deploy to Vercel — no coding needed

**Step 1 — Put the code on GitHub**
1. Go to https://github.com/new and create a new repository (e.g. `sathva-siri`). Keep it Public or Private, either works.
2. On your computer, unzip this project folder.
3. In that folder, run:
   ```bash
   git init
   git add .
   git commit -m "Sathva Siri website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sathva-siri.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username. If you don't have `git` installed, GitHub also lets you drag-and-drop the files directly on the repo page instead of using these commands.)

**Step 2 — Import into Vercel**
1. Go to https://vercel.com and sign up / log in (you can log in with your GitHub account directly — easiest option).
2. Click **Add New → Project**.
3. Select the `sathva-siri` repo you just pushed.
4. Vercel auto-detects this as a Vite project — leave all settings as default.
5. Click **Deploy**.

That's it — in about a minute you'll get a live link like `sathva-siri.vercel.app`. Every time you push new changes to GitHub, Vercel automatically redeploys.

## Custom domain (optional)

In your Vercel project → **Settings → Domains**, you can attach your own domain (e.g. `sathvasiri.in`) if you buy one — Vercel walks you through the DNS steps.

## About the "Place order" email

Right now, "Buy now" / "Place order" opens the customer's own email app with the order pre-filled — they still need to hit send themselves, since a plain website can't send email on its own for security reasons. If you want it to email you automatically with no action from the customer, set up a free form endpoint at https://formspree.io and send it to Claude to wire in.
>>>>>>> 4da6fca (Initial project commit)
