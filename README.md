# 💜 stellacreate — CMS for teams who want both

A powerful, modern content management system with a drag-and-drop page builder, live component preview, and Groovy plugin system. Built on Spring Boot + React + Vite.

> Build pages that speak for themselves.

---

## ✨ Features

- **Visual Page Builder** — Drag components onto a canvas, resize columns, edit properties with live preview
- **Component System** — Create custom components with schema, default data, and live renderers
- **Groovy Hooks** — Server-side lifecycle hooks (BEFORE_SAVE, AFTER_SAVE, BEFORE_FETCH, AFTER_FETCH, ON_REQUEST) run on the JVM
- **Live Preview** — See exactly how your page looks before publishing, or edit unsaved drafts
- **Headless Architecture** — Content lives in a REST API; serve it to React, Vue, mobile apps, or static generators
- **Interactive Static Export** — Deploy fully interactive pages to GitHub Pages with React bundled inline — no backend needed!
- **Dark Modern Design** — Built-in components with glassmorphism, gradients, and ambient glows

---

## 🚀 Quick Start

### Prerequisites
- **Java 21+** (required for Spring Boot 3.2.4)
- **Node.js 18+** (for Vite and npm)

### 1. Start the CMS

```bash
cd /cms
./start.sh
```

This launches:
- **Backend** on `http://localhost:8080` (Spring Boot)
- **Frontend** on `http://localhost:5173` (Vite dev server)

### 2. Open the Builder

Navigate to `http://localhost:5173/pages/new` and start building! 

### 3. Create Your First Page

1. Drag components from the **palette** (left sidebar) onto the **canvas**
2. Click on a component to edit its properties (a modal opens)
3. Resize columns by dragging the divider between them
4. Click **Preview** to see the full page (unsaved drafts work too!)
5. Click **Save** to publish

### 4. Seed Sample Data (Optional)

Run the sample landing page seeder:

```bash
cd /cms
node scripts/seed-landing.js
```

Then navigate to `http://localhost:5173/pages` to see and edit it.

---

## 📐 Architecture

```
CMS
├── backend/                    # Spring Boot 3 + JPA
│   ├── src/main/java/com/cms/
│   │   ├── controller/         # REST endpoints (/api/pages, /api/components)
│   │   ├── service/            # GroovyExecutionService for hooks
│   │   ├── entity/             # Page, Component, Block JPA entities
│   │   └── config/             # DataInitializer seeds built-in components
│   └── pom.xml                 # Maven config with Groovy 4.0.20
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── App.jsx             # Router, CMS shell
│   │   ├── pages/
│   │   │   ├── PageBuilderPage.jsx   # Visual builder UI
│   │   │   ├── PageListPage.jsx      # List all pages
│   │   │   ├── PagePreviewPage.jsx   # Full-page preview (no CMS chrome)
│   │   │   └── ComponentEditorPage.jsx
│   │   ├── components/
│   │   │   └── builder/
│   │   │       ├── SortableRow.jsx      # Drag-to-reorder rows
│   │   │       ├── ColumnLayout.jsx     # Columns with resize handles
│   │   │       └── EditModal.jsx        # Property editor modal
│   │   └── registry.js         # Auto-discovers components via import.meta.glob
│   ├── scripts/
│   │   └── export-pages.js     # Static HTML generator
│   └── vite.config.js          # Custom HMR plugin for external components
│
└── packages/components/        # Reusable components
    └── src/
        ├── Hero/               # Full-width hero section
        ├── Card/               # Feature card with icon + text
        ├── Gallery/            # Responsive image grid
        ├── RichTextBlock/      # Markdown with syntax highlighting
        ├── FAQ/                # Expandable accordion
        └── Text/               # CTA banner section

REST API
├── GET  /api/pages             → List all pages
├── POST /api/pages             → Create new page
├── GET  /api/pages/:id         → Fetch page + execute AFTER_FETCH hook
├── PUT  /api/pages/:id         → Update page + execute BEFORE_SAVE, AFTER_SAVE
├── DELETE /api/pages/:id       → Delete page
├── POST /api/pages/:id/preview → Render page without saving
│
├── GET  /api/components        → List all components
├── POST /api/components        → Create custom component
└── POST /api/components/sync   → Auto-discover components from filesystem
```

---

## 🎨 Using the Page Builder

### Canvas Layout
- **Left panel (180px)**: Component palette — drag components onto the canvas
- **Center panel (flex)**: Canvas showing your page with a macOS browser mockup
- White page background with browser chrome for realistic preview

