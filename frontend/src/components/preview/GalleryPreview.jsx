export default function GalleryPreview({ data }) {
  const s = data.styles || {};
  const columns = s.columns || 3;
  const gap = s.gap || '12px';
  const images = Array.isArray(data.images) ? data.images : [];

  const wrapper = {
    background: s.backgroundColor || '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
  };

  const imgStyle = {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: s.borderRadius || '8px',
    display: 'block',
  };

  return (
    <div style={wrapper}>
      {data.title && (
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '24px', marginTop: 0 }}>
          {data.title}
        </h2>
      )}
      {images.length === 0 && (
        <p style={{ opacity: 0.4, fontStyle: 'italic' }}>No images yet...</p>
      )}
      <div style={grid}>
        {images.map((img, i) => (
          <div key={i}>
            {img.url ? (
              <img
                src={img.url}
                alt={img.caption || ''}
                style={imgStyle}
                onError={e => { e.target.src = ''; e.target.style.background = '#eee'; }}
              />
            ) : (
              <div style={{ ...imgStyle, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ opacity: 0.3, fontSize: '1.5rem' }}>🖼</span>
              </div>
            )}
            {img.caption && (
              <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '6px', marginBottom: 0, textAlign: 'center' }}>
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
