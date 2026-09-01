import type { HandbookSection } from './types';
import {
  ASPNET_PIPELINE_DIAGRAM,
  ASYNC_FLOW_DIAGRAM,
  CACHE_ASIDE_DIAGRAM,
  CLEAN_ARCH_DIAGRAM,
  COMPILATION_FLOW,
  DI_FLOW_DIAGRAM,
  DI_LIFETIMES_DIAGRAM,
  EF_DBCONTEXT_DIAGRAM,
  GC_GENERATIONS_DIAGRAM,
  JWT_FLOW_DIAGRAM,
  LINQ_DEFERRED_DIAGRAM,
  MIDDLEWARE_CHAIN_ASCII,
  REPOSITORY_PATTERN_DIAGRAM,
  SOLID_DIAGRAM,
  WEBAPI_FLOW_DIAGRAM,
  CQRS_DIAGRAM,
} from './diagrams';
import { codingModulePatches } from './codingModulePatches';

/** Merged onto sections by id or topic slug at render time */
export const bilingualPatches: Record<string, Partial<HandbookSection>> = {
  'ioc-vs-di-vs-dip-and-constructor-injection': {
    id: 'ioc-vs-di-vs-dip-and-constructor-injection',
    explanation: {
      what: {
        en: '**Dependency Injection (DI)** is a technique where a class receives its dependencies from outside instead of creating them with `new`. **Inversion of Control (IoC)** means something else builds the object graph. **Dependency Inversion (DIP)** is the SOLID rule: depend on interfaces, not concrete classes.',
        bn: '**Dependency Injection (DI)** হলো এমন একটি কৌশল যেখানে একটি class নিজে `new` দিয়ে dependency তৈরি না করে বাইরে থেকে গ্রহণ করে। **IoC** মানে object graph বাইরে তৈরি হয়। **DIP** হলো SOLID নীতি: concrete class নয়, interface-এ depend করুন।',
      },
      why: {
        en: 'Without DI, every class creates its own dependencies. That makes unit testing hard (you cannot swap a real database for a fake), couples business logic to SQL Server, and hides object lifetimes (e.g. DbContext disposed too early).',
        bn: 'DI ছাড়া প্রতিটি class নিজে dependency তৈরি করে — unit test কঠিন (fake database লাগানো যায় না), business logic SQL Server-এ আটকে যায়, DbContext-এর মতো lifetime ভুল হয়।',
      },
      how: {
        en: '1. Define an interface (`IOrderStore`). 2. Register the implementation in `Program.cs` (`AddScoped<IOrderStore, EfOrderStore>()`). 3. Inject via constructor (`OrderService(IOrderStore store)`). 4. The DI container resolves the graph when a request arrives.',
        bn: '1. Interface তৈরি করুন (`IOrderStore`)। 2. `Program.cs`-এ register করুন। 3. Constructor-এ inject করুন। 4. Request এলে container গ্রাফ resolve করে।',
      },
      analogy: {
        en: 'Imagine a restaurant chef. **Without DI**: the chef grows vegetables, raises chickens, and makes plates — too much work. **With DI**: suppliers deliver ingredients (dependencies) each morning. The chef only cooks (business logic).',
        bn: 'রাঁধুনির কথা ভাবুন। **DI ছাড়া**: রাঁধুনি নিজে সবজি চাষ করে, মুরগি পালন করে — অসম্ভব। **DI-তে**: সকালে market থেকে সরবরাহ (dependency) আসে, রাঁধুনি শুধু রান্না করে (business logic)।',
      },
      realWorld: {
        en: 'In ASP.NET Core Web API, `OrderController` receives `IOrderService` via constructor. You never write `new OrderService(new SqlRepository())` inside the controller — the framework injects it per request.',
        bn: 'ASP.NET Core Web API-তে `OrderController` constructor-এ `IOrderService` পায়। Controller-এর ভিতরে `new OrderService(...)` লেখেন না — framework প্রতি request-এ inject করে।',
      },
    },
    diagram: DI_FLOW_DIAGRAM,
    comparisonTable: {
      en: `| Term | What it is | Example |
| :--- | :--- | :--- |
| **DIP** | Design principle | Service uses \`IStore\`, not \`SqlStore\` |
| **IoC** | Who builds objects | Container builds the graph, not your class |
| **DI** | How dependencies arrive | Constructor parameters |`,
      bn: `| শব্দ | কী | উদাহরণ |
| :--- | :--- | :--- |
| **DIP** | Design নীতি | Service \`IStore\` use করে, \`SqlStore\` নয় |
| **IoC** | কে object তৈরি করে | Container গ্রাফ তৈরি করে |
| **DI** | dependency কীভাবে আসে | Constructor parameter |`,
    },
    codeExplanation: {
      en: '- `IInvoiceCalculator` — abstraction (DIP)\n- Constructor parameters — DI\n- `AddScoped` in registration — IoC container manages creation',
      bn: '- `IInvoiceCalculator` — abstraction (DIP)\n- Constructor parameter — DI\n- `AddScoped` — container তৈরি ও inject করে (IoC)',
    },
    commonMistakes: [
      {
        en: 'Calling `GetRequiredService` inside business methods to hide a long constructor list.',
        bn: 'Constructor লম্বা হলে business method-এ `GetRequiredService` দিয়ে dependency লুকানো — এটা service locator anti-pattern।',
      },
      {
        en: 'Creating an interface for every DTO or value object.',
        bn: 'প্রতিটি DTO বা value object-এর জন্য interface বানানো — DIP-এর ভুল ব্যবহার।',
      },
    ],
    bestPractices: [
      {
        en: 'Keep `Program.cs` as the only composition root that knows concrete types.',
        bn: 'Concrete class শুধু `Program.cs` (composition root)-এ register করুন।',
      },
      {
        en: 'Inject `TimeProvider` instead of `DateTime.UtcNow` for testable time.',
        bn: 'Testable time-এর জন্য `DateTime.UtcNow` নয়, `TimeProvider` inject করুন।',
      },
    ],
  },

  'transient-scoped-singleton-and-captive-dependencies': {
    id: 'transient-scoped-singleton-and-captive-dependencies',
    explanation: {
      what: {
        en: '**Transient**: new instance every time. **Scoped**: one instance per HTTP request. **Singleton**: one instance for the entire application. **Captive dependency**: a long-lived service holds a short-lived one (e.g. Singleton holding Scoped DbContext).',
        bn: '**Transient**: প্রতিবার নতুন instance। **Scoped**: প্রতি HTTP request-এ একটি। **Singleton**: পুরো app-এ একটি। **Captive dependency**: দীর্ঘজীবী service ছোট lifetime-এর service ধরে রাখে।',
      },
      why: {
        en: 'Wrong lifetimes cause disposed DbContext errors, memory leaks, and data shared between users. Captive dependency is the #1 DI bug in production ASP.NET apps.',
        bn: 'ভুল lifetime-এ DbContext disposed error, memory leak, এক user-এর data অন্য user দেখতে পায়। Captive dependency production-এ সবচেয়ে common DI bug।',
      },
      analogy: {
        en: '**Scoped** = one waiter per table for one meal (request). **Singleton** = the restaurant manager for the whole day. If the manager keeps a waiter from table 5 all day, that waiter cannot serve new tables — that is captive dependency.',
        bn: '**Scoped** = এক টেবিলের জন্য এক waiter (এক request)। **Singleton** = পুরো দিনের manager। Manager table 5-এর waiter সারাদিন ধরে রাখলে নতুন টেবিল serve হয় না — এটাই captive dependency।',
      },
    },
    diagram: DI_LIFETIMES_DIAGRAM,
    comparisonTable: {
      en: `| Lifetime | Created | Use for | Never use for |
| :--- | :--- | :--- | :--- |
| Transient | Every resolve | Stateless helpers | Holding state across calls |
| Scoped | Per request | DbContext, Unit of Work | Singleton dependencies |
| Singleton | Once per app | Cache, config | DbContext, request state |`,
      bn: `| Lifetime | কখন তৈরি | ব্যবহার | যা করবেন না |
| :--- | :--- | :--- | :--- |
| Transient | প্রতিবার | Stateless helper | State ধরে রাখা |
| Scoped | প্রতি request | DbContext | Singleton-এ inject |
| Singleton | app-এ একবার | Cache, config | DbContext |`,
    },
  },

  'request-pipeline-middleware': {
    id: 'request-pipeline-middleware',
    explanation: {
      what: {
        en: '**Middleware** is a component in the ASP.NET Core pipeline that can inspect, modify, or short-circuit an HTTP request before it reaches your controller.',
        bn: '**Middleware** হলো ASP.NET Core pipeline-এর একটি component যা HTTP request controller-এ যাওয়ার আগে দেখতে, পরিবর্তন করতে, বা থামাতে পারে।',
      },
      why: {
        en: 'Cross-cutting concerns (logging, auth, exception handling) should not be duplicated in every controller. Middleware centralizes them in one ordered pipeline.',
        bn: 'Logging, auth, exception handling প্রতিটি controller-এ duplicate করা উচিত নয়। Middleware এগুলো এক জায়গায় order-এ handle করে।',
      },
      how: {
        en: 'Request enters middleware 1 → 2 → 3 → Controller. Response exits Controller → 3 → 2 → 1. Each middleware calls `await next()` to pass to the next component.',
        bn: 'Request: middleware 1 → 2 → 3 → Controller। Response: reverse order। প্রতিটি middleware `await next()` call করে পরেরটিতে পাঠায়।',
      },
      analogy: {
        en: 'Airport security: check ID → scan bags → boarding gate. Each step can stop you or pass you forward. Middleware is the same for HTTP requests.',
        bn: 'বিমানবন্দর: ID check → bag scan → gate। প্রতিটি ধাপ আপনাকে থামাতে বা এগিয়ে পাঠাতে পারে। HTTP request-এর middleware একই রকম।',
      },
    },
    diagram: ASPNET_PIPELINE_DIAGRAM,
    callouts: [
      {
        type: 'example',
        content: {
          en: 'Custom logging middleware: log request path → `await next()` → log response status code.',
          bn: 'Custom logging middleware: request path log → `await next()` → response status log।',
        },
      },
    ],
  },

  'arrays-types-methods': {
    id: 'arrays-types-methods',
    explanation: {
      what: {
        en: 'An **array** stores multiple values of the same type in a fixed-size collection. C# has single-dimensional (`int[]`), rectangular (`int[,]`), and jagged (`int[][]`) arrays.',
        bn: '**Array** একই type-এর একাধিক value fixed-size collection-এ রাখে। C#-এ single (`int[]`), rectangular (`int[,]`), jagged (`int[][]`) array আছে।',
      },
      why: {
        en: 'Arrays are the foundation for collections. Understanding jagged vs rectangular helps you choose performance-friendly structures and avoid syntax bugs in interviews.',
        bn: 'Array collection-এর ভিত্তি। Jagged vs rectangular বুঝলে performance-friendly structure বেছে নিতে ও interview-এ syntax bug এড়াতে পারবেন।',
      },
      analogy: {
        en: '**Rectangular array** = a fixed grid spreadsheet (every row has same columns). **Jagged array** = a bookshelf where each shelf can hold a different number of books.',
        bn: '**Rectangular** = fixed grid spreadsheet (প্রতি row-এ same column)। **Jagged** = bookshelf যেখানে প্রতিটি shelf-এ আলাদা সংখ্যক বই।',
      },
    },
  },

  'dependency-injection-lifetimes-captive-dependency': {
    id: 'dependency-injection-lifetimes-captive-dependency',
    diagram: DI_LIFETIMES_DIAGRAM,
    explanation: {
      what: {
        en: 'ASP.NET Core registers services with a lifetime: Transient, Scoped, or Singleton. A captive dependency happens when a Singleton service captures a Scoped service.',
        bn: 'ASP.NET Core service register করার সময় lifetime দেয়: Transient, Scoped, Singleton। Singleton যদি Scoped service ধরে রাখে, সেটা captive dependency।',
      },
      analogy: {
        en: 'DbContext is like a shopping cart — one per customer visit (request). A Singleton cache holding that cart forever means the next customer gets the previous cart — wrong data.',
        bn: 'DbContext = shopping cart — এক customer visit (request)-এ একটি। Singleton cache সেটা সারাদিন ধরে রাখলে পরের customer আগের cart পায় — ভুল data।',
      },
    },
  },

  'senior-engineer-mindset': {
    id: 'senior-engineer-mindset',
    explanation: {
      what: {
        en: 'A **senior engineer** answers production questions with structure: What is it? Why does it exist? How does it work internally? What trade-off did you accept? What fails at 2am?',
        bn: '**সিনিয়র ইঞ্জিনিয়ার** উত্তর দেয় স্ট্রাকচারে: কী? কেন? ভিতরে কীভাবে কাজ করে? কোন trade-off নিলেন? রাত ২টায় কী ভেঙে যায়?',
      },
      why: {
        en: 'Interviewers do not hire trivia champions. They hire people who can debug, explain trade-offs, protect correctness under load, and mentor without arrogance.',
        bn: 'ইন্টারভিউয়ার trivia চায় না — যে ডিবাগ করতে পারে, trade-off বলতে পারে, লোডে correctness রক্ষা করে, অহংকার ছাড়া শেখাতে পারে তাকে নিয়োগ দেয়।',
      },
      how: {
        en: 'Use the frame: **What** (one sentence) → **Why** (problem solved) → **How** (internals) → **When NOT** → **Trade-off** → **Failure mode** → **How you would detect it** (logs, metrics, traces).',
        bn: 'ফ্রেম: **কী** (এক বাক্য) → **কেন** (সমস্যা) → **কীভাবে** (internals) → **কখন নয়** → **Trade-off** → **Failure** → **কীভাবে ধরবেন** (log, metric, trace)।',
      },
      analogy: {
        en: 'A junior chef memorizes recipes. A senior chef knows **why** salt goes in at that step, what happens if the oven is too hot, and how to fix a dish when a supplier is late — without panic.',
        bn: 'জুনিয়র রাঁধুনি রেসিপি মুখস্থ করে। সিনিয়র জানে **কেন** সেই ধাপে লবণ, ওভেন বেশি গরম হলে কী হয়, সরবরাহ দেরি হলে কীভাবে ঠিক করবে — প্যানিক ছাড়া।',
      },
      realWorld: {
        en: 'When an API slows down, a junior says "add caching." A senior asks: Is it N+1 SQL? Thread-pool starvation? Missing index? They measure first, then pick the smallest fix with the right trade-off.',
        bn: 'API ধীর হলে জুনিয়র বলে "cache লাগাও।" সিনিয়র জিজ্ঞেস করে: N+1? Thread-pool starvation? Index নেই? আগে measure, তারপর সঠিক trade-off সহ ছোট fix।',
      },
    },
    comparisonTable: {
      en: `| Layer | What you say | Example |
| :--- | :--- | :--- |
| **What** | Precise definition | "DbContext is Unit of Work + identity map" |
| **Why** | Problem it solves | "Tracking enables minimal UPDATE SQL" |
| **How** | Internals | "Snapshot vs original, DetectChanges" |
| **Trade-off** | Cost | "Tracking uses memory; AsNoTracking for reads" |
| **Failure** | Production bug | "Singleton holds disposed Scoped DbContext" |`,
      bn: `| স্তর | কী বলবেন | উদাহরণ |
| :--- | :--- | :--- |
| **কী** | স্পষ্ট সংজ্ঞা | "DbContext = Unit of Work + identity map" |
| **কেন** | সমস্যা সমাধান | "Tracking ছাড়া minimal UPDATE হয় না" |
| **কীভাবে** | Internals | "Snapshot vs original, DetectChanges" |
| **Trade-off** | খরচ | "Tracking memory খায়; read-এ AsNoTracking" |
| **Failure** | Production bug | "Singleton disposed Scoped DbContext ধরে" |`,
    },
    codeExplanation: {
      en: '- Lines 1–7: mental skeleton for any senior answer — not a script to recite verbatim\n- Step 6 (failure mode) is what separates mid from senior',
      bn: '- ১–৭ লাইন: যেকোনো সিনিয়র উত্তরের মানসিক কাঠামো — মুখস্থ স্ক্রিপ্ট নয়\n- ৬ নম্বর (failure mode) mid থেকে senior আলাদা করে',
    },
    commonMistakes: [
      {
        en: 'Answering only the definition and stopping — interviewers will ask "and then what?"',
        bn: 'শুধু সংজ্ঞা বলে থেমে যাওয়া — interviewer বলবে "তারপর?"',
      },
      {
        en: 'Name-dropping Kafka/microservices with no failure story or trade-off.',
        bn: 'Kafka/microservices নাম বলা কিন্তু failure story বা trade-off ছাড়া।',
      },
    ],
    bestPractices: [
      {
        en: 'Always end with: "The trade-off is…" and "I would verify with…"',
        bn: 'শেষে বলুন: "Trade-off হলো…" এবং "যাচাই করব…"',
      },
      {
        en: 'Prefer one real incident story over five buzzwords.',
        bn: 'পাঁচটি buzzword-এর বদলে একটি বাস্তব incident story দিন।',
      },
    ],
  },

  'ef-core-dbcontext': {
    id: 'ef-core-dbcontext',
    diagram: EF_DBCONTEXT_DIAGRAM,
    explanation: {
      what: {
        en: '**DbContext** is EF Core\'s main class. It tracks entities, generates SQL, and saves changes. It combines Unit of Work and Identity Map patterns.',
        bn: '**DbContext** EF Core-এর মূল class। Entity track করে, SQL generate করে, change save করে। Unit of Work + Identity Map pattern একসাথে।',
      },
      analogy: {
        en: 'DbContext is like a smart notebook: it remembers which rows you changed (tracking) and writes only those updates to the database when you call SaveChanges.',
        bn: 'DbContext = smart notebook — কোন row change হয়েছে মনে রাখে (tracking), SaveChanges-এ শুধু সেই update database-এ লেখে।',
      },
    },
  },

  'rest-web-api-basics': {
    id: 'rest-web-api-basics',
    diagram: WEBAPI_FLOW_DIAGRAM,
  },

  'jwt-authentication': {
    id: 'jwt-authentication',
    diagram: JWT_FLOW_DIAGRAM,
  },

  'clean-architecture-layers': {
    id: 'clean-architecture-layers',
    diagram: CLEAN_ARCH_DIAGRAM,
  },

  'repository-pattern': {
    id: 'repository-pattern',
    diagram: REPOSITORY_PATTERN_DIAGRAM,
  },

  'cqrs-pattern': {
    id: 'cqrs-pattern',
    diagram: CQRS_DIAGRAM,
  },

  'async-await-basics': {
    id: 'async-await-basics',
    diagram: ASYNC_FLOW_DIAGRAM,
  },

  'linq-deferred-execution': {
    id: 'linq-deferred-execution',
    diagram: LINQ_DEFERRED_DIAGRAM,
  },

  'garbage-collection': {
    id: 'garbage-collection',
    diagram: GC_GENERATIONS_DIAGRAM,
  },

  'redis-cache-aside': {
    id: 'redis-cache-aside',
    diagram: CACHE_ASIDE_DIAGRAM,
  },

  'solid-principles': {
    id: 'solid-principles',
    diagram: SOLID_DIAGRAM,
  },

  'csharp-compilation': {
    id: 'csharp-compilation',
    diagram: COMPILATION_FLOW,
  },

  'middleware-chain': {
    id: 'middleware-chain',
    diagram: MIDDLEWARE_CHAIN_ASCII,
  },

  'rest-api-design': {
    id: 'rest-api-design',
    explanation: {
      what: {
        en: '**REST** models your API as resources (nouns) addressed by URL. Actions are expressed with HTTP methods: GET reads, POST creates, PUT replaces, PATCH updates partially, DELETE removes. Clients should predict URLs without reading docs.',
        bn: '**REST**-এ API resource (বস্তু) হিসেবে model করা হয় — URL-এ noun। কাজ HTTP method দিয়ে: GET = পড়া, POST = তৈরি, PUT = replace, PATCH = আংশিক update, DELETE = মুছে ফেলা। ভালো API-তে client docs না পড়েই endpoint অনুমান করতে পারে।',
      },
      why: {
        en: 'Inconsistent URLs (`/getUser`, `/user/delete`) force every client to learn custom rules. REST leverages HTTP caching, proxies, and developer intuition built over decades. Public APIs without conventions become expensive to maintain and integrate.',
        bn: 'অসঙ্গত URL (`/getUser`, `/user/delete`) মানে প্রতিটি client আলাদা rule শিখবে। REST HTTP caching, proxy, ও developer-দের পরিচিত convention ব্যবহার করে — convention ছাড়া public API maintain ও integrate করা ব্যয়বহুল।',
      },
      how: {
        en: '1. Name resources with plural nouns (`/orders`). 2. Map CRUD to HTTP methods. 3. Nest related resources (`/users/1/orders`). 4. Use query params for filter/sort/page. 5. Return correct status codes (201 for POST, 204 for DELETE).',
        bn: '1. Plural noun (`/orders`)। 2. CRUD → HTTP method। 3. Nested resource (`/users/1/orders`)। 4. Filter/sort/page → query param। 5. সঠিক status code (POST = 201, DELETE = 204)।',
      },
      analogy: {
        en: 'Think of a library catalog. **REST**: shelf label = resource (`/books`), action = what you do at the desk (borrow = POST, return = DELETE). **RPC**: every task needs a custom form ("Form 7B: Cancel Reservation") — works, but not self-describing.',
        bn: 'লাইব্রেরি কল্পনা করুন। **REST**: তাকের নাম = resource (`/books`), কাজ = counter-এ কর্ম (borrow = POST)। **RPC**: প্রতিটি কাজের জন্য আলাদা ফর্ম — কাজ হয়, কিন্তু self-describing নয়।',
      },
      realWorld: {
        en: 'GitHub\'s API: `GET /repos/{owner}/{repo}/issues` — you guess the shape because it follows REST. Compare to older SOAP/RPC services where every operation was `POST /Service.asmx` with opaque XML bodies.',
        bn: 'GitHub API: `GET /repos/{owner}/{repo}/issues` — REST convention মেনে তাই URL অনুমান করা যায়। পুরনো SOAP/RPC-তে `POST /Service.asmx` + অজানা XML — integrate করা কঠিন।',
      },
    },
    comparisonTable: {
      en: `| Aspect | REST | RPC-style |
| :--- | :--- | :--- |
| **URL** | Noun: \`/users/42\` | Verb: \`/users/getById\` |
| **Action** | HTTP method (GET, POST…) | Often POST + action name in body |
| **Caching** | GET cacheable by default | Usually not cacheable |
| **Tooling** | Swagger, browsers, CDNs | Custom clients per API |
| **Best for** | Public CRUD APIs | Internal microservices, streaming |`,
      bn: `| দিক | REST | RPC-style |
| :--- | :--- | :--- |
| **URL** | Noun: \`/users/42\` | Verb: \`/users/getById\` |
| **কাজ** | HTTP method | প্রায়ই POST + body-তে action |
| **Caching** | GET default-এ cacheable | সাধারণত cache হয় না |
| **Tooling** | Swagger, browser, CDN | API অনুযায়ী custom client |
| **ভালো কখন** | Public CRUD API | Internal microservice, streaming |`,
    },
  },

  'openapi-swagger': {
    id: 'openapi-swagger',
    explanation: {
      what: {
        en: '**OpenAPI** is a YAML/JSON specification describing your API: paths, methods, schemas, auth, and status codes. **Swagger UI** renders that spec as interactive documentation where developers can try endpoints live.',
        bn: '**OpenAPI** হলো YAML/JSON specification যেখানে API-এর path, method, schema, auth, status code লেখা থাকে। **Swagger UI** সেই spec থেকে interactive documentation বানায় — developer সরাসরি endpoint test করতে পারে।',
      },
      why: {
        en: 'Without a machine-readable contract, frontend and mobile teams wait for backend, write wrong assumptions, and discover breaking changes in production. OpenAPI enables parallel development, auto SDKs, and CI checks that fail when the contract changes unexpectedly.',
        bn: 'Machine-readable contract ছাড়া frontend team backend-এর জন্য অপেক্ষা করে, ভুল assumption লেখে, production-এ breaking change খায়। OpenAPI parallel development, auto SDK, ও CI contract check দেয়।',
      },
      how: {
        en: '1. Add `AddSwaggerGen` in `Program.cs`. 2. Enable XML docs in `.csproj`. 3. Add `///` comments and `[ProducesResponseType]` on actions. 4. Configure JWT `AddSecurityDefinition`. 5. Protect or disable Swagger UI in Production.',
        bn: '1. `Program.cs`-এ `AddSwaggerGen`। 2. `.csproj`-এ XML doc enable। 3. `///` comment ও `[ProducesResponseType]`। 4. JWT `AddSecurityDefinition`। 5. Production-এ Swagger UI secure বা বন্ধ করুন।',
      },
      analogy: {
        en: 'OpenAPI is like a restaurant menu with ingredient lists and prices. Swagger UI is the tasting counter — you try a dish (endpoint) before ordering the full meal (building the client integration).',
        bn: 'OpenAPI = রেস্তোরাঁর menu (ingredient + price সহ)। Swagger UI = tasting counter — পুরো order (client integration) করার আগে dish (endpoint) চেখে দেখা।',
      },
      realWorld: {
        en: 'In ASP.NET Core, Swashbuckle reads your controllers at startup and serves `/swagger/v1/swagger.json`. NSwag can generate a TypeScript client from that same file so the frontend never hand-writes HTTP calls.',
        bn: 'ASP.NET Core-এ Swashbuckle startup-এ controller পড়ে `/swagger/v1/swagger.json` serve করে। NSwag সেই file থেকে TypeScript client generate করে — frontend hand-written HTTP call লেখে না।',
      },
    },
    comparisonTable: {
      en: `| Approach | Human docs (Wiki) | OpenAPI spec |
| :--- | :--- | :--- |
| **Format** | Prose, screenshots | Machine-readable JSON/YAML |
| **Stays in sync** | Often drifts from code | Generated from code (Swashbuckle) |
| **SDK generation** | Manual | Automatic (NSwag, AutoRest) |
| **CI contract test** | Not possible | Diff spec in pull requests |
| **Try live** | No | Swagger UI |`,
      bn: `| পদ্ধতি | Wiki documentation | OpenAPI spec |
| :--- | :--- | :--- |
| **Format** | লেখা, screenshot | Machine-readable JSON/YAML |
| **Code-এর সাথে match** | প্রায়ই পুরনো হয়ে যায় | Code থেকে generate (Swashbuckle) |
| **SDK** | হাতে লিখতে হয় | Auto (NSwag, AutoRest) |
| **CI test** | সম্ভব নয় | PR-এ spec diff |
| **Live test** | না | Swagger UI |`,
    },
  },

  'api-versioning': {
    id: 'api-versioning',
    explanation: {
      what: {
        en: '**API versioning** lets you evolve the API while old clients keep working. You expose multiple versions simultaneously (v1 and v2) and retire old versions on a published schedule.',
        bn: '**API versioning** দিয়ে API বদলানো যায় কিন্তু পুরনো client কাজ করতে থাকে। একসাথে v1 ও v2 চালান, পুরনো version published schedule অনুযায়ী retire করুন।',
      },
      why: {
        en: 'Mobile apps and partner integrations cannot update instantly. A breaking change in a live API strands users on old app versions. Versioning is how you ship improvements without forcing every consumer to redeploy the same day.',
        bn: 'Mobile app ও partner integration এক দিনে update হয় না। Live API-তে breaking change করলে পুরনো app version-এর user আটকে যায়। Versioning দিয়ে সবাই redeploy না করেই improvement ship করা যায়।',
      },
      how: {
        en: '1. Choose a strategy (URL path is simplest for public APIs). 2. Non-breaking changes stay in the current version. 3. Breaking changes get a new version. 4. Add Sunset/Deprecation headers. 5. Monitor traffic and retire when usage drops.',
        bn: '1. Strategy বেছে নিন (public API-তে URL path সহজ)। 2. Non-breaking change current version-এ। 3. Breaking change = নতুন version। 4. Sunset/Deprecation header। 5. Traffic monitor করে retire করুন।',
      },
      analogy: {
        en: 'Like a phone OS: Android 13 and 14 coexist. Apps built for 13 still run; new features ship in 14. Google announces when 13 stops getting security updates — that is your Sunset header.',
        bn: 'Phone OS-এর মতো: Android 13 ও 14 একসাথে চলে। 13-এর app কাজ করে; নতুন feature 14-এ। Security update বন্ধ হওয়ার তারিখ জানানো = আপনার Sunset header।',
      },
      realWorld: {
        en: 'Stripe versions its API with a date in the URL (`/v1/...`) and requires clients to send `Stripe-Version` header. Breaking changes never modify existing version behavior — they only appear in newer dated versions.',
        bn: 'Stripe API date-based version (`/v1/...`) + `Stripe-Version` header। Breaking change পুরনো version-এর behavior বদলায় না — শুধু নতুন version-এ আসে।',
      },
    },
    comparisonTable: {
      en: `| Strategy | Example | Cache-friendly | Easy to test in browser |
| :--- | :--- | :--- | :--- |
| **URL path** | \`/api/v2/users\` | Yes | Yes |
| **Header** | \`API-Version: 2.0\` | Harder | No (needs header tool) |
| **Query** | \`?api-version=2.0\` | Moderate | Yes |`,
      bn: `| কৌশল | উদাহরণ | Cache-friendly | Browser-এ test |
| :--- | :--- | :--- | :--- |
| **URL path** | \`/api/v2/users\` | হ্যাঁ | হ্যাঁ |
| **Header** | \`API-Version: 2.0\` | কঠিন | না (header tool লাগে) |
| **Query** | \`?api-version=2.0\` | মাঝারি | হ্যাঁ |`,
    },
  },

  'error-response-format': {
    id: 'error-response-format',
    explanation: {
      what: {
        en: '**RFC 7807 Problem Details** is the standard JSON error format: `type`, `title`, `status`, `detail`, `instance`, plus extensions like `errors` (validation) and `traceId` (log correlation). ASP.NET Core implements it with `ProblemDetails`.',
        bn: '**RFC 7807 Problem Details** standard JSON error format: `type`, `title`, `status`, `detail`, `instance`, এবং extension যেমন `errors` (validation), `traceId` (log match)। ASP.NET Core-এ `ProblemDetails` class দিয়ে implement করা যায়।',
      },
      why: {
        en: 'When every endpoint returns errors differently, client code becomes a mess of if/else parsing. Support teams cannot correlate user reports with logs without a traceId. Leaking stack traces exposes your internals to attackers.',
        bn: 'প্রতিটি endpoint আলাদা error format দিলে client code if/else-এ ভরে যায়। traceId ছাড়া support team user report আর log match করতে পারে না। Stack trace leak করলে attacker internals দেখে।',
      },
      how: {
        en: '1. Register global `IExceptionHandler` or `UseExceptionHandler`. 2. Map exception types to status codes. 3. Return `ProblemDetails` with traceId. 4. Use `ValidationProblem` for ModelState errors. 5. Log full exception server-side only.',
        bn: '1. Global `IExceptionHandler` বা `UseExceptionHandler` register করুন। 2. Exception type → status code map। 3. traceId সহ `ProblemDetails` return। 4. ModelState error-এ `ValidationProblem`। 5. Full exception শুধু server log-এ।',
      },
      analogy: {
        en: 'Problem Details is like a standardized hospital discharge form: diagnosis code (type), summary (title), severity (status), explanation (detail), patient visit ID (instance). Every department uses the same form — nurses and doctors do not invent their own.',
        bn: 'Problem Details = হাসপাতালের standard discharge form: diagnosis code (type), summary (title), severity (status), ব্যাখ্যা (detail), visit ID (instance)। সব department একই form — নিজের মতো format নয়।',
      },
      realWorld: {
        en: 'ASP.NET Core\'s `ValidationProblem(ModelState)` automatically produces `{ "errors": { "Email": ["Invalid format"] } }` inside a ProblemDetails wrapper. Your React app can display field errors without custom parsing per endpoint.',
        bn: 'ASP.NET Core-এ `ValidationProblem(ModelState)` auto `{ "errors": { "Email": ["Invalid format"] } }` দেয় ProblemDetails wrapper-এ। React app field error দেখাতে endpoint অনুযায়ী custom parser লাগে না।',
      },
    },
    comparisonTable: {
      en: `| Status | Meaning | Client action |
| :--- | :--- | :--- |
| **400** | Bad request / validation | Fix input and retry |
| **401** | Not authenticated | Login or refresh token |
| **403** | No permission | Show access denied |
| **404** | Resource missing | Update UI / stop retry |
| **409** | Conflict (duplicate, concurrency) | Merge or refresh |
| **429** | Rate limited | Wait (check Retry-After) |
| **500** | Server error | Retry later; report traceId |`,
      bn: `| Status | অর্থ | Client কী করবে |
| :--- | :--- | :--- |
| **400** | ভুল request / validation | Input ঠিক করে retry |
| **401** | Login হয়নি | Login বা token refresh |
| **403** | Permission নেই | Access denied দেখান |
| **404** | Resource নেই | UI update / retry বন্ধ |
| **409** | Conflict (duplicate) | Merge বা refresh |
| **429** | Rate limit | অপেক্ষা (Retry-After দেখুন) |
| **500** | Server error | পরে retry; traceId report করুন |`,
    },
  },

  // ── Guide (remaining) ──────────────────────────────────────────────
  'how-to-study-this-handbook': {
    id: 'how-to-study-this-handbook',
    explanation: {
      what: {
        en: 'This handbook is a **13-phase learning path** — C# fundamentals first, then LINQ/async, ASP.NET, EF Core, architecture, security, and system design. Each phase unlocks the next.',
        bn: 'এই হ্যান্ডবুক **১৩-ফেজ শেখার পথ** — আগে C# ভিত্তি, তারপর LINQ/async, ASP.NET, EF Core, architecture, security, system design। প্রতিটি ফেজ পরেরটা আনলক করে।',
      },
      why: {
        en: 'Random study fails interviews. Async without C# memory basics leads to deadlock answers you cannot defend. System design without SQL means you cannot explain storage bottlenecks.',
        bn: 'এলোমেলো পড়া ইন্টারভিউয়ে ফেল করে। C# memory না জেনে async পড়লে deadlock উত্তর defend করা যায় না। SQL ছাড়া system design মানে storage bottleneck ব্যাখ্যা করা যায় না।',
      },
      how: {
        en: 'Follow phases 1→13. Daily loop: read 20m → write answer from memory 15m → code 30m → speak 3 follow-ups 15m → note one failure mode 10m.',
        bn: 'ফেজ ১→১৩ অনুসরণ করুন। দৈনিক: পড়া ২০মি → মুখস্থ উত্তর ১৫মি → কোড ৩০মি → ৩ follow-up জোরে ১৫মি → failure mode ১০মি।',
      },
      analogy: {
        en: 'Learning .NET like building a house: you cannot install the roof (microservices) before the foundation (C#, SQL) and walls (ASP.NET, EF).',
        bn: 'বাড়ি বানানোর মতো: foundation (C#, SQL) ও দেয়াল (ASP.NET, EF) ছাড়া ছাদ (microservices) লাগানো যায় না।',
      },
      realWorld: {
        en: 'Candidates who jump to "design Netflix" without explaining DbContext lifetimes fail the first 30 minutes. Finish phases 1–4 and you beat most mid-level applicants.',
        bn: 'DbContext lifetime ব্যাখ্যা না করে "Netflix design" শুরু করা candidate প্রথম ৩০ মিনিটেই ফেল করে। ফেজ ১–৪ শেষ করলেই বেশিরভাগ mid-level-কে ছাড়িয়ে যাবেন।',
      },
    },
    comparisonTable: {
      en: `| Phase | Module | Master before moving on |
| :--- | :--- | :--- |
| 1 | C# & OOP | Value vs ref, GC, SOLID |
| 2 | LINQ & Async | Deferred execution, deadlock |
| 3 | ASP.NET Core | Pipeline, DI lifetimes |
| 4 | EF Core & SQL | Tracking, N+1, indexes |`,
      bn: `| ফেজ | মডিউল | আগে মাস্টার করুন |
| :--- | :--- | :--- |
| 1 | C# & OOP | Value vs ref, GC, SOLID |
| 2 | LINQ & Async | Deferred execution, deadlock |
| 3 | ASP.NET Core | Pipeline, DI lifetimes |
| 4 | EF Core & SQL | Tracking, N+1, indexes |`,
    },
    commonMistakes: [
      { en: 'Only reading, never speaking answers out loud.', bn: 'শুধু পড়া, জোরে উত্তর বলা নয়।' },
      { en: 'Skipping SQL because "EF Core generates it".', bn: 'SQL skip করা কারণ "EF Core generate করে"।' },
    ],
    bestPractices: [
      { en: 'Keep a trap list: IEnumerable vs IQueryable, First vs Single.', bn: 'Trap list রাখুন: IEnumerable vs IQueryable, First vs Single।' },
      { en: 'Use Last-Day Revision only after finishing phases 1–10.', bn: 'Last-Day Revision ফেজ ১–১০ শেষের পরেই।' },
    ],
  },

  'how-senior-candidates-should-answer': {
    id: 'how-senior-candidates-should-answer',
    explanation: {
      what: {
        en: 'Senior answers are **structured and concise** — 45 seconds with a trade-off beats a 4-minute unstructured dump. Interviewers use follow-ups to probe depth.',
        bn: 'সিনিয়র উত্তর **স্ট্রাকচার্ড ও সংক্ষিপ্ত** — trade-off সহ ৪৫ সেকেন্ড ৪ মিনিটের dump-এর চেয়ে ভালো।',
      },
      why: {
        en: 'Panels have limited time. Structure shows clear thinking. Leaving room for follow-ups shows confidence.',
        bn: 'প্যানেলের সময় সীমিত। Structure স্পষ্ট চিন্তা দেখায়। Follow-up-এর জায়গা confidence দেখায়।',
      },
      how: {
        en: 'Definition → problem solved → internals sketch → .NET example → when NOT → end with: "I can go deeper on internals or production — which do you prefer?"',
        bn: 'সংজ্ঞা → সমস্যা → internals → .NET উদাহরণ → কখন নয় → শেষে: "internals না production — কোনটা চান?"',
      },
      analogy: {
        en: 'Ordering at a restaurant: state the dish, why you want it, how it is cooked, mention allergies (trade-off) — waiter asks follow-ups only if needed.',
        bn: 'রেস্টুরেন্টে অর্ডার: কী খাবেন, কেন, কীভাবে রান্না, allergy (trade-off) — waiter প্রয়োজনে follow-up করবে।',
      },
      realWorld: {
        en: '"What is IQueryable?" — Good: "Deferred DB query via expression trees; EF translates to SQL. Trade-off: untranslatable code becomes client eval."',
        bn: '"IQueryable কী?" — ভালো: "Expression tree দিয়ে deferred DB query; EF SQL বানায়। Trade-off: translate না হলে client eval।"',
      },
    },
    commonMistakes: [
      { en: 'Talking until interrupted instead of checking if the interviewer wants more.', bn: 'থামানো পর্যন্ত বলা।' },
      { en: 'Giving only the happy path — no failure mode.', bn: 'শুধু happy path — failure নেই।' },
    ],
    bestPractices: [
      { en: 'Quantify when possible: latency, TTL, isolation level.', bn: 'সংখ্যা দিন: latency, TTL, isolation level।' },
      { en: 'If unsure, say how you would investigate.', bn: 'না জানলে কীভাবে খুঁজবেন বলুন।' },
    ],
  },

  // ── C# (first 6) ───────────────────────────────────────────────────
  'oop-solid-principles': {
    id: 'oop-solid-principles',
    diagram: SOLID_DIAGRAM,
    explanation: {
      what: { en: '**SOLID** — five OOP principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.', bn: '**SOLID** — পাঁচটি OOP principle: SRP, OCP, LSP, ISP, DIP।' },
      why: { en: 'Without SOLID, god classes emerge, changes ripple everywhere, and tests need real databases.', bn: 'SOLID ছাড়া god class, সব জায়গায় change impact, test-এ real DB লাগে।' },
      how: { en: 'SRP: one reason to change. OCP: extend via new Strategy classes. LSP: subclass honors contract. ISP: small interfaces. DIP: depend on `IOrderStore`, inject implementation.', bn: 'SRP: এক change reason। OCP: Strategy class দিয়ে extend। LSP: subclass contract মানবে। ISP: ছোট interface। DIP: `IOrderStore`, inject implementation।' },
      analogy: { en: 'Restaurant: chef cooks (SRP), new dish = new recipe card not rewriting cookbook (OCP), chef orders from suppliers not growing vegetables (DIP).', bn: 'রেস্টুরেন্ট: chef রান্না (SRP), নতুন dish = নতুন recipe (OCP), supplier থেকে নেয় (DIP)।' },
      realWorld: { en: '`OrderProcessor(IPaymentService, INotificationService)` — add SMS by new class, zero payment changes.', bn: '`OrderProcessor(IPaymentService, INotificationService)` — SMS নতুন class, payment-এ শূন্য change।' },
    },
    codeExplanation: { en: '- Interfaces in constructor — DIP\n- Separate payment/notification — SRP', bn: '- Constructor-এ interface — DIP\n- আলাদা payment/notification — SRP' },
    commonMistakes: [
      { en: 'God classes handling payment, shipping, email together.', bn: 'এক class-এ payment, shipping, email।' },
      { en: 'NotImplementedException in subclass — LSP violation.', bn: 'Subclass-এ NotImplementedException — LSP violation।' },
    ],
    bestPractices: [
      { en: 'Keep classes small with one responsibility.', bn: 'Class ছোট, এক দায়িত্ব।' },
      { en: 'Wire interfaces in Program.cs via DI.', bn: 'Program.cs-এ DI দিয়ে wire করুন।' },
    ],
  },

  'interface-vs-abstract-class': {
    id: 'interface-vs-abstract-class',
    explanation: {
      what: { en: '**Interface** = contract (what). **Abstract class** = base with shared implementation (how). Many interfaces, one abstract class per type.', bn: '**Interface** = contract (কী)। **Abstract class** = shared implementation (কীভাবে)। অনেক interface, এক abstract class।' },
      why: { en: 'Interfaces enable polymorphism across unrelated types. Abstract classes avoid duplicating shared logic in a family.', bn: 'Interface unrelated type-এ polymorphism। Abstract class family-তে duplicate logic এড়ায়।' },
      how: { en: 'Interface for capabilities (`IRepository`). Abstract class when sharing fields/helpers (`BaseDocument.Save()`).', bn: 'Capability-তে interface (`IRepository`)। Field/helper share-এ abstract class।' },
      analogy: { en: 'Interface = airport ID check rule every airline follows. Abstract class = car factory template with shared assembly steps.', bn: 'Interface = সব airline-এর ID check rule। Abstract class = car factory shared assembly template।' },
      realWorld: { en: 'Plugin: `IDocument` contract; `BaseDocument` shares `Save()`; `PdfDocument` overrides `Print()`.', bn: 'Plugin: `IDocument`; `BaseDocument` `Save()` share; `PdfDocument` `Print()` override।' },
    },
    comparisonTable: {
      en: `| | Interface | Abstract Class |\n| :--- | :--- | :--- |\n| Multiple | Yes | No |\n| Fields | No | Yes |\n| Best for | Contracts | Related families |`,
      bn: `| | Interface | Abstract Class |\n| :--- | :--- | :--- |\n| Multiple | হ্যাঁ | না |\n| Fields | না | হ্যাঁ |\n| ভালো | Contract | Related family |`,
    },
    codeExplanation: { en: '- `BaseDocument.Save()` — shared logic\n- `PdfDocument.Print()` — override', bn: '- `BaseDocument.Save()` — shared\n- `PdfDocument.Print()` — override' },
    commonMistakes: [
      { en: 'Abstract class when interface suffices.', bn: 'Interface যথেষ্ট হলে abstract class।' },
      { en: 'Trying to inherit two abstract classes.', bn: 'দুই abstract class inherit করার চেষ্টা।' },
    ],
    bestPractices: [
      { en: 'Interface for behavior; abstract for shared state.', bn: 'Behavior-এ interface; shared state-এ abstract।' },
      { en: 'Prefix interfaces with I.', bn: 'Interface নাম I দিয়ে শুরু।' },
    ],
  },

  'linq-language-integrated-query-full-concept': {
    id: 'linq-language-integrated-query-full-concept',
    diagram: LINQ_DEFERRED_DIAGRAM,
    explanation: {
      what: { en: '**LINQ** integrates query syntax into C# to filter, project, join, and group data from collections, EF Core, XML, and more with a consistent API.', bn: '**LINQ** C#-এ query syntax যোগ করে collection, EF Core, XML থেকে filter, join, group একই API-তে।' },
      why: { en: 'Without LINQ you write nested loops and manual SQL strings. LINQ is composable, readable, and (for IQueryable) pushes work to the database.', bn: 'LINQ ছাড়া nested loop ও manual SQL। LINQ composable, readable, IQueryable-এ DB-তে কাজ push করে।' },
      how: { en: 'Method syntax (`Where`, `Select`) or query syntax (`from…where`). Deferred until `ToList`, `foreach`, `Count`. `IQueryable` uses expression trees for SQL.', bn: 'Method syntax (`Where`, `Select`) বা query syntax। `ToList`, `foreach` পর্যন্ত deferred। `IQueryable` expression tree → SQL।' },
      analogy: { en: 'Shopping list vs receipt: building a LINQ query is writing the list (deferred). `ToList()` is going to the store and paying (execution).', bn: 'Shopping list vs receipt: LINQ query = list লেখা (deferred)। `ToList()` = দোকানে গিয়ে কেনা (execution)।' },
      realWorld: { en: '`orders.GroupBy(o => o.Category).Select(g => new { g.Key, Total = g.Sum(x => x.Amount) })` — category sales report in one expression.', bn: '`orders.GroupBy(...).Select(...)` — category sales report এক expression-এ।' },
    },
    codeExplanation: { en: '- `Join` / query syntax — combine tables\n- `GroupBy` + `Sum` — aggregates\n- `SelectMany` — flatten nested collections', bn: '- `Join` — table combine\n- `GroupBy` + `Sum` — aggregate\n- `SelectMany` — flatten' },
    commonMistakes: [
      { en: 'Multiple `.ToList()` in one chain.', bn: 'এক chain-এ অনেক `.ToList()`।' },
      { en: 'IEnumerable on EF when IQueryable needed — loads full table.', bn: 'EF-এ IEnumerable — পুরো table memory-তে।' },
    ],
    bestPractices: [
      { en: 'Use `.Any()` not `.Count() > 0` for existence.', bn: 'Existence-এ `.Any()`, `.Count() > 0` নয়।' },
      { en: 'Project with `.Select()` to fetch only needed columns.', bn: '`.Select()` দিয়ে শুধু দরকারি column।' },
    ],
  },

  'async-await-task-parallel-library': {
    id: 'async-await-task-parallel-library',
    diagram: ASYNC_FLOW_DIAGRAM,
    explanation: {
      what: { en: '**async/await** is a compiler state machine for non-blocking I/O. **Task** represents async work. **TPL** coordinates parallel tasks.', bn: '**async/await** non-blocking I/O-র state machine। **Task** async কাজ। **TPL** parallel task coordinate।' },
      why: { en: 'Blocking threads during I/O wastes the thread pool — under load the API hangs with low CPU. async frees threads for other requests.', bn: 'I/O-তে thread block করলে pool waste — load-এ API hang, CPU কম। async thread অন্য request-এ ব্যবহার করে।' },
      how: { en: '`await` yields at I/O; continuation runs when complete. Pass `CancellationToken`. Use `ConfigureAwait(false)` in libraries. Never `.Result` or `.Wait()`.', bn: '`await` I/O-তে yield; complete হলে continue। `CancellationToken` পাস। Library-তে `ConfigureAwait(false)`। `.Result`/`.Wait()` নয়।' },
      analogy: { en: 'Restaurant waiter: blocking = waiter stands at kitchen door until food is ready (cannot serve other tables). async = waiter takes other orders, kitchen rings bell when ready.', bn: 'Waiter: blocking = kitchen door-এ দাঁড়িয়ে (অন্য table serve নয়)। async = অন্য order নেয়, bell এলে ফিরে।' },
      realWorld: { en: '`await _client.GetStringAsync(url, ct)` — thread serves hundreds of concurrent HTTP calls, not one per call.', bn: '`await GetStringAsync` — এক thread শত concurrent HTTP serve, প্রতি call-এ এক thread নয়।' },
    },
    codeExplanation: { en: '- `CreateLinkedTokenSource` — link timeout + request token\n- `ConfigureAwait(false)` — library best practice\n- `CancelAfter(5000)` — 5s timeout', bn: '- `CreateLinkedTokenSource` — timeout + request link\n- `ConfigureAwait(false)` — library practice\n- `CancelAfter(5000)` — ৫s timeout' },
    commonMistakes: [
      { en: '`.Result` / `.Wait()` — deadlock risk.', bn: '`.Result`/`.Wait()` — deadlock risk।' },
      { en: '`async void` except event handlers.', bn: '`async void` event handler ছাড়া।' },
    ],
    bestPractices: [
      { en: 'Async all the way; pass CancellationToken.', bn: 'Async all the way; CancellationToken পাস।' },
      { en: 'Task.Run only for CPU-bound, not I/O.', bn: 'Task.Run শুধু CPU-bound, I/O নয়।' },
    ],
  },

  'memory-management-garbage-collection': {
    id: 'memory-management-garbage-collection',
    diagram: GC_GENERATIONS_DIAGRAM,
    explanation: {
      what: { en: '**.NET GC** collects managed memory in generations (0, 1, 2) and LOH (>85KB). **IDisposable** releases unmanaged resources deterministically.', bn: '**.NET GC** generation (0,1,2) ও LOH (>85KB)-এ managed memory collect। **IDisposable** unmanaged resource deterministic release।' },
      why: { en: 'GC handles most memory automatically, but file handles, DB connections, and sockets need explicit `Dispose()` or they leak until finalizer runs.', bn: 'GC বেশিরভাগ memory handle করে, কিন্তু file, DB connection, socket-এ `Dispose()` লাগে নাহলে leak।' },
      how: { en: 'Use `using` for IDisposable. Gen 0 collects short-lived objects frequently. LOH is not compacted by default — avoid large allocations in hot paths. Use `ArrayPool<T>`.', bn: '`using` IDisposable-এ। Gen 0 short-lived object collect। LOH default-এ compact হয় না — hot path-এ বড় allocation এড়ান। `ArrayPool<T>`।' },
      analogy: { en: 'GC = apartment building janitor who sweeps young trash daily (Gen 0) and deep-cleans rarely (Gen 2). IDisposable = you taking out your own kitchen trash immediately instead of waiting for janitor.', bn: 'GC = janitor প্রতিদিন young trash (Gen 0) sweep, কমে deep clean (Gen 2)। IDisposable = নিজে kitchen trash বের করা, janitor-এর অপেক্ষা নয়।' },
      realWorld: { en: 'Forgotten `using` on `SqlConnection` exhausts connection pool under load — API returns timeout errors while CPU stays low.', bn: '`SqlConnection`-এ `using` ভুলে গেলে connection pool শেষ — timeout, CPU কম।' },
    },
    codeExplanation: { en: '- `Dispose(true)` — clean managed + unmanaged\n- `GC.SuppressFinalize` — skip finalizer after dispose\n- `_disposed` flag — prevent double dispose', bn: '- `Dispose(true)` — managed + unmanaged clean\n- `SuppressFinalize` — finalizer skip\n- `_disposed` — double dispose prevent' },
    commonMistakes: [
      { en: 'Not disposing DB connections and streams.', bn: 'DB connection/stream dispose না করা।' },
      { en: 'Large object allocations (>85KB) in loops — LOH fragmentation.', bn: 'Loop-এ >85KB allocation — LOH fragmentation।' },
    ],
    bestPractices: [
      { en: 'Always `using` for IDisposable types.', bn: 'IDisposable-এ সবসময় `using`।' },
      { en: 'Pool large arrays with ArrayPool<T>.', bn: 'বড় array `ArrayPool<T>` দিয়ে pool করুন।' },
    ],
  },

  'delegates-actions-events': {
    id: 'delegates-actions-events',
    explanation: {
      what: { en: '**Delegates** are type-safe function pointers. **Action** returns void, **Func** returns a value. **Events** wrap delegates with subscribe-only access from outside.', bn: '**Delegate** type-safe function pointer। **Action** void, **Func** value return। **Event** delegate wrap — বাইরে শুধু subscribe।' },
      why: { en: 'Events decouple publishers from subscribers (button click, log entry added). Without events, tight coupling makes testing and maintenance hard.', bn: 'Event publisher-subscriber আলাদা করে (button click)। Event ছাড়া tight coupling, test কঠিন।' },
      how: { en: 'Declare `event Action<string> OnComplete`. Raise with `OnComplete?.Invoke(msg)`. Subscribe `+=`, unsubscribe `-=` in Dispose.', bn: '`event Action<string> OnComplete` declare। `OnComplete?.Invoke(msg)` raise। `+=` subscribe, `-=` Dispose-এ unsubscribe।' },
      analogy: { en: 'Event = restaurant bell: kitchen rings when order ready (publisher), waiters hear and react (subscribers). Waiters cannot ring the bell themselves (event encapsulation).', bn: 'Event = রেস্টুরেন্ট bell: kitchen ring (publisher), waiter শোনে (subscriber)। Waiter bell ring করতে পারে না (encapsulation)।' },
      realWorld: { en: 'Forgetting `-=` on a long-lived publisher keeps short-lived subscriber in memory — classic .NET memory leak in WinForms and custom loggers.', bn: 'Long-lived publisher-এ `-=` না করলে subscriber memory-তে থাকে — classic memory leak।' },
    },
    comparisonTable: {
      en: `| Type | Returns | Use |\n| :--- | :--- | :--- |\n| Action | void | Callbacks |\n| Func | TValue | LINQ, transforms |\n| Event | void | Pub/sub notifications |`,
      bn: `| Type | Return | ব্যবহার |\n| :--- | :--- | :--- |\n| Action | void | Callback |\n| Func | TValue | LINQ, transform |\n| Event | void | Pub/sub |`,
    },
    codeExplanation: { en: '- `event Action<string>` — external can only += / -=\n- `OnComplete?.Invoke` — safe null check raise', bn: '- `event` — বাইরে শুধু += / -\n- `?.Invoke` — safe raise' },
    commonMistakes: [
      { en: 'Not unsubscribing events — memory leak.', bn: 'Event unsubscribe না করা — memory leak।' },
      { en: 'Public delegate instead of event — anyone can invoke.', bn: 'Event না public delegate — যে কেউ invoke।' },
    ],
    bestPractices: [
      { en: 'Unsubscribe in Dispose with -= operator.', bn: 'Dispose-এ `-=` দিয়ে unsubscribe।' },
      { en: 'Prefer Action/Func over custom delegate types.', bn: 'Custom delegate-এর বদলে Action/Func।' },
    ],
  },

  // ── Database (all sections) ────────────────────────────────────────
  'dbcontext-change-tracking': {
    id: 'dbcontext-change-tracking',
    diagram: EF_DBCONTEXT_DIAGRAM,
    explanation: {
      what: { en: '**DbContext** is EF Core\'s gateway to the database. **Change tracking** snapshots loaded entities so `SaveChanges` generates minimal INSERT/UPDATE/DELETE SQL.', bn: '**DbContext** EF Core-এর DB gateway। **Change tracking** entity snapshot নেয় যাতে `SaveChanges` minimal SQL generate করে।' },
      why: { en: 'Without tracking, EF cannot know what changed — you would write manual UPDATE for every field. `AsNoTracking()` skips tracking for read-only queries, saving memory and CPU.', bn: 'Tracking ছাড়া EF change জানে না। Read-only-তে `AsNoTracking()` memory ও CPU বাঁচায়।' },
      how: { en: 'Load entity → tracker stores snapshot → modify properties → `SaveChangesAsync` compares and emits SQL. Use `.AsNoTracking()` on GET endpoints.', bn: 'Load → snapshot → modify → `SaveChangesAsync` compare করে SQL। GET-এ `.AsNoTracking()`।' },
      analogy: { en: 'DbContext = smart shopping receipt: remembers what you put in the cart (tracking). Checkout (`SaveChanges`) only charges changed items. `AsNoTracking` = window shopping — look but do not add to cart.', bn: 'DbContext = smart receipt: cart-এ কী আছে মনে রাখে। Checkout-এ শুধু change charge। `AsNoTracking` = window shopping — দেখা, cart-এ নয়।' },
      realWorld: { en: 'Report fetching 5,000 products with tracking enabled — memory spikes and API slows. Fix: `.AsNoTracking().Where(...).ToListAsync()`.', bn: '৫০০০ product tracking সহ — memory spike। Fix: `.AsNoTracking()`।' },
    },
    codeExplanation: { en: '- `.AsNoTracking()` — no snapshot, faster reads\n- `.Where(p => p.IsActive)` — filter pushed to SQL', bn: '- `.AsNoTracking()` — snapshot নয়, দ্রুত read\n- `.Where` — SQL-এ filter' },
    commonMistakes: [
      { en: 'Tracking for display-only GET requests.', bn: 'Display-only GET-এ tracking।' },
      { en: 'New DbContext inside a loop.', bn: 'Loop-এ নতুন DbContext।' },
    ],
    bestPractices: [
      { en: 'AsNoTracking by default for reads.', bn: 'Read-এ default AsNoTracking।' },
      { en: 'Scoped DbContext per HTTP request.', bn: 'প্রতি request-এ Scoped DbContext।' },
    ],
  },

  'the-n-1-problem-include': {
    id: 'the-n-1-problem-include',
    explanation: {
      what: { en: '**N+1** means 1 query for parent rows plus N queries for each child — e.g. 100 orders each triggering a separate query for order lines.', bn: '**N+1** = ১ parent query + প্রতি child-এ আলাদা query — ১০০ order = ১০০ extra line query।' },
      why: { en: 'N+1 destroys API latency and database load. A page that should be one SQL round-trip becomes hundreds.', bn: 'N+1 API latency ও DB load ধ্বংস করে। এক SQL-এর কাজ শত SQL হয়।' },
      how: { en: 'Use `.Include(b => b.Posts).ThenInclude(p => p.Author)` for eager loading. For multiple collections use `.AsSplitQuery()`. Project to DTO with `.Select()` when you do not need full entities.', bn: '`.Include().ThenInclude()` eager loading। Multiple collection-এ `.AsSplitQuery()`। Entity লাগবে না হলে `.Select()` DTO।' },
      analogy: { en: 'Airport baggage: N+1 = sending a separate truck for each suitcase after the plane lands. Include = load all bags on one conveyor belt in one trip.', bn: 'বিমানবন্দর baggage: N+1 = প্রতি suitcase-এ আলাদা truck। Include = এক conveyor-এ সব bag এক trip-এ।' },
      realWorld: { en: '`foreach (var order in orders) { var lines = order.Lines; }` without Include — 1 + N SQL hits on every API call.', bn: 'Include ছাড়া `foreach`-এ `order.Lines` — প্রতি call-এ 1+N SQL।' },
    },
    codeExplanation: { en: '- `.Include(b => b.Posts)` — eager load posts\n- `.ThenInclude(p => p.Author)` — nested author\n- `.AsNoTracking()` — read-only', bn: '- `.Include` — posts load\n- `.ThenInclude` — nested author\n- `.AsNoTracking()` — read-only' },
    commonMistakes: [
      { en: 'Navigation property access in foreach without Include.', bn: 'Include ছাড়া foreach-এ navigation access।' },
      { en: 'Lazy loading enabled in Web API — hidden N+1.', bn: 'Web API-তে lazy loading — hidden N+1।' },
    ],
    bestPractices: [
      { en: 'Project with Select for API GET responses.', bn: 'API GET-এ Select projection।' },
      { en: 'AsSplitQuery for multiple collection includes.', bn: 'Multiple collection-এ AsSplitQuery।' },
    ],
  },

  'dapper-for-micro-orm-performance': {
    id: 'dapper-for-micro-orm-performance',
    explanation: {
      what: { en: '**Dapper** is a micro-ORM that maps SQL rows to C# objects with minimal overhead — no change tracking, no expression tree compilation.', bn: '**Dapper** micro-ORM — SQL row → C# object, minimal overhead, tracking/expression tree নেই।' },
      why: { en: 'EF Core adds tracking, identity map, and translation layers. For read-heavy reporting where you write explicit SQL, Dapper is often 2–5x faster.', bn: 'EF Core tracking + translation layer যোগ করে। Read-heavy reporting-এ Dapper প্রায় ২–৫x দ্রুত।' },
      how: { en: '`QueryAsync<T>(sql, param)` with anonymous object parameters. Always parameterized — never string concatenation. Use `using` for connections.', bn: '`QueryAsync<T>(sql, param)` anonymous object parameter। সবসময় parameterized। Connection-এ `using`।' },
      analogy: { en: 'EF = full-service restaurant (kitchen tracks your order, suggests sides). Dapper = food truck — you order exactly what you want, they hand it over fast, no extras.', bn: 'EF = full-service restaurant (tracking, suggestion)। Dapper = food truck — ঠিক যা চান, দ্রুত, extra নেই।' },
      realWorld: { en: 'CQRS: EF for writes (tracking + SaveChanges), Dapper for dashboard queries with hand-tuned SQL and indexes.', bn: 'CQRS: write-এ EF, dashboard read-এ Dapper tuned SQL।' },
    },
    codeExplanation: { en: '- `new { status = 1 }` — parameterized, SQL-injection safe\n- `CommandType.StoredProcedure` — call SP\n- `using var db` — connection disposed', bn: '- `new { status = 1 }` — parameterized, safe\n- `StoredProcedure` — SP call\n- `using var db` — connection dispose' },
    commonMistakes: [
      { en: 'String concatenation in SQL — injection risk.', bn: 'SQL string concatenation — injection।' },
      { en: 'Opening connections without closing.', bn: 'Connection open করে close না করা।' },
    ],
    bestPractices: [
      { en: 'Dapper for reads, EF for complex writes (CQRS).', bn: 'Read Dapper, complex write EF (CQRS)।' },
      { en: 'QueryMultiple for multiple result sets in one trip.', bn: 'এক trip-এ QueryMultiple।' },
    ],
  },

  'relationships-include-vs-projection-concurrency': {
    id: 'relationships-include-vs-projection-concurrency',
    explanation: {
      what: { en: 'EF maps relationships (1:1, 1:N, M:N). **Include** loads graphs; **projection** selects DTO columns. **RowVersion** enables optimistic concurrency.', bn: 'EF relationship map করে। **Include** graph load। **Projection** DTO column। **RowVersion** optimistic concurrency।' },
      why: { en: 'Include over-fetches for GET APIs. Two users editing the same row without concurrency token causes silent overwrites. ExecuteUpdate bulk-updates without loading entities.', bn: 'Include GET-এ over-fetch। Concurrency token ছাড়া silent overwrite। ExecuteUpdate entity load ছাড়া bulk update।' },
      how: { en: 'GET: `.Select(x => new Dto { ... })`. Update graph: Include + SaveChanges. Concurrency: `[Timestamp] byte[] RowVersion`. Bulk: `.ExecuteUpdateAsync()`.', bn: 'GET: `.Select` DTO। Graph update: Include + SaveChanges। Concurrency: `RowVersion`। Bulk: `ExecuteUpdateAsync`।' },
      analogy: { en: 'Include = buying the whole combo meal when you only wanted fries. Projection = ordering exactly fries. RowVersion = receipt stamp — if someone else paid first, your payment is rejected.', bn: 'Include = combo যখন শুধু fries চান। Projection = ঠিক fries। RowVersion = receipt stamp — অন্যে আগে দিলে reject।' },
      realWorld: { en: 'Admin A and B both edit order total — without RowVersion, last save wins silently. With RowVersion, second save gets `DbUpdateConcurrencyException`.', bn: 'RowVersion ছাড়া last save জিতে। RowVersion-এ `DbUpdateConcurrencyException`।' },
    },
    comparisonTable: {
      en: `| Technique | Tracking | Best for |\n| :--- | :--- | :--- |\n| Include | Yes | Mutating graphs |\n| Select DTO | No | API GET |\n| ExecuteUpdate | No | Bulk status change |`,
      bn: `| কৌশল | Tracking | ভালো |\n| :--- | :--- | :--- |\n| Include | হ্যাঁ | Graph update |\n| Select DTO | না | API GET |\n| ExecuteUpdate | না | Bulk update |`,
    },
    codeExplanation: { en: '- `[Timestamp] RowVersion` — concurrency token\n- `ExecuteUpdateAsync` — set-based SQL without tracking', bn: '- `RowVersion` — concurrency token\n- `ExecuteUpdateAsync` — tracking ছাড়া bulk SQL' },
    commonMistakes: [
      { en: 'Lazy loading in Web API.', bn: 'Web API-তে lazy loading।' },
      { en: 'Retrying concurrency exception without reload.', bn: 'Reload ছাড়া concurrency retry।' },
    ],
    bestPractices: [
      { en: 'AsNoTracking + projection for reads.', bn: 'Read-এ AsNoTracking + projection।' },
      { en: 'RowVersion on concurrently edited aggregates.', bn: 'Concurrent edit-এ RowVersion।' },
    ],
  },

  // ── Web API (all sections) ─────────────────────────────────────────
  'rest-principles-http-methods': {
    id: 'rest-principles-http-methods',
    diagram: WEBAPI_FLOW_DIAGRAM,
    explanation: {
      what: { en: '**REST** uses HTTP methods on noun-based URLs. GET reads, POST creates (201), PUT replaces, PATCH partial update, DELETE removes (204).', bn: '**REST** noun URL + HTTP method। GET read, POST create (201), PUT replace, PATCH partial, DELETE (204)।' },
      why: { en: 'Consistent REST APIs are predictable, cacheable (GET), and integrate with standard tools — Swagger, browsers, CDNs.', bn: 'Consistent REST predictable, GET cacheable, standard tool (Swagger, CDN) support।' },
      how: { en: 'URLs = plural nouns (`/api/orders`). Actions = HTTP verbs, not URL verbs. Return `CreatedAtAction` with 201 for POST.', bn: 'URL = plural noun (`/api/orders`)। Action = HTTP verb, URL-এ verb নয়। POST-এ 201 + `CreatedAtAction`।' },
      analogy: { en: 'REST URLs are like store aisle labels (`/dairy`, `/bakery`). HTTP methods are actions: look (GET), buy new item (POST), replace entire shelf (PUT), adjust price tag (PATCH), remove (DELETE).', bn: 'URL = store aisle (`/dairy`)। Method = কাজ: দেখা (GET), কেনা (POST), পুরো shelf replace (PUT), price adjust (PATCH), সরানো (DELETE)।' },
      realWorld: { en: '`POST /api/posts` returns 201 with `Location: /api/posts/42` — client knows where to fetch the new resource.', bn: '`POST /api/posts` → 201 + `Location` header — client নতুন resource কোথায় জানে।' },
    },
    codeExplanation: { en: '- `[HttpPost]` + `CreatedAtAction` — 201 with location header\n- `SaveChanges` persists then returns created entity', bn: '- `CreatedAtAction` — 201 + location\n- `SaveChanges` save করে entity return' },
    commonMistakes: [
      { en: 'GET for operations that change data.', bn: 'Data change-এ GET ব্যবহার।' },
      { en: 'Returning 200 instead of 201 for POST.', bn: 'POST-এ 200, 201 নয়।' },
    ],
    bestPractices: [
      { en: 'Nouns in URLs: /api/orders.', bn: 'URL-এ noun: /api/orders।' },
      { en: 'PUT and DELETE should be idempotent.', bn: 'PUT ও DELETE idempotent হওয়া উচিত।' },
    ],
  },

  'status-codes-error-handling': {
    id: 'status-codes-error-handling',
    explanation: {
      what: { en: '**HTTP status codes** tell clients what happened. **ProblemDetails** (RFC 7807) standardizes JSON error bodies with type, title, status, detail, and traceId.', bn: '**HTTP status code** client-কে জানায় কী হয়েছে। **ProblemDetails** (RFC 7807) standard JSON error: type, title, status, detail, traceId।' },
      why: { en: 'Wrong codes confuse clients (404 vs 403). Inconsistent error JSON makes frontend parsing fragile. Stack traces in production leak internals.', bn: 'ভুল code client confuse (404 vs 403)। Inconsistent error JSON fragile frontend। Production-এ stack trace leak।' },
      how: { en: '401 = not authenticated. 403 = authenticated but forbidden. Register `UseExceptionHandler` first. Map exceptions to ProblemDetails. Log full error server-side only.', bn: '401 = login নেই। 403 = permission নেই। `UseExceptionHandler` প্রথমে। Exception → ProblemDetails। Full error শুধু server log।' },
      analogy: { en: 'Status codes = airport announcement codes: 401 "show your boarding pass", 403 "this gate is crew only", 404 "flight does not exist", 500 "technical problem — see desk".', bn: 'Status code = airport announcement: 401 "boarding pass দেখান", 403 "crew only gate", 404 "flight নেই", 500 "technical problem"।' },
      realWorld: { en: 'Returning 404 for unauthorized order access tells attackers the order ID exists. Return 403 or 404 consistently based on your security policy.', bn: 'Unauthorized order-এ 404 দিলে attacker জানে order ID exists। Security policy অনুযায়ী 403/404 consistent।' },
    },
    comparisonTable: {
      en: `| Code | Meaning |\n| :--- | :--- |\n| 400 | Validation failed |\n| 401 | Not logged in |\n| 403 | No permission |\n| 404 | Not found |\n| 500 | Server error |`,
      bn: `| Code | অর্থ |\n| :--- | :--- |\n| 400 | Validation fail |\n| 401 | Login নেই |\n| 403 | Permission নেই |\n| 404 | পাওয়া যায়নি |\n| 500 | Server error |`,
    },
    codeExplanation: { en: '- `NotFound()` — 404\n- `BadRequest(...)` — 400 validation\n- `Ok(item)` — 200 success', bn: '- `NotFound()` — 404\n- `BadRequest` — 400\n- `Ok` — 200' },
    commonMistakes: [
      { en: '404 for unauthorized user (information leak).', bn: 'Unauthorized-এ 404 — information leak।' },
      { en: 'Stack traces in production responses.', bn: 'Production response-এ stack trace।' },
    ],
    bestPractices: [
      { en: '401 for auth issues, 403 for role issues.', bn: 'Auth 401, role 403।' },
      { en: 'Consistent ProblemDetails on all errors.', bn: 'সব error-এ consistent ProblemDetails।' },
    ],
  },

  'pagination-filtering-sorting': {
    id: 'pagination-filtering-sorting',
    explanation: {
      what: { en: '**Pagination** splits large datasets into pages. **Filtering** and **sorting** via query params push work to the database via `IQueryable`.', bn: '**Pagination** বড় data ভাগ করে। **Filter/sort** query param দিয়ে `IQueryable`-এ DB-তে push।' },
      why: { en: 'Returning 100,000 rows crashes memory and network. Unbounded page sizes are a DoS vector.', bn: '১০০,০০০ row memory ও network crash। Unbounded page size DoS vector।' },
      how: { en: '`.Skip((page-1)*size).Take(size)`. Return metadata (totalCount, hasNextPage). Cap max page size. For deep pages prefer cursor pagination.', bn: '`.Skip().Take()`। Metadata (totalCount, hasNextPage)। Max page size cap। Deep page-এ cursor pagination।' },
      analogy: { en: 'Pagination = reading a book page by page instead of photocopying the entire library. Cursor pagination = bookmark — "continue from page 847" without counting 846 pages first.', bn: 'Pagination = বই page page পড়া, পুরো library copy নয়। Cursor = bookmark — "৮৪৭ থেকে" ৮৪৬ page skip নয়।' },
      realWorld: { en: 'Offset page 10,000 with size 20 — SQL scans 200,000 rows to skip. Cursor `WHERE Id > @lastId` uses index at any depth.', bn: 'Offset page 10000 — ২০০০০ row scan। Cursor `WHERE Id > @lastId` index-efficient।' },
    },
    codeExplanation: { en: '- `Skip((pageNum-1)*pageSize).Take(pageSize)` — offset pagination\n- Keep as IQueryable until ToListAsync — filter in SQL', bn: '- `Skip/Take` — offset pagination\n- ToListAsync পর্যন্ত IQueryable — SQL-এ filter' },
    commonMistakes: [
      { en: 'Unrestricted page sizes.', bn: 'Page size limit নেই।' },
      { en: 'OFFSET on huge tables without cursor alternative.', bn: 'বড় table-এ OFFSET, cursor নেই।' },
    ],
    bestPractices: [
      { en: 'Return pagination metadata in headers or wrapper.', bn: 'Metadata header বা wrapper-এ।' },
      { en: 'Limit max page size (e.g. 100).', bn: 'Max page size limit (যেমন ১০০)।' },
    ],
  },

  'swagger-versioning': {
    id: 'swagger-versioning',
    explanation: {
      what: { en: '**Swagger/OpenAPI** documents your API interactively. **API versioning** lets v1 and v2 coexist so breaking changes do not kill old clients.', bn: '**Swagger/OpenAPI** interactive API doc। **Versioning** v1/v2 একসাথে — breaking change পুরনো client ভাঙে না।' },
      why: { en: 'Mobile apps cannot update instantly. Public Swagger in production exposes attack surface. Breaking changes without new version strand users.', bn: 'Mobile instant update হয় না। Production Swagger attack surface। Breaking change version ছাড়া user আটকে।' },
      how: { en: '`[ApiVersion("1.0")]` + route `api/v{version}/[controller]`. Secure Swagger in staging. Breaking change = new version only.', bn: '`[ApiVersion]` + route template। Staging-এ Swagger secure। Breaking = নতুন version।' },
      analogy: { en: 'Versioning = product packaging: "Cola Classic" (v1) still on shelf while "Cola Zero" (v2) launches. Old customers are not forced to switch overnight.', bn: 'Versioning = product packaging: v1 shelf-এ, v2 launch — পুরনো customer রাতারাতি switch করতে হয় না।' },
      realWorld: { en: 'URL `/api/v1/users` vs `/api/v2/users` — explicit, testable in browser, cache-friendly.', bn: 'URL `/api/v1/users` vs `/api/v2/users` — explicit, browser-এ test, cache-friendly।' },
    },
    codeExplanation: { en: '- `[ApiVersion("1.0")]` — declare version\n- `api/v{version:apiVersion}/[controller]` — URL versioning route', bn: '- `[ApiVersion]` — version declare\n- route template — URL versioning' },
    commonMistakes: [
      { en: 'Public Swagger UI in production.', bn: 'Production-এ public Swagger।' },
      { en: 'Breaking changes without new version.', bn: 'নতুন version ছাড়া breaking change।' },
    ],
    bestPractices: [
      { en: 'URL versioning for public APIs.', bn: 'Public API-তে URL versioning।' },
      { en: 'Sunset header when deprecating old versions.', bn: 'পুরনো version deprecate-এ Sunset header।' },
    ],
  },

  // ── Security (first 4) ───────────────────────────────────────────────
  'authentication-authorization-jwt-claims-and-policies': {
    id: 'authentication-authorization-jwt-claims-and-policies',
    diagram: JWT_FLOW_DIAGRAM,
    explanation: {
      what: { en: '**Authentication** (AuthN) = who are you. **Authorization** (AuthZ) = what may you do. **JWT** access tokens are short-lived bearer credentials; **refresh tokens** are revocable server-side secrets.', bn: '**AuthN** = কে তুমি। **AuthZ** = কী করতে পারবে। **JWT** access ছোট-lived bearer; **refresh** server-side revocable।' },
      why: { en: 'Long-lived JWTs cannot be revoked — stolen token works until expiry. Roles alone explode into god roles; policies and permission claims scale.', bn: 'লম্বা JWT revoke করা যায় না — চুরি হলে expiry পর্যন্ত কাজ করে। Role একা god role তৈরি করে; policy/permission scale করে।' },
      how: { en: 'Short access JWT (5–15 min) + rotating refresh with reuse detection. Validate issuer, audience, lifetime, signing key. Policies: `RequireClaim("perm", "orders:write")`.', bn: 'ছোট access JWT + rotating refresh reuse detection। issuer, audience, lifetime validate। Policy: `RequireClaim("perm", "orders:write")`।' },
      analogy: { en: 'Airport: boarding pass (JWT) gets you through security for one flight (short TTL). Frequent flyer card stored at desk (refresh token) gets a new pass without re-entering passport — desk can revoke the card if stolen.', bn: 'বিমানবন্দর: boarding pass (JWT) এক flight (ছোট TTL)। Desk-এ card (refresh) — নতুন pass, চুরি হলে card revoke।' },
      realWorld: { en: 'Fired employee with 7-day JWT keeps calling API until expiry. Short access + refresh family revocation fixes this.', bn: '৭ দিন JWT-এ fired employee API call করে। ছোট access + refresh family revoke সমাধান।' },
    },
    codeExplanation: { en: '- `TokenValidationParameters` — validate issuer, audience, lifetime\n- `AddPolicy("orders:write")` — permission-based authz', bn: '- `TokenValidationParameters` — issuer, audience, lifetime\n- `AddPolicy` — permission authz' },
    commonMistakes: [
      { en: 'Long-lived access JWTs called "stateless security".', bn: 'লম্বা access JWT "stateless security" বলা।' },
      { en: 'Refresh token in localStorage — XSS steals it.', bn: 'localStorage-এ refresh — XSS চুরি।' },
    ],
    bestPractices: [
      { en: 'Short access TTL; rotating refresh with reuse detection.', bn: 'ছোট access; rotating refresh reuse detection।' },
      { en: 'Policy-based authz beyond simple roles.', bn: 'Role ছাড়াও policy-based authz।' },
    ],
  },

  'cookie-vs-jwt-oauth2-oidc-identity-hashing-lockout': {
    id: 'cookie-vs-jwt-oauth2-oidc-identity-hashing-lockout',
    explanation: {
      what: { en: '**Cookie auth** (HttpOnly, SameSite) suits same-site browsers. **JWT bearer** suits SPAs on other origins and mobile. **OAuth2/OIDC** federates identity. **ASP.NET Identity** handles password hashing and lockout.', bn: '**Cookie** same-site browser। **JWT bearer** SPA/mobile। **OAuth2/OIDC** federated identity। **Identity** password hash ও lockout।' },
      why: { en: 'JWT in localStorage + XSS = account takeover. Custom MD5 password hashing is crackable. Cookie auth needs CSRF protection.', bn: 'localStorage JWT + XSS = account takeover। MD5 hash crackable। Cookie-এ CSRF protection লাগে।' },
      how: { en: 'Same-site web: HttpOnly + Secure + SameSite cookies + antiforgery. Public API: Authorization Code + PKCE. Identity: PBKDF2 hasher, lockout after N failures.', bn: 'Same-site: HttpOnly cookie + antiforgery। Public API: Code + PKCE। Identity: PBKDF2, lockout।' },
      analogy: { en: 'Cookie = hotel key card (browser carries automatically — need desk to revoke). JWT in header = showing passport each time (not auto-sent on cross-site forms).', bn: 'Cookie = hotel key card (browser auto carry — revoke desk-এ)। JWT header = প্রতিবার passport দেখানো (cross-site form-এ auto নয়)।' },
      realWorld: { en: 'BFF pattern: browser uses HttpOnly cookie to your backend; backend holds refresh token — browser never sees refresh.', bn: 'BFF: browser HttpOnly cookie → backend; backend refresh ধরে — browser refresh দেখে না।' },
    },
    comparisonTable: {
      en: `| | Cookie | JWT bearer |\n| :--- | :--- | :--- |\n| Same-site browser | Best (HttpOnly) | XSS risk in JS storage |\n| CSRF | Must mitigate | Not auto-sent |\n| Mobile/API | Awkward | Natural |`,
      bn: `| | Cookie | JWT |\n| :--- | :--- | :--- |\n| Same-site | HttpOnly ভালো | JS storage XSS |\n| CSRF | mitigate লাগে | auto send নয় |\n| Mobile/API | কঠিন | natural |`,
    },
    codeExplanation: { en: '- `Cookie.HttpOnly = true` — JS cannot read\n- `Lockout.MaxFailedAccessAttempts = 5` — brute-force mitigation\n- `Password.RequiredLength = 12` — strong passwords', bn: '- `HttpOnly` — JS read করতে পারে না\n- Lockout — brute-force stop\n- Password length — strong password' },
    commonMistakes: [
      { en: 'JWT in localStorage.', bn: 'localStorage-এ JWT।' },
      { en: 'Custom MD5/SHA password hashing.', bn: 'MD5/SHA password hash।' },
    ],
    bestPractices: [
      { en: 'HttpOnly + Secure + SameSite for first-party web.', bn: 'First-party web-এ HttpOnly + Secure + SameSite।' },
      { en: 'Authorization Code + PKCE for public clients.', bn: 'Public client-এ Code + PKCE।' },
    ],
  },

  'owasp-top-10-mapped-to-asp-net-core': {
    id: 'owasp-top-10-mapped-to-asp-net-core',
    explanation: {
      what: { en: '**OWASP Top 10** lists the most critical web risks. Seniors map each to concrete ASP.NET Core controls — not memorize acronyms.', bn: '**OWASP Top 10** critical web risk। Senior প্রতিটি ASP.NET Core control-এ map করে — acronym মুখস্থ নয়।' },
      why: { en: 'Reciting OWASP without .NET mapping fails interviews. Fixing headers while IDOR is open on every entity is wasted effort.', bn: 'OWASP .NET mapping ছাড়া interview fail। Header fix IDOR open থাকলে waste।' },
      how: { en: 'Broken access control → policies + owner checks. Injection → parameterized LINQ. Misconfiguration → no dev page in prod. Logging → no secrets in logs.', bn: 'Access control → policy + owner check। Injection → parameterized LINQ। Misconfig → prod-এ dev page নয়। Log → secret নয়।' },
      analogy: { en: 'OWASP = building safety checklist. ASP.NET controls = fire exits, sprinklers, locks. Naming "fire hazard" without pointing to the extinguisher fails the inspection.', bn: 'OWASP = building safety checklist। ASP.NET control = fire exit, sprinkler। "fire hazard" বলে extinguisher না দেখালে inspection fail।' },
      realWorld: { en: 'IDOR: `GET /orders/12` without checking `order.UserId == currentUser.Id` — any user reads any order.', bn: 'IDOR: `GET /orders/12`-এ owner check নেই — যে কেউ যেকোনো order পড়ে।' },
    },
    comparisonTable: {
      en: `| Risk | ASP.NET control |\n| :--- | :--- |\n| Broken access control | Policies, resource handlers |\n| Injection | EF parameterized LINQ |\n| Misconfiguration | No detailed errors in prod |`,
      bn: `| Risk | ASP.NET control |\n| :--- | :--- |\n| Broken access | Policy, resource handler |\n| Injection | EF parameterized |\n| Misconfig | Prod-এ detail error নয় |`,
    },
    commonMistakes: [
      { en: 'Reciting OWASP names without .NET control.', bn: 'OWASP নাম .NET control ছাড়া।' },
      { en: 'Fixing XSS while IDOR is open.', bn: 'IDOR open থাকতে XSS fix।' },
    ],
    bestPractices: [
      { en: 'Map each risk to a concrete control in your codebase.', bn: 'প্রতি risk codebase-এ concrete control।' },
      { en: 'Test authorization as two different users.', bn: 'দুই user হিসেবে authz test।' },
    ],
  },

  'sql-injection-xss-csrf-ssrf-and-broken-access-control': {
    id: 'sql-injection-xss-csrf-ssrf-and-broken-access-control',
    explanation: {
      what: { en: '**SQL injection** via raw SQL strings. **XSS** via unencoded output. **CSRF** via auto-sent cookies. **SSRF** via server fetching user URLs. **IDOR** = broken access control on object IDs.', bn: '**SQL injection** raw SQL। **XSS** unencoded output। **CSRF** auto cookie। **SSRF** server user URL fetch। **IDOR** object ID access control ভাঙা।' },
      why: { en: 'These five still own production breaches. EF Core LINQ is safe; `FromSqlRaw` with concatenation is not.', bn: 'এ পাঁচটি এখনো production breach। EF LINQ safe; `FromSqlRaw` concatenate নয়।' },
      how: { en: 'SQL: parameterized only. XSS: encode + CSP. CSRF: antiforgery/SameSite for cookies. SSRF: allowlist hosts, block private IPs. IDOR: tenant/user predicate on every query.', bn: 'SQL: parameterized। XSS: encode + CSP। CSRF: antiforgery। SSRF: allowlist, private IP block। IDOR: প্রতি query-তে user predicate।' },
      analogy: { en: 'SQL injection = accepting any ingredient label at a pharmacy (attacker writes "poison" as medicine name). IDOR = hotel giving you any room key if you guess the number.', bn: 'SQL injection = pharmacy-তে যেকোনো label (attacker "poison" লেখে)। IDOR = room number guess করলে যেকোনো key।' },
      realWorld: { en: 'Webhook test URL feature fetching `http://169.254.169.254` — cloud metadata stolen via SSRF.', bn: 'Webhook URL `169.254.169.254` — SSRF দিয়ে cloud metadata চুরি।' },
    },
    codeExplanation: { en: '- `FromSqlInterpolated` — still parameterized (safe)\n- `FromSqlRaw` with concatenation — injection risk', bn: '- `FromSqlInterpolated` — parameterized (safe)\n- `FromSqlRaw` concatenate — injection risk' },
    commonMistakes: [
      { en: 'FromSqlRaw with interpolated user input.', bn: 'FromSqlRaw-এ user input interpolate।' },
      { en: 'Authorizing in SPA router but not API.', bn: 'SPA router-এ authz, API-তে নয়।' },
    ],
    bestPractices: [
      { en: 'Parameterized SQL only; grep for Raw in PRs.', bn: 'Parameterized SQL; PR-এ Raw grep।' },
      { en: 'SSRF: allowlist + block private networks.', bn: 'SSRF: allowlist + private network block।' },
    ],
  },

  // ── Architecture (first 4) ───────────────────────────────────────────
  'repository-generic-repository-and-unit-of-work': {
    id: 'repository-generic-repository-and-unit-of-work',
    diagram: REPOSITORY_PATTERN_DIAGRAM,
    explanation: {
      what: { en: '**Repository** hides persistence behind an interface. **Unit of Work** commits one business action atomically. In EF Core, **DbContext already is UoW + identity map**.', bn: '**Repository** persistence interface-এর পিছনে। **UoW** এক business action atomic commit। EF-এ **DbContext-ই UoW + identity map**।' },
      why: { en: 'Extra IUnitOfWork wrapper that only calls SaveChanges adds noise. Generic `IRepository<T>` returning IQueryable leaks EF and hides SQL.', bn: 'শুধু SaveChanges-এর IUnitOfWork noise। Generic `IRepository<T>` + IQueryable EF leak, SQL লুকায়।' },
      how: { en: 'Inject DbContext or focused `IOrderRepository` per aggregate. One Scoped context per request. One SaveChanges at end of use case.', bn: 'DbContext বা aggregate-wise `IOrderRepository` inject। এক Scoped context/request। use case শেষে এক SaveChanges।' },
      analogy: { en: 'DbContext = checkout counter that rings up everything in your cart in one transaction. Extra UoW wrapper = second cashier who only presses "total" — same job, more steps.', bn: 'DbContext = checkout এক transaction-এ সব ring up। Extra UoW = দ্বিতীয় cashier শুধু "total" — same job, বেশি step।' },
      realWorld: { en: 'Order saved, then Payment saved in two SaveChanges — payment succeeds after order rolls back. Fix: one context, one SaveChanges.', bn: 'দুই SaveChanges — payment success, order rollback। Fix: এক context, এক SaveChanges।' },
    },
    codeExplanation: { en: '- `IOrderRepository` — narrow port per aggregate\n- `OrderRepository` uses DbContext but service depends on interface\n- `AddAsync` does not SaveChanges — caller commits once', bn: '- `IOrderRepository` — aggregate port\n- Service interface-এ depend\n- `AddAsync` SaveChanges নয় — caller একবার commit' },
    commonMistakes: [
      { en: 'IUnitOfWork that only forwards SaveChanges.', bn: 'শুধু SaveChanges forward করা IUnitOfWork।' },
      { en: 'Two DbContexts both calling SaveChanges in one request.', bn: 'এক request-এ দুই DbContext SaveChanges।' },
    ],
    bestPractices: [
      { en: 'Treat DbContext as UoW; skip redundant wrapper.', bn: 'DbContext = UoW; redundant wrapper skip।' },
      { en: 'Return DTOs/domain types, never IQueryable from repository.', bn: 'Repository থেকে DTO, IQueryable নয়।' },
    ],
  },

  'specification-pattern-and-the-service-layer': {
    id: 'specification-pattern-and-the-service-layer',
    explanation: {
      what: { en: '**Specification** packages a reusable business predicate as an `Expression<Func<T,bool>>` for EF translation. **Application services** orchestrate use cases; **domain services** hold cross-aggregate rules without I/O.', bn: '**Specification** reusable business predicate `Expression<Func<T,bool>>`। **Application service** use case orchestrate। **Domain service** cross-aggregate rule, I/O নয়।' },
      why: { en: 'Copy-paste LINQ for "active premium EU customers" across query, validation, and domain drifts. God application services become 3000-line transaction scripts.', bn: '"active premium EU customer" LINQ copy-paste drift করে। God service ৩০০০-line script।' },
      how: { en: 'Spec exposes Expression (not Func) for SQL. Application service: load → domain → save → ports. Domain service: no DbContext/HttpClient.', bn: 'Spec Expression (Func নয়) SQL-এর জন্য। App service: load → domain → save। Domain service: DbContext/HttpClient নয়।' },
      analogy: { en: 'Specification = standardized filter label at a coffee shop ("decaf + oat milk + large") — same label at register, kitchen, and loyalty app instead of re-describing each time.', bn: 'Specification = coffee shop standard label ("decaf + oat + large") — register, kitchen, app-এ এক label, বারবার describe নয়।' },
      realWorld: { en: 'Spec with `DateTime.Now` inside expression — compiles in C# but EF cannot translate; blows up at query time.', bn: 'Spec-এ `DateTime.Now` — C# compile, EF translate নয়; query time-এ fail।' },
    },
    codeExplanation: { en: '- `ActivePremiumSpec.ToExpression()` — EF-translatable Expression\n- `PlaceOrderService` — orchestrates repo + payment + single SaveChanges\n- `PricingService` — domain logic, no I/O', bn: '- `ToExpression()` — EF translate\n- `PlaceOrderService` — orchestrate + এক SaveChanges\n- `PricingService` — domain, I/O নয়' },
    commonMistakes: [
      { en: 'Specification EF cannot translate.', bn: 'EF translate না হয় এমন Specification।' },
      { en: 'Domain service injected with DbContext.', bn: 'Domain service-এ DbContext inject।' },
    ],
    bestPractices: [
      { en: 'Name specs after business language.', bn: 'Spec নাম business language-এ।' },
      { en: 'Delete pass-through Handler→Service→Repository layers.', bn: 'Pass-through layer মুছুন।' },
    ],
  },

  'cqrs-when-it-helps-and-when-it-hurts': {
    id: 'cqrs-when-it-helps-and-when-it-hurts',
    diagram: CQRS_DIAGRAM,
    explanation: {
      what: { en: '**CQRS** splits write model (commands, invariants, transactions) from read model (queries, projections, denormalized views). It is not just MediatR folder names.', bn: '**CQRS** write (command, invariant) ও read (query, projection) আলাদা। শুধু MediatR folder নয়।' },
      why: { en: 'Forcing reads and writes through the same entities causes slow reads or polluted write models. CQRS helps when read/write scale or shape diverges.', bn: 'এক entity-তে read/write force করলে slow read বা polluted write। Read/write আলাদা scale/shape হলে CQRS সাহায্য করে।' },
      how: { en: 'Start with two models, one database (SQL views or projection tables). Commands enforce invariants + SaveChanges. Queries never SaveChanges.', bn: 'শুরু: দুই model, এক DB (view/projection table)। Command invariant + SaveChanges। Query SaveChanges নয়।' },
      analogy: { en: 'Restaurant: kitchen (write) follows strict recipes and inventory rules. Menu board (read) shows customer-friendly names and photos — optimized for reading, not for cooking.', bn: 'রেস্টুরেন্ট: kitchen (write) strict recipe। Menu board (read) customer-friendly — পড়ার জন্য optimize, রান্নার নয়।' },
      realWorld: { en: 'Dashboard polls projection 3 seconds behind write DB — operators "fix" data already correct in write store. Document stale-read UX.', bn: 'Dashboard projection ৩s পিছিয়ে — operator ভুল "fix" করে। Stale-read UX document করুন।' },
    },
    commonMistakes: [
      { en: 'Calling MediatR folders "CQRS" with same DTO in/out.', bn: 'MediatR folder "CQRS" same DTO দিয়ে।' },
      { en: 'Async projections with no stale-read story.', bn: 'Stale-read story ছাড়া async projection।' },
    ],
    bestPractices: [
      { en: 'Start logical CQRS in one database.', bn: 'এক DB-তে logical CQRS শুরু।' },
      { en: 'Document consistency: sync vs eventual.', bn: 'Consistency document: sync vs eventual।' },
    ],
  },

  'clean-onion-and-hexagonal-architecture': {
    id: 'clean-onion-and-hexagonal-architecture',
    diagram: CLEAN_ARCH_DIAGRAM,
    explanation: {
      what: { en: '**Clean/Onion/Hexagonal** architecture: domain at center, dependencies point inward. **Ports** (interfaces) inside; **adapters** (EF, HTTP) outside.', bn: '**Clean/Onion/Hexagonal**: domain কেন্দ্রে, dependency ভিতরের দিকে। **Port** ভিতরে; **adapter** (EF, HTTP) বাইরে।' },
      why: { en: 'When domain references EF or ASP.NET, you cannot test business rules without a database or change storage without rewriting rules.', bn: 'Domain EF/ASP.NET reference করলে DB ছাড়া test বা storage change করতে rule rewrite।' },
      how: { en: 'Domain: no framework refs. Application: use cases + port interfaces. Infrastructure: implements ports. Program.cs wires DI.', bn: 'Domain: framework ref নয়। Application: use case + port। Infrastructure: port implement। Program.cs DI wire।' },
      analogy: { en: 'Electrical outlet (port) is standard in every room (domain). You plug different adapters (US plug, EU plug) without rewiring the house.', bn: 'Electrical outlet (port) standard। আলাদা adapter (US/EU plug) plug করুন, বাড়ি rewire নয়।' },
      realWorld: { en: 'Domain entity with `[Table]` attribute — storage concern leaked inward; changing DB requires touching business rules.', bn: 'Domain entity-এ `[Table]` — storage leak inward; DB change-এ business rule touch।' },
    },
    codeExplanation: { en: '- `IPaymentPort` — port in application layer\n- `StripePaymentAdapter` — infrastructure adapter\n- `Order.Place()` — domain factory, no EF', bn: '- `IPaymentPort` — application port\n- `StripePaymentAdapter` — infrastructure\n- `Order.Place()` — domain, EF নয়' },
    commonMistakes: [
      { en: 'EF entities as domain aggregates.', bn: 'EF entity domain aggregate হিসেবে।' },
      { en: '15 projects for a 3-endpoint service.', bn: '৩ endpoint-এ ১৫ project।' },
    ],
    bestPractices: [
      { en: 'Enforce inward dependencies with arch tests.', bn: 'Arch test দিয়ে inward dependency enforce।' },
      { en: 'Map EF entities at infrastructure boundary.', bn: 'Infrastructure boundary-এ EF map।' },
    ],
  },

  // ── Async (first 3) ──────────────────────────────────────────────────
  'async-await-task-task-t-valuetask-cpu-bound-vs-i-o-bound': {
    id: 'async-await-task-task-t-valuetask-cpu-bound-vs-i-o-bound',
    diagram: ASYNC_FLOW_DIAGRAM,
    explanation: {
      what: { en: '**async/await** is a compiler state machine — not a new thread. **Task** is a completion promise. **ValueTask** optimizes hot synchronous paths. CPU-bound work still occupies a thread.', bn: '**async/await** state machine — নতুন thread নয়। **Task** completion promise। **ValueTask** sync path optimize। CPU-bound thread দখল করে।' },
      why: { en: 'Blocking during I/O starves the thread pool. Typing async on CPU work does not make it faster. ValueTask must be awaited only once.', bn: 'I/O-তে block = thread pool starvation। CPU-তে async লিখলে দ্রুত হয় না। ValueTask একবার await।' },
      how: { en: 'await I/O APIs with CancellationToken. Task.Run only for CPU from UI. Public APIs return Task unless profiled for ValueTask.', bn: 'I/O-তে await + CancellationToken। Task.Run UI থেকে CPU-এ। Public API Task, profile ছাড়া ValueTask নয়।' },
      analogy: { en: 'Waiter at restaurant: blocking = standing at kitchen door. async = taking other orders while food cooks, bell rings when ready.', bn: 'Waiter: blocking = kitchen door-এ দাঁড়ানো। async = অন্য order, bell এলে ফিরে।' },
      realWorld: { en: '`Task.Run(() => File.ReadAllText)` in controller — wastes a pool thread; use `ReadAllTextAsync` instead.', bn: 'Controller-এ `Task.Run(ReadAllText)` — pool thread waste; `ReadAllTextAsync` ব্যবহার করুন।' },
    },
    codeExplanation: { en: '- `TryGetValue` cache hit — ValueTask returns synchronously without Task alloc\n- `Task.WhenAll` — concurrent I/O fan-out\n- pass `ct` through the chain', bn: '- cache hit — ValueTask sync return\n- `Task.WhenAll` — concurrent I/O\n- `ct` chain-এ পাস' },
    commonMistakes: [
      { en: 'async void outside event handlers.', bn: 'Event handler ছাড়া async void।' },
      { en: 'Task.Run around EF/SQL in controller.', bn: 'Controller-এ EF/SQL-এ Task.Run।' },
    ],
    bestPractices: [
      { en: 'Async all the way for I/O.', bn: 'I/O-তে async all the way।' },
      { en: 'Never .Result/.Wait() in ASP.NET.', bn: 'ASP.NET-এ .Result/.Wait() নয়।' },
    ],
  },

  'synchronizationcontext-configureawait-and-threadpool-starvation': {
    id: 'synchronizationcontext-configureawait-and-threadpool-starvation',
    explanation: {
      what: { en: '**SynchronizationContext** marshals continuations (UI thread, legacy ASP.NET). ASP.NET Core has none — pool threads run continuations. **ConfigureAwait(false)** skips context capture. **Starvation** = all pool threads blocked.', bn: '**SynchronizationContext** continuation marshal (UI)। ASP.NET Core-এ নেই। **ConfigureAwait(false)** context skip। **Starvation** = সব pool thread block।' },
      why: { en: 'Sync-over-async (.Result) blocks pool threads while completions need free workers — app hangs with low CPU. Libraries should use ConfigureAwait(false).', bn: 'Sync-over-async pool block, completion-এ worker লাগে — hang, CPU কম। Library-তে ConfigureAwait(false)।' },
      how: { en: 'Never .Result in middleware/controllers. ConfigureAwait(false) in reusable libraries. Diagnose starvation with thread-pool metrics and dump.', bn: 'Middleware/controller-এ .Result নয়। Library-তে ConfigureAwait(false)। Starvation metric/dump দিয়ে diagnose।' },
      analogy: { en: 'Thread pool = airport gates. Sync-over-async = every gate occupied by planes that cannot leave until baggage (completion) arrives — but baggage handlers also need a free gate.', bn: 'Thread pool = airport gate। Sync-over-async = সব gate occupied, baggage handler-ও gate চায় — deadlock।' },
      realWorld: { en: '200 concurrent requests each calling `.Result` on HttpClient — thread pool exhausted, 502s, CPU at 5%.', bn: '২০০ request `.Result` — pool exhausted, 502, CPU ৫%।' },
    },
    codeExplanation: { en: '- `.ConfigureAwait(false)` on each await in library code\n- `Task.Run(() => sdk.FetchBlocking())` — isolate legacy blocking SDK only', bn: '- library-তে `.ConfigureAwait(false)`\n- legacy SDK isolate-এ `Task.Run`' },
    commonMistakes: [
      { en: '.Result in middleware "just once".', bn: 'Middleware-এ "একবার" .Result।' },
      { en: 'Parallel.ForEach of blocking work on request thread.', bn: 'Request thread-এ blocking Parallel.ForEach।' },
    ],
    bestPractices: [
      { en: 'ConfigureAwait(false) default in libraries.', bn: 'Library-তে default ConfigureAwait(false)।' },
      { en: 'await instead of sync-over-async everywhere.', bn: 'সব জায়গায় await, sync-over-async নয়।' },
    ],
  },

  'cancellationtoken-task-whenall-task-whenany-parallel-foreach-vs-task-whenall': {
    id: 'cancellationtoken-task-whenall-task-whenany-parallel-foreach-vs-task-whenall',
    explanation: {
      what: { en: '**CancellationToken** cooperatively cancels work. **Task.WhenAll** runs concurrent async I/O. **Task.WhenAny** returns first completion. **Parallel.ForEach** partitions CPU work on threads.', bn: '**CancellationToken** cooperative cancel। **WhenAll** concurrent async I/O। **WhenAny** প্রথম complete। **Parallel.ForEach** CPU thread partition।' },
      why: { en: 'Unbounded WhenAll on 10k HTTP calls socket-starves. Parallel.ForEach(async lambda) does not await — fire-and-forget bug. Ignoring cancel wastes resources on disconnected clients.', bn: '১০k WhenAll socket starve। Parallel.ForEach(async) await নয় — fire-and-forget। Cancel ignore = disconnected client-এ waste।' },
      how: { en: 'Link request token + timeout CTS. WhenAll with SemaphoreSlim limit (e.g. 8). Parallel.ForEach for in-memory CPU with MaxDegreeOfParallelism.', bn: 'Request + timeout token link। WhenAll SemaphoreSlim limit (৮)। CPU in-memory-তে Parallel.ForEach + MaxDegreeOfParallelism।' },
      analogy: { en: 'WhenAll = sending 8 waiters to 8 tables at once (I/O). Parallel.ForEach = 8 chefs each chopping vegetables simultaneously (CPU). Do not ask waiters to chop — wrong tool.', bn: 'WhenAll = ৮ waiter ৮ table (I/O)। Parallel.ForEach = ৮ chef chop (CPU)। Waiter-কে chop করাবেন না।' },
      realWorld: { en: 'Fan-out 100 exchange rates with WhenAll + SemaphoreSlim(8) — bounded concurrency, canceled when user navigates away.', bn: '১০০ rate WhenAll + SemaphoreSlim(৮) — bounded, user চলে গেলে cancel।' },
    },
    comparisonTable: {
      en: `| | Parallel.ForEach | Task.WhenAll |\n| :--- | :--- | :--- |\n| Best for | CPU in-memory | Async I/O |\n| During wait | Thread busy | Thread free |\n| ASP.NET | Dangerous heavy CPU | Correct with limit |`,
      bn: `| | Parallel.ForEach | Task.WhenAll |\n| :--- | :--- | :--- |\n| ভালো | CPU in-memory | Async I/O |\n| Wait-এ | Thread busy | Thread free |\n| ASP.NET | ভারী CPU বিপজ্জনক | limit সহ ঠিক |`,
    },
    codeExplanation: { en: '- `CreateLinkedTokenSource(ct, timeout.Token)` — combined cancel\n- `SemaphoreSlim(8)` — max 8 concurrent fetches\n- `Parallel.ForEach` with `CancellationToken` for CPU chunks', bn: '- linked token — combined cancel\n- SemaphoreSlim(৮) — max ৮ concurrent\n- Parallel.ForEach CPU chunk' },
    commonMistakes: [
      { en: 'Unbounded WhenAll on external APIs.', bn: 'External API-তে unbounded WhenAll।' },
      { en: 'Parallel.ForEach(async ...) — does not await.', bn: 'Parallel.ForEach(async) — await নয়।' },
    ],
    bestPractices: [
      { en: 'Link request abort + timeout at boundary.', bn: 'Boundary-এ request abort + timeout link।' },
      { en: 'SemaphoreSlim limit on I/O fan-out.', bn: 'I/O fan-out-এ SemaphoreSlim limit।' },
    ],
  },

  // ── LINQ (first 3) ───────────────────────────────────────────────────
  'deferred-vs-immediate-execution-and-multiple-enumeration': {
    id: 'deferred-vs-immediate-execution-and-multiple-enumeration',
    diagram: LINQ_DEFERRED_DIAGRAM,
    explanation: {
      what: { en: 'LINQ **deferred** operators (Where, Select) build a query; execution happens on foreach, ToList, Count, etc. **Immediate** operators force execution now.', bn: 'LINQ **deferred** (Where, Select) query তৈরি; foreach, ToList, Count-এ execute। **Immediate** এখনই execute।' },
      why: { en: 'Same IEnumerable enumerated twice runs the pipeline twice — two SQL round-trips on IQueryable. Side effects in Select run double.', bn: 'দুবার enumerate = দুবার pipeline — IQueryable-এ দুবার SQL। Select-এ side effect দুবার।' },
      how: { en: 'Materialize once with `ToListAsync` at the boundary. Reuse the list for Any/Count. Do not return live IQueryable past DbContext lifetime.', bn: 'Boundary-এ একবার `ToListAsync`। List reuse Any/Count-এ। DbContext lifetime-এর পরে IQueryable return নয়।' },
      analogy: { en: 'Deferred = writing a shopping list without going to the store. Immediate = going to checkout. Enumerating twice = two separate trips for the same list.', bn: 'Deferred = list লেখা, দোকানে যাওয়া নয়। Immediate = checkout। দুবার enumerate = এক list-এ দুই trip।' },
      realWorld: { en: '`if (query.Any()) return query.ToList()` — classic production bug doubling SQL on hot endpoint.', bn: '`Any()` তারপর `ToList()` — hot endpoint-এ দুবার SQL classic bug।' },
    },
    codeExplanation: { en: '- `OpenInvoices` returning IEnumerable — two consumers = two SQL\n- `GetOpenOnceAsync` with `ToListAsync` — single round-trip, then in-memory checks', bn: '- IEnumerable return — দুই consumer = দুই SQL\n- `ToListAsync` — এক round-trip, তারপর memory check' },
    commonMistakes: [
      { en: 'Any() then ToList() on same IQueryable.', bn: 'এক IQueryable-এ Any() তারপর ToList()।' },
      { en: 'Returning IQueryable after context disposed.', bn: 'Context dispose-এর পরে IQueryable return।' },
    ],
    bestPractices: [
      { en: 'Materialize at application boundary once.', bn: 'Boundary-এ একবার materialize।' },
      { en: 'Reuse list, not query object.', bn: 'Query নয়, list reuse।' },
    ],
  },

  'ienumerable-vs-iqueryable-vs-expression-trees': {
    id: 'ienumerable-vs-iqueryable-vs-expression-trees',
    explanation: {
      what: { en: '**IEnumerable** runs `Func` delegates in memory. **IQueryable** builds **expression trees** translated to SQL by EF. `AsEnumerable()` switches to in-memory evaluation.', bn: '**IEnumerable** memory-তে `Func`। **IQueryable** **expression tree** → EF SQL। `AsEnumerable()` memory evaluation।' },
      why: { en: 'Repository returning IEnumerable disables SQL translation for caller filters — full table loaded then filtered in CLR. Early AsEnumerable() is the classic performance trap.', bn: 'Repository IEnumerable return করলে caller filter SQL-এ যায় না — পুরো table memory-তে। তাড়াতাড়ি AsEnumerable() classic trap।' },
      how: { en: 'Keep IQueryable until ToListAsync. Repository exposes `IQueryable<T>` or named query methods. Never call untranslatable methods in IQueryable lambdas.', bn: 'ToListAsync পর্যন্ত IQueryable। Repository `IQueryable` বা named query। IQueryable lambda-তে untranslatable method নয়।' },
      analogy: { en: 'IQueryable = ordering from warehouse (database ships only what you need). IEnumerable = warehouse ships everything, you filter in your garage (memory).', bn: 'IQueryable = warehouse থেকে order (DB শুধু দরকারি পাঠায়)। IEnumerable = সব পাঠায়, garage-এ filter (memory)।' },
      realWorld: { en: '`store.Query()` assigned to IEnumerable then Where — EF already materialized; filter runs in app, not SQL.', bn: '`Query()` IEnumerable-এ then Where — EF materialize হয়ে গেছে; filter app-এ, SQL-এ নয়।' },
    },
    comparisonTable: {
      en: `| | IEnumerable | IQueryable |\n| :--- | :--- | :--- |\n| Lambda | Func | Expression |\n| Runs | CLR memory | Database |\n| Risk | Load too much | Bad SQL / client eval |`,
      bn: `| | IEnumerable | IQueryable |\n| :--- | :--- | :--- |\n| Lambda | Func | Expression |\n| চলে | Memory | Database |\n| Risk | বেশি load | খারাপ SQL |`,
    },
    codeExplanation: { en: '- `Query()` returns `IQueryable` — caller Where becomes SQL\n- `AccidentalFullTable` assigns to IEnumerable — disables translation', bn: '- `IQueryable` return — caller Where SQL\n- IEnumerable assign — translation বন্ধ' },
    commonMistakes: [
      { en: 'Repository returning IEnumerable.', bn: 'Repository IEnumerable return।' },
      { en: 'AsEnumerable() too early in EF chain.', bn: 'EF chain-এ তাড়াতাড়ি AsEnumerable()।' },
    ],
    bestPractices: [
      { en: 'Expose IQueryable or narrow query methods from data layer.', bn: 'Data layer থেকে IQueryable বা narrow query।' },
      { en: 'Review generated SQL in development.', bn: 'Development-এ generated SQL review।' },
    ],
  },

  'core-operators-where-select-selectmany-join-groupby-any-all-first-single-skip-take': {
    id: 'core-operators-where-select-selectmany-join-groupby-any-all-first-single-skip-take',
    explanation: {
      what: { en: 'Core LINQ operators: **Where** filter, **Select** project, **SelectMany** flatten, **Join** combine, **GroupBy** aggregate, **Any/All** quantify, **First/Single** pick one, **Skip/Take** page.', bn: 'Core LINQ: **Where** filter, **Select** project, **SelectMany** flatten, **Join** combine, **GroupBy** aggregate, **Any/All**, **First/Single**, **Skip/Take** page।' },
      why: { en: 'Wrong operator choice causes bugs: `First` vs `Single` when zero or many matches, `Count()>0` instead of `Any()`, `Select` vs `SelectMany` for nested collections.', bn: 'ভুল operator bug: `First` vs `Single`, `Count()>0` vs `Any()`, nested collection-এ `Select` vs `SelectMany`।' },
      how: { en: 'Any for existence. Single when exactly one expected (throws otherwise). SelectMany for 1:N flatten. GroupBy + Sum for reports. Skip/Take for pagination on IQueryable.', bn: 'Existence-এ Any। Exactly one-এ Single। 1:N flatten SelectMany। Report GroupBy+Sum। Page Skip/Take IQueryable-এ।' },
      analogy: { en: 'SelectMany = airport baggage carousel merging all bags from every flight into one belt. Select = each flight keeps its own pile.', bn: 'SelectMany = সব flight-এর bag এক carousel-এ merge। Select = প্রতি flight আলাদা pile।' },
      realWorld: { en: '`departments.Select(d => d.Employees)` returns list of lists; `SelectMany(d => d.Employees)` returns flat employee list for one dropdown.', bn: '`Select` list of lists; `SelectMany` flat employee list dropdown-এর জন্য।' },
    },
    comparisonTable: {
      en: `| Operator | Use | Pitfall |\n| :--- | :--- | :--- |\n| Any | Exists? | Count()>0 slower |\n| Single | Exactly one | Throws if 0 or 2+ |\n| First | First or default | Hides multiple rows |\n| SelectMany | Flatten nested | vs Select keeps nesting |`,
      bn: `| Operator | ব্যবহার | Pitfall |\n| :--- | :--- | :--- |\n| Any | আছে? | Count()>0 ধীর |\n| Single | ঠিক একটা | ০/২+ হলে throw |\n| First | প্রথম | multiple hide |\n| SelectMany | Flatten | Select nesting রাখে |`,
    },
    commonMistakes: [
      { en: 'First when Single is required for uniqueness.', bn: 'Unique লাগলে First, Single নয়।' },
      { en: 'Select instead of SelectMany for nested collections.', bn: 'Nested-এ Select, SelectMany নয়।' },
    ],
    bestPractices: [
      { en: 'Any/AnyAsync for existence checks.', bn: 'Existence-এ Any/AnyAsync।' },
      { en: 'Single/SingleAsync when exactly one row expected.', bn: 'ঠিক এক row-এ Single/SingleAsync।' },
    ],
  },

  // ── Caching (first 2) ────────────────────────────────────────────────
  'cache-aside-read-through-write-through-write-behind': {
    id: 'cache-aside-read-through-write-through-write-behind',
    diagram: CACHE_ASIDE_DIAGRAM,
    explanation: {
      what: { en: '**Cache-aside**: app checks cache, on miss loads DB, sets cache. **Write-through**: write DB + cache together. **Write-behind**: write cache, flush DB later — fast but risky.', bn: '**Cache-aside**: cache check, miss-এ DB, set cache। **Write-through**: DB+cache একসাথে। **Write-behind**: cache আগে, DB পরে — দ্রুত, risky।' },
      why: { en: 'Caching is a consistency decision. Wrong pattern loses money: write-behind payments on Redis restart. Forgetting invalidation serves stale prices for hours.', bn: 'Cache consistency decision। ভুল pattern টাকা হারায়: write-behind payment Redis restart-এ। Invalidation ভুলে stale price ঘণ্টা।' },
      how: { en: 'Default: cache-aside + invalidate on write. Commit DB first, then delete/overwrite cache key. Never write-behind durable business state without disk-backed outbox.', bn: 'Default: cache-aside + write-এ invalidate। DB commit আগে, তারপর cache delete/overwrite। Durable state write-behind নয় outbox ছাড়া।' },
      analogy: { en: 'Cache-aside = checking your pantry before going to the store (miss = shop trip). Write-through = buying groceries and stocking pantry in one trip. Write-behind = eating from pantry now, grocery delivery truck comes later — if truck crashes, food diary was wrong.', bn: 'Cache-aside = pantry check, নেই মানে store। Write-through = কেনা + pantry এক trip। Write-behind = pantry খাও, truck পরে — truck crash হলে ভুল inventory।' },
      realWorld: { en: 'Product price: cache-aside + invalidate on admin save. Payment capture: no cache as source of truth.', bn: 'Product price: cache-aside + admin save-এ invalidate। Payment: cache source of truth নয়।' },
    },
    codeExplanation: { en: '- `GetStringAsync` — cache hit path\n- miss → DB query → `SetStringAsync` with 5min TTL\n- update flow: SaveChanges then `Remove` key', bn: '- `GetStringAsync` — cache hit\n- miss → DB → `SetStringAsync` TTL\n- update: SaveChanges তারপর `Remove`' },
    commonMistakes: [
      { en: 'Update SQL but forget Redis invalidation.', bn: 'SQL update, Redis invalidate ভুলে।' },
      { en: 'Write-behind for payments.', bn: 'Payment-এ write-behind।' },
    ],
    bestPractices: [
      { en: 'DB commit first, then invalidate cache.', bn: 'আগে DB commit, তারপর cache invalidate।' },
      { en: 'Cache-aside for most .NET apps.', bn: 'বেশিরভাগ .NET app-এ cache-aside।' },
    ],
  },

  'ttl-invalidation-imemorycache-vs-idistributedcache-vs-redis': {
    id: 'ttl-invalidation-imemorycache-vs-idistributedcache-vs-redis',
    explanation: {
      what: { en: '**TTL** expires cache entries. **IMemoryCache** is per-process. **IDistributedCache** (Redis) is shared across instances. Invalidation on write beats TTL alone for correctness.', bn: '**TTL** cache expire। **IMemoryCache** per-process। **IDistributedCache** (Redis) সব instance share। Write-এ invalidation TTL-এর চেয়ে correct।' },
      why: { en: 'IMemoryCache on a 10-instance farm = random brains — revoke on instance A, instance B still allows. Sliding TTL on auth = busy stolen session never expires.', bn: '১০ instance IMemoryCache = random brain — A-তে revoke, B allow। Auth-এ sliding TTL = busy stolen session মরে না।' },
      how: { en: 'Absolute TTL + explicit invalidation on writes. Redis for multi-instance. Optional IMemoryCache L1 with tiny TTL in front of Redis L2. Add jitter to prevent avalanche.', bn: 'Absolute TTL + write invalidation। Multi-instance Redis। Optional IMemoryCache L1 ছোট TTL। Avalanche prevent jitter।' },
      analogy: { en: 'IMemoryCache = each cashier has their own sticky note with prices (inconsistent across lanes). Redis = central price board every lane reads.', bn: 'IMemoryCache = প্রতি cashier-এর sticky note (inconsistent)। Redis = central price board সব lane পড়ে।' },
      realWorld: { en: 'Feature flag toggled in Redis but IMemoryCache L1 still shows old value for 30 seconds — document L1 TTL or pub/sub invalidation.', bn: 'Redis-এ flag toggle, IMemoryCache L1 ৩০s পুরনো — L1 TTL বা pub/sub invalidation document।' },
    },
    comparisonTable: {
      en: `| | IMemoryCache | Redis |\n| :--- | :--- | :--- |\n| Scope | One process | All instances |\n| Good for | L1, compiled trees | Sessions, shared DTOs |\n| Failure | Farm inconsistency | Extra outage domain |`,
      bn: `| | IMemoryCache | Redis |\n| :--- | :--- | :--- |\n| Scope | এক process | সব instance |\n| ভালো | L1 | Session, shared DTO |\n| Failure | Farm inconsistent | Extra outage |`,
    },
    codeExplanation: { en: '- `AbsoluteExpirationRelativeToNow` — hard expiry cap\n- `SlidingExpiration` — extends on hit (careful on auth)\n- `TryGetValue` memory L1 before Redis L2', bn: '- AbsoluteExpiration — hard cap\n- SlidingExpiration — hit-এ extend (auth সতর্ক)\n- memory L1 তারপর Redis L2' },
    commonMistakes: [
      { en: 'Sliding expiration on security data without absolute cap.', bn: 'Security data-এ sliding, absolute cap নয়।' },
      { en: 'IMemoryCache for shared sessions behind load balancer.', bn: 'Load balancer-এ IMemoryCache shared session।' },
    ],
    bestPractices: [
      { en: 'Absolute TTL + invalidation on writes.', bn: 'Absolute TTL + write invalidation।' },
      { en: 'Cache DTOs, never tracked EF entities.', bn: 'DTO cache, tracked EF entity নয়।' },
    ],
  },

  'loop-control-foreach-vs-for': {
    id: 'loop-control-foreach-vs-for',
    explanation: {
      what: { en: '**foreach** iterates collections read-only via \`IEnumerator\`. **for** gives index control for modification, skipping, or backward deletion.', bn: '**foreach** \`IEnumerator\` দিয়ে collection read-only iterate করে। **for** index control দেয় — modify, skip, backward delete।' },
      why: { en: 'Wrong loop choice causes \`InvalidOperationException\` (modify during foreach) or O(n²) when searching inside loops.', bn: 'ভুল loop-এ \`InvalidOperationException\` (foreach-এ modify) বা loop-এ search করলে O(n²) trap।' },
      how: { en: 'Default to foreach for reading. Use backward for when removing: \`for (int i = list.Count - 1; i >= 0; i--)\`. Use for when you need index steps.', bn: 'পড়ার জন্য foreach। item remove: backward for। index step লাগলে for।' },
      analogy: { en: 'foreach is a conveyor belt — you watch items pass, cannot rearrange mid-run. for is walking a shelf with a step counter.', bn: 'foreach = conveyor belt — চলাকালীন rearrange যায় না। for = step counter সহ shelf walk।' },
      realWorld: { en: 'Removing expired sessions from a List: backward for works; foreach + Remove throws at runtime in production.', bn: 'Expired session List থেকে remove: backward for কাজ করে; foreach + Remove production-এ exception।' },
    },
    comparisonTable: {
      en: `| Scenario | Loop | Why |
| :--- | :--- | :--- |
| Print all items | foreach | Clean syntax |
| Remove items | for backward | No index shift bug |
| Every 3rd update | for | Flexible step |`,
      bn: `| Scenario | Loop | কেন |
| :--- | :--- | :--- |
| সব print | foreach | Clean |
| Remove | for backward | Index bug নয় |
| প্রতি ৩য় update | for | Flexible step |`,
    },
    commonMistakes: [
      { en: 'Modifying a collection inside foreach (\`InvalidOperationException\`).', bn: 'foreach-এ collection modify — \`InvalidOperationException\`।' },
      { en: 'Using \`List.Contains\` inside a loop (O(n²)).', bn: 'Loop-এ \`List.Contains\` — O(n²) trap।' },
    ],
    bestPractices: [
      { en: 'Use foreach by default for readability.', bn: 'Default foreach readability-র জন্য।' },
      { en: 'When deleting, loop backward with for.', bn: 'Delete করলে backward for loop।' },
    ],
  },

  'list-vs-dictionary-performance-mapping': {
    id: 'list-vs-dictionary-performance-mapping',
    explanation: {
      what: { en: '**List<T>** is an ordered dynamic array — search is O(n). **Dictionary<K,V>** uses hashing for O(1) average lookup by key.', bn: '**List<T>** ordered dynamic array — search O(n)। **Dictionary<K,V>** hash দিয়ে key lookup O(1) average।' },
      why: { en: 'Using \`List.Find\` or \`Contains\` in hot paths with thousands of items destroys performance. Dictionary is built for repeated ID lookups.', bn: 'হাজার item-এ \`List.Find\`/\`Contains\` hot path নষ্ট করে। বারবার ID lookup-এ Dictionary।' },
      how: { en: 'Use List when order matters or you iterate all items once. Use Dictionary for repeated key lookup. Use HashSet for uniqueness checks.', bn: 'Order গুরুত্বপূর্ণ বা সব iterate — List। বারবার key lookup — Dictionary। unique check — HashSet।' },
      analogy: { en: 'List is a numbered bookshelf — finding book #847 means scanning from the start. Dictionary is a catalog — jump directly to the shelf.', bn: 'List = numbered bookshelf — #847 খুঁজতে scan। Dictionary = catalog — সরাসরি shelf।' },
      realWorld: { en: 'User permission checks on every API call: \`Dictionary<userId, Role>\` beats scanning a List of 50k users per request.', bn: 'প্রতি API call permission: 50k user List scan নয়, \`Dictionary<userId, Role>\`।' },
    },
    comparisonTable: {
      en: `| | List | Dictionary |
| :--- | :--- | :--- |
| Lookup | O(n) | O(1) avg |
| Order | Yes | No |
| Duplicates | Values OK | Unique keys |`,
      bn: `| | List | Dictionary |
| :--- | :--- | :--- |
| Lookup | O(n) | O(1) avg |
| Order | Yes | No |
| Duplicate | Value OK | Unique key |`,
    },
    commonMistakes: [
      { en: '\`List.Contains\` in a loop (O(n²)).', bn: 'Loop-এ \`List.Contains\` — O(n²)।' },
      { en: '\`Dictionary[key]\` without \`TryGetValue\` (KeyNotFoundException).', bn: '\`TryGetValue\` ছাড়া \`Dictionary[key]\` — exception।' },
    ],
    bestPractices: [
      { en: 'Use \`TryGetValue\` for safe Dictionary reads.', bn: 'Dictionary-এ \`TryGetValue\` safe read।' },
      { en: 'Use HashSet when you only need uniqueness.', bn: 'শুধু unique লাগলে HashSet।' },
    ],
  },

  'tuples-delegates-func-concept': {
    id: 'tuples-delegates-func-concept',
    explanation: {
      what: { en: '**ValueTuple** groups multiple return values without a class. **Delegate** is a type-safe method pointer. **Func** and **Action** are built-in delegate shortcuts.', bn: '**ValueTuple** class ছাড়া multiple value return। **Delegate** type-safe method pointer। **Func/Action** built-in delegate shortcut।' },
      why: { en: 'Creating a DTO class for every two-value return is ceremony. Delegates enable callbacks, LINQ, and event-driven code.', bn: 'দুই value return-এ class ceremony। Delegate callback, LINQ, event-এ লাগে।' },
      how: { en: 'Return \`(int id, string name)\` from methods. Store methods in \`Func<int, bool>\`. Use \`Action\` for void callbacks.', bn: 'Method থেকে \`(int id, string name)\` return। \`Func<int, bool>\`-এ method store। void callback-এ Action।' },
      analogy: { en: 'Tuple is a labeled envelope — no filing cabinet (class) needed. Delegate is a phone number you pass so someone else calls the method later.', bn: 'Tuple = labeled envelope — class লাগে না। Delegate = phone number — পরে call করার জন্য pass।' },
      realWorld: { en: 'LINQ \`.Where(x => x > 5)\` uses Func under the hood. OrderService returns \`(bool ok, string error)\` for business validation.', bn: 'LINQ \`.Where(x => x > 5)\` ভিতরে Func। OrderService validation-এ \`(bool ok, string error)\` return।' },
    },
    comparisonTable: {
      en: `| Type | Signature | Use |
| :--- | :--- | :--- |
| Action | void | Fire-and-forget |
| Func<T> | returns T | LINQ, factories |
| ValueTuple | (a, b) | Multi-return |`,
      bn: `| Type | Signature | Use |
| :--- | :--- | :--- |
| Action | void | Fire-and-forget |
| Func<T> | T return | LINQ, factory |
| ValueTuple | (a, b) | Multi-return |`,
    },
    commonMistakes: [
      { en: 'Using \`Tuple\` class instead of ValueTuple (extra heap allocation).', bn: 'ValueTuple-এর বদলে Tuple class — extra allocation।' },
      { en: 'Multicast delegate without knowing invocation order.', bn: 'Multicast delegate order না জেনে — unpredictable।' },
    ],
    bestPractices: [
      { en: 'Prefer ValueTuple for lightweight multi-return.', bn: 'Multi-return-এ ValueTuple।' },
      { en: 'Use Func/Action instead of custom delegate types when possible.', bn: 'Custom delegate-এর বদলে Func/Action।' },
    ],
  },

  'mvc-lifecycle-middleware-pipeline-routing': {
    id: 'mvc-lifecycle-middleware-pipeline-routing',
    explanation: {
      what: { en: 'An ASP.NET Core request flows through **middleware** (logging, auth, CORS), then **routing** maps URL to endpoint, then **MVC** invokes controller action.', bn: 'ASP.NET Core request **middleware** (logging, auth, CORS) দিয়ে যায়, **routing** URL endpoint-এ map করে, **MVC** controller action invoke করে।' },
      why: { en: 'Middleware order matters: exception handler early, auth before endpoints, static files before routing. Wrong order = auth bypass or broken CORS.', bn: 'Middleware order গুরুত্বপূর্ণ: exception handler আগে, auth endpoint-এর আগে। ভুল order = auth bypass বা broken CORS।' },
      how: { en: 'Configure in \`Program.cs\`: \`UseExceptionHandler\` → \`UseHttpsRedirection\` → \`UseAuthentication\` → \`UseAuthorization\` → \`MapControllers\`.', bn: '\`Program.cs\`-এ: \`UseExceptionHandler\` → \`UseHttpsRedirection\` → \`UseAuthentication\` → \`UseAuthorization\` → \`MapControllers\`।' },
      analogy: { en: 'Airport: security → passport → gate → plane. Each station can stop you or pass you forward. Middleware is the same for HTTP.', bn: 'বিমানবন্দর: security → passport → gate → plane। প্রতিটি station থামাতে বা এগিয়ে পাঠাতে পারে।' },
      realWorld: { en: 'A \`/api/orders/42\` GET hits routing, resolves \`OrdersController.Get(42)\`, model binding fills \`id=42\`, action returns JSON.', bn: '\`/api/orders/42\` GET routing-এ \`OrdersController.Get(42)\` resolve, model binding \`id=42\`, JSON return।' },
    },
    diagram: ASPNET_PIPELINE_DIAGRAM,
    comparisonTable: {
      en: `| Stage | Responsibility | Example |
| :--- | :--- | :--- |
| Middleware | Cross-cutting | Logging, CORS |
| Routing | URL → endpoint | [Route attribute] |
| MVC | Action execution | Controller method |`,
      bn: `| Stage | দায়িত্ব | উদাহরণ |
| :--- | :--- | :--- |
| Middleware | Cross-cutting | Logging, CORS |
| Routing | URL → endpoint | [Route attribute] |
| MVC | Action execution | Controller method |`,
    },
    commonMistakes: [
      { en: 'Putting \`UseAuthorization\` before \`UseAuthentication\`.', bn: '\`UseAuthorization\` \`UseAuthentication\`-এর আগে রাখা।' },
      { en: 'Duplicating auth logic in every controller instead of middleware/filters.', bn: 'প্রতি controller-এ auth duplicate — middleware/filter ব্যবহার করুন।' },
    ],
    bestPractices: [
      { en: 'Document middleware order in a team wiki or comment block.', bn: 'Middleware order team wiki-তে document করুন।' },
      { en: 'Use endpoint routing (\`MapControllers\`) not legacy MVC route table for APIs.', bn: 'API-তে endpoint routing (\`MapControllers\`) ব্যবহার করুন।' },
    ],
  },

  'filters-model-binding-validation': {
    id: 'filters-model-binding-validation',
    explanation: {
      what: { en: '**Filters** run before/after actions (auth, validation, exception). **Model binding** maps HTTP data to parameters. **Validation** checks \`[Required]\`, \`[Range]\`, FluentValidation rules.', bn: '**Filters** action-এর আগে/পরে চলে (auth, validation)। **Model binding** HTTP data parameter-এ map। **Validation** \`[Required]\`, FluentValidation check।' },
      why: { en: 'Without filters, every action duplicates auth and error handling. Without validation, bad input reaches your database and causes 500s or data corruption.', bn: 'Filter ছাড়া প্রতি action-এ auth duplicate। Validation ছাড়া bad input database-এ যায় — 500 বা corrupt data।' },
      how: { en: 'Add \`[ApiController]\` for automatic 400 on invalid model. Use \`IAsyncActionFilter\` for logging. Register FluentValidation in DI.', bn: '\`[ApiController]\` invalid model-এ auto 400। \`IAsyncActionFilter\` logging-এ। FluentValidation DI-তে register।' },
      analogy: { en: 'Model binding is a translator at customs — converts JSON/form to C# objects. Validation is the inspector who rejects invalid passports.', bn: 'Model binding = customs translator — JSON/form C# object-এ। Validation = inspector — invalid reject।' },
      realWorld: { en: 'POST \`/orders\` with negative quantity: model binder fills \`CreateOrderDto\`, \`[Range(1,100)]\` fails, API returns 400 ProblemDetails without hitting SQL.', bn: 'POST \`/orders\` negative quantity: binder \`CreateOrderDto\` fill, \`[Range(1,100)]\` fail, 400 ProblemDetails — SQL-এ যায় না।' },
    },
    diagram: ASPNET_PIPELINE_DIAGRAM,
    comparisonTable: {
      en: `| Filter order | Type | Runs |
| :--- | :--- | :--- |
| 1 | Authorization | Before action |
| 2 | Action | Around action |
| 3 | Exception | On error |`,
      bn: `| Filter order | Type | কখন |
| :--- | :--- | :--- |
| 1 | Authorization | Action-এর আগে |
| 2 | Action | Action-এর around |
| 3 | Exception | Error-এ |`,
    },
    commonMistakes: [
      { en: 'Trusting client input without server-side validation.', bn: 'Server-side validation ছাড়া client input trust।' },
      { en: 'Using \`ModelState.IsValid\` manually when \`[ApiController]\` already handles it.', bn: '\`[ApiController]\` থাকলেও manually \`ModelState.IsValid\` — redundant।' },
    ],
    bestPractices: [
      { en: 'Return ProblemDetails (RFC 7807) for validation errors.', bn: 'Validation error-এ ProblemDetails return।' },
      { en: 'Validate at the boundary (DTO), not deep inside domain entities.', bn: 'Domain-এর ভিতরে নয়, boundary (DTO)-তে validate।' },
    ],
  },

  'mvc-vs-razor-pages-vs-web-api-state-management': {
    id: 'mvc-vs-razor-pages-vs-web-api-state-management',
    explanation: {
      what: { en: '**MVC** = controllers + views for server-rendered HTML. **Razor Pages** = page-focused (one .cshtml + PageModel). **Web API** = JSON endpoints, no views. **State**: TempData, Session, or stateless JWT.', bn: '**MVC** = controller + view HTML। **Razor Pages** = page-focused। **Web API** = JSON, no view। **State**: TempData, Session, stateless JWT।' },
      why: { en: 'Choosing MVC for a SPA backend wastes view engine overhead. Using Session for scale-out APIs breaks without sticky sessions or distributed cache.', bn: 'SPA backend-এ MVC view engine waste। Scale-out API-তে Session sticky session ছাড়া ভেঙে যায়।' },
      how: { en: 'SPA/mobile → Web API only. Admin CRUD with minimal JS → Razor Pages. Legacy MVC apps → migrate page-by-page to Razor Pages or Blazor.', bn: 'SPA/mobile → Web API। Admin CRUD minimal JS → Razor Pages। Legacy MVC → page-by-page migrate।' },
      analogy: { en: 'MVC is a full restaurant with kitchen (controller) and dining room (view). Web API is takeout only — food in a box (JSON). Razor Pages is a food truck — one window, one menu page.', bn: 'MVC = restaurant kitchen + dining room। Web API = takeout JSON। Razor Pages = food truck — এক window, এক page।' },
      realWorld: { en: 'React frontend + .NET backend: Web API with JWT, no Session. Internal admin tool: Razor Pages with cookie auth and TempData for wizard steps.', bn: 'React + .NET: Web API + JWT, Session নয়। Internal admin: Razor Pages + cookie + TempData wizard।' },
    },
    diagram: WEBAPI_FLOW_DIAGRAM,
    comparisonTable: {
      en: `| Style | Best for | State |
| :--- | :--- | :--- |
| Web API | SPA, mobile | JWT (stateless) |
| Razor Pages | Server HTML CRUD | Cookie + TempData |
| MVC | Legacy apps | Session (avoid at scale) |`,
      bn: `| Style | Best for | State |
| :--- | :--- | :--- |
| Web API | SPA, mobile | JWT (stateless) |
| Razor Pages | Server HTML CRUD | Cookie + TempData |
| MVC | Legacy | Session (scale-এ avoid) |`,
    },
    commonMistakes: [
      { en: 'Using Session for high-traffic APIs behind a load balancer without Redis.', bn: 'Load balancer-এ Session Redis ছাড়া — broken state।' },
      { en: 'Mixing MVC views and Web API in one controller class.', bn: 'এক controller-এ MVC view + Web API mix।' },
    ],
    bestPractices: [
      { en: 'Prefer stateless APIs; store state in client or database.', bn: 'Stateless API prefer; state client/database-এ।' },
      { en: 'Use \`[ApiController]\` + ProblemDetails for APIs.', bn: '\`[ApiController]\` + ProblemDetails API-তে।' },
    ],
  },

  'authentication-authorization-claims-roles-policies': {
    id: 'authentication-authorization-claims-roles-policies',
    explanation: {
      what: { en: '**Authentication** proves who you are (login). **Authorization** decides what you can do. **Claims** are key-value facts (\`sub\`, \`role\`). **Roles** group permissions. **Policies** combine claims/rules (\`RequireAdmin\`).', bn: '**Authentication** = কে আপনি (login)। **Authorization** = কী করতে পারবেন। **Claims** = key-value (\`sub\`, \`role\`)। **Roles** = permission group। **Policies** = claim/rule combine।' },
      why: { en: 'Checking \`User.IsInRole("Admin")\` everywhere couples code to role names. Policies centralize rules and support custom requirements (e.g. must own the resource).', bn: 'সব জায়গায় \`User.IsInRole("Admin")\` role name-এ couple। Policy rule centralize করে custom requirement support।' },
      how: { en: 'Register policies: \`options.AddPolicy("CanEditOrder", p => p.RequireClaim("permission", "orders:edit"))\`. Use \`[Authorize(Policy = "CanEditOrder")]\` on actions.', bn: 'Policy register: \`AddPolicy("CanEditOrder", ...)\`। Action-এ \`[Authorize(Policy = "CanEditOrder")]\`।' },
      analogy: { en: 'Authentication is showing ID at the door. Authorization is the VIP list — even with valid ID, you may not enter the backstage.', bn: 'Authentication = door-এ ID দেখানো। Authorization = VIP list — valid ID-তেও backstage নয়।' },
      realWorld: { en: 'Azure AD issues JWT with claims \`roles: ["Manager"]\`. Policy \`RequireManager\` checks claim; controller never hardcodes role string.', bn: 'Azure AD JWT \`roles: ["Manager"]\` claim। Policy \`RequireManager\` check — controller-এ role string hardcode নয়।' },
    },
    diagram: JWT_FLOW_DIAGRAM,
    comparisonTable: {
      en: `| Concept | Question | Example |
| :--- | :--- | :--- |
| AuthN | Who? | Login, JWT |
| AuthZ | Allowed? | Authorize attribute |
| Claim | Fact about user | sub, email claims |
| Policy | Rule set | RequireAdmin |`,
      bn: `| Concept | প্রশ্ন | উদাহরণ |
| :--- | :--- | :--- |
| AuthN | কে? | Login, JWT |
| AuthZ | Allowed? | Authorize attribute |
| Claim | User fact | sub, email claims |
| Policy | Rule set | RequireAdmin |`,
    },
    commonMistakes: [
      { en: 'Confusing authentication failure (401) with authorization failure (403).', bn: '401 (AuthN fail) vs 403 (AuthZ fail) confuse করা।' },
      { en: 'Storing permissions only in JWT without server-side refresh when roles change.', bn: 'Role change হলে JWT-তে permission refresh না করা।' },
    ],
    bestPractices: [
      { en: 'Use policies, not scattered role checks.', bn: 'Scattered role check নয়, policy।' },
      { en: 'Return 401 for missing/invalid token, 403 for valid but insufficient.', bn: 'Invalid token → 401, valid কিন্তু insufficient → 403।' },
    ],
  },

  'jwt-auth-cookie-auth-identity-framework-cors-versioning': {
    id: 'jwt-auth-cookie-auth-identity-framework-cors-versioning',
    explanation: {
      what: { en: '**JWT** = stateless bearer token for APIs. **Cookie auth** = server session in HttpOnly cookie for browser apps. **Identity** = ASP.NET user/role store. **CORS** controls cross-origin browser calls. **API versioning** (\`/v1/\`, header) avoids breaking clients.', bn: '**JWT** = stateless bearer API token। **Cookie** = HttpOnly cookie browser session। **Identity** = user/role store। **CORS** = cross-origin control। **Versioning** = breaking change avoid।' },
      why: { en: 'JWT in localStorage is XSS-vulnerable. Cookie without SameSite/Secure is CSRF-vulnerable. Missing CORS blocks SPA. Unversioned API breaks mobile apps on deploy.', bn: 'localStorage JWT XSS risk। Cookie SameSite/Secure ছাড়া CSRF। CORS missing SPA block। Unversioned API deploy-এ mobile break।' },
      how: { en: 'API: JWT in Authorization header + short expiry + refresh token. Browser MVC: cookie + Identity. Configure CORS for SPA origin only. Version via URL or \`Api-Version\` header.', bn: 'API: JWT header + short expiry + refresh। Browser MVC: cookie + Identity। CORS SPA origin only। Version URL/header।' },
      analogy: { en: 'JWT is a stamped wristband at a festival — show it at each gate, no central desk. Cookie is a cloakroom ticket — server looks up your coat.', bn: 'JWT = festival wristband — প্রতি gate-এ show, central desk নয়। Cookie = cloakroom ticket — server lookup।' },
      realWorld: { en: 'Mobile app uses JWT stored in secure keychain. Blazor WASM calls API with bearer token; CORS allows \`https://app.company.com\` only.', bn: 'Mobile JWT secure keychain-এ। Blazor WASM bearer token; CORS শুধু \`https://app.company.com\`।' },
    },
    diagram: JWT_FLOW_DIAGRAM,
    comparisonTable: {
      en: `| Auth | Best for | Risk |
| :--- | :--- | :--- |
| JWT | SPA, mobile API | XSS if localStorage |
| Cookie | Server-rendered | CSRF without SameSite |
| Identity | User DB + roles | Must configure correctly |`,
      bn: `| Auth | Best for | Risk |
| :--- | :--- | :--- |
| JWT | SPA, mobile API | localStorage XSS |
| Cookie | Server-rendered | CSRF |
| Identity | User DB | Config গুরুত্বপূর্ণ |`,
    },
    commonMistakes: [
      { en: 'Storing JWT in localStorage instead of memory or secure storage.', bn: 'JWT localStorage-এ — XSS risk।' },
      { en: 'CORS \`AllowAnyOrigin\` with credentials enabled.', bn: 'CORS \`AllowAnyOrigin\` + credentials — security hole।' },
    ],
    bestPractices: [
      { en: 'Use HttpOnly Secure SameSite cookies for browser auth.', bn: 'Browser auth: HttpOnly Secure SameSite cookie।' },
      { en: 'Version APIs before breaking changes; deprecate old versions with timeline.', bn: 'Breaking change-এর আগে version; পুরনো version timeline-এ deprecate।' },
    ],
  },

  'normalization-vs-denormalization-keys-and-constraints': {
    id: 'normalization-vs-denormalization-keys-and-constraints',
    explanation: {
      what: { en: '**Normalization vs Denormalization, Keys & Constraints**: Normalization (3NF) splits tables to reduce redundancy; denormalization duplicates data for faster reads; PK/FK/UNIQUE/CHECK constraints enforce integrity.', bn: '**Normalization vs Denormalization, Keys ও Constraints**: Normalization (3NF) table split করে redundancy কমায়; denormalization read speed-এর জন্য duplicate; PK/FK/UNIQUE/CHECK integrity enforce।' },
      why: { en: 'Understanding normalization vs denormalization, keys & constraints prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Normalization vs Denormalization, Keys ও Constraints বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Start normalized (3NF). Denormalize only hot read paths with a sync strategy (triggers, events). Always declare PK, FK, and NOT NULL on required columns.', bn: '3NF দিয়ে শুরু। শুধু hot read path denormalize — sync strategy (trigger, event) সহ। PK, FK, NOT NULL declare করুন।' },
      analogy: { en: 'Normalization is organizing a warehouse by SKU — no duplicate boxes. Denormalization is keeping a bestseller display near checkout — duplicate stock info for speed.', bn: 'Normalization = warehouse SKU organize — duplicate box নয়। Denormalization = checkout-এ bestseller display — speed-এর জন্য duplicate info।' },
      realWorld: { en: 'Order dashboard needed 12 joins — team denormalized \`OrderSummary\` table fed by Service Bus events; reads dropped from 800ms to 40ms.', bn: 'Order dashboard 12 join — team \`OrderSummary\` denormalize + Service Bus event; read 800ms → 40ms।' },
    },
    comparisonTable: {
      en: `| Approach | Pros | Cons |
| :--- | :--- | :--- |
| 3NF | No update anomalies | More joins |
| Denorm | Fast reads | Sync complexity |
| PK/FK | Referential integrity | Migration care |`,
      bn: `| Approach | Pros | Cons |
| :--- | :--- | :--- |
| 3NF | Update anomaly নয় | বেশি join |
| Denorm | Fast read | Sync complexity |
| PK/FK | Integrity | Migration care |`,
    },
    commonMistakes: [
      { en: 'Denormalizing without an update/sync plan (stale reads).', bn: 'Sync plan ছাড়া denormalize — stale read।' },
      { en: 'Missing FK constraints — orphan rows in production.', bn: 'FK missing — orphan row production-এ।' },
    ],
    bestPractices: [
      { en: 'Measure join cost before denormalizing.', bn: 'Denormalize-এর আগে join cost measure।' },
      { en: 'Use CHECK constraints for business rules at DB level.', bn: 'Business rule DB-তে CHECK constraint।' },
    ],
  },

  'indexes-clustered-nonclustered-composite-covering-included-columns-sargability': {
    id: 'indexes-clustered-nonclustered-composite-covering-included-columns-sargability',
    explanation: {
      what: { en: '**Indexes: Clustered, Nonclustered, Covering & SARGability**: Clustered index defines physical row order (one per table). Nonclustered indexes are separate structures. Composite/covering indexes include columns to avoid key lookups. SARGable predicates use index-friendly comparisons (no \`WHERE Year(Date)=2024\`).', bn: '**Index: Clustered, Nonclustered, Covering ও SARGability**: Clustered index physical row order (table-এ এক)। Nonclustered আলাদা structure। Composite/covering column include — key lookup avoid। SARGable = index-friendly comparison (\`Year(Date)\` avoid)।' },
      why: { en: 'Understanding indexes: clustered, nonclustered, covering & sargability prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Index: Clustered, Nonclustered, Covering ও SARGability বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Put clustered PK on narrow increasing key (bigint identity). Add nonclustered indexes matching WHERE + JOIN columns. Include SELECT columns for covering scans.', bn: 'Clustered PK narrow increasing key (bigint identity)। Nonclustered WHERE+JOIN column match। SELECT column include covering scan।' },
      analogy: { en: 'Clustered index is the book spine order — pages follow it. Nonclustered is the index at the back — points to page numbers.', bn: 'Clustered = book spine order। Nonclustered = পেছনের index — page number point।' },
      realWorld: { en: 'API filtered \`WHERE TenantId=@t AND Status=1 ORDER BY Created DESC\` — composite index \`(TenantId, Status, Created DESC) INCLUDE (Title)\` removed scans.', bn: 'API \`WHERE TenantId=@t AND Status=1 ORDER BY Created DESC\` — composite index \`(TenantId, Status, Created DESC) INCLUDE (Title)\` scan remove।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Clustered index defines physical row order (one per table). … | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Clustered index physical row order (table-এ এক)। Nonclustere… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating indexes: clustered, nonclustered, covering & sargability as a silver bullet without measuring impact.', bn: 'Index: Clustered, Nonclustered, Covering ও SARGability measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing indexes: clustered, nonclustered, covering & sargability.', bn: 'Index: Clustered, Nonclustered, Covering ও SARGability বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'execution-plans-query-optimization-and-missing-index-warnings': {
    id: 'execution-plans-query-optimization-and-missing-index-warnings',
    explanation: {
      what: { en: '**Execution Plans, Query Optimization & Missing Index Warnings**: SQL Server execution plans show operators (scan, seek, join). Missing index DMVs suggest indexes. Optimization targets fewer reads, no implicit conversions, and set-based logic.', bn: '**Execution Plan, Query Optimization ও Missing Index Warning**: Execution plan operator (scan, seek, join) দেখায়। Missing index DMV suggest। Optimization = কম read, implicit conversion নয়, set-based logic।' },
      why: { en: 'Understanding execution plans, query optimization & missing index warnings prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Execution Plan, Query Optimization ও Missing Index Warning বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Enable actual plan in SSMS/Azure Data Studio. Look for scans on large tables, key lookups, warnings. Test suggested indexes in non-prod first.', bn: 'SSMS/Azure Data Studio-এ actual plan enable। Large table scan, key lookup, warning খুঁজুন। Suggested index non-prod-এ test।' },
      analogy: { en: 'Execution Plans, Query Optimization & Missing Index Warnings is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Execution Plan, Query Optimization ও Missing Index Warning = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used execution plans, query optimization & missing index warnings during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Execution Plan, Query Optimization ও Missing Index Warning apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | SQL Server execution plans show operators (scan, seek, join)… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Execution plan operator (scan, seek, join) দেখায়। Missing i… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating execution plans, query optimization & missing index warnings as a silver bullet without measuring impact.', bn: 'Execution Plan, Query Optimization ও Missing Index Warning measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing execution plans, query optimization & missing index warnings.', bn: 'Execution Plan, Query Optimization ও Missing Index Warning বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'joins-cte-vs-temp-table-vs-table-variable-views-procs-functions': {
    id: 'joins-cte-vs-temp-table-vs-table-variable-views-procs-functions',
    explanation: {
      what: { en: '**JOINs, CTE vs Temp Table vs Table Variable, Views & Procs**: JOINs combine tables. CTEs are readable inline subqueries. Temp tables (#t) have statistics for large sets. Table variables (@t) suit small batches. Views simplify queries; procs encapsulate logic.', bn: '**JOIN, CTE vs Temp Table vs Table Variable, View ও Proc**: JOIN table combine। CTE readable inline subquery। Temp table (#t) large set-এ statistics। Table variable (@t) small batch। View query simplify; proc logic encapsulate।' },
      why: { en: 'Understanding joins, cte vs temp table vs table variable, views & procs prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'JOIN, CTE vs Temp Table vs Table Variable, View ও Proc বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply joins, cte vs temp table vs table variable, views & procs in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'JOIN, CTE vs Temp Table vs Table Variable, View ও Proc code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'JOINs, CTE vs Temp Table vs Table Variable, Views & Procs is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'JOIN, CTE vs Temp Table vs Table Variable, View ও Proc = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used joins, cte vs temp table vs table variable, views & procs during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ JOIN, CTE vs Temp Table vs Table Variable, View ও Proc apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | JOINs combine tables. CTEs are readable inline subqueries. T… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | JOIN table combine। CTE readable inline subquery। Temp table… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating joins, cte vs temp table vs table variable, views & procs as a silver bullet without measuring impact.', bn: 'JOIN, CTE vs Temp Table vs Table Variable, View ও Proc measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing joins, cte vs temp table vs table variable, views & procs.', bn: 'JOIN, CTE vs Temp Table vs Table Variable, View ও Proc বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'transactions-acid-isolation-levels-anomalies-deadlocks-blocking': {
    id: 'transactions-acid-isolation-levels-anomalies-deadlocks-blocking',
    explanation: {
      what: { en: '**Transactions, ACID, Isolation, Deadlocks & Blocking**: ACID: Atomicity, Consistency, Isolation, Durability. Isolation levels (Read Committed, Serializable) trade consistency vs concurrency. Deadlocks = circular lock wait; blocking = one transaction waits.', bn: '**Transaction, ACID, Isolation, Deadlock ও Blocking**: ACID: Atomicity, Consistency, Isolation, Durability। Isolation level consistency vs concurrency trade-off। Deadlock = circular lock; blocking = wait।' },
      why: { en: 'Understanding transactions, acid, isolation, deadlocks & blocking prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Transaction, ACID, Isolation, Deadlock ও Blocking বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Keep transactions short. Access tables in consistent order. Use \`READ COMMITTED SNAPSHOT\` to reduce reader/writer blocking. Retry deadlocks with Polly.', bn: 'Transaction ছোট রাখুন। Table consistent order-এ access। \`READ COMMITTED SNAPSHOT\` reader/writer blocking কমায়। Deadlock Polly retry।' },
      analogy: { en: 'Transactions, ACID, Isolation, Deadlocks & Blocking is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Transaction, ACID, Isolation, Deadlock ও Blocking = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used transactions, acid, isolation, deadlocks & blocking during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Transaction, ACID, Isolation, Deadlock ও Blocking apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | ACID: Atomicity, Consistency, Isolation, Durability. Isolati… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | ACID: Atomicity, Consistency, Isolation, Durability। Isolati… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating transactions, acid, isolation, deadlocks & blocking as a silver bullet without measuring impact.', bn: 'Transaction, ACID, Isolation, Deadlock ও Blocking measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing transactions, acid, isolation, deadlocks & blocking.', bn: 'Transaction, ACID, Isolation, Deadlock ও Blocking বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'investigation-playbook-api-query-1s-10s-and-an-88-missing-index-warning': {
    id: 'investigation-playbook-api-query-1s-10s-and-an-88-missing-index-warning',
    explanation: {
      what: { en: '**Investigation Playbook: 1s → 10s Query & Missing Index Warning**: When API latency jumps 1s→10s: check plan regression, parameter sniffing, blocking, pool exhaustion, and missing index warnings (often 88%+ improvement estimates).', bn: '**Investigation Playbook: 1s → 10s Query ও Missing Index Warning**: API latency 1s→10s: plan regression, parameter sniffing, blocking, pool exhaustion, missing index warning (88%+ estimate) check।' },
      why: { en: 'Understanding investigation playbook: 1s → 10s query & missing index warning prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Investigation Playbook: 1s → 10s Query ও Missing Index Warning বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Correlate with deploy/stats update. 2) Capture slow query + plan. 3) Compare estimated vs actual rows. 4) Apply index or rewrite query. 5) Verify p95 in APM.', bn: '1) Deploy/stats update correlate। 2) Slow query + plan capture। 3) Estimated vs actual row। 4) Index/query fix। 5) APM p95 verify।' },
      analogy: { en: 'Investigation Playbook: 1s → 10s Query & Missing Index Warning is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Investigation Playbook: 1s → 10s Query ও Missing Index Warning = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used investigation playbook: 1s → 10s query & missing index warning during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Investigation Playbook: 1s → 10s Query ও Missing Index Warning apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | When API latency jumps 1s→10s: check plan regression, parame… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | API latency 1s→10s: plan regression, parameter sniffing, blo… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating investigation playbook: 1s → 10s query & missing index warning as a silver bullet without measuring impact.', bn: 'Investigation Playbook: 1s → 10s Query ও Missing Index Warning measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing investigation playbook: 1s → 10s query & missing index warning.', bn: 'Investigation Playbook: 1s → 10s Query ও Missing Index Warning বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'creational-patterns': {
    id: 'creational-patterns',
    explanation: {
      what: { en: '**Creational Patterns**: Factory, Abstract Factory, Builder, Singleton, Prototype — control object creation without scattering \`new\` across business code.', bn: '**Creational Pattern**: Factory, Abstract Factory, Builder, Singleton, Prototype — business code-এ \`new\` scatter না করে object creation control।' },
      why: { en: 'Understanding creational patterns prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Creational Pattern বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply creational patterns in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Creational Pattern code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Creational Patterns is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Creational Pattern = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used creational patterns during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Creational Pattern apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: DI_FLOW_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Factory, Abstract Factory, Builder, Singleton, Prototype — c… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Factory, Abstract Factory, Builder, Singleton, Prototype — b… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating creational patterns as a silver bullet without measuring impact.', bn: 'Creational Pattern measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing creational patterns.', bn: 'Creational Pattern বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'structural-patterns': {
    id: 'structural-patterns',
    explanation: {
      what: { en: '**Structural Patterns**: Adapter, Facade, Decorator, Proxy, Composite — compose objects into larger structures while keeping interfaces clean.', bn: '**Structural Pattern**: Adapter, Facade, Decorator, Proxy, Composite — interface clean রেখে object বড় structure-এ compose।' },
      why: { en: 'Understanding structural patterns prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Structural Pattern বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply structural patterns in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Structural Pattern code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Structural Patterns is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Structural Pattern = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used structural patterns during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Structural Pattern apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Adapter, Facade, Decorator, Proxy, Composite — compose objec… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Adapter, Facade, Decorator, Proxy, Composite — interface cle… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating structural patterns as a silver bullet without measuring impact.', bn: 'Structural Pattern measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing structural patterns.', bn: 'Structural Pattern বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'behavioral-patterns': {
    id: 'behavioral-patterns',
    explanation: {
      what: { en: '**Behavioral Patterns**: Strategy, Observer, Command, Mediator, Chain of Responsibility — assign responsibilities between objects and make algorithms interchangeable.', bn: '**Behavioral Pattern**: Strategy, Observer, Command, Mediator, Chain of Responsibility — object-এর মধ্যে responsibility assign, algorithm interchangeable।' },
      why: { en: 'Understanding behavioral patterns prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Behavioral Pattern বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply behavioral patterns in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Behavioral Pattern code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Behavioral Patterns is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Behavioral Pattern = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used behavioral patterns during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Behavioral Pattern apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Strategy, Observer, Command, Mediator, Chain of Responsibili… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Strategy, Observer, Command, Mediator, Chain of Responsibili… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating behavioral patterns as a silver bullet without measuring impact.', bn: 'Behavioral Pattern measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing behavioral patterns.', bn: 'Behavioral Pattern বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'pattern-selection-and-overengineering': {
    id: 'pattern-selection-and-overengineering',
    explanation: {
      what: { en: '**Pattern Selection & Overengineering**: Choose patterns when pain is real (testability, variation points). Avoid pattern fever — YAGNI applies; DI + interfaces often beat Singleton everywhere.', bn: '**Pattern Selection ও Overengineering**: Pattern তখনই যখন pain real (testability, variation)। Pattern fever avoid — YAGNI; সব জায়গায় Singleton নয়, DI + interface।' },
      why: { en: 'Understanding pattern selection & overengineering prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Pattern Selection ও Overengineering বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply pattern selection & overengineering in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Pattern Selection ও Overengineering code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Pattern Selection & Overengineering is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Pattern Selection ও Overengineering = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used pattern selection & overengineering during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Pattern Selection ও Overengineering apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: SOLID_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Choose patterns when pain is real (testability, variation po… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Pattern তখনই যখন pain real (testability, variation)। Pattern… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating pattern selection & overengineering as a silver bullet without measuring impact.', bn: 'Pattern Selection ও Overengineering measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing pattern selection & overengineering.', bn: 'Pattern Selection ও Overengineering বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'delivery-semantics-queue-vs-pub-sub-at-least-once-idempotent-consumers': {
    id: 'delivery-semantics-queue-vs-pub-sub-at-least-once-idempotent-consumers',
    explanation: {
      what: { en: '**Delivery Semantics: Queue vs Pub/Sub, At-Least-Once & Idempotent Consumers**: Queues = one consumer per message (work distribution). Pub/Sub = many subscribers. At-least-once delivery means duplicates possible — consumers must be idempotent.', bn: '**Delivery Semantics: Queue vs Pub/Sub, At-Least-Once ও Idempotent Consumer**: Queue = message-এ এক consumer (work distribution)। Pub/Sub = many subscriber। At-least-once = duplicate possible — consumer idempotent হতে হবে।' },
      why: { en: 'Understanding delivery semantics: queue vs pub/sub, at-least-once & idempotent consumers prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once ও Idempotent Consumer বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply delivery semantics: queue vs pub/sub, at-least-once & idempotent consumers in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once ও Idempotent Consumer code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once & Idempotent Consumers is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once ও Idempotent Consumer = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used delivery semantics: queue vs pub/sub, at-least-once & idempotent consumers during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Delivery Semantics: Queue vs Pub/Sub, At-Least-Once ও Idempotent Consumer apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Queues = one consumer per message (work distribution). Pub/S… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Queue = message-এ এক consumer (work distribution)। Pub/Sub =… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating delivery semantics: queue vs pub/sub, at-least-once & idempotent consumers as a silver bullet without measuring impact.', bn: 'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once ও Idempotent Consumer measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing delivery semantics: queue vs pub/sub, at-least-once & idempotent consumers.', bn: 'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once ও Idempotent Consumer বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'rabbitmq-exchange-queue-routing-key-ack-retry-dlq-ordering': {
    id: 'rabbitmq-exchange-queue-routing-key-ack-retry-dlq-ordering',
    explanation: {
      what: { en: '**RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry & DLQ**: Producers publish to exchanges; bindings route to queues via routing keys. Manual ACK after success; NACK/requeue or DLQ on failure. Ordering only within single consumer queue.', bn: '**RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry ও DLQ**: Producer exchange-এ publish; binding routing key দিয়ে queue-তে route। Success-এ manual ACK; fail-এ NACK/requeue বা DLQ। Ordering শুধু single consumer queue-তে।' },
      why: { en: 'Understanding rabbitmq: exchange, queue, routing key, ack, retry & dlq prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry ও DLQ বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply rabbitmq: exchange, queue, routing key, ack, retry & dlq in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry ও DLQ code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry & DLQ is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry ও DLQ = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used rabbitmq: exchange, queue, routing key, ack, retry & dlq during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry ও DLQ apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Producers publish to exchanges; bindings route to queues via… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Producer exchange-এ publish; binding routing key দিয়ে queue… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating rabbitmq: exchange, queue, routing key, ack, retry & dlq as a silver bullet without measuring impact.', bn: 'RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry ও DLQ measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing rabbitmq: exchange, queue, routing key, ack, retry & dlq.', bn: 'RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry ও DLQ বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'kafka-partitions-offset-consumer-groups-ordering-guarantees': {
    id: 'kafka-partitions-offset-consumer-groups-ordering-guarantees',
    explanation: {
      what: { en: '**Kafka: Partitions, Offsets, Consumer Groups & Ordering**: Topics split into partitions for parallelism. Consumer groups assign partitions — one consumer per partition. Offsets track progress. Ordering guaranteed per partition key.', bn: '**Kafka: Partition, Offset, Consumer Group ও Ordering**: Topic partition-এ split parallelism-এর জন্য। Consumer group partition assign — partition-এ এক consumer। Offset progress track। Ordering partition key-এ guaranteed।' },
      why: { en: 'Understanding kafka: partitions, offsets, consumer groups & ordering prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Kafka: Partition, Offset, Consumer Group ও Ordering বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply kafka: partitions, offsets, consumer groups & ordering in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Kafka: Partition, Offset, Consumer Group ও Ordering code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Kafka: Partitions, Offsets, Consumer Groups & Ordering is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Kafka: Partition, Offset, Consumer Group ও Ordering = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used kafka: partitions, offsets, consumer groups & ordering during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Kafka: Partition, Offset, Consumer Group ও Ordering apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Topics split into partitions for parallelism. Consumer group… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Topic partition-এ split parallelism-এর জন্য। Consumer group … | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating kafka: partitions, offsets, consumer groups & ordering as a silver bullet without measuring impact.', bn: 'Kafka: Partition, Offset, Consumer Group ও Ordering measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing kafka: partitions, offsets, consumer groups & ordering.', bn: 'Kafka: Partition, Offset, Consumer Group ও Ordering বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'rabbitmq-vs-kafka-when-to-choose': {
    id: 'rabbitmq-vs-kafka-when-to-choose',
    explanation: {
      what: { en: '**RabbitMQ vs Kafka: When to Choose**: RabbitMQ: task queues, routing, low-latency commands, moderate throughput. Kafka: event log, replay, high throughput, stream processing.', bn: '**RabbitMQ vs Kafka: কখন বেছে নেবেন**: RabbitMQ: task queue, routing, low-latency command, moderate throughput। Kafka: event log, replay, high throughput, stream processing।' },
      why: { en: 'Understanding rabbitmq vs kafka: when to choose prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'RabbitMQ vs Kafka: কখন বেছে নেবেন বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply rabbitmq vs kafka: when to choose in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'RabbitMQ vs Kafka: কখন বেছে নেবেন code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'RabbitMQ vs Kafka: When to Choose is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'RabbitMQ vs Kafka: কখন বেছে নেবেন = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used rabbitmq vs kafka: when to choose during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ RabbitMQ vs Kafka: কখন বেছে নেবেন apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | RabbitMQ: task queues, routing, low-latency commands, modera… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | RabbitMQ: task queue, routing, low-latency command, moderate… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating rabbitmq vs kafka: when to choose as a silver bullet without measuring impact.', bn: 'RabbitMQ vs Kafka: কখন বেছে নেবেন measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing rabbitmq vs kafka: when to choose.', bn: 'RabbitMQ vs Kafka: কখন বেছে নেবেন বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'practical-net-duplicates-retry-dlq-masstransit-or-raw': {
    id: 'practical-net-duplicates-retry-dlq-masstransit-or-raw',
    explanation: {
      what: { en: '**Practical .NET: Duplicates, Retry, DLQ — MassTransit or Raw**: Use MassTransit for retries, DLQ, consumer middleware, and outbox patterns. Raw clients need manual ACK, idempotency store, and poison message handling.', bn: '**Practical .NET: Duplicate, Retry, DLQ — MassTransit বা Raw**: MassTransit retry, DLQ, consumer middleware, outbox দেয়। Raw client-এ manual ACK, idempotency store, poison message handle করতে হয়।' },
      why: { en: 'Understanding practical .net: duplicates, retry, dlq — masstransit or raw prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Practical .NET: Duplicate, Retry, DLQ — MassTransit বা Raw বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply practical .net: duplicates, retry, dlq — masstransit or raw in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Practical .NET: Duplicate, Retry, DLQ — MassTransit বা Raw code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Practical .NET: Duplicates, Retry, DLQ — MassTransit or Raw is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Practical .NET: Duplicate, Retry, DLQ — MassTransit বা Raw = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used practical .net: duplicates, retry, dlq — masstransit or raw during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Practical .NET: Duplicate, Retry, DLQ — MassTransit বা Raw apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Use MassTransit for retries, DLQ, consumer middleware, and o… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | MassTransit retry, DLQ, consumer middleware, outbox দেয়। Ra… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating practical .net: duplicates, retry, dlq — masstransit or raw as a silver bullet without measuring impact.', bn: 'Practical .NET: Duplicate, Retry, DLQ — MassTransit বা Raw measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing practical .net: duplicates, retry, dlq — masstransit or raw.', bn: 'Practical .NET: Duplicate, Retry, DLQ — MassTransit বা Raw বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'ihostedservice-and-backgroundservice': {
    id: 'ihostedservice-and-backgroundservice',
    explanation: {
      what: { en: '**IHostedService & BackgroundService**: \`BackgroundService\` runs long-lived loops inside the ASP.NET host — ideal for polling, cache warm-up, or queue consumers co-hosted with the API.', bn: '**IHostedService ও BackgroundService**: \`BackgroundService\` ASP.NET host-এ long-lived loop — polling, cache warm-up, queue consumer API-র সাথে co-host।' },
      why: { en: 'Understanding ihostedservice & backgroundservice prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'IHostedService ও BackgroundService বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply ihostedservice & backgroundservice in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'IHostedService ও BackgroundService code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'IHostedService & BackgroundService is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'IHostedService ও BackgroundService = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used ihostedservice & backgroundservice during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ IHostedService ও BackgroundService apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | \`BackgroundService\` runs long-lived loops inside the ASP.NET… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | \`BackgroundService\` ASP.NET host-এ long-lived loop — polling… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating ihostedservice & backgroundservice as a silver bullet without measuring impact.', bn: 'IHostedService ও BackgroundService measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing ihostedservice & backgroundservice.', bn: 'IHostedService ও BackgroundService বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'hangfire-vs-quartz-vs-queue-based-workers': {
    id: 'hangfire-vs-quartz-vs-queue-based-workers',
    explanation: {
      what: { en: '**Hangfire vs Quartz vs Queue-Based Workers**: Hangfire: SQL/Redis-backed jobs + dashboard. Quartz: cron scheduling. Queue workers (Service Bus/RabbitMQ): scale independently, best for heavy/async work.', bn: '**Hangfire vs Quartz vs Queue-Based Worker**: Hangfire: SQL/Redis job + dashboard। Quartz: cron schedule। Queue worker (Service Bus/RabbitMQ): independently scale, heavy/async work-এ best।' },
      why: { en: 'Understanding hangfire vs quartz vs queue-based workers prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Hangfire vs Quartz vs Queue-Based Worker বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply hangfire vs quartz vs queue-based workers in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Hangfire vs Quartz vs Queue-Based Worker code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Hangfire vs Quartz vs Queue-Based Workers is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Hangfire vs Quartz vs Queue-Based Worker = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used hangfire vs quartz vs queue-based workers during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Hangfire vs Quartz vs Queue-Based Worker apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Hangfire: SQL/Redis-backed jobs + dashboard. Quartz: cron sc… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Hangfire: SQL/Redis job + dashboard। Quartz: cron schedule। … | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating hangfire vs quartz vs queue-based workers as a silver bullet without measuring impact.', bn: 'Hangfire vs Quartz vs Queue-Based Worker measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing hangfire vs quartz vs queue-based workers.', bn: 'Hangfire vs Quartz vs Queue-Based Worker বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'retry-scheduling-failure-idempotency-distributed-double-run': {
    id: 'retry-scheduling-failure-idempotency-distributed-double-run',
    explanation: {
      what: { en: '**Retry, Scheduling, Failure, Idempotency & Double-Run**: Scheduled jobs must be idempotent — clock skew and restarts cause double execution. Use lease locks, dedup keys, and at-least-once safe handlers.', bn: '**Retry, Scheduling, Failure, Idempotency ও Double-Run**: Scheduled job idempotent — clock skew/restart double execution। Lease lock, dedup key, at-least-once safe handler।' },
      why: { en: 'Understanding retry, scheduling, failure, idempotency & double-run prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Retry, Scheduling, Failure, Idempotency ও Double-Run বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply retry, scheduling, failure, idempotency & double-run in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Retry, Scheduling, Failure, Idempotency ও Double-Run code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Retry, Scheduling, Failure, Idempotency & Double-Run is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Retry, Scheduling, Failure, Idempotency ও Double-Run = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used retry, scheduling, failure, idempotency & double-run during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Retry, Scheduling, Failure, Idempotency ও Double-Run apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Scheduled jobs must be idempotent — clock skew and restarts … | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Scheduled job idempotent — clock skew/restart double executi… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating retry, scheduling, failure, idempotency & double-run as a silver bullet without measuring impact.', bn: 'Retry, Scheduling, Failure, Idempotency ও Double-Run measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing retry, scheduling, failure, idempotency & double-run.', bn: 'Retry, Scheduling, Failure, Idempotency ও Double-Run বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'asp-net-do-not-block-request-threads-202-accepted': {
    id: 'asp-net-do-not-block-request-threads-202-accepted',
    explanation: {
      what: { en: '**ASP.NET: Do Not Block Request Threads — 202 Accepted**: Never \`.Result\` or \`.Wait()\` on request threads — causes thread-pool starvation. Long work → background queue + \`202 Accepted\` with tracking ID.', bn: '**ASP.NET: Request Thread Block করবেন না — 202 Accepted**: Request thread-এ \`.Result\`/\`.Wait()\` নয় — thread-pool starvation। Long work → background queue + tracking ID সহ \`202 Accepted\`।' },
      why: { en: 'Understanding asp.net: do not block request threads — 202 accepted prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'ASP.NET: Request Thread Block করবেন না — 202 Accepted বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply asp.net: do not block request threads — 202 accepted in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'ASP.NET: Request Thread Block করবেন না — 202 Accepted code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'ASP.NET: Do Not Block Request Threads — 202 Accepted is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'ASP.NET: Request Thread Block করবেন না — 202 Accepted = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used asp.net: do not block request threads — 202 accepted during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ ASP.NET: Request Thread Block করবেন না — 202 Accepted apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Never \`.Result\` or \`.Wait()\` on request threads — causes thr… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Request thread-এ \`.Result\`/\`.Wait()\` নয় — thread-pool starv… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating asp.net: do not block request threads — 202 accepted as a silver bullet without measuring impact.', bn: 'ASP.NET: Request Thread Block করবেন না — 202 Accepted measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing asp.net: do not block request threads — 202 accepted.', bn: 'ASP.NET: Request Thread Block করবেন না — 202 Accepted বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'fundamentals-statelessness-scale-load-balancing-cap-consistency': {
    id: 'fundamentals-statelessness-scale-load-balancing-cap-consistency',
    explanation: {
      what: { en: '**Distributed Fundamentals: Statelessness, Scale, CAP**: Stateless services scale horizontally behind load balancers. CAP theorem: under partition, choose consistency or availability. Sticky sessions are a scaling smell.', bn: '**Distributed Fundamentals: Statelessness, Scale, CAP**: Stateless service load balancer-এ horizontal scale। CAP: partition-এ consistency বা availability। Sticky session scaling smell।' },
      why: { en: 'Understanding distributed fundamentals: statelessness, scale, cap prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Distributed Fundamentals: Statelessness, Scale, CAP বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply distributed fundamentals: statelessness, scale, cap in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Distributed Fundamentals: Statelessness, Scale, CAP code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Distributed Fundamentals: Statelessness, Scale, CAP is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Distributed Fundamentals: Statelessness, Scale, CAP = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used distributed fundamentals: statelessness, scale, cap during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Distributed Fundamentals: Statelessness, Scale, CAP apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Stateless services scale horizontally behind load balancers.… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Stateless service load balancer-এ horizontal scale। CAP: par… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating distributed fundamentals: statelessness, scale, cap as a silver bullet without measuring impact.', bn: 'Distributed Fundamentals: Statelessness, Scale, CAP measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing distributed fundamentals: statelessness, scale, cap.', bn: 'Distributed Fundamentals: Statelessness, Scale, CAP বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'resilience-distributed-transactions-idempotency-retry-timeout-circuit-breaker-bulkhead-backoff-locks': {
    id: 'resilience-distributed-transactions-idempotency-retry-timeout-circuit-breaker-bulkhead-backoff-locks',
    explanation: {
      what: { en: '**Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Locks**: Polly policies: retry with jitter, timeouts, circuit breaker, bulkhead isolation. Prefer Saga/outbox over 2PC. Distributed locks (Redis) only when necessary.', bn: '**Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Lock**: Polly: jitter retry, timeout, circuit breaker, bulkhead। 2PC-এর বদলে Saga/outbox। Distributed lock (Redis) শুধু প্রয়োজনে।' },
      why: { en: 'Understanding resilience: retry, timeout, circuit breaker, bulkhead, locks prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Lock বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply resilience: retry, timeout, circuit breaker, bulkhead, locks in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Lock code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Locks is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Lock = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used resilience: retry, timeout, circuit breaker, bulkhead, locks during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Lock apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Polly policies: retry with jitter, timeouts, circuit breaker… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Polly: jitter retry, timeout, circuit breaker, bulkhead। 2PC… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating resilience: retry, timeout, circuit breaker, bulkhead, locks as a silver bullet without measuring impact.', bn: 'Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Lock measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing resilience: retry, timeout, circuit breaker, bulkhead, locks.', bn: 'Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Lock বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'monolith-vs-modular-monolith-vs-microservices-boundaries-when-not-to-split': {
    id: 'monolith-vs-modular-monolith-vs-microservices-boundaries-when-not-to-split',
    explanation: {
      what: { en: '**Monolith vs Modular Monolith vs Microservices**: Start modular monolith with clear boundaries. Split to microservices when independent scaling, team autonomy, or failure isolation justifies ops cost.', bn: '**Monolith vs Modular Monolith vs Microservice**: Modular monolith clear boundary দিয়ে শুরু। Microservice যখন independent scale, team autonomy, failure isolation ops cost justify।' },
      why: { en: 'Understanding monolith vs modular monolith vs microservices prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Monolith vs Modular Monolith vs Microservice বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply monolith vs modular monolith vs microservices in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Monolith vs Modular Monolith vs Microservice code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Monolith vs Modular Monolith vs Microservices is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Monolith vs Modular Monolith vs Microservice = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used monolith vs modular monolith vs microservices during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Monolith vs Modular Monolith vs Microservice apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Start modular monolith with clear boundaries. Split to micro… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Modular monolith clear boundary দিয়ে শুরু। Microservice যখন… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating monolith vs modular monolith vs microservices as a silver bullet without measuring impact.', bn: 'Monolith vs Modular Monolith vs Microservice measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing monolith vs modular monolith vs microservices.', bn: 'Monolith vs Modular Monolith vs Microservice বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'api-gateway-service-discovery-rest-vs-grpc-event-driven': {
    id: 'api-gateway-service-discovery-rest-vs-grpc-event-driven',
    explanation: {
      what: { en: '**API Gateway, Service Discovery, REST vs gRPC, Event-Driven**: Gateway handles auth, rate limits, routing. Service discovery (K8s DNS, Consul) locates instances. gRPC for internal low-latency; REST for public APIs. Events decouple services.', bn: '**API Gateway, Service Discovery, REST vs gRPC, Event-Driven**: Gateway auth, rate limit, routing। Service discovery (K8s DNS) instance locate। Internal gRPC; public REST। Event service decouple।' },
      why: { en: 'Understanding api gateway, service discovery, rest vs grpc, event-driven prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'API Gateway, Service Discovery, REST vs gRPC, Event-Driven বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply api gateway, service discovery, rest vs grpc, event-driven in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'API Gateway, Service Discovery, REST vs gRPC, Event-Driven code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'API Gateway, Service Discovery, REST vs gRPC, Event-Driven is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'API Gateway, Service Discovery, REST vs gRPC, Event-Driven = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used api gateway, service discovery, rest vs grpc, event-driven during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ API Gateway, Service Discovery, REST vs gRPC, Event-Driven apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Gateway handles auth, rate limits, routing. Service discover… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Gateway auth, rate limit, routing। Service discovery (K8s DN… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating api gateway, service discovery, rest vs grpc, event-driven as a silver bullet without measuring impact.', bn: 'API Gateway, Service Discovery, REST vs gRPC, Event-Driven measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing api gateway, service discovery, rest vs grpc, event-driven.', bn: 'API Gateway, Service Discovery, REST vs gRPC, Event-Driven বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'saga-outbox-cqrs-in-a-distributed-context': {
    id: 'saga-outbox-cqrs-in-a-distributed-context',
    explanation: {
      what: { en: '**Saga, Outbox & CQRS in Distributed Systems**: Saga coordinates multi-service transactions via compensating steps. Outbox ensures reliable event publish with DB write. CQRS separates read/write models for scale.', bn: '**Distributed System-এ Saga, Outbox ও CQRS**: Saga compensating step দিয়ে multi-service transaction coordinate। Outbox DB write-এর সাথে reliable event publish। CQRS read/write model separate scale-এর জন্য।' },
      why: { en: 'Understanding saga, outbox & cqrs in distributed systems prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Distributed System-এ Saga, Outbox ও CQRS বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply saga, outbox & cqrs in distributed systems in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Distributed System-এ Saga, Outbox ও CQRS code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Saga, Outbox & CQRS in Distributed Systems is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Distributed System-এ Saga, Outbox ও CQRS = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used saga, outbox & cqrs in distributed systems during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Distributed System-এ Saga, Outbox ও CQRS apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: CQRS_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Saga coordinates multi-service transactions via compensating… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Saga compensating step দিয়ে multi-service transaction coord… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating saga, outbox & cqrs in distributed systems as a silver bullet without measuring impact.', bn: 'Distributed System-এ Saga, Outbox ও CQRS measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing saga, outbox & cqrs in distributed systems.', bn: 'Distributed System-এ Saga, Outbox ও CQRS বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'distributed-tracing-and-resilience-in-net-polly': {
    id: 'distributed-tracing-and-resilience-in-net-polly',
    explanation: {
      what: { en: '**Distributed Tracing & Resilience in .NET (Polly)**: OpenTelemetry traces span across HTTP and messaging. Polly v8 integrates with \`HttpClientFactory\` for resilient outbound calls.', bn: '**Distributed Tracing ও .NET Resilience (Polly)**: OpenTelemetry HTTP/messaging-এ trace span। Polly v8 \`HttpClientFactory\`-এ resilient outbound call।' },
      why: { en: 'Understanding distributed tracing & resilience in .net (polly) prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Distributed Tracing ও .NET Resilience (Polly) বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply distributed tracing & resilience in .net (polly) in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Distributed Tracing ও .NET Resilience (Polly) code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Distributed Tracing & Resilience in .NET (Polly) is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Distributed Tracing ও .NET Resilience (Polly) = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used distributed tracing & resilience in .net (polly) during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Distributed Tracing ও .NET Resilience (Polly) apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | OpenTelemetry traces span across HTTP and messaging. Polly v… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | OpenTelemetry HTTP/messaging-এ trace span। Polly v8 \`HttpCli… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating distributed tracing & resilience in .net (polly) as a silver bullet without measuring impact.', bn: 'Distributed Tracing ও .NET Resilience (Polly) measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing distributed tracing & resilience in .net (polly).', bn: 'Distributed Tracing ও .NET Resilience (Polly) বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'pyramid-aaa-unit-vs-integration-vs-e2e': {
    id: 'pyramid-aaa-unit-vs-integration-vs-e2e',
    explanation: {
      what: { en: '**Test Pyramid & AAA: Unit vs Integration vs E2E**: Many fast unit tests (AAA: Arrange, Act, Assert), fewer integration tests with real DB/HTTP, minimal brittle E2E. Unit tests mock boundaries; integration tests prove wiring.', bn: '**Test Pyramid ও AAA: Unit vs Integration vs E2E**: অনেক fast unit test (AAA), কম integration (real DB/HTTP), minimal brittle E2E। Unit boundary mock; integration wiring prove।' },
      why: { en: 'Understanding test pyramid & aaa: unit vs integration vs e2e prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Test Pyramid ও AAA: Unit vs Integration vs E2E বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply test pyramid & aaa: unit vs integration vs e2e in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Test Pyramid ও AAA: Unit vs Integration vs E2E code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Test Pyramid & AAA: Unit vs Integration vs E2E is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Test Pyramid ও AAA: Unit vs Integration vs E2E = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used test pyramid & aaa: unit vs integration vs e2e during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Test Pyramid ও AAA: Unit vs Integration vs E2E apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Many fast unit tests (AAA: Arrange, Act, Assert), fewer inte… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | অনেক fast unit test (AAA), কম integration (real DB/HTTP), mi… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating test pyramid & aaa: unit vs integration vs e2e as a silver bullet without measuring impact.', bn: 'Test Pyramid ও AAA: Unit vs Integration vs E2E measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing test pyramid & aaa: unit vs integration vs e2e.', bn: 'Test Pyramid ও AAA: Unit vs Integration vs E2E বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'xunit-moq-fluentassertions-doubles': {
    id: 'xunit-moq-fluentassertions-doubles',
    explanation: {
      what: { en: '**xUnit, Moq, FluentAssertions & Test Doubles**: xUnit for facts/theories. Moq for interfaces. FluentAssertions for readable asserts. Know stub vs mock vs fake vs spy.', bn: '**xUnit, Moq, FluentAssertions ও Test Double**: xUnit fact/theory। Moq interface-এর জন্য। FluentAssertions readable assert। stub vs mock vs fake vs spy জানুন।' },
      why: { en: 'Understanding xunit, moq, fluentassertions & test doubles prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'xUnit, Moq, FluentAssertions ও Test Double বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply xunit, moq, fluentassertions & test doubles in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'xUnit, Moq, FluentAssertions ও Test Double code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'xUnit, Moq, FluentAssertions & Test Doubles is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'xUnit, Moq, FluentAssertions ও Test Double = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used xunit, moq, fluentassertions & test doubles during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ xUnit, Moq, FluentAssertions ও Test Double apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | xUnit for facts/theories. Moq for interfaces. FluentAssertio… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | xUnit fact/theory। Moq interface-এর জন্য। FluentAssertions r… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating xunit, moq, fluentassertions & test doubles as a silver bullet without measuring impact.', bn: 'xUnit, Moq, FluentAssertions ও Test Double measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing xunit, moq, fluentassertions & test doubles.', bn: 'xUnit, Moq, FluentAssertions ও Test Double বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'ef-httpclient-testcontainers-async-tests': {
    id: 'ef-httpclient-testcontainers-async-tests',
    explanation: {
      what: { en: '**EF, HttpClient, Testcontainers & Async Tests**: Testcontainers spin real SQL/Redis in Docker for integration tests. Use \`WebApplicationFactory\` for API tests. Always \`await\` in async tests — no \`.Result\`.', bn: '**EF, HttpClient, Testcontainers ও Async Test**: Testcontainers Docker-এ real SQL/Redis integration test। API test \`WebApplicationFactory\`। Async test-এ সবসময় \`await\` — \`.Result\` নয়।' },
      why: { en: 'Understanding ef, httpclient, testcontainers & async tests prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'EF, HttpClient, Testcontainers ও Async Test বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply ef, httpclient, testcontainers & async tests in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'EF, HttpClient, Testcontainers ও Async Test code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'EF, HttpClient, Testcontainers & Async Tests is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'EF, HttpClient, Testcontainers ও Async Test = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used ef, httpclient, testcontainers & async tests during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ EF, HttpClient, Testcontainers ও Async Test apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Testcontainers spin real SQL/Redis in Docker for integration… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Testcontainers Docker-এ real SQL/Redis integration test। API… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating ef, httpclient, testcontainers & async tests as a silver bullet without measuring impact.', bn: 'EF, HttpClient, Testcontainers ও Async Test measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing ef, httpclient, testcontainers & async tests.', bn: 'EF, HttpClient, Testcontainers ও Async Test বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'structured-logging-with-serilog': {
    id: 'structured-logging-with-serilog',
    explanation: {
      what: { en: '**Structured Logging with Serilog**: Serilog writes JSON logs with properties (\`{UserId}\`, \`{ElapsedMs}\`) searchable in Seq/ELK. Enrich with correlation ID and machine name.', bn: '**Serilog দিয়ে Structured Logging**: Serilog JSON log property (\`{UserId}\`, \`{ElapsedMs}\`) Seq/ELK-এ searchable। Correlation ID, machine name enrich।' },
      why: { en: 'Understanding structured logging with serilog prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Serilog দিয়ে Structured Logging বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply structured logging with serilog in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Serilog দিয়ে Structured Logging code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Structured Logging with Serilog is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Serilog দিয়ে Structured Logging = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used structured logging with serilog during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Serilog দিয়ে Structured Logging apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Serilog writes JSON logs with properties (\`{UserId}\`, \`{Elap… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Serilog JSON log property (\`{UserId}\`, \`{ElapsedMs}\`) Seq/EL… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating structured logging with serilog as a silver bullet without measuring impact.', bn: 'Serilog দিয়ে Structured Logging measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing structured logging with serilog.', bn: 'Serilog দিয়ে Structured Logging বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'correlation-opentelemetry-metrics-vs-logs-vs-traces': {
    id: 'correlation-opentelemetry-metrics-vs-logs-vs-traces',
    explanation: {
      what: { en: '**Correlation, OpenTelemetry: Metrics vs Logs vs Traces**: Logs = discrete events. Metrics = aggregated counters/histograms. Traces = request journey across services. Correlation ID ties all three.', bn: '**Correlation, OpenTelemetry: Metric vs Log vs Trace**: Log = discrete event। Metric = aggregated counter/histogram। Trace = service জুড়ে request journey। Correlation ID তিনটাই tie।' },
      why: { en: 'Understanding correlation, opentelemetry: metrics vs logs vs traces prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Correlation, OpenTelemetry: Metric vs Log vs Trace বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply correlation, opentelemetry: metrics vs logs vs traces in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Correlation, OpenTelemetry: Metric vs Log vs Trace code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Correlation, OpenTelemetry: Metrics vs Logs vs Traces is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Correlation, OpenTelemetry: Metric vs Log vs Trace = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used correlation, opentelemetry: metrics vs logs vs traces during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Correlation, OpenTelemetry: Metric vs Log vs Trace apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Logs = discrete events. Metrics = aggregated counters/histog… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Log = discrete event। Metric = aggregated counter/histogram।… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating correlation, opentelemetry: metrics vs logs vs traces as a silver bullet without measuring impact.', bn: 'Correlation, OpenTelemetry: Metric vs Log vs Trace measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing correlation, opentelemetry: metrics vs logs vs traces.', bn: 'Correlation, OpenTelemetry: Metric vs Log vs Trace বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'logging-setup': {
    id: 'logging-setup',
    explanation: {
      what: { en: '**Logging Setup**: Configure \`ILogger<T>\` with Serilog/NLog: console in dev, JSON to file/App Insights in prod. Set levels per namespace (\`Microsoft\` Warning).', bn: '**Logging Setup**: \`ILogger<T>\` Serilog/NLog: dev console, prod JSON file/App Insights। Namespace level (\`Microsoft\` Warning)।' },
      why: { en: 'Understanding logging setup prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Logging Setup বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply logging setup in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Logging Setup code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Logging Setup is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Logging Setup = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used logging setup during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Logging Setup apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Configure \`ILogger<T>\` with Serilog/NLog: console in dev, JS… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | \`ILogger<T>\` Serilog/NLog: dev console, prod JSON file/App I… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating logging setup as a silver bullet without measuring impact.', bn: 'Logging Setup measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing logging setup.', bn: 'Logging Setup বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'correlation-tracing': {
    id: 'correlation-tracing',
    explanation: {
      what: { en: '**Correlation Tracing**: Propagate \`TraceIdentifier\` or W3C \`traceparent\` header through HTTP, queues, and background jobs so one user action is traceable end-to-end.', bn: '**Correlation Tracing**: \`TraceIdentifier\` বা W3C \`traceparent\` HTTP, queue, background job-এ propagate — এক user action end-to-end trace।' },
      why: { en: 'Understanding correlation tracing prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Correlation Tracing বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply correlation tracing in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Correlation Tracing code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Correlation Tracing is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Correlation Tracing = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used correlation tracing during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Correlation Tracing apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Propagate \`TraceIdentifier\` or W3C \`traceparent\` header thro… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | \`TraceIdentifier\` বা W3C \`traceparent\` HTTP, queue, backgrou… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating correlation tracing as a silver bullet without measuring impact.', bn: 'Correlation Tracing measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing correlation tracing.', bn: 'Correlation Tracing বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'exception-handling': {
    id: 'exception-handling',
    explanation: {
      what: { en: '**Exception Handling**: Catch at boundaries (middleware, filter). Log with context, return ProblemDetails to clients, never swallow exceptions silently.', bn: '**Exception Handling**: Boundary-তে catch (middleware, filter)। Context সহ log, client-এ ProblemDetails, exception silently swallow নয়।' },
      why: { en: 'Understanding exception handling prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Exception Handling বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply exception handling in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Exception Handling code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Exception Handling is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Exception Handling = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used exception handling during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Exception Handling apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Catch at boundaries (middleware, filter). Log with context, … | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Boundary-তে catch (middleware, filter)। Context সহ log, clie… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating exception handling as a silver bullet without measuring impact.', bn: 'Exception Handling measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing exception handling.', bn: 'Exception Handling বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'performance-monitoring': {
    id: 'performance-monitoring',
    explanation: {
      what: { en: '**Performance Monitoring**: Track p50/p95 latency, error rate, saturation (CPU, thread pool, DB pool). Alert on SLO burn rate, not just averages.', bn: '**Performance Monitoring**: p50/p95 latency, error rate, saturation (CPU, thread pool, DB pool) track। Average নয়, SLO burn rate alert।' },
      why: { en: 'Understanding performance monitoring prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Performance Monitoring বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply performance monitoring in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Performance Monitoring code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Performance Monitoring is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Performance Monitoring = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used performance monitoring during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Performance Monitoring apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Track p50/p95 latency, error rate, saturation (CPU, thread p… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | p50/p95 latency, error rate, saturation (CPU, thread pool, D… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating performance monitoring as a silver bullet without measuring impact.', bn: 'Performance Monitoring measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing performance monitoring.', bn: 'Performance Monitoring বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'profiling-tools': {
    id: 'profiling-tools',
    explanation: {
      what: { en: '**Profiling Tools**: dotTrace, dotMemory, PerfView, and Application Insights Profiler find CPU hotspots, allocations, and sync-over-async blocking.', bn: '**Profiling Tool**: dotTrace, dotMemory, PerfView, App Insights Profiler CPU hotspot, allocation, sync-over-async blocking খুঁজে।' },
      why: { en: 'Understanding profiling tools prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Profiling Tool বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply profiling tools in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Profiling Tool code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Profiling Tools is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Profiling Tool = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used profiling tools during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Profiling Tool apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | dotTrace, dotMemory, PerfView, and Application Insights Prof… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | dotTrace, dotMemory, PerfView, App Insights Profiler CPU hot… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating profiling tools as a silver bullet without measuring impact.', bn: 'Profiling Tool measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing profiling tools.', bn: 'Profiling Tool বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'caching-strategies': {
    id: 'caching-strategies',
    explanation: {
      what: { en: '**Caching Strategies**: Cache-aside: app reads cache, on miss loads DB and populates. Watch stampede, TTL, invalidation on writes.', bn: '**Caching Strategy**: Cache-aside: app cache read, miss-এ DB load + populate। Stampede, TTL, write-এ invalidation watch।' },
      why: { en: 'Understanding caching strategies prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Caching Strategy বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply caching strategies in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Caching Strategy code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Caching Strategies is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Caching Strategy = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used caching strategies during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Caching Strategy apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: CACHE_ASIDE_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Cache-aside: app reads cache, on miss loads DB and populates… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Cache-aside: app cache read, miss-এ DB load + populate। Stam… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating caching strategies as a silver bullet without measuring impact.', bn: 'Caching Strategy measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing caching strategies.', bn: 'Caching Strategy বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'query-optimization': {
    id: 'query-optimization',
    explanation: {
      what: { en: '**Query Optimization**: EF: \`AsNoTracking\` for reads, \`Include\` vs projection, compiled queries, batching. SQL: indexes, avoid SELECT *, parameterize.', bn: '**Query Optimization**: EF: read-এ \`AsNoTracking\`, \`Include\` vs projection, compiled query। SQL: index, \`SELECT *\` avoid, parameterize।' },
      why: { en: 'Understanding query optimization prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Query Optimization বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply query optimization in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Query Optimization code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Query Optimization is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Query Optimization = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used query optimization during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Query Optimization apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: EF_DBCONTEXT_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | EF: \`AsNoTracking\` for reads, \`Include\` vs projection, compi… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | EF: read-এ \`AsNoTracking\`, \`Include\` vs projection, compiled… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating query optimization as a silver bullet without measuring impact.', bn: 'Query Optimization measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing query optimization.', bn: 'Query Optimization বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'async-programming': {
    id: 'async-programming',
    explanation: {
      what: { en: '**Async Programming**: \`async/await\` frees threads during I/O. Use \`Task.WhenAll\` for parallel I/O. Never block with \`.Result\` on ASP.NET threads.', bn: '**Async Programming**: \`async/await\` I/O-তে thread free। Parallel I/O \`Task.WhenAll\`। ASP.NET thread-এ \`.Result\` block নয়।' },
      why: { en: 'Understanding async programming prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Async Programming বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply async programming in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Async Programming code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Async Programming is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Async Programming = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used async programming during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Async Programming apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: ASYNC_FLOW_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | \`async/await\` frees threads during I/O. Use \`Task.WhenAll\` f… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | \`async/await\` I/O-তে thread free। Parallel I/O \`Task.WhenAll… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating async programming as a silver bullet without measuring impact.', bn: 'Async Programming measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing async programming.', bn: 'Async Programming বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'docker-containerization': {
    id: 'docker-containerization',
    explanation: {
      what: { en: '**Docker & Containerization**: Multi-stage Dockerfile: SDK stage builds, runtime stage copies published output only. Use \`.dockerignore\`, non-root user, and env-based config.', bn: '**Docker ও Containerization**: Multi-stage Dockerfile: SDK build, runtime শুধু published output copy। \`.dockerignore\`, non-root user, env config।' },
      why: { en: 'Understanding docker & containerization prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Docker ও Containerization বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply docker & containerization in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Docker ও Containerization code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Docker & Containerization is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Docker ও Containerization = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used docker & containerization during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Docker ও Containerization apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Multi-stage Dockerfile: SDK stage builds, runtime stage copi… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Multi-stage Dockerfile: SDK build, runtime শুধু published ou… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating docker & containerization as a silver bullet without measuring impact.', bn: 'Docker ও Containerization measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing docker & containerization.', bn: 'Docker ও Containerization বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'ci-cd-automation': {
    id: 'ci-cd-automation',
    explanation: {
      what: { en: '**CI/CD & Automation**: CI runs build + test on every PR. CD deploys artifacts to staging/prod with approvals. Store secrets in vault, not YAML.', bn: '**CI/CD ও Automation**: CI PR-এ build + test। CD artifact staging/prod deploy approval সহ। Secret vault-এ, YAML-এ নয়।' },
      why: { en: 'Understanding ci/cd & automation prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'CI/CD ও Automation বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply ci/cd & automation in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'CI/CD ও Automation code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'CI/CD & Automation is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'CI/CD ও Automation = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used ci/cd & automation during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ CI/CD ও Automation apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | CI runs build + test on every PR. CD deploys artifacts to st… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | CI PR-এ build + test। CD artifact staging/prod deploy approv… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating ci/cd & automation as a silver bullet without measuring impact.', bn: 'CI/CD ও Automation measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing ci/cd & automation.', bn: 'CI/CD ও Automation বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'azure-for-net-architects': {
    id: 'azure-for-net-architects',
    explanation: {
      what: { en: '**Azure for .NET Architects**: App Service/Container Apps for APIs, Azure SQL, Redis, Service Bus, Key Vault + Managed Identity, Application Insights for observability.', bn: '**.NET Architect-দের জন্য Azure**: API App Service/Container Apps, Azure SQL, Redis, Service Bus, Key Vault + Managed Identity, Application Insights observability।' },
      why: { en: 'Understanding azure for .net architects prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: '.NET Architect-দের জন্য Azure বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply azure for .net architects in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: '.NET Architect-দের জন্য Azure code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Azure for .NET Architects is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: '.NET Architect-দের জন্য Azure = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used azure for .net architects during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ .NET Architect-দের জন্য Azure apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | App Service/Container Apps for APIs, Azure SQL, Redis, Servi… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | API App Service/Container Apps, Azure SQL, Redis, Service Bu… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating azure for .net architects as a silver bullet without measuring impact.', bn: '.NET Architect-দের জন্য Azure measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing azure for .net architects.', bn: '.NET Architect-দের জন্য Azure বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'git-for-senior-engineers': {
    id: 'git-for-senior-engineers',
    explanation: {
      what: { en: '**Git for Senior Engineers**: Trunk-based flow, small PRs, revert on main (not reset), protected branches, conventional commits, never force-push shared history.', bn: '**Senior Engineer-দের Git**: Trunk-based flow, ছোট PR, main-এ revert (reset নয়), protected branch, conventional commit, shared history force-push নয়।' },
      why: { en: 'Understanding git for senior engineers prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Senior Engineer-দের Git বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply git for senior engineers in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Senior Engineer-দের Git code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Git for Senior Engineers is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Senior Engineer-দের Git = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used git for senior engineers during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Senior Engineer-দের Git apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Trunk-based flow, small PRs, revert on main (not reset), pro… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Trunk-based flow, ছোট PR, main-এ revert (reset নয়), protect… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating git for senior engineers as a silver bullet without measuring impact.', bn: 'Senior Engineer-দের Git measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing git for senior engineers.', bn: 'Senior Engineer-দের Git বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'monolith-vs-microservices': {
    id: 'monolith-vs-microservices',
    explanation: {
      what: { en: '**Monolith vs Microservices**: Monolith: simple deploy, one DB, good for small teams. Microservices: independent deploy/scale, distributed complexity — use when boundaries are clear.', bn: '**Monolith vs Microservice**: Monolith: simple deploy, one DB, ছোট team। Microservice: independent deploy/scale, distributed complexity — boundary clear হলে।' },
      why: { en: 'Understanding monolith vs microservices prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Monolith vs Microservice বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply monolith vs microservices in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Monolith vs Microservice code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Monolith vs Microservices is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Monolith vs Microservice = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used monolith vs microservices during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Monolith vs Microservice apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Monolith: simple deploy, one DB, good for small teams. Micro… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Monolith: simple deploy, one DB, ছোট team। Microservice: ind… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating monolith vs microservices as a silver bullet without measuring impact.', bn: 'Monolith vs Microservice measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing monolith vs microservices.', bn: 'Monolith vs Microservice বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'caching-patterns-redis': {
    id: 'caching-patterns-redis',
    explanation: {
      what: { en: '**Caching Patterns with Redis**: Redis for shared cache, session, rate limits, pub/sub. Always define TTL, handle cache miss stampede with lock or probabilistic early expiry.', bn: '**Redis Caching Pattern**: Redis shared cache, session, rate limit, pub/sub। TTL define, miss stampede lock/probabilistic early expiry handle।' },
      why: { en: 'Understanding caching patterns with redis prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Redis Caching Pattern বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply caching patterns with redis in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Redis Caching Pattern code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Caching Patterns with Redis is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Redis Caching Pattern = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used caching patterns with redis during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Redis Caching Pattern apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: CACHE_ASIDE_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Redis for shared cache, session, rate limits, pub/sub. Alway… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Redis shared cache, session, rate limit, pub/sub। TTL define… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating caching patterns with redis as a silver bullet without measuring impact.', bn: 'Redis Caching Pattern measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing caching patterns with redis.', bn: 'Redis Caching Pattern বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'clean-architecture': {
    id: 'clean-architecture',
    explanation: {
      what: { en: '**Clean Architecture**: Dependencies point inward: Domain → Application → Infrastructure. UI and DB are plugins. Test domain without ASP.NET or SQL.', bn: '**Clean Architecture**: Dependency inward: Domain → Application → Infrastructure। UI/DB plugin। ASP.NET/SQL ছাড়া domain test।' },
      why: { en: 'Understanding clean architecture prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Clean Architecture বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply clean architecture in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Clean Architecture code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Clean Architecture is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Clean Architecture = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used clean architecture during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Clean Architecture apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: CLEAN_ARCH_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Dependencies point inward: Domain → Application → Infrastruc… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Dependency inward: Domain → Application → Infrastructure। UI… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating clean architecture as a silver bullet without measuring impact.', bn: 'Clean Architecture measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing clean architecture.', bn: 'Clean Architecture বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'system-design-method-url-shortener': {
    id: 'system-design-method-url-shortener',
    explanation: {
      what: { en: '**System Design Method: URL Shortener**: Clarify scale (QPS, storage), API design, hash/key generation (base62), redirect flow, analytics, cache, DB sharding strategy.', bn: '**System Design Method: URL Shortener**: Scale (QPS, storage) clarify, API design, hash/key (base62), redirect flow, analytics, cache, DB sharding strategy।' },
      why: { en: 'Understanding system design method: url shortener prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'System Design Method: URL Shortener বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply system design method: url shortener in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'System Design Method: URL Shortener code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'System Design Method: URL Shortener is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'System Design Method: URL Shortener = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used system design method: url shortener during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ System Design Method: URL Shortener apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Clarify scale (QPS, storage), API design, hash/key generatio… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Scale (QPS, storage) clarify, API design, hash/key (base62),… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating system design method: url shortener as a silver bullet without measuring impact.', bn: 'System Design Method: URL Shortener measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing system design method: url shortener.', bn: 'System Design Method: URL Shortener বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'e-commerce-payments-notifications-trade-off-pack': {
    id: 'e-commerce-payments-notifications-trade-off-pack',
    explanation: {
      what: { en: '**E-Commerce: Payments, Notifications & Trade-offs**: Separate payment, inventory, notification services. Use Saga for checkout, idempotent webhooks, outbox for email/SMS, eventual consistency for catalog.', bn: '**E-Commerce: Payment, Notification ও Trade-off**: Payment, inventory, notification service আলাদা। Checkout Saga, idempotent webhook, email/SMS outbox, catalog eventual consistency।' },
      why: { en: 'Understanding e-commerce: payments, notifications & trade-offs prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'E-Commerce: Payment, Notification ও Trade-off বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply e-commerce: payments, notifications & trade-offs in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'E-Commerce: Payment, Notification ও Trade-off code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'E-Commerce: Payments, Notifications & Trade-offs is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'E-Commerce: Payment, Notification ও Trade-off = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used e-commerce: payments, notifications & trade-offs during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ E-Commerce: Payment, Notification ও Trade-off apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Separate payment, inventory, notification services. Use Saga… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Payment, inventory, notification service আলাদা। Checkout Sag… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating e-commerce: payments, notifications & trade-offs as a silver bullet without measuring impact.', bn: 'E-Commerce: Payment, Notification ও Trade-off measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing e-commerce: payments, notifications & trade-offs.', bn: 'E-Commerce: Payment, Notification ও Trade-off বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'json-standards-problemdetails': {
    id: 'json-standards-problemdetails',
    explanation: {
      what: { en: '**JSON Standards & ProblemDetails**: Serialize JSON as camelCase for JS clients (\`JsonNamingPolicy.CamelCase\`). Return RFC 7807 ProblemDetails for errors — consistent shape across controllers.', bn: '**JSON Standard ও ProblemDetails**: JS client-এ JSON camelCase (\`JsonNamingPolicy.CamelCase\`)। Error RFC 7807 ProblemDetails — controller-জুড়ে consistent shape।' },
      why: { en: 'Understanding json standards & problemdetails prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'JSON Standard ও ProblemDetails বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply json standards & problemdetails in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'JSON Standard ও ProblemDetails code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'JSON Standards & ProblemDetails is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'JSON Standard ও ProblemDetails = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used json standards & problemdetails during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ JSON Standard ও ProblemDetails apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Serialize JSON as camelCase for JS clients (\`JsonNamingPolic… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | JS client-এ JSON camelCase (\`JsonNamingPolicy.CamelCase\`)। E… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating json standards & problemdetails as a silver bullet without measuring impact.', bn: 'JSON Standard ও ProblemDetails measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing json standards & problemdetails.', bn: 'JSON Standard ও ProblemDetails বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'api-slow-sql-suddenly-slow-and-n-1': {
    id: 'api-slow-sql-suddenly-slow-and-n-1',
    explanation: {
      what: { en: '**API slow: SQL regression & N+1**: Check APM for SQL time, EF queries in loop, missing Include, recent deploy/plan change.', bn: '**API ধীর: SQL regression ও N+1**: Check APM for SQL time, EF queries in loop, missing Include, recent deploy/plan change.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "API slow: SQL regression & N+1", the winning move was correlating deploy time with metric spikes.', bn: '"API slow: SQL regression & N+1"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'database-cpu-100-and-connection-pool-exhaustion': {
    id: 'database-cpu-100-and-connection-pool-exhaustion',
    explanation: {
      what: { en: '**DB CPU 100% & Connection Pool Exhaustion**: Find top queries, blocking, pool max vs active connections, leak from undisposed DbContext.', bn: '**DB CPU 100% ও Connection Pool Exhaustion**: Find top queries, blocking, pool max vs active connections, leak from undisposed DbContext.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "DB CPU 100% & Connection Pool Exhaustion", the winning move was correlating deploy time with metric spikes.', bn: '"DB CPU 100% & Connection Pool Exhaustion"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'memory-leaks-and-gc-pauses': {
    id: 'memory-leaks-and-gc-pauses',
    explanation: {
      what: { en: '**Memory Leaks & GC Pauses**: Profile Gen2/LOH growth, event handler leaks, static caches, IDisposable not called.', bn: '**Memory Leak ও GC Pause**: Profile Gen2/LOH growth, event handler leaks, static caches, IDisposable not called.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "Memory Leaks & GC Pauses", the winning move was correlating deploy time with metric spikes.', bn: '"Memory Leaks & GC Pauses"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    diagram: GC_GENERATIONS_DIAGRAM,
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'crash-under-load-thread-pool-starvation-and-10k-rps': {
    id: 'crash-under-load-thread-pool-starvation-and-10k-rps',
    explanation: {
      what: { en: '**Crash Under Load: Thread Pool Starvation**: Sync-over-async, .Wait(), blocked threads — thread pool queue grows, requests timeout.', bn: '**Load-এ Crash: Thread Pool Starvation**: Sync-over-async, .Wait(), blocked threads — thread pool queue grows, requests timeout.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "Crash Under Load: Thread Pool Starvation", the winning move was correlating deploy time with metric spikes.', bn: '"Crash Under Load: Thread Pool Starvation"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'deadlocks-and-two-users-updating-the-same-record': {
    id: 'deadlocks-and-two-users-updating-the-same-record',
    explanation: {
      what: { en: '**Deadlocks & Concurrent Updates**: Optimistic concurrency (RowVersion), short transactions, retry policy, UI conflict message.', bn: '**Deadlock ও Concurrent Update**: Optimistic concurrency (RowVersion), short transactions, retry policy, UI conflict message.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "Deadlocks & Concurrent Updates", the winning move was correlating deploy time with metric spikes.', bn: '"Deadlocks & Concurrent Updates"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'redis-down-and-cache-stampede': {
    id: 'redis-down-and-cache-stampede',
    explanation: {
      what: { en: '**Redis Down & Cache Stampede**: Fallback to DB with circuit breaker; stampede lock; TTL jitter; graceful degradation.', bn: '**Redis Down ও Cache Stampede**: Fallback to DB with circuit breaker; stampede lock; TTL jitter; graceful degradation.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "Redis Down & Cache Stampede", the winning move was correlating deploy time with metric spikes.', bn: '"Redis Down & Cache Stampede"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    diagram: CACHE_ASIDE_DIAGRAM,
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'rabbitmq-consumer-stopped-duplicates-and-poison-messages': {
    id: 'rabbitmq-consumer-stopped-duplicates-and-poison-messages',
    explanation: {
      what: { en: '**RabbitMQ: Stopped Consumer & Poison Messages**: Check prefetch, ACK mode, DLQ, consumer health, idempotent handlers for redelivery.', bn: '**RabbitMQ: Consumer Stop ও Poison Message**: Check prefetch, ACK mode, DLQ, consumer health, idempotent handlers for redelivery.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "RabbitMQ: Stopped Consumer & Poison Messages", the winning move was correlating deploy time with metric spikes.', bn: '"RabbitMQ: Stopped Consumer & Poison Messages"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'double-submit-jwt-expiry-mid-request-and-jobs-that-run-twice': {
    id: 'double-submit-jwt-expiry-mid-request-and-jobs-that-run-twice',
    explanation: {
      what: { en: '**Double Submit, JWT Expiry & Duplicate Jobs**: Idempotency-Key header, token refresh flow, distributed lock or dedup table for jobs.', bn: '**Double Submit, JWT Expiry ও Duplicate Job**: Idempotency-Key header, token refresh flow, distributed lock or dedup table for jobs.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "Double Submit, JWT Expiry & Duplicate Jobs", the winning move was correlating deploy time with metric spikes.', bn: '"Double Submit, JWT Expiry & Duplicate Jobs"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'external-api-down-and-cascading-failure': {
    id: 'external-api-down-and-cascading-failure',
    explanation: {
      what: { en: '**External API Down & Cascading Failure**: Circuit breaker, timeout, bulkhead, cached fallback, fail fast — do not retry storm.', bn: '**External API Down ও Cascading Failure**: Circuit breaker, timeout, bulkhead, cached fallback, fail fast — do not retry storm.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "External API Down & Cascading Failure", the winning move was correlating deploy time with metric spikes.', bn: '"External API Down & Cascading Failure"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'bad-deploy-detect-rollback-and-stop-the-bleeding': {
    id: 'bad-deploy-detect-rollback-and-stop-the-bleeding',
    explanation: {
      what: { en: '**Bad Deploy: Detect, Rollback, Stop Bleeding**: Compare error rate pre/post deploy, slot swap rollback, feature flag kill switch.', bn: '**Bad Deploy: Detect, Rollback, Stop Bleeding**: Compare error rate pre/post deploy, slot swap rollback, feature flag kill switch.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "Bad Deploy: Detect, Rollback, Stop Bleeding", the winning move was correlating deploy time with metric spikes.', bn: '"Bad Deploy: Detect, Rollback, Stop Bleeding"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'distributed-correctness-cross-service-transactions-split-brain-locks-clock-skew': {
    id: 'distributed-correctness-cross-service-transactions-split-brain-locks-clock-skew',
    explanation: {
      what: { en: '**Distributed Correctness & Split Brain**: Avoid cross-DB transactions; Saga + outbox; fencing tokens; clock skew aware leases.', bn: '**Distributed Correctness ও Split Brain**: Avoid cross-DB transactions; Saga + outbox; fencing tokens; clock skew aware leases.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "Distributed Correctness & Split Brain", the winning move was correlating deploy time with metric spikes.', bn: '"Distributed Correctness & Split Brain"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  '100-scenario-catalog-and-how-to-attack-any-unknown-incident': {
    id: '100-scenario-catalog-and-how-to-attack-any-unknown-incident',
    explanation: {
      what: { en: '**100 Scenario Catalog & Unknown Incidents**: Stabilize (scale/limit), observe (metrics/logs/traces), bisect (deploy/config/data), fix smallest root cause.', bn: '**100 Scenario Catalog ও Unknown Incident**: Stabilize (scale/limit), observe (metrics/logs/traces), bisect (deploy/config/data), fix smallest root cause.' },
      why: { en: 'Senior engineers debug with evidence — metrics, logs, traces — not guesses.', bn: 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।' },
      how: { en: 'Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', bn: 'Service stabilize → data → hypothesis → validate → fix → postmortem।' },
      analogy: { en: 'Firefighter: contain fire, find source, prevent spread — same for production fires.', bn: 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।' },
      realWorld: { en: 'During "100 Scenario Catalog & Unknown Incidents", the winning move was correlating deploy time with metric spikes.', bn: '"100 Scenario Catalog & Unknown Incidents"-এ deploy time + metric spike correlate করা winning move ছিল।' },
    },
    comparisonTable: {
      en: `| Phase | Goal |
| :--- | :--- |
| Stabilize | Stop user impact |
| Observe | Find signal |
| Fix | Root cause |`,
      bn: `| Phase | Goal |
| :--- | :--- |
| Stabilize | User impact stop |
| Observe | Signal খুঁজুন |
| Fix | Root cause |`,
    },
    commonMistakes: [
      { en: 'Restarting servers without capturing dumps/logs.', bn: 'Dump/log capture ছাড়া server restart।' },
      { en: 'Announcing "fixed" before metrics recover.', bn: 'Metric recover-এর আগে "fixed" announce।' },
    ],
    bestPractices: [
      { en: 'Keep incident channel with single commander.', bn: 'Single commander incident channel।' },
      { en: 'Document every hypothesis tested.', bn: 'প্রতিটি hypothesis tested document।' },
    ],
  },

  'tell-me-about-yourself-why-hire-you-as-senior': {
    id: 'tell-me-about-yourself-why-hire-you-as-senior',
    explanation: {
      what: { en: '**Tell Me About Yourself / Why Hire You**: STAR format: 2-min career arc, 2 wins with metrics, why this role, what you bring (mentoring, incidents, trade-offs).', bn: '**Tell Me About Yourself / Why Hire You**: STAR format: 2-min career arc, 2 wins with metrics, why this role, what you bring (mentoring, incidents, trade-offs).' },
      why: { en: 'Understanding tell me about yourself / why hire you prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Tell Me About Yourself / Why Hire You বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Use STAR (Situation, Task, Action, Result). Quantify impact. Show learning.', bn: 'STAR (Situation, Task, Action, Result)। Impact quantify। Learning দেখান।' },
      analogy: { en: 'Tell Me About Yourself / Why Hire You is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Tell Me About Yourself / Why Hire You = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used tell me about yourself / why hire you during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Tell Me About Yourself / Why Hire You apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | STAR format: 2-min career arc, 2 wins with metrics, why this… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | STAR format: 2-min career arc, 2 wins with metrics, why this… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating tell me about yourself / why hire you as a silver bullet without measuring impact.', bn: 'Tell Me About Yourself / Why Hire You measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing tell me about yourself / why hire you.', bn: 'Tell Me About Yourself / Why Hire You বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'difficult-production-issue-incident-command': {
    id: 'difficult-production-issue-incident-command',
    explanation: {
      what: { en: '**Difficult Production Issue**: Describe one incident: detection, command role, comms, root cause, prevention — show calm and ownership.', bn: '**Difficult Production Issue**: Describe one incident: detection, command role, comms, root cause, prevention — show calm and ownership.' },
      why: { en: 'Understanding difficult production issue prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Difficult Production Issue বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Use STAR (Situation, Task, Action, Result). Quantify impact. Show learning.', bn: 'STAR (Situation, Task, Action, Result)। Impact quantify। Learning দেখান।' },
      analogy: { en: 'Difficult Production Issue is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Difficult Production Issue = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used difficult production issue during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Difficult Production Issue apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Describe one incident: detection, command role, comms, root … | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Describe one incident: detection, command role, comms, root … | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating difficult production issue as a silver bullet without measuring impact.', bn: 'Difficult Production Issue measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing difficult production issue.', bn: 'Difficult Production Issue বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'technical-disagreement-code-review-and-mentoring': {
    id: 'technical-disagreement-code-review-and-mentoring',
    explanation: {
      what: { en: '**Technical Disagreement & Mentoring**: Disagree with data and prototypes, not ego. Code review: ask questions, teach patterns, praise good work.', bn: '**Technical Disagreement & Mentoring**: Disagree with data and prototypes, not ego. Code review: ask questions, teach patterns, praise good work.' },
      why: { en: 'Understanding technical disagreement & mentoring prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Technical Disagreement & Mentoring বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Use STAR (Situation, Task, Action, Result). Quantify impact. Show learning.', bn: 'STAR (Situation, Task, Action, Result)। Impact quantify। Learning দেখান।' },
      analogy: { en: 'Technical Disagreement & Mentoring is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Technical Disagreement & Mentoring = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used technical disagreement & mentoring during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Technical Disagreement & Mentoring apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Disagree with data and prototypes, not ego. Code review: ask… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Disagree with data and prototypes, not ego. Code review: ask… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating technical disagreement & mentoring as a silver bullet without measuring impact.', bn: 'Technical Disagreement & Mentoring measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing technical disagreement & mentoring.', bn: 'Technical Disagreement & Mentoring বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'deadlines-technical-debt-and-legacy-code': {
    id: 'deadlines-technical-debt-and-legacy-code',
    explanation: {
      what: { en: '**Deadlines, Tech Debt & Legacy**: Negotiate scope, not quality. Boy Scout rule. Strangler fig for legacy. Document debt with cost.', bn: '**Deadlines, Tech Debt & Legacy**: Negotiate scope, not quality. Boy Scout rule. Strangler fig for legacy. Document debt with cost.' },
      why: { en: 'Understanding deadlines, tech debt & legacy prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Deadlines, Tech Debt & Legacy বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Use STAR (Situation, Task, Action, Result). Quantify impact. Show learning.', bn: 'STAR (Situation, Task, Action, Result)। Impact quantify। Learning দেখান।' },
      analogy: { en: 'Deadlines, Tech Debt & Legacy is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Deadlines, Tech Debt & Legacy = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used deadlines, tech debt & legacy during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Deadlines, Tech Debt & Legacy apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Negotiate scope, not quality. Boy Scout rule. Strangler fig … | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Negotiate scope, not quality. Boy Scout rule. Strangler fig … | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating deadlines, tech debt & legacy as a silver bullet without measuring impact.', bn: 'Deadlines, Tech Debt & Legacy measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing deadlines, tech debt & legacy.', bn: 'Deadlines, Tech Debt & Legacy বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'architectural-decisions-performance-vs-maintainability': {
    id: 'architectural-decisions-performance-vs-maintainability',
    explanation: {
      what: { en: '**Architecture: Performance vs Maintainability**: Start simple, measure, optimize hot paths. Explain trade-off to stakeholders in business terms.', bn: '**Architecture: Performance vs Maintainability**: Start simple, measure, optimize hot paths. Explain trade-off to stakeholders in business terms.' },
      why: { en: 'Understanding architecture: performance vs maintainability prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Architecture: Performance vs Maintainability বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Use STAR (Situation, Task, Action, Result). Quantify impact. Show learning.', bn: 'STAR (Situation, Task, Action, Result)। Impact quantify। Learning দেখান।' },
      analogy: { en: 'Architecture: Performance vs Maintainability is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Architecture: Performance vs Maintainability = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used architecture: performance vs maintainability during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Architecture: Performance vs Maintainability apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Start simple, measure, optimize hot paths. Explain trade-off… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Start simple, measure, optimize hot paths. Explain trade-off… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating architecture: performance vs maintainability as a silver bullet without measuring impact.', bn: 'Architecture: Performance vs Maintainability measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing architecture: performance vs maintainability.', bn: 'Architecture: Performance vs Maintainability বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'handling-production-incidents-with-stakeholders': {
    id: 'handling-production-incidents-with-stakeholders',
    explanation: {
      what: { en: '**Incidents with Stakeholders**: Regular updates, no jargon, ETA honest, postmortem shared — build trust under pressure.', bn: '**Incidents with Stakeholders**: Regular updates, no jargon, ETA honest, postmortem shared — build trust under pressure.' },
      why: { en: 'Understanding incidents with stakeholders prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Incidents with Stakeholders বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Use STAR (Situation, Task, Action, Result). Quantify impact. Show learning.', bn: 'STAR (Situation, Task, Action, Result)। Impact quantify। Learning দেখান।' },
      analogy: { en: 'Incidents with Stakeholders is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Incidents with Stakeholders = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used incidents with stakeholders during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Incidents with Stakeholders apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Regular updates, no jargon, ETA honest, postmortem shared — … | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Regular updates, no jargon, ETA honest, postmortem shared — … | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating incidents with stakeholders as a silver bullet without measuring impact.', bn: 'Incidents with Stakeholders measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing incidents with stakeholders.', bn: 'Incidents with Stakeholders বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'c-oop-linq-async': {
    id: 'c-oop-linq-async',
    explanation: {
      what: { en: '**C#, OOP, LINQ & Async Bank**: Covers value vs reference, inheritance, LINQ deferred execution, async/await pitfalls — drill with flashcards.', bn: '**C#, OOP, LINQ ও Async Question Bank**: Covers value vs reference, inheritance, LINQ deferred execution, async/await pitfalls — drill with flashcards.' },
      why: { en: 'Understanding c#, oop, linq & async bank prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'C#, OOP, LINQ ও Async Question Bank বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply c#, oop, linq & async bank in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'C#, OOP, LINQ ও Async Question Bank code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'C#, OOP, LINQ & Async Bank is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'C#, OOP, LINQ ও Async Question Bank = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used c#, oop, linq & async bank during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ C#, OOP, LINQ ও Async Question Bank apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Covers value vs reference, inheritance, LINQ deferred execut… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Covers value vs reference, inheritance, LINQ deferred execut… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating c#, oop, linq & async bank as a silver bullet without measuring impact.', bn: 'C#, OOP, LINQ ও Async Question Bank measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing c#, oop, linq & async bank.', bn: 'C#, OOP, LINQ ও Async Question Bank বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'asp-net-di-ef-sql-security': {
    id: 'asp-net-di-ef-sql-security',
    explanation: {
      what: { en: '**ASP.NET, DI, EF, SQL & Security Bank**: Pipeline, lifetimes, DbContext, SQL indexes, JWT/OAuth — senior short answers with trade-offs.', bn: '**ASP.NET, DI, EF, SQL ও Security Bank**: Pipeline, lifetimes, DbContext, SQL indexes, JWT/OAuth — senior short answers with trade-offs.' },
      why: { en: 'Understanding asp.net, di, ef, sql & security bank prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'ASP.NET, DI, EF, SQL ও Security Bank বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply asp.net, di, ef, sql & security bank in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'ASP.NET, DI, EF, SQL ও Security Bank code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'ASP.NET, DI, EF, SQL & Security Bank is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'ASP.NET, DI, EF, SQL ও Security Bank = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used asp.net, di, ef, sql & security bank during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ ASP.NET, DI, EF, SQL ও Security Bank apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Pipeline, lifetimes, DbContext, SQL indexes, JWT/OAuth — sen… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Pipeline, lifetimes, DbContext, SQL indexes, JWT/OAuth — sen… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating asp.net, di, ef, sql & security bank as a silver bullet without measuring impact.', bn: 'ASP.NET, DI, EF, SQL ও Security Bank measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing asp.net, di, ef, sql & security bank.', bn: 'ASP.NET, DI, EF, SQL ও Security Bank বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'architecture-redis-messaging-docker-azure-testing': {
    id: 'architecture-redis-messaging-docker-azure-testing',
    explanation: {
      what: { en: '**Architecture & Production Bank**: Redis, messaging semantics, Docker, Azure services, testing pyramid — cross-topic integration questions.', bn: '**Architecture ও Production Bank**: Redis, messaging semantics, Docker, Azure services, testing pyramid — cross-topic integration questions.' },
      why: { en: 'Understanding architecture & production bank prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Architecture ও Production Bank বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply architecture & production bank in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Architecture ও Production Bank code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Architecture & Production Bank is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Architecture ও Production Bank = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used architecture & production bank during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Architecture ও Production Bank apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Redis, messaging semantics, Docker, Azure services, testing … | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Redis, messaging semantics, Docker, Azure services, testing … | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating architecture & production bank as a silver bullet without measuring impact.', bn: 'Architecture ও Production Bank measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing architecture & production bank.', bn: 'Architecture ও Production Bank বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'system-design-behavioral': {
    id: 'system-design-behavioral',
    explanation: {
      what: { en: '**System Design & Behavioral Bank**: URL shortener, e-commerce, estimation, failure modes plus leadership-style behavioral prompts.', bn: '**System Design ও Behavioral Bank**: URL shortener, e-commerce, estimation, failure modes plus leadership-style behavioral prompts.' },
      why: { en: 'Understanding system design & behavioral bank prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'System Design ও Behavioral Bank বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply system design & behavioral bank in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'System Design ও Behavioral Bank code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'System Design & Behavioral Bank is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'System Design ও Behavioral Bank = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used system design & behavioral bank during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ System Design ও Behavioral Bank apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | URL shortener, e-commerce, estimation, failure modes plus le… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | URL shortener, e-commerce, estimation, failure modes plus le… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating system design & behavioral bank as a silver bullet without measuring impact.', bn: 'System Design ও Behavioral Bank measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing system design & behavioral bank.', bn: 'System Design ও Behavioral Bank বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'ienumerable-vs-iqueryable-first-vs-single-asnotracking-vs-tracking': {
    id: 'ienumerable-vs-iqueryable-first-vs-single-asnotracking-vs-tracking',
    explanation: {
      what: { en: '**IEnumerable vs IQueryable, First vs Single, Tracking**: IQueryable translates to SQL; IEnumerable runs in memory. Single throws if not exactly one. AsNoTracking for read-only.', bn: '**IEnumerable vs IQueryable, First vs Single, Tracking**: IQueryable translates to SQL; IEnumerable runs in memory. Single throws if not exactly one. AsNoTracking for read-only.' },
      why: { en: 'Understanding ienumerable vs iqueryable, first vs single, tracking prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'IEnumerable vs IQueryable, First vs Single, Tracking বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Interview trap: explain definition + when it breaks + example bug.', bn: 'Interview trap: definition + কখন break + example bug বলুন।' },
      analogy: { en: 'IEnumerable vs IQueryable, First vs Single, Tracking is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'IEnumerable vs IQueryable, First vs Single, Tracking = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used ienumerable vs iqueryable, first vs single, tracking during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ IEnumerable vs IQueryable, First vs Single, Tracking apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: LINQ_DEFERRED_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | IQueryable translates to SQL; IEnumerable runs in memory. Si… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | IQueryable translates to SQL; IEnumerable runs in memory. Si… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating ienumerable vs iqueryable, first vs single, tracking as a silver bullet without measuring impact.', bn: 'IEnumerable vs IQueryable, First vs Single, Tracking measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing ienumerable vs iqueryable, first vs single, tracking.', bn: 'IEnumerable vs IQueryable, First vs Single, Tracking বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'task-vs-thread-async-vs-parallelism-configureawait': {
    id: 'task-vs-thread-async-vs-parallelism-configureawait',
    explanation: {
      what: { en: '**Task vs Thread, Async vs Parallelism**: Task is work; thread is OS resource. Async for I/O; Parallel for CPU. ConfigureAwait(false) in library code.', bn: '**Task vs Thread, Async vs Parallelism**: Task is work; thread is OS resource. Async for I/O; Parallel for CPU. ConfigureAwait(false) in library code.' },
      why: { en: 'Understanding task vs thread, async vs parallelism prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Task vs Thread, Async vs Parallelism বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Interview trap: explain definition + when it breaks + example bug.', bn: 'Interview trap: definition + কখন break + example bug বলুন।' },
      analogy: { en: 'Task vs Thread, Async vs Parallelism is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Task vs Thread, Async vs Parallelism = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used task vs thread, async vs parallelism during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Task vs Thread, Async vs Parallelism apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: ASYNC_FLOW_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Task is work; thread is OS resource. Async for I/O; Parallel… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Task is work; thread is OS resource. Async for I/O; Parallel… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating task vs thread, async vs parallelism as a silver bullet without measuring impact.', bn: 'Task vs Thread, Async vs Parallelism measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing task vs thread, async vs parallelism.', bn: 'Task vs Thread, Async vs Parallelism বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'interface-vs-abstract-struct-vs-class-const-vs-readonly-ref-vs-out-vs-in': {
    id: 'interface-vs-abstract-struct-vs-class-const-vs-readonly-ref-vs-out-vs-in',
    explanation: {
      what: { en: '**Type System Traps**: Interface = contract. Abstract = partial impl. Struct = value type stack. ref/out/in parameter semantics differ.', bn: '**Type System Traps**: Interface = contract. Abstract = partial impl. Struct = value type stack. ref/out/in parameter semantics differ.' },
      why: { en: 'Understanding type system traps prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Type System Traps বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Interview trap: explain definition + when it breaks + example bug.', bn: 'Interview trap: definition + কখন break + example bug বলুন।' },
      analogy: { en: 'Type System Traps is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Type System Traps = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used type system traps during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Type System Traps apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Interface = contract. Abstract = partial impl. Struct = valu… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Interface = contract. Abstract = partial impl. Struct = valu… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating type system traps as a silver bullet without measuring impact.', bn: 'Type System Traps measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing type system traps.', bn: 'Type System Traps বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'singleton-vs-scoped-captive-dependency': {
    id: 'singleton-vs-scoped-captive-dependency',
    explanation: {
      what: { en: '**Singleton vs Scoped Captive Dependency**: Never inject Scoped (DbContext) into Singleton — disposed context or stale state.', bn: '**Singleton vs Scoped Captive Dependency**: Never inject Scoped (DbContext) into Singleton — disposed context or stale state.' },
      why: { en: 'Understanding singleton vs scoped captive dependency prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Singleton vs Scoped Captive Dependency বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Interview trap: explain definition + when it breaks + example bug.', bn: 'Interview trap: definition + কখন break + example bug বলুন।' },
      analogy: { en: 'Singleton vs Scoped Captive Dependency is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Singleton vs Scoped Captive Dependency = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used singleton vs scoped captive dependency during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Singleton vs Scoped Captive Dependency apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    diagram: DI_LIFETIMES_DIAGRAM,
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Never inject Scoped (DbContext) into Singleton — disposed co… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Never inject Scoped (DbContext) into Singleton — disposed co… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating singleton vs scoped captive dependency as a silver bullet without measuring impact.', bn: 'Singleton vs Scoped Captive Dependency measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing singleton vs scoped captive dependency.', bn: 'Singleton vs Scoped Captive Dependency বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'jwt-vs-session-redis-vs-database-rabbitmq-vs-kafka': {
    id: 'jwt-vs-session-redis-vs-database-rabbitmq-vs-kafka',
    explanation: {
      what: { en: '**Technology Choice Traps**: JWT stateless API; session sticky; Redis shared cache not primary DB; RabbitMQ tasks vs Kafka log.', bn: '**Technology Choice Traps**: JWT stateless API; session sticky; Redis shared cache not primary DB; RabbitMQ tasks vs Kafka log.' },
      why: { en: 'Understanding technology choice traps prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Technology Choice Traps বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Interview trap: explain definition + when it breaks + example bug.', bn: 'Interview trap: definition + কখন break + example bug বলুন।' },
      analogy: { en: 'Technology Choice Traps is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Technology Choice Traps = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used technology choice traps during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Technology Choice Traps apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | JWT stateless API; session sticky; Redis shared cache not pr… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | JWT stateless API; session sticky; Redis shared cache not pr… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating technology choice traps as a silver bullet without measuring impact.', bn: 'Technology Choice Traps measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing technology choice traps.', bn: 'Technology Choice Traps বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'monolith-vs-microservices-vertical-vs-horizontal-scaling': {
    id: 'monolith-vs-microservices-vertical-vs-horizontal-scaling',
    explanation: {
      what: { en: '**Scaling Traps**: Vertical = bigger machine. Horizontal = more instances. Microservices need ops maturity — not default.', bn: '**Scaling Traps**: Vertical = bigger machine. Horizontal = more instances. Microservices need ops maturity — not default.' },
      why: { en: 'Understanding scaling traps prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Scaling Traps বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Interview trap: explain definition + when it breaks + example bug.', bn: 'Interview trap: definition + কখন break + example bug বলুন।' },
      analogy: { en: 'Scaling Traps is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Scaling Traps = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used scaling traps during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Scaling Traps apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Vertical = bigger machine. Horizontal = more instances. Micr… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Vertical = bigger machine. Horizontal = more instances. Micr… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating scaling traps as a silver bullet without measuring impact.', bn: 'Scaling Traps measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing scaling traps.', bn: 'Scaling Traps বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'c-oop-linq-async-cheat-sheet': {
    id: 'c-oop-linq-async-cheat-sheet',
    explanation: {
      what: { en: '**C#/OOP/LINQ/Async Cheat Sheet**: One-page recall: types, SOLID, LINQ operators, async rules.', bn: '**C#/OOP/LINQ/Async Cheat Sheet**: One-page recall: types, SOLID, LINQ operators, async rules.' },
      why: { en: 'Understanding c#/oop/linq/async cheat sheet prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'C#/OOP/LINQ/Async Cheat Sheet বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply c#/oop/linq/async cheat sheet in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'C#/OOP/LINQ/Async Cheat Sheet code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'C#/OOP/LINQ/Async Cheat Sheet is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'C#/OOP/LINQ/Async Cheat Sheet = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used c#/oop/linq/async cheat sheet during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ C#/OOP/LINQ/Async Cheat Sheet apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | One-page recall: types, SOLID, LINQ operators, async rules.… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | One-page recall: types, SOLID, LINQ operators, async rules.… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating c#/oop/linq/async cheat sheet as a silver bullet without measuring impact.', bn: 'C#/OOP/LINQ/Async Cheat Sheet measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing c#/oop/linq/async cheat sheet.', bn: 'C#/OOP/LINQ/Async Cheat Sheet বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'asp-net-di-ef-sql-cheat-sheet': {
    id: 'asp-net-di-ef-sql-cheat-sheet',
    explanation: {
      what: { en: '**ASP.NET/DI/EF/SQL Cheat Sheet**: Pipeline order, lifetimes, DbContext rules, index basics.', bn: '**ASP.NET/DI/EF/SQL Cheat Sheet**: Pipeline order, lifetimes, DbContext rules, index basics.' },
      why: { en: 'Understanding asp.net/di/ef/sql cheat sheet prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'ASP.NET/DI/EF/SQL Cheat Sheet বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply asp.net/di/ef/sql cheat sheet in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'ASP.NET/DI/EF/SQL Cheat Sheet code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'ASP.NET/DI/EF/SQL Cheat Sheet is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'ASP.NET/DI/EF/SQL Cheat Sheet = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used asp.net/di/ef/sql cheat sheet during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ ASP.NET/DI/EF/SQL Cheat Sheet apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Pipeline order, lifetimes, DbContext rules, index basics.… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Pipeline order, lifetimes, DbContext rules, index basics.… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating asp.net/di/ef/sql cheat sheet as a silver bullet without measuring impact.', bn: 'ASP.NET/DI/EF/SQL Cheat Sheet measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing asp.net/di/ef/sql cheat sheet.', bn: 'ASP.NET/DI/EF/SQL Cheat Sheet বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'architecture-security-redis-messaging-cheat-sheet': {
    id: 'architecture-security-redis-messaging-cheat-sheet',
    explanation: {
      what: { en: '**Architecture/Security/Messaging Cheat Sheet**: Cache-aside, JWT, delivery semantics, Docker multi-stage.', bn: '**Architecture/Security/Messaging Cheat Sheet**: Cache-aside, JWT, delivery semantics, Docker multi-stage.' },
      why: { en: 'Understanding architecture/security/messaging cheat sheet prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Architecture/Security/Messaging Cheat Sheet বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply architecture/security/messaging cheat sheet in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Architecture/Security/Messaging Cheat Sheet code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Architecture/Security/Messaging Cheat Sheet is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Architecture/Security/Messaging Cheat Sheet = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used architecture/security/messaging cheat sheet during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Architecture/Security/Messaging Cheat Sheet apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Cache-aside, JWT, delivery semantics, Docker multi-stage.… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Cache-aside, JWT, delivery semantics, Docker multi-stage.… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating architecture/security/messaging cheat sheet as a silver bullet without measuring impact.', bn: 'Architecture/Security/Messaging Cheat Sheet measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing architecture/security/messaging cheat sheet.', bn: 'Architecture/Security/Messaging Cheat Sheet বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'system-design-one-page-method': {
    id: 'system-design-one-page-method',
    explanation: {
      what: { en: '**System Design One-Page Method**: Requirements → API → data → scale → bottlenecks → trade-offs.', bn: '**System Design One-Page Method**: Requirements → API → data → scale → bottlenecks → trade-offs.' },
      why: { en: 'Understanding system design one-page method prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'System Design One-Page Method বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply system design one-page method in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'System Design One-Page Method code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'System Design One-Page Method is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'System Design One-Page Method = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used system design one-page method during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ System Design One-Page Method apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Requirements → API → data → scale → bottlenecks → trade-offs… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Requirements → API → data → scale → bottlenecks → trade-offs… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating system design one-page method as a silver bullet without measuring impact.', bn: 'System Design One-Page Method measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing system design one-page method.', bn: 'System Design One-Page Method বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  '30-must-know-questions-short-senior-answers': {
    id: '30-must-know-questions-short-senior-answers',
    explanation: {
      what: { en: '**30 Must-Know Senior Questions**: Short structured answers: DI, async, SQL, auth, caching, incidents.', bn: '**30 Must-Know Senior Questions**: Short structured answers: DI, async, SQL, auth, caching, incidents.' },
      why: { en: 'Understanding 30 must-know senior questions prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: '30 Must-Know Senior Questions বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply 30 must-know senior questions in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: '30 Must-Know Senior Questions code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: '30 Must-Know Senior Questions is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: '30 Must-Know Senior Questions = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used 30 must-know senior questions during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ 30 Must-Know Senior Questions apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Short structured answers: DI, async, SQL, auth, caching, inc… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Short structured answers: DI, async, SQL, auth, caching, inc… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating 30 must-know senior questions as a silver bullet without measuring impact.', bn: '30 Must-Know Senior Questions measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing 30 must-know senior questions.', bn: '30 Must-Know Senior Questions বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'mock-interview-roadmap-13-phases-and-night-before-drill': {
    id: 'mock-interview-roadmap-13-phases-and-night-before-drill',
    explanation: {
      what: { en: '**Mock Interview Roadmap**: 13 phases from C# to system design; night-before sleep and flashcard drill.', bn: '**Mock Interview Roadmap**: 13 phases from C# to system design; night-before sleep and flashcard drill.' },
      why: { en: 'Understanding mock interview roadmap prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Mock Interview Roadmap বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply mock interview roadmap in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'Mock Interview Roadmap code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'Mock Interview Roadmap is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'Mock Interview Roadmap = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used mock interview roadmap during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ Mock Interview Roadmap apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | 13 phases from C# to system design; night-before sleep and f… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | 13 phases from C# to system design; night-before sleep and f… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating mock interview roadmap as a silver bullet without measuring impact.', bn: 'Mock Interview Roadmap measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing mock interview roadmap.', bn: 'Mock Interview Roadmap বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'c-14-field-keyword-clean-ddd-entity-encapsulation': {
    id: 'c-14-field-keyword-clean-ddd-entity-encapsulation',
    explanation: {
      what: { en: '**C# 14 field Keyword & DDD Encapsulation**: C# 14 \`field\` keyword simplifies backing field in properties — cleaner entity encapsulation in DDD.', bn: '**C# 14 field Keyword & DDD Encapsulation**: C# 14 \`field\` keyword simplifies backing field in properties — cleaner entity encapsulation in DDD.' },
      why: { en: 'Understanding c# 14 field keyword & ddd encapsulation prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'C# 14 field Keyword & DDD Encapsulation বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply c# 14 field keyword & ddd encapsulation in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'C# 14 field Keyword & DDD Encapsulation code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'C# 14 field Keyword & DDD Encapsulation is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'C# 14 field Keyword & DDD Encapsulation = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used c# 14 field keyword & ddd encapsulation during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ C# 14 field Keyword & DDD Encapsulation apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | C# 14 \`field\` keyword simplifies backing field in properties… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | C# 14 \`field\` keyword simplifies backing field in properties… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating c# 14 field keyword & ddd encapsulation as a silver bullet without measuring impact.', bn: 'C# 14 field Keyword & DDD Encapsulation measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing c# 14 field keyword & ddd encapsulation.', bn: 'C# 14 field Keyword & DDD Encapsulation বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'ef-core-10-named-query-filters-stacked-multi-tenancy-soft-deletes': {
    id: 'ef-core-10-named-query-filters-stacked-multi-tenancy-soft-deletes',
    explanation: {
      what: { en: '**EF Core 10 Named Query Filters**: Stacked global filters for multi-tenancy + soft delete — compose with named filters instead of one giant expression.', bn: '**EF Core 10 Named Query Filters**: Stacked global filters for multi-tenancy + soft delete — compose with named filters instead of one giant expression.' },
      why: { en: 'Understanding ef core 10 named query filters prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'EF Core 10 Named Query Filters বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply ef core 10 named query filters in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'EF Core 10 Named Query Filters code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'EF Core 10 Named Query Filters is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'EF Core 10 Named Query Filters = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used ef core 10 named query filters during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ EF Core 10 Named Query Filters apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Stacked global filters for multi-tenancy + soft delete — com… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Stacked global filters for multi-tenancy + soft delete — com… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating ef core 10 named query filters as a silver bullet without measuring impact.', bn: 'EF Core 10 Named Query Filters measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing ef core 10 named query filters.', bn: 'EF Core 10 Named Query Filters বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  'high-performance-t-sql-replacing-cursors-with-while-loop-batches-net-10-jit-loop-inversion': {
    id: 'high-performance-t-sql-replacing-cursors-with-while-loop-batches-net-10-jit-loop-inversion',
    explanation: {
      what: { en: '**High-Performance T-SQL & .NET 10 JIT**: Replace cursors with set-based or batched WHILE loops; .NET 10 JIT loop inversion improves hot loops.', bn: '**High-Performance T-SQL & .NET 10 JIT**: Replace cursors with set-based or batched WHILE loops; .NET 10 JIT loop inversion improves hot loops.' },
      why: { en: 'Understanding high-performance t-sql & .net 10 jit prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'High-Performance T-SQL & .NET 10 JIT বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: 'Apply high-performance t-sql & .net 10 jit in code reviews, design docs, and incident postmortems — measure before optimizing.', bn: 'High-Performance T-SQL & .NET 10 JIT code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।' },
      analogy: { en: 'High-Performance T-SQL & .NET 10 JIT is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.', bn: 'High-Performance T-SQL & .NET 10 JIT = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।' },
      realWorld: { en: 'A senior .NET team used high-performance t-sql & .net 10 jit during a production incident and reduced MTTR by fixing root cause instead of symptoms.', bn: 'একটি senior .NET team production incident-এ High-Performance T-SQL & .NET 10 JIT apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Replace cursors with set-based or batched WHILE loops; .NET … | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Replace cursors with set-based or batched WHILE loops; .NET … | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating high-performance t-sql & .net 10 jit as a silver bullet without measuring impact.', bn: 'High-Performance T-SQL & .NET 10 JIT measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing high-performance t-sql & .net 10 jit.', bn: 'High-Performance T-SQL & .NET 10 JIT বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },

  '1-the-shopping-cart-complex-calculation': {
    id: '1-the-shopping-cart-complex-calculation',
    explanation: {
      what: { en: '**Shopping Cart Calculation**: Apply discount → shipping → tax in order using \`decimal\` — never \`double\` for money.', bn: '**Shopping Cart Calculation**: Discount → shipping → tax order-এ \`decimal\` — money-তে \`double\` নয়।' },
      why: { en: 'Understanding shopping cart calculation prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Shopping Cart Calculation বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Apply discount → shipping → tax in order using \`decimal\` — never \`double\` for money. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Discount → shipping → tax order-এ \`decimal\` — money-তে \`double\` নয়। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Shopping Cart Calculation" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Shopping Cart Calculation" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Shopping Cart Calculation" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Shopping Cart Calculation" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Shopping Cart Calculation.', bn: 'Shopping Cart Calculation-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '2-the-cache-aside-pattern': {
    id: '2-the-cache-aside-pattern',
    explanation: {
      what: { en: '**Cache-Aside Pattern**: Redis get → miss → DB → set TTL → return; degrade gracefully if Redis is down.', bn: '**Cache-Aside Pattern**: Redis get → miss → DB → TTL set → return; Redis down হলে graceful degrade।' },
      why: { en: 'Understanding cache-aside pattern prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Cache-Aside Pattern বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Redis get → miss → DB → set TTL → return; degrade gracefully if Redis is down. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Redis get → miss → DB → TTL set → return; Redis down হলে graceful degrade। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Cache-Aside Pattern" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Cache-Aside Pattern" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Cache-Aside Pattern" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Cache-Aside Pattern" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    diagram: CACHE_ASIDE_DIAGRAM,
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Cache-Aside Pattern.', bn: 'Cache-Aside Pattern-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '3-background-report-generation': {
    id: '3-background-report-generation',
    explanation: {
      what: { en: '**Background Report Generation**: Enqueue CSV job, return \`202 Accepted\` + job ID — never block HTTP for 30s export.', bn: '**Background Report Generation**: CSV job enqueue, \`202 Accepted\` + job ID — 30s export-এ HTTP block নয়।' },
      why: { en: 'Understanding background report generation prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Background Report Generation বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Enqueue CSV job, return \`202 Accepted\` + job ID — never block HTTP for 30s export. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) CSV job enqueue, \`202 Accepted\` + job ID — 30s export-এ HTTP block নয়। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Background Report Generation" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Background Report Generation" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Background Report Generation" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Background Report Generation" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Background Report Generation.', bn: 'Background Report Generation-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '4-thread-safety-with-interlocked': {
    id: '4-thread-safety-with-interlocked',
    explanation: {
      what: { en: '**Thread Safety with Interlocked**: \`Interlocked.Increment\` for shared counters — lighter than \`lock\` for simple atomic ops.', bn: '**Thread Safety with Interlocked**: Shared counter-এ \`Interlocked.Increment\` — simple atomic-এ \`lock\`-এর চেয়ে হালকা।' },
      why: { en: 'Understanding thread safety with interlocked prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Thread Safety with Interlocked বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) \`Interlocked.Increment\` for shared counters — lighter than \`lock\` for simple atomic ops. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Shared counter-এ \`Interlocked.Increment\` — simple atomic-এ \`lock\`-এর চেয়ে হালকা। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Thread Safety with Interlocked" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Thread Safety with Interlocked" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Thread Safety with Interlocked" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Thread Safety with Interlocked" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Thread Safety with Interlocked.', bn: 'Thread Safety with Interlocked-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '5-global-exception-handler-middleware': {
    id: '5-global-exception-handler-middleware',
    explanation: {
      what: { en: '**Global Exception Middleware**: Outer middleware → log + ProblemDetails JSON + trace ID; never leak stack in prod.', bn: '**Global Exception Middleware**: Outer middleware → log + ProblemDetails + trace ID; prod-এ stack leak নয়।' },
      why: { en: 'Understanding global exception middleware prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Global Exception Middleware বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Outer middleware → log + ProblemDetails JSON + trace ID; never leak stack in prod. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Outer middleware → log + ProblemDetails + trace ID; prod-এ stack leak নয়। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Global Exception Middleware" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Global Exception Middleware" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Global Exception Middleware" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Global Exception Middleware" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    diagram: MIDDLEWARE_CHAIN_ASCII,
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Global Exception Middleware.', bn: 'Global Exception Middleware-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '6-generic-repository-implementation': {
    id: '6-generic-repository-implementation',
    explanation: {
      what: { en: '**Generic Repository**: \`IRepository<T>\` CRUD abstraction — avoid leaking \`IQueryable\` unless intentional.', bn: '**Generic Repository**: \`IRepository<T>\` CRUD — intentional না হলে \`IQueryable\` leak নয়।' },
      why: { en: 'Understanding generic repository prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Generic Repository বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) \`IRepository<T>\` CRUD abstraction — avoid leaking \`IQueryable\` unless intentional. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) \`IRepository<T>\` CRUD — intentional না হলে \`IQueryable\` leak নয়। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Generic Repository" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Generic Repository" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Generic Repository" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Generic Repository" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    diagram: REPOSITORY_PATTERN_DIAGRAM,
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Generic Repository.', bn: 'Generic Repository-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '7-palindrome-check-string-optimization': {
    id: '7-palindrome-check-string-optimization',
    explanation: {
      what: { en: '**Palindrome Check**: Two pointers after filtering non-alphanumeric — O(n) time, O(1) space.', bn: '**Palindrome Check**: Non-alphanumeric filter → two pointer — O(n) time, O(1) space।' },
      why: { en: 'Understanding palindrome check prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Palindrome Check বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Two pointers after filtering non-alphanumeric — O(n) time, O(1) space. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Non-alphanumeric filter → two pointer — O(n) time, O(1) space। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Palindrome Check" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Palindrome Check" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Palindrome Check" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Palindrome Check" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Palindrome Check.', bn: 'Palindrome Check-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '8-dependency-injection-with-factory': {
    id: '8-dependency-injection-with-factory',
    explanation: {
      what: { en: '**DI Factory Pattern**: Keyed DI or factory returns \`IPaymentGateway\` — consumer never \`new\`s Stripe/PayPal.', bn: '**DI Factory Pattern**: Keyed DI/factory \`IPaymentGateway\` — consumer Stripe/PayPal \`new\` করে না।' },
      why: { en: 'Understanding di factory pattern prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'DI Factory Pattern বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Keyed DI or factory returns \`IPaymentGateway\` — consumer never \`new\`s Stripe/PayPal. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Keyed DI/factory \`IPaymentGateway\` — consumer Stripe/PayPal \`new\` করে না। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "DI Factory Pattern" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"DI Factory Pattern" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "DI Factory Pattern" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "DI Factory Pattern" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    diagram: DI_FLOW_DIAGRAM,
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for DI Factory Pattern.', bn: 'DI Factory Pattern-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '9-linq-optimization-n-1-solution': {
    id: '9-linq-optimization-n-1-solution',
    explanation: {
      what: { en: '**LINQ N+1 Fix**: \`.Include()\` or projection in one query — not \`foreach\` + query per row.', bn: '**LINQ N+1 Fix**: \`.Include()\` বা projection এক query — row প্রতি query নয়।' },
      why: { en: 'Understanding linq n+1 fix prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'LINQ N+1 Fix বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) \`.Include()\` or projection in one query — not \`foreach\` + query per row. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) \`.Include()\` বা projection এক query — row প্রতি query নয়। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "LINQ N+1 Fix" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"LINQ N+1 Fix" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "LINQ N+1 Fix" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "LINQ N+1 Fix" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    diagram: LINQ_DEFERRED_DIAGRAM,
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for LINQ N+1 Fix.', bn: 'LINQ N+1 Fix-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '10-singleton-pattern-thread-safe': {
    id: '10-singleton-pattern-thread-safe',
    explanation: {
      what: { en: '**Thread-Safe Singleton**: \`Lazy<T>\` or DI Singleton — avoid hand-rolled double-checked locking bugs.', bn: '**Thread-Safe Singleton**: \`Lazy<T>\` বা DI Singleton — hand-rolled double-checked locking bug avoid।' },
      why: { en: 'Understanding thread-safe singleton prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Thread-Safe Singleton বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) \`Lazy<T>\` or DI Singleton — avoid hand-rolled double-checked locking bugs. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) \`Lazy<T>\` বা DI Singleton — hand-rolled double-checked locking bug avoid। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Thread-Safe Singleton" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Thread-Safe Singleton" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Thread-Safe Singleton" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Thread-Safe Singleton" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Thread-Safe Singleton.', bn: 'Thread-Safe Singleton-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '11-two-sum-problem': {
    id: '11-two-sum-problem',
    explanation: {
      what: { en: '**Two Sum**: Hash map stores \`value → index\`; for each \`x\`, check if \`target - x\` exists — O(n).', bn: '**Two Sum**: Hash map \`value → index\`; প্রতি \`x\`-এ \`target - x\` আছে কিনা — O(n)।' },
      why: { en: 'Understanding two sum prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Two Sum বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Hash map stores \`value → index\`; for each \`x\`, check if \`target - x\` exists — O(n). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Hash map \`value → index\`; প্রতি \`x\`-এ \`target - x\` আছে কিনা — O(n)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Two Sum" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Two Sum" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Two Sum" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Two Sum" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Two Sum.', bn: 'Two Sum-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '12-reverse-a-linked-list': {
    id: '12-reverse-a-linked-list',
    explanation: {
      what: { en: '**Reverse Linked List**: Three pointers: prev, curr, next — flip links in one pass O(n), O(1) space.', bn: '**Reverse Linked List**: Three pointer prev/curr/next — one pass O(n), O(1) space।' },
      why: { en: 'Understanding reverse linked list prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Reverse Linked List বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Three pointers: prev, curr, next — flip links in one pass O(n), O(1) space. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Three pointer prev/curr/next — one pass O(n), O(1) space। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Reverse Linked List" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Reverse Linked List" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Reverse Linked List" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Reverse Linked List" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Reverse Linked List.', bn: 'Reverse Linked List-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '13-binary-search-implementation': {
    id: '13-binary-search-implementation',
    explanation: {
      what: { en: '**Binary Search**: Sorted array, \`lo/hi\` mid — O(log n); watch \`lo <= hi\` and overflow-safe mid.', bn: '**Binary Search**: Sorted array \`lo/hi\` mid — O(log n); \`lo <= hi\` ও overflow-safe mid।' },
      why: { en: 'Understanding binary search prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Binary Search বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Sorted array, \`lo/hi\` mid — O(log n); watch \`lo <= hi\` and overflow-safe mid. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Sorted array \`lo/hi\` mid — O(log n); \`lo <= hi\` ও overflow-safe mid। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Binary Search" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Binary Search" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Binary Search" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Binary Search" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Binary Search.', bn: 'Binary Search-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '14-valid-parentheses-stack': {
    id: '14-valid-parentheses-stack',
    explanation: {
      what: { en: '**Valid Parentheses**: Stack push opens; pop must match close — O(n) single scan.', bn: '**Valid Parentheses**: Stack-এ open push; close match pop — O(n) single scan।' },
      why: { en: 'Understanding valid parentheses prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Valid Parentheses বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Stack push opens; pop must match close — O(n) single scan. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Stack-এ open push; close match pop — O(n) single scan। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Valid Parentheses" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Valid Parentheses" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Valid Parentheses" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Valid Parentheses" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Valid Parentheses.', bn: 'Valid Parentheses-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '15-find-missing-number-xor': {
    id: '15-find-missing-number-xor',
    explanation: {
      what: { en: '**Find Missing Number (XOR)**: XOR all indices 0..n and all values — duplicate cancels, missing remains.', bn: '**Find Missing Number (XOR)**: Index 0..n ও value XOR — duplicate cancel, missing থেকে যায়।' },
      why: { en: 'Understanding find missing number (xor) prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Find Missing Number (XOR) বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) XOR all indices 0..n and all values — duplicate cancels, missing remains. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Index 0..n ও value XOR — duplicate cancel, missing থেকে যায়। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Find Missing Number (XOR)" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Find Missing Number (XOR)" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Find Missing Number (XOR)" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Find Missing Number (XOR)" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Find Missing Number (XOR).', bn: 'Find Missing Number (XOR)-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '16-fibonacci-with-memoization': {
    id: '16-fibonacci-with-memoization',
    explanation: {
      what: { en: '**Fibonacci Memoization**: Top-down cache or bottom-up array — O(n) vs exponential naive recursion.', bn: '**Fibonacci Memoization**: Top-down cache/bottom-up — O(n) vs exponential naive recursion।' },
      why: { en: 'Understanding fibonacci memoization prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Fibonacci Memoization বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Top-down cache or bottom-up array — O(n) vs exponential naive recursion. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Top-down cache/bottom-up — O(n) vs exponential naive recursion। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Fibonacci Memoization" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Fibonacci Memoization" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Fibonacci Memoization" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Fibonacci Memoization" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Fibonacci Memoization.', bn: 'Fibonacci Memoization-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '17-merge-intervals': {
    id: '17-merge-intervals',
    explanation: {
      what: { en: '**Merge Intervals**: Sort by start, merge if overlap — O(n log n); calendar booking pattern.', bn: '**Merge Intervals**: Start দিয়ে sort, overlap merge — O(n log n); calendar booking pattern।' },
      why: { en: 'Understanding merge intervals prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Merge Intervals বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Sort by start, merge if overlap — O(n log n); calendar booking pattern. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Start দিয়ে sort, overlap merge — O(n log n); calendar booking pattern। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Merge Intervals" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Merge Intervals" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Merge Intervals" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Merge Intervals" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Merge Intervals.', bn: 'Merge Intervals-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '18-maximum-subarray-kadane-s': {
    id: '18-maximum-subarray-kadane-s',
    explanation: {
      what: { en: '**Maximum Subarray (Kadane\'s)**: Track \`currentSum\` reset when negative; keep \`maxSum\` — O(n).', bn: '**Maximum Subarray (Kadane\'s)**: \`currentSum\` negative হলে reset; \`maxSum\` track — O(n)।' },
      why: { en: 'Understanding maximum subarray (kadane\'s) prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Maximum Subarray (Kadane\'s) বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Track \`currentSum\` reset when negative; keep \`maxSum\` — O(n). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) \`currentSum\` negative হলে reset; \`maxSum\` track — O(n)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Maximum Subarray (Kadane\'s)" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Maximum Subarray (Kadane\'s)" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Maximum Subarray (Kadane\'s)" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Maximum Subarray (Kadane\'s)" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Maximum Subarray (Kadane\'s).', bn: 'Maximum Subarray (Kadane\'s)-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '19-cycle-detection-floyd-s': {
    id: '19-cycle-detection-floyd-s',
    explanation: {
      what: { en: '**Cycle Detection (Floyd\'s)**: Slow/fast pointers meet if cycle; find start by resetting one pointer — O(n).', bn: '**Cycle Detection (Floyd\'s)**: Slow/fast meet = cycle; এক pointer reset → start — O(n)।' },
      why: { en: 'Understanding cycle detection (floyd\'s) prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Cycle Detection (Floyd\'s) বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Slow/fast pointers meet if cycle; find start by resetting one pointer — O(n). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Slow/fast meet = cycle; এক pointer reset → start — O(n)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Cycle Detection (Floyd\'s)" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Cycle Detection (Floyd\'s)" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Cycle Detection (Floyd\'s)" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Cycle Detection (Floyd\'s)" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Cycle Detection (Floyd\'s).', bn: 'Cycle Detection (Floyd\'s)-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '20-climbing-stairs-dp': {
    id: '20-climbing-stairs-dp',
    explanation: {
      what: { en: '**Climbing Stairs DP**: \`dp[i] = dp[i-1] + dp[i-2]\` — classic 1D DP intro.', bn: '**Climbing Stairs DP**: \`dp[i] = dp[i-1] + dp[i-2]\` — classic 1D DP intro।' },
      why: { en: 'Understanding climbing stairs dp prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Climbing Stairs DP বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) \`dp[i] = dp[i-1] + dp[i-2]\` — classic 1D DP intro. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) \`dp[i] = dp[i-1] + dp[i-2]\` — classic 1D DP intro। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Climbing Stairs DP" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Climbing Stairs DP" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Climbing Stairs DP" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Climbing Stairs DP" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Climbing Stairs DP.', bn: 'Climbing Stairs DP-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '21-valid-anagram': {
    id: '21-valid-anagram',
    explanation: {
      what: { en: '**Valid Anagram**: 26-letter freq count or sort both strings — O(n).', bn: '**Valid Anagram**: 26-letter freq count বা sort — O(n)।' },
      why: { en: 'Understanding valid anagram prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Valid Anagram বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) 26-letter freq count or sort both strings — O(n). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) 26-letter freq count বা sort — O(n)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Valid Anagram" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Valid Anagram" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Valid Anagram" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Valid Anagram" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Valid Anagram.', bn: 'Valid Anagram-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '22-binary-tree-inorder-traversal': {
    id: '22-binary-tree-inorder-traversal',
    explanation: {
      what: { en: '**Binary Tree Inorder**: Recursive or explicit stack: left → root → right.', bn: '**Binary Tree Inorder**: Recursive/stack: left → root → right।' },
      why: { en: 'Understanding binary tree inorder prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Binary Tree Inorder বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Recursive or explicit stack: left → root → right. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Recursive/stack: left → root → right। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Binary Tree Inorder" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Binary Tree Inorder" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Binary Tree Inorder" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Binary Tree Inorder" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Binary Tree Inorder.', bn: 'Binary Tree Inorder-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '23-implementing-a-queue-using-stacks': {
    id: '23-implementing-a-queue-using-stacks',
    explanation: {
      what: { en: '**Queue Using Two Stacks**: In-stack + out-stack; amortized O(1) enqueue/dequeue.', bn: '**Queue Using Two Stacks**: In-stack + out-stack; amortized O(1) enqueue/dequeue।' },
      why: { en: 'Understanding queue using two stacks prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Queue Using Two Stacks বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) In-stack + out-stack; amortized O(1) enqueue/dequeue. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) In-stack + out-stack; amortized O(1) enqueue/dequeue। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Queue Using Two Stacks" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Queue Using Two Stacks" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Queue Using Two Stacks" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Queue Using Two Stacks" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Queue Using Two Stacks.', bn: 'Queue Using Two Stacks-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '24-remove-duplicates-from-sorted-array': {
    id: '24-remove-duplicates-from-sorted-array',
    explanation: {
      what: { en: '**Remove Duplicates In-Place**: Write pointer \`k\` for unique positions — O(n), O(1) extra.', bn: '**Remove Duplicates In-Place**: Write pointer \`k\` unique position — O(n), O(1) extra।' },
      why: { en: 'Understanding remove duplicates in-place prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Remove Duplicates In-Place বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Write pointer \`k\` for unique positions — O(n), O(1) extra. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Write pointer \`k\` unique position — O(n), O(1) extra। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Remove Duplicates In-Place" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Remove Duplicates In-Place" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Remove Duplicates In-Place" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Remove Duplicates In-Place" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Remove Duplicates In-Place.', bn: 'Remove Duplicates In-Place-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '25-best-time-to-buy-and-sell-stock': {
    id: '25-best-time-to-buy-and-sell-stock',
    explanation: {
      what: { en: '**Best Time Buy/Sell Stock**: Track min price so far, update max profit — single pass O(n).', bn: '**Best Time Buy/Sell Stock**: Min price track, max profit update — single pass O(n)।' },
      why: { en: 'Understanding best time buy/sell stock prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Best Time Buy/Sell Stock বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Track min price so far, update max profit — single pass O(n). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Min price track, max profit update — single pass O(n)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Best Time Buy/Sell Stock" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Best Time Buy/Sell Stock" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Best Time Buy/Sell Stock" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Best Time Buy/Sell Stock" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Best Time Buy/Sell Stock.', bn: 'Best Time Buy/Sell Stock-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '26-fizzbuzz-implementation': {
    id: '26-fizzbuzz-implementation',
    explanation: {
      what: { en: '**FizzBuzz**: Mod 3/5/15 rules — tests readability and edge case 15.', bn: '**FizzBuzz**: Mod 3/5/15 rule — readability ও edge 15 test।' },
      why: { en: 'Understanding fizzbuzz prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'FizzBuzz বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Mod 3/5/15 rules — tests readability and edge case 15. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Mod 3/5/15 rule — readability ও edge 15 test। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "FizzBuzz" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"FizzBuzz" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "FizzBuzz" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "FizzBuzz" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for FizzBuzz.', bn: 'FizzBuzz-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '27-reverse-words-in-a-string': {
    id: '27-reverse-words-in-a-string',
    explanation: {
      what: { en: '**Reverse Words**: Trim, split, reverse array or reverse char segments in-place.', bn: '**Reverse Words**: Trim, split, reverse array বা in-place char segment reverse।' },
      why: { en: 'Understanding reverse words prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Reverse Words বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Trim, split, reverse array or reverse char segments in-place. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Trim, split, reverse array বা in-place char segment reverse। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Reverse Words" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Reverse Words" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Reverse Words" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Reverse Words" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Reverse Words.', bn: 'Reverse Words-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '28-factorial-recursion-vs-iterative': {
    id: '28-factorial-recursion-vs-iterative',
    explanation: {
      what: { en: '**Factorial Recursion vs Iterative**: Iterative loop avoids stack overflow for large n; O(n) both.', bn: '**Factorial Recursion vs Iterative**: Iterative loop large n-এ stack overflow avoid; O(n) both।' },
      why: { en: 'Understanding factorial recursion vs iterative prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Factorial Recursion vs Iterative বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Iterative loop avoids stack overflow for large n; O(n) both. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Iterative loop large n-এ stack overflow avoid; O(n) both। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Factorial Recursion vs Iterative" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Factorial Recursion vs Iterative" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Factorial Recursion vs Iterative" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Factorial Recursion vs Iterative" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Factorial Recursion vs Iterative.', bn: 'Factorial Recursion vs Iterative-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '29-check-for-balanced-tree': {
    id: '29-check-for-balanced-tree',
    explanation: {
      what: { en: '**Balanced Binary Tree**: Return height or -1 if |left-right| > 1 — O(n) one pass.', bn: '**Balanced Binary Tree**: Height return বা |left-right|>1 → -1 — O(n) one pass।' },
      why: { en: 'Understanding balanced binary tree prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Balanced Binary Tree বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Return height or -1 if |left-right| > 1 — O(n) one pass. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Height return বা |left-right|>1 → -1 — O(n) one pass। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Balanced Binary Tree" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Balanced Binary Tree" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Balanced Binary Tree" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Balanced Binary Tree" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Balanced Binary Tree.', bn: 'Balanced Binary Tree-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '30-deep-copy-vs-shallow-copy': {
    id: '30-deep-copy-vs-shallow-copy',
    explanation: {
      what: { en: '**Deep Copy vs Shallow Copy**: Shallow copies references; deep clone nested collections — records vs manual.', bn: '**Deep Copy vs Shallow Copy**: Shallow reference copy; deep nested clone — record vs manual।' },
      why: { en: 'Understanding deep copy vs shallow copy prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Deep Copy vs Shallow Copy বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Shallow copies references; deep clone nested collections — records vs manual. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Shallow reference copy; deep nested clone — record vs manual। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Deep Copy vs Shallow Copy" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Deep Copy vs Shallow Copy" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Deep Copy vs Shallow Copy" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Deep Copy vs Shallow Copy" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Deep Copy vs Shallow Copy.', bn: 'Deep Copy vs Shallow Copy-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '31-longest-common-subsequence-dp': {
    id: '31-longest-common-subsequence-dp',
    explanation: {
      what: { en: '**Longest Common Subsequence**: 2D DP: match → +1 diagonal, else max(up, left).', bn: '**Longest Common Subsequence**: 2D DP: match → diagonal +1, else max(up, left)।' },
      why: { en: 'Understanding longest common subsequence prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Longest Common Subsequence বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) 2D DP: match → +1 diagonal, else max(up, left). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) 2D DP: match → diagonal +1, else max(up, left)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Longest Common Subsequence" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Longest Common Subsequence" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Longest Common Subsequence" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Longest Common Subsequence" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Longest Common Subsequence.', bn: 'Longest Common Subsequence-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '32-sliding-window-maximum': {
    id: '32-sliding-window-maximum',
    explanation: {
      what: { en: '**Sliding Window Maximum**: Monotonic deque stores useful indices — O(n) window max.', bn: '**Sliding Window Maximum**: Monotonic deque useful index — O(n) window max।' },
      why: { en: 'Understanding sliding window maximum prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Sliding Window Maximum বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Monotonic deque stores useful indices — O(n) window max. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Monotonic deque useful index — O(n) window max। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Sliding Window Maximum" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Sliding Window Maximum" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Sliding Window Maximum" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Sliding Window Maximum" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Sliding Window Maximum.', bn: 'Sliding Window Maximum-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '33-graph-bfs-implementation': {
    id: '33-graph-bfs-implementation',
    explanation: {
      what: { en: '**Graph BFS**: Queue + visited set — shortest path in unweighted graph.', bn: '**Graph BFS**: Queue + visited — unweighted graph shortest path।' },
      why: { en: 'Understanding graph bfs prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Graph BFS বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Queue + visited set — shortest path in unweighted graph. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Queue + visited — unweighted graph shortest path। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Graph BFS" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Graph BFS" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Graph BFS" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Graph BFS" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Graph BFS.', bn: 'Graph BFS-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '34-implement-a-trie-prefix-tree': {
    id: '34-implement-a-trie-prefix-tree',
    explanation: {
      what: { en: '**Trie (Prefix Tree)**: Char nodes + \`IsEnd\` flag — prefix search/autocomplete O(m).', bn: '**Trie (Prefix Tree)**: Char node + \`IsEnd\` — prefix/autocomplete O(m)।' },
      why: { en: 'Understanding trie (prefix tree) prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Trie (Prefix Tree) বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Char nodes + \`IsEnd\` flag — prefix search/autocomplete O(m). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Char node + \`IsEnd\` — prefix/autocomplete O(m)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Trie (Prefix Tree)" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Trie (Prefix Tree)" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Trie (Prefix Tree)" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Trie (Prefix Tree)" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Trie (Prefix Tree).', bn: 'Trie (Prefix Tree)-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '35-container-with-most-water': {
    id: '35-container-with-most-water',
    explanation: {
      what: { en: '**Container With Most Water**: Two pointers from ends; move shorter line — O(n) greedy.', bn: '**Container With Most Water**: Two pointer ends; shorter line move — O(n) greedy।' },
      why: { en: 'Understanding container with most water prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Container With Most Water বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Two pointers from ends; move shorter line — O(n) greedy. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Two pointer ends; shorter line move — O(n) greedy। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Container With Most Water" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Container With Most Water" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Container With Most Water" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Container With Most Water" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Container With Most Water.', bn: 'Container With Most Water-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '36-find-all-anagrams-in-a-string': {
    id: '36-find-all-anagrams-in-a-string',
    explanation: {
      what: { en: '**Find All Anagrams**: Fixed sliding window + freq map compare — O(n).', bn: '**Find All Anagrams**: Fixed sliding window + freq map — O(n)।' },
      why: { en: 'Understanding find all anagrams prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Find All Anagrams বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Fixed sliding window + freq map compare — O(n). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Fixed sliding window + freq map — O(n)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Find All Anagrams" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Find All Anagrams" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Find All Anagrams" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Find All Anagrams" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Find All Anagrams.', bn: 'Find All Anagrams-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '37-lowest-common-ancestor-tree': {
    id: '37-lowest-common-ancestor-tree',
    explanation: {
      what: { en: '**Lowest Common Ancestor**: Recursive: if node is p or q return it; LCA where both subtrees return non-null.', bn: '**Lowest Common Ancestor**: Recursive: node p/q → return; both subtree non-null → LCA।' },
      why: { en: 'Understanding lowest common ancestor prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Lowest Common Ancestor বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Recursive: if node is p or q return it; LCA where both subtrees return non-null. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Recursive: node p/q → return; both subtree non-null → LCA। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Lowest Common Ancestor" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Lowest Common Ancestor" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Lowest Common Ancestor" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Lowest Common Ancestor" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Lowest Common Ancestor.', bn: 'Lowest Common Ancestor-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '38-subsets-generation-backtracking': {
    id: '38-subsets-generation-backtracking',
    explanation: {
      what: { en: '**Subsets Backtracking**: Include/exclude each element — O(2^n); explain pruning if asked.', bn: '**Subsets Backtracking**: Include/exclude each element — O(2^n); pruning explain।' },
      why: { en: 'Understanding subsets backtracking prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Subsets Backtracking বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Include/exclude each element — O(2^n); explain pruning if asked. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Include/exclude each element — O(2^n); pruning explain। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Subsets Backtracking" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Subsets Backtracking" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Subsets Backtracking" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Subsets Backtracking" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Subsets Backtracking.', bn: 'Subsets Backtracking-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '39-top-k-frequent-elements': {
    id: '39-top-k-frequent-elements',
    explanation: {
      what: { en: '**Top K Frequent Elements**: Freq map + min-heap size k or bucket sort — O(n log k).', bn: '**Top K Frequent Elements**: Freq map + min-heap k বা bucket sort — O(n log k)।' },
      why: { en: 'Understanding top k frequent elements prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Top K Frequent Elements বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Freq map + min-heap size k or bucket sort — O(n log k). 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Freq map + min-heap k বা bucket sort — O(n log k)। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Top K Frequent Elements" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Top K Frequent Elements" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Top K Frequent Elements" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Top K Frequent Elements" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Top K Frequent Elements.', bn: 'Top K Frequent Elements-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '40-coin-change-problem-dp': {
    id: '40-coin-change-problem-dp',
    explanation: {
      what: { en: '**Coin Change DP**: Bottom-up \`dp[amount]\` min coins — unbounded knapsack variant.', bn: '**Coin Change DP**: Bottom-up \`dp[amount]\` min coin — unbounded knapsack variant।' },
      why: { en: 'Understanding coin change dp prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Coin Change DP বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Bottom-up \`dp[amount]\` min coins — unbounded knapsack variant. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Bottom-up \`dp[amount]\` min coin — unbounded knapsack variant। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Coin Change DP" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Coin Change DP" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Coin Change DP" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Coin Change DP" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Coin Change DP.', bn: 'Coin Change DP-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '41-senior-deduplicate-concurrent-checkout-idempotency': {
    id: '41-senior-deduplicate-concurrent-checkout-idempotency',
    explanation: {
      what: { en: '**Idempotent Checkout**: Store \`Idempotency-Key\` + response hash — duplicate POST returns same result.', bn: '**Idempotent Checkout**: \`Idempotency-Key\` + response hash store — duplicate POST same result।' },
      why: { en: 'Understanding idempotent checkout prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Idempotent Checkout বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Store \`Idempotency-Key\` + response hash — duplicate POST returns same result. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) \`Idempotency-Key\` + response hash store — duplicate POST same result। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Idempotent Checkout" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Idempotent Checkout" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Idempotent Checkout" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Idempotent Checkout" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
      bn: `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    },
    commonMistakes: [
      { en: 'Not stating time/space complexity for Idempotent Checkout.', bn: 'Idempotent Checkout-এ time/space complexity না বলা।' },
      { en: 'Ignoring edge cases (empty input, single element, duplicates).', bn: 'Edge case ignore (empty, single, duplicate)।' },
    ],
    bestPractices: [
      { en: 'Use meaningful variable names and small helper methods.', bn: 'Meaningful name ও ছোট helper method।' },
      { en: 'Walk through one example on the whiteboard before coding.', bn: 'Code-এর আগে whiteboard-এ example walkthrough।' },
    ],
  },

  '42-senior-sliding-window-rate-limit-in-memory-sketch': {
    id: '42-senior-sliding-window-rate-limit-in-memory-sketch',
    explanation: {
      what: { en: '**Rate Limit Sliding Window**: Per-user timestamp queue; prod uses Redis INCR + TTL or token bucket.', bn: '**Rate Limit Sliding Window**: Per-user timestamp queue; prod Redis INCR + TTL/token bucket।' },
      why: { en: 'Understanding rate limit sliding window prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.', bn: 'Rate Limit Sliding Window বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।' },
      how: { en: '1) Restate the problem. 2) Per-user timestamp queue; prod uses Redis INCR + TTL or token bucket. 3) Handle edge cases. 4) State time/space complexity.', bn: '1) Problem restate। 2) Per-user timestamp queue; prod Redis INCR + TTL/token bucket। 3) Edge case handle। 4) Time/space complexity বলুন।' },
      analogy: { en: 'Solving "Rate Limit Sliding Window" is like following a recipe card — each step has a reason, and skipping one ruins the dish.', bn: '"Rate Limit Sliding Window" = recipe card follow — এক step skip করলে result ভুল।' },
      realWorld: { en: 'In a .NET machine test, "Rate Limit Sliding Window" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.', bn: '.NET machine test-এ "Rate Limit Sliding Window" clean code, trade-off explain, edge case — sample pass মাত্র নয়।' },
    },
    comparisonTable: {
      en: `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | Queue timestamps per user — production uses Redis INCR + TTL… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`,
      bn: `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | Queue timestamps per user — production uses Redis INCR + TTL… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`,
    },
    commonMistakes: [
      { en: 'Treating rate limit sliding window as a silver bullet without measuring impact.', bn: 'Rate Limit Sliding Window measure ছাড়া silver bullet মনে করা।' },
      { en: 'Skipping documentation so the next developer repeats the same mistake.', bn: 'Documentation skip — পরের developer same mistake।' },
    ],
    bestPractices: [
      { en: 'Document trade-offs when choosing rate limit sliding window.', bn: 'Rate Limit Sliding Window বেছে নিলে trade-off document করুন।' },
      { en: 'Add tests or observability to prove the approach works under load.', bn: 'Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।' },
    ],
  },
};
export function applyBilingualPatch(section: HandbookSection, index: number): HandbookSection {
  const slug = (section.id ?? section.topic ?? section.title ?? `section-${index}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const patch =
    codingModulePatches[slug] ??
    codingModulePatches[section.id ?? ''] ??
    bilingualPatches[slug] ??
    bilingualPatches[section.id ?? ''];
  const merged: HandbookSection = patch ? { ...section, ...patch } : { ...section };

  if (!merged.explanation && (merged.english || merged.content || merged.bangla)) {
    merged.explanation = {
      summary: {
        en: merged.english ?? merged.content ?? '',
        bn: merged.bangla ?? '',
      },
    };
  }

  if (typeof merged.details === 'string' && merged.details) {
    merged.details = {
      en: merged.details,
      bn: merged.bangla ?? '',
    };
  }

  if (merged.commonMistakes?.length && typeof merged.commonMistakes[0] === 'string') {
    merged.commonMistakes = (merged.commonMistakes as string[]).map((en) => ({
      en,
      bn: '',
    }));
  }

  if (merged.bestPractices?.length && typeof merged.bestPractices[0] === 'string') {
    merged.bestPractices = (merged.bestPractices as string[]).map((en) => ({
      en,
      bn: '',
    }));
  }

  if (merged.tips?.length && typeof merged.tips[0] === 'string') {
    merged.tips = (merged.tips as string[]).map((en) => ({
      en,
      bn: '',
    }));
  }

  if (patch?.callouts) {
    merged.callouts = [...(section.callouts ?? []), ...patch.callouts];
  }

  return merged;
}
