# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build` (runs `tsc -b && vite build`)
- **Lint:** `pnpm lint` (eslint)
- **Preview production build:** `pnpm preview`
- **Add shadcn component:** `pnpm dlx shadcn@latest add <component-name>`

## Architecture

This is a **React 19 + TypeScript** SPA client for a booking/play platform, built with Vite 7 and using React Compiler (babel-plugin-react-compiler).

### Path Alias

`@/` maps to `./src/` (configured in both `tsconfig.json` and `vite.config.ts`). Always use `@/` imports.

### Key Tech Stack

- **Routing:** react-router v7 (BrowserRouter in `main.tsx`)
- **Data fetching:** TanStack React Query v5 + Axios
- **Forms:** react-hook-form + Zod v4 for validation
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin), tw-animate-css
- **UI components:** shadcn/ui (new-york style, gray base color, CSS variables, lucide icons)
- **Toasts:** sonner
- **Package manager:** pnpm

### Source Layout (`src/`)

```
src/
├── App.tsx                    # Routes + ProtectedRoute
├── main.tsx                   # Entry point (BrowserRouter + QueryClient + AuthProvider)
│
├── pages/                     # Feature-organized page components
│   ├── auth/
│   │   ├── login/LoginPage.tsx
│   │   └── register/RegisterPage.tsx
│   ├── business/
│   │   └── create/CreateBusinessPage.tsx
│   └── home/HomePage.tsx
│
├── components/
│   ├── auth-layout.tsx        # Two-panel layout for auth pages
│   ├── common/
│   │   └── Navbar.tsx         # Header with logout
│   └── ui/                    # shadcn/ui primitives (auto-generated)
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── sonner.tsx
│       └── textarea.tsx
│
├── services/                  # Static API service classes
│   ├── auth.service.ts        # register(), login(), me()
│   └── business.service.ts    # getBusinesses(), getBusinessDetails(id), createBusiness()
│
├── models/                    # Zod schemas + inferred TS types (TXxx pattern)
│   ├── auth.model.ts          # RegisterRequest, LoginRequest, AuthUser, LoginResponse
│   ├── user.model.ts          # User (globalRole: MASTER | PLAYER)
│   ├── business.model.ts      # Business, CreateBusiness (slotDuration, timezone)
│   ├── court.model.ts         # Court (surface, capacity, pricePerHour, etc.)
│   ├── booking.model.ts       # Booking (status: ACTIVE | CANCELLED)
│   ├── availability-rule.model.ts
│   ├── business-user.model.ts # BusinessUser (role: OWNER | ADMIN | STAFF)
│   ├── court-availability.model.ts
│   ├── court-exception.model.ts
│   └── exception-rule.model.ts
│
├── context/
│   └── auth.context.tsx       # AuthProvider + useAuth hook
│
├── queries/                   # TanStack React Query hooks
│   └── business/
│       ├── get.ts             # useBusinessQuery()
│       └── post.ts            # useCreateBusinessMutation()
│
├── utils/
│   └── api.ts                 # axiosInstance + setAuthInterceptor()
│
└── lib/
    └── utils.ts               # cn() helper (clsx + tailwind-merge)
```

### Routes (App.tsx)

| Path | Component | Access |
|------|-----------|--------|
| `/` | `HomePage` | Public |
| `/login` | `LoginPage` | Public (redirects to `/businesses/new` if authenticated) |
| `/register` | `RegisterPage` | Public (redirects to `/businesses/new` if authenticated) |
| `/businesses/new` | `CreateBusinessPage` | Protected (ProtectedRoute → `/login`) |

### API Layer

- Base URL: `VITE_API_BASE_URL` env var + `/api` (e.g. `http://localhost:3000/api`)
- `axiosInstance` in `utils/api.ts` is the shared HTTP client — all services use it
- Auth uses Bearer token via request interceptor (`setAuthInterceptor`)
- Services are static classes (e.g., `AuthService.login()`, `BusinessService.createBusiness()`)

### Auth

- Token stored in `localStorage` key `access_token`
- `auth.context.tsx` exposes `useAuth()` → `{ user, isAuthenticated, login, logout, refreshUser }`
- `setAuthInterceptor(token)` ejects previous interceptor before adding the new one
- `AuthService.me()` fetches current user on app mount

### Conventions

- **Form schemas:** use plain string fields with react-hook-form; convert to API types in the submit handler (avoid `z.preprocess` / `z.coerce` — breaks resolver types)
- **Models:** define Zod schema first, then `export type TXxx = z.infer<typeof XxxSchema>`
- **Query hooks:** live in `src/queries/<feature>/get.ts` or `post.ts`; use `useQuery` / `useMutation` from `@tanstack/react-query`
- **shadcn components:** use `cn()` from `@/lib/utils` for className merging
- **CVA:** use `class-variance-authority` for variant-based component styling
- **Radix UI:** imported from `radix-ui` package (e.g., `Slot` from `"radix-ui"`)
- **TypeScript:** strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- **Language:** all UI text (labels, placeholders, error messages) is in **Spanish**
