# Product Requirements Document (PRD)

## Title: Admin Projects Interface Redesign

---

## Overview

Redesign the admin projects interface at `/admin/projects` to provide a more efficient, table-based project management experience with enhanced form controls for categories, subcategories, and tags.

---

## Current State Analysis

### Current Implementation

- **Location**: `/admin/projects` (`src/pages/admin/projects.tsx`)
- **Component**: `ProjectsAdmin` using `AdminProjects` from `ProjectsManager.tsx`
- **Layout**: Card-based project display
- **Authentication**: JWT-based with role checking
- **Form Fields**: Manual text inputs for all fields
- **Interface**: Two-tab system ("Projects" and "Edit Project")

### Current Issues

1. **Authentication**: User reports being logged in but not seeing admin controls
2. **Inefficient Layout**: Card-based layout takes up excessive space
3. **Manual Data Entry**: No dropdown assistance for categories/subcategories/tags
4. **Visual Clutter**: Tag cloud shown in admin mode despite not being needed
5. **No Data Validation**: Limited validation for category/subcategory consistency

---

## Goals

### Primary Goals

1. **Fix Authentication Issues**: Ensure admin controls are visible when properly authenticated
2. **Improve Efficiency**: Replace card layout with compact table layout
3. **Enhance User Experience**: Add dropdown selectors with "Add New" functionality
4. **Reduce Errors**: Provide data validation and consistency checks
5. **Streamline Workflow**: Remove unnecessary UI elements in admin mode

### Secondary Goals

1. **Maintain Feature Parity**: Keep all existing functionality
2. **Improve Performance**: Optimize for large numbers of projects
3. **Enhance Accessibility**: Ensure proper ARIA labels and keyboard navigation

---

## Requirements

### Functional Requirements

#### FR1: Authentication & Authorization

- **FR1.1**: Verify JWT token validation and role checking
- **FR1.2**: Debug and fix admin controls visibility
- **FR1.3**: Add clear authentication status indicators
- **FR1.4**: Graceful fallback for authentication failures

#### FR2: Table-Based Project List

- **FR2.1**: Replace card layout with sortable table
- **FR2.2**: Include columns: Title, Category, Subcategory, Last Modified, Tags, Actions
- **FR2.3**: Support bulk selection with checkboxes
- **FR2.4**: Maintain quick action menus (edit, delete, copy links)
- **FR2.5**: Implement inline quick actions (edit icon per row)

#### FR3: Enhanced Form Controls

- **FR3.1**: Category dropdown with existing categories + "Add New" option
- **FR3.2**: Subcategory dropdown filtered by selected category + "Add New" option
- **FR3.3**: Tags multi-select dropdown with existing tags + "Add New" option
- **FR3.4**: Auto-complete functionality for all dropdown fields
- **FR3.5**: Validation for new category/subcategory names

#### FR4: Streamlined Admin Interface

- **FR4.1**: Remove tag cloud from admin view
- **FR4.2**: Hide search filters that are redundant in admin mode
- **FR4.3**: Add project count and summary statistics
- **FR4.4**: Maintain keyboard shortcuts (A, C, Delete, E, /)

#### FR5: Project Management Features

- **FR5.1**: Quick add new project button
- **FR5.2**: Bulk operations (delete, export, category change)
- **FR5.3**: Import/export functionality (maintain existing)
- **FR5.4**: Project duplication feature

### Non-Functional Requirements

#### NFR1: Performance

- **NFR1.1**: Table should render efficiently for 500+ projects
- **NFR1.2**: Dropdown population should be under 100ms
- **NFR1.3**: Form submission should complete under 2 seconds

#### NFR2: Usability

- **NFR2.1**: Maintain familiar keyboard shortcuts
- **NFR2.2**: Clear visual feedback for all actions
- **NFR2.3**: Consistent with existing Docusaurus theme

#### NFR3: Accessibility

- **NFR3.1**: WCAG 2.1 AA compliance
- **NFR3.2**: Screen reader support
- **NFR3.3**: Keyboard navigation for all features

---

## Technical Design

### Components Architecture

#### New Components

```typescript
// Table-based project list
interface AdminProjectsTable {
  projects: FlatProject[];
  onEdit: (project: FlatProject) => void;
  onDelete: (projects: FlatProject[]) => void;
  onBulkAction: (action: string, projects: FlatProject[]) => void;
}

// Enhanced dropdown selectors
interface SmartSelector {
  type: 'category' | 'subcategory' | 'tags';
  value: string | string[];
  options: string[];
  onSelect: (value: string | string[]) => void;
  onAddNew: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
}

// Project form with smart selectors
interface ProjectForm {
  project: Partial<Project>;
  categories: string[];
  subcategories: Record<string, string[]>;
  tags: string[];
  onSave: (project: SaveProjectInput) => Promise<void>;
  onCancel: () => void;
}
```

#### Enhanced Data Management

```typescript
// Category/subcategory management
interface CategoryManager {
  getCategories(): string[];
  getSubcategories(category: string): string[];
  addCategory(category: string): void;
  addSubcategory(category: string, subcategory: string): void;
}

// Tags management
interface TagsManager {
  getAllTags(): string[];
  getPopularTags(): string[];
  addTag(tag: string): void;
  getTagsByFrequency(): Record<string, number>;
}
```

### Database Schema Updates

