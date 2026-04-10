import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const COMPONENTS_SRC = path.resolve(__dirname, '../packages/components/src')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'watch-external-components',
      configureServer(server) {
        // Watch the components directory outside the Vite root
        server.watcher.add(COMPONENTS_SRC)

        server.watcher.on('add', file => {
          if (file.startsWith(COMPONENTS_SRC) && file.endsWith('index.jsx')) {
            console.log(`[cms] New component detected: ${path.basename(path.dirname(file))}`)

            // Invalidate registry so glob re-runs with the new file
            server.moduleGraph.getModulesByFile(
              path.resolve(__dirname, 'src/registry.js')
            )?.forEach(mod => server.moduleGraph.invalidateModule(mod))

            // Full reload → re-runs main.jsx sync → backend gets the new component
            server.ws.send({ type: 'full-reload' })
          }
        })
      },
    },
  ],
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
