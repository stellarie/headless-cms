import './styles.css';

export const description = 'Footer section with site info, navigation links, and copyright.';

export const schema = {
  company: 'string (optional)',
  tagline: 'string (optional)',
  links: 'array of { label, href }',
  socialLinks: 'array of { iconUrl, href, alt }',
  copyright: 'string (optional)',
};

export const defaultData = {
  company: 'Your Company',
  tagline: 'Building amazing things.',
  links: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ],
  socialLinks: [
    { iconUrl: 'https://github.com/favicon.ico', href: 'https://github.com', alt: 'GitHub' },
    { iconUrl: 'https://www.linkedin.com/favicon.ico', href: 'https://linkedin.com', alt: 'LinkedIn' },
  ],
  copyright: '© 2025 Your Company. All rights reserved.',
};

export function renderStatic(data) {
  return `
    <footer style="background: linear-gradient(180deg, #0a0a16 0%, #06060f 100%); padding: 64px 48px 32px; border-top: 1px solid rgba(255, 255, 255, 0.08); position: relative; overflow: hidden; font-family: Inter, system-ui, sans-serif;">
      <div style="position: absolute; top: -50%; left: 10%; width: 400px; height: 400px; background: radial-gradient(ellipse, rgba(168, 85, 247, 0.08) 0%, transparent 70%); pointer-events: none;"></div>
      <div style="position: absolute; top: -30%; right: 5%; width: 350px; height: 350px; background: radial-gradient(ellipse, rgba(236, 72, 153, 0.06) 0%, transparent 70%); pointer-events: none;"></div>

      <div style="position: relative; max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 64px; align-items: start; margin-bottom: 48px; padding-bottom: 48px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #f0f0ff; margin: 0 0 8px;">
              ${data.company || 'Your Company'}
            </h3>
            ${data.tagline ? `<p style="font-size: 0.9rem; color: #8892a4; margin: 0;">${data.tagline}</p>` : ''}
          </div>

          ${Array.isArray(data.links) && data.links.length > 0 ? `
            <div style="display: flex; flex-wrap: wrap; gap: 32px; justify-content: flex-end;">
              ${data.links.map(link => `
                <a href="${link.href || '#'}" style="color: #8892a4; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;">
                  ${link.label}
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: center;">
          ${Array.isArray(data.socialLinks) && data.socialLinks.length > 0 ? `
            <div style="display: flex; gap: 16px;">
              ${data.socialLinks.map(social => `
                <a href="${social.href || '#'}" target="_blank" rel="noopener noreferrer" title="${social.alt || ''}" style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; text-decoration: none;">
                  <img src="${social.iconUrl}" alt="${social.alt || ''}" style="width: 20px; height: 20px; opacity: 0.7;">
                </a>
              `).join('')}
            </div>
          ` : ''}

          ${data.copyright ? `
            <p style="color: #4b5563; font-size: 0.85rem; margin: 0;">
              ${data.copyright}
            </p>
          ` : ''}
        </div>
      </div>
    </footer>
  `;
}

export default function FooterRenderer({ data }) {
  return (
    <footer className="component_footer_section">
      <div className="component_footer_glow_left" />
      <div className="component_footer_glow_right" />

      <div className="component_footer_content">
        {/* Top section — company info + links */}
        <div className="component_footer_top">
          <div className="component_footer_info">
            <h3 className="component_footer_company">
              {data.company || 'Your Company'}
            </h3>
            {data.tagline && (
              <p className="component_footer_tagline">
                {data.tagline}
              </p>
            )}
          </div>

          <div className="component_footer_links">
            {Array.isArray(data.links) && data.links.map((link, idx) => (
              <a key={idx} href={link.href || '#'} className="component_footer_link">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom section — social + copyright */}
        <div className="component_footer_bottom">
          {Array.isArray(data.socialLinks) && data.socialLinks.length > 0 && (
            <div className="component_footer_socials">
              {data.socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href || '#'}
                  className="component_footer_social_icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.alt}
                >
                  <img src={social.iconUrl} alt={social.alt} className="component_footer_social_icon_img" />
                </a>
              ))}
            </div>
          )}

          {data.copyright && (
            <p className="component_footer_copyright">
              {data.copyright}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
