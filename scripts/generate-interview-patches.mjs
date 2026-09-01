/**
 * Generate beginner-friendly interview answer patches from handbook data.
 *
 * Usage:
 *   node scripts/generate-interview-patches.mjs          # write patches
 *   node scripts/generate-interview-patches.mjs --dry-run # stats only
 *   node scripts/generate-interview-patches.mjs --limit 50
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const PATCHES_FILE = path.join(DATA_DIR, 'interviewAnswerPatches.ts');

const SKIP_FILES = new Set([
  'interviewAnswerPatches.ts',
  'bilingualPatches.ts',
  'types.ts',
  'index.ts',
]);

/** Hand-crafted patches — preserved as-is on regen (not re-escaped). */
const MANUAL_PATCH_SLUGS = [
  'explain-ioc-vs-di-vs-dip-without-mixing-them',
  'why-is-constructor-injection-preferred-over-service-locator',
  'when-would-you-use-method-injection-instead-of-constructor-injection',
  'difference-between-use-and-run-methods',
  'what-is-the-significance-of-the-order-of-middleware',
];

const EXISTING_SLUGS = new Set(MANUAL_PATCH_SLUGS);

const TARGET_COVERAGE = 1.0;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;

export function questionSlug(question) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

function unescapeString(s) {
  return s
    .replace(/\\n/g, '\n')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\`/g, '`')
    .replace(/\\\\/g, '\\');
}

