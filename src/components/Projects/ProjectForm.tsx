import React, { useState, useEffect, useMemo } from 'react';
import { SmartSelector } from './SmartSelector';
import { SaveProjectInput } from '../../../shared/types/project-types';
import './SmartSelector.css';

interface ProjectFormProps {
  project?: Partial<ProjectFormData>;
  allProjects: Array<{ category: string; subCategory: string; tags: string[] }>;
  onSave: (input: SaveProjectInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ProjectFormData {
  category: string;
  subCategory: string;
  slug: string;
  title: string;
  link: string;
  lastModified: string;
  summary: string;
  tags: string[];
}

/**
 * Enhanced project form with smart selectors for categories, subcategories, and tags
 */
export function ProjectForm({
  project,
  allProjects,
  onSave,
  onCancel,
  isLoading = false
}: ProjectFormProps): React.ReactNode {
  const [form, setForm] = useState<ProjectFormData>({
    category: project?.category || '',
    subCategory: project?.subCategory || '',
    slug: project?.slug || '',
    title: project?.title || '',
    link: project?.link || '',
    lastModified: project?.lastModified || '',
    summary: project?.summary || '',
    tags: project?.tags || []
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProjectFormData, string>>
  >({});

  // Extract unique categories, subcategories, and tags from all projects
  const { categories, subcategoriesByCategory, allTags } = useMemo(() => {
    const categoriesSet = new Set<string>();
    const subcategoriesMap = new Map<string, Set<string>>();
    const tagsSet = new Set<string>();

    allProjects.forEach((p) => {
      if (p.category) {
        categoriesSet.add(p.category);

        if (p.subCategory) {
          if (!subcategoriesMap.has(p.category)) {
            subcategoriesMap.set(p.category, new Set());
          }
          subcategoriesMap.get(p.category)!.add(p.subCategory);
        }
      }

      p.tags?.forEach((tag) => tagsSet.add(tag));
    });

    // Convert to arrays and sort
    const categories = Array.from(categoriesSet).sort();
    const subcategoriesByCategory: Record<string, string[]> = {};
    subcategoriesMap.forEach((subcats, category) => {
      subcategoriesByCategory[category] = Array.from(subcats).sort();
    });
    const allTags = Array.from(tagsSet).sort();

    return { categories, subcategoriesByCategory, allTags };
  }, [allProjects]);

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !project?.slug) {
      const newSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
      setForm((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [form.title, project?.slug]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!form.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!form.subCategory.trim()) {
      newErrors.subCategory = 'Subcategory is required';
    }

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!form.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }

    if (form.link && form.link.trim()) {
      try {
        const url = new URL(form.link.trim());
        if (!/^https?:$/.test(url.protocol)) {
          newErrors.link = 'URL must use http or https protocol';
        }
      } catch {
        newErrors.link = 'Invalid URL format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const saveInput: SaveProjectInput = {
      category: form.category,
      subCategory: form.subCategory,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      project: {
        title: form.title,
        link: form.link.trim() || undefined,
        lastModified: form.lastModified.trim() || undefined,
        summary: form.summary,
        tags: form.tags
      }
    };

    try {
      await onSave(saveInput);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleAddNewCategory = (newCategory: string) => {
    // Categories are added automatically when used
    console.log('New category added:', newCategory);
  };

  const handleAddNewSubcategory = (newSubcategory: string) => {
    // Subcategories are added automatically when used
    console.log('New subcategory added:', newSubcategory);
  };

  const handleAddNewTag = (newTag: string) => {
    // Tags are added automatically when used
    console.log('New tag added:', newTag);
  };

  const currentSubcategories = form.category
    ? subcategoriesByCategory[form.category] || []
    : [];

  return (
    <div className="project-form">
      <div className="project-form-header">
        <h3>{project ? 'Edit Project' : 'Add New Project'}</h3>
      </div>

      <div className="project-form-body">
        {/* Category Selection */}
        <div className="form-group">
          <label className="form-label">
            Category *
            {errors.category && (
              <span className="form-error">{errors.category}</span>
            )}
          </label>
          <SmartSelector
            type="category"
            value={form.category}
            options={categories}
            onSelect={(value) =>
              setForm((prev) => ({
                ...prev,
                category: value as string,
                subCategory: '' // Reset subcategory when category changes
              }))
            }
            onAddNew={handleAddNewCategory}
            placeholder="Select or add category..."
          />
        </div>

        {/* Subcategory Selection */}
        <div className="form-group">
          <label className="form-label">
            Subcategory *
            {errors.subCategory && (
              <span className="form-error">{errors.subCategory}</span>
            )}
          </label>
          <SmartSelector
            type="subcategory"
            value={form.subCategory}
            options={currentSubcategories}
            onSelect={(value) =>
              setForm((prev) => ({ ...prev, subCategory: value as string }))
            }
            onAddNew={handleAddNewSubcategory}
            placeholder="Select or add subcategory..."
            disabled={!form.category}
            dependsOn={form.category}
          />
        </div>

        {/* Title & Slug */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Title *
              {errors.title && (
                <span className="form-error">{errors.title}</span>
              )}
            </label>
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Project title..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <div className="form-slug-group">
              <input
                type="text"
                className="form-input"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="project-slug"
              />
              <button
                type="button"
                className="button button--sm"
                onClick={() => {
                  const slug =
                    form.slug ||
                    form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  navigator.clipboard?.writeText(slug);
                }}
                title="Copy slug"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Link & Last Modified */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Link
              {errors.link && <span className="form-error">{errors.link}</span>}
            </label>
            <div className="form-link-group">
              <input
                type="url"
                className="form-input"
                value={form.link}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="https://..."
              />
              {form.link && (
                <button
                  type="button"
                  className="button button--sm"
                  onClick={() => window.open(form.link, '_blank')}
                  title="Test link"
                >
                  Test
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Last Modified</label>
            <input
              type="date"
              className="form-input"
              value={form.lastModified}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lastModified: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Summary */}
        <div className="form-group">
          <label className="form-label">
            Summary *
            {errors.summary && (
              <span className="form-error">{errors.summary}</span>
            )}
          </label>
          <textarea
            className="form-textarea"
            rows={4}
            value={form.summary}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, summary: e.target.value }))
            }
            placeholder="Brief description of the project..."
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Tags</label>
          <SmartSelector
            type="tags"
            value={form.tags}
            options={allTags}
            onSelect={(value) =>
              setForm((prev) => ({ ...prev, tags: value as string[] }))
            }
            onAddNew={handleAddNewTag}
            placeholder="Select or add tags..."
            multiple
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="project-form-actions">
        <button
          type="button"
          className="button button--primary"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading
            ? 'Saving...'
            : project
              ? 'Update Project'
              : 'Create Project'}
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
