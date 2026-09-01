import type { LocalizedText } from '../data/types';
import { interviewAnswerPatches } from '../data/interviewAnswerPatches';

export function questionSlug(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

function firstSentences(text: string, max = 2): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/(?<=[.!?])\s+/);
  return parts.slice(0, max).join(' ').trim();
}

/** Wrap existing answers with beginner-friendly structure when no custom patch exists */
function wrapBeginnerAnswer(en: string, bn: string): LocalizedText {
  const simpleEn = firstSentences(en, 1) || en.slice(0, 180);
  const simpleBn = bn.length > 0 ? bn : '';

  const formattedEn = en.includes('### ')
    ? en
    : `### Simple answer (start here)

${simpleEn}

### Detailed explanation

${en}

### How to say it in an interview

1. Give the simple answer in one sentence.
2. Explain **why** it matters in a real .NET project.
3. Mention one **example** (ASP.NET Core, EF Core, etc.).
4. Optional: one **common mistake** to avoid.`;

  const formattedBn =
    bn.includes('### ') || bn.length > 280
      ? bn
      : simpleBn
        ? `### সহজ উত্তর (এখান থেকে শুরু করুন)

${expandBanglaSummary(simpleBn)}

### বিস্তারিত ব্যাখ্যা

${expandBanglaSummary(simpleBn)}

${bn.length < 120 ? `\n**English-এ আরও detail আছে** — "Both" tab-এ English অংশ পড়ুন, অথবা নিচের পয়েন্টগুলো মুখস্থ করুন:\n\n${banglaBulletsFromEnglish(en)}` : ''}

### Interview-তে কীভাবে বলবেন

1. এক বাক্যে সহজ উত্তর দিন।
2. বলুন **কেন** এটা .NET project-এ দরকার।
3. একটা **উদাহরণ** দিন (যেমন ASP.NET Core, EF Core)।
4. একটা **সাধারণ ভুল** উল্লেখ করুন।`
        : `### বিস্তারিত উত্তর

${en ? 'English tab-এ full answer আছে। Both mode-এ পড়ুন।' : ''}`;

  return { en: formattedEn, bn: formattedBn };
}

function expandBanglaSummary(bn: string): string {
  if (bn.length > 160) return bn;
  if (bn.includes('=') || bn.includes('→')) {
    return `${bn}\n\nউপরের সংক্ষিপ্ত বাক্যটি মুখস্থ করুন, তারপর interview-তে নিজের ভাষায় ২–৩ বাক্যে expand করে বলুন।`;
  }
  return bn;
}

function banglaBulletsFromEnglish(en: string): string {
  const sentences = en.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  return sentences
    .slice(0, 4)
    .map((s) => `- ${s.slice(0, 120)}${s.length > 120 ? '…' : ''}`)
    .join('\n');
}

export function enrichInterviewAnswer(
  qEn: string,
  aEn: string,
  aBn: string
): LocalizedText {
  const slug = questionSlug(qEn);
  const patch = interviewAnswerPatches[slug];
  if (patch) return patch;

  return wrapBeginnerAnswer(aEn, aBn);
}

export function enrichInterviewFollowUp(
  qEn: string,
  followUpEn: string,
  followUpBn?: string
): LocalizedText | undefined {
  if (!followUpEn && !followUpBn) return undefined;
  const slug = `${questionSlug(qEn)}--followup`;
  const patch = interviewAnswerPatches[slug];
  if (patch) return patch;
  if (!followUpEn) return { en: '', bn: followUpBn ?? '' };

  return {
    en: followUpEn.includes('###')
      ? followUpEn
      : `### Follow-up question\n\n${followUpEn}\n\n*Think for 5 seconds, then answer with one concrete example.*`,
    bn:
      followUpBn ??
      `### Follow-up প্রশ্ন\n\nInterview-তে এই follow-up আসতে পারে। ৫ সেকেন্ড ভাবুন, তারপর একটা concrete উদাহরণ দিয়ে উত্তর দিন।`,
  };
}
