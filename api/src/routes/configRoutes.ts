import { FastifyInstance } from 'fastify';
import { loadYaml, listAvailableKeys } from '../lib/loaders';
import { loadThemes } from '../lib/themes';
import { generateNav } from '../lib/nav';
import { getService, isContainerReady } from '../lib/di/index';
import { SERVICE_TOKENS } from '../lib/di/tokens';
import { IConfigService } from '../repositories/interfaces';

export async function registerConfigRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    const containerReady = isContainerReady();

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      container: {
        ready: containerReady,
        services: containerReady
          ? getService<IConfigService>(
              SERVICE_TOKENS.CONFIG_SERVICE
            ).isDevelopment()
            ? 'development'
            : 'production'
          : 'not-configured'
      }
    };

    return health;
  });

  app.get('/v1', async () => ({
    version: 'v1',
    resources: [
      '/api/v1/themes',
      '/api/v1/nav',
      ...listAvailableKeys().map((k) => `/api/v1/${k}`)
    ]
  }));

  app.get('/v1/themes', async () => ({
    themes: loadThemes(),
    defaultTheme: loadThemes()[0]?.name ?? null
  }));

  app.get('/v1/nav', async () => generateNav());

  app.get('/v1/:key', async (req, reply) => {
    const { key } = req.params as { key: string };

    // Exclude project-related routes to avoid conflicts
    if (key === 'projects' && req.url.includes('/')) {
      // This is a project sub-route, not a config key
      reply.code(404);
      return { error: 'Route not found' };
    }

    // Exclude specific routes that should be handled by other route handlers
    const excludedKeys = ['activity-log', 'drafts'];
    if (excludedKeys.includes(key)) {
      reply.code(404);
      return { error: 'Route not found' };
    }

    try {
      const data = loadYaml(key as any);
      return data;
    } catch (err: any) {
      reply.code(err?.statusCode ?? 500);
      return { error: err?.message ?? 'Unknown error' };
    }
  });
}
