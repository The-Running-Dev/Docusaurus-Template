import cron, { ScheduledTask } from 'node-cron';
import {
  ISyncService,
  IProjectRepository,
  IRepoProvider,
  IConfigService,
  ICacheService,
  FlatProject
} from '../repositories/interfaces';

/**
 * Service responsible for synchronizing project statistics
 */
export class SyncService implements ISyncService {
  private task?: ScheduledTask;

  constructor(
    private readonly repo: IProjectRepository,
    private readonly provider: IRepoProvider,
    private readonly cache: ICacheService,
    private readonly config: IConfigService
  ) {}

  start(): void {
    if (!this.config.isSyncEnabled()) return;
    const interval = this.config.getSyncInterval();
    const schedule = interval === 'weekly' ? '0 0 * * 0' : '0 0 * * *';
    this.task = cron.schedule(schedule, () => {
      this.syncAll().catch((err) => console.error('Sync failed', err));
    });
  }

  async syncAll(): Promise<void> {
    const flat = await this.repo.getFlat();
    for (const p of flat) {
      await this.syncProjectData(p);
    }
    await this.cache.regenerateCache();
  }

  async syncProject(id: number): Promise<void> {
    const project = await this.repo.getByNumericId(id);
    if (project) {
      await this.syncProjectData(project, true);
      await this.cache.regenerateCache();
    }
  }

  private async syncProjectData(p: FlatProject, force = false): Promise<void> {
    const project = p.project;
    if (!project.repoUrl || project.syncEnabled === false) return;

    if (!force) {
      const interval = project.syncInterval || 'daily';
      if (interval === 'disabled') return;

      const last = project.lastSyncedAt
        ? new Date(project.lastSyncedAt)
        : undefined;
      const now = Date.now();
      const diff = last ? now - last.getTime() : Infinity;
      const ms = interval === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      if (diff < ms) return;
    }
    try {
      const stats = await this.provider.getRepoStats(project.repoUrl);
      project.stats = stats;
      project.lastSyncedAt = new Date();
      await this.repo.save(p.category, p.subCategory, p.slug, project);
    } catch (err) {
      console.warn(`Failed to sync ${project.title}:`, err);
    }
  }
}
