# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
./gradlew build

# Run application
./gradlew bootRun

# Run all tests
./gradlew test

# Run a single test class
./gradlew test --tests "com.exence.finance.validators.PasswordValidatorTest"

# Format code (Palantir Java Format via Spotless)
./gradlew spotlessApply

# Check formatting without applying
./gradlew spotlessCheck

# Run Checkstyle
./gradlew checkstyleMain
```

The Docker Compose file for the PostgreSQL database is at `technical/exence-docker/docker-compose.yml`.

## Architecture

This is a Spring Boot 3.4.1 / Java 23 REST API for a personal finance application. The codebase uses virtual threads, QueryDSL for dynamic queries, Liquibase for migrations, and MapStruct for DTO mapping.

### Module structure

All code lives under `com.exence.finance`, split into:

- **`modules/`** — Feature modules, each self-contained:
  - `auth` — Authentication, sessions, users, JWT tokens, password management
  - `category` — Transaction categories
  - `transaction` — Financial transactions with dynamic filtering via QueryDSL
  - `statistics` — Dashboard widgets and data providers (35+ widget types)
  - `email` — Email sending, templating, and logging
- **`common/`** — Shared: annotations, validators, exceptions, DTOs, aspects, converters, utils
- **`config/`** — Spring configuration classes and `@ConfigurationProperties`
- **`security/`** — JWT filter, auth entry point, email verification interceptor

### Layering pattern

Each module follows: `Controller (interface) → ControllerImpl → Service (interface) → ServiceImpl → Repository → Entity`

Controllers are defined as interfaces; implementations are in an `impl/` subpackage. This pattern applies to both controllers and services.

### Key conventions

- **Entities** extend `BaseAuditableEntity` (createdAt, updatedAt, createdBy, updatedBy via Spring Data auditing).
- **Mappers** use MapStruct with `componentModel = "spring"`.
- **Validation** uses custom constraint annotations (e.g., `@ValidPassword`, `@UniqueEmail`, `@ValidColor`) backed by validators in `common/validators/`. Regex patterns and length limits live in `ValidationConstants`.
- **Exceptions** are custom classes that produce `ProblemDetail` responses, handled centrally in `GlobalExceptionHandler`.
- **Transactions**: services annotate class-level `@Transactional(readOnly = true)` and override write methods with `@Transactional`.
- **Logging**: AOP-based via `ServiceLoggingAspect` using `@ServiceLogDocument`.

### Statistics / Widget system

`statistics` is the most complex module. Widgets are stored in the DB and each has a `WidgetType` enum value. Data is computed by `WidgetDataProvider` implementations (one per widget type, ~35 providers in `service/provider/`). Providers query `DailyCategoryStat`, a PostgreSQL materialized view refreshed via Spring events (`MaterializedViewRefreshEvent`). Dynamic filtering uses `StatisticsPredicateBuilder` (QueryDSL).

### Security

- JWT-based auth with access + refresh tokens stored in HTTP-only cookies.
- Password hashing with Argon2id (custom `Argon2PasswordEncoder`).
- `JwtAuthenticationFilter` validates tokens on each request.
- `EmailVerificationInterceptor` gates endpoints requiring verified email.
- Token types: `ACCESS`, `REFRESH`, `PASSWORD_RESET`, `EMAIL_VERIFICATION`.

### Database

- PostgreSQL 16 via Docker.
- Liquibase changelogs in `src/main/resources/db/changelog/`, versioned (`v1.0.0/`, `v1.1.0/`), YAML format.
- Dev profile loads test data from `data/test-data.yaml`.
- Native PostgreSQL enums are used for `transaction_type` and `category_type`.

### Code quality

- **Formatting**: Palantir Java Format enforced via Spotless — run `spotlessApply` before committing.
- **Checkstyle**: Max line length 120, max cyclomatic complexity 20.
- **Lombok** is used extensively (`@Slf4j`, `@SuperBuilder`, `@Data`, `@RequiredArgsConstructor`).
- **QueryDSL** requires APT code generation (happens during build via `annotationProcessor`).
