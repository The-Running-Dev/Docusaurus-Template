# Docusaurus Template

[![codecov](https://codecov.io/gh/The-Running-Dev/Docusaurus-Template/branch/main/graph/badge.svg)](https://codecov.io/gh/The-Running-Dev/Docusaurus-Template)

A comprehensive, reusable Docusaurus template for creating professional documentation sites with modern features, YAML-based configuration, and data-driven components.

## ✨ Key Features

- 🚀 **Modern Docusaurus 3.8.1** with TypeScript support
- 🎨 **Dynamic Theme System** - 10+ themes with cross-route compatibility
- 📊 **Data-Driven Components** - Portfolio, Projects, CV components with YAML configuration
- 🏷️ **GitHub Badge System** - Automated project status badges
- 💬 **Giscus Comments** - GitHub Discussions integration
- ⚡ **Schema Validation** - Zod-based validation for all configuration data
- 🔧 **Developer Tools** - ESLint, Prettier, quality gates
- 📦 **Enhanced Build System** - Configurable output directory with pre-build automation
- 🛠️ **YAML Configuration** - User-friendly configuration system with automatic validation

## 🆕 Latest Features

### 📊 Component System

- **Portfolio Component**: Professional project showcase with filtering (`/portfolio`)
- **Projects Component**: Advanced project listing with search and URL state (`/projects`)
- **CV Component**: Professional timeline display with configurable data (`/cv`)
- **Live Demos**: Interactive demo pages for all components (`/demos/`)

### 🔧 Enhanced Configuration System

- **YAML-Based**: Replaced TypeScript configs with user-friendly YAML files
- **Schema Validation**: Automatic validation using Zod schemas
- **Type Safety**: Full TypeScript support with generated types
- **Live Reload**: Configuration changes trigger automatic reloads
- **New**: Cross-platform build script compatibility

## 🚀 Quick Start

```bash
# Copy template and install dependencies
cp -r Docusaurus-Template my-docs-site
cd my-docs-site
pnpm install

# Configure the template (PowerShell)
.\template-setup.ps1

# Start development server with quality checks
pnpm run start
```

## 🛠️ Development Workflow

The template includes comprehensive development tooling:

```bash
# Development
pnpm run start          # Start dev server with pre-build
pnpm run build:prod     # Production build to ./artifacts

# Code Quality
pnpm run lint           # ESLint checking
pnpm run format         # Code formatting with Prettier
pnpm run typecheck      # TypeScript validation
pnpm run check-all      # Run all quality checks

# Utilities
pnpm run clear          # Clear Docusaurus cache
pnpm run serve          # Serve production build
```

## 🧩 API + Admin Editor

This template includes a local API for serving data (Fastify + TypeScript) and a full admin editor UI to manage projects as per‑file JSON.

- Start API only: `pnpm --dir api dev` (http://localhost:4000/api)
- Start Docs + API: `pnpm dev:with-api`
- Swagger: http://localhost:4000/api/docs
- Protect writes: set `ADMIN_TOKEN` for the API, then use the same token in the Editor’s gear Settings.

### Endpoints (Highlights)

- `GET /api/health` – health check
- `GET /api/v1` – resource list
- `GET /api/v1/{key}` – badges, cvData, giscus, gitHub, gitHubLinks, globalConfig, navBarLinks, portfolioData, projects, version
- `GET /api/v1/themes` – derived from `static/themes/*.css`
- `GET /api/v1/nav` – derived from `src/pages/demos/*.tsx`

Projects (editable storage)

- Storage: `api/storage/projects/<category>/<sub>/<slug>.json` (one JSON file per project)
- Read combined: `GET /api/v1/projects`
- Read flat list: `GET /api/v1/projects/raw`
- Read one: `GET /api/v1/projects/:category/:sub/:slug`
- Save: `PUT /api/v1/projects/:category/:sub/:slug` (x-admin-token required if `ADMIN_TOKEN` set)
- Delete: `DELETE /api/v1/projects/:category/:sub/:slug` (x-admin-token required if `ADMIN_TOKEN` set)

Migration from YAML

- `pnpm --dir api migrate:projects` (use `-- --overwrite` to overwrite existing files)

### Admin Editor (/admin/projects)

- Tabs: Projects (full‑width card grid) and Edit Project (full‑page editor)
- Filters (sticky): Search (centered), Date, Category, Tags — same behavior as the Projects page
- Chips: Show active Search/Filter/Date; “Clear All” resets
- Actions (sticky under filters): Select All (Filtered), Clear, Delete Selected
- Keyboard: `/` focus search, `A` select all, `C` clear, `Delete` delete, `E` open Edit
- Cards: category/sub badges, “Updated” marker (recent), hover lift, per‑card Edit/Delete, copy slug via ⋮ quick action
- Skeletons: animated placeholders while loading
- Import/Export: export filtered projects to JSON; import JSON back to the API
- Settings (gear): configure API Base + Admin Token; token saved to localStorage

Editor details

- Category/Sub‑Category: select existing or “+ Add new…” to create a new value
- Slug: editable with live preview + Generate from Title
- Title: auto‑focus on entering Edit
- Link: inline validation + “Test” button
- Last Modified: datetime‑local picker with ISO preview (stored as ISO)
- Tags: chip editor (Enter/comma/Add, × remove)
- Save: writes to `PUT /api/v1/projects/:category/:sub/:slug`

For deep API docs, see `api/README.md`.

### Unified Projects Manager

Run the same UI for public display and admin editing through one component.

- Components
  - `ProjectsManager`: Core component; toggles admin features with `isAdmin`/`adminToken`.
  - `ProjectsDisplay`: Thin wrapper for public display.
  - `ProjectsAdmin`: Thin wrapper that wires API Base + Admin Token settings and callbacks.

- Admin features
  - Selection actions: Select All (filtered), Clear, Bulk Delete.
  - Per-card Delete and click-to-edit form with Save.
  - Quick actions: Copy Slug / Link / API URL.
  - Import/Export JSON for filtered projects.
  - Toasts for quick feedback on Save/Delete/Import.
  - State persistence for Search and Filter in localStorage.

- Usage
  - Public: `import Projects from 'src/components/Projects'` or `import { ProjectsDisplay } from 'src/components/Projects'`.
  - Admin: `src/pages/admin/projects.tsx` renders `<ProjectsAdmin />` within the page layout.

See docs at `docs/guides/projects-manager.md` for details.

## 📊 Coverage Reports

- Local: `pnpm test:components:cov` generates HTML + LCOV in `coverage/` (open `coverage/index.html`).
- CI: GitHub Actions publishes a `coverage-report` artifact. If Codecov is configured (CODECOV_TOKEN), view coverage via the badge above.


## 📖 Documentation

**👉 [Visit the Documentation](https://docs-template.subzerodev.com/docs)**

For detailed setup guides, configuration options, theme customization, and examples, visit the complete documentation site.

### Key Documentation Sections

- **[Development Workflow](/docs/advanced/development-workflow)** - Enhanced tooling and quality assurance
- **[Theme System](/docs/core-systems/theme-system)** - 10 dynamic color themes
- **[Component Architecture](/docs/core-systems/)** - Badge system, GitHub links, comments
- **[Configuration](/docs/configuration/)** - YAML-based configuration system and setup options

## 🎯 Recent Updates

### Enhanced Development Experience

- **Modern ESLint v9**: Flat configuration with TypeScript support
- **Prettier Integration**: Automated code formatting with consistent styling
- **Quality Gates**: Pre-commit hooks and CI/CD integration
- **Enhanced Build System**: Configurable artifacts directory (`./artifacts`)
- **YAML Configuration**: User-friendly configuration with automatic validation

## 📄 License

This template is provided as-is for creating documentation sites. Check the LICENSE file for specific terms.
