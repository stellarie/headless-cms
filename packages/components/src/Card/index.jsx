import './styles.css';

export const description = 'Dark feature card with icon, tag, title, description, and optional link.';

export const schema = {
  icon: 'string (emoji)',
  tag: 'string (optional badge label)',
  title: 'string',
  description: 'string',
  linkText: 'string (optional)',
  linkHref: 'string (optional)',
};

export const defaultData = {
  icon: '⚡',
  tag: 'Feature',
  title: 'Lightning Fast',
  description: 'Built on Spring Boot and React for maximum performance. Deploy anywhere, scale to millions of requests.',
  linkText: 'Learn more',
  linkHref: '#',
};

export default function CardRenderer({ data }) {
  return (
    <div className="component_card_root">
      <div className="component_card_top_line" />
      <div className="component_card_glow" />

      {data.icon && (
        <div className="component_card_icon">
          {data.icon}
        </div>
      )}

      {data.tag && (
        <span className="component_card_tag">
          {data.tag}
        </span>
      )}

      <h3 className="component_card_title">
        {data.title || 'Card Title'}
      </h3>

      <p className="component_card_description">
        {data.description || 'Card description goes here.'}
      </p>

      {data.linkText && (
        <a href={data.linkHref || '#'} className="component_card_link">
          {data.linkText} →
        </a>
      )}
    </div>
  );
}
