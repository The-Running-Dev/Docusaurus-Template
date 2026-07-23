---
id: unified-projects-auth-specs
title: Unified Projects Auth Specs
sidebar_position: 31
---

This guide extracts the concrete authentication and unified-projects architecture specification from the historical site-wide auth PRD.

## Scope

- Status: Phase 2 optional
- Source: extracted from the historical Unified Projects with Site-wide Authentication PRD
- Related endpoint proposals: `/docs/guides/api-specs`

## Goals

1. Implement secure site-wide authentication.
2. Unify project management under a shared component architecture.
3. Support advanced admin editing features for authenticated users.
4. Modernize state management across auth, UI, and remote data.
5. Improve security, performance, and test coverage.

## Authentication Model

### Token Strategy

- Access token stored in memory.
- Typical access-token lifetime: 15 to 30 minutes.
- Refresh token stored in an httpOnly cookie.
- Typical refresh-token lifetime: 7 days.
- CSRF protection via SameSite cookie strategy.

### Authentication Provider Responsibilities

- Render login UI as modal or page.
- Manage JWT token lifecycle.
- Integrate with service/API layer.
- Expose role-aware auth context.
- Support auto-refresh and logout flows.

### Protected Routing

- Wrap protected admin routes.
- Distinguish normal and admin user capabilities.
- Fail safely when auth refresh or identity lookup fails.

## Proposed Auth Endpoints

These endpoint proposals are historical design inputs and are also listed in `/docs/guides/api-specs`.

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Unified Projects Architecture

### High-Level Structure

- `AuthProvider` context at the top level.
- `ProjectsDisplay` as the base display component.
- Admin overlays enabled for authenticated/admin users.
- Shared filtering, search, and project-card foundations.

### Admin Overlay Components

- `InlineEditMode`
- `BulkActions` toolbar
- `AdminTabsModal`
- `KeyboardShortcuts`

## State Management

### Planned Stack

- React Query / TanStack Query for remote data state and caching.
- Zustand for global UI state.
- React Context for auth state.
- sessionStorage for tab-scoped state.
- IndexedDB as a future offline capability.

## Enhanced Admin Features

- Inline quick edit via double-click.
- Drag-and-drop reordering.
- Advanced bulk actions.
- Project templates.
- Activity log for debug/admin workflows.
- Validation such as link checking and duplicate detection.
- Auto-save for draft changes.

## Security and Performance Requirements

### Security

- Rate-limiting awareness for auth and write flows.
- Optimistic updates with rollback support.
- Concurrent edit detection.
- Input sanitization for XSS prevention.
- Content Security Policy headers.

### Performance

- Virtualized lists for larger datasets.
- Debounced search.
- Lazy loading.
- Background prefetching.

## UI and UX Requirements

### Normal User View

- Filtering
- Search
- Projects grid

### Admin User View

- Filtering
- Search
- Admin mode toggle
- Projects grid with edit affordances
- Bulk selection
- Quick edit
- Advanced edit modal

### Styling Direction

- Migrate to CSS modules or styled-components.
- Preserve the public display component look and feel.

## Error Handling

- Standardize handling for API, network, and auth failures.
- Surface errors via toast or an equivalent prominent UI.

## Testing Expectations

- Comprehensive admin/auth coverage.
- Refactor existing tests as needed to support the new architecture.

## Implementation Strategy

- Build the full system directly; no backward compatibility requirement in the original proposal.
- Progressive enhancement was not a requirement in the original proposal.

## Open Product Decisions

- Whether auth endpoints should extend the existing API surface.
- How far to migrate styling away from existing display components.
- Whether toast-based error handling is sufficient for all failure modes.
- How much of the architecture should be implemented at once versus phased.

## Success Criteria

- Secure authentication across the site.
- Unified and maintainable project-management UI.
- Advanced admin features available to authenticated users.
- Modern state management and styling.
- Robust error handling and tests.
- Strong security and performance characteristics.
