export const mvcoreData = {
  title: 'ASP.NET MVC / ASP.NET Core Interview Mastery',
  description: 'Complete interview-focused guide for ASP.NET MVC and ASP.NET Core architecture, security, and API readiness.',
  sections: [
    {
      topic: 'MVC Lifecycle + Middleware Pipeline + Routing',
      english: 'ASP.NET Core request processing starts from Kestrel, passes through middleware, then routing selects endpoint/controller action. In MVC, the flow includes model binding, action execution, result execution, and response write-back. Understand the exact order because interviewers often ask where authentication, exception handling, and logging happen.',
      bangla: 'ASP.NET Core এ রিকোয়েস্ট প্রথমে সার্ভারে আসে, তারপর Middleware Pipeline দিয়ে যায়, এরপর Routing ঠিক করে কোন Controller/Action চলবে। MVC লাইফসাইকেলের মধ্যে Model Binding, Action Execution, Result Execution থাকে। ইন্টারভিউতে সাধারণত জিজ্ঞেস করে কোন স্টেপে Auth, Validation, Exception Handling হয়।',
      details: `
### Architecture Flow (High Level)
1. **Client Request** -> **Kestrel/IIS Reverse Proxy**
2. **Middleware Pipeline** (\`UseExceptionHandler\` -> \`UseRouting\` -> \`UseAuthentication\` -> \`UseAuthorization\` -> \`MapControllers/MapRazorPages\`)
3. **Routing Match** (Conventional or Attribute)
4. **Model Binding + Validation**
5. **Filters** (Authorization -> Resource -> Action -> Exception -> Result)
6. **Controller/Action বা Razor Page Handler Execute**
7. **Response Serialization / View Rendering**

### Conventional vs Attribute Routing
| Type | Example | Best Use Case |
| :--- | :--- | :--- |
| **Conventional** | \`{controller=Home}/{action=Index}/{id?}\` | Traditional MVC apps |
| **Attribute** | \`[Route("api/v1/orders/{id}")]\` | API-first, explicit endpoint design |

### Interview Scenario
- "Order API endpoint returning 404 in production but works locally."  
  Check: route template mismatch, \`MapControllers()\` missing, environment-specific path base.
      `,
      commonMistakes: [
        'Putting UseAuthentication() after endpoint mapping, causing anonymous user context.',
        'Mixing route tokens incorrectly in attribute templates.',
        'Assuming middleware order does not matter.'
      ],
      bestPractices: [
        'Keep pipeline order explicit and minimal.',
        'Use attribute routing for APIs and conventional for classic MVC when helpful.',
        'Document endpoint contracts with clear versioned paths.'
      ],
      interviewQs: [
        'Explain complete request flow from middleware to action result.',
        'Why does middleware ordering matter in ASP.NET Core?',
        'When do you choose conventional routing over attribute routing?'
      ],
      practice: 'Design pipeline order for a secure API with global exception handling, JWT auth, and CORS.',
      code: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

var app = builder.Build();
app.UseExceptionHandler("/Home/Error");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapControllers();
app.Run();`
    },
    {
      topic: 'Filters + Model Binding + Validation',
      english: 'Filters provide cross-cutting hooks around MVC execution. Model binding maps request data (route, query, form, body) to action parameters. Validation uses DataAnnotations and ModelState. In APIs, [ApiController] auto-validates and returns 400 with validation details.',
      bangla: 'Filters দিয়ে Action এর আগে/পরে common logic বসানো যায় (যেমন logging, authorization)। Model Binding request থেকে data নিয়ে method parameter এ বসায়। Validation এর জন্য DataAnnotation এবং ModelState ব্যবহার হয়। [ApiController] থাকলে invalid model এ automatic 400 return করে।',
      details: `
### Filter Execution Order
1. **Authorization Filter**
2. **Resource Filter**
3. **Action Filter**
4. **Exception Filter** (on exceptions)
5. **Result Filter**

### Practical Interview Scenario
- "You need to log execution time for every API action without duplicating code."  
  Use a custom **Action Filter** or middleware depending on needed context.

### Validation Strategy
- DTO-level validation with attributes like \`[Required]\`, \`[StringLength]\`
- Custom validation via \`IValidatableObject\` for cross-field rules
- Return consistent \`ValidationProblemDetails\` payload
      `,
      commonMistakes: [
        'Using entity models directly in APIs instead of DTOs.',
        'Ignoring ModelState.IsValid in non-ApiController endpoints.',
        'Putting business validation only in controller actions.'
      ],
      bestPractices: [
        'Use DTOs and FluentValidation or DataAnnotations for clean contracts.',
        'Centralize repeated concerns with filters.',
        'Keep domain validation in service/domain layer for consistency.'
      ],
      interviewQs: [
        'Difference between model binding and model validation?',
        'When should you use a filter vs middleware?',
        'How does [ApiController] improve validation behavior?'
      ],
      practice: 'Implement a custom ActionFilter that rejects requests if a required header is missing.',
      code: `public class RequireTenantHeaderFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.HttpContext.Request.Headers.ContainsKey("X-Tenant-Id"))
            context.Result = new BadRequestObjectResult("Missing X-Tenant-Id");
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}`
    },
    {
      topic: 'MVC vs Razor Pages vs Web API + State Management',
      english: 'MVC fits complex UI with controllers/views. Razor Pages is page-focused and simpler for CRUD. Web API is best for client-server decoupled apps and mobile/SPA backends. For state, ViewBag/ViewData are short-lived per request, TempData survives one redirect, Session persists per user session.',
      bangla: 'MVC বড় UI driven অ্যাপের জন্য ভালো। Razor Pages ছোট/মাঝারি page-centric ফিচারে দ্রুত কাজ দেয়। Web API মোবাইল/SPA/backend integration এর জন্য best। ViewBag/ViewData শুধু current request এ থাকে, TempData redirect পর্যন্ত থাকে, Session user session জুড়ে থাকে।',
      details: `
### Selection Guide
| Option | Choose When | Avoid When |
| :--- | :--- | :--- |
| **MVC** | Complex workflows, multiple reusable views | Very simple pages only |
| **Razor Pages** | Page-centric CRUD modules | Heavy API integrations |
| **Web API** | SPA/mobile/microservices backend | Server-rendered HTML needed |

### Practical Interview Scenario
- "You are building Admin Panel + Mobile App backend."
  - Admin UI -> **MVC or Razor Pages**
  - Mobile backend -> **Web API**
  - Shared business logic -> service layer

### State Management Quick Notes
- **ViewBag/ViewData**: request scope only
- **TempData**: next request (usually redirects)
- **Session**: server-side user state, use sparingly
      `,
      commonMistakes: [
        'Storing large objects in Session causing memory pressure.',
        'Using ViewBag for strongly typed critical data.',
        'Choosing MVC for API-only projects.'
      ],
      bestPractices: [
        'Use ViewModel for strongly typed views.',
        'Prefer stateless APIs; use session only when required.',
        'Keep UI concerns and API concerns separated.'
      ],
      interviewQs: [
        'Razor Pages vs MVC: real project decision criteria?',
        'TempData vs Session differences?',
        'When will Web API be a better fit than MVC?'
      ],
      practice: 'Refactor an MVC form flow to use TempData for PRG (Post-Redirect-Get) success messages.',
      code: `TempData["SuccessMessage"] = "Order created successfully";
return RedirectToAction("Details", new { id = order.Id });

// In target action/view:
// var msg = TempData["SuccessMessage"]?.ToString();`
    },
    {
      topic: 'Authentication, Authorization, Claims, Roles, Policies',
      english: 'Authentication verifies identity; authorization checks permissions. Claims-based identity is central in ASP.NET Core. Roles are coarse-grained, policies are flexible and preferred for business rules. Use [Authorize] with policy names for readable security.',
      bangla: 'Authentication বলে user কে, আর Authorization বলে user কী করতে পারবে। Claims হচ্ছে user info/permission token। Roles সাধারণ permission group, Policies আরো flexible এবং enterprise app এ বেশি ব্যবহার হয়।',
      details: `
### Security Model
- **Authentication**: Who are you?
- **Authorization**: What can you do?
- **Claims**: key-value identity facts (\`department=Finance\`, \`scope=orders.read\`)
- **Roles**: grouped permissions (\`Admin\`, \`Manager\`)
- **Policies**: rule-based access requirements

### Practical Interview Scenario
- "Only Finance managers can approve invoices above 50,000."
  Implement a custom policy with claim + threshold requirement handler.
      `,
      commonMistakes: [
        'Using roles for every fine-grained rule, causing role explosion.',
        'Relying only on UI hiding instead of backend authorization checks.',
        'Forgetting to protect newly added endpoints with [Authorize].'
      ],
      bestPractices: [
        'Use policy-based auth for business rules.',
        'Centralize security constants and policy names.',
        'Audit claims issuance source and token lifetime.'
      ],
      interviewQs: [
        'Claims-based authorization কীভাবে roles থেকে আলাদা?',
        'How do custom policy handlers work?',
        'Difference between [AllowAnonymous] and missing [Authorize]?'
      ],
      practice: 'Create a policy requiring both role Admin and claim country=BD.',
      code: `builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("BangladeshAdmin", policy =>
        policy.RequireRole("Admin")
              .RequireClaim("country", "BD"));
});

[Authorize(Policy = "BangladeshAdmin")]
public IActionResult SecureDashboard() => View();`
    },
    {
      topic: 'JWT Auth, Cookie Auth, Identity Framework, CORS, Versioning',
      english: 'JWT is ideal for stateless APIs and distributed systems. Cookie auth is common for browser-based MVC apps. ASP.NET Core Identity provides user management, hashing, lockout, and token workflows. CORS controls cross-origin access. API versioning prevents client breakage when contracts evolve.',
      bangla: 'JWT সাধারণত API/SPA/mobile এর জন্য best কারণ এটি stateless। Cookie auth server-rendered MVC এর জন্য natural choice। Identity Framework দিয়ে user, role, password hash, email confirmation সহজে করা যায়। CORS cross-origin control করে এবং API Versioning backward compatibility বজায় রাখে।',
      details: `
### JWT vs Cookie
| Area | JWT | Cookie |
| :--- | :--- | :--- |
| Best For | SPA/Mobile/API | MVC server-rendered apps |
| Storage | Client storage | Browser cookie |
| Server Session | Usually stateless | Can be stateful |

### Global Exception Handling + Logging + Config
- Use centralized exception middleware for consistent error response.
- Configure structured logging (Serilog/NLog) with correlation IDs.
- Load config from \`appsettings.json\`, environment files, and secrets.
- Use \`appsettings.Development.json\` / \`appsettings.Production.json\`.

### Practical Interview Scenario
- "Production API started failing for v1 mobile clients after deploying v2 changes."
  Use API versioning package, keep v1 controller untouched, deprecate gradually.
      `,
      commonMistakes: [
        'Allowing wildcard CORS with credentials.',
        'Keeping JWT signing keys in source control.',
        'Breaking existing APIs without version negotiation.'
      ],
      bestPractices: [
        'Use HTTPS-only, secure cookies, and short-lived JWT + refresh flow.',
        'Adopt Serilog/NLog structured logs with environment enrichment.',
        'Separate configuration by environment and validate required settings at startup.'
      ],
      interviewQs: [
        'JWT vs Cookie Auth: which one and why?',
        'How does ASP.NET Core Identity integrate with JWT?',
        'How do you enable API versioning without breaking old clients?'
      ],
      practice: 'Set up two API versions (v1 and v2) and mark v1 as deprecated in Swagger.',
      code: `builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendApp", policy =>
        policy.WithOrigins("https://app.example.com")
              .AllowAnyHeader()
              .AllowAnyMethod());
});`
    }
  ],
  revisionSummary: `
- **Pipeline First**: Middleware order + routing decide everything downstream.
- **MVC Internals**: Binding, validation, filters, and action execution flow must be clear.
- **Security**: Prefer policy-based auth; choose JWT or Cookie based on client type.
- **Production Readiness**: Global exception handling, logging, CORS, configuration, versioning.
- **Interview Edge**: Explain architecture with scenarios, not only definitions.
  `,
  summary: 'ASP.NET Core interview এ সফল হতে হলে শুধু framework feature না, end-to-end request flow, security model, configuration strategy, এবং real-world failure handling ব্যাখ্যা করতে পারা জরুরি।'
};
