import { cn } from '../lib/utils';
import type { HandbookSection } from '../data/types';
import {
  isLocalizedText,
  normalizeBilingualItems,
  normalizeDetails,
  sectionDisplayNumber,
  sectionSlug,
} from '../lib/contentHelpers';
import { applyBilingualPatch } from '../data/bilingualPatches';
import { ChapterHeader } from './ChapterHeader';
import { ExplanationBlockView } from './ExplanationBlock';
import { DiagramBlock } from './DiagramBlock';
import { ComparisonTable } from './ComparisonTable';
import { BilingualDetails, BilingualListCallout, CalloutBox } from './BilingualCallout';
import { CodeBlock } from './CodeBlock';
import { InterviewSection } from './InterviewSection';

type SectionCardProps = {
  section: HandbookSection;
  index: number;
  moduleChapter: number;
};

export function SectionCard({
  section: rawSection,
  index,
  moduleChapter,
}: SectionCardProps) {
  const section = applyBilingualPatch(rawSection, index);
  const id = sectionSlug(section, index);
  const title = section.topic ?? section.title ?? 'Untitled';
  const sectionNumber = sectionDisplayNumber(moduleChapter, index, section);
  const details = normalizeDetails(section);
  const mistakes = normalizeBilingualItems(section.commonMistakes);
  const practices = normalizeBilingualItems(section.bestPractices ?? section.tips);
  const isSplit = section.layout === 'split';
  const hasCode = Boolean(section.code || section.sql || section.subsections?.length);

  const codeBlock = section.code ? (
    <CodeBlock
      code={section.code}
      language="csharp"
      explanation={
        section.codeExplanation
          ? isLocalizedText(section.codeExplanation)
            ? section.codeExplanation
            : { en: section.codeExplanation, bn: '' }
          : undefined
      }
    />
  ) : section.sql ? (
    <CodeBlock code={section.sql} language="sql" title="SQL / Database" />
  ) : section.subsections?.length ? (
    <div className="space-y-4">
      {section.subsections.map((sub, si) => (
        <CodeBlock key={si} code={sub.code} title={sub.title} language="csharp" />
      ))}
    </div>
  ) : null;

  return (
    <section
      id={id}
      className="scroll-mt-24 bg-white p-5 sm:p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm"
    >
      <ChapterHeader
        title={title}
        sectionNumber={sectionNumber}
        difficulty={section.difficulty}
        moduleLabel={`Section ${String(index + 1).padStart(2, '0')}`}
      />

      <article className="handbook-section space-y-8">
        <ExplanationBlockView section={section} />

        {section.diagram && <DiagramBlock diagram={section.diagram} />}

        {details && <BilingualDetails details={details} />}

        {section.comparisonTable && (
          <ComparisonTable
            table={
              isLocalizedText(section.comparisonTable)
                ? section.comparisonTable
                : { en: section.comparisonTable, bn: '' }
            }
          />
        )}

        {section.callouts?.map((callout, ci) => (
          <CalloutBox key={ci} callout={callout} />
        ))}

        {hasCode && (
          <div
            className={cn(
              isSplit && section.code
                ? 'grid lg:grid-cols-2 gap-6 items-start'
                : 'w-full'
            )}
          >
            {codeBlock}
          </div>
        )}

        {(mistakes.length > 0 || practices.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6">
            {mistakes.length > 0 && <BilingualListCallout type="mistake" items={mistakes} />}
            {practices.length > 0 && <BilingualListCallout type="tip" items={practices} />}
          </div>
        )}

        <InterviewSection interviewQs={section.interviewQs} practice={section.practice} />
      </article>
    </section>
  );
}
