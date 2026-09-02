export const DIFFICULTY_LABEL: Record<string, { label: string; className: string }> = {
  junior: { label: 'Junior', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  mid: { label: 'Mid', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  senior: { label: 'Senior', className: 'bg-amber-50 text-amber-800 border-amber-200' },
  expert: { label: 'Expert', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export const CALLOUT_STYLES = {
  important: 'bg-violet-50 border-violet-200 border-l-violet-500 text-violet-900',
  note: 'bg-sky-50 border-sky-200 border-l-sky-500 text-sky-900',
  tip: 'bg-emerald-50 border-emerald-200 border-l-emerald-500 text-emerald-900',
  warning: 'bg-amber-50 border-amber-200 border-l-amber-500 text-amber-900',
  mistake: 'bg-rose-50 border-rose-200 border-l-rose-500 text-rose-900',
  interview: 'bg-indigo-50 border-indigo-200 border-l-indigo-500 text-indigo-900',
  example: 'bg-slate-100 border-slate-300 border-l-slate-600 text-slate-900',
} as const;

export const EXPLANATION_LABELS = {
  what: { en: 'What is it?', bn: 'এটা কী?' },
  why: { en: 'Why do we need it?', bn: 'কেন দরকার?' },
  how: { en: 'How does it work?', bn: 'কীভাবে কাজ করে?' },
  when: { en: 'When should we use it?', bn: 'কখন ব্যবহার করব?' },
  analogy: { en: 'Real-world analogy', bn: 'বাস্তব উদাহরণ' },
  realWorld: { en: 'Practical use case', bn: 'প্র্যাকটিক্যাল ব্যবহার' },
  summary: { en: 'Overview', bn: 'সংক্ষিপ্ত ধারণা' },
  quickSummary: { en: 'Quick summary', bn: 'দ্রুত সারাংশ' },
} as const;

/** Full width of main column — avoids empty margins beside sidebar on wide screens */
export const CONTENT_MAX_WIDTH = 'w-full max-w-full min-w-0';
