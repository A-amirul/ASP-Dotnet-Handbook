import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { handbookData } from '../data';
import { NAV_GROUPS } from '../data/types';
import type { HandbookModule } from '../data/types';
import { CONTENT_MAX_WIDTH } from '../lib/constants';
import { LanguageTabs } from './LanguageTabs';
import { LocalizedSplit } from './LocalizedSplit';
import { useLanguage } from '../context/LanguageContext';
import { sectionSlug } from '../lib/contentHelpers';

export function TocPage() {
  const { showEn, showBn } = useLanguage();
  const byId = Object.fromEntries(handbookData.map((m) => [m.id, m])) as Record<string, HandbookModule>;
  let chapterNum = 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${CONTENT_MAX_WIDTH} w-full space-y-8 sm:space-y-10 pb-12 sm:pb-16`}
    >
      <header className="border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-brand-cyan text-xs font-bold uppercase tracking-widest">
            <BookOpen size={14} /> Navigation
          </div>
          <LanguageTabs size="md" />
        </div>
        <h1 className="text-handbook-h1 text-slate-900">Table of Contents</h1>
        <LocalizedSplit
          columns="stack"
          className="mt-2"
          en={
            showEn ? (
              <p lang="en" className="text-base text-slate-600">
                Click any chapter or section to jump directly. All content is available in English and
                Bangla — use the tabs above to switch language.
              </p>
            ) : undefined
          }
          bn={
            showBn ? (
              <p lang="bn" className="text-base text-indigo-800 font-bengali">
                যেকোনো অধ্যায় বা সেকশনে ক্লিক করে সরাসরি যান। উপরের tab দিয়ে ইংরেজি বা বাংলা বেছে নিন।
              </p>
            ) : undefined
          }
        />
      </header>

      <div className="space-y-10">
        {NAV_GROUPS.map((group) => {
          const modules = group.ids.map((id) => byId[id]).filter(Boolean);
          if (!modules.length) return null;

          return (
            <section key={group.title}>
              <h2 className="text-handbook-h2 text-slate-800 mb-4 pb-2 border-b border-slate-100">
                {group.title}
              </h2>
              <div className="space-y-6">
                {modules.map((mod) => {
                  chapterNum += 1;
                  const num = chapterNum;
                  return (
                    <div key={mod.id} className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
                      <Link
                        to={`/${mod.id}`}
                        className="group flex items-start justify-between gap-4 hover:text-brand-cyan"
                      >
                        <div>
                          <span className="text-brand-cyan font-mono text-sm font-bold">
                            Chapter {String(num).padStart(2, '0')}
                          </span>
                          <h3 className="text-handbook-h3 text-slate-900 group-hover:text-brand-cyan mt-1">
                            {mod.title}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">{mod.description}</p>
                        </div>
                        <ChevronRight className="shrink-0 text-slate-300 group-hover:text-brand-cyan" />
                      </Link>

                      {'sections' in mod && mod.sections && mod.sections.length > 0 && (
                        <ul className="mt-4 space-y-1 border-t border-slate-100 pt-4">
                          {mod.sections.map((section, si) => {
                            const slug = sectionSlug(section, si);
                            const title = section.topic ?? section.title ?? `Section ${si + 1}`;
                            return (
                              <li key={slug}>
                                <a
                                  href={`/${mod.id}#${slug}`}
                                  className="flex items-center gap-2 py-1.5 text-sm text-slate-600 hover:text-brand-cyan"
                                >
                                  <span className="font-mono text-xs text-slate-400 w-8">
                                    {num}.{si + 1}
                                  </span>
                                  {title}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
}
