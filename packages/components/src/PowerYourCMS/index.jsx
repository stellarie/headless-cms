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

export function renderStatic(data) {
  const showTech = Array.isArray(data.techStack) && data.techStack.length > 0;
  const showCommands = Array.isArray(data.commands) && data.commands.length > 0;

  return `
    <section style="background: linear-gradient(160deg, #06060f 0%, #0a0a18 60%, #08080f 100%); padding: 80px 48px; position: relative; overflow: hidden; font-family: Inter, system-ui, sans-serif;">
      <div style="position: absolute; top: -5%; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(108, 99, 255, 0.12) 0%, transparent 70%); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -10%; right: 10%; width: 450px; height: 300px; background: radial-gradient(ellipse, rgba(236, 72, 153, 0.07) 0%, transparent 70%); pointer-events: none;"></div>

      <div style="position: relative; max-width: 1100px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 64px;">
          <h2 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.025em; color: #f0f0ff; margin: 0 0 16px;">
            ${data.title || 'Power Your CMS'}
          </h2>
          ${data.subtitle ? `<p style="font-size: 1rem; color: #8892a4; margin: 0; line-height: 1.6; max-width: 600px; margin: 0 auto;">${data.subtitle}</p>` : ''}
        </div>

        ${showTech ? `
          <div style="margin-bottom: 64px;">
            <h3 style="font-size: 1.5rem; font-weight: 700; color: #f0f0ff; margin: 0 0 32px; text-align: center;">Tech Stack</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
              ${data.techStack.map(tech => `
                <div style="padding: 28px 24px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;">
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #d8b4fe; margin: 0 0 8px;">
                    ${tech.name}
                  </h4>
                  <p style="font-size: 0.9rem; color: #8892a4; line-height: 1.6; margin: 0;">
                    ${tech.description}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${showCommands ? `
          <div>
            <h3 style="font-size: 1.5rem; font-weight: 700; color: #f0f0ff; margin: 0 0 32px; text-align: center;">Quick Start</h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${data.commands.map(cmd => `
                <div style="padding: 20px 24px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;">
                  <div style="font-size: 0.95rem; font-weight: 600; color: #c4c9e0; margin-bottom: 12px;">
                    ${cmd.label}
                  </div>
                  <code style="display: block; background: rgba(0, 0, 0, 0.2); color: #a5b4fc; padding: 12px 16px; border-radius: 8px; font-size: 0.85rem; font-family: 'Monaco', 'Courier New', monospace; overflow-x: auto; word-break: break-all;">
                    ${cmd.command}
                  </code>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

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
