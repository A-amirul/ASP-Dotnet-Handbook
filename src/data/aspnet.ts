export const aspnetData = {
  id: 'aspnet',
  title: 'ASP.NET Core Architecture',
  description: 'Deep dive into the request pipeline, dependency injection, and security internals of the .NET ecosystem.',
  sections: [
    {
      topic: "Request Pipeline & Middleware",
      english: "The HTTP request pipeline consists of middleware components that process requests sequentially. Each middleware can short-circuit or delegate the request.",
      bangla: "এএসপি ডট নেট কোরে রিকোয়েস্ট যেভাবে কাজ করে সেটিই মিডলওয়্যার পাইপলাইন। এটি 'ইনকামিং' এবং 'আউটগোয়িং' দুই পথেই ডাটা প্রসেস করতে পারে।",
      details: `
| Execution Order | Component | Purpose |
| :--- | :--- | :--- |
| **1** | Exception Handler | Global error catching. |
| **2** | HSTS/HTTPS | Security enforcement. |
| **3** | Routing | Mapping URL to endpoint. |
| **4** | CORS | Domain access control. |
| **5** | Auth (AuthN/AuthZ) | Identity & Permissions. |
| **6** | Custom Middleware | Business hooks. |
      `,
      commonMistakes: [
        "Adding Authentication after Routing.",
        "Forgetting to call 'await next()'.",
        "Doing heavy IO inside a middleware synchronously."
      ],
      bestPractices: [
        "Auth should always follow Routing.",
        "Global error handling should be the first middleware.",
        "Keep middleware tiny and focused on one task."
      ],
      interviewQs: [
        {
          q: "Difference between Use() and Run() methods?",
          a: "Use() registers middleware that can optionally call await next() to pass the request downstream — it participates in the pipeline. Run() registers a terminal middleware that never calls next() — it always short-circuits and writes the response directly. Use Use() for middleware that modifies request or response and passes control on. Use Run() for a terminal fallback handler, like a catch-all 404 response at the end of the pipeline.",
          bangla: "Use() পরবর্তী middleware এ পাঠাতে পারে, Run() terminal — response সরাসরি লিখে শেষ করে, next() আর call হয় না।"
        },
        {
          q: "How do you share data between middleware (HttpContext.Items)?",
          a: "HttpContext.Items is a per-request IDictionary<object, object?> that lives for exactly one request's lifetime. Any middleware can write a value to it and any downstream middleware, filter, or controller action can read it. This is ideal for passing computed values — resolved tenant ID, extracted user context, or a correlation ID — between pipeline stages without polluting method signatures or using thread-local storage.",
          bangla: "HttpContext.Items একটি request এর মধ্যে middleware থেকে controller পর্যন্ত data শেয়ার করার জায়গা — request শেষ হলে automatically clear হয়।"
        },
        {
          q: "What is the significance of the order of middleware?",
          a: "Middleware executes in the exact order it is registered. A request enters each middleware in registration order and the response exits in reverse order (like nested wrappers). If UseAuthentication() is placed after UseAuthorization(), the identity claims are not populated when authorization checks run, causing all requests to appear anonymous. Ordering errors are silent security bugs — the app compiles and runs but authorization decisions are wrong.",
          bangla: "ভুল order silent security bug — UseAuthentication() সবসময় UseAuthorization() এর আগে হতে হবে, নইলে সব request anonymous দেখায়।"
        }
      ],
      practice: "Write a middleware that logs only the 'Authorization' header of every request.",
      code: `app.Use(async (context, next) => {
    Console.WriteLine(context.Request.Headers.Authorization);
    await next(); // Proceed to next component
});`
    },
    {
      topic: "Dependency Injection (Lifetimes) & Captive Dependency",
      english: "DI is a first-class citizen in .NET Core. Understanding Lifetimes (Transient, Scoped, Singleton) is crucial to avoid memory leaks and the 'Captive Dependency' problem.",
      bangla: "ডিপেন্ডেন্সি ইনজেকশন (DI) লাইফটাইম ম্যানেজমেন্ট। ট্রানসিয়েন্ট, স্কোপড এবং সিংগেলটন লাইফটাইমগুলো না বুঝলে মেমোরি লিক এবং 'ক্যাপটিভ ডিপেন্ডেন্সি' এর মতো সিরিয়াস বাগ হতে পারে।",
      details: `
### 1. Service Lifetimes
- **Transient**: Created every time it's requested. Best for lightweight, stateless services.
- **Scoped**: Created once per client request (HTTP request). Ideal for DbContext and Repositories.
- **Singleton**: Created once when the app starts and shared globally. Used for caching, configurations, or background tasks.

### 2. The Captive Dependency Problem
A **Captive Dependency** occurs when a service with a *longer* lifetime holds a service with a *shorter* lifetime.
- *Example*: Injecting a **Scoped** service (like DbContext) into a **Singleton** service.
- *Issue*: The Scoped service will effectively become a Singleton, staying alive as long as the Singleton does. This often causes DbContext disposal errors or stale data.

### 3. IServiceScopeFactory
When you need to use a Scoped service inside a Singleton (e.g., in a Background Task), you cannot inject it directly. Instead, use \`IServiceScopeFactory\` to create a manual scope.
      `,
      commonMistakes: [
        "Injecting a Scoped DbContext into a Singleton BackgroundService.",
        "Not disposing manual scopes created via IServiceScopeFactory.",
        "Using Scoped services in middleware without understanding that middleware are effectively Singletons (if registered as such)."
      ],
      bestPractices: [
        "Use 'ValidateScopes' in Development to catch captive dependencies early.",
        "Prefer constructor injection over manual service location (Anti-pattern).",
        "Always use the 'using' block when creating manual scopes with IServiceScopeFactory."
      ],
      interviewQs: [
        {
          q: "What is a Captive Dependency and how do you fix it?",
          a: "A Captive Dependency occurs when a longer-lived service holds a reference to a shorter-lived one. Classic example: a Singleton service injecting a Scoped DbContext — the DbContext effectively becomes Singleton-lived, causing stale change-tracking state and disposal errors across requests. Fix: inject IServiceScopeFactory into the Singleton and manually create a new scope per operation to resolve a fresh Scoped service, then dispose the scope when done.",
          bangla: "Singleton এ Scoped service inject করলে সেটি effectively Singleton হয়ে যায় — IServiceScopeFactory দিয়ে প্রতিটা operation এ fresh scope তৈরি করে সমাধান করুন।"
        },
        {
          q: "Difference between injecting a service vs using IServiceScopeFactory?",
          a: "Direct constructor injection resolves the dependency once when the consuming object is first created — the same instance is used for the lifetime of the consumer. IServiceScopeFactory.CreateScope() creates a fresh child DI scope on demand, resolving a brand new instance of Scoped services within that scope. This is the correct pattern when a Singleton-lifetime consumer needs a fresh Scoped service per operation rather than one permanently captured instance.",
          bangla: "Direct inject একবার resolve করে lifetime ধরে রাখে, IServiceScopeFactory প্রতিটা operation এ নতুন scope এ fresh instance দেয়।"
        },
        {
          q: "If you have a Singleton service that needs a Scoped database context, how do you handle it?",
          a: "Inject IServiceScopeFactory into the Singleton's constructor. Inside each operation that needs database access, call using var scope = _factory.CreateScope() then scope.ServiceProvider.GetRequiredService<AppDbContext>(). This creates a fresh scope and a fresh DbContext for that operation. Dispose the scope after the operation completes — the using block handles this automatically, ensuring the DbContext is not kept alive longer than necessary.",
          bangla: "IServiceScopeFactory inject করুন, প্রতিটা DB operation এ using var scope তৈরি করুন — using block scope dispose করবে এবং DbContext বেশিক্ষণ alive থাকবে না।"
        }
      ],
      practice: "Implement a BackgroundService (Singleton) that correctly uses a Scoped Repository to update data every minute using IServiceScopeFactory.",
      code: `// --- Registering Services ---
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddSingleton<ICacheProvider, RedisCache>();

// --- Solving Captive Dependency via IServiceScopeFactory ---
public class MyBackgroundWorker : BackgroundService {
    private readonly IServiceScopeFactory _scopeFactory;
    public MyBackgroundWorker(IServiceScopeFactory sf) => _scopeFactory = sf;

    protected override async Task ExecuteAsync(CancellationToken ct) {
        using (var scope = _scopeFactory.CreateScope()) { // Create manual scope
            var repo = scope.ServiceProvider.GetRequiredService<IUserRepository>();
            await repo.UpdateLastLoginAsync();
        }
    }
}`
    },
    {
      topic: "Authentication & Authorization (JWT)",
      english: "Authentication checks 'Who are you?', Authorization checks 'What can you do?'. JWT is the industry standard for stateless, claims-based security in APIs.",
      bangla: "অথেনটিকেশন এবং অথোরাইজেশন এর মধ্যে পার্থক্য। JWT একটি টোকেন বেসড সিস্টেম যা এপিআই সিকিউরিটির জন্য সবথেকে বেশি ব্যবহৃত হয়।",
      details: `
| Term | Meaning |
| :--- | :--- |
| **Claim** | A piece of info about the user (e.g., Email). |
| **Role** | A group the user belongs to (e.g., Admin). |
| **Policy** | Complex logic for access (e.g., Over 18 & Paid). |
      `,
      commonMistakes: [
        "Storing plain passwords (always Salt and Hash).",
        "Exposing 'Admin' claims directly without proper signing key protection.",
        "Forgetting to check 'EmailVerified' status."
      ],
      bestPractices: [
        "Use HTTPS everywhere.",
        "Implement 'Refresh Tokens' for better security/UX.",
        "Use Policy-based authorization for flexible access control."
      ],
      interviewQs: [
        {
          q: "How do you protect a JWT from tampering?",
          a: "The JWT is signed using a secret key (HMAC-SHA256) or an asymmetric key pair (RS256). The signature is computed over the header and payload. Any modification to the payload invalidates the signature — the server re-computes and compares the signature on every request. The signing key must be stored in a secrets manager (Azure Key Vault, AWS Secrets Manager) and never committed to source code or configuration files checked into source control.",
          bangla: "HMAC-SHA256 signature দিয়ে payload পরিবর্তন করলে সাথে সাথে ধরা পড়ে — signing key কখনো source control এ রাখবেন না, secrets manager ব্যবহার করুন।"
        },
        {
          q: "Difference between Role-based and Policy-based Auth?",
          a: "Role-based authorization checks group membership — [Authorize(Roles = \"Admin\")] — it is coarse-grained and works well for simple access control. Policy-based authorization evaluates custom IAuthorizationRequirement handlers that can inspect claims, resource properties, environmental conditions, or any combination. Policies are preferred for real business rules such as 'Finance managers can approve invoices above 50,000' — this kind of rule cannot be expressed with a single role name.",
          bangla: "Role একটি group এর নাম, Policy custom business logic — 'Finance manager এর 50,000+ invoice approve' এই rule একটি Role এ express করা যায় না, Policy দরকার।"
        },
        {
          q: "What are Refresh Tokens and why are they needed?",
          a: "Access tokens (JWTs) are intentionally short-lived (15-60 minutes) to limit the damage if one is stolen or leaked. A refresh token is a long-lived opaque token stored in an HTTP-only cookie that allows the client to obtain a new access token without re-authenticating. On each refresh, the server rotates the refresh token (invalidating the old one) and issues a fresh pair. This way, stealing an access token gives an attacker only a brief window rather than permanent access.",
          bangla: "Access token ছোট আয়ু (15-60 মিনিট), Refresh token দিয়ে নতুন access token নেওয়া যায় — প্রতিবার rotate করলে চুরি হলেও attacker এর সুযোগ সীমিত।"
        }
      ],
      practice: "Build a Policy that requires both 'Admin' role and 'EmployeeID' claim.",
      code: `services.AddAuthorization(options => {
    options.AddPolicy("SuperUser", policy =>
        policy.RequireRole("Admin").RequireClaim("EmpID"));
});`
    },
    {
      topic: "Request Lifecycle, HttpClientFactory, Options, Minimal APIs",
      difficulty: 'senior',
      english: "A request hits Kestrel, then middleware (exception handler, HTTPS, routing, CORS, auth), then endpoint (controller or minimal API), then model binding and filters, then your service, then repository/DbContext, then SQL, then the response travels back out through middleware. HttpClientFactory prevents socket exhaustion. The Options pattern binds configuration with validation. Minimal APIs are first-class for small services; controllers still win for large filter/convention-heavy APIs.",
      bangla: 'ক্লায়েন্ট → মিডলওয়্যার → রাউটিং → কন্ট্রোলার → সার্ভিস → রেপো → ডিবি → রেসপন্স। HttpClient সরাসরি new করবেন না।',
      details: `
### Lifecycle
Client → Kestrel → Middleware → Routing → AuthN/AuthZ → Model bind/validate → Filters → Controller/Minimal API → Application service → EF/Dapper → SQL Server → serialize → middleware outbound → client

### Also required in interviews
- IHttpClientFactory + named/typed clients + Polly (timeout, retry, circuit breaker)
- IOptions / IOptionsSnapshot / IOptionsMonitor
- Health checks, rate limiting, output caching, response compression
- Global exception middleware → ProblemDetails
- Environments + user secrets + Key Vault — never secrets in appsettings committed to git
      `,
      commonMistakes: [
        'new HttpClient() per request — ephemeral port exhaustion.',
        'Singleton IOptionsSnapshot misuse; or injecting IConfiguration everywhere instead of Options.',
        'Putting business logic in middleware that should be a service.',
      ],
      bestPractices: [
        'Typed HttpClient with BaseAddress and resilience pipeline.',
        'Validate options on startup so the app fails fast.',
        'Health checks for DB, Redis, and downstream HTTP.',
      ],
      interviewQs: [
        {
          q: 'Walk through an ASP.NET Core request from socket to SQL and back.',
          a: 'Kestrel accepts TCP/HTTP. The middleware pipeline runs inbound. UseRouting matches an endpoint. Authentication sets User. Authorization may challenge. Model binding fills parameters; validation may return 400. Action filters run. The action calls a scoped service which uses a scoped DbContext. SQL runs. The action result serializes JSON. Middleware runs outbound (including exception handler if something threw). Connection is returned to the pool when the scope disposes DbContext.',
          bangla: 'Kestrel → middleware → routing → auth → bind → action → service → DbContext → SQL → JSON → outbound middleware।',
          followUp: 'Where would you add correlation IDs?',
          difficulty: 'senior',
        },
        {
          q: 'Why is IHttpClientFactory mandatory in production?',
          a: 'HttpClient is designed to be long-lived. Disposing per request leaves sockets in TIME_WAIT. A static HttpClient never picks up DNS changes. IHttpClientFactory pools handlers, rotates them to refresh DNS, and integrates with typed clients and Polly. Seniors mention this as a real outage class, not a style preference.',
          bangla: 'প্রতি রিকোয়েস্টে new HttpClient সকেট ফুরায়। Factory হ্যান্ডলার পুল করে।',
          difficulty: 'senior',
        },
      ],
      practice: 'Register a typed GitHubClient with a 3-second timeout and a circuit breaker.',
      code: `builder.Services.AddHttpClient<IGitHubClient, GitHubClient>(c =>
{
    c.BaseAddress = new Uri("https://api.github.com/");
    c.Timeout = TimeSpan.FromSeconds(3);
});

builder.Services.AddOptions<JwtOptions>()
    .BindConfiguration("Jwt")
    .ValidateDataAnnotations()
    .ValidateOnStart();`,
    }
  ],
  quickRevision: {
    concepts: [
      'Middleware order is a security feature',
      'Use vs Run vs Map',
      'Captive dependency',
      'JWT + refresh rotation',
      'Policies vs roles',
      'HttpClientFactory',
      'Options pattern',
      'ProblemDetails',
      'Scoped DbContext',
      'Health checks',
    ],
    questions: [
      'Use vs Run?',
      'Why not Singleton DbContext?',
      'Pipeline order for Auth?',
      'Refresh tokens why?',
      'HttpClientFactory why?',
      'IOptions vs IOptionsMonitor?',
      'Minimal APIs vs controllers?',
      'Where do correlation IDs go?',
      'How do you handle global exceptions?',
      'How do you keep secrets out of git?',
    ],
    mistakes: [
      'Authentication after MapControllers',
      'new HttpClient per call',
      'Singleton depending on Scoped',
      'Secrets in appsettings.json',
      'Business logic in middleware',
    ],
    scenarios: [
      'All requests anonymous in production — pipeline order',
      'SNAT / socket exhaustion',
      'JWT valid but policy fails',
      'Config works locally, fails in Azure',
      'Downstream API timeout cascades',
    ],
  },
  revisionSummary: `
- **Middleware**: Pipeline order is critical (Routing -> Auth -> Endpoints).
- **DI**: Transient for utilities, Scoped for DB, Singleton for Global.
- **Security**: Use JWT for APIs, Policies for complex logic.
- **Config**: Use IOptions pattern for strongly-typed settings.
- **HTTP**: IHttpClientFactory + timeouts; never new HttpClient per request.
  `,
  summary: "এএসপি ডট নেট কোর আর্কিটেকচার সম্পর্কে গভীর ধারণা সরাসরি আপনার কোডিং কোয়ালিটি এবং ক্যারিয়ার গ্রোথ নিশ্চিত করে।"
};