### Working with Rows & Columns
- Each **row** is a horizontal section of your page
- Each **row** contains **columns** that sit side-by-side
- **Columns are resizable** — drag the divider to adjust widths (they auto-normalize)
- **Rows are draggable** — reorder rows via the drag handle (⠿) that appears on hover

### Editing Component Data
1. Click on a component in the canvas
2. A modal opens with a **Monaco editor** — edit JSON properties
3. See live changes in real-time as you type
4. Click **Done** to apply changes

### Preview Before Saving
- Click the **Preview** button to see the full page in a new tab
- Works with unsaved drafts too! (state is stored in sessionStorage)
- The preview shows exactly how the page looks when published
- Click the **← Edit** link in the banner to return to the builder

### Saving & Publishing
- Click **Save** to commit the page to the backend
- Pages must have a unique slug (e.g., `/about`, `/products/widgets`)
- Once saved, the page is accessible via the REST API

---

## 🧩 Creating Custom Components

Every component is a module in `packages/components/src/`. Each must export:

```javascript
// packages/components/src/MyComponent/index.jsx

export const description = "Short description of this component";

export const schema = {
  fields: [
    { name: "title", type: "text", label: "Title" },
    { name: "color", type: "select", options: ["blue", "purple"] },
    { name: "items", type: "array" },
  ],
};

export const defaultData = {
  title: "Hello",
  color: "blue",
  items: [],
};

export default function MyComponentRenderer({ data }) {
  return (
    <div>
      <h2>{data.title}</h2>
      <p style={{ color: data.color }}>Content here</p>
    </div>
  );
}
```

**That's it!** The CMS auto-discovers the component on next hot-reload. No registration needed.

### Built-in Components

| Component | Use Case |
|-----------|----------|
| **Hero** | Full-width banner with headline, badge, subtitle, dual CTAs |
| **Card** | Feature card with icon, tag, title, description, link |
| **RichTextBlock** | Markdown-rendered section with optional heading |
| **Gallery** | Responsive image grid with captions and tags |
| **FAQ** | Expandable accordion with questions & answers |
| **Text** | CTA section or standalone text with optional gradient |

---

## ⚙️ Groovy Hooks — Server-Side Logic

Components can define Groovy scripts that run at specific lifecycle points. Hooks receive the component data and can transform, validate, or call external services.

### Hook Types

| Hook | When | Use Case |
|------|------|----------|
| `BEFORE_SAVE` | Before persisting to database | Validate data, normalize, set defaults |
| `AFTER_SAVE` | After successful save | Send webhooks, log events, update search index |
| `BEFORE_FETCH` | Before returning from API | Filter sensitive data, add computed fields |
| `AFTER_FETCH` | After fetching from database | Hydrate related data, enrich with metadata |
| `ON_REQUEST` | On each page request (at runtime) | Dynamic content, personalization, A/B testing |

### Writing a Hook

In the **Component Editor**, switch to the **Hooks** tab and write Groovy:

```groovy
// BEFORE_SAVE hook — validate required fields
if (!data.title || data.title.trim().isEmpty()) {
  return [valid: false, error: "Title is required"]
}

if (!data.slug?.matches(/^\/[a-z0-9-]+$/)) {
  return [valid: false, error: "Slug must start with / and contain only lowercase letters, numbers, hyphens"]
}

return [valid: true]
```

### Hook Context

Hooks have access to:
- `data` — The component or page being processed
- `context` — Request context (headers, user, etc.)
- `logger` — JVM logger for debugging

Example: Log data before saving
```groovy
logger.info("Saving component: ${data.name}")
return data
```

---

## 📦 Interactive Export to GitHub Pages

### ✨ NEW: Fully Interactive Static Pages!

Your pages are now exported as **interactive, self-contained HTML files** with:
- ✅ React runtime bundled inline
- ✅ All 12 components with full interactivity (FAQ accordions, state management, etc.)
- ✅ CSS bundled and inlined
- ✅ Page data baked into each file
- ✅ Zero backend dependencies
- ✅ Works on GitHub Pages!

### Step 1: Export Interactive Pages

```bash
cd frontend
npm run export
```

This generates:
- `dist/pages/[slug].html` — one **interactive** HTML file per page (~200KB each)
- `dist/pages/index.html` — landing page with links to all pages
- Each file is completely self-contained with React + all components + CSS

### Step 2: Push to GitHub Pages

```bash
# Create (or switch to) the gh-pages branch
git checkout -b gh-pages

# Stage and commit the exported files
git add frontend/dist/pages/
git commit -m "Deploy interactive pages to GitHub Pages"

# Push to remote
git push origin gh-pages
```

