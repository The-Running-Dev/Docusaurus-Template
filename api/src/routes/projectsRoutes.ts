import { FastifyInstance } from 'fastify';
import { getService } from '../lib/di/index';
import { SERVICE_TOKENS } from '../lib/di/tokens';
import {
  IProjectRepository,
  ICacheService,
  IConfigService
} from '../repositories/interfaces';
import { slugify } from '../lib/projectsStore';
import { verifyToken } from '../services/jwtService';

function requireAdmin(req: any, configService: IConfigService) {
  // First try JWT Bearer token authentication
  const authHeader = req.headers['authorization'] as string | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwtToken = authHeader.slice(7);
    try {
      const payload = verifyToken(jwtToken);
      if (payload && typeof payload === 'object' && 'roles' in payload) {
        const roles = (payload as any).roles;
        if (roles && Array.isArray(roles) && roles.includes('admin')) {
          return true;
        }
      }
    } catch (_error) {
      // JWT verification failed, fall through to x-admin-token check
    }
  }

  // Fallback to legacy x-admin-token authentication
  const token = configService.getAdminToken();
  const provided = req.headers['x-admin-token'] as string | undefined;

  // If no token configured, allow local use (development mode)
  if (!token && configService.isDevelopment()) {
    return true;
  }

  if (!token || !provided || provided !== token) {
    const err: any = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }

  return true;
}

export async function registerProjectsRoutes(app: FastifyInstance) {
  // Resolve services from DI container
  const projectRepo = getService<IProjectRepository>(
    SERVICE_TOKENS.PROJECT_REPOSITORY
  );
  const cacheService = getService<ICacheService>(SERVICE_TOKENS.CACHE_SERVICE);
  const configService = getService<IConfigService>(
    SERVICE_TOKENS.CONFIG_SERVICE
  );

  // Combined nested structure (preferred for client)
  app.get('/v1/projects', async () => {
    if (configService.isCacheEnabled()) {
      const cached = await cacheService.getCachedProjects();
      if (cached.length) {
        return cached;
      }
    }

    const projects = await projectRepo.getAll();

    if (configService.isCacheEnabled()) {
      await cacheService.setCachedProjects(projects);
    }

    return projects;
  });

  // Flat list with metadata
  app.get('/v1/projects/raw', async () => {
    return await projectRepo.getFlat();
  });

  // Get specific project
  app.get('/v1/projects/:category/:sub/:slug', async (req, reply) => {
    const { category, sub, slug } = req.params as any;
    const data = await projectRepo.getById(category, sub, slug);
    if (!data) {
      return reply.code(404).send({ error: 'Project not found' });
    }
    return data;
  });

  // Create/update project
  app.put('/v1/projects/:category/:sub/:slug?', async (req, reply) => {
    try {
      requireAdmin(req, configService);

      const { category, sub, slug } = req.params as any;
      const body = req.body as any;
      const effectiveSlug = slug ? slug : slugify(body?.title || 'project');

      const saved = await projectRepo.save(category, sub, effectiveSlug, body);

      // Regenerate cache after successful save
      if (configService.isCacheEnabled()) {
        await cacheService.regenerateCache();
      }

      return {
        success: true,
        slug: effectiveSlug,
        data: saved
      };
    } catch (err: any) {
      return reply.code(err?.statusCode ?? 400).send({
        error: err.message
      });
    }
  });

  // Delete project
  app.delete('/v1/projects/:category/:sub/:slug', async (req, reply) => {
    try {
      requireAdmin(req, configService);

      const { category, sub, slug } = req.params as any;

      // Check if project exists before deletion
      const exists = await projectRepo.exists(category, sub, slug);
      if (!exists) {
        return reply.code(404).send({ error: 'Project not found' });
      }

      await projectRepo.delete(category, sub, slug);

      // Regenerate cache after successful deletion
      if (configService.isCacheEnabled()) {
        await cacheService.regenerateCache();
      }

      return { success: true };
    } catch (err: any) {
      return reply.code(err?.statusCode ?? 400).send({
        error: err.message
      });
    }
  });

  // Additional endpoints for enhanced functionality

  // Get project statistics
  app.get('/v1/projects/stats', async () => {
    const total = await projectRepo.count();
    const flat = await projectRepo.getFlat();

    const categories = new Set(flat.map((p) => p.category)).size;
    const subCategories = new Set(
      flat.map((p) => `${p.category}/${p.subCategory}`)
    ).size;

    return {
      totalProjects: total,
      categories,
      subCategories
    };
  });

  // Search projects
  app.get('/v1/projects/search', async (req, reply) => {
    const { q } = req.query as any;

    if (!q || typeof q !== 'string') {
      return reply.code(400).send({ error: 'Query parameter "q" is required' });
    }

    // Use repository search method if available
    if ('search' in projectRepo && typeof projectRepo.search === 'function') {
      const results = await (projectRepo as any).search(q);
      return { query: q, results };
    }

    // Fallback: search in flat list
    const flat = await projectRepo.getFlat();
    const searchTerm = q.toLowerCase();
    const results = flat.filter(
      ({ project }) =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.summary.toLowerCase().includes(searchTerm) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );

    return { query: q, results };
  });

  // Get projects by category
  app.get('/v1/projects/category/:category', async (req, _reply) => {
    const { category } = req.params as any;

    if (
      'getByCategory' in projectRepo &&
      typeof projectRepo.getByCategory === 'function'
    ) {
      const results = await (projectRepo as any).getByCategory(category);
      return { category, results };
    }

    // Fallback: filter flat list
    const flat = await projectRepo.getFlat();
    const results = flat.filter((p) => p.category === category);
    return { category, results };
  });
}

// Draft endpoints
export async function registerDraftRoutes(app: FastifyInstance) {
  // List all drafts
  app.get('/v1/projects/drafts', async () => {
    // TODO: Fetch all projects where draft === true
    return [];
  });

  // Save or update a draft
  app.post('/v1/projects/drafts', async (request, reply) => {
    // TODO: Save draft project to backend
    reply.code(201).send({ message: 'Draft saved' });
  });

  // Approve/publish a draft
  app.post('/v1/projects/drafts/approve', async (request, reply) => {
    // TODO: Mark draft as published
    reply.send({ message: 'Draft approved' });
  });

  // Delete a draft
  app.delete('/v1/projects/drafts/:id', async (request, reply) => {
    // TODO: Delete draft by ID
    reply.send({ message: 'Draft deleted' });
  });

  // Activity log endpoint
  app.get('/v1/activity-log', async (req, reply) => {
    try {
      const configService = getService<IConfigService>(
        SERVICE_TOKENS.CONFIG_SERVICE
      );
      requireAdmin(req, configService);

      // TODO: Return recent activity events from actual storage
      // For now, return mock data to fix the 404 error
      return [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          action: 'project_created',
          user: 'admin',
          details: 'Project created successfully'
        }
      ];
    } catch (err: any) {
      return reply.code(err?.statusCode ?? 401).send({
        error: err.message
      });
    }
  });
}
