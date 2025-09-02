# Product Requirements Document: Portfolio API with Dependency Injection

## Executive Summary

Transform the current file-based portfolio API into a production-grade system using dependency injection, database storage, and automated data synchronization. This will provide better scalability, maintainability, and real-time project statistics from external sources.

## Current State Analysis

- **Architecture**: Fastify API serving individual JSON files per project
- **Storage**: File system with complex nested directory structure
- **Data Sources**: Manual project data entry only
- **Scale**: ~100-200 projects expected
- **Use Cases**: Portfolio display, project management, CV data

## Goals & Objectives

### Primary Goals

1. **Scalability**: Move from file-based to database storage
2. **Maintainability**: Implement dependency injection for clean architecture
3. **Automation**: Auto-sync project metadata from GitHub/GitLab APIs
4. **Performance**: Fast API responses via JSON caching
5. **Flexibility**: Support multiple data sources and storage backends

### Success Metrics

- API response time < 100ms for all endpoints
- Support for 500+ projects without performance degradation
- 99% uptime for automated sync jobs
- Zero manual intervention needed for project updates

## Features & Requirements

### Feature 1: Dependency Injection Framework

**Priority**: High | **Complexity**: Medium | **Timeline**: 2-3 hours

#### Requirements

- Lightweight DI container supporting singleton and transient lifetimes
- Service registration and resolution
- Environment-based configuration
- Interface-based abstractions

#### Acceptance Criteria

- [ ] DI container implemented with type safety
- [ ] Repository pattern interfaces defined
- [ ] Service registration working in main application
- [ ] Can switch between implementations via environment variables

#### Technical Details

```typescript
interface IDIContainer {
  register<T>(token: string, implementation: T): void;
  resolve<T>(token: string): T;
}
```

---

### Feature 2: Repository Pattern Implementation

**Priority**: High | **Complexity**: Medium | **Timeline**: 3-4 hours

#### Requirements

- Abstract repository interfaces for all data operations
- JSON file repository (current behavior)
- Database repository (new implementation)
- Consistent API across all implementations

#### Acceptance Criteria

- [ ] `IProjectRepository` interface defined
- [ ] `DatabaseProjectRepository` provides database-backed storage
- [ ] `DatabaseProjectRepository` provides same API with DB backend
- [ ] Repository switching doesn't break existing API contracts

#### Technical Details

```typescript
interface IProjectRepository {
  getAll(): Promise<Category[]>;
  getById(
    category: string,
    subCategory: string,
    slug: string
  ): Promise<Project | null>;
  save(
    category: string,
    subCategory: string,
    slug: string,
    project: Project
  ): Promise<Project>;
  delete(category: string, subCategory: string, slug: string): Promise<void>;
}
```

---

### Feature 3: Database Integration

**Priority**: High | **Complexity**: High | **Timeline**: 4-5 hours

#### Requirements

- TypeORM integration with PostgreSQL/SQLite support
- Project entity with proper relationships
- Migration system for existing JSON data
- Database connection management

#### Acceptance Criteria

- [ ] TypeORM configured with connection pooling
- [ ] Project entity supports all current fields
- [ ] Migration script converts JSON files to database
- [ ] Database operations are transactional
- [ ] Support for multiple database types

#### Technical Details

- Database: PostgreSQL (primary), SQLite (development)
- ORM: TypeORM with decorators
- Migrations: Automated from JSON files

---

### Feature 4: JSON Cache Layer

**Priority**: Medium | **Complexity**: Low | **Timeline**: 2 hours

#### Requirements

- Write-through cache generating JSON after database updates
- Fast read operations serving pre-generated JSON
- Cache invalidation on data changes
- Multiple JSON format support

#### Acceptance Criteria

- [ ] JSON cache regenerates after every write operation
- [ ] GET operations serve cached JSON files
- [ ] Cache invalidation is atomic with database operations
- [ ] Support for different JSON formats (public/admin)

#### Technical Details

```typescript
interface ICacheService {
  regenerateCache(): Promise<void>;
  getCachedData(): Promise<string>;
  invalidateCache(): Promise<void>;
}
```

---

### Feature 5: GitHub Integration Service

**Priority**: Medium | **Complexity**: Medium | **Timeline**: 3-4 hours

#### Requirements

- GitHub API integration for repository statistics
- Support for multiple Git providers (GitHub, GitLab, Bitbucket)
- Rate limiting and error handling
- Configurable sync intervals

#### Acceptance Criteria

- [ ] GitHub API client with authentication
- [ ] Repository statistics extraction (stars, forks, last commit, etc.)
- [ ] Provider abstraction for multiple Git services
- [ ] Rate limiting prevents API quota exhaustion
- [ ] Graceful error handling for unavailable repositories

#### Technical Details

```typescript
interface IRepoProvider {
  getRepoStats(url: string): Promise<RepoStats>;
}

interface RepoStats {
  stars: number;
  forks: number;
  language: string;
  size: number;
  lastCommit: Date;
  openIssues: number;
}
```

