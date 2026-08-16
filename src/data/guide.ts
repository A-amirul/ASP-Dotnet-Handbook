export const guideData = {
  id: 'guide',
  title: 'How to Use This Handbook',
  description: 'Study this as a Senior Engineer interview system: mindset, order, and how to answer Why → How → Trade-off → Failure.',
  sections: [
    {
      topic: 'Senior Engineer Mindset',
      difficulty: 'senior',
      english: 'A senior interview is not a trivia contest. Interviewers test whether you can make production decisions: why this design, what fails, how it scales, how you would debug it at 2am, and how you would explain the trade-off to a tech lead. Memorizing definitions gets you to mid-level. Explaining internals, failure modes, and alternatives gets you to senior.',
      bangla: 'সিনিয়র ইন্টারভিউতে শুধু সংজ্ঞা নয় — কেন এই ডিজাইন, কীভাবে ফেল করে, কীভাবে স্কেল হয়, প্রোডাকশনে কীভাবে ডিবাগ করবেন — এগুলোই যাচাই হয়।',
      details: `
### The answer frame you should use everywhere

| Layer | What you say | Example |
| :--- | :--- | :--- |
| **What** | Precise definition | "DbContext is a Unit of Work + identity map." |
| **Why** | Problem it solves | "Without tracking, SaveChanges cannot generate minimal UPDATEs." |
| **How** | Internals | "Snapshot vs original values, DetectChanges, SQL generation." |
| **When** | Use / avoid | "Scoped per HTTP request. Never Singleton." |
| **Trade-off** | Cost | "Tracking costs memory; AsNoTracking is faster for reads." |
| **Failure** | What goes wrong | "Captive dependency: Singleton holds a disposed Scoped context." |
| **Scale / Security** | Production | "Pool contexts, never log PII, use parameterized SQL." |

### What interviewers actually score
- Can you debug without guessing?
- Do you know when a pattern is overengineering?
- Can you protect correctness under concurrency?
- Can you design a system and then attack your own design?
- Can you mentor: explain clearly, without arrogance?
      `,
      commonMistakes: [
        'Answering only the definition and stopping.',
        'Name-dropping microservices / Kafka with no failure story.',
        'Treating every question as a coding puzzle instead of a production decision.',
      ],
      bestPractices: [
        'Always add: "The trade-off is…" and "I would verify with…".',
        'Prefer one real incident story over five buzzwords.',
        'If you do not know, say how you would investigate — that is senior behavior.',
      ],
      interviewQs: [
        {
          q: 'Why should we hire you as a Senior Engineer rather than a mid-level developer?',
          a: 'Because I do not stop at making it work. I can explain why a design exists, what it costs, how it fails in production, and how I would observe and recover it. I reduce risk: I review for correctness and operability, I mentor so the team ships without me, and I choose the simplest architecture that still meets the non-functionals.',
          bangla: 'শুধু কাজ করানো নয় — ট্রেড-অফ, ফেইলিউর মোড, অবজারভেবিলিটি এবং টিমকে স্কেল করাই সিনিয়র লেভেল।',
          followUp: 'Give one production incident you owned end-to-end.',
          difficulty: 'senior',
        },
      ],
      practice: 'Pick any topic you already know (e.g. async) and rewrite your answer using What / Why / How / Trade-off / Failure.',
      code: `// Senior answer skeleton (use this mentally, not as a script)
// 1. Define in one sentence
// 2. Name the problem it solves
// 3. Sketch internals
// 4. Give a real .NET example
// 5. State when NOT to use it
// 6. Describe the production failure mode
// 7. Say how you would detect it (logs, metrics, traces)`,
    },
    {
      topic: 'How to Study This Handbook',
      difficulty: 'mid',
      english: 'Do not jump randomly. Each phase unlocks the next. Finish C# memory and async before ASP.NET concurrency questions. Finish EF Core and SQL before system design storage choices. Finish distributed systems before microservices design interviews.',
      bangla: 'এলোমেলো পড়বেন না। প্রতিটা ফেজ পরের ফেজ আনলক করে — অ্যাসিঙ্ক না জেনে কনকারেন্সি, SQL না জেনে সিস্টেম ডিজাইন করা যায় না।',
      details: `
### Recommended order (do not skip)

| Phase | Module | Master before moving on |
| :--- | :--- | :--- |
| 1 | C# & OOP | Value vs ref, GC, SOLID, interface vs abstract |
| 2 | LINQ & Async | Deferred execution, IQueryable, deadlock, CancellationToken |
| 3 | ASP.NET Core | Pipeline order, DI lifetimes, filters, ProblemDetails |
| 4 | EF Core & SQL | Tracking, N+1, indexes, isolation levels |
| 5 | Architecture & Patterns | Clean Architecture, when NOT to use a pattern |
| 6 | Security | JWT vs cookie, OWASP, secrets |
| 7 | Redis & Messaging | Cache stampede, at-least-once, idempotency |
| 8 | Microservices | Saga, outbox, when NOT to split |
| 9 | Docker & Cloud | Multi-stage images, Key Vault, health checks |
| 10 | System Design | Requirements → bottlenecks → trade-offs |
| 11 | Coding | Arrays/HashMap + real senior tasks |
| 12 | Scenarios | 100 production stories |
| 13 | Mock interviews | Speak answers out loud, 45 minutes timed |

### Daily loop (90 minutes)
1. Read one section (20m)
2. Write the answer from memory (15m)
3. Implement the code sample (30m)
4. Answer 3 follow-up questions out loud (15m)
5. Note one production failure for that topic (10m)
      `,
      commonMistakes: [
        'Only reading, never speaking answers out loud.',
        'Skipping SQL because "EF Core generates it".',
        'Studying system design before you can explain a slow query.',
      ],
      bestPractices: [
        'Keep a "trap list": IEnumerable vs IQueryable, First vs Single, Task vs Thread.',
        'After each chapter, complete its Quick Revision box.',
        'Use Last-Day Revision only after you have finished phases 1–10.',
      ],
      interviewQs: [
        {
          q: 'How do you prepare for a senior interview in two weeks?',
          a: 'Week 1: C#, async, ASP.NET, EF, SQL — the questions that kill most candidates. Week 2: one system design per day, 20 production scenarios, security, and mock interviews. Drop trivia. Practice speaking trade-offs. Rehearse two incident stories and one architecture decision story.',
          bangla: 'দুই সপ্তাহে ট্রিভিয়া বাদ দিন — C#/async/EF/SQL, তারপর সিস্টেম ডিজাইন, সিনারিও এবং মক ইন্টারভিউ।',
          difficulty: 'senior',
        },
      ],
      practice: 'Create a 14-day calendar from the phase table and tick modules as you finish Quick Revision.',
    },
    {
      topic: 'How Senior Candidates Should Answer',
      difficulty: 'senior',
      english: 'Structure beats length. A 45-second precise answer with a trade-off beats a 4-minute dump. If the interviewer wants depth, they will ask a follow-up — that is why every important question in this handbook has a follow-up.',
      bangla: 'লম্বা উত্তর নয়, স্ট্রাকচার্ড উত্তর। ট্রেড-অফ বলুন, ফলো-আপের জন্য জায়গা রাখুন।',
      details: `
### Difficulty legend used in this handbook
- **Junior**: definition and basic usage
- **Mid**: internals and common pitfalls
- **Senior**: production trade-offs and failure modes
- **Expert**: architecture, scale, and multi-service impact

This handbook is weighted toward Senior and Expert.

### Questions senior candidates often get wrong
See the dedicated **Interview Traps** module. The short list: IEnumerable vs IQueryable, First vs Single, async vs parallelism, interface vs abstract class, Singleton vs Scoped, AsNoTracking vs tracking, JWT vs session, RabbitMQ vs Kafka, Redis vs database, monolith vs microservices.
      `,
      commonMistakes: [
        'Talking until you are interrupted instead of checking if the interviewer wants more.',
        'Giving only the happy path.',
      ],
      bestPractices: [
        'End with: "I can go deeper on internals or on the production incident — which do you want?"',
        'Quantify when you can: latency, cardinality, TTL, isolation level.',
      ],
      interviewQs: [
        {
          q: 'How do you handle a question you do not fully know?',
          a: 'State what you do know, mark the boundary, then describe how you would find the answer in production: docs, source, metrics, a spike. Never invent APIs. Interviewers hire judgment under uncertainty more than perfect recall.',
          bangla: 'যা জানেন বলুন, যা জানেন না স্বীকার করুন, তারপর কীভাবে খুঁজে বের করবেন সেটা বলুন — মিথ্যা API বানাবেন না।',
          difficulty: 'senior',
        },
      ],
      practice: 'Record yourself answering "What is IQueryable?" in 60 seconds using the answer frame.',
    },
  ],
  quickRevision: {
    concepts: [
      'What / Why / How / Trade-off / Failure / Scale',
      'Senior = production judgment, not trivia',
      'Study in phases; do not skip SQL',
      'Speak answers out loud',
      'Every pattern has a "when NOT to use"',
      'Follow-ups are where seniority shows',
      'Incident stories beat buzzwords',
      'Difficulty: Junior / Mid / Senior / Expert',
      'Last-day revision is a recap, not a first read',
      'Mock interviews are mandatory',
    ],
    questions: [
      'Why hire you as Senior?',
      'How do you make architectural decisions?',
      'How do you debug a production incident?',
      'How do you review code?',
      'How do you handle technical debt?',
      'How do you mentor juniors?',
      'When is microservices the wrong choice?',
      'How do you prepare in two weeks?',
      'What do you do when you do not know?',
      'How do you prioritize performance vs maintainability?',
    ],
    mistakes: [
      'Definition-only answers',
      'Skipping SQL and calling yourself senior',
      'Never practicing out loud',
      'Using every pattern in every design',
      'Hiding uncertainty instead of investigating',
    ],
    scenarios: [
      'Interviewer asks a topic you last used 3 years ago',
      'System design with incomplete requirements',
      'You disagree with the interviewer\'s preferred stack',
      'Take-home is over-engineered by default',
      'Panel asks you to attack your own design',
    ],
  },
  revisionSummary: `
- Use the **Why → How → Trade-off → Failure** frame on every topic.
- Follow the 13-phase order. Last-Day Revision is last, not first.
- Practice speaking. Senior interviews are oral system-design and incident skills.
  `,
  summary: 'This handbook is a training system for thinking like a Senior .NET engineer, not a glossary.',
};
