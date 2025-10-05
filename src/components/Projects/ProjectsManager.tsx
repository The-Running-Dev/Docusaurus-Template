import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Loading from '../Loading';
import DebugInfo from '../DebugInfo';
import { useFeaturesConfig } from '../../config';
import { useProjects as useStoreProjects } from '../../hooks/useProjects';
import { useProcessor, useUrlFilter, useSearch, useScrollRefs } from './hooks';
import type {
  ProcessedProjectData,
  Project,
  SaveProjectInput,
  ProjectTarget
} from '../../../shared/types/project-types';

// Restore AdminActions type (UI-specific)
export interface AdminActions {
  onSaveProject?: (input: SaveProjectInput, token?: string) => Promise<void>;
  onBulkDelete?: (targets: ProjectTarget[], token?: string) => Promise<void>;
  onRefresh?: () => Promise<void>;
}
// AdminActions is UI-specific, keep from models if needed
import {
  CategoryFilters,
  DateFilters,
  ProjectHeader,
  ProjectResults,
  SearchBox,
  TagFilters
} from './components';
import { AdminOverlay } from './AdminOverlay';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { AdminTabsModal } from './AdminTabsModal';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { showAuthToast } from '../Auth/AuthToast';

import './projects.css';
import './projects-reader.css';
import './projects-transitions.css';
import '../../pages/admin/projects.css';

export interface ProjectsManagerProps extends Partial<AdminActions> {
  isAdmin?: boolean;
  adminToken?: string;
  adminApiBase?: string;
}

export default function ProjectsManager(
  props: ProjectsManagerProps
): React.ReactNode {
  const {
    isAdmin = false,
    adminToken,
    onSaveProject,
    onBulkDelete,
    onRefresh,
    adminApiBase
  } = props;

  const features = useFeaturesConfig();
  const { data, loading, error } = useStoreProjects();

  if (!features.projectsPage) return null;

  if (loading) {
    return (
      <Loading
        message={
          isAdmin ? '🔄 Loading Projects (Admin)…' : '🔄 Loading Projects…'
        }
        secondaryMessage={
          isAdmin
            ? 'Fetching + preparing admin UI…'
            : 'Fetching Data and Filtering…'
        }
        useWrap={true}
      />
    );
  }

  if (error) {
    return (
      <div className="portfolio-wrap">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="portfolio-muted" style={{ color: '#d32f2f' }}>
            ❌ Data Loading Error
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            {error.message}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>
            Please Check Your Data Source Configuration.
          </p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="portfolio-wrap">
        <p className="portfolio-muted">No Projects Found.</p>
      </div>
    );
  }

  return (
    <ProjectsManagerContent
      rawData={data}
      isAdmin={isAdmin}
      adminToken={adminToken}
      onSaveProject={onSaveProject}
      onBulkDelete={onBulkDelete}
      onRefresh={onRefresh}
      adminApiBase={adminApiBase}
    />
  );
}

