import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './EditModal.css';

export default function EditModal({ col, onUpdate, onClose }) {
  const backdropRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleBackdropClick(e) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="component_edit_modal_backdrop"
    >
      <div className="component_edit_modal_content">
        {/* Header */}
        <div className="component_edit_modal_header">
          <span className="badge component_edit_modal_component_name">{col.componentName}</span>
          <span className="component_edit_modal_title">Edit properties</span>
          <button
            onClick={onClose}
            className="component_edit_modal_close_button"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Monaco editor */}
        <div className="component_edit_modal_editor_container">
          <Editor
            height="640px"
            language="json"
            theme="vs-dark"
            value={col.data}
            onChange={val => onUpdate(col.id, val || '{}')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: 'JetBrains Mono, monospace',
              padding: { top: 10 },
              tabSize: 2,
              formatOnPaste: true,
            }}
          />
        </div>

        {/* Footer */}
        <div className="component_edit_modal_footer">
          <button className="btn btn-primary component_edit_modal_done_button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
