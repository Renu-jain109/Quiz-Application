import { QuizQuestion } from '../quiz-types';
import { q } from './q-helper';

export const DATABASES_QUESTIONS: QuizQuestion[] = [
  // ========================
  // SQL & DATA MODELING (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'db-1',
    'databases',
    'Low',
    'Joins',
    'Which SQL JOIN returns all rows from the left table and matched rows from the right table (with NULLs when no match exists)?',
    ['INNER JOIN', 'LEFT OUTER JOIN', 'CROSS JOIN', 'NATURAL JOIN'],
    1,
    'LEFT JOIN preserves every row from the left relation regardless of whether a matching key exists on the right.'
  ),
  q(
    'db-2',
    'databases',
    'Low',
    'Filtering Aggregates',
    'Which SQL clause filters groups produced by `GROUP BY`, such as `COUNT(*) > 5`?',
    ['WHERE', 'HAVING', 'ORDER BY', 'DISTINCT'],
    1,
    'WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY executes.'
  ),
  q(
    'db-3',
    'databases',
    'Low',
    'Primary Keys',
    'Which two properties must every Primary Key satisfy in a relational table?',
    [
      'Must be auto-increment integer and nullable',
      'Unique across all rows and NOT NULL',
      'Indexed with GIN and sorted alphabetically',
      'Shared identically with a foreign table',
    ],
    1,
    'A Primary Key uniquely identifies every tuple in a relation and cannot contain NULL values.'
  ),
  q(
    'db-4',
    'databases',
    'Low',
    'Normalization',
    'What problem does database normalization (up to 3NF) primarily eliminate?',
    [
      'Network latency between browser and server',
      'Data duplication and update/delete anomalies',
      'TLS handshake overhead',
      'Need for SQL indexes',
    ],
    1,
    'Normalization separates repeating groups and transitive dependencies so each fact lives in one authoritative place.'
  ),
  q(
    'db-5',
    'databases',
    'Low',
    'ACID Properties',
    'In ACID transactions, what does "Atomicity" guarantee?',
    [
      'Queries always execute in under 1ms',
      'All operations in a transaction succeed together or roll back completely as a single unit',
      'Multiple replicas remain eventually consistent',
      'Rows are stored alphabetically',
    ],
    1,
    'Atomicity ensures partial failures never leave half-applied state: either all statements commit or none take effect.'
  ),
  q(
    'db-6',
    'databases',
    'Medium',
    'Composite Indexes',
    'If a table has a composite B-tree index on `(tenant_id, created_at)`, which query uses the index most effectively?',
    [
      'WHERE created_at > NOW() - INTERVAL \'7 days\' only',
      'WHERE tenant_id = 42 AND created_at > \'2025-01-01\'',
      'WHERE LOWER(email) = \'a@b.com\'',
      'SELECT * FROM logs ORDER BY payload',
    ],
    1,
    'B-tree composite indexes follow the leftmost-prefix rule: queries filtering on the leading column (tenant_id) can traverse the tree directly.'
  ),
  q(
    'db-7',
    'databases',
    'Medium',
    'Window Functions',
    'How does a SQL Window Function (`RANK() OVER (...)`) differ from `GROUP BY`?',
    [
      'Window functions collapse rows into one summary row per group',
      'Window functions compute aggregates across related rows while preserving each individual row in the output',
      'Window functions cannot use ORDER BY',
      'Window functions only work on temporary tables',
    ],
    1,
    'OVER() defines a partition/frame around each row without collapsing detail rows, enabling running totals, rankings, and lag/lead comparisons.'
  ),
  q(
    'db-8',
    'databases',
    'Medium',
    'Selectivity & Indexes',
    'Why is creating a standard B-tree index on a boolean column `is_active` (where 98% of rows are true) usually ineffective?',
    [
      'B-trees cannot store booleans',
      'Low cardinality makes scanning the index + heap slower than a sequential table scan for the 98% case',
      'PostgreSQL forbids indexes on boolean columns',
      'Boolean columns corrupt WAL logs',
    ],
    1,
    'For skewed low-selectivity flags, a partial index (`WHERE is_active = false`) targets only the rare 2% subset cleanly.'
  ),
  q(
    'db-9',
    'databases',
    'Medium',
    'SQL Query Output',
    'Why does `WHERE col != NULL` return zero rows in standard SQL?',
    [
      '!= is invalid syntax in SQL',
      'NULL represents unknown; any comparison with NULL yields UNKNOWN, requiring `IS NOT NULL` instead',
      'SQL converts NULL to 0 before comparing',
      'NULL values are skipped during table creation',
    ],
    1,
    'SQL uses three-valued logic (TRUE, FALSE, UNKNOWN). Only `IS NULL` and `IS NOT NULL` test nullness reliably.'
  ),
  q(
    'db-10',
    'databases',
    'Medium',
    'Foreign Key Indexes',
    'Why should you usually add an explicit index on foreign key columns (e.g., `orders.customer_id`)?',
    [
      'Most SQL engines auto-index primary keys/unique constraints, NOT foreign keys, causing slow joins and child table locks on parent deletes',
      'Foreign keys fail to enforce integrity without an index',
      'It reduces row storage size by 50%',
      'It enables full-text search',
    ],
    0,
    'Indexing child foreign keys accelerates JOINs and avoids full table scans whenever a parent row is updated or deleted.'
  ),
  q(
    'db-11',
    'databases',
    'High',
    'Isolation Levels',
    'Which concurrency anomaly can still occur under `READ COMMITTED` if two concurrent transactions read an inventory count of 1 and both decrement it?',
    [
      'Dirty Read',
      'Lost Update / Non-Repeatable Read unless prevented via `SELECT ... FOR UPDATE`, atomic `SET qty = qty - 1 WHERE qty >= 1`, or higher isolation',
      'Syntax Error',
      'Index Corruption',
    ],
    1,
    'Under READ COMMITTED, each statement sees a fresh snapshot; check-then-act in app code risks overselling without row locks or atomic conditional UPDATEs.'
  ),
  q(
    'db-12',
    'databases',
    'High',
    'Keyset Pagination',
    'Why does `OFFSET 500000 LIMIT 20` degrade severely on large tables compared to keyset pagination?',
    [
      'OFFSET disables primary keys',
      'The database still scans, sorts, and discards the first 500,000 rows on every page request',
      'LIMIT 20 causes deadlocks',
      'SQL forbids OFFSET above 10,000',
    ],
    1,
    'Keyset pagination (`WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20`) jumps straight to the cursor via the index in O(log N).'
  ),
  q(
    'db-13',
    'databases',
    'High',
    'Zero-Downtime Migrations',
    'What happens when you run `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT "member"` on a massive legacy MySQL/old DB vs modern expand-and-contract?',
    [
      'It is unsafe to add nullable columns first',
      'Blocking table rewrites or lock queues can stall production queries; the expand-and-contract pattern adds nullable columns, backfills in batches, and adds NOT VALID constraints safely',
      'Database indexes rebuild faster when traffic is at peak',
      'Foreign keys automatically migrate app code',
    ],
    1,
    'Expand-and-contract keeps old and new app code compatible across rolling deploys while avoiding long AccessExclusive locks during backfills.'
  ),
  q(
    'db-14',
    'databases',
    'High',
    'Covering Indexes',
    'What is a "Covering Index" (e.g., `CREATE INDEX idx ON orders(user_id) INCLUDE (total, status)`)?',
    [
      'An index that enforces SSL on connections',
      'An index containing all columns needed by a query so the DB answers with an Index-Only Scan without touching table heap pages',
      'An index covering every table in a database',
      'A backup snapshot of the schema',
    ],
    1,
    'Storing non-key payload columns via INCLUDE lets the planner satisfy queries purely from the compact index pages.'
  ),
  q(
    'db-15',
    'databases',
    'High',
    'Deadlock Prevention',
    'How do two concurrent transactions commonly trigger a database deadlock, and what is the simplest prevention rule?',
    [
      'Reading the same row simultaneously; prevent by removing transactions',
      'Locking resources in opposite order (T1 locks A then B while T2 locks B then A); prevent by acquiring locks in a consistent canonical order',
      'Running SELECT COUNT(*); prevent with LIMIT 1',
      'Using UUIDs instead of integers',
    ],
    1,
    'Ordering row locks consistently (e.g., always lock lower account_id first before higher account_id) breaks circular wait cycles.'
  ),
  q(
    'db-16',
    'databases',
    'High',
    'Read Replicas & Lag',
    'A user updates their profile on the primary DB and immediately refreshes `/profile`, which reads from an asynchronous read replica showing old data. What is this called?',
    [
      'Dirty Write',
      'Read-your-own-writes violation caused by replication lag',
      'Phantom Schema',
      'Deadlock Timeout',
    ],
    1,
    'Mitigate read-after-write inconsistency by routing critical post-write reads to the primary DB for a brief window or tracking commit LSNs.'
  ),

  // ========================
  // POSTGRESQL INTERNALS (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'pg-1',
    'postgresql',
    'Low',
    'JSON Storage',
    'Why is `JSONB` generally preferred over `JSON` in PostgreSQL?',
    [
      'JSONB stores raw whitespace verbatim',
      'JSONB stores parsed binary JSON that supports GIN indexing and fast key lookups without re-parsing text',
      'JSON columns cannot exceed 255 characters',
      'JSONB is encrypted with AES automatically',
    ],
    1,
    'JSONB decomposes JSON into an efficient binary format at write time, enabling @> containment queries backed by GIN indexes.'
  ),
  q(
    'pg-2',
    'postgresql',
    'Low',
    'Upsert',
    'Which PostgreSQL clause implements an atomic upsert (insert or update on duplicate key)?',
    ['MERGE OR REPLACE', 'INSERT ... ON CONFLICT (...) DO UPDATE', 'REPLACE INTO', 'UPSERT VALUES'],
    1,
    'ON CONFLICT DO UPDATE / DO NOTHING handles unique constraint collisions atomically without race-prone select-then-insert logic.'
  ),
  q(
    'pg-3',
    'postgresql',
    'Low',
    'Returning Clause',
    'How can PostgreSQL return generated IDs or timestamps from an `INSERT` or `UPDATE` in a single round trip?',
    ['Add OUTPUT INSERTED.*', 'Append `RETURNING id, created_at` to the DML statement', 'Call SELECT LAST_INSERT_ID()', 'Use SHOW TABLES'],
    1,
    'PostgreSQL supports `RETURNING` on INSERT, UPDATE, and DELETE to fetch affected columns atomically in one statement.'
  ),
  q(
    'pg-4',
    'postgresql',
    'Low',
    'UUID vs Identity',
    'Which modern standard SQL syntax is recommended for auto-incrementing integer keys in PostgreSQL 10+?',
    ['AUTO_INCREMENT', 'GENERATED ALWAYS AS IDENTITY', 'UNIQUEIDENTIFIER', 'ROWID'],
    1,
    'GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY is SQL-standard and avoids several permission/dependency quirks of legacy SERIAL.'
  ),
  q(
    'pg-5',
    'postgresql',
    'Low',
    'Inspection',
    'Which command actually executes a PostgreSQL query and reports real timing, row counts, and buffer hits alongside the plan?',
    ['DESCRIBE QUERY', 'EXPLAIN (ANALYZE, BUFFERS)', 'SHOW PLAN ONLY', 'ANALYZE TABLE'],
    1,
    'Plain EXPLAIN only shows planner estimates; EXPLAIN (ANALYZE, BUFFERS) executes the query (wrap writes in BEGIN/ROLLBACK) to measure true costs and I/O.'
  ),
  q(
    'pg-6',
    'postgresql',
    'Medium',
    'MVCC Basics',
    'Under PostgreSQL MVCC (Multi-Version Concurrency Control), what happens when a row is updated?',
    [
      'The bytes are overwritten in-place on disk',
      'A new row tuple version (`xmin`) is written while the old tuple is marked expired (`xmax`) so concurrent readers stay unblocked',
      'PostgreSQL locks the entire table against all SELECTs',
      'The WAL file is deleted',
    ],
    1,
    'MVCC ensures readers never block writers and writers never block readers by maintaining versioned tuples with transaction visibility metadata.'
  ),
  q(
    'pg-7',
    'postgresql',
    'Medium',
    'VACUUM Purpose',
    'Why does PostgreSQL rely on `autovacuum`?',
    [
      'To compress JSONB into XML',
      'To reclaim dead tuples left by updates/deletes, update planner visibility maps/statistics, and prevent Transaction ID (XID) wraparound',
      'To rotate TLS certificates',
      'To drop unused foreign keys automatically',
    ],
    1,
    'Without VACUUM, dead tuples bloat tables/indexes and un-frozen XIDs risk transaction ID wraparound downtime.'
  ),
  q(
    'pg-8',
    'postgresql',
    'Medium',
    'Index Locking',
    'When adding an index to a busy production PostgreSQL table, how do you avoid blocking all INSERT/UPDATE/DELETE writes?',
    [
      'CREATE INDEX CONCURRENTLY',
      'CREATE INDEX FAST',
      'LOCK TABLE IN SHARE MODE',
      'SET synchronous_commit = off',
    ],
    0,
    'CREATE INDEX CONCURRENTLY builds the index in two passes without holding a write-blocking ShareLock, though it takes longer and cannot run inside a transaction block.'
  ),
  q(
    'pg-9',
    'postgresql',
    'Medium',
    'GIN Indexes',
    'Which PostgreSQL index type excels at `JSONB` containment (`@>`), array overlap (`&&`), and `tsvector` full-text search?',
    ['Hash Index', 'BRIN Index', 'GIN (Generalized Inverted Index)', 'SpGist'],
    2,
    'GIN maps composite elements (keys, array items, lexemes) to posting lists of heap pointers.'
  ),
  q(
    'pg-10',
    'postgresql',
    'Medium',
    'Connection Pooling',
    'Why do high-concurrency Node/Python apps place PgBouncer in transaction-pooling mode in front of PostgreSQL?',
    [
      'PostgreSQL spawns an OS process per connection (~5-10 MB + context switching), so thousands of idle app connections exhaust RAM',
      'PgBouncer converts SQL into GraphQL',
      'PostgreSQL allows max 10 queries per second without PgBouncer',
      'PgBouncer caches entire database tables in browser cookies',
    ],
    0,
    'PgBouncer multiplexes thousands of application client sockets onto a small, optimal pool of active Postgres backend processes.'
  ),
  q(
    'pg-11',
    'postgresql',
    'High',
    'Job Queues in Postgres',
    'Which PostgreSQL locking clause allows multiple worker processes to claim jobs concurrently from a queue table without blocking each other?',
    [
      'LOCK TABLE jobs IN EXCLUSIVE MODE',
      'SELECT ... FOR UPDATE SKIP LOCKED',
      'SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED',
      'VACUUM FULL jobs',
    ],
    1,
    'FOR UPDATE SKIP LOCKED lets each worker skip rows already locked by sibling workers and immediately claim the next available job.'
  ),
  q(
    'pg-12',
    'postgresql',
    'High',
    'BRIN Indexes',
    'When is a `BRIN` (Block Range Index) dramatically smaller and more practical than a B-tree on a 10 TB events table?',
    [
      'When querying random UUID primary keys',
      'When values correlate naturally with physical insertion order on disk (like append-only `created_at` timestamps)',
      'When indexing short boolean flags',
      'When performing exact full-text phrase searches',
    ],
    1,
    'BRIN stores only min/max summaries per block range (~kilobytes instead of gigabytes), ideal for huge append-only time-series tables.'
  ),
  q(
    'pg-13',
    'postgresql',
    'High',
    'UUIDv4 vs UUIDv7',
    'Why do random `UUIDv4` primary keys hurt PostgreSQL B-tree insert throughput at scale compared to `UUIDv7` or BIGINT?',
    [
      'UUIDv4 values are 1024 bits long',
      'Random UUIDv4 inserts scatter across random B-tree leaf pages, causing heavy page splits, cache misses, and WAL amplification',
      'UUIDv4 breaks pg_dump backups',
      'PostgreSQL converts UUIDv4 into text internally',
    ],
    1,
    'Time-ordered UUIDv7 appends monotonically near the right edge of the B-tree, keeping hot index pages cached and minimizing fragmentation.'
  ),
  q(
    'pg-14',
    'postgresql',
    'High',
    'Advisory Locks',
    'When would you use `pg_advisory_lock(key)` in PostgreSQL?',
    [
      'To bypass user password checks',
      'To coordinate application-level distributed mutexes (e.g., ensuring only one cron leader runs) using existing DB infrastructure',
      'To force autovacuum to stop permanently',
      'To encrypt table columns',
    ],
    1,
    'Advisory locks let application workers synchronize on arbitrary 64-bit integer keys managed cleanly by Postgres lock memory without row locks.'
  ),
  q(
    'pg-15',
    'postgresql',
    'High',
    'Long Transactions & Bloat',
    'Why does leaving an `"idle in transaction"` session open for hours cause table bloat across PostgreSQL?',
    [
      'It consumes 100% CPU while idle',
      'Its open snapshot prevents autovacuum from removing dead tuples modified after that transaction started',
      'It drops all B-tree indexes',
      'It switches replication from async to sync',
    ],
    1,
    'VACUUM cannot reclaim dead rows still visible to the oldest active transaction snapshot; configure `idle_in_transaction_session_timeout` to guard against forgotten transactions.'
  ),
  q(
    'pg-16',
    'postgresql',
    'High',
    'NOT VALID Constraints',
    'How can you add a `CHECK` or `FOREIGN KEY` constraint on a billion-row PostgreSQL table with minimal lock downtime?',
    [
      'Run ALTER TABLE ... ADD CONSTRAINT ... NOT VALID (fast metadata lock), then VALIDATE CONSTRAINT in a separate command (ShareUpdateExclusiveLock)',
      'Disable WAL logging during the alteration',
      'Drop and recreate the table',
      'Run VALIDATE before ADD CONSTRAINT',
    ],
    0,
    'NOT VALID skips scanning existing rows under AccessExclusiveLock, enforcing the rule for new writes immediately while VALIDATE scans existing rows concurrently without blocking reads/writes.'
  ),

  // ========================
  // MONGODB & NOSQL (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'mg-1',
    'mongodb',
    'Low',
    'Document Model',
    'In MongoDB, what binary format is used internally to store documents and support types like ObjectId, Date, and Decimal128?',
    ['MessagePack', 'BSON (Binary JSON)', 'CBOR', 'YAML'],
    1,
    'BSON extends JSON with length prefixes for fast traversal and richer data types such as ObjectId, Int64, Date, and Decimal128.'
  ),
  q(
    'mg-2',
    'mongodb',
    'Low',
    'Identifiers',
    'Which field is mandatory and automatically indexed as unique on every document in a MongoDB collection?',
    ['uuid', '_id', 'docKey', 'rowId'],
    1,
    'Every document must have an immutable _id field (defaulting to a 12-byte ObjectId) backed by a unique index.'
  ),
  q(
    'mg-3',
    'mongodb',
    'Low',
    'Schema Design',
    'What is the core rule of thumb when deciding whether to embed subdocuments vs reference another collection in MongoDB?',
    [
      'Always normalize everything into separate collections like SQL',
      'Data accessed and updated together fits embedding; unbounded arrays or shared entities fit referencing',
      'Never store arrays inside documents',
      'Embed entire multi-megabyte log histories inside user documents',
    ],
    1,
    'Embedding optimizes single-document atomic reads/writes, while referencing avoids hitting the 16 MB BSON document limit and unbounded array growth.'
  ),
  q(
    'mg-4',
    'mongodb',
    'Low',
    'Atomic Operators',
    'Which update operator increments a numeric field atomically on the MongoDB server without a read-modify-write race?',
    ['$set', '$inc', '$push', '$add'],
    1,
    '$inc modifies a field atomically in place on the server, avoiding lost updates under concurrent writes.'
  ),
  q(
    'mg-5',
    'mongodb',
    'Low',
    'TTL Collections',
    'How can MongoDB automatically expire session or cache documents after a configured number of seconds?',
    [
      'Run a bash cron job every second',
      'Create a TTL index (`expireAfterSeconds`) on a Date field',
      'Set `autoDelete: true` inside collection name',
      'Use `$lookup` with a timer',
    ],
    1,
    'A TTL single-field index instructs a background thread to delete documents automatically once the indexed timestamp passes the expiration threshold.'
  ),
  q(
    'mg-6',
    'mongodb',
    'Medium',
    'Aggregation Pipeline',
    'In a MongoDB aggregation pipeline, why should `$match` and `$sort` appear as early as possible before `$lookup` or `$project`?',
    [
      'MongoDB throws a syntax error otherwise',
      'Early `$match`/`$sort` stages can leverage collection indexes and shrink the working set entering memory-heavy stages',
      'It skips BSON serialization',
      'It enables transactions across shards',
    ],
    1,
    'Only stages at the beginning of a pipeline (before transformations obscure field names) can utilize B-tree indexes cleanly.'
  ),
  q(
    'mg-7',
    'mongodb',
    'Medium',
    'ESR Rule',
    'What does the MongoDB "ESR" compound index ordering rule stand for?',
    [
      'Encrypt, Sort, Replicate',
      'Equality, Sort, Range',
      'Embed, Shard, Read',
      'Execute, Scan, Return',
    ],
    1,
    'Ordering compound index keys as Equality fields first, then Sort fields, then Range fields avoids expensive in-memory blocking sorts.'
  ),
  q(
    'mg-8',
    'mongodb',
    'Medium',
    'Multikey Indexes',
    'What happens when you create an index on an array field (e.g., `tags: ["angular", "ts"]`) in MongoDB?',
    [
      'MongoDB refuses to index arrays',
      'MongoDB builds a multikey index with a separate index entry pointing to the document for every element in the array',
      'Only the first array element is indexed',
      'The array is flattened into a comma string',
    ],
    1,
    'Multikey indexes allow fast lookups on array elements, though creating a compound index across two parallel array fields in the same document is disallowed.'
  ),
  q(
    'mg-9',
    'mongodb',
    'Medium',
    'Write Concern',
    'In a 3-node MongoDB replica set, what does `writeConcern: { w: "majority" }` guarantee?',
    [
      'The write returns immediately before touching disk',
      'The write is acknowledged only after a majority of voting replica set members confirm persisting it, preventing rollback on failover',
      'All secondary nodes become writable primaries',
      'The document is sharded across 3 clusters',
    ],
    1,
    'w: "majority" protects committed data from being rolled back if the primary crashes immediately after acknowledging a client write.'
  ),
  q(
    'mg-10',
    'mongodb',
    'Medium',
    '16 MB Limit & GridFS',
    'If a user profile embeds an unbounded `activityLogs[]` array that keeps growing forever, what happens in MongoDB?',
    [
      'MongoDB shards the single document across nodes',
      'Document rewrites degrade performance and eventually fail once the 16 MB BSON limit is exceeded (use Bucketing or separate collection instead)',
      'Old array elements are truncated automatically',
      'Index keys turn into strings',
    ],
    1,
    'Unbounded growth inside one document causes frequent document moves, WiredTiger cache churn, and hard failures at 16 MB.'
  ),
  q(
    'mg-11',
    'mongodb',
    'High',
    'Change Streams',
    'How do MongoDB Change Streams power event-driven architectures without polling?',
    [
      'They read the replica set oplog continuously using resumable resumeTokens to push real-time document changes',
      'They run SELECT * every 100ms in C++',
      'They require converting MongoDB into Redis',
      'They only work on standalone single-node servers',
    ],
    0,
    'Change Streams tail the replica set oplog (requires replica set/sharded cluster) and provide resume tokens so consumers survive restarts without missing events.'
  ),
  q(
    'mg-12',
    'mongodb',
    'High',
    'Shard Key Selection',
    'Why is a monotonically increasing `_id` or timestamp a poor choice for a hashed-less Range Shard Key in MongoDB?',
    [
      'Timestamps cannot be indexed',
      'All new inserts hit the single highest chunk range on one shard, creating a hot-shard write bottleneck',
      'It disables WiredTiger compression',
      'Queries using _id fail across shards',
    ],
    1,
    'Monotonic range shard keys funnel 100% of insert traffic onto one shard; choose high-cardinality compound keys or hashed shard keys for write distribution.'
  ),
  q(
    'mg-13',
    'mongodb',
    'High',
    'Read Concern Majority',
    'Why might `readConcern: "local"` return data that later gets rolled back during a replica set election, and which setting avoids dirty reads?',
    [
      'Use `readConcern: "majority"` (or `"linearizable"`) so reads only reflect writes committed by a quorum of nodes',
      'Use `readPreference: "nearest"`',
      'Disable oplog replication',
      'Use `limit(1)` on every find()',
    ],
    0,
    'readConcern: "majority" ensures a node only serves data acknowledged by a replica quorum and therefore safe from failover rollback.'
  ),
  q(
    'mg-14',
    'mongodb',
    'High',
    'Multi-Document Transactions',
    'Why does MongoDB advise modeling data to minimize cross-document ACID transactions even though multi-document transactions exist?',
    [
      'Transactions only support INSERT',
      'Single-document atomic operations avoid distributed lock contention, transaction cache pressure, and cross-shard coordination overhead',
      'Transactions disable indexes',
      'MongoDB limits transactions to 1 byte',
    ],
    1,
    'Well-modeled documents keep invariants local to a single document (~90% of use cases), reserving multi-document transactions for rare cross-entity workflows.'
  ),
  q(
    'mg-15',
    'mongodb',
    'High',
    'Scatter-Gather Queries',
    'In a 12-shard MongoDB cluster, what happens when a query omits the Shard Key?',
    [
      'mongos rejects the query with HTTP 400',
      'mongos performs a scatter-gather broadcast to all 12 shards and merges results, hurting tail latency at scale',
      'Only shard 0 is queried',
      'The shard key is inferred from _id automatically',
    ],
    1,
    'Targeted queries including the shard key hit a single shard, whereas scatter-gather queries multiply fan-out CPU and tail latency across every shard.'
  ),
  q(
    'mg-16',
    'mongodb',
    'High',
    'Outbox / Bucket Pattern',
    'How does the MongoDB "Bucket Pattern" optimize high-volume IoT time-series or metric storage?',
    [
      'By creating a new collection per sensor',
      'By grouping fixed-size batches (e.g., 100 readings per hour-bucket document), reducing total documents, index size, and IOPS dramatically',
      'By storing readings inside collection metadata',
      'By disabling WiredTiger checkpoints',
    ],
    1,
    'Bucketing shrinks index footprint by ~100x while keeping document sizes bounded and enabling pre-aggregated min/max/sum stats per bucket.'
  ),

  // ========================
  // REDIS & CACHING (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'rd-1',
    'redis',
    'Low',
    'Data Structures',
    'Which Redis data structure stores unique unordered strings and supports fast `SISMEMBER` and `SINTER` operations?',
    ['List', 'Set', 'Stream', 'HyperLogLog'],
    1,
    'Redis Sets maintain unordered unique members with O(1) membership checks and built-in intersection/union commands.'
  ),
  q(
    'rd-2',
    'redis',
    'Low',
    'Expiration',
    'How do you atomically store a key in Redis with a 60-second Time-To-Live in a single command?',
    ['SET key val EXPIRE 60', 'SET key val EX 60', 'PUT key val TTL 60', 'ADD key val 60'],
    1,
    'SET key val EX 60 sets both the value and expiration atomically, preventing orphan persistent keys if a client crashes between SET and EXPIRE.'
  ),
  q(
    'rd-3',
    'redis',
    'Low',
    'In-Memory Speed',
    'Why does Redis achieve sub-millisecond read/write latency compared to disk-oriented databases?',
    [
      'It runs inside the browser Web Worker',
      'It serves its primary dataset directly from RAM with simple single-threaded I/O multiplexing',
      'It skips TCP/IP networking',
      'It compresses all keys with PNG encoding',
    ],
    1,
    'Keeping data in RAM eliminates disk seek latency, while Redis’s single-threaded event loop avoids lock/mutex contention on data structures.'
  ),
  q(
    'rd-4',
    'redis',
    'Low',
    'Leaderboards',
    'Which Redis structure is purpose-built for real-time leaderboards and priority queues sorted by numeric score?',
    ['Hash', 'Sorted Set (ZSET)', 'Bitmap', 'Pub/Sub'],
    1,
    'Sorted Sets pair unique members with floating-point scores, maintaining O(log N) rank updates and range queries via ZADD/ZREVRANGE.'
  ),
  q(
    'rd-5',
    'redis',
    'Low',
    'Hashes vs Strings',
    'When caching a user object `{ id, name, plan }`, why are Redis Hashes (`HSET`) sometimes preferred over storing serialized JSON?',
    [
      'Hashes do not count toward Redis maxmemory',
      'Hashes let you read or update individual fields (`HINCRBY`, `HGET`) without deserializing and rewriting the whole object',
      'Hashes automatically sync with PostgreSQL',
      'JSON strings cannot exceed 100 bytes in Redis',
    ],
    1,
    'Hashes expose field-level atomic operations and use compact listpack encoding for small objects.'
  ),
  q(
    'rd-6',
    'redis',
    'Medium',
    'Cache-Aside Pattern',
    'What is the standard read/write flow in the Cache-Aside (Lazy Loading) pattern?',
    [
      'Write only to Redis and never touch the DB',
      'Read checks Redis first; on cache miss, fetch from DB, populate Redis with TTL, and return data; on DB writes, invalidate/delete the cache key',
      'Redis queries PostgreSQL automatically on misses',
      'Cache expires only when the server reboots',
    ],
    1,
    'Cache-Aside loads hot data on demand and avoids writing cold records into RAM while invalidating stale keys on mutation.'
  ),
  q(
    'rd-7',
    'redis',
    'Medium',
    'Eviction Policies',
    'When acting purely as a cache, why is `allkeys-lru` or `allkeys-lfu` usually safer than `noeviction`?',
    [
      'noeviction deletes the entire database on full memory',
      'noeviction causes write commands to error once `maxmemory` is reached, whereas LRU/LFU evicts cold keys gracefully',
      'allkeys-lru replicates twice as fast',
      'noeviction disables TTL expiration',
    ],
    1,
    'LRU/LFU eviction keeps cache writes succeeding within bounded RAM by shedding least-recently or least-frequently used items.'
  ),
  q(
    'rd-8',
    'redis',
    'Medium',
    'Blocking Commands Danger',
    'Why is running `KEYS *` in production Redis considered an operational outage risk?',
    [
      'It clears all TTLs',
      'KEYS * is O(N) and blocks the single-threaded Redis event loop across millions of keys; use `SCAN` cursor iteration instead',
      'It drops replica connections',
      'It writes every key to stdout synchronously',
    ],
    1,
    'Because Redis executes commands sequentially on one main thread, an O(N) KEYS scan freezes every other client until complete; SCAN paginates safely.'
  ),
  q(
    'rd-9',
    'redis',
    'Medium',
    'Sliding Window Rate Limit',
    'How can a Redis Sorted Set (`ZSET`) implement an accurate Sliding Window rate limiter?',
    [
      'Store request timestamps as both score and unique member, remove entries older than `now - window` with `ZREMRANGEBYSCORE`, and count remaining members with `ZCARD`',
      'Use `SETNX` with a static key name',
      'Publish tokens to a Pub/Sub channel',
      'Use `LPOP` on a Hash',
    ],
    0,
    'Wrapping ZREMRANGEBYSCORE, ZADD, ZCARD, and EXPIRE inside a Redis Lua script or MULTI transaction enforces exact sliding windows without race conditions.'
  ),
  q(
    'rd-10',
    'redis',
    'Medium',
    'Pipelining',
    'How does Redis Pipelining speed up issuing 1,000 independent commands?',
    [
      'It runs commands in parallel threads inside Redis',
      'It batches multiple commands over the socket without waiting for individual RTT responses before sending the next',
      'It converts keys into SQL queries',
      'It bypasses maxmemory limits',
    ],
    1,
    'Pipelining eliminates 999 network round-trip waits, letting client and server throughput scale by orders of magnitude.'
  ),
  q(
    'rd-11',
    'redis',
    'High',
    'Cache Stampede (Thundering Herd)',
    'When a popular cache key expires and 5,000 concurrent requests miss simultaneously and hit PostgreSQL, how do you prevent a Cache Stampede?',
    [
      'Set TTL to 1 millisecond',
      'Use request coalescing / singleflight mutex locks (only one worker recomputes while peers wait/get stale data) or probabilistic early refresh + jittered TTLs',
      'Remove Redis completely during spikes',
      'Use `KEYS *` before querying the DB',
    ],
    1,
    'Singleflight coalescing + randomized TTL jitter prevents synchronized expiration spikes from overwhelming the origin database.'
  ),
  q(
    'rd-12',
    'redis',
    'High',
    'Cache Penetration',
    'What is "Cache Penetration" (e.g., attackers requesting nonexistent `user_id = -99999` repeatedly) and how do you stop it?',
    [
      'Attackers guessing Redis passwords; stop with TLS',
      'Misses bypass cache straight to DB repeatedly; mitigate by caching short-TTL null/empty sentinels or gating lookups with a Bloom Filter',
      'Keys expiring too slowly; stop with volatile-ttl',
      'AOF logs filling disk; stop with RDB',
    ],
    1,
    'Caching negative results briefly (null marker with 60s TTL) or checking a Bloom Filter keeps nonexistent key floods away from the primary DB.'
  ),
  q(
    'rd-13',
    'redis',
    'High',
    'Atomic Lock Release Bug',
    'Why must a distributed Redis lock release (`DEL lock_key`) happen inside a Lua script checking the owner token first?',
    [
      'DEL is not supported in Cluster mode without Lua',
      'If Worker A pauses past lock TTL and Worker B acquires the lock, a naive DEL by Worker A would accidentally delete Worker B’s active lock',
      'Lua compresses lock keys by 90%',
      'DEL blocks for 5 seconds otherwise',
    ],
    1,
    'A compare-and-delete Lua script (`if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) end`) runs atomically, ensuring only the lock owner deletes it.'
  ),
  q(
    'rd-14',
    'redis',
    'High',
    'Persistence Trade-offs',
    'How do Redis `RDB` snapshots differ from `AOF` (Append Only File) persistence?',
    [
      'RDB saves point-in-time binary snapshots (fast restarts, potential minutes of data loss between saves), whereas AOF logs every write command (higher durability, larger log rewritten via BGREWRITEAOF)',
      'RDB stores data in SQLite; AOF stores data in S3',
      'AOF cannot be used with replication',
      'RDB slows down every single GET operation',
    ],
    0,
    'Production durable Redis setups commonly combine RDB + AOF (`appendfsync everysec`) to balance sub-second durability ceilings with fast cold recovery.'
  ),
  q(
    'rd-15',
    'redis',
    'High',
    'HyperLogLog',
    'When counting approximate unique daily visitors (`PFADD` / `PFCOUNT`) across 100 million users, why choose Redis HyperLogLog over a Set?',
    [
      'Sets cannot store IP addresses',
      'HyperLogLog estimates cardinality with <1% error in a fixed ~12 KB of memory regardless of user count, vs gigabytes for a Set',
      'HyperLogLog lets you list every individual user ID back',
      'HyperLogLog persists automatically to browsers',
    ],
    1,
    'HyperLogLog trades exact membership enumeration for constant ~12 KB memory usage per key even at tens of millions of unique items.'
  ),
  q(
    'rd-16',
    'redis',
    'High',
    'Redis Cluster Hash Slots',
    'In Redis Cluster, how are keys partitioned across shards and what happens if a multi-key command spans different slots?',
    [
      '16,384 hash slots mapped via CRC16(key) % 16384; multi-key commands fail with CROSSSLOT unless keys share a `{hash_tag}`',
      'Keys are assigned alphabetically by first letter',
      'Redis Cluster automatically joins keys across shards with zero error',
      'Hash slots are only used for Pub/Sub',
    ],
    0,
    'Wrapping a common prefix in curly braces like `user:{42}:profile` and `user:{42}:cart` hashes only `{42}`, co-locating related keys on the same slot.'
  ),
];
