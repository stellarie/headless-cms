import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getComponentManifest } from './registry.js'
import axios from 'axios'

// Sync codebase-defined components to the backend on startup.
// Any component found via import.meta.glob that doesn't exist in the DB gets seeded.
axios.post('http://localhost:8080/api/components/sync', {
  components: getComponentManifest(),
}).catch(err => console.warn('Component sync failed:', err.message))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
