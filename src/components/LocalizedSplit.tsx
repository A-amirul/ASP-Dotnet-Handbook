import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

type LocalizedSplitProps = {
  en?: ReactNode;
  bn?: ReactNode;
  className?: string;
  enClassName?: string;
  bnClassName?: string;
  /** When both: single column stack on small screens, two cols on lg */
  columns?: 'auto' | 'stack' | 'side';
};

export function LocalizedSplit({
  en,
  bn,
  className,
  enClassName,
  bnClassName,
  columns = 'auto',
}: LocalizedSplitProps) {
  const { showEn, showBn, mode } = useLanguage();

  if (!showEn && !showBn) return null;
  if (showEn && !showBn) {
    return en ? (
      <div className={cn(className, enClassName)} lang="en">
        {en}
      </div>
    ) : null;
  }
  if (showBn && !showEn) {
    return bn ? (
      <div className={cn(className, bnClassName, 'font-bengali')} lang="bn">
        {bn}
      </div>
    ) : null;
  }

  const gridClass =
    columns === 'stack'
      ? 'flex flex-col gap-4'
      : columns === 'side'
        ? 'grid grid-cols-1 md:grid-cols-2 gap-4 w-full'
        : mode === 'both'
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 w-full'
          : 'flex flex-col gap-4 w-full';

  return (
    <div className={cn(gridClass, className)}>
      {en && (
        <div className={cn(enClassName, 'p-0 lg:p-0')} lang="en">
          {en}
        </div>
      )}
      {bn && (
        <div
          className={cn(
            bnClassName,
            'font-bengali',
            mode === 'both' && 'md:pl-4 md:bg-indigo-50/20 md:rounded-lg md:p-4'
          )}
          lang="bn"
        >
          {bn}
        </div>
      )}
    </div>
  );
}

type LocalizedLabelProps = {
  en: string;
  bn: string;
  className?: string;
};

export function LocalizedLabel({ en, bn, className }: LocalizedLabelProps) {
  const { showEn, showBn } = useLanguage();

  if (showEn && showBn) {
    return (
      <span className={className}>
        {en}
        <span className="text-slate-300 mx-2">|</span>
        <span lang="bn" className="font-bengali text-indigo-700">
          {bn}
        </span>
      </span>
    );
  }
  if (showBn) {
    return (
      <span lang="bn" className={cn(className, 'font-bengali text-indigo-700')}>
        {bn}
      </span>
    );
  }
  return <span className={className}>{en}</span>;
}
