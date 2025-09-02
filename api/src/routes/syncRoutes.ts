import { FastifyInstance } from 'fastify';
import { getService } from '../lib/di/index';
import { SERVICE_TOKENS } from '../lib/di/tokens';
import { ISyncService, IConfigService } from '../repositories/interfaces';

export async function registerSyncRoutes(app: FastifyInstance) {
  const config = getService<IConfigService>(SERVICE_TOKENS.CONFIG_SERVICE);
  const sync = getService<ISyncService>(SERVICE_TOKENS.SYNC_SERVICE);

  app.post('/admin/sync', async (req, reply) => {
    const token = req.headers['authorization'];
    if (config.getAdminToken() && token !== `Bearer ${config.getAdminToken()}`) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
    await sync.syncAll();
    reply.send({ status: 'ok' });
  });

  app.post<{ Params: { id: string } }>('/admin/sync/:id', async (req, reply) => {
    const token = req.headers['authorization'];
    if (config.getAdminToken() && token !== `Bearer ${config.getAdminToken()}`) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    await sync.syncProject(id);
    reply.send({ status: 'ok' });
  });
}
