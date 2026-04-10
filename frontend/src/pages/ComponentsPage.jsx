import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComponents, deleteComponent } from '../services/api';

export default function ComponentsPage() {
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setComponents(await getComponents());
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete component "${name}"? All its content entries will be lost.`)) return;
    try {
      await deleteComponent(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Components</h2>
        <button className="btn btn-primary" onClick={() => navigate('/components/new')}>
          + New Component
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {components.length === 0 ? (
        <div className="empty-state">
          <h3>No components yet</h3>
          <p>Create your first component to start managing content.</p>
          <button className="btn btn-primary" onClick={() => navigate('/components/new')}>
            + New Component
          </button>
        </div>
      ) : (
        <div className="component-grid">
          {components.map(c => (
            <div key={c.id} className="component-card">
              <h3>{c.name}</h3>
              <p>{c.description || 'No description'}</p>
              {c.hooks && Object.keys(c.hooks).length > 0 && (
                <div className="hook-badges">
                  {Object.keys(c.hooks).map(h => (
                    <span key={h} className="badge">{h}</span>
                  ))}
                </div>
              )}
              <div className="card-actions">
                <button className="btn btn-secondary" onClick={() => navigate(`/components/${c.id}/content`)}>
                  Content
                </button>
                <button className="btn btn-secondary" onClick={() => navigate(`/components/${c.id}/edit`)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(c.id, c.name)}>
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
