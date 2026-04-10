import { marked } from 'marked';

marked.setOptions({ breaks: true });

export default function RichTextBlockPreview({ data }) {
  const s = data.styles || {};

  const wrapper = {
    background: s.backgroundColor || '#ffffff',
    color: s.textColor || '#1a1a2e',
    padding: '48px',
    borderRadius: '12px',
    maxWidth: s.maxWidth || '800px',
    margin: '0 auto',
    fontFamily: s.fontFamily || 'Inter, system-ui, sans-serif',
  };

  const html = data.body ? marked(data.body) : '<em style="opacity:0.4">No content yet...</em>';

  return (
    <div style={wrapper}>
      {data.title && (
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px', marginTop: 0 }}>
          {data.title}
        </h2>
      )}
      <div
        className="richtext-body"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ lineHeight: 1.8, fontSize: '1rem' }}
      />
    </div>
  );
}
