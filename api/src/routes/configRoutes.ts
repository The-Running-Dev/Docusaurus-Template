import { FastifyInstance } from 'fastify';
import { loadYaml, listAvailableKeys } from '../lib/loaders.js';
import { loadThemes } from '../lib/themes.js';
import { generateNav } from '../lib/nav.js';
import { getService, isContainerReady } from '../lib/di/index.js';
import { SERVICE_TOKENS } from '../lib/di/tokens.js';
import { IConfigService } from '../repositories/interfaces.js';

export async function registerConfigRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    const containerReady = isContainerReady();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      container: {
        ready: containerReady,
        services: containerReady ? getService<IConfigService>(SERVICE_TOKENS.CONFIG_SERVICE).isDevelopment() ? 'development' : 'production' : 'not-configured'
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
    try {
      const data = loadYaml(key as any);
      return data;
    } catch (err: any) {
      reply.code(err?.statusCode ?? 500);
      return { error: err?.message ?? 'Unknown error' };
    }
  });
}
