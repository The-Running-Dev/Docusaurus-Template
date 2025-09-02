# Product Requirements Document (PRD)

## Title: Unified Projects with Site-wide Authentication

---

## Overview

A robust, secure, and scalable architecture for managing projects with site-wide authentication, advanced admin features, and modern state management. The system will use JWT-based authentication, a unified API, and a modular React component structure, with a focus on maintainability, security, and performance.

---

## Goals

- Implement secure, site-wide authentication (JWT, httpOnly cookies)
- Unify project management under a single component architecture
- Provide advanced admin features for project editing and management
- Modernize state management (React Query, Zustand, Context)
- Enhance security and performance across the stack
- Migrate to maintainable styling (CSS modules/styled-components)
- Comprehensive error handling and testing

---

## Phases & Requirements

### Phase 1: Site-wide Authentication System

- **JWT-based authentication**
  - Access token in memory (15-30 min lifetime)
  - Refresh token in httpOnly cookie (7 days)
  - CSRF protection (SameSite cookies)
- **AuthenticationProvider**
  - Login component (modal/page)
  - JWT token management
  - API integration (DI-based API)
  - Role-based context (admin/user)
  - Auto-refresh & logout handling
- **Protected route wrapper**

### Phase 2: Enhanced API Integration

- **API Endpoints (add to existing API):**
  - POST `/api/auth/login` (JWT authentication)
  - POST `/api/auth/refresh` (token refresh)
  - POST `/api/auth/logout` (invalidate tokens)
  - GET `/api/auth/me` (current user info)

### Phase 3: Unified Projects Component Architecture

- **UnifiedProjects**
  - AuthProvider context
  - ProjectsDisplay (base)
    - Filters & search
    - Project cards (admin overlays)
    - Admin quick actions (if authenticated)
  - AdminOverlay components
    - InlineEditMode
    - BulkActions toolbar
    - AdminTabsModal
    - KeyboardShortcuts
  - State management
    - React Query (API state)
    - Zustand (UI state)
    - Context (auth state)

### Phase 4: State Management Improvements

- **Stack:**
  - React Query/TanStack Query (API state, caching)
  - Zustand (global UI state)
  - React Context (auth state)
  - sessionStorage (tab-specific state)
  - IndexedDB (future offline capability)

### Phase 5: Enhanced Admin Features

- Inline quick edit (double-click to edit)
- Drag & drop reordering
- Advanced bulk actions
- Project templates
- Activity log (debug mode)
- Project validation (link checking, duplicate detection)
- Auto-save (draft changes)

### Phase 6: Security & Performance

- API rate limiting awareness
- Optimistic updates with rollback
- Concurrent edit detection
- Input sanitization (XSS prevention)
- Content Security Policy headers
- Virtualized lists
- Debounced search
- Lazy loading
- Background prefetching

---

## UI/UX Requirements

- **Normal User View:**
  - Filter, search, projects grid
- **Admin User View:**
  - Filter, search, admin mode toggle, projects grid with edit buttons
  - Bulk select, quick edit, advanced edit modal
- **Styling:**
  - Migrate to CSS modules or styled-components
  - Retain current display component styles

---

## Error Handling

- Standardized error handling for API/network/auth failures
- Display errors via toast or bottom div (suggest toast for visibility)

---

## Testing

- Comprehensive tests for admin functionality
- Refactor existing tests as needed

---

## Implementation Strategy

- Build the full system (no backward compatibility required)
- Progressive enhancement not required

---

## Open Questions & Decisions

- **API Extensions:** Add authentication endpoints to existing API
- **Styling:** Migrate to maintainable system, keep display styles
- **Error Handling:** Use toast for errors/issues
- **Testing:** Comprehensive, refactor as needed
- **Progressive Enhancement:** Build full system from start

---

## Timeline

- **Phase 1:** Authentication Foundation (4-6 hours)
- **Phase 2:** Base Integration (3-4 hours)
- **Phase 3:** Advanced Features (6-8 hours)

---

## Success Criteria

- Secure authentication across site
- Unified, maintainable project management UI
- Advanced admin features available to authenticated users
- Modern state management and styling
- Robust error handling and testing
- High performance and security standards
