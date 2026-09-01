import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { LanguageProvider } from '../context/LanguageContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CONTENT_MAX_WIDTH } from '../lib/constants';

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <LanguageProvider>
    <div className="h-screen flex overflow-hidden bg-brand-bg w-full">
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="px-4 py-6 md:px-6 lg:px-8 md:py-8">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </div>

          <footer className="px-6 py-8 border-t border-slate-100 bg-white">
            <div className={`${CONTENT_MAX_WIDTH} mx-auto text-center sm:text-left`}>
              <a
                href="https://amirul-islam-portfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-brand-cyan text-sm"
              >
                © Md Amirul Islam — .NET Handbook 2026
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
    </LanguageProvider>
  );
}
