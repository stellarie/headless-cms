import COMPONENTS from '../../registry';
import LiveRenderer from './LiveRenderer';

export default function PreviewPanel({ componentName, dataJson, rendererSource }) {
  let data = {};
  let parseError = null;

  try {
    data = dataJson ? JSON.parse(dataJson) : {};
  } catch (e) {
    parseError = e.message;
  }

  const registered = COMPONENTS[componentName];
  const Renderer = registered?.Renderer;
  const hasLiveSource = rendererSource?.trim();

  const label = hasLiveSource
    ? `✎ live source — ${componentName}`
    : Renderer
      ? `● ${componentName}`
      : '○ Custom Component';

  const labelColor = hasLiveSource
    ? 'var(--warning)'
    : Renderer
      ? 'var(--success)'
      : 'var(--text-muted)';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{
        padding: '10px 14px',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span>Live Preview</span>
        <span style={{ color: labelColor, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
          {label}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px', background: '#f0f2f8', minHeight: 0 }}>
        {parseError ? (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', fontFamily: 'var(--mono)' }}>
            Invalid JSON: {parseError}
          </div>
        ) : hasLiveSource ? (
          <LiveRenderer source={rendererSource} data={data} />
        ) : Renderer ? (
          <Renderer data={data} />
        ) : (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', fontFamily: 'Inter, system-ui, sans-serif', color: '#1a1a2e' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.4, marginBottom: '16px' }}>
              Custom Component — {componentName}
            </p>
            <pre style={{ fontFamily: 'var(--mono)', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#334155', margin: 0 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
