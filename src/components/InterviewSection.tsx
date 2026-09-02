import { useState } from 'react';
import { ChevronRight, ListChecks, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { DIFFICULTY_LABEL } from '../lib/constants';
import { normalizeInterviewQ } from '../lib/contentHelpers';
import { hasLocalizedContent, pickLocalizedText } from '../lib/localizedText';
import type { InterviewQ, LocalizedText } from '../data/types';
import { MarkdownProse } from './MarkdownProse';
import { LocalizedLabel, LocalizedSplit } from './LocalizedSplit';
import { useLanguage } from '../context/LanguageContext';

function QuestionText({ q }: { q: LocalizedText }) {
  const { mode, showEn, showBn } = useLanguage();

  if (showEn && showBn) {
    return (
      <div className="space-y-1">
        {q.en && (
          <p lang="en" className="text-base text-slate-800 font-semibold leading-snug">
            {q.en}
          </p>
        )}
        {q.bn && (
          <p lang="bn" className="text-base text-indigo-800 font-bengali leading-snug">
            {q.bn}
          </p>
        )}
      </div>
    );
  }

  const picked = pickLocalizedText(q, mode, { fallback: true });
  if (!picked) return null;

  return (
    <p
      lang={picked.lang}
      className={cn(
        'text-base font-semibold leading-snug',
        picked.lang === 'en' ? 'text-slate-800' : 'text-indigo-800 font-bengali'
      )}
    >
      {picked.content}
    </p>
  );
}

function AnswerPanel({ a }: { a: LocalizedText }) {
  const { mode, showEn, showBn } = useLanguage();

  if (showEn && showBn) {
    return (
      <LocalizedSplit
        columns="side"
        en={
          a.en ? (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-2">
                Answer (English)
              </p>
              <MarkdownProse content={a.en} lang="en" />
            </div>
          ) : undefined
        }
        bn={
          a.bn ? (
            <div className="rounded-lg bg-indigo-50 border border-indigo-100 border-l-4 border-l-indigo-400 p-4">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 font-bengali">
                উত্তর (বাংলা)
              </p>
              <MarkdownProse content={a.bn} lang="bn" />
            </div>
          ) : undefined
        }
      />
    );
  }

  if (showBn) {
    const picked = pickLocalizedText(a, 'bn', { fallback: false });
    if (!picked?.content) {
      const enFallback = pickLocalizedText(a, 'en');
      if (!enFallback?.content) return null;
      return (
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 border-l-4 border-l-indigo-400 p-4">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 font-bengali">
            উত্তর (বাংলা)
          </p>
          <p className="text-sm text-indigo-600 font-bengali mb-2 italic">
            বাংলা উত্তর এখনো যোগ হয়নি — ইংরেজি উত্তর:
          </p>
          <MarkdownProse content={enFallback.content} lang="en" />
        </div>
      );
    }
    return (
      <div className="rounded-lg bg-indigo-50 border border-indigo-100 border-l-4 border-l-indigo-400 p-4">
        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 font-bengali">
          উত্তর (বাংলা)
        </p>
        <MarkdownProse content={picked.content} lang="bn" />
      </div>
    );
  }

  if (showEn && a.en) {
    return (
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
        <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-2">
          Answer (English)
        </p>
        <MarkdownProse content={a.en} lang="en" />
      </div>
    );
  }

  return null;
}

function InterviewQItem({
  q,
  a,
  followUp,
  difficulty,
}: {
  q: LocalizedText;
  a: LocalizedText;
  followUp?: LocalizedText;
  difficulty?: string;
}) {
  const [open, setOpen] = useState(false);
  const { mode, showEn, showBn } = useLanguage();
  const badge = difficulty ? DIFFICULTY_LABEL[difficulty] : undefined;

  const hasQuestion = hasLocalizedContent(q, showEn, showBn, true);
  const hasAnswer = hasLocalizedContent(a, showEn, showBn, false);

  if (!hasQuestion && !hasAnswer) return null;

  return (
    <li className={cn('rounded-lg transition-colors', open && 'bg-white shadow-sm border border-slate-100')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full text-left flex items-start gap-3 px-3 py-3 rounded-lg transition-colors',
          open ? 'bg-brand-cyan-subtle' : 'hover:bg-slate-50'
        )}
      >
        <span className="text-brand-cyan font-black shrink-0 text-xs">Q</span>
        <div className="flex-1 min-w-0">
          <QuestionText q={q} />
          {showBn && !showEn && q.en && !q.bn && (
            <p className="text-[10px] text-indigo-500 font-bengali mt-1">
              (প্রশ্ন ইংরেজিতে — ইন্টারভিউতে প্রায়ই ইংরেজিতেই জিজ্ঞেস করা হয়)
            </p>
          )}
        </div>
        {badge && (
          <span
            className={cn(
              'text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0',
              badge.className
            )}
          >
            {badge.label}
          </span>
        )}
        <ChevronRight
          size={14}
          className={cn(
            'shrink-0 mt-1 text-slate-400 transition-transform',
            open && 'rotate-90 text-brand-cyan'
          )}
        />
      </button>

      {open && hasAnswer && (
        <div className="px-3 pb-4 pt-1 space-y-3">
          <AnswerPanel a={a} />
          {(followUp?.en || followUp?.bn) && (
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2">
                <LocalizedLabel en="Follow-up" bn="ফলো-আপ" />
              </p>
              <LocalizedSplit
                columns="stack"
                en={
                  followUp.en ? (
                    <MarkdownProse content={followUp.en} lang="en" className="text-amber-900" />
                  ) : undefined
                }
                bn={
                  followUp.bn ? (
                    <MarkdownProse content={followUp.bn} lang="bn" className="text-amber-900" />
                  ) : showBn && !showEn && followUp.en ? (
                    <MarkdownProse content={followUp.en} lang="en" className="text-amber-900" />
                  ) : undefined
                }
              />
            </div>
          )}
        </div>
      )}
    </li>
  );
}

