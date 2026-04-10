import { useState } from 'react';
import './styles.css';

export const description = 'Tabbed section showcasing tech stack and quick start commands.';

export const schema = {
  title: 'string',
  subtitle: 'string (optional)',
  techStack: 'array of { name, description }',
  commands: 'array of { label, command }',
};

export const defaultData = {
  title: 'Power Your CMS',
  subtitle: 'Built on modern, battle-tested technologies.',
  techStack: [
    { name: 'Spring Boot 3.2.4', description: 'Powerful Java framework for REST APIs' },
    { name: 'React 19', description: 'Modern UI library with hooks and composition' },
    { name: 'Vite 8', description: 'Lightning-fast frontend build tool' },
    { name: 'Groovy 4.0', description: 'Dynamic JVM language for server-side logic' },
    { name: '@dnd-kit', description: 'Headless drag-and-drop library' },
    { name: 'H2 Database', description: 'Embedded SQL database with file persistence' },
  ],
  commands: [
    { label: 'Start the CMS locally', command: 'cd /path/to/cms && ./start.sh' },
    { label: 'Build for production', command: 'cd backend && mvn clean package' },
    { label: 'Run backend tests', command: 'cd backend && mvn test' },
    { label: 'Export pages statically', command: 'cd frontend && npm run export' },
    { label: 'Deploy to GitHub Pages', command: 'git checkout -b gh-pages && git add frontend/dist/ && git commit -m "Deploy" && git push origin gh-pages' },
    { label: 'Build Docker image', command: 'docker build -t my-cms:latest .' },
    { label: 'Run Docker container', command: 'docker run -p 8080:8080 -p 5173:5173 my-cms:latest' },
  ],
};

export default function PowerYourCMSRenderer({ data }) {
  const [activeTab, setActiveTab] = useState('tech');

  const showTech = Array.isArray(data.techStack) && data.techStack.length > 0;
  const showCommands = Array.isArray(data.commands) && data.commands.length > 0;

  return (
    <section className="component_power_cms_section">
      <div className="component_power_cms_glow_left" />
      <div className="component_power_cms_glow_right" />

      <div className="component_power_cms_content">
        <div className="component_power_cms_header">
          <h2 className="component_power_cms_title">
            {data.title || 'Power Your CMS'}
          </h2>
          {data.subtitle && (
            <p className="component_power_cms_subtitle">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="component_power_cms_tabs">
          {showTech && (
            <button
              className={`component_power_cms_tab ${activeTab === 'tech' ? 'active' : ''}`}
              onClick={() => setActiveTab('tech')}
            >
              Tech Stack
            </button>
          )}
          {showCommands && (
            <button
              className={`component_power_cms_tab ${activeTab === 'commands' ? 'active' : ''}`}
              onClick={() => setActiveTab('commands')}
            >
              Quick Start
            </button>
          )}
        </div>

        {/* Tab content */}
        {activeTab === 'tech' && showTech && (
          <div className="component_power_cms_tab_content">
            <div className="component_power_cms_tech_grid">
              {data.techStack.map((tech, idx) => (
                <div key={idx} className="component_power_cms_tech_item">
                  <h4 className="component_power_cms_tech_name">
                    {tech.name}
                  </h4>
                  <p className="component_power_cms_tech_desc">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'commands' && showCommands && (
          <div className="component_power_cms_tab_content">
            <div className="component_power_cms_commands_list">
              {data.commands.map((cmd, idx) => (
                <div key={idx} className="component_power_cms_command_item">
                  <div className="component_power_cms_command_label">
                    {cmd.label}
                  </div>
                  <code className="component_power_cms_command_code">
                    {cmd.command}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
