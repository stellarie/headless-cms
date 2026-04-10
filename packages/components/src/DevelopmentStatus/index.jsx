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
