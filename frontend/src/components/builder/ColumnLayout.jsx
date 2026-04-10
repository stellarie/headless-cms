import { useRef, useState } from 'react';
import COMPONENTS from '../../registry';
import './ColumnLayout.css';

/** Renders the component preview with an edit/remove hover overlay */
function ColumnPreview({ col, onEdit, onRemove }) {
  const [hovered, setHovered] = useState(false);

  const registered = COMPONENTS[col.componentName];
  const Renderer = registered?.Renderer;
  let data = {};
  try { data = JSON.parse(col.data || '{}'); } catch {}

  return (
    <div
      className="component_column_preview_wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rendered component */}
      {Renderer ? (
        <Renderer data={data} />
      ) : (
        <div className="component_column_preview_fallback">
          <span className="component_column_preview_fallback_title">{col.componentName}</span>
          <pre className="component_column_preview_fallback_data">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {/* Hover overlay */}
      {hovered && (
        <div className="component_column_preview_hover_overlay">
          <span className="component_column_preview_component_label">
            {col.componentName}
          </span>
          <button
            onClick={onEdit}
            className="component_column_preview_edit_button"
            title="Edit properties"
          >
            ✎ Edit
          </button>
          <button
            onClick={onRemove}
            className="component_column_preview_remove_button"
            title="Remove column"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

/** Resize handle between two columns */
function ResizeHandle({ onStartResize }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseDown={onStartResize}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`component_resize_handle ${hovered ? 'hovered' : ''}`}
      title="Drag to resize"
    >
      {hovered && <div className="component_resize_handle_indicator" />}
    </div>
  );
}

/** Inline component picker for adding a column */
function ColumnPicker({ onPick, onCancel }) {
  const names = Object.keys(COMPONENTS);
  return (
    <div className="component_column_picker">
      <p className="component_column_picker_title">
        Add Column
      </p>
      {names.map(name => (
        <button
          key={name}
          onClick={() => onPick(name)}
          className="component_column_picker_item"
        >
          + {name}
        </button>
      ))}
      <button onClick={onCancel} className="component_column_picker_cancel">
        Cancel
      </button>
    </div>
  );
}

export default function ColumnLayout({ row, rowHovered, onRemoveColumn, onAddColumn, onResizeColumns, onEditColumn }) {
  const rowRef = useRef(null);
  const [pickingColumn, setPickingColumn] = useState(false);

  function startResize(e, colIndex) {
    e.preventDefault();
    const startX = e.clientX;
    const containerWidth = rowRef.current?.offsetWidth || 800;
    const startWidths = row.columns.map(c => c.width);

    function onMouseMove(e) {
      const delta = e.clientX - startX;
      const deltaPercent = (delta / containerWidth) * 100;
      const newWidths = [...startWidths];
      newWidths[colIndex] = Math.max(10, startWidths[colIndex] + deltaPercent);
      newWidths[colIndex + 1] = Math.max(10, startWidths[colIndex + 1] - deltaPercent);
      const total = newWidths.reduce((a, b) => a + b, 0);
      onResizeColumns(row.id, newWidths.map(w => (w / total) * 100));
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  return (
    <div ref={rowRef} className="component_column_layout">
      {row.columns.map((col, i) => (
        <div key={col.id} style={{ display: 'flex', flex: col.width, minWidth: 0 }}>
          <div className="component_column_preview_content">
            <ColumnPreview
              col={col}
              onEdit={() => onEditColumn(row.id, col.id)}
              onRemove={() => onRemoveColumn(row.id, col.id)}
            />
          </div>
          {i < row.columns.length - 1 && (
            <ResizeHandle onStartResize={(e) => startResize(e, i)} />
          )}
        </div>
      ))}

      {/* Add column — only visible when row is hovered */}
      {(rowHovered || pickingColumn) && (
        <div className="component_column_add_container">
          {pickingColumn ? (
            <ColumnPicker
              onPick={(name) => { onAddColumn(row.id, name); setPickingColumn(false); }}
              onCancel={() => setPickingColumn(false)}
            />
          ) : (
            <button
              onClick={() => setPickingColumn(true)}
              className="component_column_add_button"
              title="Add column"
            >
              +
            </button>
          )}
        </div>
      )}
    </div>
  );
}
