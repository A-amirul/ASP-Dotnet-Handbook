import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BookOpen,
  Download,
  LayoutDashboard,
  Loader2,
  Search,
  Star,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CONTENT_MAX_WIDTH } from '../lib/constants';
import { handbookData } from '../data';
import type { HandbookModule } from '../data/types';
import { normalizeBilingualItems } from '../lib/contentHelpers';
import { applyBilingualPatch } from '../data/bilingualPatches';
import { SectionCard } from './SectionCard';
import { TableOfContents } from './TableOfContents';
import { InterviewSection } from './InterviewSection';
import { CodingTaskCard } from './CodingTaskCard';
import { MarkdownProse } from './MarkdownProse';
import { ExplanationBlockView } from './ExplanationBlock';
import { DiagramBlock } from './DiagramBlock';
import { ComparisonTable } from './ComparisonTable';
import { BilingualListCallout } from './BilingualCallout';
import { LanguageTabs } from './LanguageTabs';
import { LocalizedSplit } from './LocalizedSplit';
import { useLanguage } from '../context/LanguageContext';

type SectionRendererProps = {
  data: HandbookModule;
};

export function SectionRenderer({ data: initialData }: SectionRendererProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const { showEn, showBn } = useLanguage();

  const moduleChapter =
    initialData.chapterNumber ??
    handbookData.findIndex((d) => d.id === initialData.id) + 1;

  const downloadAsPDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    setIsDownloading(true);
    try {
      const mainElement = element.closest('main');
      if (mainElement) mainElement.scrollTop = 0;

      const targetWidth = Math.max(element.scrollWidth, 1200);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        width: targetWidth,
        windowWidth: targetWidth,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('pdf-content');
          if (el) {
            el.style.width = `${targetWidth}px`;
            el.style.height = 'auto';
            el.style.overflow = 'visible';
            const all = el.getElementsByTagName('*');
            for (let i = 0; i < all.length; i++) {
              const node = all[i] as HTMLElement;
              node.style.boxShadow = 'none';
              node.style.textShadow = 'none';
              if (node.tagName === 'PRE') {
                node.style.whiteSpace = 'pre-wrap';
                node.style.overflowX = 'visible';
              }
            }
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${initialData.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Could not generate PDF. Try browser Print instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  const data = useMemo(() => {
    if (!searchQuery) return initialData;
    const query = searchQuery.toLowerCase();

    if (initialData.tasks?.length) {
      return {
        ...initialData,
        tasks: initialData.tasks.filter((t) =>
          `${t.title} ${t.english} ${t.bangla} ${t.code}`.toLowerCase().includes(query)
        ),
      };
    }

    return {
      ...initialData,
      sections: initialData.sections?.filter((s) => {
        const blob = JSON.stringify(s).toLowerCase();
        return blob.includes(query);
      }),
    };
  }, [initialData, searchQuery]);

  const sections = data.sections ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={cn(CONTENT_MAX_WIDTH, 'mx-auto space-y-8 pb-16')}
    >
      <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-slate-200 pb-6 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-cyan font-bold text-xs uppercase tracking-widest">
            <LayoutDashboard size={14} />
            Chapter {String(moduleChapter).padStart(2, '0')}
          </div>
          <h1 className="text-handbook-h1 text-slate-900">{data.title}</h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-3xl">{data.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
          <LanguageTabs size="md" className="w-full sm:w-auto shrink-0" />
          <div className="flex gap-2 flex-1 min-w-0">
            <div className="relative flex-1 lg:w-72 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="search"
              placeholder="Search this chapter..."
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-sm focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan-subtle outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
          <button
            type="button"
            onClick={downloadAsPDF}
            disabled={isDownloading}
            className="h-11 px-4 bg-slate-900 text-white rounded-lg flex items-center gap-2 text-xs font-bold uppercase disabled:opacity-50 shrink-0"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            PDF
          </button>
          </div>
        </div>
      </header>

      <div className="flex gap-8 items-start">
        <TableOfContents sections={sections} moduleChapter={moduleChapter} />

        <div id="pdf-content" className="flex-1 min-w-0 space-y-8">
          {sections.map((section, idx) => (
            <SectionCard
              key={section.id ?? idx}
              section={section}
              index={idx}
              moduleChapter={moduleChapter}
            />
          ))}

          {data.tasks?.map((task, idx) => {
            const patched = applyBilingualPatch(
              {
                title: task.title,
                english: task.english,
                bangla: task.bangla,
                code: task.code,
                explanation: task.explanation,
                problem: task.problem,
                example: task.example,
                approach: task.approach,
                solution: task.solution,
                complexity: task.complexity,
              },
              idx
            );
            return (
              <CodingTaskCard
                key={idx}
                taskIndex={idx}
                title={task.title}
                patched={patched}
                code={task.code}
              />
            );
          })}

          {data.quickRevision && (
            <div className="grid sm:grid-cols-2 gap-4">
              {(data.quickRevision.concepts ?? []).length > 0 && (
                <div className="bg-white border rounded-xl p-5">
                  <h4 className="text-xs font-black uppercase text-brand-cyan mb-3">Key concepts</h4>
                  <ul className="space-y-2 text-base">
                    {data.quickRevision.concepts.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {data.interviewQuestions?.length ? (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-handbook-h3 mb-4 flex items-center gap-2">
                <Star className="text-brand-cyan" size={18} /> Module interview questions
              </h3>
              <InterviewSection interviewQs={data.interviewQuestions} />
            </div>
          ) : null}

          {data.revisionSummary && (
            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-handbook-h3 mb-4 flex items-center gap-2">
                <BookOpen className="text-brand-cyan" /> Revision summary
              </h3>
              <MarkdownProse content={data.revisionSummary} className="prose-invert" />
            </div>
          )}

          {data.summary && (
            <footer className="border-t pt-6 text-sm text-slate-500 italic">
              <span className="text-brand-cyan font-bold not-italic">Summary: </span>
              {data.summary}
            </footer>
          )}
        </div>
      </div>
    </motion.div>
  );
}
