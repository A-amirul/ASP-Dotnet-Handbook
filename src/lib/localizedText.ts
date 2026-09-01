import type { LocalizedText } from '../data/types';

/** Pick text for current language mode; optional English fallback when Bangla missing */
export function pickLocalizedText(
  text: LocalizedText,
  mode: 'en' | 'bn' | 'both',
  options?: { fallback?: boolean }
): { content: string; lang: 'en' | 'bn' } | null {
  const fallback = options?.fallback !== false;

  if (mode === 'en') {
    return text.en ? { content: text.en, lang: 'en' } : null;
  }
  if (mode === 'bn') {
    if (text.bn) return { content: text.bn, lang: 'bn' };
    if (fallback && text.en) return { content: text.en, lang: 'en' };
    return null;
  }
  // both — caller renders both columns
  return null;
}

export function hasLocalizedContent(
  text: LocalizedText,
  showEn: boolean,
  showBn: boolean,
  fallback = true
): boolean {
  if (showEn && text.en) return true;
  if (showBn && text.bn) return true;
  if (showBn && fallback && text.en) return true;
  return false;
}
