import type { ExplanationBlock } from '../data/types';
import { EXPLANATION_LABELS } from '../lib/constants';
import { normalizeExplanation } from '../lib/contentHelpers';
import type { HandbookSection } from '../data/types';
import { MarkdownProse } from './MarkdownProse';
import { LocalizedLabel, LocalizedSplit } from './LocalizedSplit';

type ExplanationBlockProps = {
  block?: ExplanationBlock;
  section?: HandbookSection;
};

const FIELDS: (keyof ExplanationBlock)[] = [
  'summary',
  'what',
  'why',
  'how',
  'when',
  'analogy',
  'realWorld',
  'quickSummary',
];

function BilingualField({
  fieldKey,
  en,
  bn,
}: {
  fieldKey: keyof typeof EXPLANATION_LABELS;
  en: string;
  bn: string;
}) {
  const labels = EXPLANATION_LABELS[fieldKey as keyof typeof EXPLANATION_LABELS];
  if (!labels) return null;
  if (!en && !bn) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
        <LocalizedLabel en={labels.en} bn={labels.bn} className="text-handbook-h4 text-slate-800" />
      </div>
      <LocalizedSplit
        columns="side"
        className="p-5"
        en={
          en ? (
            <MarkdownProse content={en} lang="en" />
          ) : (
            <p className="text-slate-400 text-sm italic">—</p>
          )
        }
        bn={
          bn ? (
            <MarkdownProse content={bn} lang="bn" />
          ) : (
            <p className="text-slate-400 text-sm italic font-bengali">—</p>
          )
        }
      />
    </div>
  );
}

export function ExplanationBlockView({ block, section }: ExplanationBlockProps) {
  const explanation = block ?? (section ? normalizeExplanation(section) : undefined);
  if (!explanation) return null;

  const hasStructured = FIELDS.some(
    (f) => f !== 'summary' && explanation[f]?.en
  );

  if (!hasStructured && explanation.summary) {
    return (
      <BilingualField
        fieldKey="summary"
        en={explanation.summary.en}
        bn={explanation.summary.bn}
      />
    );
  }

  return (
    <div className="space-y-5">
      {FIELDS.map((field) => {
        const value = explanation[field];
        if (!value?.en && !value?.bn) return null;
        const labelKey =
          field === 'summary' ? 'summary' : field === 'realWorld' ? 'realWorld' : field;
        if (!(labelKey in EXPLANATION_LABELS)) return null;
        return (
          <BilingualField
            key={field}
            fieldKey={labelKey as keyof typeof EXPLANATION_LABELS}
            en={value.en}
            bn={value.bn}
          />
        );
      })}
    </div>
  );
}
