import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ColumnLayout from './ColumnLayout';
import './SortableRow.css';

export default function SortableRow({ row, onRemoveColumn, onAddColumn, onResizeColumns, onRemoveRow, onEditColumn }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`component_sortable_row ${isDragging ? 'dragging' : hovered ? 'hovered' : 'idle'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Row controls — float top-right on hover */}
      {(hovered || isDragging) && (
        <div className="component_sortable_row_controls">
          <button
            {...attributes}
            {...listeners}
            className="component_sortable_row_drag_button"
            title="Drag to reorder row"
          >
            ⠿
          </button>
          <button
            onClick={() => onRemoveRow(row.id)}
            className="component_sortable_row_remove_button"
            title="Remove row"
          >
            ✕
          </button>
        </div>
      )}

      <ColumnLayout
        row={row}
        rowHovered={hovered}
        onRemoveColumn={onRemoveColumn}
        onAddColumn={onAddColumn}
        onResizeColumns={onResizeColumns}
        onEditColumn={onEditColumn}
      />
    </div>
  );
}
