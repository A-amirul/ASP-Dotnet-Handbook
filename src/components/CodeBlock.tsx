import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-sql';
import { cn } from '../lib/utils';
import type { LocalizedText } from '../data/types';
import { MarkdownProse } from './MarkdownProse';
import { LocalizedLabel, LocalizedSplit } from './LocalizedSplit';
import { useLanguage } from '../context/LanguageContext';

type CodeBlockProps = {
  code: string;
  language?: 'csharp' | 'sql';
  title?: string;
  subtitle?: string;
  explanation?: LocalizedText;
  className?: string;
};

export function CodeBlock({
  code,
  language = 'csharp',
  title = 'Implementation Example',
  subtitle,
  explanation,
  className,
}: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const { showEn, showBn } = useLanguage();

  useEffect(() => {
    if (ref.current) Prism.highlightElement(ref.current);
  }, [code, language]);

  const isSql = language === 'sql';

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'rounded-xl border overflow-hidden shadow-lg font-mono text-sm',
          isSql
            ? 'bg-slate-800 border-slate-700'
            : 'bg-slate-900 border-slate-800'
        )}
      >
        <div
          className={cn(
            'flex justify-between items-center px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b',
            isSql
              ? 'text-slate-400 border-slate-700'
              : 'text-slate-500 border-slate-800'
          )}
        >
          <span>{title}</span>
          <span>{subtitle ?? (isSql ? 'SQL Server / PostgreSQL' : 'C# / .NET SDK')}</span>
        </div>
        <pre className="p-5 overflow-x-auto m-0 leading-relaxed">
          <code ref={ref} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>

      {explanation && (explanation.en || explanation.bn) && (showEn || showBn) && (
        <LocalizedSplit
          columns="side"
          en={
            explanation.en && showEn ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  <LocalizedLabel en="Code explanation" bn="কোড ব্যাখ্যা" />
                </p>
                <MarkdownProse content={explanation.en} lang="en" />
              </div>
            ) : undefined
          }
          bn={
            explanation.bn && showBn ? (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4" lang="bn">
                <MarkdownProse content={explanation.bn} lang="bn" />
              </div>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
