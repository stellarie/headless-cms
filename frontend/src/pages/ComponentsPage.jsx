import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComponents, getDeletedComponents, deleteComponent, restoreComponent } from '../services/api';

export default function ComponentsPage() {
  const [components, setComponents] = useState([]);
  const [deletedComponents, setDeletedComponents] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setComponents(await getComponents());
      setDeletedComponents(await getDeletedComponents());
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id, name) {
    try {
      await deleteComponent(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRestore(id, name) {
    try {
      await restoreComponent(id);
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

      {deletedComponents.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {showDeleted && (
            <div className="component-grid">
              {deletedComponents.map(c => (
                <div key={c.id} className="component-card" style={{ opacity: 0.7 }}>
                  <h3>{c.name}</h3>
                  <p>{c.description || 'No description'}</p>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 12 }}>
                    Deleted: {new Date(c.deletedAt).toLocaleDateString()}
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => handleRestore(c.id, c.name)}>
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                  Exports
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
