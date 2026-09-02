import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { handbookData } from '../data';
import { NAV_GROUPS } from '../data/types';

type SidebarProps = {
  isOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

export function Sidebar({ isOpen, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const byId = Object.fromEntries(handbookData.map((item) => [item.id, item]));
  const groupedIds = new Set(NAV_GROUPS.flatMap((g) => g.ids));
  const ungrouped = handbookData.filter((item) => !groupedIds.has(item.id));

  const NavLink = ({ id, title, index }: { id: string; title: string; index: string }) => {
    const path = id === 'home' ? '/' : `/${id}`;
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        onClick={() => {
          if (window.innerWidth < 1024) onClose();
        }}
        title={title}
        className={cn(
          'flex items-center gap-2 px-3 py-2 transition-all text-sm font-medium rounded-lg',
          active
            ? 'bg-brand-cyan-subtle text-brand-cyan shadow-sm'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          collapsed && 'justify-center px-2'
        )}
      >
        <span
          className={cn(
            'text-[10px] font-mono w-5 shrink-0',
            active ? 'text-brand-cyan' : 'opacity-40',
            collapsed && 'w-auto'
          )}
        >
          {collapsed ? index.slice(-2) : index}
        </span>
        {!collapsed && <span className="flex-1 leading-snug truncate">{title}</span>}
      </Link>
    );
  };

  let counter = 0;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 bg-brand-sidebar flex flex-col border-r border-slate-200 transform transition-all duration-300 lg:translate-x-0 h-full shadow-xl lg:shadow-sm',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn(
              'flex border-b border-slate-100 bg-slate-subtle shrink-0',
              collapsed
                ? 'flex-col items-center gap-1 p-2'
                : 'items-center gap-2 justify-between p-3 pl-4 pr-2'
            )}
          >
            {!collapsed ? (
              <Link to="/" className="min-w-0 flex-1 text-left">
                <span className="font-bold text-brand-cyan text-lg tracking-tight block truncate">
                  .NET Handbook
                </span>
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mt-0.5 truncate">
                  Developer Learning Guide
                </p>
              </Link>
            ) : (
              <Link
                to="/"
                className="font-bold text-brand-cyan text-xs shrink-0"
                title=".NET Handbook"
              >
                .NET
              </Link>
            )}

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center p-2 text-slate-500 hover:text-brand-cyan hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-3 custom-scrollbar">
            <NavLink id="home" title="Cover & Roadmap" index="00" />
            <NavLink id="toc" title="Table of Contents" index="—" />
            {!collapsed &&
              NAV_GROUPS.map((group) => {
                const items = group.ids.map((id) => byId[id]).filter(Boolean);
                if (!items.length) return null;
                return (
                  <div key={group.title}>
                    <div className="px-3 mb-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                      {group.title}
                    </div>
                    <div className="space-y-0.5">
                      {items.map((item) => {
                        counter += 1;
                        return (
                          <NavLink
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            index={counter.toString().padStart(2, '0')}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            {!collapsed && ungrouped.length > 0 && (
              <div>
                <div className="px-3 mb-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                  More
                </div>
                {ungrouped.map((item) => {
                  counter += 1;
                  return (
                    <NavLink
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      index={counter.toString().padStart(2, '0')}
                    />
                  );
                })}
              </div>
            )}
          </nav>

          <div className="p-3 border-t border-slate-100 shrink-0">
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-widest text-center text-slate-400 font-bold">
                Ver 4.0 | Bilingual
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
