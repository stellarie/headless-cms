import './styles.css';

export const description = 'Development status section with badge and milestone features.';

export const schema = {
  badge: 'string (optional)',
  title: 'string',
  subtitle: 'string (optional)',
  features: 'array of { label, status }',
};

export const defaultData = {
  badge: '🚀 v0.1.0-beta',
  title: 'Development Roadmap',
  subtitle: 'Here\'s what we\'re building and where we are in the process.',
  features: [
    { label: 'Visual page builder', status: 'done' },
    { label: 'Drag-and-drop components', status: 'done' },
    { label: 'Live preview', status: 'done' },
    { label: 'Groovy hooks system', status: 'done' },
    { label: 'Custom component renderer', status: 'in-progress' },
    { label: 'Real-time collaboration', status: 'planned' },
    { label: 'Version control & rollback', status: 'planned' },
    { label: 'Advanced analytics', status: 'planned' },
  ],
};

const statusConfig = {
  done: { icon: '✓', label: 'Done', color: 'done' },
  'in-progress': { icon: '◉', label: 'In Progress', color: 'in-progress' },
  planned: { icon: '○', label: 'Planned', color: 'planned' },
};

export function renderStatic(data) {
  const colors = {
    done: '#10b981',
    'in-progress': '#f59e0b',
    planned: '#6b7280',
  };

  return `
    <section style="background: linear-gradient(160deg, #06060f 0%, #0a0a18 60%, #08080f 100%); padding: 80px 48px; position: relative; overflow: hidden; font-family: Inter, system-ui, sans-serif;">
      <div style="position: absolute; top: -5%; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(108, 99, 255, 0.12) 0%, transparent 70%); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -10%; left: 10%; width: 500px; height: 350px; background: radial-gradient(ellipse, rgba(168, 85, 247, 0.08) 0%, transparent 70%); pointer-events: none;"></div>

      <div style="position: relative; max-width: 900px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 64px;">
          ${data.badge ? `<div style="display: inline-block; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 100px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #d8b4fe; margin-bottom: 16px;">${data.badge}</div>` : ''}
          <h2 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.025em; color: #f0f0ff; margin: 0 0 16px;">
            ${data.title || 'Development Roadmap'}
          </h2>
          ${data.subtitle ? `<p style="font-size: 1rem; color: #8892a4; margin: 0; line-height: 1.6; max-width: 600px; margin: 0 auto;">${data.subtitle}</p>` : ''}
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${Array.isArray(data.features) ? data.features.map(feature => {
            const config = statusConfig[feature.status] || statusConfig.planned;
            return `
              <div style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;">
                <div style="font-size: 1.4rem; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: ${colors[feature.status] || colors.planned}20; border: 1px solid ${colors[feature.status] || colors.planned}40; border-radius: 10px; color: ${colors[feature.status] || colors.planned}; flex-shrink: 0;">
                  ${config.icon}
                </div>
                <div style="flex: 1;">
                  <p style="font-size: 1rem; font-weight: 600; color: #e2e8f0; margin: 0 0 4px;">
                    ${feature.label}
                  </p>
                  <span style="font-size: 0.85rem; color: ${colors[feature.status] || colors.planned}; font-weight: 500;">
                    ${config.label}
                  </span>
                </div>
              </div>
            `;
          }).join('') : ''}
        </div>
      </div>
    </section>
  `;
}

export default function DevelopmentStatusRenderer({ data }) {
  return (
    <section className="component_dev_status_section">
      <div className="component_dev_status_glow_top" />
      <div className="component_dev_status_glow_bottom" />

      <div className="component_dev_status_content">
        {data.badge && (
          <div className="component_dev_status_badge">
            {data.badge}
          </div>
        )}

        <div className="component_dev_status_header">
          <h2 className="component_dev_status_title">
            {data.title || 'Development Roadmap'}
          </h2>
          {data.subtitle && (
            <p className="component_dev_status_subtitle">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="component_dev_status_features">
          {Array.isArray(data.features) && data.features.map((feature, idx) => {
            const config = statusConfig[feature.status] || statusConfig.planned;
            return (
              <div key={idx} className={`component_dev_status_feature component_dev_status_feature--${config.color}`}>
                <span className="component_dev_status_feature_icon">
                  {config.icon}
                </span>
                <div className="component_dev_status_feature_text">
                  <p className="component_dev_status_feature_label">
                    {feature.label}
                  </p>
                  <span className="component_dev_status_feature_status">
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
