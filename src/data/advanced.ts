export const devopsData = {
  id: 'devops',
  title: 'DevOps & Cloud Deployment',
  description: 'Learn how to containerize, automate, and deploy .NET applications to professional cloud environments.',
  sections: [
    {
      topic: "Docker & Containerization",
      english: "Docker packages the app with all its dependencies. Senior developers must know how to write multi-stage Dockerfiles to keep production images slim and secure.",
      bangla: "ডকার শিখলে 'আমার পিসিতে চলে কিন্তু সার্ভারে চলে না' - এই চিরচেনা সমস্যা সমাধান হয়। মাল্টি-স্টেজ বিল্ড ব্যবহার করলে ইমেজ সাইজ অনেক ছোট হয়।",
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
        "What is a multi-stage Dockerfile and why use it?",
        "Difference between 'docker build' and 'docker run'?",
        "How do you handle sensitive secrets in Docker?"
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
      bangla: "সিআই/সিডি পাইপলাইন ছাড়া বড় প্রজেক্ট মেইনটেইন করা অসম্ভব। এটি প্রতিটা কোড চেঞ্জে অটোমেটিক বিল্ড এবং টেস্ট নিশ্চিত করে।",
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
        "Explain CI vs CD.",
        "What are 'GitHub Actions' and how do they work?",
        "How do you ensure zero-downtime during deployment?"
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
        "Difference between camelCase and PascalCase?",
        "What is the 'ProblemDetails' format?",
        "How to handle JSON circular reference errors?"
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
      bangla: "মাইক্রোসার্ভিস মানেই অনেকগুলো ছোট সার্ভিস যা নেটওয়ার্কের মাধ্যমে একে অপরের সাথে কথা বলে। তবে ছোট টীমের জন্য মনোলিথই ভালো।",
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
        "When would you NOT choose microservices?",
        "What is the 'Service Discovery' pattern?",
        "Explain 'Database per Service' constraint."
      ],
      practice: "Design an E-commerce system where 'Order' and 'Inventory' are separate microservices.",
      code: `// RabbitMQ Message Producer
var message = new OrderCreated { Id = 123 };
await _publishEndpoint.Publish(message);`
    },
    {
      topic: "Caching Patterns & Redis",
      english: "Caching reduces DB pressure. Cache-Aside is the most popular pattern where the app manages the cache interaction.",
      bangla: "রেডিস ক্যাশিং ব্যবহার করলে ডাটাবেজের ওপর চাপ কমে। ক্যাশ-অ্যাসাইড প্যাটার্নে প্রথমে ক্যাশে ডাটা চেক করা হয়, না থাকলে ডিবি থেকে আনা হয়।",
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
        "Explain the Cache-Aside pattern.",
        "What is Redis and why is it preferred over In-memory?",
        "What is a cache-miss and how to handle it?"
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
        "What is the 'Dependency Inversion Principle' in Clean Architecture?",
        "Why keep the Domain layer free of dependencies?",
        "What is the difference between an Entity and a DTO?"
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
  summary: "সিস্টেম ডিজাইন লেভেলে কাজ করতে হলে আপনাকে কোড ছাড়িয়ে ইনফ্রাস্ট্রাকচার এবং নেটওয়ার্ক সম্পর্কে ভাবতে হবে।"
};
