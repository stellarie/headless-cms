import { useState } from 'react';

export default function FAQPreview({ data }) {
  const s = data.styles || {};
  const [open, setOpen] = useState(null);

  const wrapper = {
    background: s.backgroundColor || '#f8f9ff',
    padding: '48px',
    borderRadius: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
  };

  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <div style={wrapper}>
      {data.heading && (
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '32px', marginTop: 0, color: s.headingColor || '#1a1a2e' }}>
          {data.heading}
        </h2>
      )}
      {items.length === 0 && (
        <p style={{ opacity: 0.4, fontStyle: 'italic' }}>No FAQ items yet...</p>
      )}
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            borderBottom: `1px solid ${s.questionColor || '#6c63ff'}33`,
            marginBottom: '4px',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              padding: '16px 0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '1rem',
              fontWeight: 600,
              color: s.questionColor || '#6c63ff',
              gap: '12px',
            }}
          >
            <span>{item.question || 'Question'}</span>
            <span style={{ fontSize: '1.2rem', transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
          </button>
          {open === i && (
            <p style={{
              margin: '0 0 16px',
              color: s.answerColor || '#444444',
              lineHeight: 1.7,
              fontSize: '0.95rem',
              paddingRight: '24px',
            }}>
              {item.answer || 'Answer'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
