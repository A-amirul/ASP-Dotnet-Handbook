export const messagingData = {
  id: 'messaging',
  title: 'Messaging: RabbitMQ & Kafka',
  description:
    'Delivery semantics, broker internals, and production .NET patterns for RabbitMQ and Kafka — including idempotent consumers, retries, DLQ, and when each broker is the wrong choice.',
  sections: [
    {
      topic: 'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once, Idempotent Consumers',
      difficulty: 'senior',
      english:
        'A queue is competing consumers: each message is processed by one worker. Pub/sub is fan-out: every subscriber gets a copy. Brokers almost never give you true exactly-once end-to-end. You design for at-least-once plus an idempotent consumer. At-most-once means fire-and-forget — lost messages are acceptable. Exactly-once is a marketing term for "dedupe + transactional write of offset and side effects together."',
      bangla:
        'কিউ মানে একটা মেসেজ একজন কনজিউমার; পাব/সাব মানে সবাই কপি পায়। এক্স্যাক্টলি-ওয়ান্স প্রায় কখনোই এন্ড-টু-এন্ড হয় না — অ্যাট-লিস্ট-ওয়ান্স + আইডেমপোটেন্ট কনজিউমারই প্রোডাকশন ডিজাইন।',
      details: `
### Topology

| Model | Who processes | Typical use |
| :--- | :--- | :--- |
| **Queue (competing consumers)** | One of N workers | Order processing, email send, payments |
| **Pub/sub (fan-out)** | Every subscriber | Cache invalidation, domain events, notifications |
| **Hybrid** | Exchange routes to many queues | One event, many independent handlers |

### Delivery guarantees (what interviewers want)

| Semantic | Broker behavior | Your job |
| :--- | :--- | :--- |
| **At-most-once** | Ack before work (or no ack) | Accept loss; never for money |
| **At-least-once** | Ack after work; redelivery on crash | **Must be idempotent** |
| **Exactly-once** | Offset + side effect in one transaction (Kafka EOS) or inbox table | Still need unique keys; not magic |

### Idempotent consumer (the real exactly-once)
Store a processed-message id (inbox / processed table) in the **same DB transaction** as the business write. Duplicate delivery then becomes a no-op. Without that, retries and rebalances **will** double-charge, double-email, or double-insert.
      `,
      commonMistakes: [
        'Assuming the broker "won\'t deliver twice" because you enabled acks.',
        'Making the handler non-idempotent then adding retries "for reliability".',
        'Using at-most-once for payments because "exactly-once is too hard".',
      ],
      bestPractices: [
        'Treat every consumer as at-least-once. Design the write path around a unique MessageId.',
        'Ack only after the side effect is committed (or after the inbox row is committed with it).',
        'Separate "received" from "processed" — poison messages must not block the queue forever.',
      ],
      interviewQs: [
        {
          q: 'Explain at-least-once vs exactly-once in a .NET consumer.',
          a: 'At-least-once means the broker may redeliver after a crash between "work done" and "ack". Exactly-once end-to-end is not a broker switch: you persist a processed-id (or Kafka transactional produce+offset) in the same atomic unit as the business change. In .NET that is usually an Inbox table + EF transaction, or MassTransit inbox/outbox. If the handler is not idempotent, "exactly-once" on the broker still double-applies side effects that live outside that transaction (HTTP calls, emails).',
          bangla: 'ক্র্যাশ হলে রিডেলিভারি হবেই — একই ট্রানজেকশনে MessageId সেভ না করলে ডুপ্লিকেট সাইড ইফেক্ট অনিবার্য।',
          followUp: 'Where would you put the inbox row if the side effect is an HTTP call to a payment gateway?',
          difficulty: 'senior',
        },
        {
          q: 'Queue vs pub/sub — when does a senior pick each?',
          a: 'Queue when work must happen once (fulfillment, debit). Pub/sub when many independent systems must react (search index, analytics, cache). Mixing them without thinking about fan-out creates silent double processing: two queues bound to the same exchange both run "charge card". Competing consumers scale throughput; they do not give ordering across workers.',
          bangla: 'একবার করতে হবে = কিউ; অনেক সিস্টেম রিঅ্যাক্ট করবে = পাব/সাব। একই ইভেন্টে দুই কিউ বাইন্ড করলে চার্জ দুবার হতে পারে।',
          followUp: 'How do you scale a queue without breaking per-customer ordering?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Design an inbox table (MessageId PK) and write the consumer so a redelivered PaymentCaptured event cannot insert two ledger rows.',
      code: `public sealed class PaymentCapturedHandler
{
    public async Task Handle(PaymentCaptured evt, CancellationToken ct)
    {
        await using var tx = await _db.Database.BeginTransactionAsync(ct);
        if (await _db.Inbox.AnyAsync(x => x.MessageId == evt.MessageId, ct))
        {
            await tx.CommitAsync(ct); // duplicate delivery — no-op
            return;
        }

        _db.Inbox.Add(new InboxRow(evt.MessageId, DateTimeOffset.UtcNow));
        _db.Ledger.Add(LedgerEntry.From(evt));
        await _db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct); // ack only after this succeeds
    }
}`,
    },
    {
      topic: 'RabbitMQ: Exchange, Queue, Routing Key, Ack, Retry, DLQ, Ordering',
      difficulty: 'senior',
      english:
        'Producers publish to an exchange, not a queue. The exchange + routing key decide which queues get a copy. Consumers ack (or nack/reject). Unacked messages return to the queue on channel close. Ordering is per-queue only if you have a single consumer and no prefetch races — RabbitMQ is not a log; it is a smart broker.',
      bangla:
        'প্রডিউসার কিউতে নয়, এক্সচেঞ্জে পাবলিশ করে। রাউটিং কি + এক্সচেঞ্জ টাইপ ঠিক করে কোন কিউ পাবে। আন-অ্যাকড মেসেজ চ্যানেল বন্ধ হলে ফিরে আসে। অর্ডারিং শুধু সিঙ্গেল কনজিউমার কিউতে নির্ভরযোগ্য।',
      details: `
### Exchange types

| Type | Routing | Use |
| :--- | :--- | :--- |
| **direct** | Exact routing key | Command to one queue |
| **topic** | \`order.*.created\` wildcards | Domain events by name |
| **fanout** | Ignore key; all bound queues | Broadcast |
| **headers** | Header match | Rare; prefer topic |

### Ack / retry / DLQ
- **autoAck=true**: at-most-once. Crash after receive = lost message.
- **manual ack**: ack after DB commit. Crash = redelivery (at-least-once).
- **Nack requeue=true**: immediate retry — poison message tight-loops the CPU.
- **Retry with TTL + delay queue** (or MassTransit delayed redelivery): backoff, then DLQ.
- **DLQ (dead-letter exchange)**: exhausted retries, deserialization failures, unhandled exceptions. Alert on DLQ depth; never "set and forget".

### Ordering
RabbitMQ does not give global order. Per-queue FIFO holds only with one consumer and \`prefetch=1\`. Multiple consumers on one queue interleave. For per-aggregate order, use a routing key = aggregate id and a **single** consumer per queue, or don't use RabbitMQ as a sequenced log.
      `,
      commonMistakes: [
        'autoAck in production "because it is faster".',
        'Nack+requeue on every exception — poison messages melt the broker.',
        'Expecting FIFO across competing consumers or after a retry hop.',
      ],
      bestPractices: [
        'Declare topology in code (or MassTransit) so queues/exchanges/DLX exist before consume.',
        'Prefetch based on handler latency; huge prefetch + slow DB = memory and unfairness.',
        'DLQ + metric + runbook. A silent DLQ is a production incident in slow motion.',
      ],
      interviewQs: [
        {
          q: 'What happens if a RabbitMQ consumer crashes after DB commit but before ack?',
          a: 'The message is redelivered (unacked). If the handler is not idempotent you double-apply. That is why inbox/outbox or a unique business key is mandatory. The broker did the right thing: at-least-once. Blaming RabbitMQ for duplicates is a junior answer.',
          bangla: 'আন-অ্যাকড মেসেজ আবার আসবে — ডুপ্লিকেট হ্যান্ডলার আইডেমপোটেন্ট না হলে ডাবল রাইট আপনার বাগ, ব্রোকারের নয়।',
          followUp: 'Would you ack before or after calling an external HTTP API? Why?',
          difficulty: 'senior',
        },
        {
          q: 'How do you implement retry + DLQ without blocking the queue?',
          a: 'Do not requeue in-place. Publish to a delay/retry queue with TTL and a dead-letter back to the work queue (or use MassTransit UseMessageRetry + UseDelayedRedelivery). After N attempts, dead-letter to a DLQ with the exception headers. Process DLQ with a tool/operator, not the hot path. Blocking the original queue on a bad payload is how one poison JSON takes down checkout.',
          bangla: 'একই কিউতে রিকিউ করবেন না — TTL ডিলে কিউ, তারপর DLQ। পয়জন মেসেজ চেকআউট কিউ ব্লক করতে দেবেন না।',
          followUp: 'What headers would you copy onto the DLQ message for debugging?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Sketch topology: work queue, retry queue (TTL 5s/30s/5m), DLX, and a single consumer with manual ack after SaveChanges.',
      code: `// MassTransit + RabbitMQ: retry then DLQ (no in-place requeue)
cfg.ReceiveEndpoint("orders", e =>
{
    e.PrefetchCount = 16;
    e.UseMessageRetry(r => r.Exponential(3,
        TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(2)));
    e.UseDelayedRedelivery(r => r.Intervals(
        TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5)));
    e.DiscardFaultedMessages(); // or configure a dedicated fault/DLQ endpoint
    e.ConfigureConsumer<PlaceOrderConsumer>(context);
});`,
    },
    {
      topic: 'Kafka: Partitions, Offset, Consumer Groups, Ordering Guarantees',
      difficulty: 'expert',
      english:
        'Kafka is a partitioned, replicated log. Producers append; consumers pull and commit offsets. A consumer group is competing consumers: each partition is assigned to at most one member of that group. Ordering is per partition, not per topic. Keyed produce (orderId) pins an aggregate to one partition. Rebalance + commit lag is how you get duplicates.',
      bangla:
        'কাফকা পার্টিশন করা লগ। কনজিউমার গ্রুপে প্রতি পার্টিশন একজন মেম্বার। অর্ডারিং টপিক-ওয়াইড নয়, পার্টিশন-ওয়াইড। কি দিয়ে একই অ্যাগ্রিগেট এক পার্টিশনে রাখুন।',
      details: `
### Core model

| Concept | Meaning |
| :--- | :--- |
| **Partition** | Ordered, append-only log segment of a topic |
| **Offset** | Position in that partition (not a global clock) |
| **Consumer group** | Load-balanced readers; one owner per partition |
| **Commit** | "I processed up to this offset" — stored in \`__consumer_offsets\` or transactional |

### Ordering (say this precisely)
- Same key → same partition → order preserved **for that key**.
- Different keys → different partitions → **no** cross-key order.
- Two consumer groups on one topic both see the full stream (pub/sub).
- Two members of **one** group split partitions (queue).

### Commits and duplicates
Enable.AutoCommit is a footgun: commit can happen before your DB write, or not happen after it. Manual commit after the inbox transaction. On rebalance, uncommitted offsets replay. Kafka "exactly-once" (idempotent producer + transactional consume-transform-produce) does **not** make your SQL Server write exactly-once unless that write is in the same transactional story (or you still use an inbox).
      `,
      commonMistakes: [
        'Saying "Kafka guarantees order" without saying "per partition, by key".',
        'Auto-commit + slow handler = skipped or duplicated work after a crash.',
        'More consumers than partitions in a group — extra members sit idle.',
      ],
      bestPractices: [
        'Partition count is a scaling decision you cannot cheaply shrink. Start from throughput and key cardinality.',
        'Commit offsets after the side effect (or use transactional produce for CTE pipelines).',
        'Monitor consumer lag, rebalance rate, and produce errors — not just "is the pod up".',
      ],
      interviewQs: [
        {
          q: 'Does Kafka guarantee ordering of all messages in a topic?',
          a: 'No. Only within a partition. To keep Order 1001 events in sequence, produce with key = orderId so they hash to one partition, and consume with a group so that partition has one owner. Adding partitions later can change the hash mapping for new messages unless you use a custom partitioner / compact + migrate. Cross-partition joins need a different design (streams, or don\'t require that order).',
          bangla: 'অর্ডার শুধু পার্টিশনের ভিতর। একই orderId কি দিয়ে এক পার্টিশনে পাঠান — টপিক জুড়ে গ্লোবাল অর্ডার নেই।',
          followUp: 'What happens to ordering if you increase partition count on a live topic?',
          difficulty: 'senior',
        },
        {
          q: 'What is a consumer group and what happens on rebalance?',
          a: 'A group is a named set of consumers sharing partition assignment. On join/leave/crash, Kafka revokes partitions and reassigns. The new owner starts from the last committed offset. In-flight work that was not committed is replayed (duplicates). Stop-the-world rebalances stall processing; cooperative sticky assignor reduces that. Never do slow DB work while holding the consumer loop without pausing/committing carefully.',
          bangla: 'রিব্যালেন্সে পার্টিশন হাত বদলায় — আনকমিটেড অফসেট আবার প্লে হয়, তাই আইডেমপোটেন্সি বাধ্যতামূলক।',
          followUp: 'Why can you not have 20 consumers in a group on a 6-partition topic?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Explain how you would keep per-customer event order while scaling to 12 consumers. Include partition count and message key.',
      code: `var config = new ConsumerConfig
{
    BootstrapServers = "kafka:9092",
    GroupId = "ledger-workers",
    EnableAutoCommit = false,
    AutoOffsetReset = AutoOffsetReset.Earliest,
    IsolationLevel = IsolationLevel.ReadCommitted
};

// Produce with key so one customer stays on one partition
await producer.ProduceAsync("payments", new Message<string, string>
{
    Key = evt.CustomerId.ToString(),
    Value = json
});`,
    },
    {
      topic: 'RabbitMQ vs Kafka — When to Choose',
      difficulty: 'senior',
      english:
        'RabbitMQ is a smart broker: routing, TTL, priority, per-message ack, easy request/reply. Kafka is a dumb, fast log: replay, high throughput, multiple independent consumer groups, long retention. Choosing Kafka "because it is web-scale" for a 50 msg/s command bus is overengineering. Choosing RabbitMQ as an event sourcing log you must replay for 30 days is the wrong tool.',
      bangla:
        'র‍্যাবিট স্মার্ট রাউটার; কাফকা দ্রুত রিপ্লে-যোগ্য লগ। থ্রুপুট আর রিপ্লে লাগলে কাফকা; কমপ্লেক্স রাউটিং, RPC, প্রায়োরিটি হলে র‍্যাবিট। বাজওয়ার্ডে স্ট্যাক বাছাবেন না।',
      details: `
| Dimension | RabbitMQ | Kafka |
| :--- | :--- | :--- |
| **Abstraction** | Messages disappear when acked | Log retained (hours–days–forever) |
| **Routing** | Exchanges, bindings, headers | Topic + key + partition |
| **Replay** | No (unless you built it) | Yes — reset offset |
| **Throughput** | Thousands–tens of k/s typical | Hundreds of k/s–millions with batches |
| **Consumers** | Competing on a queue; fan-out via extra queues | Many groups, each with full history |
| **Ops** | AMQP, mirrored/quorum queues | Cluster, ISR, disk, partition math |
| **.NET** | MassTransit, EasyNetQ, RabbitMQ.Client | Confluent.Kafka, MassTransit Kafka rider |

### Pick RabbitMQ when
Command/work queues, RPC, per-message TTL/priority, complex routing, modest volume, you want messages gone after success.

### Pick Kafka when
Event streaming, audit/replay, many independent subscribers, high throughput, stream processing, you accept operational cost.

### Pick neither when
A database outbox + a single worker, or Hangfire, already meets the SLA. Messaging is not a default layer.
      `,
      commonMistakes: [
        'Kafka for a simple email queue of 100/day.',
        'RabbitMQ as the system of record for events you must reprocess next quarter.',
        'Running both "just in case" without a clear ownership of each message type.',
      ],
      bestPractices: [
        'Start from access pattern: competing work vs replayable stream.',
        'Name the failure: poison message, lag, split brain, disk fill — then pick the broker that fails in a way you can operate.',
        'MassTransit can sit on both; the broker choice is still an architecture decision.',
      ],
      interviewQs: [
        {
          q: 'When would you refuse Kafka in a design interview?',
          a: 'When there is no replay requirement, volume is low, the team has no Kafka operations experience, and the problem is "do this work once." Kafka\'s cost is partitions, rebalances, disk, and consumer lag debugging. I would use a queue (RabbitMQ/SQS) or even a DB-backed worker. I would choose Kafka when multiple teams must independently consume a durable stream or when we need to reprocess history.',
          bangla: 'রিপ্লে/হাই থ্রুপুট/অনেক সাবস্ক্রাইবার না থাকলে কাফকা রিফিউজ করুন — অপস খরচ সস্তা নয়।',
          followUp: 'How would you migrate from RabbitMQ to Kafka without dual-writing forever?',
          difficulty: 'expert',
        },
        {
          q: 'Can RabbitMQ replace Kafka for domain events?',
          a: 'For live fan-out, yes: one exchange, many queues. You lose cheap replay, independent lag per consumer group on the same log, and high-volume sequential IO. Late-joining services cannot "catch up from last week" unless you persisted events elsewhere (event store / outbox table). If the event is the audit log, Kafka or an event store wins. If the event is a signal to do work now, RabbitMQ is enough.',
          bangla: 'লাইভ ফ্যান-আউট র‍্যাবিটে সম্ভব; গত সপ্তাহের ইভেন্ট রিপ্লে করতে হলে কাফকা বা ইভেন্ট স্টোর লাগে।',
          followUp: 'Where do you store the source of truth if RabbitMQ already deleted the message?',
          difficulty: 'senior',
        },
      ],
      practice:
        'For an e-commerce system, assign each: PlaceOrder command, OrderPlaced event (search + email + analytics), clickstream. Justify broker per stream.',
      code: `// Decision sketch (not a framework)
// PlaceOrder     -> RabbitMQ work queue (exactly one worker, DLQ, retry)
// OrderPlaced    -> Kafka topic key=orderId (search, email, analytics = 3 groups)
// Clickstream    -> Kafka (volume + replay for ML)
// PasswordReset  -> RabbitMQ (low volume, TTL, no replay)`,
    },
    {
      topic: 'Practical .NET: Duplicates, Retry, DLQ (MassTransit or Raw)',
      difficulty: 'senior',
      english:
        'In production .NET, MassTransit (or Cap, NServiceBus) gives retry, outbox, and fault endpoints. Raw RabbitMQ.Client/Confluent.Kafka means you own ack, commit, and topology. Interviewers want to hear how you stop duplicate PlaceOrder, how retries do not amplify a 500 from a dependency, and how DLQ is operated — not just NuGet package names.',
      bangla:
        "ম্যাসট্রানজিট রিট্রাই/আউটবক্স/ফল্ট এন্ডপয়েন্ট দেয়; র ক্লায়েন্টে অ্যাক/কমিট আপনার দায়িত্ব। ডুপ্লিকেট অর্ডার, রিট্রাই স্টর্ম এবং DLQ অপারেশনই সিনিয়র প্রশ্ন।",
      details: `
### Duplicate messages
Causes: at-least-once, publisher retry, network timeout after broker write, Kafka rebalance. Fix: **idempotency key** from the producer (MessageId / OrderId) and an inbox unique index. MassTransit Entity Framework outbox + inbox does this if configured; it is not default magic.

### Retry
Retry **transient** failures (timeout, 429, deadlock). Do not retry validation errors or 404. Exponential backoff + jitter. Cap retry count then DLQ. Retrying a non-idempotent HTTP charge is how you double-bill.

### DLQ / fault queue
MassTransit \`_error\` / \`_fault\` queues (RabbitMQ) or a dedicated fault topic. Include exception, conversation id, and original payload. Process with a replay tool after a fix — do not auto-replay blindly into a still-broken handler.
      `,
      commonMistakes: [
        'Retrying all exceptions including JsonException and business rule failures.',
        'Publishing from a controller without an outbox — DB commit succeeds, broker publish fails, event never sent (or the reverse).',
        'No unique index on inbox — race of two consumers inserts two rows.',
      ],
      bestPractices: [
        'Transactional outbox: write entity + OutboxMessage in one SaveChanges; a hosted service publishes.',
        'Idempotency-Key on commands from the API all the way to the consumer.',
        'Alert on fault queue depth and consumer lag; page a human, do not only log.',
      ],
      interviewQs: [
        {
          q: 'How do you handle a duplicate PlaceOrder message in MassTransit?',
          a: 'Give the command a stable MessageId (client idempotency key). Enable the EF inbox so the second delivery sees the consumed row and skips. Also put a unique constraint on Order.IdempotencyKey so two in-flight consumers cannot both insert. MassTransit retry will redeliver; without inbox+unique you get two orders. I would still make the handler a no-op if the order already exists.',
          bangla: 'স্টেবল MessageId + ইনবক্স টেবিল + ইউনিক কনস্ট্রেইন্ট — শুধু MassTransit রিট্রাই যথেষ্ট নয়।',
          followUp: 'What if the duplicate arrives on a different queue because of a mis-binding?',
          difficulty: 'senior',
        },
        {
          q: 'Walk through outbox vs publishing directly in the API request.',
          a: 'Direct publish after SaveChanges: process crash = committed order, no event. Publish before SaveChanges: event without row. Outbox stores the message in the same transaction as the order; a background dispatcher publishes and marks sent. At-least-once to the broker remains, so consumers still need inbox. This is the standard senior answer for "we lost an event in production".',
          bangla: 'সেভ আর পাবলিশ আলাদা হলে একটি সফল অন্যটি ফেল করে — আউটবক্স এক ট্রানজেকশনে দুটো রাখে।',
          followUp: 'How do you avoid the outbox dispatcher becoming a single point of delay?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Implement: API accepts Idempotency-Key, writes Order + Outbox in one transaction, consumer uses inbox, faults go to DLQ after 3 delayed retries.',
      code: `public class PlaceOrderConsumer : IConsumer<PlaceOrder>
{
    public async Task Consume(ConsumeContext<PlaceOrder> ctx)
    {
        var msg = ctx.Message;
        if (await _db.Orders.AnyAsync(o => o.IdempotencyKey == msg.IdempotencyKey))
            return; // duplicate command

        _db.Orders.Add(Order.Create(msg));
        await _db.SaveChangesAsync(); // MassTransit EF outbox wraps this when configured
    }
}

// Startup: x.AddEntityFrameworkOutbox<AppDb>(o => { o.UseSqlServer(); o.UseBusOutbox(); });`,
    },
  ],
  quickRevision: {
    concepts: [
      'Queue = competing consumers; pub/sub = every subscriber',
      'At-least-once is the default; design idempotent consumers',
      'Exactly-once = inbox/outbox (or Kafka EOS) + no side effects outside the transaction',
      'RabbitMQ: exchange + routing key + queue; ack after commit',
      'Poison message: delay retry then DLQ, never tight requeue',
      'RabbitMQ order is not a global log; prefetch and competing consumers break FIFO',
      'Kafka order is per partition; key pins an aggregate',
      'Consumer group: one owner per partition; extra members idle',
      'Enable.AutoCommit / autoAck are production footguns',
      'Outbox in the API, inbox in the consumer',
    ],
    questions: [
      'At-least-once vs exactly-once in .NET?',
      'What happens if you crash before ack/commit?',
      'How does a RabbitMQ topic exchange route?',
      'How do you build retry + DLQ without blocking?',
      'Does Kafka order the whole topic?',
      'What is a consumer group rebalance?',
      'When do you refuse Kafka?',
      'When is RabbitMQ the wrong event store?',
      'How does the transactional outbox work?',
      'How do you stop duplicate PlaceOrder?',
    ],
    mistakes: [
      'Trusting the broker not to duplicate',
      'Retrying non-transient and non-idempotent calls',
      'autoAck / AutoCommit in production',
      'Claiming global order on Kafka or RabbitMQ',
      'Publishing events outside the DB transaction',
    ],
    scenarios: [
      'Payment charged twice after a consumer restart',
      'One bad JSON blocks the whole checkout queue',
      'New analytics service needs last 7 days of OrderPlaced',
      'Consumer lag grows after a partition rebalance',
      'Order saved, OrderPlaced never published after a deploy',
    ],
  },
  revisionSummary: `
- **Semantics**: assume at-least-once; inbox + unique keys are your exactly-once.
- **RabbitMQ**: smart routing, ack/DLQ/retry; not a replay log; order is fragile.
- **Kafka**: partitioned log, per-key order, consumer groups, lag and rebalance.
- **Choice**: replay/throughput/many groups → Kafka; work queues/RPC/routing → RabbitMQ.
- **.NET**: MassTransit outbox/inbox, delayed redelivery, operate the fault queue.
  `,
  summary:
    'মেসেজিং ইন্টারভিউতে ব্রোকার নাম নয় — ডেলিভারি সেমান্টিক্স, আইডেমপোটেন্সি, DLQ এবং র‍্যাবিট বনাম কাফকার ট্রেড-অফ দিয়ে সিনিয়র প্রমাণ হয়।',
};
