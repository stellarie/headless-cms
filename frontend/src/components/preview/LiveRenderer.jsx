import { useState, useEffect, useRef } from 'react';

/**
 * Compiles and renders a JSX string live using @babel/standalone (loaded via window.Babel).
 *
 * The JSX source has access to:
 *   - React and hooks (useState, useEffect, useRef, useMemo, useCallback)
 *   - `data` prop — the current content entry data
 *
 * Example source:
 *   export default function MyComp({ data }) {
 *     return <div style={{ background: data.styles?.bg }}>{data.title}</div>
 *   }
 */
export default function LiveRenderer({ source, data }) {
  const [Comp, setComp] = useState(null);
  const [error, setError] = useState(null);
  const compiled = useRef(null);

  useEffect(() => {
    compile(source);
  }, [source]);

  function compile(src) {
    if (!src?.trim()) { setComp(null); setError(null); return; }

    const Babel = window.Babel;
    if (!Babel) {
      setError('Babel compiler not loaded yet — try again in a moment.');
      return;
    }

    try {
      const { code } = Babel.transform(src, {
        presets: ['react'],
        filename: 'component.jsx',
      });

      // Build a factory function with React in scope.
      // eslint-disable-next-line no-new-func
      const factory = new Function(
        'React', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
        `const exports = {}; ${code}; return exports.default ?? null;`
      );

      const result = factory(
        React,
        React.useState,
        React.useEffect,
        React.useRef,
        React.useMemo,
        React.useCallback,
      );

      if (typeof result !== 'function') {
        setError('Make sure to export a default function component.');
        setComp(null);
      } else {
        setError(null);
        setComp(() => result);
      }
    } catch (e) {
      setError(e.message);
      setComp(null);
    }
  }

  if (error) {
    return (
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap' }}>
        {error}
      </div>
    );
  }

  if (!Comp) {
    return (
      <div style={{ opacity: 0.4, fontSize: '13px', fontStyle: 'italic', padding: '16px' }}>
        Write a component to see the preview...
      </div>
    );
  }

  try {
    return <Comp data={data || {}} />;
  } catch (e) {
    return (
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '6px', fontSize: '13px' }}>
        Runtime error: {e.message}
      </div>
    );
  }
}
