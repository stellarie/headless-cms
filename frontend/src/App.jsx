import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ComponentsPage from './pages/ComponentsPage';
import ComponentEditorPage from './pages/ComponentEditorPage';
import ContentPage from './pages/ContentPage';
import PagesPage from './pages/PagesPage';
import PageBuilderPage from './pages/PageBuilderPage';
import PagePreviewPage from './pages/PagePreviewPage';
import './App.css';

function CMSShell() {
  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">&#9670;</span>
          <h1>stellacreate</h1>
        </div>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Components
        </NavLink>
        <NavLink to="/pages" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Pages
        </NavLink>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ComponentsPage />} />
          <Route path="/components/new" element={<ComponentEditorPage />} />
          <Route path="/components/:id/edit" element={<ComponentEditorPage />} />
          <Route path="/components/:id/content" element={<ContentPage />} />
          <Route path="/pages" element={<PagesPage />} />
          <Route path="/pages/new" element={<PageBuilderPage />} />
          <Route path="/pages/:id/edit" element={<PageBuilderPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-page preview — no CMS chrome */}
        <Route path="/pages/:id/preview" element={<PagePreviewPage />} />
        {/* Everything else gets the sidebar shell */}
        <Route path="/*" element={<CMSShell />} />
      </Routes>
    </BrowserRouter>
  );
}
