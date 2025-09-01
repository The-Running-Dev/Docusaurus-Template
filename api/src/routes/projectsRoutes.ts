import { FastifyInstance } from 'fastify';
import { getService } from '../lib/di/index.js';
import { SERVICE_TOKENS } from '../lib/di/tokens.js';
import { IProjectRepository, ICacheService, IConfigService } from '../repositories/interfaces.js';
import { slugify } from '../lib/projectsStore.js';

function requireAdmin(req: any, configService: IConfigService) {
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
  const projectRepo = getService<IProjectRepository>(SERVICE_TOKENS.PROJECT_REPOSITORY);
  const cacheService = getService<ICacheService>(SERVICE_TOKENS.CACHE_SERVICE);
  const configService = getService<IConfigService>(SERVICE_TOKENS.CONFIG_SERVICE);

  // Combined nested structure (preferred for client)
  app.get('/v1/projects', async () => {
    return await projectRepo.getAll();
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
      
      // Invalidate cache after successful save
      if (configService.isCacheEnabled()) {
        await cacheService.invalidateCache('projects');
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
      
      // Invalidate cache after successful deletion
      if (configService.isCacheEnabled()) {
        await cacheService.invalidateCache('projects');
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
    
    const categories = new Set(flat.map(p => p.category)).size;
    const subCategories = new Set(flat.map(p => `${p.category}/${p.subCategory}`)).size;
    
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
    
    // If using JsonFileProjectRepository, use its search method
    if ('search' in projectRepo && typeof projectRepo.search === 'function') {
      const results = await (projectRepo as any).search(q);
      return { query: q, results };
    }
    
    // Fallback: search in flat list
    const flat = await projectRepo.getFlat();
    const searchTerm = q.toLowerCase();
    const results = flat.filter(({ project }) => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.summary.toLowerCase().includes(searchTerm) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    return { query: q, results };
  });

  // Get projects by category
  app.get('/v1/projects/category/:category', async (req, reply) => {
    const { category } = req.params as any;
    
    if ('getByCategory' in projectRepo && typeof projectRepo.getByCategory === 'function') {
      const results = await (projectRepo as any).getByCategory(category);
      return { category, results };
    }
    
    // Fallback: filter flat list
    const flat = await projectRepo.getFlat();
    const results = flat.filter(p => p.category === category);
    return { category, results };
  });
}

