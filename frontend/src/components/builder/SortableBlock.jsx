import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import COMPONENTS from '../../registry';

export default function SortableBlock({ block, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    background: 'var(--surface)',
    border: `1px solid ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  };

  const registered = COMPONENTS[block.componentName];

  return (
    <div ref={setNodeRef} style={style}>
      {/* Block header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--surface2)' }}>
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          style={{ background: 'none', border: 'none', cursor: 'grab', color: 'var(--text-muted)', fontSize: 16, padding: '0 4px', lineHeight: 1, touchAction: 'none' }}
          title="Drag to reorder"
        >
          ⠿
        </button>

        <span className="badge">{block.componentName}</span>

        {registered?.description && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {registered.description}
          </span>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, padding: '2px 8px' }}
        >
          {expanded ? '▲ collapse' : '▼ edit data'}
        </button>

        <button
          onClick={() => onRemove(block.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 16, padding: '0 4px', lineHeight: 1 }}
          title="Remove block"
        >
          ✕
        </button>
      </div>

      {/* Inline data editor */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <Editor
            height="180px"
            language="json"
            theme="vs-dark"
            value={block.data}
            onChange={val => onUpdate(block.id, val || '{}')}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              padding: { top: 8 },
            }}
          />
        </div>
      )}
    </div>
  );
}
