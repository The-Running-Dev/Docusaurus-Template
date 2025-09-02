import { useState, useEffect } from 'react';

export function useProjectValidation(project: any, allProjects: any[]) {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const errs: string[] = [];
    // Required fields
    if (!project.title) errs.push('Title is required');
    if (!project.summary) errs.push('Summary is required');
    // Link check
    if (project.link) {
      try {
        const url = new URL(project.link);
        if (!/^https?:$/.test(url.protocol)) errs.push('Link must be http(s)');
      } catch {
        errs.push('Invalid link URL');
      }
    }
    // Duplicate detection
    if (
      allProjects.some((p) => p.id !== project.id && p.title === project.title)
    ) {
      errs.push('Duplicate project title');
    }
    setErrors(errs);
  }, [project, allProjects]);

  return errors;
}
