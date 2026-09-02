import { cn } from '../lib/utils';
import { DIFFICULTY_LABEL } from '../lib/constants';

type ChapterHeaderProps = {
  title: string;
  sectionNumber?: string;
  difficulty?: string;
  moduleLabel?: string;
};

export function ChapterHeader({
  title,
  sectionNumber,
  difficulty,
  moduleLabel,
}: ChapterHeaderProps) {
  const badge = difficulty ? DIFFICULTY_LABEL[difficulty] : undefined;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3 mb-6">
      <h3 className="text-handbook-h2 text-slate-900 flex items-center gap-3 leading-snug">
        <span className="w-3 h-3 bg-brand-cyan rounded-full border border-indigo-200 shrink-0" />
        {sectionNumber && (
          <span className="text-brand-cyan font-mono text-base shrink-0">{sectionNumber}</span>
        )}
        {title}
      </h3>
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border',
              badge.className
            )}
          >
            {badge.label}
          </span>
        )}
        {moduleLabel && (
          <span className="text-xs text-brand-cyan font-bold font-mono bg-brand-cyan-subtle px-3 py-1 rounded">
            {moduleLabel}
          </span>
        )}
      </div>
    </div>
  );
}
