export const observabilityData = {
  id: 'observability',
  title: 'Logging, Monitoring & Observability',
  description: 'Troubleshoot production like a senior: structured logs, correlation, metrics, traces, and a slow-API playbook.',
  sections: [
    {
      topic: 'Structured Logging with Serilog',
      difficulty: 'senior',
      english: 'Seniors log events with named properties, not interpolated strings that cannot be queried. Log levels: Debug for local, Information for business events, Warning for recoverable issues, Error for failures that need action. Never log secrets, tokens, or full PAN. ILogger is the abstraction; Serilog is a common sink implementation.',
      bangla: 'স্ট্রাকচার্ড লগ — প্রপার্টি সহ। সিক্রেট লগ করবেন না। Information ব্যবসায়িক ইভেন্ট, Error অ্যাকশনযোগ্য ফেইল।',
      details: `
| Level | When | Example |
| :--- | :--- | :--- |
| Information | Successful business event | Order {OrderId} placed |
| Warning | Degraded but continuing | Redis miss, DB used |
| Error | Failed operation | SaveChanges failed |
| Fatal | Process dying | Host crashed |

Use message templates: \`_logger.LogInformation("User {UserId} login", id)\` not \`$"...{id}"\`.
      `,
      commonMistakes: [
        'Logging exception.ToString() without the exception object.',
        'Information logs inside a 10k RPS loop with no sampling.',
        'Logging Authorization headers.',
      ],
      bestPractices: [
        'Enrich with MachineName, Environment, Application.',
        'Request logging middleware with path, status, elapsed ms.',
        'Separate sinks: console local, Seq/ELK/App Insights prod.',
      ],
      interviewQs: [
        {
          q: 'Why structured logging instead of string concatenation?',
          a: 'Because you query logs as fields: UserId = 42, ElapsedMs > 1000. Concatenated strings force full-text search, cost more to store, and break dashboards. Templates also avoid accidental serialization of huge objects when you pass the object as a property with destructuring only when needed.',
          bangla: 'ফিল্ড হিসেবে সার্চ করতে পারবেন। স্ট্রিং জোড়া দিলে শুধু টেক্সট সার্চ।',
          difficulty: 'senior',
        },
      ],
      practice: 'Configure Serilog with console + file and a RequestId enricher.',
      code: `Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

_logger.LogInformation("Order {OrderId} paid in {ElapsedMs} ms", order.Id, elapsed);`,
    },
    {
      topic: 'Correlation, OpenTelemetry, Metrics vs Logs vs Traces',
      difficulty: 'expert',
      english: 'A correlation ID (or trace id) follows a request across API, worker, and HTTP clients. Logs tell you what happened on one machine. Metrics tell you how much (RPS, p99, error rate). Traces tell you where time went across services. OpenTelemetry is the vendor-neutral way to emit all three. Health checks are liveness/readiness, not a substitute for APM.',
      bangla: 'করিলেশন আইডি রিকোয়েস্ট জুড়ে। মেট্রিক কতটা, ট্রেস কোথায় সময় গেল, লগ কী ঘটল।',
      details: `
### Slow API playbook
1. Confirm: is it all instances or one? all endpoints or one?
2. Metrics: p99 latency, error rate, CPU, GC, thread pool queue
3. Traces: which span — SQL, Redis, HTTP outbound?
4. Logs: correlation id of a slow request
5. SQL: execution plan, blocking, missing index
6. If CPU high: hot path allocations / tight loop
7. If CPU low but latency high: waits (locks, IO, downstream)
      `,
      commonMistakes: [
        'Only looking at CPU when the app is waiting on SQL.',
        'No trace id on outbound HttpClient calls.',
        'Health check that hits a heavy dependency on every kube probe.',
      ],
      bestPractices: [
        'Propagate traceparent / Request-Id.',
        'RED metrics: Rate, Errors, Duration.',
        'Grafana/App Insights dashboards before the incident, not during.',
      ],
      interviewQs: [
        {
          q: 'Production API suddenly became slow. How do you troubleshoot?',
          a: 'I split symptoms: latency vs errors vs saturation. I check dashboards for p99, dependency duration, SQL DTU, Redis, GC, thread pool. I pick one correlation id and walk the trace. If SQL dominates, I capture the plan. If outbound HTTP dominates, I check the dependency. I do not restart first unless it is a memory leak emergency — restart hides evidence.',
          bangla: 'p99, ট্রেস, SQL প্ল্যান। প্রথমে রিস্টার্ট নয় — প্রমাণ নষ্ট হয়।',
          followUp: 'What if only one of five instances is slow?',
          difficulty: 'expert',
        },
      ],
      practice: 'Add a middleware that sets a correlation id header on request and response.',
      code: `app.Use(async (ctx, next) =>
{
    var id = ctx.Request.Headers["X-Correlation-Id"].FirstOrDefault()
             ?? Guid.NewGuid().ToString("N");
    ctx.Response.Headers["X-Correlation-Id"] = id;
    using (LogContext.PushProperty("CorrelationId", id))
        await next();
});`,
    },
  ],
  quickRevision: {
    concepts: [
      'Structured templates',
      'Never log secrets',
      'Correlation / trace id',
      'Logs vs metrics vs traces',
      'OpenTelemetry',
      'RED metrics',
      'Health vs APM',
      'Serilog enrichers',
      'Slow-API playbook',
      'Do not restart first',
    ],
    questions: [
      'Why structured logging?',
      'How do you correlate a request across services?',
      'API suddenly slow — steps?',
      'What is OpenTelemetry?',
      'Liveness vs readiness?',
      'When is logging too expensive?',
      'How do you avoid logging PII?',
      'What is p99?',
      'CPU high vs latency high?',
      'How do you trace HttpClient calls?',
    ],
    mistakes: [
      'String-concat logs',
      'Logging tokens',
      'No correlation id',
      'Restart as first step',
      'Health check that deadlocks SQL',
    ],
    scenarios: [
      'p99 jumped, CPU idle',
      'One pod slow',
      'Logs missing in Kibana',
      'Trace broken at service boundary',
      'Disk full from Debug logs in prod',
    ],
  },
  revisionSummary: `
- Structured logs + correlation ids are non-negotiable in production.
- Metrics for symptoms, traces for location, logs for detail.
- Slow API: measure, then SQL/HTTP/GC — do not guess.
  `,
  summary: 'অবজারভেবিলিটি ছাড়া সিনিয়র ইঞ্জিনিয়ার প্রোডাকশন ডিবাগ করতে পারেন না।',
};
