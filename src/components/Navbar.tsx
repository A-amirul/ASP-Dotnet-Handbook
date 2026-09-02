import { Link } from 'react-router-dom';
import { BookOpen, Menu, Terminal } from 'lucide-react';
import { LanguageTabs } from './LanguageTabs';

type NavbarProps = {
  onMenuClick: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-40 shrink-0 gap-2 sm:gap-3 w-full min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-brand-cyan hover:bg-teal-50 rounded-lg shrink-0"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2 text-brand-cyan text-xs sm:text-sm font-bold min-w-0">
          <Terminal size={16} className="shrink-0 hidden sm:block" />
          <span className="truncate">
            <span className="lg:hidden">.NET Handbook</span>
            <span className="hidden lg:inline">.NET Developer Handbook</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 max-w-[55%] sm:max-w-none">
        <LanguageTabs size="sm" className="shrink min-w-0" />
        <Link
          to="/toc"
          className="h-9 w-9 sm:w-auto sm:px-3 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 border border-slate-200 shrink-0"
          title="Table of contents"
        >
          <BookOpen size={14} />
          <span className="hidden sm:inline">Contents</span>
        </Link>
      </div>
    </nav>
  );
}
