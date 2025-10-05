import { DataSource, Repository, DataSourceOptions } from 'typeorm';
import {
  IProjectRepository,
  Category,
  FlatProject,
  Project,
  IConfigService
} from './interfaces';
import { ProjectEntity } from './entities/project-entity';

/**
 * Database-backed implementation of the project repository using TypeORM
 */
export class DatabaseProjectRepository implements IProjectRepository {
  private dataSource?: DataSource;
  private repo?: Repository<ProjectEntity>;

  constructor(private readonly config: IConfigService) {}

  private async getRepo(): Promise<Repository<ProjectEntity>> {
    if (!this.dataSource) {
      try {
        const dbType = this.config.getDatabaseType();

        if (dbType === 'sqlite') {
          // Use sqlite3 for SQLite
          const dbUrl = this.config.getDatabaseUrl();
          let database: string;

          if (dbUrl === 'sqlite::memory:') {
            database = ':memory:';
          } else {
            database = dbUrl.replace('sqlite:', '');
          }

          const options: DataSourceOptions = {
            type: 'sqlite',
            database,
            entities: [ProjectEntity],
            synchronize: true
          };

          this.dataSource = new DataSource(options);
        } else {
          const options: DataSourceOptions = {
            type: dbType as any,
            url: this.config.getDatabaseUrl(),
            entities: [ProjectEntity],
            synchronize: true
          };
          this.dataSource = new DataSource(options);
        }

        await this.dataSource.initialize();
        this.repo = this.dataSource.getRepository(ProjectEntity);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        throw new Error(
          `Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    if (!this.repo) {
      throw new Error('Repository is not initialized');
    }

    return this.repo;
  }

  private toProject(entity: ProjectEntity): Project {
    return {
      title: entity.title,
      link: entity.link || undefined,
      summary: entity.summary,
      tags: entity.tags || [],
      lastModified: entity.lastModified ?? undefined,
      repoUrl: entity.repoUrl ?? undefined,
      stats:
        entity.stars !== undefined
          ? {
              stars: entity.stars || 0,
              forks: entity.forks || 0,
              language: entity.language || '',
              size: entity.size || 0,
              lastCommit: entity.lastCommit || new Date(0),
              openIssues: entity.openIssues || 0
            }
          : undefined,
      lastSyncedAt: entity.lastSyncedAt ?? undefined,
      syncEnabled: entity.syncEnabled ?? true,
      syncInterval: entity.syncInterval ?? 'daily'
    };
  }

  private toEntity(
    category: string,
    subCategory: string,
    slug: string,
    project: Project
  ): ProjectEntity {
    const entity = new ProjectEntity();
    entity.category = category;
    entity.subCategory = subCategory;
    entity.slug = slug;
    entity.title = project.title;
    entity.link = project.link;
    entity.summary = project.summary;
    entity.tags = project.tags;
    if (project.lastModified) {
      entity.lastModified =
        project.lastModified instanceof Date
          ? project.lastModified
          : new Date(project.lastModified);
    }
    entity.repoUrl = project.repoUrl;
    if (project.stats) {
      entity.stars = project.stats.stars;
      entity.forks = project.stats.forks;
      entity.language = project.stats.language;
      entity.size = project.stats.size;
      entity.lastCommit =
        project.stats.lastCommit instanceof Date
          ? project.stats.lastCommit
          : new Date(project.stats.lastCommit);
      entity.openIssues = project.stats.openIssues;
    }
    if (project.lastSyncedAt) {
      entity.lastSyncedAt =
        project.lastSyncedAt instanceof Date
          ? project.lastSyncedAt
          : new Date(project.lastSyncedAt);
    }
    entity.syncEnabled = project.syncEnabled ?? true;
    entity.syncInterval = project.syncInterval ?? 'daily';
    return entity;
  }

  async getFlat(): Promise<FlatProject[]> {
    const repo = await this.getRepo();
    const entities = await repo.find();
    return entities.map((e) => ({
      id: e.id.toString(),
      category: e.category,
      subCategory: e.subCategory,
      slug: e.slug,
      project: this.toProject(e)
    }));
  }

  async getAll(): Promise<Category[]> {
    const flat = await this.getFlat();
    const map = new Map<string, Map<string, Project[]>>();

    for (const item of flat) {
      if (!map.has(item.category)) {
        map.set(item.category, new Map());
      }
      const subMap = map.get(item.category)!;
      if (!subMap.has(item.subCategory)) {
        subMap.set(item.subCategory, []);
      }
      subMap.get(item.subCategory)!.push(item.project);
    }

    const categories: Category[] = [];
    for (const [category, subMap] of map) {
      const subCategories = Array.from(subMap.entries()).map(
        ([name, projects]) => ({
          name,
          projects
        })
      );
      categories.push({ category, subCategories });
    }
    return categories;
  }

  async getById(
    category: string,
    subCategory: string,
    slug: string
  ): Promise<Project | null> {
    const repo = await this.getRepo();
    const entity = await repo.findOne({
      where: { category, subCategory, slug }
    });
    return entity ? this.toProject(entity) : null;
  }

  async getByNumericId(id: number): Promise<FlatProject | null> {
    const repo = await this.getRepo();
    const entity = await repo.findOne({ where: { id } });
    return entity
      ? {
          id: entity.id.toString(),
          category: entity.category,
          subCategory: entity.subCategory,
          slug: entity.slug,
          project: this.toProject(entity)
        }
      : null;
  }

  async save(
    category: string,
    subCategory: string,
    slug: string,
    project: Project
  ): Promise<Project> {
    const repo = await this.getRepo();
    const entity = this.toEntity(category, subCategory, slug, project);
    await repo.save(entity);
    return this.toProject(entity);
  }

  async delete(
    category: string,
    subCategory: string,
    slug: string
  ): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete({ category, subCategory, slug });
  }

  async saveMany(projects: FlatProject[]): Promise<void> {
    for (const p of projects) {
      await this.save(p.category, p.subCategory, p.slug, p.project);
    }
  }

  async exists(
    category: string,
    subCategory: string,
    slug: string
  ): Promise<boolean> {
    const repo = await this.getRepo();
    return repo.exist({ where: { category, subCategory, slug } });
  }

  async count(): Promise<number> {
    const repo = await this.getRepo();
    return repo.count();
  }
}
