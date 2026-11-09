# Chill Area Parking Rules — React + Vite

A bilingual (Khmer / English) responsive parking rules website with a QR code that automatically points to the current website URL.

## Requirements
- Node.js 18+ (Node.js 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite, usually `http://localhost:5173`.

## Build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages
1. Create a **public** GitHub repository named `chill-area-parking-rules`.
2. Upload all project files (including `package.json`, `index.html`, `src/`, `vite.config.ts`, and tsconfig files) to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Add this workflow file at `.github/workflows/deploy.yml` (create the folders if needed):

```yaml
name: Deploy React app to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
6. Wait for the Actions workflow to finish. Your website URL will be:
   `https://YOUR-GITHUB-USERNAME.github.io/chill-area-parking-rules/`
7. Open that published URL and use **Download QR**. The QR code is generated from the live URL.

## Important
- The QR code generated on localhost points to localhost and will not work for visitors. Download the QR only after publishing.
- `vite.config.ts` uses `base: "./"` so static assets work from a GitHub Pages project subpath.
- Edit bilingual parking rules in `src/App.tsx`, in the `rules` array.
- Edit the brand name or visual theme in `src/App.tsx` and `src/styles.css`.

## Logo
Your provided Chill Area logo is included at `src/assets/chill-area-logo.jpg` and displayed in the website header and footer.
