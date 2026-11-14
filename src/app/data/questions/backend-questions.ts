import { QuizQuestion } from '../quiz-types';
import { q } from './q-helper';

export const BACKEND_QUESTIONS: QuizQuestion[] = [
  // ========================
  // NODE.JS & APIs (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'be-1',
    'backend',
    'Low',
    'HTTP Methods',
    'Which HTTP status code is most appropriate when a POST request successfully creates a new resource?',
    ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
    1,
    '201 Created indicates that the request succeeded and resulted in one or more new resources being created, often accompanied by a Location header.'
  ),
  q(
    'be-2',
    'backend',
    'Low',
    'Idempotency',
    'Which pair of HTTP methods are defined by the HTTP specification as idempotent?',
    ['POST and PATCH', 'GET and POST', 'PUT and DELETE', 'CONNECT and POST'],
    2,
    'PUT replaces a target resource and DELETE removes it; repeating either identical request leaves the server state the same after the first execution.'
  ),
  q(
    'be-3',
    'backend',
    'Low',
    'Node.js Runtime',
    'Which global object in Node.js exposes environment variables, the current working directory, and CLI arguments?',
    ['window', 'process', 'module', 'globalThis.dom'],
    1,
    'The Node.js process object provides process.env, process.cwd(), process.argv, and lifecycle events for the running Node process.'
  ),
  q(
    'be-4',
    'backend',
    'Low',
    'REST Conventions',
    'Which HTTP status code indicates that the client sent valid JSON syntax, yet failed domain validation rules?',
    ['401 Unauthorized', '404 Not Found', '422 Unprocessable Content', '502 Bad Gateway'],
    2,
    '422 Unprocessable Content (WebDAV/HTTP semantics) communicates that the payload syntax was understood but semantic/business validation failed.'
  ),
  q(
    'be-5',
    'backend',
    'Low',
    'Modules',
    'How does Node.js treat files ending in .mjs by default?',
    ['CommonJS modules using require()', 'ECMAScript modules supporting top-level import/export', 'TypeScript source compiled at runtime', 'JSON configuration files'],
    1,
    'Files with the .mjs extension are always parsed as ES modules regardless of the nearest package.json type field.'
  ),
  q(
    'be-6',
    'backend',
    'Medium',
    'Event Loop',
    'In Node.js, which callback queue runs immediately after the current operation completes and before the next event loop phase?',
    ['setTimeout(..., 0)', 'setImmediate()', 'process.nextTick()', 'fs.readFile callback'],
    2,
    'process.nextTick callbacks drain the nextTick queue before moving to any subsequent libuv event loop phase, even ahead of Promise microtasks.'
  ),
  q(
    'be-7',
    'backend',
    'Medium',
    'Streams & Backpressure',
    'Why is readable.pipe(writable) preferred over buffering a 2 GB file into memory before sending an HTTP response?',
    [
      'pipe() compresses data using Brotli automatically',
      'pipe() manages backpressure by pausing reads when the writable buffer is full',
      'pipe() moves execution onto a separate OS thread',
      'Buffer allocation is disabled in Node.js HTTP handlers',
    ],
    1,
    'Streams process chunks incrementally and respect highWaterMark backpressure signals so memory stays bounded regardless of file size.'
  ),
  q(
    'be-8',
    'backend',
    'Medium',
    'Authentication',
    'Why should refresh tokens generally be stored in HttpOnly, Secure cookies rather than localStorage?',
    [
      'Cookies can hold up to 50 MB of token claims',
      'HttpOnly cookies cannot be read by JavaScript, mitigating XSS token theft',
      'localStorage clears automatically on every route change',
      'Browsers encrypt localStorage only on Safari',
    ],
    1,
    'Because JavaScript cannot access document.cookie entries marked HttpOnly, an injected XSS script cannot exfiltrate the long-lived refresh token.'
  ),
  q(
    'be-9',
    'backend',
    'Medium',
    'Concurrency',
    'What is the output order of the following Node.js snippet?',
    ['A, B, C, D', 'A, D, C, B', 'A, D, B, C', 'D, A, C, B'],
    1,
    'Synchronous logs A and D run first, then process.nextTick (C) drains before Promises/microtasks or timers (B).',
    `console.log('A');\nsetTimeout(() => console.log('B'), 0);\nprocess.nextTick(() => console.log('C'));\nconsole.log('D');`
  ),
  q(
    'be-10',
    'backend',
    'Medium',
    'Rate Limiting',
    'Which algorithm allows short bursts up to a capacity while refilling tokens at a steady average rate?',
    ['Fixed Window Counter', 'Token Bucket', 'Round Robin', 'Consistent Hashing'],
    1,
    'A Token Bucket accumulates tokens up to a burst ceiling at a fixed refill rate, gracefully permitting legitimate bursts without starving steady traffic.'
  ),
  q(
    'be-11',
    'backend',
    'High',
    'Event Loop Starvation',
    'What risk arises when a recursive function repeatedly schedules itself with process.nextTick()?',
    [
      'Child processes fail to spawn',
      'I/O callbacks and timers starve because the nextTick queue never empties',
      'V8 immediately terminates with SIGKILL after 10 ticks',
      'TCP sockets switch from keep-alive to UDP',
    ],
    1,
    'Because libuv cannot advance to the poll phase while nextTick continues queueing callbacks, recursive nextTick starves all pending I/O.'
  ),
  q(
    'be-12',
    'backend',
    'High',
    'Worker Threads vs Cluster',
    'When should you choose Node.js worker_threads instead of cluster.fork()?',
    [
      'To scale independent HTTP server processes across ports',
      'To offload CPU-bound computation while sharing ArrayBuffer/SharedArrayBuffer memory',
      'To bypass TLS certificate verification',
      'To run multiple unrelated databases inside V8',
    ],
    1,
    'worker_threads run multiple V8 isolates inside a single process and can share memory via SharedArrayBuffer without IPC serialization overhead.'
  ),
  q(
    'be-13',
    'backend',
    'High',
    'Graceful Shutdown',
    'During a rolling deployment, what is the correct sequence when receiving SIGTERM in a Node.js HTTP server?',
    [
      'Call process.exit(0) immediately to free memory',
      'Stop accepting new connections via server.close(), drain active requests, close DB pools, then exit',
      'Delete node_modules cache before closing sockets',
      'Send 503 to all active sockets mid-flight and restart cluster master',
    ],
    1,
    'Calling server.close() stops new TCP accepts while allowing in-flight HTTP responses to finish cleanly before closing database connections and exiting.'
  ),
  q(
    'be-14',
    'backend',
    'High',
    'Memory Leaks',
    'Which pattern commonly causes silent memory leaks in long-running Node.js services?',
    [
      'Using const instead of let for module constants',
      'Attaching listeners to a global EventEmitter on every request without removing them',
      'Using async/await inside try/catch blocks',
      'Returning JSON.stringify payloads smaller than 1 KB',
    ],
    1,
    'Per-request event listeners retained by a singleton EventEmitter keep closures and request objects alive indefinitely, causing heap growth.'
  ),
  q(
    'be-15',
    'backend',
    'High',
    'Webhook Verification',
    'When verifying an HMAC-SHA256 webhook signature, why should you compare digests with crypto.timingSafeEqual?',
    [
      'It hashes the payload twice faster than ===',
      'It prevents timing side-channel attacks that guess bytes by response latency',
      'It automatically parses base64 signatures into UTF-8',
      'Standard === fails when strings exceed 64 characters',
    ],
    1,
    'Standard string comparison short-circuits on the first mismatched byte; timingSafeEqual executes in constant time regardless of where bytes differ.'
  ),
  q(
    'be-16',
    'backend',
    'High',
    'Idempotency Keys',
    'How should a payment API handle duplicate POST /charges requests carrying the same Idempotency-Key header?',
    [
      'Create a second charge and refund the first asynchronously',
      'Persist the key + request hash + serialized response atomically and replay the stored response',
      'Ignore the header unless the HTTP method is PUT',
      'Reject all retries for 24 hours with 500 Internal Server Error',
    ],
    1,
    'Storing the idempotency key alongside a lock/result ensures concurrent or retried network requests execute the charge at most once and return the identical outcome.'
  ),

  // ========================
  // EXPRESS & NESTJS (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'exp-1',
    'express',
    'Low',
    'Middleware Signature',
    'What are the three parameters of a standard Express request middleware function?',
    ['(ctx, state, done)', '(req, res, next)', '(request, body, reply)', '(app, router, pipe)'],
    1,
    'Standard Express middleware accepts (req, res, next) and invokes next() to pass control to the downstream handler.'
  ),
  q(
    'exp-2',
    'express',
    'Low',
    'Body Parsing',
    'Which built-in middleware parses incoming JSON request bodies in Express 4.16+?',
    ['express.body()', 'express.json()', 'express.urlencoded({ json: true })', 'express.parse()'],
    1,
    'express.json() parses requests with Content-Type: application/json and populates req.body.'
  ),
  q(
    'exp-3',
    'express',
    'Low',
    'Route Parameters',
    'Given app.get("/users/:userId", handler), how do you access the dynamic segment value in Express?',
    ['req.query.userId', 'req.params.userId', 'req.body.userId', 'req.headers.userId'],
    1,
    'Named route segments prefixed with a colon are exposed on req.params.'
  ),
  q(
    'exp-4',
    'express',
    'Low',
    'NestJS Building Blocks',
    'In NestJS, which decorator marks a class so it can be managed by the Dependency Injection container as a provider?',
    ['@Module()', '@Controller()', '@Injectable()', '@InjectProvider()'],
    2,
    '@Injectable() attaches metadata letting the NestJS IoC container instantiate and inject the service into controllers or other providers.'
  ),
  q(
    'exp-5',
    'express',
    'Low',
    'Express Router',
    'What is the primary benefit of express.Router() in larger codebases?',
    [
      'It compiles routes into WebAssembly',
      'It creates modular, mountable route handlers with scoped middleware',
      'It replaces HTTP with gRPC automatically',
      'It caches every GET response in Redis',
    ],
    1,
    'express.Router() acts like a mini-application allowing feature-based route separation and router-level middleware before mounting on app.use().'
  ),
  q(
    'exp-6',
    'express',
    'Medium',
    'Error Middleware',
    'How does Express distinguish an error-handling middleware from a normal middleware function?',
    [
      'By checking if the function is async',
      'By its arity of four parameters: (err, req, res, next)',
      'By registering it with app.error()',
      'By returning a Promise rejection string',
    ],
    1,
    'Express inspects Function.length; only middleware functions declared with 4 parameters (err, req, res, next) receive errors passed via next(err).'
  ),
  q(
    'exp-7',
    'express',
    'Medium',
    'Async Error Handling',
    'In Express 4, what happens if an async route handler throws an error without try/catch calling next(err)?',
    [
      'Express catches it and invokes the 4-arg error middleware automatically',
      'Express 4 ignores the rejected promise, leaving the request hanging or crashing the process',
      'Express retries the route three times',
      'req.statusCode becomes 400 automatically',
    ],
    1,
    'Express 4 does not await route handlers; unhandled rejections must be forwarded to next(err) (which Express 5 handles natively).'
  ),
  q(
    'exp-8',
    'express',
    'Medium',
    'NestJS Lifecycle Order',
    'In NestJS, in what order do request pipeline primitives execute before a controller route handler?',
    [
      'Pipes -> Guards -> Interceptors -> Middleware',
      'Middleware -> Guards -> Interceptors (before) -> Pipes -> Handler',
      'Guards -> Middleware -> Pipes -> Exception Filters',
      'Interceptors -> Middleware -> Pipes -> Guards',
    ],
    1,
    'NestJS executes Middleware first, then Guards (authorization), then Interceptors (pre-handler), then Pipes (validation/transformation), then the route handler.'
  ),
  q(
    'exp-9',
    'express',
    'Medium',
    'DTO Validation',
    'In NestJS with ValidationPipe({ whitelist: true, transform: true }), what does whitelist: true enforce?',
    [
      'Only authenticated admins can call the endpoint',
      'Properties without class-validator decorators are stripped from the incoming payload',
      'All query parameters become required',
      'CORS allows every origin in a whitelist file',
    ],
    1,
    'whitelist: true strips unannotated properties from DTOs, preventing mass-assignment bugs where attackers inject unexpected fields like isAdmin.'
  ),
  q(
    'exp-10',
    'express',
    'Medium',
    'CORS Middleware',
    'Why can setting cors({ origin: "*", credentials: true }) fail in modern browsers?',
    [
      'CORS forbids GET requests with credentials',
      'The Fetch/CORS spec disallows wildcard * Access-Control-Allow-Origin when Access-Control-Allow-Credentials is true',
      'Express removes cookies whenever cors() is used',
      'Browsers only accept CORS headers on HTTP 204',
    ],
    1,
    'Browsers reject credentialed responses if Access-Control-Allow-Origin is *; the server must reflect an explicit, allowlisted origin.'
  ),
  q(
    'exp-11',
    'express',
    'High',
    'Trust Proxy',
    'Why must app.set("trust proxy", 1) be configured carefully behind an NGINX/ALB reverse proxy in Express?',
    [
      'Without it, req.ip shows the proxy IP, breaking IP-based rate limits and req.protocol checks',
      'Without it, Express refuses TLS connections',
      'It enables HTTP/3 on localhost',
      'It disables X-Powered-By headers automatically',
    ],
    0,
    'Enabling trust proxy instructs Express to read X-Forwarded-For / X-Forwarded-Proto from trusted hops; setting it to true blindly lets clients spoof IPs.'
  ),
  q(
    'exp-12',
    'express',
    'High',
    'NestJS Circular Dependencies',
    'What is the cleanest architectural fix for a circular dependency between UsersService and OrdersService in NestJS?',
    [
      'Always wrap every constructor parameter in forwardRef() across 10 modules',
      'Extract shared domain logic or persistence into a third module/event bus so dependencies form a DAG',
      'Store instances on globalThis inside main.ts',
      'Disable TypeScript strictNullChecks',
    ],
    1,
    'While forwardRef() works as a last resort, refactoring shared logic into a lower-level service or domain events eliminates cycles cleanly.'
  ),
  q(
    'exp-13',
    'express',
    'High',
    'Request Scoped Providers',
    'What is the performance trade-off of marking a NestJS provider with Scope.REQUEST?',
    [
      'It disables async/await inside that class',
      'Every dependent controller and service up the injection tree becomes request-scoped and re-instantiated per HTTP call',
      'It locks the SQLite database during reads',
      'Guards stop executing for that route',
    ],
    1,
    'Request scope bubbles upward through the dependency graph, increasing GC pressure and allocation overhead under high QPS compared to AsyncLocalStorage.'
  ),
  q(
    'exp-14',
    'express',
    'High',
    'Helmet & Headers',
    'What issue happens in Express if a downstream handler calls res.json() after another middleware already sent headers?',
    [
      'Express merges both JSON payloads',
      'Node throws ERR_HTTP_HEADERS_SENT ("Cannot set headers after they are sent to the client")',
      'The browser receives HTTP 206 Partial Content',
      'Express silently ignores the second call without logging',
    ],
    1,
    'Once HTTP headers and body begin flushing, calling res.json/res.send again throws ERR_HTTP_HEADERS_SENT unless early returns or res.headersSent guards are used.'
  ),
  q(
    'exp-15',
    'express',
    'High',
    'Fastify Adapter',
    'When migrating a NestJS API from ExpressAdapter to FastifyAdapter, which common assumption breaks?',
    [
      'Dependency injection stops working in feature modules',
      'Express-specific req/res APIs and third-party Express middleware signatures (like res.locals or cookie-parser) differ',
      'RxJS Observables cannot be returned from controllers',
      'Swagger decorators stop generating OpenAPI schemas',
    ],
    1,
    'NestJS abstracts most handlers, but code directly touching Express req/res methods or Express-only middleware must be adapted for Fastify hooks/replies.'
  ),
  q(
    'exp-16',
    'express',
    'High',
    'Payload DoS Protection',
    'Which middleware configuration protects an Express API from oversized JSON memory exhaustion attacks?',
    [
      'express.json({ limit: "100kb" }) combined with timeout handling',
      'app.disable("etag")',
      'express.static("public", { maxAge: 0 })',
      'app.use(express.raw({ inflate: true }))',
    ],
    0,
    'Constraining body parser limits (e.g., 100kb) rejects huge payloads with 413 Payload Too Large before buffering excessive memory.'
  ),

  // ========================
  // GRAPHQL APIs (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'gql-1',
    'graphql',
    'Low',
    'Operations',
    'What are the three root operation types defined in GraphQL?',
    ['GET, POST, PUT', 'Query, Mutation, Subscription', 'Select, Insert, Stream', 'Schema, Type, Resolver'],
    1,
    'GraphQL operations consist of Query (reads), Mutation (writes), and Subscription (real-time event streams).'
  ),
  q(
    'gql-2',
    'graphql',
    'Low',
    'Non-Nullability',
    'In GraphQL SDL, what does the exclamation mark in `users: [User!]!` signify?',
    [
      'The field is deprecated',
      'Both the list itself and every User element inside the list cannot be null',
      'The field requires administrator permissions',
      'The list is automatically paginated',
    ],
    1,
    'The inner ! forbids null elements inside the array, and the outer ! guarantees the field itself always resolves to an array (possibly empty).'
  ),
  q(
    'gql-3',
    'graphql',
    'Low',
    'Over-fetching',
    'How does GraphQL solve over-fetching compared to fixed REST endpoints?',
    [
      'It compresses every response using gzip twice',
      'Clients declare the exact fields needed in the selection set, and the server returns only those fields',
      'It caches responses in browser IndexedDB',
      'It limits queries to 3 fields max',
    ],
    1,
    'Clients specify exact nested fields in the query document, avoiding unused payload bytes and multiple round trips.'
  ),
  q(
    'gql-4',
    'graphql',
    'Low',
    'Variables',
    'Why should dynamic input values be passed via GraphQL $variables instead of string-interpolating them into the query?',
    [
      'Variables skip schema validation',
      'Variables enable query parsing/caching, prevent injection bugs, and enforce SDL type checks',
      'GraphQL rejects queries without at least one variable',
      'Variables convert queries into HTTP GET requests automatically',
    ],
    1,
    'Parameterized $variables keep the query document static for AST caching and let the GraphQL engine validate types safely.'
  ),
  q(
    'gql-5',
    'graphql',
    'Low',
    'Fragments',
    'What is the purpose of a GraphQL fragment?',
    [
      'Splitting a schema across multiple databases',
      'Reusing a named set of fields across multiple queries or mutations',
      'Running SQL joins inside the browser',
      'Disabling caching for sensitive fields',
    ],
    1,
    'Fragments extract shared selection sets (often co-located with UI components) to avoid repeating fields.'
  ),
  q(
    'gql-6',
    'graphql',
    'Medium',
    'Resolver Arguments',
    'What are the four standard positional arguments received by a GraphQL resolver function in JavaScript?',
    [
      '(req, res, ctx, next)',
      '(parent, args, context, info)',
      '(root, variables, headers, ast)',
      '(schema, query, user, cache)',
    ],
    1,
    'Resolvers receive parent (resolved parent object), args (field arguments), context (shared per-request auth/loaders), and info (AST & execution metadata).'
  ),
  q(
    'gql-7',
    'graphql',
    'Medium',
    'N+1 Problem',
    'How does the DataLoader pattern eliminate the N+1 query problem in GraphQL field resolvers?',
    [
      'By caching every database table in client localStorage',
      'By batching keys requested within a single event-loop tick into one bulk query and memoizing per request',
      'By disabling nested object resolvers',
      'By converting GraphQL into REST endpoints',
    ],
    1,
    'DataLoader collects individual .load(id) calls queued in the same tick and dispatches a single batch function (e.g., WHERE id IN (...)).'
  ),
  q(
    'gql-8',
    'graphql',
    'Medium',
    'Cursor Pagination',
    'Why does the Relay Connection specification prefer cursor-based pagination (first/after) over offset/limit?',
    [
      'Cursors require no database indexes',
      'Cursor pagination avoids skipped or duplicated items when rows are inserted or deleted concurrently',
      'Offset pagination is illegal in GraphQL SDL',
      'Cursors automatically encrypt user IDs',
    ],
    1,
    'Offset-based pages drift when records shift; keyset/cursor pagination anchors to an item cursor for stable slices and fast indexed seeks.'
  ),
  q(
    'gql-9',
    'graphql',
    'Medium',
    'Unions vs Interfaces',
    'When should you model a GraphQL return type as an Interface rather than a Union?',
    [
      'When the concrete types share common fields that clients can query directly',
      'When types have zero overlapping fields',
      'When returning scalar values like Int or String',
      'When writing Subscriptions',
    ],
    0,
    'Interfaces define shared fields (e.g., Node { id: ID! }) queryable without inline fragments, whereas Unions group unrelated object types.'
  ),
  q(
    'gql-10',
    'graphql',
    'Medium',
    'Error Handling',
    'How can GraphQL express partial success on a Query when one non-critical sub-field fails?',
    [
      'Return HTTP 500 with an empty body',
      'Make the sub-field nullable so the response includes partial `data` alongside an `errors` array',
      'Throw an uncaught exception from the root resolver',
      'Return an empty array with HTTP 404',
    ],
    1,
    'GraphQL bubbles null up only to the nearest nullable parent, allowing resilient UIs to render resolved fields while inspecting errors[].'
  ),
  q(
    'gql-11',
    'graphql',
    'High',
    'Query Depth & Complexity Attacks',
    'Which defense protects a public GraphQL endpoint from deeply nested circular queries like user { friends { friends { ... } } }?',
    [
      'Enabling gzip compression',
      'Enforcing query depth limits, cost/complexity analysis, and persisted queries',
      'Turning off introspection without any rate limits',
      'Returning 200 OK for malformed ASTs',
    ],
    1,
    'Depth limiting and static query cost calculation reject exponential ASTs before resolvers run; persisted queries allowlist known operations in production.'
  ),
  q(
    'gql-12',
    'graphql',
    'High',
    'HTTP Caching',
    'Why is standard CDN HTTP caching harder with GraphQL POST requests, and how do teams solve it?',
    [
      'Browsers cannot parse JSON over HTTPS',
      'POST bodies are rarely keyed by CDNs; Automatic Persisted Queries (APQ) over HTTP GET enable CDN cache keys',
      'GraphQL disables ETag headers by design',
      'CDNs reject application/graphql responses',
    ],
    1,
    'Using APQ (sending an operation hash via HTTP GET) allows CDNs and browsers to cache GraphQL read queries via URL + cache-control directives.'
  ),
  q(
    'gql-13',
    'graphql',
    'High',
    'Apollo Federation',
    'In Apollo Federation, what does the `@key(fields: "id")` directive on an entity type allow?',
    [
      'It encrypts the id field at rest',
      'It enables different subgraphs to reference and extend the same entity across service boundaries',
      'It creates a primary key index in MongoDB',
      'It restricts queries to authenticated service accounts',
    ],
    1,
    '@key defines the entity primary key so the router/gateway can resolve fields contributed by multiple independent subgraphs via _entities.'
  ),
  q(
    'gql-14',
    'graphql',
    'High',
    'DataLoader Scoping',
    'Why must a DataLoader instance be created fresh per incoming request in GraphQL context rather than globally?',
    [
      'DataLoader leaks memory and serves stale or unauthorized data across users if shared globally',
      'Node throws a SyntaxError if DataLoader is constructed outside a resolver',
      'Global DataLoaders disable batching',
      'Subscriptions cannot use global variables',
    ],
    0,
    'DataLoader caches resolved promises by key for its lifetime; sharing one instance across requests exposes user A cached records to user B.'
  ),
  q(
    'gql-15',
    'graphql',
    'High',
    'Schema Evolution',
    'What is the recommended way to retire a legacy field in a production GraphQL schema without breaking existing mobile clients?',
    [
      'Delete the field immediately and bump HTTP path to /v2',
      'Add a replacement field, mark the old field `@deprecated(reason: "...")`, and monitor field usage telemetry before removal',
      'Rename the field in-place and return null',
      'Convert the field into a Mutation',
    ],
    1,
    'GraphQL encourages additive evolution: deprecate old fields cleanly, track resolver telemetry, and remove them only once client traffic reaches zero.'
  ),
  q(
    'gql-16',
    'graphql',
    'High',
    'Mutation Design',
    'Why is returning a typed Payload object (e.g., `UpdateUserPayload { user: User, errors: [UserError!]! }`) preferred for Mutations?',
    [
      'It avoids HTTP headers completely',
      'It keeps domain validation errors structured and type-safe inside the schema rather than unstructured top-level errors',
      'GraphQL forbids mutations from returning scalar booleans',
      'It prevents N+1 queries inside Subscriptions',
    ],
    1,
    'Modeling expected domain failures as typed union/payload errors lets clients handle field-level validation with full TypeScript codegen safety.'
  ),

  // ========================
  // PYTHON & FASTAPI (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'py-1',
    'python-api',
    'Low',
    'FastAPI Core',
    'Which two Python libraries power FastAPI routing and schema validation under the hood?',
    ['Flask and Marshmallow', 'Starlette and Pydantic', 'Django and SQLAlchemy', 'Tornado and Cerberus'],
    1,
    'FastAPI builds on Starlette for high-performance ASGI web handling and Pydantic for type-annotated validation and OpenAPI generation.'
  ),
  q(
    'py-2',
    'python-api',
    'Low',
    'Path Parameters',
    'In FastAPI, what happens automatically when a path parameter is typed as `item_id: int` and the client requests `/items/abc`?',
    [
      'item_id becomes NaN',
      'FastAPI returns a 422 validation error explaining item_id must be a valid integer',
      'Python converts "abc" using ASCII codes',
      'The server restarts with an unhandled ValueError',
    ],
    1,
    'Pydantic validates path, query, and body parameters against Python type hints and responds with structured 422 JSON errors on mismatch.'
  ),
  q(
    'py-3',
    'python-api',
    'Low',
    'Interactive Docs',
    'Which two interactive API documentation endpoints does FastAPI expose out of the box?',
    ['/api-docs and /graphiql', '/docs (Swagger UI) and /redoc (ReDoc)', '/swagger.yaml and /help', '/openapi and /playground'],
    1,
    'FastAPI automatically generates an OpenAPI schema at /openapi.json and serves Swagger UI at /docs and ReDoc at /redoc.'
  ),
  q(
    'py-4',
    'python-api',
    'Low',
    'Virtual Environments',
    'Why should Python projects isolate dependencies using `venv`, Poetry, or `uv`?',
    [
      'Python cannot run without a .venv folder',
      'To avoid dependency version conflicts with system Python and other projects',
      'Virtual environments compile Python directly to machine code',
      'uvicorn refuses to bind port 8000 outside venv',
    ],
    1,
    'Isolated virtual environments pin exact package versions per project without polluting global site-packages.'
  ),
  q(
    'py-5',
    'python-api',
    'Low',
    'Pydantic Models',
    'What is the standard base class inherited by request and response schemas in Pydantic v2?',
    ['SchemaModel', 'BaseModel', 'DataContract', 'TypedDictModel'],
    1,
    'Subclassing pydantic.BaseModel provides validation, serialization (model_dump()), and JSON Schema generation.'
  ),
  q(
    'py-6',
    'python-api',
    'Medium',
    'Async vs Sync Endpoints',
    'In FastAPI, what happens if you perform a blocking `time.sleep(5)` or synchronous `requests.get()` inside an `async def` route?',
    [
      'FastAPI moves it to a thread pool automatically',
      'It blocks the entire asyncio event loop, stalling concurrent requests on that worker',
      'Python spawns a new process for that function',
      'Pydantic converts requests.get into httpx asynchronously',
    ],
    1,
    'FastAPI runs regular `def` routes in an AnyIO worker threadpool, whereas `async def` routes run directly on the event loop—blocking calls inside `async def` freeze all coroutines.'
  ),
  q(
    'py-7',
    'python-api',
    'Medium',
    'Dependency Injection',
    'What is the key advantage of using `yield` inside a FastAPI `Depends()` dependency (like `get_db`)?',
    [
      'It streams CSV rows to the client',
      'Code after `yield` executes as teardown after the response is sent (e.g., closing a DB session)',
      'It caches the dependency forever in memory',
      'It converts the route into a WebSocket',
    ],
    1,
    'Dependencies with yield behave like context managers: setup runs before the endpoint, and the finally/post-yield block cleans up resources afterward.'
  ),
  q(
    'py-8',
    'python-api',
    'Medium',
    'Response Filtering',
    'How do you prevent sensitive fields like `hashed_password` on a DB model from leaking in a FastAPI JSON response?',
    [
      'Use `response_model=UserPublic` on the route decorator',
      'Encrypt the JSON string with base64',
      'Return status_code=201',
      'Set `allow_population_by_field_name=False`',
    ],
    0,
    'Declaring response_model filters, validates, and serializes only the fields defined on the public output schema.'
  ),
  q(
    'py-9',
    'python-api',
    'Medium',
    'WSGI vs ASGI',
    'Why does FastAPI require an ASGI server (like Uvicorn or Hypercorn) instead of a classic WSGI server?',
    [
      'WSGI only works on Windows',
      'ASGI supports async/await coroutines, HTTP/2, and WebSockets natively, while WSGI is synchronous request/response only',
      'WSGI cannot serialize JSON payloads',
      'Uvicorn bypasses the Python GIL completely',
    ],
    1,
    'ASGI (Asynchronous Server Gateway Interface) handles non-blocking I/O, long-lived WebSockets, and lifespan startup/shutdown hooks.'
  ),
  q(
    'py-10',
    'python-api',
    'Medium',
    'Background Tasks',
    'When is FastAPI `BackgroundTasks` appropriate vs a dedicated queue like Celery/ARQ?',
    [
      'BackgroundTasks guarantees delivery across server crashes',
      'BackgroundTasks fits lightweight post-response work (like sending a quick email), whereas durable retries/heavy jobs need a brokered worker queue',
      'Celery only supports Django',
      'BackgroundTasks executes in the browser service worker',
    ],
    1,
    'BackgroundTasks runs in-process after returning the response; if the container restarts, queued tasks are lost unless persisted in Redis/RabbitMQ.'
  ),
  q(
    'py-11',
    'python-api',
    'High',
    'GIL & Worker Scaling',
    'How do you scale a FastAPI service to utilize multiple CPU cores on a 4-vCPU container?',
    [
      'Run a single `uvicorn` process with `--loop uvloop` only',
      'Run multiple worker processes (e.g., `gunicorn -k uvicorn.workers.UvicornWorker -w 4` or horizontal pod replicas)',
      'Replace `async def` with `threading.Thread` inside one process',
      'Disable Pydantic validation in production',
    ],
    1,
    'Because CPython has the Global Interpreter Lock (GIL), each worker process gets its own interpreter and CPU core; multiple workers or pods scale across cores.'
  ),
  q(
    'py-12',
    'python-api',
    'High',
    'SQLAlchemy Async Gotcha',
    'Why does accessing a lazy-loaded relationship (`user.orders`) raise `MissingGreenlet` in Async SQLAlchemy?',
    [
      'SQLAlchemy forbids foreign keys in PostgreSQL',
      'Lazy loading triggers implicit synchronous I/O inside an async greenlet; explicit eager loading (`selectinload`/`joinedload`) is required',
      'FastAPI strips attributes named orders',
      'Pydantic v2 does not allow list attributes',
    ],
    1,
    'AsyncSession prohibits implicit lazy queries during attribute access; always load needed relationships explicitly using selectinload() or joinedload().'
  ),
  q(
    'py-13',
    'python-api',
    'High',
    'Lifespan Events',
    'What is the modern FastAPI pattern for initializing and closing shared HTTP clients or ML models once at startup/shutdown?',
    [
      'Initialize them inside every endpoint function',
      'Pass an `@asynccontextmanager` `lifespan` handler to `FastAPI(lifespan=...)`',
      'Use `importlib.reload()` on each request',
      'Store connections inside Pydantic `Field()` defaults',
    ],
    1,
    'The lifespan async context manager replaces legacy @app.on_event hooks, cleanly pairing startup resource creation with guaranteed shutdown cleanup.'
  ),
  q(
    'py-14',
    'python-api',
    'High',
    'Dependency Caching',
    'Within a single HTTP request, if three dependencies all call `Depends(get_current_user)`, how many times does `get_current_user` run by default?',
    ['Three times', 'Once, because FastAPI caches dependency results per request unless `use_cache=False`', 'Zero times if cached in Redis', 'Once per server startup'],
    1,
    'FastAPI memoizes dependency return values within the scope of a single request by default, avoiding redundant DB/JWT lookups.'
  ),
  q(
    'py-15',
    'python-api',
    'High',
    'Pydantic v2 Performance',
    'Why is Pydantic v2 significantly faster than Pydantic v1 for high-throughput FastAPI endpoints?',
    [
      'It skips type validation on nested dicts',
      'Its core validation and JSON serialization engine (`pydantic-core`) is compiled in Rust',
      'It disables UTF-8 string decoding',
      'It runs only on PyPy',
    ],
    1,
    'pydantic-core moves schema parsing, validation, and model_dump_json() into Rust, yielding 5x–20x speedups over v1.'
  ),
  q(
    'py-16',
    'python-api',
    'High',
    'Annotated Dependencies',
    'In modern FastAPI (0.95+), why is `Annotated[User, Depends(get_current_user)]` preferred over `user: User = Depends(...)`?',
    [
      'It disables OpenAPI generation',
      'It preserves valid Python typing so functions stay reusable outside FastAPI and type aliases can be shared cleanly',
      'It forces synchronous execution',
      'It encrypts the dependency return value',
    ],
    1,
    'Using typing.Annotated lets you define reusable aliases like `CurrentUser = Annotated[User, Depends(get_current_user)]` without mutating default parameter semantics.'
  ),

  // ========================
  // WEBSOCKETS & REAL-TIME (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'ws-1',
    'websockets',
    'Low',
    'Handshake',
    'How does a WebSocket connection begin between a browser and a server?',
    [
      'Via a raw UDP packet to port 80',
      'As an HTTP/1.1 GET request with `Upgrade: websocket` and `Connection: Upgrade` headers',
      'Via an SMTP STARTTLS command',
      'By polling /ws every 50ms',
    ],
    1,
    'WebSockets start with an HTTP Upgrade handshake; if accepted, the server responds with 101 Switching Protocols and keeps the TCP socket full-duplex.'
  ),
  q(
    'ws-2',
    'websockets',
    'Low',
    'Status Code',
    'Which HTTP status code confirms a successful WebSocket upgrade handshake?',
    ['200 OK', '101 Switching Protocols', '202 Accepted', '307 Temporary Redirect'],
    1,
    '101 Switching Protocols tells the client the connection has transitioned from HTTP to the binary/text WebSocket framing protocol.'
  ),
  q(
    'ws-3',
    'websockets',
    'Low',
    'SSE vs WebSockets',
    'When is Server-Sent Events (SSE) often simpler and better suited than WebSockets?',
    [
      'When building a 60 FPS multiplayer binary game',
      'When you only need unidirectional server-to-client streaming (like live feeds or LLM token streaming) over standard HTTP',
      'When clients must send binary audio streams continuously',
      'When browser support for HTTP is unavailable',
    ],
    1,
    'SSE works over plain HTTP with built-in automatic reconnection and Last-Event-ID resumption, ideal for server-to-client streams.'
  ),
  q(
    'ws-4',
    'websockets',
    'Low',
    'Client API',
    'Which browser Event fires when a WebSocket receives a frame from the server?',
    ['onreceive', 'onmessage', 'ondata', 'onstream'],
    1,
    'The WebSocket `message` event (ws.onmessage / addEventListener("message", ...)) delivers event.data containing text or binary payloads.'
  ),
  q(
    'ws-5',
    'websockets',
    'Low',
    'Secure Transport',
    'What protocol scheme must be used for WebSockets on an HTTPS origin?',
    ['ws://', 'wss://', 'https://', 'tcp://'],
    1,
    'Browsers block insecure ws:// connections from HTTPS pages (mixed content); wss:// wraps WebSocket frames over TLS.'
  ),
  q(
    'ws-6',
    'websockets',
    'Medium',
    'Heartbeats',
    'Why do production WebSocket servers implement periodic Ping/Pong heartbeats?',
    [
      'To encrypt messages faster',
      'To detect half-open dead TCP connections and prevent idle load balancers from silently dropping the socket',
      'To increase message payload size limits',
      'To convert text frames into JSON automatically',
    ],
    1,
    'Proxies and NAT gateways drop idle connections silently; Ping/Pong frames verify liveness and keep idle timeouts reset.'
  ),
  q(
    'ws-7',
    'websockets',
    'Medium',
    'Reconnection Strategy',
    'What happens if 50,000 WebSocket clients reconnect simultaneously after a server restart using a fixed 1-second timer?',
    [
      'The server recovers twice as fast',
      'A thundering herd overwhelms the backend; exponential backoff with random jitter is required',
      'Browsers automatically stagger sockets by 10 minutes',
      'TCP rejects every odd-numbered client',
    ],
    1,
    'Exponential backoff with randomized jitter spreads reconnection bursts smoothly across time, preventing cascading outages.'
  ),
  q(
    'ws-8',
    'websockets',
    'Medium',
    'Horizontal Scaling',
    'If User A connects to Pod 1 and User B connects to Pod 2, how do they exchange WebSocket messages in a multi-instance cluster?',
    [
      'In-memory Map<socketId> syncs across pods automatically',
      'Pods publish/subscribe via a shared backplane like Redis Pub/Sub, NATS, or Kafka',
      'User A opens a direct peer-to-peer HTTP port to Pod 2',
      'WebSockets can only run on a single server',
    ],
    1,
    'Each server only holds local socket descriptors; a Pub/Sub broker fans out room/channel events across all connected nodes.'
  ),
  q(
    'ws-9',
    'websockets',
    'Medium',
    'WebSocket Authentication',
    'Why is putting a long-lived JWT directly inside a `wss://api.example.com/ws?token=...` query string discouraged in production?',
    [
      'WebSockets ignore query strings during handshake',
      'Query strings leak in proxy access logs, browser history, and APM traces',
      'JWTs cannot contain dots in URLs',
      'TLS does not encrypt URL query parameters',
    ],
    1,
    'Prefer HttpOnly session cookies during the upgrade handshake or short-lived single-use tickets exchanged over an authenticated HTTPS POST first.'
  ),
  q(
    'ws-10',
    'websockets',
    'Medium',
    'Backpressure',
    'In Node.js `ws`, what property helps detect that a slow consumer socket is falling behind on outbound writes?',
    ['ws.readyState', 'ws.bufferedAmount', 'ws.protocol', 'ws.extensions'],
    1,
    'Monitoring ws.bufferedAmount warns when outbound frames queue up faster than the client drains them, letting the server drop stale updates or close slow sockets.'
  ),
  q(
    'ws-11',
    'websockets',
    'High',
    'Proxy Buffering & Timeouts',
    'When deploying WebSockets or SSE behind NGINX, why can connections fail or stall unless proxy headers/settings are adjusted?',
    [
      'NGINX converts GET to HEAD',
      'NGINX defaults to HTTP/1.0 without Upgrade/Connection headers and has proxy_read_timeout (60s) + proxy_buffering on',
      'NGINX blocks port 443 for WebSockets',
      'NGINX strips JSON payloads larger than 512 bytes',
    ],
    1,
    'Proxies must forward Upgrade/Connection headers over HTTP/1.1, disable response buffering for SSE, and tune idle read timeouts alongside heartbeats.'
  ),
  q(
    'ws-12',
    'websockets',
    'High',
    'Ordering & Delivery Guarantees',
    'What happens to WebSocket frames sent while a client briefly loses cellular signal before TCP detects the disconnect?',
    [
      'The server automatically replays missed messages once the client opens a new socket',
      'Frames sent on the dying socket are lost unless application-level sequence IDs/acks + replay buffers are implemented',
      'WebSockets persist frames to client IndexedDB automatically',
      'HTTP 101 guarantees zero message loss across disconnects',
    ],
    1,
    'TCP/WebSocket only orders bytes within a single live connection; resilient real-time systems attach monotonic sequence numbers and replay missed events on reconnect.'
  ),
  q(
    'ws-13',
    'websockets',
    'High',
    'Conflict Resolution',
    'In a collaborative whiteboard or text editor, why are CRDTs or Operational Transformation (OT) used over naive "last-write-wins"?',
    [
      'They reduce WebSocket frame headers to 1 byte',
      'They allow concurrent offline/online edits from multiple users to converge deterministically without overwriting peers’ changes',
      'They replace the need for a database',
      'They encrypt payloads end-to-end',
    ],
    1,
    'CRDTs mathematically guarantee eventual consistency across concurrent edits regardless of network arrival order.'
  ),
  q(
    'ws-14',
    'websockets',
    'High',
    'Fan-Out Bottleneck',
    'When broadcasting a live sports ticker update to 200,000 concurrent sockets, what optimization minimizes Node.js CPU overhead?',
    [
      'Call JSON.stringify(event) inside the loop for each of the 200,000 sockets',
      'Serialize the JSON/binary payload once outside the loop (and pre-compress/chunk) before writing to sockets',
      'Use synchronous fs.writeSync per socket',
      'Open a new database connection per recipient',
    ],
    1,
    'Serializing once (or using uWebSockets.js / native pub-sub topics) avoids 200,000 redundant JSON string allocations and GC pauses.'
  ),
  q(
    'ws-15',
    'websockets',
    'High',
    'CSWSH Security',
    'What is Cross-Site WebSocket Hijacking (CSWSH) and how do you prevent it?',
    [
      'Injecting SQL into binary frames; prevent with parameterized SQL',
      'A malicious site opening a ws:// connection using the victim’s cookies; prevent by strictly validating the HTTP Origin header (and CSRF token) on upgrade',
      'Stealing TLS keys via Ping frames; prevent by disabling Ping',
      'Replay attacks on UDP; prevent with WSS',
    ],
    1,
    'Browsers send cookies on cross-origin WebSocket upgrades without CORS preflight; servers must verify req.headers.origin against an allowlist.'
  ),
  q(
    'ws-16',
    'websockets',
    'High',
    'Presence Tracking',
    'What is the cleanest scalable pattern for tracking "online / typing" user presence across clustered WebSocket servers?',
    [
      'Run UPDATE users SET online = true in PostgreSQL every second per socket',
      'Store ephemeral user heartbeats in Redis with short TTLs (e.g., 30s) and expire stale entries automatically',
      'Broadcast every user list over DNS TXT records',
      'Poll /users/online from every browser every 200ms',
    ],
    1,
    'Redis keys/sorted-sets with TTLs handle high-churn ephemeral presence without hammering primary relational databases or leaving ghost online states on pod crash.'
  ),

  // ========================
  // MICROSERVICES & QUEUES (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'ms-1',
    'microservices',
    'Low',
    'Bounded Contexts',
    'In microservices architecture, why should each service own its own database schema rather than sharing tables?',
    [
      'So teams can deploy and evolve schemas independently without tight coupling',
      'Because SQL joins are slower than HTTP calls',
      'Docker forbids multiple containers connecting to Postgres',
      'Microservices cannot use relational databases',
    ],
    0,
    'Database-per-service prevents hidden coupling across team schemas and allows each service to pick the right storage engine and scale independently.'
  ),
  q(
    'ms-2',
    'microservices',
    'Low',
    'API Gateway',
    'What role does an API Gateway play in front of internal microservices?',
    [
      'Replaces unit tests across services',
      'Provides a single entry point for routing, TLS termination, auth verification, and rate limiting',
      'Stores all long-term relational tables',
      'Eliminates the need for health checks',
    ],
    1,
    'An API Gateway centralizes cross-cutting edge concerns (routing, auth, rate limits, observability) so internal services stay focused on business logic.'
  ),
  q(
    'ms-3',
    'microservices',
    'Low',
    'Async Messaging',
    'Why use a message queue (RabbitMQ, SQS, Kafka) instead of synchronous HTTP between OrderService and EmailService?',
    [
      'EmailService runs only in the browser',
      'Decouples availability, absorbs traffic spikes, and prevents slow downstream email providers from blocking checkout latency',
      'Queues guarantee zero code bugs',
      'HTTP cannot send JSON payloads over 1 KB',
    ],
    1,
    'Asynchronous queuing shields critical checkout latency from transient downstream slowness and enables safe background retries.'
  ),
  q(
    'ms-4',
    'microservices',
    'Low',
    'Dead Letter Queue',
    'What is the purpose of a Dead Letter Queue (DLQ)?',
    [
      'Deleting logs older than 30 days',
      'Isolating poison-pill messages that failed processing after max retries for inspection and replay',
      'Storing encrypted user passwords',
      'Broadcasting shutdown signals to Kubernetes pods',
    ],
    1,
    'Moving repeatedly failing messages to a DLQ keeps healthy queue consumers moving while preserving failed payloads for debugging.'
  ),
  q(
    'ms-5',
    'microservices',
    'Low',
    'Health Probes',
    'What is the difference between Kubernetes liveness and readiness probes on a microservice?',
    [
      'There is no difference; both restart the pod',
      'Readiness removes a temporarily overloaded/starting pod from load-balancer traffic; liveness restarts a deadlocked container',
      'Liveness only checks CPU temperature',
      'Readiness runs only during docker build',
    ],
    1,
    'Failing readiness pauses incoming traffic cleanly (e.g., while warming caches), whereas failing liveness triggers a container restart.'
  ),
  q(
    'ms-6',
    'microservices',
    'Medium',
    'Circuit Breaker',
    'What does the "Open" state of a Circuit Breaker do when a downstream dependency starts timing out?',
    [
      'Retries every failed request 10 times immediately',
      'Fails fast with a fallback/error without calling the struggling downstream service until a cooldown timer probes recovery',
      'Drops all database indexes',
      'Routes traffic to localhost',
    ],
    1,
    'Opening the circuit stops cascading thread/connection exhaustion and gives the failing service breathing room to recover before half-open probes test it.'
  ),
  q(
    'ms-7',
    'microservices',
    'Medium',
    'Distributed Tracing',
    'How does OpenTelemetry trace a single user request across five separate microservices?',
    [
      'By syncing system clocks to the microsecond without headers',
      'By propagating a shared Trace ID / Context header (W3C traceparent) across HTTP calls and message metadata',
      'By merging all logs into one local text file',
      'By requiring every service to share one PostgreSQL database',
    ],
    1,
    'Propagating traceparent headers connects spans emitted by each hop into a unified flamegraph in Jaeger/Tempo/Datadog.'
  ),
  q(
    'ms-8',
    'microservices',
    'Medium',
    'Delivery Semantics',
    'Most distributed message queues guarantee "at-least-once" delivery. What does this require from consumer services?',
    [
      'Consumers must ignore errors',
      'Consumers must be idempotent so processing a duplicate message produces the same side effect once',
      'Messages must never exceed 64 bytes',
      'Only one consumer instance can exist',
    ],
    1,
    'Network retries or worker crashes before ack cause redeliveries; idempotent handlers (via deduplication keys/constraints) prevent double charges or duplicate emails.'
  ),
  q(
    'ms-9',
    'microservices',
    'Medium',
    'Choreography vs Orchestration',
    'How does Saga orchestration differ from Saga choreography?',
    [
      'Orchestration relies on a central coordinator telling services which step to execute next; choreography uses decentralized events',
      'Choreography requires synchronous gRPC only',
      'Orchestration forbids compensating rollbacks',
      'Choreography is only for frontend state',
    ],
    0,
    'Orchestrators simplify complex multi-step visibility and compensating actions in one place, while choreography keeps services loosely coupled via domain events.'
  ),
  q(
    'ms-10',
    'microservices',
    'Medium',
    'gRPC vs REST',
    'Why do internal microservice-to-microservice calls often adopt gRPC over JSON/REST?',
    [
      'Browsers execute gRPC natively without any proxy',
      'Protobuf binary serialization, strict .proto contracts, and HTTP/2 multiplexing deliver lower latency and smaller payloads',
      'gRPC works without schemas',
      'REST does not support TLS',
    ],
    1,
    'Protocol Buffers serialize compactly with strong schema evolution rules over HTTP/2 bidirectional streams.'
  ),
  q(
    'ms-11',
    'microservices',
    'High',
    'Transactional Outbox',
    'How does the Transactional Outbox pattern solve the "dual-write" bug between saving to PostgreSQL and publishing to Kafka?',
    [
      'Wrap both Kafka produce and SQL commit in 2-Phase Commit (XA) everywhere',
      'Write the domain row and an `outbox_events` row in the same local ACID DB transaction, then relay outbox rows asynchronously to Kafka',
      'Publish to Kafka first and ignore SQL failures',
      'Retry Kafka synchronously inside an HTTP GET',
    ],
    1,
    'An atomic DB transaction guarantees the event is recorded if and only if state persisted; a relay worker (or Debezium CDC) then publishes with at-least-once delivery.'
  ),
  q(
    'ms-12',
    'microservices',
    'High',
    'Retry Amplification',
    'If Service A calls B -> C -> D and each layer has 3 automatic retries on timeout, how many requests hit D on a single slow call from A?',
    ['3 requests', '9 requests', '27 requests (3 × 3 × 3), risking a self-inflicted retry storm', '1 request'],
    2,
    'Multiplicative retries amplify latency spikes into total outages; enforce deadline/timeout propagation, retry budgets, and retry only at the edge/safe layer.'
  ),
  q(
    'ms-13',
    'microservices',
    'High',
    'Kafka Partitions',
    'In Apache Kafka, how do you guarantee strict ordering for all events belonging to a specific `orderId`?',
    [
      'Increase consumer group size above partition count',
      'Use `orderId` as the partition key so all events for that order land in the same ordered partition',
      'Disable acks on the producer',
      'Use random round-robin partitioning',
    ],
    1,
    'Kafka guarantees message order strictly within a single partition; hashing the entity key (orderId) routes related events consistently.'
  ),
  q(
    'ms-14',
    'microservices',
    'High',
    'Saga Compensations',
    'In a distributed Saga, why must compensating transactions (e.g., refunding an inventory hold) be retried until succeeded?',
    [
      'Because ACID rollbacks across separate microservices do not exist; forward recovery of compensations restores eventual consistency',
      'Because SQL ROLLBACK takes 5 seconds',
      'So users get charged twice',
      'Because Kafka deletes uncommitted offsets immediately',
    ],
    0,
    'Once local transactions commit in earlier services, a later failure cannot rollback; compensating steps act as semantic undo operations that must be idempotent and durable.'
  ),
  q(
    'ms-15',
    'microservices',
    'High',
    'Strangler Fig Migration',
    'What is the Strangler Fig pattern when modernizing a legacy monolith?',
    [
      'Rewriting the entire monolith from scratch in 12 months before releasing anything',
      'Incrementally routing specific routes/capabilities through a proxy to new microservices while retiring pieces of the monolith safely',
      'Shutting down the monolith database on weekends',
      'Sharing one giant ORM file across 20 repositories',
    ],
    1,
    'Strangler Fig incrementally slices off bounded contexts behind a routing proxy, delivering production value continuously with low big-bang risk.'
  ),
  q(
    'ms-16',
    'microservices',
    'High',
    'Contract Testing',
    'How does Consumer-Driven Contract Testing (e.g., Pact) speed up microservice CI pipelines compared to full E2E staging environments?',
    [
      'It eliminates all production monitoring',
      'Consumers publish expected request/response contracts verified independently by providers in fast isolated builds without spinning up all services together',
      'It mocks every service without checking actual provider schemas',
      'It replaces database migrations',
    ],
    1,
    'Pact catches breaking API field/type changes at PR time against provider builds without brittle, slow whole-cluster E2E test suites.'
  ),
];
