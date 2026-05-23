# Dimension Presets

The scope card in Phase 1 picks 5–6 dimensions per topic. The right number is
"as few as you can defend"; preset shapes below are starting points, not rigid
templates. Adapt to the topic. If a preset has 7 candidate dimensions and only
5 apply to the user's stack, drop the other 2.

Each dimension corresponds to one `research/0N_<dim>.md` file and one section
in `best-practices.md`.

## How to pick a preset

Read the topic. Match it to the dominant shape:

- The user is shipping HTTP APIs, GraphQL, gRPC, or a backend service →
  **web-service**.
- The user is shipping a binary that runs locally (CLI, daemon, agent) →
  **cli-or-daemon**.
- The user is writing IaC, k8s manifests, Helm charts, Terraform, Pulumi,
  Crossplane → **infra-iac**.
- The user is publishing a library, SDK, or framework → **library-sdk**.
- The user is tuning or designing a database / data store → **data-store**.
- The user is shipping a web frontend (SPA, SSR, MPA) → **frontend-app**.
- The user is shipping a mobile app → **mobile-app**.
- The user is building data pipelines / ETL / ML pipelines → **data-pipeline**.
- The user is building an LLM / AI feature → **llm-feature**.

If the topic spans two presets (e.g., a Next.js service that also has a
backend layer), pick the dominant one and pull 1–2 dimensions from the other.
Do not stack two full presets — that produces a 12-dimension reference that
nobody will read.

## Presets

### `web-service`

Shipping HTTP / GraphQL / gRPC services, regardless of language.

| #  | Dimension                          | Typical contents                                                            |
|----|------------------------------------|------------------------------------------------------------------------------|
| 01 | Language tooling                   | Package manager, linter, formatter, type checker, test runner, version pin. |
| 02 | Framework / runtime                | Web framework version, routing, middleware, request lifecycle, async model. |
| 03 | Data layer                         | DB driver, ORM / query builder, migrations, connection pooling.             |
| 04 | Observability                      | Logging (structured), tracing (OTel), metrics, error tracking.              |
| 05 | Security                           | AuthN/Z, secrets, rate limit, supply chain, OWASP-relevant rules.           |
| 06 | Deploy / CI                        | Container, base image, orchestrator, release flow, healthcheck.             |

Optional 7th: API design (versioning, pagination, errors) when the topic
is API-heavy.

### `cli-or-daemon`

Shipping a binary that runs locally — CLI tool, agent, daemon, MCP server.

| #  | Dimension                          | Typical contents                                                          |
|----|------------------------------------|----------------------------------------------------------------------------|
| 01 | Language tooling                   | Same as web-service.                                                       |
| 02 | UX (flag parsing, help, exit codes)| Argument library, subcommand layout, exit-code conventions, output streams.|
| 03 | Distribution                       | Binary build, signing, supply chain, install paths, autoupdate.            |
| 04 | Configuration                      | Config file formats, env vars, precedence, secrets handling.               |
| 05 | Cross-platform / portability       | OS targets, file paths, line endings, terminal handling.                   |
| 06 | Telemetry / errors                 | Crash reporting, structured logs, opt-in telemetry, redaction.             |

### `infra-iac`

Shipping infrastructure as code — Terraform, Pulumi, Crossplane, Helm, raw k8s.

| #  | Dimension                          | Typical contents                                                          |
|----|------------------------------------|----------------------------------------------------------------------------|
| 01 | Module / component design          | Inputs, outputs, naming, reuse, semver of modules.                         |
| 02 | State / drift management           | Backend, locking, drift detection, refresh cadence.                        |
| 03 | Policy / guardrails                | OPA / Sentinel / Conftest, mandatory tags, denylists.                      |
| 04 | Security                           | Secrets, IAM least privilege, network egress, image provenance, SBOM.      |
| 05 | Cost / quotas                      | Tagging, cost guardrails, quota awareness, sprawl prevention.              |
| 06 | Pipeline / promotion               | Plan/apply flow, environments, approvals, rollback.                        |

### `library-sdk`

Publishing a library, SDK, or framework consumed by other developers.

| #  | Dimension                          | Typical contents                                                          |
|----|------------------------------------|----------------------------------------------------------------------------|
| 01 | API design                         | Public surface, naming, breaking-change rules, deprecation policy.         |
| 02 | Versioning / release               | Semver discipline, changelog, release cadence, signing.                    |
| 03 | Compatibility                      | Supported versions of host language / runtime, EOL policy.                 |
| 04 | Documentation                      | Reference docs generation, examples, migration guides.                     |
| 05 | Testing                            | Unit, contract, fuzz, property; coverage of supported matrix.              |
| 06 | Distribution / supply chain        | Registry, signing, provenance, dependency hygiene.                         |

### `data-store`

Database tuning, design, or operation guidance (e.g., Postgres 17,
ClickHouse 25, Redis 8).

| #  | Dimension                          | Typical contents                                                          |
|----|------------------------------------|----------------------------------------------------------------------------|
| 01 | Schema / data modeling             | Types, normalization, indexing strategy, constraint rules.                 |
| 02 | Query patterns                     | EXPLAIN-driven design, parameter binding, anti-patterns.                   |
| 03 | Operational tuning                 | Memory, storage, vacuum / compaction, replication.                         |
| 04 | Reliability                        | Backups, restore drills, HA topology, failure modes.                       |
| 05 | Security                           | AuthN/Z, network exposure, encryption at rest / in transit, audit logs.    |
| 06 | Migrations / change management     | Online migrations, lock-aware DDL, rollback plans.                         |