function ProjectsManagerContent({
  rawData,
  isAdmin,
  adminToken,
  onSaveProject,
  onBulkDelete,
  onRefresh,
  adminApiBase
}: {
  rawData: any[];
  isAdmin: boolean;
  adminToken?: string;
  onSaveProject?: (input: SaveProjectInput, token?: string) => Promise<void>;
  onBulkDelete?: (targets: ProjectTarget[], token?: string) => Promise<void>;
  onRefresh?: () => Promise<void>;
  adminApiBase?: string;
}): React.ReactNode {
  const {
    selectedFilter,
    setSelectedFilter,
    isLoading: isFilterLoading
  } = useUrlFilter({ persistKey: 'projects.filter' });
  const { searchTerm, setSearchTerm, searchInputRef, handleClearSearch } =
    useSearch({ persistKey: 'projects.search' });
  const { filtersRef, projectsRef, scrollToProjects, scrollToFilters } =
    useScrollRefs();

  const [selectedDateRange, setSelectedDateRange] = useState('most-recent');

  const {
    processedData,
    loading: processingLoading,
    error: processingError
  } = useProcessor(rawData || [], {
    selectedCategory: selectedFilter,
    selectedDateRange,
    searchTerm
  });

  useEffect(() => {
    if (searchTerm) setSelectedDateRange('all-dates');
    else setSelectedDateRange('most-recent');
  }, [searchTerm]);

  useEffect(() => {
    if (
      selectedFilter &&
      selectedFilter !== 'most-recent' &&
      selectedFilter !== 'all' &&
      selectedFilter !== 'all-dates'
    ) {
      setSelectedDateRange('all-dates');
    } else if (
      !searchTerm &&
      (selectedFilter === 'most-recent' ||
        selectedFilter === 'all' ||
        !selectedFilter)
    ) {
      setSelectedDateRange('most-recent');
    }
  }, [selectedFilter, searchTerm]);

  const handleFilterToggle = useCallback(
    (filterKey: string) => {
      if (selectedFilter === filterKey) setSelectedFilter('most-recent');
      else setSelectedFilter(filterKey);
    },
    [selectedFilter, setSelectedFilter]
  );

  useEffect(() => {
    if (processedData && selectedFilter) {
      const matchingOption = processedData.categoryOptions.find(
        (option) => option.key.toLowerCase() === selectedFilter.toLowerCase()
      );
      if (matchingOption && matchingOption.key !== selectedFilter) {
        setSelectedFilter(matchingOption.key);
      }
    }
  }, [processedData, selectedFilter, setSelectedFilter]);

  if (processingError) {
    return (
      <div className="portfolio-wrap">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="portfolio-muted" style={{ color: '#d32f2f' }}>
            ❌ Data Processing Error
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            {processingError.message}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>
            There was an issue processing the project data. Please try
            refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (processingLoading || !processedData) {
    return <Loading message="🔄 Processing Data..." useWrap={true} />;
  }

  return (
    <>
      <ProjectHeader categoryText={processedData.categoryText} />
      <main>
        <AdminOrStats isAdmin={isAdmin} processedData={processedData} />

        <section className="projectCategories" ref={filtersRef}>
          <div className="container">
            <div className="projectControls">
              <SearchBox
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchInputRef={searchInputRef}
                handleClearSearch={handleClearSearch}
              />
            </div>

            <div className="filterSection">
              <DateFilters
                dateOptions={processedData.dateOptions}
                selectedDateRange={selectedDateRange}
                onDateChange={(key) => {
                  setSelectedDateRange(key);
                  scrollToProjects();
                }}
                searchTerm={searchTerm}
              />

              <CategoryFilters
                categoryOptions={processedData.categoryOptions}
                activeFilter={selectedFilter}
                onFilterChange={(key) => {
                  handleFilterToggle(key);
                  scrollToProjects();
                }}
                searchTerm={searchTerm}
                processedData={processedData}
                isLoading={isFilterLoading}
              />

              <CategoryFilters
                categoryOptions={processedData.technologyOptions}
                activeFilter={selectedFilter}
                onFilterChange={(key) => {
                  handleFilterToggle(key);
                  scrollToProjects();
                }}
                searchTerm={searchTerm}
                processedData={processedData}
                isLoading={isFilterLoading}
                title="Technologies"
              />

              {processedData.tagTiers && (
                <TagFilters
                  tagTiers={processedData.tagTiers}
                  activeTag={selectedFilter}
                  onTagChange={(key) => {
                    handleFilterToggle(key);
                    scrollToProjects();
                  }}
                />
              )}

              <div ref={projectsRef}></div>
            </div>

            {isAdmin ? (
              <AdminProjects
                processedData={processedData}
                onSaveProject={onSaveProject}
                onBulkDelete={onBulkDelete}
                adminToken={adminToken}
                onRefresh={onRefresh}
                onScrollToFilters={scrollToFilters}
                adminApiBase={adminApiBase}
              />
            ) : (
              <ProjectResults
                filteredCategories={processedData.categories}
                searchTerm={searchTerm}
                activeFilter={selectedFilter}
                onFilterToggle={handleFilterToggle}
                onScrollToFilters={scrollToFilters}
                isAdmin={isAdmin}
                selectedProjects={[]}
                onProjectSelect={(projectId, selected) => {
                  console.log('Project selection:', projectId, selected);
                }}
                onProjectSave={(projectId, field, value) => {
                  console.log('Project save:', projectId, field, value);
                  // TODO: Implement actual save functionality using onSaveProject
                }}
              />
            )}
          </div>
        </section>
      </main>

      <DebugInfo
        meta={undefined}
        metrics={[
          { label: '📁 Projects', value: processedData.stats.totalProjects },
          { label: '🕒 Recent', value: processedData.stats.recentProjects },
          {
            label: '🧬 Technologies',
            value: processedData.stats.totalTechnologies
          },
          { label: '📅 Average Age', value: processedData.stats.averageAge }
        ]}
      />
    </>
  );
}

function AdminOrStats({
  isAdmin,
  processedData
}: {
  isAdmin: boolean;
  processedData: ProcessedProjectData;
}) {
  if (isAdmin) return null; // Stats already visible in admin grids via headers/actions
  return (
    <div className="container">
      <div className="projectStats">
        <div className="projectStat">
          <div className="statLabel">Total</div>
          <div className="statValue">{processedData.stats.totalProjects}</div>
        </div>
        <div className="projectStat">
          <div className="statLabel">Recent</div>
          <div className="statValue">{processedData.stats.recentProjects}</div>
        </div>
        <div className="projectStat">
          <div className="statLabel">Technologies</div>
          <div className="statValue">
            {processedData.stats.totalTechnologies}
          </div>
        </div>
        <div className="projectStat">
          <div className="statLabel">Avg Age</div>
          <div className="statValue">{processedData.stats.averageAge}</div>
        </div>
      </div>
    </div>
  );
}

function AdminProjects({
  processedData,
  onSaveProject,
  onBulkDelete,
  adminToken,
  onRefresh,
  onScrollToFilters,
  adminApiBase
}: {
  processedData: ProcessedProjectData;
  onSaveProject?: (input: SaveProjectInput, token?: string) => Promise<void>;
  onBulkDelete?: (targets: ProjectTarget[], token?: string) => Promise<void>;
  adminToken?: string;
  onRefresh?: () => Promise<void>;
  onScrollToFilters: () => void;
  adminApiBase?: string;
}) {
  // selection keys and helpers
  const keyFor = (cat: string, sub: string, slug: string) =>
    `${cat}||${sub}||${slug}`;
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'projects' | 'edit'>('projects');
  const [status, setStatus] = useState<{
    loading?: boolean;
    error?: string | null;
    success?: string | null;
  }>({});
  const [toasts, setToasts] = useState<
    Array<{ id: number; type: 'info' | 'success' | 'error'; message: string }>
  >([]);
  const showToast = useCallback(
    (type: 'info' | 'success' | 'error', message: string) => {
      showAuthToast(message, type);
    },
    []
  );

  // form state
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

  const loadIntoForm = useCallback(
    (cat: string, sub: string, project: Project) => {
      const slug = slugify(project.title || 'project');
      setForm({
        category: cat,
        subCategory: sub,
        slug,
        title: project.title || '',
        link: project.link || '',
        lastModified:
          typeof project.lastModified === 'string'
            ? project.lastModified
            : project.lastModified?.toISOString() || '',
        summary: project.summary || '',
        tags: project.tags || [],
        tagInput: ''
      });
      setActiveTab('edit');
    },
    []
  );

  const selectAllFiltered = useCallback(() => {
    const all: string[] = [];
    processedData.categories.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        sub.projects.forEach((p) => {
          const effCat = (p as any).category || cat.category;
          const effSub = (p as any).subCategory || sub.name;
          all.push(keyFor(effCat, effSub, slugify(p.title || 'project')));
        });
      });
    });
    setSelection(new Set(all));
  }, [processedData]);

  const clearSelection = useCallback(() => setSelection(new Set()), []);

  const bulkDelete = useCallback(async () => {
    if (!onBulkDelete || selection.size === 0) return;
    if (typeof window !== 'undefined') {
      if (typeof window.confirm === 'function') {
        if (!window.confirm(`Delete ${selection.size} selected projects?`))
          return;
      } else {
        // No confirm available: treat as cancelled in tests/JSDOM
        return;
      }
    }
    setStatus({ loading: true, error: null, success: null });
    try {
      const targets: ProjectTarget[] = Array.from(selection).map((k) => {
        const [category, subCategory, slug] = k.split('||');
        return { category, subCategory, slug };
      });
      await onBulkDelete(targets, adminToken);
      setStatus({
        loading: false,
        error: null,
        success: 'Deleted selected projects'
      });
      clearSelection();
      await onRefresh?.();
      showToast('success', 'Deleted selected projects');
    } catch (e: any) {
      setStatus({
        loading: false,
        error: e?.message || 'Bulk delete failed',
        success: null
      });
      showToast('error', e?.message || 'Bulk delete failed');
    }
  }, [
    selection,
    onBulkDelete,
    adminToken,
    onRefresh,
    clearSelection,
    showToast
  ]);

  const canSave = useMemo(
    () =>
      !!form.category && !!form.subCategory && !!form.title && !!form.summary,
    [form]
  );
  const linkError = useMemo(() => {
    const link = (form.link || '').trim();
    if (!link) return null;
    try {
      const u = new URL(link);
      if (!/^https?:$/.test(u.protocol)) return 'Use http(s) URL';
      return null;
    } catch {
      return 'Invalid URL';
    }
  }, [form.link]);

  const save = useCallback(async () => {
    if (!onSaveProject || !canSave) return;
    setStatus({ loading: true, error: null, success: null });
    try {
      const payload: SaveProjectInput = {
        category: form.category,
        subCategory: form.subCategory,
        slug: form.slug || slugify(form.title),
        project: {
          title: form.title,
          link: (form.link || '').trim() || undefined,
          lastModified: (form.lastModified || '').trim() || undefined,
          summary: form.summary,
          tags: form.tags
        }
      };
      await onSaveProject(payload, adminToken);
      setStatus({ loading: false, error: null, success: 'Saved successfully' });
      await onRefresh?.();
      showToast('success', 'Project saved');
    } catch (e: any) {
      setStatus({
        loading: false,
        error: e?.message || 'Failed to save',
        success: null
      });
      showToast('error', e?.message || 'Failed to save');
    }
  }, [onSaveProject, form, canSave, adminToken, onRefresh, showToast]);

  // Hints toggle with persistence
  const [showHints, setShowHints] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const v = localStorage.getItem('projects.admin.hints');
      return v ? v === 'true' : true;
    } catch {
      return true;
    }
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('projects.admin.hints', String(showHints));
    } catch {
      /* ignore */ void 0;
    }
  }, [showHints]);

  // Admin keyboard shortcuts: '/', 'A', 'C', 'Delete', 'E'
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          (target as any).isContentEditable);
      if (!isTyping && e.key === '/') {
        e.preventDefault();
        const el = document.querySelector<HTMLInputElement>(
          '.searchBox input, input[type="search"]'
        );
        el?.focus();
        return;
      }
      if (isTyping) return;
      const key = e.key.toLowerCase();
      if (key === 'a') {
        e.preventDefault();
        selectAllFiltered();
      } else if (key === 'c') {
        e.preventDefault();
        clearSelection();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        void bulkDelete();
      } else if (key === 'e') {
        e.preventDefault();
        // Edit first selected or first visible
        let k: string | undefined = Array.from(selection)[0];
        if (!k) {
          const firstCat = processedData.categories[0];
          const firstSub = firstCat?.subCategories?.[0];
          const firstProj = firstSub?.projects?.[0];
          if (firstCat && firstSub && firstProj) {
            loadIntoForm(firstCat.category, firstSub.name, firstProj);
          }
          return;
        }
        const [catName, subName, slug] = k.split('||');
        outer: for (const cat of processedData.categories) {
          if (cat.category !== catName) continue;
          for (const sub of cat.subCategories) {
            if (sub.name !== subName) continue;
            for (const p of sub.projects) {
              if (slugify(p.title || 'project') === slug) {
                loadIntoForm(catName, subName, p);
                break outer;
              }
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    processedData,
    selection,
    selectAllFiltered,
    clearSelection,
    bulkDelete,
    loadIntoForm
  ]);

  // Listen for global hints toggle from settings modal
  useEffect(() => {
    const listener = () => {
      try {
        const v = localStorage.getItem('projects.admin.hints');
        setShowHints(!v ? true : v === 'true');
      } catch {
        /* ignore */ void 0;
      }
    };
    window.addEventListener(
      'projects.admin.hints.change' as any,
      listener as any
    );
    return () =>
      window.removeEventListener(
        'projects.admin.hints.change' as any,
        listener as any
      );
  }, []);

  // Example usage in UI:
  return (
    <AdminOverlay isAdmin={true}>
      <BulkActionsToolbar
        selected={Array.from(selection)}
        onAction={(action) => showToast('info', `Bulk action: ${action}`)}
        isAdmin={true}
      />
      <KeyboardShortcuts
        onShortcut={(action) => showToast('info', `Shortcut: ${action}`)}
        isAdmin={true}
      />
      {/* Example inline edit for project title */}
      {/* <InlineEditMode value={form.title} onSave={newTitle => setForm(f => ({ ...f, title: newTitle }))} field="title" /> */}
      <AdminTabsModal
        open={activeTab === 'edit'}
        onClose={() => setActiveTab('projects')}
        projectId={form.slug}
        isAdmin={true}
      />

      <section className="margin-bottom--lg">
        <div className="card shadow--tl">
          <div className="card__header">
            <div className="admin-list-header">
              <div className="admin-list-title">
                <h2 className="margin--none">
                  {activeTab === 'projects' ? 'Projects' : 'Edit Project'}
                </h2>
                {activeTab === 'projects' && (
                  <span className="admin-counter">
                    {processedData.stats.totalProjects}
                  </span>
                )}
              </div>
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
            </div>
          </div>
          <div className="card__body">
            {status.loading && (
              <div className="alert alert--info">Working…</div>
            )}
            {status.error && (
              <div className="alert alert--danger">{status.error}</div>
            )}
            {status.success && (
              <div className="alert alert--success">{status.success}</div>
            )}

            {activeTab === 'projects' ? (
              <>
                <div
                  className="admin-actions-bar"
                  style={{ marginTop: '0.25rem' }}
                >
                  <button
                    className="button button--sm"
                    onClick={() => setShowHints((s) => !s)}
                  >
                    {showHints ? 'Hide Hints' : 'Show Hints'}
                  </button>
                </div>
                {showHints && (
                  <div
                    className="admin-chips"
                    aria-label="Shortcut Hints"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <span className="admin-chip admin-chip--key" title="/">
                      / Focus Search
                    </span>
                    <span className="admin-chip admin-chip--key" title="A">
                      A Select All
                    </span>
                    <span className="admin-chip admin-chip--key" title="C">
                      C Clear
                    </span>
                    <span className="admin-chip admin-chip--key" title="Delete">
                      Del Delete
                    </span>
                    <span className="admin-chip admin-chip--key" title="E">
                      E Edit
                    </span>
                  </div>
                )}
                <div className="admin-actions-bar">
                  <button
                    className="button button--sm"
                    onClick={selectAllFiltered}
                  >
                    Select All (Filtered)
                  </button>
                  <button
                    className="button button--sm"
                    onClick={clearSelection}
                  >
                    Clear Selection
                  </button>
                  <button
                    className="button button--sm button--danger"
                    disabled={selection.size === 0}
                    onClick={bulkDelete}
                  >
                    Delete Selected ({selection.size})
                  </button>
                  <button
                    className="button button--sm"
                    onClick={() => {
                      const exportObj = processedData.categories.map((cat) => ({
                        category: cat.category,
                        subCategories: cat.subCategories.map((sub) => ({
                          name: sub.name,
                          projects: sub.projects
                        }))
                      }));
                      const blob = new Blob(
                        [JSON.stringify(exportObj, null, 2)],
                        { type: 'application/json' }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'projects-export.json';
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      if (typeof URL.revokeObjectURL === 'function') {
                        URL.revokeObjectURL(url);
                      }
                    }}
                    title="Export filtered projects to JSON"
                  >
                    Export (Filtered)
                  </button>
                  <label
                    className="button button--sm"
                    title="Import projects JSON"
                    style={{ cursor: 'pointer' }}
                  >
                    Import JSON
                    <input
                      type="file"
                      accept="application/json"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const inputEl =
                          e.currentTarget as HTMLInputElement | null;
                        const file = inputEl?.files?.[0];
                        if (!file || !onSaveProject) return;
                        setStatus({
                          loading: true,
                          error: null,
                          success: null
                        });
                        try {
                          let text = '';
                          try {
                            // Prefer native File.text when available
                            // @ts-ignore
                            text =
                              typeof file.text === 'function'
                                ? await file.text()
                                : await new Response(file).text();
                          } catch {
                            // Fallback to Response-based read
                            try {
                              text = await new Response(file as any).text();
                            } catch {
                              text = '';
                            }
                          }
                          const json = JSON.parse(text);
                          for (const cat of json || []) {
                            for (const sub of cat.subCategories || []) {
                              for (const p of sub.projects || []) {
                                const slug = slugify(p.title || 'project');
                                await onSaveProject(
                                  {
                                    category: cat.category,
                                    subCategory: sub.name,
                                    slug,
                                    project: p
                                  },
                                  adminToken
                                );
                              }
                            }
                          }
                          setStatus({
                            loading: false,
                            error: null,
                            success: 'Import complete'
                          });
                          await onRefresh?.();
                        } catch (err: any) {
                          setStatus({
                            loading: false,
                            error: err?.message || 'Import failed',
                            success: null
                          });
                        } finally {
                          // No-op: avoid manipulating input value in tests/environments
                        }
                      }}
                    />
                  </label>
                  <button
                    className="button button--sm"
                    onClick={onScrollToFilters}
                  >
                    ↑ Back to Filters
                  </button>
                </div>
                <div className="projectGrid">
                  {processedData.categories.flatMap((cat) =>
                    cat.subCategories.flatMap((sub) =>
                      sub.projects.map((p, idx) => {
                        const slug = slugify(p.title || 'project');
                        const effCat = (p as any).category || cat.category;
                        const effSub = (p as any).subCategory || sub.name;
                        const k = keyFor(effCat, effSub, slug);
                        const isRecent =
                          p.lastModified &&
                          new Date().getTime() -
                            new Date(p.lastModified).getTime() <
                            14 * 24 * 60 * 60 * 1000;
                        return (
                          <div
                            key={`${k}-${idx}`}
                            className={`projectCard ${selection.has(k) ? 'admin-item--active' : ''}`}
                            onClick={(e) => {
                              // Prevent edit when clicking on interactive elements
                              const target = e.target as HTMLElement;
                              if (
                                target.tagName === 'A' ||
                                target.tagName === 'BUTTON' ||
                                target.tagName === 'INPUT' ||
                                target.closest('a') ||
                                target.closest('button') ||
                                target.closest('input')
                              ) {
                                return;
                              }
                              loadIntoForm(cat.category, sub.name, p);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className="projectCardHeader"
                              style={{ alignItems: 'center', gap: '0.5rem' }}
                            >
                              <input
                                type="checkbox"
                                checked={selection.has(k)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelection((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(k)) next.delete(k);
                                    else next.add(k);
                                    return next;
                                  });
                                }}
                                title="Select"
                                style={{ marginRight: '0.5rem' }}
                              />
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  flex: 1
                                }}
                              >
                                <h3
                                  className="projectCardTitle"
                                  style={{ margin: 0 }}
                                >
                                  {p.title}
                                </h3>
                                <span className="admin-tag" title="Category">
                                  {cat.category}
                                </span>
                                <span
                                  className="admin-tag"
                                  title="Sub-Category"
                                >
                                  {sub.name}
                                </span>
                                {isRecent && (
                                  <span
                                    className="admin-tag"
                                    title="Updated recently"
                                  >
                                    Updated
                                  </span>
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
                              <QuickMenu
                                onCopySlug={() => copyToClipboard(slug)}
                                onCopyLink={
                                  p.link
                                    ? () => copyToClipboard(p.link!)
                                    : undefined
                                }
                                onCopyApiUrl={
                                  adminApiBase
                                    ? () =>
                                        copyToClipboard(
                                          `${adminApiBase}/v1/projects/${encodeURIComponent(effCat)}/${encodeURIComponent(effSub)}/${encodeURIComponent(slug)}`
                                        )
                                    : undefined
                                }
                              />
                              <button
                                type="button"
                                className="button button--sm button--danger"
                                title="Delete"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (!onBulkDelete) return;
                                  let confirmed = true;
                                  if (typeof window !== 'undefined') {
                                    confirmed =
                                      typeof window.confirm === 'function'
                                        ? window.confirm(`Delete ${p.title}?`)
                                        : false;
                                  }
                                  if (!confirmed) return;
                                  setStatus({
                                    loading: true,
                                    error: null,
                                    success: null
                                  });
                                  try {
                                    await onBulkDelete(
                                      [
                                        {
                                          category: effCat,
                                          subCategory: effSub,
                                          slug
                                        }
                                      ],
                                      adminToken
                                    );
                                    setStatus({
                                      loading: false,
                                      error: null,
                                      success: 'Deleted'
                                    });
                                    setSelection((prev) => {
                                      const next = new Set(prev);
                                      next.delete(k);
                                      return next;
                                    });
                                    await onRefresh?.();
                                    showToast('success', `Deleted ${p.title}`);
                                  } catch (err: any) {
                                    setStatus({
                                      loading: false,
                                      error: err?.message || 'Delete failed',
                                      success: null
                                    });
                                    showToast(
                                      'error',
                                      err?.message || 'Delete failed'
                                    );
                                  }
                                }}
                                style={{ marginLeft: '0.5rem' }}
                              >
                                Delete
                              </button>
                            </div>
                            <p className="projectSummary">{p.summary}</p>
                            <div className="projectFooter">
                              {p.lastModified && (
                                <span className="projectDate">
                                  {new Date(
                                    p.lastModified
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )
                  )}
                </div>
              </>
            ) : (
              <div id="edit-form" className="admin-edit-full">
                <div className="admin-edit-body">
                  <div className="admin-row">
                    <label className="admin-field">
                      <div>Category</div>
                      <input
                        className="admin-input"
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <div>Sub-Category</div>
                      <input
                        className="admin-input"
                        value={form.subCategory}
                        onChange={(e) =>
                          setForm({ ...form, subCategory: e.target.value })
                        }
                      />
                    </label>
                  </div>
                  <div className="admin-row">
                    <label className="admin-field">
                      <div>Slug</div>
                      <div className="admin-slug-row">
                        <input
                          className="admin-input"
                          value={form.slug}
                          onChange={(e) =>
                            setForm({ ...form, slug: e.target.value })
                          }
                        />
                        <span className="admin-slug-preview">
                          {form.slug || slugify(form.title)}
                        </span>
                        <button
                          type="button"
                          className="button button--sm"
                          onClick={() => {
                            const s = form.slug || slugify(form.title);
                            copyToClipboard(s);
                            showToast('success', 'Slug copied');
                          }}
                          title="Copy slug"
                        >
                          Copy Slug
                        </button>
                      </div>
                    </label>
                    <label className="admin-field">
                      <div>Title</div>
                      <input
                        className="admin-input"
                        value={form.title}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            title: e.target.value,
                            slug: form.slug
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className="admin-row">
                    <label className="admin-field">
                      <div>Link</div>
                      <div className="admin-slug-row">
                        <input
                          className="admin-input"
                          aria-invalid={Boolean(linkError)}
                          value={form.link}
                          onChange={(e) =>
                            setForm({ ...form, link: e.target.value })
                          }
                          placeholder="https://…"
                        />
                        <button
                          type="button"
                          className="button button--sm"
                          onClick={() => {
                            const url = (form.link || '').trim();
                            try {
                              const u = new URL(url);
                              if (!/^https?:/.test(u.protocol))
                                throw new Error('');
                              window.open(u.toString(), '_blank');
                            } catch {
                              showToast('error', 'Invalid link');
                            }
                          }}
                          title="Open link in new tab"
                          disabled={!form.link}
                        >
                          Test
                        </button>
                        <QuickMenu
                          onCopyLink={
                            form.link
                              ? () => {
                                  copyToClipboard(form.link!);
                                  showToast('success', 'Link copied');
                                }
                              : undefined
                          }
                          onCopyApiUrl={
                            adminApiBase && form.category && form.subCategory
                              ? () => {
                                  const apiUrl = `${adminApiBase}/v1/projects/${encodeURIComponent(form.category)}/${encodeURIComponent(form.subCategory)}/${encodeURIComponent(form.slug || slugify(form.title))}`;
                                  copyToClipboard(apiUrl);
                                  showToast('success', 'API URL copied');
                                }
                              : undefined
                          }
                        />
                      </div>
                      {linkError && (
                        <span className="admin-hint--error">{linkError}</span>
                      )}
                    </label>
                    <label className="admin-field">
                      <div>Last Modified</div>
                      <input
                        className="admin-input"
                        value={form.lastModified || ''}
                        onChange={(e) =>
                          setForm({ ...form, lastModified: e.target.value })
                        }
                        placeholder="YYYY-MM-DD"
                      />
                    </label>
                  </div>
                  <label className="admin-field">
                    <div>Summary</div>
                    <textarea
                      rows={6}
                      value={form.summary}
                      onChange={(e) =>
                        setForm({ ...form, summary: e.target.value })
                      }
                      className="admin-textarea"
                    />
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
                            onClick={() =>
                              setForm({
                                ...form,
                                tags: form.tags.filter((x) => x !== t)
                              })
                            }
                            title="Remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        value={form.tagInput || ''}
                        onChange={(e) =>
                          setForm({ ...form, tagInput: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const t = (form.tagInput || '').trim();
                            if (t && !form.tags.includes(t))
                              setForm({
                                ...form,
                                tags: [...form.tags, t],
                                tagInput: ''
                              });
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
                          if (t && !form.tags.includes(t))
                            setForm({
                              ...form,
                              tags: [...form.tags, t],
                              tagInput: ''
                            });
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="admin-actions">
                    <button
                      className="button button--primary"
                      onClick={save}
                      disabled={!canSave || status.loading}
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="admin-toasts">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`admin-toast admin-toast--${t.type}`}
            onClick={() =>
              setToasts((prev) => prev.filter((x) => x.id !== t.id))
            }
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AdminOverlay>
  );
}

function copyToClipboard(text: string) {
  try {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  } catch {
    /* ignore */ void 0;
  }
}

function QuickMenu({
  onCopySlug,
  onCopyLink,
  onCopyApiUrl
}: {
  onCopySlug?: () => void;
  onCopyLink?: () => void;
  onCopyApiUrl?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="admin-menu-wrap" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="button button--sm"
        title="Quick actions"
        aria-label="Quick actions"
        onClick={() => setOpen((o) => !o)}
      >
        ⋮
      </button>
      {open && (
        <div className="admin-menu">
          {onCopySlug && (
            <button
              className="admin-menu-item"
              onClick={() => {
                onCopySlug();
                setOpen(false);
              }}
            >
              Copy Slug
            </button>
          )}
          {onCopyLink && (
            <button
              className="admin-menu-item"
              onClick={() => {
                onCopyLink();
                setOpen(false);
              }}
            >
              Copy Link
            </button>
          )}
          {onCopyApiUrl && (
            <button
              className="admin-menu-item"
              onClick={() => {
                onCopyApiUrl();
                setOpen(false);
              }}
            >
              Copy API URL
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}
