export const devopsData = {
  id: 'devops',
  title: 'DevOps & Cloud Deployment',
  description: 'Learn how to containerize, automate, and deploy .NET applications to professional cloud environments.',
  sections: [
    {
      topic: "Docker & Containerization",
      english: "Docker packages the app with all its dependencies. Senior developers must know how to write multi-stage Dockerfiles to keep production images slim and secure.",
      bangla: "ডকার শিখলে 'আমার পিসিতে চলে কিন্তু সার্ভারে চলে না' - এই চিরচেনা সমস্যা সমাধান হয়। মাল্টি-স্টেজ বিল্ড ব্যবহার করলে ইমেজ সাইজ অনেক ছোট হয়।",
      details: `
| Stage | Image | Purpose |
| :--- | :--- | :--- |
| **base** | aspnet | Final lightweight image for running the app. |
| **build** | sdk | Heavy image with full SDK for compiling source. |
| **publish** | sdk | Optimized build output. |
| **final** | aspnet | Production-ready image with zero source code. |
      `,
      commonMistakes: [
        "Using the full SDK image in production (huge security risk).",
        "Forgetting .dockerignore (bundling node_modules or secrets).",
        "Hardcoding connection strings inside the Image."
      ],
      bestPractices: [
        "Always use multi-stage builds.",
        "Use Alpine/Chiseled images for minimal attack surface.",
        "Pass configurations via Environment Variables or Mounts."
      ],
      interviewQs: [
        {
          q: "What is a multi-stage Dockerfile and why use it?",
          a: "Multi-stage builds use multiple FROM instructions in one Dockerfile. The first stage uses the full SDK image to compile the application. A subsequent stage copies only the compiled output (the published DLL and assets) into a minimal runtime image (aspnet:alpine or chiseled). The final image contains zero source code, no build tools, and no SDK — typically 5-10x smaller than a single-stage build. This reduces attack surface, speeds up image pulls, and prevents source code leaks in production containers.",
          bangla: "First stage SDK image দিয়ে compile, final stage শুধু runtime image — source code production image এ থাকে না, 5-10x ছোট, attack surface কম।"
        },
        {
          q: "Difference between 'docker build' and 'docker run'?",
          a: "docker build reads the Dockerfile and creates an immutable, layered image — it is the compile step. Each instruction produces a cached layer, so unchanged layers are reused on subsequent builds. docker run creates a live container (a running instance) from that image — it is the execution step. Images are stored in registries (Docker Hub, Azure Container Registry). You build once and run many times. Containers are ephemeral and disposable; the image is the durable artifact.",
          bangla: "build immutable image তৈরি করে (compile step), run সেই image থেকে live container চালু করে (execution step) — image durable, container ephemeral।"
        },
        {
          q: "How do you handle sensitive secrets in Docker?",
          a: "Never hardcode secrets in Dockerfile ENV instructions or docker-compose.yml files committed to source control. Production options: (1) Environment variables injected at runtime from a secrets manager (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault). (2) Docker Secrets in Swarm mode — secrets are mounted as read-only files at /run/secrets/ inside the container. (3) Kubernetes Secrets mounted as volumes. Exclude .env files from git via .gitignore and never build them into images.",
          bangla: "ENV instruction বা docker-compose এ secrets hardcode করবেন না — Azure Key Vault বা Kubernetes Secrets দিয়ে runtime inject করুন।"
        }
      ],
      practice: "Optimize a 600MB Docker image down to 80MB using .NET Alpine images.",
      code: `FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet", "MyApi.dll"]`
    },
    {
      topic: "CI/CD & Automation",
      english: "Continuous Integration (CI) automates builds and tests. Continuous Deployment (CD) automates the release. Git actions or Azure DevOps are the industry standard.",
      bangla: "সিআই/সিডি পাইপলাইন ছাড়া বড় প্রজেক্ট মেইনটেইন করা অসম্ভব। এটি প্রতিটা কোড চেঞ্জে অটোমেটিক বিল্ড এবং টেস্ট নিশ্চিত করে।",
      commonMistakes: [
        "Manual deployment of DLLs to the server.",
        "Storing secrets in plain text in YAML files.",
        "Skipping unit tests in the CI pipeline."
      ],
      bestPractices: [
        "Run unit tests on every Pull Request.",
        "Use 'Secrets' management for API keys.",
        "Implement 'Blue-Green' deployment for zero downtime."
      ],
      interviewQs: [
        {
          q: "Explain CI vs CD.",
          a: "CI (Continuous Integration) runs on every commit — it builds the code, runs unit and integration tests, runs linters, and reports failures immediately so the team knows within minutes if a commit broke something. CD (Continuous Delivery) automatically packages the built artifact and deploys to a staging environment after CI passes. Continuous Deployment extends this further by automatically deploying to production on a successful pipeline run, with no manual gate. CI catches integration bugs early; CD eliminates manual deployment steps and human error.",
          bangla: "CI প্রতি commit এ build + test, CD successful CI এর পর auto deploy — manual deployment এর যুগ শেষ, human error কমে।"
        },
        {
          q: "What are 'GitHub Actions' and how do they work?",
          a: "GitHub Actions is a CI/CD platform built into GitHub. Workflows are YAML files in .github/workflows/ that define triggers (on: push, on: pull_request), jobs (groups of steps running on a runner), and steps (individual shell commands or reusable Actions from the marketplace). Runners are hosted VMs (ubuntu-latest, windows-latest) or self-hosted machines. Secrets are encrypted and stored in GitHub Settings, injected as environment variables at runtime. Actions are composable — you chain build, test, and deploy steps in one workflow file.",
          bangla: ".github/workflows/ YAML file এ trigger, jobs, steps define করুন — secrets encrypted, marketplace action reuse করুন।"
        },
        {
          q: "How do you ensure zero-downtime during deployment?",
          a: "Blue-Green deployment: maintain two identical production environments. Deploy to the idle environment (green), run smoke tests, then switch the load balancer or DNS to green. If issues arise, switch back to blue in seconds. Rolling deployment: incrementally replace instances one by one, keeping a percentage always serving live traffic. In Kubernetes, RollingUpdate strategy handles this automatically via maxUnavailable and maxSurge settings. Health checks on /health endpoints ensure traffic is only routed to fully started instances.",
          bangla: "Blue-Green: idle environment এ deploy করে load balancer switch — সমস্যা হলে seconds এ rollback। Kubernetes RollingUpdate automatically করে।"
        }
      ],
      practice: "Create a simple GitHub Action YAML that runs 'dotnet test' on every push.",
      code: `name: Build & Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: dotnet test --configuration Release`
    },
    {
      topic: "Azure for .NET Architects",
      difficulty: 'expert',
      english: "Seniors design on Azure with identity and operations first: App Service or Container Apps for compute, Azure SQL for relational data, Blob for files, Redis for shared cache, Service Bus for commands/queues, Functions for event glue, Key Vault + Managed Identity instead of connection strings in config, Application Insights for traces/metrics. AKS is for teams that already need Kubernetes — not a default.",
      bangla: 'অ্যাজুরে Managed Identity ও Key Vault দিয়ে সিক্রেট সরান। App Insights ছাড়া প্রোডাকশন ডিবাগ অন্ধ। AKS ডিফল্ট নয়।',
      details: `
| Need | Typical Azure choice | Senior note |
| :--- | :--- | :--- |
| HTTP API | App Service / Container Apps | Start here |
| SQL | Azure SQL + elastic pool | Watch DTU/vCore and DTU throttling |
| Files | Blob + CDN | SAS vs Managed Identity |
| Cache | Azure Cache for Redis | Still handle stampede in app |
| Messaging | Service Bus | Sessions for ordering; vs Event Hubs/Kafka |
| Secrets | Key Vault | Never store secrets in App Settings long-term |
| Observability | App Insights + Log Analytics | Correlation across services |
| APIs | API Management | Rate limit, JWT, versioning at edge |
      `,
      commonMistakes: [
        'Connection strings in source control or plain App Settings forever.',
        'Choosing AKS for a 2-service app.',
        'No health probes — deployments kill in-flight requests.',
      ],
      bestPractices: [
        'Managed Identity to SQL, Blob, Key Vault.',
        'Slot swaps / blue-green with warm-up.',
        'Budget alerts and throttling dashboards.',
      ],
      interviewQs: [
        {
          q: 'How would you store SQL credentials for an App Service?',
          a: 'Prefer Managed Identity and Azure AD auth to SQL so there is no password. If a secret is required, Key Vault references in App Settings, identity granted Get on the vault. Rotate. Never bake secrets into the image. Locally use user-secrets or a dev Key Vault.',
          bangla: 'Managed Identity সেরা। পাসওয়ার্ড লাগলে Key Vault + identity।',
          difficulty: 'senior',
        },
      ],
      practice: 'Sketch an architecture: API on Container Apps, SQL, Redis, Service Bus, Key Vault, App Insights.',
      code: `// Program.cs — DefaultAzureCredential for Key Vault / SQL
builder.Configuration.AddAzureKeyVault(
    new Uri(builder.Configuration["KeyVault:Uri"]!),
    new DefaultAzureCredential());`,
    },
    {
      topic: "Git for Senior Engineers",
      difficulty: 'mid',
      english: 'Seniors treat Git as a communication tool. Trunk-based development with short-lived branches is the default for continuous delivery. Git Flow is heavier and fits release trains. Rebase to keep a reviewable history on your branch; do not rebase shared main. Revert is the safe undo on main. Reset --hard is local only. PRs need a review checklist: correctness, tests, observability, security, rollback.',
      bangla: 'মেইনে rebase নয়। ভুল ডিপ্লয় হলে revert. PR মানে রিভিউ চেকলিস্ট — শুধু ডিফ নয়।',
      details: `
| Command | Use | Danger |
| :--- | :--- | :--- |
| merge | Integrate | Extra merge commits |
| rebase | Clean local history | Rewriting shared history |
| cherry-pick | Hotfix one commit | Duplicate commits |
| revert | Undo on main | Safe, adds a commit |
| reset | Move HEAD locally | --hard loses uncommitted work |
| squash | One commit per PR | Hides intermediate history |
      `,
      commonMistakes: [
        'Force-pushing main.',
        'Giant PRs that cannot be reviewed.',
        'Committing secrets, then "deleting" them in a later commit (still in history).',
      ],
      bestPractices: [
        'Small PRs, conventional commits or a clear why-message.',
        'Protected main: CI required, no direct push.',
        'Code review: ask about failure modes, not only style.',
      ],
      interviewQs: [
        {
          q: 'A bad commit is already on main in production. Reset or revert?',
          a: 'Revert. Main is shared; reset rewrites history and breaks every clone. Revert adds a compensating commit, CI runs, deploy is a forward move. Reset --hard is for unpushed local work only.',
          bangla: 'প্রোডাকশন মেইনে revert। reset শুধু লোকাল আনপুশড কাজের জন্য।',
          difficulty: 'senior',
        },
      ],
      practice: 'Write a PR description template: intent, risk, rollback, test evidence.',
      code: `# git
# feature branch: rebase onto origin/main locally
# main: merge --no-ff or squash merge via PR
# incident: git revert <sha> && git push`,
    }
  ],
  revisionSummary: `
- **Docker**: Slim images = faster deployment + better security.
- **CI/CD**: Automate everything; manual is the enemy of stability.
- **Monitoring**: Use health checks (/health) for reliable hosting.
- **Azure**: Managed Identity + Key Vault + App Insights.
- **Git**: Revert on main; never rewrite shared history.
  `,
  summary: "আধুনিক .NET অ্যাপ্লিকেশনকে প্রফেশনালি রান করতে ডকার এবং CI/CD এর ওপর দখল থাকা এখন বাধ্যতামূলক।"
};

