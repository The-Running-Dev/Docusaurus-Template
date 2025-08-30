# Repository Guidelines

## Project Structure & Module Organization
- `docs/`: Markdown/MDX content and docs sidebar entries.
- `src/`: React/TypeScript custom pages, theme, and utilities.
- `static/`: Static assets served at site root.
- `config/`: YAML config sources watched and transformed at build.
- `scripts/`: TypeScript build utilities (e.g., pre-build, validation).
- `artifacts/`: Build output (`pnpm build` writes here).
- Key config: `docusaurus.config.ts`, `sidebars.ts`.

## Build, Test, and Development Commands
- `pnpm start`: Run local dev server.
- `pnpm dev`: Dev server + watch `config/**/*.yml` and re-run pre-build.
- `pnpm build`: Pre-build then Docusaurus static build to `./artifacts`.
- `pnpm serve`: Preview a production build.
- `pnpm test` / `pnpm test:run` / `pnpm test:ui`: Run Vitest (CLI or UI).
- `pnpm lint` / `pnpm lint:fix`: ESLint checks/fixes `src/**` and `scripts/**`.
- `pnpm format` / `pnpm format:check`: Prettier write/check.
- `pnpm quality`: Format check, lint, typecheck, prebuild check, GitHub config validation.

## Coding Style & Naming Conventions
- TypeScript + React; prefer function components and hooks.
- Prettier: single quotes, semicolons, no trailing commas (`.prettierrc`).
- Indentation: Prettier defaults (2 spaces).
- ESLint: TypeScript rules with relaxed strictness; fix warnings before commit.
- Naming: `PascalCase` for components, `camelCase` for vars/functions, `kebab-case` for files.

## Testing Guidelines
- Framework: Vitest (`vitest.config.ts`, node env, globals enabled).
- Place tests alongside code using `*.test.ts`/`*.test.tsx`.
- Aim to cover utilities, scripts, and custom React logic.
- Run locally with `pnpm test` before opening a PR.

## Commit & Pull Request Guidelines
- Husky hooks:
  - `pre-commit`: runs `pnpm lint`.
  - `commit-msg`: enforces minimum length and suggests Conventional Commits.
  - `post-commit`: pushes branch.
- Prefer Conventional Commits (e.g., `feat: add search bar`).
- PRs: include summary, linked issues, screenshots for UI changes, and steps to validate.

## Security & Configuration Tips
- Node >= 18, pnpm >= 8 (see `package.json` engines).
- When editing `config/**/*.yml`, use `pnpm dev` (auto pre-build) or run `pnpm prebuild` manually.
