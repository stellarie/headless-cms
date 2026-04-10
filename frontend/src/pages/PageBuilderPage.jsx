import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import COMPONENTS from '../registry';
import SortableRow from '../components/builder/SortableRow';
import EditModal from '../components/builder/EditModal';
import { getPage, createPage, updatePage } from '../services/api';
import './PageBuilderPage.css';

// Backward-compat: convert old flat-block format to rows
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

function newRow(componentName) {
  const reg = COMPONENTS[componentName];
  return {
    id: uuidv4(),
    columns: [{
      id: uuidv4(),
      componentName,
      data: JSON.stringify(reg?.defaultData || {}, null, 2),
      width: 100,
    }],
  };
}

export default function PageBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // { rowId, colId } when a column is being edited in the modal
  const [editing, setEditing] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (isEdit) {
      getPage(id).then(p => {
        setName(p.name);
        setSlug(p.slug);
        setRows(normalizeRows(p.blocks));
      }).catch(e => setError(e.message));
    }
  }, [id]);

  // Auto-dismiss success message after 2.5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // ── Row mutations ──
  function addRow(componentName) {
    setRows(prev => [...prev, newRow(componentName)]);
  }

  function removeRow(rowId) {
    setRows(prev => prev.filter(r => r.id !== rowId));
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRows(prev => {
        const oldIndex = prev.findIndex(r => r.id === active.id);
        const newIndex = prev.findIndex(r => r.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  // ── Column mutations ──
  function addColumn(rowId, componentName) {
    const reg = COMPONENTS[componentName];
    const newCol = {
      id: uuidv4(),
      componentName,
      data: JSON.stringify(reg?.defaultData || {}, null, 2),
      width: 0,
    };
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const cols = [...r.columns, newCol];
      const equalWidth = 100 / cols.length;
      return { ...r, columns: cols.map(c => ({ ...c, width: equalWidth })) };
    }));
  }

  function removeColumn(rowId, colId) {
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const cols = r.columns.filter(c => c.id !== colId);
      if (cols.length === 0) return null;
      const equalWidth = 100 / cols.length;
      return { ...r, columns: cols.map(c => ({ ...c, width: equalWidth })) };
    }).filter(Boolean));
  }

  function updateColumnData(rowId, colId, data) {
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      return { ...r, columns: r.columns.map(c => c.id === colId ? { ...c, data } : c) };
    }));
  }

  function resizeColumns(rowId, newWidths) {
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      return { ...r, columns: r.columns.map((c, i) => ({ ...c, width: newWidths[i] })) };
    }));
  }

  // ── Derive the column being edited ──
  const editingCol = editing
    ? rows.find(r => r.id === editing.rowId)?.columns.find(c => c.id === editing.colId)
    : null;

  // ── Save ──
  function autoSlug(n) {
    return '/' + n.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = { name, slug, blocks: JSON.stringify(rows) };
      if (isEdit) await updatePage(id, payload);
      else await createPage(payload);
      setSuccess('Page saved! ✨');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const componentNames = Object.keys(COMPONENTS);

  return (
    <div className="component_page_builder_root">
      {/* Top bar */}
      <div className="page-header">
        <div>
          <Link to="/pages" className="back-link">← Pages</Link>
          <h2 style={{ marginTop: 6 }}>{isEdit ? 'Edit Page' : 'New Page'}</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={name}
            onChange={e => { setName(e.target.value); if (!isEdit) setSlug(autoSlug(e.target.value)); }}
            placeholder="Page name"
            className="component_page_builder_input name"
          />
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="/slug"
            className="component_page_builder_input slug"
          />
          <button
            className="btn"
            onClick={() => {
              sessionStorage.setItem('cms_preview_draft', JSON.stringify({ name, slug, rows }));
              window.open(isEdit ? `/pages/${id}/preview` : '/pages/draft/preview', '_blank');
            }}
          >
            Preview ↗
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !name || !slug}>
            {saving ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ flexShrink: 0 }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ flexShrink: 0 }}>{success}</div>}

      {/* Two-panel builder */}
      <div className="component_page_builder_layout">

        {/* Left — Component Palette */}
        <div className="component_page_builder_palette">
          <p className="component_page_builder_palette_title">
            Add Row
          </p>
          {componentNames.map(n => (
            <button
              key={n}
              onClick={() => addRow(n)}
              className="component_page_builder_palette_button"
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              + {n}
            </button>
          ))}
        </div>

        {/* Center — Page canvas */}
        <div className="component_page_builder_canvas">

          {/* Fake browser chrome */}
          <div className="component_page_builder_browser_chrome">
            {/* Traffic lights */}
            <div className="component_page_builder_traffic_lights">
              <div className="component_page_builder_traffic_light red" />
              <div className="component_page_builder_traffic_light yellow" />
              <div className="component_page_builder_traffic_light green" />
            </div>
            {/* URL bar */}
            <div className="component_page_builder_url_bar">
              {slug || '/'}
            </div>
            <span className="component_page_builder_chrome_hint">
              hover to edit · drag ⠿ to reorder
            </span>
          </div>

          {/* White page body */}
          <div className="component_page_builder_page_body">
            {rows.length === 0 && (
              <div className="component_page_builder_empty_state">
                ← Click a component to add it to your page
              </div>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
              <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
                {rows.map(row => (
                  <SortableRow
                    key={row.id}
                    row={row}
                    onRemoveColumn={removeColumn}
                    onAddColumn={addColumn}
                    onResizeColumns={resizeColumns}
                    onRemoveRow={removeRow}
                    onEditColumn={(rowId, colId) => setEditing({ rowId, colId })}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

        </div>

      </div>

      {/* Edit modal */}
      {editing && editingCol && (
        <EditModal
          col={editingCol}
          onUpdate={(colId, data) => updateColumnData(editing.rowId, colId, data)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
