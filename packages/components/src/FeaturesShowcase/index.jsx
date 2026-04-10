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

export function renderStatic(data) {
  return `
    <section style="background: linear-gradient(160deg, #06060f 0%, #0a0a18 60%, #08080f 100%); padding: 80px 48px; position: relative; overflow: hidden; font-family: Inter, system-ui, sans-serif;">
      <div style="position: absolute; top: -5%; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(108, 99, 255, 0.12) 0%, transparent 70%); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -10%; right: 10%; width: 450px; height: 300px; background: radial-gradient(ellipse, rgba(236, 72, 153, 0.07) 0%, transparent 70%); pointer-events: none;"></div>

      <div style="position: relative; max-width: 1100px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 64px;">
          <h2 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.025em; color: #f0f0ff; margin: 0 0 16px;">
            ${data.title || 'Why Choose Our CMS?'}
          </h2>
          ${data.subtitle ? `<p style="font-size: 1rem; color: #8892a4; margin: 0; line-height: 1.6; max-width: 600px; margin: 0 auto;">${data.subtitle}</p>` : ''}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          ${Array.isArray(data.features) ? data.features.map(feature => `
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 36px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; transition: all 0.3s ease;">
              <div style="font-size: 2.8rem; display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.15)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px;">
                ${feature.icon}
              </div>
              <h3 style="font-size: 1.2rem; font-weight: 700; color: #d8b4fe; margin: 0;">
                ${feature.title}
              </h3>
              <p style="font-size: 0.95rem; color: #8892a4; margin: 0; line-height: 1.6;">
                ${feature.description}
              </p>
            </div>
          `).join('') : ''}
        </div>
      </div>
    </section>
  `;
}

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
