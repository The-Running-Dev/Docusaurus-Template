export interface GiscusConfig {
  term: string;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  reactionsEnabled: boolean;
  emitMetadata: boolean;
  inputPosition: string;
  lang: string;
  loading: string;
  theme: {
    light: string;
    dark: string;
  };
}
// export interface GiscusCommentsProps {
//   repo?: `${string}/${string}`;
//   repoId?: string;
//   category?: string;
//   categoryId?: string;
//   mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
//   term?: string;
//   reactionsEnabled?: boolean;
//   emitMetadata?: boolean;
//   inputPosition?: 'top' | 'bottom';
//   lang?: string;
//   loading?: 'lazy' | 'eager';
// }
