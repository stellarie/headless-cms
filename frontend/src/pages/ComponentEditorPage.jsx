import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getComponent, createComponent, updateComponent } from '../services/api';
import COMPONENTS from '../registry';
import PreviewPanel from '../components/preview/PreviewPanel';

const HOOKS = ['BEFORE_SAVE', 'AFTER_SAVE', 'BEFORE_FETCH', 'AFTER_FETCH', 'ON_REQUEST'];

const HOOK_DESCRIPTIONS = {
  BEFORE_SAVE: 'Runs before a content entry is saved. Set result.data to transform the data.',
  AFTER_SAVE: 'Runs after a content entry is saved. Use for side effects (notifications, indexing).',
  BEFORE_FETCH: 'Runs before content is fetched. Can be used for access control.',
  AFTER_FETCH: 'Runs after content is fetched. Set result.data to transform the returned data.',
  ON_REQUEST: 'Handles custom POST /api/components/{id}/execute requests. Full control via context.',
};

const HOOK_PLACEHOLDERS = {
  BEFORE_SAVE: `def title = context.data?.title
if (!title || title.trim().isEmpty()) {
    result.error = "Title is required"
    return
}
context.data.title = title.trim()
result.data = context.data`,
  AFTER_SAVE: `log.info("Content saved for component: {}", context.componentName)`,
  BEFORE_FETCH: `// result.error = "Access denied" to block the fetch`,
  AFTER_FETCH: `def data = context.data
data.excerpt = data.body?.take(150) + "..."
result.data = data`,
  ON_REQUEST: `def name = context.name ?: "World"
result.message = "Hello, \${name}!"
result.timestamp = new Date().toString()`,
};

const RENDERER_PLACEHOLDER = `// This JSX renders your component's live preview.
// You have access to: data (the content entry), React, useState, useEffect, useRef
// Export a default function component.

export default function MyRenderer({ data }) {
  const s = data.styles || {};
  return (
    <div style={{
      background: s.backgroundColor || '#ffffff',
      color: s.textColor || '#1a1a2e',
      padding: '32px',
      borderRadius: '12px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <h2>{data.title || 'Untitled'}</h2>
      <p>{data.body || 'No content yet.'}</p>
    </div>
  );
}`;

const TABS = ['Info', 'Hooks', 'Renderer'];

export default function ComponentEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState('Info');
  const [form, setForm] = useState({ name: '', description: '', schema: '' });
  const [hooks, setHooks] = useState({});
  const [activeHook, setActiveHook] = useState(HOOKS[0]);
  const [rendererSource, setRendererSource] = useState('');
  const [previewData, setPreviewData] = useState('{\n  \n}');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getComponent(id).then(c => {
        setForm({ name: c.name, description: c.description || '', schema: c.schema || '' });
        setHooks(c.hooks || {});
        setRendererSource(c.rendererSource || '');
        // Pre-fill preview with defaultData from registry if available
        const reg = COMPONENTS[c.name];
        if (reg?.defaultData) setPreviewData(JSON.stringify(reg.defaultData, null, 2));
      }).catch(e => setError(e.message));
    }
  }, [id]);

  // When name changes, try to pre-fill defaultData from registry
  useEffect(() => {
    const reg = COMPONENTS[form.name];
    if (reg?.defaultData) setPreviewData(JSON.stringify(reg.defaultData, null, 2));
  }, [form.name]);

  function toggleHook(hook) {
    setHooks(prev => {
      const next = { ...prev };
      if (next[hook] !== undefined) delete next[hook];
      else next[hook] = HOOK_PLACEHOLDERS[hook];
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = { ...form, hooks, rendererSource: rendererSource || null };
      if (isEdit) {
        await updateComponent(id, payload);
      } else {
        await createComponent(payload);
      }
      setSuccess('Saved successfully!');
      setTimeout(() => navigate('/'), 800);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/" className="back-link">← Back</Link>
          <h2 style={{ marginTop: 6 }}>{isEdit ? 'Edit Component' : 'New Component'}</h2>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Component'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="tabs" style={{ marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Info Tab ── */}
      {activeTab === 'Info' && (
        <div className="two-col">
          <div>
            <div className="form-group">
              <label>Component Name</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. BlogPost, Product, FAQ"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="What is this component for?"
                rows={3}
              />
            </div>
          </div>
          <div>
            <div className="form-group">
              <label>Schema (JSON)</label>
              <textarea
                value={form.schema}
                onChange={e => setForm(p => ({ ...p, schema: e.target.value }))}
                placeholder={'{\n  "title": "string",\n  "body": "text"\n}'}
                rows={7}
                style={{ fontFamily: 'var(--mono)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Hooks Tab ── */}
      {activeTab === 'Hooks' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {HOOKS.map(h => (
              <button
                key={h}
                className={`btn ${hooks[h] !== undefined ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 12 }}
                onClick={() => toggleHook(h)}
              >
                {hooks[h] !== undefined ? '✓ ' : '+ '}{h}
              </button>
            ))}
          </div>

          {Object.keys(hooks).length > 0 ? (
            <div className="editor-section">
              <div className="tabs">
                {Object.keys(hooks).map(h => (
                  <button key={h} className={`tab ${activeHook === h ? 'active' : ''}`} onClick={() => setActiveHook(h)}>
                    {h}
                  </button>
                ))}
              </div>
              {hooks[activeHook] !== undefined && (
                <>
                  <div className="editor-header">
                    <span>{activeHook}</span>
                    <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{HOOK_DESCRIPTIONS[activeHook]}</span>
                  </div>
                  <Editor
                    height="320px"
                    language="groovy"
                    theme="vs-dark"
                    value={hooks[activeHook]}
                    onChange={val => setHooks(p => ({ ...p, [activeHook]: val || '' }))}
                    options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, automaticLayout: true, fontFamily: 'JetBrains Mono, Fira Code, monospace', padding: { top: 12 } }}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="alert" style={{ background: 'rgba(108,99,255,0.08)', borderColor: 'rgba(108,99,255,0.2)', color: 'var(--text-muted)' }}>
              Toggle hooks above to add Groovy business logic to this component.
            </div>
          )}
        </div>
      )}

      {/* ── Renderer Tab ── */}
      {activeTab === 'Renderer' && (
        <div style={{ display: 'flex', height: '580px', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {/* Left — JSX editor */}
          <div style={{ width: '50%', flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
            <div className="editor-header">
              <span>Renderer JSX</span>
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--warning)' }}>
                overrides the codebase renderer when set
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={rendererSource || RENDERER_PLACEHOLDER}
                onChange={val => setRendererSource(val || '')}
                options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, automaticLayout: true, fontFamily: 'JetBrains Mono, Fira Code, monospace', padding: { top: 12 } }}
              />
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                Preview Data (JSON)
              </label>
              <textarea
                value={previewData}
                onChange={e => setPreviewData(e.target.value)}
                rows={3}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 8px', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12, resize: 'none', outline: 'none' }}
              />
            </div>
          </div>

          {/* Right — live preview */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <PreviewPanel
              componentName={form.name}
              dataJson={previewData}
              rendererSource={rendererSource}
            />
          </div>
        </div>
      )}
    </div>
  );
}
