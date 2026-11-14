import { QuizQuestion } from '../quiz-types';
import { q } from './q-helper';

export const DEVOPS_QUESTIONS: QuizQuestion[] = [
  // ========================
  // DOCKER & CONTAINERS (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'dk-1',
    'docker',
    'Low',
    'Image vs Container',
    'How does a Docker Image differ from a Docker Container?',
    [
      'An image is a running process; a container is a YAML file',
      'An image is an immutable read-only template; a container is a runnable isolated instance with a thin writable layer',
      'Containers are stored on Docker Hub; images cannot be shared',
      'They are identical terms for a virtual machine',
    ],
    1,
    'Images provide layered immutable filesystems and metadata; running an image creates a container process with isolated namespaces, cgroups, and a writable layer.'
  ),
  q(
    'dk-2',
    'docker',
    'Low',
    'CMD vs ENTRYPOINT',
    'What is the key difference between `ENTRYPOINT` and `CMD` in a Dockerfile?',
    [
      'CMD sets environment variables; ENTRYPOINT exposes ports',
      'ENTRYPOINT defines the fixed executable while CMD supplies default arguments that `docker run <img\> <args>` easily overrides',
      'CMD runs at build time; ENTRYPOINT runs at stop time',
      'ENTRYPOINT is deprecated in Docker 24+',
    ],
    1,
    'Pairing ENTRYPOINT ["node", "server.js"] with CMD ["--port", "3000"] keeps the main binary fixed while letting CLI flags override default arguments.'
  ),
  q(
    'dk-3',
    'docker',
    'Low',
    'Build Context',
    'Why should every production repository include a `.dockerignore` file?',
    [
      'To encrypt secrets inside images',
      'To prevent sending huge folders like `node_modules`, `.git`, and `.env` into the Docker build context',
      'To disable layer caching',
      'To configure bridge DNS',
    ],
    1,
    'Docker sends the entire build context directory to the daemon before building; excluding node_modules and .git speeds builds and avoids leaking local secrets.'
  ),
  q(
    'dk-4',
    'docker',
    'Low',
    'Port Mapping',
    'What does the flag `-p 8080:3000` accomplish in `docker run -p 8080:3000 app`?',
    [
      'Maps container port 8080 to host port 3000',
      'Maps host port 8080 to container port 3000',
      'Allocates 8080 MB RAM and 3000 MB swap',
      'Opens UDP ports 3000 through 8080',
    ],
    1,
    'Port publishing follows `-p HOST_PORT:CONTAINER_PORT`, forwarding traffic arriving on host 8080 into container port 3000.'
  ),
  q(
    'dk-5',
    'docker',
    'Low',
    'Volumes',
    'Why are Docker Named Volumes or Bind Mounts necessary for databases running inside containers?',
    [
      'Container writable layers are ephemeral and disappear when a container is removed',
      'Databases cannot open files inside /var/lib inside Alpine',
      'Volumes double CPU clock speed',
      'Volumes automatically sync across AWS regions',
    ],
    0,
    'Persisting state on a mounted volume decouples database files from container lifecycle across upgrades and restarts.'
  ),
  q(
    'dk-6',
    'docker',
    'Medium',
    'Layer Caching Order',
    'Why do Node.js Dockerfiles copy `package*.json` and run `npm ci` BEFORE `COPY . .`?',
    [
      'npm ci deletes source files otherwise',
      'Source edits invalidate later layers; copying manifests first reuses the expensive cached `npm ci` layer whenever dependencies have not changed',
      'Docker forbids COPY . . at the top of a file',
      'It reduces the number of CPU cores needed',
    ],
    1,
    'Ordering least-frequently-changed layers first maximizes Docker layer cache hits during iterative application builds.'
  ),
  q(
    'dk-7',
    'docker',
    'Medium',
    'Multi-Stage Builds',
    'What is the main advantage of a multi-stage Dockerfile for TypeScript, Angular, or Go apps?',
    [
      'It builds ARM and x86 images from one FROM line automatically',
      'You compile/bundle in a heavy builder stage and copy only runtime artifacts into a minimal distroless/alpine final image, slashing size and CVE surface',
      'It runs unit tests inside production containers',
      'It disables rootless security checks',
    ],
    1,
    'Leaving compilers, devDependencies, and build caches behind in Stage 1 produces small, hardened production images.'
  ),
  q(
    'dk-8',
    'docker',
    'Medium',
    'Non-Root User',
    'Why should production Dockerfiles switch to a non-root user (`USER node` or `USER 1001`)?',
    [
      'Root cannot bind ports above 1024',
      'Running as non-root limits blast radius under principle of least privilege if an app exploit escapes into the container filesystem',
      'Docker refuses to push root images to registries',
      'Non-root containers get twice the network bandwidth',
    ],
    1,
    'Container root (UID 0) maps closely to host privileges if misconfigured; dropping to an unprivileged UID hardens runtime security.'
  ),
  q(
    'dk-9',
    'docker',
    'Medium',
    'PID 1 & Signals',
    'Why does using shell form `CMD node server.js` instead of exec form `CMD ["node", "server.js"]` break graceful shutdown?',
    [
      'Shell form omits PATH',
      '`/bin/sh -c` becomes PID 1 and often does not forward SIGTERM to the child `node` process, forcing a hard SIGKILL after 10s',
      'Exec form disables console.log',
      'Shell form always runs in detached mode',
    ],
    1,
    'Docker sends SIGTERM to PID 1; exec JSON-array form ensures Node (or tini/dumb-init) receives SIGTERM directly for graceful connection draining.'
  ),
  q(
    'dk-10',
    'docker',
    'Medium',
    'Compose Networking',
    'In Docker Compose, how does an `api` service connect to a `postgres` service defined in the same `compose.yml`?',
    [
      'Via `localhost:5432`',
      'Via the service name hostname `postgres:5432` resolved by Docker’s internal bridge DNS',
      'By reading /etc/hosts on the host machine',
      'Only through public IP addresses',
    ],
    1,
    'Compose creates a shared user-defined bridge network where every container resolves sibling services by service name.'
  ),
  q(
    'dk-11',
    'docker',
    'High',
    'Image Layer Secret Leaks',
    'If a Dockerfile runs `COPY .env .` in layer 3 and `RUN rm .env` in layer 4, is `.env` actually removed from the final image?',
    [
      'Yes, layer 4 overwrites layer 3 completely',
      'No—layer 3 still preserves `.env` in the image tarball history and anyone inspecting layers can extract it; use BuildKit `--mount=type=secret` or runtime env injection',
      'Only if using Alpine Linux',
      'Yes, docker push strips deleted files',
    ],
    1,
    'Docker layers are additive union filesystems (whiteouts hide files visually in the final view, but earlier layers retain the bytes forever).'
  ),
  q(
    'dk-12',
    'docker',
    'High',
    'Container Isolation Primitives',
    'Which two Linux kernel features primarily provide container isolation and resource limits?',
    [
      'Hyper-V and BIOS VT-x',
      'Namespaces (isolation of PID, net, mount, user) and cgroups (CPU, memory, I/O quotas)',
      'Systemd timers and SELinux booleans only',
      'eBPF and swap partitions',
    ],
    1,
    'Containers share the host Linux kernel; namespaces isolate visibility/scope while control groups (cgroups) enforce resource ceilings.'
  ),
  q(
    'dk-13',
    'docker',
    'High',
    'BuildKit Cache Mounts',
    'How does `RUN --mount=type=cache,target=/root/.npm npm ci` in BuildKit speed up CI pipelines?',
    [
      'It ships the npm cache inside the final production image',
      'It persists package download caches across builds on the builder host without bloating the final image layers',
      'It skips TLS verification on npmjs.org',
      'It shares node_modules between running containers',
    ],
    1,
    'BuildKit cache mounts survive layer invalidations across builds while remaining excluded from the committed image filesystem.'
  ),
  q(
    'dk-14',
    'docker',
    'High',
    'OOM Killer & Memory Limits',
    'What happens if a container allocates memory beyond `--memory=512m` (with swap disabled)?',
    [
      'Docker automatically doubles the limit',
      'The Linux cgroup OOM killer terminates the offending process with exit code 137 (SIGKILL)',
      'The container pauses gracefully until RAM frees up',
      'Other containers on the host share their RAM',
    ],
    1,
    'Exit code 137 (128 + 9) signals an out-of-memory kill by the kernel cgroup guard; Node.js apps should also align `--max-old-space-size` below the container limit.'
  ),
  q(
    'dk-15',
    'docker',
    'High',
    'Distroless & Read-Only FS',
    'What security benefit does combining a distroless image with `--read-only` root filesystem provide?',
    [
      'It enables hot module replacement in production',
      'Attackers have no shell (`sh`/`curl`) to execute and cannot drop malicious binaries onto disk outside explicit tmpfs mounts',
      'It allows containers to run privileged kernel modules',
      'It disables HTTPS certificate validation',
    ],
    1,
    'Immutable read-only root filesystems plus minimal distroless images dramatically frustrate post-exploitation tooling and persistence.'
  ),
  q(
    'dk-16',
    'docker',
    'High',
    'Multi-Arch Builds',
    'When building an image on an Apple Silicon (arm64) laptop for deployment onto AWS Graviton vs Intel x86 (amd64) EC2 nodes, which tool creates a unified manifest list?',
    [
      'docker commit --multi',
      'docker buildx build --platform linux/amd64,linux/arm64',
      'docker compose --arch=all',
      'docker export --universal',
    ],
    1,
    'Docker Buildx builds multi-platform images and pushes an OCI manifest index so hosts pull the exact architecture matching their CPU.'
  ),

  // ========================
  // KUBERNETES & CLOUD (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'k8s-1',
    'kubernetes',
    'Low',
    'Pods & Deployments',
    'Why do Kubernetes workloads typically define a `Deployment` instead of creating standalone bare `Pod` manifests?',
    [
      'Bare Pods cannot pull images from Docker Hub',
      'Deployments manage ReplicaSets for self-healing, horizontal scaling, and zero-downtime rolling updates/rollbacks',
      'Pods cannot expose HTTP ports without Deployments',
      'Deployments bypass the Kubernetes scheduler',
    ],
    1,
    'If a bare Pod node fails, it stays dead; a Deployment continuously reconciles desired replica counts and orchestrates rolling replacements.'
  ),
  q(
    'k8s-2',
    'kubernetes',
    'Low',
    'Services',
    'Why do Kubernetes Pods communicate via a `Service` DNS name instead of hardcoding Pod IP addresses?',
    [
      'Pod IPs are ephemeral and change whenever Pods restart or reschedule; a Service provides a stable virtual IP and DNS load-balancing endpoint',
      'Pods do not get IP addresses',
      'Services encrypt all TCP packets into HTTPS automatically',
      'Pod IPs only work on localhost',
    ],
    0,
    'Services dynamically track healthy Pod endpoints matching label selectors, keeping internal discovery stable.'
  ),
  q(
    'k8s-3',
    'kubernetes',
    'Low',
    'ConfigMap vs Secret',
    'How does a Kubernetes `ConfigMap` differ conceptually from a `Secret`?',
    [
      'ConfigMaps are encrypted with AES-256 by default in YAML; Secrets are plain text',
      'ConfigMaps hold non-sensitive config while Secrets store sensitive values (base64-encoded in YAML and guarded by RBAC/encryption-at-rest)',
      'Secrets are only for Docker images',
      'ConfigMaps cannot be mounted as files',
    ],
    1,
    'Note that base64 in Secrets is encoding, not encryption—production clusters enable KMS/etcd encryption at rest or External Secrets Operator.'
  ),
  q(
    'k8s-4',
    'kubernetes',
    'Low',
    'Namespaces',
    'What is the purpose of Kubernetes Namespaces?',
    [
      'Replacing Git branches',
      'Logically partitioning cluster resources, RBAC policies, and service names (e.g., staging vs payments) within one cluster',
      'Creating physical servers in AWS',
      'Running Windows containers inside Linux',
    ],
    1,
    'Namespaces scope names, ResourceQuotas, NetworkPolicies, and RBAC bindings for teams or environments.'
  ),
  q(
    'k8s-5',
    'kubernetes',
    'Low',
    'Ingress',
    'Which Kubernetes resource manages external HTTP/HTTPS host/path routing and TLS termination into cluster Services?',
    ['ClusterIP', 'Ingress (or Gateway API)', 'DaemonSet', 'CronJob'],
    1,
    'Ingress controllers (like NGINX, Envoy, AWS ALB) route external L7 HTTP traffic based on hostname and URL path to internal ClusterIP Services.'
  ),
  q(
    'k8s-6',
    'kubernetes',
    'Medium',
    'Requests vs Limits',
    'In a Pod container spec, how does the Kubernetes scheduler use `resources.requests` vs `resources.limits`?',
    [
      'Limits decide scheduling; requests trigger OOM kills',
      'Requests reserve guaranteed node capacity for scheduling decisions; limits cap peak consumption (CPU throttling / memory OOMKill)',
      'Both are ignored unless HPA is enabled',
      'Requests apply only to disk storage',
    ],
    1,
    'The kube-scheduler places Pods based on sum of requests; exceeding memory limits triggers OOMKill while exceeding CPU limits throttles CFS quota.'
  ),
  q(
    'k8s-7',
    'kubernetes',
    'Medium',
    'HPA Autoscaling',
    'What metric does a HorizontalPodAutoscaler (HPA) require to scale a Deployment between min and max replicas?',
    [
      'Defined `resources.requests` on containers plus Metrics Server (or custom Prometheus metrics)',
      'Hardcoded node IP addresses',
      'A StatefulSet volume claim',
      'Disablement of readiness probes',
    ],
    0,
    'HPA calculates utilization percentages against container CPU/memory `requests` (or external/custom metrics) to adjust replica count.'
  ),
  q(
    'k8s-8',
    'kubernetes',
    'Medium',
    'Startup Probe',
    'Why would you add a `startupProbe` alongside `livenessProbe` for a slow-booting JVM or ML model Pod?',
    [
      'To auto-scale GPUs',
      'Startup probes hold off liveness/readiness checks during slow initialization so Kubernetes does not prematurely kill-loop the container',
      'Startup probes expose Prometheus metrics',
      'Startup probes replace initContainers',
    ],
    1,
    'Without a startupProbe, a tight liveness failure threshold can trap slow-starting apps in CrashLoopBackOff before booting finishes.'
  ),
  q(
    'k8s-9',
    'kubernetes',
    'Medium',
    'StatefulSet vs Deployment',
    'When running PostgreSQL or Kafka inside Kubernetes, why choose a `StatefulSet` over a `Deployment`?',
    [
      'StatefulSets skip readiness probes',
      'StatefulSets provide stable ordinal network identities (db-0, db-1), ordered rollout/termination, and dedicated persistent volume claims per Pod',
      'Deployments cannot mount PersistentVolumes at all',
      'StatefulSets run on every node like DaemonSets',
    ],
    1,
    'Stateful applications need sticky identity and per-instance durable storage across restarts.'
  ),
  q(
    'k8s-10',
    'kubernetes',
    'Medium',
    'DaemonSet',
    'Which workload type is ideal for cluster-wide log collectors (Fluent Bit) or node monitoring agents?',
    ['Job', 'DaemonSet', 'ReplicaSet', 'ConfigMap'],
    1,
    'A DaemonSet ensures exactly one Pod runs on every matching node in the cluster automatically as nodes scale up or down.'
  ),
  q(
    'k8s-11',
    'kubernetes',
    'High',
    'Zero-Downtime Termination',
    'Why can a rolling update still drop a few in-flight HTTP requests even when a server handles SIGTERM gracefully?',
    [
      'Kubernetes deletes the Docker image before stopping the Pod',
      'Endpoint removal (`kube-proxy`/ALB propagation) runs asynchronously in parallel with `SIGTERM`; a short `preStop: sleep 5` lets load balancers stop sending new traffic first',
      'Deployments do not support readinessProbes',
      'SIGTERM always triggers immediate SIGKILL',
    ],
    1,
    'Adding a preStop sleep (5–10s) gives kube-proxy/Ingress controllers time to drain Pod IP removal before the app stops accepting sockets.'
  ),
  q(
    'k8s-12',
    'kubernetes',
    'High',
    'PodDisruptionBudget',
    'How does a `PodDisruptionBudget` (PDB) protect production services during voluntary node drains or cluster upgrades?',
    [
      'It caps AWS billing costs',
      'It enforces a minimum `minAvailable` or `maxUnavailable` healthy replica count so cluster maintenance drains nodes safely one at a time',
      'It prevents container OOM kills',
      'It freezes HPA scaling',
    ],
    1,
    'PDBs prevent cluster autoscalers or `kubectl drain` from evicting all replicas of a service simultaneously during upgrades.'
  ),
  q(
    'k8s-13',
    'kubernetes',
    'High',
    'NetworkPolicy',
    'By default in standard Kubernetes CNI setups, which Pods can talk to a sensitive database Pod?',
    [
      'Only Pods in the same Namespace',
      'Every Pod in every Namespace can connect unless a `NetworkPolicy` restricts ingress/egress traffic',
      'Only Pods with matching ServiceAccount tokens',
      'No Pods until Ingress is created',
    ],
    1,
    'Kubernetes networking is flat and open by default; applying default-deny plus explicit NetworkPolicies enforces zero-trust L3/L4 segmentation.'
  ),
  q(
    'k8s-14',
    'kubernetes',
    'High',
    'GitOps & ArgoCD',
    'How does GitOps (ArgoCD / Flux) improve cluster deployment security compared to CI runners holding cluster-admin `kubeconfig`?',
    [
      'GitOps skips YAML validation',
      'An in-cluster pull agent reconciles declared Git state, eliminating the need to expose long-lived cluster credentials to external CI pipelines',
      'ArgoCD builds Docker images directly inside etcd',
      'GitOps removes Kubernetes RBAC',
    ],
    1,
    'Pull-based reconciliation provides automatic drift detection, auditability via Git commits, and tighter credential boundaries.'
  ),
  q(
    'k8s-15',
    'kubernetes',
    'High',
    'Topology Spread Constraints',
    'Which scheduling rule ensures a 6-replica API Deployment spreads evenly across multiple Availability Zones rather than packing onto one zone?',
    [
      'priorityClassName',
      'topologySpreadConstraints (with topologyKey: topology.kubernetes.io/zone)',
      'hostNetwork: true',
      'restartPolicy: Always',
    ],
    1,
    'TopologySpreadConstraints balance Pods evenly across failure domains (zones, nodes), protecting availability if an AZ fails.'
  ),
  q(
    'k8s-16',
    'kubernetes',
    'High',
    'CPU Limit Throttling',
    'Why do some latency-sensitive Go/Node Kubernetes teams omit CPU `limits` while keeping CPU `requests` and equal Memory `requests == limits`?',
    [
      'Because Linux CFS quota throttling on bursts under tight CPU limits can stall short latency spikes even when the host node has idle CPU',
      'Because CPU limits crash the Linux kernel',
      'Because memory limits do not work if CPU limits exist',
      'Because Kubernetes forbids CPU limits on Production clusters',
    ],
    0,
    'Setting CPU requests guarantees scheduling headroom without artificial CFS burst throttling; matching memory requests==limits gives Guaranteed memory stability.'
  ),

  // ========================
  // CI/CD & GITHUB ACTIONS (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'ci-1',
    'cicd',
    'Low',
    'CI vs CD',
    'What is the core distinction between Continuous Integration (CI) and Continuous Delivery/Deployment (CD)?',
    [
      'CI is for backend; CD is for CSS',
      'CI automatically builds and tests merged code changes frequently; CD automates packaging and releasing verified artifacts safely to environments',
      'CI happens only monthly; CD runs locally',
      'CD replaces unit testing',
    ],
    1,
    'CI catches integration defects early on every PR; CD turns tested builds into repeatable, low-risk releases.'
  ),
  q(
    'ci-2',
    'cicd',
    'Low',
    'Deterministic Installs',
    'Why should CI workflows run `npm ci` instead of `npm install`?',
    [
      'npm ci ignores package-lock.json and installs latest minor versions',
      'npm ci installs strictly from package-lock.json cleanly without mutating the lockfile, failing immediately if package.json and lockfile drift',
      'npm ci skips downloading dependencies',
      'npm install is deprecated',
    ],
    1,
    'Deterministic lockfile installs guarantee identical dependency trees across developer laptops, CI runners, and production builds.'
  ),
  q(
    'ci-3',
    'cicd',
    'Low',
    'Workflow Triggers',
    'In GitHub Actions, which YAML event triggers a check suite whenever someone opens or updates a pull request targeting `main`?',
    ['on: { commit: main }', 'on: { pull_request: { branches: [main] } }', 'trigger: pr_main', 'when: merge_request'],
    1,
    'The `pull_request` trigger runs workflows against the ephemeral merge commit of the PR before code lands in main.'
  ),
  q(
    'ci-4',
    'cicd',
    'Low',
    'Secrets Management',
    'Where should deployment tokens and API credentials be stored in GitHub Actions?',
    [
      'Committed in .env.production in Git',
      'In encrypted GitHub Actions Secrets (repository or environment secrets) referenced via `${{ secrets.NAME }}`',
      'Hardcoded in workflow `env:` blocks',
      'Passed inside commit messages',
    ],
    1,
    'Actions secrets are encrypted at rest and automatically masked in runner logs; environment secrets can also enforce manual approval gates.'
  ),
  q(
    'ci-5',
    'cicd',
    'Low',
    'Artifact Caching',
    'What is the benefit of `actions/setup-node` with `cache: "npm"` in a CI workflow?',
    [
      'It deploys the built app to CDN',
      'It caches ~/.npm across runs keyed by lockfile hash, avoiding redundant registry downloads',
      'It skips TypeScript compilation',
      'It automatically bumps package versions',
    ],
    1,
    'Caching the npm/pnpm store cuts CI installation time significantly while keeping clean `node_modules` isolation.'
  ),
  q(
    'ci-6',
    'cicd',
    'Medium',
    'Matrix Builds',
    'How does a GitHub Actions `strategy.matrix` help library and app maintainers?',
    [
      'It encrypts source maps',
      'It spawns parallel jobs testing combinations of Node versions, OS runners, or test shards from a single job definition',
      'It deploys to 10 cloud providers sequentially',
      'It merges pull requests automatically',
    ],
    1,
    'Matrix strategies validate cross-version compatibility or shard heavy E2E suites across multiple runners in parallel.'
  ),
  q(
    'ci-7',
    'cicd',
    'Medium',
    'Concurrency Cancellation',
    'What does `concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }` solve on feature branches?',
    [
      'It runs jobs on self-hosted runners',
      'When you push new commits quickly to a PR, stale outdated CI runs are canceled immediately, saving runner minutes and queue time',
      'It forces deployments to wait 24 hours',
      'It locks the main branch against pushes',
    ],
    1,
    'Canceling superseded PR runs keeps feedback snappy (always set `cancel-in-progress: false` on production deployment branches!).'
  ),
  q(
    'ci-8',
    'cicd',
    'Medium',
    'Blue-Green vs Canary',
    'How does Canary Deployment reduce blast radius compared to Blue-Green Deployment?',
    [
      'Canary deploys zero servers',
      'Canary shifts a small traffic slice (e.g., 5%) to the new version while watching error/latency SLOs before full rollout, whereas Blue-Green switches 100% at once',
      'Blue-Green cannot roll back',
      'Canary skips health checks',
    ],
    1,
    'Canary releases catch subtle production regressions on 1%–5% of traffic with automated rollback before impacting every user.'
  ),
  q(
    'ci-9',
    'cicd',
    'Medium',
    'Feature Flags',
    'Why do elite CI/CD teams decouple "deployment" from "feature release" using feature flags?',
    [
      'Feature flags replace Git version control',
      'Merged code ships to production dark behind a flag, allowing gradual user rollouts and instant kill-switches without redeploying artifacts',
      'Feature flags compile CSS faster',
      'Feature flags bypass authentication',
    ],
    1,
    'Decoupling deploy from release avoids long-lived merge-hell branches and enables sub-second rollback via config toggles.'
  ),
  q(
    'ci-10',
    'cicd',
    'Medium',
    'Build Once, Deploy Many',
    'Why is rebuilding a fresh bundle separately for staging and production considered a CI/CD anti-pattern?',
    [
      'Staging builds use fewer CPU cores',
      'Different build runs can pull drifted dependencies or flags; promoting the exact immutable tested artifact/image digest guarantees staging matches production',
      'Docker registries forbid promoting tags',
      'Staging never runs HTTPS',
    ],
    1,
    'Compiling once and promoting the signed artifact/SHA digest across dev -> staging -> prod ensures what you tested is literally what runs in prod.'
  ),
  q(
    'ci-11',
    'cicd',
    'High',
    'OIDC Keyless Cloud Auth',
    'Why should GitHub Actions authenticate to AWS/GCP/Azure using OIDC federated tokens instead of static IAM access keys?',
    [
      'Static IAM keys expire every 5 minutes',
      'OIDC exchanges short-lived, workflow-scoped JWTs tied to specific repo/branch claims—zero long-lived static secrets stored or rotated',
      'OIDC skips IAM permissions completely',
      'Static keys cannot deploy Docker images',
    ],
    1,
    'Workload Identity Federation with OIDC eliminates leaked static cloud keys and restricts deployment authority down to exact repo + branch/environment.'
  ),
  q(
    'ci-12',
    'cicd',
    'High',
    'Pull Request Target Danger',
    'Why is checking out and running code from an untrusted fork inside a `pull_request_target` workflow a critical security vulnerability?',
    [
      'Forks cannot run Node.js',
      '`pull_request_target` runs in the context of the base repo with access to write tokens and secrets; executing untrusted PR code leaks secrets ("pwn request")',
      'GitHub blocks checkout on public repos',
      'It corrupts git history',
    ],
    1,
    'Never check out and execute untrusted fork code under `pull_request_target`—use standard `pull_request` (read-only token, no secrets) for untrusted PR tests.'
  ),
  q(
    'ci-13',
    'cicd',
    'High',
    'Pinning Third-Party Actions',
    'What supply-chain protection do you gain by pinning GitHub Actions to a full 40-char commit SHA (`uses: actions/checkout@11bd7190...`) instead of `@v4`?',
    [
      'Shorter YAML syntax',
      'Tags like `@v4` are mutable and could be compromised upstream to point to malicious code; a commit SHA is immutable',
      'Commit SHAs skip runner startup',
      'GitHub disables @v4 tags annually',
    ],
    1,
    'Pinning immutable SHAs (with Renovate/Dependabot updates and minimum `permissions: read-all` / least privilege) defends CI against tag-hijacking attacks.'
  ),
  q(
    'ci-14',
    'cicd',
    'High',
    'SLSA Provenance & SBOM',
    'What does generating an SBOM and cryptographic provenance attestation in CI provide?',
    [
      'Automatic unit test coverage of 100%',
      'A verifiable inventory of every transitive dependency and proof that an artifact was built genuinely from a specific source commit',
      'Free CDN bandwidth',
      'Faster browser rendering',
    ],
    1,
    'SBOMs allow instant CVE impact queries across deployed artifacts, while SLSA provenance verifies build integrity before admission to production.'
  ),
  q(
    'ci-15',
    'cicd',
    'High',
    'Database Migrations in CD',
    'In a rolling deployment where v1 and v2 app containers run concurrently for several minutes, what database migration order prevents outages?',
    [
      'Drop old columns first, then deploy v2',
      'Make additive backward-compatible DB changes first (expand), deploy v2, then remove unused old columns in a later cleanup migration (contract)',
      'Pause all user traffic for 1 hour on every deploy',
      'Run migrations only after v1 pods are deleted',
    ],
    1,
    'Because v1 containers are still serving requests while v2 rolls out, destructive schema edits break live v1 queries unless split into expand-and-contract steps.'
  ),
  q(
    'ci-16',
    'cicd',
    'High',
    'DORA Metrics',
    'Which four metrics define DORA engineering delivery performance?',
    [
      'Lines of Code, Story Points, Commits/Day, Bug Count',
      'Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Failed Deployment Recovery Time (MTTR)',
      'CPU Usage, RAM Usage, Uptime %, Disk IOPS',
      'PR Comment Count, Build Minutes, Test Count, Bundle KB',
    ],
    1,
    'DORA balances throughput (Deployment Frequency, Lead Time) with stability (Change Failure Rate, Recovery Time) so speed never sacrifices reliability.'
  ),

  // ========================
  // TESTING & QUALITY (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'tst-1',
    'testing',
    'Low',
    'Testing Pyramid',
    'In the classic Testing Pyramid, which layer should make up the largest share of fast, isolated checks?',
    ['Manual QA clicking', 'Unit tests', 'Full browser E2E tests', 'Production canary monitors'],
    1,
    'Unit tests run in milliseconds with deterministic inputs, forming a wide base topped by integration tests and focused critical-path E2E tests.'
  ),
  q(
    'tst-2',
    'testing',
    'Low',
    'AAA Pattern',
    'What do the three steps of the "AAA" test structure stand for?',
    [
      'Analyze, Automate, Archive',
      'Arrange, Act, Assert',
      'Auth, API, Apply',
      'Allocate, Await, Abort',
    ],
    1,
    'Arranging fixtures/inputs, Acting on the unit under test, and Asserting observable outcomes keeps tests readable and focused.'
  ),
  q(
    'tst-3',
    'testing',
    'Low',
    'Playwright Auto-Waiting',
    'Why does Playwright avoid needing flaky `await page.waitForTimeout(3000)` sleeps before clicking a button?',
    [
      'Playwright freezes JavaScript timers on the page',
      'Playwright Locators automatically wait for actionability checks (visible, stable, enabled) before interacting',
      'Playwright runs browsers without CSS',
      'Buttons in headless Chrome require zero rendering time',
    ],
    1,
    'Built-in auto-waiting and web-first assertions (`expect(locator).toBeVisible()`) retry until the condition holds or timeout expires, eliminating arbitrary sleeps.'
  ),
  q(
    'tst-4',
    'testing',
    'Low',
    'Accessible Queries',
    'In Testing Library and Playwright, why is `getByRole("button", { name: "Submit" })` preferred over `.btn-primary-12` CSS selectors?',
    [
      'CSS selectors run 10x slower',
      'Role queries test real user-facing semantics and accessibility while remaining resilient to CSS/markup refactors',
      'getByRole works even if the button is hidden via display: none',
      'CSS selectors cannot find buttons inside forms',
    ],
    1,
    'Querying by ARIA role and accessible name validates accessibility at the same time as behavior and decouples tests from styling churn.'
  ),
  q(
    'tst-5',
    'testing',
    'Low',
    'Coverage Limits',
    'Why is "100% line coverage" insufficient proof that code is bug-free?',
    [
      'Coverage tools only count comments',
      'Executing a line without meaningful assertions or testing boundary/error edge cases still gives 100% line coverage while missing bugs',
      'Async functions are excluded from coverage reports',
      'Coverage metrics run only in Firefox',
    ],
    1,
    'Coverage measures exercised lines/branches, not assertion quality or untested state combinations (where mutation testing shines).'
  ),
  q(
    'tst-6',
    'testing',
    'Medium',
    'Test Doubles',
    'How does a **Stub** differ from a **Mock** (or Spy verification)?',
    [
      'Stubs run in production; mocks run in staging',
      'A Stub supplies canned responses/state to indirect inputs, whereas a Mock/Spy asserts expectations about how a collaborator was called',
      'Mocks can only test databases',
      'Stubs cannot return Promises',
    ],
    1,
    'Prefer testing observable state/outputs with stubs or real fakes over brittle mock call-order assertions that mirror implementation details.'
  ),
  q(
    'tst-7',
    'testing',
    'Medium',
    'MSW (Mock Service Worker)',
    'Why is MSW often preferred over manually mocking `window.fetch` or Angular `HttpClient` internals in frontend integration tests?',
    [
      'MSW intercepts requests at the real network/fetch layer so actual serialization, headers, status handling, and interceptors still execute cleanly',
      'MSW spins up a real PostgreSQL instance inside Chrome',
      'MSW deletes all CORS headers from production',
      'MSW removes the need for async tests',
    ],
    0,
    'By intercepting HTTP at the network boundary, tests exercise your real HTTP client, interceptors, and error parsing without coupling to internal mocks.'
  ),
  q(
    'tst-8',
    'testing',
    'Medium',
    'Fake Timers',
    'How do you deterministically test a 500ms search debounce or a 30-second quiz countdown in Vitest/Jest without waiting real clock seconds?',
    [
      'Use `setTimeout` inside the test for 31 seconds',
      'Enable fake timers (`vi.useFakeTimers()`) and advance virtual time (`vi.advanceTimersByTime(500)`)',
      'Divide all app delays by 1000 in production code',
      'Skip timer assertions completely',
    ],
    1,
    'Fake timers make time-dependent logic run instantaneously and deterministically with zero CI flakiness.'
  ),
  q(
    'tst-9',
    'testing',
    'Medium',
    'Testcontainers',
    'Why use Testcontainers (real Postgres/Redis containers) instead of SQLite in-memory mocks for backend repository integration tests?',
    [
      'SQLite is faster than RAM',
      'SQLite lacks Postgres-specific syntax/locking/JSONB/MVCC semantics, causing false positives in tests that fail later in production',
      'Testcontainers skips running SQL queries',
      'PostgreSQL cannot run inside Docker',
    ],
    1,
    'Testing against the exact database engine used in production verifies migrations, constraints, window functions, and concurrency locks accurately.'
  ),
  q(
    'tst-10',
    'testing',
    'Medium',
    'Snapshot Testing Pitfalls',
    'What makes large serialized component HTML snapshot tests brittle and low-value over time?',
    [
      'Snapshots do not run in TypeScript',
      'Every minor markup tweak breaks dozens of snapshots, training developers to blindly run `--updateSnapshot` without inspecting regressions',
      'Snapshots take 2 hours per file',
      'Snapshots only work for SVG icons',
    ],
    1,
    'Reserve snapshots for tiny, intentional outputs (e.g., error codes, serialized tokens) and use semantic behavioral assertions for UI.'
  ),
  q(
    'tst-11',
    'testing',
    'High',
    'Flaky E2E Root Causes',
    'What is the most effective way to eliminate cross-test pollution when running Playwright E2E tests in parallel across 4 workers?',
    [
      'Force `--workers=1` and sleep 2s between specs',
      'Give each worker/test an isolated browser context, unique test user/tenant state, and deterministic API/DB seeding',
      'Disable cookies in the browser',
      'Share one global admin row mutated by every test',
    ],
    1,
    'Parallel test suites must own isolated state and unique identifiers so concurrent runs never race on shared database records or sessions.'
  ),
  q(
    'tst-12',
    'testing',
    'High',
    'Mutation Testing',
    'What question does Mutation Testing (e.g., Stryker) answer that standard code coverage cannot?',
    [
      'How fast the webpack bundle loads',
      'If a subtle bug is injected into production code (e.g., flipping `>=` to `>`), do our tests actually fail and catch it?',
      'Which dependencies have npm CVEs',
      'How many lines a developer wrote',
    ],
    1,
    'Stryker introduces small code mutants and measures the "mutation score"—killed mutants prove assertions genuinely verify logic.'
  ),
  q(
    'tst-13',
    'testing',
    'High',
    'Property-Based Testing',
    'When testing a parser, currency calculator, or sorting algorithm, what does Property-Based Testing (e.g., fast-check) catch better than example-based tests?',
    [
      'CSS font loading issues',
      'Unexpected edge cases (empty strings, Unicode surrogates, NaN, overflow) generated automatically across hundreds of randomized shrunk inputs verifying invariants',
      'Docker daemon timeouts',
      'HTTPS certificate expirations',
    ],
    1,
    'Instead of testing 3 handpicked examples, property-based testing asserts universal invariants (e.g., `decode(encode(x)) === x`) and shrinks failing inputs to minimal counterexamples.'
  ),
  q(
    'tst-14',
    'testing',
    'High',
    'Testing Async Streams & Signals',
    'In Angular zoneless applications using Signals and `OnPush`, how do you flush signal updates and effects cleanly in component unit tests?',
    [
      'Call `zone.run()` manually',
      'Update signals/inputs (`fixture.componentRef.setInput(...)`) and run `await fixture.whenStable()` or `TestBed.flushEffects()`',
      'Reload `window.location`',
      'Wrap tests in `setInterval`',
    ],
    1,
    'Modern Angular test utilities flush scheduled effects and template bindings deterministically without relying on Zone.js patching.'
  ),
  q(
    'tst-15',
    'testing',
    'High',
    'Visual Regression Testing',
    'Why can pixel-diff visual regression tests flake across macOS dev laptops and Linux CI runners, and how do teams solve it?',
    [
      'Different OS font rasterizers and anti-aliasing render sub-pixel differences; run visual baselines inside the same pinned Docker container image',
      'Linux Chrome cannot render Flexbox',
      'Browsers hide SVGs in headless mode',
      'PNG files expire after 24 hours',
    ],
    0,
    'Generating and comparing screenshots inside identical containerized browser + OS font environments keeps visual diffs deterministic.'
  ),
  q(
    'tst-16',
    'testing',
    'High',
    'Production Verification',
    'After automated tests pass, how do Mature engineering teams catch environment-only regressions immediately after deploy?',
    [
      'Wait for customers to file support tickets',
      'Run post-deploy synthetic smoke checks, monitor error/latency SLO alerts, and verify canary metrics before shifting 100% traffic',
      'Disable logging to reduce disk usage',
      'Run npm test manually inside SSH',
    ],
    1,
    'Automated testing shifts left while synthetic probes and SLO observability verify real production health continuously.'
  ),

  // ========================
  // LINUX & SHELL CLI (16 Qs: 5 Low, 5 Medium, 6 High)
  // ========================
  q(
    'lnx-1',
    'linux-cli',
    'Low',
    'Permissions',
    'What permissions does `chmod 755 script.sh` assign to Owner, Group, and Others?',
    [
      'rwx for everyone',
      'Owner: read/write/execute (7); Group & Others: read/execute (5)',
      'Owner: read only; Group: write only',
      'Read/write for owner, none for others',
    ],
    1,
    'Octal bits add 4 (read) + 2 (write) + 1 (execute): 7 = rwx, 5 = r-x.'
  ),
  q(
    'lnx-2',
    'linux-cli',
    'Low',
    'Streams & Redirection',
    'In Bash, what does `command > out.log 2>&1` do?',
    [
      'Appends stdout twice',
      'Redirects stdout (FD 1) to `out.log` and redirects stderr (FD 2) to the same destination as stdout',
      'Runs the command twice in background',
      'Sends stdout to network port 2',
    ],
    1,
    'Order matters: `> out.log` points FD 1 to the file first, then `2>&1` points FD 2 to FD 1’s target so both streams capture cleanly.'
  ),
  q(
    'lnx-3',
    'linux-cli',
    'Low',
    'Text Search',
    'Which command recursively searches for `"TODO"` across `./src` while printing line numbers?',
    ['find ./src "TODO"', 'grep -rn "TODO" ./src', 'ls -la | cat TODO', 'sed -i "TODO" ./src'],
    1,
    'grep -r recurses directories and -n prints 1-indexed line numbers (ripgrep `rg` is an even faster modern alternative).'
  ),
  q(
    'lnx-4',
    'linux-cli',
    'Low',
    'Process Lookup',
    'Which command finds which process is currently listening on TCP port 3000 on Linux?',
    ['ps -h 3000', 'ss -tulpn | grep 3000 (or lsof -i :3000)', 'df -h :3000', 'chmod :3000'],
    1,
    'ss (socket statistics) and lsof inspect open network sockets and map them to owning PIDs/process names.'
  ),
  q(
    'lnx-5',
    'linux-cli',
    'Low',
    'Disk Usage',
    'How do `df -h` and `du -sh *` complement each other when diagnosing a full server disk?',
    [
      'df -h shows mounted filesystem free/used space; du -sh * summarizes disk space consumed by each folder/file in a directory',
      'df -h deletes logs; du -sh repairs ext4',
      'Both only show RAM usage',
      'du -sh formats USB drives',
    ],
    0,
    'First locate which mount is 100% full via `df -h`, then drill into directories using `du -sh` to spot runaway log or cache directories.'
  ),
  q(
    'lnx-6',
    'linux-cli',
    'Medium',
    'Safe Bash Scripts',
    'What does placing `set -euo pipefail` at the top of a Bash deployment script enforce?',
    [
      'Encrypts environment variables',
      'Exit immediately on non-zero command errors (-e), fail on unset variables (-u), and propagate failures inside pipelines (-o pipefail)',
      'Runs every line asynchronously in parallel',
      'Disables stderr output',
    ],
    1,
    'Without pipefail or -e, a failing command halfway through a script or pipe silently continues and can deploy broken state.'
  ),
  q(
    'lnx-7',
    'linux-cli',
    'Medium',
    'Signals: SIGTERM vs SIGKILL',
    'Why should you try `kill -TERM <pid>` (signal 15) before `kill -9 <pid>` (SIGKILL)?',
    [
      'kill -9 cannot stop Node.js',
      'SIGTERM lets the process catch the signal, flush buffers, and close DB sockets cleanly; SIGKILL terminates immediately with zero cleanup',
      'SIGTERM restarts the process automatically',
      'kill -9 reboots the host kernel',
    ],
    1,
    'SIGKILL (9) cannot be caught or ignored by user space; reserving it as a last resort prevents corrupted files or half-written state.'
  ),
  q(
    'lnx-8',
    'linux-cli',
    'Medium',
    'Systemd Services',
    'Which command inspects live and recent logs of a systemd service named `api.service`?',
    ['dmesg --api', 'journalctl -u api.service -f', 'systemctl list api', 'tail /proc/api'],
    1,
    'journalctl queries systemd’s structured binary journal filtered by unit (`-u`), following live output with `-f`.'
  ),
  q(
    'lnx-9',
    'linux-cli',
    'Medium',
    'SSH Port Forwarding',
    'What does `ssh -L 5432:10.0.1.50:5432 bastion` establish?',
    [
      'Copies PostgreSQL binaries onto your laptop',
      'Local port forwarding: connecting to localhost:5432 securely tunnels over SSH through `bastion` to private DB `10.0.1.50:5432`',
      'Opens port 5432 publicly on the internet',
      'Starts a DNS server on bastion',
    ],
    1,
    'Local SSH tunneling reaches private VPC databases safely without exposing database ports to the public internet.'
  ),
  q(
    'lnx-10',
    'linux-cli',
    'Medium',
    'xargs & Null Delimiters',
    'Why combine `find . -name "*.log" -print0 | xargs -0 rm` instead of plain `find ... | xargs rm`?',
    [
      'It compresses logs before deleting',
      'Null-byte (`\\0`) separation handles filenames containing spaces, quotes, or newlines safely without word-splitting bugs',
      'It executes across remote servers',
      'xargs -0 skips permission checks',
    ],
    1,
    'Space-delimited pipelines split filenames with spaces into broken paths; `-print0` + `-0` makes shell batch operations safe.'
  ),
  q(
    'lnx-11',
    'linux-cli',
    'High',
    'Deleted Open Files',
    '`df -h` reports `/` is 100% full, yet `du -sh /*` accounts for only 40% of the disk. What is the classic Linux culprit?',
    [
      'CPU cache overflow',
      'A running process still holds an open file descriptor to a huge deleted log file; disk space isn’t freed until the process closes the FD or restarts',
      'The ext4 journal corrupted RAM',
      'Hidden symlinks consume duplicate blocks',
    ],
    1,
    '`lsof +L1` reveals unlinked-but-open files; truncating (`: > /proc/<pid>/fd/<n>`) or reloading the daemon releases the blocks immediately.'
  ),
  q(
    'lnx-12',
    'linux-cli',
    'High',
    'Inode Exhaustion',
    'What error occurs when a filesystem still shows 40% free gigabytes in `df -h`, yet creating a tiny 10-byte file fails with "No space left on device"?',
    [
      'Swap partition full',
      'Inode exhaustion (`df -i` at 100%) caused by millions of tiny session/cache files',
      'RAM ECC failure',
      'MTU packet fragmentation',
    ],
    1,
    'Every file and directory consumes an inode metadata structure; running out of inodes blocks new file creation even when data blocks remain free.'
  ),
  q(
    'lnx-13',
    'linux-cli',
    'High',
    'Linux Page Cache & free -h',
    'When `free -h` shows low `"free"` memory yet high `"available"` memory, should you panic and upgrade RAM?',
    [
      'Yes, the server is about to OOM crash',
      'No—Linux aggressively uses spare RAM as disk Page Cache (`buff/cache`) and instantly reclaims it when applications request memory; watch `available` instead',
      'Yes, unless swap is 100 GB',
      'Page cache slows down database reads',
    ],
    1,
    '"Unused RAM is wasted RAM": Linux caches hot disk blocks in spare memory and counts reclaimable cache inside the `available` column.'
  ),
  q(
    'lnx-14',
    'linux-cli',
    'High',
    'ulimit / File Descriptors',
    'Why do high-connection reverse proxies or Node servers hit `EMFILE: too many open files` under load?',
    [
      'Too many lines in source code',
      'In Linux, every TCP socket is a file descriptor; hitting the default `nofile` soft limit (often 1024) blocks new connections until raised via systemd/limits.conf',
      'Disk sectors are fragmented',
      'Node.js caps arrays at 1024 elements',
    ],
    1,
    'Raising `LimitNOFILE` (e.g., 65536+) allows servers handling tens of thousands of simultaneous sockets to open enough descriptors.'
  ),
  q(
    'lnx-15',
    'linux-cli',
    'High',
    'Zombie Processes',
    'What is a Zombie (`Z`) process in `ps aux` and why won’t `kill -9` remove it?',
    [
      'A process using 100% CPU; kill -9 removes it',
      'An already-exited process whose parent hasn’t called `wait()` to reap its exit status; it uses zero RAM and disappears only when the parent reaps it or exits',
      'A background cron daemon stuck on NFS I/O',
      'A rootkit kernel thread',
    ],
    1,
    'Because a zombie is already dead, signals cannot kill it further—fixing or signaling the parent process (or adopting PID 1 reaping like tini) cleans the process table slot.'
  ),
  q(
    'lnx-16',
    'linux-cli',
    'High',
    'Load Average vs CPU %',
    'On an 8-core Linux host, what does a 1-minute Load Average of `4.0` typically signify?',
    [
      'The server is 400% overloaded',
      'An average of 4 tasks are runnable or in uninterruptible I/O wait (50% capacity on 8 cores, though inspect `top`/`vmstat` to separate CPU vs disk I/O wait)',
      '4 GB of RAM is leaking',
      '4 network interfaces are saturated',
    ],
    1,
    'Linux load average counts both CPU-runnable threads and uninterruptible sleep (D-state disk/NFS I/O), scaled relative to available CPU cores.'
  ),
];
