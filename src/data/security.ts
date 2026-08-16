export const securityData = {
  id: 'security',
  title: 'Authentication, Authorization & Application Security',
  description:
    'AuthN vs AuthZ, tokens, Identity, OWASP in ASP.NET Core, injection classes, secrets, and an enterprise public-API plus admin design — with the production failures interviewers expect.',
  sections: [
    {
      topic: 'Authentication, Authorization, JWT, Claims, and Policies',
      difficulty: 'senior',
      english:
        'Authentication answers who; authorization answers what they may do. JWT access tokens are bearer credentials: short-lived, validated locally, dangerous if stolen. Refresh tokens are longer-lived secrets stored server-side (or rotated) to mint new access tokens. Roles are coarse; policies and permission claims scale. Seniors design rotation, revocation, and the difference between RBAC and permission-based access.',
      bangla:
        'AuthN কে, AuthZ কী করতে পারবে। Access JWT ছোট জীবন; refresh সার্ভারে ঘোরে। Role মোটা; policy/permission সূক্ষ্ম। টোকেন চুরি, রোটেশন, রিভোক — সিনিয়র এখানে কাটে।',
      details: `
### AuthN vs AuthZ
Middleware order: authenticate (set HttpContext.User) then authorize. [Authorize] without AuthN is 401; authenticated but failing policy is 403. Mixing these in APIs is a classic bug.

### JWT access vs refresh
- **Access token:** signed JWT, 5–15 minutes, Authorization Bearer. Validate issuer, audience, lifetime, signing key, and typ if you mix token types.
- **Refresh token:** opaque random string (preferred), stored hashed in DB, bound to user + device, single-use with rotation.

**Why not a 7-day JWT access token?** Theft lasts 7 days; you cannot revoke without a denylist you said you were avoiding.

### Claims, roles, policies
Roles = ClaimTypes.Role. Policies = named rules (RequireClaim("perm", "orders:write"), resource-based handlers). **RBAC:** Admin/Manager/User — simple, explodes into role combinations. **Permission-based:** orders:write assigned to roles or users — more code, fewer god roles.

### Token rotation
On refresh: issue new refresh, invalidate old. **Reuse detection:** if an old refresh is presented, steal is assumed — revoke the family. **Production failure:** refresh in localStorage + XSS = account takeover; or rotation without reuse detection so a stolen token and the legit user race.

### When NOT
JWT for a same-site browser app that could use cookie sessions. Putting permissions you must revoke instantly only inside a 1-hour JWT with no denylist.
      `,
      commonMistakes: [
        'Long-lived access JWTs and calling it stateless security.',
        'Storing refresh tokens in localStorage.',
        'Validating signature but not audience/issuer/lifetime.',
        'Using roles only, then creating SuperAdmin2 when permissions explode.',
        '401 vs 403 mixed up in API clients and security tests.',
      ],
      bestPractices: [
        'Short access TTL; rotating refresh with reuse detection.',
        'Policy-based authorization for anything beyond a single role.',
        'Resource-based handlers for only-the-owner (IAuthorizationService).',
        'Never put secrets or unused PII in JWT payloads (they are readable).',
        'Revoke refresh families on password change and logout-all.',
      ],
      interviewQs: [
        {
          q: 'Why do we pair a short JWT access token with a refresh token instead of one long JWT?',
          a: 'A JWT is valid until exp unless you add a denylist (which reintroduces state). Short access limits blast radius of XSS/theft and lets you change claims without waiting hours. Refresh is a revocable server-side credential. Rotation + reuse detection turns a stolen refresh into a revoke-all event. Production failure of long JWT: fired employee keeps calling the API until expiry; you cannot kill the token besides key rotation (which kills everyone).',
          bangla: 'লম্বা JWT রিভোক করা যায় না। ছোট access + সার্ভার-সাইড refresh রিভোক/রোটেশন দেয়। চুরি হলে ফ্যামিলি রিভোক।',
          followUp: 'Walk through refresh-token reuse detection when an attacker and the user both refresh.',
          difficulty: 'senior',
        },
        {
          q: 'RBAC vs permission-based authorization in ASP.NET Core — which do you choose?',
          a: 'RBAC for a handful of stable roles (Admin vs User). Permission claims or a policy handler when features are independent (refund vs ship vs export). I map roles to permissions in one place so User.IsInRole("Admin") is not copied into 40 actions. Failure of RBAC: 15 roles that are really bitmasks. Failure of permissions: stringly-typed claims with typos and no catalog.',
          bangla: 'কম স্থিতিশীল রোলে RBAC। ফিচার আলাদা হলে permission + policy। টাইপো ক্লেইম ক্যাটালগ ছাড়া ভাঙে।',
          followUp: 'How do you authorize "user can edit this order" rather than "user is Admin"?',
          difficulty: 'senior',
        },
        {
          q: 'What must TokenValidationParameters actually validate?',
          a: 'IssuerSigningKey (or OIDC metadata), ValidIssuer, ValidAudience, ValidateLifetime, clock skew, and typically ValidAlgorithms so none/alg confusion cannot appear. Skipping audience means any token from your IdP works on every API. Production: a debug token from another environment accepted because ValidateIssuer was false.',
          bangla: 'কী, ইস্যুয়ার, অডিয়েন্স, লাইফটাইম, অ্যালগরিদম। অডিয়েন্স বাদ দিলে অন্য API-র টোকেন চলে যায়।',
          followUp: 'How do you rotate signing keys without a global outage?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Implement refresh rotation with a hashed token in SQL and reuse detection that revokes the family. Write a test: presenting the previous refresh returns 401 and disables the family.',
      code: `builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudience = "shop-api",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });

builder.Services.AddAuthorization(o =>
{
    o.AddPolicy("orders:write", p => p.RequireClaim("perm", "orders:write"));
});`,
    },
    {
      topic: 'Cookie vs JWT, OAuth2, OIDC, Identity, Hashing, Lockout',
      difficulty: 'senior',
      english:
        'Browser first-party apps usually want cookie authentication with SameSite and antiforgery. SPAs on another origin and public APIs want OAuth2/OIDC access tokens. ASP.NET Identity handles password hashing, stamp, lockout, and 2FA — do not roll your own hasher. Seniors know why Identity uses PBKDF2, what cookie theft looks like, and when OAuth is the wrong hammer.',
      bangla:
        'সেইম-সাইট ব্রাউজার = কুকি + CSRF। আলাদা SPA/পাবলিক API = OAuth2/OIDC। পাসওয়ার্ড Identity-র হ্যাশ/লকআউট; নিজে bcrypt লিখবেন না।',
      details: `
### Cookie vs JWT
| | Cookie session | JWT bearer |
| :--- | :--- | :--- |
| **Browser same-site** | Best: HttpOnly, Secure, SameSite | XSS can steal if in JS storage |
| **CSRF** | Must mitigate (antiforgery, SameSite) | Bearer not sent automatically |
| **Revoke** | Server session / Identity stamp | Refresh family or denylist |
| **APIs / mobile** | Awkward | Natural |

**When NOT JWT:** a Razor/Blazor Server app on the same host — cookie auth is simpler and HttpOnly.

### OAuth2 vs OIDC
OAuth2 is authorization (access to APIs). OIDC is identity on top (id_token, userinfo). Authorization Code + PKCE is the default for SPAs and mobile. Implicit flow is dead. Client credentials for service-to-service. **When NOT:** your own form login for a single app — Identity cookie may be enough unless SSO is required.

### ASP.NET Identity
Password hasher (PBKDF2 by default), security stamp (invalidates cookies when password changes), lockout, 2FA. Do not store SHA256(password). **Lockout:** mitigate guessing on one account; combine with rate limits so you do not enable user enumeration plus DoS on a single account.

**Production failure:** lockout without rate limiting on login = attackers lock out the CEO. Or cookies without Secure behind a misconfigured reverse proxy (ForwardedHeaders not set).
      `,
      commonMistakes: [
        'SPA stores JWT in localStorage; XSS = full account.',
        'Custom MD5/SHA password hashing.',
        'OAuth implicit flow or access token in the URL hash.',
        'Disabling lockout and having no brute-force limit.',
        'SameSite=None without Secure, or forgetting CSRF on cookie APIs.',
      ],
      bestPractices: [
        'HttpOnly + Secure + SameSite cookies for first-party web.',
        'Authorization Code + PKCE; confidential clients keep secrets in Key Vault.',
        'Use Identity password hasher; increase iteration count as hardware allows.',
        'Security stamp on password/role change; sign out everywhere.',
        'Configure ForwardedHeaders so Secure cookies work behind TLS terminators.',
      ],
      interviewQs: [
        {
          q: 'When do you choose cookie authentication over JWT in ASP.NET Core?',
          a: 'Same-site browser apps: cookies with HttpOnly cannot be read by JS, so XSS cannot exfiltrate the session as easily as localStorage JWT. I add CSRF protection because cookies are sent automatically. JWT wins for native apps, third-party SPAs, and public APIs. Hybrid: BFF pattern — browser talks cookies to my backend, backend holds refresh tokens.',
          bangla: 'সেইম-সাইট ওয়েবে HttpOnly কুকি। CSRF লাগবে। মোবাইল/পাবলিক API-তে JWT। BFF: ব্রাউজার কুকি, সার্ভার refresh ধরে।',
          followUp: 'Explain the BFF pattern and what the browser is never allowed to see.',
          difficulty: 'expert',
        },
        {
          q: 'OAuth2 vs OpenID Connect — which does Sign in with Google use?',
          a: 'Sign-in is OIDC (identity). Google also issues OAuth access tokens if you request API scopes. Using OAuth access tokens as proof of identity without validating the id_token is a classic bug. Client credentials is not for users. Authorization Code + PKCE for public clients. I would not use OAuth to replace a local Identity cookie unless I need federation.',
          bangla: 'লগইন = OIDC। API স্কোপ = OAuth। Access token-কে আইডেন্টিটি ভাবা ভুল। পাবলিক ক্লায়েন্টে PKCE।',
          followUp: 'Why is implicit flow considered unsafe compared to code + PKCE?',
          difficulty: 'senior',
        },
        {
          q: 'How does ASP.NET Identity hash passwords and what does lockout actually prevent?',
          a: 'IdentityPasswordHasher uses PBKDF2 with a salt and iteration count (versioned payload). It is slow by design vs SHA256. Lockout stops online password guessing on one account after N failures. It does not stop stuffing across millions of accounts — that needs rate limits, bot detection, and leaked-password checks. Failure: lockout used as a DoS weapon against the CEO.',
          bangla: 'PBKDF2+salt, ধীর ইচ্ছাকৃত। লকআউট এক অ্যাকাউন্টের গেসিং থামায়, স্টাফিং নয় — রেট লিমিট লাগে।',
          followUp: 'How would you migrate from SHA256 passwords to Identity hasher without a mass reset?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Configure cookie auth with SameSite=Lax, antiforgery on MVC POSTs, and Identity lockout. Add a BFF sketch: browser never receives a refresh token.',
      code: `builder.Services.AddIdentity<AppUser, IdentityRole>(o =>
{
    o.Password.RequiredLength = 12;
    o.Lockout.MaxFailedAccessAttempts = 5;
    o.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    o.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(o =>
{
    o.Cookie.HttpOnly = true;
    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    o.Cookie.SameSite = SameSiteMode.Lax;
});`,
    },
    {
      topic: 'OWASP Top 10 Mapped to ASP.NET Core',
      difficulty: 'senior',
      english:
        'OWASP Top 10 is a risk list, not a checklist you memorize in order. A senior maps each item to a concrete ASP.NET Core control: authz middleware, data protection, headers, logging, SSRF guards, and supply chain. Interviewers want the mapping and a failure story, not the acronym recitation.',
      bangla:
        'OWASP মুখস্থ নাম নয় — প্রতিটা রিস্ক ASP.NET কন্ট্রোলে ম্যাপ। অথরাইজেশন, হেডার, লগ, SSRF, সাপ্লাই চেইন — ফেইলিউর স্টোরিসহ।',
      details: `
| OWASP risk | ASP.NET Core control | Typical failure |
| :--- | :--- | :--- |
| **Broken access control** | Policies, resource handlers, never trust client ids | IDOR: /orders/12 without owner check |
| **Cryptographic failures** | TLS, Data Protection, secrets out of config | Connection string in repo; JWT in logs |
| **Injection** | EF parameterized LINQ, never interpolate SQL | FromSqlRaw with string add |
| **Insecure design** | Threat model, rate limits, not auth later | Public debug endpoint in prod |
| **Security misconfiguration** | No detailed errors in prod, HTTPS | UseDeveloperExceptionPage in prod |
| **Vulnerable components** | dotnet list package --vulnerable | Old Json.NET gadget |
| **Auth failures** | Identity, MFA, session stamp, stuffing defenses | Weak password, no lockout |
| **Software / data integrity** | Signed packages, antiforgery | Unsigned scripts, CSRF on admin |
| **Logging failures** | Structured logs without secrets | Logging Authorization header |
| **SSRF** | Allowlists for outbound URLs | Webhook to 169.254.169.254 |

Treat year-specific numbering as secondary; the controls stay. **When NOT:** spending a sprint on headers while IDOR is open on every entity.
      `,
      commonMistakes: [
        'Reciting OWASP names without a .NET control.',
        'Fixing XSS in a JSON API while IDOR prints other users orders.',
        'Developer exception pages and Swagger left on in production.',
        'Logging bearer tokens and cookie headers.',
      ],
      bestPractices: [
        'Threat-model write endpoints first (access control + injection).',
        'Package vulnerability scan in CI; fail the build on critical.',
        'ProblemDetails in production, stack traces only in telemetry with redaction.',
        'Allowlist outbound HTTP; block link-local and cloud metadata IPs.',
      ],
      interviewQs: [
        {
          q: 'Map broken access control to a concrete ASP.NET Core bug you have seen.',
          a: 'IDOR: [Authorize] on the controller but Get(id) loads any Order by primary key. The user is authenticated, so it is not an AuthN bug. Fix: filter by user id / tenant, or IAuthorizationService on the resource. Multi-tenant: missing TenantId in the query is the same class. Tests must call the API as two users, not only as Admin.',
          bangla: '[Authorize] থাকলেও Get(id) অন্যের অর্ডার দিলে IDOR। ইউজার/টেন্যান্ট ফিল্টার বা resource policy। দুই ইউজার দিয়ে টেস্ট।',
          followUp: 'How do you prevent IDOR in a CQRS query that uses AsNoTracking?',
          difficulty: 'senior',
        },
        {
          q: 'Which OWASP item is UseDeveloperExceptionPage in production?',
          a: 'Security misconfiguration, and it leaks internals that help injection and recon. Also a logging issue if exceptions include connection strings. I use ExceptionHandler + ProblemDetails, and I fail CI if Production still enables Swagger without auth.',
          bangla: 'Misconfiguration — স্ট্যাক ট্রেস লিক। প্রোডে ProblemDetails; ডিবাগ টেলিমেট্রিতে।',
          followUp: 'What should a production 500 contain in the JSON body?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Take your last API and tick OWASP rows with a file/line control. Add a test that user A cannot GET user B\'s order by id.',
      code: `public async Task<IActionResult> Get(int id, CancellationToken ct)
{
    var order = await db.Orders.AsNoTracking()
        .FirstOrDefaultAsync(o => o.Id == id && o.UserId == User.GetUserId(), ct);
    if (order is null) return NotFound();
    return Ok(order);
}`,
    },
    {
      topic: 'SQL Injection, XSS, CSRF, SSRF, and Broken Access Control',
      difficulty: 'senior',
      english:
        'These five show up in every senior interview because they are still how production gets owned. EF Core is not magic if you use FromSqlRaw wrong. XSS is not only MVC if you reflect JSON into a page. CSRF needs cookies. SSRF is the cloud metadata steal. Broken access control is IDOR and missing tenant filters.',
      bangla:
        'SQL injection, XSS, CSRF, SSRF, IDOR — প্রোডাকশন ভাঙার রাস্তা। EF FromSqlRaw, কুকি CSRF, ওয়েবহুক SSRF, টেন্যান্টবিহীন কোয়েরি।',
      details: `
### SQL injection
LINQ to entities parameterizes. Danger: FromSqlRaw with interpolated user input, concatenated ADO.NET, or ORDER BY from query string. **When NOT to panic:** FromSqlInterpolated / FormattableString which still parameterizes. **Failure:** admin search box dumps the database; or second-order injection stored then executed later.

### XSS
Unencoded output in Razor is the classic. APIs that return HTML, or SPA that innerHTML-s a field. Cookie HttpOnly does not stop XSS from acting as the user. CSP headers reduce blast radius.

### CSRF
Browser sends cookies on cross-site POSTs unless SameSite/CSRF tokens stop it. Bearer JWT in a header is not auto-sent — CSRF is weaker, XSS is stronger. **When NOT:** pure bearer API with no cookie auth. **Failure:** cookie-authenticated API with CORS * and no antiforgery.

### SSRF
User supplies a URL (webhook, image fetch, PDF renderer). Server fetches it. Attacker points at 169.254.169.254 or internal Redis. **Fix:** allowlist schemes/hosts, block private IP ranges, no redirects to internal, network egress policies.

### Broken access control
Missing [Authorize], wrong policy, trusting userId from the body, hidden-but-not-protected admin routes, CORS as security. **Failure:** sequential ids + list endpoint that filters in the UI only.
      `,
      commonMistakes: [
        'FromSqlRaw with interpolated user input.',
        'Disabling CSRF for an API that still uses cookies.',
        'Fetching user-supplied URLs without an allowlist.',
        'Authorizing in the SPA router but not on the API.',
      ],
      bestPractices: [
        'Parameterized SQL only; review every Raw method in PRs.',
        'Encode by default; CSP + HttpOnly cookies.',
        'Antiforgery or SameSite for cookie POSTs; never CORS * with credentials.',
        'SSRF: allowlist + block private networks at the HTTP handler.',
        'Every query includes tenant/user predicate; tests as two users.',
      ],
      interviewQs: [
        {
          q: 'Does EF Core mean you cannot have SQL injection?',
          a: 'No. LINQ is safe. FromSqlRaw, ExecuteSqlRaw, and interpolated strings passed to Raw APIs are not. So is any ADO.NET you write. I grep for Raw and for concatenation. Production: a flexible filter that built ORDER BY from query string — injection in the identifier. Use a whitelist of column names.',
          bangla: 'LINQ নিরাপদ; FromSqlRaw/স্ট্রিং জোড়া নয়। ORDER BY ইউজার ইনপুট হলে হোয়াইটলিস্ট।',
          followUp: 'Is FromSqlInterpolated safe? Why?',
          difficulty: 'senior',
        },
        {
          q: 'Why can a JWT API still have CSRF — or why might it not?',
          a: 'CSRF exploits the browser attaching cookies. If the SPA sends Authorization from memory, the browser will not attach it on a foreign form POST, so classic CSRF fails. If you put the JWT in a cookie, you reintroduced CSRF. If you use cookie auth for the API, you need antiforgery or SameSite=Strict and a careful CORS policy. XSS still wins against JWT in JS storage.',
          bangla: 'CSRF কুকি অটো-অ্যাটাচ করে। Bearer হেডার অটো যায় না। JWT কুকিতে রাখলে CSRF ফিরে আসে।',
          followUp: 'SameSite=Lax vs Strict — what still leaks on GET?',
          difficulty: 'senior',
        },
        {
          q: 'Give a production SSRF in a .NET app and the fix.',
          a: 'An invoice feature that rendered a user-supplied logo URL with HttpClient on the server. Attacker used a link-local metadata URL and stole cloud credentials. Fix: allowlist HTTPS hosts we own, resolve DNS and reject private IPs after each redirect, disable automatic redirects or re-validate, and block egress at the firewall. I would not sanitize the URL with a regex alone.',
          bangla: 'ইউজার URL সার্ভার থেকে হিট = SSRF। হোয়াইটলিস্ট, প্রাইভেট IP ব্লক, রিডাইরেক্ট পুনরায় যাচাই, ফায়ারওয়াল ইগ্রেস।',
          followUp: 'How do you safely implement a webhook test URL button?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Replace one FromSqlRaw with LINQ. Add an SSRF-safe HttpClient handler that rejects private IPs. Write an IDOR test for GetOrder.',
      code: `var rows = await db.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE Email = {email}")
    .ToListAsync();

// Unsafe: FromSqlRaw with concatenated user input`,
    },
    {
      topic: 'Secrets, HTTPS, Crypto, Rate Limits, Uploads, Headers, CORS',
      difficulty: 'senior',
      english:
        'Production security is operational: where secrets live, TLS termination, hashing vs encryption, throttling brute force, upload bombs, security headers, and CORS as a browser policy — not an access-control list. Seniors know what belongs in Key Vault versus configuration, and that CORS * never protects a server.',
      bangla:
        'সিক্রেট Key Vault-এ, TLS, হ্যাশ vs এনক্রিপশন, রেট লিমিট, আপলোড, সিকিউরিটি হেডার। CORS ব্রাউজার পলিসি — সার্ভার অথরাইজেশন নয়।',
      details: `
### Secrets
Connection strings, signing keys, client secrets: Key Vault / env / user-secrets locally — never git. Reload on rotation. **Failure:** JWT key in appsettings.json committed; or logging configuration dumps env vars.

### HTTPS
TLS in production; HSTS; cookies Secure. Behind a proxy, set ForwardedHeaders or the app thinks requests are HTTP.

### Encryption vs hashing
Hash passwords and refresh tokens (one-way). Encrypt data you must read back (SSN) with Data Protection or a KMS key. Never encrypt passwords. Never hash data you need to query in reversible form without a plan.

### Rate limiting and brute force
AddRateLimiter on login, refresh, and password reset. Combine with Identity lockout. **When NOT:** global 10 req/s that DoS your own SPA. Partition by IP + user id. **Failure:** limiter keyed only by IP behind NAT (whole office locked).

### File upload
Size limits, content-type allowlist, do not trust extension, store outside web root / in blob with random names, scan, never serve as executable.

### Headers and CORS
HSTS, X-Content-Type-Options, Referrer-Policy, CSP. CORS: explicit origins, not * with credentials. **CORS is not AuthZ** — curl ignores it.
      `,
      commonMistakes: [
        'Secrets in source control or in client-side bundles.',
        'Using encryption for passwords.',
        'CORS AllowAnyOrigin + AllowCredentials.',
        'Trusting Content-Type on uploads; storing under wwwroot with original name.',
        'Rate limit only on the login UI route, not /connect/token.',
      ],
      bestPractices: [
        'Key Vault + managed identity in Azure; no keys on disk.',
        'Hash credentials; encrypt recoverable secrets with KMS.',
        'Rate-limit auth endpoints by IP and client id; monitor 429s.',
        'Upload to blob storage; virus scan; strict size and type.',
        'Explicit CORS origins; security headers via middleware.',
      ],
      interviewQs: [
        {
          q: 'Encryption vs hashing — what do you do with passwords, refresh tokens, and national IDs?',
          a: 'Passwords: slow hash (PBKDF2/Argon2), never encrypt. Refresh tokens: hash at rest so a DB leak is not instant replay. National IDs you must show later: encrypt with a KMS key and tight access; prefer not to store. JWT signing is MAC/signature, not password hashing. Failure: AES-encrypting passwords with a key in appsettings — DB + repo leak = all passwords.',
          bangla: 'পাসওয়ার্ড/রিফ্রেশ = ওয়ান-ওয়ে হ্যাশ। ফেরত দেখাতে হবে এমন PII = KMS এনক্রিপ্ট। পাসওয়ার্ড এনক্রিপ্ট নয়।',
          followUp: 'If you hash refresh tokens, how does rotation work?',
          difficulty: 'senior',
        },
        {
          q: 'Why is CORS not an authorization mechanism?',
          a: 'CORS is enforced by browsers on cross-origin XHR/fetch. Postman, mobile apps, and servers do not care. A stolen bearer token works from anywhere. I still lock CORS down to reduce browser-based abuse, but [Authorize] and resource checks are the real control. Failure: team thinks AllowAnyOrigin is open for now on a cookie API — CSRF from any website.',
          bangla: 'CORS শুধু ব্রাউজার। curl/মোবাইল মানে না। আসল কন্ট্রোল [Authorize]। কুকি API-তে * মানে CSRF।',
          followUp: 'What is the correct CORS setup for a SPA on app.example.com and API on api.example.com with cookies?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Move the JWT key to user-secrets. Add rate limiting on /login and /refresh. Set CORS to one origin with credentials false for a bearer API.',
      code: `builder.Services.AddRateLimiter(o =>
{
    o.AddFixedWindowLimiter("auth", l =>
    {
        l.PermitLimit = 10;
        l.Window = TimeSpan.FromMinutes(1);
        l.QueueLimit = 0;
    });
});

app.MapPost("/login", Login).RequireRateLimiting("auth");

builder.Services.AddCors(o => o.AddPolicy("spa", p =>
    p.WithOrigins("https://app.example.com").WithHeaders("Authorization", "Content-Type")));`,
    },
    {
      topic: 'Enterprise Scenario: Public API, Admin, Refresh Tokens, Key Vault',
      difficulty: 'expert',
      english:
        'A public shop API plus an internal admin portal is the standard senior design question. Different clients, different auth modes, one identity story, secrets in Key Vault, refresh rotation, and blast-radius limits when a token or key leaks.',
      bangla:
        'পাবলিক API + ইন্টারনাল অ্যাডমিন: আলাদা ক্লায়েন্ট, আলাদা অথ, Key Vault, রিফ্রেশ রোটেশন, লিক হলে ব্লাস্ট রেডিয়াস।',
      details: `
### Shape
- **Public API:** mobile + SPA. OIDC/JWT access (5–10 min), rotating refresh hashed in SQL, PKCE for public clients. Permission claims for shopper vs seller.
- **Internal admin:** first-party cookie or VPN + Entra ID (OIDC) with role admin. No long-lived SPA refresh in JS. Prefer BFF or server-rendered admin.
- **Secrets:** signing keys, Stripe, SQL — Key Vault, managed identity, separate vault per environment.
- **Network:** admin not on the public internet if possible; IP allowlist or private link.

### Token design
Separate audiences: shop-api vs admin-api so a stolen shopper token cannot call admin endpoints even if a policy is misconfigured once. Admin tokens shorter, step-up MFA for refunds.

### Failure drills
- Refresh token table leaked: hashes only, rotation reuse detection, force logout.
- JWT signing key leaked: key id (kid) rotation, keep old key for remaining access TTL, then disable.
- XSS on SPA: BFF migration; CSP; short TTL.
- Admin cookie stolen: stamp + short sliding expiry + MFA.

### When NOT
One JWT for all audiences to keep it simple. Admin using the same refresh cookie as the mobile app. Vault in production but connection string still in the deployment YAML in git.
      `,
      commonMistakes: [
        'Same audience and signing key for shopper and admin APIs.',
        'Refresh tokens in SPA localStorage for admin.',
        'Key Vault in prod, secrets still in appsettings.Production.json in the image.',
        'No kid/key rotation plan.',
      ],
      bestPractices: [
        'Audience isolation; admin on a different app registration.',
        'BFF or cookie for admin; PKCE+rotation for public clients.',
        'Managed identity to Key Vault; no secrets in CI logs.',
        'Run a tabletop: leaked refresh, leaked signing key, insider admin.',
      ],
      interviewQs: [
        {
          q: 'Design auth for a public shopping API and an internal admin in .NET.',
          a: 'Two APIs or two audiences. Shoppers: Authorization Code + PKCE, short JWT, rotating hashed refresh, permission claims. Admin: Entra ID or Identity with MFA, cookie/BFF, roles plus resource checks, not reachable without VPN if the org allows. Secrets in Key Vault. I would not share refresh tokens across apps. Failure I plan: stolen shopper refresh cannot mint an admin access token because client_id and audience differ.',
          bangla: 'দুই অডিয়েন্স। শপার: PKCE+ছোট JWT+রোটেটিং refresh। অ্যাডমিন: MFA+কুকি/BFF+VPN। Key Vault। Refresh শেয়ার নয়।',
          followUp: 'How do you rotate the JWT signing key in Key Vault with zero downtime?',
          difficulty: 'expert',
        },
        {
          q: 'A refresh token is stolen from a mobile device. What happens in your design?',
          a: 'Attacker refreshes first: we issue a new refresh, mark the old one used. Legitimate app then presents the old refresh → reuse detected → revoke the whole family, alert, require re-login. Access tokens already issued live until TTL (hence 5–10 minutes). We do not put admin scopes on that family. Device id bound to the family helps you revoke one phone.',
          bangla: 'রোটেশন + রিইউজ ডিটেকশন = ফ্যামিলি রিভোক। অ্যাক্সেস TTL শেষ না হওয়া পর্যন্ত বাঁচে বলে TTL ছোট। অ্যাডমিন স্কোপ নেই।',
          followUp: 'Where do you store the refresh token on mobile vs web BFF?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Sketch two TokenValidationParameters audiences, a RefreshToken table (hash, family id, revoked), and a Key Vault key rotation sequence with kid.',
      code: `public sealed class RefreshToken
{
    public required Guid FamilyId { get; init; }
    public required string TokenHash { get; init; }
    public required string ClientId { get; init; }
    public required DateTimeOffset ExpiresAt { get; init; }
    public bool Revoked { get; set; }
}

o.TokenValidationParameters.ValidAudience = "shop-api";`,
    },
  ],
  quickRevision: {
    concepts: [
      'AuthN who vs AuthZ what; 401 vs 403',
      'Short JWT access + rotating hashed refresh + reuse detection',
      'Policies and permissions scale better than role explosion',
      'Cookies+CSRF for same-site; bearer for APIs; BFF hides refresh',
      'OAuth2 delegates access; OIDC authenticates users; PKCE for public clients',
      'Identity: PBKDF2, stamp, lockout — not SHA256',
      'OWASP maps to IDOR, TLS, injection, headers, SSRF, logging',
      'EF LINQ safe; FromSqlRaw is not; CORS is not AuthZ',
      'Hash passwords/refresh; encrypt recoverable PII; secrets in Key Vault',
      'Separate audiences for public API vs admin',
    ],
    questions: [
      'Why not a 7-day access JWT?',
      'RBAC vs permission policies?',
      'Cookie vs JWT for a Razor app?',
      'OAuth2 vs OIDC for Sign in with Google?',
      'What does Identity lockout not stop?',
      'Map IDOR to [Authorize] that still fails.',
      'Does EF Core prevent SQL injection always?',
      'When is CSRF irrelevant for an API?',
      'Why is CORS not authorization?',
      'Leaked refresh token — what does rotation do?',
    ],
    mistakes: [
      'JWT in localStorage for a browser app',
      'FromSqlRaw with string interpolation',
      'AllowAnyOrigin with credentials',
      'One audience for shopper and admin tokens',
      'Secrets in appsettings committed to git',
    ],
    scenarios: [
      'Fired employee still calls API until JWT exp',
      'Stolen refresh reused — family not revoked',
      'Webhook URL hits cloud metadata (SSRF)',
      'User A loads /orders/12 belonging to user B',
      'Signing key in git — rotate kid without outage',
    ],
  },
  revisionSummary: `
- Tokens: short access JWT, rotating hashed refresh, reuse detection, separate audiences.
- Apps: cookies+CSRF+Identity for first-party web; PKCE/OIDC for public APIs; BFF so browsers never hold refresh.
- Attacks: IDOR first, then injection, XSS, CSRF, SSRF; CORS and headers are supporting controls.
- Ops: Key Vault, HTTPS/HSTS, rate limits on auth, hash vs encrypt correctly.
  `,
  summary:
    'Senior .NET security is AuthN vs AuthZ done with the right credential for the client, OWASP mapped to real ASP.NET controls, and an incident plan for stolen tokens and leaked keys — not a JWT tutorial.',
};
