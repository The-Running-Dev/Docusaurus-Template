# API Specs

This document captures the API and admin-editor specification that previously lived in README.md before the Phase 1/Phase 2 scope split.

## Overview

- Runtime: Fastify + TypeScript
- Base URL (local): `http://localhost:4000/api`
- Swagger UI: `http://localhost:4000/api/docs`

## Run Modes

- Start API only: `pnpm --dir api dev`
- Start Docs + API together: `pnpm dev:with-api`

## Authentication

- Write endpoints are protected when `ADMIN_TOKEN` is set in API environment.
- Clients must send admin token for write operations.
- Historical README behavior referenced `x-admin-token` for protected writes.

### GitHub API Integration Auth

- Server-side GitHub API calls should use `GITHUB_TOKEN` from environment variables.
- Never store GitHub tokens in YAML, JSON, or client-side config.
- GitHub endpoint URL construction is documented in `/docs/core-systems/github-config` via `urls.api` and `getApiUrl(endpoint)`.

## Endpoint Highlights

### Health and Resource Discovery

- `GET /api/health`
  - Purpose: API health check

- `GET /api/v1`
  - Purpose: Returns resource list

- `GET /api/v1/{key}`
  - Purpose: Returns one named resource
  - Supported keys from prior README:
    - `badges`
    - `cvData`
    - `giscus`
    - `gitHub`
    - `gitHubLinks`
    - `globalConfig`
    - `navBarLinks`
    - `portfolioData`
    - `projects`
    - `version`

- `GET /api/v1/themes`
  - Purpose: Returns themes derived from `static/themes/*.css`

- `GET /api/v1/nav`
  - Purpose: Returns nav entries derived from `src/pages/demos/*.tsx`

### Projects Storage and CRUD

Storage model:

- Path: `api/storage/projects/<category>/<sub>/<slug>.json`
- Granularity: One JSON file per project

Read endpoints:

- `GET /api/v1/projects`
  - Purpose: Returns combined/nested project structure

- `GET /api/v1/projects/raw`
  - Purpose: Returns flat project list

- `GET /api/v1/projects/:category/:sub/:slug`
  - Purpose: Returns a single project by route keys

Write endpoints:

- `PUT /api/v1/projects/:category/:sub/:slug`
  - Purpose: Create/update project file
  - Protection: requires admin token when `ADMIN_TOKEN` is configured

- `DELETE /api/v1/projects/:category/:sub/:slug`
  - Purpose: Delete project file
  - Protection: requires admin token when `ADMIN_TOKEN` is configured

## Data Migration

- Command: `pnpm --dir api migrate:projects`
- Overwrite mode: `pnpm --dir api migrate:projects -- --overwrite`

## Proposed Phase 2 Endpoints

These endpoint ideas were extracted from historical PRDs. They are not part of the default Phase 1 path and should be treated as proposed extensions unless implemented.

### Projects Metadata Endpoints

- `GET /api/v1/projects/metadata`
  - Purpose: Return categories, subcategories, and tags for admin form helpers

- `POST /api/v1/projects/categories`
  - Purpose: Add a new category for admin workflows

- `POST /api/v1/projects/subcategories`
  - Purpose: Add a new subcategory for admin workflows

- `POST /api/v1/projects/tags`
  - Purpose: Add a new tag for admin workflows

### Authentication Endpoints

- `POST /api/auth/login`
  - Purpose: JWT authentication

- `POST /api/auth/refresh`
  - Purpose: Refresh access token

- `POST /api/auth/logout`
  - Purpose: Invalidate tokens / end session

- `GET /api/auth/me`
  - Purpose: Return current authenticated user info

## Admin Editor Specification (/admin/projects)

### Main UX

- Tabs:
  - Projects (full-width card grid)
  - Edit Project (full-page editor)

- Sticky Filters:
  - Search (centered)
  - Date
  - Category
  - Tags

- Active Chips:
  - Search / Filter / Date
  - Clear All resets state

- Sticky Actions:
  - Select All (Filtered)
  - Clear
  - Delete Selected

- Keyboard:
  - `/` focus search
  - `A` select all
  - `C` clear
  - `Delete` delete selected
  - `E` open edit

- Card Behavior:
  - Category/sub badges
  - Updated marker for recent items
  - Hover lift
  - Per-card Edit/Delete
  - Quick action menu with copy slug

- Loading State:
  - Skeleton placeholders while loading

- Data I/O:
  - Export filtered projects to JSON
  - Import JSON back to API

- Settings:
  - Configure API base
  - Configure admin token
  - Token persisted in localStorage

### Editor Details

- Category/Sub-Category:
  - Select existing values or add new values

- Slug:
  - Editable with live preview
  - Generate from title

- Title:
  - Autofocus on entering edit mode

- Link:
  - Inline validation
  - Test button

- Last Modified:
  - Datetime-local picker
  - ISO preview
  - Stored as ISO

- Tags:
  - Chip editor
  - Add via Enter/comma/Add
  - Remove via close action

- Save Action:
  - Writes to `PUT /api/v1/projects/:category/:sub/:slug`

## Source and Related Docs

- Extraction source: historical README section formerly titled "API + Admin Editor"
- This guide is the canonical docs location for endpoint and API auth details.
