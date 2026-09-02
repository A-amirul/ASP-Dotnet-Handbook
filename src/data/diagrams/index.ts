import type { Diagram } from '../types';

export const DI_FLOW_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'Dependency Injection flow', bn: 'Dependency Injection প্রবাহ' },
  content: `flowchart TB
    subgraph without [Without DI]
      C1[Controller] -->|new| S1[Service]
      S1 -->|new| R1[Repository]
    end
    subgraph withDI [With DI]
      Container[DI Container] -->|injects| C2[Controller]
      Container -->|injects| S2[Service]
      Container -->|injects| R2[Repository]
    end`,
  caption: {
    en: 'Without DI, classes create their own dependencies (tight coupling). With DI, the container builds and injects the graph.',
    bn: 'DI ছাড়া class নিজে dependency তৈরি করে (tight coupling)। DI-তে container গ্রাফ তৈরি করে inject করে।',
  },
};

export const DI_LIFETIMES_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'Service lifetimes in ASP.NET Core', bn: 'ASP.NET Core-এ Service Lifetime' },
  content: `flowchart LR
    Request[HTTP Request] --> Scope[Scoped Scope]
    Scope --> Db[DbContext Scoped]
    Scope --> Svc[Business Service Scoped]
    App[Application] --> Singleton[Singleton Cache]
    Op[Each operation] --> Transient[Transient Validator]`,
  caption: {
    en: 'Singleton lives for app lifetime. Scoped lives per request. Transient is created every time it is requested.',
    bn: 'Singleton পুরো app জুড়ে। Scoped প্রতি request-এ। Transient প্রতিবার নতুন তৈরি হয়।',
  },
};

export const ASPNET_PIPELINE_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'ASP.NET Core request pipeline', bn: 'ASP.NET Core Request Pipeline' },
  content: `flowchart TB
    Client[Client] --> Kestrel[Kestrel]
    Kestrel --> MW1[Exception Middleware]
    MW1 --> MW2[Auth Middleware]
    MW2 --> MW3[Routing]
    MW3 --> MW4[Endpoints / Controller]
    MW4 --> Response[Response]`,
  caption: {
    en: 'Each middleware can inspect or modify the request before passing to the next component.',
    bn: 'প্রতিটি middleware request পরের component-এ পাঠানোর আগে দেখতে বা পরিবর্তন করতে পারে।',
  },
};

export const EF_DBCONTEXT_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'DbContext lifecycle per request', bn: 'প্রতি Request-এ DbContext জীবনচক্র' },
  content: `sequenceDiagram
    participant R as HTTP Request
    participant C as Controller
    participant D as DbContext Scoped
    participant DB as Database
    R->>C: GET /orders
    C->>D: Query orders
    D->>DB: SELECT
    DB-->>D: Rows
    D-->>C: Entities tracked
    C-->>R: JSON response
    Note over D: Disposed end of request`,
  caption: {
    en: 'DbContext is Scoped — one instance per HTTP request, then disposed.',
    bn: 'DbContext Scoped — প্রতি HTTP request-এ একটি instance, শেষে dispose হয়।',
  },
};

export const WEBAPI_FLOW_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'Web API layered flow', bn: 'Web API স্তরভিত্তিক প্রবাহ' },
  content: `flowchart TB
    Client[Client / Mobile App] --> API[API Controller]
    API --> Service[Service Layer]
    Service --> Repo[Repository]
    Repo --> EF[EF Core DbContext]
    EF --> DB[(SQL Database)]`,
  caption: {
    en: 'Controller handles HTTP. Service holds business rules. Repository talks to the database.',
    bn: 'Controller HTTP সামলায়। Service-এ business rule। Repository database-এর সাথে কথা বলে।',
  },
};

export const JWT_FLOW_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'JWT authentication flow', bn: 'JWT Authentication প্রবাহ' },
  content: `sequenceDiagram
    participant U as User
    participant API as API
    participant Auth as Auth Service
    U->>API: POST login email password
    API->>Auth: Validate credentials
    Auth-->>API: Valid user
    API-->>U: access_token plus refresh_token
    U->>API: GET api orders Bearer token
    API-->>U: 200 OK data`,
  caption: {
    en: 'User logs in, receives JWT, then sends it in the Authorization header for protected APIs.',
    bn: 'User login করে JWT পায়, protected API-তে Authorization header-এ token পাঠায়।',
  },
};

export const CLEAN_ARCH_DIAGRAM: Diagram = {
  type: 'ascii',
  title: { en: 'Clean Architecture layers', bn: 'Clean Architecture স্তর' },
  content: `┌─────────────────────────────────────┐
│         Presentation (API/UI)         │
├─────────────────────────────────────┤
│      Application (Use Cases)          │
├─────────────────────────────────────┤
│         Domain (Entities)             │
├─────────────────────────────────────┤
│    Infrastructure (EF, Email, etc.)   │
└─────────────────────────────────────┘
         Dependencies point INWARD →`,
  caption: {
    en: 'Inner layers never depend on outer layers. Infrastructure implements interfaces defined in Domain/Application.',
    bn: 'ভিতরের layer কখনো বাইরের layer-এ depend করে না। Infrastructure Domain-এর interface implement করে।',
  },
};

export const ASYNC_FLOW_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'Async await flow', bn: 'Async/Await প্রবাহ' },
  content: `sequenceDiagram
    participant M as Main Thread
    participant T as Task
    participant IO as Database IO
    M->>T: await GetOrdersAsync
    T->>IO: Start query non blocking
    Note over M: Thread free for other work
    IO-->>T: Results ready
    T-->>M: Resume after await`,
  caption: {
    en: 'await frees the thread while waiting for I/O. The thread is not blocked.',
    bn: 'await I/O-এর জন্য অপেক্ষা করতে thread block করে না — thread অন্য কাজ করতে পারে।',
  },
};

