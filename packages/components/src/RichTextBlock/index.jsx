import './styles.css';

export const description = 'Dark content section with a section label, heading, and rich body text supporting markdown.';

export const schema = {
  label: 'string (optional, small uppercase label)',
  heading: 'string',
  body: 'markdown string',
  align: 'left | center',
};

export const defaultData = {
  label: 'About',
  heading: 'Designed for modern teams',
  body: 'We built this CMS to **close the gap** between developers and content creators.\n\nNo more waiting for a developer to update a headline. No more fighting with rigid templates.\n\n- **Visual editor** — compose pages by dragging and dropping components\n- **Live preview** — see exactly how the page looks before publishing\n- **Headless API** — connect to any frontend: React, Vue, mobile apps\n- **Extensible** — add your own components with custom Groovy hooks',
  align: 'center',
};

export default function RichTextBlockRenderer({ data }) {
  const align = data.align || 'center';

  function renderMarkdown(md) {
    if (!md) return '';
    const escaped = md
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lines = escaped.split('\n');
    let html = '';
    let inList = false;

    for (const raw of lines) {
      const line = raw
        .replace(/\*\*(.+?)\*\*/g, '<strong class="component_richtext_body strong">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="component_richtext_body em">$1</em>')
        .replace(/`(.+?)`/g, '<code class="component_richtext_body code">$1</code>');

      if (line.startsWith('- ')) {
        if (!inList) { html += '<ul class="component_richtext_body ul">'; inList = true; }
        html += `<li class="component_richtext_body li">${line.slice(2)}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        if (line.startsWith('### ')) html += `<h3 class="component_richtext_body h3">${line.slice(4)}</h3>`;
        else if (line.startsWith('## ')) html += `<h2 class="component_richtext_body h2">${line.slice(3)}</h2>`;
        else if (line.startsWith('# ')) html += `<h1 class="component_richtext_body h1">${line.slice(2)}</h1>`;
        else if (line.trim() === '') html += '<br/>';
        else html += `<p class="component_richtext_body p">${line}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html;
  }

  return (
    <section className="component_richtext_section">
      <div className="component_richtext_glow" />

      <div className={`component_richtext_container ${align === 'left' ? 'left-align' : ''}`}>
        {data.label && (
          <p className="component_richtext_label">
            {data.label}
          </p>
        )}

        {data.heading && (
          <h2 className="component_richtext_heading">
            {data.heading}
          </h2>
        )}

        <div
          className="component_richtext_body"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(data.body) || '<em class="component_richtext_empty">No content yet…</em>' }}
        />
      </div>
    </section>
  );
}
