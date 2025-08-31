import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Layout from '@theme/Layout';
import './projects.css';
import '../../components/Projects/projects.css';
import { DateFilters, CategoryFilters, TagFilters, SearchBox } from '../../components/Projects/components';
import { generateCategoryOptions, generateDateOptions, generateTagTiers, applyDateFiltering, createCategoryText, calculateStats } from '../../components/Projects/utils';

type Project = {
  title: string;
  link: string;
  lastModified?: string;
  summary: string;
  tags: string[];
};

type FlatProject = {
  category: string;
  subCategory: string;
  slug: string;
  project: Project;
};

const defaultApiBase = (() => {
  if (typeof window !== 'undefined' && (window as any).DOCS_API_BASE) {
    return (window as any).DOCS_API_BASE as string;
  }
  if (
    typeof process !== 'undefined' &&
    (process as any).env &&
    (process as any).env.DOCS_API_BASE
  ) {
    return (process as any).env.DOCS_API_BASE as string;
  }
  return 'http://localhost:4000/api';
})();

export default function AdminProjectsPage(): React.JSX.Element {
  const [apiBase, setApiBase] = useState<string>(defaultApiBase);
  const [token, setToken] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : ''
  );
  const [items, setItems] = useState<FlatProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<{ category?: string; subCategory?: string; slug?: string }>({});
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [selectedDateRange, setSelectedDateRange] = useState('most-recent');
  const [selectedFilter, setSelectedFilter] = useState('most-recent');
  const [activeTab, setActiveTab] = useState<'projects' | 'edit'>('projects');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [menuOpenKey, setMenuOpenKey] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; type: 'info' | 'success' | 'error'; message: string }>>([]);
  const pushToast = (type: 'info' | 'success' | 'error', message: string) => setToasts((prev) => [...prev, { id: Date.now() + Math.random(), type, message }]);
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const [form, setForm] = useState<{
    category: string;
    subCategory: string;
    slug: string;
    title: string;
    link: string;
    lastModified?: string;
    summary: string;
    tags: string[];
    tagInput?: string;
  }>({
    category: '',
    subCategory: '',
    slug: '',
    title: '',
    link: '',
    lastModified: '',
    summary: '',
    tags: [],
    tagInput: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token);
    }
  }, [token]);

  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, FlatProject[]>>();
    for (const fp of items) {
      if (!map.has(fp.category)) map.set(fp.category, new Map());
      const sub = map.get(fp.category)!;
      if (!sub.has(fp.subCategory)) sub.set(fp.subCategory, []);
      sub.get(fp.subCategory)!.push(fp);
    }
    return map;
  }, [items]);

  const allCategories = useMemo(() => Array.from(grouped.keys()).sort(), [grouped]);
  const allSubCategoriesFor = useCallback((cat: string) => {
    const sub = grouped.get(cat);
    return sub ? Array.from(sub.keys()).sort() : [] as string[];
  }, [grouped]);

  const computedSlug = useMemo(() => {
    const base = form.slug && form.slug.trim().length > 0 ? form.slug : form.title || '';
    return slugify(base);
  }, [form.slug, form.title]);

  const filteredInGroup = (list: FlatProject[]) => {
    // Build visible set based on processed filters
    const visible = new Set<string>(visibleKeys);
    let out = list.filter((fp) => visible.has(visibleKeyFor(fp)));
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((fp) => {
        const inTitle = (fp.project.title || '').toLowerCase().includes(q);
        const inCat = fp.category.toLowerCase().includes(q);
        const inSub = fp.subCategory.toLowerCase().includes(q);
        const inTags = (fp.project.tags || []).some((t) => t.toLowerCase().includes(q));
        return inTitle || inCat || inSub || inTags || fp.slug.toLowerCase().includes(q);
      });
    }
    // Default sort by most recent
    return [...out].sort((a, b) => {
      const aTime = a.project.lastModified ? new Date(a.project.lastModified).getTime() : -Infinity;
      const bTime = b.project.lastModified ? new Date(b.project.lastModified).getTime() : -Infinity;
      return bTime - aTime;
    });
  };

  const clearForm = () => {
    setSelected({});
    setForm({
      category: '',
      subCategory: '',
      slug: '',
      title: '',
      link: '',
      lastModified: '',
      summary: '',
      tags: [],
      tagInput: ''
    });
  };

  const validation = useMemo(() => {
    const errors: Record<string, string | null> = {
      category: form.category ? null : 'Required',
      subCategory: form.subCategory ? null : 'Required',
      title: form.title ? null : 'Required',
      summary: form.summary ? null : 'Required',
      link: null,
      lastModified: null
    };

    const link = (form.link || '').trim();
    if (link) {
      try {
        // eslint-disable-next-line no-new
        new URL(link);
      } catch {
        errors.link = 'Invalid URL';
      }
    }

    const lm = (form.lastModified || '').trim();
    if (lm) {
      const d = new Date(lm);
      if (isNaN(d.getTime())) errors.lastModified = 'Unrecognized date';
    }

    const invalid = Object.values(errors).some(Boolean);
    return { errors, invalid } as const;
  }, [form]);

  const canSave = useMemo(() => {
    return (
      !!form.category &&
      !!form.subCategory &&
      !!form.title &&
      !!form.summary &&
      !validation.invalid
    );
  }, [form, validation.invalid]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${apiBase}/v1/projects/raw`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = (await res.json()) as FlatProject[];
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  const loadIntoForm = (fp: FlatProject) => {
    setForm({
      category: fp.category,
      subCategory: fp.subCategory,
      slug: fp.slug,
      title: fp.project.title || '',
      link: fp.project.link || '',
      lastModified: fp.project.lastModified || '',
      summary: fp.project.summary,
      tags: fp.project.tags || [],
      tagInput: ''
    });
    setSelected({ category: fp.category, subCategory: fp.subCategory, slug: fp.slug });
    if (typeof window !== 'undefined') {
      const el = document.getElementById('edit-form');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveTab('edit');
  };

  const keyFor = (fp: FlatProject) => `${fp.category}||${fp.subCategory}||${fp.slug}`;
  const isSelected = (fp: FlatProject) => selection.has(keyFor(fp));
  const toggleSelected = (fp: FlatProject) => {
    setSelection((prev) => {
      const next = new Set(prev);
      const k = keyFor(fp);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };
  const clearSelection = () => setSelection(new Set());
  const selectAllFiltered = () => {
    const all: string[] = [];
    Array.from(grouped.entries()).forEach(([_, subMap]) => {
      Array.from(subMap.values()).forEach((list) => {
        filteredInGroup(list).forEach((fp) => all.push(keyFor(fp)));
      });
    });
    setSelection(new Set(all));
  };

  const bulkDeleteSelected = async () => {
    if (selection.size === 0) return;
    if (!confirm(`Delete ${selection.size} selected projects?`)) return;
    setLoading(true);
    setError(null);
    try {
      for (const k of selection) {
        const [category, subCategory, slug] = k.split('||');
        const url = `${apiBase}/v1/projects/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}/${encodeURIComponent(slug)}`;
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(url, { method: 'DELETE', headers: { 'x-admin-token': token } });
        if (!res.ok) throw new Error(`Failed to delete ${slug}`);
      }
      await fetchList();
      clearSelection();
      setSuccess('Deleted selected projects');
    } catch (e: any) {
      setError(e.message || 'Bulk delete failed');
    } finally {
      setLoading(false);
    }
  };

  // Removed bulk move per request

  // Fetch nested data for filters
  const [nested, setNested] = useState<any[] | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/v1/projects`);
        if (!res.ok) throw new Error('Failed to load projects');
        const data = await res.json();
        setNested(data);
      } catch (e) {
        console.warn('Failed to load nested projects for filters', e);
      }
    })();
  }, [apiBase]);

  // Close quick action menus on outside click
  useEffect(() => {
    const onClick = () => setMenuOpenKey(null);
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  // Process nested data to get filter options similar to Projects page
  const processedData = useMemo(() => {
    const categories = Array.isArray(nested) ? nested : [];
    // Apply filtering just like Projects
    const filtered = applyDateFiltering(
      selectedFilter && selectedFilter !== 'most-recent' && selectedFilter !== 'all' && selectedFilter !== 'all-dates'
        ? categories.filter((cat: any) => cat.category.toLowerCase() === selectedFilter.toLowerCase())
        : categories,
      selectedDateRange
    );
    const categoryOptions = generateCategoryOptions(categories);
    const dateOptions = generateDateOptions(categories);
    const tagTiers = generateTagTiers(categories);
    const stats = calculateStats(categories);
    const categoryText = createCategoryText(filtered);
    return {
      categories: filtered,
      technologyOptions: [],
      categoryOptions,
      dateOptions,
      tagOptions: [],
      tagTiers,
      stats,
      categoryText
    } as any;
  }, [nested, selectedFilter, selectedDateRange]);

  // Map processed result to a set of visible items using (category, subcategory, title)
  const visibleKeys = useMemo(() => {
    const keys: string[] = [];
    processedData.categories.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        sub.projects.forEach((p) => {
          keys.push(`${cat.category}||${sub.name}||${p.title}`);
        });
      });
    });
    return new Set(keys);
  }, [processedData.categories]);

  const visibleKeyFor = (fp: FlatProject) => `${fp.category}||${fp.subCategory}||${fp.project.title}`;

  // Mirror Projects: when searching, auto set all-dates
  useEffect(() => {
    const desired = search ? 'all-dates' : 'most-recent';
    setSelectedDateRange((prev) => (prev === desired ? prev : desired));
  }, [search]);

  // Toggle filter handler like Projects
  const handleFilterToggle = useCallback(
    (filterKey: string) => {
      if (selectedFilter === filterKey) setSelectedFilter('most-recent');
      else setSelectedFilter(filterKey);
    },
    [selectedFilter, setSelectedFilter]
  );

  const save = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: Project = {
        title: form.title,
        link: form.link,
        lastModified: form.lastModified || undefined,
        summary: form.summary,
        tags: form.tags
      };
      const slug = form.slug || slugify(form.title);
      const category = (form.newCategory && form.newCategory.trim()) ? form.newCategory.trim() : form.category;
      const sub = (form.newSubCategory && form.newSubCategory.trim()) ? form.newSubCategory.trim() : form.subCategory;
      const url = `${apiBase}/v1/projects/${encodeURIComponent(category)}/${encodeURIComponent(sub)}/${encodeURIComponent(slug)}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `${res.status} ${res.statusText}`);
      }
      await fetchList();
      setSuccess('Saved successfully');
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const del = async (fp: FlatProject) => {
    if (!confirm(`Delete ${fp.slug}?`)) return;
    setLoading(true);
    setError(null);
    try {
      const url = `${apiBase}/v1/projects/${encodeURIComponent(
        fp.category
      )}/${encodeURIComponent(fp.subCategory)}/${encodeURIComponent(fp.slug)}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `${res.status} ${res.statusText}`);
      }
      await fetchList();
    } catch (e: any) {
      setError(e.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  // Focus management: focus title on edit tab open
  useEffect(() => {
    if (activeTab === 'edit') {
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [activeTab]);

  return (
    <Layout title="Admin • Projects" description="Edit projects data">
      <div className="container margin-top--lg admin-wrap">
        <header className="admin-header">
          <h1 className="admin-title">Admin • Projects</h1>
          <p className="admin-subtitle">Create, edit and manage project entries</p>
        </header>
        <div className="admin-tabs">
          <button
            className={`button button--sm ${activeTab === 'projects' ? 'button--primary' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`button button--sm ${activeTab === 'edit' ? 'button--primary' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            Edit Project
          </button>
        </div>
        <div className="alert alert--warning">
          This page edits per-project JSON files on the API server.
          Protect with ADMIN_TOKEN; avoid exposing publicly.
        </div>

        {/* Removed legacy controls (API base / token / refresh). Status shown within cards. */}

        {activeTab === 'projects' && (
          <section className="margin-bottom--lg">
              <div className="card shadow--tl">
                <div className="card__header">
                  <div className="admin-list-header">
                    <div className="admin-list-title">
                      <h2 className="margin--none">Projects</h2>
                      <span className="admin-counter">{items.length}</span>
                    </div>
                    <button
                      type="button"
                      className="button button--sm admin-gear"
                      aria-label="Settings"
                      title="Settings"
                      onClick={() => setSettingsOpen(true)}
                    >
                      ⚙
                    </button>
                  </div>
                </div>
                <div className="card__body">
                  {/* Filters matching Projects component */}
                  <div className="portfolio-wrap" style={{ paddingTop: 0 }}>
                    <div className="projects-filters admin-filters">
                      <SearchBox
                        searchTerm={search}
                        setSearchTerm={setSearch}
                        searchInputRef={searchInputRef}
                        handleClearSearch={() => setSearch('')}
                      />

                      <DateFilters
                        dateOptions={processedData.dateOptions}
                        selectedDateRange={selectedDateRange}
                        onDateChange={setSelectedDateRange}
                        searchTerm={search}
                      />

                      <CategoryFilters
                        categoryOptions={processedData.categoryOptions}
                        activeFilter={selectedFilter}
                        onFilterChange={handleFilterToggle}
                        searchTerm={search}
                        processedData={processedData}
                        isLoading={false}
                        title="Categories"
                      />

                      {processedData.tagTiers && (
                        <TagFilters
                          tagTiers={processedData.tagTiers}
                          activeTag={selectedFilter}
                          onTagChange={handleFilterToggle}
                        />
                      )}
                    </div>
                  </div>

                  {/* Status + selection actions under filters */}
                  {loading && <div className="alert alert--info">Loading…</div>}
                  {error && <div className="alert alert--danger">{error}</div>}
                  {success && <div className="alert alert--success">{success}</div>}
                  
                  {/* Selection actions under filters */}
                  <div className="admin-actions-bar">
                    <button className="button button--sm" onClick={selectAllFiltered}>
                      Select All (Filtered)
                    </button>
                    <button className="button button--sm" onClick={clearSelection}>
                      Clear Selection
                    </button>
                    <button
                      className="button button--sm button--danger"
                      disabled={selection.size === 0}
                      onClick={bulkDeleteSelected}
                      title="Delete selected"
                    >
                      Delete Selected ({selection.size})
                    </button>
                    <button
                      className="button button--sm"
                      onClick={() => {
                        const exportObj = processedData.categories.map((cat) => ({
                          category: cat.category,
                          subCategories: cat.subCategories.map((sub) => ({ name: sub.name, projects: sub.projects }))
                        }));
                        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'projects-export.json';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                      }}
                      title="Export filtered projects to JSON"
                    >
                      Export (Filtered)
                    </button>
                    <label className="button button--sm" title="Import projects JSON" style={{ cursor: 'pointer' }}>
                      Import JSON
                      <input
                        type="file"
                        accept="application/json"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const text = await file.text();
                            const json = JSON.parse(text);
                            for (const cat of json || []) {
                              for (const sub of cat.subCategories || []) {
                                for (const p of sub.projects || []) {
                                  const slug = slugify(p.title || 'project');
                                  const url = `${apiBase}/v1/projects/${encodeURIComponent(cat.category)}/${encodeURIComponent(sub.name)}/${encodeURIComponent(slug)}`;
                                  // eslint-disable-next-line no-await-in-loop
                                  await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify(p) });
                                }
                              }
                            }
                            await fetchList();
                          } catch (err) {
                            console.error('Import failed', err);
                          } finally {
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="admin-list-scroll full">
                    <div className="projectGrid">
                      {processedData.categories.flatMap((cat) =>
                        cat.subCategories.flatMap((sub) =>
                          sub.projects.map((p) => {
                            const k = `${cat.category}||${sub.name}||${slugify(p.title)}`;
                            const match = items.find(
                              (x) =>
                                x.category === cat.category &&
                                x.subCategory === sub.name &&
                                x.project.title === p.title
                            );
                            const fp: FlatProject =
                              match || {
                                category: cat.category,
                                subCategory: sub.name,
                                slug: slugify(p.title),
                                project: {
                                  title: p.title,
                                  summary: p.summary,
                                  lastModified: p.lastModified,
                                  link: p.link || '',
                                  tags: p.tags || []
                                }
                              };
                            return (
                              <div key={k} className="projectCard" onClick={() => loadIntoForm(fp)} style={{ cursor: 'pointer' }}>
                                <div className="projectCardHeader" style={{ alignItems: 'center', gap: '0.5rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={selection.has(k)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      toggleSelected(fp);
                                    }}
                                    title="Select"
                                    style={{ marginRight: '0.5rem' }}
                                  />
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                    <h3 className="projectCardTitle" style={{ margin: 0 }}>{p.title}</h3>
                                    <span className="admin-tag" title="Category">{cat.category}</span>
                                    <span className="admin-tag" title="Sub-Category">{sub.name}</span>
                                    {p.lastModified && (Date.now() - new Date(p.lastModified).getTime() < 14*24*60*60*1000) && (
                                      <span className="admin-tag" title="Updated recently">Updated</span>
                                    )}
                                  </div>
                                  {p.link && (
                                    <a
                                      href={p.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="projectLinkIcon"
                                      title="Open link"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                      </svg>
                                    </a>
                                  )}
                                  <div className="admin-menu-wrap" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      className="button button--sm"
                                      title="More actions"
                                      onClick={() => setMenuOpenKey(menuOpenKey === k ? null : k)}
                                    >
                                      ⋮
                                    </button>
                                    {menuOpenKey === k && (
                                      <div className="admin-menu" role="menu">
                                        <button className="admin-menu-item" onClick={() => { setMenuOpenKey(null); loadIntoForm(fp); }}>Edit</button>
                                        <button className="admin-menu-item" onClick={() => { setMenuOpenKey(null); navigator.clipboard?.writeText(fp.slug); }}>Copy Slug</button>
                                        {p.link && <button className="admin-menu-item" onClick={() => { setMenuOpenKey(null); navigator.clipboard?.writeText(p.link!); }}>Copy Link</button>}
                                        <button className="admin-menu-item admin-danger" onClick={async () => { setMenuOpenKey(null); const key = `${fp.category}||${fp.subCategory}||${fp.slug}`; setSelection(new Set([key])); await bulkDeleteSelected(); }}>Delete</button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className="projectSummary">{p.summary}</p>
                                {p.tags && p.tags.length > 0 && (
                                  <div className="projectTags">
                                    {p.tags.map((tag) => (
                                      <span key={tag} className="admin-tag">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="projectFooter">
                                  {p.lastModified && (<span className="projectDate">{new Date(p.lastModified).toLocaleDateString()}</span>)}
                                  <button
                                    className="button button--sm button--secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      loadIntoForm(fp);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="button button--sm button--danger"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const key = `${fp.category}||${fp.subCategory}||${fp.slug}`;
                                      setSelection(new Set([key]));
                                      await bulkDeleteSelected();
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )
                      )}
                      {loading && Array.from({ length: 8 }).map((_, i) => (
                        <div key={`sk-${i}`} className="projectCard skeleton">
                          <div className="projectCardHeader"><div className="skeleton-bar" style={{ width: '60%' }} /></div>
                          <div className="skeleton-bar" style={{ width: '90%', height: '12px', marginBottom: '6px' }} />
                          <div className="skeleton-bar" style={{ width: '85%', height: '12px' }} />
                          <div className="projectFooter" style={{ justifyContent: 'flex-end' }}>
                            <div className="skeleton-bar" style={{ width: '80px', height: '24px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          </section>
        )}

        {activeTab === 'edit' && (
          <section id="edit-form" className="margin-bottom--lg">
            <div className="card shadow--tl">
              <div className="card__header">
                <div className="admin-form-header">
                  <h2 className="margin--none">{form.slug ? 'Edit Project' : 'New Project'}</h2>
                  <div className="admin-form-actions">
                      <button className="button button--sm" onClick={() => setActiveTab('projects')}>Back to Projects</button>
                      <button className="button button--sm" onClick={clearForm}>New</button>
                      <button
                        className="button button--sm"
                        onClick={() => setForm({ ...form, lastModified: new Date().toISOString() })}
                      >
                        Timestamp Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card__body">
                  {/* Category and Sub-Category selection with add-new */}
                  <div className="admin-row">
                    <label className="admin-field">
                      <div>Category</div>
                      <select
                        className="admin-input"
                        value={form.category || ''}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="">Select category…</option>
                        {allCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="__new">+ Add new…</option>
                      </select>
                      {form.category === '__new' && (
                        <input
                          className="admin-input"
                          placeholder="New category"
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                        />
                      )}
                    </label>
                    <label className="admin-field">
                      <div>Sub-Category</div>
                      <select
                        className="admin-input"
                        value={form.subCategory || ''}
                        onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                      >
                        <option value="">Select sub-category…</option>
                        {allSubCategoriesFor(form.category !== '__new' ? form.category : '').map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                        <option value="__new">+ Add new…</option>
                      </select>
                      {form.subCategory === '__new' && (
                        <input
                          className="admin-input"
                          placeholder="New sub-category"
                          onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                        />
                      )}
                    </label>
                  </div>

                  <label className="admin-field">
                    <div>Slug</div>
                    <div className="admin-slug-row">
                      <input
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="auto from title if empty"
                        className="admin-input"
                      />
                      <button
                        type="button"
                        className="button button--sm"
                        onClick={() => setForm({ ...form, slug: computedSlug })}
                        title="Generate from title"
                      >
                        Generate
                      </button>
                      <span className="admin-slug-preview">{computedSlug}</span>
                    </div>
                  </label>

                  <label className="admin-field">
                    <div>Title</div>
                    <input ref={titleInputRef} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" />
                  </label>

                  <label className="admin-field">
                    <div>Link</div>
                    <div className="admin-row" style={{ alignItems: 'center' }}>
                      <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="admin-input" />
                      <button className="button button--sm" type="button" onClick={() => { if (form.link) window.open(form.link, '_blank'); }} title="Open link in new tab">Test</button>
                    </div>
                    {validation.errors.link && (
                      <small className="admin-hint admin-hint--error">{validation.errors.link}</small>
                    )}
                  </label>

                  <label className="admin-field">
                    <div>Last Modified</div>
                    <div className="admin-row" style={{ alignItems: 'center' }}>
                      <input
                        type="datetime-local"
                        className="admin-input"
                        value={form.lastModified ? new Date(form.lastModified).toISOString().slice(0,16) : ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm({ ...form, lastModified: v ? new Date(v).toISOString() : '' });
                        }}
                      />
                      <span className="admin-slug-preview">{form.lastModified || ''}</span>
                    </div>
                    {validation.errors.lastModified && (
                      <small className="admin-hint admin-hint--error">{validation.errors.lastModified}</small>
                    )}
                  </label>

                  <label className="admin-field">
                    <div>Summary</div>
                    <textarea rows={6} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="admin-textarea" />
                  </label>

                  <div className="admin-field">
                    <div>Tags</div>
                    <div className="admin-tags">
                      {form.tags.map((t) => (
                        <span className="admin-tag" key={t}>
                          {t}
                          <button
                            type="button"
                            className="admin-tag-remove"
                            onClick={() => setForm({ ...form, tags: form.tags.filter((x) => x !== t) })}
                            title="Remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        value={form.tagInput || ''}
                        onChange={(e) => setForm({ ...form, tagInput: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const t = (form.tagInput || '').trim();
                            if (t && !form.tags.includes(t)) {
                              setForm({ ...form, tags: [...form.tags, t], tagInput: '' });
                            }
                          }
                        }}
                        placeholder="Type tag and press Enter"
                        className="admin-input admin-tag-input"
                      />
                      <button
                        className="button button--sm"
                        type="button"
                        onClick={() => {
                          const t = (form.tagInput || '').trim();
                          if (t && !form.tags.includes(t)) {
                            setForm({ ...form, tags: [...form.tags, t], tagInput: '' });
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button className="button button--primary" onClick={save} disabled={loading || !canSave}>
                      Save Project
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
      </div>
      {/* Settings Modal */}
      {settingsOpen && (
        <div className="admin-modal" onClick={() => setSettingsOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Settings</h3>
            <div className="admin-row">
              <label className="admin-field">
                <div>API Base</div>
                <input
                  className="admin-input"
                  type="text"
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  placeholder="http://localhost:4000/api"
                />
              </label>
              <label className="admin-field">
                <div>Admin Token</div>
                <input
                  className="admin-input"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="x-admin-token"
                />
              </label>
            </div>
            <div className="admin-actions" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="button button--sm" onClick={() => setSettingsOpen(false)}>Close</button>
              <button
                className="button button--sm button--primary"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('adminToken', token);
                  }
                  setSettingsOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="admin-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast admin-toast--${t.type}`} onClick={() => removeToast(t.id)}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}
