import './styles.css';

export const description = 'A dark CTA banner or standalone text section with optional gradient headline and button.';

export const schema = {
  label: 'string (optional)',
  heading: 'string',
  headingGradient: 'boolean (renders heading with gradient if true)',
  body: 'string (optional)',
  ctaText: 'string (optional)',
  ctaHref: 'string (optional)',
  align: 'left | center',
};

export const defaultData = {
  label: 'Get started today',
  heading: "Ready to ship faster?",
  headingGradient: true,
  body: 'Join thousands of teams already building with our CMS. No credit card required.',
  ctaText: 'Start for free →',
  ctaHref: '#',
  align: 'center',
};

export default function TextRenderer({ data }) {
  const align = data.align || 'center';

  return (
    <section className={`component_text_section ${align}-align`}>
      <div className="component_text_glow" />

      <div className="component_text_box">
        {data.label && (
          <p className="component_text_label">
            {data.label}
          </p>
        )}

        {data.heading && (
          <h2 className={`component_text_heading ${data.headingGradient ? 'gradient' : 'plain'} ${data.body ? 'with-body' : 'no-body'}`}>
            {data.heading}
          </h2>
        )}

        {data.body && (
          <p className="component_text_body">
            {data.body}
          </p>
        )}

        {data.ctaText && (
          <a href={data.ctaHref || '#'} className="component_text_cta">
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
