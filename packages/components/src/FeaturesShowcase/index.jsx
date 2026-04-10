import './styles.css';

export const description = 'Grid of feature cards showcasing key benefits with icons.';

export const schema = {
  title: 'string',
  subtitle: 'string (optional)',
  features: 'array of { icon, title, description }',
};

export const defaultData = {
  title: 'Why Choose Our CMS?',
  subtitle: 'Everything you need to build amazing pages.',
  features: [
    {
      icon: '✦',
      title: 'Drag & Drop Builder',
      description: 'Compose pages visually without touching code. Intuitive, fast, and powerful.',
    },
    {
      icon: '◉',
      title: 'Live Preview',
      description: 'See changes in real-time. Edit unsaved drafts and preview exactly how it looks.',
    },
    {
      icon: '⚡',
      title: 'Groovy Hooks',
      description: 'Server-side logic with validation, transformation, and custom endpoints.',
    },
    {
      icon: '🎨',
      title: 'Custom Components',
      description: 'Create and reuse components. Define schemas, defaults, and live renderers.',
    },
  ],
};

export default function FeaturesShowcaseRenderer({ data }) {
  return (
    <section className="component_features_showcase_section">
      <div className="component_features_showcase_glow_left" />
      <div className="component_features_showcase_glow_right" />

      <div className="component_features_showcase_content">
        <div className="component_features_showcase_header">
          <h2 className="component_features_showcase_title">
            {data.title || 'Why Choose Our CMS?'}
          </h2>
          {data.subtitle && (
            <p className="component_features_showcase_subtitle">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="component_features_showcase_grid">
          {Array.isArray(data.features) && data.features.map((feature, idx) => (
            <div key={idx} className="component_features_showcase_card">
              <div className="component_features_showcase_icon">
                {feature.icon}
              </div>
              <h3 className="component_features_showcase_card_title">
                {feature.title}
              </h3>
              <p className="component_features_showcase_card_desc">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
