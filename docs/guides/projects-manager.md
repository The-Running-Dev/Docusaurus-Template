---
id: projects-manager
title: Unified Projects Manager
description: One component for public display and admin editing of projects.
---

Overview
- The unified Projects Manager renders the public Projects page and, when gated, an admin editing UI in one component.

Exports
- `ProjectsManager`: Core component with display and admin modes.
- `ProjectsDisplay`: Thin wrapper for public view.
- `ProjectsAdmin`: Thin wrapper wiring admin hooks and settings.

Usage
- Public view:
  - `import Projects from 'src/components/Projects'` (unchanged)
  - or `import { ProjectsDisplay } from 'src/components/Projects'`
- Admin page:
  - `src/pages/admin/projects.tsx` already uses `<ProjectsAdmin />`.

Props (ProjectsManager)
- isAdmin: Enable admin UI.
- adminToken: Optional token passed to admin callbacks.
- onSaveProject(input, token): Persist a project.
- onBulkDelete(targets, token): Delete one or more projects.
- onRefresh(): Refresh data after mutations.

Admin Hook
- `useAdminProjects()` returns `{ apiBase, setApiBase, token, setToken, putProject, bulkDelete, refresh }` and persists token to localStorage.

Data Flow
- Display mode fetches via existing `useProjects` (global store).
- Admin actions use callbacks supplied by the wrapper/hook; the wrapper refreshes the store via `DataLoader`.

Features
- Public: header, stats, filters (date, category, technology, tags), results grid.
- Admin: selection bar, single-item delete per card, quick actions menu (copy slug/link/API URL), edit form (category, sub-category, slug, title, link, lastModified, summary, tags), save, import/export JSON, toasts for feedback.

State Persistence
- Search and filter state persist to `localStorage` under `projects.search` and `projects.filter`.

Keyboard Shortcuts (Admin)
- `/`: Focus search
- `A`: Select all (filtered)
- `C`: Clear selection
- `Delete`: Delete selected
- `E`: Open Edit for selected (or first visible)

Shortcut Hints
- A hint row shows the mappings near the actions bar. Toggle via the “Show/Hide Hints” button; preference persists.

Edit Form Utilities
- Link row provides a Test button to open the link and quick actions to copy link/API URL. Invalid links show an inline error.

Settings
- Gear button opens Settings for API Base, Admin Token, and global keyboard hints. Hints preference persists and propagates to the grid immediately.

Migration Notes
- Existing public routes using `Projects` remain compatible.
- Admin page replaced with the wrapper; no route changes needed.

Testing
- Run `pnpm test:components` to validate Projects components.
