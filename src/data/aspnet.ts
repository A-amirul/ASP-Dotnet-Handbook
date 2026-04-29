export const aspnetData = {
  id: 'aspnet',
  title: 'ASP.NET Core Architecture',
  description: 'Deep dive into the request pipeline, dependency injection, and security internals of the .NET ecosystem.',
  sections: [
    {
      topic: "Request Pipeline & Middleware",
      english: "The HTTP request pipeline consists of middleware components that process requests sequentially. Each middleware can short-circuit or delegate the request.",
      bangla: "এএসপি ডট নেট কোরে রিকোয়েস্ট যেভাবে কাজ করে সেটিই মিডলওয়্যার পাইপলাইন। এটি ‘ইনকামিং’ এবং ‘আউটগোয়িং’ দুই পথেই ডাটা প্রসেস করতে পারে।",
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
        "Difference between Use() and Run() methods?",
        "How do you share data between middleware (HttpContext.Items)?",
        "What is the significance of the order of middleware?"
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
      bangla: "ডিপেন্ডেন্সি ইনজেকশন (DI) লাইফটাইম ম্যানেজমেন্ট। ট্রানসিয়েন্ট, স্কোপড এবং সিংগেলটন লাইফটাইমগুলো না বুঝলে মেমোরি লিক এবং 'ক্যাপটিভ ডিপেন্ডেন্সি' এর মতো সিরিয়াস বাগ হতে পারে।",
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
        "What is a Captive Dependency and how do you fix it?",
        "Difference between injecting a service vs using IServiceScopeFactory?",
        "If you have a Singleton service that needs a Scoped database context, how do you handle it?"
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
      bangla: "অথেনটিকেশন এবং অথোরাইজেশন এর মধ্যে পার্থক্য। JWT একটি টোকেন বেসড সিস্টেম যা এপিআই সিকিউরিটির জন্য সবথেকে বেশি ব্যবহৃত হয়।",
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
        "How do you protect a JWT from tampering?",
        "Difference between Role-based and Policy-based Auth?",
        "What are Refresh Tokens and why are they needed?"
      ],
      practice: "Build a Policy that requires both 'Admin' role and 'EmployeeID' claim.",
      code: `services.AddAuthorization(options => {
    options.AddPolicy("SuperUser", policy => 
        policy.RequireRole("Admin").RequireClaim("EmpID"));
});`
    }
  ],
  revisionSummary: `
- **Middleware**: Pipeline order is critical (Routing -> Auth -> Endpoints).
- **DI**: Transient for utilities, Scoped for DB, Singleton for Global.
- **Security**: Use JWT for APIs, Policies for complex logic.
- **Config**: Use IOptions pattern for strongly-typed settings.
  `,
  summary: "এএসপি ডট নেট কোর আর্কিটেকচার সম্পর্কে গভীর ধারণা সরাসরি আপনার কোডিং কোয়ালিটি এবং ক্যারিয়ার গ্রোথ নিশ্চিত করে।"
};
