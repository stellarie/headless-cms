# Deployment to GitHub Pages

Export your pages as static HTML and host them on GitHub Pages!

## Quick Start

1. **Create a GitHub Pages branch** (if you haven't already):
   ```bash
   git checkout -b gh-pages
   ```

2. **Export your pages** (backend must be running):
   ```bash
   cd frontend
   npm run export
   ```
   
   This generates static HTML files in `frontend/dist/pages/`

3. **Commit and push**:
   ```bash
   git add frontend/dist/pages/
   git commit -m "Export static pages"
   git push origin gh-pages
   ```

4. **Enable GitHub Pages**:
   - Go to your repo → Settings → Pages
   - Source: `gh-pages` branch
   - Deploy from: `/ (root)`

Your pages are now live! 🎉

## One-Step Deploy

Or use the combined command:
```bash
cd frontend
npm run deploy    # Builds Vite + exports pages
```

Then push:
```bash
git add frontend/dist/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

## How It Works

The exporter:
- ✅ Fetches all pages from your backend API (`/api/pages`)
- ✅ Renders components to static HTML
- ✅ Generates a landing page (`index.html`) with links to all pages
- ✅ Saves each page as `[slug].html`

## Customization

Edit `frontend/scripts/export-pages.js` to:
- Change the API endpoint (default: `http://localhost:8080/api`)
- Modify HTML output format
- Add custom CSS or meta tags
- Change the components available during export

## Environment

- The **backend** serves your content via REST API
- The **static export** runs at build time and bakes everything to HTML
- No runtime dependencies — pure static files

You can delete the backend after exporting and your pages will still work! (But you won't be able to edit them without the CMS running.)

## Troubleshooting

**"Could not reach API"**
- Make sure the backend is running: `cd .. && ./start.sh`
- Check that port 8080 is accessible

**"No pages found"**
- Create at least one page in the CMS first
- Visit `http://localhost:5173/pages` to create one

**Import paths are broken**
- The exporter generates absolute links
- Make sure your GitHub Pages is set to the `gh-pages` branch
- Or manually edit the exported HTML to use relative paths

---

Built with 💜 using Spring Boot + React + Vite
