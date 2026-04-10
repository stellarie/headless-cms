#!/usr/bin/env node
// @ts-check
/**
 * Interactive HTML exporter for GitHub Pages
 * Bundles React + components + CSS inline into each page
 * Run: npm run export
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformSync } from '@babel/core';
import babelPresetReact from '@babel/preset-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, '../../packages/components/src');
const OUTPUT_DIR = path.resolve(__dirname, '../dist/pages');
const API = 'http://localhost:8080/api';

// Load components by reading their source, transpiling JSX, and collecting CSS
function loadComponents() {
  const components = {};
  const allCSS = [];

  try {
    const dirs = fs.readdirSync(COMPONENTS_DIR);

    for (const dir of dirs) {
      const jsxPath = path.join(COMPONENTS_DIR, dir, 'index.jsx');
      const cssPath = path.join(COMPONENTS_DIR, dir, 'styles.css');

      if (!fs.existsSync(jsxPath)) continue;

      try {
        // Read and transpile JSX
        let jsxSource = fs.readFileSync(jsxPath, 'utf-8');

        // Remove imports (they'll be available globally: React, useState, etc.)
        // Matches: import ... from '...'; or import './file.css';
        jsxSource = jsxSource.replace(/^import\s+.*?from\s+['"][^'"]*['"];?\s*$/gm, '');
        jsxSource = jsxSource.replace(/^import\s+['"][^'"]*['"];?\s*$/gm, '');

        // Transpile JSX to React.createElement
        const transpiled = transformSync(jsxSource, {
          presets: [babelPresetReact],
          filename: `${dir}/index.jsx`,
        });

        let transpiledCode = transpiled.code;

        // Extract ALL const declarations (except exported ones like schema, defaultData, description)
        // These are module-level helpers like statusConfig
        const constDeclarations = [];
        const lines = transpiledCode.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // Match const declarations that aren't exports
          if (line.match(/^const\s+\w+\s*=/) && !line.includes('export')) {
            // Collect this const and any following lines until the closing brace/semicolon
            let constBlock = line;
            let braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;

            // Keep adding lines until we close all braces
            let j = i + 1;
            while (j < lines.length && (braceCount > 0 || !constBlock.trim().endsWith(';'))) {
              constBlock += '\n' + lines[j];
              braceCount += (lines[j].match(/\{/g) || []).length - (lines[j].match(/\}/g) || []).length;
              j++;
            }

            constDeclarations.push(constBlock);
            i = j - 1; // Skip ahead
          }
        }

        // Find the default export function
        const defaultExportMatch = transpiledCode.match(/export\s+default\s+function\s+(\w+)[^{]*\{[\s\S]*\}\s*$/);
        if (!defaultExportMatch) {
          console.warn(`⚠ Could not find default export in ${dir}`);
          continue;
        }

        const componentName = defaultExportMatch[1];
        const lastFunctionIndex = transpiledCode.lastIndexOf(`function ${componentName}`);
        if (lastFunctionIndex === -1) {
          console.warn(`⚠ Could not find function ${componentName} in ${dir}`);
          continue;
        }

        const functionCode = transpiledCode.substring(lastFunctionIndex);

        // Combine constants + function, remove export keywords
        let finalCode = '';
        if (constDeclarations.length > 0) {
          finalCode = constDeclarations.join('\n') + '\n';
        }
        finalCode += functionCode.replace(/^export\s+(default\s+)?/gm, '');

        components[dir] = finalCode;

        // Load CSS if it exists
        if (fs.existsSync(cssPath)) {
          const css = fs.readFileSync(cssPath, 'utf-8');
          allCSS.push(css);
        }
      } catch (err) {
        console.warn(`⚠ Could not load component ${dir}:`, err.message);
      }
    }

    console.log(`✓ Loaded ${Object.keys(components).length} component(s)`);
    return { components, allCSS: allCSS.join('\n') };
  } catch (err) {
    console.error('❌ Failed to load components:', err);
    process.exit(1);
  }
}

// Normalize rows structure
function normalizeRows(blocksJson) {
  try {
    const parsed = JSON.parse(blocksJson || '[]');
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    if (!parsed[0].columns) {
      return parsed.map(block => ({
        id: block.id || Math.random().toString(36).slice(2),
        columns: [{
          id: Math.random().toString(36).slice(2),
          componentName: block.componentName,
          data: block.data || '{}',
          width: 100
        }],
      }));
    }
    return parsed;
  } catch {
    return [];
  }
}

// Generate the React app bundle code
function generateBundleCode(components) {
  const componentCode = Object.entries(components)
    .map(([name, sourceCode]) => {
      // Extract function name from the code
      const funcNameMatch = sourceCode.match(/function\s+(\w+)\s*\(/);
      const funcName = funcNameMatch?.[1] || name;

      // Always wrap in IIFE to provide proper scope for constants
      return `  '${name}': (() => { ${sourceCode} return ${funcName}; })()`;
    })
    .join(',\n');

  return `(function() {
  // Make React available globally for transpiled components
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const { useState, useEffect, useContext, useReducer, useCallback, useMemo } = React;

  window.__CMS_COMPONENTS__ = {
${componentCode}
  };

  window.__CMS_RENDER__ = (containerId, pageData) => {
    function PageRenderer() {
      const [state, setState] = React.useState({ rows: pageData.rows || [] });

      return React.createElement('div', { style: { width: '100%' } },
        state.rows.map((row, i) =>
          React.createElement('div', {
            key: i,
            style: { display: 'flex', width: '100%', margin: '0' }
          },
            row.columns.map((col, j) => {
              const Component = window.__CMS_COMPONENTS__[col.componentName];
              if (!Component) {
                return React.createElement('div', {
                  key: j,
                  style: { flex: \`\${col.width}%\`, minWidth: 0, overflow: 'hidden', padding: '20px', color: '#c00' }
                }, \`Component "\${col.componentName}" not found\`);
              }

              let data = {};
              try { data = typeof col.data === 'string' ? JSON.parse(col.data) : col.data; } catch {}

              return React.createElement('div', {
                key: j,
                style: { flex: \`\${col.width}%\`, minWidth: 0, overflow: 'hidden' }
              }, React.createElement(Component, { data }));
            })
          )
        )
      );
    }

    const root = ReactDOM.createRoot(document.getElementById(containerId));
    root.render(React.createElement(PageRenderer));
  };
})();`;
}

// Fetch and cache React libraries
let reactLib = null;
let reactDomLib = null;

async function loadReactLibraries() {
  if (reactLib && reactDomLib) return;

  console.log('📥 Downloading React libraries...');
  try {
    const reactRes = await fetch('https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js');
    if (!reactRes.ok) throw new Error(`React fetch failed: ${reactRes.status}`);
    reactLib = await reactRes.text();

    const reactDomRes = await fetch('https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js');
    if (!reactDomRes.ok) throw new Error(`ReactDOM fetch failed: ${reactDomRes.status}`);
    reactDomLib = await reactDomRes.text();

    console.log('✓ React libraries cached');
  } catch (err) {
    console.error('❌ Failed to download React libraries:', err.message);
    process.exit(1);
  }
}

// Generate full HTML page
function generateHTML(page, pageData, bundleCode, allCSS) {
  const serializedData = JSON.stringify(pageData);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name || 'Page'}</title>
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
    ${allCSS}
  </style>
  <script>
    ${reactLib}
  </script>
  <script>
    ${reactDomLib}
  </script>
  <script>
    window.__PAGE_DATA__ = ${serializedData};
  </script>
  <script>
${bundleCode}
  </script>
</head>
<body>
  <div id="cms-root"></div>
  <script>
    if (typeof window.__CMS_RENDER__ === 'function') {
      window.__CMS_RENDER__('cms-root', window.__PAGE_DATA__);
    } else {
      document.getElementById('cms-root').innerHTML = '<div style="padding:20px;color:#c00">Error: CMS renderer failed to load</div>';
      console.error('CMS renderer not available');
    }
  </script>
</body>
</html>`;
}

async function exportPages() {
  console.log('🚀 Exporting interactive pages to GitHub Pages...\n');

  // Load React libraries
  await loadReactLibraries();
  console.log('');

  // Load components
  const { components, allCSS } = loadComponents();
  console.log('');

  // Check API
  try {
    await fetch(`${API}/pages`);
  } catch {
    console.error('❌ Could not reach API at', API);
    console.error('   Make sure the backend is running: cd cms && ./start.sh\n');
    process.exit(1);
  }

  // Fetch pages
  console.log('📡 Fetching pages from API...');
  const pages = await fetch(`${API}/pages`).then(r => r.json()).catch(e => { console.error(e); return []; });

  if (pages.length === 0) {
    console.error('❌ No pages found!');
    process.exit(1);
  }

  console.log(`✓ Found ${pages.length} page(s)\n`);

  // Generate bundle
  console.log('📦 Generating React bundle...');
  const bundleCode = generateBundleCode(components);
  console.log('✓ Bundle ready\n');

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Export each page
  console.log('📝 Exporting pages...');
  for (const page of pages) {
    const rows = normalizeRows(page.blocks);

    const pageData = {
      id: page.id,
      name: page.name,
      slug: page.slug,
      rows: rows,
    };

    const html = generateHTML(page, pageData, bundleCode, allCSS);

    // Save file
    const filename = (page.slug || '/').replace(/\//g, '/').replace(/^\//, '') || 'index';
    const filePath = path.join(OUTPUT_DIR, `${filename}.html`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, html);

    console.log(`  ✓ ${page.slug || '/'} → ${filename}.html`);
  }

  // Generate index.html with page links
  const indexHTML = generateHTML(
    { name: 'Pages' },
    {
      id: 'index',
      name: 'Pages',
      slug: '/',
      rows: [],
    },
    bundleCode,
    allCSS
  ).replace(
    '<div id="cms-root"></div>',
    `<div id="cms-root">
    <section style="padding: 80px 48px; max-width: 1000px; margin: 0 auto;">
      <h1 style="font-size: 2.8rem; font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #818cf8, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Your Pages</h1>
      <p style="color: #8892a4; font-size: 1.1rem; margin-bottom: 48px;">Deployed with 💜</p>
      <div style="display: grid; gap: 20px;">
        ${pages.map(p => {
          const href = (p.slug || '/') === '/' ? 'index.html' : `${(p.slug || '/').replace(/^\//, '')}.html`;
          return `<a href="${href}" style="display: block; padding: 24px; background: linear-gradient(145deg, #0e0e1c, #141428); border: 1px solid rgba(108,99,255,0.15); border-radius: 12px; transition: all 0.2s; color: inherit; text-decoration: none;">
            <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 6px;">${p.name}</div>
            <div style="color: #8892a4; font-family: monospace; font-size: 0.9rem;">${p.slug || '/'}</div>
          </a>`;
        }).join('')}
      </div>
    </section>
  </div>`
  );
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHTML);
  console.log(`  ✓ / → index.html\n`);

  console.log('✨ Done! All pages exported to:', OUTPUT_DIR);
  console.log('📤 Ready for GitHub Pages:\n   git add dist/\n   git commit -m "Export interactive pages"\n   git push origin gh-pages');
}

exportPages().catch(e => {
  console.error('❌ Export failed:', e.message);
  console.error(e.stack);
  process.exit(1);
});
