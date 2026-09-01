import { Link } from 'react-router-dom';
import { BookOpen, Menu, Terminal } from 'lucide-react';
import { LanguageTabs } from './LanguageTabs';

type NavbarProps = {
  onMenuClick: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-brand-cyan hover:bg-teal-50 rounded-lg shrink-0"
        >
          <Menu size={22} />
        </button>
        <div className="hidden lg:flex items-center gap-2 text-brand-cyan text-sm font-bold truncate">
          <Terminal size={18} className="shrink-0" />
          <span className="truncate">.NET Developer Handbook</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <LanguageTabs size="sm" className="shrink-0" />
        <Link
          to="/toc"
          className="hidden sm:flex h-9 px-3 items-center gap-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 border border-slate-200"
        >
          <BookOpen size={14} />
          Contents
        </Link>
      </div>
    </nav>
  );
}
