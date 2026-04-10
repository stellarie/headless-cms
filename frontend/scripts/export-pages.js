#!/usr/bin/env node
/**
 * Static HTML exporter for GitHub Pages
 * Renders all pages to static HTML files
 * Run: npm run export
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, '../../../packages/components/src');

const API = 'http://localhost:8080/api';
const OUTPUT_DIR = path.resolve(__dirname, '../dist/pages');

// Simple markdown to HTML (same as in components)
function renderMarkdown(md) {
  if (!md) return '';
  const escaped = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = escaped.split('\n');
  let html = '';
  let inList = false;

  for (const raw of lines) {
    const line = raw
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e2e8f0;font-weight:700">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:rgba(108,99,255,0.12);color:#a5b4fc;padding:1px 5px;border-radius:3px;font-size:0.9em">$1</code>');

    if (line.startsWith('- ')) {
      if (!inList) { html += '<ul style="margin:0 0 16px;padding-left:20px;color:#8892a4">'; inList = true; }
      html += `<li style="margin-bottom:6px;line-height:1.7">${line.slice(2)}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (line.startsWith('### ')) html += `<h3 style="color:#e2e8f0;font-size:1.05rem;font-weight:700;margin:24px 0 8px">${line.slice(4)}</h3>`;
      else if (line.startsWith('## ')) html += `<h2 style="color:#f0f0ff;font-size:1.3rem;font-weight:700;margin:28px 0 10px">${line.slice(3)}</h2>`;
      else if (line.startsWith('# ')) html += `<h1 style="color:#f0f0ff;font-size:1.7rem;font-weight:800;margin:32px 0 12px">${line.slice(2)}</h1>`;
      else if (line.trim() === '') html += '<br/>';
      else html += `<p style="color:#8892a4;line-height:1.8;margin:0 0 14px">${line}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

// Normalize rows (same as frontend)
function normalizeRows(blocksJson) {
  try {
    const parsed = JSON.parse(blocksJson || '[]');
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    if (!parsed[0].columns) {
      return parsed.map(block => ({
        id: block.id || Math.random().toString(36).slice(2),
        columns: [{ id: Math.random().toString(36).slice(2), componentName: block.componentName, data: block.data || '{}', width: 100 }],
      }));
    }
    return parsed;
  } catch { return []; }
}

// Render components to HTML based on their data
function renderComponentHTML(componentName, dataJson) {
  let data = {};
  try { data = JSON.parse(dataJson || '{}'); } catch {}

  switch (componentName) {
    case 'Hero':
      return `
        <section style="background: linear-gradient(160deg, #06060f 0%, #0a0a18 60%, #08080f 100%); padding: 100px 48px; text-align: center; position: relative; overflow: hidden; font-family: Inter, system-ui, sans-serif;">
          <div style="position: absolute; top: 5%; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(108,99,255,0.13) 0%, transparent 68%); pointer-events: none;"></div>
          <div style="position: relative; max-width: 820px; margin: 0 auto;">
            ${data.badge ? `<div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.35); border-radius: 100px; padding: 5px 16px; font-size: 12px; color: #a5b4fc; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 32px;">${data.badge}</div>` : ''}
            <h1 style="font-size: clamp(2.6rem, 5vw, 4.2rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.025em; color: #f0f0ff; margin: ${data.headlineAccent ? '0 0 2px' : '0 0 24px'};">${data.headline || 'Your headline here'}</h1>
            ${data.headlineAccent ? `<h1 style="font-size: clamp(2.6rem, 5vw, 4.2rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.025em; margin: 0 0 28px; background: linear-gradient(135deg, #818cf8 0%, #a855f7 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${data.headlineAccent}</h1>` : ''}
            ${data.subtitle ? `<p style="font-size: 1.15rem; color: #8892a4; max-width: 580px; margin: 0 auto 44px; line-height: 1.75;">${data.subtitle}</p>` : ''}
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              ${data.ctaText ? `<a href="${data.ctaHref || '#'}" style="display: inline-block; background: linear-gradient(135deg, #6c63ff, #a855f7); color: #fff; padding: 14px 30px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 0 32px rgba(108,99,255,0.4), 0 4px 12px rgba(0,0,0,0.3);">${data.ctaText}</a>` : ''}
              ${data.secondaryCtaText ? `<a href="${data.secondaryCtaHref || '#'}" style="display: inline-block; background: rgba(255,255,255,0.04); color: #c4c9e0; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(8px);">${data.secondaryCtaText}</a>` : ''}
            </div>
          </div>
        </section>`;

    case 'Card':
      return `
        <div style="background: linear-gradient(145deg, #0e0e1c, #141428); border: 1px solid rgba(108,99,255,0.15); border-radius: 16px; padding: 28px 24px; font-family: Inter, system-ui, sans-serif; position: relative; overflow: hidden; height: 100%; box-sizing: border-box;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent 0%, rgba(108,99,255,0.7) 50%, transparent 100%);"></div>
          ${data.icon ? `<div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px;">${data.icon}</div>` : ''}
          ${data.tag ? `<span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #818cf8; background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.2); border-radius: 100px; padding: 2px 8px; display: inline-block; margin-bottom: 10px;">${data.tag}</span>` : ''}
          <h3 style="color: #f0f0ff; font-size: 1.05rem; font-weight: 700; margin: 0 0 10px;">${data.title || 'Card Title'}</h3>
          <p style="color: #8892a4; font-size: 0.9rem; line-height: 1.72; margin: 0 0 16px;">${data.description || 'Card description goes here.'}</p>
          ${data.linkText ? `<a href="${data.linkHref || '#'}" style="color: #818cf8; font-size: 0.88rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">${data.linkText} →</a>` : ''}
        </div>`;

    case 'RichTextBlock':
      return `
        <section style="background: linear-gradient(180deg, #0a0a16 0%, #080810 100%); padding: 80px 48px; font-family: Inter, system-ui, sans-serif; position: relative; overflow: hidden;">
          <div style="max-width: 760px; margin: 0 auto; text-align: ${data.align || 'center'}; position: relative;">
            ${data.label ? `<p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6c63ff; margin-bottom: 16px; margin-top: 0;">${data.label}</p>` : ''}
            ${data.heading ? `<h2 style="font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800; color: #f0f0ff; margin-top: 0; margin-bottom: 32px; letter-spacing: -0.02em; line-height: 1.2;">${data.heading}</h2>` : ''}
            <div style="text-align: left;">${renderMarkdown(data.body) || '<em style="color:#555;font-style:italic">No content yet…</em>'}</div>
          </div>
        </section>`;

    case 'FAQ':
      return `
        <section style="background: linear-gradient(180deg, #080810 0%, #0a0a16 100%); padding: 80px 48px; font-family: Inter, system-ui, sans-serif; position: relative; overflow: hidden;">
          <div style="max-width: 720px; margin: 0 auto; position: relative;">
            ${data.label ? `<p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6c63ff; margin-bottom: 16px; margin-top: 0; text-align: center;">${data.label}</p>` : ''}
            ${data.heading ? `<h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: #f0f0ff; margin-top: 0; margin-bottom: 48px; letter-spacing: -0.02em; line-height: 1.2; text-align: center;">${data.heading}</h2>` : ''}
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${(Array.isArray(data.items) ? data.items : []).map((item, i) => `
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden;">
                  <div style="padding: 20px 24px;">
                    <div style="font-size: 1rem; font-weight: 600; color: #c4c9e0; line-height: 1.4; font-family: Inter, system-ui, sans-serif; margin-bottom: 12px;">${item.question || 'Question'}</div>
                    <p style="color: #8892a4; line-height: 1.75; margin: 0; font-size: 0.95rem; font-family: Inter, system-ui, sans-serif;">${item.answer || 'Answer'}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

    case 'Gallery':
      return `
        <section style="background: linear-gradient(180deg, #0a0a16 0%, #070710 100%); padding: 80px 48px; font-family: Inter, system-ui, sans-serif; position: relative; overflow: hidden;">
          <div style="max-width: 1100px; margin: 0 auto; position: relative;">
            ${data.label ? `<p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6c63ff; margin-bottom: 16px; margin-top: 0; text-align: center;">${data.label}</p>` : ''}
            ${data.heading ? `<h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: #f0f0ff; margin-top: 0; margin-bottom: 48px; letter-spacing: -0.02em; line-height: 1.2; text-align: center;">${data.heading}</h2>` : ''}
            <div style="display: grid; grid-template-columns: repeat(${data.columns || 3}, 1fr); gap: 16px;">
              ${(Array.isArray(data.items) ? data.items : []).map((item, i) => `
                <div style="position: relative; border-radius: 12px; overflow: hidden; background: #111120; border: 1px solid rgba(108,99,255,0.12); aspect-ratio: 3/2;">
                  ${item.url ? `<img src="${item.url}" alt="${item.caption || ''}" style="width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.85;">` : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #333; font-size: 28px;">🖼</div>'}
                  ${(item.tag || item.caption) ? `<div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 14px 12px; background: linear-gradient(transparent, rgba(6,6,15,0.9));">
                    ${item.tag ? `<span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #818cf8; background: rgba(108,99,255,0.2); border: 1px solid rgba(108,99,255,0.3); border-radius: 100px; padding: 2px 7px; margin-bottom: 4px; display: inline-block;">${item.tag}</span>` : ''}
                    ${item.caption ? `<p style="color: #e2e8f0; font-size: 0.85rem; font-weight: 600; margin: 0;">${item.caption}</p>` : ''}
                  </div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

    case 'Text':
      return `
        <section style="background: linear-gradient(180deg, #07070f 0%, #0c0c1a 100%); padding: 80px 48px; font-family: Inter, system-ui, sans-serif; text-align: ${data.align || 'center'}; position: relative; overflow: hidden;">
          <div style="max-width: 700px; margin: 0 auto; position: relative; background: rgba(108,99,255,0.05); border: 1px solid rgba(108,99,255,0.2); border-radius: 20px; padding: 56px 48px; box-shadow: 0 0 60px rgba(108,99,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05);">
            ${data.label ? `<p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6c63ff; margin-bottom: 16px; margin-top: 0;">${data.label}</p>` : ''}
            ${data.heading ? (data.headingGradient ? `<h2 style="font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; margin-top: 0; margin-bottom: ${data.body ? '20px' : '32px'}; letter-spacing: -0.02em; line-height: 1.15; background: linear-gradient(135deg, #818cf8, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${data.heading}</h2>` : `<h2 style="font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #f0f0ff; margin-top: 0; margin-bottom: ${data.body ? '20px' : '32px'}; letter-spacing: -0.02em; line-height: 1.15;">${data.heading}</h2>`) : ''}
            ${data.body ? `<p style="color: #8892a4; font-size: 1.05rem; line-height: 1.75; margin: 0 auto 36px; max-width: 520px;">${data.body}</p>` : ''}
            ${data.ctaText ? `<a href="${data.ctaHref || '#'}" style="display: inline-block; background: linear-gradient(135deg, #6c63ff, #a855f7); color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 0 28px rgba(108,99,255,0.35), 0 4px 12px rgba(0,0,0,0.3);">${data.ctaText}</a>` : ''}
          </div>
        </section>`;

    default:
      return `<div style="padding:20px;color:#888">Component "${componentName}" not supported yet</div>`;
  }
}

// Generate a full HTML page
function generateHTML(page, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #06060f;
      color: #e2e8f0;
      font-family: Inter, system-ui, sans-serif;
      line-height: 1.6;
    }
    a { color: #818cf8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    img { max-width: 100%; height: auto; }
    pre { overflow-x: auto; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
}

async function exportPages() {
  console.log('🚀 Exporting pages to static HTML...\n');

  // Check if API is running
  try {
    await fetch(`${API}/pages`);
  } catch {
    console.error('❌ Could not reach API at', API);
    console.error('   Make sure the backend is running: cd cms && ./start.sh\n');
    process.exit(1);
  }

  // Fetch all pages
  console.log('📡 Fetching pages from API...');
  const pages = await fetch(`${API}/pages`).then(r => r.json()).catch(e => { console.error(e); return []; });

  if (pages.length === 0) {
    console.error('❌ No pages found!');
    process.exit(1);
  }

  console.log(`✓ Found ${pages.length} page(s)\n`);

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Export each page
  for (const page of pages) {
    const rows = normalizeRows(page.blocks);

    // Render all rows
    const rowHTML = rows.map(row => {
      const cols = row.columns.map((col, i) => {
        const html = renderComponentHTML(col.componentName, col.data);
        return `<div style="flex: ${col.width}; min-width: 0; overflow: hidden;">${html}</div>`;
      }).join('');
      return `<div style="display: flex; width: 100%;">${cols}</div>`;
    }).join('');

    const content = rowHTML || '<div style="padding: 80px 48px; text-align: center; color: #666;">This page is empty</div>';
    const html = generateHTML(page, content);

    // Save file
    const filename = page.slug.replace(/\//g, '/').replace(/^\//, '') || 'index';
    const filePath = path.join(OUTPUT_DIR, `${filename}.html`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, html);

    console.log(`✓ ${page.slug || '/'} → ${filePath}`);
  }

  // Generate index
  const indexHTML = generateHTML(
    { name: 'Pages', slug: '/' },
    `
    <section style="padding: 80px 48px; max-width: 1000px; margin: 0 auto;">
      <h1 style="font-size: 2.8rem; font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #818cf8, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Your Pages</h1>
      <p style="color: #8892a4; font-size: 1.1rem; margin-bottom: 48px;">Deployed with 💜 using our CMS</p>
      <div style="display: grid; gap: 20px;">
        ${pages.map(p => `
          <a href="${(p.slug || '/').replace(/^\//, '') || 'index'}.html" style="display: block; padding: 24px; background: linear-gradient(145deg, #0e0e1c, #141428); border: 1px solid rgba(108,99,255,0.15); border-radius: 12px; transition: all 0.2s;">
            <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 6px;">${p.name}</div>
            <div style="color: #8892a4; font-family: monospace; font-size: 0.9rem;">${p.slug || '/'}</div>
          </a>
        `).join('')}
      </div>
    </section>
    `
  );
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHTML);
  console.log(`✓ / → ${path.join(OUTPUT_DIR, 'index.html')}\n`);

  console.log('✨ Done! Export ready at:', OUTPUT_DIR);
  console.log('📤 Push to GitHub Pages:\n   git add dist/\n   git commit -m "Export static pages"\n   git push origin gh-pages');
}

exportPages().catch(e => {
  console.error('❌ Export failed:', e.message);
  process.exit(1);
});
