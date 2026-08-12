# Onawa Brand Discovery Portal — Agent Guide

## Quick Commands

```bash
npm run dev          # Start dev server (tsx server.ts + Vite)
npm run build        # Vite build + esbuild server.ts -> dist/server.cjs
npm run lint         # tsc --noEmit (type check only)
npm run start        # Run production build (node dist/server.cjs)
```

## Architecture

- **React 19 + Vite 6 + Tailwind 4** (single-page app)
- **Supabase** (PostgreSQL + Auth) — client in `src/lib/supabase.ts`
- **Fabric.js** for mood board canvas (`src/components/InteractiveMoodBoard.tsx`)
- **State**: single `BrandQuestionnaireState` object in `App.tsx` (12-step wizard)
- **Auth**: Supabase email/password + Google OAuth via `ClientProfileModal.tsx`
- **Email**: Web3Forms (no EmailJS) — `src/utils/emailService.ts`

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component, all state, navigation, Supabase session restore, step logic |
| `src/lib/supabase.ts` | Supabase client + `getDiscoveryStatus`, `calculateCompletedSteps`, `getStepIncompleteFields` |
| `src/types.ts` | All TypeScript interfaces (`BrandQuestionnaireState`, etc.) |
| `src/components/ClientProfileModal.tsx` | Sign up / sign in / Google OAuth |
| `src/utils/emailService.ts` | Web3Forms integration (brand blueprint + welcome email) |

## Critical Behavior

- **Fresh start enforced**: `INITIAL_STATE` is blank; no localStorage loads on mount. Session restores *after* Supabase auth check.
- **Checkmarks are data-driven**: `calculateCompletedSteps(state)` returns completed steps; UI derives from that.
- **Linear gating**: Continue button disabled until `getStepIncompleteFields(currentStep, state)` is empty. Warning bar shows missing fields in red.
- **Step jump restricted**: Can only jump to `furthestSequentialComplete + 1` or backward.
- **Welcome email**: Sent on signup via `sendWelcomeEmail()` in `ClientProfileModal.tsx`.

## Supabase

- Project: **Onawa-Brand-Discovery** (`rjgwcrljmimcilojbbdv`)
- Table: `discovery_responses` (RLS: `user_id = auth.uid()`)
- MCP: `opencode mcp auth supabase` to authenticate; then use `execute_sql`, `list_users`, etc.

## Env

No `.env` in repo. Required vars (set in deployment):
```
VITE_SUPABASE_URL=https://rjgwcrljmimcilojbbdv.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

## Style / Conventions

- Tailwind 4 + custom CSS variables (neon accents: `#C1FF00`, `#00FFC2`, `#FF002B`, `#2B00FF`)
- `lucide-react` icons
- `motion/react` for animations
- `@` alias maps to project root (`tsconfig.json` + `vite.config.ts`)

## Gotchas

- HMR disabled in AI Studio via `DISABLE_HMR=true` (see `vite.config.ts`)
- `import.meta.env` needs `"types": ["vite/client"]` in `tsconfig.json`
- `logoType` allows empty string (`"" | "logomark" | ...`) for blank start
- Auto-save to localStorage + Supabase is guarded by `isInitializing.current` until session restore completes