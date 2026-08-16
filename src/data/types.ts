export type Difficulty = 'junior' | 'mid' | 'senior' | 'expert';

export type InterviewQ = {
  q: string;
  a: string;
  bangla?: string;
  followUp?: string;
  difficulty?: Difficulty;
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
  details?: string;
  code?: string;
  sql?: string;
  commonMistakes?: string[];
  bestPractices?: string[];
  tips?: string[];
  interviewQs?: (string | InterviewQ)[];
  practice?: string;
  difficulty?: Difficulty;
  subsections?: { title: string; code: string }[];
};

export type HandbookModule = {
  id: string;
  title: string;
  description: string;
  category?: string;
  sections?: HandbookSection[];
  tasks?: Array<{
    title: string;
    english?: string;
    bangla?: string;
    description?: string;
    code?: string;
  }>;
  revisionSummary?: string;
  summary?: string;
  interviewQuestions?: string[];
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
  { title: 'Production', ids: ['security', 'caching', 'messaging', 'jobs', 'distributed', 'testing', 'observability', 'devops'] },
  { title: 'Interview Prep', ids: ['systemdesign', 'frontend', 'tasks', 'scenarios', 'leadership', 'questionbank', 'traps', 'revision'] },
];
