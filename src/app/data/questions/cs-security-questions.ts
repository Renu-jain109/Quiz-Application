import { QuizQuestion } from '../quiz-types';
import { q } from './q-helper';

export const CS_SECURITY_QUESTIONS: QuizQuestion[] = [
  // ========================
  // CS & NETWORKING (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'cs-1',
    'cs-fundamentals',
    'Low',
    'HTTP vs HTTPS',
    'What does HTTPS add on top of standard HTTP?',
    [
      'Faster JSON compression',
      'TLS encryption, server identity verification via certificates, and tamper protection',
      'Automatic client-side caching',
      'Connectionless UDP transport',
    ],
    1,
    'TLS encrypts traffic in transit, authenticates server identity via X.509 certificate chains, and ensures integrity via MAC/AEAD.'
  ),
  q(
    'cs-2',
    'cs-fundamentals',
    'Low',
    'DNS Resolution',
    'What is the primary role of DNS on the internet?',
    [
      'Encrypting browser passwords',
      'Translating human-readable domain names into IP addresses and service records',
      'Routing packets across physical ocean cables',
      'Compressing static HTML files',
    ],
    1,
    'DNS acts as a distributed hierarchical directory resolving domain names (A/AAAA/CNAME/MX/TXT) to network addresses.'
  ),
  q(
    'cs-3',
    'cs-fundamentals',
    'Low',
    'Stack vs Heap',
    'How does the Call Stack differ from Heap memory in typical language runtimes?',
    [
      'Stack holds LIFO function frames and local primitives; Heap dynamically allocates longer-lived objects managed by GC or manual free',
      'Heap is faster than CPU registers',
      'Stack persists across computer reboots',
      'Strings always live on disk instead of RAM',
    ],
    0,
    'Stack allocation simply bumps a stack pointer per call frame, whereas heap allocations support dynamic lifetimes and shared object graphs.'
  ),
  q(
    'cs-4',
    'cs-fundamentals',
    'Low',
    'TCP vs UDP',
    'Why does live voice/video streaming often prefer UDP over TCP?',
    [
      'UDP guarantees 100% packet delivery in order',
      'UDP avoids TCP retransmission stalls (head-of-line blocking), prioritizing fresh real-time frames over resending late packets',
      'UDP requires a 3-way handshake per packet',
      'TCP only carries plain text',
    ],
    1,
    'Waiting 200ms to retransmit a dropped audio packet ruins live calls; UDP lets media codecs skip stale frames smoothly.'
  ),
  q(
    'cs-5',
    'cs-fundamentals',
    'Low',
    'UTF-8 Encoding',
    'Why has UTF-8 become the universal default character encoding on the web?',
    [
      'Every character is strictly 4 bytes',
      'It is backwards-compatible with 1-byte ASCII while encoding every Unicode code point cleanly in 1 to 4 bytes',
      'It ignores emojis and non-Latin scripts',
      'It disables byte-order issues only on Windows',
    ],
    1,
    'UTF-8 uses compact 1-byte representation for ASCII while supporting all international alphabets and symbols without endianness ambiguity.'
  ),
  q(
    'cs-6',
    'cs-fundamentals',
    'Medium',
    'TCP Handshake',
    'What packet sequence establishes a new TCP connection before data flows?',
    ['ACK -> FIN -> RST', 'SYN -> SYN-ACK -> ACK', 'GET -> 200 OK -> CLOSE', 'HELLO -> TLS -> READY'],
    1,
    'The client sends SYN, the server replies SYN-ACK, and the client confirms ACK (with TLS 1.3 able to piggyback crypto keys immediately after).'
  ),
  q(
    'cs-7',
    'cs-fundamentals',
    'Medium',
    'HTTP/2 & HTTP/3',
    'How does HTTP/3 (over QUIC) fix TCP Head-of-Line (HoL) blocking present in HTTP/2?',
    [
      'By disabling TLS encryption',
      'QUIC runs over UDP so packet loss in one independent stream stalls only that stream rather than every multiplexed stream on the connection',
      'HTTP/3 removes headers completely',
      'HTTP/3 opens 50 separate TCP connections',
    ],
    1,
    'While HTTP/2 multiplexed streams at L7, a single dropped TCP packet still stalled the entire TCP buffer; QUIC handles per-stream recovery independently.'
  ),
  q(
    'cs-8',
    'cs-fundamentals',
    'Medium',
    'Process vs Thread',
    'How do threads within the same process differ from separate OS processes?',
    [
      'Threads cannot run on multiple CPU cores',
      'Threads share the same virtual address space and heap (fast communication, requires synchronization), whereas processes have isolated address spaces',
      'Processes share local variables automatically',
      'Threads cannot open network sockets',
    ],
    1,
    'Shared memory makes thread context switches lightweight, at the cost of requiring locks/atomics/channels to prevent data races.'
  ),
  q(
    'cs-9',
    'cs-fundamentals',
    'Medium',
    'Floating Point Math',
    'Why does `0.1 + 0.2 === 0.3` evaluate to `false` in IEEE-754 binary floating-point languages?',
    [
      'JavaScript has a math engine bug',
      'Base-10 fractions like 0.1 and 0.2 are repeating fractions in base-2 binary, producing tiny rounding error (0.30000000000000004)',
      '0.3 is parsed as an octal integer',
      '=== coerces numbers to strings',
    ],
    1,
    'Always store currency/financial amounts in integer minor units (cents) or arbitrary-precision Decimal types, never IEEE-754 floats.'
  ),
  q(
    'cs-10',
    'cs-fundamentals',
    'Medium',
    'Garbage Collection',
    'In modern generational garbage collectors (like V8), what assumption makes scavenging the "Young Generation" very fast?',
    [
      'Objects never contain references',
      'Most allocated objects die shortly after creation ("weak generational hypothesis"), so copying only the few survivors clears space in O(live)',
      'Garbage collectors pause for 10 seconds on every function return',
      'Old generation objects are deleted every second',
    ],
    1,
    'Short-lived temporary objects from a request or render cycle are swept cheaply during fast minor GC cycles.'
  ),
  q(
    'cs-11',
    'cs-fundamentals',
    'High',
    'TLS 1.3 Handshake',
    'How does TLS 1.3 improve both latency and security over TLS 1.2?',
    [
      'It removes certificate verification',
      'It drops weak legacy ciphers (RSA key transport, CBC, SHA-1) and completes key exchange in 1-RTT (with 0-RTT resumption options)',
      'It skips Diffie-Hellman so servers reuse one static key',
      'It moves TLS into DNS',
    ],
    1,
    'TLS 1.3 mandates Forward Secrecy (ECDHE) and halves initial handshake round trips from 2-RTT to 1-RTT.'
  ),
  q(
    'cs-12',
    'cs-fundamentals',
    'High',
    'BGP & Anycast Routing',
    'How does a global CDN serve `1.1.1.1` or `cdn.example.com` from the closest city without changing the IP address?',
    [
      'Clients hardcode a list of 300 IPs',
      'Anycast announces the identical IP prefix via BGP from multiple edge PoPs worldwide, letting internet routing send packets to the topologically nearest PoP',
      'DNS changes the IP every millisecond',
      'Browsers probe every data center via ICMP first',
    ],
    1,
    'Anycast + BGP automatically directs traffic to the nearest healthy edge location and reroutes around edge PoP failures.'
  ),
  q(
    'cs-13',
    'cs-fundamentals',
    'High',
    'CPU Cache Lines & False Sharing',
    'In multi-threaded systems programming, what causes "False Sharing" across CPU cores?',
    [
      'Two threads sharing a database password',
      'Two threads mutating independent variables that happen to sit on the same 64-byte CPU cache line, causing constant L1/L2 cache invalidation ping-pong',
      'Running out of virtual memory swap',
      'Using TCP instead of Unix domain sockets',
    ],
    1,
    'Even without logical data sharing, adjacent fields invalidate sibling cores’ cache lines; padding hot per-thread counters to cache-line boundaries eliminates contention.'
  ),
  q(
    'cs-14',
    'cs-fundamentals',
    'High',
    'Virtual Memory & Page Faults',
    'What is the difference between a minor (soft) page fault and a major (hard) page fault?',
    [
      'Minor page faults crash with SIGSEGV; major ones do not',
      'Minor page faults map pages already present in RAM/page-cache without disk I/O; major page faults block while reading pages from disk/swap',
      'Major page faults occur only on GPUs',
      'Both terminate the process',
    ],
    1,
    'Frequent major page faults (thrashing under swap pressure) collapse server throughput by orders of magnitude due to disk latency.'
  ),
  q(
    'cs-15',
    'cs-fundamentals',
    'High',
    'Consistent Hashing',
    'Why do distributed caches and sharded nodes use Consistent Hashing instead of `hash(key) % N`?',
    [
      'Modulo % N crashes when N is even',
      'Changing N in `hash(key) % N` remaps nearly 100% of keys, causing a cache miss storm; Consistent Hashing only remaps ~1/N keys when adding/removing a node',
      'Consistent Hashing compresses keys by 50%',
      'Consistent Hashing requires zero network calls',
    ],
    1,
    'Mapping nodes (plus virtual nodes for even balance) onto a hash ring keeps key churn minimal during cluster scaling.'
  ),
  q(
    'cs-16',
    'cs-fundamentals',
    'High',
    'Bloom Filters',
    'Which statement accurately describes the guarantees of a Bloom Filter?',
    [
      'Zero false positives and zero false negatives',
      'Zero false negatives (if it says "not present", it is definitely absent), with a tunable low false-positive probability',
      'Supports O(1) element deletion in standard implementations',
      'Returns the full stored value for every key',
    ],
    1,
    'Bloom filters use bit arrays + k hash functions to cheaply reject definite misses before hitting expensive disk SSTables or databases.'
  ),

  // ========================
  // DATA STRUCTURES & ALGORITHMS (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'dsa-1',
    'dsa',
    'Low',
    'Time Complexity',
    'What is the average-case time complexity of looking up a key in a Hash Map / JavaScript `Map`?',
    ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    0,
    'A well-distributed hash function maps keys directly to bucket indices in amortized O(1) time.'
  ),
  q(
    'dsa-2',
    'dsa',
    'Low',
    'Binary Search',
    'What precondition must hold before running standard Binary Search (`O(log N)`) on an array?',
    [
      'All values must be positive integers',
      'The array must be sorted according to the search order',
      'The array length must be a power of 2',
      'There must be zero duplicate items',
    ],
    1,
    'Binary search halves the search interval per comparison by relying on monotonic sorted order.'
  ),
  q(
    'dsa-3',
    'dsa',
    'Low',
    'Queues vs Stacks',
    'Which linear data structure follows FIFO (First-In, First-Out) ordering, essential for Breadth-First Search (BFS)?',
    ['Stack', 'Queue', 'Min-Heap', 'Binary Search Tree'],
    1,
    'BFS explores neighbors level by level using a Queue, whereas DFS relies on a Stack (or call recursion).'
  ),
  q(
    'dsa-4',
    'dsa',
    'Low',
    'Two Sum Pattern',
    'How do you optimize finding two numbers in an unsorted array that sum to `target` from `O(N²)` to `O(N)`?',
    [
      'Sort three times',
      'Store previously visited numbers in a Hash Map/Set and check if `(target - current)` already exists in O(1)',
      'Use recursion with a 2D matrix',
      'Check only adjacent pairs',
    ],
    1,
    'Trading O(N) auxiliary hash space converts nested pair checks into a single linear pass.'
  ),
  q(
    'dsa-5',
    'dsa',
    'Low',
    'Linked List vs Array',
    'When is accessing element index `i` faster in a contiguous dynamic array (`O(1)`) than in a singly linked list (`O(N)`)?',
    [
      'Only for strings',
      'Always, because arrays compute `base + i * stride` directly in memory without traversing pointer chains (plus superior CPU cache locality)',
      'Never; linked lists are O(1) random access',
      'Only when arrays contain fewer than 10 items',
    ],
    1,
    'Linked lists require walking `i` node pointers and suffer pointer-chasing cache misses, though O(1) splice/delete works given a node reference.'
  ),
  q(
    'dsa-6',
    'dsa',
    'Medium',
    'Sliding Window',
    'Which algorithmic pattern finds the longest substring without repeating characters in `O(N)` time?',
    [
      'Brute-force triple loop O(N³)',
      'Two-pointer Sliding Window tracking character indices/counts in a Set or Map',
      'Dijkstra Shortest Path',
      'Topological Sort',
    ],
    1,
    'Expanding the right pointer and advancing the left pointer past duplicates ensures each character enters and exits the window at most once.'
  ),
  q(
    'dsa-7',
    'dsa',
    'Medium',
    'Top-K Elements',
    'Which data structure maintains the `K` largest items from a stream of `N` elements in `O(N log K)` time?',
    ['Max-Heap of size N', 'Min-Heap of size K', 'Unsorted Linked List', 'Trie'],
    1,
    'Keeping a Min-Heap capped at size K lets you evict the smallest of the top K whenever a larger candidate arrives in O(log K).'
  ),
  q(
    'dsa-8',
    'dsa',
    'Medium',
    'Cycle Detection',
    'How does Floyd’s Tortoise and Hare algorithm detect a cycle in a linked list using `O(1)` extra memory?',
    [
      'Store every node reference in a WeakSet',
      'Advance slow pointer by 1 step and fast pointer by 2 steps; if a cycle exists, fast eventually laps and meets slow',
      'Reverse the list and compare lengths',
      'Sort node values first',
    ],
    1,
    'Two pointers moving at speeds 1x and 2x close their relative gap inside a loop by 1 node per step, guaranteeing collision in O(N) time and O(1) space.'
  ),
  q(
    'dsa-9',
    'dsa',
    'Medium',
    'Monotonic Stack',
    'Which data structure solves "Next Greater Element" or "Daily Temperatures" in `O(N)` time?',
    ['Monotonic Stack', 'HashSet', 'Disjoint Set Union', 'AVL Tree'],
    0,
    'A monotonic decreasing stack stores unresolved indices; whenever a warmer/larger element arrives, smaller elements pop and resolve in amortized O(1) each.'
  ),
  q(
    'dsa-10',
    'dsa',
    'Medium',
    'Merge Intervals',
    'What is the critical first step in merging overlapping `[start, end]` intervals in `O(N log N)`?',
    [
      'Sort intervals by end descending',
      'Sort intervals by `start` time ascending, then merge sequentially whenever `curr.start <= prev.end`',
      'Build an adjacency matrix',
      'Use Binary Search on unsorted intervals',
    ],
    1,
    'Sorting by start time aligns potentially overlapping segments adjacently so a single linear merge pass handles everything cleanly.'
  ),
  q(
    'dsa-11',
    'dsa',
    'High',
    'LRU Cache Implementation',
    'Which combination of data structures gives an LRU Cache `O(1)` time for both `get(key)` and `put(key, val)`?',
    [
      'Binary Search Tree + Array',
      'Hash Map (key -> node) + Doubly Linked List (maintaining recency order for O(1) move-to-front and tail eviction)',
      'Min-Heap + Queue',
      'Trie + Stack',
    ],
    1,
    'Note that JavaScript’s built-in `Map` preserves insertion order, allowing O(1) LRU via delete-and-reinsert, mirroring a HashMap + Doubly Linked List.'
  ),
  q(
    'dsa-12',
    'dsa',
    'High',
    'Topological Sort',
    'In a build system or task scheduler with dependencies, what does Kahn’s BFS Topological Sort report if a cycle exists?',
    [
      'It produces multiple valid paths',
      'The count of processed zero-in-degree vertices is less than total vertices, proving a dependency cycle exists',
      'It converts the graph into a tree automatically',
      'It runs in O(V²) space',
    ],
    1,
    'Nodes inside a cycle never drop to in-degree 0, letting Kahn’s algorithm detect circular dependencies cleanly in O(V + E).'
  ),
  q(
    'dsa-13',
    'dsa',
    'High',
    'Trie (Prefix Tree)',
    'Why does an autocomplete search engine favor a Trie over sorting a list of 500,000 strings with Binary Search?',
    [
      'Tries use zero memory',
      'Prefix lookup takes `O(L)` proportional only to the query length `L` independent of dictionary size `N`, and enables prefix subtree traversal',
      'Binary search cannot find strings',
      'Tries sort numbers in O(1)',
    ],
    1,
    'Walking `L` characters down the Trie locates all matching completions without log(N) full-string comparisons.'
  ),
  q(
    'dsa-14',
    'dsa',
    'High',
    'Union-Find (DSU)',
    'Which two optimizations reduce Disjoint Set Union (Union-Find) operations to nearly constant `O(α(N))` amortized time?',
    [
      'Bubble sort and recursion',
      'Path Compression during `find()` and Union by Rank/Size during `union()`',
      'Breadth-First Search and Memoization',
      'Binary lifting and Hashing',
    ],
    1,
    'Path compression flattens parent pointers directly toward the root while union-by-rank keeps trees shallow, yielding inverse-Ackermann performance.'
  ),
  q(
    'dsa-15',
    'dsa',
    'High',
    'Dynamic Programming',
    'What two properties indicate a problem fits Dynamic Programming rather than plain Greedy choice?',
    [
      'Sorted input and O(1) space',
      'Optimal Substructure and Overlapping Subproblems (where greedy local choices can fail globally)',
      'Graphs with negative cycles',
      'Strictly linear inputs under 10 items',
    ],
    1,
    'DP caches solutions to overlapping subproblems (top-down memoization or bottom-up tabulation) instead of recomputing exponential branches.'
  ),
  q(
    'dsa-16',
    'dsa',
    'High',
    'Dijkstra Constraint',
    'Why does standard Dijkstra’s shortest-path algorithm fail on graphs containing negative edge weights?',
    [
      'Priority queues crash on negative numbers',
      'Dijkstra greedily marks popped vertices as finalized, assuming future paths can only add positive distance—negative edges can later create a shorter path',
      'It only works on unweighted trees',
      'Time complexity becomes O(1)',
    ],
    1,
    'Use Bellman-Ford (O(V·E)) when negative edge weights or negative-cycle detection are required.'
  ),

  // ========================
  // SYSTEM DESIGN (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'sd-1',
    'system-design',
    'Low',
    'Scaling Axes',
    'How does Horizontal Scaling differ from Vertical Scaling?',
    [
      'Horizontal adds more server instances behind a load balancer; Vertical upgrades CPU/RAM on a single machine',
      'Vertical scaling runs across multiple continents; Horizontal stays on one motherboard',
      'Horizontal scaling requires changing programming languages',
      'There is no cost difference at scale',
    ],
    0,
    'Vertical scaling hits hardware ceilings and single-point-of-failure limits; horizontal scaling distributes load across commodity stateless instances.'
  ),
  q(
    'sd-2',
    'system-design',
    'Low',
    'CDN Caching',
    'Why does placing a Content Delivery Network (CDN) in front of static assets and public reads reduce origin server load and latency?',
    [
      'CDNs rewrite backend SQL queries',
      'CDNs cache responses at geographically distributed Edge PoPs close to users, serving cache hits without hitting the origin',
      'CDNs upgrade user Wi-Fi speed',
      'CDNs remove HTTP headers',
    ],
    1,
    'Edge caching cuts round-trip fiber distance dramatically and shields origin fleets from high-QPS read spikes.'
  ),
  q(
    'sd-3',
    'system-design',
    'Low',
    'Stateless App Tiers',
    'Why should web/API servers store user session state in Redis or signed tokens rather than local server RAM?',
    [
      'Server RAM is slower than disk',
      'Stateless instances allow load balancers to route any request to any healthy server and scale/replace instances freely without logging users out',
      'Local RAM leaks passwords to browsers',
      'HTTP requires Redis by RFC specification',
    ],
    1,
    'Externalizing state lets auto-scalers add or terminate instances cleanly without sticky-session coupling.'
  ),
  q(
    'sd-4',
    'system-design',
    'Low',
    'Latency Numbers',
    'Roughly how much faster is reading 1 KB from local RAM (~100 ns) compared to an SSD random read or cross-region network RTT?',
    [
      'About the same speed',
      'Orders of magnitude faster—RAM is ~1,000x faster than SSD (~100 µs) and ~1,000,000x faster than cross-continent RTT (~100 ms)',
      'Only 2x faster',
      'Network RTT is faster than RAM',
    ],
    1,
    'Understanding latency orders of magnitude drives architectural decisions like minimizing chatty network round trips and caching hot reads.'
  ),
  q(
    'sd-5',
    'system-design',
    'Low',
    'Load Balancers',
    'What is the difference between an L4 (Transport) and L7 (Application) Load Balancer?',
    [
      'L4 routes purely by IP/TCP port at high packet speed; L7 inspects HTTP paths, headers, and cookies to route or terminate TLS',
      'L7 only supports UDP',
      'L4 renders HTML templates',
      'L7 cannot perform health checks',
    ],
    0,
    'L7 balancers unlock host/path routing, canary weights, and WAF inspection; L4 balancers handle extreme raw TCP throughput.'
  ),
  q(
    'sd-6',
    'system-design',
    'Medium',
    'CAP Theorem',
    'During a network partition (P) between two database regions, what fundamental trade-off does the CAP theorem describe?',
    [
      'Cost vs Security',
      'Choosing between Consistency (rejecting writes/reads to avoid stale data) and Availability (serving requests from isolated nodes risking divergence)',
      'SQL vs JSON syntax',
      'Latency vs Disk size',
    ],
    1,
    'Because network partitions inevitably happen in distributed systems, architects pick CP (strict consistency) or AP (high availability + conflict resolution) per workload.'
  ),
  q(
    'sd-7',
    'system-design',
    'Medium',
    'Fan-Out on Write vs Read',
    'In a social feed (like X/Twitter), why do celebrity accounts (50M followers) use Fan-Out-on-Read while normal users use Fan-Out-on-Write?',
    [
      'Celebrities only post images',
      'Pushing one celebrity tweet into 50M follower Redis timelines on write causes huge write amplification ("hotkey problem"); merging celebrity posts at read time keeps writes fast',
      'Normal users cannot use Redis',
      'SQL joins fail on usernames above 10 characters',
    ],
    1,
    'A hybrid model pushes updates eagerly for ordinary users (<1,000 followers) and pulls mega-accounts dynamically at feed-read time.'
  ),
  q(
    'sd-8',
    'system-design',
    'Medium',
    'URL Shortener Design',
    'When designing a URL shortener (`bit.ly`), why prefer Base62 encoding of a distributed counter/KGS over random 4-char hashes?',
    [
      'Random 4-char hashes exceed DNS length limits',
      'Pre-generated/counter-backed Base62 keys guarantee uniqueness without expensive collision-retry DB checks at high write rates (62^7 ≈ 3.5 trillion IDs)',
      'Base62 encrypts destination URLs',
      'Random hashes cannot be stored in SQL',
    ],
    1,
    'A Key Generation Service or Snowflake-style ID encoded in Base62 avoids write-path uniqueness contention while keeping short links compact.'
  ),
  q(
    'sd-9',
    'system-design',
    'Medium',
    'Object Storage Presigned URLs',
    'How should an app upload large user videos (500 MB) to S3/GCS without saturating Node/Python API server memory and bandwidth?',
    [
      'POST the 500 MB file as base64 inside a JSON body to Express',
      'API issues a short-lived, scoped Presigned Upload URL so the browser uploads directly to Object Storage, followed by a webhook/completion check',
      'Store videos inside PostgreSQL BYTEA columns',
      'Split files into 10,000 cookies',
    ],
    1,
    'Direct-to-object-storage uploads offload heavy byte streaming away from app servers while keeping auth and size policies enforced via signed URLs.'
  ),
  q(
    'sd-10',
    'system-design',
    'Medium',
    'Back-of-the-Envelope Math',
    'If a service handles 1,000 QPS average and peak traffic is 3x average, roughly how many daily requests does it serve (~86,400 seconds/day)?',
    ['~8.6 million/day', '~86.4 million/day average (peaking around 3,000 QPS)', '~864,000/day', '~1 billion/day'],
    1,
    '1,000 × 86,400 ≈ 86.4M requests/day; sizing capacity against peak (3,000 QPS) + headroom prevents saturation.'
  ),
  q(
    'sd-11',
    'system-design',
    'High',
    'Write-Heavy Telemetry Ingestion',
    'How do you ingest 500,000 metrics/events per second cleanly without melting a relational database?',
    [
      'Insert every event synchronously into PostgreSQL on the HTTP thread',
      'Buffer events behind a fast partitioned log (Kafka/Kinesis), batch-aggregate in stream workers, and flush into time-series/columnar storage (ClickHouse/Timescale)',
      'Write events into browser localStorage',
      'Use GraphQL Mutations with DataLoader',
    ],
    1,
    'Decoupling ingestion via append-only partitioned logs and micro-batching writes converts 500k random IOPS into efficient sequential bulk writes.'
  ),
  q(
    'sd-12',
    'system-design',
    'High',
    'Distributed ID Generation',
    'How do 64-bit Snowflake IDs generate globally unique, roughly time-ordered IDs across multiple servers without a central DB sequence?',
    [
      'By querying PostgreSQL SERIAL on every call',
      'Bit-packing `[41-bit timestamp | 10-bit worker/datacenter ID | 12-bit sequence]` inside each node independently',
      'By hashing user emails with MD5',
      'By incrementing a shared Redis key over HTTP',
    ],
    1,
    'Snowflake IDs generate >4 million unique monotonic 64-bit IDs per second per node with zero cross-node coordination (handle NTP clock skew carefully!).'
  ),
  q(
    'sd-13',
    'system-design',
    'High',
    'Tail Latency Amplification',
    'Suppose a single backend request fans out in parallel to 10 independent microservices, each having p99 latency of 100ms. What happens to overall p99 latency?',
    [
      'Overall p99 stays 100ms',
      'Probability that ALL 10 finish within 100ms drops to 0.99^10 ≈ 90.4%, making ~10% of parent requests suffer tail latency ("tail at scale")',
      'Overall latency drops to 10ms',
      'Only 1 service determines latency',
    ],
    1,
    'Fan-out amplifies tail latency; mitigate with hedged requests, strict deadlines, caching, and minimizing synchronous fan-out depth.'
  ),
  q(
    'sd-14',
    'system-design',
    'High',
    'Multi-Region Active-Active',
    'Why is Active-Active multi-region write replication significantly harder for financial ledgers than for social likes or analytics?',
    [
      'Financial numbers exceed 32 bits',
      'Concurrent writes in US and EU risk conflicting balance spends without synchronous global consensus (high cross-ocean RTT) or account partitioning by home region',
      'US and EU use different JSON syntax',
      'TLS does not span oceans',
    ],
    1,
    'Banking ledgers require strict serializability per account; pinning each account’s authoritative leader shard to its home region or using Spanner-like consensus prevents double-spends.'
  ),
  q(
    'sd-15',
    'system-design',
    'High',
    'Load Shedding & Backpressure',
    'Under an unexpected 10x traffic spike, why is Graceful Load Shedding (fast 429/503 rejection at the edge) superior to queueing every request until timeouts?',
    [
      'Queueing all requests lets latency grow unboundedly so every request times out after wasting full CPU/DB work ("goodput collapse")',
      '429 responses speed up DNS',
      'Load shedding deletes slow queries permanently',
      'HTTP 503 upgrades server CPU automatically',
    ],
    0,
    'Adaptive concurrency limits (like Little’s Law / Vegas congestion control) shed excess low-priority load early so healthy capacity keeps serving fast responses.'
  ),
  q(
    'sd-16',
    'system-design',
    'High',
    'CQRS Architecture',
    'When is CQRS (Command Query Responsibility Segregation) justified in a high-scale system?',
    [
      'For every basic 3-table CRUD app',
      'When write workloads (normalized ACID validation) and complex read patterns (full-text search, denormalized dashboards) diverge so sharply that separate models/stores shine',
      'Whenever TypeScript is used',
      'To avoid writing API routes',
    ],
    1,
    'CQRS adds eventual-consistency complexity, so reserve it for domains where read/write scale, schemas, or latency shapes differ dramatically.'
  ),

  // ========================
  // WEB SECURITY & AUTH (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'sec-1',
    'web-security',
    'Low',
    'XSS Fundamentals',
    'What is Cross-Site Scripting (XSS)?',
    [
      'CSS failing to load across subdomains',
      'Injecting untrusted executable script into a trusted web page so it executes in victims’ browsers',
      'Brute-forcing SSH passwords',
      'Hijacking DNS registrars',
    ],
    1,
    'XSS lets attackers read DOM/localStorage, hijack sessions, or act as the authenticated user unless untrusted input is strictly escaped or sanitized.'
  ),
  q(
    'sec-2',
    'web-security',
    'Low',
    'Password Hashing',
    'Why are `Argon2id` and `bcrypt` used for password storage instead of `SHA-256`?',
    [
      'SHA-256 cannot hash strings over 8 characters',
      'SHA-256 is designed to be ultra-fast (billions of guesses/sec on GPUs), whereas Argon2id/bcrypt are salted, memory-hard slow KDFs',
      'SHA-256 is reversible encryption',
      'Argon2id validates email syntax automatically',
    ],
    1,
    'Slow, salted, memory-hard hashing raises offline GPU/ASIC brute-force cost exponentially while per-user salts defeat rainbow tables.'
  ),
  q(
    'sec-3',
    'web-security',
    'Low',
    'SQL Injection',
    'What is the universal defense against SQL Injection in backend database queries?',
    [
      'Strip quotes with regex before concatenating SQL strings',
      'Use parameterized queries / prepared statements (or typed ORM bindings) separating SQL syntax from data values',
      'Base64-encode user inputs',
      'Restrict passwords to numbers',
    ],
    1,
    'Parameterized queries send the SQL AST separately from bound parameters so user input can never alter query structure.'
  ),
  q(
    'sec-4',
    'web-security',
    'Low',
    'JWT Structure',
    'Can anyone intercepting a standard signed JWT (`header.payload.signature`) read the user claims inside its payload?',
    [
      'No, standard JWTs (JWS) encrypt the payload with AES',
      'Yes—standard JWS payloads are only Base64URL-encoded, NOT encrypted; never place secrets inside JWT claims',
      'Only if they know the server HMAC secret',
      'Only inside Chrome DevTools',
    ],
    1,
    'Signing guarantees integrity and authenticity, not confidentiality; encrypt sensitive payloads separately (JWE) or omit secrets from tokens.'
  ),
  q(
    'sec-5',
    'web-security',
    'Low',
    'Authentication vs Authorization',
    'How does Authentication (AuthN) differ from Authorization (AuthZ)?',
    [
      'AuthN verifies who you are; AuthZ determines what actions or resources you are permitted to access',
      'AuthZ logs users in; AuthN logs users out',
      'They are synonyms for OAuth',
      'AuthN only runs on mobile apps',
    ],
    0,
    'Verifying identity via login/JWT is Authentication; checking ownership or RBAC permissions per resource is Authorization.'
  ),
  q(
    'sec-6',
    'web-security',
    'Medium',
    'CSRF & SameSite Cookies',
    'How does setting `SameSite=Lax` (or `Strict`) on session cookies protect against Cross-Site Request Forgery (CSRF)?',
    [
      'It encrypts the cookie value',
      'It instructs browsers not to attach the session cookie on cross-site state-changing POST/fetch requests initiated by third-party sites',
      'It blocks XSS scripts from reading window.location',
      'It forces HTTPS on localhost',
    ],
    1,
    'SameSite=Lax blocks cross-origin POST/XHR cookie transmission while preserving normal top-level GET navigations (combine with anti-CSRF tokens for defense-in-depth).'
  ),
  q(
    'sec-7',
    'web-security',
    'Medium',
    'IDOR (Broken Object Level Auth)',
    'A logged-in user changes `GET /api/invoices/1042` to `GET /api/invoices/1043` and views another customer’s invoice. What vulnerability is this?',
    [
      'Clickjacking',
      'IDOR / Broken Object Level Authorization (BOLA), fixed by checking `invoice.ownerId === req.user.id` on the server',
      'DNS Rebinding',
      'Buffer Overflow',
    ],
    1,
    'Never rely on unguessable IDs alone or client filtering—every endpoint must enforce resource ownership/ACL checks server-side.'
  ),
  q(
    'sec-8',
    'web-security',
    'Medium',
    'Content Security Policy',
    'How does a strict `Content-Security-Policy` (CSP) header mitigate the impact of an XSS flaw?',
    [
      'It encrypts JavaScript source files',
      'It tells the browser to block inline scripts and restrict script/connect origins to allowlisted domains or cryptographic nonces',
      'It replaces TLS certificates',
      'It automatically escapes SQL queries',
    ],
    1,
    'Strict nonce-based CSP prevents injected `<script>` tags or exfiltration beacons from executing even if sanitization is bypassed.'
  ),
  q(
    'sec-9',
    'web-security',
    'Medium',
    'OAuth 2.0 PKCE',
    'Why must SPAs and mobile apps use OAuth 2.0 Authorization Code flow with PKCE instead of the legacy Implicit flow?',
    [
      'Implicit flow cannot return JSON',
      'Implicit flow exposed access tokens directly in URL fragments (history/logs/Referer), while PKCE binds the code exchange cryptographically without a client secret',
      'PKCE skips user consent screens',
      'Implicit flow disables refresh tokens only on iOS',
    ],
    1,
    'PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks in public clients where client secrets cannot stay hidden.'
  ),
  q(
    'sec-10',
    'web-security',
    'Medium',
    'SSRF (Server-Side Request Forgery)',
    'An API accepts a user-supplied `avatarUrl` and fetches it from the backend. What SSRF risk must be blocked?',
    [
      'Users uploading large PNG files',
      'Attackers passing `http://169.254.169.254/latest/meta-data/` or internal VPC IPs to steal cloud IAM credentials or scan internal services',
      'Browsers caching avatar images too long',
      'CORS preflight failures',
    ],
    1,
    'Validate schemes (HTTPS only), resolve DNS first and block private/link-local/loopback IP ranges, disable redirects, and enforce IMDSv2 on cloud VMs.'
  ),
  q(
    'sec-11',
    'web-security',
    'High',
    'JWT Algorithm Confusion',
    'Why must JWT verification libraries explicitly pin `algorithms: ["RS256"]` rather than trusting the `alg` header inside the token?',
    [
      'RS256 expires faster',
      'Otherwise an attacker can forge `alg: "none"` or trick a server into verifying an `HS256` HMAC using the public RSA key as the symmetric secret',
      'HS256 cannot encode numbers',
      'Browsers reject RS256 headers',
    ],
    1,
    'Never let untrusted token headers dictate verification algorithms; always enforce an explicit server-side algorithm allowlist.'
  ),
  q(
    'sec-12',
    'web-security',
    'High',
    'Refresh Token Rotation',
    'How does Refresh Token Rotation with reuse detection protect stateless OAuth sessions after token theft?',
    [
      'It turns JWTs into cookies',
      'Each refresh issues a brand-new refresh token and invalidates the old one; if a previously used refresh token is replayed, the server revokes the entire token family',
      'It extends token lifetime to 10 years',
      'It stores passwords inside localStorage',
    ],
    1,
    'Reuse detection immediately spots either a thief replaying a stolen token or a victim refreshing after theft, forcing clean re-authentication.'
  ),
  q(
    'sec-13',
    'web-security',
    'High',
    'Open Redirects & OAuth',
    'Why are open redirects (`/login?next=https://evil.com`) especially dangerous when chained with OAuth callbacks?',
    [
      'They crash CSS animations',
      'Attackers can trick trusted OAuth providers or users into forwarding authorization codes/tokens onto an attacker-controlled domain',
      'They increase bundle size',
      'They break HTTPS HSTS headers',
    ],
    1,
    'Strictly validate `next` redirects against relative same-origin paths or exact allowlisted redirect URIs.'
  ),
  q(
    'sec-14',
    'web-security',
    'High',
    'Prototype Pollution',
    'In JavaScript/Node.js, how can an unguarded recursive merge `merge(target, req.body)` lead to RCE or auth bypass?',
    [
      'By overflowing integer arrays',
      'Payload keys like `__proto__` or `constructor.prototype` mutate `Object.prototype`, injecting properties (`isAdmin: true`) onto every JS object',
      'By deleting `node_modules`',
      'By disabling garbage collection',
    ],
    1,
    'Reject `__proto__`, `constructor`, and `prototype` keys during object merges, validate input schemas strictly (Zod/Ajv), or use `Object.create(null)` / `Map`.'
  ),
  q(
    'sec-15',
    'web-security',
    'High',
    'Clickjacking & Frame Ancestors',
    'Which modern HTTP response header directive supersedes `X-Frame-Options` to prevent Clickjacking across nested iframes?',
    [
      'Access-Control-Allow-Frame: none',
      "Content-Security-Policy: frame-ancestors 'none' (or specific trusted origins)",
      'Strict-Transport-Security: max-age=0',
      'Referrer-Policy: no-referrer',
    ],
    1,
    'CSP `frame-ancestors` checks every ancestor frame in the hierarchy cleanly, replacing legacy single-hop `X-Frame-Options`.'
  ),
  q(
    'sec-16',
    'web-security',
    'High',
    'Supply Chain Lockfiles',
    'How do you mitigate dependency-confusion and typosquatting attacks in enterprise npm/Python pipelines?',
    [
      'Always use `*` version ranges in package.json',
      'Commit lockfiles with integrity hashes (`npm ci`), scope private packages (`@org/pkg`) via private registry routing, and scan PRs with audit/Socket/Dependabot',
      'Disable HTTPS on npm registry',
      'Copy minified dependencies manually via email',
    ],
    1,
    'Scoped private packages + lockfile integrity verification prevent public packages with matching unscoped names from hijacking builds.'
  ),

  // ========================
  // AI ENGINEERING & LLMS (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'ai-1',
    'ai-engineering',
    'Low',
    'Tokens & Context',
    'What is a "token" in Large Language Model APIs?',
    [
      'An OAuth login cookie',
      'A sub-word text unit (~3–4 English characters on average) billed and counted toward context window limits',
      'A GPU hardware core',
      'A JSON schema keyword',
    ],
    1,
    'Tokenizers split text into sub-word pieces; both input prompts and generated output tokens count toward latency, cost, and context limits.'
  ),
  q(
    'ai-2',
    'ai-engineering',
    'Low',
    'Temperature',
    'What effect does setting `temperature: 0` (vs `0.9`) typically have on LLM output?',
    [
      'Doubles response speed',
      'Makes token sampling nearly deterministic and focused on the highest-probability tokens, ideal for extraction/classification',
      'Allows access to real-time web search',
      'Eliminates prompt token limits',
    ],
    1,
    'Low temperature sharpens the probability distribution for reproducible structured outputs; higher temperature increases creative variety.'
  ),
  q(
    'ai-3',
    'ai-engineering',
    'Low',
    'RAG Concept',
    'What problem does RAG (Retrieval-Augmented Generation) solve without fine-tuning model weights?',
    [
      'Compressing PNG images',
      'Grounding LLM answers in up-to-date or private domain documents retrieved at query time, reducing hallucinations',
      'Running models directly inside CSS',
      'Converting Python code into C++',
    ],
    1,
    'RAG injects relevant, verified context chunks alongside citations into the prompt dynamically.'
  ),
  q(
    'ai-4',
    'ai-engineering',
    'Low',
    'API Key Security',
    'In a full-stack web app calling Gemini or OpenAI APIs, where MUST the provider API key live?',
    [
      'Inside Angular environment.ts shipped to browsers',
      'Strictly on the backend server (`.env` / Secret Manager) behind authenticated `/api/*` endpoints',
      'In localStorage so each tab caches it',
      'Inside URL query parameters',
    ],
    1,
    'Any secret bundled into frontend JS is visible in DevTools Network/Sources; always proxy LLM requests through a secure backend.'
  ),
  q(
    'ai-5',
    'ai-engineering',
    'Low',
    'Structured Outputs',
    'Why use native Structured Outputs (`responseSchema` / JSON Schema enforcement) instead of asking "Please reply only in JSON" in plain text?',
    [
      'Plain prompts never work with English',
      'Constrained decoding guarantees syntactically valid JSON matching required types/enums, eliminating fragile regex markdown-fence stripping',
      'Structured outputs cost zero tokens',
      'JSON Schema enables image generation',
    ],
    1,
    'Schema-constrained decoding guarantees downstream code can parse typed objects reliably without crashing on prose wrappers.'
  ),
  q(
    'ai-6',
    'ai-engineering',
    'Medium',
    'Embeddings & Vector Search',
    'How do dense text embeddings improve search in a RAG pipeline compared to exact keyword `LIKE "%word%"` SQL?',
    [
      'Embeddings encrypt user queries',
      'Embeddings map semantic meaning into high-dimensional vectors so queries match conceptually similar passages (e.g., "car" matches "automobile")',
      'Vectors require zero RAM',
      'Embeddings guarantee zero false matches',
    ],
    1,
    'Combining dense vector similarity (cosine/dot-product) with lexical BM25 keyword search (hybrid search) captures both concepts and exact IDs/terms.'
  ),
  q(
    'ai-7',
    'ai-engineering',
    'Medium',
    'Streaming UX',
    'Why do interactive AI apps stream tokens using Server-Sent Events (SSE) rather than waiting for a single buffered HTTP JSON response?',
    [
      'SSE reduces total GPU FLOPs by 90%',
      'Streaming cuts perceived Time-To-First-Token (TTFT) from 8+ seconds down to ~300ms while avoiding HTTP gateway timeouts',
      'JSON cannot exceed 500 characters',
      'Browsers refuse buffered POST responses',
    ],
    1,
    'Progressive token streaming dramatically improves perceived responsiveness on long generations.'
  ),
  q(
    'ai-8',
    'ai-engineering',
    'Medium',
    'Chunking Strategy',
    'In RAG ingestion, why split long PDFs into overlapping semantic chunks (e.g., 500 tokens with 15% overlap) rather than embedding entire 100-page files as one vector?',
    [
      'Databases reject strings above 1,000 bytes',
      'A single vector blurs 100 topics into one noisy average, whereas focused chunks preserve sharp retrieval precision and overlap keeps sentences intact at boundaries',
      'Overlap doubles storage compression',
      'Models cannot read PDFs without 500-token headers',
    ],
    1,
    'Well-sized chunks (with metadata like heading/page path) maximize retrieval signal-to-noise ratio and fit cleanly inside synthesis prompts.'
  ),
  q(
    'ai-9',
    'ai-engineering',
    'Medium',
    'Function Calling (Tools)',
    'During an LLM Function Calling loop, who actually executes the database query or API call when the model emits a `tool_call`?',
    [
      'The LLM provider executes SQL directly on your database',
      'Your own application backend executes the requested function safely with auth checks, then sends the result back to the model',
      'The user’s browser executes it via eval()',
      'The vector database runs it',
    ],
    1,
    'Models only propose structured tool arguments; your server validates permissions, runs the actual code, and returns the tool observation.'
  ),
  q(
    'ai-10',
    'ai-engineering',
    'Medium',
    'LLM Evaluation',
    'Why do production AI teams maintain curated "Golden Eval Datasets" instead of judging prompts solely by eyeballing 3 examples?',
    [
      'Prompt tweaks often fix one case while silently regressing 20% of edge cases; automated eval suites score accuracy, formatting, and latency on every change',
      'Golden datasets retrain foundation weights automatically',
      'Unit tests cannot run in Python',
      'Models forget prompts every Monday',
    ],
    1,
    'Systematic offline evals (exact checks + LLM-as-a-judge rubrics) turn prompt/RAG engineering from guesswork into measurable iteration.'
  ),
  q(
    'ai-11',
    'ai-engineering',
    'High',
    'Indirect Prompt Injection',
    'An AI agent summarizes untrusted web pages or support emails and also has access to a `send_email` tool. What critical risk is this?',
    [
      'Token overflow',
      'Indirect Prompt Injection: hidden instructions inside the summarized email can hijack the agent into exfiltrating private data via `send_email`',
      'Rate limit throttling',
      'Vector quantization drift',
    ],
    1,
    'Untrusted retrieved content must never gain unchecked tool authority; enforce strict least-privilege tools, human confirmation gates for side effects, and domain allowlists.'
  ),
  q(
    'ai-12',
    'ai-engineering',
    'High',
    'RAG ACL Filtering',
    'In a multi-tenant enterprise RAG search (e.g., HR docs + engineering wikis), what happens if you retrieve top-10 chunks globally first and filter permissions afterward?',
    [
      'Latency improves',
      'Authorized users may get 0 results if all top-10 matches belonged to restricted folders; permission filters (`tenant_id`, `allowed_groups`) must execute inside the vector query (pre-filtering)',
      'Vector indexes fail on strings',
      'Embeddings leak passwords mathematically',
    ],
    1,
    'Applying authorization predicates during vector index traversal guarantees both zero data leakage and high recall for permitted documents.'
  ),
  q(
    'ai-13',
    'ai-engineering',
    'High',
    'Two-Stage Reranking',
    'Why do high-accuracy RAG pipelines fetch top-50 candidates via fast Bi-Encoder vectors/BM25 and then re-score them with a Cross-Encoder Reranker to pick the top-5?',
    [
      'Cross-Encoders compress vectors to 1 bit',
      'Bi-encoders embed query and doc separately (fast at million-scale, misses deep interaction), while Cross-Encoders attend across query+doc pairs jointly for much higher precision on the shortlist',
      'Bi-encoders cannot search English text',
      'Rerankers skip tokenization',
    ],
    1,
    'Two-stage retrieval (fast recall -> accurate cross-encoder rerank) boosts RAG faithfulness dramatically without blowing latency budgets.'
  ),
  q(
    'ai-14',
    'ai-engineering',
    'High',
    'Context Caching & Latency',
    'When building an agent that sends the same 80,000-token codebase/manual system prefix on every turn, how do you slash cost and TTFT?',
    [
      'Convert text to base64',
      'Use Context / Prompt Caching so precomputed KV-cache prefixes are reused across turns rather than re-prefilled from scratch',
      'Lower temperature to -1',
      'Send requests via HTTP/1.0',
    ],
    1,
    'Explicit or implicit prefix caching skips redundant prefill compute on static system instructions, manuals, or tool definitions.'
  ),
  q(
    'ai-15',
    'ai-engineering',
    'High',
    'Semantic Routing & Cascading',
    'How does Model Cascading / Routing optimize unit economics in production AI SaaS?',
    [
      'Always route every greeting and typo fix to the largest reasoning model',
      'Route simple/classification requests to fast, low-cost Flash models and escalate only complex reasoning/ambiguous cases to frontier models',
      'Disable streaming for short prompts',
      'Train a brand-new LLM per user',
    ],
    1,
    'Tiered model routing frequently cuts inference spend by 60–80% while reserving deep reasoning capacity for hard queries.'
  ),
  q(
    'ai-16',
    'ai-engineering',
    'High',
    'Agentic Loop Guardrails',
    'What safeguards must wrap autonomous multi-step AI agent tool loops in production?',
    [
      'Unlimited while(true) retries until the goal is reached',
      'Strict max-step/token/cost budgets, idempotent side-effect keys, structured schema validation, and circuit breakers on repeated tool errors',
      'Allowing arbitrary shell `rm -rf` execution without sandboxing',
      'Hiding all tool traces from logs',
    ],
    1,
    'Bounded iteration budgets, sandboxed execution, and human-in-the-loop approvals for irreversible actions prevent runaway spend and destructive loops.'
  ),
];
