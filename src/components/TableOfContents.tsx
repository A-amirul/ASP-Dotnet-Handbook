import { cn } from '../lib/utils';
import type { HandbookSection } from '../data/types';
import { sectionSlug } from '../lib/contentHelpers';

type TocEntry = {
  id: string;
  title: string;
  number: string;
};

type TableOfContentsProps = {
  sections: HandbookSection[];
  moduleChapter: number;
  activeId?: string;
  className?: string;
};

export function TableOfContents({
  sections,
  moduleChapter,
  activeId,
  className,
}: TableOfContentsProps) {
  const entries: TocEntry[] = sections.map((section, idx) => ({
    id: sectionSlug(section, idx),
    title: section.topic ?? section.title ?? `Section ${idx + 1}`,
    number: section.sectionNumber ?? `${moduleChapter}.${idx + 1}`,
  }));

  if (!entries.length) return null;

  return (
    <nav
      className={cn(
        'hidden xl:block sticky top-24 self-start w-56 shrink-0',
        className
      )}
      aria-label="Table of contents"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
        On this page | এই অধ্যায়
      </p>
      <ul className="space-y-1 border-l border-slate-200">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={cn(
                'block pl-3 py-1.5 text-sm leading-snug border-l-2 -ml-px transition-colors',
                activeId === entry.id
                  ? 'border-brand-cyan text-brand-cyan font-semibold'
                  : 'border-transparent text-slate-600 hover:text-brand-cyan hover:border-slate-300'
              )}
            >
              <span className="font-mono text-[10px] text-slate-400 mr-1">{entry.number}</span>
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SectionNavLinks({
  prev,
  next,
}: {
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  if (!prev && !next) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 mt-6 border-t border-slate-100">
      {prev ? (
        <a
          href={prev.href}
          className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 hover:border-brand-cyan transition-colors max-w-md"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            ← Previous
          </span>
          <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-cyan">
            {prev.title}
          </span>
        </a>
      ) : (
        <div />
      )}
      {next ? (
        <a
          href={next.href}
          className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 hover:border-brand-cyan transition-colors max-w-md sm:text-right sm:ml-auto"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Next →
          </span>
          <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-cyan">
            {next.title}
          </span>
        </a>
      ) : null}
    </div>
  );
}
