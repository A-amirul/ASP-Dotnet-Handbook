import type { LocalizedText } from '../data/types';
import { MarkdownProse } from './MarkdownProse';
import { LocalizedLabel, LocalizedSplit } from './LocalizedSplit';
import { useLanguage } from '../context/LanguageContext';

type ComparisonTableProps = {
  table: LocalizedText;
};

export function ComparisonTable({ table }: ComparisonTableProps) {
  const { showEn, showBn } = useLanguage();
  if ((!showEn || !table.en) && (!showBn || !table.bn)) return null;
  if (!table.en && !table.bn) return null;

  return (
    <div className="w-full space-y-4">
      <h4 className="text-handbook-h4 text-slate-800">
        <LocalizedLabel en="Comparison" bn="তুলনা" />
      </h4>
      <LocalizedSplit
        columns="side"
        className="w-full"
        en={
          table.en ? (
            <div className="rounded-xl border border-slate-200 overflow-hidden w-full">
              {showBn && (
                <div className="bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  English
                </div>
              )}
              <div className="p-4">
                <MarkdownProse content={table.en} lang="en" />
              </div>
            </div>
          ) : undefined
        }
        bn={
          table.bn ? (
            <div className="rounded-xl border border-indigo-100 overflow-hidden w-full" lang="bn">
              {showEn && (
                <div className="bg-indigo-50 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-indigo-600 font-bengali">
                  বাংলা
                </div>
              )}
              <div className="p-4">
                <MarkdownProse content={table.bn} lang="bn" />
              </div>
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