### Step 3: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Set **Source** to `gh-pages` branch
3. Set **Deploy from** to `/root`
4. Save

Your interactive pages are now live! 🎉

**Live example:** https://stellarie.github.io/headless-cms/

### How It Works

- `npm run export` fetches all pages from the backend API
- **Transpiles JSX components** to React.createElement calls
- **Bundles React 18** (UMD build) directly into each page
- **Inlines all CSS** from all components
- **Embeds page data** as JSON in each HTML file
- **Generates self-contained files** — no backend needed at runtime!

Pages are **fully interactive** — accordions open/close, components with state work perfectly, everything is responsive and beautiful. No static HTML, no missing features. Pure React interactivity in static files.

### One-Step Deploy

```bash
cd frontend
npm run export && git add frontend/dist/pages/ && git commit -m "Deploy" && git push origin gh-pages
```

### Troubleshooting Export

| Error | Solution |
|-------|----------|
| "Could not reach API" | Make sure backend is running: `cd .. && ./start.sh` |
| "No pages found" | Create at least one page in the CMS first |
| "ReferenceError: X is not defined" | This shouldn't happen! But if it does, check that all component imports are properly handled |
| "SyntaxError in HTML" | Make sure you're running the latest export script |

### About the Interactive Export

The export process:
1. Transpiles JSX components using Babel
2. Extracts module-level constants and helper functions
3. Wraps everything in IIFEs for proper scoping
4. Downloads React 18 UMD builds from jsDelivr
5. Inlines React, all components, and CSS into each page
6. Embeds page data as JSON

Result: **Standalone HTML files that work anywhere** — no server, no build step, just open in a browser!

---

## 🛠 Development

### Run in Dev Mode

```bash
cd /var/home/stella/cms
./start.sh
```

- Backend reloads on Java file changes
- Frontend hot-reloads on React/JS changes
- Component changes trigger HMR (hot module reload)

### Build for Production

```bash
cd frontend
npm run build

cd ../backend
mvn clean package
```

### Running Tests

Backend:
```bash
cd backend
mvn test
```

Frontend:
```bash
cd frontend
npm run lint
```

---

## 🐛 Troubleshooting

### Port 8080 Already in Use
```bash
# Kill whatever is using port 8080
lsof -ti :8080 | xargs kill -9
```

### Port 5173 Already in Use
```bash
# Vite will auto-increment to 5174, etc.
# Or kill the process: lsof -ti :5173 | xargs kill -9
```

### Backend Won't Start
- Ensure Java 21+ is installed: `java -version`
- Check that `$JAVA_HOME` is set: `echo $JAVA_HOME`
- Run the backend manually:
  ```bash
  cd backend
  mvn spring-boot:run
  ```

### Pages Not Exporting
- Backend must be running
- At least one page must exist in the CMS
- Check that `http://localhost:8080/api/pages` returns JSON

### Component Not Appearing in Builder
- Save the component file in `packages/components/src/ComponentName/index.jsx`
- Hard-refresh the frontend (`Ctrl+Shift+R`)
- Check browser console for errors

### Groovy Hook Errors
- Check the backend logs for error messages
- Groovy is very similar to Java — typos will fail at runtime
- Test hooks with simple `return [result: true]` first

### Pages Disappearing After Restart
- The CMS uses **H2 database** for persistence
- By default, `application.yml` uses `jdbc:h2:file:` with a **relative path**
- If you run the app from different directories, it creates a new database each time
- **Fix**: Change the datasource URL in `backend/src/main/resources/application.yml` to use an **absolute path**:
  ```yaml
  spring:
    datasource:
      url: jdbc:h2:file:/var/home/stella/cms/cms-data;AUTO_SERVER=TRUE
  ```
- Replace `/var/home/stella/cms` with your actual CMS directory path
- Restart the backend and your data will persist across sessions ✨

---

## 📚 Additional Resources

- **DEPLOYMENT.md** — Detailed GitHub Pages deployment guide
- **backend/pom.xml** — Maven dependencies and Spring Boot version
- **frontend/vite.config.js** — Vite and plugin configuration
- **packages/components/** — Examples of built-in components

---

## 💜 Built with

- **Spring Boot 3.2.4** — REST API and component management
- **Groovy 4.0.20** — Lifecycle hooks on the JVM
- **React 19** — Component renderer
- **Vite 8** — Fast frontend build tool
- **@dnd-kit** — Drag-and-drop for rows/columns
- **Monaco Editor** — JSON property editor
- **Marked.js** — Markdown rendering

---

Questions? Check the troubleshooting section or dig into the source code! The CMS is designed to be readable and hackable. ♡
