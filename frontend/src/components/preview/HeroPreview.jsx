export default function HeroPreview({ data }) {
  const s = data.styles || {};
  const style = {
    background: data.backgroundImage
      ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${data.backgroundImage}) center/cover`
      : (s.backgroundColor || '#6c63ff'),
    color: s.textColor || '#ffffff',
    padding: '80px 48px',
    textAlign: 'center',
    borderRadius: '12px',
    minHeight: '320px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  };

  const btnStyle = {
    background: s.buttonColor || '#ffffff',
    color: s.buttonTextColor || '#6c63ff',
    padding: '12px 28px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '8px',
  };

  return (
    <div style={style}>
      {data.title && <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>{data.title}</h1>}
      {data.subtitle && <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '560px', margin: 0 }}>{data.subtitle}</p>}
      {data.ctaText && (
        <a href={data.ctaUrl || '#'} style={btnStyle}>{data.ctaText}</a>
      )}
    </div>
  );
}
