import type { HandbookSection } from './types';

/** Beginner-friendly bilingual patches for Problem Solving, Algorithms & C# DSA modules. Regen: node scripts/generate-coding-module-patches.mjs */
export const codingModulePatches: Record<string, Partial<HandbookSection>> = {
  'interview-framework': {
    explanation: {
      what: {
        en: `A **repeatable 6-step framework** (Understand → Match → Plan → Implement → Review → Evaluate) for every live coding question in a .NET interview.`,
        bn: `**.NET interview coding**-এর জন্য **৬ ধাপের framework** (Understand → Match → Plan → Implement → Review → Evaluate) — প্রতিবার একই।`,
      },
      why: {
        en: `Beginners panic and start typing random code. A framework **slows you down in a good way** — interviewers want to see your thinking, not a silent race to compile.`,
        bn: `Beginner panic করে random code টাইপ করে। Framework **ভালোভাবে slow** করে — interviewer আপনার **thinking** দেখতে চায়, silent typing নয়।`,
      },
      how: {
        en: `**U — Understand:** Repeat the question in your own words. Ask: null input? sorted? duplicates?

**M — Match:** Say the pattern: "This is Two Sum → Dictionary."

**P — Plan:** 3–5 bullet steps before code.

**I — Implement:** Clean C#, good names.

**R — Review:** Trace \`[2,7,11], target=9\` on paper.

**E — Evaluate:** "O(n) time, O(n) space."`,
        bn: `**U — Understand:** নিজের ভাষায় প্রশ্ন repeat; null? sorted? duplicate?

**M — Match:** Pattern বলুন: "Two Sum → Dictionary"

**P — Plan:** Code-এর আগে ৩–৫ bullet

**I — Implement:** Clean C#

**R — Review:** Paper-এ example trace

**E — Evaluate:** "O(n) time, O(n) space"`,
      },
      analogy: {
        en: `Like cooking with a **recipe card** — read ingredients first (Understand), pick the right pan (Match), write steps (Plan), then cook (Implement).`,
        bn: `**Recipe card**-এর মতো — আগে ingredients (Understand), pan বেছে নিন (Match), step লিখুন (Plan), তারপর cook।`,
      },
      realWorld: {
        en: `Senior .NET developers use the same structure in code reviews and incident debugging — clarify, hypothesize, plan, fix, verify, document impact.`,
        bn: `Senior .NET dev code review/incident-এ same structure — clarify, plan, fix, verify।`,
      },
    },
  },
  'pattern-cheat-sheet': {
    explanation: {
      what: {
        en: `A **pattern cheat sheet** maps problem **keywords** to the right C# tool: Dictionary, two pointers, stack, BFS, DP, etc.`,
        bn: `**Pattern cheat sheet** — problem-এর **keyword** দেখে সঠিক C# tool (Dictionary, two pointer, stack, BFS, DP…)।`,
      },
      why: {
        en: `Most interview problems are **variants of 10 patterns**. Recognizing the pattern in 30 seconds saves 15 minutes of wrong approaches.`,
        bn: `বেশিরভাগ problem **১০টা pattern-এর variant** — ৩০ সেকেন্ডে pattern চিনলে ১৫ মিনিট ভুল approach বাঁচে।`,
      },
      how: {
        en: `When you read the question, scan for signals:
- "pair / duplicate / frequency" → **Dictionary or HashSet**
- "sorted / palindrome" → **two pointers**
- "substring / window" → **sliding window**
- "brackets / undo" → **Stack**
- "shortest path / levels" → **BFS + Queue**
- "count ways / longest" → **DP**`,
        bn: `প্রশ্ন পড়ে signal scan:
- "pair/duplicate" → **Dictionary/HashSet**
- "sorted/palindrome" → **two pointer**
- "substring" → **sliding window**
- "bracket" → **Stack**
- "shortest path" → **BFS**
- "count ways" → **DP**`,
      },
      analogy: {
        en: `Like a **doctor's triage chart** — fever + cough suggests one treatment, broken bone suggests another. Symptoms → pattern → tool.`,
        bn: `**Doctor triage**-এর মতো — symptom দেখে treatment; problem signal → pattern → tool।`,
      },
      realWorld: {
        en: `In ASP.NET services: dedup with HashSet, rate-limit windows, bracket validation in expression parsers — same patterns as interview tasks.`,
        bn: `ASP.NET-এ HashSet dedup, sliding window rate limit — interview pattern-ই production-এ।`,
      },
    },
  },
  'string-array-problems': {
    explanation: {
      what: {
        en: `**String and array tasks** — the most common live coding questions for .NET developers (Two Sum, palindrome, anagram, FizzBuzz, etc.).`,
        bn: `**String ও array task** — .NET developer interview-এ সবচেয়ে common live coding (Two Sum, palindrome, anagram…)।`,
      },
      why: {
        en: `These test basic C# fluency before API/EF questions. If you fail FizzBuzz or Two Sum, the interview often stops early.`,
        bn: `API/EF-এর আগে basic C# fluency test। FizzBuzz/Two Sum fail করলে interview often early stop।`,
      },
      how: {
        en: `Master this order as a beginner:
1) FizzBuzz (loops)
2) Two Sum (Dictionary)
3) Valid Palindrome (two pointers)
4) Valid Anagram (frequency)
5) Remove duplicates (two pointers in-place)

For each: code it, explain complexity, explain one edge case.`,
        bn: `Beginner order:
1) FizzBuzz
2) Two Sum
3) Palindrome
4) Anagram
5) Remove duplicates

প্রতিটিতে code + complexity + edge case।`,
      },
      analogy: {
        en: `Like learning guitar **chords** before songs — these tasks are the chords of coding interviews.`,
        bn: `Guitar **chords**-এর মতো — interview coding-এর base building blocks।`,
      },
      realWorld: {
        en: `String parsing in controllers, CSV imports, log line processing — same array/string skills.`,
        bn: `Controller string parse, CSV import — same skill।`,
      },
    },
  },
  'collection-linq-problems': {
    explanation: {
      what: {
        en: `**Collection and LINQ tasks** test practical .NET skills: grouping, top-N, merging, and **money calculations** with \`decimal\`.`,
        bn: `**Collection ও LINQ task** — group, top-N, merge, **\`decimal\`** দিয়ে money calculation।`,
      },
      why: {
        en: `Many companies prefer "can you write service-layer logic?" over pure LeetCode hard. Shopping cart and group-by problems mirror real tickets.`,
        bn: `অনেক company LeetCode hard-এর চেয়ে service-layer logic চায় — shopping cart/group-by real ticket-এর মতো।`,
      },
      how: {
        en: `**Group anagrams:** sort letters as key → Dictionary.
**Top K:** count then OrderByDescending.Take(k).
**Shopping cart:** discount → shipping → tax, always \`decimal\`.

Say in interview: "I use LINQ for readability here; if performance critical I would use a single-pass loop."`,
        bn: `**Group anagrams:** letter sort = key → Dictionary
**Top K:** count → OrderByDescending.Take(k)
**Cart:** discount → shipping → tax, \`decimal\`

Interview-তে LINQ vs loop trade-off বলুন।`,
      },
      analogy: {
        en: `Like organizing a **warehouse** — group same items (anagrams), pick top sellers (top K), calculate invoice total (cart).`,
        bn: `**Warehouse** organize — same item group, top seller, invoice total।`,
      },
      realWorld: {
        en: `E-commerce checkout, reporting dashboards, and EF GroupBy projections — direct job skills.`,
        bn: `E-commerce checkout, report dashboard — direct job skill।`,
      },
    },
  },
  'big-o-complexity': {
    explanation: {
      what: {
        en: `**Big O notation** describes how runtime or memory **grows** when input size increases — e.g. O(n) doubles work when data doubles.`,
        bn: `**Big O** — input বড় হলে time/memory **কত দ্রুত বাড়ে** (যেমন O(n) = data double → work double)।`,
      },
      why: {
        en: `Interviewers ask "can you optimize?" — you need Big O to compare nested loop O(n²) vs Dictionary O(n). Also explains why \`List.Contains\` in a loop is slow.`,
        bn: `Optimize করতে Big O লাগে — nested loop O(n²) vs Dictionary O(n)। \`List.Contains\` loop-এ slow কেন explain।`,
      },
      how: {
        en: `**Beginner rules:**
- One loop → O(n)
- Loop inside loop → O(n²)
- Halving each step (binary search) → O(log n)
- Sort → O(n log n)

Always say **both** time and space. Example: "Dictionary lookup O(1) average, but O(n) extra space for the map."`,
        bn: `**Rules:** এক loop O(n), nested O(n²), half each step O(log n), sort O(n log n)। **Time + space** দুটো বলুন।`,
      },
      analogy: {
        en: `O(n) = checking **every house** on a street. O(log n) = **phone book** lookup. O(1) = knowing exactly which drawer a file is in.`,
        bn: `O(n) = street-এ **প্রতি house**। O(log n) = **phone book**। O(1) = exact drawer জানা।`,
      },
      realWorld: {
        en: `Choosing HashSet vs List for Contains, indexing SQL columns, caching — all Big O decisions in production .NET.`,
        bn: `HashSet vs List, SQL index, cache — production Big O decision।`,
      },
    },
  },
  'sorting-searching': {
    explanation: {
      what: {
        en: `**Sorting** arranges data in order; **searching** finds an item — binary search requires sorted data and runs in O(log n).`,
        bn: `**Sorting** = order; **searching** = খোঁজা — binary search sorted data-তে O(log n)।`,
      },
      why: {
        en: `You will use \`Array.Sort\` and LINQ \`OrderBy\` daily. Interviewers want you to **implement binary search** once to prove you understand halves, not magic.`,
        bn: `\`Array.Sort\`, \`OrderBy\` daily use — binary search **implement** করে half-এর logic prove করুন।`,
      },
      how: {
        en: `Binary search loop invariant: answer is always between \`lo\` and \`hi\`.
- If \`nums[mid] < target\` → search right half (\`lo = mid + 1\`)
- Else → search left half (\`hi = mid - 1\`)

Use \`mid = lo + (hi - lo) / 2\` to avoid overflow discussion.`,
        bn: `Answer সবসময় \`lo\`–\`hi\` মধ্যে। ছোট → ডানে, বড় → বামে। \`mid = lo + (hi-lo)/2\`।`,
      },
      analogy: {
        en: `Sorting = arranging books A–Z on a shelf. Binary search = opening the middle of a phone book.`,
        bn: `Sort = bookshelf A–Z। Binary search = phone book middle খোলা।`,
      },
      realWorld: {
        en: `Paged API with sorted IDs, database indexes (B-tree ≈ binary search idea), log timestamp lookup.`,
        bn: `Sorted API pagination, DB index, log lookup।`,
      },
    },
  },
  'linked-list-stack-queue': {
    explanation: {
      what: {
        en: `**Linked list** nodes point to next; **stack** = LIFO (last in first out); **queue** = FIFO (first in first out).`,
        bn: `**Linked list** = node chain; **stack** LIFO; **queue** FIFO।`,
      },
      why: {
        en: `Reverse list and cycle detection test **pointer thinking**. Stack solves brackets. Queue + BFS comes next in graphs.`,
        bn: `List reverse/cycle = **pointer thinking**। Stack = bracket। Queue = BFS-এর base।`,
      },
      how: {
        en: `**Reverse list:** 3 pointers \`prev\`, \`curr\`, \`next\` — flip links one by one.
**Cycle:** slow (+1 step), fast (+2 steps) — if they meet, cycle exists.
**Queue from 2 stacks:** push to \`in\`, pop from \`out\`, move when \`out\` empty.`,
        bn: `**Reverse:** prev/curr/next flip
**Cycle:** slow/fast meet = cycle
**Queue:** 2 stack in/out`,
      },
      analogy: {
        en: `Stack = stack of plates (take top). Queue = cinema line (first come first served). Linked list = treasure hunt with "next clue" addresses.`,
        bn: `Stack = plate stack। Queue = cinema line। Linked list = "next clue" chain।`,
      },
      realWorld: {
        en: `Undo stack in editors, message queues in RabbitMQ, linked structures in low-level memory (less common in daily C#).`,
        bn: `Editor undo stack, RabbitMQ queue।`,
      },
    },
  },
  'trees-graphs': {
    explanation: {
      what: {
        en: `A **tree** has one root and no cycles; a **graph** has nodes and edges (may cycle). **BFS** uses Queue (levels); **DFS** goes deep first.`,
        bn: `**Tree** = one root, no cycle; **graph** = node+edge (cycle হতে পারে)। **BFS** Queue; **DFS** deep first।`,
      },
      why: {
        en: `Org charts, file folders, UI components, and dependency graphs are trees/graphs. Mid-level .NET interviews often ask level-order or "is there a path?"`,
        bn: `Org chart, folder, UI tree, dependency graph — mid interview level-order / path question।`,
      },
      how: {
        en: `**BFS:** Queue, mark visited, dequeue, enqueue neighbors.
**DFS:** recurse (or stack) — go deep, backtrack.
**Level order:** BFS but process queue size at each level.

Pick BFS for **shortest path** (unweighted); DFS for **explore all / cycle**.`,
        bn: `**BFS:** Queue + visited
**DFS:** recurse/stack
**Level:** BFS + level size

Shortest → BFS; explore/cycle → DFS`,
      },
      analogy: {
        en: `BFS = ripples in water (nearest first). DFS = exploring one maze path until dead end, then backtrack.`,
        bn: `BFS = পানির ripple। DFS = maze-এ এক path deep, backtrack।`,
      },
      realWorld: {
        en: `Folder traversal, permission inheritance, microservice dependency resolution.`,
        bn: `Folder traverse, permission tree, service dependency।`,
      },
    },
  },
  'dynamic-programming': {
    explanation: {
      what: {
        en: `**Dynamic Programming (DP)** saves answers to subproblems so you never recompute the same thing — used for "count ways", "longest", "minimum cost".`,
        bn: `**DP** — subproblem-এর answer save, same কাজ repeat নয় — "count ways", "longest", "min cost"।`,
      },
      why: {
        en: `Naive Fibonacci is O(2ⁿ). DP reduces to O(n). Interviewers use DP to test if you can define **state** and **transition**.`,
        bn: `Naive Fibonacci O(2ⁿ) → DP O(n)। **State** ও **transition** define করতে পারেন কিনা test।`,
      },
      how: {
        en: `**Steps for beginners:**
1) Define \`dp[i]\` meaning in one sentence.
2) Write recurrence (how dp[i] relates to smaller indices).
3) Base case (dp[0], dp[1]).
4) Fill bottom-up OR memoize top-down.

Example stairs: \`dp[i] = dp[i-1] + dp[i-2]\` (ways to reach step i).`,
        bn: `1) \`dp[i]\` meaning এক বাক্য
2) Recurrence
3) Base case
4) Bottom-up বা memo

Stairs: \`dp[i]=dp[i-1]+dp[i-2]\``,
      },
      analogy: {
        en: `Like climbing stairs and **writing on each step** how many ways you could reach it — don't recount from ground every time.`,
        bn: `Stairs-এ **প্রতি step-এ** way count লিখে রাখা — ground থেকে আবার count নয়।`,
      },
      realWorld: {
        en: `Resource allocation, pricing tiers, caching computed reports — anywhere overlapping sub-calculations appear.`,
        bn: `Resource allocation, pricing tier — overlapping calculation।`,
      },
    },
  },
  'advanced-patterns': {
    explanation: {
      what: {
        en: `**Sliding window** maintains a range \`[left,right]\`; **heap** keeps top K; **Trie** stores strings by prefix for fast prefix search.`,
        bn: `**Sliding window** range \`[left,right]\`; **heap** top K; **Trie** prefix search।`,
      },
      why: {
        en: `Mid/senior .NET interviews ask substring problems (window), "Kth largest" (heap), and autocomplete-style questions (Trie).`,
        bn: `Mid/senior: substring (window), Kth largest (heap), autocomplete (Trie)।`,
      },
      how: {
        en: `**Window:** expand \`right\` until invalid, shrink \`left\` until valid, update answer.
**Top K:** min-heap size K — if heap bigger than K, pop smallest.
**Trie:** each node has \`Dictionary<char, Node>\` children.`,
        bn: `**Window:** right expand, left shrink
**Top K:** min-heap size K
**Trie:** char → child map`,
      },
      analogy: {
        en: `Sliding window = a **movable camera frame** on a long string. Heap = keeping only the **K tallest** people in a crowd.`,
        bn: `Window = string-এ **চলমান frame**। Heap = **K tallest** রাখা।`,
      },
      realWorld: {
        en: `Rate limiting windows, streaming top-N metrics, search autocomplete in admin UIs.`,
        bn: `Rate limit window, top-N metric, search autocomplete।`,
      },
    },
  },
  'csharp-data-structures': {
    explanation: {
      what: {
        en: `**C# BCL collections** mapped to classic data structures — Dictionary, HashSet, Stack, Queue, PriorityQueue, List — and when to pick each in a live interview.`,
        bn: `**C# BCL collection** → classic data structure map — Dictionary, HashSet, Stack, Queue, PriorityQueue — interview-তে কখন কোনটা।`,
      },
      why: {
        en: `.NET interviews expect you to use built-in types, not implement a hash table from scratch. Choosing the wrong type (List.Contains in a loop) is a common fail signal.`,
        bn: `.NET interview-তে BCL type expected — ভুল type (loop-এ List.Contains) common fail signal।`,
      },
      how: {
        en: `Memorize: **pair/count → Dictionary**; **exists/dedup → HashSet**; **brackets/RPN → Stack**; **shortest path → Queue BFS**; **top K → PriorityQueue**; **build output → List**.`,
        bn: `**pair/count → Dictionary**; **exists → HashSet**; **bracket → Stack**; **shortest path → Queue**; **top K → PriorityQueue**; **output → List**।`,
      },
      analogy: {
        en: `Like a **toolbox** — screwdriver vs hammer; each collection is a tool for a specific job.`,
        bn: `**Toolbox**-এর মতো — screwdriver vs hammer; প্রতি collection এক job।`,
      },
      realWorld: {
        en: `ASP.NET services use the same types: HashSet for dedup, Dictionary for caches, Queue for background work.`,
        bn: `ASP.NET-এ HashSet dedup, Dictionary cache, Queue background work — same types।`,
      },
    },
  },
  'dsa-by-structure': {
    explanation: {
      what: {
        en: `**Practice buckets** grouped by data structure — all Dictionary problems, all Stack problems — so you recognize the pattern instantly.`,
        bn: `**Structure অনুযায়ী bucket** — সব Dictionary problem একসাথে — pattern instantly চিনুন।`,
      },
      why: {
        en: `When you see "valid parentheses", you should think Stack in under 5 seconds. Structure-first study builds that reflex.`,
        bn: `"Valid parentheses" দেখলে ৫ সেকেন্ডে Stack — structure-first study reflex বানায়।`,
      },
      how: {
        en: `Each week pick one bucket: Week 1 Dictionary/HashSet, Week 2 Stack/Queue, Week 3 trees/graphs, Week 4 DP + LINQ. Code 2–3 problems per bucket in C#.`,
        bn: `প্রতি week এক bucket: Week 1 Dictionary, Week 2 Stack/Queue, Week 3 tree/graph, Week 4 DP+LINQ — bucket-এ ২–৩ problem C#।`,
      },
      analogy: {
        en: `Like sorting your **flashcards by color** — red = hash map, blue = stack — faster recall under pressure.`,
        bn: `**Flashcard color sort** — red = hash map, blue = stack — pressure-এ দ্রুত recall।`,
      },
      realWorld: {
        en: `Production code also clusters by structure: parsers use stacks, caches use dictionaries, schedulers use queues.`,
        bn: `Production: parser → stack, cache → dictionary, scheduler → queue।`,
      },
    },
  },
  'linq-machine-test': {
    explanation: {
      what: {
        en: `**LINQ and collection tasks** common in .NET machine tests: GroupBy, OrderBy, Top N, SelectMany, Skip/Take pagination.`,
        bn: `**.NET machine test**-এ common LINQ: GroupBy, OrderBy, Top N, SelectMany, Skip/Take pagination।`,
      },
      why: {
        en: `Mid-level .NET roles often test "can you transform in-memory data like a service method?" — not just LeetCode hard.`,
        bn: `Mid-level .NET role "service method-এর মতো data transform?" test করে — শুধু LeetCode hard নয়।`,
      },
      how: {
        en: `Readability: LINQ chain with meaningful names. Performance: mention single-pass Dictionary alternative. Always know deferred vs immediate (ToList forces execution).`,
        bn: `Readability: LINQ chain; performance: single-pass Dictionary mention; deferred vs immediate (ToList execute) জানুন।`,
      },
      analogy: {
        en: `LINQ is like **Excel pivot tables** on in-memory objects — group, filter, sort without manual loops.`,
        bn: `LINQ = in-memory object-এ **Excel pivot** — group, filter, sort।`,
      },
      realWorld: {
        en: `Reporting APIs, admin dashboards, and unit tests on service-layer aggregation logic.`,
        bn: `Report API, admin dashboard, service aggregation unit test।`,
      },
    },
  },
  'dotnet-coding-patterns': {
    explanation: {
      what: {
        en: `**.NET-specific coding patterns**: CSV parsing, email validation, decimal money, pagination, null guards — typical mid-level machine test tasks.`,
        bn: `**.NET-specific pattern**: CSV parse, email validate, decimal money, pagination, null guard — mid-level machine test।`,
      },
      why: {
        en: `These tasks prove you can write production-quality C# — not just algorithm trivia. Interviewers watch naming, edge cases, and decimal vs double.`,
        bn: `Production-quality C# proof — naming, edge case, decimal vs double watch করা হয়।`,
      },
      how: {
        en: `Template: validate input → parse/transform → compute with decimal where money → return record/DTO. Use StringBuilder for large strings, TryParse instead of Parse.`,
        bn: `Template: validate → parse → decimal compute → record return; StringBuilder, TryParse।`,
      },
      analogy: {
        en: `Like a **checkout form** — validate email, parse line items, calculate tax with correct rounding.`,
        bn: `**Checkout form** — email validate, line parse, tax decimal rounding।`,
      },
      realWorld: {
        en: `Import pipelines, invoice services, API input validation in ASP.NET controllers.`,
        bn: `Import pipeline, invoice service, ASP.NET validation।`,
      },
    },
  },
  'study-path-dsa-csharp': {
    explanation: {
      what: {
        en: `A **4-week study path** combining Problem Solving, Algorithms, and this C# DSA module for .NET interview readiness.`,
        bn: `**৪ সপ্তাহ study path** — Problem Solving + Algorithms + C# DSA module .NET interview ready।`,
      },
      why: {
        en: `Random LeetCode grinding wastes time. Following handbook order builds foundations before trees/graphs/DP.`,
        bn: `Random LeetCode time waste — handbook order foundation আগে tree/graph/DP।`,
      },
      how: {
        en: `Week 1: arrays + Dictionary (Problem Solving). Week 2: Stack/Queue + two pointers. Week 3: trees/graphs (Algorithms). Week 4: LINQ + .NET tasks (this module). 45 min/day: read → code → explain complexity.`,
        bn: `Week 1: array+Dictionary; Week 2: Stack+two pointer; Week 3: tree/graph; Week 4: LINQ+.NET task; ৪৫ min/day।`,
      },
      analogy: {
        en: `Like a **gym program** — leg day, push day — structure beats random exercises.`,
        bn: `**Gym program** — leg day, push day — structure random exercise-এর চেয়ে ভালো।`,
      },
      realWorld: {
        en: `Matches how teams onboard: basics → web → data → then system design and coding screens.`,
        bn: `Team onboard flow match: basics → web → data → system design + coding।`,
      },
    },
  },
  'bd-scenarios-production': {
    explanation: {
      what: {
        en: `**Production scenarios 1–20** from BD .NET interviews: slow API, deadlock, payroll, Redis/MQ failure, SARGable SQL, memory leak.`,
        bn: `**Production scenario 1–20** — slow API, deadlock, payroll, Redis/MQ, SARGable SQL, memory leak।`,
      },
      why: {
        en: `BD companies test systematic investigation — not memorized "add Redis."`,
        bn: `BD company investigation test — Redis মুখস্থ নয়।`,
      },
      how: {
        en: `**Understand → Measure → Fix → Verify → Prevent.** Never guess the bottleneck.`,
        bn: `**Understand → Measure → Fix → Verify → Prevent.**`,
      },
      analogy: {
        en: `Doctor: symptoms → tests → diagnosis → treatment.`,
        bn: `ডাক্তার: symptom → test → diagnosis → treatment।`,
      },
      realWorld: {
        en: `ERP/HRM: employee list, payroll, attendance — daily BD project patterns.`,
        bn: `ERP: employee, payroll, attendance — BD project pattern।`,
      },
    },
  },
  'bd-learning-path': {
    explanation: {
      what: {
        en: `**Study map** — which module to read for each topic. BD Interview module is scenarios only; no duplicate C#/SQL Q&A.`,
        bn: `**Study map** — কোন topic কোন module-এ। BD Interview = শুধু scenario, duplicate Q&A নেই।`,
      },
      why: {
        en: `Reading the same topic twice wastes time and confuses answers. Follow sidebar order.`,
        bn: `Duplicate topic সময় নষ্ট — sidebar order follow করুন।`,
      },
      how: {
        en: `C# → Web → Database → Architecture → DevOps → Problem Solving → Interview Practice.`,
        bn: `C# → Web → Database → Architecture → DevOps → Coding → Interview।`,
      },
      analogy: {
        en: `Like a school syllabus — one textbook per subject, in term order.`,
        bn: `School syllabus — এক subject এক book, term order।`,
      },
      realWorld: {
        en: `Interview prep in 4 weeks: one phase per week, not random modules.`,
        bn: `৪ week prep — প্রতি week এক phase।`,
      },
    },
  },
  '1-fizzbuzz-classic-warm-up': {
    problem: {
      en: `Print numbers from **1 to n**. Replace multiples of 3 with \`"Fizz"\`, multiples of 5 with \`"Buzz"\`, and multiples of both with \`"FizzBuzz"\`.`,
      bn: `**১ থেকে n** পর্যন্ত print করুন। ৩-এর গুণিতক → \`"Fizz"\`, ৫-এর → \`"Buzz"\`, উভয় → \`"FizzBuzz"\`।`,
    },
    example: {
      en: `**Input:** \`n = 5\`
**Output:** \`["1", "2", "Fizz", "4", "FizzBuzz"]\`

**Input:** \`n = 15\` → last item must be \`"FizzBuzz"\`, not \`"Fizz"\`.`,
      bn: `**Input:** \`n = 5\`
**Output:** \`["1", "2", "Fizz", "4", "FizzBuzz"]\`

**Input:** \`n = 15\` → শেষে \`"FizzBuzz"\` হতে হবে, \`"Fizz"\` নয়।`,
    },
    approach: {
      en: `**Pattern:** Loop + modulo (\`%\`). Check **15 first**, then 3, then 5.`,
      bn: `**Pattern:** Loop + modulo। **আগে 15**, তারপর ৩, তারপর ৫।`,
    },
    solution: {
      en: `1. Create \`List<string>\` result.
2. Loop \`i\` from 1 to n.
3. If \`i % 15 == 0\` → add \`"FizzBuzz"\`.
4. Else if \`i % 3 == 0\` → \`"Fizz"\`.
5. Else if \`i % 5 == 0\` → \`"Buzz"\`.
6. Else add \`i.ToString()\`.
7. Return list.

**Detailed steps:**
1) Loop \`i\` from 1 to n.
2) Check **15 first** (3×5) → "FizzBuzz".
3) Else check 3 → "Fizz", 5 → "Buzz".
4) Else add \`i.ToString()\`.

**Why 15 first?** If you check 3 before 15, you will wrongly print "Fizz" instead of "FizzBuzz" for 15, 30, …`,
      bn: `1. \`List<string>\` result।
2. \`i\` = 1..n loop।
3. \`i % 15 == 0\` → \`"FizzBuzz"\`।
4. \`i % 3 == 0\` → \`"Fizz"\`।
5. \`i % 5 == 0\` → \`"Buzz"\`।
6. না হলে number string।
7. Return list।

**বিস্তারিত:**
1) \`i\` = 1 থেকে n loop।
2) **আগে 15** check (৩×৫) → "FizzBuzz"।
3) না হলে ৩ → "Fizz", ৫ → "Buzz"।
4) না হলে \`i.ToString()\`।

**১৫ আগে কেন?** ৩ আগে check করলে ১৫-এ ভুল করে "Fizz" হবে।`,
    },
    complexity: {
      en: `**Time:** O(n) — one pass.
**Space:** O(n) — output list.`,
      bn: `**Time:** O(n)
**Space:** O(n) — output list`,
    },
    explanation: {
      what: {
        en: `**FizzBuzz** prints numbers 1 to n, but replaces multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".`,
        bn: `**FizzBuzz** ১ থেকে n পর্যন্ত সংখ্যা print করে, তবে ৩-এর গুণিতকে "Fizz", ৫-এর "Buzz", উভয়ের "FizzBuzz" লেখে।`,
      },
      why: {
        en: `Interviewers use this as a **warm-up** to see if you can write clean loops and handle multiple conditions in the right order — before harder problems.`,
        bn: `Interview-তে এটা **warm-up** — loop, condition এবং **সঠিক order** বোঝায় কিনা দেখার জন্য।`,
      },
      how: {
        en: `1) Loop \`i\` from 1 to n.
2) Check **15 first** (3×5) → "FizzBuzz".
3) Else check 3 → "Fizz", 5 → "Buzz".
4) Else add \`i.ToString()\`.

**Why 15 first?** If you check 3 before 15, you will wrongly print "Fizz" instead of "FizzBuzz" for 15, 30, …`,
        bn: `1) \`i\` = 1 থেকে n loop।
2) **আগে 15** check (৩×৫) → "FizzBuzz"।
3) না হলে ৩ → "Fizz", ৫ → "Buzz"।
4) না হলে \`i.ToString()\`।

**১৫ আগে কেন?** ৩ আগে check করলে ১৫-এ ভুল করে "Fizz" হবে।`,
      },
      analogy: {
        en: `Like a traffic light with a special rule: when **both** conditions apply (3 and 5), the special "FizzBuzz" sign wins over the single Fizz or Buzz signs.`,
        bn: `Traffic light-এর মতো — **দুটো rule একসাথে** মিললে সবচেয়ে specific rule (FizzBuzz) আগে।`,
      },
      realWorld: {
        en: `Same pattern as business rules: "if VIP **and** birthday → double discount" — **most specific rule first**, then general rules.`,
        bn: `Business rule: "VIP **এবং** birthday" → double discount — **specific rule আগে**।`,
      },
    },
    commonMistakes: [
      { en: `Checking 3 before 15`, bn: `Say aloud: "I check 15 first to avoid the FizzBuzz bug."` },
      { en: `Using print instead of returning List<string>`, bn: `Using print instead of returning List<string>` },
    ],
    bestPractices: [
      { en: `Say aloud: "I check 15 first to avoid the FizzBuzz bug."`, bn: `Say aloud: "I check 15 first to avoid the FizzBuzz bug."` },
    ],
  },
  '2-two-sum-hash-map-1-classic': {
    problem: {
      en: `Given integer array \`nums\` and integer \`target\`, return **indices** of two numbers that add up to \`target\`. Exactly one answer exists.`,
      bn: `\`nums\` array ও \`target\` দিয়ে এমন **দুটি index** return করুন যাদের value-এর যোগ \`target\`।`,
    },
    example: {
      en: `**Input:** \`nums = [2, 7, 11, 15]\`, \`target = 9\`
**Output:** \`[0, 1]\` because \`nums[0] + nums[1] = 2 + 7 = 9\``,
      bn: `**Input:** \`nums = [2, 7, 11, 15]\`, \`target = 9\`
**Output:** \`[0, 1]\` কারণ \`2 + 7 = 9\``,
    },
    approach: {
      en: `**Pattern:** Hash map (\`Dictionary\`). Store \`value → index\`. For each number, check if \`target - num\` exists.`,
      bn: `**Pattern:** \`Dictionary\` — \`value → index\` store; \`target - num\` আছে কিনা check।`,
    },
    solution: {
      en: `1. Empty \`Dictionary<int,int> map\`.
2. For each index \`i\` and value \`nums[i]\`:
   - \`need = target - nums[i]\`
   - If \`map\` contains \`need\` → return \`[map[need], i]\`
   - Else \`map[nums[i]] = i\`
3. No pair → throw or return empty.

**Detailed steps:**
1) Create empty \`Dictionary<int,int>\` mapping **value → index**.
2) For each \`nums[i]\`, compute \`need = target - nums[i]\`.
3) If \`need\` is already in the map, return \`[map[need], i]\`.
4) Else store \`nums[i] → i\`.

**Walkthrough:** nums=[2,7,11], target=9
- i=0: need=7, map empty → store 2→0
- i=1: need=2, map has 2 at index 0 → return [0,1]`,
      bn: `1. খালি Dictionary।
2. প্রতি \`i\`: \`need = target - nums[i]\`
   - map-এ \`need\` থাকলে \`[map[need], i]\` return
   - না হলে \`map[nums[i]] = i\`
3. না পেলে error।

**বিস্তারিত:**
1) খালি \`Dictionary<int,int>\` — **value → index**।
2) প্রতি \`nums[i]\`-এ \`need = target - nums[i]\`।
3) \`need\` map-এ থাকলে \`[map[need], i]\` return।
4) না হলে \`nums[i] → i\` store।

**উদাহরণ:** [2,7,11], target=9 → index [0,1]`,
    },
    complexity: {
      en: `**Time:** O(n)
**Space:** O(n) for Dictionary`,
      bn: `**Time:** O(n)
**Space:** O(n)`,
    },
    explanation: {
      what: {
        en: `**Two Sum**: given an array and a target number, find **two indices** whose values add up to the target.`,
        bn: `**Two Sum**: array ও target দিয়ে **দুটি index** খুঁজুন যাদের যোগ target।`,
      },
      why: {
        en: `This is the #1 pattern for "find a pair" problems. It teaches **Dictionary** usage — core skill for .NET developers working with lookups and caching.`,
        bn: `"Pair খুঁজুন" pattern-এর #১ — **Dictionary** শেখায়, .NET-এ lookup/cache-এর base।`,
      },
      how: {
        en: `1) Create empty \`Dictionary<int,int>\` mapping **value → index**.
2) For each \`nums[i]\`, compute \`need = target - nums[i]\`.
3) If \`need\` is already in the map, return \`[map[need], i]\`.
4) Else store \`nums[i] → i\`.

**Walkthrough:** nums=[2,7,11], target=9
- i=0: need=7, map empty → store 2→0
- i=1: need=2, map has 2 at index 0 → return [0,1]`,
        bn: `1) খালি \`Dictionary<int,int>\` — **value → index**।
2) প্রতি \`nums[i]\`-এ \`need = target - nums[i]\`।
3) \`need\` map-এ থাকলে \`[map[need], i]\` return।
4) না হলে \`nums[i] → i\` store।

**উদাহরণ:** [2,7,11], target=9 → index [0,1]`,
      },
      analogy: {
        en: `Like finding a friend in a party who has the **exact money** you need to reach the bill total — you remember who you already met (hash map) instead of asking everyone again.`,
        bn: `Party-তে bill মেটাতে **ঠিক কত টাকা** দরকার — আগে যাদের দেখেছেন map-এ রাখুন, আবার সবাইকে জিজ্ঞেস নয়।`,
      },
      realWorld: {
        en: `Same idea as matching invoice lines to payments, or finding two API keys that hash to a required checksum.`,
        bn: `Invoice line ↔ payment match — একই lookup idea।`,
      },
    },
    commonMistakes: [
      { en: `Nested loop O(n²) without mentioning optimization`, bn: `Say: O(n) time, O(n) space for the Dictionary` },
      { en: `Returning values instead of indices`, bn: `Returning values instead of indices` },
    ],
    bestPractices: [
      { en: `Say: O(n) time, O(n) space for the Dictionary`, bn: `Say: O(n) time, O(n) space for the Dictionary` },
    ],
  },
  '3-valid-palindrome': {
    problem: {
      en: `Return \`true\` if string is a palindrome, ignoring non-alphanumeric characters and case.`,
      bn: `Non-alphanumeric ও case ignore করে palindrome হলে \`true\`।`,
    },
    example: {
      en: `**Input:** \`"A man, a plan, a canal: Panama"\` → **Output:** \`true\``,
      bn: `**Input:** \`"A man, a plan, a canal: Panama"\` → **Output:** \`true\``,
    },
    approach: {
      en: `**Pattern:** Two pointers from both ends, skip invalid chars.`,
      bn: `**Pattern:** Two pointer — দুই প্রান্ত, invalid char skip।`,
    },
    solution: {
      en: `1. \`left=0\`, \`right=Length-1\`.
2. Skip non letter/digit on both sides.
3. Compare lowercase; mismatch → false.
4. Move inward until \`left >= right\`.

**Detailed steps:**
1) \`left = 0\`, \`right = s.Length - 1\`.
2) Move \`left\` right while char is not letter/digit.
3) Move \`right\` left while char is not letter/digit.
4) Compare lowercased chars; if different → false.
5) Move both inward until \`left >= right\`.`,
      bn: `1. left/right
2. invalid skip
3. lowercase compare
4. inward move

**বিস্তারিত:**
1) \`left=0\`, \`right=শেষ\`।
2) letter/digit না হলে pointer সরান।
3) lowercase compare — mismatch হলে false।
4) \`left >= right\` পর্যন্ত।`,
    },
    complexity: {
      en: `**Time:** O(n)
**Space:** O(1)`,
      bn: `**Time:** O(n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Valid Palindrome**: check if a string reads the same forward and backward, ignoring spaces, punctuation, and letter case.`,
        bn: `**Valid Palindrome**: string সামনে-পেছনে একই কিনা — space, punctuation, case ignore।`,
      },
      why: {
        en: `Teaches **two pointers** — one of the most common interview techniques for strings and sorted arrays.`,
        bn: `**Two pointer** technique শেখায় — string ও sorted array-তে খুব common।`,
      },
      how: {
        en: `1) \`left = 0\`, \`right = s.Length - 1\`.
2) Move \`left\` right while char is not letter/digit.
3) Move \`right\` left while char is not letter/digit.
4) Compare lowercased chars; if different → false.
5) Move both inward until \`left >= right\`.`,
        bn: `1) \`left=0\`, \`right=শেষ\`।
2) letter/digit না হলে pointer সরান।
3) lowercase compare — mismatch হলে false।
4) \`left >= right\` পর্যন্ত।`,
      },
      analogy: {
        en: `Two people reading from opposite ends of a book page — they skip spaces and symbols, only comparing actual letters.`,
        bn: `দুজন book-এর দুই প্রান্ত থেকে পড়ছে — space skip করে শুধু letter compare।`,
      },
      realWorld: {
        en: `Input validation, username checks, and parsing cleaned identifiers in ASP.NET APIs.`,
        bn: `API input validation, username check।`,
      },
    },
  },
  '4-reverse-words-in-a-string': {
    problem: {
      en: `**Problem:** Reverse word order: "the sky is blue" → "blue is sky the". Handle extra spaces.`,
      bn: `**প্রশ্ন:** "the sky is blue" → "blue is sky the" — extra space handle করুন।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Reverse Words in a String:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Reverse Words in a String solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Reverse Words in a String** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Reverse Words in a String** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Reverse Words in a String like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Reverse Words in a String = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Reverse Words in a String-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Reverse Words in a String-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '5-valid-anagram': {
    problem: {
      en: `**Problem:** Return true if t is an anagram of s (same letters, different order).`,
      bn: `**প্রশ্ন:** t, s-এর anagram কিনা (একই letter, আলাদা order)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Valid Anagram:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.

**Detailed steps:**
1) If lengths differ → false.
2) Create \`count[26]\`.
3) For each index i: \`count[s[i]-'a']++\` and \`count[t[i]-'a']--\`.
4) If all counts are 0 → anagram.

**Why ++ and -- together?** One pass compares both strings at once.`,
      bn: `**Valid Anagram solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।

**বিস্তারিত:**
1) Length আলাদা → false
2) \`count[26]\`
3) s-তে ++, t-তে --
4) সব 0 → anagram

**এক pass-এ ++/--** — দুটো string একসাথে compare।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Valid Anagram** checks whether two strings use the **same letters** with the **same counts** — only order differs (listen ↔ silent).`,
        bn: `**Valid Anagram** — দুটি string-এ **একই letter same count**-এ আছে কিনা, শুধু order আলাদা।`,
      },
      why: {
        en: `Teaches **frequency counting** with a small fixed array \`int[26]\` — faster than sorting for lowercase a-z.`,
        bn: `**Frequency count** \`int[26]\` — lowercase a-z-এ sort-এর চেয়ে দ্রুত।`,
      },
      how: {
        en: `1) If lengths differ → false.
2) Create \`count[26]\`.
3) For each index i: \`count[s[i]-'a']++\` and \`count[t[i]-'a']--\`.
4) If all counts are 0 → anagram.

**Why ++ and -- together?** One pass compares both strings at once.`,
        bn: `1) Length আলাদা → false
2) \`count[26]\`
3) s-তে ++, t-তে --
4) সব 0 → anagram

**এক pass-এ ++/--** — দুটো string একসাথে compare।`,
      },
      analogy: {
        en: `Like two backpacks with letter tiles — anagram means both have exactly the same tiles, just shuffled.`,
        bn: `দুটি bag-এ letter tile — same tiles, shuffle order।`,
      },
      realWorld: {
        en: `Detecting duplicate submissions, spell-check variants, comparing normalized user input.`,
        bn: `Duplicate submission detect, input normalize compare।`,
      },
    },
  },
  '6-first-non-repeating-character': {
    problem: {
      en: `**Problem:** Return index of first character that appears only once. Return -1 if none.`,
      bn: `**প্রশ্ন:** প্রথম unique character-এর index; না থাকলে -1।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for First Non-Repeating Character:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**First Non-Repeating Character solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**First Non-Repeating Character** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**First Non-Repeating Character** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of First Non-Repeating Character like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `First Non-Repeating Character = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, First Non-Repeating Character-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ First Non-Repeating Character-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '7-valid-parentheses-stack': {
    problem: {
      en: `Given string of brackets \`()\`, \`[]\`, \`{}\`, return whether it is **valid and properly closed**.`,
      bn: `\`()\`, \`[]\`, \`{}\` valid ও properly closed কিনা return করুন।`,
    },
    example: {
      en: `**Input:** \`"()[]{}"\` → \`true\`
**Input:** \`"(]"\` → \`false\``,
      bn: `**Input:** \`"()[]{}"\` → \`true\`
**Input:** \`"(]"\` → \`false\``,
    },
    approach: {
      en: `**Pattern:** Stack — push expected closing bracket for each open.`,
      bn: `**Pattern:** Stack — open-এ expected close push।`,
    },
    solution: {
      en: `1. Empty stack.
2. Open bracket → push matching close.
3. Close → pop must match.
4. End: stack empty.

**Detailed steps:**
1) Create empty \`Stack<char>\`.
2) For each char:
   - If opening bracket → push the **expected closing** bracket.
   - If closing → stack must not be empty and pop must match.
3) End with empty stack.

**Trick:** push \`)\` when you see \`(\`, so pop compares directly.`,
      bn: `1. Stack
2. Open → push close
3. Close → pop match
4. শেষে empty

**বিস্তারিত:**
1) Empty stack
2) Open bracket → expected close push
3) Close → pop match check
4) শেষে stack empty

**Trick:** \`(\` দেখলে \`)\` push — pop সরাসরি compare।`,
    },
    complexity: {
      en: `**Time:** O(n)
**Space:** O(n)`,
      bn: `**Time:** O(n)
**Space:** O(n)`,
    },
    explanation: {
      what: {
        en: `**Valid Parentheses** checks whether brackets \`()\`, \`[]\`, \`{}\` are **closed in the correct order**.`,
        bn: `**Valid Parentheses** — \`()\`, \`[]\`, \`{}\` **সঠিক order-এ close** হয়েছে কিনা।`,
      },
      why: {
        en: `Classic **Stack** interview question — same logic as compilers parsing code and XML/JSON validators.`,
        bn: `Classic **Stack** question — compiler/XML parser-এ same logic।`,
      },
      how: {
        en: `1) Create empty \`Stack<char>\`.
2) For each char:
   - If opening bracket → push the **expected closing** bracket.
   - If closing → stack must not be empty and pop must match.
3) End with empty stack.

**Trick:** push \`)\` when you see \`(\`, so pop compares directly.`,
        bn: `1) Empty stack
2) Open bracket → expected close push
3) Close → pop match check
4) শেষে stack empty

**Trick:** \`(\` দেখলে \`)\` push — pop সরাসরি compare।`,
      },
      analogy: {
        en: `Like nesting boxes — each new box opens inside the last; you must close the inner box before the outer one.`,
        bn: `Nested box — ভেতরের box আগে close, তারপর বাইরের।`,
      },
      realWorld: {
        en: `Expression evaluators, Razor/HTML tag validators, lint rules for balanced braces in code.`,
        bn: `Expression parser, HTML tag balance check।`,
      },
    },
  },
  '8-remove-duplicates-from-sorted-array-in-place': {
    problem: {
      en: `**Problem:** Remove duplicates in-place, return new length. O(1) extra space.`,
      bn: `**প্রশ্ন:** Sorted array থেকে duplicate in-place remove, নতুন length return।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Remove Duplicates from Sorted Array:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Remove Duplicates from Sorted Array solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n log n)
**Space:** O(n)`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Remove Duplicates from Sorted Array** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**Remove Duplicates from Sorted Array** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Remove Duplicates from Sorted Array like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Remove Duplicates from Sorted Array = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Remove Duplicates from Sorted Array-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Remove Duplicates from Sorted Array-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '9-merge-two-sorted-arrays': {
    problem: {
      en: `**Problem:** Merge nums1 (with extra space at end) and nums2 into sorted nums1.`,
      bn: `**প্রশ্ন:** দুটি sorted array merge করে nums1-এ sorted রাখুন (শেষে extra space আছে)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Two pointers**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Two pointers**`,
    },
    approach: {
      en: `**Approach:** Use **Two pointers**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Two pointers**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Merge Two Sorted Arrays:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Merge Two Sorted Arrays solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n log n)
**Space:** O(n)`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Merge Two Sorted Arrays** — a common .NET interview coding task using the **Two pointers** pattern.`,
        bn: `**Merge Two Sorted Arrays** — .NET interview-এ common task, **Two pointers** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Two pointers).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Two pointers) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Merge Two Sorted Arrays like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Merge Two Sorted Arrays = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Merge Two Sorted Arrays-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Merge Two Sorted Arrays-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '10-group-anagrams': {
    problem: {
      en: `**Problem:** Group strings that are anagrams of each other.`,
      bn: `**প্রশ্ন:** Anagram stringগুলো একসাথে group করুন।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Group Anagrams:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.

**Detailed steps:**
1) Create \`Dictionary<string, List<string>>\`.
2) For each word, build a **canonical key**:
   - Sort letters: \`new string(word.OrderBy(c => c))\`, OR
   - Count signature: \`a1b1c0...\`
3) Add word to \`map[key]\`.
4) Return all lists.

Sorted key is easiest to explain in interviews.`,
      bn: `**Group Anagrams solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।

**বিস্তারিত:**
1) Dictionary<string, List>
2) Key = letter sort
3) map[key].Add(word)
4) Values return

Interview-তে sorted key explain করা সহজ।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Group Anagrams** clusters words that are anagrams of each other: eat, tea, ate → one group.`,
        bn: `**Group Anagrams** — anagram word এক group-এ (eat, tea, ate)।`,
      },
      why: {
        en: `Tests **Dictionary key design** — a common mid-level .NET interview and real LINQ grouping task.`,
        bn: `**Dictionary key design** — mid .NET interview + real LINQ group।`,
      },
      how: {
        en: `1) Create \`Dictionary<string, List<string>>\`.
2) For each word, build a **canonical key**:
   - Sort letters: \`new string(word.OrderBy(c => c))\`, OR
   - Count signature: \`a1b1c0...\`
3) Add word to \`map[key]\`.
4) Return all lists.

Sorted key is easiest to explain in interviews.`,
        bn: `1) Dictionary<string, List>
2) Key = letter sort
3) map[key].Add(word)
4) Values return

Interview-তে sorted key explain করা সহজ।`,
      },
      analogy: {
        en: `Like sorting each word's letters into alphabetical order as a "fingerprint" — same fingerprint means anagram family.`,
        bn: `Letter sort = fingerprint — same fingerprint = same anagram family।`,
      },
      realWorld: {
        en: `Grouping search keywords, deduplicating tags, batching similar tokens in NLP pipelines.`,
        bn: `Keyword group, tag dedup।`,
      },
    },
  },
  '11-best-time-to-buy-and-sell-stock': {
    problem: {
      en: `**Problem:** One transaction max — find maximum profit from price array.`,
      bn: `**প্রশ্ন:** একবার buy/sell — price array থেকে max profit।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Greedy / single pass**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Greedy / single pass**`,
    },
    approach: {
      en: `**Approach:** Use **Greedy / single pass**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Greedy / single pass**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Best Time to Buy and Sell Stock:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Best Time to Buy and Sell Stock solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Best Time to Buy and Sell Stock** — a common .NET interview coding task using the **Greedy / single pass** pattern.`,
        bn: `**Best Time to Buy and Sell Stock** — .NET interview-এ common task, **Greedy / single pass** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Greedy / single pass).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Greedy / single pass) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Best Time to Buy and Sell Stock like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Best Time to Buy and Sell Stock = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Best Time to Buy and Sell Stock-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Best Time to Buy and Sell Stock-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '12-contains-duplicate': {
    problem: {
      en: `**Problem:** Return true if any value appears at least twice. O(n) with HashSet.`,
      bn: `**প্রশ্ন:** কোনো value দুবার আছে কিনা HashSet O(n)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Contains Duplicate:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Contains Duplicate solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Contains Duplicate** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**Contains Duplicate** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Contains Duplicate like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Contains Duplicate = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Contains Duplicate-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Contains Duplicate-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '13-shopping-cart-total-business-logic': {
    problem: {
      en: `**Problem:** 10% discount if subtotal > 500, then +\$5 shipping, then 5% tax. Use decimal.`,
      bn: `**প্রশ্ন:** Subtotal > 500 হলে ১০% discount, +\$5 shipping, ৫% tax — decimal ব্যবহার করুন।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Business logic (decimal)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Business logic (decimal)**`,
    },
    approach: {
      en: `**Approach:** Use **Business logic (decimal)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Business logic (decimal)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Shopping Cart Total:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.

**Detailed steps:**
1) Start with \`subtotal\` (decimal).
2) If subtotal > 500 → subtract 10% discount.
3) Add flat shipping (e.g. \$5).
4) Multiply by tax (e.g. 1.05 for 5%).
5) \`Math.Round(result, 2)\`.

**Never use double for money** — 0.1 + 0.2 ≠ 0.3 in floating point!`,
      bn: `**Shopping Cart Total solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।

**বিস্তারিত:**
1) subtotal (decimal)
2) >500 → 10% discount
3) + shipping
4) × tax
5) Round 2 decimal

**Money-তে double নয়** — 0.1+0.2 ≠ 0.3!`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Shopping Cart Total** applies business rules in order: discount → shipping fee → tax on the final amount.`,
        bn: `**Shopping Cart** — discount → shipping → tax order-এ total।`,
      },
      why: {
        en: `Very common .NET machine test — checks \`decimal\` usage, rule order, and rounding — not algorithm tricks.`,
        bn: `Common machine test — \`decimal\`, rule order, round — algorithm নয়।`,
      },
      how: {
        en: `1) Start with \`subtotal\` (decimal).
2) If subtotal > 500 → subtract 10% discount.
3) Add flat shipping (e.g. \$5).
4) Multiply by tax (e.g. 1.05 for 5%).
5) \`Math.Round(result, 2)\`.

**Never use double for money** — 0.1 + 0.2 ≠ 0.3 in floating point!`,
        bn: `1) subtotal (decimal)
2) >500 → 10% discount
3) + shipping
4) × tax
5) Round 2 decimal

**Money-তে double নয়** — 0.1+0.2 ≠ 0.3!`,
      },
      analogy: {
        en: `Like a restaurant bill: discount coupon first, then service charge, then VAT on what remains.`,
        bn: `Restaurant bill — coupon, service charge, VAT order।`,
      },
      realWorld: {
        en: `Every e-commerce checkout service in ASP.NET — identical pattern to production tickets.`,
        bn: `E-commerce checkout — production ticket pattern।`,
      },
    },
  },
  '14-find-missing-number-xor-trick': {
    problem: {
      en: `**Problem:** Array has n distinct numbers from 0..n, one missing. O(n) time, O(1) space.`,
      bn: `**প্রশ্ন:** ০..n থেকে একটা missing — XOR O(n) time, O(1) space।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Bit manipulation (XOR)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Bit manipulation (XOR)**`,
    },
    approach: {
      en: `**Approach:** Use **Bit manipulation (XOR)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Bit manipulation (XOR)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Find Missing Number:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Find Missing Number solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Find Missing Number** — a common .NET interview coding task using the **Bit manipulation (XOR)** pattern.`,
        bn: `**Find Missing Number** — .NET interview-এ common task, **Bit manipulation (XOR)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Bit manipulation (XOR)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Bit manipulation (XOR)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Find Missing Number like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Find Missing Number = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Find Missing Number-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Find Missing Number-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '15-rotate-array-by-k-steps': {
    problem: {
      en: `**Problem:** Rotate array to the right by k steps. Use reverse three times trick.`,
      bn: `**প্রশ্ন:** Array k step right rotate — reverse তিনবার trick।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Rotate Array by K Steps:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Rotate Array by K Steps solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Rotate Array by K Steps** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Rotate Array by K Steps** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Rotate Array by K Steps like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Rotate Array by K Steps = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Rotate Array by K Steps-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Rotate Array by K Steps-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '16-longest-substring-without-repeating-characters': {
    problem: {
      en: `Given string \`s\`, find the **length** of the longest substring **without repeating** characters.`,
      bn: `String \`s\`-এ **repeat ছাড়া** longest substring-এর **length** খুঁজুন।`,
    },
    example: {
      en: `**Input:** \`"abcabcbb"\` → **Output:** \`3\` (\`"abc"\`)
**Input:** \`"bbbbb"\` → **Output:** \`1\``,
      bn: `**Input:** \`"abcabcbb"\` → **Output:** \`3\`
**Input:** \`"bbbbb"\` → **Output:** \`1\``,
    },
    approach: {
      en: `**Pattern:** Sliding window + \`Dictionary<char, lastIndex>\`. Move \`left\` when duplicate inside window.`,
      bn: `**Pattern:** Sliding window + char→index map। Duplicate হলে \`left\` সরান।`,
    },
    solution: {
      en: `1. \`left = 0\`, \`best = 0\`, map char → last index.
2. For \`right\` 0..n-1:
   - If char seen and index >= left → \`left = lastIndex + 1\`
   - Store char index at right
   - \`best = Max(best, right - left + 1)\`
3. Return best.

**Detailed steps:**
1) \`left = 0\`, map \`char → last index\`.
2) Expand \`right\`; if char seen inside window, move \`left\` past last index.
3) Update map; track \`max(right - left + 1)\`.

Window = s[left..right] always has unique chars.`,
      bn: `1. left=0, best=0, map
2. right loop: duplicate হলে left jump; map update; best update
3. Return best

**বিস্তারিত:**
1) left=0, char→last index map
2) right expand; duplicate হলে left jump
3) max window size track

Window s[left..right] সবসময় unique।`,
    },
    complexity: {
      en: `**Time:** O(n)
**Space:** O(min(n, alphabet))`,
      bn: `**Time:** O(n)
**Space:** O(alphabet)`,
    },
    explanation: {
      what: {
        en: `**Longest Substring Without Repeating Characters** — find the max length of a substring where no character repeats.`,
        bn: `**Longest Substring Without Repeating** — substring-এ কোনো char repeat না, max length।`,
      },
      why: {
        en: `The #1 sliding window intro question in .NET interviews — tests Dictionary + two indices (left/right).`,
        bn: `Sliding window intro #১ — Dictionary + left/right index।`,
      },
      how: {
        en: `1) \`left = 0\`, map \`char → last index\`.
2) Expand \`right\`; if char seen inside window, move \`left\` past last index.
3) Update map; track \`max(right - left + 1)\`.

Window = s[left..right] always has unique chars.`,
        bn: `1) left=0, char→last index map
2) right expand; duplicate হলে left jump
3) max window size track

Window s[left..right] সবসময় unique।`,
      },
      analogy: {
        en: `A camera frame sliding along a string — if a duplicate appears, jump the left edge past the first copy.`,
        bn: `String-এ sliding camera — duplicate এলে left edge jump।`,
      },
      realWorld: {
        en: `Unique session token windows, deduped log parsing, stream chunk validation.`,
        bn: `Unique session window, log parse।`,
      },
    },
  },
  '17-move-zeroes-to-end': {
    problem: {
      en: `**Problem:** Move all zeros to end of array in-place, keep relative order of non-zero elements.`,
      bn: `**প্রশ্ন:** সব zero শেষে in-place সরান, non-zero-এর order same রাখুন।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Move Zeroes to End:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Move Zeroes to End solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Move Zeroes to End** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Move Zeroes to End** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Move Zeroes to End like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Move Zeroes to End = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Move Zeroes to End-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Move Zeroes to End-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '18-subarray-sum-equals-k': {
    problem: {
      en: `**Problem:** Count number of contiguous subarrays whose sum equals k. Prefix sum + Dictionary.`,
      bn: `**প্রশ্ন:** Sum = k এমন contiguous subarray কতটি — prefix sum + Dictionary।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Dynamic programming**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Dynamic programming**`,
    },
    approach: {
      en: `**Approach:** Use **Dynamic programming**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Dynamic programming**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Subarray Sum Equals K:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.

**Detailed steps:**
1) \`maxEndingHere = nums[0]\`, \`maxSoFar = nums[0]\`.
2) For i from 1:
   - \`maxEndingHere = Max(nums[i], maxEndingHere + nums[i])\` — extend or restart.
   - \`maxSoFar = Max(maxSoFar, maxEndingHere)\`.
3) Return maxSoFar.

**Intuition:** if running sum becomes negative, drop it — start fresh at nums[i].`,
      bn: `**Subarray Sum Equals K solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।

**বিস্তারিত:**
1) \`maxEndingHere\`, \`maxSoFar\` init
2) \`maxEndingHere = Max(nums[i], maxEndingHere+nums[i])\`
3) negative হলে restart

**Negative bag drop** = নতুন start nums[i]`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Maximum Subarray (Kadane's)** finds the contiguous slice of an array with the **largest sum**.`,
        bn: `**Kadane** — array-এর contiguous অংশে **সবচেয়ে বড় sum**।`,
      },
      why: {
        en: `Famous DP/greedy hybrid — tests whether you can track a **running sum** and reset when it goes negative.`,
        bn: `Running sum track + negative হলে reset — classic DP/greedy।`,
      },
      how: {
        en: `1) \`maxEndingHere = nums[0]\`, \`maxSoFar = nums[0]\`.
2) For i from 1:
   - \`maxEndingHere = Max(nums[i], maxEndingHere + nums[i])\` — extend or restart.
   - \`maxSoFar = Max(maxSoFar, maxEndingHere)\`.
3) Return maxSoFar.

**Intuition:** if running sum becomes negative, drop it — start fresh at nums[i].`,
        bn: `1) \`maxEndingHere\`, \`maxSoFar\` init
2) \`maxEndingHere = Max(nums[i], maxEndingHere+nums[i])\`
3) negative হলে restart

**Negative bag drop** = নতুন start nums[i]`,
      },
      analogy: {
        en: `Walking a path collecting coins — if your bag goes negative, drop the bag and start a new one at the next house.`,
        bn: `Coin collect path — bag negative হলে bag ফেলে নতুন start।`,
      },
      realWorld: {
        en: `Best consecutive sales period, max CPU spike window, signal processing basics.`,
        bn: `Best sales week, max spike window।`,
      },
    },
  },
  '19-reverse-string-in-place': {
    problem: {
      en: `**Problem:** Reverse char array in-place using two pointers. Common warm-up before harder string tasks.`,
      bn: `**প্রশ্ন:** char array two pointer দিয়ে in-place reverse — string task warm-up।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Reverse String:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Reverse String solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Reverse String** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Reverse String** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Reverse String like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Reverse String = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Reverse String-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Reverse String-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '20-find-duplicate-number-cycle-detection': {
    problem: {
      en: `**Problem:** Array of n+1 integers in range 1..n — find the duplicate. Floyd cycle on array as linked list.`,
      bn: `**প্রশ্ন:** n+1 integer, range 1..n — duplicate খুঁজুন। Array-কে linked list ধরে Floyd cycle।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Find Duplicate Number:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Find Duplicate Number solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Find Duplicate Number** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**Find Duplicate Number** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Find Duplicate Number like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Find Duplicate Number = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Find Duplicate Number-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Find Duplicate Number-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '21-top-k-frequent-elements': {
    problem: {
      en: `**Problem:** Return k most frequent integers from array. Dictionary count + OrderBy or bucket sort.`,
      bn: `**প্রশ্ন:** Array থেকে kটি most frequent integer — Dictionary count + OrderBy/bucket।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Top K Frequent Elements:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Top K Frequent Elements solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Top K Frequent Elements** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Top K Frequent Elements** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Top K Frequent Elements like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Top K Frequent Elements = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Top K Frequent Elements-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Top K Frequent Elements-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '22-longest-common-prefix': {
    problem: {
      en: `**Problem:** Find longest common prefix among array of strings. Often asked before trie questions.`,
      bn: `**প্রশ্ন:** String array-এর longest common prefix — trie-এর আগে often জিজ্ঞেস হয়।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Trie (prefix tree)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Trie (prefix tree)**`,
    },
    approach: {
      en: `**Approach:** Use **Trie (prefix tree)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Trie (prefix tree)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Longest Common Prefix:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Longest Common Prefix solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Longest Common Prefix** — a common .NET interview coding task using the **Trie (prefix tree)** pattern.`,
        bn: `**Longest Common Prefix** — .NET interview-এ common task, **Trie (prefix tree)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Trie (prefix tree)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Trie (prefix tree)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Longest Common Prefix like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Longest Common Prefix = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Longest Common Prefix-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Longest Common Prefix-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '23-implement-strstr-find-needle-in-haystack': {
    problem: {
      en: `**Problem:** Return index of first occurrence of needle in haystack, or -1. Classic string search.`,
      bn: `**প্রশ্ন:** haystack-এ needle-এর first index, না থাকলে -1 — classic string search।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Stack / Queue**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Stack / Queue**`,
    },
    approach: {
      en: `**Approach:** Use **Stack / Queue**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Stack / Queue**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Implement strStr:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Implement strStr solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Implement strStr** — a common .NET interview coding task using the **Stack / Queue** pattern.`,
        bn: `**Implement strStr** — .NET interview-এ common task, **Stack / Queue** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Stack / Queue).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Stack / Queue) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Implement strStr like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Implement strStr = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Implement strStr-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Implement strStr-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '24-single-number-xor': {
    problem: {
      en: `**Problem:** Every element appears twice except one — find it in O(n) time O(1) space using XOR.`,
      bn: `**প্রশ্ন:** সব element দুবার, একটা একবার — XOR O(n) O(1)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Bit manipulation (XOR)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Bit manipulation (XOR)**`,
    },
    approach: {
      en: `**Approach:** Use **Bit manipulation (XOR)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Bit manipulation (XOR)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Single Number:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Single Number solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Single Number** — a common .NET interview coding task using the **Bit manipulation (XOR)** pattern.`,
        bn: `**Single Number** — .NET interview-এ common task, **Bit manipulation (XOR)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Bit manipulation (XOR)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Bit manipulation (XOR)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Single Number like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Single Number = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Single Number-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Single Number-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '25-majority-element-n-2': {
    problem: {
      en: `**Problem:** Find element appearing more than ⌊n/2⌋ times. Boyer-Moore voting algorithm O(n) O(1).`,
      bn: `**প্রশ্ন:** ⌊n/2⌋-এর বেশি appear করা element — Boyer-Moore voting O(n) O(1)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Majority Element:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.

**Detailed steps:**
1) \`candidate\`, \`count = 0\`.
2) For each num: if count==0, candidate=num, count=1; else count += (num==candidate ? 1 : -1).
3) Return candidate.

Intuition: majority can survive pairing with others.`,
      bn: `**Majority Element solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।

**বিস্তারিত:**
1) candidate, count=0
2) count 0 হলে candidate=n
3) match হলে +1, না হলে -1

Majority cancel survive করে।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Majority Element** — find the value that appears more than ⌊n/2⌋ times (guaranteed to exist).`,
        bn: `**Majority Element** — ⌊n/2⌋-এর বেশি appear (exists guaranteed)।`,
      },
      why: {
        en: `O(n) O(1) voting algorithm — favorite "optimize from hash map" follow-up question.`,
        bn: `O(n) O(1) Boyer-Moore — hash map optimize follow-up favorite।`,
      },
      how: {
        en: `1) \`candidate\`, \`count = 0\`.
2) For each num: if count==0, candidate=num, count=1; else count += (num==candidate ? 1 : -1).
3) Return candidate.

Intuition: majority can survive pairing with others.`,
        bn: `1) candidate, count=0
2) count 0 হলে candidate=n
3) match হলে +1, না হলে -1

Majority cancel survive করে।`,
      },
      analogy: {
        en: `Election: cancel one vote for candidate with one vote against — majority survives cancellation.`,
        bn: `Vote cancel — majority শেষে থাকে।`,
      },
      realWorld: {
        en: `Leader election tie-break, dominant SKU detection in streams.`,
        bn: `Leader election, dominant SKU detect।`,
      },
    },
  },
  '1-binary-search': {
    problem: {
      en: `Given a **sorted** array \`nums\` and \`target\`, return the **index** of target, or **-1** if not found.`,
      bn: `**Sorted** array \`nums\` ও \`target\` — target-এর **index** return, না থাকলে **-1**।`,
    },
    example: {
      en: `**Input:** \`nums = [-1, 0, 3, 5, 9, 12]\`, \`target = 9\`
**Output:** \`4\`

**Input:** \`target = 2\` → **Output:** \`-1\``,
      bn: `**Input:** \`nums = [-1,0,3,5,9,12]\`, \`target = 9\` → **Output:** \`4\`

**Input:** \`target = 2\` → **Output:** \`-1\``,
    },
    approach: {
      en: `**Pattern:** Binary search. Cut search range in half each step. Requires sorted input.`,
      bn: `**Pattern:** Binary search — প্রতি step-এ range অর্ধেক। Sorted array লাগে।`,
    },
    solution: {
      en: `1. \`lo = 0\`, \`hi = nums.Length - 1\`.
2. While \`lo <= hi\`:
   - \`mid = lo + (hi - lo) / 2\`
   - If \`nums[mid] == target\` → return mid
   - If \`nums[mid] < target\` → \`lo = mid + 1\`
   - Else → \`hi = mid - 1\`
3. Return -1.

**Detailed steps:**
1) \`lo = 0\`, \`hi = length - 1\`.
2) While \`lo <= hi\`:
   - \`mid = lo + (hi - lo) / 2\`
   - If \`nums[mid] == target\` → return mid
   - If target smaller → \`hi = mid - 1\`
   - Else → \`lo = mid + 1\`
3) Return -1 if not found.

**Key idea:** each step removes half the array.`,
      bn: `1. \`lo=0\`, \`hi=length-1\`
2. \`lo <= hi\`: mid বের → match হলে return; ছোট হলে ডানে; বড় হলে বামে
3. শেষে -1

**বিস্তারিত:**
1) \`lo\`, \`hi\` দিয়ে middle বের করুন।
2) target ছোট → বামে, বড় → ডানে।
3) \`lo <= hi\` পর্যন্ত।

**মূল কথা:** প্রতি step-এ অর্ধেক বাদ।`,
    },
    complexity: {
      en: `**Time:** O(log n)
**Space:** O(1)`,
      bn: `**Time:** O(log n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Binary Search** finds a target value in a **sorted** array by repeatedly cutting the search space in half.`,
        bn: `**Binary Search** **sorted** array-তে target খুঁজে — প্রতিবার search area **অর্ধেক** করে।`,
      },
      why: {
        en: `O(log n) search is fundamental. Interviewers use it to test whether you understand **sorted data** and avoid scanning every element.`,
        bn: `O(log n) basic — sorted data বোঝা এবং সব element scan না করা।`,
      },
      how: {
        en: `1) \`lo = 0\`, \`hi = length - 1\`.
2) While \`lo <= hi\`:
   - \`mid = lo + (hi - lo) / 2\`
   - If \`nums[mid] == target\` → return mid
   - If target smaller → \`hi = mid - 1\`
   - Else → \`lo = mid + 1\`
3) Return -1 if not found.

**Key idea:** each step removes half the array.`,
        bn: `1) \`lo\`, \`hi\` দিয়ে middle বের করুন।
2) target ছোট → বামে, বড় → ডানে।
3) \`lo <= hi\` পর্যন্ত।

**মূল কথা:** প্রতি step-এ অর্ধেক বাদ।`,
      },
      analogy: {
        en: `Like finding a word in a dictionary — open middle, go left or right, never read every page.`,
        bn: `Dictionary-তে word খোঁজা — middle খুলে left/right, সব page নয়।`,
      },
      realWorld: {
        en: `EF Core indexed queries, sorted log timestamps, pagination with sorted IDs.`,
        bn: `Indexed DB query, sorted log search।`,
      },
    },
  },
  '2-reverse-linked-list': {
    problem: {
      en: `Reverse a **singly linked list** and return the new head.`,
      bn: `**Singly linked list** reverse করে new head return।`,
    },
    example: {
      en: `**Input:** \`1→2→3→null\` → **Output:** \`3→2→1→null\``,
      bn: `**Input:** \`1→2→3\` → **Output:** \`3→2→1\``,
    },
    approach: {
      en: `**Pattern:** Three pointers \`prev\`, \`curr\`, \`next\` — flip links one by one.`,
      bn: `**Pattern:** prev/curr/next — link flip।`,
    },
    solution: {
      en: `1. \`prev=null\`, \`curr=head\`.
2. While curr: save next, curr.next=prev, advance prev and curr.
3. Return prev.

**Detailed steps:**
1) \`prev = null\`, \`curr = head\`.
2) While curr not null:
   - Save \`next = curr.next\`
   - \`curr.next = prev\` (flip link)
   - Move \`prev = curr\`, \`curr = next\`
3) Return \`prev\` (new head).

**Draw it:** always draw 3 nodes on paper before coding.`,
      bn: `1. prev=null
2. loop: next save, flip, advance
3. return prev

**বিস্তারিত:**
1) prev=null, curr=head
2) next save → curr.next=prev → advance
3) return prev

**Paper-এ ৩ node draw** আগে code।`,
    },
    complexity: {
      en: `**Time:** O(n)
**Space:** O(1)`,
      bn: `**Time:** O(n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Reverse Linked List** flips each node's \`next\` pointer so the list reads backward.`,
        bn: `**Reverse Linked List** — প্রতি node-এর \`next\` উল্টে list backward।`,
      },
      why: {
        en: `Tests pointer manipulation — fundamental before merge list, cycle detection, and many tree problems.`,
        bn: `Pointer manipulation test — merge/cycle-এর আগে must-know।`,
      },
      how: {
        en: `1) \`prev = null\`, \`curr = head\`.
2) While curr not null:
   - Save \`next = curr.next\`
   - \`curr.next = prev\` (flip link)
   - Move \`prev = curr\`, \`curr = next\`
3) Return \`prev\` (new head).

**Draw it:** always draw 3 nodes on paper before coding.`,
        bn: `1) prev=null, curr=head
2) next save → curr.next=prev → advance
3) return prev

**Paper-এ ৩ node draw** আগে code।`,
      },
      analogy: {
        en: `Like reversing a chain of people holding hands — each person now points to the one behind them.`,
        bn: `Hand-in-hand chain reverse — পেছনের দিকে point।`,
      },
      realWorld: {
        en: `Undo singly-linked event logs, reverse iteration without array allocation (conceptually).`,
        bn: `Event log reverse traverse concept।`,
      },
    },
  },
  '3-linked-list-cycle-floyd': {
    problem: {
      en: `**Problem:** Return true if linked list has a cycle.`,
      bn: `**প্রশ্ন:** Linked list-এ cycle আছে কিনা Floyd algorithm।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Linked list pointers**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Linked list pointers**`,
    },
    approach: {
      en: `**Approach:** Use **Linked list pointers**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Linked list pointers**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Linked List Cycle:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Linked List Cycle solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Linked List Cycle** — a common .NET interview coding task using the **Linked list pointers** pattern.`,
        bn: `**Linked List Cycle** — .NET interview-এ common task, **Linked list pointers** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Linked list pointers).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Linked list pointers) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Linked List Cycle like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Linked List Cycle = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Linked List Cycle-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Linked List Cycle-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '4-maximum-subarray-kadane': {
    problem: {
      en: `Find the **contiguous subarray** with the **largest sum** and return that sum.`,
      bn: `**Contiguous subarray**-এর **সবচেয়ে বড় sum** return করুন।`,
    },
    example: {
      en: `**Input:** \`nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\`
**Output:** \`6\` (subarray \`[4, -1, 2, 1]\`)`,
      bn: `**Input:** \`[-2,1,-3,4,-1,2,1,-5,4]\`
**Output:** \`6\` (subarray \`[4,-1,2,1]\`)`,
    },
    approach: {
      en: `**Pattern:** Kadane's algorithm. Track running sum; restart when sum goes negative.`,
      bn: `**Pattern:** Kadane — running sum; negative হলে restart।`,
    },
    solution: {
      en: `1. \`best = nums[0]\`, \`cur = nums[0]\`.
2. For i from 1 to end:
   - \`cur = Max(nums[i], cur + nums[i])\` — extend or start fresh
   - \`best = Max(best, cur)\`
3. Return \`best\`.

**Detailed steps:**
1) \`maxEndingHere = nums[0]\`, \`maxSoFar = nums[0]\`.
2) For i from 1:
   - \`maxEndingHere = Max(nums[i], maxEndingHere + nums[i])\` — extend or restart.
   - \`maxSoFar = Max(maxSoFar, maxEndingHere)\`.
3) Return maxSoFar.

**Intuition:** if running sum becomes negative, drop it — start fresh at nums[i].`,
      bn: `1. \`best\`, \`cur\` init nums[0]
2. Loop: \`cur = Max(nums[i], cur+nums[i])\`; \`best = Max(best,cur)\`
3. Return best

**বিস্তারিত:**
1) \`maxEndingHere\`, \`maxSoFar\` init
2) \`maxEndingHere = Max(nums[i], maxEndingHere+nums[i])\`
3) negative হলে restart

**Negative bag drop** = নতুন start nums[i]`,
    },
    complexity: {
      en: `**Time:** O(n)
**Space:** O(1)`,
      bn: `**Time:** O(n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Maximum Subarray (Kadane's)** finds the contiguous slice of an array with the **largest sum**.`,
        bn: `**Kadane** — array-এর contiguous অংশে **সবচেয়ে বড় sum**।`,
      },
      why: {
        en: `Famous DP/greedy hybrid — tests whether you can track a **running sum** and reset when it goes negative.`,
        bn: `Running sum track + negative হলে reset — classic DP/greedy।`,
      },
      how: {
        en: `1) \`maxEndingHere = nums[0]\`, \`maxSoFar = nums[0]\`.
2) For i from 1:
   - \`maxEndingHere = Max(nums[i], maxEndingHere + nums[i])\` — extend or restart.
   - \`maxSoFar = Max(maxSoFar, maxEndingHere)\`.
3) Return maxSoFar.

**Intuition:** if running sum becomes negative, drop it — start fresh at nums[i].`,
        bn: `1) \`maxEndingHere\`, \`maxSoFar\` init
2) \`maxEndingHere = Max(nums[i], maxEndingHere+nums[i])\`
3) negative হলে restart

**Negative bag drop** = নতুন start nums[i]`,
      },
      analogy: {
        en: `Walking a path collecting coins — if your bag goes negative, drop the bag and start a new one at the next house.`,
        bn: `Coin collect path — bag negative হলে bag ফেলে নতুন start।`,
      },
      realWorld: {
        en: `Best consecutive sales period, max CPU spike window, signal processing basics.`,
        bn: `Best sales week, max spike window।`,
      },
    },
  },
  '5-climbing-stairs-dp': {
    problem: {
      en: `Count **distinct ways** to climb n stairs taking 1 or 2 steps at a time.`,
      bn: `n সিঁড়ি — ১ বা ২ step, **কত distinct way**।`,
    },
    example: {
      en: `**Input:** \`n=3\` → **Output:** \`3\` (1+1+1, 1+2, 2+1)`,
      bn: `**Input:** \`n=3\` → **Output:** \`3\``,
    },
    approach: {
      en: `**Pattern:** DP / Fibonacci — \`ways[i] = ways[i-1] + ways[i-2]\`.`,
      bn: `**Pattern:** DP — \`ways[i]=ways[i-1]+ways[i-2]\`।`,
    },
    solution: {
      en: `1. Base: n<=2 return n.
2. Keep two vars \`a,b\` for last two ways.
3. Loop i=3..n: \`(a,b)=(b,a+b)\`.
4. Return b.

**Detailed steps:**
1) Ways to step 1 = 1, step 2 = 2.
2) \`ways[i] = ways[i-1] + ways[i-2]\` — last step either 1 or 2.
3) Optimize space: only keep last two values \`a\`, \`b\`.

Example n=4: 1→1→1→1, 1→1→2, 1→2→1, 2→1→1, 2→2 = 5 ways.`,
      bn: `1. base n<=2
2. a,b vars
3. loop update
4. return b

**বিস্তারিত:**
1) step1=1, step2=2
2) \`ways[i]=ways[i-1]+ways[i-2]\`
3) Space O(1): শুধু last two

n=4 → 5 ways`,
    },
    complexity: {
      en: `**Time:** O(n)
**Space:** O(1)`,
      bn: `**Time:** O(n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Climbing Stairs**: count how many distinct ways to reach step n if each move is 1 or 2 steps.`,
        bn: `**Climbing Stairs** — n step-এ ১ বা ২ step দিয়ে কত **distinct way**।`,
      },
      why: {
        en: `Simplest DP introduction — same recurrence as Fibonacci. Appears in almost every DP intro interview.`,
        bn: `সবচেয়ে সহজ DP — Fibonacci recurrence।`,
      },
      how: {
        en: `1) Ways to step 1 = 1, step 2 = 2.
2) \`ways[i] = ways[i-1] + ways[i-2]\` — last step either 1 or 2.
3) Optimize space: only keep last two values \`a\`, \`b\`.

Example n=4: 1→1→1→1, 1→1→2, 1→2→1, 2→1→1, 2→2 = 5 ways.`,
        bn: `1) step1=1, step2=2
2) \`ways[i]=ways[i-1]+ways[i-2]\`
3) Space O(1): শুধু last two

n=4 → 5 ways`,
      },
      analogy: {
        en: `Like climbing stairs at home — at each step you choose one or two steps up; total paths add up from previous steps.`,
        bn: `বাড়ির stairs — প্রতি step-এ ১ বা ২ step choice।`,
      },
      realWorld: {
        en: `Routing with 1 or 2 hop options, versioning sequences, combinatorics in scheduling.`,
        bn: `1/2 hop routing, schedule combination।`,
      },
    },
  },
  '6-fibonacci-with-memoization': {
    problem: {
      en: `**Problem:** Nth Fibonacci with top-down memo — avoid exponential recursion.`,
      bn: `**প্রশ্ন:** Memoization দিয়ে Fibonacci — exponential recursion avoid।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Dynamic programming**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Dynamic programming**`,
    },
    approach: {
      en: `**Approach:** Use **Dynamic programming**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Dynamic programming**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Fibonacci with Memoization:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Fibonacci with Memoization solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Fibonacci with Memoization** — a common .NET interview coding task using the **Dynamic programming** pattern.`,
        bn: `**Fibonacci with Memoization** — .NET interview-এ common task, **Dynamic programming** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Dynamic programming).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Dynamic programming) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Fibonacci with Memoization like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Fibonacci with Memoization = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Fibonacci with Memoization-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Fibonacci with Memoization-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '7-merge-intervals': {
    problem: {
      en: `**Problem:** Merge overlapping intervals [[1,3],[2,6],[8,10]].`,
      bn: `**প্রশ্ন:** Overlapping interval merge করুন।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Greedy / single pass**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Greedy / single pass**`,
    },
    approach: {
      en: `**Approach:** Use **Greedy / single pass**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Greedy / single pass**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Merge Intervals:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Merge Intervals solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Merge Intervals** — a common .NET interview coding task using the **Greedy / single pass** pattern.`,
        bn: `**Merge Intervals** — .NET interview-এ common task, **Greedy / single pass** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Greedy / single pass).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Greedy / single pass) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Merge Intervals like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Merge Intervals = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Merge Intervals-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Merge Intervals-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '8-coin-change-min-coins': {
    problem: {
      en: `Given coin denominations and \`amount\`, return **minimum coins** needed, or \`-1\` if impossible.`,
      bn: `Coin denominations ও \`amount\` — **minimum coin count**, impossible হলে \`-1\`।`,
    },
    example: {
      en: `**Input:** coins=[1,2,5], amount=11 → **Output:** \`3\` (5+5+1)`,
      bn: `coins=[1,2,5], amount=11 → **Output:** \`3\``,
    },
    approach: {
      en: `**Pattern:** 1D DP — \`dp[a]\` = min coins for amount \`a\`.`,
      bn: `**Pattern:** 1D DP — \`dp[a]\` = min coins।`,
    },
    solution: {
      en: `1. dp[0]=0, rest = infinity.
2. For a=1..amount, each coin c: if c<=a, dp[a]=Min(dp[a], dp[a-c]+1).
3. Return dp[amount] or -1.

**Detailed steps:**
1) \`dp[0] = 0\`, fill rest with infinity/large value.
2) For each amount a from 1 to target:
   - For each coin c: if \`c <= a\`, \`dp[a] = Min(dp[a], dp[a-c] + 1)\`.
3) Return dp[target] if reachable else -1.

**Meaning:** dp[a] = min coins to make amount a.`,
      bn: `1. dp[0]=0
2. loop amount+coins
3. dp[amount] or -1

**বিস্তারিত:**
1) dp[0]=0, rest large
2) amount 1..target loop
3) \`dp[a]=Min(dp[a], dp[a-c]+1)\`

**dp[a]** = amount a-তে min coin`,
    },
    complexity: {
      en: `**Time:** O(amount × coins)
**Space:** O(amount)`,
      bn: `**Time:** O(amount×coins)
**Space:** O(amount)`,
    },
    explanation: {
      what: {
        en: `**Coin Change** finds the **minimum number of coins** needed to make an exact amount (or -1 if impossible).`,
        bn: `**Coin Change** — exact amount-এ **minimum coin count** (-1 impossible)।`,
      },
      why: {
        en: `Classic 1D DP — teaches \`dp[amount]\` meaning and iterating coins in inner loop.`,
        bn: `Classic 1D DP — \`dp[amount]\` meaning।`,
      },
      how: {
        en: `1) \`dp[0] = 0\`, fill rest with infinity/large value.
2) For each amount a from 1 to target:
   - For each coin c: if \`c <= a\`, \`dp[a] = Min(dp[a], dp[a-c] + 1)\`.
3) Return dp[target] if reachable else -1.

**Meaning:** dp[a] = min coins to make amount a.`,
        bn: `1) dp[0]=0, rest large
2) amount 1..target loop
3) \`dp[a]=Min(dp[a], dp[a-c]+1)\`

**dp[a]** = amount a-তে min coin`,
      },
      analogy: {
        en: `Like making change with fewest coins in a wallet — try each coin size and reuse best smaller amount.`,
        bn: `Wallet-এ fewest coin change — ছোট amount-এর best reuse।`,
      },
      realWorld: {
        en: `Resource pack optimization, minimum API calls to reach quota, change-making in POS systems.`,
        bn: `POS change, quota min API call।`,
      },
    },
  },
  '9-longest-common-subsequence': {
    problem: {
      en: `**Problem:** Length of LCS for two strings (classic 2D DP).`,
      bn: `**প্রশ্ন:** দুটি string-এর LCS length (2D DP)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Longest Common Subsequence:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Longest Common Subsequence solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Longest Common Subsequence** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Longest Common Subsequence** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Longest Common Subsequence like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Longest Common Subsequence = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Longest Common Subsequence-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Longest Common Subsequence-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '10-binary-tree-inorder-traversal': {
    problem: {
      en: `**Problem:** Return inorder values (left, root, right) — recursive or iterative.`,
      bn: `**প্রশ্ন:** Inorder traversal (left, root, right)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Tree traversal**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Tree traversal**`,
    },
    approach: {
      en: `**Approach:** Use **Tree traversal**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Tree traversal**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Binary Tree Inorder Traversal:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Binary Tree Inorder Traversal solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(log n)
**Space:** O(1)`,
      bn: `**Time:** O(log n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Binary Tree Inorder Traversal** — a common .NET interview coding task using the **Tree traversal** pattern.`,
        bn: `**Binary Tree Inorder Traversal** — .NET interview-এ common task, **Tree traversal** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Tree traversal).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Tree traversal) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Binary Tree Inorder Traversal like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Binary Tree Inorder Traversal = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Binary Tree Inorder Traversal-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Binary Tree Inorder Traversal-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '11-validate-binary-search-tree': {
    problem: {
      en: `**Problem:** Determine if tree is valid BST (all left < node < all right).`,
      bn: `**প্রশ্ন:** Tree valid BST কিনা check করুন।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Binary search**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Binary search**`,
    },
    approach: {
      en: `**Approach:** Use **Binary search**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Binary search**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Validate Binary Search Tree:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.

**Detailed steps:**
1) \`lo = 0\`, \`hi = length - 1\`.
2) While \`lo <= hi\`:
   - \`mid = lo + (hi - lo) / 2\`
   - If \`nums[mid] == target\` → return mid
   - If target smaller → \`hi = mid - 1\`
   - Else → \`lo = mid + 1\`
3) Return -1 if not found.

**Key idea:** each step removes half the array.`,
      bn: `**Validate Binary Search Tree solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।

**বিস্তারিত:**
1) \`lo\`, \`hi\` দিয়ে middle বের করুন।
2) target ছোট → বামে, বড় → ডানে।
3) \`lo <= hi\` পর্যন্ত।

**মূল কথা:** প্রতি step-এ অর্ধেক বাদ।`,
    },
    complexity: {
      en: `**Time:** O(log n)
**Space:** O(1)`,
      bn: `**Time:** O(log n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Binary Search** finds a target value in a **sorted** array by repeatedly cutting the search space in half.`,
        bn: `**Binary Search** **sorted** array-তে target খুঁজে — প্রতিবার search area **অর্ধেক** করে।`,
      },
      why: {
        en: `O(log n) search is fundamental. Interviewers use it to test whether you understand **sorted data** and avoid scanning every element.`,
        bn: `O(log n) basic — sorted data বোঝা এবং সব element scan না করা।`,
      },
      how: {
        en: `1) \`lo = 0\`, \`hi = length - 1\`.
2) While \`lo <= hi\`:
   - \`mid = lo + (hi - lo) / 2\`
   - If \`nums[mid] == target\` → return mid
   - If target smaller → \`hi = mid - 1\`
   - Else → \`lo = mid + 1\`
3) Return -1 if not found.

**Key idea:** each step removes half the array.`,
        bn: `1) \`lo\`, \`hi\` দিয়ে middle বের করুন।
2) target ছোট → বামে, বড় → ডানে।
3) \`lo <= hi\` পর্যন্ত।

**মূল কথা:** প্রতি step-এ অর্ধেক বাদ।`,
      },
      analogy: {
        en: `Like finding a word in a dictionary — open middle, go left or right, never read every page.`,
        bn: `Dictionary-তে word খোঁজা — middle খুলে left/right, সব page নয়।`,
      },
      realWorld: {
        en: `EF Core indexed queries, sorted log timestamps, pagination with sorted IDs.`,
        bn: `Indexed DB query, sorted log search।`,
      },
    },
  },
  '12-graph-bfs': {
    problem: {
      en: `**Problem:** BFS traversal from start node using adjacency list.`,
      bn: `**প্রশ্ন:** Adjacency list থেকে BFS traversal।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Graph BFS/DFS**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Graph BFS/DFS**`,
    },
    approach: {
      en: `**Approach:** Use **Graph BFS/DFS**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Graph BFS/DFS**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Graph BFS:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Graph BFS solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Graph BFS** — a common .NET interview coding task using the **Graph BFS/DFS** pattern.`,
        bn: `**Graph BFS** — .NET interview-এ common task, **Graph BFS/DFS** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Graph BFS/DFS).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Graph BFS/DFS) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Graph BFS like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Graph BFS = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Graph BFS-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Graph BFS-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '13-number-of-islands-dfs': {
    problem: {
      en: `Given 2D grid of \`"1"\` (land) and \`"0"\` (water), count **number of islands**.`,
      bn: `2D grid \`"1"\` land, \`"0"\` water — **island count**।`,
    },
    example: {
      en: `**Input:** 4×5 grid with three separate \`"1"\` groups → **Output:** \`3\``,
      bn: `তিনটা আলাদা \`"1"\` group → **Output:** \`3\``,
    },
    approach: {
      en: `**Pattern:** DFS/BFS — sink each island when visited (\`grid[r][c]='0'\`).`,
      bn: `**Pattern:** DFS — visit করে \`"0"\` mark (sink)।`,
    },
    solution: {
      en: `1. Loop every cell.
2. If \`grid[r][c]=='1'\`: count++, DFS flood fill 4 directions.
3. Return count.`,
      bn: `1. cell loop
2. \`1\` পেলে count++ ও DFS
3. return count`,
    },
    complexity: {
      en: `**Time:** O(rows×cols)
**Space:** O(rows×cols) recursion`,
      bn: `**Time:** O(rows×cols)
**Space:** O(rows×cols)`,
    },
    explanation: {
      what: {
        en: `**Number of Islands** — a common .NET interview coding task using the **Graph BFS/DFS** pattern.`,
        bn: `**Number of Islands** — .NET interview-এ common task, **Graph BFS/DFS** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Graph BFS/DFS).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Graph BFS/DFS) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Number of Islands like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Number of Islands = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Number of Islands-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Number of Islands-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '14-kth-largest-element-min-heap': {
    problem: {
      en: `**Problem:** Find Kth largest using PriorityQueue — O(n log k).`,
      bn: `**প্রশ্ন:** PriorityQueue দিয়ে Kth largest — O(n log k)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Heap (PriorityQueue)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Heap (PriorityQueue)**`,
    },
    approach: {
      en: `**Approach:** Use **Heap (PriorityQueue)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Heap (PriorityQueue)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Kth Largest Element:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Kth Largest Element solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n log k)
**Space:** O(k)`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Kth Largest Element** — a common .NET interview coding task using the **Heap (PriorityQueue)** pattern.`,
        bn: `**Kth Largest Element** — .NET interview-এ common task, **Heap (PriorityQueue)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Heap (PriorityQueue)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Heap (PriorityQueue)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Kth Largest Element like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Kth Largest Element = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Kth Largest Element-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Kth Largest Element-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '15-implement-queue-using-stacks': {
    problem: {
      en: `**Problem:** FIFO queue using two stacks — classic data structure design.`,
      bn: `**প্রশ্ন:** দুটি Stack দিয়ে FIFO Queue — classic design question।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Stack / Queue**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Stack / Queue**`,
    },
    approach: {
      en: `**Approach:** Use **Stack / Queue**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Stack / Queue**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Implement Queue using Stacks:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Implement Queue using Stacks solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Implement Queue using Stacks** — a common .NET interview coding task using the **Stack / Queue** pattern.`,
        bn: `**Implement Queue using Stacks** — .NET interview-এ common task, **Stack / Queue** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Stack / Queue).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Stack / Queue) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Implement Queue using Stacks like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Implement Queue using Stacks = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Implement Queue using Stacks-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Implement Queue using Stacks-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '16-sliding-window-maximum': {
    problem: {
      en: `**Problem:** Max in each window of size k — deque technique O(n).`,
      bn: `**প্রশ্ন:** Size k window-এর প্রতিটিতে max — deque O(n)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Sliding window**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Sliding window**`,
    },
    approach: {
      en: `**Approach:** Use **Sliding window**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Sliding window**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Sliding Window Maximum:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Sliding Window Maximum solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Sliding Window Maximum** — a common .NET interview coding task using the **Sliding window** pattern.`,
        bn: `**Sliding Window Maximum** — .NET interview-এ common task, **Sliding window** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Sliding window).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Sliding window) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Sliding Window Maximum like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Sliding Window Maximum = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Sliding Window Maximum-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Sliding Window Maximum-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '17-trie-prefix-tree-insert-search': {
    problem: {
      en: `**Problem:** Autocomplete-style prefix tree for word insert and exact search.`,
      bn: `**প্রশ্ন:** Insert ও exact search-এর Trie (prefix tree)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Binary search**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Binary search**`,
    },
    approach: {
      en: `**Approach:** Use **Binary search**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Binary search**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Trie:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Trie solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Trie** — a common .NET interview coding task using the **Binary search** pattern.`,
        bn: `**Trie** — .NET interview-এ common task, **Binary search** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Binary search).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Binary search) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Trie like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Trie = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Trie-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Trie-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '18-house-robber-dp': {
    problem: {
      en: `**Problem:** Max money robbing non-adjacent houses along a street.`,
      bn: `**প্রশ্ন:** Adjacent নয় — max money (House Robber DP)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Dynamic programming**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Dynamic programming**`,
    },
    approach: {
      en: `**Approach:** Use **Dynamic programming**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Dynamic programming**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for House Robber:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**House Robber solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**House Robber** — a common .NET interview coding task using the **Dynamic programming** pattern.`,
        bn: `**House Robber** — .NET interview-এ common task, **Dynamic programming** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Dynamic programming).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Dynamic programming) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of House Robber like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `House Robber = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, House Robber-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ House Robber-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '19-product-of-array-except-self': {
    problem: {
      en: `**Problem:** Return array where output[i] = product of all elements except nums[i]. O(n), no division.`,
      bn: `**প্রশ্ন:** output[i] = বাকি সব element-এর product — O(n), division ছাড়া।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Product of Array Except Self:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Product of Array Except Self solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Product of Array Except Self** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Product of Array Except Self** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Product of Array Except Self like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Product of Array Except Self = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Product of Array Except Self-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Product of Array Except Self-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '20-container-with-most-water-two-pointers': {
    problem: {
      en: `**Problem:** Max area between two lines in height array.`,
      bn: `**প্রশ্ন:** Height array-তে two pointer দিয়ে max water area।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Two pointers**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Two pointers**`,
    },
    approach: {
      en: `**Approach:** Use **Two pointers**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Two pointers**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Container With Most Water:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Container With Most Water solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Container With Most Water** — a common .NET interview coding task using the **Two pointers** pattern.`,
        bn: `**Container With Most Water** — .NET interview-এ common task, **Two pointers** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Two pointers).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Two pointers) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Container With Most Water like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Container With Most Water = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Container With Most Water-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Container With Most Water-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '21-merge-two-sorted-lists': {
    problem: {
      en: `Merge two **sorted** linked lists into one sorted list. Return merged head.`,
      bn: `দুটি **sorted** linked list merge — sorted head return।`,
    },
    example: {
      en: `**Input:** \`1→2→4\`, \`1→3→4\` → **Output:** \`1→1→2→3→4→4\``,
      bn: `**Input:** \`1→2→4\` + \`1→3→4\` → merged sorted`,
    },
    approach: {
      en: `**Pattern:** Dummy head + compare two pointers.`,
      bn: `**Pattern:** Dummy head + compare pointers।`,
    },
    solution: {
      en: `1. Dummy node, cur pointer.
2. While both lists: attach smaller node, advance.
3. Attach remainder.
4. Return dummy.next.`,
      bn: `1. dummy node
2. compare attach
3. remainder
4. dummy.next`,
    },
    complexity: {
      en: `**Time:** O(n+m)
**Space:** O(1)`,
      bn: `**Time:** O(n+m)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Merge Two Sorted Lists** — a common .NET interview coding task using the **Two pointers** pattern.`,
        bn: `**Merge Two Sorted Lists** — .NET interview-এ common task, **Two pointers** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Two pointers).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Two pointers) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Merge Two Sorted Lists like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Merge Two Sorted Lists = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Merge Two Sorted Lists-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Merge Two Sorted Lists-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '22-add-two-numbers-linked-list': {
    problem: {
      en: `**Problem:** Two non-empty linked lists representing digits in reverse order — add and return sum as linked list.`,
      bn: `**প্রশ্ন:** Reverse digit linked list দুটি যোগ — sum linked list return (carry handle)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Linked list pointers**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Linked list pointers**`,
    },
    approach: {
      en: `**Approach:** Use **Linked list pointers**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Linked list pointers**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Add Two Numbers:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Add Two Numbers solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Add Two Numbers** — a common .NET interview coding task using the **Linked list pointers** pattern.`,
        bn: `**Add Two Numbers** — .NET interview-এ common task, **Linked list pointers** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Linked list pointers).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Linked list pointers) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Add Two Numbers like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Add Two Numbers = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Add Two Numbers-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Add Two Numbers-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '23-maximum-depth-of-binary-tree': {
    problem: {
      en: `**Problem:** Return max depth (height) of binary tree. Simple DFS — very common tree warm-up.`,
      bn: `**প্রশ্ন:** Binary tree max depth — simple DFS, tree warm-up খুব common।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Tree traversal**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Tree traversal**`,
    },
    approach: {
      en: `**Approach:** Use **Tree traversal**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Tree traversal**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Maximum Depth of Binary Tree:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Maximum Depth of Binary Tree solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(log n)
**Space:** O(1)`,
      bn: `**Time:** O(log n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Maximum Depth of Binary Tree** — a common .NET interview coding task using the **Tree traversal** pattern.`,
        bn: `**Maximum Depth of Binary Tree** — .NET interview-এ common task, **Tree traversal** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Tree traversal).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Tree traversal) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Maximum Depth of Binary Tree like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Maximum Depth of Binary Tree = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Maximum Depth of Binary Tree-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Maximum Depth of Binary Tree-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '24-symmetric-tree-mirror': {
    problem: {
      en: `**Problem:** Check if binary tree is mirror of itself. Common follow-up after max depth.`,
      bn: `**প্রশ্ন:** Tree নিজের mirror কিনা — max depth-এর পর common follow-up।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Tree traversal**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Tree traversal**`,
    },
    approach: {
      en: `**Approach:** Use **Tree traversal**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Tree traversal**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Symmetric Tree:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Symmetric Tree solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Symmetric Tree** — a common .NET interview coding task using the **Tree traversal** pattern.`,
        bn: `**Symmetric Tree** — .NET interview-এ common task, **Tree traversal** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Tree traversal).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Tree traversal) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Symmetric Tree like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Symmetric Tree = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Symmetric Tree-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Symmetric Tree-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '25-lowest-common-ancestor-bst': {
    problem: {
      en: `**Problem:** Find lowest common ancestor of two nodes in a BST. Use BST property — O(h) time.`,
      bn: `**প্রশ্ন:** BST-তে দুটি node-এর LCA — BST property O(h)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Tree traversal**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Tree traversal**`,
    },
    approach: {
      en: `**Approach:** Use **Tree traversal**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Tree traversal**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Lowest Common Ancestor:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Lowest Common Ancestor solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Lowest Common Ancestor** — a common .NET interview coding task using the **Tree traversal** pattern.`,
        bn: `**Lowest Common Ancestor** — .NET interview-এ common task, **Tree traversal** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Tree traversal).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Tree traversal) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Lowest Common Ancestor like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Lowest Common Ancestor = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Lowest Common Ancestor-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Lowest Common Ancestor-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '26-graph-dfs-recursive': {
    problem: {
      en: `**Problem:** Depth-first search on adjacency list. Pair with BFS task — interviewers often ask both.`,
      bn: `**প্রশ্ন:** Adjacency list DFS recursive — BFS-এর সাথে pair, interview-তে দুটোই জিজ্ঞেস।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Graph BFS/DFS**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Graph BFS/DFS**`,
    },
    approach: {
      en: `**Approach:** Use **Graph BFS/DFS**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Graph BFS/DFS**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Graph DFS:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Graph DFS solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Graph DFS** — a common .NET interview coding task using the **Graph BFS/DFS** pattern.`,
        bn: `**Graph DFS** — .NET interview-এ common task, **Graph BFS/DFS** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Graph BFS/DFS).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Graph BFS/DFS) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Graph DFS like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Graph DFS = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Graph DFS-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Graph DFS-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '27-search-in-rotated-sorted-array': {
    problem: {
      en: `Search \`target\` in **rotated sorted** array (no duplicates). Return index or -1.`,
      bn: `**Rotated sorted** array-তে \`target\` index, না থাকলে -1।`,
    },
    example: {
      en: `**Input:** \`[4,5,6,7,0,1,2]\`, target=0 → **Output:** \`4\``,
      bn: `**Input:** \`[4,5,6,7,0,1,2]\`, target=0 → **Output:** \`4\``,
    },
    approach: {
      en: `**Pattern:** Modified binary search — one half is always sorted.`,
      bn: `**Pattern:** Binary search — এক half সবসময় sorted।`,
    },
    solution: {
      en: `1. lo/hi binary search.
2. If nums[lo]<=nums[mid]: left half sorted — check if target in range.
3. Else right half sorted — adjust lo/hi.
4. Return -1 if not found.`,
      bn: `1. lo/hi
2. left sorted check
3. else right
4. -1`,
    },
    complexity: {
      en: `**Time:** O(log n)
**Space:** O(1)`,
      bn: `**Time:** O(log n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Search in Rotated Sorted Array** — a common .NET interview coding task using the **Two pointers** pattern.`,
        bn: `**Search in Rotated Sorted Array** — .NET interview-এ common task, **Two pointers** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Two pointers).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Two pointers) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Search in Rotated Sorted Array like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Search in Rotated Sorted Array = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Search in Rotated Sorted Array-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Search in Rotated Sorted Array-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '28-generate-parentheses-backtracking': {
    problem: {
      en: `**Problem:** Generate all combinations of n pairs of well-formed parentheses. Classic backtracking intro.`,
      bn: `**প্রশ্ন:** n pair well-formed parentheses সব combination — classic backtracking intro।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Stack / Queue**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Stack / Queue**`,
    },
    approach: {
      en: `**Approach:** Use **Stack / Queue**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Stack / Queue**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Generate Parentheses:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.

**Detailed steps:**
1) Create empty \`Stack<char>\`.
2) For each char:
   - If opening bracket → push the **expected closing** bracket.
   - If closing → stack must not be empty and pop must match.
3) End with empty stack.

**Trick:** push \`)\` when you see \`(\`, so pop compares directly.`,
      bn: `**Generate Parentheses solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।

**বিস্তারিত:**
1) Empty stack
2) Open bracket → expected close push
3) Close → pop match check
4) শেষে stack empty

**Trick:** \`(\` দেখলে \`)\` push — pop সরাসরি compare।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Valid Parentheses** checks whether brackets \`()\`, \`[]\`, \`{}\` are **closed in the correct order**.`,
        bn: `**Valid Parentheses** — \`()\`, \`[]\`, \`{}\` **সঠিক order-এ close** হয়েছে কিনা।`,
      },
      why: {
        en: `Classic **Stack** interview question — same logic as compilers parsing code and XML/JSON validators.`,
        bn: `Classic **Stack** question — compiler/XML parser-এ same logic।`,
      },
      how: {
        en: `1) Create empty \`Stack<char>\`.
2) For each char:
   - If opening bracket → push the **expected closing** bracket.
   - If closing → stack must not be empty and pop must match.
3) End with empty stack.

**Trick:** push \`)\` when you see \`(\`, so pop compares directly.`,
        bn: `1) Empty stack
2) Open bracket → expected close push
3) Close → pop match check
4) শেষে stack empty

**Trick:** \`(\` দেখলে \`)\` push — pop সরাসরি compare।`,
      },
      analogy: {
        en: `Like nesting boxes — each new box opens inside the last; you must close the inner box before the outer one.`,
        bn: `Nested box — ভেতরের box আগে close, তারপর বাইরের।`,
      },
      realWorld: {
        en: `Expression evaluators, Razor/HTML tag validators, lint rules for balanced braces in code.`,
        bn: `Expression parser, HTML tag balance check।`,
      },
    },
  },
  '29-subsets-backtracking-bitmask': {
    problem: {
      en: `**Problem:** Return all possible subsets (power set) of distinct integers. Backtracking or iterative.`,
      bn: `**প্রশ্ন:** Distinct integer-এর সব subset (power set) — backtracking বা iterative।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Subsets:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Subsets solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(2^n) or O(n·2^n)
**Space:** O(n) recursion`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Subsets** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Subsets** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Subsets like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Subsets = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Subsets-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Subsets-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '30-word-break-dp': {
    problem: {
      en: `Can string \`s\` be segmented into **dictionary words** (reuse allowed)? Return true/false.`,
      bn: `String \`s\` dictionary word-এ ভাগ করা যায় কিনা — true/false।`,
    },
    example: {
      en: `**Input:** s=\`"leetcode"\`, dict=[\`"leet"\`,\`"code"\`] → **Output:** \`true\``,
      bn: `s=\`"leetcode"\`, dict leet+code → **Output:** \`true\``,
    },
    approach: {
      en: `**Pattern:** 1D DP — \`dp[i]\` = can prefix length i be segmented?`,
      bn: `**Pattern:** 1D DP — prefix length i segmentable?`,
    },
    solution: {
      en: `1. dp[0]=true.
2. For i=1..n: try every j<i; if dp[j] and s[j..i) in dict → dp[i]=true.
3. Return dp[n].

**Detailed steps:**
1) \`dp[0] = true\` (empty string ok).
2) For i 1..n: dp[i]=true if any j<i has dp[j] true AND s[j..i) in dictionary.
3) Return dp[n].

State: dp[i] = can prefix length i be segmented?`,
      bn: `1. dp[0]=true
2. j loop + dict check
3. dp[n]

**বিস্তারিত:**
1) dp[0]=true
2) dp[i] true যদি কোনো j-এ dp[j] true ও s[j..i) dict-এ
3) dp[n] return

State: prefix length i segmentable?`,
    },
    complexity: {
      en: `**Time:** O(n² × word check)
**Space:** O(n)`,
      bn: `**Time:** O(n²)
**Space:** O(n)`,
    },
    explanation: {
      what: {
        en: `**Word Break** — can string s be split into space-separated dictionary words?`,
        bn: `**Word Break** — s dictionary word দিয়ে segment করা যায় কিনা।`,
      },
      why: {
        en: `Classic 1D DP string problem — mid/senior .NET interviews and NLP tokenization discussions.`,
        bn: `Classic 1D DP string — mid/senior interview + tokenization।`,
      },
      how: {
        en: `1) \`dp[0] = true\` (empty string ok).
2) For i 1..n: dp[i]=true if any j<i has dp[j] true AND s[j..i) in dictionary.
3) Return dp[n].

State: dp[i] = can prefix length i be segmented?`,
        bn: `1) dp[0]=true
2) dp[i] true যদি কোনো j-এ dp[j] true ও s[j..i) dict-এ
3) dp[n] return

State: prefix length i segmentable?`,
      },
      analogy: {
        en: `Breaking a long Bengali sentence into valid words — try every cut point, remember which prefixes worked.`,
        bn: `Long sentence valid word-এ ভাঙা — cut point try, prefix memo।`,
      },
      realWorld: {
        en: `Tokenization, URL slug validation, autocomplete segmentation.`,
        bn: `Tokenize, slug validate।`,
      },
    },
  },
  '31-longest-increasing-subsequence': {
    problem: {
      en: `**Problem:** Length of longest strictly increasing subsequence. O(n log n) with patience sorting / binary search.`,
      bn: `**প্রশ্ন:** Longest strictly increasing subsequence length — O(n log n) patience sorting।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Longest Increasing Subsequence:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Longest Increasing Subsequence solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Longest Increasing Subsequence** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Longest Increasing Subsequence** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Longest Increasing Subsequence like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Longest Increasing Subsequence = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Longest Increasing Subsequence-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Longest Increasing Subsequence-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '32-find-all-anagrams-in-a-string': {
    problem: {
      en: `**Problem:** Find all start indices of p anagrams in s. Sliding window + frequency — very common string interview.`,
      bn: `**প্রশ্ন:** s-এ p-এর anagram সব start index — sliding window + frequency, string interview favorite।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Find All Anagrams in a String:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Find All Anagrams in a String solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Find All Anagrams in a String** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**Find All Anagrams in a String** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Find All Anagrams in a String like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Find All Anagrams in a String = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Find All Anagrams in a String-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Find All Anagrams in a String-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '33-lru-cache-design': {
    problem: {
      en: `Design **LRU Cache** with fixed capacity. \`Get(key)\` and \`Put(key, value)\` must be **O(1)**. Evict least recently used when full.`,
      bn: `Fixed capacity **LRU Cache** — \`Get\`/\`Put\` **O(1)**; full হলে least recently used evict।`,
    },
    example: {
      en: `**Input:** capacity=2, Put(1,1), Put(2,2), Get(1)→1, Put(3,3) evicts key 2, Get(2)→-1`,
      bn: `capacity=2, Put(1,1), Put(2,2), Get(1)→1, Put(3,3) key 2 evict, Get(2)→-1`,
    },
    approach: {
      en: `**Pattern:** \`Dictionary\` + \`LinkedList\` for O(1) lookup and reorder.`,
      bn: `**Pattern:** Dictionary + LinkedList — O(1) lookup ও reorder।`,
    },
    solution: {
      en: `1. Map key → linked list node.
2. Get: if missing return -1; move node to front (MRU).
3. Put: update existing or insert at front.
4. If over capacity, remove tail node from map + list.

**Detailed steps:**
1) \`Dictionary<key, LinkedListNode>\` for O(1) lookup.
2) \`LinkedList\` orders MRU at front.
3) Get: move node to front.
4) Put: update or insert at front; if over capacity, remove tail from list + map.

Interview tip: explain why doubly-linked list + map achieves O(1).`,
      bn: `1. key → node map
2. Get: miss → -1; hit → front
3. Put: update/insert front
4. Over capacity → tail remove

**বিস্তারিত:**
1) Dictionary + LinkedList
2) MRU front
3) Get → front
4) Put full → tail remove

Doubly-linked + map = O(1) explain করুন।`,
    },
    complexity: {
      en: `**Get/Put:** O(1) average
**Space:** O(capacity)`,
      bn: `**Get/Put:** O(1)
**Space:** O(capacity)`,
    },
    explanation: {
      what: {
        en: `**LRU Cache** — fixed capacity cache: Get/Put both O(1); evict **least recently used** when full.`,
        bn: `**LRU Cache** — capacity limit; Get/Put O(1); full হলে **least recently used** evict।`,
      },
      why: {
        en: `Top design + DS question for senior .NET — same idea as \`IMemoryCache\` with size limits and Redis LRU.`,
        bn: `Senior .NET design + DS — \`IMemoryCache\`, Redis LRU same idea।`,
      },
      how: {
        en: `1) \`Dictionary<key, LinkedListNode>\` for O(1) lookup.
2) \`LinkedList\` orders MRU at front.
3) Get: move node to front.
4) Put: update or insert at front; if over capacity, remove tail from list + map.

Interview tip: explain why doubly-linked list + map achieves O(1).`,
        bn: `1) Dictionary + LinkedList
2) MRU front
3) Get → front
4) Put full → tail remove

Doubly-linked + map = O(1) explain করুন।`,
      },
      analogy: {
        en: `Desk stack: recently used papers on top; when desk full, throw bottom paper away.`,
        bn: `Desk paper stack — recent top, full হলে bottom ফেলে।`,
      },
      realWorld: {
        en: `IMemoryCache compaction, Redis eviction, HTTP client connection pools.`,
        bn: `IMemoryCache, Redis eviction।`,
      },
    },
  },
  '34-path-sum-on-binary-tree': {
    problem: {
      en: `**Problem:** Return true if tree has root-to-leaf path with given sum. Classic tree DFS.`,
      bn: `**প্রশ্ন:** Root-to-leaf path sum target আছে কিনা — classic tree DFS।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Tree traversal**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Tree traversal**`,
    },
    approach: {
      en: `**Approach:** Use **Tree traversal**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Tree traversal**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Path Sum on Binary Tree:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Path Sum on Binary Tree solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(log n)
**Space:** O(1)`,
      bn: `**Time:** O(log n)
**Space:** O(1)`,
    },
    explanation: {
      what: {
        en: `**Path Sum on Binary Tree** — a common .NET interview coding task using the **Tree traversal** pattern.`,
        bn: `**Path Sum on Binary Tree** — .NET interview-এ common task, **Tree traversal** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Tree traversal).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Tree traversal) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Path Sum on Binary Tree like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Path Sum on Binary Tree = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Path Sum on Binary Tree-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Path Sum on Binary Tree-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '35-meeting-rooms-ii-min-rooms': {
    problem: {
      en: `**Problem:** Minimum conference rooms needed for overlapping intervals. Sort + min-heap — scheduling interview classic.`,
      bn: `**প্রশ্ন:** Overlapping meeting-এ minimum room count — sort + min-heap, scheduling classic।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Meeting Rooms II:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Meeting Rooms II solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Meeting Rooms II** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Meeting Rooms II** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Meeting Rooms II like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Meeting Rooms II = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Meeting Rooms II-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Meeting Rooms II-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '1-hashset-find-all-duplicates': {
    problem: {
      en: `**Problem:** Given int[] nums (1..n), return all elements that appear twice or more. Use HashSet to detect.`,
      bn: `**প্রশ্ন:** int[] nums (1..n) — দুবার বা তার বেশি appear করা সব element return। HashSet দিয়ে detect।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for HashSet — Find All Duplicates:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**HashSet — Find All Duplicates solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**HashSet — Find All Duplicates** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**HashSet — Find All Duplicates** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of HashSet — Find All Duplicates like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `HashSet — Find All Duplicates = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, HashSet — Find All Duplicates-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ HashSet — Find All Duplicates-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '2-stack-evaluate-reverse-polish-notation': {
    problem: {
      en: `Evaluate **Reverse Polish Notation** expression: operators come after operands. Return the final integer result.`,
      bn: `**RPN** expression evaluate — operator operand-এর পরে; final integer return।`,
    },
    example: {
      en: `**Input:** \`["2","1","+","3","*"]\` → **Output:** \`9\` because \`(2+1)*3 = 9\``,
      bn: `**Input:** \`["2","1","+","3","*"]\` → **Output:** \`9\``,
    },
    approach: {
      en: `**Pattern:** Stack — push numbers; on operator pop two, compute, push result.`,
      bn: `**Pattern:** Stack — number push; operator-এ pop দুটো, compute, push।`,
    },
    solution: {
      en: `1. Empty Stack<int>.
2. Token is operator → pop b, pop a, push result.
3. Token is number → push parsed int.
4. Return stack.Pop().`,
      bn: `1. Stack
2. Operator → pop, compute, push
3. Number → push
4. Pop return`,
    },
    complexity: {
      en: `**Time:** O(n)
**Space:** O(n) stack`,
      bn: `**Time:** O(n)
**Space:** O(n)`,
    },
    explanation: {
      what: {
        en: `**Stack — Evaluate Reverse Polish Notation** — a common .NET interview coding task using the **Stack / Queue** pattern.`,
        bn: `**Stack — Evaluate Reverse Polish Notation** — .NET interview-এ common task, **Stack / Queue** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Stack / Queue).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Stack / Queue) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Stack — Evaluate Reverse Polish Notation like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Stack — Evaluate Reverse Polish Notation = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Stack — Evaluate Reverse Polish Notation-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Stack — Evaluate Reverse Polish Notation-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '3-dictionary-first-unique-character-optimized': {
    problem: {
      en: `**Problem:** Return index of first non-repeating character. Two-pass Dictionary count.`,
      bn: `**প্রশ্ন:** প্রথম non-repeating character-এর index — Dictionary count two-pass।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Dictionary — First Unique Character:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Dictionary — First Unique Character solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Dictionary — First Unique Character** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**Dictionary — First Unique Character** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Dictionary — First Unique Character like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Dictionary — First Unique Character = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Dictionary — First Unique Character-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Dictionary — First Unique Character-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '4-queue-shortest-path-in-unweighted-graph': {
    problem: {
      en: `**Problem:** Given adjacency list and start/end nodes, return shortest path length or -1. BFS with Queue.`,
      bn: `**প্রশ্ন:** Adjacency list + start/end — shortest path length BFS Queue, না থাকলে -1।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Graph BFS/DFS**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Graph BFS/DFS**`,
    },
    approach: {
      en: `**Approach:** Use **Graph BFS/DFS**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Graph BFS/DFS**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Queue — Shortest Path in Unweighted Graph:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Queue — Shortest Path in Unweighted Graph solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Queue — Shortest Path in Unweighted Graph** — a common .NET interview coding task using the **Graph BFS/DFS** pattern.`,
        bn: `**Queue — Shortest Path in Unweighted Graph** — .NET interview-এ common task, **Graph BFS/DFS** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Graph BFS/DFS).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Graph BFS/DFS) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Queue — Shortest Path in Unweighted Graph like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Queue — Shortest Path in Unweighted Graph = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Queue — Shortest Path in Unweighted Graph-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Queue — Shortest Path in Unweighted Graph-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '5-priorityqueue-merge-k-sorted-lists-k-2': {
    problem: {
      en: `**Problem:** Merge two sorted linked lists using PriorityQueue or iterative merge (both acceptable).`,
      bn: `**প্রশ্ন:** দুটি sorted linked list merge — PriorityQueue বা iterative merge।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Two pointers**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Two pointers**`,
    },
    approach: {
      en: `**Approach:** Use **Two pointers**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Two pointers**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for PriorityQueue — Merge K Sorted Lists:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**PriorityQueue — Merge K Sorted Lists solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n log n)
**Space:** O(n)`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**PriorityQueue — Merge K Sorted Lists** — a common .NET interview coding task using the **Two pointers** pattern.`,
        bn: `**PriorityQueue — Merge K Sorted Lists** — .NET interview-এ common task, **Two pointers** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Two pointers).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Two pointers) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of PriorityQueue — Merge K Sorted Lists like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `PriorityQueue — Merge K Sorted Lists = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, PriorityQueue — Merge K Sorted Lists-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ PriorityQueue — Merge K Sorted Lists-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '6-linq-group-orders-by-customer-sum-total': {
    problem: {
      en: `Given orders with \`CustomerId\` and \`Amount\`, return **total amount per customer**, sorted by total **descending**.`,
      bn: `\`CustomerId\`, \`Amount\` — customer প্রতি **total amount**, descending sort।`,
    },
    example: {
      en: `**Input:** \`(1,100), (2,50), (1,25)\` → **Output:** \`(1,125), (2,50)\``,
      bn: `**Input:** customer 1→125, customer 2→50`,
    },
    approach: {
      en: `**Pattern:** LINQ GroupBy + Sum + OrderByDescending. Alternative: Dictionary manual loop.`,
      bn: `**Pattern:** LINQ GroupBy + Sum + OrderByDescending।`,
    },
    solution: {
      en: `1. \`orders.GroupBy(o => o.CustomerId)\`
2. \`.Select(g => (g.Key, g.Sum(o => o.Amount)))\`
3. \`.OrderByDescending(x => x.Item2)\`
4. \`.ToList()\``,
      bn: `1. GroupBy CustomerId
2. Sum Amount
3. OrderByDescending
4. ToList`,
    },
    complexity: {
      en: `**Time:** O(n log n) for sort
**Space:** O(n)`,
      bn: `**Time:** O(n log n)
**Space:** O(n)`,
    },
    explanation: {
      what: {
        en: `**LINQ — Group Orders by Customer** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**LINQ — Group Orders by Customer** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Group Orders by Customer like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Group Orders by Customer = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Group Orders by Customer-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Group Orders by Customer-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '7-linq-top-5-products-by-revenue': {
    problem: {
      en: `**Problem:** From sales records (ProductId, Revenue), return top 5 product IDs by revenue.`,
      bn: `**প্রশ্ন:** Sales (ProductId, Revenue) — revenue অনুযায়ী top 5 ProductId।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for LINQ — Top 5 Products by Revenue:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**LINQ — Top 5 Products by Revenue solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**LINQ — Top 5 Products by Revenue** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**LINQ — Top 5 Products by Revenue** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Top 5 Products by Revenue like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Top 5 Products by Revenue = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Top 5 Products by Revenue-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Top 5 Products by Revenue-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '8-string-parsing-parse-csv-line-no-commas-in-quotes': {
    problem: {
      en: `Parse one **CSV line** into fields. Commas inside **double quotes** are not separators.`,
      bn: `এক **CSV line** field-এ parse — **quotes**-এর ভিতর comma separator নয়।`,
    },
    example: {
      en: `**Input:** \`"John,Doe",30,NY\` → **Output:** \`["John,Doe", "30", "NY"]\``,
      bn: `**Input:** \`"John,Doe",30\` → quoted field একটাই field`,
    },
    approach: {
      en: `**Pattern:** Single pass with StringBuilder + \`inQuotes\` flag.`,
      bn: `**Pattern:** StringBuilder + \`inQuotes\` flag single pass।`,
    },
    solution: {
      en: `1. Loop each char.
2. \`"\` toggles inQuotes.
3. \`,\` outside quotes → flush field.
4. Append char otherwise.
5. Flush last field.`,
      bn: `1. char loop
2. quote toggle
3. comma → flush
4. append
5. last flush`,
    },
    complexity: {
      en: `**Time:** O(line length)
**Space:** O(fields)`,
      bn: `**Time:** O(n)
**Space:** O(fields)`,
    },
    explanation: {
      what: {
        en: `**String Parsing — Parse CSV Line** — a common .NET interview coding task using the **String parsing & validation** pattern.`,
        bn: `**String Parsing — Parse CSV Line** — .NET interview-এ common task, **String parsing & validation** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (String parsing & validation).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (String parsing & validation) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of String Parsing — Parse CSV Line like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `String Parsing — Parse CSV Line = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, String Parsing — Parse CSV Line-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ String Parsing — Parse CSV Line-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '9-validation-is-valid-email-simple': {
    problem: {
      en: `**Problem:** Return true if email matches basic pattern: one @, domain with dot. Use Regex or manual check.`,
      bn: `**প্রশ্ন:** Basic email valid: এক @, domain-এ dot — Regex বা manual check।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **String parsing & validation**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **String parsing & validation**`,
    },
    approach: {
      en: `**Approach:** Use **String parsing & validation**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **String parsing & validation**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Validation — Is Valid Email:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Validation — Is Valid Email solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Validation — Is Valid Email** — a common .NET interview coding task using the **String parsing & validation** pattern.`,
        bn: `**Validation — Is Valid Email** — .NET interview-এ common task, **String parsing & validation** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (String parsing & validation).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (String parsing & validation) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Validation — Is Valid Email like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Validation — Is Valid Email = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Validation — Is Valid Email-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Validation — Is Valid Email-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '10-recursion-flatten-nested-list-int': {
    problem: {
      en: `**Problem:** Flatten List<object> where elements are int or nested List — return all ints in order.`,
      bn: `**প্রশ্ন:** Nested List<int> flatten — সব int order-এ return।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Recursion — Flatten Nested List<int>:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Recursion — Flatten Nested List<int> solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(2^n) or O(n·2^n)
**Space:** O(n) recursion`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Recursion — Flatten Nested List<int>** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Recursion — Flatten Nested List<int>** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Recursion — Flatten Nested List<int> like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Recursion — Flatten Nested List<int> = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Recursion — Flatten Nested List<int>-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Recursion — Flatten Nested List<int>-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '11-sort-multiple-keys-name-then-age': {
    problem: {
      en: `**Problem:** Sort List<Person> by Name ascending, then Age ascending. Use LINQ OrderBy.ThenBy or Comparison.`,
      bn: `**প্রশ্ন:** List<Person> Name ascending, তারপর Age ascending sort।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Sort — Multiple Keys:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Sort — Multiple Keys solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n log n)
**Space:** O(n)`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Sort — Multiple Keys** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Sort — Multiple Keys** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Sort — Multiple Keys like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Sort — Multiple Keys = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Sort — Multiple Keys-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Sort — Multiple Keys-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '12-pagination-skip-and-take': {
    problem: {
      en: `**Problem:** Implement GetPage<T>(items, page, pageSize) returning items for 1-based page number.`,
      bn: `**প্রশ্ন:** GetPage<T>(items, page, pageSize) — 1-based page number-এর items return।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Pagination — Skip and Take:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Pagination — Skip and Take solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Pagination — Skip and Take** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**Pagination — Skip and Take** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Pagination — Skip and Take like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Pagination — Skip and Take = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Pagination — Skip and Take-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Pagination — Skip and Take-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '13-graph-dfs-can-reach-destination': {
    problem: {
      en: `**Problem:** Given directed graph adjacency list, return true if there is a path from source to destination.`,
      bn: `**প্রশ্ন:** Directed graph — source থেকে destination path আছে কিনা DFS।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Graph BFS/DFS**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Graph BFS/DFS**`,
    },
    approach: {
      en: `**Approach:** Use **Graph BFS/DFS**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Graph BFS/DFS**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Graph DFS — Can Reach Destination?:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Graph DFS — Can Reach Destination? solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Graph DFS — Can Reach Destination?** — a common .NET interview coding task using the **Graph BFS/DFS** pattern.`,
        bn: `**Graph DFS — Can Reach Destination?** — .NET interview-এ common task, **Graph BFS/DFS** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Graph BFS/DFS).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Graph BFS/DFS) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Graph DFS — Can Reach Destination? like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Graph DFS — Can Reach Destination? = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Graph DFS — Can Reach Destination?-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Graph DFS — Can Reach Destination?-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '14-tree-dfs-sum-of-all-node-values': {
    problem: {
      en: `**Problem:** Return sum of all values in binary tree. Simple DFS recursion.`,
      bn: `**প্রশ্ন:** Binary tree সব node value-এর sum — DFS recursion।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Tree traversal**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Tree traversal**`,
    },
    approach: {
      en: `**Approach:** Use **Tree traversal**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Tree traversal**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Tree DFS — Sum of All Node Values:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Tree DFS — Sum of All Node Values solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Tree DFS — Sum of All Node Values** — a common .NET interview coding task using the **Tree traversal** pattern.`,
        bn: `**Tree DFS — Sum of All Node Values** — .NET interview-এ common task, **Tree traversal** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Tree traversal).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Tree traversal) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Tree DFS — Sum of All Node Values like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Tree DFS — Sum of All Node Values = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Tree DFS — Sum of All Node Values-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Tree DFS — Sum of All Node Values-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '15-decimal-tiered-tax-calculation': {
    problem: {
      en: `**Problem:** Calculate tax: first 1000 at 10%, amount above 1000 at 20%. Use decimal.`,
      bn: `**প্রশ্ন:** Tax: প্রথম 1000 → 10%, বাকি → 20% — decimal ব্যবহার করুন।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Business logic (decimal)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Business logic (decimal)**`,
    },
    approach: {
      en: `**Approach:** Use **Business logic (decimal)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Business logic (decimal)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Decimal — Tiered Tax Calculation:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Decimal — Tiered Tax Calculation solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Decimal — Tiered Tax Calculation** — a common .NET interview coding task using the **Business logic (decimal)** pattern.`,
        bn: `**Decimal — Tiered Tax Calculation** — .NET interview-এ common task, **Business logic (decimal)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Business logic (decimal)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Business logic (decimal)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Decimal — Tiered Tax Calculation like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Decimal — Tiered Tax Calculation = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Decimal — Tiered Tax Calculation-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Decimal — Tiered Tax Calculation-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '16-hashmap-two-sum-with-all-pairs-follow-up': {
    problem: {
      en: `**Problem:** Return all unique index pairs (i,j) where i<j and nums[i]+nums[j]=target. Dictionary of value to indices.`,
      bn: `**প্রশ্ন:** সব unique pair (i,j) যেখানে nums[i]+nums[j]=target — Dictionary value→indices।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for HashMap — Two Sum With All Pairs:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.

**Detailed steps:**
1) Create empty \`Dictionary<int,int>\` mapping **value → index**.
2) For each \`nums[i]\`, compute \`need = target - nums[i]\`.
3) If \`need\` is already in the map, return \`[map[need], i]\`.
4) Else store \`nums[i] → i\`.

**Walkthrough:** nums=[2,7,11], target=9
- i=0: need=7, map empty → store 2→0
- i=1: need=2, map has 2 at index 0 → return [0,1]`,
      bn: `**HashMap — Two Sum With All Pairs solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।

**বিস্তারিত:**
1) খালি \`Dictionary<int,int>\` — **value → index**।
2) প্রতি \`nums[i]\`-এ \`need = target - nums[i]\`।
3) \`need\` map-এ থাকলে \`[map[need], i]\` return।
4) না হলে \`nums[i] → i\` store।

**উদাহরণ:** [2,7,11], target=9 → index [0,1]`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Two Sum**: given an array and a target number, find **two indices** whose values add up to the target.`,
        bn: `**Two Sum**: array ও target দিয়ে **দুটি index** খুঁজুন যাদের যোগ target।`,
      },
      why: {
        en: `This is the #1 pattern for "find a pair" problems. It teaches **Dictionary** usage — core skill for .NET developers working with lookups and caching.`,
        bn: `"Pair খুঁজুন" pattern-এর #১ — **Dictionary** শেখায়, .NET-এ lookup/cache-এর base।`,
      },
      how: {
        en: `1) Create empty \`Dictionary<int,int>\` mapping **value → index**.
2) For each \`nums[i]\`, compute \`need = target - nums[i]\`.
3) If \`need\` is already in the map, return \`[map[need], i]\`.
4) Else store \`nums[i] → i\`.

**Walkthrough:** nums=[2,7,11], target=9
- i=0: need=7, map empty → store 2→0
- i=1: need=2, map has 2 at index 0 → return [0,1]`,
        bn: `1) খালি \`Dictionary<int,int>\` — **value → index**।
2) প্রতি \`nums[i]\`-এ \`need = target - nums[i]\`।
3) \`need\` map-এ থাকলে \`[map[need], i]\` return।
4) না হলে \`nums[i] → i\` store।

**উদাহরণ:** [2,7,11], target=9 → index [0,1]`,
      },
      analogy: {
        en: `Like finding a friend in a party who has the **exact money** you need to reach the bill total — you remember who you already met (hash map) instead of asking everyone again.`,
        bn: `Party-তে bill মেটাতে **ঠিক কত টাকা** দরকার — আগে যাদের দেখেছেন map-এ রাখুন, আবার সবাইকে জিজ্ঞেস নয়।`,
      },
      realWorld: {
        en: `Same idea as matching invoice lines to payments, or finding two API keys that hash to a required checksum.`,
        bn: `Invoice line ↔ payment match — একই lookup idea।`,
      },
    },
    commonMistakes: [
      { en: `Nested loop O(n²) without mentioning optimization`, bn: `Say: O(n) time, O(n) space for the Dictionary` },
      { en: `Returning values instead of indices`, bn: `Returning values instead of indices` },
    ],
    bestPractices: [
      { en: `Say: O(n) time, O(n) space for the Dictionary`, bn: `Say: O(n) time, O(n) space for the Dictionary` },
    ],
  },
  '17-stack-min-stack-design': {
    problem: {
      en: `Design a stack with \`Push\`, \`Pop\`, \`Top\`, and **\`GetMin\` all O(1)**.`,
      bn: `Stack \`Push\`, \`Pop\`, \`Top\`, **\`GetMin\` সব O(1)** design।`,
    },
    example: {
      en: `Push 3, Push 1, GetMin→1, Pop, GetMin→3`,
      bn: `Push 3, Push 1, GetMin→1, Pop, GetMin→3`,
    },
    approach: {
      en: `**Pattern:** Auxiliary stack tracking minimum at each depth.`,
      bn: `**Pattern:** Auxiliary stack — প্রতি depth-এ min track।`,
    },
    solution: {
      en: `1. Main stack + min stack.
2. Push: push value; push Min(value, minPeek).
3. Pop both stacks.
4. GetMin = min stack Peek.`,
      bn: `1. main + min stack
2. push both
3. pop both
4. GetMin = min.Peek`,
    },
    complexity: {
      en: `**All ops:** O(1)
**Space:** O(n)`,
      bn: `**All ops:** O(1)
**Space:** O(n)`,
    },
    explanation: {
      what: {
        en: `**Stack — Min Stack Design** — a common .NET interview coding task using the **Stack / Queue** pattern.`,
        bn: `**Stack — Min Stack Design** — .NET interview-এ common task, **Stack / Queue** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Stack / Queue).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Stack / Queue) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Stack — Min Stack Design like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Stack — Min Stack Design = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Stack — Min Stack Design-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Stack — Min Stack Design-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '18-sliding-window-longest-repeating-character-replacement': {
    problem: {
      en: `**Problem:** String s and k — you can replace at most k chars. Longest substring with same letter. Window + frequency.`,
      bn: `**প্রশ্ন:** String s, k replace — same letter-এর longest substring sliding window + frequency।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Sliding window**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Sliding window**`,
    },
    approach: {
      en: `**Approach:** Use **Sliding window**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Sliding window**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Sliding Window — Longest Repeating Character Replacement:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Sliding Window — Longest Repeating Character Replacement solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Sliding Window — Longest Repeating Character Replacement** — a common .NET interview coding task using the **Sliding window** pattern.`,
        bn: `**Sliding Window — Longest Repeating Character Replacement** — .NET interview-এ common task, **Sliding window** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Sliding window).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Sliding window) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Sliding Window — Longest Repeating Character Replacement like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Sliding Window — Longest Repeating Character Replacement = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Sliding Window — Longest Repeating Character Replacement-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Sliding Window — Longest Repeating Character Replacement-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '19-dp-house-robber-ii-circular-street': {
    problem: {
      en: `**Problem:** Houses in circle — cannot rob first and last together. Run house robber on [0..n-2] and [1..n-1], take max.`,
      bn: `**প্রশ্ন:** Circular street — first ও last একসাথে rob নয়। [0..n-2] ও [1..n-1] robber max।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Tree traversal**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Tree traversal**`,
    },
    approach: {
      en: `**Approach:** Use **Tree traversal**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Tree traversal**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for DP — House Robber II:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**DP — House Robber II solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**DP — House Robber II** — a common .NET interview coding task using the **Tree traversal** pattern.`,
        bn: `**DP — House Robber II** — .NET interview-এ common task, **Tree traversal** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Tree traversal).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Tree traversal) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of DP — House Robber II like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `DP — House Robber II = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, DP — House Robber II-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ DP — House Robber II-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '20-concurrentdictionary-thread-safe-word-count': {
    problem: {
      en: `**Problem:** Count word frequencies from IEnumerable<string> safely when called from parallel tasks. ConcurrentDictionary or lock + Dictionary.`,
      bn: `**প্রশ্ন:** Parallel task থেকে word frequency count — ConcurrentDictionary বা lock+Dictionary।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for ConcurrentDictionary — Thread-Safe Word Count:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**ConcurrentDictionary — Thread-Safe Word Count solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**ConcurrentDictionary — Thread-Safe Word Count** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**ConcurrentDictionary — Thread-Safe Word Count** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of ConcurrentDictionary — Thread-Safe Word Count like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `ConcurrentDictionary — Thread-Safe Word Count = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, ConcurrentDictionary — Thread-Safe Word Count-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ ConcurrentDictionary — Thread-Safe Word Count-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '21-linq-find-duplicate-emails-erp': {
    problem: {
      en: `**Problem:** From employee list, return emails appearing more than once — BD live coding favorite.`,
      bn: `**প্রশ্ন:** Duplicate email — GroupBy, BD interview live coding।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for LINQ — Find Duplicate Emails:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**LINQ — Find Duplicate Emails solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**LINQ — Find Duplicate Emails** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**LINQ — Find Duplicate Emails** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Find Duplicate Emails like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Find Duplicate Emails = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Find Duplicate Emails-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Find Duplicate Emails-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '22-second-highest-salary-distinct-skip': {
    problem: {
      en: `**Problem:** Second highest salary with duplicate salary values handled.`,
      bn: `**প্রশ্ন:** Duplicate salary সহ second highest — Distinct + OrderByDescending + Skip(1)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Second Highest Salary:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Second Highest Salary solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Second Highest Salary** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**Second Highest Salary** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Second Highest Salary like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Second Highest Salary = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Second Highest Salary-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Second Highest Salary-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '23-missing-numbers-1-n': {
    problem: {
      en: `**Problem:** Return missing numbers in sequence using Range and Except.`,
      bn: `**প্রশ্ন:** ১..n missing number — Enumerable.Range + Except।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Bit manipulation (XOR)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Bit manipulation (XOR)**`,
    },
    approach: {
      en: `**Approach:** Use **Bit manipulation (XOR)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Bit manipulation (XOR)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Missing Numbers 1..n:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Missing Numbers 1..n solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Missing Numbers 1..n** — a common .NET interview coding task using the **Bit manipulation (XOR)** pattern.`,
        bn: `**Missing Numbers 1..n** — .NET interview-এ common task, **Bit manipulation (XOR)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Bit manipulation (XOR)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Bit manipulation (XOR)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Missing Numbers 1..n like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Missing Numbers 1..n = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Missing Numbers 1..n-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Missing Numbers 1..n-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '24-employee-exists-any-not-count': {
    problem: {
      en: `**Problem:** Check existence with Any() — stops at first match.`,
      bn: `**প্রশ্ন:** Exists check — Any(), Count()>0 নয়।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Employee Exists — Any:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Employee Exists — Any solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Employee Exists — Any** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Employee Exists — Any** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Employee Exists — Any like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Employee Exists — Any = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Employee Exists — Any-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Employee Exists — Any-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '25-top-3-salary-dept-average': {
    problem: {
      en: `**Problem:** Top 3 by salary; group by department for average salary.`,
      bn: `**প্রশ্ন:** Top 3 salary; department-wise Average — OrderByDescending.Take + GroupBy.Average।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Top 3 Salary + Dept Average:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Top 3 Salary + Dept Average solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Top 3 Salary + Dept Average** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Top 3 Salary + Dept Average** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Top 3 Salary + Dept Average like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Top 3 Salary + Dept Average = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Top 3 Salary + Dept Average-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Top 3 Salary + Dept Average-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '26-dynamic-linq-search-iqueryable': {
    problem: {
      en: `**Problem:** Optional filters on name/department — query composes before ToListAsync.`,
      bn: `**প্রশ্ন:** Optional filter — IQueryable compose, শেষে ToListAsync।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Binary search**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Binary search**`,
    },
    approach: {
      en: `**Approach:** Use **Binary search**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Binary search**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Dynamic LINQ Search:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Dynamic LINQ Search solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Dynamic LINQ Search** — a common .NET interview coding task using the **Binary search** pattern.`,
        bn: `**Dynamic LINQ Search** — .NET interview-এ common task, **Binary search** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Binary search).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Binary search) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Dynamic LINQ Search like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Dynamic LINQ Search = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Dynamic LINQ Search-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Dynamic LINQ Search-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '27-pagination-search-sort-api': {
    problem: {
      en: `**Problem:** Search, sort switch, Skip/Take with AsNoTracking.`,
      bn: `**প্রশ্ন:** Search + sort + pagination — AsNoTracking।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Binary search**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Binary search**`,
    },
    approach: {
      en: `**Approach:** Use **Binary search**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Binary search**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Pagination + Search + Sort API:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Pagination + Search + Sort API solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n log n)
**Space:** O(n)`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Pagination + Search + Sort API** — a common .NET interview coding task using the **Binary search** pattern.`,
        bn: `**Pagination + Search + Sort API** — .NET interview-এ common task, **Binary search** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Binary search).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Binary search) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Pagination + Search + Sort API like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Pagination + Search + Sort API = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Pagination + Search + Sort API-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Pagination + Search + Sort API-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '28-reverse-string-two-pointers': {
    problem: {
      en: `**Problem:** Reverse string in-place — O(n) time, O(1) extra space.`,
      bn: `**প্রশ্ন:** Two pointer string reverse — O(n) time।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Two pointers**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Two pointers**`,
    },
    approach: {
      en: `**Approach:** Use **Two pointers**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Two pointers**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Reverse String:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Reverse String solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Reverse String** — a common .NET interview coding task using the **Two pointers** pattern.`,
        bn: `**Reverse String** — .NET interview-এ common task, **Two pointers** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Two pointers).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Two pointers) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Reverse String like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Reverse String = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Reverse String-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Reverse String-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '29-sql-second-highest-salary': {
    problem: {
      en: `**Problem:** T-SQL second highest salary subquery pattern.`,
      bn: `**প্রশ্ন:** T-SQL second highest — MAX subquery।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for SQL — Second Highest Salary:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**SQL — Second Highest Salary solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**SQL — Second Highest Salary** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**SQL — Second Highest Salary** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of SQL — Second Highest Salary like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `SQL — Second Highest Salary = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, SQL — Second Highest Salary-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ SQL — Second Highest Salary-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '30-sql-duplicate-email-group-by-having': {
    problem: {
      en: `**Problem:** Find duplicate emails in SQL — interview classic.`,
      bn: `**প্রশ্ন:** SQL duplicate email — GROUP BY HAVING COUNT>1।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for SQL — Duplicate Email:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**SQL — Duplicate Email solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**SQL — Duplicate Email** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**SQL — Duplicate Email** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of SQL — Duplicate Email like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `SQL — Duplicate Email = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, SQL — Duplicate Email-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ SQL — Duplicate Email-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '31-linq-employees-joined-last-30-days': {
    problem: {
      en: `**Problem:** Filter employees where DateJoined >= today minus 30 days.`,
      bn: `**প্রশ্ন:** গত ৩০ দিনে join করা employee — DateJoined filter।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for LINQ — Employees Joined Last 30 Days:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**LINQ — Employees Joined Last 30 Days solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**LINQ — Employees Joined Last 30 Days** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**LINQ — Employees Joined Last 30 Days** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Employees Joined Last 30 Days like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Employees Joined Last 30 Days = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Employees Joined Last 30 Days-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Employees Joined Last 30 Days-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '32-linq-highest-paid-per-department': {
    problem: {
      en: `**Problem:** Return highest salary employee from each department.`,
      bn: `**প্রশ্ন:** প্রতি department-এ highest salary employee — GroupBy + OrderByDescending + First।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for LINQ — Highest Paid Per Department:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**LINQ — Highest Paid Per Department solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**LINQ — Highest Paid Per Department** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**LINQ — Highest Paid Per Department** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Highest Paid Per Department like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Highest Paid Per Department = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Highest Paid Per Department-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Highest Paid Per Department-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '33-linq-multiple-sort-salary-desc-name-asc': {
    problem: {
      en: `**Problem:** Sort by salary descending then name ascending.`,
      bn: `**প্রশ্ন:** Salary descending, তারপর Name ascending — OrderByDescending.ThenBy।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for LINQ — Multiple Sort:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**LINQ — Multiple Sort solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n log n)
**Space:** O(n)`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**LINQ — Multiple Sort** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**LINQ — Multiple Sort** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Multiple Sort like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Multiple Sort = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Multiple Sort-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Multiple Sort-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '34-linq-intersect-common-elements': {
    problem: {
      en: `**Problem:** Find common elements between two lists.`,
      bn: `**প্রশ্ন:** দুটি list-এর common element — Intersect()।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for LINQ — Intersect Common Elements:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**LINQ — Intersect Common Elements solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**LINQ — Intersect Common Elements** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**LINQ — Intersect Common Elements** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Intersect Common Elements like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Intersect Common Elements = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Intersect Common Elements-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Intersect Common Elements-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '35-prime-number-check': {
    problem: {
      en: `**Problem:** Return true if number is prime — check up to sqrt(n).`,
      bn: `**প্রশ্ন:** Prime check — sqrt(n) পর্যন্ত loop।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Prime Number Check:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Prime Number Check solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Prime Number Check** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Prime Number Check** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Prime Number Check like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Prime Number Check = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Prime Number Check-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Prime Number Check-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '36-specification-pattern-active-employees': {
    problem: {
      en: `**Problem:** Encapsulate query logic in reusable specification applying to IQueryable.`,
      bn: `**প্রশ্ন:** Specification Pattern — query logic reusable specification-এ।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Specification Pattern — Active Employees:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Specification Pattern — Active Employees solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Specification Pattern — Active Employees** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Specification Pattern — Active Employees** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Specification Pattern — Active Employees like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Specification Pattern — Active Employees = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Specification Pattern — Active Employees-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Specification Pattern — Active Employees-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '37-bulk-insert-50k-employees': {
    problem: {
      en: `**Problem:** Import large employee list — use bulk extension or SqlBulkCopy, not foreach SaveChanges.`,
      bn: `**প্রশ্ন:** ৫০k employee import — BulkInsert/SqlBulkCopy, foreach SaveChanges নয়।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Bulk Insert — 50k Employees:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Bulk Insert — 50k Employees solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Bulk Insert — 50k Employees** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Bulk Insert — 50k Employees** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Bulk Insert — 50k Employees like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Bulk Insert — 50k Employees = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Bulk Insert — 50k Employees-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Bulk Insert — 50k Employees-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '38-rate-limiting-login-api-net-8': {
    problem: {
      en: `**Problem:** Fixed window rate limiter on login endpoint — 5 requests per minute.`,
      bn: `**প্রশ্ন:** Login API rate limit — ৫ request/minute FixedWindowLimiter।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Rate Limiting — Login API:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Rate Limiting — Login API solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Rate Limiting — Login API** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Rate Limiting — Login API** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Rate Limiting — Login API like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Rate Limiting — Login API = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Rate Limiting — Login API-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Rate Limiting — Login API-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '39-distributed-cache-pattern': {
    problem: {
      en: `**Problem:** Cache-aside: check Redis, miss then SQL, set cache, invalidate on update.`,
      bn: `**প্রশ্ন:** Cache-aside: Redis check → SQL → set cache; update-এ invalidate।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Distributed Cache Pattern:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Distributed Cache Pattern solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Distributed Cache Pattern** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Distributed Cache Pattern** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Distributed Cache Pattern like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Distributed Cache Pattern = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Distributed Cache Pattern-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Distributed Cache Pattern-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '40-sql-running-total-salary': {
    problem: {
      en: `**Problem:** Running total of salary ordered by EmployeeID using window function.`,
      bn: `**প্রশ্ন:** Running total salary — SUM() OVER (ORDER BY EmployeeID)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for SQL — Running Total Salary:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**SQL — Running Total Salary solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**SQL — Running Total Salary** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**SQL — Running Total Salary** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of SQL — Running Total Salary like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `SQL — Running Total Salary = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, SQL — Running Total Salary-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ SQL — Running Total Salary-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '41-linq-highest-salary-employee-maxby': {
    problem: {
      en: `**Problem:** Find employee with maximum salary — OrderByDescending First or MaxBy (.NET 6+).`,
      bn: `**প্রশ্ন:** Highest salary employee — MaxBy বা OrderByDescending().First()।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for LINQ — Highest Salary Employee:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**LINQ — Highest Salary Employee solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**LINQ — Highest Salary Employee** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**LINQ — Highest Salary Employee** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Highest Salary Employee like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Highest Salary Employee = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Highest Salary Employee-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Highest Salary Employee-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '42-linq-department-employee-count': {
    problem: {
      en: `**Problem:** Group employees by department and return count per department.`,
      bn: `**প্রশ্ন:** Department-wise count — GroupBy + Count()।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **LINQ & collections**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **LINQ & collections**`,
    },
    approach: {
      en: `**Approach:** Use **LINQ & collections**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **LINQ & collections**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for LINQ — Department Employee Count:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**LINQ — Department Employee Count solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**LINQ — Department Employee Count** — a common .NET interview coding task using the **LINQ & collections** pattern.`,
        bn: `**LINQ — Department Employee Count** — .NET interview-এ common task, **LINQ & collections** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (LINQ & collections).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (LINQ & collections) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of LINQ — Department Employee Count like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `LINQ — Department Employee Count = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, LINQ — Department Employee Count-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ LINQ — Department Employee Count-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '43-count-words-in-string': {
    problem: {
      en: `**Problem:** Split string by whitespace and count non-empty tokens.`,
      bn: `**প্রশ্ন:** Word count — Split + empty filter।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Count Words in String:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Count Words in String solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Count Words in String** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Count Words in String** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Count Words in String like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Count Words in String = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Count Words in String-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Count Words in String-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '44-remove-duplicate-numbers': {
    problem: {
      en: `**Problem:** Return list with duplicates removed — Distinct or HashSet.`,
      bn: `**প্রশ্ন:** Duplicate number remove — Distinct()।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Hash map (Dictionary/HashSet)**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Hash map (Dictionary/HashSet)**`,
    },
    approach: {
      en: `**Approach:** Use **Hash map (Dictionary/HashSet)**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Hash map (Dictionary/HashSet)**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Remove Duplicate Numbers:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Remove Duplicate Numbers solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Remove Duplicate Numbers** — a common .NET interview coding task using the **Hash map (Dictionary/HashSet)** pattern.`,
        bn: `**Remove Duplicate Numbers** — .NET interview-এ common task, **Hash map (Dictionary/HashSet)** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Hash map (Dictionary/HashSet)).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Hash map (Dictionary/HashSet)) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Remove Duplicate Numbers like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Remove Duplicate Numbers = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Remove Duplicate Numbers-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Remove Duplicate Numbers-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '45-filter-even-numbers': {
    problem: {
      en: `**Problem:** Return only even numbers from a list.`,
      bn: `**প্রশ্ন:** Even numbers — Where(n => n % 2 == 0)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Filter Even Numbers:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Filter Even Numbers solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Filter Even Numbers** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Filter Even Numbers** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Filter Even Numbers like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Filter Even Numbers = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Filter Even Numbers-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Filter Even Numbers-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '46-top-5-most-recent-joiners': {
    problem: {
      en: `**Problem:** Order by DateJoined descending and take top 5.`,
      bn: `**প্রশ্ন:** Top 5 recent join — OrderByDescending(DateJoined).Take(5)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Top 5 Most Recent Joiners:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Top 5 Most Recent Joiners solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Top 5 Most Recent Joiners** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Top 5 Most Recent Joiners** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Top 5 Most Recent Joiners like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Top 5 Most Recent Joiners = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Top 5 Most Recent Joiners-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Top 5 Most Recent Joiners-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '47-employees-without-department': {
    problem: {
      en: `**Problem:** Find employees where Department is null or empty.`,
      bn: `**প্রশ্ন:** Department null/empty employee — Where filter।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Employees Without Department:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Employees Without Department solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Employees Without Department** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Employees Without Department** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Employees Without Department like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Employees Without Department = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Employees Without Department-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Employees Without Department-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '48-oldest-employee': {
    problem: {
      en: `**Problem:** Find employee with earliest DateOfBirth.`,
      bn: `**প্রশ্ন:** Oldest employee — OrderBy(DateOfBirth).First()।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Oldest Employee:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Oldest Employee solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Oldest Employee** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Oldest Employee** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Oldest Employee like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Oldest Employee = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Oldest Employee-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Oldest Employee-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '49-total-salary-sum': {
    problem: {
      en: `**Problem:** Sum all employee salaries — handle empty list.`,
      bn: `**প্রশ্ন:** Total salary — Sum(x => x.Salary)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Total Salary Sum:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Total Salary Sum solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Total Salary Sum** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Total Salary Sum** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Total Salary Sum like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Total Salary Sum = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Total Salary Sum-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Total Salary Sum-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '50-sql-nth-highest-salary-dense-rank': {
    problem: {
      en: `**Problem:** Find 3rd highest salary using window function.`,
      bn: `**প্রশ্ন:** Nth highest — DENSE_RANK() OVER (ORDER BY Salary DESC)।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for SQL — Nth Highest Salary:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**SQL — Nth Highest Salary solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**SQL — Nth Highest Salary** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**SQL — Nth Highest Salary** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of SQL — Nth Highest Salary like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `SQL — Nth Highest Salary = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, SQL — Nth Highest Salary-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ SQL — Nth Highest Salary-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '51-generic-repository-interface': {
    problem: {
      en: `**Problem:** IRepository<T> with common CRUD — used when team needs test boundary beyond DbContext.`,
      bn: `**প্রশ্ন:** Generic Repository — IRepository<T> CRUD abstraction।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Generic Repository Interface:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Generic Repository Interface solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Generic Repository Interface** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Generic Repository Interface** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Generic Repository Interface like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Generic Repository Interface = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Generic Repository Interface-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Generic Repository Interface-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '52-optimistic-concurrency-rowversion': {
    problem: {
      en: `**Problem:** Handle concurrent updates with Timestamp RowVersion and DbUpdateConcurrencyException.`,
      bn: `**প্রশ্ন:** RowVersion + DbUpdateConcurrencyException handle।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Optimistic Concurrency:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Optimistic Concurrency solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Optimistic Concurrency** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Optimistic Concurrency** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Optimistic Concurrency like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Optimistic Concurrency = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Optimistic Concurrency-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Optimistic Concurrency-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '53-background-queue-channel': {
    problem: {
      en: `**Problem:** Enqueue work items processed by IHostedService — do not block HTTP request.`,
      bn: `**প্রশ্ন:** Background queue — Channel + HostedService worker।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for Background Queue:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**Background Queue solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**Background Queue** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**Background Queue** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of Background Queue like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `Background Queue = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, Background Queue-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ Background Queue-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
  '54-mediatr-command-handler-cqrs': {
    problem: {
      en: `**Problem:** Send command via IMediator — handler contains single use-case logic.`,
      bn: `**প্রশ্ন:** MediatR — IRequest → handler, controller thin।`,
    },
    example: {
      en: `**How to explain in interview:**
1. Write one small **input** on the board.
2. Draw the **expected output**.
3. Mention one **edge case** (empty, single item, duplicate).

Pattern: **Problem solving**`,
      bn: `**Interview-তে:**
1. ছোট **input** লিখুন
2. **Output** draw করুন
3. এক **edge case** বলুন

Pattern: **Problem solving**`,
    },
    approach: {
      en: `**Approach:** Use **Problem solving**.
- Name the C# type (Dictionary, Stack, Queue, etc.)
- Say brute force first, then optimized idea
- Write 3–5 bullet steps before coding`,
      bn: `**Approach:** **Problem solving**।
- C# type বলুন (Dictionary, Stack…)
- আগে brute force, তারপর optimize
- Code-এর আগে ৩–৫ bullet step`,
    },
    solution: {
      en: `**Solution outline for MediatR Command Handler:**
1. Handle null/empty input.
2. Initialize data structures.
3. Main loop or recursion (core logic).
4. Return the answer.
5. Walk through your example on the board.

↓ Full **C# code** is below — match each block to these steps.`,
      bn: `**MediatR Command Handler solution outline:**
1. null/empty handle
2. Structure init
3. Main loop/recursion
4. Return
5. Example trace

↓ **C# code** নিচে — step-এর সাথে match করুন।`,
    },
    complexity: {
      en: `**Time:** O(n) typical for one pass
**Space:** O(1) to O(n) — state in answer aloud`,
      bn: `**Time:** O(n) (typical)
**Space:** O(1)–O(n) — interview-তে বলুন`,
    },
    explanation: {
      what: {
        en: `**MediatR Command Handler** — a common .NET interview coding task using the **Problem solving** pattern.`,
        bn: `**MediatR Command Handler** — .NET interview-এ common task, **Problem solving** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**
1) **Understand** — write one example input/output.
2) **Brute force** — describe naive approach and its complexity.
3) **Optimize** — name the pattern (Problem solving).
4) **Code** — small methods, meaningful names.
5) **Test** — empty input, single element, duplicates.
6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**
1) Example input/output লিখুন।
2) Brute force + complexity।
3) Pattern (Problem solving) বলুন।
4) Clean C# code।
5) Edge case test।
6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of MediatR Command Handler like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `MediatR Command Handler = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, MediatR Command Handler-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ MediatR Command Handler-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: `Starting to code without an example walkthrough.`, bn: `Example walkthrough ছাড়া code শুরু।` },
      { en: `Not mentioning time/space complexity.`, bn: `Time/space complexity না বলা।` },
    ],
    bestPractices: [
      { en: `Use meaningful names: \`left\`, \`right\`, \`seen\`, not \`i\`, \`j\`, \`d\`.`, bn: `Meaningful name: \`left\`, \`seen\` — \`i\`, \`d\` নয়।` },
      { en: `Handle null/empty input first.`, bn: `Null/empty input আগে handle।` },
    ],
  },
};
