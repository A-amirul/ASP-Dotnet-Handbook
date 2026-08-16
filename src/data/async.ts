export const asyncData = {
  id: 'async',
  title: 'Async, Await & Multithreading',
  description:
    'How the CLR actually schedules work: Tasks vs threads, SynchronizationContext, cancellation, locks, and the ASP.NET failures that look like "the API is slow" but are thread-pool starvation, races, or sync-over-async.',
  sections: [
    {
      topic: 'async/await, Task, Task<T>, ValueTask, CPU-bound vs I/O-bound',
      difficulty: 'senior',
      english:
        'async/await is a compiler state machine, not a new thread. For I/O, the method yields at await, the thread returns to the pool, and a continuation runs when the I/O completes — that is how ASP.NET handles thousands of concurrent requests with hundreds of threads. Task is a promise of completion; Task<T> is a promise of a value. ValueTask/ValueTask<T> exist to avoid allocating a Task when the result is often already available (cache hit, completed I/O), but you must not await a ValueTask twice or block on it. CPU-bound work does not get faster because you typed async; it still occupies a thread. Queue CPU work with Task.Run only from a UI or when you must keep a request thread free — in ASP.NET Core, Task.Run for CPU just steals another pool thread and can worsen starvation. Trade-off: async everywhere for I/O is correct; wrapping CPU in Task.Run inside an API is usually a lie. Failure: .Result/.Wait() on a Task (sync-over-async) or assuming async means parallel.',
      bangla:
        'async/await নতুন থ্রেড নয় — I/O তে থ্রেড পুলে ফেরে, কমপ্লিশনে কন্টিনিউয়েশন চলে। CPU কাজ async লিখলেই দ্রুত হয় না। ValueTask দুবার await করা যাবে না।',
      details: `
### CPU-bound vs I/O-bound

| Kind | What waits | Thread during wait | Typical API |
| :--- | :--- | :--- | :--- |
| I/O-bound | Disk, SQL, HTTP, sockets | None (callback) | \`await sql.ExecuteAsync(ct)\` |
| CPU-bound | Your code | Occupied | hashing, image resize, tight loops |
| Fake async | Sync API wrapped in \`Task.Run\` | Pool thread still busy | \`Task.Run(() => File.ReadAllText)\` |

### Task vs ValueTask
- \`Task\` is a reference type; a completed hot path can still allocate.
- \`ValueTask\` may wrap a \`T\` inline or a \`Task\` / \`IValueTaskSource\`.
- Rules: await once, never \`.GetAwaiter().GetResult()\` in a loop, do not store it to await later unless you own the protocol.
- Prefer \`Task\` in public APIs unless profiling shows allocation on a completed path.

### What the compiler generates
- An async method becomes a state machine struct implementing \`IAsyncStateMachine\`.
- \`await\` stores state, returns an incomplete \`Task\`, and registers a continuation.
- Exceptions are stored on the Task and rethrown at the awaiter (AggregateException flattened for await).
      `,
      code: `public sealed class PricingService(IQuoteClient quotes, IMemoryCache cache)
{
    public async ValueTask<decimal> GetCachedRateAsync(string sku, CancellationToken ct)
    {
        if (cache.TryGetValue(sku, out decimal rate))
            return rate;

        rate = await quotes.GetRateAsync(sku, ct);
        cache.Set(sku, rate, TimeSpan.FromSeconds(30));
        return rate;
    }

    public async Task<IReadOnlyList<Quote>> LoadQuotesAsync(
        IReadOnlyList<string> skus,
        CancellationToken ct)
    {
        var tasks = skus.Select(sku => quotes.GetRateAsync(sku, ct));
        var rates = await Task.WhenAll(tasks);
        return skus.Zip(rates, (sku, rate) => new Quote(sku, rate)).ToList();
    }
}`,
      commonMistakes: [
        'Using async void outside an event handler — exceptions crash the process or vanish.',
        'Task.Run around EF/SQL inside a controller "to make it async".',
        'Awaiting a ValueTask twice after a cache helper returned a pooled instance.',
      ],
      bestPractices: [
        'Async all the way for I/O; pass CancellationToken through the chain.',
        'Keep public surface as Task/Task<T> unless you measured ValueTask.',
        'Never block on async code with .Result, .Wait(), or GetAwaiter().GetResult() in ASP.NET.',
      ],
      interviewQs: [
        {
          q: 'Does await start a new thread?',
          a: 'No. await does not create a thread. If the awaited Task is already completed, the method continues synchronously on the same thread. If it is incomplete, the state machine registers a continuation and the current thread is released. When the I/O completes, a thread-pool thread (or a captured SynchronizationContext) runs the continuation. Threads are involved in executing your code before and after awaits, not as a 1:1 mapping to each async method. This is why 10,000 concurrent awaits of HTTP calls do not mean 10,000 threads. Interviewers fail candidates who say "async means background thread".',
          bangla: 'await থ্রেড তৈরি করে না। I/O অসম্পূর্ণ থাকলে থ্রেড ছেড়ে দেয়, কমপ্লিশনে পুল থ্রেড কন্টিনিউয়েশন চালায়। async = ব্যাকগ্রাউন্ড থ্রেড নয়।',
          followUp: 'Then how can 200 threads serve 10k concurrent requests?',
          difficulty: 'senior',
        },
        {
          q: 'When do you use Task.Run in ASP.NET Core?',
          a: 'Almost never for I/O — the I/O APIs are already async. Task.Run is for CPU-bound work you deliberately want on the pool, typically from a UI app so the UI thread stays free. In Kestrel, the request is already on a pool thread; Task.Run moves the same CPU to another pool thread and the request thread still waits on await, so you used two threads for one job. Rare exceptions: you must call a blocking third-party SDK and you isolate it with a dedicated scheduler or a bounded queue, not unbounded Task.Run. If the CPU work is heavy, a background worker or a queue is the production design, not the request pipeline.',
          bangla: 'ASP.NET-এ I/O তে Task.Run নয় — রিকোয়েস্ট ইতিমধ্যে পুল থ্রেডে। ভারী CPU হলে কিউ/ওয়ার্কার, আনবাউন্ডেড Task.Run নয়।',
          followUp: 'How does this differ from a WinForms/WPF app?',
          difficulty: 'senior',
        },
        {
          q: 'Task vs ValueTask — when is ValueTask the wrong default?',
          a: 'ValueTask is an optimization for hot paths that often complete synchronously. It is the wrong default for public APIs because callers can misuse it: await twice, run it in parallel with Task.WhenAll without AsTask, or block on it. Each misuse can consume a pooled IValueTaskSource twice and corrupt state. Task is idempotent to await and easy to store. Use ValueTask inside a library after a profiler shows Task allocations on a completed cache path, and document "await once". For EF and HttpClient, Task is already the contract; wrapping them in ValueTask gains nothing.',
          bangla: 'ValueTask হট সিঙ্ক কমপ্লিশনের অপটিমাইজেশন — দুবার await/স্টোর করা যায় না। পাবলিক API-তে Task ডিফল্ট রাখুন, প্রোফাইল ছাড়া ValueTask নয়।',
          followUp: 'Why does IValueTaskSource make double-await dangerous?',
          difficulty: 'expert',
        },
        {
          q: 'CPU-bound vs I/O-bound — how do you classify a method that hashes a file?',
          a: 'Reading the file is I/O-bound; hashing bytes is CPU-bound. A correct implementation awaits ReadAsync into a buffer, then hashes on the same continuation thread (CPU). Making the hash method async without any await is a compiler warning and still CPU. Streaming with a pipeline (PipeReader) keeps memory bounded. Parallel hashing of independent chunks can use Parallel.ForEach or dedicated worker threads because that is CPU. Do not Task.WhenAll a thousand tiny CPU hashes on the ASP.NET pool during a request — you will starve I/O completions.',
          bangla: 'ফাইল পড়া I/O, হ্যাশ CPU। ReadAsync await করুন, হ্যাশ সিঙ্ক। রিকোয়েস্টে হাজার CPU টাস্ক WhenAll করবেন না — পুল স্টার্ভ হবে।',
          followUp: 'Would Parallel.ForEach or Task.WhenAll hash chunks better? Why?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Convert a controller that uses .Result on HttpClient to await with a CancellationToken. Then explain why Task.Run around the HTTP call would not help.',
    },
    {
      topic: 'SynchronizationContext, ConfigureAwait, and ThreadPool starvation',
      difficulty: 'expert',
      english:
        'SynchronizationContext is a hook that says "run this continuation here". Classic ASP.NET, WinForms, and WPF install one; ASP.NET Core does not — continuations go to the thread pool. ConfigureAwait(false) means "do not marshal back to the captured context"; in a library it avoids deadlocks when a caller later blocks, and it avoids extra hops. In ASP.NET Core UI-less code it is often a no-op for deadlock, but it is still the correct default in reusable libraries. Thread-pool starvation happens when all worker threads are blocked (sync-over-async, lock waits, sync IO) so I/O completions and new requests cannot run; the app looks dead while CPU is low. Trade-off: injecting more min threads hides the bug until the next load spike. Failure: a "slow under load" API that is actually every request blocking on .Result while holding a pool thread, plus a continuation that needs a pool thread to finish — deadlock or near-deadlock. Parallel.ForEach of blocking work is a starvation amplifier.',
      bangla:
        'ASP.NET Core-এ SynchronizationContext নেই, তাই ConfigureAwait(false) ডেডলক কম করে কিন্তু লাইব্রেরিতে এখনও সঠিক। পুল থ্রেড ব্লক হলে স্টার্ভেশন — CPU কম, অ্যাপ মৃত দেখায়।',
      details: `
### ConfigureAwait

| Environment | Captured context? | \`ConfigureAwait(false)\` effect |
| :--- | :--- | :--- |
| ASP.NET Core | No \`SynchronizationContext\` | Mostly avoids extra context hop; still good in libraries |
| WinForms / WPF | Yes (UI thread) | Required in libraries so you do not resume on UI |
| Legacy ASP.NET | Yes (request context) | Avoids deadlock with \`.Result\` |

### Starvation pattern
1. Request threads call a sync-over-async API (\`.Result\`).
2. Those threads wait.
3. Completions need a free worker to run continuations.
4. No workers left → timeouts, 502s, "hangs" with low CPU.

### ThreadPool vs dedicated threads
- Worker threads: \`Task\`, \`ThreadPool.QueueUserWorkItem\`.
- I/O completion threads: overlapped I/O callbacks.
- Blocking I/O on worker threads is the original sin.
      `,
      code: `public static class HttpJson
{
    public static async Task<T> GetAsync<T>(
        HttpClient client,
        string path,
        CancellationToken ct)
    {
        using var response = await client
            .GetAsync(path, HttpCompletionOption.ResponseHeadersRead, ct)
            .ConfigureAwait(false);

        response.EnsureSuccessStatusCode();
        return (await response.Content
            .ReadFromJsonAsync<T>(cancellationToken: ct)
            .ConfigureAwait(false))!;
    }
}

public sealed class LegacySdkAdapter(LegacyClient sdk)
{
    public Task<string> FetchAsync(CancellationToken ct) =>
        Task.Run(() => sdk.FetchBlocking(), ct);
}`,
      commonMistakes: [
        'Calling .Result in middleware "just this once" and shipping a hang under load.',
        'ConfigureAwait(false) then touching HttpContext on a random pool thread in a library used by mixed hosts.',
        'Raising ThreadPool.SetMinThreads as the only fix for starvation.',
      ],
      bestPractices: [
        'Libraries: ConfigureAwait(false) unless you must resume on a context.',
        'Applications (ASP.NET Core): await directly; never block.',
        'Treat low CPU + high request queue as starvation until proven otherwise.',
      ],
      interviewQs: [
        {
          q: 'Why did ConfigureAwait(false) matter so much in old ASP.NET and still matter in libraries?',
          a: 'Legacy ASP.NET captured a request SynchronizationContext. If you blocked the request thread with .Result, the continuation needed that same context to finish, but the thread holding the context was the one waiting — deadlock. ConfigureAwait(false) skipped capturing, so the continuation could run on a pool thread and complete the Task the blocker was waiting on. ASP.NET Core has no request SynchronizationContext, so that exact deadlock is gone. Libraries still use ConfigureAwait(false) because they cannot know whether they run under a UI context or a custom context, and because it avoids posting back unnecessarily. App code in ASP.NET Core that uses HttpContext after an await is already on a pool thread; that is fine. App code in WPF that updates UI after await without the context is not.',
          bangla: 'পুরনো ASP.NET-এ .Result + কনটেক্সট ক্যাপচার = ডেডলক। Core-এ সেই কনটেক্সট নেই। লাইব্রেরি এখনও ConfigureAwait(false) দেয় কারণ হোস্ট অজানা।',
          followUp: 'Can you still deadlock in ASP.NET Core? How?',
          difficulty: 'expert',
        },
        {
          q: 'What is thread-pool starvation and how do you recognize it in production?',
          a: 'The pool has a limited number of worker threads. If they are all blocked in Wait/Result/lock/sync IO, queued work including Task continuations and incoming Kestrel work cannot run. Symptoms: request duration explodes, thread count slowly grows (injection), CPU stays low, SQL and HTTP dependencies look idle, dumps show many threads in WaitHandle.Wait. Tools: dump analysis, ThreadPool metrics (available worker threads), EventCounters, dotnet-counters. The fix is remove blocking, not only raise min threads. Min threads is a band-aid that increases context switching and still fails if blocking scales with traffic.',
          bangla: 'সব ওয়ার্কার থ্রেড ব্লক থাকলে কন্টিনিউয়েশন চলে না — CPU কম, রিকোয়েস্ট হ্যাং। ফিক্স ব্লক সরানো, শুধু min threads বাড়ানো নয়।',
          followUp: 'Which counters would you graph during an incident?',
          difficulty: 'expert',
        },
        {
          q: 'Why is sync-over-async considered a production incident waiting to happen?',
          a: 'It holds a thread for the entire duration of an I/O operation, destroying the scalability model async was adopted for. Under a few users it works. At hundreds of concurrent requests you run out of workers, then timeouts cascade into retries which add more blocked threads. It also reintroduces deadlock risk when a context exists, and it wraps exceptions as AggregateException if you use Wait(). The code looks simple (.Result) which is why it survives code review. Seniors ban it in request and middleware paths and isolate true blocking SDKs behind a bounded queue.',
          bangla: 'Sync-over-async I/O সময় থ্রেড ধরে রাখে — কম ট্রাফিকে চলে, লোডে পুল শেষ। রিকোয়েস্ট পাথে নিষিদ্ধ, ব্লকিং SDK-কে বাউন্ডেড কিউতে রাখুন।',
          followUp: 'How would you wrap a blocking SDK without starving the pool?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Reproduce starvation locally: 200 concurrent requests each calling Task.Delay(1000).Result. Then replace with await and compare thread count.',
    },
    {
      topic: 'CancellationToken, Task.WhenAll, Task.WhenAny, Parallel.ForEach vs Task.WhenAll',
      difficulty: 'senior',
      english:
        'CancellationToken is a cooperative signal, not a thread abort. You pass the same token to HttpClient, EF, and your loops; they observe it and throw OperationCanceledException. Timeouts should be CancellationTokenSource.CancelAfter linked to the request token, not a second unofficial timer. Task.WhenAll runs many tasks concurrently and fails when the first exception is observed after all complete (exceptions are wrapped; in .NET you still need to handle all). Task.WhenAny returns when the first task finishes — useful for timeouts or racing caches. Parallel.ForEach is for CPU-bound data parallelism: it partitions a collection onto worker threads and blocks the caller until done. Task.WhenAll is for concurrent asynchronous I/O: it does not occupy a thread per task while they wait. Mixing them is the interview discriminator. Trade-off: unbounded WhenAll on 10k HTTP calls can socket-starve; use a SemaphoreSlim. Failure: ignoring cancellation so a disconnected client still runs a 30s report query.',
      bangla:
        'CancellationToken কোঅপারেটিভ — থ্রেড কিল নয়। WhenAll I/O কনকারেন্সি, Parallel.ForEach CPU পার্টিশন। ১০ হাজার WhenAll আনবাউন্ডেড করবেন না, SemaphoreSlim দিয়ে লিমিট করুন।',
      details: `
### Parallel.ForEach vs Task.WhenAll

| | \`Parallel.ForEach\` / PLINQ | \`Task.WhenAll\` |
| :--- | :--- | :--- |
| Best for | CPU over in-memory data | Concurrent I/O (HTTP, SQL, files) |
| Threads during wait | Workers busy in the loop body | Workers free if body awaits I/O |
| Caller | Blocks until complete | Returns a Task; await it |
| ASP.NET request | Dangerous for heavy CPU | Correct for fan-out I/O with a limit |
| Cancellation | \`ParallelOptions.CancellationToken\` | Pass \`ct\` into each operation |

### Cancellation
- Request aborted → ASP.NET signals \`HttpContext.RequestAborted\`.
- Link tokens: \`CancellationTokenSource.CreateLinkedTokenSource(requestCt, timeoutCt)\`.
- After cancel, do not catch \`OperationCanceledException\` and return 200 with partial data unless that is the contract.
      `,
      code: `public sealed class RatesFanOut(IQuoteClient client)
{
    public async Task<IReadOnlyList<Quote>> FetchAllAsync(
        IReadOnlyList<string> skus,
        CancellationToken ct)
    {
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(3));
        using var linked = CancellationTokenSource.CreateLinkedTokenSource(ct, timeout.Token);
        using var gate = new SemaphoreSlim(8);

        async Task<Quote> OneAsync(string sku)
        {
            await gate.WaitAsync(linked.Token);
            try
            {
                var rate = await client.GetRateAsync(sku, linked.Token);
                return new Quote(sku, rate);
            }
            finally
            {
                gate.Release();
            }
        }

        return await Task.WhenAll(skus.Select(OneAsync));
    }

    public int HashAllCpu(IReadOnlyList<byte[]> chunks, CancellationToken ct)
    {
        var total = 0;
        var options = new ParallelOptions { CancellationToken = ct, MaxDegreeOfParallelism = Environment.ProcessorCount };
        Parallel.ForEach(chunks, options, chunk =>
        {
            Interlocked.Add(ref total, chunk.Sum(b => b));
        });
        return total;
    }
}`,
      commonMistakes: [
        'Task.WhenAll without a concurrency limit, exhausting sockets or the DB pool.',
        'Using Parallel.ForEach(async ...) which does not await the async lambdas.',
        'Catching Exception and swallowing OperationCanceledException on shutdown.',
      ],
      bestPractices: [
        'Link request abort + timeout tokens at the application boundary.',
        'WhenAll for I/O with SemaphoreSlim; Parallel.ForEach for CPU with MaxDegreeOfParallelism.',
        'Never Parallel.ForEach with an async delegate — it fires and forgets.',
      ],
      interviewQs: [
        {
          q: 'Parallel.ForEach vs Task.WhenAll — how do you choose?',
          a: 'If the body is CPU on data you already have, Parallel.ForEach (or Parallel.For, PLINQ) partitions work onto worker threads and the call blocks until complete. If the body is awaitable I/O, Task.WhenAll (with a concurrency gate) starts many operations that release threads while waiting. Parallel.ForEach(async ...) is a famous bug: the async lambda returns Task that Parallel does not await, so the loop finishes immediately and work races after the method returns. In an ASP.NET request, heavy Parallel.ForEach competes with Kestrel for the same pool. Fan-out HTTP belongs to WhenAll; image thumbnail CPU might belong to a background worker using Parallel.ForEach.',
          bangla: 'CPU + ইন-মেমোরি = Parallel.ForEach। অ্যাসিঙ্ক I/O = Task.WhenAll + লিমিট। Parallel.ForEach(async) অ্যাওয়েট করে না — ক্লাসিক বাগ।',
          followUp: 'What happens to exceptions in each model?',
          difficulty: 'senior',
        },
        {
          q: 'How does CancellationToken actually stop work?',
          a: 'It does not preempt. The token has a boolean flag and a list of callbacks. APIs poll IsCancellationRequested or register a callback to abort a socket. If your code never observes the token, cancel does nothing until the next checkpoint. EF and HttpClient observe it at I/O boundaries. Thread.Abort is gone; cooperative cancel is the model. For WhenAll, passing the same token to every child lets one abort cancel the rest if you also cancel the CTS when the request ends. Always pass ct to Task.Delay, or delays become shutdown leaks.',
          bangla: 'টোকেন থ্রেড মারে না — API-কে সিগন্যাল দেয়। অবজারভ না করলে ক্যান্সেল অকেজো। Delay/EF/HttpClient-এ ct পাস করুন।',
          followUp: 'How do you unit-test that a service honors cancellation?',
          difficulty: 'mid',
        },
        {
          q: 'Task.WhenAll vs WhenAny for calling three APIs?',
          a: 'WhenAll if you need all three results (or all three side effects) before continuing; the Task completes when every child completes, and you should inspect all exceptions (await WhenAll throws the first, others are observed on the tasks). WhenAny if you can proceed with the fastest success — cache vs origin race — and then you must cancel the losers or they keep running and mutating state. A timeout is often WhenAny(work, Task.Delay(timeout, ct)) plus cancel of the work CTS. Do not use WhenAny as a substitute for WhenAll and then ignore the other tasks; that is a fire-and-forget leak.',
          bangla: 'তিনটা ফলাফলই লাগলে WhenAll। যে আগে ফিরে আসে সেটা নিলে WhenAny, হারানো টাস্ক ক্যান্সেল করুন — নাহলে ফায়ার-অ্যান্ড-ফরগেট লিক।',
          followUp: 'How do you surface all failures from WhenAll to ProblemDetails?',
          difficulty: 'senior',
        },
        {
          q: 'Why is unbounded WhenAll on external APIs a production outage?',
          a: 'Each task holds a connection, a timeout, and memory for buffers. Ten thousand outbound HTTP calls from one request (or from a burst of requests) exhaust the HttpClient/socket pool and the remote rate limit, then retries amplify. The local thread pool may still look healthy because awaits released workers, but you have created a distributed denial of service against yourself. Bound concurrency, use bulk endpoints, and apply a circuit breaker. Seniors treat fan-out size as a first-class SLO input, not an implementation detail.',
          bangla: 'আনবাউন্ডেড WhenAll সকেট ও রিমোট রেট-লিমিট শেষ করে। কনকারেন্সি বাউন্ড, বাল্ক API, সার্কিট ব্রেকার — ফ্যান-আউট সাইজ SLO-এর অংশ।',
          followUp: 'What SemaphoreSlim initial count would you pick and why?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Write a fan-out that fetches 100 URLs with WhenAll, limited to 8 at a time, canceled when the HTTP request aborts. Show why Parallel.ForEach cannot replace it.',
    },
    {
      topic: 'Locks: lock, Monitor, SemaphoreSlim, Mutex, ReaderWriterLockSlim, concurrent collections',
      difficulty: 'senior',
      english:
        'lock is Monitor.Enter/Exit on a dedicated object; it is reentrant for the same thread and is the default in-process exclusive lock. Never lock(this), lock(typeof(T)), or lock a string — those objects are public and invite deadlock with foreign code. SemaphoreSlim is a lightweight gate that supports async WaitAsync, which lock does not; use it to limit concurrency across awaits. Mutex is OS-wide (cross-process) and expensive; use it for single-instance apps, not per-request. ReaderWriterLockSlim helps when reads vastly outnumber writes, but it is easy to upgrade-lock deadlock; most teams are safer with a single lock or immutable snapshots. ConcurrentDictionary and channels remove many locks but do not make compound operations atomic — GetOrAdd’s value factory can run twice. Trade-off: more lock granularity increases parallelism and deadlock surface. Failure: holding a lock while awaiting I/O, which you cannot do with lock and must not do with a sync Monitor across an async gap.',
      bangla:
        'lock ইন-প্রসেস এক্সক্লুসিভ; await-এর সাথে SemaphoreSlim.WaitAsync। lock(this)/string নিষিদ্ধ। ConcurrentDictionary কম্পাউন্ড অপারেশন অ্যাটমিক করে না।',
      details: `
### Primitive cheat sheet

| Primitive | Scope | Async wait | Typical use |
| :--- | :--- | :--- | :--- |
| \`lock\` / \`Monitor\` | Process, one thread | No | Short CPU critical sections |
| \`SemaphoreSlim\` | Process | \`WaitAsync\` | Throttle async I/O |
| \`Mutex\` | Machine (named) | No | Single instance of a service |
| \`ReaderWriterLockSlim\` | Process | No | Rare; many reads, rare writes |
| \`ConcurrentDictionary\` | Process | n/a | Fine-grained map, not a transaction |
| \`Channel<T>\` | Process | Yes | Producer/consumer pipelines |

### Rules
- Keep critical sections tiny: mutate memory, then release, then I/O.
- Document lock order if you have more than one.
- Prefer immutable snapshots published with \`Volatile.Write\` / \`Interlocked.Exchange\` for config.
      `,
      code: `public sealed class LicenseCache
{
    private readonly SemaphoreSlim _gate = new(1, 1);
    private readonly Dictionary<string, License> _map = new();

    public async Task<License> GetOrLoadAsync(string id, Func<CancellationToken, Task<License>> load, CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            if (_map.TryGetValue(id, out var hit))
                return hit;
        }
        finally
        {
            _gate.Release();
        }

        var fresh = await load(ct);

        await _gate.WaitAsync(ct);
        try
        {
            _map[id] = fresh;
            return fresh;
        }
        finally
        {
            _gate.Release();
        }
    }
}`,
      commonMistakes: [
        'lock around await — does not compile, so people use Monitor across the gap or block with Wait().',
        'Using Mutex inside a web request for ordinary mutual exclusion.',
        'Assuming ConcurrentDictionary.GetOrAdd factory runs only once.',
      ],
      bestPractices: [
        'Private readonly object or SemaphoreSlim fields; never lock on incoming parameters.',
        'Async code: SemaphoreSlim, not lock, when the critical section must span an await.',
        'Prefer concurrent collections or immutability over RW locks unless you measured contention.',
      ],
      interviewQs: [
        {
          q: 'Why can’t you await inside a lock, and what do you use instead?',
          a: 'lock is tied to a thread identity (Monitor is reentrant per thread). After await you may continue on another thread, so the runtime forbids await inside lock. If you block with .Result inside lock you hold the lock for the entire I/O, killing throughput and risking deadlock if the continuation needs the same lock. SemaphoreSlim.WaitAsync is the replacement when you must exclude across an await, but you should still minimize that window: load data outside, then take the lock to publish. For a simple increment, Interlocked is enough and needs no lock.',
          bangla: 'lock থ্রেড-আইডেন্টিটি — await অন্য থ্রেডে ফিরতে পারে। অ্যাসিঙ্ক গেটে SemaphoreSlim.WaitAsync, আর ক্রিটিক্যাল সেকশন ছোট রাখুন।',
          followUp: 'Is SemaphoreSlim reentrant? What happens if the same request waits twice?',
          difficulty: 'senior',
        },
        {
          q: 'Mutex vs lock vs SemaphoreSlim in a web farm?',
          a: 'lock and SemaphoreSlim are per process. Two IIS/Kestrel instances do not share them; they will both enter the "critical section". Named Mutex is machine-wide, still not farm-wide, and it blocks threads. For a web farm you need a distributed lock (SQL sp_getapplock, Redis SET NX, or a queue with a single consumer) and a timeout. Using a named Mutex on a web server is a red flag in interviews: it serializes requests on one box and does nothing for the second box. Explain the scope first, then pick the primitive.',
          bangla: 'lock/SemaphoreSlim এক প্রসেস। ওয়েব ফার্মে ডিস্ট্রিবিউটেড লক বা সিঙ্গেল কনজিউমার কিউ লাগে — named Mutex ফার্ম সমাধান নয়।',
          followUp: 'How would you design an idempotent "send invoice once" without a lock?',
          difficulty: 'expert',
        },
        {
          q: 'When is ReaderWriterLockSlim the wrong tool?',
          a: 'When write frequency is not tiny, when you might upgrade a read lock to a write lock (classic deadlock), or when the protected data can be replaced atomically with an immutable copy. RW locks have more states and more bugs than lock. ConcurrentDictionary already uses fine-grained locking internally. Most ASP.NET caches are better as IMemoryCache or an immutable dictionary swapped with Interlocked.Exchange. I would only introduce RW lock with a contention profile in hand.',
          bangla: 'রাইট ঘন হলে বা আপগ্রেড লক লাগলে RW lock ভুল। বেশিরভাগ ক্যাশে immutable swap বা IMemoryCache যথেষ্ট।',
          followUp: 'Describe the upgradeable-read deadlock.',
          difficulty: 'expert',
        },
      ],
      practice:
        'Replace a lock around HttpClient.Send with a double-checked cache: load outside, SemaphoreSlim only to update the dictionary.',
    },
    {
      topic: 'Race, deadlock, starvation, and thread safety',
      difficulty: 'senior',
      english:
        'A race is unsynchronized access where outcome depends on timing — lost updates, torn reads, duplicate inserts. A deadlock is a cycle of waits (locks, or async continuations waiting on threads that wait on those continuations). Starvation is a thread or request that never obtains a resource because others keep winning (writer starved by readers, or pool starved by blockers). Thread safety is not "I used lock somewhere"; it is a defined invariant plus the primitives that preserve it. Static mutable fields in ASP.NET are shared across all requests — that is the default race. Trade-off: coarse locks reduce races and create deadlocks/contention; lock-free code is easy to get wrong. Failure: checking-then-inserting a unique email without a unique index, then catching the race in the app inconsistently. Seniors make the database or queue the source of truth for uniqueness, and use locks only for in-memory structures.',
      bangla:
        'রেস = টাইমিং-নির্ভর ভুল; ডেডলক = অপেক্ষার চক্র; স্টার্ভেশন = কখনো রিসোর্স না পাওয়া। স্ট্যাটিক মিউটেবল ফিল্ড ওয়েব অ্যাপে শেয়ারড — ডিফল্ট রেস। ইউনিকনেস ডাটাবেজে ধরুন।',
      details: `
### Four words interviewers mix up

| Term | Meaning | Typical .NET example |
| :--- | :--- | :--- |
| Race | Concurrent mutation without a happens-before | \`if (!_map.ContainsKey) _map.Add\` |
| Deadlock | Wait cycle | lock A then B vs lock B then A; sync-over-async |
| Livelock | Threads keep yielding, no progress | retry loops that collide forever |
| Starvation | Progress for some, never for one | pool threads all blocked; writer never gets RW lock |

### Making state thread-safe
- Immutable objects + publish a new reference.
- Confine mutation to one actor (Channel consumer).
- Database constraints for cross-request invariants.
- \`Interlocked\` for counters; not for multi-field invariants.
      `,
      code: `public sealed class UnsafeCounter
{
    public int Value;
    public void Inc() => Value++;
}

public sealed class SafeCounter
{
    private int _value;
    public int Inc() => Interlocked.Increment(ref _value);
    public int Snapshot => Volatile.Read(ref _value);
}

public sealed class TransferService
{
    private readonly object _a = new();
    private readonly object _b = new();

    public void DeadlockProne(Account left, Account right)
    {
        lock (_a) lock (_b) { /* transfer */ }
    }

    public void OrderedLocks(Account left, Account right)
    {
        var first = left.Id.CompareTo(right.Id) < 0 ? left : right;
        var second = ReferenceEquals(first, left) ? right : left;
        lock (first) lock (second) { /* transfer */ }
    }
}`,
      commonMistakes: [
        'Calling a collection "thread-safe" because it is ConcurrentDictionary while doing check-then-act across two keys.',
        'Catching deadlock in SQL and retrying forever without a backoff or incident metric.',
        'Using Thread.Sleep to "fix" a race in tests.',
      ],
      bestPractices: [
        'Define the invariant in a comment: which fields are protected by which lock.',
        'Prefer uniqueness constraints and idempotency keys over in-memory locks for business rules.',
        'Lock ordering by a stable key when multiple locks are unavoidable.',
      ],
      interviewQs: [
        {
          q: 'Is ConcurrentDictionary enough to make a cache thread-safe?',
          a: 'It makes individual add/get/remove atomic, not your business transaction. GetOrAdd may invoke the factory more than once; two threads can both call an expensive load. Compound operations (get, mutate a field on the value, put back) race on the mutable value object even if the dictionary is concurrent. If the value is a mutable List, you still need synchronization on that list. A thread-safe cache is usually: ConcurrentDictionary of immutable snapshots, or GetOrAdd with Lazy<Task<T>> so the factory runs once per key, plus expiration policy. Interviewers want that nuance, not "yes, ConcurrentDictionary is thread-safe".',
          bangla: 'ডিকশনারি অপারেশন অ্যাটমিক, বিজনেস ট্রানজ্যাকশন নয়। GetOrAdd ফ্যাক্টরি দুবার চলতে পারে; মিউটেবল ভ্যালু আলাদা সিঙ্ক চায়।',
          followUp: 'How does Lazy<Task<T>> prevent duplicate loads?',
          difficulty: 'senior',
        },
        {
          q: 'How do you debug a deadlock in a .NET dump?',
          a: 'Grab a dump when hung. In WinDbg/dotnet-dump, look at thread stacks for Monitor.Enter, Wait, Task.Wait, and SQL waits. For managed deadlocks, SOS !syncblk / lock inspection shows who owns what. For async deadlocks, stacks may show Wait on a Task whose continuation is queued. For SQL deadlocks, the dump may be a red herring — check SQL deadlock graph XEvents. Reproduce with two parallel requests if it is lock-order. Fix by lock ordering, reducing lock scope, or removing sync-over-async. Adding timeouts converts deadlock into an exception you can metric.',
          bangla: 'হ্যাং ডাম্পে Monitor/Wait স্ট্যাক দেখুন। অ্যাসিঙ্ক ডেডলকে Task.Wait + কন্টিনিউয়েশন কিউ। SQL হলে deadlock graph আলাদা।',
          followUp: 'How is a SQL deadlock different from a CLR lock deadlock?',
          difficulty: 'expert',
        },
        {
          q: 'What does "thread-safe" mean for a class you design?',
          a: 'It means documented guarantees: which methods may be called concurrently, whether instances are shared, and what memory model the caller can rely on. A class can be thread-safe for concurrent reads but not writes, or safe only if each instance is confined to one request (typical scoped service). DbContext is not thread-safe; sharing it is a bug. Immutable messages are trivially thread-safe. I state the guarantee in XML docs and enforce it with types (don’t expose a mutable List). "We used lock" is not a guarantee if the lock does not cover all fields in the invariant.',
          bangla: 'থ্রেড-সেফ = ডকুমেন্টেড গ্যারান্টি কোন মেথড একসাথে চলতে পারে। DbContext সেফ নয়। লক থাকলেই ইনভেরিয়েন্ট রক্ষা হয় না।',
          followUp: 'Is a scoped service automatically thread-safe? Why not?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Write a failing unit test that loses updates on a static Dictionary, then fix it with ConcurrentDictionary of immutable records and a unique SQL index for the durable invariant.',
    },
    {
      topic: 'Real ASP.NET scenarios: concurrency, same-record updates, background jobs, fan-out APIs',
      difficulty: 'expert',
      english:
        'Production interviews are scenarios. API slow only under concurrency: usually pool starvation, lock contention, or connection-pool exhaustion — not "LINQ is slow". Two requests update the same row: last write wins unless you use a rowversion/ETag or serializable/optimistic concurrency; the database must enforce it. Background jobs on hosted services that use Task.Run unbounded or Parallel.ForEach of sync IO eat thread-pool threads that Kestrel needs. Concurrent external API calls need WhenAll plus a gate, retries with jitter, and idempotency keys. Trade-off: optimistic concurrency fails more under hot rows and needs retry UX; pessimistic locking serializes and deadlocks. Failure: a Hangfire job sharing a scoped DbContext across parallel tasks, or a singleton cache mutated without barriers. Seniors design the request path to be mostly wait-free I/O and push contention into SQL or a queue.',
      bangla:
        'কনকারেন্সিতে স্লো = স্টার্ভেশন/কানেকশন পুল/লক। একই রো আপডেটে rowversion ছাড়া last-write-wins। ব্যাকগ্রাউন্ড জব যেন কেস্ট্রেলের থ্রেড না খায়।',
      details: `
### Scenario playbook

| Symptom | First hypothesis | What you measure |
| :--- | :--- | :--- |
| Slow only at 200 RPS, fine at 5 | ThreadPool starvation or DbPool timeout | threads, queue length, SQL wait |
| Lost updates on same order | No concurrency token | two PUT dumps, rowversion |
| Random ObjectDisposedException | DbContext used in parallel / after request | stack, DI lifetime |
| Job host 100% threads, API 502 | Jobs on the same pool doing blocking work | dedicated worker process |
| Downstream 429 / timeouts | Unbounded WhenAll | outbound concurrency, retries |

### Same-record updates
- Optimistic: \`WHERE Id=@id AND RowVersion=@rv\` then 0 rows → 409 Conflict.
- Pessimistic: \`UPDLOCK, ROWLOCK\` in a short transaction — easy to deadlock.
- Do not "lock in C#" across HTTP requests; the process will recycle.
      `,
      code: `public sealed class OrderUpdater(AppDbContext db)
{
    public async Task<bool> RenameAsync(int id, string name, byte[] rowVersion, CancellationToken ct)
    {
        var order = await db.Orders.FirstOrDefaultAsync(o => o.Id == id, ct)
            ?? throw new KeyNotFoundException();

        db.Entry(order).Property(o => o.RowVersion).OriginalValue = rowVersion;
        order.Name = name;
        try
        {
            await db.SaveChangesAsync(ct);
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }
    }
}

public sealed class WarmupJob(IServiceScopeFactory scopes) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await using var scope = scopes.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Orders.AsNoTracking().Take(1).ToListAsync(stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}`,
      commonMistakes: [
        'Singleton IMemoryCache of mutable entities also tracked by a request DbContext.',
        'BackgroundService resolving a scoped DbContext from the root provider.',
        'Retrying the whole HTTP fan-out without idempotency keys after a partial success.',
      ],
      bestPractices: [
        'Optimistic concurrency tokens on hot rows; return 409 and a fresh ETag.',
        'Host heavy CPU/blocking jobs in a worker process, not inside the API.',
        'Create a DI scope per job iteration; never share DbContext across parallel tasks.',
      ],
      interviewQs: [
        {
          q: 'The API is fast for one user and dies at 200 concurrent users. What do you check?',
          a: 'I assume a scalability bug, not a single-query CPU bug. Check thread-pool starvation (blocked workers, sync-over-async), SQL connection pool timeouts (max pool 100, 200 requests each holding a connection), lock contention (a static lock around a dependency), and downstream latency amplified by retries. Look at p99 vs p50: if p50 is fine and p99 explodes, it is queueing. Dumps plus metrics beat adding a cache blindly. A LINQ rewrite only helps if SQL duration is the p99. I also check whether logging is synchronous to disk per request.',
          bangla: 'এক ইউজারে ভালো, ২০০-এ মৃত — স্টার্ভেশন, কানেকশন পুল, স্ট্যাটিক লক, রিট্রাই অ্যামপ্লিফিকেশন। p50 ভালো p99 খারাপ মানে কিউইং।',
          followUp: 'How would you distinguish pool starvation from SQL blocking?',
          difficulty: 'expert',
        },
        {
          q: 'Two tabs save the same customer record. How do you not lose data?',
          a: 'Last-write-wins is the default if you UPDATE by Id only. Add a RowVersion/xmin/ETag: the UPDATE includes the version the client read; zero rows updated means conflict; API returns 409 with the current document. The UI reloads or merges. Unique constraints catch duplicate emails. Do not take a C# lock across the HTTP round trip — another instance will not see it. Pessimistic SQL locks can work inside one short transaction for a money transfer, not for a user staring at a form. This is an invariant problem, not a thread-safety problem.',
          bangla: 'শুধু Id দিয়ে UPDATE last-write-wins। RowVersion/ETag দিয়ে ৪০৯ Conflict। HTTP রিকোয়েস্ট জুড়ে C# লক ফার্মে কাজ করে না।',
          followUp: 'Where do you store the ETag — header, body, or both?',
          difficulty: 'senior',
        },
        {
          q: 'Background jobs are eating threads and the API starts 502ing. Why, and how do you isolate?',
          a: 'IHostedService runs in the same process and shares the thread pool with Kestrel by default. If jobs use Parallel.ForEach, sync SQL, or unbounded Task.Run, they consume workers Kestrel needs for accepts and completions. Isolation: run jobs in a separate worker service/container with its own pool and DB pool limits; or constrain job parallelism (Channel with a single consumer, Hangfire worker count). Also create a scope per job so DbContext is not a captive singleton. Health checks should fail the job host independently of the API.',
          bangla: 'একই প্রসেসে জব ও কেস্ট্রেল পুল শেয়ার করে। ব্লকিং/আনবাউন্ডেড জব API-কে ৫০২ করে। আলাদা ওয়ার্কার প্রসেস ও পারালেলিজম লিমিট।',
          followUp: 'How do you cap Hangfire or BackgroundService concurrency?',
          difficulty: 'expert',
        },
        {
          q: 'How do you call 20 external APIs for one page without melting the pool or the vendor?',
          a: 'Task.WhenAll with SemaphoreSlim (start with 4–8), a shared HttpClient via IHttpClientFactory, per-attempt timeout tokens linked to the request, retries only on transient errors with jitter, and a circuit breaker. Cache what you can. Prefer a backend-for-frontend aggregate on the vendor side. Parallel.ForEach is the wrong tool because the work is I/O. Log outbound concurrency as a metric. If the page can render incrementally, WhenAny/streaming reduces tail latency, but cancellation of leftovers is mandatory.',
          bangla: 'WhenAll + SemaphoreSlim, IHttpClientFactory, লিংকড টাইমআউট, জিটার রিট্রাই। I/O তে Parallel.ForEach নয়। আউটবাউন্ড কনকারেন্সি মেট্রিক করুন।',
          followUp: 'What if 3 of 20 APIs fail — fail the page or return partial?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Implement optimistic concurrency on an Order PUT with rowversion. Then write a k6 script with 200 VUs and show connection-pool vs thread-pool metrics.',
    },
  ],
  quickRevision: {
    concepts: [
      'await does not create a thread; I/O yields the worker',
      'Task vs ValueTask (await ValueTask once)',
      'CPU-bound vs I/O-bound; Task.Run rarely belongs in ASP.NET',
      'ASP.NET Core has no request SynchronizationContext',
      'ConfigureAwait(false) is a library default',
      'Thread-pool starvation: blocked workers, low CPU, hangs',
      'Cancellation is cooperative; pass tokens through',
      'WhenAll = async I/O fan-out; Parallel.ForEach = CPU partition',
      'lock cannot span await; use SemaphoreSlim',
      'Optimistic concurrency for same-row HTTP updates',
    ],
    questions: [
      'Does await start a new thread?',
      'When is Task.Run correct in ASP.NET Core?',
      'Why is IQueryable-style thinking wrong for Parallel.ForEach vs WhenAll?',
      'How do you recognize thread-pool starvation?',
      'Why is .Result in a controller a production bug?',
      'How does CancellationToken stop work?',
      'Why can’t you await inside lock?',
      'Is ConcurrentDictionary enough for a cache?',
      'Two tabs save the same record — how do you not lose writes?',
      'Why do background jobs 502 the API?',
    ],
    mistakes: [
      'Parallel.ForEach(async ...) fire-and-forget',
      'Sync-over-async (.Result / .Wait) on the request path',
      'Unbounded Task.WhenAll to a vendor API',
      'Sharing DbContext across parallel tasks or job iterations',
      'lock(this) or holding a lock during I/O',
    ],
    scenarios: [
      'API fine at 5 users, dead at 200 concurrent',
      'Lost update on customer profile',
      'Hangfire job saturates threads, Kestrel 502s',
      'Fan-out to 20 APIs hits 429s',
      'Deadlock after adding .Result to "simplify" a test helper used in prod',
    ],
  },
  revisionSummary: `
- Async is a state machine for I/O. Threads are for CPU. Mixing them (Task.Run, Parallel.ForEach on I/O, .Result) is how ASP.NET dies under load.
- WhenAll + bounded concurrency for I/O; Parallel.ForEach for in-memory CPU; never Parallel.ForEach(async).
- Same-row updates need a database token, not a C# lock. Jobs need their own scope and preferably their own process.
  `,
  summary:
    'Senior async is knowing which resource you are holding — a thread, a lock, a connection, or a promise — and never holding a thread while you wait on I/O.',
};
