import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function useScrollableBody() {
  useEffect(() => {
    const body = document.body;
    const root = document.getElementById('root');
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevRootHeight = root?.style.height ?? '';

    body.style.overflow = 'auto';
    body.style.height = 'auto';
    if (root) root.style.height = 'auto';

    return () => {
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      if (root) root.style.height = prevRootHeight;
    };
  }, []);
}
import { v4 as uuidv4 } from 'uuid';
import COMPONENTS from '../registry';
import { getPage } from '../services/api';

function normalizeRows(blocksJson) {
  try {
    const parsed = JSON.parse(blocksJson || '[]');
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    if (!parsed[0].columns) {
      return parsed.map(block => ({
        id: block.id || uuidv4(),
        columns: [{ id: uuidv4(), componentName: block.componentName, data: block.data || '{}', width: 100 }],
      }));
    }
    return parsed;
  } catch { return []; }
}

export default function PagePreviewPage() {
  useScrollableBody();
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id === 'draft') {
      try {
        const draft = JSON.parse(sessionStorage.getItem('cms_preview_draft') || 'null');
        if (!draft) { setError('No draft found. Open Preview from the page builder.'); return; }
        setPage({ name: draft.name, slug: draft.slug });
        setRows(draft.rows || []);
      } catch (e) {
        setError('Failed to load draft.');
      }
      return;
    }
    getPage(id)
      .then(p => { setPage(p); setRows(normalizeRows(p.blocks)); })
      .catch(e => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p style={{ fontSize: 48, margin: 0 }}>:(</p>
          <p style={{ marginTop: 12 }}>{error}</p>
          <Link to="/pages" style={{ color: '#6366f1', fontSize: 14 }}>← Back to Pages</Link>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#aaa', fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Thin preview banner — doesn't affect page layout */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: 'rgba(15,15,25,0.85)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 16px', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <span style={{ background: '#6366f1', color: '#fff', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Preview
        </span>
        <span style={{ color: 'rgba(255,255,255,0.7)', flex: 1 }}>{page.name}</span>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{page.slug}</span>
        {id !== 'draft' ? (
          <Link
            to={`/pages/${id}/edit`}
            style={{ color: '#a5b4fc', textDecoration: 'none', marginLeft: 8, padding: '3px 10px', border: '1px solid rgba(165,180,252,0.3)', borderRadius: 4 }}
          >
            ← Edit
          </Link>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8, fontSize: 11, fontStyle: 'italic' }}>draft — not saved yet</span>
        )}
      </div>

      {/* Page content — offset by banner height */}
      <div style={{ paddingTop: 33 }}>
        {rows.map(row => (
          <div key={row.id} style={{ display: 'flex', width: '100%' }}>
            {row.columns.map(col => {
              const registered = COMPONENTS[col.componentName];
              const Renderer = registered?.Renderer;
              let data = {};
              try { data = JSON.parse(col.data || '{}'); } catch {}

              return (
                <div key={col.id} style={{ flex: col.width, minWidth: 0, overflow: 'hidden' }}>
                  {Renderer
                    ? <Renderer data={data} />
                    : (
                      <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif', color: '#888', fontSize: 13, background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                        <em>{col.componentName} — no renderer</em>
                      </div>
                    )
                  }
                </div>
              );
            })}
          </div>
        ))}

        {rows.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 33px)', fontFamily: 'Inter, system-ui, sans-serif', color: '#bbb', fontSize: 14 }}>
            This page has no content yet.
          </div>
        )}
      </div>
    </div>
  );
}
