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
