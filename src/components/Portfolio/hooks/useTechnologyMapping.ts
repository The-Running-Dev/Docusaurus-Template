import { useProjects } from '../../../hooks/useProjects';

/**
 * Utility function to map technology names to their corresponding subcategory filter keys
 * This creates dynamic mapping from Portfolio technologies to Projects subcategories
 */
export function useTechnologyMapping() {
  const { data: projectsData } = useProjects();

  /**
   * Find the subcategory filter key for a given technology name and category
   * @param techName - Technology name from Portfolio (e.g., "React", "Node.js")
   * @param techCategory - Technology category from Portfolio (e.g., "Frontend", "Backend")
   * @returns Subcategory filter key (e.g., "Frontend-React") or null if not found
   */
  const getTechnologyFilterKey = (techName: string, techCategory: string): string | null => {
    if (!projectsData || !Array.isArray(projectsData)) {
      return null;
    }

    // Find matching category in projects data
    const projectCategory = projectsData.find(
      (cat: any) => cat.category?.toLowerCase() === techCategory.toLowerCase()
    );

    if (!projectCategory || !Array.isArray(projectCategory.subCategories)) {
      return null;
    }

    // Find matching subcategory
    const matchingSubCategory = projectCategory.subCategories.find(
      (sub: any) => {
        if (!sub?.name) return false;
        
        // Normalize both names for comparison
        const subName = sub.name.toLowerCase().trim();
        const techNameNormalized = techName.toLowerCase().trim();
        
        // Try exact match first
        if (subName === techNameNormalized) {
          return true;
        }
        
        // Handle common variations
        // "Node.js" vs "NodeJS" vs "Node.JS"
        const normalizeNodeJs = (name: string) => 
          name.replace(/node\.?js/gi, 'nodejs');
        
        if (normalizeNodeJs(subName) === normalizeNodeJs(techNameNormalized)) {
          return true;
        }
        
        // ".NET" vs "NET" vs "DotNet"
        const normalizeDotNet = (name: string) => 
          name.replace(/^\.?net$/gi, 'net').replace(/dotnet/gi, 'net');
        
        if (normalizeDotNet(subName) === normalizeDotNet(techNameNormalized)) {
          return true;
        }
        
        return false;
      }
    );

    if (matchingSubCategory) {
      return `${projectCategory.category}-${matchingSubCategory.name}`;
    }

    return null;
  };

  /**
   * Get filter key for a technology - either subcategory filter or fallback to tag filter
   * @param techName - Technology name
   * @param techCategory - Technology category
   * @returns Filter key for use in ProjectsLink
   */
  const getFilterKey = (techName: string, techCategory: string): string => {
    const subcategoryKey = getTechnologyFilterKey(techName, techCategory);
    
    if (subcategoryKey) {
      return subcategoryKey;
    }
    
    // Fallback to tag filter if no subcategory match found
    return `tag-${techName.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return {
    getTechnologyFilterKey,
    getFilterKey
  };
}