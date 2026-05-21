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
    }
  ],
  revisionSummary: `
- **Docker**: Slim images = faster deployment + better security.
- **CI/CD**: Automate everything; manual is the enemy of stability.
- **Monitoring**: Use health checks (/health) for reliable hosting.
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
    }
  ],
  revisionSummary: `
- **Scale**: Horizontal (more nodes) vs Vertical (bigger node).
- **Communication**: Sync (HTTP/gRPC) vs Async (Messsage Bus).
- **Patterns**: CQRS, Outbox, and Circuit Breaker for reliability.
  `,
  summary: "সিস্টেম ডিজাইন লেভেলে কাজ করতে হলে আপনাকে কোড ছাড়িয়ে ইনফ্রাস্ট্রাকচার এবং নেটওয়ার্ক সম্পর্কে ভাবতে হবে।"
};
