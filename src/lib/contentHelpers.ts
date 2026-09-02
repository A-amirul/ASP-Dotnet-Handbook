import type {
  BilingualItem,
  ExplanationBlock,
  HandbookSection,
  InterviewQ,
  LocalizedText,
} from '../data/types';
import {
  enrichInterviewAnswer,
  enrichInterviewFollowUp,
} from './interviewAnswerFormatter';

export function isLocalizedText(v: unknown): v is LocalizedText {
  return (
    typeof v === 'object' &&
    v !== null &&
    'en' in v &&
    'bn' in v &&
    typeof (v as LocalizedText).en === 'string' &&
    typeof (v as LocalizedText).bn === 'string'
  );
}

export function toLocalizedText(
  en: string | undefined,
  bn: string | undefined
): LocalizedText | undefined {
  if (!en && !bn) return undefined;
  return { en: en ?? '', bn: bn ?? '' };
}

export function normalizeExplanation(section: HandbookSection): ExplanationBlock | undefined {
  if (section.explanation) return section.explanation;

  const en = section.english ?? section.content;
  const bn = section.bangla;
  if (!en && !bn) return undefined;

  return {
    summary: toLocalizedText(en, bn),
  };
}

export function normalizeDetails(section: HandbookSection): LocalizedText | undefined {
  if (!section.details) return undefined;
  if (isLocalizedText(section.details)) return section.details;
  return { en: section.details, bn: section.bangla ?? '' };
}

export function normalizeBilingualItems(
  items: (string | BilingualItem)[] | undefined
): BilingualItem[] {
  if (!items?.length) return [];
  return items.map((item) =>
    typeof item === 'string' ? { en: item, bn: '' } : item
  );
}

export function normalizeInterviewQ(item: string | InterviewQ): {
  q: LocalizedText;
  a: LocalizedText;
  followUp?: LocalizedText;
  difficulty?: InterviewQ['difficulty'];
} {
  if (typeof item === 'string') {
    return { q: { en: item, bn: '' }, a: { en: '', bn: '' } };
  }

  const q =
    typeof item.q === 'string' ? { en: item.q, bn: '' } : item.q;

  const rawAEn =
    typeof item.a === 'string'
      ? item.a
      : isLocalizedText(item.a)
        ? item.a.en
        : '';
  const rawABn =
    typeof item.a === 'string'
      ? item.bangla ?? ''
      : isLocalizedText(item.a)
        ? item.a.bn || item.bangla || ''
        : item.bangla ?? '';

  const enriched = enrichInterviewAnswer(q.en, rawAEn, rawABn);
  const a = enriched;

  const rawFollowUpEn =
    item.followUp === undefined
      ? ''
      : typeof item.followUp === 'string'
        ? item.followUp
        : isLocalizedText(item.followUp)
          ? item.followUp.en
          : '';

  const rawFollowUpBn =
    item.followUp === undefined
      ? ''
      : typeof item.followUp === 'object' && isLocalizedText(item.followUp)
        ? item.followUp.bn
        : '';

  const followUp = enrichInterviewFollowUp(q.en, rawFollowUpEn, rawFollowUpBn);

  return { q, a, followUp, difficulty: item.difficulty };
}

export function sectionSlug(section: HandbookSection, index: number): string {
  if (section.id) return section.id;
  const title = section.topic ?? section.title ?? `section-${index}`;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function sectionDisplayNumber(
  moduleChapter: number,
  sectionIndex: number,
  section?: HandbookSection
): string {
  return section?.sectionNumber ?? `${moduleChapter}.${sectionIndex + 1}`;
}
