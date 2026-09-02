import {
  AlertCircle,
  BookOpen,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Star,
  Zap,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CALLOUT_STYLES } from '../lib/constants';
import type { Callout, CalloutType, LocalizedText } from '../data/types';
import { MarkdownProse } from './MarkdownProse';
import { LocalizedLabel, LocalizedSplit } from './LocalizedSplit';
import { useLanguage } from '../context/LanguageContext';

const CALLOUT_ICONS: Record<CalloutType, React.ReactNode> = {
  important: <Star size={14} />,
  note: <BookOpen size={14} />,
  tip: <Lightbulb size={14} />,
  warning: <AlertCircle size={14} />,
  mistake: <AlertCircle size={14} />,
  interview: <MessageSquare size={14} />,
  example: <Zap size={14} />,
};

const DEFAULT_TITLES: Record<CalloutType, LocalizedText> = {
  important: { en: 'Important', bn: 'গুরুত্বপূর্ণ' },
  note: { en: 'Note', bn: 'নোট' },
  tip: { en: 'Tip', bn: 'টিপ' },
  warning: { en: 'Warning', bn: 'সতর্কতা' },
  mistake: { en: 'Common mistake', bn: 'সাধারণ ভুল' },
  interview: { en: 'Interview question', bn: 'ইন্টারভিউ প্রশ্ন' },
  example: { en: 'Practical example', bn: 'প্র্যাকটিক্যাল উদাহরণ' },
};

type BilingualCalloutProps = {
  type: CalloutType;
  title?: LocalizedText;
  content: LocalizedText;
  className?: string;
};

export function BilingualCallout({ type, title, content, className }: BilingualCalloutProps) {
  const t = title ?? DEFAULT_TITLES[type];
  const style = CALLOUT_STYLES[type];

  return (
    <div className={cn('rounded-xl border border-l-4 p-5', style, className)}>
      <div className="flex items-center gap-2 mb-3">
        {CALLOUT_ICONS[type]}
        <LocalizedLabel
          en={t.en}
          bn={t.bn}
          className="text-[11px] font-bold uppercase tracking-widest"
        />
      </div>
      <LocalizedSplit
        columns="side"
        en={content.en ? <MarkdownProse content={content.en} lang="en" /> : undefined}
        bn={content.bn ? <MarkdownProse content={content.bn} lang="bn" /> : undefined}
      />
    </div>
  );
}

export function CalloutBox({ callout }: { callout: Callout }) {
  return (
    <BilingualCallout
      type={callout.type}
      title={callout.title}
      content={callout.content}
    />
  );
}

type BilingualListProps = {
  type: 'mistake' | 'tip';
  items: { en: string; bn: string }[];
};

export function BilingualListCallout({ type, items }: BilingualListProps) {
  const { showEn, showBn } = useLanguage();
  const filtered = items.filter((i) => (showEn && i.en) || (showBn && i.bn));
  if (!filtered.length) return null;

  const style = type === 'mistake' ? CALLOUT_STYLES.mistake : CALLOUT_STYLES.tip;
  const title =
    type === 'mistake'
      ? { en: 'Common mistakes', bn: 'সাধারণ ভুল' }
      : { en: 'Best practices', bn: 'সেরা অনুশীলন' };

  return (
    <div className={cn('rounded-xl border border-l-4 p-5', style)}>
      <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
        {type === 'mistake' ? <AlertCircle size={14} /> : <Lightbulb size={14} />}
        <LocalizedLabel en={title.en} bn={title.bn} />
      </h4>
      <ul className="space-y-4">
        {filtered.map((item, i) => (
          <li key={i} className="text-base">
            <LocalizedSplit
              columns="side"
              en={
                item.en ? (
                  <span className="flex gap-2" lang="en">
                    <span className="shrink-0">{type === 'mistake' ? '•' : '✓'}</span>
                    {item.en}
                  </span>
                ) : undefined
              }
              bn={
                item.bn ? (
                  <span className="flex gap-2 text-slate-700" lang="bn">
                    <span className="shrink-0">{type === 'mistake' ? '•' : '✓'}</span>
                    {item.bn}
                  </span>
                ) : undefined
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BilingualDetails({
  details,
  label,
}: {
  details: LocalizedText;
  label?: LocalizedText;
}) {
  const { showEn, showBn } = useLanguage();
  const heading = label ?? { en: 'Deep dive', bn: 'বিস্তারিত ব্যাখ্যা' };
  if ((!showEn || !details.en) && (!showBn || !details.bn)) return null;
  if (!details.en && !details.bn) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-handbook-h4 text-slate-800 flex items-center gap-2">
        <HelpCircle size={16} className="text-brand-cyan" />
        <LocalizedLabel en={heading.en} bn={heading.bn} />
      </h4>
      <LocalizedSplit
        columns="side"
        en={
          details.en ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              {showBn && (
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  English
                </p>
              )}
              <MarkdownProse content={details.en} lang="en" />
            </div>
          ) : undefined
        }
        bn={
          details.bn ? (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5" lang="bn">
              {showEn && (
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-3 font-bengali">
                  বাংলা
                </p>
              )}
              <MarkdownProse content={details.bn} lang="bn" />
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
