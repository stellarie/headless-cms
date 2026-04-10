import './styles.css';

export const description = 'Full-width hero section with headline, gradient accent, subtitle, and CTAs.';

export const schema = {
  badge: 'string (optional)',
  headline: 'string',
  headlineAccent: 'string (optional — renders with gradient)',
  subtitle: 'string (optional)',
  ctaText: 'string (optional)',
  ctaHref: 'string (optional)',
  secondaryCtaText: 'string (optional)',
  secondaryCtaHref: 'string (optional)',
};

export const defaultData = {
  badge: '✦ Now Available',
  headline: 'Build stunning pages',
  headlineAccent: 'without writing code.',
  subtitle: 'A powerful headless CMS with a visual drag-and-drop builder. Compose components, preview live, and publish instantly.',
  ctaText: 'Start Building →',
  ctaHref: '#',
  secondaryCtaText: 'Learn More',
  secondaryCtaHref: '#',
};

export default function HeroRenderer({ data }) {
  return (
    <section className="component_hero_section">
      <div className="component_hero_glow_top" />
      <div className="component_hero_glow_bottom_left" />
      <div className="component_hero_glow_bottom_right" />

      <div className="component_hero_content">
        {data.badge && (
          <div className="component_hero_badge">
            {data.badge}
          </div>
        )}

        <h1 className={`component_hero_headline ${data.headlineAccent ? 'with-accent' : ''}`}>
          {data.headline || 'Your headline here'}
        </h1>

        {data.headlineAccent && (
          <h1 className="component_hero_headline accent">
            {data.headlineAccent}
          </h1>
        )}

        {data.subtitle && (
          <p className="component_hero_subtitle">
            {data.subtitle}
          </p>
        )}

        <div className="component_hero_cta_container">
          {data.ctaText && (
            <a href={data.ctaHref || '#'} className="component_hero_cta_button">
              {data.ctaText}
            </a>
          )}
          {data.secondaryCtaText && (
            <a href={data.secondaryCtaHref || '#'} className="component_hero_cta_secondary">
              {data.secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
