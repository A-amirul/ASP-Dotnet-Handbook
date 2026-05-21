export const csharpData = {
  id: 'csharp',
  title: 'Advanced C# Mastery',
  description: 'Deep dive into C# internals, memory management, and advanced features for senior roles.',
  sections: [
    {
      topic: "OOP & SOLID Principles",
      english: "SOLID principles ensure that your code is maintainable, scalable, and easy to test. Seniors must explain not just what they are, but how they avoid technical debt.",
      bangla: "সলিড প্রিন্সিপল হলো ক্লিন কোড লেখার মূল মন্ত্র। ইন্টারভিউতে প্রতিটা লেটারের মানে এবং প্রাকটিক্যাল উদাহরণসহ জানতে চাওয়া হয়। এটি কোডকে ফ্লেক্সিবল রাখে।",
      details: `
| Principle | Description | key Goal |
| :--- | :--- | :--- |
| **S**RP | Single Responsibility | A class should have only one reason to change. |
| **O**CP | Open/Closed | Classes should be open for extension, but closed for modification. |
| **L**SP | Liskov Substitution | Subtypes must be substitutable for their base types. |
| **I**SP | Interface Segregation | Clients should not be forced to depend on methods they do not use. |
| **D**IP | Dependency Inversion | Depend on abstractions, not concretions. |
      `,
      commonMistakes: [
        "Using concrete classes in constructors instead of interfaces.",
        "God classes: Creating massive classes that do everything.",
        "Ignoring LSP by throwing NotImplementedException in child classes."
      ],
      bestPractices: [
        "Keep classes small and focused (SRP).",
        "Use Dependency Injection to pass dependencies.",
        "Prefer Composition over Inheritance where possible."
      ],
      interviewQs: [
        {
          q: "Explain Dependency Inversion vs Dependency Injection.",
          a: "Dependency Inversion (DIP) is a design principle — high-level modules should depend on abstractions (interfaces), not on low-level concrete implementations. Dependency Injection is the mechanism for applying DIP — the concrete implementation is injected into the constructor by the DI container at runtime. DIP tells you what architectural rule to follow (depend on interfaces), DI is the practical tool that makes following it automatic.",
          bangla: "DIP বলে interface এ depend করো, DI সেই কাজটা runtime এ করে দেয় — DIP design rule, DI implementation tool। দুটো আলাদা জিনিস।"
        },
        {
          q: "How do you implement Open/Closed principle in a real project?",
          a: "By programming to interfaces and using polymorphism. A discount calculator that accepts an IDiscountStrategy parameter never needs modification when a new discount type is introduced — you add a new class implementing IDiscountStrategy. Common patterns for OCP: Strategy, Decorator, and Specification. The key insight is that you extend behavior by adding new code, not by modifying existing tested code, keeping regression risk low.",
          bangla: "Interface + Strategy pattern — নতুন type এ নতুন class, পুরনো tested code touch করতে হয় না। Regression risk কমে।"
        },
        {
          q: "What is Liskov Substitution and why is it important?",
          a: "LSP states that a subclass must be fully usable wherever the parent type is expected — no overriding to throw NotImplementedException, no weakening preconditions, no strengthening postconditions. Violating LSP means code written against the base type produces wrong or unexpected behavior when given a subtype. The classic violation is Square inheriting Rectangle — setting Width also sets Height, breaking the independent width/height contract that Rectangle users expect.",
          bangla: "Subclass সব জায়গায় parent replace করতে পারতে হবে — NotImplementedException throw করা LSP violation। Square-Rectangle classic example মনে রাখুন।"
        }
      ],
      practice: "Refactor a 'ProcessOrder' method that handles payment, shipping, and email into 3 separate SRP-compliant classes.",
      code: `// SRP Example
public class OrderProcessor {
    private readonly IPaymentService _payment;
    private readonly INotificationService _notifier;

    public OrderProcessor(IPaymentService p, INotificationService n) {
        _payment = p; _notifier = n;
    }

    public async Task Process(Order order) {
        await _payment.Charge(order.Total);
        await _notifier.SendEmail(order.UserEmail, "Success!");
    }
}`
    },
    {
      topic: "Interface vs Abstract Class",
      english: "Interfaces define a contract (what), while Abstract classes offer a base implementation (how). C# 8+ allows default members in interfaces, blurring the line.",
      bangla: "ইন্টারফেস শুধুমাত্র বলে দেয় কী করতে হবে (Contract), কিন্তু অ্যাবস্ট্রাক্ট ক্লাস কিছু ডিফল্ট ইমপ্লিমেন্টেশনও দিতে পারে। একটি ক্লাস একাধিক ইন্টারফেস ইমপ্লিমেন্ট করতে পারে।",
      details: `
| Feature | Interface | Abstract Class |
| :--- | :--- | :--- |
| **Multiple Inheritance** | Supported | Not Supported |
| **Default Logic** | Supported (C# 8+) | Supported |
| **Variables** | No static/instance state | Can have fields/properties |
| **Visibility** | Default public | Any access modifier |
      `,
      commonMistakes: [
        "Using abstract classes when an interface would suffice.",
        "Forgetting that a class can only inherit from one abstract class."
      ],
      bestPractices: [
        "Use Interface for behavioral contracts.",
        "Use Abstract Class for shared internal implementation details.",
        "Name interfaces starting with 'I' (e.g., IRepository)."
      ],
      interviewQs: [
        {
          q: "When to use an Abstract Class over an Interface?",
          a: "Use an abstract class when related types share state (fields), share a common implementation, and form a natural 'is-a' hierarchy. Use an interface when unrelated types share a behavior contract but no shared state or implementation — a class can only inherit one abstract class but implement many interfaces. In practice: if two classes genuinely share code and form a family, abstract class. If they just share a capability contract, interface.",
          bangla: "Shared state বা implementation থাকলে abstract class, শুধু capability contract থাকলে interface — একটি class একাধিক interface implement করতে পারে।"
        },
        {
          q: "What are Default Interface Members and why were they introduced?",
          a: "C# 8 allowed interface methods to have a default implementation body. The primary motivation was API evolution — library authors could add new methods to published interfaces without forcing every implementor to update their code. They also enable mixin-style composition. Default interface members are generally discouraged in application domain code because they introduce hidden behavior that can confuse implementors who do not realize the default exists.",
          bangla: "Library author নতুন method add করতে পারেন সব implementor update না করে — কিন্তু application domain code এ hidden behavior তৈরি হয় বলে avoid করুন।"
        },
        {
          q: "Can an Abstract Class be instantiated?",
          a: "No. The compiler explicitly prevents new AbstractClass() — it will not compile. An abstract class can only be used through a concrete subclass that implements all its abstract members. However, an abstract class can and should have a constructor (called by the subclass via the base() call for initialization), and a variable declared as the abstract type can hold instances of any concrete subclass via polymorphism.",
          bangla: "Abstract class সরাসরি new করা যায় না — শুধু concrete subclass দিয়ে ব্যবহার করা যায়, কিন্তু constructor থাকতে পারে।"
        }
      ],
      practice: "Build a plugin system where each plugin follows an interface but shares logic via an abstract base.",
      code: `public interface IDocument { void Print(); }

public abstract class BaseDocument : IDocument {
    public abstract void Print(); // Must be implemented
    public void Save() => Console.WriteLine("Saving to Disk..."); // Shared logic
}

public class PdfDocument : BaseDocument {
    public override void Print() => Console.WriteLine("Printing PDF");
}`
    },
    {
      topic: "LINQ (Language Integrated Query) - Full Concept",
      english: "LINQ is a powerful set of technologies based on the integration of query capabilities directly into the C# language. It allows you to query data from various sources (Collections, SQL, XML) using a consistent syntax.",
      bangla: "LINQ হলো C# এর একটি অত্যন্ত শক্তিশালী ফিচার যা দিয়ে আমরা বিভিন্ন সোর্স (যেমন অ্যারে, লিস্ট, ডাটাবেজ) থেকে ডাটা কুয়েরি করতে পারি। এটি ডাটা ম্যানিপুলেশনকে অনেক সহজ এবং রিডএবল করে তোলে।",
      details: `
### 1. Syntax Types
- **Query Syntax**: Looks similar to SQL. Preferred for complex joins.
- **Method Syntax (Fluent)**: Uses Extension methods and Lambda expressions. More commonly used in modern .NET.

### 2. Execution Modes
- **Deferred Execution**: The query is NOT executed when defined, but when the data is actually accessed (e.g., using 'foreach' or '.ToList()').
- **Immediate Execution**: Operations like '.Count()', '.First()', or '.ToList()' force the query to run immediately.

### 3. Key Operators
| Category | Operators |
| :--- | :--- |
| **Filtering** | Where, OfType |
| **Projection** | Select, SelectMany |
| **Sorting** | OrderBy, ThenBy, OrderByDescending |
| **Grouping** | GroupBy, ToLookup |
| **Join** | Join, GroupJoin |
| **Quantifiers** | Any, All, Contains |
| **Aggregates** | Sum, Min, Max, Average, Aggregate |

### 4. Advanced Scenarios
- **Inner Join**: Combining two collections based on a key.
- **Outer Join**: Using \`DefaultIfEmpty()\` to handle missing matches.
- **Grouping with Aggregates**: Grouping data and performing math (Sum/Avg).
      `,
      commonMistakes: [
        "Doing multiple .ToList() calls in one chain (kills performance).",
        "Confusing IEnumerable (memory) with IQueryable (database) - causing memory-heavy filtering.",
        "N+1 Query Problem: Executing sub-queries inside a loop instead of using .Include() or Grouping."
      ],
      bestPractices: [
        "Use 'Method Syntax' for simple queries and 'Query Syntax' for complex multi-table joins.",
        "Always use '.Any()' instead of '.Count() > 0' for existence checks (much faster).",
        "Use '.Select()' to only fetch the columns you need (Projection)."
      ],
      interviewQs: [
        {
          q: "What is the difference between Select and SelectMany?",
          a: "Select projects each element to exactly one output — a 1:1 mapping that preserves the collection structure. SelectMany projects each element to a sequence and then flattens all those sequences into one flat collection — a 1:N flattening operation. Example: departments.SelectMany(d => d.Employees) returns a flat list of all employees across all departments, rather than a list of employee lists. SelectMany is the LINQ equivalent of a SQL CROSS APPLY or a nested loop JOIN.",
          bangla: "Select 1:1 mapping করে, SelectMany flatten করে — প্রতিটা element থেকে একটি list বের করে সব একসাথে করে, SQL CROSS APPLY এর মতো।"
        },
        {
          q: "How do you implement a Left Outer Join in LINQ?",
          a: "Use GroupJoin combined with SelectMany and DefaultIfEmpty(): from c in customers join o in orders on c.Id equals o.CustomerId into orderGroup from o in orderGroup.DefaultIfEmpty() select new { c.Name, OrderId = o?.Id }. The GroupJoin produces a group of matching orders per customer, and DefaultIfEmpty() ensures customers with no matching orders still appear in the result with null for the order fields — exactly like SQL LEFT OUTER JOIN behavior.",
          bangla: "GroupJoin + SelectMany + DefaultIfEmpty() দিয়ে SQL LEFT JOIN এর মতো কাজ করে — match না হলে null দিয়ে customer তবুও result এ থাকে।"
        },
        {
          q: "Explain the benefit of Deferred Execution.",
          a: "A LINQ query built with Where, Select, and OrderBy is not executed when defined — it is a description of the computation stored as an expression tree. Execution is deferred until the data is consumed via foreach, ToList(), Count(), etc. This enables incremental query composition: filters and projections can be added conditionally across multiple methods before a single database round trip occurs. For IQueryable sources like EF Core, the entire composed query is translated to optimized SQL in one shot.",
          bangla: "Query define করার সময় execute হয় না — ToList(), foreach বা Count() call করলে তখন SQL চলে। EF Core তে পুরো composed query একটি SQL এ translate হয়।"
        }
      ],
      practice: "Given a list of 'Orders' and 'OrderItems', write a query that joins them, groups by OrderId, and calculates the total amount for each order.",
      code: `// --- 1. JOIN (Inner Join) ---
// Method Syntax:
var joinedMethod = orders.Join(customers,
    o => o.CustomerId, c => c.Id,
    (o, c) => new { o.Id, c.Name });

// Query Syntax (Bangla: একাধিক টেবিলে জয়েন করার জন্য এটি বেশি রিডএবল):
var joinedQuery = from o in orders
                  join c in customers on o.CustomerId equals c.Id
                  select new { o.Id, c.Name };

// --- 2. GROUPING WITH AGGREGATES (Sum, Avg) ---
// Method Syntax:
var summaryMethod = orders
    .GroupBy(o => o.Category)
    .Select(g => new {
        Category = g.Key,
        Total = g.Sum(x => x.Amount), // Category অনুযায়ী সব যোগ করা
        Average = g.Average(x => x.Amount)
    });

// Query Syntax (Bangla: ডাটা গ্রুপ করে সামারি বের করার জন্য):
var summaryQuery = from o in orders
                   group o by o.Category into g
                   select new {
                       Category = g.Key,
                       Total = g.Sum(x => x.Amount),
                       Average = g.Average(x => x.Amount)
                   };

// SelectMany (Flattening collections)
var allPhoneNumbers = departments.SelectMany(d => d.Employees.Select(e => e.Phone));`
    },
    {
      topic: "async/await & Task Parallel Library",
      english: "Asynchronous programming prevents thread blocking, allowing higher throughput. Tasks are lightweight objects representing work, managed by the TPL.",
      bangla: "Asynchronous প্রোগ্রামিং সিস্টেমের পারফরমেন্স বাড়ায়। থ্রেড (Thread) সরাসরি OS রিসোর্স, আর টাস্ক (Task) হলো এর অ্যাবস্ট্রাকশন যা .NET রানটাইম ম্যানেজ করে।",
      details: `
- **Task**: High-level abstraction for async ops.
- **Thread**: Low-level OS execution unit.
- **ValueTask**: Used for scenarios where the result might already be available to save allocations.
      `,
      commonMistakes: [
        "Using .Result or .Wait() which causes deadlocks in UI/Legacy ASP.NET.",
        "Async void: Use only for event handlers as errors cannot be caught.",
        "Ignoring CancellationToken, making it impossible to stop long-running tasks."
      ],
      bestPractices: [
        "Async all the way: Don't mix sync and async code.",
        "Use ConfigureAwait(false) in library/backend code for better performance.",
        "Always pass CancellationToken to async methods."
      ],
      interviewQs: [
        {
          q: "Does 'await' create a new thread?",
          a: "No. await does not create a thread. It registers a continuation and releases the current thread back to the thread pool while the awaited I/O operation completes at the OS level. When the I/O signals completion, the runtime schedules the continuation on an available thread pool thread. This is the key to async scalability — one thread can serve thousands of concurrent I/O-bound requests without blocking, whereas thread-per-request would exhaust the thread pool under load.",
          bangla: "await thread release করে I/O wait করে — I/O শেষ হলে thread pool থেকে continue করে। নতুন thread তৈরি হয় না, এটি সবচেয়ে বড় misconception।"
        },
        {
          q: "Difference between Task.Run and await?",
          a: "Task.Run(() => HeavyWork()) offloads CPU-bound work to a thread pool thread — it creates actual concurrent execution on a separate thread, useful for compute-intensive operations that would block the calling thread. await SomeAsync() is for I/O-bound work — it releases the calling thread and resumes when the I/O completes, with no new thread created. Rule of thumb: Task.Run for CPU work, await for I/O work. Mixing them incorrectly (awaiting Task.Run for I/O) wastes a thread unnecessarily.",
          bangla: "Task.Run CPU-bound কাজের জন্য নতুন thread এ পাঠায়, await I/O-bound কাজের জন্য thread ছেড়ে দেয় — এই পার্থক্যটা জানা জরুরি।"
        },
        {
          q: "When to use Task.WhenAll vs Task.WhenAny?",
          a: "Task.WhenAll waits for ALL provided tasks to complete and aggregates their results — use it when you need every result before proceeding, such as fetching data from 3 APIs concurrently and needing all three responses. Task.WhenAny completes as soon as the FIRST task finishes — use it for timeout patterns (Task.WhenAny(workTask, Task.Delay(timeout))) or competitive scenarios where the fastest result is sufficient and remaining tasks can be cancelled.",
          bangla: "WhenAll সব শেষ হওয়ার অপেক্ষা করে, WhenAny প্রথমটা শেষ হলেই return করে — timeout pattern এ WhenAny(workTask, Task.Delay(timeout)) ব্যবহার করুন।"
        }
      ],
      practice: "Create a console app that fetches data from 3 APIs concurrently and uses a Timeout with CancellationToken.",
      code: `public async Task<string> FetchSafeAsync(CancellationToken ct) {
    using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
    cts.CancelAfter(5000); // Timeout after 5s

    var result = await _client.GetStringAsync(url, cts.Token).ConfigureAwait(false);
    return result;
}`
    },
    {
      topic: "Memory Management & Garbage Collection",
      english: "The .NET GC is a generational collector (Gen 0, 1, 2). It cleans up managed memory, but unmanaged resources must be handled via IDisposable.",
      bangla: "GC মূলত ৩টি জেনারেশনে কাজ করে মেমোরি রিলিজ করার জন্য। বড় অবজেক্টগুলো সরাসরি LOH (Large Object Heap)-এ যায় যা ফিনিশ হওয়ার আগ পর্যন্ত মেমোরি ধরে রাখে।",
      details: `
| Generation | Purpose | Collector Frequency |
| :--- | :--- | :--- |
| **Gen 0** | Short-lived objects | High |
| **Gen 1** | Buffer for transitioning | Medium |
| **Gen 2** | Long-lived / Static objects | Low |
| **LOH** | Objects > 85KB | Very Low |
      `,
      commonMistakes: [
        "Not disposing database connections or file streams.",
        "Creating massive numbers of large objects (>85KB) continuously, causing LOH fragmentation.",
        "Keeping static references to short-lived objects, preventing GC from cleaning them."
      ],
      bestPractices: [
        "Always use the 'using' block for types implementing IDisposable.",
        "Implement IDisposable pattern correctly for custom resource managers.",
        "Avoid Large Object Heap (LOH) where possible."
      ],
      interviewQs: [
        {
          q: "What is IDisposable and why do we use it?",
          a: "IDisposable defines the Dispose() method for deterministically releasing unmanaged resources — database connections, file handles, network sockets — that the GC cannot automatically collect because they are outside the managed heap. The using statement calls Dispose() at the end of scope regardless of exceptions. Without IDisposable, unmanaged resources would leak until a finalizer runs, which can be delayed indefinitely by the GC and causes resource exhaustion under load.",
          bangla: "Unmanaged resource (DB connection, file stream) GC automatically clean করতে পারে না — using block দিয়ে deterministic cleanup নিশ্চিত করুন।"
        },
        {
          q: "Explain the 3 generations of Garbage Collection.",
          a: "Gen 0 holds newly allocated short-lived objects and is collected most frequently and fastest — most objects die here. Gen 1 is a buffer between Gen 0 and Gen 2, holding objects that survived one Gen 0 collection. Gen 2 holds long-lived objects like statics and application caches — collected rarely and is expensive. Objects over 85KB go directly to the Large Object Heap (LOH), which is not compacted by default. Frequent Gen 2 collections signal a memory pressure problem requiring investigation.",
          bangla: "Gen 0 সবচেয়ে বেশি collect হয়, Gen 2 দীর্ঘস্থায়ী object ধরে — বারবার Gen 2 collect হলে memory pressure এর sign, investigate করুন।"
        },
        {
          q: "What is the Large Object Heap (LOH) and why is it special?",
          a: "Objects larger than 85KB are allocated directly on the LOH. Unlike Gen 0/1/2, the LOH is not compacted during collection by default (compaction is opt-in since .NET 4.5.1). This means LOH fragmentation builds up over time as large objects are allocated and freed — free blocks appear between live objects. This fragmentation can cause OutOfMemoryException even when total free memory is large. Avoid allocating and releasing large arrays in hot paths; pool and reuse them with ArrayPool<T>.",
          bangla: "85KB+ object LOH এ যায়, compact হয় না — fragmentation এ OutOfMemoryException হতে পারে। ArrayPool<T> দিয়ে reuse করুন।"
        }
      ],
      practice: "Implement a custom class that manages an unmanaged resource using the full IDisposable/Finalizer pattern.",
      code: `public class HeavyResource : IDisposable {
    private bool _disposed = false;

    public void Dispose() {
        Dispose(true);
        GC.SuppressFinalize(this); // Tell GC not to call Finalizer
    }

    protected virtual void Dispose(bool disposing) {
        if (!_disposed) {
            if (disposing) { /* Clean managed */ }
            /* Clean unmanaged */
            _disposed = true;
        }
    }
}`
    },
    {
      topic: "Delegates, Actions & Events",
      english: "Delegates are type-safe function pointers. Events are a wrapper around delegates to provide a sub/pub model. Actions and Funcs are built-in delegate types that simplify functional-style programming.",
      bangla: "ডেলিগেট (Delegate) হলো ফাংশন পয়েন্টার যা টাইপ-সেফ। ইভেন্ট (Event) মূলত ডেলিগেটের ওপর ভিত্তি করে তৈরি যা পাবলিশ-সাবস্ক্রাইব প্যাটার্ন ফলো করে। অ্যাকশন এবং ফাঙ্ক প্রি-ডিফাইনড ডেলিগেট।",
      details: `
| Type | Description | Returns Value? |
| :--- | :--- | :--- |
| **Delegate** | Custom type definition for a method signature. | Yes/No |
| **Action** | A delegate that takes parameters but returns void. | No |
| **Func** | A delegate that takes parameters and returns a value. | Yes |
| **Event** | Encapsulated delegate for notification. | No |
      `,
      commonMistakes: [
        "Memory leaks: Not unsubscribing from events when an object is disposed.",
        "Using custom delegates when Action or Func would work fine.",
        "Attaching the same handler multiple times to an event."
      ],
      bestPractices: [
        "Unsubscribe from events to avoid memory leaks (-= operator).",
        "Use Events when you need to notify other classes without tight coupling.",
        "Prefer built-in Action/Func over custom delegates for simplicity."
      ],
      interviewQs: [
        {
          q: "What is the difference between an Event and a Delegate?",
          a: "A delegate is a type-safe function pointer that any holder of the reference can invoke directly. An event wraps a delegate with access protection — only the declaring class can invoke it (via ?.Invoke()), while external classes can only subscribe with += or unsubscribe with -=. Events enforce the publisher-subscriber pattern: external code cannot clear all subscribers, invoke the event arbitrarily, or read the invocation list. This encapsulation prevents misuse that is possible with raw public delegates.",
          bangla: "Delegate যে কেউ invoke করতে পারে, Event শুধু declaring class invoke করতে পারে — external caller শুধু += subscribe বা -= unsubscribe করতে পারে।"
        },
        {
          q: "Explain Func vs Action vs Predicate.",
          a: "Action<T...> represents methods that take 0-16 parameters and return void — use it for callbacks and side-effect operations. Func<T..., TResult> represents methods that take 0-15 parameters and return a value — the last type argument is always the return type. Predicate<T> is equivalent to Func<T, bool> and is used specifically by List<T> methods like FindAll and RemoveAll. All three eliminate the need to declare custom delegate types for common patterns.",
          bangla: "Action void return, Func value return, Predicate bool return — তিনটিই built-in delegate type, custom delegate type declare করার দরকার নেই।"
        },
        {
          q: "How do you prevent memory leaks when using Events?",
          a: "Always unsubscribe with -= when the subscriber no longer needs the event. The critical scenario: a short-lived subscriber object attaches to an event on a long-lived publisher. The publisher's delegate invocation list holds a reference to the subscriber, preventing the GC from collecting it. Standard pattern: implement IDisposable on the subscriber and unsubscribe in Dispose(). For scenarios where you cannot control the subscriber lifetime, WeakEventManager or weak reference delegates prevent the publisher from extending the subscriber's lifetime.",
          bangla: "Subscriber dispose করার সময় -= দিয়ে unsubscribe করুন — না করলে publisher subscriber কে GC হতে দেয় না, memory leak তৈরি হয়।"
        }
      ],
      practice: "Build a generic 'DataLogger' that raises an event whenever a new log entry is added.",
      code: `public class Processor {
    public event Action<string> OnComplete; // Event definition

    public void Start() {
        // Logic...
        OnComplete?.Invoke("Finished!"); // Raise event
    }
}
// Listener
processor.OnComplete += (msg) => Console.WriteLine(msg);`
    },
    {
      topic: "Reflection & Attributes",
      english: "Reflection allows inspecting and interacting with metadata at runtime. Attributes provide a way to decorate code with additional metadata used by frameworks.",
      bangla: "রিফ্লেকশন (Reflection) রানটাইমে কোডের মেটাডাটা (যেমন ক্লাসের মেথড বা প্রপার্টি) ইন্সপেক্ট করতে সাহায্য করে। অ্যাট্রিবিউট ব্যবহার করে কোডে এক্সট্রা মেটাডাটা যোগ করা যায়।",
      commonMistakes: [
        "Using Reflection for everything: It is significantly slower than direct calls.",
        "Over-engineering simple logic using attributes.",
        "Security risks: Accessing private members via reflection in untrusted environments."
      ],
      bestPractices: [
        "Use Reflection sparingly; use it for dynamic loading or generic tools (like ORMs/Serializers).",
        "Cache reflection results (like PropertyInfo) to improve performance.",
        "Use specialized attributes to filter or mark special behaviors."
      ],
      interviewQs: [
        {
          q: "What is Reflection and when should you use it?",
          a: "Reflection is the ability to inspect and invoke type metadata — methods, properties, constructors, attributes — at runtime without compile-time knowledge of the types. Use it for generic infrastructure: serializers, ORMs, DI containers, test frameworks, and plugin systems that discover types dynamically. Avoid it in hot business logic paths — reflection bypasses JIT optimizations and is 10-100x slower than direct calls. In .NET 7+, prefer source generators (Roslyn) over runtime reflection for performance-critical scenarios.",
          bangla: "Generic infrastructure (ORM, DI, serializer) এ ভালো — business logic এ avoid করুন, 10-100x slow। .NET 7+ এ source generator prefer করুন।"
        },
        {
          q: "Are there any performance implications of using Reflection?",
          a: "Yes, significant. MethodInfo.Invoke() and PropertyInfo.GetValue() are dramatically slower than direct calls because they skip JIT inlining and require metadata resolution on each call. The practical mitigations: cache PropertyInfo and MethodInfo objects (the lookup itself is expensive), compile Expression<T> trees or use Emit for repeated invocations (compiles to direct IL calls), or in .NET 7+ use the TypedResults API and source generators which perform reflection at compile time rather than runtime.",
          bangla: "MethodInfo.Invoke() অনেক slow — PropertyInfo cache করুন বা Expression tree compile করুন। .NET 7+ এ source generator runtime reflection এর বিকল্প।"
        },
        {
          q: "What are Custom Attributes and how do you read them?",
          a: "A custom attribute is a class inheriting from System.Attribute. Decorate any code element (class, property, method, parameter) with [YourAttribute(args)]. At runtime, read it with MemberInfo.GetCustomAttribute<YourAttribute>() or GetCustomAttributes() for multiple instances. Custom attributes are pure metadata — they have no behavior unless code explicitly reads and acts on them. Common uses: ORM column mapping, custom validation rules, authorization policy markers, serialization hints, and test framework annotations.",
          bangla: "System.Attribute inherit করে custom attribute তৈরি, GetCustomAttribute<T>() দিয়ে read করা যায় — pure metadata, code পড়লে তবেই কাজ করে।"
        }
      ],
      practice: "Write code that finds all properties with a custom '[Export]' attribute and prints their values.",
      code: `var user = new User { Name = "John" };
var type = typeof(User);
// Get all properties via Reflection
foreach(var prop in type.GetProperties()) {
   var val = prop.GetValue(user);
   Console.WriteLine($"{prop.Name}: {val}");
}`
    },
    {
      topic: "Extension Methods & Generics",
      english: "Extension methods allow adding new methods to existing types without modifying the original source. Generics provide type safety and reuse across different data types.",
      bangla: "এক্সটেনশন মেথড ব্যবহার করে কোড না পরিবর্তন করেই এক্সিসটিং টাইপ-এ নতুন মেথড যোগ করা যায়। জেনেরিক্স মেমোরি বাঁচায় এবং কোড রিইউজেবিলিটি বাড়ায়।",
      commonMistakes: [
        "Adding too many extension methods to common types (like string), polluting IntelliSense.",
        "Using 'object' instead of Generics, causing boxing/unboxing overhead.",
        "Creating extension methods for types you own directly (use inheritance or partial classes instead)."
      ],
      bestPractices: [
        "Extension methods must be in a static class and use the 'this' keyword.",
        "Place extension methods in specialized namespaces.",
        "Use Generics to avoid code duplication and ensure compile-time safety."
      ],
      interviewQs: [
        {
          q: "How do you create an Extension Method in C#?",
          a: "Define a public static method inside a public static class. The first parameter uses the this keyword prefix to specify which type it extends: public static int WordCount(this string s). The method is then callable on any string instance as myStr.WordCount() — provided the namespace containing the static class is imported. The compiler desugars myStr.WordCount() to StringExtensions.WordCount(myStr). Extension methods cannot access private members of the extended type.",
          bangla: "static class এর static method, first parameter এ this — target type এর private member access নেই। Namespace import করলে সব instance এ available।"
        },
        {
          q: "What is Boxing and Unboxing, and how do Generics solve it?",
          a: "Boxing wraps a value type (int, struct) in a heap-allocated object wrapper — copies the value to the heap and returns a reference. Unboxing extracts it back — requires a cast and a copy. Both operations are expensive: heap allocation, GC pressure, and type-check overhead. Generics eliminate boxing because List<int> generates a specialized implementation that stores actual int values in a typed array. Using List<object> would box every integer on insertion, degrading performance significantly.",
          bangla: "Value type heap এ wrap করা boxing, unwrap করা unboxing — Generics (List<int>) boxing ছাড়াই typed storage দেয়, List<object> এ প্রতিটা int box হত।"
        },
        {
          q: "What are generic constraints (e.g., where T : class)?",
          a: "Constraints restrict which types can be substituted for T, enabling the compiler to allow operations on T that are only valid for certain type categories. where T : class — reference types only. where T : struct — value types only. where T : new() — must have a public parameterless constructor. where T : IRepository — must implement the interface. where T : BaseEntity — must inherit from the class. Multiple constraints combine: where T : class, IEntity, new(). Constraints provide compile-time safety without runtime type checks.",
          bangla: "where T : class, IEntity, new() — compile time এ type safe করে, runtime type check দরকার নেই। Multiple constraint chain করা যায়।"
        }
      ],
      practice: "Create an extension method for 'string' that counts the number of words in a sentence.",
      code: `public static class StringExtensions {
    public static int WordCount(this string str) {
        return str.Split(' ').Length;
    }
}
// Usage
"Hello World".WordCount(); // returns 2`
    },
    {
      topic: "Records, Structs & Classes",
      english: "Classes are reference types (Heap) with identity. Structs are value types (Stack/In-line) for high-performance small data. Records provide built-in value-based equality and non-destructive mutation.",
      bangla: "রেকর্ড (Record) মূলত ইমিউটেবল ডাটা এবং ডিটিও-র জন্য সেরা কারণ এতে ভ্যালু-বেসড ইকুয়ালিটি থাকে। স্ট্রাক্ট (Struct) পারফরমেন্সের জন্য ভালো, আর ক্লাস (Class) জেনারেল লজিকের জন্য।",
      details: `
| Feature | Class | Struct | Record (C# 9+) |
| :--- | :--- | :--- | :--- |
| **Type Category** | Reference Type (Heap) | Value Type (Stack/Inline) | Reference Type (usually) |
| **Equality** | Reference-based | Value-based | Value-based |
| **Immutability** | Manual | Manual | Built-in (init-only) |
| **Allocation** | Garbage Collected | In-line / Stack | Garbage Collected |
| **Scenario** | Complex Entities | Small Data (<16B) | DTOs / DDD Models |
      `,
      commonMistakes: [
        "Using huge Structs which lead to expensive memory copying.",
        "Trying to inherit a Class from a Struct (Structs are sealed).",
        "Assuming class references with same values are equal (they aren't)."
      ],
      bestPractices: [
        "Use Records for anything that acts like 'data' (e.g., API responses).",
        "Keep Structs small and immutable to leverage performance gains.",
        "Use Classes when you need long-term identity and state mutation."
      ],
      interviewQs: [
        {
          q: "Why are Records preferred for DTOs?",
          a: "Records provide built-in value-based equality — two records with the same property values compare as equal with ==, without manual Equals/GetHashCode overrides. They also have an auto-generated ToString(), init-only properties for immutability post-construction, and the with expression for non-destructive mutation. These are exactly the properties a DTO needs: pure data containers that compare equal when they carry the same data, with no mutable state that could cause bugs when passed across layers.",
          bangla: "Value-based equality, init-only property, auto ToString() — same data থাকলে equal, Equals() override করতে হয় না। DTO এর জন্য আদর্শ।"
        },
        {
          q: "What is the difference between Heap and Stack allocation?",
          a: "Stack allocation is LIFO — local variables and value types are pushed on entry to a method and popped deterministically on exit, zero GC involvement, extremely fast. The stack is limited (around 1MB default thread stack). Heap allocation is where reference types live — the GC manages their lifetime. Value types declared as local variables live on the stack; value types inside a class live on the heap alongside the class. Boxing moves a value type to the heap, which is why it is expensive.",
          bangla: "Stack LIFO, fast, GC নেই — Heap GC manage করে, reference type এখানে থাকে। Boxing মানে value type heap এ যাওয়া, তাই expensive।"
        },
        {
          q: "How does 'init' properties work in Records?",
          a: "init is a property accessor that allows assignment only during object construction — in the constructor body or an object initializer (new User { Name = \"x\" }). After the object is fully constructed, the property becomes immutable and any attempt to assign to it is a compile error. Records use init-only properties by default to enforce immutability. It provides a middle ground between full mutability (set accessor) and constructor-only assignment — keeping the clean object-initializer syntax while preventing post-construction mutation.",
          bangla: "Construction এর সময় assign করা যায়, পরে immutable — object initializer syntax রেখে post-construction mutation prevent করে।"
        }
      ],
      practice: "Create a Benchmark to compare the memory allocation of 100,000 Classes vs 100,000 Structs.",
      code: `// Record: Equality by Value
public record Point(int x, int y);
var p1 = new Point(1, 2);
var p2 = p1 with { x = 3 }; // Mutation via Copy

// Struct: Allocation in-line
public struct Vector2 { public int X, Y; }

// Class: Equality by Reference
public class Person { ... }`
    }
  ],
  revisionSummary: `
- **C# Mastery** requires balance between syntax knowledge and runtime understanding.
- **Memory**: Know the difference between Managed (GC) and Unmanaged (IDisposable) resources.
- **Async**: Always go "Async all the way" to avoid deadlocks.
- **OOP**: SOLID is not a rule, but a guide to prevent spaghetti code.
- **Types**: Use Records for DTOs, Classes for business logic, and Structs sparingly.
  `,
  summary: "C# এ ভালো করার জন্য OOP, সলিড প্রিন্সিপল এবং মেমোরি ম্যানেজমেন্টের ওপর ক্লিয়ার আইডিয়া থাকতে হবে। বিশেষ করে async/await এবং জেনেরিক্স আধুনিক .NET ডেভেলপমেন্টের জন্য অপরিহার্য।"
};
