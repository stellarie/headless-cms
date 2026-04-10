import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import PreviewPanel from '../components/preview/PreviewPanel';
import {
  getComponent, getEntries, createEntry, updateEntry, deleteEntry, executeOnRequest
} from '../services/api';

const DEFAULT_DATA = '{\n  \n}';

export default function ContentPage() {
  const { id } = useParams();
  const [component, setComponent] = useState(null);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Entry form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_DATA);
  const [formStatus, setFormStatus] = useState('DRAFT');
  const [saving, setSaving] = useState(false);

  // ON_REQUEST executor
  const [execContext, setExecContext] = useState('{\n  \n}');
  const [execResult, setExecResult] = useState(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => { loadAll(); }, [id]);

  async function loadAll() {
    try {
      const [comp, ents] = await Promise.all([getComponent(id), getEntries(id)]);
      setComponent(comp);
      setEntries(ents);
    } catch (e) {
      setError(e.message);
    }
  }

  function openNew() {
    setEditingId(null);
    setFormData(DEFAULT_DATA);
    setFormStatus('DRAFT');
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function openEdit(entry) {
    setEditingId(entry.id);
    setFormData(JSON.stringify(entry.data, null, 2));
    setFormStatus(entry.status);
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      JSON.parse(formData);
      const payload = { data: formData, status: formStatus };
      if (editingId) {
        await updateEntry(id, editingId, payload);
      } else {
        await createEntry(id, payload);
      }
      setSuccess('Saved!');
      setShowForm(false);
      loadAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entryId) {
    if (!confirm('Delete this entry?')) return;
    try {
      await deleteEntry(id, entryId);
      loadAll();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleExecute() {
    setExecuting(true);
    setExecResult(null);
    try {
      const ctx = JSON.parse(execContext);
      const result = await executeOnRequest(id, ctx);
      setExecResult(result);
    } catch (e) {
      setExecResult({ error: e.message });
    } finally {
      setExecuting(false);
    }
  }

  const hasOnRequest = component?.hooks?.ON_REQUEST;

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/" className="back-link">← Back</Link>
          <h2 style={{ marginTop: 6 }}>{component?.name || 'Content'}</h2>
          {component?.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{component.description}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/components/${id}/edit`} className="btn btn-secondary">Edit Component</Link>
          <button className="btn btn-primary" onClick={openNew}>+ New Entry</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div style={{ display: 'flex', height: '640px', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          {/* Left — Editor */}
          <div style={{ width: '50%', flexShrink: 0, background: 'var(--surface)', padding: 20, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>{editingId ? 'Edit Entry' : 'New Entry'}</h3>
              <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>

            {component?.schema && (
              <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--text-muted)', padding: '10px 12px', borderRadius: 6, fontSize: 12 }}>
                <strong>Schema:</strong>{' '}
                <code style={{ fontFamily: 'var(--mono)' }}>{component.schema}</code>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Data (JSON)</label>
              <div className="editor-section">
                <Editor
                  height="300px"
                  language="json"
                  theme="vs-dark"
                  value={formData}
                  onChange={val => setFormData(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    padding: { top: 12 },
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <select value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>

          {/* Right — Live Preview */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <PreviewPanel componentName={component?.name} dataJson={formData} />
          </div>
        </div>
      )}

      {entries.length === 0 && !showForm ? (
        <div className="empty-state">
          <h3>No entries yet</h3>
          <p>Create your first content entry for this component.</p>
          <button className="btn btn-primary" onClick={openNew}>+ New Entry</button>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: hasOnRequest ? 24 : 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data Preview</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                      {e.id.split('-')[0]}…
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {JSON.stringify(e.data)}
                    </td>
                    <td>
                      <span className={`status-badge status-${e.status}`}>{e.status}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => openEdit(e)}>Edit</button>
                        <button className="btn btn-danger" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => handleDelete(e.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasOnRequest && (
        <div className="execute-panel">
          <h3>Execute ON_REQUEST Hook</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            Send a custom request to this component's ON_REQUEST Groovy script.
          </p>
          <div className="form-group">
            <label>Context (JSON)</label>
            <div className="editor-section">
              <Editor
                height="120px"
                language="json"
                theme="vs-dark"
                value={execContext}
                onChange={val => setExecContext(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  padding: { top: 8 },
                }}
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleExecute} disabled={executing}>
            {executing ? 'Running...' : '▶ Run Script'}
          </button>
          {execResult && (
            <div className="result-box">{JSON.stringify(execResult, null, 2)}</div>
          )}
        </div>
      )}
    </div>
  );
}
