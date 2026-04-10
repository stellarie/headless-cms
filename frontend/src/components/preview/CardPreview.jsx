export default function CardPreview({ data }) {
  const s = data.styles || {};

  const card = {
    background: s.backgroundColor || '#ffffff',
    color: s.textColor || '#1a1a2e',
    borderRadius: s.borderRadius || '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    maxWidth: '400px',
    margin: '0 auto',
    fontFamily: 'Inter, system-ui, sans-serif',
  };

  const accent = s.accentColor || '#6c63ff';

  return (
    <div style={card}>
      {data.imageUrl && (
        <img
          src={data.imageUrl}
          alt={data.title || ''}
          style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}
      {!data.imageUrl && (
        <div style={{ height: '160px', background: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>🖼</span>
        </div>
      )}
      <div style={{ padding: '24px' }}>
        {data.title && (
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', marginTop: 0, color: s.textColor || '#1a1a2e' }}>
            {data.title}
          </h3>
        )}
        {data.description && (
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.75, marginBottom: '16px', marginTop: 0 }}>
            {data.description}
          </p>
        )}
        {data.linkText && (
          <a href={data.linkUrl || '#'} style={{ color: accent, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            {data.linkText} →
          </a>
        )}
      </div>
    </div>
  );
}
