export type Difficulty = 'junior' | 'mid' | 'senior' | 'expert';

export type LocalizedText = {
  en: string;
  bn: string;
};

export type ExplanationBlock = {
  summary?: LocalizedText;
  what?: LocalizedText;
  why?: LocalizedText;
  how?: LocalizedText;
  when?: LocalizedText;
  analogy?: LocalizedText;
  realWorld?: LocalizedText;
  quickSummary?: LocalizedText;
};

export type BilingualItem = {
  en: string;
  bn: string;
};

export type CalloutType =
  | 'important'
  | 'note'
  | 'tip'
  | 'warning'
  | 'mistake'
  | 'interview'
  | 'example';

export type Callout = {
  type: CalloutType;
  title?: LocalizedText;
  content: LocalizedText;
};

export type Diagram = {
  type: 'mermaid' | 'ascii';
  title?: LocalizedText;
  content: string;
  caption?: LocalizedText;
};

export type InterviewQ = {
  q: string | LocalizedText;
  a: string | LocalizedText;
  bangla?: string;
  followUp?: string | LocalizedText;
  difficulty?: Difficulty | string;
};

export type QuickRevision = {
  concepts: string[];
  questions: string[];
  mistakes: string[];
  scenarios: string[];
};

export type HandbookSection = {
  id?: string;
  topic?: string;
  title?: string;
  english?: string;
  content?: string;
  bangla?: string;
  explanation?: ExplanationBlock;
  details?: string | LocalizedText;
  comparisonTable?: LocalizedText;
  code?: string;
  sql?: string;
  codeExplanation?: LocalizedText;
  commonMistakes?: (string | BilingualItem)[];
  bestPractices?: (string | BilingualItem)[];
  tips?: (string | BilingualItem)[];
  callouts?: Callout[];
  diagram?: Diagram;
  interviewQs?: (string | InterviewQ)[];
  practice?: string | LocalizedText;
  difficulty?: Difficulty | string;
  subsections?: { title: string; code: string }[];
  layout?: 'default' | 'split';
  sectionNumber?: string;
  relatedSections?: string[];
  /** Coding task: clear problem statement */
  problem?: LocalizedText;
  /** Coding task: input → output example */
  example?: LocalizedText;
  /** Coding task: algorithm pattern / approach name */
  approach?: LocalizedText;
  /** Coding task: step-by-step solution walkthrough */
  solution?: LocalizedText;
  /** Coding task: time/space complexity */
  complexity?: LocalizedText;
};

export type HandbookModule = {
  id: string;
  title: string;
  description: string;
  category?: string;
  chapterNumber?: number;
  sections?: HandbookSection[];
  tasks?: Array<{
    title: string;
    english?: string;
    bangla?: string;
    description?: string;
    code?: string;
    explanation?: ExplanationBlock;
    problem?: LocalizedText;
    example?: LocalizedText;
    approach?: LocalizedText;
    solution?: LocalizedText;
    complexity?: LocalizedText;
  }>;
  revisionSummary?: string;
  summary?: string;
  interviewQuestions?: (string | InterviewQ)[];
  quickRevision?: QuickRevision;
};

export type NavGroup = {
  title: string;
  ids: string[];
};

export const NAV_GROUPS: NavGroup[] = [
  { title: 'Start Here', ids: ['guide'] },
  { title: 'C# Language', ids: ['basics', 'csharp', 'linq', 'async', 'dotnet10'] },
  { title: 'ASP.NET Platform', ids: ['aspnet', 'mvcore', 'di', 'webapi', 'apidocs'] },
  { title: 'Data', ids: ['database', 'sql'] },
  { title: 'Architecture', ids: ['architecture', 'patterns'] },
  { title: 'Production', ids: ['security', 'caching', 'messaging', 'jobs', 'distributed', 'testing', 'observability', 'logging', 'performance', 'devops'] },
  { title: 'Interview Prep', ids: ['systemdesign', 'frontend', 'problemsolving', 'algorithms', 'csharpproblems', 'bdinterview', 'tasks', 'scenarios', 'leadership', 'questionbank', 'traps', 'revision'] },
];
