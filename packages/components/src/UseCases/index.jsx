import './styles.css';

export const description = 'Showcase use cases and real-world applications of the CMS.';

export const schema = {
  title: 'string',
  subtitle: 'string (optional)',
  useCases: 'array of { icon, title, description }',
};

export const defaultData = {
  title: 'What Can You Build?',
  subtitle: 'From blogs to product sites to complex content platforms.',
  useCases: [
    {
      icon: '📝',
      title: 'Blogs & Content Sites',
      description: 'Manage posts, categories, and metadata. Use hooks for auto-indexing and SEO optimization.',
    },
    {
      icon: '🛒',
      title: 'E-Commerce Platforms',
      description: 'Product catalogs with dynamic pricing. Custom hooks for inventory, payments, and orders.',
    },
    {
      icon: '📊',
      title: 'SaaS Dashboards',
      description: 'Dynamic content based on user data. Real-time updates with the REST API.',
    },
    {
      icon: '🎓',
      title: 'Educational Portals',
      description: 'Course materials, lessons, and student content. Organize with custom components.',
    },
    {
      icon: '📱',
      title: 'Mobile App Content',
      description: 'Headless API serves content to iOS, Android, and React Native apps.',
    },
    {
      icon: '🎯',
      title: 'Marketing Sites',
      description: 'Landing pages, case studies, and campaigns. A/B test with ON_REQUEST hooks.',
    },
  ],
};

export function renderStatic(data) {
  return `
    <section style="background: linear-gradient(160deg, #06060f 0%, #0a0a18 60%, #08080f 100%); padding: 80px 48px; position: relative; overflow: hidden; font-family: Inter, system-ui, sans-serif;">
      <div style="position: absolute; top: -5%; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(108, 99, 255, 0.12) 0%, transparent 70%); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -10%; left: 10%; width: 500px; height: 350px; background: radial-gradient(ellipse, rgba(168, 85, 247, 0.08) 0%, transparent 70%); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -5%; right: 10%; width: 450px; height: 300px; background: radial-gradient(ellipse, rgba(236, 72, 153, 0.07) 0%, transparent 70%); pointer-events: none;"></div>

      <div style="position: relative; max-width: 1100px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 64px;">
          <h2 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.025em; color: #f0f0ff; margin: 0 0 16px;">
            ${data.title || 'What Can You Build?'}
          </h2>
          ${data.subtitle ? `<p style="font-size: 1rem; color: #8892a4; margin: 0; line-height: 1.6; max-width: 600px; margin: 0 auto;">${data.subtitle}</p>` : ''}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
          ${Array.isArray(data.useCases) ? data.useCases.map(useCase => `
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 36px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; transition: all 0.3s ease;">
              <div style="font-size: 2.8rem; display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.15)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px;">
                ${useCase.icon}
              </div>
              <h3 style="font-size: 1.2rem; font-weight: 700; color: #d8b4fe; margin: 0;">
                ${useCase.title}
              </h3>
              <p style="font-size: 0.95rem; color: #8892a4; margin: 0; line-height: 1.6;">
                ${useCase.description}
              </p>
            </div>
          `).join('') : ''}
        </div>
      </div>
    </section>
  `;
}

export default function UseCasesRenderer({ data }) {
  return (
    <section className="component_use_cases_section">
      <div className="component_use_cases_glow_top" />
      <div className="component_use_cases_glow_bottom_left" />
      <div className="component_use_cases_glow_bottom_right" />

      <div className="component_use_cases_content">
        <div className="component_use_cases_header">
          <h2 className="component_use_cases_title">
            {data.title || 'What Can You Build?'}
          </h2>
          {data.subtitle && (
            <p className="component_use_cases_subtitle">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="component_use_cases_grid">
          {Array.isArray(data.useCases) && data.useCases.map((useCase, idx) => (
            <div key={idx} className="component_use_cases_card">
              <div className="component_use_cases_icon">
                {useCase.icon}
              </div>
              <h3 className="component_use_cases_card_title">
                {useCase.title}
              </h3>
              <p className="component_use_cases_card_desc">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
