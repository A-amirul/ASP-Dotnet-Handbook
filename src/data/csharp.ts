export const csharpData = {
  id: 'csharp',
  title: 'Advanced C# Mastery',
  description: 'Deep dive into C# internals, memory management, and advanced features for senior roles.',
  sections: [
    {
      topic: "OOP & SOLID Principles",
      english: "SOLID principles ensure that your code is maintainable, scalable, and easy to test. Seniors must explain not just what they are, but how they avoid technical debt.",
      bangla: "সলিড প্রিন্সিপল হলো ক্লিন কোড লেখার মূল মন্ত্র। ইন্টারভিউতে প্রতিটা লেটারের মানে এবং প্রাকটিক্যাল উদাহরণসহ জানতে চাওয়া হয়। এটি কোডকে ফ্লেক্সিবল রাখে।",
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
        "Explain Dependency Inversion vs Dependency Injection.",
        "How do you implement Open/Closed principle in a real project?",
        "What is Liskov Substitution and why is it important?"
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
      bangla: "ইন্টারফেস শুধুমাত্র বলে দেয় কী করতে হবে (Contract), কিন্তু অ্যাবস্ট্রাক্ট ক্লাস কিছু ডিফল্ট ইমপ্লিমেন্টেশনও দিতে পারে। একটি ক্লাস একাধিক ইন্টারফেস ইমপ্লিমেন্ট করতে পারে।",
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
        "When to use an Abstract Class over an Interface?",
        "What are Default Interface Members and why were they introduced?",
        "Can an Abstract Class be instantiated?"
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
      bangla: "LINQ হলো C# এর একটি অত্যন্ত শক্তিশালী ফিচার যা দিয়ে আমরা বিভিন্ন সোর্স (যেমন অ্যারে, লিস্ট, ডাটাবেজ) থেকে ডাটা কুয়েরি করতে পারি। এটি ডাটা ম্যানিপুলেশনকে অনেক সহজ এবং রিডএবল করে তোলে।",
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
        "What is the difference between Select and SelectMany?",
        "How do you implement a Left Outer Join in LINQ?",
        "Explain the benefit of Deferred Execution."
      ],
      practice: "Given a list of 'Orders' and 'OrderItems', write a query that joins them, groups by OrderId, and calculates the total amount for each order.",
      code: `// --- 1. JOIN (Inner Join) ---
// Method Syntax:
var joinedMethod = orders.Join(customers, 
    o => o.CustomerId, c => c.Id, 
    (o, c) => new { o.Id, c.Name });

// Query Syntax (Bangla: একাধিক টেবিলে জয়েন করার জন্য এটি বেশি রিডএবল):
var joinedQuery = from o in orders
                  join c in customers on o.CustomerId equals c.Id
                  select new { o.Id, c.Name };

// --- 2. GROUPING WITH AGGREGATES (Sum, Avg) ---
// Method Syntax:
var summaryMethod = orders
    .GroupBy(o => o.Category)
    .Select(g => new { 
        Category = g.Key, 
        Total = g.Sum(x => x.Amount), // Category অনুযায়ী সব যোগ করা
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
      bangla: "Asynchronous প্রোগ্রামিং সিস্টেমের পারফরমেন্স বাড়ায়। থ্রেড (Thread) সরাসরি OS রিসোর্স, আর টাস্ক (Task) হলো এর অ্যাবস্ট্রাকশন যা .NET রানটাইম ম্যানেজ করে।",
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
        "Does 'await' create a new thread?",
        "Difference between Task.Run and await?",
        "When to use Task.WhenAll vs Task.WhenAny?"
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
      bangla: "GC মূলত ৩টি জেনারেশনে কাজ করে মেমোরি রিলিজ করার জন্য। বড় অবজেক্টগুলো সরাসরি LOH (Large Object Heap)-এ যায় যা ফিনিশ হওয়ার আগ পর্যন্ত মেমোরি ধরে রাখে।",
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
        "What is IDisposable and why do we use it?",
        "Explain the 3 generations of Garbage Collection.",
        "What is the Large Object Heap (LOH) and why is it special?"
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
      bangla: "ডেলিগেট (Delegate) হলো ফাংশন পয়েন্টার যা টাইপ-সেফ। ইভেন্ট (Event) মূলত ডেলিগেটের ওপর ভিত্তি করে তৈরি যা পাবলিশ-সাবস্ক্রাইব প্যাটার্ন ফলো করে। অ্যাকশন এবং ফাঙ্ক প্রি-ডিফাইনড ডেলিগেট।",
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
        "What is the difference between an Event and a Delegate?",
        "Explain Func vs Action vs Predicate.",
        "How do you prevent memory leaks when using Events?"
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
      bangla: "রিফ্লেকশন (Reflection) রানটাইমে কোডের মেটাডাটা (যেমন ক্লাসের মেথড বা প্রপার্টি) ইন্সপেক্ট করতে সাহায্য করে। অ্যাট্রিবিউট ব্যবহার করে কোডে এক্সট্রা মেটাডাটা যোগ করা যায়।",
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
        "What is Reflection and when should you use it?",
        "Are there any performance implications of using Reflection?",
        "What are Custom Attributes and how do you read them?"
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
      bangla: "এক্সটেনশন মেথড ব্যবহার করে কোড না পরিবর্তন করেই এক্সিসটিং টাইপ-এ নতুন মেথড যোগ করা যায়। জেনেরিক্স মেমোরি বাঁচায় এবং কোড রিইউজেবিলিটি বাড়ায়।",
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
        "How do you create an Extension Method in C#?",
        "What is Boxing and Unboxing, and how do Generics solve it?",
        "What are generic constraints (e.g., where T : class)?"
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
      bangla: "রেকর্ড (Record) মূলত ইমিউটেবল ডাটা এবং ডিটিও-র জন্য সেরা কারণ এতে ভ্যালু-বেসড ইকুয়ালিটি থাকে। স্ট্রাক্ট (Struct) পারফরমেন্সের জন্য ভালো, আর ক্লাস (Class) জেনারেল লজিকের জন্য।",
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
        "Why are Records preferred for DTOs?",
        "What is the difference between Heap and Stack allocation?",
        "How does 'init' properties work in Records?"
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
  summary: "C# এ ভালো করার জন্য OOP, সলিড প্রিন্সিপল এবং মেমোরি ম্যানেজমেন্টের ওপর ক্লিয়ার আইডিয়া থাকতে হবে। বিশেষ করে async/await এবং জেনেরিক্স আধুনিক .NET ডেভেলপমেন্টের জন্য অপরিহার্য।"
};