type InterviewSectionProps = {
  interviewQs?: (string | InterviewQ)[];
  practice?: string | LocalizedText;
};

export function InterviewSection({ interviewQs, practice }: InterviewSectionProps) {
  const { showEn, showBn, mode } = useLanguage();
  const hasQs = (interviewQs?.length ?? 0) > 0;
  const practiceText =
    typeof practice === 'string' ? { en: practice, bn: '' } : practice;

  const showPractice =
    (showEn && practiceText?.en) ||
    (showBn && (practiceText?.bn || practiceText?.en));

  const visibleQuestions =
    interviewQs?.filter((item) => {
      const n = normalizeInterviewQ(item);
      return hasLocalizedContent(n.q, showEn, showBn, true) || hasLocalizedContent(n.a, showEn, showBn, false);
    }) ?? [];

  const twoColumnLayout = visibleQuestions.length > 0 && showPractice;

  if (!visibleQuestions.length && !showPractice) return null;

  return (
    <div
      className={cn(
        'pt-6 sm:pt-8 border-t border-slate-100 w-full',
        twoColumnLayout ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6' : 'flex flex-col gap-4 sm:gap-6'
      )}
    >
      {visibleQuestions.length > 0 && (
        <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 w-full min-w-0">
          <h4 className="text-[11px] font-bold text-brand-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
            <Star size={14} className="fill-brand-cyan text-brand-cyan" />
            <LocalizedLabel en="Interview focus" bn="ইন্টারভিউ ফোকাস" />
          </h4>
          <ul className="space-y-1">
            {visibleQuestions.map((item, i) => {
              const normalized = normalizeInterviewQ(item);

              if (!normalized.a.en && !normalized.a.bn && normalized.q.en) {
                const picked = pickLocalizedText(normalized.q, mode, { fallback: true });
                if (!picked) return null;
                return (
                  <li
                    key={i}
                    className="text-base text-slate-700 font-semibold flex gap-3 px-3 py-2"
                  >
                    <span className="text-brand-cyan font-black shrink-0">Q:</span>
                    <span lang={picked.lang} className={picked.lang === 'bn' ? 'font-bengali' : ''}>
                      {picked.content}
                    </span>
                  </li>
                );
              }

              return (
                <InterviewQItem
                  key={i}
                  q={normalized.q}
                  a={normalized.a}
                  followUp={normalized.followUp}
                  difficulty={normalized.difficulty}
                />
              );
            })}
          </ul>
        </div>
      )}

      {showPractice && practiceText && (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-xl relative overflow-hidden w-full min-w-0">
          <div className="relative z-10 space-y-3">
            <div className="text-[11px] uppercase text-brand-cyan font-bold tracking-widest flex items-center gap-2">
              <ListChecks size={14} />
              <LocalizedLabel en="Practice goal" bn="অনুশীলনের লক্ষ্য" />
            </div>
            <LocalizedSplit
              columns="stack"
              en={
                practiceText.en && showEn ? (
                  <p lang="en" className="text-base leading-relaxed text-slate-200">
                    {practiceText.en}
                  </p>
                ) : undefined
              }
              bn={
                practiceText.bn && showBn ? (
                  <p lang="bn" className="text-base leading-relaxed text-indigo-200 font-bengali">
                    {practiceText.bn}
                  </p>
                ) : showBn && !showEn && practiceText.en ? (
                  <p lang="en" className="text-base leading-relaxed text-slate-200">
                    {practiceText.en}
                  </p>
                ) : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
