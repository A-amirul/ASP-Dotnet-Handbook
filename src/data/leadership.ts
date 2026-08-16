export const leadershipData = {
  id: 'leadership',
  title: 'Behavioral & Leadership for Senior Engineers',
  description:
    'How senior .NET candidates answer behavioral questions: frameworks you can reuse on real stories, not robotic scripts. Interviewers hire judgment, ownership, and the ability to make others better — not a memorized monologue.',
  sections: [
    {
      topic: 'Tell Me About Yourself / Why Hire You as Senior',
      difficulty: 'senior',
      english: `This is not your CV in chronological order. It is a 90-second thesis: the problems you are built to own, proof you have owned them, and why this team. A senior pitch connects production impact to how you work with others. Mid-level lists technologies; senior names decisions, failure modes, and people you unblocked.`,
      bangla: 'সিভি আবৃত্তি নয় — ৯০ সেকেন্ডে আপনি কোন সমস্যা সলভ করেন, প্রমাণ, আর এই টিমে কেন। সিনিয়র = ডিসিশন + ইমপ্যাক্ট + অন্যকে আনব্লক করা।',
      details: `
### Framework: Present → Past → Future → Fit (not a life story)

| Beat | Time | What you do | What you avoid |
| :--- | :--- | :--- | :--- |
| **Present** | 20s | Role, domain, the hard problem you own now | Listing every framework |
| **Past** | 30s | 1–2 proof points with numbers (latency, incidents, team) | Every job since university |
| **Future** | 20s | What you want to own next (scope, not title hunting) | "I want to grow" with no direction |
| **Fit** | 20s | Why *this* team: their product, scale, or engineering bar | Generic "I love challenges" |

### Why hire you as Senior (separate from the bio)

Use **Scope × Judgment × Multiplier**:
- **Scope:** you own a problem end-to-end (API + data + ops + people), not a ticket.
- **Judgment:** you choose the simplest design that meets non-functionals and you can explain the trade-off.
- **Multiplier:** the team ships when you are on leave because you documented, reviewed, and mentored.

### English skeleton (fill with *your* facts)
"I am a senior .NET engineer who owns [domain] in production. Recently I [decision] which [metric]. Before that I [incident or migration]. I am looking for [scope]. Your [product/scale] is a fit because [specific]."

### What interviewers score
- Can you summarize without rambling?
- Do you sound like you owned outcomes, or like you were in the room?
- Do you know *this* company, or is the last sentence copy-paste?
      `,
      code: `// Mental outline — never read this aloud as a script
// 1. Present: "I own X in production (scale, constraints)."
// 2. Proof:   one metric + one decision + one failure you learned from
// 3. Multiplier: review, mentoring, runbooks — team ships without you
// 4. Fit:     one sentence that could only be about THIS job
// 5. Stop.    Ask: "I can go deeper on the incident or the architecture — which helps?"`,
      commonMistakes: [
        'Ten minutes of chronology ending in "and now I want a senior role."',
        'Name-dropping Kafka/microservices with no decision or failure.',
        'A pitch that would work for any company on the planet.',
      ],
      bestPractices: [
        'Rehearse 90 seconds out loud; then a 3-minute version if they ask.',
        'Keep two proof points: one technical, one people/process.',
        'End with a question so it becomes a conversation.',
      ],
      interviewQs: [
        {
          q: 'Tell me about yourself.',
          a: 'STAR-L is the wrong shape for this one — use Present → Past → Future → Fit. Situation is your current ownership (domain, scale). Task is the hard problem on your plate. Action is one decision you made (not a list of tools). Result is a metric or a risk you reduced. Learning is optional in the 90s version. Then one sentence of fit. Stop talking. If they want depth they will ask; that is why you parked an incident and an architecture story.',
          bangla: 'Present-Past-Future-Fit — ৯০ সেকেন্ড। STAR এখানে গল্প লম্বা করে। শেষে থামুন।',
          followUp: 'Walk me through the last production system you owned.',
          difficulty: 'senior',
        },
        {
          q: 'Why should we hire you as a Senior Engineer rather than a strong mid-level?',
          a: 'Framework: Scope × Judgment × Multiplier. Situation: a problem that spanned API, data, and ops — not a single ticket. Task: you were accountable for the outcome (SLO, incident, delivery date). Action: you made a trade-off, wrote the design, reviewed the risky PRs, and taught the approach. Result: the metric moved and the team can operate it without you. Learning: what you would staff differently. Mid-level makes it work; senior makes it operable and transferable.',
          bangla: 'মিড কাজ করায়, সিনিয়র চালানো যায় আর টিমে ট্রান্সফার করে — Scope, Judgment, Multiplier।',
          followUp: 'Give an example of work that only succeeded because you mentored someone else through it.',
          difficulty: 'senior',
        },
        {
          q: 'Why this company / this team?',
          a: 'Framework: Signal → Match → Contribution. Situation: a specific signal (their scale, domain, engineering blog, product constraint). Task: the problem you want to spend two years on. Action: how your proof points map (e.g. you have lived connection-pool incidents at similar QPS). Result: what you would own in the first two quarters — stated as problems, not titles. Avoid "culture" with no evidence.',
          bangla: 'তাদের আসল কনস্ট্রেইন্ট ধরে ম্যাপ করুন — জেনেরিক culture স্টোরি নয়।',
          followUp: 'What would you want to change in your first 90 days?',
          difficulty: 'mid',
        },
      ],
      practice: 'Write a 90-second pitch on paper. Record it. Cut every sentence that does not contain a decision, a metric, or a fit signal.',
    },
    {
      topic: 'Difficult Production Issue / Incident Command',
      difficulty: 'expert',
      english: `They are not asking whether you can debug. They are asking whether you can command chaos: stabilize, communicate, decide rollback vs fix-forward, and leave the system safer. A senior story has a timeline, a blast radius, a wrong turn you corrected, and a prevention. Heroic all-nighters without a postmortem score as mid-level.`,
      bangla: 'ইনসিডেন্ট স্টোরি = টাইমলাইন, ব্লাস্ট রেডিয়াস, স্টেবিলাইজ, কমিউনিকেশন, পোস্টমর্টেম। অল-নাইট হিরোইজম সিনিয়র নয়।',
      details: `
### Framework: Incident STAR-L (with a timeline)

| STAR-L | In an incident | Prompt |
| :--- | :--- | :--- |
| **S**ituation | When, severity, user impact, SLO burn | "Tuesday 14:12, checkout 32% 5xx, p95 4s" |
| **T**ask | Your role: IC vs commander vs specialist | "I took incident command; X owned SQL" |
| **A**ction | Stabilize → diagnose → fix → communicate | "Rolled back canary; then Query Store" |
| **R**esult | MTTR, customers, money, what stayed broken | "12 min to green; 40 min to cause" |
| **L**earning | Runbook, test, alert, design change | "Query-count CI gate; canary abort" |

### Incident command loop (say this, then your story)
1. Declare the incident and a commander (one talker to stakeholders).
2. Blast radius and **stop the bleeding** (rollback, flag, shed) before a perfect RCA.
3. Parallel workstreams: mitigate / diagnose / communicate — not one hero.
4. Evidence: one metric, one trace, one change.
5. Decide rollback vs forward-fix using **migration and contract** constraints.
6. Resolve, monitor, then blameless postmortem with owners and dates.

### Roles (know which one you played)
- **Commander:** priorities, comms, decides rollback.
- **Tech lead / IC:** hypotheses and patches.
- **Scribe:** timeline (gold in interviews).
- **Comms:** status page / account managers.

If you were the only person, say so — and say what you would staff next time.

### What "good" sounds like
Numbers. A wrong hypothesis you dropped. A trade-off (data loss vs downtime). A prevention that actually shipped.
      `,
      code: `// Incident command card (keep in your notes, not a speech)
// T+0   Declare. Commander. Comms channel. Severity.
// T+5   Impact + change (deploy/flag/dep). Stabilize if SLO burning.
// T+15  One hypothesis. Falsify or act. Stakeholder update.
// T+30  Rollback vs forward-fix decision recorded.
// T+R   Monitor. Postmortem: cause, detection gap, 3 actions with owners.`,
      commonMistakes: [
        'A story with no timeline, no metric, and no role ("we all jumped in").',
        'Skipping stabilize to "find the root cause" while customers burn.',
        'Blame: "the junior deployed it" — interviewers hear culture risk.',
      ],
      bestPractices: [
        'Prepare two incidents: one you commanded, one you were a specialist.',
        'Include one mistake you made in the diagnosis.',
        'End with the prevention that is still in the repo.',
      ],
      interviewQs: [
        {
          q: 'Tell me about a difficult production issue you owned.',
          a: 'Use Incident STAR-L. Situation: timestamp, symptom, blast radius, SLO. Task: commander vs IC — say it explicitly. Action: ordered as stabilize, then evidence, then fix; mention one hypothesis that was wrong. Result: MTTR and residual risk. Learning: the alert or test that would have caught it. Do not dump a 20-minute war story; offer the 3-minute version and ask if they want the SQL plan or the comms thread.',
          bangla: 'টাইমস্ট্যাম্প, রোল, স্টেবিলাইজ-প্রথমে, ভুল হাইপোথিসিস, MTTR, প্রিভেনশন।',
          followUp: 'What would you do differently in the first five minutes?',
          difficulty: 'expert',
        },
        {
          q: 'How do you run an incident when you are not the most senior person in the call?',
          a: 'STAR: Situation is a crowded bridge with overlapping advice. Task is still one commander and one diagnosis owner. Action: you either take command ("I will drive; please challenge hypotheses") or you explicitly hand it to the person with the context and become specialist/scribe. Result: less thrash, faster stabilize. Learning: rank does not equal incident role; ambiguity is the failure mode. Never fight for ego on a live outage.',
          bangla: 'র‍্যাঙ্ক ≠ কমান্ডার। একজন ড্রাইভ করবে, বাকিরা স্পেশালিস্ট — ইগো নয়।',
          followUp: 'Describe a time you disagreed with the commander during an outage.',
          difficulty: 'senior',
        },
        {
          q: 'Walk me through how you decide rollback vs fix-forward.',
          a: 'Framework: Compatibility → Blast radius → Reversibility. Situation: bad build in prod. Task: choose the action that stops customer harm fastest without a second outage. Action: if N-1 app can run on current schema and flags, rollback; if a breaking migration already ran, freeze and forward-fix or restore with an explicit data decision. Result: you state the residual risk. Learning: expand/contract so rollback stays legal.',
          bangla: 'স্কিমা কম্প্যাটিবল হলে রোলব্যাক; ব্রেকিং মাইগ্রেশন হলে ফরওয়ার্ড-ফিক্স।',
          difficulty: 'senior',
        },
      ],
      practice: 'Write a one-page timeline of your worst incident: T+0, T+5, T+15, resolve, three postmortem actions. Speak it in three minutes.',
    },
    {
      topic: 'Technical Disagreement, Code Review, and Mentoring',
      difficulty: 'senior',
      english: `Seniors change other people's code and careers without humiliating them. Disagreement is about risk and evidence, not taste. Code review is a teaching and safety function. Mentoring is creating independent judgment, not creating clones of your style.`,
      bangla: 'মতভেদ = রিস্ক ও এভিডেন্স, রুচি নয়। রিভিউ = সেফটি + টিচিং। মেন্টরিং = স্বাধীন জাজমেন্ট তৈরি।',
      details: `
### Disagreement framework: Steelman → Criteria → Experiment → Decide → Commit

| Step | What you do |
| :--- | :--- |
| **Steelman** | Restate their design so they agree you understood it |
| **Criteria** | Name the non-functionals: correctness, operability, time, skill of the team |
| **Experiment** | Spike, benchmark, or a time-boxed prototype — not a 40-comment thread |
| **Decide** | DRI / tech lead decides; minority view is recorded |
| **Commit** | After the decision you implement it as if it were yours |

Disagreeing in public, undermining after the meeting, or "I told you so" after an incident is junior behavior with senior tenure.

### Code review framework: Safety → Design → Clarity → Nit

1. **Safety:** authz, injections, concurrency, data loss, secrets.
2. **Design:** does this match the architecture, or is it a new pattern by accident?
3. **Clarity:** will on-call understand this at 2am?
4. **Nit:** style last, or in tooling (analyzers), not as blocking comments.

Ask questions before issuing verdicts: "What happens if Redis is empty?" beats "This is wrong."

### Mentoring framework: Goal → Challenge → Feedback → Fade

- Goal the person cares about (promotion, on-call confidence, EF performance).
- Challenge just above current skill (a real PR, not a toy kata).
- Feedback specific and timely (one behavior, one example, one next step).
- Fade your involvement so they own the next incident.

### English phrases that sound senior
- "The risk I am optimizing for is …"
- "I might be missing context — walk me through the constraint."
- "Let us time-box a spike by Thursday and decide with numbers."
      `,
      code: `// Review comment quality
// WEAK:  "Use a better name."
// SENIOR: "On-call will grep for payment intent id; 'x' will hide this in logs.
//          Consider intentId to match Stripe's field so traces join."

// Mentoring loop
// 1. They propose the design (you do not type first)
// 2. You ask failure-mode questions
// 3. They implement; you review for safety
// 4. They present the postmortem or the design doc`,
      commonMistakes: [
        'Winning the argument and losing the teammate.',
        'Blocking PRs on style while missing an IDOR.',
        'Mentoring by taking the keyboard and finishing the work.',
      ],
      bestPractices: [
        'Separate taste from risk; only risk is blocking.',
        'Record the decision (ADR) so the disagreement does not restart monthly.',
        'Give the mentee the incident commander role on a small, real issue with you as backup.',
      ],
      interviewQs: [
        {
          q: 'Tell me about a time you disagreed with a teammate on a technical decision.',
          a: 'STAR-L with Steelman. Situation: two designs (e.g. sync HTTP vs outbox) and a deadline. Task: pick for correctness under failure, not for ego. Action: restate their design, name criteria (at-least-once, team skill, timeline), propose a spike or data. Result: a decision with an ADR; you committed even if it was not your preference. Learning: what you would escalate vs let go. Never end with "and I was right." End with how the system behaved in production.',
          bangla: 'স্টিলম্যান, ক্রাইটেরিয়া, স্পাইক, ডিসিশন, কমিট। "আমিই ঠিক ছিলাম" দিয়ে শেষ করবেন না।',
          followUp: 'What if the other person was more senior than you and still wrong on a safety issue?',
          difficulty: 'senior',
        },
        {
          q: 'How do you give critical feedback in a code review without demotivating a junior?',
          a: 'Framework: Intent → Evidence → Request → Offer. Situation: a PR with a real bug (e.g. .Result on a request thread). Task: keep the bug out of main and grow the author. Action: praise the part that is solid, show the failure mode with a scenario, ask them to change it, offer a pairing slot. Result: they land the fix and can explain starvation next time. Learning: if the same issue repeats, it is a teaching gap, not a character flaw. Never pile nits on a first PR.',
          bangla: 'বাগ আটকান, মানুষ ভাঙবেন না — সিনারিও দিয়ে বোঝান, নিট পরে।',
          difficulty: 'senior',
        },
        {
          q: 'Describe how you mentor someone toward senior.',
          a: 'STAR: Situation is a mid-level who delivers features but does not own operability. Task: they need independent judgment on failure modes. Action: they write the design, you ask trade-off questions, they own a canary and a postmortem, you fade. Result: they run the next incident with you silent on the bridge. Learning: mentoring failed if you are still the bottleneck. Senior is a multiplier metric, not a title you bestow.',
          bangla: 'তারা ডিজাইন লেখে, আপনি ফেইলিউর প্রশ্ন করেন, তারপর ফেইড আউট — আপনি বটলনেক থাকলে মেন্টরিং ফেল।',
          followUp: 'How do you handle a mentee who does not take feedback?',
          difficulty: 'senior',
        },
      ],
      practice: 'Take a real PR you reviewed. Rewrite your top three comments using Intent → Evidence → Request. Drop pure nits.',
    },
    {
      topic: 'Deadlines, Technical Debt, and Legacy Code',
      difficulty: 'senior',
      english: `Seniors do not worship deadlines or worship purity. They make the risk visible, cut scope, and leave a trail so debt is a decision, not an accident. Legacy is a constraint with users and revenue — not a moral failing of the previous team.`,
      bangla: 'ডেডলাইন vs কোয়ালিটি বাইনারি নয় — রিস্ক দেখান, স্কোপ কাটুন, ডেটকে ডিসিশন বানান। লেগাসি = ইউজার আছে এমন সিস্টেম।',
      details: `
### Deadline framework: Outcome → Must/Should/Could → Risk register → Negotiate

1. Restate the **business outcome** (not the Jira epic).
2. Split **Must / Should / Could** with the PM in the room.
3. For each Must, name engineering risk (data loss, security, irreversible migration).
4. Negotiate: date, scope, or staffing — you cannot hold all three if the physics do not work.
5. If you still cut corners, **write the debt ticket with an expiry** (what breaks, when, who owns it).

"We will just work harder" is not a plan. "We will skip tests" is a plan — a bad one unless you say how you will not ship a security hole.

### Technical debt framework: Interest rate, not vibes

| Debt type | Interest | Senior move |
| :--- | :--- | :--- |
| **No tests on a money path** | Compounding, high | Block or pair immediately |
| **Ugly names in a dead module** | Near zero | Leave it |
| **Missing index, growing table** | Rising with data | Schedule with a metric |
| **Framework two versions behind** | Security + hiring | Time-box upgrade train |

Pay down debt when you are already in the file, when interest is rising, or when it blocks a Must. Do not "rewrite the monolith" as a side quest.

### Legacy framework: Strangler, not big-bang

- Characterize: what is sacred (data, reports, integrations).
- Add seams: tests around the module you will touch, anti-corruption layer.
- Change by strangler: new path beside old, dual run, switch, delete.
- Respect the people who kept it alive; they have the domain.

### English negotiation sentence
"If the date is fixed, this Must becomes a Should, or we accept this risk with an expiry. I need you to choose which."
      `,
      code: `// Debt you are allowed to take: explicit, dated, owned
// DEBT(2026-09-01, owner: payments): checkout skips outbox;
// failure mode = lost event on crash; mitigation = nightly reconcile job.
// Delete this comment when outbox ships.

// Strangler seam
public interface IPricing
{
    Task<Money> QuoteAsync(Sku sku, CancellationToken ct);
}
// Old: LegacyPricingAdapter wrapping COM/SQL proc
// New: PricingService; feature flag per tenant`,
      commonMistakes: [
        'Silent debt: shortcuts with no ticket, no expiry, no owner.',
        'Big-bang rewrite while the business still needs features.',
        'Saying yes to the date and then surprising people at the last week.',
      ],
      bestPractices: [
        'Make the triangle visible: date, scope, risk — they pick two.',
        'Boy Scout rule in files you already touch; strategic debt has a program.',
        'Legacy: strangler + tests at the seam, not contempt.',
      ],
      interviewQs: [
        {
          q: 'Tell me about a time you had to ship with a hard deadline.',
          a: 'STAR-L: Situation is a fixed date (campaign, regulation, contract). Task is protect Must outcomes and name residual risk. Action: Must/Should/Could with the PM, cut scope, maybe a feature flag, maybe a reconcile job as a safety net — not "we skipped all tests." Result: what shipped, what slipped, what broke (be honest). Learning: the earlier you surface the triangle, the less heroic the last week. If nothing broke, say what you monitored to know that.',
          bangla: 'ডেট ফিক্সড হলে স্কোপ বা রিস্ক বেছে নিতে হবে — চুপচাপ টেস্ট কাটা সিনিয়র নয়।',
          followUp: 'What did you explicitly not ship, and who agreed?',
          difficulty: 'senior',
        },
        {
          q: 'How do you decide which technical debt to pay down this quarter?',
          a: 'Framework: Interest × Blast radius × Cost to fix. Situation: a backlog of smells. Task: pick work that reduces operational or security risk, not aesthetic debt. Action: rank money-path tests, rising-cost queries, and security upgrades over renames. Tie each item to an incident or a metric. Result: a short list with owners. Learning: debt without a user-visible or ops-visible interest rate waits.',
          bangla: 'ইন্টারেস্ট রেট দিয়ে বাছুন — মানি পাথ টেস্ট, স্লো কোয়েরি, সিকিউরিটি; রিনেম নয়।',
          difficulty: 'senior',
        },
        {
          q: 'How do you work in a large legacy .NET Framework / old Core codebase?',
          a: 'STAR: Situation is a system that prints money and scares everyone. Task is change without a rewrite. Action: characterize sacred data, add a seam (adapter, tests), strangler a vertical slice, keep dual-run until proven. Result: a new path in production with a rollback. Learning: contempt for the old code is a leadership failure; the domain is in the people and the data. Big-bang rewrites are how you get two legacy systems.',
          bangla: 'স্ট্র্যাংলার + সীম টেস্ট — রিরাইট নয়। পুরনো কোডকে ঘৃণা করা লিডারশিপ ফেল।',
          followUp: 'When is a rewrite actually justified?',
          difficulty: 'expert',
        },
      ],
      practice: 'Pick one live shortcut in your repo. Write a DEBT comment: failure mode, expiry, owner, mitigation. Then a 60-second negotiation script for your PM.',
    },
    {
      topic: 'Architectural Decisions, Performance vs Maintainability',
      difficulty: 'expert',
      english: `Architecture interviews at senior level are decision interviews. They want to hear constraints, alternatives, the reason you rejected the fashionable option, and how you would reverse the decision. Performance vs maintainability is not a slogan — it is a budget: who pays (CPU, team, on-call) and when.`,
      bangla: 'আর্কিটেকচার = কনস্ট্রেইন্ট, অল্টারনেটিভ, কেন ফ্যাশন বাদ, কীভাবে রিভার্স। পারফরম্যান্স vs মেইনটেইনেবিলিটি = বাজেট কে দেয়।',
      details: `
### ADR framework (speak this even if you never wrote an ADR file)

| Section | Question you answer |
| :--- | :--- |
| **Context** | Load, team size, compliance, existing systems |
| **Decision** | What we will do |
| **Options** | At least two real alternatives |
| **Consequences** | What gets harder; how we reverse |
| **Non-goals** | What we are not solving yet |

### Performance vs maintainability — a budget, not a vibe

- **Measure first.** "Make it fast" without a SLO is how you get unreadable cleverness.
- **Optimize the hot path**, keep the cold path boring.
- **Complexity tax:** every cache, queue, and service is an incident surface.
- **Rule:** if a junior cannot debug it at 2am, the performance win must be huge and isolated.

Examples:
- DTO projection vs generic repository magic — maintainability *and* usually faster.
- Microservices for a 4-person team — maintainability loss, performance optional.
- Span in a parser vs in a CRUD controller — one is justified.

### Decision hygiene
- Write down what would change your mind (e.g. "if p95 > 200ms after indexes, we add Redis").
- Separate **reversible** (cache, flag) from **irreversible** (data model, tenant split).
- Invite the people who will be on-call, not only the people who like diagrams.

### English closer
"I would choose X because of [constraint]. The cost is [ops/complexity]. We reverse it by [path]. I would not choose Y because [failure mode]."
      `,
      code: `// Lightweight ADR in repo: /docs/adr/0014-checkout-cache.md
// Status: Accepted
// Context: GET /product 8k RPS, SQL p95 40ms, team of 6
// Decision: L1 memory + Redis L2 + coalescing; SQL remains source of truth
// Rejected: microservices split of catalog (team too small; consistency cost)
// Reversal: feature flag off; Redis is not required for correctness
// Review: after Black Friday metrics`,
      commonMistakes: [
        'Jumping to Kafka/microservices before stating QPS, team size, and consistency needs.',
        'Premature optimization in code that runs 10 times a day.',
        'A decision with no reversal path and no owner.',
      ],
      bestPractices: [
        'Always present two options and the rejected one.',
        'Put SLOs next to the design; performance work needs a number.',
        'Prefer boring technology on the money path unless a constraint forbids it.',
      ],
      interviewQs: [
        {
          q: 'Tell me about an architectural decision you made and how you made it.',
          a: 'Use ADR-as-STAR. Situation/context: scale, team, compliance. Task: the decision (e.g. modular monolith vs services, SQL vs document). Action: options, a spike or numbers, who was in the room, what you rejected and why. Result: what happened in production (including the ugly part). Learning: reversal trigger. If you only ever implemented other people\'s diagrams, say a decision you influenced and be precise about your part — interviewers detect borrowed glory.',
          bangla: 'কনটেক্সট, অপশন, কেন অন্যটা বাদ, প্রোডাকশন রেজাল্ট, রিভার্সাল ট্রিগার।',
          followUp: 'What would make you reverse that decision next quarter?',
          difficulty: 'expert',
        },
        {
          q: 'How do you trade off performance against maintainability?',
          a: 'Framework: SLO → Hot path → Complexity tax. Situation: a slow endpoint or a future scale fear. Task: hit the SLO without making on-call impossible. Action: measure, fix algorithm/SQL/index first, then cache, then distribution. Isolate cleverness. Result: p95 vs the extra moving parts you added. Learning: if you cannot explain the design to a mid-level, you probably overshot. Never say "we always pick maintainability" — money paths have SLOs.',
          bangla: 'আগে SLO ও মেজার — তারপর ইনডেক্স/SQL, তারপর ক্যাশ। ক্ল্যাভারনেস আইসোলেট করুন।',
          difficulty: 'senior',
        },
        {
          q: 'When would you refuse a microservices split?',
          a: 'STAR: Situation is a team of N and a domain that is still changing. Task is reduce delivery risk, not draw boxes. Action: you refuse when the team cannot afford the distributed failure modes (outbox, tracing, on-call) or when the bounded contexts are still unclear. Result: a modular monolith with seams. Learning: split when a team boundary and a data boundary already exist, not to look modern. Performance is rarely the first reason to split.',
          bangla: 'টিম ছোট বা বাউন্ডারি অস্পষ্ট হলে স্প্লিট নয় — মডুলার মনোলিথ + সীম।',
          difficulty: 'expert',
        },
      ],
      practice: 'Write a half-page ADR for a real decision (cache, queue, or monolith boundary). Include a rejected option and a reversal trigger.',
    },
    {
      topic: 'Handling Production Incidents with Stakeholders',
      difficulty: 'senior',
      english: `Stakeholders do not need your stack trace. They need impact, what you are doing, when they will hear from you again, and what you need from them. Seniors translate. They do not hide, they do not panic-perform, and they do not promise ETAs they cannot defend. Trust is built in the updates, not in the postmortem slide deck.`,
      bangla: 'স্টেকহোল্ডারকে স্ট্যাক ট্রেস নয় — ইমপ্যাক্ট, এখন কী করছেন, পরের আপডেট কখন, তাদের কাছে কী লাগবে।',
      details: `
### Comms framework: Impact → Action → Next update → Ask

Every update (Slack, status page, exec call) has four lines:

1. **Impact:** who, what, since when, how bad (orders/min, error %, region).
2. **Action:** what we are doing *now* (rollback, failover, investigating X).
3. **Next update:** a clock time you will hit even if nothing changed ("15:40 whether or not we have RCA").
4. **Ask:** what you need (freeze releases, customer comms, legal, extra people).

Never: "We are looking into it" with no next ping. Never: a 20-minute technical lecture on an exec bridge.

### Audience translation

| Audience | They care about | You say |
| :--- | :--- | :--- |
| **Exec / PM** | Revenue, brand, SLA credits | Impact numbers, ETA of *mitigation*, not root cause |
| **Support** | What to tell customers | Known workaround, status page text |
| **Other teams** | Whether to failover / stop publishes | Blast radius, dependencies |
| **Engineers** | Evidence and hypotheses | Separate channel; do not mix with exec |

### Hard moments
- **You do not know yet:** say what you *do* know, what you are testing, when you will update. Uncertainty with a clock beats fake confidence.
- **You caused it:** own it once, factually, then mitigate. Confession without a plan is not leadership.
- **Pressure for a fake ETA:** give a range tied to a milestone ("rollback done in 10 min or we switch to forward-fix").
- **Angry customer on the line:** empathy, facts, next update; do not argue architecture.

### Afterward
- Blameless postmortem with customer-visible timeline.
- One message to stakeholders: what changed so this is less likely, in business language.
- Do not vanish after the site is green; residual risk needs a sentence.
      `,
      code: `// Stakeholder update template (paste into Slack / status page)
// IMPACT: Checkout 5xx ~28% since 14:12 UTC, EU only. Orders ~-40% vs baseline.
// ACTION: Rolled back canary 14:19. Error rate falling. Watching p95.
// NEXT:  14:35 UTC even if unchanged. RCA not ready; not blocking mitigation.
// ASK:   Freeze unrelated deploys. Support: use status text v2 in the doc.`,
      commonMistakes: [
        'Going dark for 45 minutes because you were "busy fixing."',
        'Promising a root cause time as if it were a compile.',
        'Blaming a vendor or a junior on the customer call.',
      ],
      bestPractices: [
        'Cadence over completeness: a clock on the next update.',
        'Separate engineer channel from stakeholder channel.',
        'Mitigation language first; RCA when you have evidence.',
      ],
      interviewQs: [
        {
          q: 'How do you communicate during a production outage to non-engineers?',
          a: 'Use Impact → Action → Next update → Ask. Situation: site degraded, execs in the thread. Task: they need to make business decisions (status page, freeze, credits), not understand EF. Action: numbers, what you are doing now, a time you will speak again, a clear ask. Result: fewer drive-by ideas on the engineering channel. Learning: going dark destroys trust faster than a slow fix. Offer a 3-line example in the interview; do not role-play jargon.',
          bangla: 'ইমপ্যাক্ট, এখনকার অ্যাকশন, পরের আপডেটের ঘড়ি, আস্ক — স্ট্যাক ট্রেস নয়।',
          followUp: 'Give me the exact three sentences you would send at T+10 minutes.',
          difficulty: 'senior',
        },
        {
          q: 'A VP asks "when will it be fixed?" and you do not know the cause yet. What do you say?',
          a: 'STAR: Situation is pressure for a fake ETA. Task is honesty with a mitigation clock, not a RCA clock. Action: "I will not give a root-cause ETA. Mitigation path A (rollback) we will know in 10 minutes; if it fails, path B is X. Next update at HH:MM." Result: you keep credibility. Learning: executives can handle uncertainty; they cannot handle surprise silence or invented times.',
          bangla: 'RCA-এর ঘড়ি নয়, মিটিগেশনের ঘড়ি দিন। মিথ্যা ETA বিশ্বাস ভাঙে।',
          difficulty: 'senior',
        },
        {
          q: 'Tell me about a time an incident had customer or legal visibility.',
          a: 'STAR-L: Situation includes who was affected and whether data was at risk (that changes legal). Task: accurate public language and internal facts. Action: align with support/legal on what is known, do not speculate about breach if you have no evidence, keep the engineering channel clean. Result: what customers were told vs what was true, and any correction. Learning: over-sharing guesses creates a second incident. If you have not had legal visibility, say so and walk a hypothetical with the same framework — do not invent a breach story.',
          bangla: 'জানেন তাই বলুন, অনুমান নয়। ডেটা রিস্ক থাকলে লিগ্যাল আগে। না থাকলে হাইপোথেটিক্যাল ফ্রেমওয়ার্ক দিন।',
          followUp: 'How do you write a blameless postmortem that executives will actually read?',
          difficulty: 'expert',
        },
      ],
      practice: 'Draft three stakeholder updates for a fictional 30-minute checkout outage: T+5, T+15, T+30 (resolved). Each must fit in four lines.',
    },
  ],
  quickRevision: {
    concepts: [
      'Present → Past → Future → Fit (90s pitch)',
      'Senior = Scope × Judgment × Multiplier',
      'Incident STAR-L with a timeline and a wrong hypothesis',
      'Commander vs IC vs scribe — rank ≠ role',
      'Steelman → Criteria → Experiment → Decide → Commit',
      'Review: Safety → Design → Clarity → Nit',
      'Deadlines: Must/Should/Could + risk register',
      'Debt has an interest rate; legacy gets a strangler',
      'ADR: options, rejected path, reversal trigger',
      'Stakeholder update: Impact → Action → Next clock → Ask',
    ],
    questions: [
      'Tell me about yourself.',
      'Why hire you as Senior?',
      'Walk through a production incident you owned.',
      'Rollback vs fix-forward — how do you choose?',
      'A technical disagreement — what happened?',
      'How do you review a junior\'s PR?',
      'Hard deadline — what did you cut?',
      'Which debt do you pay this quarter?',
      'An architecture decision and what you rejected.',
      'VP asks when it will be fixed — you have no RCA yet.',
    ],
    mistakes: [
      'CV chronology instead of a thesis',
      'Heroic incident with no prevention',
      'Winning the argument, losing the team',
      'Silent technical debt',
      'Going dark on stakeholders while you debug',
    ],
    scenarios: [
      'Crowded incident bridge, no commander',
      'PM wants the date and the full scope',
      'Senior colleague blocks a safety fix',
      'Rewrite proposal for a money-printing monolith',
      'Exec call 10 minutes into an unknown outage',
    ],
  },
  revisionSummary: `
- Bio: 90-second Present → Past → Future → Fit; senior bar is Scope × Judgment × Multiplier.
- Incidents: timeline, role, stabilize first, one wrong turn, prevention that shipped.
- People: steelman disagreement, safety-first review, mentoring that fades.
- Delivery: negotiate the triangle; debt with expiry; strangler for legacy.
- Stakeholders: Impact → Action → Next update → Ask; never a fake RCA ETA.
  `,
  summary:
    'Senior behavioral interviews test whether you can own outcomes, command incidents, disagree without wrecking trust, and translate risk for the business — using reusable frameworks filled with your real stories, not a script.',
};
