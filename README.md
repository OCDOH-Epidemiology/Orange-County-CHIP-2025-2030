# Orange County CHIP Dashboard

A public, easy-to-read dashboard for the Orange County (NY) 2025–2030
**Community Health Improvement Plan (CHIP)**. It shows what the county is
working on, who the partners are, and how each priority area is progressing.

The site is a static webpage — no database, no server. It reads a single JSON
file (`src/data/chip-data.json`) that is generated from an Excel workbook.

> If you are a light coder or non-technical partner, focus on the two Excel
> files in the `template/` folder. Everything else can stay as it is.

---

## Table of contents

1. [What's in this repo](#whats-in-this-repo)
2. [Quick edits: updating the data in Excel](#quick-edits-updating-the-data-in-excel)
3. [Running the site on your own computer](#running-the-site-on-your-own-computer)
4. [Publishing the site to the web (GitHub Pages)](#publishing-the-site-to-the-web-github-pages)
5. [Customizing the look](#customizing-the-look)
6. [Troubleshooting](#troubleshooting)

---

## What's in this repo

| Folder / file | What it's for |
| --- | --- |
| `template/chip-template.xlsx` | **Blank** Excel template for partners to fill in. |
| `template/chip-sample.xlsx` | Pre-filled example workbook with the real 2025–2030 CHIP data. Regenerate this by editing the template above and running `npm run data:build`. |
| `src/data/chip-data.json` | The data the site actually reads. Auto-generated from the Excel workbook — do not hand-edit unless you're sure. |
| `scripts/excel-to-json.js` | The converter that turns Excel into JSON. |
| `scripts/generate-template.js` | Regenerates the blank template and sample workbook from the current JSON (useful after schema changes). |
| `docs/schema.md` | Documents every field. Read this if you're editing the JSON directly. |
| `docs/*.docx` | The source CHIP documents submitted to NYSDOH. |
| `src/` | The React app itself (Vite + Tailwind CSS). |
| `.github/workflows/deploy.yml` | Automatically publishes to GitHub Pages on every push to `main`. |
| `vite.config.js` | Build configuration. **You must change `REPO_NAME` here before deploying.** |

---

## Quick edits: updating the data in Excel

You do **not** need to run any code to update the numbers or milestones. The
process is:

1. Open `template/chip-sample.xlsx` in Excel (or Google Sheets, LibreOffice, etc.).
2. Make your edits. See below for the rules.
3. Save the file.
4. Ask a developer (or run it yourself — see step 3 in the next section) to run:

   ```bash
   npm run data:build
   ```

5. Commit and push both the `.xlsx` and the regenerated `src/data/chip-data.json` to GitHub.

The GitHub Action will rebuild and publish the site automatically.

### Rules for editing the workbook

The workbook has four tabs. Each tab has a **header row** and a **hint row**
(the hint row starts with `# example` and is ignored by the converter — you
can delete it if you want).

- **Meta** — plan-wide info: county, plan name, last updated date (`YYYY-MM-DD`
  format), version, contact info. Simple key/value rows.
- **Priorities** — one row per priority area. Includes goal, disparity,
  objective, baseline / target / current value, and evaluation measures.
  Multiple evaluation measures in one cell? Separate them with semicolons: `measure 1 ; measure 2`.
- **Milestones** — one row per milestone. Each milestone links to a priority
  by `priorityId`. The `status` column must be one of exactly:
  - `not_started`
  - `in_progress`
  - `complete`
- **Partners** — one row per partner. Links to a priority by `priorityId`.
  - `role` must be `lead` or `advisory`.
  - `activityStatus` is a free-form label (e.g. `named_only`, `active`,
    `engaged`). The dashboard displays whatever you write here — it doesn't
    interpret the value. OCDOH will define what "active" means in the future;
    for now, leave the sample values as they are.

If the converter can't understand something, it will print a clear message
telling you exactly which sheet and which row the problem is in.

### More detail

- The full schema is documented in [`docs/schema.md`](docs/schema.md).
- If a priority area does not yet have a current measurement, leave
  `currentValue` blank. The site will show "baseline established, tracking to
  begin" instead of a misleading progress bar.

---

## Running the site on your own computer

You need [Node.js 20 or newer](https://nodejs.org/) installed. On Mac, the
easiest way is with [nvm](https://github.com/nvm-sh/nvm) or via Homebrew
(`brew install node`).

Then, in a terminal, from this project's folder:

```bash
# 1. Install the site's dependencies (only needed once)
npm install

# 2. Start the local development server
npm run dev
```

Your terminal will show a URL like `http://localhost:5173/REPO_NAME/`. Open it
in a browser. The site will reload automatically whenever you save a file.

### Regenerating the JSON from Excel

```bash
# Convert the sample workbook (template/chip-sample.xlsx) into src/data/chip-data.json
npm run data:build:sample

# Or, if you have your own workbook at a different path:
node scripts/excel-to-json.js path/to/your-workbook.xlsx
```

### Making a production build

```bash
npm run build
```

The finished site ends up in the `dist/` folder — that's what gets uploaded to
GitHub Pages.

---

## Publishing the site to the web (GitHub Pages)

GitHub Pages is a free hosting service for static sites. Here is the exact
sequence, in plain language.

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in.
2. Click the `+` in the top-right, then "New repository".
3. Give it a short, all-lowercase name with dashes — e.g. `chip-dashboard`.
   **Write down the exact name.** You'll need it in the next step.
4. Leave "Public" selected (so anyone can view the site).
5. Do **not** initialize with a README (this project already has one).
6. Click "Create repository".

### Step 2 — Tell the site what its GitHub name is

Open `vite.config.js` in this project. Find this line:

```js
base: '/REPO_NAME/',
```

Replace `REPO_NAME` with the exact name you chose in step 1. For example:

```js
base: '/chip-dashboard/',
```

Keep the leading and trailing slashes exactly as shown.

### Step 3 — Push the project to GitHub

From this project's folder, in a terminal:

```bash
git init
git add .
git commit -m "Initial dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username
and the repository name from step 1.

### Step 4 — Turn on GitHub Pages

1. In your new repository on GitHub, click **Settings**.
2. In the left sidebar, click **Pages**.
3. Under "Build and deployment" → "Source", choose **GitHub Actions**.
4. That's it. Nothing else to configure.

### Step 5 — Wait for the site to build

1. Click the **Actions** tab in your repository.
2. You should see a workflow running called "Deploy to GitHub Pages".
3. Wait 1–2 minutes for it to finish (the yellow circle turns into a green
   checkmark).
4. When it's done, your site is live at:

   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

That's it. From now on, every time you push a change to the `main` branch, the
site rebuilds automatically.

---

## Customizing the look

- **Colors** — edit `tailwind.config.js`. The `brand.blue` and `brand.green`
  values control the primary palette. Both current values (`#1B4B8A` and
  `#2F855A`) meet WCAG AA contrast requirements against white.
- **Logo / seal** — replace `public/logo.png` with a PNG of the Orange County
  seal, roughly 128×128 pixels. The header falls back gracefully if the file
  is missing.
- **Contact info** — edit the `Meta` sheet in the Excel workbook (or the
  `meta.contact` block in `src/data/chip-data.json` directly). It appears in
  the footer and on the Get Involved page.
- **Last updated date** — edit the `lastUpdated` key in the `Meta` sheet.

---

## Troubleshooting

**The deployed site is blank.**
Almost always this is a `base` mismatch. Open `vite.config.js` and make sure
the `base` value is `/YOUR_REPO_NAME/` with slashes on both sides.
Then commit and push again.

**Deep links (e.g. `/#/timeline`) don't work when I refresh.**
They should — this project uses `HashRouter`. If they don't, you may have
switched to `BrowserRouter` at some point. Check `src/App.jsx`.

**`npm run data:build` says "column 'status' not recognized".**
The `status` column in the Milestones sheet must be exactly one of
`not_started`, `in_progress`, or `complete` — with underscores, no spaces.

**`npm run data:build` says "priorityId 'foo' not found".**
Every milestone and every partner links to a priority area by `priorityId`.
Make sure the `priorityId` on the row exists in the `Priorities` sheet.

**A partner's activity status displays as "status not set".**
The `activityStatus` column in the Partners sheet is blank on that row. Any
non-empty string works (`named_only`, `active`, etc.) — the dashboard will
just show whatever you write.

**Something else is broken.**
The converter prints the exact sheet and row of any problem. If the app
itself is broken, open the browser's developer console (Right-click → Inspect
→ Console tab) — most React errors show up there with clear messages.
