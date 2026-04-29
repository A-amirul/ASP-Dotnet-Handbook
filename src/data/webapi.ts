export const webapiData = {
  id: 'webapi',
  title: 'REST Web API Development',
  description: 'Design and build professional, scalable APIs following REST best practices and security standards.',
  sections: [
    {
      topic: "REST Principles & HTTP Methods",
      english: "REST is an architectural style utilizing standard HTTP methods. Resources should be noun-based. Methods like GET, POST, PUT, DELETE, and PATCH have specific semantic meanings.",
      bangla: "REST এপিআই-এর মূল নিয়ম হলো ইউআরএল হবে বস্তুর বা রিসোর্সের নামে (যেমন: /users)। আর অ্যাকশনগুলো হবে HTTP মেথড দিয়ে।",
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
        "Returning 200 instead of 201 for POST."
      ],
      bestPractices: [
        "Use nouns for URLs: /api/orders.",
        "Implement Idempotency for PUT and DELETE.",
        "Use HATEOAS for self-descriptive APIs."
      ],
      interviewQs: [
        "Difference between PUT and PATCH?",
        "What are the 6 constraints of REST?",
        "How do you handle breaking changes in an API?"
      ],
      practice: "Design the API structure for a 'Social Media' system including posts, comments, and likes.",
      code: `[HttpPost]
public IActionResult Create([FromBody] Post post) {
    _context.Posts.Add(post);
    _context.SaveChanges();
    return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
}`
    },
    {
      topic: "Status Codes & Error Handling",
      english: "HTTP Status codes provide standard feedback. 4xx codes are for client errors, 5xx for server errors. Use ProblemDetails for consistent JSON error responses.",
      bangla: "সঠিক স্ট্যাটাস কোড ব্যবহার করলে ক্লায়েন্ট অ্যাপ খুব সহজেই বুঝতে পারে কী ঘটেছে। এরর হ্যান্ডলিংয়ের জন্য সব সময় ‘ProblemDetails’ ফরম্যাট ফলো করা উচিত।",
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
        "Using 500 for validation errors."
      ],
      bestPractices: [
        "Always return a consistent JSON body on errors.",
        "Use 401 for token issues, 403 for role issues.",
        "Hide detailed error messages in Production."
      ],
      interviewQs: [
        "When to use 401 vs 403?",
        "What is the 'ProblemDetails' RFC 7807?",
        "How do you handle global exceptions in Web API?"
      ],
      practice: "Implement a status code check for a service that can return 'NotFound', 'InvalidData', or 'Success'.",
      code: `if (item == null) return NotFound();
if (!isValid) return BadRequest(new { error = "Validation Failed" });
return Ok(item);`
    },
    {
      topic: "Pagination, Filtering & Sorting",
      english: "Large datasets must be paged to ensure performance. Implementing dynamic filtering and sorting via query parameters is a standard requirement.",
      bangla: "একসাথে সব ডাটা না পাঠিয়ে ভেঙে ভেঙে পাঠানোকে পেজিনেশন বলে। এটি ডাটাবেজ এবং নেটওয়ার্কের ওপর চাপ কমায়।",
      commonMistakes: [
        "Hardcoding page sizes.",
        "Inefficient SQL OFFSET for large skip counts.",
        "Allowing unrestricted page sizes."
      ],
      bestPractices: [
        "Return Pagination Metadata in headers.",
        "Use IQueryable to push filtering to DB level.",
        "Limit Max Page Size to prevent memory issues."
      ],
      interviewQs: [
        "Offset vs Cursor based pagination?",
        "How to handle dynamic sorting in LINQ?",
        "What information should be in pagination metadata?"
      ],
      practice: "Write a generic 'PagedList' result wrapper for your API.",
      code: `public async Task<List<User>> Get(int pageNum, int pageSize) {
    return await _db.Users
        .Skip((pageNum - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
}`
    },
    {
      topic: "Swagger & Versioning",
      english: "Swagger (OpenAPI) documents your API for developers. Versioning (URL or Header based) ensures you don't break existing client apps when updating logic.",
      bangla: "সোয়্যাগার এর মাধ্যমে এপিআই টেস্ট করা এবং ডকুমেন্টেশন দেখা যায়। ভার্সনিং খুবই জরুরি যাতে পুরনো অ্যাপগুলো হুট করে বন্ধ হয়ে না যায়।",
      commonMistakes: [
        "Keeping Swagger UI public in Production.",
        "Breaking API changes without a new version (v2).",
        "Missing XML comments for endpoints."
      ],
      bestPractices: [
        "Use [ApiVersion] attributes.",
        "Secure Swagger with Basic Auth in Staging.",
        "Provide clear examples in Swagger docs."
      ],
      interviewQs: [
        "Explain URL vs Header based versioning.",
        "How to hide specific endpoints from Swagger?",
        "Benefits of OpenAPI specification?"
      ],
      practice: "Add an 'Obsolete' attribute to an endpoint and observe it in Swagger.",
      code: `[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersController : ControllerBase { ... }`
    }
  ],
  revisionSummary: `
- **REST**: Nouns for Resources, Verbs for Methods.
- **Errors**: Standard status codes + JSON bodies.
- **Performance**: Pagination, Filtering, and Caching are MUST.
- **Maintenance**: Swagger for Docs, Versioning for backward compatibility.
  `,
  summary: "Web API ডেভেলপমেন্টে RESTful আর্কিটেকচার এবং প্রপার সিকিউরিটি নিশ্চিত করা একজন সিনিয়র ডেভেলপারের প্রধান দায়িত্ব।"
};