```typescript
// No schema changes required - existing Project interface supports all features
// Enhanced metadata tracking for admin interface
interface ProjectMetadata {
  categories: string[];
  subcategories: Record<string, string[]>;
  tags: string[];
  lastUpdated: Date;
}
```

### API Enhancements

```typescript
// New endpoints for metadata management
GET / api / v1 / projects / metadata; // Get categories, subcategories, tags
POST / api / v1 / projects / categories; // Add new category
POST / api / v1 / projects / subcategories; // Add new subcategory
POST / api / v1 / projects / tags; // Add new tag
```

---

## User Interface Mockup

### Table Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [✓] Title              Category    Subcategory   Last Modified   Actions     │
├─────────────────────────────────────────────────────────────────────────────┤
│ [☐] Project Alpha      Web App     Frontend      2024-01-15      [Edit][Del] │
│ [☐] Project Beta       Mobile      iOS           2024-01-10      [Edit][Del] │
│ [☐] Project Gamma      API         Backend       2024-01-08      [Edit][Del] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Enhanced Form

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Category:      [Web App ▼] [+ Add New]                                  │
│ Subcategory:   [Frontend ▼] [+ Add New]                                │
│ Title:         [Project Name                                       ]    │
│ Slug:          [project-name            ] [Copy]                       │
│ Link:          [https://...             ] [Test] [Copy]               │
│ Last Modified: [2024-01-15              ]                              │
│ Summary:       [Brief description...     ]                              │
│                [                        ]                              │
│ Tags:          [React ×] [TypeScript ×] [+ Add Tag ▼]                  │
│                                                                         │
│ [Save Project] [Cancel]                                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Authentication Debug & Fix (1 day)

1. **Investigate Authentication Issue**
   - Debug JWT token validation
   - Check role-based access control
   - Verify admin mode detection logic
   - Test authentication state management

2. **Fix Admin Controls Visibility**
   - Ensure proper token passing to components
   - Fix conditional rendering logic
   - Add authentication debugging tools

### Phase 2: Table Layout Implementation (2 days)

1. **Create AdminProjectsTable Component**
   - Design table structure and styling
   - Implement sorting functionality
   - Add bulk selection logic
   - Integrate with existing actions

2. **Replace Card Layout**
   - Update AdminProjects component
   - Maintain keyboard shortcuts
   - Preserve quick action menus
   - Test performance with large datasets

### Phase 3: Smart Form Controls (2 days)

1. **Category/Subcategory Selectors**
   - Build dropdown components
   - Add "Add New" functionality
   - Implement validation logic
   - Connect to form state

2. **Tags Multi-selector**
   - Create tag management interface
   - Implement autocomplete
   - Add new tag creation
   - Style tag display

### Phase 4: Interface Cleanup (1 day)

1. **Remove Admin Mode Clutter**
   - Hide tag cloud in admin view
   - Simplify filter section
   - Optimize layout spacing
   - Add admin-specific statistics

2. **Testing & Refinement**
   - Test all functionality
   - Verify accessibility
   - Performance optimization
   - Bug fixes

---

## Acceptance Criteria

### Authentication

- [ ] Admin controls are visible when user has admin role
- [ ] Clear feedback for authentication status
- [ ] Graceful degradation for non-admin users

### Table Interface

- [ ] Projects displayed in sortable table format
- [ ] Bulk selection and actions work correctly
- [ ] Quick actions (edit, delete) accessible per row
- [ ] Table loads efficiently with 100+ projects

### Form Enhancements

- [ ] Category dropdown shows existing categories + "Add New"
- [ ] Subcategory dropdown filters by selected category
- [ ] Tags selector allows multiple selection + new tag creation
- [ ] Form validation prevents duplicate/invalid entries

### User Experience

- [ ] Interface is clean and focused for admin tasks
- [ ] All keyboard shortcuts continue to work
- [ ] Import/export functionality preserved
- [ ] Clear visual feedback for all actions

---

## Risks & Mitigations

### Technical Risks

1. **Performance with Large Datasets**
   - _Risk_: Table may lag with 500+ projects
   - _Mitigation_: Implement virtualization or pagination

2. **Form State Management Complexity**
   - _Risk_: Smart selectors may introduce bugs
   - _Mitigation_: Comprehensive testing and fallback options

### User Experience Risks

1. **Learning Curve for New Interface**
   - _Risk_: Users may be confused by table layout
   - _Mitigation_: Maintain familiar patterns and add help text

2. **Data Loss During Migration**
   - _Risk_: Form changes could cause data loss
   - _Mitigation_: Thorough testing and backup procedures

---

## Success Metrics

### Quantitative Metrics

- **Performance**: Table render time < 500ms for 200 projects
- **Efficiency**: 50% reduction in clicks to edit a project
- **Error Rate**: 90% reduction in category/tag input errors

### Qualitative Metrics

- **Usability**: User can complete project creation in < 60 seconds
- **Accessibility**: Passes WCAG 2.1 AA automated testing
- **Consistency**: Interface feels native to Docusaurus ecosystem

---

## Future Enhancements

### V2 Features

- Project templates for quick creation
- Advanced filtering and search in table
- Project activity history and audit log
- Drag-and-drop reordering
- Batch editing capabilities

### Integration Opportunities

- GitHub sync for automatic project updates
- API documentation generation from projects
- Analytics integration for project popularity
- Export to various formats (CSV, PDF, JSON)

---

_Last Updated: 2024-01-15_  
_Status: Draft_  
_Owner: Development Team_
