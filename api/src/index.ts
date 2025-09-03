import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { registerConfigRoutes } from './routes/configRoutes';
import { registerProjectsRoutes } from './routes/projectsRoutes';
import { registerSyncRoutes } from './routes/syncRoutes';
import { configureContainer, getService } from './lib/di/index';
import { SERVICE_TOKENS } from './lib/di/tokens';
import { IConfigService } from './repositories/interfaces';

async function buildServer() {
  // Configure dependency injection container first
  console.log('Configuring DI container...');
  configureContainer();

  // Get configuration from DI container
  const configService = getService<IConfigService>(
    SERVICE_TOKENS.CONFIG_SERVICE
  );

  const BASE = configService.getBasePath();
  const CORS_ORIGIN = configService.getCorsOrigin();

  const app = Fastify({
    logger: configService.isDevelopment() ? true : false
  });

  await app.register(cors, {
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN
  });

  // Register cookie plugin for auth
  const cookie = (await import('@fastify/cookie')).default;
  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'changeme',
    parseOptions: {}
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Docusaurus Template Data API',
        version: '0.1.0'
      }
    }
  });
  await app.register(swaggerUi, { routePrefix: `${BASE}/docs` });

  // Group all API routes under BASE
  await app.register(
    async (instance) => {
      await registerConfigRoutes(instance);
      await registerProjectsRoutes(instance);
      await registerSyncRoutes(instance);
      const { registerAuthRoutes } = await import('./routes/authRoutes');
      await registerAuthRoutes(instance);
    },
    { prefix: BASE }
  );

  return app;
}

buildServer()
  .then(async (app) => {
    const configService = getService<IConfigService>(
      SERVICE_TOKENS.CONFIG_SERVICE
    );
    const PORT = configService.getPort();

    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(
      `🚀 API Server running on http://localhost:${PORT}${configService.getBasePath()}`
    );
    console.log(
      `📖 API Documentation available at http://localhost:${PORT}${configService.getBasePath()}/docs`
    );
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