export const frontendData = {
  id: 'frontend',
  title: "Frontend Knowledge for .NET",
  description: "Bridging the gap between the .NET backend and modern SPA frameworks like React/Angular.",
  sections: [
    {
      topic: "JSON Standards & ProblemDetails",
      english: "API contracts must be consistent. JavaScript standard is camelCase (id, firstName) while C# is PascalCase (Id, FirstName). Consistent error reporting is vital.",
      bangla: "ফ্রন্টএন্ডের সাথে ব্যাকএন্ডের মিল রাখার জন্য জেসন ফরম্যাট (camelCase) এবং এরর হ্যান্ডলিং (ProblemDetails) জানা জরুরি।",
      commonMistakes: [
        "Returning PascalCase in JSON (hard for JS/TS to map).",
        "Inconsistent error objects across different controllers.",
        "Returning 200 for business-logic failures."
      ],
      bestPractices: [
        "Use System.Text.Json naming policy to ensure camelCase.",
        "Implement RFC 7807 (ProblemDetails) for API errors.",
        "Validate inputs on both Client and Server side."
      ],
      interviewQs: [
        {
          q: "Difference between camelCase and PascalCase?",
          a: "PascalCase capitalizes the first letter of every word: FirstName, OrderId, IsActive — the C# convention for properties and classes. camelCase capitalizes every word except the first: firstName, orderId, isActive — the JavaScript and TypeScript convention for object properties. JSON consumed by web clients should use camelCase for native compatibility. ASP.NET Core configures this globally with JsonNamingPolicy.CamelCase in AddJsonOptions, ensuring all serialized responses follow the JS convention without manual attribute decoration on every property.",
          bangla: "C# PascalCase (FirstName), JavaScript camelCase (firstName) — JsonNamingPolicy.CamelCase globally configure করুন, JS client automatically compatible হবে।"
        },
        {
          q: "What is the 'ProblemDetails' format?",
          a: "RFC 7807 ProblemDetails is a standardized JSON error response with fields: type (a URI identifying the error category), title (a short human-readable summary), status (the HTTP status code), detail (an explanation specific to this occurrence), and instance (a URI identifying this specific error event). ASP.NET Core produces this natively when [ApiController] is applied. ValidationProblemDetails extends it with an errors dictionary mapping field names to validation messages. Consistent error structure across all endpoints makes client-side error handling predictable and uniform.",
          bangla: "type, title, status, detail, instance — consistent error structure যা সব controller এ একরকম, client predictably handle করতে পারে।"
        },
        {
          q: "How to handle JSON circular reference errors?",
          a: "Circular references occur when entity A has a navigation property to B and B has one back to A — the serializer loops infinitely. Solutions: (1) Use DTOs or projections that exclude navigation properties — the preferred approach as it also prevents over-fetching. (2) Configure ReferenceHandler.Preserve in JsonSerializerOptions — adds dollar-id and dollar-ref annotation metadata to break cycles, but produces non-standard JSON. (3) Apply [JsonIgnore] on the back-reference navigation property to exclude it from serialization entirely.",
          bangla: "DTO use করুন navigation property exclude করে — ReferenceHandler.Preserve non-standard JSON তৈরি করে, [JsonIgnore] সহজ সমাধান।"
        }
      ],
      practice: "Configure the JSON Serializer in Program.cs for standard web compliance.",
      code: `builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });`
    }
  ],
  revisionSummary: `
- **Format**: Always camelCase for JSON.
- **Errors**: Follow RFC standards for error bodies.
- **Integration**: Understand how JWT is stored in frontend (localStorage vs Cookie).
  `,
  summary: "ফ্রন্টএন্ডের বেসিক ধারণা আপনার ব্যাকএন্ড এপিআই ডিজাইনকে অনেক বেশি ইউজার-ফ্রেন্ডলি করে তোলে।"
};