export const LINQ_DEFERRED_DIAGRAM: Diagram = {
  type: 'ascii',
  title: { en: 'LINQ deferred vs immediate', bn: 'LINQ Deferred vs Immediate' },
  content: `Deferred (IEnumerable/LINQ to Objects):
  var q = list.Where(x => x > 5);  // query built, NOT run
  var result = q.ToList();         // NOW query runs

Immediate (IQueryable/EF):
  var q = db.Orders.Where(o => o.Total > 100); // expression tree
  var result = q.ToList();                      // SQL generated + executed`,
  caption: {
    en: 'Deferred execution builds the query first and runs it when you enumerate or call ToList.',
    bn: 'Deferred execution আগে query তৈরি করে, enumerate বা ToList() করলে তখন চালায়।',
  },
};

export const GC_GENERATIONS_DIAGRAM: Diagram = {
  type: 'ascii',
  title: { en: '.NET GC generations', bn: '.NET GC Generation' },
  content: `Gen 0  → short-lived objects (local variables)
Gen 1  → buffer between young and old
Gen 2  → long-lived (static caches, singletons)

Survive collection → promoted to next generation`,
  caption: {
    en: 'Most objects die in Gen 0. Long-lived objects reach Gen 2 and are collected less often.',
    bn: 'বেশিরভাগ object Gen 0-এ মারা যায়। দীর্ঘজীবী object Gen 2-তে যায়, কম collect হয়।',
  },
};

export const CQRS_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'CQRS pattern', bn: 'CQRS প্যাটার্ন' },
  content: `flowchart LR
    CMD[Command Write] --> WModel[Write Model]
    WModel --> WDB[(Write DB)]
    QRY[Query Read] --> RModel[Read Model]
    RModel --> RDB[(Read DB / Cache)]`,
  caption: {
    en: 'Commands change state. Queries read optimized views. Often separate models for read and write.',
    bn: 'Command state পরিবর্তন করে। Query optimized view পড়ে। Read ও Write আলাদা model হতে পারে।',
  },
};

export const REPOSITORY_PATTERN_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'Repository pattern flow', bn: 'Repository Pattern প্রবাহ' },
  content: `flowchart TB
    Service[OrderService] --> IRepo[IOrderRepository]
    IRepo --> EfRepo[EfOrderRepository]
    EfRepo --> Ctx[DbContext]
    Ctx --> DB[(Database)]`,
  caption: {
    en: 'Service depends on IOrderRepository, not DbContext directly — easier to test and swap storage.',
    bn: 'Service সরাসরি DbContext নয়, IOrderRepository-এ depend করে — test ও swap সহজ।',
  },
};

export const CACHE_ASIDE_DIAGRAM: Diagram = {
  type: 'mermaid',
  title: { en: 'Cache-aside pattern', bn: 'Cache-Aside প্যাটার্ন' },
  content: `sequenceDiagram
    participant App as App
    participant Cache as Redis
    participant DB as Database
    App->>Cache: Get key
    alt cache hit
      Cache-->>App: value
    else cache miss
      App->>DB: Query
      DB-->>App: data
      App->>Cache: Set key
    end`,
  caption: {
    en: 'App checks cache first. On miss, load from DB and populate cache.',
    bn: 'App আগে cache দেখে। না পেলে DB থেকে load করে cache-এ রাখে।',
  },
};

export const MIDDLEWARE_CHAIN_ASCII: Diagram = {
  type: 'ascii',
  title: { en: 'Middleware chain example', bn: 'Middleware chain উদাহরণ' },
  content: `Request  →  Logging  →  Auth  →  Routing  →  Controller
Response ←  Logging  ←  Auth  ←  Routing  ←  Controller`,
  caption: {
    en: 'Middleware runs in order on the way in, and reverse order on the way out.',
    bn: 'Middleware request-এ যাওয়ার সময় order-এ, response-এ ফেরার সময় reverse order-এ চলে।',
  },
};

export const SOLID_DIAGRAM: Diagram = {
  type: 'ascii',
  title: { en: 'SOLID principles overview', bn: 'SOLID Principles সংক্ষিপ্ত' },
  content: `S - Single Responsibility   → one class, one reason to change
O - Open/Closed               → extend via new code, not editing old
L - Liskov Substitution       → subclass must honor base contract
I - Interface Segregation     → small focused interfaces
D - Dependency Inversion      → depend on abstractions`,
  caption: {
    en: 'SOLID helps you write maintainable, testable object-oriented code.',
    bn: 'SOLID maintainable ও testable OOP code লেখায় সাহায্য করে।',
  },
};

export const COMPILATION_FLOW: Diagram = {
  type: 'mermaid',
  title: { en: 'C# compilation to CLR', bn: 'C# Compilation থেকে CLR' },
  content: `flowchart LR
    CS[C# Source .cs] --> Roslyn[Roslyn Compiler]
    Roslyn --> IL[IL + Metadata]
    IL --> CLR[CLR JIT]
    CLR --> Native[Native Machine Code]`,
  caption: {
    en: 'C# compiles to IL. At runtime, JIT compiles IL to native code for your CPU.',
    bn: 'C# IL-এ compile হয়। Runtime-এ JIT CPU-র জন্য native code তৈরি করে।',
  },
};
