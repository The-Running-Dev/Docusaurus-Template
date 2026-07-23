# TODO

Last updated: 2026-07-24

This TODO is based on the current repository audit (code, docs, tests, API package, and workflows).

## P0 - Stabilize Development Health

### 1) Fix root test failures (Vitest/jsdom/localStorage)

- [ ] Reproduce and categorize all failing test files.
- [ ] Fix test environment setup for storage APIs so `localStorage.getItem/setItem/clear` are available and stable in tests.
- [ ] Resolve the `--localstorage-file` warning source and remove test runtime noise.
- [ ] Validate by running `pnpm test:run` with zero failing tests.

Acceptance criteria:

- `pnpm test:run` passes locally.
- No storage-related TypeErrors remain in component/hook tests.

### 2) Align test documentation with actual configuration

- [ ] Update testing documentation to match real coverage thresholds.
- [ ] Decide target thresholds (current config vs desired policy) and enforce one source of truth.

Acceptance criteria:

- `testing.md` matches `vitest.config.ts` exactly.

## P1 - Documentation and Workflow Consistency

### 3) Version and narrative cleanup (3.8.1 vs 3.10.1)

- [ ] Update README/docs/workflow comments that still describe 3.8.1.
- [ ] Ensure package metadata description matches actual dependency versions.
- [ ] Include docs alignment tasks as first-class backlog work (not optional cleanup).

Acceptance criteria:

- Public docs and metadata consistently describe Docusaurus 3.10.1.
- Documentation tasks are tracked alongside code tasks in this TODO.

### 4) Workflow comment cleanup

- [ ] Remove unrelated/stale commentary from release workflow (Angular/barstrad references).
- [ ] Keep workflow comments accurate and scoped to this repository.

Acceptance criteria:

- CI/release workflow docs are relevant and trustworthy.

### 5) Raise and enforce stricter coverage policy

- [ ] Increase coverage thresholds in `vitest.config.ts` above current values.
- [ ] Set target thresholds to: lines 80, functions 80, branches 80, statements 80.
- [ ] Align `testing.md`, `AGENTS.md`, and related docs to strict targets.
- [ ] Fix or add tests to meet the stricter threshold policy.

Acceptance criteria:

- Coverage gates are stricter than current defaults and enforced in CI/local checks.
- Docs and config state the same threshold values.

## P2 - API Deferred Scope and Hygiene

### 6) Move API to Phase 2 (single scope)

- [ ] Treat API as Phase 2 scope only (not a primary template requirement in Phase 1).
- [ ] Remove API from default onboarding/docs/navigation paths in Phase 1.
- [ ] Keep API isolated as optional/experimental until Phase 2 execution starts.

Acceptance criteria:

- Main template workflow does not require running API.
- API is clearly labeled as Phase 2/optional in documentation.

### 7) API evaluation checkpoint (keep vs remove)

- [ ] Decision locked: keep API for now because current auth/admin/project-editing flows depend on it.
- [ ] Keep API scoped as Phase 2 optional (not part of default Phase 1 setup).
- [ ] Revisit removal only after API-dependent flows are replaced or intentionally removed.

Acceptance criteria:

- Decision is explicit and documented as keep-for-now.
- No breaking changes are introduced by premature API removal.

### 8) Remove obvious config/code noise

- [ ] Remove duplicate imports in `vitest.config.ts`.
- [ ] Scan for low-risk cleanup items introduced by recent refactors.

Acceptance criteria:

- No duplicate imports or lint-level hygiene regressions in touched files.

### 9) Audit and triage remaining TODO/FIXME items

- [ ] Convert inline TODOs into tracked issues or resolve them.
- [ ] Keep only TODOs that have an owner and expected completion window.

Acceptance criteria:

- Inline TODO count reduced and linked to explicit backlog items.

## Suggested Execution Order

1. P0.1 root tests green.
2. P0.2 testing docs and thresholds aligned.
3. P1.3/P1.4 docs + workflow consistency pass.
4. P1.5 stricter coverage policy + enforcement.
5. P2.6 API moved out of default path and documented as Phase 2.
6. P2.7 API keep/remove decision checkpoint.
7. P2 hygiene and backlog cleanup.

## Open Decisions (Need Product/Owner Input)

- None. Current default decisions are set in this TODO.
