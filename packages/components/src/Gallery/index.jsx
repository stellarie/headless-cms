import './styles.css';

export const description = 'A dark image or media grid gallery with optional captions.';

export const schema = {
  label: 'string (optional)',
  heading: 'string (optional)',
  items: [{ url: 'string', caption: 'string (optional)', tag: 'string (optional)' }],
  columns: 'number (default 3)',
};

export const defaultData = {
  label: 'Showcase',
  heading: 'Built with the tools you love',
  columns: 3,
  items: [
    { url: 'https://picsum.photos/seed/cms1/600/400', caption: 'Visual Builder', tag: 'UI' },
    { url: 'https://picsum.photos/seed/cms2/600/400', caption: 'Live Preview', tag: 'DX' },
    { url: 'https://picsum.photos/seed/cms3/600/400', caption: 'Headless API', tag: 'API' },
    { url: 'https://picsum.photos/seed/cms4/600/400', caption: 'Component Registry', tag: 'Code' },
    { url: 'https://picsum.photos/seed/cms5/600/400', caption: 'Groovy Hooks', tag: 'Logic' },
    { url: 'https://picsum.photos/seed/cms6/600/400', caption: 'Dark Theme', tag: 'Design' },
  ],
};

export default function GalleryRenderer({ data }) {
  const cols = data.columns || 3;
  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <section className="component_gallery_section">
      <div className="component_gallery_glow" />

      <div className="component_gallery_container">
        {data.label && (
          <p className="component_gallery_label">
            {data.label}
          </p>
        )}
        {data.heading && (
          <h2 className="component_gallery_heading">
            {data.heading}
          </h2>
        )}

        {items.length === 0 && <p className="component_gallery_empty">No items yet.</p>}

        <div className="component_gallery_grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {items.map((item, i) => (
            <div key={i} className="component_gallery_item">
              {item.url ? (
                <img
                  src={item.url}
                  alt={item.caption || ''}
                  className="component_gallery_image"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="component_gallery_placeholder">🖼</div>
              )}
              {(item.tag || item.caption) && (
                <div className="component_gallery_caption_overlay">
                  {item.tag && (
                    <span className="component_gallery_tag">
                      {item.tag}
                    </span>
                  )}
                  {item.caption && <p className="component_gallery_caption">{item.caption}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
