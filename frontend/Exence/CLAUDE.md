# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
ng serve                    # Start dev server at http://localhost:4200
ng build                    # Production build (output: dist/exence/)
ng build --watch --configuration development  # Watch mode

# Testing
ng test                     # Unit tests (Karma/Jasmine)
ng test --include='**/foo.component.spec.ts'  # Run single test file
npx playwright test         # E2E tests
npx playwright test --headed  # E2E with browser visible
npx playwright test --ui    # E2E with Playwright UI

# Code quality
ng lint                     # ESLint check
ng lint --fix               # ESLint auto-fix
prettier . --check          # Prettier check
prettier . --write          # Prettier auto-format
```

The dev server proxies `/api/*` to `http://localhost:8080` via `proxy.conf.js`.

## Architecture

### Framework & Key Patterns

- **Angular 21** with fully standalone components (no NgModules)
- **Zoneless change detection** (`provideZonelessChangeDetection()`)
- **@ngrx/signals** for state management (signal stores, not traditional NgRx)
- Component selector prefix: `ex-`
- Styles: SCSS (scoped per component + global `src/styles/styles.scss`)

### Routing & Auth

- `app.routes.ts`: root routes; root redirects to `/dashboard`
- `src/app/public/` — unauthenticated routes (login, register, forgot-password, email-verification, logout), guarded by `loggedOutGuard`
- `src/app/private/` — authenticated routes (dashboard, statistics, transactions, debts, goals, profile, settings), guarded by `loggedInGuard`
- Auth is cookie-based; `auth.interceptor` adds `withCredentials: true`; `refresh-token.interceptor` handles 401s

### State Management (Signal Stores)

Stores live co-located with their feature (e.g., `widget.store.ts`, `transaction.store.ts`, `category.store.ts`) and follow this composition pattern:

```typescript
export const WidgetStore = signalStore(
  withState(initialState),   // reactive state
  withProps(...),            // injected services + async resources
  withMethods(...),          // actions/mutations
  withComputed(...),         // derived signals
  withHooks(...)             // lifecycle side effects
);
```

Async data loading uses the `resource()` / `rxResource()` pattern inside `withProps`.

### HTTP Layer

- `shared/http/HttpService` — custom wrapper around Angular's `HttpClient` with centralized error handling. Accepts optional `HttpSettings` to suppress errors.
- `shared/user/CurrentUserService` — singleton signal-based service for current user state
- `shared/auth/AuthService` — authentication API calls

### App Structure

```
src/app/
├── data-model/modules/     # TypeScript interfaces/models (auth, transaction, category, statistics, common)
├── private/                # Feature components (each feature may have its own store + service)
│   ├── statistics/         # Widget grid using angular-gridster2; widget catalog dialog
│   ├── transactions-and-categories/
│   ├── dashboard/
│   └── ...
├── public/                 # Auth pages
└── shared/                 # Reusable components, services, directives, pipes
    ├── base-component/     # BaseComponent — extend this for subscription lifecycle management
    ├── dialog/             # DialogService for opening modals
    ├── snackbar/           # SnackbarService for toast notifications
    ├── navigation/         # NavigationService for routing helpers
    └── ...
```

### Key Libraries

| Purpose | Library |
|---------|---------|
| UI Components | @angular/material 21 |
| Grid layout | angular-gridster2 (statistics page) |
| Charts | ApexCharts, Chart.js/ng2-charts, ngx-echarts |
| Dates | date-fns + material-date-fns-adapter |
| Cookies | ngx-cookie-service |
| Infinite scroll | ngx-infinite-scroll |

### Component Conventions

- Extend `BaseComponent` for components needing subscription management
- Use `computed()` signals for derived state rather than manual subscriptions
- Import only what a standalone component directly uses
- Feature-level stores are provided at the route level, not globally
- Don't ever change the component encapsulation nor use ::ng-deep