/** Extract interviewQs from a TypeScript data file via regex (no TS parser needed). */
function extractInterviewQs(content, file) {
  const items = [];
  const blockRe = /interviewQs:\s*\[([\s\S]*?)\n\s*\]/g;
  let blockMatch;

  while ((blockMatch = blockRe.exec(content)) !== null) {
    const block = blockMatch[1];
    const objRe =
      /\{\s*q:\s*(?:'((?:\\'|[^'])*)'|"((?:\\"|[^"])*)"|`((?:\\`|[^`])*)")[\s\S]*?a:\s*(?:'((?:\\'|[^'])*)'|"((?:\\"|[^"])*)"|`((?:\\`|[^`])*)")(?:[\s\S]*?bangla:\s*'((?:\\'|[^'])*)')?/g;
    let m;

    while ((m = objRe.exec(block)) !== null) {
      const q = unescapeString(m[1] || m[2] || m[3] || '');
      const a = unescapeString(m[4] || m[5] || m[6] || '');
      const bangla = m[7] ? unescapeString(m[7]) : '';
      if (q.trim()) {
        items.push({ q: q.trim(), a: a.trim(), bangla: bangla.trim(), file });
      }
    }
  }

  return items;
}

function firstSentence(text, maxLen = 200) {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^[\s\S]*?[.!?](?:\s|$)/);
  const sentence = match ? match[0].trim() : trimmed.slice(0, maxLen);
  return sentence.length > maxLen ? `${sentence.slice(0, maxLen - 1)}…` : sentence;
}

function splitIntoPoints(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function needsCodeExample(question, answer) {
  const combined = `${question} ${answer}`.toLowerCase();
  const keywords = [
    'csharp', 'c#', '.net', 'async', 'await', 'linq', 'ef core', 'entity framework',
    'middleware', 'controller', 'api', 'di', 'injection', 'interface', 'class',
    'record', 'struct', 'delegate', 'task', 'thread', 'sql', 'repository',
    'aspnet', 'asp.net', 'razor', 'blazor', 'mass transit', 'kafka', 'rabbitmq',
    'cache', 'redis', 'http', 'rest', 'grpc', 'dispose', 'idisposable',
    'exception', 'middleware', 'pipeline', 'scope', 'singleton', 'transient',
    'migration', 'dbcontext', 'outbox', 'inbox', 'jwt', 'oauth', 'authorize',
    'authentication', 'authorization', 'select', 'selectmany', 'iqueryable',
    'ienumerable', 'extension method', 'reflection', 'record', 'value type',
    'reference type', 'boxing', 'garbage', 'gc', 'span', 'memory', 'stack', 'heap',
  ];
  return keywords.some((k) => combined.includes(k));
}

function pickCodeExample(question, answer) {
  const q = question.toLowerCase();
  const a = answer.toLowerCase();

  if (q.includes('async') || q.includes('await') || a.includes('async')) {
    return `// Async I/O — thread is released while waiting
public async Task<Order> GetOrderAsync(int id, CancellationToken ct)
{
    return await _db.Orders.FindAsync([id], ct);
}`;
  }
  if (q.includes('linq') || q.includes('select') || a.includes('selectmany')) {
    return `// Select = 1:1 mapping; SelectMany = flatten nested lists
var names = orders.Select(o => o.CustomerName);
var allItems = orders.SelectMany(o => o.LineItems);`;
  }
  if (q.includes('middleware') || a.includes('middleware')) {
    return `app.Use(async (context, next) =>
{
    _logger.LogInformation("Before");
    await next();
    _logger.LogInformation("After");
});`;
  }
  if (q.includes('di') || q.includes('inject') || a.includes('constructor')) {
    return `// Dependencies arrive via constructor — visible and testable
public class OrderService(IOrderRepository repo, ILogger<OrderService> log)
{
    public async Task PlaceAsync(Order order) => await repo.SaveAsync(order);
}`;
  }
  if (q.includes('dispose') || q.includes('idisposable') || a.includes('using')) {
    return `// using calls Dispose() even if an exception occurs
await using var conn = new SqlConnection(connectionString);
await conn.OpenAsync();`;
  }
  if (q.includes('record') || a.includes('record')) {
    return `public record OrderDto(int Id, string Customer, decimal Total);

var copy = original with { Total = 99.99m }; // non-destructive update`;
  }
  if (q.includes('interface') || q.includes('abstract')) {
    return `public interface IOrderRepository
{
    Task SaveAsync(Order order);
}

public class SqlOrderRepository : IOrderRepository { /* ... */ }`;
  }
  if (q.includes('exception') || q.includes('404') || a.includes('result')) {
    return `// Prefer typed results over throwing for expected cases
public async Task<Results<Ok<OrderDto>, NotFound>> Get(int id)
{
    var order = await _repo.FindAsync(id);
    return order is null ? TypedResults.NotFound() : TypedResults.Ok(order.ToDto());
}`;
  }
  if (q.includes('cache') || a.includes('cache')) {
    return `var order = await _cache.GetOrCreateAsync(
    $"order:{id}",
    async entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
        return await _repo.GetByIdAsync(id);
    });`;
  }
  if (q.includes('scope') || q.includes('singleton') || q.includes('transient')) {
    return `// Typical ASP.NET Core registrations in Program.cs
builder.Services.AddSingleton<IClock, SystemClock>();
builder.Services.AddScoped<IOrderRepository, SqlOrderRepository>();
builder.Services.AddTransient<IEmailSender, SmtpEmailSender>();`;
  }

  return `// Example pattern in ASP.NET Core
public class OrdersController(IOrderService orders) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> Get(int id)
        => await orders.GetAsync(id);
}`;
}

function pickAnalogy(question, answer) {
  const combined = `${question} ${answer}`.toLowerCase();

  if (combined.includes('cache')) {
    return 'Think of a **cache** like keeping your most-used tools on your desk instead of walking to the storage room every time.';
  }
  if (combined.includes('queue') || combined.includes('message') || combined.includes('kafka') || combined.includes('rabbit')) {
    return 'Think of a **message queue** like a restaurant ticket rail: orders wait in line, workers pick them up one by one, and if a cook drops a ticket it can be reprinted (redelivered).';
  }
  if (combined.includes('database') || combined.includes('transaction') || combined.includes('sql')) {
    return 'Think of a **database transaction** like a bank transfer: both accounts must update together, or neither changes — you never want money to disappear halfway.';
  }
  if (combined.includes('middleware') || combined.includes('pipeline')) {
    return 'Think of **middleware** like airport security checkpoints: each station inspects your bag, then passes you to the next one. On the way back, steps run in reverse order.';
  }
  if (combined.includes('async') || combined.includes('thread')) {
    return 'Think of **async/await** like ordering food: you do not stand at the counter blocking everyone — you get a buzzer, help other customers, and return when your order is ready.';
  }
  if (combined.includes('dependency') || combined.includes('inject') || combined.includes('ioc')) {
    return 'Think of **dependency injection** like a chef who receives prepared ingredients at the station instead of growing vegetables, raising cattle, and milling flour before every dish.';
  }
  if (combined.includes('interface') || combined.includes('abstraction')) {
    return 'Think of an **interface** like a power outlet standard: any compatible plug works, and you do not need to know which power plant generated the electricity.';
  }
  if (combined.includes('test') || combined.includes('mock')) {
    return 'Think of **unit tests** like checking each car part on a bench before assembling the whole vehicle — you catch defects early when they are cheap to fix.';
  }
  if (combined.includes('security') || combined.includes('auth')) {
    return 'Think of **authentication vs authorization** like a concert: your ticket proves who you are (authentication), and your seat section decides where you can sit (authorization).';
  }
  if (combined.includes('garbage') || combined.includes('memory') || combined.includes('heap') || combined.includes('stack')) {
    return 'Think of the **stack** like a stack of plates you add and remove from the top quickly. The **heap** is like a warehouse where larger items are stored and the cleanup crew (GC) visits later.';
  }

  return 'In everyday terms: picture a small team project. Each concept maps to a role — who owns the work, how tasks are handed off, and what happens when something fails.';
}

function pickInterviewTip(question, answer) {
  const q = question.toLowerCase();

  if (q.startsWith('tell me about') || q.includes('time you')) {
    return 'Use STAR format: Situation (context), Task (your goal), Action (what you did), Result (measurable outcome). Keep it under 3 minutes, then offer to go deeper.';
  }
  if (q.startsWith('how do you') || q.startsWith('how would you')) {
    return 'Start with your goal, name 2–3 concrete steps, mention one trade-off you considered, and end with how you would verify success in production.';
  }
  if (q.startsWith('what is') || q.startsWith('what are') || q.startsWith('explain')) {
    return 'Give a one-sentence definition first, then one real .NET example, then one common mistake beginners make. Pause and check if the interviewer wants more depth.';
  }
  if (q.startsWith('when') || q.includes('when would')) {
    return 'Answer with clear "use when / avoid when" criteria, then one scenario from ASP.NET Core or EF Core where your choice mattered.';
  }
  if (q.startsWith('why') || q.includes('why ')) {
    return 'State the problem first ("without this, X breaks"), then the solution, then a production consequence you have seen or read about.';
  }
  if (q.includes('difference') || q.includes(' vs ') || q.includes('versus')) {
    return 'Use a two-column comparison mentally: when to pick A, when to pick B, and one sentence on what goes wrong if you confuse them.';
  }

  return 'Lead with the simple answer, add one concrete .NET example, mention one pitfall, and stop — let the interviewer ask follow-ups.';
}

function contextualParagraph(question, answer) {
  const q = question.toLowerCase();
  if (q.includes('tell me') || q.includes('time you') || q.includes('disagree')) {
    return 'Behavioral questions test how you think under pressure, not whether you memorized definitions. Interviewers listen for ownership, clear communication, and what you learned — not blame or hero stories.';
  }
  if (q.includes('design') || q.includes('architect') || q.includes('scale')) {
    return 'In system design, interviewers care that you clarify requirements before drawing boxes. Start with users, data flow, and non-functional needs (latency, consistency, team size) before naming specific technologies.';
  }
  if (q.includes('test') || q.includes('mock') || q.includes('tdd')) {
    return 'Good tests document expected behavior and catch regressions early. In .NET, xUnit/NUnit plus Moq or NSubstitute are common. Focus tests on business rules and boundaries, not framework internals.';
  }
  return 'In real ASP.NET Core projects, this concept appears when you structure services, configure the pipeline, or talk to databases and external APIs. Knowing the "why" helps you debug production issues faster and explain trade-offs to teammates.';
}

function commonMistake(question, answer) {
  const combined = `${question} ${answer}`.toLowerCase();
  if (combined.includes('async')) {
    return '**Common mistake:** using `Task.Run` for normal I/O instead of truly async APIs — it wastes thread-pool threads without improving scalability.';
  }
  if (combined.includes('singleton') && combined.includes('scoped')) {
    return '**Common mistake:** injecting a Scoped service (like `DbContext`) into a Singleton — it causes disposed-context bugs that only appear under load.';
  }
  if (combined.includes('cache')) {
    return '**Common mistake:** caching without a TTL or invalidation strategy — stale data causes harder-to-debug bugs than a slow database query.';
  }
  if (combined.includes('exception')) {
    return '**Common mistake:** throwing exceptions for expected business outcomes (like "not found") — prefer typed HTTP results or a `Result<T>` pattern.';
  }
  if (combined.includes('linq')) {
    return '**Common mistake:** pulling entire tables into memory with `.ToList()` before filtering — let `IQueryable` translate filters to SQL.';
  }
  return '**Common mistake:** memorizing buzzwords without a concrete example from a project you actually worked on. Interviewers can tell immediately.';
}

function padToWordRange(text, minWords = 150, maxWords = 400) {
  const words = wordCount(text);
  if (words >= minWords) return text.slice(0, maxWords * 7); // rough char cap
  return text; // padding happens in expand functions
}

function expandEnglish(question, answer) {
  const simple = firstSentence(answer) || firstSentence(question);
  const points = splitIntoPoints(answer);
  let detailed =
    points.length >= 2
      ? points.map((p) => `- ${p}`).join('\n')
      : answer;

  detailed += `\n\n${contextualParagraph(question, answer)}`;
  detailed += `\n\n${commonMistake(question, answer)}`;

  const analogy = pickAnalogy(question, answer);
  const code = needsCodeExample(question, answer) ? pickCodeExample(question, answer) : null;
  const tip = pickInterviewTip(question, answer);

  let exampleSection = `### Beginner example\n\n${analogy}`;
  if (code) {
    exampleSection += `\n\nHere is a small .NET snippet that shows the idea in practice:\n\n\`\`\`csharp\n${code}\n\`\`\``;
  }
  exampleSection += `\n\nWalk through this example aloud in an interview: name each part, say what problem it solves, and mention what would break if you removed it.`;

  let en = `### Simple answer (start here)

${simple}

### Detailed explanation

${detailed}

${exampleSection}

### Interview tip

${tip}`;

  // Pad with extra beginner context if under 150 words
  if (wordCount(en) < 150) {
    en += `\n\n**For beginners:** Do not worry about every edge case on the first pass. Learn the default happy path, try it in a small console or Web API project, then revisit advanced scenarios once the basics feel natural.`;
  }

  return padToWordRange(en);
}

/** Bangla glossary for common .NET terms — keeps technical words, explains in full sentences */
const BN_TERMS = {
  'dependency injection': 'dependency injection (নির্ভরতা সরবরাহ)',
  'interface': 'interface (চুক্তি/contract)',
  'async': 'async (অসিঙ্ক্রোনাস)',
  'await': 'await',
  'middleware': 'middleware',
  'entity framework': 'Entity Framework',
  'dbcontext': 'DbContext',
  'linq': 'LINQ',
  'cache': 'cache (ক্যাশ)',
  'singleton': 'Singleton',
  'scoped': 'Scoped',
  'transient': 'Transient',
};

function translateKeyTerms(text) {
  let result = text;
  for (const [en, bn] of Object.entries(BN_TERMS)) {
    result = result.replace(new RegExp(en, 'gi'), bn);
  }
  return result;
}

/** Build beginner-friendly Bangla from English source — full sentences, not mnemonics */
function expandBangla(question, answer, answerBn) {
  const simpleEn = firstSentence(answer) || firstSentence(question);
  const points = splitIntoPoints(answer);

  // Build simple Bangla summary
  let simpleBn;
  if (answerBn && answerBn.length > 40 && !answerBn.includes('→') && !answerBn.includes('=')) {
    simpleBn = answerBn.length > 220 ? `${answerBn.slice(0, 217)}…` : answerBn;
  } else {
    simpleBn = `সংক্ষেপে বললে, এই প্রশ্নের মূল উত্তর হলো: ${simpleEn.replace(/\*\*/g, '')}`;
  }

  // Detailed section — expand each English point into a Bangla sentence
  const detailedBn = points.length >= 2
    ? points
        .map((p, i) => {
          const cleaned = p.replace(/\*\*/g, '').replace(/`/g, '');
          return `${i + 1}. ${cleaned} — এটা .NET প্রজেক্টে প্র্যাকটিসে গুরুত্বপূর্ণ, কারণ এটি কোডকে পরীক্ষাযোগ্য এবং রক্ষণাবেক্ষণযোগ্য রাখে।`;
        })
        .join('\n\n')
    : `${simpleBn}\n\nবিস্তারিতভাবে বললে, ${answer.replace(/\*\*/g, '').replace(/`/g, '').slice(0, 300)}${answer.length > 300 ? '…' : ''} এটি ASP.NET Core বা Entity Framework ব্যবহার করার সময় প্রায়শই দেখা যায়।`;

  const analogyEn = pickAnalogy(question, answer);
  const analogyBn = analogyEn
    .replace('Think of a **cache**', '**ক্যাশ** কে এভাবে ভাবুন')
    .replace('Think of a **message queue**', '**মেসেজ কিউ** কে এভাবে ভাবুন')
    .replace('Think of a **database transaction**', '**ডাটাবেস ট্রানজেকশন** কে এভাবে ভাবুন')
    .replace('Think of **middleware**', '**মিডলওয়্যার** কে এভাবে ভাবুন')
    .replace('Think of **async/await**', '**async/await** কে এভাবে ভাবুন')
    .replace('Think of **dependency injection**', '**dependency injection** কে এভাবে ভাবুন')
    .replace('Think of an **interface**', '**interface** কে এভাবে ভাবুন')
    .replace('Think of **unit tests**', '**ইউনিট টেস্ট** কে এভাবে ভাবুন')
    .replace('Think of **authentication vs authorization**', '**authentication বনাম authorization** কে এভাবে ভাবুন')
    .replace('Think of the **stack**', '**স্ট্যাক** কে এভাবে ভাবুন')
    .replace('In everyday terms:', 'সহজ ভাষায় বললে:');

  const code = needsCodeExample(question, answer) ? pickCodeExample(question, answer) : null;
  let exampleBn = `### উদাহরণ\n\n${analogyBn}`;
  if (code) {
    exampleBn += `\n\nনিচের কোডে দেখুন কীভাবে এটি .NET-এ প্রয়োগ করা হয়:\n\n\`\`\`csharp\n${code}\n\`\`\``;
  }

  const tipEn = pickInterviewTip(question, answer);
  const tipBn = tipEn
    .replace('Use STAR format:', 'STAR ফরম্যাট ব্যবহার করুন:')
    .replace('Situation (context), Task (your goal), Action (what you did), Result (measurable outcome).', 'Situation (পরিস্থিতি), Task (আপনার লক্ষ্য), Action (আপনি যা করেছেন), Result (পরিমাপযোগ্য ফলাফল)।')
    .replace('Keep it under 3 minutes, then offer to go deeper.', '৩ মিনিটের মধ্যে শেষ করুন, তারপর আরও detail দিতে চান কিনা জিজ্ঞেস করুন।')
    .replace('Start with your goal, name 2–3 concrete steps, mention one trade-off you considered, and end with how you would verify success in production.', 'প্রথমে লক্ষ্য বলুন, ২–৩টি ধাপে ব্যাখ্যা করুন, একটি trade-off উল্লেখ করুন, এবং production-এ কীভাবে যাচাই করবেন তা বলুন।')
    .replace('Give a one-sentence definition first, then one real .NET example, then one common mistake beginners make. Pause and check if the interviewer wants more depth.', 'প্রথমে এক বাক্যে সংজ্ঞা দিন, তারপর একটি .NET উদাহরণ, তারপর নতুনদের একটি সাধারণ ভুল। থেমে interviewer-এর প্রতিক্রিয়া দেখুন।')
    .replace('Answer with clear "use when / avoid when" criteria, then one scenario from ASP.NET Core or EF Core where your choice mattered.', '"কখন ব্যবহার করবেন / কখন এড়াবেন" স্পষ্ট করুন, তারপর ASP.NET Core বা EF Core-এর একটি উদাহরণ দিন।')
    .replace('State the problem first ("without this, X breaks"), then the solution, then a production consequence you have seen or read about.', 'প্রথমে সমস্যাটা বলুন ("এটা না থাকলে কী ভাঙে"), তারপর সমাধান, তারপর production-এ এর প্রভাব।')
    .replace('Use a two-column comparison mentally: when to pick A, when to pick B, and one sentence on what goes wrong if you confuse them.', 'মানসিকভাবে দুটি কলামে তুলনা করুন: A কখন, B কখন, এবং গুলিয়ে ফেললে কী ভুল হয়।')
    .replace('Lead with the simple answer, add one concrete .NET example, mention one pitfall, and stop — let the interviewer ask follow-ups.', 'সহজ উত্তর দিয়ে শুরু করুন, একটি .NET উদাহরণ দিন, একটি ভুল উল্লেখ করুন, এবং থামুন — interviewer follow-up করলে এগোবেন।');

  const mistakeBn = commonMistake(question, answer)
    .replace('**Common mistake:**', '**সাধারণ ভুল:**')
    .replace('using `Task.Run` for normal I/O instead of truly async APIs — it wastes thread-pool threads without improving scalability.', '`Task.Run` দিয়ে সাধারণ I/O async করার চেষ্টা করা — এটি স্কেলেবিলিটি বাড়ায় না, বরং thread pool নষ্ট করে।')
    .replace('injecting a Scoped service (like `DbContext`) into a Singleton — it causes disposed-context bugs that only appear under load.', 'Singleton-এ Scoped সার্ভিস (যেমন `DbContext`) inject করা — load-এ disposed-context bug তৈরি হয়।')
    .replace('caching without a TTL or invalidation strategy — stale data causes harder-to-debug bugs than a slow database query.', 'TTL বা invalidation ছাড়া cache করা — পুরনো ডেটা slow query-এর চেয়ে বেশি বিপজ্জনক।')
    .replace('throwing exceptions for expected business outcomes (like "not found") — prefer typed HTTP results or a `Result<T>` pattern.', 'প্রত্যাশিত ফলাফলের জন্য exception ছুড়ে দেওয়া — typed HTTP result বা `Result<T>` ব্যবহার করুন।')
    .replace('pulling entire tables into memory with `.ToList()` before filtering — let `IQueryable` translate filters to SQL.', 'filter করার আগে `.ToList()` দিয়ে পুরো টেবিল মেমোরিতে আনা — `IQueryable` দিয়ে SQL-এ filter করতে দিন।')
    .replace('memorizing buzzwords without a concrete example from a project you actually worked on. Interviewers can tell immediately.', 'শুধু buzzword মুখস্থ করা, নিজের প্রজেক্টের উদাহরণ না দেওয়া — interviewer সঙ্গে সঙ্গে বুঝে যান।');

  const contextBn = contextualParagraph(question, answer)
    .replace('Behavioral questions test how you think under pressure, not whether you memorized definitions. Interviewers listen for ownership, clear communication, and what you learned — not blame or hero stories.', 'আচরণগত প্রশ্নে interviewer দেখতে চান চাপের মধ্যে আপনি কীভাবে চিন্তা করেন। দায়িত্ব নেওয়া, স্পষ্ট যোগাযোগ, এবং শেখা — এগুলোই গুরুত্বপূর্ণ, দোষারোপ বা নায়কগিরি নয়।')
    .replace('In system design, interviewers care that you clarify requirements before drawing boxes. Start with users, data flow, and non-functional needs (latency, consistency, team size) before naming specific technologies.', 'সিস্টেম ডিজাইনে প্রথমে requirement ও NFR (latency, consistency, team size) স্পষ্ট করুন, তারপর টেকনোলজি বেছে নিন।')
    .replace('Good tests document expected behavior and catch regressions early. In .NET, xUnit/NUnit plus Moq or NSubstitute are common. Focus tests on business rules and boundaries, not framework internals.', 'ভালো টেস্ট expected behavior লিখে রাখে এবং regression ধরে। .NET-এ xUnit/NUnit + Moq/NSubstitute সাধারণ। business rule-এ ফোকাস করুন।')
    .replace('In real ASP.NET Core projects, this concept appears when you structure services, configure the pipeline, or talk to databases and external APIs. Knowing the "why" helps you debug production issues faster and explain trade-offs to teammates.', 'আসল ASP.NET Core প্রজেক্টে এটি service স্ট্রাকচার, pipeline কনফিগ, বা API/ডাটাবেস কাজে দেখা যায়। "কেন" জানলে production bug দ্রুত ধরতে পারবেন।');

  let bn = `### সহজ উত্তর

${translateKeyTerms(simpleBn)}

### বিস্তারিত

${translateKeyTerms(detailedBn)}

${contextBn}

${mistakeBn}

${exampleBn}

### Interview tip

${tipBn}`;

  if (wordCount(bn) < 150) {
    bn += `\n\n**নতুনদের জন্য:** প্রথমে মৌলিক ধারণাটা বুঝুন, ছোট একটা প্রজেক্টে চেষ্টা করুন, তারপর edge case-এ যান। interview-তে একটা সহজ উদাহরণ দিয়ে শুরু করলে আত্মবিশ্বাস বাড়ে।`;
  }

  return padToWordRange(bn);
}

function escapeTemplate(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function formatPatchEntry(slug, en, bn) {
  return `  '${slug}': {
    en: \`${escapeTemplate(en)}\`,
    bn: \`${escapeTemplate(bn)}\`,
  },`;
}

function loadAllQuestions() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.ts') && !SKIP_FILES.has(f));

  const bySlug = new Map();

  for (const file of files) {
    const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
    const items = extractInterviewQs(content, file);
    for (const item of items) {
      const slug = questionSlug(item.q);
      if (!bySlug.has(slug)) {
        bySlug.set(slug, { ...item, slug });
      }
    }
  }

  return bySlug;
}

/** Read hand-crafted patch blocks verbatim from the current patches file. */
function readManualPatchBlocks() {
  if (!fs.existsSync(PATCHES_FILE)) return new Map();
  const content = fs.readFileSync(PATCHES_FILE, 'utf8');
  const blocks = new Map();

  for (const slug of MANUAL_PATCH_SLUGS) {
    const re = new RegExp(
      `'${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{[\\s\\S]*?\\n  \\},`,
    );
    const match = content.match(re);
    if (match) blocks.set(slug, match[0]);
  }

  return blocks;
}

function generate() {
  const allQuestions = loadAllQuestions();
  const totalUnique = allQuestions.size;
  const targetCount = Math.ceil(totalUnique * TARGET_COVERAGE);
  const neededNew = Math.max(0, targetCount - EXISTING_SLUGS.size);

  const manualBlocks = readManualPatchBlocks();

  const toGenerate = [];
  for (const [slug, item] of allQuestions) {
    if (EXISTING_SLUGS.has(slug)) continue;
    toGenerate.push(item);
  }

  // Sort for deterministic output
  toGenerate.sort((a, b) => a.slug.localeCompare(b.slug));

  const selected = toGenerate.slice(0, Math.min(neededNew, limit));

  const generated = [];
  for (const item of selected) {
    const en = expandEnglish(item.q, item.a);
    const bn = expandBangla(item.q, item.a, item.bangla);

    const enWords = wordCount(en);
    const bnWords = wordCount(bn);

    generated.push({
      slug: item.slug,
      q: item.q,
      en,
      bn,
      enWords,
      bnWords,
      file: item.file,
    });
  }

  console.log(`Total unique questions: ${totalUnique}`);
  console.log(`Target coverage (${TARGET_COVERAGE * 100}%): ${targetCount} patches`);
  console.log(`Existing manual patches: ${EXISTING_SLUGS.size}`);
  console.log(`Generating new patches: ${generated.length}`);
  console.log(
    `Coverage after generation: ${(((EXISTING_SLUGS.size + generated.length) / totalUnique) * 100).toFixed(1)}%`
  );

  if (dryRun) {
    console.log('\nSample generated patch:');
    if (generated[0]) {
      console.log(`Slug: ${generated[0].slug}`);
      console.log(`Q: ${generated[0].q}`);
      console.log(`EN words: ${generated[0].enWords}, BN words: ${generated[0].bnWords}`);
      console.log(generated[0].en.slice(0, 400) + '...');
    }
    return;
  }

  const lines = [
    "import type { LocalizedText } from './types';",
    '',
    '/**',
    ' * Detailed beginner-friendly interview answers keyed by question slug.',
    ' * Slug = lowercase question with hyphens (see questionSlug in interviewAnswerFormatter.ts)',
    ' *',
    ' * Regenerate: node scripts/generate-interview-patches.mjs',
    ' */',
    'export const interviewAnswerPatches: Record<string, LocalizedText> = {',
  ];

  // Preserve hand-crafted patches verbatim (first run: seed from embedded originals)
  for (const slug of MANUAL_PATCH_SLUGS) {
    const block = manualBlocks.get(slug);
    if (block) {
      lines.push(`  ${block}`);
    }
  }

  for (const g of generated) {
    lines.push(formatPatchEntry(g.slug, g.en, g.bn));
  }

  lines.push('};');
  lines.push('');

  fs.writeFileSync(PATCHES_FILE, lines.join('\n'), 'utf8');
  console.log(`\nWrote ${EXISTING_SLUGS.size + generated.length} patches to ${PATCHES_FILE}`);
}

generate();
