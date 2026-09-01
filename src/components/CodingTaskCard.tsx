import { cn } from '../lib/utils';
import type { HandbookSection } from '../data/types';
import { CodeBlock } from './CodeBlock';
import { ExplanationBlockView } from './ExplanationBlock';
import { MarkdownProse } from './MarkdownProse';
import { LocalizedLabel, LocalizedSplit } from './LocalizedSplit';
import { BilingualListCallout } from './BilingualCallout';
import { normalizeBilingualItems } from '../lib/contentHelpers';

type CodingTaskCardProps = {
  taskIndex: number;
  title: string;
  patched: HandbookSection;
  code?: string;
};

function ClarityPanel({
  labelEn,
  labelBn,
  content,
  variant,
}: {
  labelEn: string;
  labelBn: string;
  content?: { en: string; bn: string };
  variant: 'problem' | 'example' | 'approach' | 'solution' | 'complexity';
}) {
  if (!content?.en && !content?.bn) return null;

  const styles = {
    problem: 'bg-amber-50 border-amber-200 border-l-amber-500',
    example: 'bg-sky-50 border-sky-200 border-l-sky-500',
    approach: 'bg-violet-50 border-violet-200 border-l-violet-500',
    solution: 'bg-emerald-50 border-emerald-200 border-l-emerald-500',
    complexity: 'bg-slate-100 border-slate-300 border-l-slate-600',
  }[variant];

  return (
    <div className={cn('rounded-xl border border-l-4 p-5', styles)}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">
        <LocalizedLabel en={labelEn} bn={labelBn} />
      </p>
      <LocalizedSplit
        columns="side"
        en={
          content.en ? (
            <MarkdownProse content={content.en} lang="en" className="text-sm" />
          ) : undefined
        }
        bn={
          content.bn ? (
            <MarkdownProse content={content.bn} lang="bn" className="text-sm" />
          ) : undefined
        }
      />
    </div>
  );
}

export function CodingTaskCard({ taskIndex, title, patched, code }: CodingTaskCardProps) {
  const mistakes = normalizeBilingualItems(patched.commonMistakes);
  const practices = normalizeBilingualItems(patched.bestPractices);

  const hasClarity =
    patched.problem?.en ||
    patched.problem?.bn ||
    patched.example?.en ||
    patched.solution?.en;

  return (
    <section className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h3 className="text-handbook-h2 text-slate-900">{title}</h3>
        <span className="text-xs font-mono text-slate-400 shrink-0">
          Task {String(taskIndex + 1).padStart(2, '0')}
        </span>
      </div>

      {hasClarity ? (
        <div className="space-y-4">
          <ClarityPanel
            variant="problem"
            labelEn="Problem (what to solve)"
            labelBn="প্রশ্ন (কী solve করতে হবে)"
            content={patched.problem}
          />
          <ClarityPanel
            variant="example"
            labelEn="Example (input → output)"
            labelBn="উদাহরণ (input → output)"
            content={patched.example}
          />
          <ClarityPanel
            variant="approach"
            labelEn="Approach (pattern & idea)"
            labelBn="Approach (pattern ও idea)"
            content={patched.approach}
          />
          <ClarityPanel
            variant="solution"
            labelEn="Solution (step-by-step)"
            labelBn="সমাধান (step-by-step)"
            content={patched.solution}
          />
          <ClarityPanel
            variant="complexity"
            labelEn="Complexity"
            labelBn="Complexity"
            content={patched.complexity}
          />
        </div>
      ) : (
        <ExplanationBlockView block={patched.explanation} section={patched} />
      )}

      {!hasClarity && patched.explanation && (
        <details className="rounded-lg border border-slate-200 bg-slate-50/50">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">
            <LocalizedLabel en="More explanation" bn="আরও ব্যাখ্যা" />
          </summary>
          <div className="px-4 pb-4">
            <ExplanationBlockView block={patched.explanation} />
          </div>
        </details>
      )}

      {hasClarity && patched.explanation && (
        <details className="rounded-lg border border-slate-200">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-brand-cyan">
            <LocalizedLabel en="Why this pattern? (analogy & tips)" bn="কেন এই pattern? (analogy ও tips)" />
          </summary>
          <div className="px-4 pb-4 border-t border-slate-100">
            <ExplanationBlockView block={patched.explanation} />
          </div>
        </details>
      )}

      {code && (
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            <LocalizedLabel en="C# solution code" bn="C# solution code" />
          </p>
          <CodeBlock code={code} title="Solution" />
        </div>
      )}

      {mistakes.length > 0 && <BilingualListCallout type="mistake" items={mistakes} />}
      {practices.length > 0 && <BilingualListCallout type="tip" items={practices} />}
    </section>
  );
}
