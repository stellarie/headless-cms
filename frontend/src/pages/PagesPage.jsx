import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPages, deletePage } from '../services/api';

export default function PagesPage() {
  const [pages, setPages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  async function load() {
    try { setPages(await getPages()); }
    catch (e) { setError(e.message); }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete page "${name}"?`)) return;
    try { await deletePage(id); load(); }
    catch (e) { setError(e.message); }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Pages</h2>
        <button className="btn btn-primary" onClick={() => navigate('/pages/new')}>+ New Page</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {pages.length === 0 ? (
        <div className="empty-state">
          <h3>No pages yet</h3>
          <p>Build your first page by combining components.</p>
          <button className="btn btn-primary" onClick={() => navigate('/pages/new')}>+ New Page</button>
        </div>
      ) : (
        <div className="component-grid">
          {pages.map(p => (
            <div key={p.id} className="component-card">
              <h3>{p.name}</h3>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)' }}>{p.slug}</p>
              <div className="card-actions">
                <button className="btn btn-primary" onClick={() => navigate(`/pages/${p.id}/edit`)}>
                  Edit Page
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(p.id, p.name)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