---

### Feature 6: Automated Sync Scheduler

**Priority**: Medium | **Complexity**: Medium | **Timeline**: 2-3 hours

#### Requirements

- Cron job scheduling for automated updates
- Configurable sync intervals per project
- Batch processing with rate limiting
- Sync status tracking and logging

#### Acceptance Criteria

- [ ] Daily cron job syncs all enabled projects
- [ ] Individual project sync can be triggered manually
- [ ] Sync failures are logged and retried
- [ ] Sync status visible in admin interface
- [ ] Configurable sync intervals (daily, weekly, disabled)

#### Technical Details

- Cron: node-cron for scheduling
- Rate limiting: 1 request per second to prevent API limits
- Logging: Structured logs with sync status

---

### Feature 7: Enhanced Data Schema

**Priority**: Low | **Complexity**: Low | **Timeline**: 1-2 hours

#### Requirements

- Extended project schema with auto-sync fields
- Metadata tracking (last synced, sync enabled)
- Statistics storage (GitHub stats, analytics)
- Backward compatibility with existing data

#### Acceptance Criteria

- [ ] Project schema includes sync metadata fields
- [ ] Auto-updated fields separated from user-managed fields
- [ ] Schema migration preserves existing data
- [ ] API responses include sync information

#### Technical Details

```typescript
interface ProjectExtended extends Project {
  repoUrl?: string;
  stats?: RepoStats;
  lastSyncedAt?: Date;
  syncEnabled: boolean;
  syncInterval: 'daily' | 'weekly' | 'disabled';
}
```

---

### Feature 8: API Route Refactoring

**Priority**: High | **Complexity**: Low | **Timeline**: 2 hours

#### Requirements

- Refactor existing routes to use DI container
- Maintain API compatibility
- Add new endpoints for sync operations
- Improve error handling

#### Acceptance Criteria

- [ ] All routes use injected repositories
- [ ] Existing API endpoints maintain same response format
- [ ] New sync endpoints added (/admin/sync, /admin/sync/:id)
- [ ] Consistent error responses across all endpoints

---

## Implementation Plan

### Phase 1: Foundation (6-8 hours)

1. Feature 1: Dependency Injection Framework
2. Feature 2: Repository Pattern Implementation
3. Feature 8: API Route Refactoring

### Phase 2: Data Layer (6-7 hours)

4. Feature 3: Database Integration
5. Feature 4: JSON Cache Layer
6. Feature 7: Enhanced Data Schema

### Phase 3: Automation (5-7 hours)

7. Feature 5: GitHub Integration Service
8. Feature 6: Automated Sync Scheduler

## Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Fastify API   │───▶│  DI Container    │───▶│   Repositories  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                          │
                       ┌──────────────────┐              ▼
                       │   Sync Service   │         ┌──────────┐
                       └──────────────────┘         │ Database │
                                │                   └──────────┘
                                ▼                         │
                       ┌──────────────────┐              ▼
                       │  GitHub/GitLab   │         ┌──────────┐
                       │      APIs        │         │JSON Cache│
                       └──────────────────┘         └──────────┘
```

## Risk Assessment

### High Risk

- **Database migration complexity**: Mitigation - Comprehensive testing and rollback plan
- **API rate limiting**: Mitigation - Implement exponential backoff and caching

### Medium Risk

- **Performance regression**: Mitigation - Load testing and monitoring
- **Breaking changes**: Mitigation - Maintain API compatibility layer

### Low Risk

- **Configuration complexity**: Mitigation - Environment-based defaults
- **Sync failures**: Mitigation - Retry mechanisms and alerting

## Dependencies

### New Package Dependencies

- `typeorm` - Database ORM
- `pg` - PostgreSQL driver
- `sqlite3` - SQLite driver (development)
- `node-cron` - Job scheduling
- `@octokit/rest` - GitHub API client
- `ioredis` - Redis client (future caching)

### Environment Variables

```bash
NODE_ENV=development|production
DATABASE_TYPE=postgres|sqlite
DATABASE_URL=postgresql://user:pass@host:port/db
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
SYNC_ENABLED=true|false
SYNC_INTERVAL=daily|weekly
ADMIN_TOKEN=secret_admin_token
```

## Success Criteria

### Performance

- API response time < 100ms (current: ~50ms)
- Support 500+ projects without degradation
- Sync job completes within 10 minutes

### Reliability

- 99% API uptime
- Zero data loss during migrations
- Graceful degradation when external APIs fail

### Maintainability

- Test coverage > 80%
- Clean architecture with proper separation of concerns
- Comprehensive error logging and monitoring

## Future Enhancements

### Phase 4: Advanced Features (Future)

- Redis caching layer
- GraphQL API alongside REST
- Real-time WebSocket updates
- Analytics and usage tracking
- Multi-tenant support
- API versioning strategy
