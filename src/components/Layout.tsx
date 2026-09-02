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
    <div className="h-[100dvh] flex overflow-hidden bg-brand-bg w-full max-w-[100vw]">
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full w-full">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50 w-full">
          <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6 md:py-6 lg:py-8">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </div>

          <footer className="px-3 sm:px-4 md:px-6 py-6 sm:py-8 border-t border-slate-100 bg-white w-full">
            <div className={`${CONTENT_MAX_WIDTH} text-center sm:text-left`}>
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
