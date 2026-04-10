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

export function renderStatic(data) {
  return `
    <section style="background: linear-gradient(160deg, #06060f 0%, #0a0a18 60%, #08080f 100%); padding: 80px 48px; position: relative; overflow: hidden; font-family: Inter, system-ui, sans-serif;">
      <div style="position: absolute; top: -5%; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(108, 99, 255, 0.12) 0%, transparent 70%); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -10%; left: 10%; width: 500px; height: 350px; background: radial-gradient(ellipse, rgba(168, 85, 247, 0.08) 0%, transparent 70%); pointer-events: none;"></div>

      <div style="position: relative; max-width: 1100px; margin: 0 auto;">
        ${data.title ? `
          <div style="text-align: center; margin-bottom: 64px;">
            <h2 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.025em; color: #f0f0ff; margin: 0 0 16px;">
              ${data.title}
            </h2>
            ${data.subtitle ? `<p style="font-size: 1rem; color: #8892a4; margin: 0; line-height: 1.6; max-width: 600px; margin: 0 auto;">${data.subtitle}</p>` : ''}
          </div>
        ` : ''}

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 48px; align-items: start;">
          <div>
            ${data.leftImage ? `
              <div style="border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                <img src="${data.leftImage}" alt="${data.leftTitle}" style="width: 100%; height: auto; display: block; border-radius: 12px;">
              </div>
            ` : ''}
            <h3 style="font-size: 1.3rem; font-weight: 700; color: #d8b4fe; margin: 0 0 16px;">
              ${data.leftTitle}
            </h3>
            <p style="font-size: 0.95rem; color: #8892a4; line-height: 1.7; margin: 0;">
              ${data.leftDescription}
            </p>
          </div>

          <div>
            ${data.rightImage ? `
              <div style="border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                <img src="${data.rightImage}" alt="${data.rightTitle}" style="width: 100%; height: auto; display: block; border-radius: 12px;">
              </div>
            ` : ''}
            <h3 style="font-size: 1.3rem; font-weight: 700; color: #d8b4fe; margin: 0 0 16px;">
              ${data.rightTitle}
            </h3>
            <p style="font-size: 0.95rem; color: #8892a4; line-height: 1.7; margin: 0;">
              ${data.rightDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}

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
