#!/usr/bin/env tsx
/**
 * Import existing storage project files into the database.
 *
 * Usage:
 *   pnpm --dir api migrate:db
 */
import { DatabaseProjectRepository } from '../src/repositories/database-project-repository';
import { ConfigService } from '../src/services/configService';
import { getFlatFromStorage } from '../src/lib/projectsStore';
import type { FlatProject } from '../src/repositories/interfaces';

async function main() {
  const config = new ConfigService();
  const dbRepo = new DatabaseProjectRepository(config);

  // Get projects from storage files using the existing function
  const projects: FlatProject[] = getFlatFromStorage();
  await dbRepo.saveMany(projects);

  // Clean up datasource connection if available
  // @ts-ignore - accessing private field for cleanup
  const ds = dbRepo['dataSource'];
  if (ds) {
    await ds.destroy();
  }

  console.log(`Migrated ${projects.length} projects to database.`);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
