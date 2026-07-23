---
id: admin-projects-interface-specs
title: Admin Projects Interface Specs
sidebar_position: 30
---

This guide extracts the concrete admin-interface specification from the historical PRD for `/admin/projects` so the requirements remain available without keeping them embedded only in a historical product document.

## Scope

- Route: `/admin/projects`
- Status: Phase 2 optional
- Source: extracted from the historical Admin Projects Interface Redesign PRD
- Related API endpoint proposals: `/docs/guides/api-specs`

## Goals

### Primary Goals

1. Fix admin visibility/authentication issues.
2. Replace the card-heavy admin list with a compact table layout.
3. Add smarter form controls for category, subcategory, and tags.
4. Reduce input errors with validation and constrained selection.
5. Remove public-view clutter from admin workflows.

### Secondary Goals

1. Maintain feature parity with the existing admin flow.
2. Improve performance for large project sets.
3. Preserve accessibility and keyboard navigation.

## Functional Requirements

### Authentication and Visibility

- Verify JWT token validation and role checking.
- Debug and fix admin-controls visibility.
- Show clear authentication status indicators.
- Gracefully handle authentication failures.

### Table-Based Project List

- Replace the card layout with a sortable table.
- Required columns: Title, Category, Subcategory, Last Modified, Tags, Actions.
- Support bulk selection with checkboxes.
- Preserve quick actions such as edit, delete, and copy links.
- Support inline quick actions per row.

### Enhanced Form Controls

- Category dropdown with existing values and an Add New option.
- Subcategory dropdown filtered by category with an Add New option.
- Tags multi-select with existing tags and an Add New option.
- Auto-complete support for dropdown-backed fields.
- Validation for new category and subcategory names.

### Streamlined Admin UI

- Remove the tag cloud from admin mode.
- Hide redundant search filters in admin mode.
- Show project count and summary statistics.
- Preserve keyboard shortcuts such as `A`, `C`, `Delete`, `E`, and `/`.

### Project Management Features

- Quick add new project action.
- Bulk actions: delete, export, category change.
- Import/export support.
- Project duplication support.

## Non-Functional Requirements

### Performance

- Table should render efficiently for 500+ projects.
- Dropdown population should complete in under 100 ms.
- Form submission should complete in under 2 seconds.

### Usability

- Preserve familiar keyboard shortcuts.
- Provide clear visual feedback for actions.
- Stay visually consistent with the existing Docusaurus theme.

### Accessibility

- Target WCAG 2.1 AA compliance.
- Support screen readers.
- Ensure keyboard navigation across all admin features.

## Technical Design

### Component Interfaces

```typescript
interface AdminProjectsTable {
  projects: FlatProject[];
  onEdit: (project: FlatProject) => void;
  onDelete: (projects: FlatProject[]) => void;
  onBulkAction: (action: string, projects: FlatProject[]) => void;
}

interface SmartSelector {
  type: 'category' | 'subcategory' | 'tags';
  value: string | string[];
  options: string[];
  onSelect: (value: string | string[]) => void;
  onAddNew: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
}

interface ProjectForm {
  project: Partial<Project>;
  categories: string[];
  subcategories: Record<string, string[]>;
  tags: string[];
  onSave: (project: SaveProjectInput) => Promise<void>;
  onCancel: () => void;
}
```

### Admin Data Helpers

```typescript
interface CategoryManager {
  getCategories(): string[];
  getSubcategories(category: string): string[];
  addCategory(category: string): void;
  addSubcategory(category: string, subcategory: string): void;
}

interface TagsManager {
  getAllTags(): string[];
  getPopularTags(): string[];
  addTag(tag: string): void;
  getTagsByFrequency(): Record<string, number>;
}
```

### Metadata Shape

```typescript
interface ProjectMetadata {
  categories: string[];
  subcategories: Record<string, string[]>;
  tags: string[];
  lastUpdated: Date;
}
```

## UI Mockups

### Table Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [✓] Title              Category    Subcategory   Last Modified   Actions     │
├─────────────────────────────────────────────────────────────────────────────┤
│ [☐] Project Alpha      Web App     Frontend      2024-01-15      [Edit][Del] │
│ [☐] Project Beta       Mobile      iOS           2024-01-10      [Edit][Del] │
│ [☐] Project Gamma      API         Backend       2024-01-08      [Edit][Del] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Enhanced Form

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Category:      [Web App v] [+ Add New]                                │
│ Subcategory:   [Frontend v] [+ Add New]                               │
│ Title:         [Project Name                                       ]  │
│ Slug:          [project-name            ] [Copy]                     │
│ Link:          [https://...             ] [Test] [Copy]             │
│ Last Modified: [2024-01-15              ]                            │
│ Summary:       [Brief description...     ]                            │
│                [                        ]                            │
│ Tags:          [React x] [TypeScript x] [+ Add Tag v]                │
│                                                                       │
│ [Save Project] [Cancel]                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

### Authentication

- Admin controls are visible when the user has the admin role.
- Authentication status is visible and understandable.
- Non-admin users get graceful degradation.

### Table Interface

- Projects render in sortable table format.
- Bulk selection and actions work correctly.
- Quick row actions remain accessible.
- Table remains efficient with 100+ projects.

### Form Enhancements

- Category dropdown shows existing values and Add New.
- Subcategory dropdown filters by selected category.
- Tag selection supports multiple values and new tag creation.
- Validation prevents duplicate or invalid entries.

### User Experience

- The interface stays focused on admin tasks.
- Existing keyboard shortcuts keep working.
- Import/export remains available.
- Actions provide clear visual feedback.

## Risks and Mitigations

### Technical Risks

- Large datasets may degrade table performance.
- Smart selectors may complicate form state.

### Mitigations

- Consider pagination or virtualization.
- Add comprehensive tests and fallback input behavior.

## Success Metrics

- Table render time under 500 ms for 200 projects.
- 50 percent reduction in clicks required to edit a project.
- 90 percent reduction in category/tag input errors.

## Future Enhancements

- Project templates.
- Advanced table filtering and search.
- Project activity history and audit log.
- Drag-and-drop reordering.
- Batch editing.
