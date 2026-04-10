/**
 * Auto-discovers all components from packages/components/src/
 * via Vite's import.meta.glob. Adding a new folder there
 * automatically registers it here — no manual changes needed.
 */
const modules = import.meta.glob(
  '../../packages/components/src/*/index.jsx',
  { eager: true }
);

const COMPONENTS = {};

for (const [path, mod] of Object.entries(modules)) {
  // Extract component name from path: .../src/Hero/index.jsx → "Hero"
  const name = path.split('/').at(-2);
  COMPONENTS[name] = {
    Renderer: mod.default,
    schema: mod.schema || {},
    description: mod.description || '',
    defaultData: mod.defaultData || {},
  };
}

export default COMPONENTS;

/** Returns just the { name, description, schema, defaultData } list for syncing to backend */
export function getComponentManifest() {
  return Object.entries(COMPONENTS).map(([name, c]) => ({
    name,
    description: c.description,
    schema: JSON.stringify(c.schema, null, 2),
    defaultData: JSON.stringify(c.defaultData, null, 2),
  }));
}
