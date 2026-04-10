import { useState } from 'react';
import './styles.css';

export const description = 'A frequently asked questions accordion with expandable items.';

export const schema = {
  label: 'string (optional)',
  heading: 'string',
  items: [{ question: 'string', answer: 'string' }],
};

export const defaultData = {
  label: 'FAQ',
  heading: 'Frequently asked questions',
  items: [
    { question: 'What is a headless CMS?', answer: 'A headless CMS manages and delivers content without being tied to a specific frontend. You build your pages visually, and the content is served via API to any frontend — React, Vue, mobile apps, and more.' },
    { question: 'Can I use my own components?', answer: 'Yes! Drop a new component folder under packages/components/src/ and it auto-registers. The CMS detects it via import.meta.glob on the next hot-reload.' },
    { question: 'How does the live preview work?', answer: 'The page builder renders your actual React components in real time. As you edit the JSON data in the modal, the preview updates instantly — no save required.' },
    { question: 'What about the Groovy hooks?', answer: 'Each component can have lifecycle hooks written in Groovy: BEFORE_SAVE, AFTER_SAVE, BEFORE_FETCH, AFTER_FETCH, and ON_REQUEST. They run server-side on the JVM and let you transform data, validate, or call external APIs.' },
  ],
};

export default function FAQRenderer({ data }) {
  const [open, setOpen] = useState(null);
  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <section className="component_faq_section">
      <div className="component_faq_glow" />

      <div className="component_faq_container">
        {data.label && (
          <p className="component_faq_label">
            {data.label}
          </p>
        )}

        {data.heading && (
          <h2 className="component_faq_heading">
            {data.heading}
          </h2>
        )}

        {items.length === 0 && <p className="component_faq_empty">No FAQ items yet.</p>}

        <div className="component_faq_items">
          {items.map((item, i) => (
            <div
              key={i}
              className={`component_faq_item ${open === i ? 'open' : ''}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="component_faq_button"
              >
                <span className="component_faq_question">
                  {item.question || 'Question'}
                </span>
                <span className="component_faq_icon">
                  +
                </span>
              </button>

              {open === i && (
                <div className="component_faq_answer_container">
                  <p className="component_faq_answer">
                    {item.answer || 'Answer'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