### `frontend-app`

Shipping a web frontend (SPA, SSR, MPA) — Next.js, Remix, SvelteKit, Astro,
plain Vite.

| #  | Dimension                          | Typical contents                                                          |
|----|------------------------------------|----------------------------------------------------------------------------|
| 01 | Tooling                            | Package manager, bundler, type checker, linter, formatter.                 |
| 02 | Framework / runtime                | Routing, rendering modes, data fetching, state management.                 |
| 03 | Performance                        | Core Web Vitals, code splitting, image / font handling, caching.           |
| 04 | Accessibility                      | WCAG conformance, ARIA, keyboard nav, screen-reader testing.               |
| 05 | Security                           | CSP, XSS / CSRF defenses, auth flows, input validation.                    |
| 06 | Deploy / CI                        | Edge / origin split, preview envs, release flow.                           |

### `mobile-app`

Shipping iOS / Android / cross-platform mobile.

| #  | Dimension                          | Typical contents                                                          |
|----|------------------------------------|----------------------------------------------------------------------------|
| 01 | Tooling                            | Build system, language version, lint, format, test runner.                 |
| 02 | Architecture                       | UI framework (SwiftUI, Compose, RN), state management, navigation.         |
| 03 | Concurrency / lifecycle            | Async model, background tasks, app lifecycle hooks.                        |
| 04 | Data & networking                  | Persistence, caching, offline, networking, retries.                        |
| 05 | Security & privacy                 | Keychain / Keystore, transport security, privacy manifest, biometrics.     |
| 06 | Distribution                       | Code signing, store submission, crash reporting, OTA where applicable.     |

### `data-pipeline`

ETL / ELT / streaming / ML pipelines.

| #  | Dimension                          | Typical contents                                                          |
|----|------------------------------------|----------------------------------------------------------------------------|
| 01 | Orchestration                      | Scheduler choice, DAG design, retries, backfills.                          |
| 02 | Idempotency / contracts            | Run identity, deduplication, schema contracts.                             |
| 03 | Storage / formats                  | File formats (Parquet, Iceberg), partitioning, retention.                  |
| 04 | Data quality                       | Validation, nulls, drift detection, alerting.                              |
| 05 | Observability                      | Lineage, run logs, latency / freshness SLOs.                               |
| 06 | Security                           | PII handling, masking, access control, audit.                              |

### `llm-feature`

Building an LLM / AI feature (chat, agent, RAG, evals).

| #  | Dimension                          | Typical contents                                                          |
|----|------------------------------------|----------------------------------------------------------------------------|
| 01 | Provider / model selection         | Provider, model id, fallback, region, version pinning.                     |
| 02 | Prompt engineering                 | System / user split, structured output, tool use.                          |
| 03 | Caching / cost                     | Prompt caching, batch, cost tracking, rate limits.                         |
| 04 | Retrieval / RAG                    | Chunking, embeddings, reranker, vector store.                              |
| 05 | Evals / observability              | Offline evals, online traces, judge models, regression bars.               |
| 06 | Safety                             | PII scrubbing, prompt injection, output filters, abuse handling.           |

## Stack-marker globs (used by Phase 1 detection and the companion audit skill)

When a target is given, glob for any of these to identify the preset and the
dimensions that apply:

| Marker family                | Globs                                                                                                                |
|------------------------------|----------------------------------------------------------------------------------------------------------------------|
| Node / TypeScript            | `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `tsconfig.json`, `next.config.*`, `vite.config.*`                      |
| Python                       | `pyproject.toml`, `uv.lock`, `poetry.lock`, `requirements*.txt`, `setup.cfg`                                          |
| Go                           | `go.mod`, `go.sum`, `tools.go`                                                                                        |
| Rust                         | `Cargo.toml`, `Cargo.lock`, `rust-toolchain*`                                                                         |
| Ruby                         | `Gemfile`, `Gemfile.lock`, `*.gemspec`                                                                                |
| Java / Kotlin                | `pom.xml`, `build.gradle*`, `settings.gradle*`                                                                        |
| .NET                         | `*.csproj`, `*.sln`, `global.json`, `Directory.Packages.props`                                                        |
| Swift / iOS                  | `Package.swift`, `*.xcodeproj`, `*.xcworkspace`, `Podfile`                                                            |
| Android                      | `build.gradle*`, `settings.gradle*`, `gradle/libs.versions.toml`                                                      |
| Elixir                       | `mix.exs`, `mix.lock`                                                                                                 |
| PHP                          | `composer.json`, `composer.lock`                                                                                      |
| Container / orchestration    | `Dockerfile*`, `docker-compose*`, `Containerfile`, `*.dockerfile`                                                     |
| Kubernetes                   | `*.yaml` with `kind:`, `kustomization.yaml`, `Chart.yaml`, `values.yaml`                                              |
| Terraform / Pulumi           | `*.tf`, `*.tfvars`, `Pulumi.yaml`, `Pulumi.*.yaml`                                                                    |
| CI                           | `.github/workflows/*`, `.gitlab-ci.yml`, `.circleci/config.yml`, `azure-pipelines.yml`                                |
| Tooling versions             | `.tool-versions`, `.nvmrc`, `.python-version`, `mise.toml`, `asdf.toml`                                               |

The companion audit skill reuses these globs to detect the stack at audit
time. Keep them in sync when generating the audit skill.
