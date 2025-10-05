import React, { useMemo } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import Loading from '../Loading/Loading';
import { StreamlinedAdmin } from './StreamlinedAdmin';
import { useAdminProjects } from './hooks/useAdminProjects';
import { useProjects as useStoreProjects } from '../../hooks/useProjects';
import './StreamlinedAdmin.css';

export default function ProjectsAdmin(): React.ReactElement {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const {
    data,
    loading: projectsLoading,
    error: projectsError
  } = useStoreProjects();
  const { putProject, bulkDelete, refresh } = useAdminProjects();

  // Convert store data to ProcessedProjectData format for admin interface
  const processedData = useMemo(() => {
    if (!data) {
      return {
        categories: [],
        technologyOptions: [],
        categoryOptions: [],
        dateOptions: [],
        tagOptions: [],
        stats: {
          totalProjects: 0,
          recentProjects: 0,
          totalTechnologies: 0,
          averageAge: 'N/A'
        },
        categoryText: 'No Categories'
      };
    }

    // Convert the data to ProcessedProjectData format
    const categories = data.map((cat) => ({
      category: cat.category,
      subCategories: cat.subCategories.map((sub) => ({
        name: sub.name,
        projects: sub.projects
      }))
    }));

    // Extract all projects for stats
    const allProjects = data.flatMap((cat) =>
      cat.subCategories.flatMap((sub) => sub.projects)
    );

    // Extract all tags
    const allTags = Array.from(
      new Set(allProjects.flatMap((project) => project.tags || []))
    );

    return {
      categories,
      technologyOptions: [],
      categoryOptions: data.map((cat) => ({
        key: cat.category,
        label: cat.category,
        count: cat.subCategories.reduce(
          (sum, sub) => sum + sub.projects.length,
          0
        )
      })),
      dateOptions: [],
      tagOptions: allTags.map((tag) => ({
        key: tag,
        label: tag,
        count: allProjects.filter((p) => p.tags?.includes(tag)).length
      })),
      stats: {
        totalProjects: allProjects.length,
        recentProjects: 0, // Could calculate based on lastModified
        totalTechnologies: allTags.length,
        averageAge: 'N/A'
      },
      categoryText: `${data.length} Categories`
    };
  }, [data]);

  // Show loading while auth is initializing
  if (isInitializing) {
    return <Loading message="🔐 Checking authentication..." />;
  }

  // Show message if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You must be logged in as an administrator to access this page.</p>
      </div>
    );
  }

  // Show loading while projects are loading
  if (projectsLoading) {
    return <Loading message="🔄 Loading projects..." />;
  }

  // Show error if there's an error loading projects
  if (projectsError) {
    return (
      <div className="admin-error">
        <h2>Error Loading Projects</h2>
        <p>
          {projectsError.message || 'An error occurred while loading projects.'}
        </p>
      </div>
    );
  }

  return (
    <StreamlinedAdmin
      processedData={processedData}
      onSaveProject={putProject}
      onBulkDelete={bulkDelete}
      onRefresh={refresh}
    />
  );
}
