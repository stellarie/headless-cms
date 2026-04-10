#!/usr/bin/env node
/**
 * Seeds a sample landing page into the CMS.
 * Run with: node scripts/seed-landing.js
 * Requires the backend to be running on localhost:8080.
 */
const { randomUUID: uuid } = require('crypto');

const API = 'http://localhost:8080/api';

// ── Component data ──────────────────────────────────────────────

const heroData = {
  badge: '✦ Headless CMS',
  headline: 'Build pages that',
  headlineAccent: 'speak for themselves.',
  subtitle: 'A powerful visual CMS built on Spring Boot and React. Compose components with drag-and-drop, preview live, and publish to any frontend.',
  ctaText: 'Open Builder →',
  ctaHref: '#builder',
  secondaryCtaText: 'View Components',
  secondaryCtaHref: '#components',
};

const featureCards = [
  {
    icon: '🎨',
    tag: 'Builder',
    title: 'Visual Page Builder',
    description: 'Drag, drop, and resize columns. Build multi-section layouts with live preview — no code needed.',
    linkText: 'Try the builder',
    linkHref: '#builder',
  },
  {
    icon: '⚡',
    tag: 'Performance',
    title: 'Lightning Fast Stack',
    description: 'Spring Boot 3 backend with JPA persistence. React + Vite 8 frontend with instant HMR and sub-second builds.',
    linkText: 'Read the docs',
    linkHref: '#docs',
  },
  {
    icon: '🔌',
    tag: 'Architecture',
    title: 'Truly Headless',
    description: 'Your content lives in a REST API. Serve it to React, Vue, mobile apps, or static generators — your choice.',
    linkText: 'Explore the API',
    linkHref: '#api',
  },
];

const richTextData = {
  label: 'Why choose us',
  heading: 'Content management that gets out of your way',
  body: 'Most CMS platforms make you choose between **developer power** and **editor simplicity**. We refused to compromise.\n\nEvery component you create is a first-class citizen — with its own schema, default data, live JSX renderer, and Groovy lifecycle hooks.\n\n- **Visual editor** — compose pages by dragging and dropping components\n- **Live preview** — see exactly how your page looks before publishing\n- **Component registry** — auto-detected from the filesystem, no registration needed\n- **Groovy hooks** — run server-side logic on BEFORE_SAVE, AFTER_FETCH, ON_REQUEST\n- **Headless API** — connect any frontend framework to your content',
  align: 'center',
};

const galleryData = {
  label: 'Gallery',
  heading: 'See it in action',
  columns: 3,
  items: [
    { url: 'https://picsum.photos/seed/builder1/600/400', caption: 'Page Builder', tag: 'UI' },
    { url: 'https://picsum.photos/seed/preview1/600/400', caption: 'Live Preview', tag: 'DX' },
    { url: 'https://picsum.photos/seed/api1/600/400', caption: 'REST API', tag: 'API' },
    { url: 'https://picsum.photos/seed/comp1/600/400', caption: 'Component Editor', tag: 'Code' },
    { url: 'https://picsum.photos/seed/hooks1/600/400', caption: 'Groovy Hooks', tag: 'Logic' },
    { url: 'https://picsum.photos/seed/dark1/600/400', caption: 'Dark Theme', tag: 'Design' },
  ],
};

const faqData = {
  label: 'FAQ',
  heading: 'Common questions',
  items: [
    {
      question: 'What is a headless CMS?',
      answer: 'A headless CMS manages content without being tied to a specific frontend. Content is served via API — you build the frontend however you like.',
    },
    {
      question: 'How do I add a custom component?',
      answer: 'Drop a new folder under packages/components/src/ with an index.jsx exporting description, schema, defaultData, and a default renderer. The CMS auto-registers it on the next hot-reload.',
    },
    {
      question: 'What are Groovy hooks?',
      answer: 'Groovy hooks are server-side scripts that run at lifecycle points: BEFORE_SAVE, AFTER_SAVE, BEFORE_FETCH, AFTER_FETCH, and ON_REQUEST. They can transform data, validate, or call external services — all on the JVM.',
    },
    {
      question: 'Can I preview before publishing?',
      answer: 'Yes! Every page has a Preview button that opens a full-page preview without any CMS chrome. It even works for unsaved drafts using sessionStorage.',
    },
    {
      question: 'Can columns be resized?',
      answer: 'Absolutely. Drag the divider between any two columns in the page builder to resize them freely. Widths normalize to always sum to 100%.',
    },
  ],
};

const ctaData = {
  label: 'Get started today',
  heading: 'Ready to ship beautiful pages?',
  headingGradient: true,
  body: 'Open the page builder and start composing. Add components from the palette, edit their data, and preview live — all in one place.',
  ctaText: 'Open the Builder →',
  ctaHref: '/pages/new',
  align: 'center',
};

// ── Page structure ──────────────────────────────────────────────

const blocks = [
  // Row 1 — Hero (full width)
  {
    id: uuid(),
    columns: [
      { id: uuid(), componentName: 'Hero', data: JSON.stringify(heroData), width: 100 },
    ],
  },
  // Row 2 — Three feature cards
  {
    id: uuid(),
    columns: featureCards.map((card, i) => ({
      id: uuid(),
      componentName: 'Card',
      data: JSON.stringify(card),
      width: 33.333,
    })),
  },
  // Row 3 — Rich text section
  {
    id: uuid(),
    columns: [
      { id: uuid(), componentName: 'RichTextBlock', data: JSON.stringify(richTextData), width: 100 },
    ],
  },
  // Row 4 — Gallery
  {
    id: uuid(),
    columns: [
      { id: uuid(), componentName: 'Gallery', data: JSON.stringify(galleryData), width: 100 },
    ],
  },
  // Row 5 — FAQ
  {
    id: uuid(),
    columns: [
      { id: uuid(), componentName: 'FAQ', data: JSON.stringify(faqData), width: 100 },
    ],
  },
  // Row 6 — CTA footer
  {
    id: uuid(),
    columns: [
      { id: uuid(), componentName: 'Text', data: JSON.stringify(ctaData), width: 100 },
    ],
  },
];

// ── Seed ────────────────────────────────────────────────────────

async function seed() {
  console.log('Checking API…');
  let pages;
  try {
    pages = await fetch(`${API}/pages`).then(r => r.json());
  } catch {
    console.error('Could not reach the backend at', API);
    console.error('Make sure the server is running: cd cms && ./start.sh');
    process.exit(1);
  }

  // Delete existing page with same slug to start fresh
  const existing = pages.find(p => p.slug === '/home');
  if (existing) {
    console.log('Deleting existing /home page…');
    await fetch(`${API}/pages/${existing.id}`, { method: 'DELETE' });
  }

  console.log('Creating landing page…');
  const res = await fetch(`${API}/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Landing Page',
      slug: '/home',
      blocks: JSON.stringify(blocks),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Failed:', res.status, text);
    process.exit(1);
  }

  const page = await res.json();
  console.log(`✓ Created "${page.name}" (${page.slug}) — id: ${page.id}`);
  console.log(`  Preview: http://localhost:5173/pages/${page.id}/preview`);
  console.log(`  Edit:    http://localhost:5173/pages/${page.id}/edit`);
}

seed();
