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
