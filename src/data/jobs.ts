export const jobsData = {
  id: 'jobs',
  title: 'Background Processing',
  description:
    'Hosted services, Hangfire vs Quartz vs queue workers, retries and idempotency under duplicate execution, and the ASP.NET 202 Accepted pattern so request threads never do the slow work.',
  sections: [
    {
      topic: 'IHostedService and BackgroundService',
      difficulty: 'mid',
      english:
        'IHostedService is the ASP.NET Core hook for work that lives with the host: start on boot, stop on shutdown. BackgroundService is the usual base class: you override ExecuteAsync and honor CancellationToken. This is the right place for a polling loop, a queue consumer, or an outbox dispatcher — not for "fire a Task in the controller." The host will not wait for fire-and-forget tasks on SIGTERM.',
      bangla:
        'আইহোস্টেডসার্ভিস অ্যাপের সাথে চলে — বুটে স্টার্ট, শাটডাউনে ক্যান্সেল। ব্যাকগ্রাউন্ডসার্ভিস লুপ/কনজিউমারের বেস। কন্ট্রোলারে Task.Run করলে গ্রেসফুল শাটডাউন হয় না।',
      details: `
### Lifecycle
1. \`StartAsync\` — host is starting (keep it fast).
2. \`ExecuteAsync(stoppingToken)\` — your loop; token fires on shutdown.
3. \`StopAsync\` — host is stopping; default waits for ExecuteAsync to finish (with a timeout).

### What belongs here
- Message bus consumers, outbox publishers, cache warmers, periodic reconciliation.
- **Scoped dependencies**: BackgroundService is a **Singleton**. Never inject Scoped DbContext directly. Create a scope per iteration: \`IServiceScopeFactory.CreateScope()\`.

### What does not
- Per-request work (that is the controller / MediatR handler).
- CPU-heavy unbounded loops without delay — you will starve the thread pool.
- Ignoring \`stoppingToken\` — deploy becomes a kill -9 every time.
      `,
      commonMistakes: [
        'Injecting a Scoped DbContext into BackgroundService (captive dependency; disposed or concurrent use).',
        'while(true) without delay or without passing stoppingToken to EF/HttpClient.',
        'Starting work in StartAsync and returning before it is safe — or blocking StartAsync on a long job.',
      ],
      bestPractices: [
        'Create a DI scope per unit of work inside the loop.',
        'Use PeriodicTimer (or a real scheduler) instead of Task.Delay in a tight loop.',
        'Log and catch per-iteration exceptions so one failure does not kill the hosted service forever.',
      ],
      interviewQs: [
        {
          q: 'Why can you not inject DbContext into a BackgroundService constructor?',
          a: 'BackgroundService is registered as Singleton with the host. DbContext is Scoped. A Singleton holding a Scoped context is a captive dependency: the context is either the same instance for the app lifetime (stale tracker, concurrent access, disposed after the first fake scope) or used across overlapping iterations. Create IServiceScopeFactory, CreateScope() per job, resolve DbContext from that scope, dispose the scope when the unit of work ends.',
          bangla: 'ব্যাকগ্রাউন্ডসার্ভিস সিঙ্গেলটন, DbContext স্কোপড — কনস্ট্রাক্টরে ইনজেক্ট করলে ক্যাপটিভ ডিপেন্ডেন্সি। প্রতি জবে CreateScope() করুন।',
          followUp: 'What goes wrong if two loop iterations overlap and share one context?',
          difficulty: 'senior',
        },
        {
          q: 'How does graceful shutdown work with BackgroundService?',
          a: 'On SIGTERM the host cancels stoppingToken, then calls StopAsync. ExecuteAsync should exit when the token is cancelled — pass it to ReadAsync, SaveChangesAsync, HttpClient. HostOptions.ShutdownTimeout (default ~30s) is the budget. If you ignore the token, Kubernetes sends SIGKILL and you drop in-flight work (and unacked messages). Pair this with a preStop hook and a queue that redelivers.',
          bangla: 'stoppingToken ক্যান্সেল হলে লুপ বেরোবে — ইগনোর করলে কুবারনেটিস SIGKILL দেয়, আনঅ্যাকড মেসেজ পড়ে থাকে।',
          followUp: 'How would you drain a RabbitMQ consumer during shutdown?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Write a BackgroundService that every 30s opens a scope, publishes pending outbox rows, and stops cleanly on token cancel.',
      code: `public sealed class OutboxDispatcher : BackgroundService
{
    private readonly IServiceScopeFactory _scopes;
    public OutboxDispatcher(IServiceScopeFactory scopes) => _scopes = scopes;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(30));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await using var scope = _scopes.CreateAsyncScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDb>();
                await DispatchBatchAsync(db, stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                // log; do not let one batch kill the hosted service
            }
        }
    }
}`,
    },
    {
      topic: 'Hangfire vs Quartz vs Queue-Based Workers',
      difficulty: 'senior',
      english:
        'Hangfire: fire-and-forget, delayed, and recurring jobs with a dashboard, SQL/Redis storage, and automatic retries. Quartz.NET: calendar-aware cron, misfire policies, job/trigger separation — stronger scheduler, weaker "just enqueue this lambda." Queue workers (RabbitMQ/Kafka/Azure Queue + IHostedService): better for high volume, competing consumers, and work that must not live in the web process. Seniors pick based on durability, clustering, and who owns the clock.',
      bangla:
        'হ্যাংফায়ার দ্রুত এনকিউ+ড্যাশবোর্ড; কোয়ার্টজ ক্যালেন্ডার/ক্রন/মিসফায়ার; কিউ ওয়ার্কার হাই ভলিউম ও আলাদা স্কেল। ওয়েব প্রসেসে সব জব রাখা সিনিয়র চয়েস নয়।',
      details: `
| | Hangfire | Quartz.NET | Queue worker |
| :--- | :--- | :--- | :--- |
| **Best at** | App jobs, retries, dashboard | Complex schedules, calendars | Throughput, isolation, replay |
| **Storage** | SQL / Redis | ADO.NET / RAM | Broker + your DB |
| **Cluster** | Multiple servers steal jobs | Cluster with DB lock | Competing consumers |
| **Recurring** | Cron via RecurringJob | Triggers + calendars | Separate scheduler publishes messages |
| **Request path** | \`BackgroundJob.Enqueue\` | Schedule from code | Publish message (prefer outbox) |

### When Hangfire is enough
Email, report generation, "process this after the HTTP response", modest volume, you want a UI to retry a failed job.

### When Quartz wins
"Every 2nd Monday, except holidays, misfire = do once then catch up." Financial batch windows.

### When a queue wins
Spiky load, multiple services, need DLQ/replay, workers scaled independently from the API. Hangfire inside the API pod still shares CPU with HTTP.
      `,
      commonMistakes: [
        'Hangfire Server in every web replica without thinking about concurrent recurring jobs.',
        'Quartz in-memory store in production — jobs vanish on restart.',
        'Using a message queue as a cron (no scheduler) and wondering why jobs drift.',
      ],
      bestPractices: [
        'Run workers in a dedicated process/deployment when jobs can starve HTTP or need different scale.',
        'Idempotent job bodies regardless of product — all three can run twice.',
        'Persist job state in SQL/Redis, not RAM, and monitor failed/retry counts.',
      ],
      interviewQs: [
        {
          q: 'Hangfire vs a RabbitMQ worker for sending 2 million emails?',
          a: 'RabbitMQ (or a cloud queue) plus a fleet of workers. Hangfire SQL storage and polling will struggle at that volume; the dashboard and job rows become the bottleneck. Hangfire is excellent for tens of thousands of application jobs with visibility. For bulk fan-out, publish messages (or use a dedicated email pipeline) and scale consumers. I would not put 2M rows in Hangfire\'s job table as the architecture.',
          bangla: '২০ লাখ ইমেইলে হ্যাংফায়ার টেবিল বটলনেক — কিউ + অনেক ওয়ার্কার। হ্যাংফায়ার অ্যাপ-লেভেল জব ও রিট্রাই UI এর জন্য।',
          followUp: 'Where does Hangfire still fit in that same system?',
          difficulty: 'senior',
        },
        {
          q: 'How does Hangfire avoid running the same recurring job twice on 3 web nodes?',
          a: 'Hangfire uses storage-level locks (SQL/Redis) so a recurring job is fetched by one server. That is not a guarantee against double execution under timeouts, crashes after work before the job is marked succeeded, or explicit retries. Clustering reduces duplicate *scheduling*; you still write idempotent jobs. Quartz clustering similarly uses a DB lock on triggers. Never assume "the framework runs it once."',
          bangla: 'লক শিডিউল ডুপ্লিকেট কমায়, ক্র্যাশ/রিট্রাইতে জব দুবার চলতে পারে — আইডেমপোটেন্সি এখনও লাগবে।',
          followUp: 'What if the job completed but the worker died before updating Hangfire state?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Choose a tool for: (1) nightly invoice PDF, (2) "send email 5 minutes after signup", (3) 50k image thumbnails after upload. One sentence each.',
      code: `// Hangfire — after HTTP, not on the request thread
BackgroundJob.Enqueue<IEmailSender>(x => x.SendWelcomeAsync(userId));
RecurringJob.AddOrUpdate<IInvoiceJob>(
    "nightly-invoices",
    x => x.RunAsync(CancellationToken.None),
    Cron.Daily(2, 0)); // 02:00 UTC

// Quartz-style thinking: trigger != job
// Job = InvoiceJob, Trigger = cron + holiday calendar + misfire instruction`,
    },
    {
      topic: 'Retry, Scheduling, Failure, Idempotency, Distributed Double-Run',
      difficulty: 'expert',
      english:
        'Jobs fail. Networks timeout after the work succeeded. Two cluster nodes both think they own the schedule. The senior design is: every job is idempotent, retries are bounded and classified, failures are visible, and "exactly once execution" is achieved with a unique job key / lease — not hope. Distributed execution means you plan for the job running twice.',
      bangla:
        'জব ফেল করবেই; টাইমআউটের পর কাজ সফলও হতে পারে। দুই নোড একই শিডিউল ধরতে পারে। আইডেমপোটেন্ট জব + বাউন্ডেড রিট্রাই + লিজ/ইউনিক কি — "ফ্রেমওয়ার্ক একবারই চালাবে" নয়।',
      details: `
### Failure classes
| Class | Example | Action |
| :--- | :--- | :--- |
| **Transient** | Deadlock, 503, timeout | Retry with backoff + jitter |
| **Poison** | Bad payload, validation | Fail fast, no retry, alert |
| **Unknown** | Timeout after POST | Assume it **might have succeeded** — idempotent retry only |

### Scheduling
Cron is UTC unless you say otherwise. DST bugs are real. Misfire: skip, fire once, or catch up all missed runs — pick explicitly (Quartz). Overlapping runs: disable concurrent execution **and** still make the body safe if the lock fails.

### Distributed double-run (the interview scenario)
Causes: lock expiry while the job is still running; two schedulers; retry + original both in flight; at-least-once queue. Mitigations:
- **Idempotency key** stored with a unique index (JobRunId / business date + tenant).
- **Lease / fencing token**: update \`WHERE version = @v\`; loser aborts.
- **Compare-and-set** on "already processed for this period".
Do not use \`lock (staticObject)\` — that is per process, not distributed.
      `,
      commonMistakes: [
        'Retrying a payment capture on timeout without an idempotency key to the provider.',
        'In-memory lock or [DisableConcurrentExecution] as the only safety in a cluster.',
        'Infinite retries that create a retry storm against a down dependency.',
      ],
      bestPractices: [
        'Store "processed for period P" before or with the side effect, uniquely constrained.',
        'Cap retries; then human/DLQ. Exponential backoff with jitter.',
        'Make job arguments immutable and include a correlation id for traces.',
      ],
      interviewQs: [
        {
          q: 'The nightly billing job ran twice and double-charged customers. Walk through causes and the fix.',
          a: 'Likely: two Hangfire/Quartz nodes both fired after a lock timeout, or a retry ran after the charge succeeded but before job success was recorded, or a queue redelivery. Fix: charge API idempotency key = invoiceId; unique index on Charges(InvoiceId); job starts by inserting a JobRun(date) row — second runner hits PK and exits. Compensate already-duplicated charges with a reversal process, not by "being more careful next time" only. Add an alert on job duration vs lock timeout.',
          bangla: 'লিজ টাইমআউট, রিট্রাই, বা কিউ রিডেলিভারি — ইনভয়েস আইডি ইউনিক চার্জ + জব রান পিকে ছাড়া আবার ঘটবে।',
          followUp: 'How long should the distributed lock last relative to the worst-case job duration?',
          difficulty: 'expert',
        },
        {
          q: 'How do you schedule a job that must not overlap itself?',
          a: 'Use the scheduler\'s mutex (Hangfire DisableConcurrentExecution, Quartz DisallowConcurrentExecution) as a first line, plus a DB lease keyed by job name. If the job is a message, use a single-consumer queue or a lock in the handler. Still write the handler so a second overlap is a no-op. Mutex-only answers fail when the process is killed and the mutex dies with it while a second node starts.',
          bangla: 'ফ্রেমওয়ার্ক মিউটেক্স যথেষ্ট নয় — ডিবি লিজ + আইডেমপোটেন্ট বডি, প্রসেস কিল হলেও নিরাপদ।',
          followUp: 'DisableConcurrentExecution on one node vs a three-node farm?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Write SQL for a JobLease table and a query that atomically takes the lease for "billing-2026-08-16" or returns false.',
      code: `public async Task RunBillingAsync(DateOnly day, CancellationToken ct)
{
    var key = $"billing-{day:yyyy-MM-dd}";
    var taken = await _db.JobLeases.AnyAsync(x => x.Key == key, ct);
    if (taken) return;

    try
    {
        _db.JobLeases.Add(new JobLease(key, DateTimeOffset.UtcNow));
        await _db.SaveChangesAsync(ct); // unique index = second runner throws
    }
    catch (DbUpdateException) { return; } // lost the race — idempotent exit

    await ChargeDueInvoicesAsync(day, ct);
}`,
    },
    {
      topic: 'ASP.NET: Do Not Block Request Threads; 202 Accepted',
      difficulty: 'senior',
      english:
        'The HTTP request thread (or async continuation) should validate, authorize, persist a command, and return. Slow work — PDF, video, fan-out emails, ML — belongs on a worker. Return 202 Accepted with a Location (or operation id) the client can poll. Blocking Thread.Sleep, .Result, or a 2-minute EF loop inside the action kills throughput and causes timeouts and thread-pool starvation.',
      bangla:
        'রিকোয়েস্টে ভ্যালিডেট-সেভ-রিটার্ন। ভারী কাজ ওয়ার্কারে। ২০২ অ্যাকসেপ্টেড + স্ট্যাটাস URL। অ্যাকশনের ভিতর স্লিপ/.Result/লম্বা লুপ থ্রেডপুল মারে।',
      details: `
### 202 Accepted pattern
1. Client POST /orders (or /exports).
2. API writes Order (Pending) + outbox/job in **one transaction**.
3. Response: \`202 Accepted\`, \`Location: /api/operations/{id}\`, body with status URL.
4. Worker processes; GET /api/operations/{id} returns 200 + result or 409/422 on failure.
5. Optional: webhook/SignalR when done — still do not hold the original request.

### Why not Task.Run in the controller?
The work is still in the web process: deploys kill it, you cannot scale workers separately, no retry/DLQ, and under load you still compete for the same pool. Task.Run is not a job architecture.

### Sync-over-async
\`.Result\` / \`.Wait()\` on the request path can deadlock on the legacy ASP.NET context and still starves Kestrel under load. Keep the action async and **short**.
      `,
      commonMistakes: [
        'Returning 200 OK after enqueueing and implying the email was sent.',
        'Task.Run from the controller as "background processing".',
        'Holding the HTTP connection open until the PDF is generated (gateway timeout).',
      ],
      bestPractices: [
        '202 + operation resource; document that completion is asynchronous.',
        'Idempotency-Key on the POST so retries do not enqueue twice.',
        'Make GET status cheap (indexed operation id); do not recompute the job on poll.',
      ],
      interviewQs: [
        {
          q: 'A report takes 40 seconds. How do you design the API?',
          a: 'POST /reports returns 202 with an operation id after persisting a ReportRequest. A worker (Hangfire/queue) generates the file to blob storage. GET /reports/{id} returns 409/425-style "pending" or 200 with a download URL. I would not await generation in the action — load balancers and browsers will timeout, and you block a Kestrel thread the whole time even if async IO waits, because the request is still open and the client is stuck. For progress, poll or SignalR, not a long POST.',
          bangla: 'পোস্টে রিকোয়েস্ট সেভ করে ২০২ দিন, ওয়ার্কার ফাইল বানাক, গেট দিয়ে স্ট্যাটাস — ৪০ সেকেন্ড পোস্ট হোল্ড করবেন না।',
          followUp: 'What status code if the client polls before the worker has started?',
          difficulty: 'senior',
        },
        {
          q: 'Why is Task.Run in an MVC action not an acceptable background job?',
          a: 'It is decoupled from the request only until the AppDomain recycles. No persistence, no retry, no dashboard, no competing consumers, no graceful drain. Exceptions vanish unless you observe the task. Under backpressure you still use the web host\'s thread pool. Seniors enqueue to Hangfire/a broker with an outbox so the work survives deploys and can scale on a worker pool.',
          bangla: 'টাস্ক.রান ডিপ্লয়/ক্র্যাশে হারিয়ে যায়, রিট্রাই নেই — আউটবক্স+হ্যাংফায়ার/কিউই সিনিয়র প্যাটার্ন।',
          followUp: 'When is Task.Run actually appropriate in ASP.NET Core?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Sketch POST /exports and GET /exports/{id} including 202, 200, 404, and 409 conflict on duplicate Idempotency-Key.',
      code: `[HttpPost("/api/exports")]
public async Task<IActionResult> StartExport(ExportRequest req, CancellationToken ct)
{
    var op = await _exports.EnqueueAsync(req, ct); // DB + Hangfire/outbox
    return AcceptedAtAction(nameof(GetStatus), new { id = op.Id }, op);
}

[HttpGet("/api/exports/{id:guid}")]
public async Task<IActionResult> GetStatus(Guid id, CancellationToken ct)
{
    var op = await _exports.GetAsync(id, ct);
    if (op is null) return NotFound();
    if (op.Status == ExportStatus.Pending) return Accepted(op); // still running
    return Ok(op); // includes blob URL when Succeeded
}`,
    },
  ],
  quickRevision: {
    concepts: [
      'BackgroundService is Singleton — scope per iteration',
      'Honor stoppingToken or Kubernetes will SIGKILL you',
      'Hangfire: app jobs + dashboard; Quartz: calendars/misfires; queues: volume',
      'Recurring jobs still run twice under crash/timeout — idempotency required',
      'Transient vs poison vs unknown (timeout after success)',
      'Distributed lock/lease + unique JobRun key',
      'In-memory lock is not distributed',
      'HTTP action: validate, persist, 202 — do not do the slow work',
      'Task.Run in a controller is not a worker architecture',
      'Idempotency-Key on enqueue APIs',
    ],
    questions: [
      'Why not inject DbContext into BackgroundService?',
      'How does graceful shutdown cancel a hosted service?',
      'Hangfire vs Quartz vs queue — when?',
      'How does Hangfire clustering still double-run?',
      'How do you stop a nightly job charging twice?',
      'Transient vs poison failure — retry policy?',
      'What is the 202 Accepted pattern?',
      'Why not generate a PDF inside the POST?',
      'Why is Task.Run insufficient?',
      'How do you poll job status cheaply?',
    ],
    mistakes: [
      'Captive Scoped DbContext in a hosted service',
      'Infinite retries and retry storms',
      'Trusting DisableConcurrentExecution alone in a farm',
      'Blocking the request thread on slow work',
      'Returning 200 before the side effect finished',
    ],
    scenarios: [
      'Deploy kills in-flight email sends with no redelivery',
      'Three API pods all fire the 2am cron',
      'Payment timeout, retry, customer billed twice',
      'Export POST hits the 60s gateway timeout',
      'Outbox dispatcher hosted service dies on first SqlException',
    ],
  },
  revisionSummary: `
- **Hosted services**: scope per unit of work, cancellation, do not kill the loop on one exception.
- **Tooling**: Hangfire for visible app jobs, Quartz for rich schedules, queues when volume and isolation matter.
- **Correctness**: jobs run twice in clusters — lease + unique business key + bounded retry.
- **ASP.NET**: 202 Accepted + worker; never block Kestrel on batch work.
  `,
  summary:
    'ব্যাকগ্রাউন্ড প্রসেসিং মানে থ্রেড লুকানো নয় — হোস্টেড সার্ভিসের লাইফটাইম, আইডেমপোটেন্ট জব, এবং রিকোয়েস্ট থেকে কাজ আলাদা করাই সিনিয়র বার।',
};
