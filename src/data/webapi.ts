export const webapiData = {
  id: "webapi",
  title: "REST Web API Development",
  description:
    "Design and build professional, scalable APIs following REST best practices and security standards.",
  sections: [
    {
      topic: "REST Principles & HTTP Methods",
      english:
        "REST is an architectural style utilizing standard HTTP methods. Resources should be noun-based. Methods like GET, POST, PUT, DELETE, and PATCH have specific semantic meanings.",
      bangla:
        "REST এপিআই-এর মূল নিয়ম হলো ইউআরএল হবে বস্তুর বা রিসোর্সের নামে (যেমন: /users)। আর অ্যাকশনগুলো হবে HTTP মেথড দিয়ে।",
      details: `
| Method | Semantic Meaning | Response Code |
| :--- | :--- | :--- |
| **GET** | Fetch data | 200 OK |
| **POST** | Create new resource | 201 Created |
| **PUT** | Replace resource | 200/204 OK |
| **PATCH** | Update part of resource | 200 OK |
| **DELETE** | Remove resource | 204 No Content |
      `,
      commonMistakes: [
        "Using GET for operations that change data.",
        "Missing pluralization in resource names.",
        "Returning 200 instead of 201 for POST.",
      ],
      bestPractices: [
        "Use nouns for URLs: /api/orders.",
        "Implement Idempotency for PUT and DELETE.",
        "Use HATEOAS for self-descriptive APIs.",
      ],
      interviewQs: [
        {
          q: "Difference between PUT and PATCH?",
          a: "PUT replaces the entire resource with the new representation — if you omit a field, it is cleared or reset to its default. PATCH applies a partial update — only the fields included in the request body are changed. For example, PUT /users/1 with just a name field would also clear the email. PATCH /users/1 with just a name field only updates the name. Use PATCH for partial updates, PUT when the client explicitly sends a complete replacement of the resource.",
          bangla:
            "PUT পুরো resource replace করে, PATCH শুধু পাঠানো field আপডেট করে — partial update এ PATCH, সম্পূর্ণ replacement এ PUT।",
        },
        {
          q: "What are the 6 constraints of REST?",
          a: "1) Client-Server: client and server are independent concerns. 2) Stateless: each request must contain all necessary context — no server-side session. 3) Cacheable: responses must declare their cacheability. 4) Uniform Interface: standard HTTP methods, resource identification via URIs, and self-descriptive messages. 5) Layered System: the client does not know whether it communicates directly with the server or through a proxy. 6) Code on Demand (optional): the server may send executable code to the client.",
          bangla:
            "Stateless, Client-Server, Cacheable, Uniform Interface, Layered System, Code on Demand — এই ৬টি REST এর মূল ভিত্তি, interview এ প্রতিটার মানে জানা জরুরি।",
        },
        {
          q: "How do you handle breaking changes in an API?",
          a: "Introduce a new version (v2) for any breaking change and keep v1 intact and working. Mark v1 as deprecated with a Sunset response header and communicate a retirement timeline. Non-breaking additions (new optional fields, new endpoints) can be added to the existing version without a version bump. Never change field types, remove fields, or alter the semantics of existing fields in a live version — clients built against the contract will break silently.",
          bangla:
            "Breaking change মানেই নতুন version — পুরনো version কাজ করতে থাকবে, Sunset header দিয়ে deprecate করুন এবং retirement timeline জানান।",
        },
      ],
      practice:
        "Design the API structure for a 'Social Media' system including posts, comments, and likes.",
      code: `[HttpPost]
public IActionResult Create([FromBody] Post post) {
    _context.Posts.Add(post);
    _context.SaveChanges();
    return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
}`,
    },
    {
      topic: "Status Codes & Error Handling",
      english:
        "HTTP Status codes provide standard feedback. 4xx codes are for client errors, 5xx for server errors. Use ProblemDetails for consistent JSON error responses.",
      bangla:
        "সঠিক স্ট্যাটাস কোড ব্যবহার করলে ক্লায়েন্ট অ্যাপ খুব সহজেই বুঝতে পারে কী ঘটেছে। এরর হ্যান্ডলিংয়ের জন্য সব সময় 'ProblemDetails' ফরম্যাট ফলো করা উচিত।",
      details: `
| Code | Category | Meaning |
| :--- | :--- | :--- |
| **400** | Bad Request | Validation failure. |
| **401** | Unauthorized | User not authenticated. |
| **403** | Forbidden | No permission for resource. |
| **404** | Not Found | Resource does not exist. |
| **429** | Too Many Requests | Rate limit exceeded. |
      `,
      commonMistakes: [
        "Returning 404 for an unauthorized user.",
        "Raw exceptions showing stack traces in Production.",
        "Using 500 for validation errors.",
      ],
      bestPractices: [
        "Always return a consistent JSON body on errors.",
        "Use 401 for token issues, 403 for role issues.",
        "Hide detailed error messages in Production.",
      ],
      interviewQs: [
        {
          q: "When to use 401 vs 403?",
          a: "401 Unauthorized means the client has not authenticated — they need to provide valid credentials (login again or refresh their token). 403 Forbidden means the client is authenticated but does not have permission for the requested resource. Use 401 to tell the client they need to identify themselves. Use 403 to tell them their identity is known but the action is not permitted for their account or role.",
          bangla:
            "401 মানে 'কে তুমি? — login করো', 403 মানে 'তোমাকে চিনি, কিন্তু এই কাজের permission নেই' — এই দুটোর পার্থক্য interview এ প্রায়ই জিজ্ঞেস করা হয়।",
        },
        {
          q: "What is the 'ProblemDetails' RFC 7807?",
          a: "RFC 7807 defines a standard JSON error response format with fields: type (a URI identifying the error type), title (a short human-readable summary), status (the HTTP status code), detail (a human-readable explanation specific to this occurrence), and instance (a URI identifying this specific error event). ASP.NET Core supports it natively with ProblemDetails and ValidationProblemDetails classes. Consistent error contracts across all endpoints make client-side error handling predictable.",
          bangla:
            "Standard error response format — type, title, status, detail, instance — সব controller এ consistent রাখলে client সহজে error handle করতে পারে।",
        },
        {
          q: "How do you handle global exceptions in Web API?",
          a: "Register app.UseExceptionHandler() as the first middleware to catch all unhandled exceptions globally. Create an error endpoint or delegate that reads IExceptionHandlerPathFeature, maps exception types to appropriate HTTP status codes (404 for NotFoundException, 400 for ValidationException, 500 for everything else), and returns a ProblemDetails JSON body. In .NET 8+, the IExceptionHandler interface offers a clean typed alternative. Never let raw exception details reach the client in production — they expose internals.",
          bangla:
            "UseExceptionHandler() প্রথম middleware — exception type অনুযায়ী 404/400/500 map করুন, production এ stack trace কখনো client এ পাঠাবেন না।",
        },
      ],
      practice:
        "Implement a status code check for a service that can return 'NotFound', 'InvalidData', or 'Success'.",
      code: `if (item == null) return NotFound();
if (!isValid) return BadRequest(new { error = "Validation Failed" });
return Ok(item);`,
    },
    {
      topic: "Pagination, Filtering & Sorting",
      english:
        "Large datasets must be paged to ensure performance. Implementing dynamic filtering and sorting via query parameters is a standard requirement.",
      bangla:
        "একসাথে সব ডাটা না পাঠিয়ে ভেঙে ভেঙে পাঠানোকে পেজিনেশন বলে। এটি ডাটাবেজ এবং নেটওয়ার্কের ওপর চাপ কমায়।",
      commonMistakes: [
        "Hardcoding page sizes.",
        "Inefficient SQL OFFSET for large skip counts.",
        "Allowing unrestricted page sizes.",
      ],
      bestPractices: [
        "Return Pagination Metadata in headers.",
        "Use IQueryable to push filtering to DB level.",
        "Limit Max Page Size to prevent memory issues.",
      ],
      interviewQs: [
        {
          q: "Offset vs Cursor based pagination?",
          a: "Offset pagination (SKIP/TAKE) is simple but degrades at high page numbers — SQL must scan and discard all prior rows first. Fetching page 10,000 with 20 items means skipping 200,000 rows even though they are never returned. Cursor pagination uses a stable position marker (last seen ID or timestamp) as a bookmark — WHERE Id > @lastId ORDER BY Id FETCH NEXT 20 ROWS is index-efficient at any depth. Use offset for small datasets and admin tools; use cursor for large tables and infinite-scroll UIs.",
          bangla:
            "Offset বড় page number এ slow (সব আগের row skip করে), Cursor-based সবসময় index-efficient — infinite scroll UI তে cursor pagination ব্যবহার করুন।",
        },
        {
          q: "How to handle dynamic sorting in LINQ?",
          a: "Map the sort column string to a typed OrderBy expression using a switch statement or dictionary: query = sortBy switch { 'name' => query.OrderBy(x => x.Name), 'date' => query.OrderByDescending(x => x.CreatedAt), _ => query.OrderBy(x => x.Id) }. For more dynamic scenarios, the System.Linq.Dynamic.Core NuGet package supports string-based OrderBy('Name DESC'). Always ensure sorted columns are indexed in the database, otherwise sorting causes full table scans.",
          bangla:
            "Sort column string কে typed expression এ switch দিয়ে map করুন — sorted column এ index না থাকলে full table scan হবে।",
        },
        {
          q: "What information should be in pagination metadata?",
          a: "At minimum: totalCount (total items matching the filter), pageNumber (current page), pageSize (items per page), totalPages (derived), hasPreviousPage, and hasNextPage. Optionally include firstItemIndex and lastItemIndex. Return metadata either as a wrapper object alongside the data array or in the X-Pagination response header as JSON. The header approach keeps the response body a clean array while still providing navigation context to the client.",
          bangla:
            "totalCount, pageNumber, pageSize, hasNextPage — এই info response header বা wrapper object এ দিন, client navigation এর জন্য জরুরি।",
        },
      ],
      practice: "Write a generic 'PagedList' result wrapper for your API.",
      code: `public async Task<List<User>> Get(int pageNum, int pageSize) {
    return await _db.Users
        .Skip((pageNum - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
}`,
    },
    {
      topic: "Swagger & Versioning",
      english:
        "Swagger (OpenAPI) documents your API for developers. Versioning (URL or Header based) ensures you don't break existing client apps when updating logic.",
      bangla:
        "সোয়্যাগার এর মাধ্যমে এপিআই টেস্ট করা এবং ডকুমেন্টেশন দেখা যায়। ভার্সনিং খুবই জরুরি যাতে পুরনো অ্যাপগুলো হুট করে বন্ধ হয়ে না যায়।",
      commonMistakes: [
        "Keeping Swagger UI public in Production.",
        "Breaking API changes without a new version (v2).",
        "Missing XML comments for endpoints.",
      ],
      bestPractices: [
        "Use [ApiVersion] attributes.",
        "Secure Swagger with Basic Auth in Staging.",
        "Provide clear examples in Swagger docs.",
      ],
      interviewQs: [
        {
          q: "Explain URL vs Header based versioning.",
          a: "URL versioning embeds the version in the path (/api/v1/users) — it is explicit, visible in browser address bars, easy to test with curl or Postman, and plays nicely with HTTP caching. Header versioning keeps URLs clean but requires clients to set an API-Version header on every request, which is invisible and harder to test. URL versioning is the most widely adopted for public APIs because of its discoverability. Header versioning suits internal APIs where URL immutability is a strict requirement.",
          bangla:
            "URL versioning দেখতে সহজ এবং test করা সহজ (/api/v1) — Header versioning URL clean রাখে কিন্তু invisible, public API তে URL versioning prefer করুন।",
        },
        {
          q: "How to hide specific endpoints from Swagger?",
          a: "Decorate the action or controller with [ApiExplorerSettings(IgnoreApi = true)]. This removes the endpoint from the generated OpenAPI specification without affecting its routing or functionality. For programmatic filtering, add a document filter in AddSwaggerGen that removes specific operations by path or tag. This is useful for internal diagnostic endpoints, health check paths, or experimental endpoints not ready for external documentation.",
          bangla:
            "[ApiExplorerSettings(IgnoreApi = true)] দিয়ে endpoint Swagger থেকে লুকানো যায় — routing কিন্তু ঠিকই কাজ করে, শুধু docs থেকে বাদ যায়।",
        },
        {
          q: "Benefits of OpenAPI specification?",
          a: "An OpenAPI spec is a machine-readable contract that enables: auto-generated strongly-typed client SDKs in any language (via NSwag, AutoRest), interactive documentation that developers can test live (Swagger UI, Redoc), server-side request validation middleware, contract testing between services, and API mocking before the server is implemented. The spec can be version-controlled alongside code so client teams can detect breaking changes as part of CI.",
          bangla:
            "Machine-readable contract থেকে SDK auto-generate, mock server, contract testing — spec version control এ থাকলে breaking change CI তেই ধরা পড়ে।",
        },
      ],
      practice:
        "Add an 'Obsolete' attribute to an endpoint and observe it in Swagger.",
      code: `[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersController : ControllerBase { ... }`,
    },
  ],
  revisionSummary: `
- **REST**: Nouns for Resources, Verbs for Methods.
- **Errors**: Standard status codes + JSON bodies.
- **Performance**: Pagination, Filtering, and Caching are MUST.
- **Maintenance**: Swagger for Docs, Versioning for backward compatibility.
  `,
  summary:
    "Web API ডেভেলপমেন্টে RESTful আর্কিটেকচার এবং প্রপার সিকিউরিটি নিশ্চিত করা একজন সিনিয়র ডেভেলপারের প্রধান দায়িত্ব।",
};
