import './styles.css';

export const description = 'Two-column benefits section highlighting competitive advantages.';

export const schema = {
  title: 'string',
  subtitle: 'string (optional)',
  leftTitle: 'string',
  leftDescription: 'string',
  leftImage: 'string (url optional)',
  rightTitle: 'string',
  rightDescription: 'string',
  rightImage: 'string (url optional)',
};

export const defaultData = {
  title: 'What Makes Us Different',
  subtitle: 'Built by developers, for developers.',
  leftTitle: 'Headless Architecture',
  leftDescription: 'Your content lives in a powerful REST API. Serve it to React, Vue, mobile apps, static sites, or anything else. No lock-in, complete freedom.',
  leftImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
  rightTitle: 'Developer-Friendly',
  rightDescription: 'Write Groovy scripts for business logic, customize components with JSX, and deploy anywhere. Everything is open, extensible, and hackable.',
  rightImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
};

export default function BenefitsSectionRenderer({ data }) {
  return (
    <section className="component_benefits_section">
      <div className="component_benefits_glow_top" />
      <div className="component_benefits_glow_bottom" />

      <div className="component_benefits_content">
        {data.title && (
          <div className="component_benefits_header">
            <h2 className="component_benefits_title">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="component_benefits_subtitle">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="component_benefits_grid">
          {/* Left Column */}
          <div className="component_benefits_column">
            {data.leftImage && (
              <div className="component_benefits_image_wrapper">
                <img
                  src={data.leftImage}
                  alt={data.leftTitle}
                  className="component_benefits_image"
                />
              </div>
            )}
            <div className="component_benefits_text">
              <h3 className="component_benefits_column_title">
                {data.leftTitle}
              </h3>
              <p className="component_benefits_column_desc">
                {data.leftDescription}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="component_benefits_column">
            {data.rightImage && (
              <div className="component_benefits_image_wrapper">
                <img
                  src={data.rightImage}
                  alt={data.rightTitle}
                  className="component_benefits_image"
                />
              </div>
            )}
            <div className="component_benefits_text">
              <h3 className="component_benefits_column_title">
                {data.rightTitle}
              </h3>
              <p className="component_benefits_column_desc">
                {data.rightDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
