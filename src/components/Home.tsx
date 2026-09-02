import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BookOpen,
  ChevronRight,
  Code2,
  Download,
  Globe,
  List,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { CONTENT_MAX_WIDTH } from '../lib/constants';
import { cn } from '../lib/utils';
import { LanguageTabs } from './LanguageTabs';
import { LocalizedSplit } from './LocalizedSplit';
import { useLanguage } from '../context/LanguageContext';

const ROADMAP = [
  { step: 1, id: 'guide', title: 'How to Use', desc: 'Mindset, study order, bilingual learning path.' },
  { step: 2, id: 'basics', title: 'C# Fundamentals', desc: 'Arrays, loops, first programs.' },
  { step: 3, id: 'csharp', title: 'C# & OOP', desc: 'Types, memory, SOLID, interfaces.' },
  { step: 4, id: 'linq', title: 'LINQ', desc: 'Deferred execution, IQueryable.' },
  { step: 5, id: 'async', title: 'Async & Threads', desc: 'Task, await, concurrency.' },
  { step: 6, id: 'aspnet', title: 'ASP.NET Core', desc: 'Pipeline, middleware, DI.' },
  { step: 7, id: 'database', title: 'EF Core & SQL', desc: 'DbContext, tracking, queries.' },
  { step: 8, id: 'architecture', title: 'Architecture', desc: 'Clean Architecture, CQRS.' },
  { step: 9, id: 'security', title: 'Security', desc: 'Auth, JWT, OWASP.' },
  { step: 10, id: 'distributed', title: 'Distributed', desc: 'Microservices, messaging.' },
  { step: 11, id: 'problemsolving', title: 'Problem Solving', desc: 'Interview framework, patterns, live tasks.' },
  { step: 12, id: 'algorithms', title: 'Algorithms', desc: 'Big-O, trees, graphs, DP in C#.' },
  { step: 13, id: 'csharpproblems', title: 'C# DSA & .NET Tasks', desc: 'Collections, LINQ, parsing, machine tests.' },
  { step: 14, id: 'bdinterview', title: 'BD Interview Guide', desc: 'Scenarios, Q&A, mock rounds for BD companies.' },
  { step: 15, id: 'scenarios', title: 'Scenarios', desc: 'Production incidents.' },
  { step: 16, id: 'revision', title: 'Revision', desc: 'Last-day checklist.' },
];

export function Home() {
  const { showEn, showBn } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(CONTENT_MAX_WIDTH, 'mx-auto space-y-12')}
    >
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white p-8 md:p-14 shadow-xl border border-slate-700/50">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
              .NET Developer Handbook — Bilingual Edition
            </p>
            <LanguageTabs size="lg" variant="onDark" />
          </div>
          <h1 className="text-handbook-h1 text-white mb-4 leading-tight">
            {showBn && !showEn ? 'ইংরেজি ও বাংলায় .NET শিখুন' : 'Learn .NET in English & Bangla'}
          </h1>
          <LocalizedSplit
            columns="stack"
            className="mb-8"
            en={
              showEn ? (
                <p lang="en" className="text-lg text-slate-300 leading-relaxed">
                  A professional handbook for beginners and interview prep. Every important concept
                  includes clear English explanation, simple Bangla explanation, real-world analogy,
                  diagrams, and code.
                </p>
              ) : undefined
            }
            bn={
              showBn ? (
                <p lang="bn" className="text-lg text-slate-300 font-bengali leading-relaxed">
                  প্রতিটি গুরুত্বপূর্ণ টপিকে ইংরেজি ও বাংলায় সহজ ব্যাখ্যা, বাস্তব উদাহরণ, ডায়াগ্রাম ও
                  কোড — যাতে শুরু থেকেই .NET শেখা সহজ হয়।
                </p>
              ) : undefined
            }
          />
          <div className="flex flex-wrap gap-3">
            <Link
              to="/guide"
              className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-500 flex items-center gap-2 shadow-lg shadow-teal-950/30 transition-colors"
            >
              <BookOpen size={16} /> Start learning
            </Link>
            <Link
              to="/toc"
              className="bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-600 flex items-center gap-2 border border-slate-600 transition-colors"
            >
              <List size={16} /> Table of contents
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-slate-500/60 text-slate-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800/80 flex items-center gap-2 transition-colors"
            >
              <Download size={16} /> Print
            </button>
          </div>
          <div className="flex flex-wrap gap-6 border-t border-slate-700/80 pt-6 mt-8 text-xs uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} /> Full technical guide
            </span>
            <span className="flex items-center gap-2">
              <Globe size={14} /> English + Bangla
            </span>
            <span className="flex items-center gap-2">
              <Terminal size={14} /> Code examples
            </span>
          </div>
        </div>
        <Code2 className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-5 w-96 h-96" />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-handbook-h2">Study roadmap</h2>
          <span className="text-xs font-bold text-brand-cyan uppercase">2026 Edition</span>
        </div>
        <p className="text-base text-slate-600">
          Study in order. Each module builds on the previous one. Read both English and Bangla sections —
          they explain the same idea in different ways for better understanding.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ROADMAP.map((item) => (
            <Link
              key={item.step}
              to={`/${item.id}`}
              className="group bg-white p-6 border border-slate-200 rounded-xl hover:border-teal-600/40 transition-all hover:shadow-md"
            >
              <span className="text-4xl font-black text-slate-100 group-hover:text-teal-100">
                {String(item.step).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-teal-700">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
              <span className="mt-3 flex items-center gap-1 text-xs font-bold text-teal-600 opacity-0 group-hover:opacity-100">
                Open <ChevronRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="p-8 bg-slate-100 border border-slate-200 rounded-2xl">
        <LocalizedSplit
          columns="stack"
          en={
            showEn ? (
              <p lang="en" className="text-base text-slate-700">
                Every concept covers what it is, why it matters, how it works, when to use it, and a
                real-world example.
              </p>
            ) : undefined
          }
          bn={
            showBn ? (
              <p lang="bn" className="text-lg text-slate-800 font-bengali leading-relaxed italic">
                "প্রতিটি কনসেপ্ট শুধু সংজ্ঞা নয় — কী, কেন, কীভাবে, কখন ব্যবহার করবেন, এবং বাস্তব জীবনে
                কোথায় কাজে লাগে — এগুলোই এই হ্যান্ডবুক শেখায়।"
              </p>
            ) : undefined
          }
        />
      </div>
    </motion.div>
  );
}