export const systemDesignData = {
  id: 'systemdesign',
  title: "System Design & Architecture",
  description: "Scaling applications beyond a single server and architecting robust distributed systems.",
  sections: [
    {
      topic: "Monolith vs Microservices",
      english: "Microservices allow independent scaling but introduce network overhead and complexity. Monoliths are simpler but harder to scale vertically.",
      bangla: "মাইক্রোসার্ভিস মানেই অনেকগুলো ছোট সার্ভিস যা নেটওয়ার্কের মাধ্যমে একে অপরের সাথে কথা বলে। তবে ছোট টীমের জন্য মনোলিথই ভালো।",
      details: `
| Feature | Monolith | Microservices |
| :--- | :--- | :--- |
| **Complexity** | Low | High |
| **Scaling** | Scale the whole app | Scale specific service |
| **Database** | Single Shared DB | Database per service |
      `,
      commonMistakes: [
        "Shared Database across microservices (it's a distributed monolith).",
        "Building microservices too early for a small project.",
        "Ignoring network latency in distributed calls."
      ],
      bestPractices: [
        "Use Bounded Contexts to define service boundaries.",
        "Implement an API Gateway for routing.",
        "Use asynchronous communication (RabbitMQ) for non-critical flows."
      ],
      interviewQs: [
        {
          q: "When would you NOT choose microservices?",
          a: "When the team is small (under 10 engineers), when domain boundaries are not yet clearly understood, when building an MVP or validating a product idea, or when the team lacks operational maturity for distributed systems (no observability stack, no distributed tracing, no service mesh experience). Microservices multiply operational complexity — you trade code simplicity for deployment flexibility. The guidance is to start with a well-structured modular monolith and extract services only when specific scaling or team autonomy pressure demands it.",
          bangla: "Small team, unclear boundaries, MVP stage — modular monolith দিয়ে শুরু করুন, পরে scaling pressure এলে তখন extract করুন।"
        },
        {
          q: "What is the 'Service Discovery' pattern?",
          a: "Service Discovery allows services to find each other at runtime without hardcoded addresses, which is essential when containers start with dynamic IPs. Client-side discovery: the client queries a service registry (Consul, Eureka) and selects an instance using a load-balancing strategy. Server-side discovery: the client calls a load balancer that queries the registry transparently. In Kubernetes, service discovery is built-in via kube-dns — services are addressable by their service name within the cluster, and the platform handles IP resolution as pods come and go.",
          bangla: "Container dynamic IP তে শুরু হয় — Consul/Eureka registry বা Kubernetes built-in kube-dns দিয়ে runtime এ service address খোঁজা হয়।"
        },
        {
          q: "Explain 'Database per Service' constraint.",
          a: "In a microservices architecture, each service owns its own data store exclusively — no other service directly queries or writes to another service's database. Cross-service data access goes through the owning service's published API or through async events on a message bus. This constraint enforces true service independence, allows each service to choose its optimal storage technology, and prevents tight coupling through shared database schemas — the root cause of most distributed monolith failures where services cannot be deployed independently.",
          bangla: "প্রতিটা service তার নিজস্ব database owner — cross-service data API বা message bus এর মাধ্যমে, shared schema tight coupling তৈরি করে।"
        }
      ],
      practice: "Design an E-commerce system where 'Order' and 'Inventory' are separate microservices.",
      code: `// RabbitMQ Message Producer
var message = new OrderCreated { Id = 123 };
await _publishEndpoint.Publish(message);`
    },
    {
      topic: "Caching Patterns & Redis",
      english: "Caching reduces DB pressure. Cache-Aside is the most popular pattern where the app manages the cache interaction.",
      bangla: "রেডিস ক্যাশিং ব্যবহার করলে ডাটাবেজের ওপর চাপ কমে। ক্যাশ-অ্যাসাইড প্যাটার্নে প্রথমে ক্যাশে ডাটা চেক করা হয়, না থাকলে ডিবি থেকে আনা হয়।",
      commonMistakes: [
        "Cache stampede: High traffic hitting DB when cache expires.",
        "Forgetting TTL (Time To Live), leading to stale (old) data.",
        "Caching sensitive data without encryption/security."
      ],
      bestPractices: [
        "Always set an expiration time.",
        "Cache slow aggregates, not just raw database tables.",
        "Monitor cache hit ratios."
      ],
      interviewQs: [
        {
          q: "Explain the Cache-Aside pattern.",
          a: "On read: check cache first. On a cache hit return the cached value directly. On a cache miss fetch from the database, write the result to cache with a TTL, then return it. On write or update: invalidate or update the cache entry so subsequent reads get fresh data. The application explicitly controls all cache interactions. This is the most common pattern because it handles cold starts gracefully, avoids caching stale data when write-through invalidation is implemented, and does not require cache and DB to be written simultaneously.",
          bangla: "Cache miss হলে DB থেকে নিয়ে cache এ লেখো TTL সহ — write এ cache invalidate করো। App সব cache interaction control করে।"
        },
        {
          q: "What is Redis and why is it preferred over In-memory?",
          a: "Redis is a distributed in-memory data store accessible by all application instances over the network. IMemoryCache is local to a single process — in a 3-instance deployment, each server has an independent isolated cache (cache incoherence: one instance returns stale data after another instance updates it). Redis is shared across all instances, so a write on server 1 is immediately visible to server 2 and 3. Redis also survives app restarts with optional AOF/RDB persistence and provides specialized data structures (Sorted Sets, Pub/Sub, distributed locks).",
          bangla: "IMemoryCache single process, Redis সব instance share করে — server 1 এ write করলে server 2 ও 3 সাথে সাথে দেখতে পায়।"
        },
        {
          q: "What is a cache-miss and how to handle it?",
          a: "A cache miss occurs when the requested key is not found in cache and the application must fall back to the database. Under heavy traffic, multiple simultaneous cache misses for the same key trigger a Cache Stampede — thousands of requests hit the database simultaneously before any of them writes to cache. Mitigations: mutex/lock pattern (only one request queries the DB while others wait for the cache to populate), probabilistic early expiration (refresh the cache slightly before it expires to prevent a thundering herd), or a background refresh job that proactively reloads hot cache entries before their TTL expires.",
          bangla: "Cache Stampede: একসাথে হাজার request DB তে — mutex দিয়ে একটাই DB query করুন, বাকিরা অপেক্ষা করুক, অথবা background এ proactive refresh।"
        }
      ],
      practice: "Implement a Redis cache layer for a 'User Profile' fetcher.",
      code: `string cacheKey = $"user_{id}";
var userJson = await _cache.GetStringAsync(cacheKey);
if(userJson == null) {
    var raw = await _db.Users.FindAsync(id);
    await _cache.SetStringAsync(cacheKey, Serialize(raw));
}`
    },
    {
      topic: "Clean Architecture",
      english: "Clean Architecture organizes code into concentric layers. The rule is that dependencies can only point inwards. The core business logic (Domain) remains independent of UI, DB, and external frameworks.",
      bangla: "ক্লিন আর্কিটেকচার কোডকে বিভিন্ন লেয়ারে ভাগ করে যেখানে ডিপেন্ডেন্সি সবসময় ভেতরের দিকে থাকে। এর ফলে ডাটাবেজ বা ইউআই পরিবর্তন করলেও বিজনেস লজিক ঠিক থাকে।",
      details: `
| Layer | Responsibility | Components |
| :--- | :--- | :--- |
| **Domain** | Enterprise logic | Entities, Value Objects |
| **Application** | Business logic | Use Cases, DTOs, Mapping |
| **Infrastructure** | Persistence/External | DB Context, External APIs |
| **Web / UI** | Entry Points | Controllers, Minimal APIs |
      `,
      commonMistakes: [
        "Infrastructure layer depending on Web layer.",
        "Leaking Entity models directly to the UI (should use DTOs).",
        "Putting business logic inside Controller actions."
      ],
      bestPractices: [
        "Business logic should reside in the Application/Domain layer.",
        "Use Interfaces for abstractions defined in Domain/Application and implemented in Infrastructure.",
        "Ensure Domain has zero dependencies on any framework."
      ],
      interviewQs: [
        {
          q: "What is the 'Dependency Inversion Principle' in Clean Architecture?",
          a: "In Clean Architecture, DIP means outer layers (Infrastructure, Web) depend on abstractions defined in inner layers (Domain, Application), never the reverse. IProductRepository is defined in the Application layer; SqlProductRepository implementing it lives in Infrastructure. The Domain layer has zero references to Entity Framework, SQL Server, or ASP.NET Core. This means business rules can be unit-tested without a database, and the entire persistence layer can be swapped without touching the Domain or Application layers.",
          bangla: "Infrastructure Domain/Application এর interface implement করে — Domain এর EF Core বা SQL কোনো dependency নেই, database ছাড়া unit test করা যায়।"
        },
        {
          q: "Why keep the Domain layer free of dependencies?",
          a: "The Domain layer contains the most valuable, most stable code — the business rules that exist regardless of the technology stack. If Domain depends on EF Core, you cannot test it without a database context. If it depends on ASP.NET, it cannot be reused in a console worker or a message consumer. Keeping Domain free of framework dependencies means all business logic is testable with plain unit tests and zero mocks, and the code can survive technology migrations (replacing EF Core, switching databases) without touching business rules.",
          bangla: "Framework-free Domain = database ছাড়া unit test করা যায় — technology migration এ Domain touch করতে হয় না, business rule stable থাকে।"
        },
        {
          q: "What is the difference between an Entity and a DTO?",
          a: "An Entity is a business object with a persistent identity (an Order with an Id that exists in the database) that lives in the Domain layer — it encapsulates behavior, enforces invariants via private setters and domain methods, and has a lifecycle. A DTO is a plain data container shaped for a specific communication boundary (API request/response, inter-service message) — no behavior, no identity, no invariants, just public properties. Exposing entities directly to the API couples the domain model to the API contract, creating versioning conflicts and security risks from over-posting attacks.",
          bangla: "Entity identity আর business rule ধরে (Domain), DTO শুধু data transfer করে (API) — Entity সরাসরি API expose করলে over-posting risk এবং versioning conflict।"
        }
      ],
      practice: "Refactor a 'spaghetti' Controller into a Service/Repository pattern following Clean Architecture.",
      code: `// Domain Entity
public class Product { public int Id { get; set; } }

// Application Interface
public interface IProductRepository { Task<Product> GetById(int id); }

// Application Use Case (Service)
public class GetProductHandler {
    private readonly IProductRepository _repo;
    public GetProductHandler(IProductRepository repo) => _repo = repo;
}`
    },
    {
      topic: "System Design Method + URL Shortener",
      difficulty: 'expert',
      english: 'Every design interview: clarify functional vs non-functional requirements, estimate scale, draw a high-level diagram, pick storage, then attack your own design (hot keys, single points of failure, consistency). A URL shortener is the canonical warm-up: write path (create mapping), read path (302 redirect), uniqueness, analytics, abuse.',
      bangla: 'প্রথমে রিকোয়ারমেন্ট, তারপর স্কেল, তারপর ডায়াগ্রাম, তারপর নিজের ডিজাইন আক্রমণ করুন। URL shortener দিয়ে পদ্ধতি আয়ত্ত করুন।',
      details: `
### Method (use on every problem)
1. Functional: create, redirect, optional expiry, custom aliases
2. Non-functional: 10:1 read/write, 50ms p99 redirect, 99.99% availability
3. APIs: POST /v1/links, GET /{code}
4. Data: code → long URL (Redis + SQL), unique code (hash or base62 id)
5. Scale: cache hot redirects, CDN optional, partition by code
6. Failure: Redis down → SQL fallback; uniqueness conflict → retry
7. Security: auth on create, rate limit, malware URL scan
8. Trade-off: SQL source of truth vs Redis speed

### Other systems to practice (same template)
Employee/Payroll/Attendance (HRIS), E-commerce, Inventory, Notification, File storage, Payment, Chat, Food delivery, Ride sharing — requirements, APIs, data model, cache, queue, bottlenecks, security, monitoring.
      `,
      commonMistakes: [
        'Jumping to Kafka before requirements.',
        'No numbers (QPS, payload size, retention).',
        'Ignoring abuse (open redirect, brute-force codes).',
      ],
      bestPractices: [
        'State assumptions out loud.',
        'Separate read and write paths.',
        'End with risks and a v2.',
      ],
      interviewQs: [
        {
          q: 'How do you generate unique short codes without collisions at scale?',
          a: 'Two common designs: (1) auto-increment ID encoded as base62 — simple, ordered, needs a unique ID service or DB sequence; (2) hash the URL and take N bits — collisions need retry. Avoid UUID in the URL (too long). Pre-generate codes in a pool if you need extra entropy. Unique index in SQL is the last line of defense.',
          bangla: 'Base62 ID বা হ্যাশ+রিট্রাই। SQL unique index শেষ রক্ষা।',
          followUp: 'How do you handle a celebrity URL that is 1% of all traffic?',
          difficulty: 'expert',
        },
      ],
      practice: 'Design POST /links and GET /{code} with Redis cache-aside and a unique index on code.',
      code: `public sealed class LinkService(IDistributedCache cache, AppDb db)
{
    public async Task<string?> ResolveAsync(string code, CancellationToken ct)
    {
        var cached = await cache.GetStringAsync(code, ct);
        if (cached is not null) return cached;
        var url = await db.Links.AsNoTracking()
            .Where(l => l.Code == code)
            .Select(l => l.Url)
            .FirstOrDefaultAsync(ct);
        if (url is not null)
            await cache.SetStringAsync(code, url, new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6) }, ct);
        return url;
    }
}`,
    },
    {
      topic: "E-commerce, Payments, Notifications — Trade-off Pack",
      difficulty: 'expert',
      english: 'E-commerce: catalog (cache-heavy reads), cart (user-scoped), checkout (idempotent, inventory reservation, payment, outbox). Payments: never dual-write payment + order without an outbox; webhooks must be idempotent. Notifications: fan-out to email/SMS/push via a queue; do not send inside the HTTP request. Inventory: reservation vs oversell; use conditional updates or a ledger.',
      bangla: 'চেকআউট ইডেম্পোটেন্ট। পেমেন্ট ও অর্ডার আউটবক্স ছাড়া দুইবার লিখবেন না। নোটিফিকেশন রিকোয়েস্টের ভিতরে পাঠাবেন না।',
      details: `
| System | Hard part | Senior move |
| :--- | :--- | :--- |
| E-commerce | Checkout consistency | Reserve stock, outbox OrderPlaced, payment saga |
| Payment | Double charge | Idempotency key, webhook dedupe |
| Notification | Fan-out + retries | Queue + template service + DLQ |
| Chat | Ordering + presence | WebSocket gateway, per-conversation partition |
| Ride / delivery | Geo + matching | Location stream, matching worker, timeouts |
| File storage | Large upload | Direct-to-blob SAS, virus scan, CDN |
| HRIS (employee/payroll/attendance) | Correctness over QPS | Strong SQL transactions, audit log |
      `,
      commonMistakes: [
        'Calling Stripe inside a DB transaction.',
        'Sending email in the controller action.',
        'Overselling because stock was a cached integer.',
      ],
      bestPractices: [
        'Idempotency-Key header on all money POSTs.',
        'Transactional outbox for events.',
        'Audit log for payroll and inventory adjustments.',
      ],
      interviewQs: [
        {
          q: 'User double-clicks Pay. How do you charge once?',
          a: 'Client sends Idempotency-Key. Server stores key + request hash + result. Same key returns the first result. Payment provider also gets the same key. Webhooks use event id as a unique constraint. Checkout is a state machine: Pending → Paid, never Paid twice.',
          bangla: 'Idempotency-Key + স্টেট মেশিন + ওয়েবহুক ইভেন্ট আইডি ইউনিক।',
          difficulty: 'expert',
        },
      ],
      practice: 'Write an outbox table schema and a worker that publishes unpublished rows.',
      code: `public class OutboxMessage
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "";
    public string Payload { get; set; } = "";
    public DateTimeOffset? PublishedAt { get; set; }
}`,
    }
  ],
  revisionSummary: `
- **Scale**: Horizontal (more nodes) vs Vertical (bigger node).
- **Communication**: Sync (HTTP/gRPC) vs Async (Message Bus).
- **Patterns**: CQRS, Outbox, and Circuit Breaker for reliability.
- **Method**: Requirements → numbers → diagram → attack your design.
- **Money**: Idempotency keys and no dual writes.
  `,
  summary: "সিস্টেম ডিজাইন লেভেলে কাজ করতে হলে আপনাকে কোড ছাড়িয়ে ইনফ্রাস্ট্রাকচার এবং নেটওয়ার্ক সম্পর্কে ভাবতে হবে।"
};
