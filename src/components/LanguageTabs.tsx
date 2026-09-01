import type { ReactNode } from 'react';
import { useId } from 'react';
import { Globe2, Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage, type LanguageMode } from '../context/LanguageContext';

type TabConfig = {
  id: LanguageMode;
  label: string;
  mobileLabel: ReactNode;
  ariaLabel: string;
  desktopIcon?: ReactNode;
};

const TABS: TabConfig[] = [
  {
    id: 'en',
    label: 'English',
    mobileLabel: <Globe2 size={15} strokeWidth={2.25} aria-hidden />,
    ariaLabel: 'Show English content only',
    desktopIcon: <Globe2 size={14} strokeWidth={2.25} className="shrink-0" />,
  },
  {
    id: 'bn',
    label: 'বাংলা',
    mobileLabel: 'বাং',
    ariaLabel: 'Show Bangla content only',
  },
  {
    id: 'both',
    label: 'Both',
    mobileLabel: <Languages size={15} strokeWidth={2.25} aria-hidden />,
    ariaLabel: 'Show English and Bangla side by side',
    desktopIcon: <Languages size={14} strokeWidth={2.25} className="shrink-0" />,
  },
];

type LanguageTabsProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'onDark';
};

export function LanguageTabs({
  className,
  size = 'md',
  variant = 'default',
}: LanguageTabsProps) {
  const { mode, setMode } = useLanguage();
  const isDark = variant === 'onDark';
  const instanceId = useId().replace(/:/g, '');

  const sizeStyles = {
    sm: {
      wrap: 'p-0.5 gap-0.5 rounded-xl',
      btn: 'min-h-[34px] min-w-[40px] sm:min-w-0 px-2.5 sm:px-3 py-1.5 text-xs gap-1.5 rounded-[10px]',
    },
    md: {
      wrap: 'p-1 gap-1 rounded-xl',
      btn: 'min-h-[38px] min-w-[44px] sm:min-w-0 px-3 sm:px-3.5 py-2 text-xs sm:text-sm gap-1.5 rounded-lg',
    },
    lg: {
      wrap: 'p-1 gap-1 rounded-2xl',
      btn: 'min-h-[42px] min-w-[48px] sm:min-w-0 px-3 sm:px-4 py-2.5 text-sm gap-2 rounded-xl',
    },
  }[size];

  return (
    <div
      className={cn(
        'inline-flex items-stretch w-full sm:w-auto',
        sizeStyles.wrap,
        isDark
          ? 'bg-white/10 border border-white/20 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-slate-100/90 border border-slate-200 shadow-sm backdrop-blur-sm',
        className
      )}
      role="tablist"
      aria-label="Content language"
    >
      {TABS.map((tab) => {
        const active = mode === tab.id;
        const isBn = tab.id === 'bn';

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={tab.ariaLabel}
            onClick={() => setMode(tab.id)}
            className={cn(
              'relative isolate overflow-hidden flex-1 sm:flex-none inline-flex items-center justify-center font-semibold',
              'transition-colors duration-200 touch-manipulation select-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
              isDark && 'focus-visible:ring-offset-slate-800',
              sizeStyles.btn,
              isBn && 'font-bengali',
              active
                ? cn(
                    'text-white',
                    isDark
                      ? 'bg-white/35 ring-1 ring-white/25'
                      : 'bg-brand-cyan ring-1 ring-teal-600/30 shadow-md shadow-teal-600/20'
                  )
                : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            )}
          >
            {active && (
              <motion.span
                layoutId={`lang-tab-indicator-${instanceId}`}
                className={cn(
                  'absolute inset-0 -z-10 rounded-[inherit] pointer-events-none',
                  isDark ? 'bg-white/20' : 'bg-brand-cyan'
                )}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <span
              className={cn(
                'sm:hidden flex items-center justify-center',
                active && 'text-white [&_svg]:text-white'
              )}
            >
              {typeof tab.mobileLabel === 'string' ? (
                <span className={cn(isBn ? 'text-sm' : 'text-[11px] font-bold tracking-wide')}>
                  {tab.mobileLabel}
                </span>
              ) : (
                tab.mobileLabel
              )}
            </span>

            <span
              className={cn(
                'hidden sm:inline-flex items-center justify-center gap-1.5 whitespace-nowrap',
                active && 'text-white [&_svg]:text-white'
              )}
            >
              {tab.desktopIcon}
              <span className={cn(isBn && 'text-[13px]')}>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
