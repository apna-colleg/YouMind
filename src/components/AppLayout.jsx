import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import { PanelLeft } from 'lucide-react';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <CommandPalette />
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      <main className="main-content" style={{ position: 'relative' }}>
        {!sidebarOpen && (
          <button
            className="btn-icon sidebar-expand-toggle"
            onClick={toggleSidebar}
            title="Open sidebar"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 10,
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
            }}
          >
            <PanelLeft size={18} />
          </button>
        )}
        <Outlet context={{ toggleSidebar, sidebarOpen }} />
      </main>
    </div>
  );
}
