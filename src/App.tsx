import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Database,
  Globe,
  Server,
  Code2,
  BookOpen,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  Layers,
  ShieldCheck,
  Star,
  Search,
  User,
  Download,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from './lib/utils';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { handbookData } from './data';
import { AlertCircle, CheckCircle2, ListChecks } from 'lucide-react';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const location = useLocation();

  const navItems = [
    { id: 'home', title: 'Roadmap & Introduction', icon: LayoutDashboard, path: '/' },
    ...handbookData.map(item => ({
      id: item.id,
      title: item.title,
      icon: item.id === 'basics' ? ListChecks :
        item.id === 'csharp' ? Code2 :
          item.id === 'aspnet' ? Server :
            item.id === 'webapi' ? Globe :
              item.id === 'database' ? Database :
                item.id === 'frontend' ? Layers :
                  item.id === 'systemdesign' ? ShieldCheck : Terminal,
      path: `/${item.id}`
    }))
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#00000080] z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-brand-sidebar flex flex-col border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 h-full shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 sm:p-6 bg-slate-subtle border-b border-slate-100 text-center">
            <h1 className="font-bold text-brand-cyan text-lg sm:text-xl tracking-tighter">DOTNET </h1>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-slate-500">Interview Handbook</p>
          </div>

          <nav className="flex-1 overflow-y-auto custom-scrollbar py-3 sm:py-4 px-2 sm:px-3 space-y-0.5 sm:space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) toggle(); }}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 transition-all text-xs sm:text-sm font-medium rounded-lg",
                  location.pathname === item.path
                    ? "bg-brand-cyan-subtle text-brand-cyan shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className={cn(
                  "text-[8px] sm:text-[10px] font-mono",
                  location.pathname === item.path ? "text-brand-cyan" : "opacity-40"
                )}>
                  {navItems.findIndex(n => n.id === item.id).toString().padStart(2, '0')}
                </span>
                <span className="flex-1 truncate">{item.title}</span>
                <ChevronRight size={14} className={cn(
                  "ml-auto shrink-0 transition-all",
                  location.pathname === item.path ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                )} />
              </Link>
            ))}
          </nav>

          <div className="p-6 mt-auto border-t border-slate-100">
            <div className="text-[11px] uppercase tracking-widest text-center text-slate-400 font-bold">
              Ver 2.4 | Senior Guide
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const SectionRenderer = ({ data: initialData }: { data: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAsPDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    setIsDownloading(true);
    try {
      // Force scroll to top of main area to ensure full capture
      const mainElement = element.closest('main');
      if (mainElement) mainElement.scrollTop = 0;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('pdf-content');
          if (el) {
            el.style.height = 'auto';
            el.style.overflow = 'visible';
            el.style.background = '#f8fafc';

            // Remove all box-shadows and oklch-prone styles in clone
            const all = el.getElementsByTagName('*');
            for (let i = 0; i < all.length; i++) {
              const s = (all[i] as HTMLElement).style;
              if (s) {
                s.boxShadow = 'none';
                s.textShadow = 'none';
                s.backdropFilter = 'none';
                // If opacity is very low, make it visible or just keep as is
              }
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add pages for remaining height
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${initialData.title.replace(/\s+/g, '_').toLowerCase()}_guide.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Could not generate PDF. Please try using the "Print" option in your browser.');
    } finally {
      setIsDownloading(false);
    }
  };

  const data = useMemo(() => {
    if (!searchQuery) return initialData;

    const query = searchQuery.toLowerCase();

    if (initialData.id === 'tasks' || initialData.tasks) {
      return {
        ...initialData,
        tasks: initialData.tasks.filter((t: any) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
        )
      };
    }

    return {
      ...initialData,
      sections: initialData.sections.filter((s: any) =>
        s.topic.toLowerCase().includes(query) ||
        s.english.toLowerCase().includes(query) ||
        s.bangla.toLowerCase().includes(query)
      )
    };
  }, [initialData, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-12 pb-20"
    >
      <header className="mb-6 sm:mb-8 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:pb-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-brand-cyan font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1">
            <LayoutDashboard size={12} className="sm:block hidden" />
            <LayoutDashboard size={10} className="sm:hidden" />
            {data.id === 'tasks' ? 'Full Stack Machine Test' : 'Technical Mastery'}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{data.title}</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">{data.description}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 sm:h-11 pl-9 sm:pl-10 pr-3 sm:pr-4 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan-subtle transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
            <button
              onClick={downloadAsPDF}
              disabled={isDownloading}
              className="h-9 sm:h-11 px-3 sm:px-4 bg-slate-900 text-white rounded-lg flex items-center justify-center sm:justify-start gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 whitespace-nowrap"
              title="Download Module as PDF"
            >
              {isDownloading ? <Loader2 size={14} className="sm:size-4 animate-spin" /> : <Download size={14} className="sm:size-4" />}
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
      </header>

      <div id="pdf-content" className="grid gap-6 sm:gap-8 md:gap-12 bg-slate-subtle p-3 sm:p-4 -m-3 sm:-m-4 rounded-xl">
        {data.sections?.map((section: any, idx: number) => (
          <section key={idx} className="bg-white p-4 sm:p-6 md:p-8 border border-slate-200 rounded-lg sm:rounded-xl relative shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 border-b border-slate-100 pb-3 sm:pb-4 gap-2">
              <h3 className="text-slate-900 text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                <span className="w-2 sm:w-3 h-2 sm:h-3 bg-brand-cyan rounded-full border border-indigo-200 shrink-0"></span>
                <span className="line-clamp-2">{section.title || section.topic}</span>
              </h3>
              <span className="text-[9px] sm:text-xs text-brand-cyan font-bold font-mono bg-brand-cyan-subtle px-2 sm:px-3 py-1 rounded whitespace-nowrap">Module 0{idx + 1}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-10">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div>
                  <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Technical Core</h4>
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm font-medium">{section.content || section.english}</p>
                </div>

                {section.subsections && section.subsections.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    {section.subsections.map((sub: any, i: number) => (
                      <div key={i}>
                        <h5 className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 sm:mb-2">{sub.title}</h5>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{sub.description || sub.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.tips && section.tips.length > 0 && (
                  <div className="bg-emerald-subtle p-3 sm:p-4 rounded-lg border-l-4 border-emerald-500 text-slate-800 text-xs sm:text-sm font-medium">
                    <p className="font-bold text-emerald-700 mb-2">Key Tips:</p>
                    <ul className="space-y-1">
                      {section.tips.map((tip: string, i: number) => (
                        <li key={i} className="flex gap-2 text-xs sm:text-sm">
                          <span className="text-emerald-600 font-bold">✓</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {section.subsections && section.subsections.map((sub: any, i: number) => (
                  sub.code && (
                    <div key={i} className="bg-slate-900 rounded-lg sm:rounded-xl border border-slate-800 p-3 sm:p-4 md:p-5 font-mono text-[11px] sm:text-[12px] md:text-[13px] overflow-hidden relative shadow-lg custom-scrollbar">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3 text-[8px] sm:text-[10px] text-slate-500 border-b border-slate-800 pb-2 font-bold uppercase tracking-wider">
                        <span>{sub.title}</span>
                        <span className="text-slate-600">C# / .NET</span>
                      </div>
                      <pre className="text-indigo-300 leading-relaxed overflow-x-auto custom-scrollbar">
                        <code>{sub.code}</code>
                      </pre>
                    </div>
                  )
                ))}
              </div>
            </div>

            {section.interviewQuestions && section.interviewQuestions.length > 0 && (
              <div className="pt-6 sm:pt-8 border-t border-slate-100 space-y-4">
                <h4 className="text-[10px] sm:text-[11px] font-bold text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                  <Star size={14} className="fill-brand-cyan text-brand-cyan hidden sm:block" />
                  <Star size={12} className="fill-brand-cyan text-brand-cyan sm:hidden" />
                  Interview Questions
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {section.interviewQuestions.map((q: string, i: number) => (
                    <div key={i} className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-100">
                      <p className="text-xs sm:text-sm text-slate-700 font-semibold flex gap-2">
                        <span className="text-brand-cyan font-black shrink-0">Q{i + 1}:</span> 
                        <span>{q}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
              <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-[11px] uppercase text-brand-cyan font-bold mb-2 tracking-widest flex items-center gap-2">
                    <ListChecks size={14} /> Practice Goal
                  </div>
                  <p className="text-sm font-medium leading-relaxed italic text-slate-300">{section.practice}</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Code2 size={80} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {data.revisionSummary && (
        <div className="mt-12 sm:mt-16 md:mt-20 bg-slate-900 rounded-lg sm:rounded-2xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <BookOpen size={18} className="sm:size-6 text-brand-cyan" /> 
              <span className="truncate">{data.id === 'codingTasks' ? 'Summary of Tasks' : 'Key Takeaways: ' + data.title}</span>
            </h3>
            <div className="prose prose-invert prose-sm markdown-body text-xs sm:text-sm">
              <Markdown remarkPlugins={[remarkGfm]}>{data.revisionSummary}</Markdown>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 opacity-5 hidden sm:block">
            <LayoutDashboard size={400} />
          </div>
        </div>
      )}

      {data.summary && (
        <footer className="mt-8 sm:mt-12 border-t border-slate-200 pt-6 sm:pt-8 flex flex-col gap-3 sm:gap-4 text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-400">
          <div className="text-center sm:text-left text-slate-500 font-bold italic">
            <span className="text-brand-cyan font-black mr-2 not-italic">Summary:</span> 
            <span className="text-xs sm:text-sm font-normal">{data.summary}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 font-bold text-slate-400">
            <span className="text-brand-cyan text-center sm:text-left">Mastery Level: 0{handbookData.findIndex(d => d.id === data.id) + 1}</span>
            <span className="text-center sm:text-left">2026 Edition</span>
          </div>
        </footer>
      )}

      {data.tasks && (
        <div className="grid gap-8 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
            <Terminal size={24} className="text-brand-cyan" /> Practical Machine Tests
          </h2>
          {data.tasks.map((task: any, idx: number) => (
            <div key={idx} className="bg-white p-8 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{task.title}</h3>
                <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">Task_{idx.toString().padStart(2, '0')}</span>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Challenge Objective</h4>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">{task.english}</p>
                  </div>
                  <div className="bg-brand-cyan-subtle p-4 rounded-lg border-l-4 border-brand-cyan text-slate-800 text-xs font-medium">
                    <span className="font-bold text-brand-cyan mr-2">বাংলা সারসংক্ষেপ:</span>
                    {task.bangla}
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-inner overflow-hidden relative">
                  <div className="flex justify-between items-center mb-3 text-[9px] text-slate-500 border-b border-slate-800 pb-2 font-bold uppercase tracking-widest">
                    <span>Clean Solution</span>
                    <span>C# Logic</span>
                  </div>
                  <pre className="text-[13px] font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                    <code>{task.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto py-8 md:py-12"
    >
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-brand-cyan text-white p-6 sm:p-10 md:p-16 mb-12 sm:mb-16 md:mb-20 shadow-xl shadow-indigo-200">
        <div className="relative z-10">
          <div className="text-indigo-100 font-mono text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4 font-bold">Expert Level Guide</div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-tight">
            <span className="text-slate-900 italic font-black">DOTNET ARCHITECT</span>
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-indigo-50 mb-6 sm:mb-8 md:mb-10 max-w-2xl font-bold leading-relaxed opacity-90">
            A specialized handbook for professionals targeting senior roles. Master core internals, design patterns, and architecture questions.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => window.print()}
              className="bg-white text-brand-cyan px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg"
            >
              <Download size={14} className="sm:size-4" /> Print Guide
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 border-t border-indigo-200 pt-6 sm:pt-8 mt-4">
            <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-white font-bold flex items-center gap-2">
              <ShieldCheck size={12} className="sm:size-3" /> Technical Fundamentals
            </div>
            <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-white font-bold flex items-center gap-2">
              <Globe size={12} className="sm:size-3" /> Real-World Scenarios
            </div>
            <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-white font-bold flex items-center gap-2">
              <Terminal size={12} className="sm:size-3" /> Practical Exercises
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.05] scale-75 xs:scale-100 sm:scale-125 md:scale-150 rotate-12 pointer-events-none">
          <Code2 size={500} />
        </div>
      </section>

      <section className="space-y-6 sm:space-y-8 md:space-y-12">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between border-b-2 border-slate-100 pb-3 sm:pb-4 gap-2 xs:gap-0">
          <h2 className="text-lg xs:text-xl md:text-2xl font-bold text-slate-900 tracking-tight">The Mastery Roadmap</h2>
          <span className="text-[8px] xs:text-[9px] md:text-[10px] font-bold font-mono text-brand-cyan uppercase tracking-widest bg-brand-cyan-subtle px-2 py-1 rounded whitespace-nowrap">2026 Edition</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { step: 1, id: 'csharp', title: 'Adv. C# Mastery', desc: 'Internal workings, memory management & async patterns.' },
            { step: 2, id: 'aspnet', title: 'ASP.NET Architecture', desc: 'Middleware, Request lifecycle & Security pipelines.' },
            { step: 3, id: 'database', title: 'Data Infrastructure', desc: 'Optimization, EF Core internals & Query tuning.' },
            { step: 4, id: 'systemdesign', title: 'System Design', desc: 'Microservices, Scalability & Cloud Architecture.' },
            { step: 5, id: 'tasks', title: 'Machine Tasks', desc: 'Real-world coding challenges and design patterns.' },
            { step: 6, id: 'webapi', title: 'Web API Design', desc: 'REST principles, versioning, and secure API architecture.' }
          ].map((item) => (
            <Link
              key={item.step}
              to={`/${item.id}`}
              className="group bg-white p-4 sm:p-6 md:p-8 border border-slate-200 hover:border-brand-cyan transition-all rounded-lg sm:rounded-xl relative overflow-hidden shadow-sm hover:shadow-md active:scale-95 block"
            >
              <span className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-50 group-hover:text-indigo-100 transition-colors absolute -top-3 -right-3 sm:-top-4 sm:-right-4 italic">{item.step.toString().padStart(2, '0')}</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-3 uppercase tracking-widest relative z-10 group-hover:text-brand-cyan transition-colors">{item.title}</h3>
              <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed relative z-10 font-medium group-hover:text-slate-700 transition-colors">{item.desc}</p>
              <div className="mt-3 sm:mt-4 flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-brand-cyan opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                Explore <ChevronRight size={10} className="sm:size-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12 sm:mt-16 md:mt-24 p-6 sm:p-8 md:p-10 bg-indigo-50 border border-indigo-100 rounded-lg sm:rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm sm:text-base md:text-xl text-indigo-900 leading-relaxed font-medium italic mb-2">
            "ইন্টারভিউতে শুধুমাত্র কোড জানা যথেষ্ট নয়, আপনার ডিসিশন মেকিং এবং প্রবলেম সলভিং অ্যাপ্রোচ যাচাই করা হয়। এই হ্যান্ডবুকটি আপনাকে সেই লেভেলের থিঙ্কিং শিখতে সাহায্য করবে।"
          </p>
          <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-brand-cyan font-black mt-3 sm:mt-4">— Technical Lead, Handbook Author</div>
        </div>
        <div className="absolute top-0 right-0 p-4 sm:p-8 text-brand-cyan opacity-[0.03]">
          <Star size={80} className="sm:size-120" />
        </div>
      </div>
        <div className="absolute top-0 right-0 p-8 text-brand-cyan opacity-[0.03]">
          <Star size={120} />
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <nav className="h-14 sm:h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 sm:p-2 text-brand-cyan hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <Menu size={20} className="sm:size-6" />
        </button>
        <div className="hidden lg:flex items-center gap-2 text-brand-cyan text-sm font-bold tracking-tight">
          <Terminal size={18} />
          <span className="uppercase tracking-widest"> Dotnet Architect Mastery</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex -space-x-2 mr-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-white bg-brand-cyan text-white flex items-center justify-center text-[10px] font-bold">
            +
          </div>
        </div>
        <button className="h-9 px-4 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200">
          Docs
        </button>
        <button className="h-9 px-4 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
          Hire Expert
        </button>
      </div>
    </nav>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="h-screen flex overflow-hidden bg-brand-bg relative w-full">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50">
          <div className="px-5 py-8 md:px-12 md:py-12">
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </div>

          <footer className="px-6 py-10 md:py-12 md:px-12 border-t border-slate-100 bg-white mt-auto">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-6">
                <a
                  href="https://amirul-islam-portfolio.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-brand-cyan transition-all transform hover:scale-110 text-xs font-medium"
                >
                  All rights reserved by © Md Amirul Islam
                </a>

                <div className="flex items-center gap-6">
                  <a
                    href="https://amirul-islam-portfolio.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-brand-cyan transition-all transform hover:scale-110 flex items-center gap-2 text-sm font-medium"
                  >
                    <span>Portfolio</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/md-amirul-islam-518a2b261"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-brand-cyan transition-all transform hover:scale-110 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {handbookData.map((item) => (
            <Route
              key={item.id}
              path={`/${item.id}`}
              element={<SectionRenderer data={item} />}
            />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
