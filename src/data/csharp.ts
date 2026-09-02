export const csharpData = {
  id: 'csharp',
  title: 'C# Language, OOP & Internals',
  description: 'Four OOP pillars (Encapsulation, Abstraction, Inheritance, Polymorphism), SOLID, types, GC, Span — with bilingual explanations and interview answers.',
  sections: [
    {
      topic: 'Class, Object & Access Modifiers',
      difficulty: 'junior',
      english: 'A class is a blueprint; an object is a runtime instance with its own state. Access modifiers control who can see fields, properties, and methods — the foundation of every OOP design in C#.',
      bangla: 'Class হলো blueprint, object হলো runtime instance। Access modifier দিয়ে কে field/property/method দেখতে পারবে সেটা নিয়ন্ত্রণ — OOP-এর প্রথম ধাপ।',
      details: `
### Class vs Object
| Concept | Meaning | Example |
| :--- | :--- | :--- |
| **Class** | Template / blueprint | \`public class Employee { ... }\` |
| **Object** | Instance in memory | \`var emp = new Employee();\` |

### Members of a class
- **Fields** — raw data (prefer \`private\`)
- **Properties** — controlled access (\`get\` / \`set\` / \`init\`)
- **Methods** — behavior
- **Constructors** — initialize new objects
- **Static members** — belong to the type, not one instance

### Access modifiers (C#)
| Modifier | Who can access |
| :--- | :--- |
| \`public\` | Anywhere |
| \`private\` | Same class only |
| \`protected\` | Class + derived classes |
| \`internal\` | Same assembly |
| \`protected internal\` | Derived OR same assembly |
| \`private protected\` | Derived in same assembly |

### \`static\` vs instance
- **Instance:** each object has its own copy (\`emp.Name\`)
- **Static:** one shared copy for the whole app (\`Employee.MaxLeaveDays\`)
- Static constructor runs once before first use of the type
      `,
      commonMistakes: [
        'Making all fields public — breaks encapsulation.',
        'Using static for everything — hard to test and mock.',
        'Confusing class (type) with object (instance).',
      ],
      bestPractices: [
        'Keep fields private; expose via properties.',
        'Use static only for true shared constants or factories.',
        'One class = one clear responsibility (leads to SRP).',
      ],
      interviewQs: [
        {
          q: 'What is the difference between a class and an object?',
          a: 'A class defines structure and behavior — it is a compile-time blueprint. An object is a heap-allocated instance created with new at runtime, with its own field values. You can create many objects from one class; each has independent state but shares the same method definitions.',
          bangla: 'Class = blueprint (compile time), Object = new দিয়ে তৈরি instance (runtime) — এক class থেকে অনেক object, প্রতিটার আলাদা state।',
          difficulty: 'junior',
        },
        {
          q: 'Why use private fields instead of public fields?',
          a: 'Private fields hide implementation. Properties can validate on set (salary cannot be negative), trigger change notifications, or log access. Public fields allow any caller to put the object in an invalid state — encapsulation prevents that.',
          bangla: 'Private field = implementation hide; property = validation/control। Public field দিলে invalid state যেকোনো caller দিতে পারে।',
          difficulty: 'junior',
        },
        {
          q: 'When would you use static members?',
          a: 'For data or behavior that does not belong to a single instance: constants (MaxRetryCount), utility methods (DateTime.UtcNow), or singleton factories. Avoid static mutable state in web apps — it breaks under concurrency and is hard to unit test.',
          bangla: 'Constant/utility-তে static; web app-এ static mutable state avoid — test ও thread-safe সমস্যা।',
          difficulty: 'mid',
        },
      ],
      practice: 'Create an Employee class with private _salary, public Name property, and a static MaxEmployees constant.',
      code: `public class Employee
{
    private decimal _salary;
    public static int MaxEmployees { get; } = 10_000;

    public string Name { get; set; }

    public decimal Salary
    {
        get => _salary;
        set => _salary = value >= 0 ? value : throw new ArgumentOutOfRangeException();
    }

    public Employee(string name) => Name = name;
}

var emp = new Employee("Amir") { Salary = 50_000m };`,
    },
    {
      topic: 'Encapsulation — Data Hiding & Properties',
      difficulty: 'junior',
      english: 'Encapsulation bundles data and behavior inside a class and hides internal details. Callers interact through a controlled public surface (properties/methods) so invariants stay valid.',
      bangla: 'Encapsulation মানে data + behavior এক class-এ bundle করা এবং ভিতরের detail লুকানো। বাইরে থেকে property/method দিয়ে controlled access — invalid state রোধ।',
      details: `
### What encapsulation achieves
1. **Hide implementation** — callers do not depend on how salary is stored
2. **Validate input** — reject negative salary in the setter
3. **Change internals safely** — switch from decimal to Money type without breaking callers

### Property patterns in C#
| Pattern | Use case |
| :--- | :--- |
| Auto-property \`{ get; set; }\` | Simple DTOs |
| Full property with backing field | Validation, lazy init |
| \`init\` only | Immutable after construction (records) |
| \`private set\` | Read-only from outside |
| Expression-bodied \`=> \` | Computed property (FullName) |

### Auto-implemented vs explicit backing field
Use explicit backing field when you need validation, logging, or lazy loading. Use auto-property when a plain get/set is enough.

### DDD-style encapsulation
Domain entities expose behavior methods (\`employee.RaiseSalary(10m)\`) instead of public setters — prevents anemic domain models.
      `,
      commonMistakes: [
        'Anemic model: only getters/setters, no behavior.',
        'Validation in controller instead of entity — duplicated rules.',
        'Exposing mutable collections publicly (List<T> property with public set).',
      ],
      bestPractices: [
        'Return IReadOnlyList<T> from properties when exposing collections.',
        'Validate in the property setter or domain method, not scattered in UI.',
        'Use required modifier (C# 11+) for mandatory init properties.',
      ],
      interviewQs: [
        {
          q: 'What is encapsulation in OOP?',
          a: 'Encapsulation is hiding internal state and requiring all interaction through public methods and properties. The class decides what is allowed (e.g. salary > 0). This reduces coupling — callers depend on the contract, not private fields.',
          bangla: 'Internal state লুকানো + public property/method দিয়ে access — class নিজেই rule enforce করে, coupling কমে।',
          difficulty: 'junior',
        },
        {
          q: 'Property vs field — when use which?',
          a: 'Almost always use properties for public API. Fields should be private backing storage. Properties allow future validation, computed values, and interface implementation without breaking callers.',
          bangla: 'Public API-তে property; field private backing-এ। Property দিয়ে পরে validation add করা যায় breaking change ছাড়াই।',
          difficulty: 'junior',
        },
        {
          q: 'What is an anemic domain model and why avoid it?',
          a: 'An anemic model is a class with only data properties and no behavior — all logic lives in services. It spreads business rules across layers and duplicates validation. Rich domain models encapsulate rules inside the entity (e.g. Order.AddLineItem checks stock).',
          bangla: 'Anemic = শুধু data, logic service-এ scattered — rich model-এ behavior entity-র ভিতরে, rule duplicate কমে।',
          difficulty: 'mid',
        },
      ],
      practice: 'Refactor a public decimal Salary field into a property that logs every change and rejects values over 1 crore.',
      code: `public class BankAccount
{
    private decimal _balance;

    public decimal Balance
    {
        get => _balance;
        private set
        {
            if (value < 0) throw new InvalidOperationException("Balance cannot be negative.");
            _balance = value;
        }
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive.");
        Balance = _balance + amount; // uses setter logic if you add it
    }
}`,
    },
    {
      topic: 'Inheritance — base, derived & sealed',
      difficulty: 'junior',
      english: 'Inheritance lets a derived class reuse and extend a base class (is-a relationship). C# supports single inheritance for classes; use interfaces for additional contracts.',
      bangla: 'Inheritance-এ derived class base class-এর code reuse ও extend করে (is-a)। C#-এ class-এ single inheritance; extra contract-এ interface।',
      details: `
### Inheritance syntax
\`\`\`csharp
public class Person { public string Name { get; set; } }
public class Employee : Person { public decimal Salary { get; set; } }
\`\`\`

### Key keywords
| Keyword | Purpose |
| :--- | :--- |
| \`base\` | Call parent constructor or method |
| \`: Person(name)\` | Chain constructor to base |
| \`sealed class\` | No further inheritance |
| \`sealed override\` | Stop overriding downstream |

### Constructor chaining
Derived constructor must call a base constructor (explicitly or implicitly). Use \`base(...)\` when parent needs parameters.

### When inheritance fits
- True **is-a**: \`Manager : Employee\`
- Shared implementation in a family of types

### When inheritance hurts
- Deep hierarchies (fragile base class)
- Subclass only needs one method — prefer interface + composition
      `,
      commonMistakes: [
        'Inheriting for code reuse only (Employee : List<Order>) — wrong is-a.',
        'Forgetting to call base() in constructor when base has no parameterless ctor.',
        'Overriding without understanding LSP — subclass breaks parent contract.',
      ],
      bestPractices: [
        'Favor shallow inheritance trees (2–3 levels max in apps).',
        'Mark classes sealed by default unless designed for extension.',
        'Use protected for members meant for subclasses only.',
      ],
      interviewQs: [
        {
          q: 'What is inheritance and what is single inheritance in C#?',
          a: 'Inheritance allows a derived class to inherit members from a base class and add or override behavior. C# allows only one base class per class (single inheritance) to avoid diamond problem complexity. Multiple inheritance of behavior is achieved via multiple interfaces.',
          bangla: 'Derived base থেকে inherit করে — C#-এ এক class এক base; multiple behavior = multiple interface।',
          difficulty: 'junior',
        },
        {
          q: 'What does the base keyword do?',
          a: 'base() calls a parent constructor during derived object construction. base.MethodName() invokes the parent implementation from an override — useful when extending rather than replacing behavior (e.g. logging wrapper around base.Save()).',
          bangla: 'base() = parent constructor; base.Method() = parent implementation call override-এর ভিতরে।',
          difficulty: 'junior',
        },
        {
          q: 'What is a sealed class?',
          a: 'A sealed class cannot be inherited. Use it when the type is complete and extension would break invariants (e.g. string is sealed). sealed override on a method prevents further overrides in downstream classes.',
          bangla: 'sealed class = আর inherit করা যাবে না; sealed override = আর override করা যাবে না।',
          difficulty: 'mid',
        },
      ],
      practice: 'Create Shape base with virtual Area(); Circle and Rectangle override it.',
      code: `public class Shape
{
    public virtual double Area() => 0;
}

public class Circle : Shape
{
    public double Radius { get; init; }
    public override double Area() => Math.PI * Radius * Radius;
}

public sealed class Square : Shape
{
    public double Side { get; init; }
    public override double Area() => Side * Side;
}`,
    },
    {
      topic: 'Polymorphism — Overloading vs Overriding',
      difficulty: 'junior',
      english: 'Polymorphism means one interface, many forms. C# has compile-time polymorphism (method overloading) and runtime polymorphism (virtual/override through a base reference).',
      bangla: 'Polymorphism = এক interface, অনেক form। C#-এ compile-time (overloading) ও runtime (virtual/override) দুই ধরন।',
      details: `
### Method overloading (compile-time)
Same method name, **different parameter list** in the same class. Resolved at compile time.

\`\`\`csharp
public int Add(int a, int b) => a + b;
public int Add(int a, int b, int c) => a + b + c;
public double Add(double a, double b) => a + b;
\`\`\`

| | Overloading | Overriding |
| :--- | :--- | :--- |
| **When** | Compile time | Runtime |
| **Where** | Usually same class | Parent + child |
| **Signature** | Different parameters | Same signature |
| **Keywords** | None | \`virtual\` / \`override\` |

### Method overriding (runtime)
Parent marks method \`virtual\` (or \`abstract\`); child uses \`override\`. Calling through base reference runs child implementation.

\`\`\`csharp
Shape s = new Circle { Radius = 5 };
Console.WriteLine(s.Area()); // Circle's Area at runtime
\`\`\`

### \`new\` keyword (hiding, not overriding)
If parent method is not virtual, child can \`new\` hide it — no runtime polymorphism; base reference calls parent version. Avoid in domain code; use override when possible.
      `,
      commonMistakes: [
        'Changing only return type to overload — invalid in C#.',
        'Using new instead of override and expecting polymorphism.',
        'Forgetting virtual on base — override will not compile.',
      ],
      bestPractices: [
        'Use override for intentional polymorphic behavior.',
        'Keep overloads readable — different intent, not tiny parameter tweaks.',
        'Document when new hides a method (rare).',
      ],
      interviewQs: [
        {
          q: 'Difference between method overloading and overriding?',
          a: 'Overloading: same name, different parameters, same class, resolved at compile time. Overriding: same signature, parent virtual + child override, resolved at runtime based on actual object type. Overloading is convenience; overriding is polymorphism.',
          bangla: 'Overloading = compile time, different params; Overriding = runtime, virtual/override, same signature।',
          difficulty: 'junior',
        },
        {
          q: 'What is runtime polymorphism?',
          a: 'A variable typed as Base can hold a Derived instance. When you call a virtual method, the runtime dispatches to Derived override. This enables plug-in behavior: List<Shape> each calling Area() gets the correct implementation without if/else type checks.',
          bangla: 'Base reference-এ Derived object — virtual method call করলে runtime-এ Derived version চলে; if/else type check লাগে না।',
          difficulty: 'junior',
        },
        {
          q: 'virtual vs override vs new?',
          a: 'virtual on base allows override in child. override replaces virtual implementation with polymorphism. new hides a non-virtual member — no polymorphism; only useful when you cannot change the base class. Prefer virtual/override for extensibility.',
          bangla: 'virtual = override allowed; override = runtime polymorphism; new = hide, polymorphism নেই — override prefer করুন।',
          difficulty: 'mid',
        },
      ],
      practice: 'Implement IPayment with Pay(); Bkash and Card override/hide appropriately and demonstrate runtime dispatch.',
      code: `public class Animal
{
    public virtual string Speak() => "...";
}

public class Dog : Animal
{
    public override string Speak() => "Woof";
}

Animal a = new Dog();
Console.WriteLine(a.Speak()); // Woof — runtime polymorphism`,
    },
    {
      topic: 'Abstraction — Abstract Classes & Interfaces',
      difficulty: 'junior',
      english: 'Abstraction exposes what an object does, not how. Abstract classes and interfaces define contracts; concrete classes provide implementations. This is the bridge to SOLID and testable design.',
      bangla: 'Abstraction = কী করবে দেখায়, কীভাবে করবে লুকায়। Abstract class ও interface contract; concrete class implementation — SOLID ও testable design-এর ভিত্তি।',
      details: `
### Abstraction in practice
- **Abstract class:** can have abstract members (no body) + concrete shared code
- **Interface:** pure contract (what capabilities a type has)
- **Concrete class:** full implementation you can \`new\`

### Abstract class rules
- Cannot instantiate \`new AbstractShape()\`
- Can have fields, constructors, concrete methods
- Child must implement all abstract members

### Interface rules (C#)
- A class can implement **many** interfaces
- No instance fields (before C# 8 default members were rare)
- Naming: \`IRepository\`, \`IPaymentGateway\`

### Abstraction vs Encapsulation
| | Encapsulation | Abstraction |
| :--- | :--- | :--- |
| **Focus** | Hide internal state | Hide complexity, show essentials |
| **Example** | private _balance | \`IPayment.Pay()\` without knowing Stripe details |
      `,
      commonMistakes: [
        'Creating interface for every class without a second implementation.',
        'Putting business logic inside interface default methods in app code.',
        'Using abstract class when only contract is needed.',
      ],
      bestPractices: [
        'Program to interfaces (\`IPayment payment\`) not concretions.',
        'Abstract class when subclasses share state + code; interface for capability.',
        'Keep interfaces small (ISP).',
      ],
      interviewQs: [
        {
          q: 'What is abstraction in OOP?',
          a: 'Abstraction simplifies complex systems by exposing only essential features. Users of IPaymentService call Pay() without knowing card tokenization or gateway HTTP details. It reduces cognitive load and allows swapping implementations (Bkash vs Stripe) without changing callers.',
          bangla: 'Abstraction = শুধু essential feature দেখানো — Pay() call, ভিতরে Stripe/Bkash hidden; implementation swap সহজ।',
          difficulty: 'junior',
        },
        {
          q: 'Can you instantiate an abstract class?',
          a: 'No. Compiler error on new AbstractClass(). You use abstract types as references holding concrete subclasses. Abstract classes may still have constructors called by derived classes via base().',
          bangla: 'Abstract class new করা যায় না — concrete subclass দিয়ে reference hold করা যায়।',
          difficulty: 'junior',
        },
        {
          q: 'Encapsulation vs abstraction — difference?',
          a: 'Encapsulation hides data inside a class (private fields, public properties). Abstraction hides implementation complexity at a higher level (interface hides payment provider). Encapsulation is class-level; abstraction is design-level contract between components.',
          bangla: 'Encapsulation = class-এ data hide; Abstraction = component-এ implementation hide (interface)।',
          difficulty: 'mid',
        },
      ],
      practice: 'Define INotifier with Send(); implement EmailNotifier and SmsNotifier; inject INotifier into OrderService.',
      code: `public interface INotifier
{
    Task SendAsync(string to, string message);
}

public abstract class NotifierBase : INotifier
{
    protected abstract string Channel { get; }
    public abstract Task SendAsync(string to, string message);
}

public class EmailNotifier : NotifierBase
{
    protected override string Channel => "Email";
    public override Task SendAsync(string to, string message) =>
        Task.CompletedTask; // send via SMTP
}`,
    },
    {
      topic: 'Composition vs Inheritance & Object Fundamentals',
      difficulty: 'mid',
      english: 'Composition (has-a) builds behavior by combining objects; inheritance (is-a) extends a base. Prefer composition when behavior varies independently. Also covers Object.Equals, GetHashCode, ToString, and nested types.',
      bangla: 'Composition = has-a (object combine); Inheritance = is-a (extend)। Behavior আলাদা vary করলে composition prefer। Object.Equals/GetHashCode/ToString-ও এখানে।',
      details: `
### Composition vs Inheritance
| | Inheritance (is-a) | Composition (has-a) |
| :--- | :--- | :--- |
| **Relationship** | Manager **is an** Employee | Car **has an** Engine |
| **Flexibility** | Fixed hierarchy | Swap parts at runtime |
| **Example** | \`class Manager : Employee\` | \`class OrderService { private IPayment _pay; }\` |

**Rule:** "Favor composition over inheritance" — Strategy, Decorator use composition.

### Object class (System.Object)
Every type inherits Object:
- \`ToString()\` — string representation (override in domain types)
- \`Equals(object)\` — value/reference equality (override with GetHashCode)
- \`GetHashCode()\` — hash for dictionaries (must match Equals)
- \`GetType()\` — runtime type info

### Equality patterns
- **Reference equality:** same heap object (\`ReferenceEquals\`)
- **Value equality:** same data (records do this automatically)
- Override both \`Equals\` and \`GetHashCode\` together for custom structs/classes used as keys

### Other OOP features
- **Nested class** — helper inside outer class
- **Partial class** — split one class across files (designer + hand code)
- **this** — current instance reference
      `,
      commonMistakes: [
        'Deep inheritance for every feature flag.',
        'Override Equals without GetHashCode — Dictionary breaks.',
        'Using inheritance to reuse a single method from unrelated type.',
      ],
      bestPractices: [
        'Inject dependencies (composition) instead of inheriting utility base classes.',
        'Use records for value-based equality DTOs.',
        'Override ToString on entities for logging readability.',
      ],
      interviewQs: [
        {
          q: 'Composition vs inheritance — when use which?',
          a: 'Use inheritance when there is a stable is-a relationship and shared implementation (Animal → Dog). Use composition when you combine behaviors (OrderService has IPayment, ILogger). Composition avoids fragile base classes and allows swapping implementations via DI.',
          bangla: 'is-a + shared code = inheritance; has-a + swap behavior = composition — DI-তে composition বেশি flexible।',
          difficulty: 'mid',
        },
        {
          q: 'Why override GetHashCode when you override Equals?',
          a: 'Dictionary and HashSet use hash codes for bucketing. If two equal objects return different hash codes, lookups fail or degrade to linear search. Contract: if a.Equals(b) then a.GetHashCode() == b.GetHashCode().',
          bangla: 'Equals override করলে GetHashCode-ও override — না হলে Dictionary/HashSet lookup ভুল হয়।',
          difficulty: 'mid',
        },
        {
          q: 'What is the is-a vs has-a relationship?',
          a: 'is-a is inheritance: a Square is a Shape. has-a is composition: an Employee has a Address object. Misusing is-a (Stack : List) exposes wrong API and violates LSP. has-a keeps boundaries clear.',
          bangla: 'is-a = inherit; has-a = field হিসেবে অন্য object — Stack : List ভুল is-a উদাহরণ।',
          difficulty: 'junior',
        },
      ],
      practice: 'Replace a NotificationSender : EmailSender inheritance with composition using INotifier injected.',
      code: `// Composition — preferred
public class OrderService
{
    private readonly IPayment _payment;
    private readonly INotifier _notifier;

    public OrderService(IPayment payment, INotifier notifier)
    {
        _payment = payment;
        _notifier = notifier;
    }
}

// Value equality (manual)
public record EmployeeId(int Value);
// record gives Equals/GetHashCode/ToString free`,
    },
    {
      topic: "SOLID Principles",
      english: "SOLID principles turn OOP pillars into maintainable design. Seniors must explain not just what they are, but how they avoid technical debt.",
      bangla: "SOLID = OOP-কে maintainable design-এ রূপ দেয়। ইন্টারভিউতে প্রতিটা principle-এর মানে ও practical example জানতে চায়।",
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
    },
    {
      topic: "Value Types vs Reference Types, Stack vs Heap, Boxing",
      difficulty: 'senior',
      english: "Value types (struct, enum, primitive) copy by value. Reference types (class, record class, array, delegate) copy the reference. Stack holds frames and many locals; the heap holds objects the GC manages. Boxing allocates a heap wrapper for a value type when it is treated as object or an interface — a silent allocation that shows up in hot loops and high-RPS APIs.",
      bangla: "ভ্যালু টাইপ কপি হয়, রেফারেন্স টাইপ শুধু পয়েন্টার কপি হয়। Boxing মানে struct কে object হিসেবে heap এ তোলা — হট পাথে ব্যয়বহুল।",
      details: `
| Concept | Lives where | Copy semantics | GC |
| :--- | :--- | :--- | :--- |
| Local \`int\` / small struct | Stack (usually) | Full copy | No |
| Field of a class | Heap with the object | Copy of the field value | Yes (object) |
| Class instance | Heap | Copy of reference | Yes |
| Boxed struct | Heap | New wrapper object | Yes |

### Nullable, strings, StringBuilder
- \`T?\` for value types is \`Nullable<T>\` — still a value type.
- Strings are immutable reference types; concatenation in a loop allocates. Use \`StringBuilder\` or \`string.Create\` / interpolation for fewer allocations.
- \`Span<T>\` / \`ReadOnlySpan<T>\` / \`Memory<T>\` avoid allocations when slicing buffers. Span cannot be stored on the heap (ref struct).
      `,
      commonMistakes: [
        'Mutating a struct retrieved from a list (you mutated a copy).',
        'Using struct as a dictionary key without fixing Equals/GetHashCode.',
        'Boxing in LINQ: list of structs cast to IEnumerable<object>.',
      ],
      bestPractices: [
        'Keep structs small, immutable, and under ~16 bytes when they are copied often.',
        'Use records for DTOs; classes for identity-bearing entities.',
        'Profile allocations with BenchmarkDotNet / dotnet-trace before micro-optimizing.',
      ],
      interviewQs: [
        {
          q: 'Where does a struct live if it is a field of a class?',
          a: 'On the heap, inline inside the object. Stack vs heap is not "structs always stack". The containing object is heap-allocated; the struct memory is part of that object layout. Locals may be stack-allocated or enregistered. Boxing is a separate heap allocation that wraps the value.',
          bangla: 'ক্লাসের ফিল্ড হলে struct হিপের ভিতরেই থাকে — সব struct স্ট্যাকে নয়।',
          followUp: 'What happens if that struct implements an interface and you pass it as the interface type?',
          difficulty: 'senior',
        },
        {
          q: 'Why is boxing expensive in a high-throughput API?',
          a: 'Each box is a heap allocation plus later GC. In a loop over value types stored as object or non-generic collections, you allocate per element. Generics were invented partly to avoid this. Today, object-based APIs, non-generic ArrayList, and some interface calls on structs still box.',
          bangla: 'প্রতিটা box একটি heap allocation — হট লুপে GC চাপ বাড়ায়।',
          difficulty: 'senior',
        },
      ],
      practice: 'Write a benchmark: concatenating 10_000 strings with + vs StringBuilder vs string.Join.',
      code: `int n = 42;
object boxed = n;              // heap allocation
int unboxed = (int)boxed;

ReadOnlySpan<char> slice = "order-123".AsSpan(6); // no string alloc
var sb = new StringBuilder(256);
sb.Append("order-").Append(123);`,
    },
    {
      topic: "IDisposable, Finalizers, Span, and Collection Interfaces",
      difficulty: 'senior',
      english: "IDisposable is for deterministic cleanup of unmanaged or scarce resources (sockets, files, DbContext). Finalizers are a last-chance non-deterministic backup and should be rare. await using is IAsyncDisposable. Collection interfaces communicate intent: IEnumerable (forward-only, maybe deferred), IReadOnlyList (indexed, no mutate), ICollection (mutate), IList (index + mutate). Yield return builds an iterator state machine — deferred, like LINQ.",
      bangla: "IDisposable ডিটারমিনিস্টিক ক্লিনআপ। Finalizer শেষ অবলম্বন। কালেকশন ইন্টারফেস দিয়ে ইন্টেন্ট প্রকাশ করুন — IEnumerable মানেই লিস্ট নয়।",
      details: `
| Interface | Meaning | Senior use |
| :--- | :--- | :--- |
| IEnumerable<T> | Can be enumerated | May be deferred / multiple-enum trap |
| IQueryable<T> | Expression tree for a provider | EF Core — do not enumerate too early |
| IReadOnlyCollection<T> | Count, no mutate | Return from services |
| IReadOnlyList<T> | Indexer | Prefer over List in public APIs |
| ICollection<T> | Add/Remove | Internal mutation |
| IList<T> | Index + mutate | Rarely needed as a parameter |

GC generations: Gen0 short-lived, Gen1, Gen2 long-lived, LOH for large objects (~85KB+). Finalizers delay collection (f-reachable queue).
      `,
      commonMistakes: [
        'Implementing a finalizer without IDisposable (or vice versa without GC.SuppressFinalize).',
        'Returning IQueryable from a repository and then composing in the controller after the context is disposed.',
        'Enumerating IEnumerable twice (double SQL or double HTTP).',
      ],
      bestPractices: [
        'DbContext and HttpClient (via IHttpClientFactory) must be disposed/owned correctly.',
        'Prefer IAsyncDisposable for async cleanup (e.g. flushing).',
        'Use yield only when lazy streaming is actually needed.',
      ],
      interviewQs: [
        {
          q: 'IDisposable vs finalizer — when do you need each?',
          a: 'IDisposable is the contract callers use with using. A finalizer only exists if you wrap true unmanaged resources and need a safety net if Dispose was forgotten. Most application code should never write a finalizer. SafeHandle exists so you usually do not write one. Forgetting Dispose on DbContext leaks connection pool entries — that is a production outage, not a trivia answer.',
          bangla: 'using দিয়ে Disposeই মূল পথ। Finalizer প্রায় কখনোই অ্যাপ কোডে লিখবেন না — DbContext না ডিসপোজ করলে কানেকশন পুল ফুরায়।',
          followUp: 'What is a captive DbContext and how does it relate to Dispose?',
          difficulty: 'senior',
        },
      ],
      practice: 'Implement IAsyncDisposable on a wrapper that flushes a buffer then disposes an inner stream.',
      code: `public sealed class ReportBuffer : IAsyncDisposable
{
    private readonly Stream _stream;
    public ReportBuffer(Stream stream) => _stream = stream;

    public async ValueTask DisposeAsync()
    {
        await _stream.FlushAsync();
        await _stream.DisposeAsync();
    }
}

IReadOnlyList<Order> GetOrders() => _orders; // intent: do not mutate`,
    },
    {
      topic: "Exception Handling and Pattern Matching",
      difficulty: 'mid',
      english: "Exceptions are for exceptional failures, not control flow. Catch specific types, never swallow. In ASP.NET Core, map exceptions to ProblemDetails in middleware — do not leak stack traces. Pattern matching (switch expressions, property patterns, list patterns) replaces fragile type-check chains and is a common C# interview topic alongside records.",
      bangla: 'এক্সেপশন কন্ট্রোল ফ্লো নয়। স্পেসিফিক ক্যাচ, সোয়ালো করবেন না। API তে ProblemDetails।',
      details: `
### Rules seniors follow
- Do not catch Exception unless at a boundary (middleware, worker loop).
- Rethrow with \`throw;\` not \`throw ex;\` (preserve stack).
- Use Result/ProblemDetails for expected business failures (insufficient funds) vs exceptions for bugs and infrastructure failure.
- \`when\` filters on catch clauses.
      `,
      commonMistakes: [
        'catch (Exception) { } empty — hides production bugs.',
        'throw ex; resetting the stack trace.',
        'Using exceptions for "user not found" on a hot GET path.',
      ],
      bestPractices: [
        'Fail fast on invariant violations; return 4xx for client mistakes.',
        'Log with exception object as first argument so Serilog captures the stack.',
        'Use switch expressions for closed discriminated unions / status codes.',
      ],
      interviewQs: [
        {
          q: 'Should "entity not found" be an exception?',
          a: 'Usually no for a public GET. Return 404 via typed results or a Result type. Exceptions are expensive and imply a bug. Use exceptions when the caller cannot reasonably continue (broken invariant, failed infrastructure). A repository used by many hosts might throw to keep the domain pure — then the API layer maps to 404. Be consistent and explain the boundary.',
          bangla: 'পাবলিক GET এ 404 রিটার্ন করুন। এক্সেপশন ব্যয়বহুল এবং বাগ বোঝায় — ইনফ্রা ফেইলিউরে ব্যবহার করুন।',
          difficulty: 'senior',
        },
      ],
      practice: 'Rewrite a nested if-else status mapper as a switch expression with property patterns.',
      code: `string Describe(Order o) => o switch
{
    { Status: OrderStatus.Paid, Total: > 10_000 } => "high-value paid",
    { Status: OrderStatus.Paid } => "paid",
    { Status: OrderStatus.Cancelled } => "cancelled",
    _ => "open"
};

try { await _db.SaveChangesAsync(ct); }
catch (DbUpdateConcurrencyException ex)
{
    _logger.LogWarning(ex, "Concurrency conflict on order {Id}", id);
    throw;
}`,
    }
  ],
  quickRevision: {
    concepts: [
      'Four pillars: Encapsulation, Abstraction, Inheritance, Polymorphism',
      'Overloading (compile) vs Overriding (runtime virtual/override)',
      'Composition has-a vs Inheritance is-a',
      'Access modifiers: public, private, protected, internal',
      'SOLID with a real example each',
      'Interface vs abstract class (and C# 8 defaults)',
      'Value vs reference, boxing',
      'GC generations and LOH',
      'IDisposable vs finalizer',
      'Records for DTOs',
      'async all the way',
      'Generics avoid boxing',
      'Span for slicing without alloc',
      'Exceptions at boundaries, not for 404s',
    ],
    questions: [
      'Class vs object?',
      'Encapsulation vs abstraction?',
      'Overloading vs overriding?',
      'virtual vs override vs new?',
      'Composition vs inheritance?',
      'DIP vs DI?',
      'When abstract class over interface?',
      'Where does a struct field of a class live?',
      'Why is boxing expensive?',
      'IDisposable vs finalizer?',
      'Why records for DTOs?',
      'What is a captive dependency?',
      'yield vs returning a List?',
      'IEnumerable vs IReadOnlyList as a return type?',
      'throw vs throw ex?',
    ],
    mistakes: [
      'God classes violating SRP',
      'NotImplementedException in overrides (LSP)',
      'Huge mutable structs',
      'Empty catch blocks',
      'Treating IEnumerable as a materialized list',
    ],
    scenarios: [
      'API allocations spike after a "simple" LINQ change (boxing)',
      'Connection pool exhausted — DbContext not disposed',
      'Equals broken on a struct dictionary key',
      'Memory grows — finalizers / LOH fragmentation',
      'Need to add a method to a published interface',
    ],
  },
  revisionSummary: `
- **OOP Pillars**: Encapsulation (hide data), Abstraction (hide complexity), Inheritance (is-a reuse), Polymorphism (one interface, many forms).
- **C# Mastery** requires balance between syntax knowledge and runtime understanding.
- **Memory**: Know the difference between Managed (GC) and Unmanaged (IDisposable) resources.
- **Async**: Always go "Async all the way" to avoid deadlocks.
- **OOP**: SOLID is not a rule, but a guide to prevent spaghetti code.
- **Types**: Use Records for DTOs, Classes for business logic, and Structs sparingly.
  `,
  summary: "C# ও OOP-এ ভালো করতে চার pillar (Encapsulation, Abstraction, Inheritance, Polymorphism), SOLID, access modifier, composition vs inheritance, এবং memory/async জানতে হবে।"
};
