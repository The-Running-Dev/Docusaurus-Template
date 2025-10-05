import { FastifyInstance } from 'fastify';
import { IConfigService } from '../repositories/interfaces';

/**
 * Registers authentication routes for Fastify
 * Endpoints:
 *   POST /api/auth/login
 *   POST /api/auth/refresh
 *   POST /api/auth/logout
 *   GET  /api/auth/me
 */
export async function registerAuthRoutes(app: FastifyInstance) {
  // POST /api/auth/login
  app.post('/auth/login', async (request, reply) => {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };
    const { DatabaseUserRepository } = await import(
      '../repositories/database-user-repository'
    );
    const { getService } = await import('../lib/di/index');
    const { SERVICE_TOKENS } = await import('../lib/di/tokens');
    const { signAccessToken, signRefreshToken } = await import(
      '../services/jwtService'
    );

    const configService = getService<IConfigService>(
      SERVICE_TOKENS.CONFIG_SERVICE
    );
    const userRepo = new DatabaseUserRepository(configService);
    const user = await userRepo.findByUsername(username);
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
    const valid = await userRepo.validatePassword(user, password);
    if (!valid) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
    // Issue tokens
    const accessToken = signAccessToken({
      sub: user.id,
      username: user.username,
      roles: user.roles
    });
    const refreshToken = signRefreshToken({ sub: user.id });
    // Set httpOnly cookie for refresh token
    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === 'production'
    });
    // Return access token in body (to be stored in memory on client)
    return reply.send({
      accessToken,
      user: { id: user.id, username: user.username, roles: user.roles }
    });
  });

  // POST /api/auth/refresh
  app.post('/auth/refresh', async (request, reply) => {
    const { verifyToken, signAccessToken } = await import(
      '../services/jwtService'
    );
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) {
      return reply.code(401).send({ message: 'Missing refresh token' });
    }
    const payload = verifyToken(refreshToken);
    if (!payload || !payload.sub) {
      return reply.code(401).send({ message: 'Invalid refresh token' });
    }

    // Fetch user to include full details in the new access token
    const { DatabaseUserRepository } = await import(
      '../repositories/database-user-repository'
    );
    const { getService } = await import('../lib/di/index');
    const { SERVICE_TOKENS } = await import('../lib/di/tokens');
    const configService = getService<IConfigService>(
      SERVICE_TOKENS.CONFIG_SERVICE
    );
    const userRepo = new DatabaseUserRepository(configService);
    const user = await userRepo.findById(payload.sub as string);

    if (!user) {
      return reply.code(401).send({ message: 'User not found' });
    }

    // Issue new access token with full user details
    const accessToken = signAccessToken({
      sub: user.id,
      username: user.username,
      roles: user.roles
    });
    return reply.send({ accessToken });
  });

  // POST /api/auth/logout
  app.post('/auth/logout', async (request, reply) => {
    // Clear refresh token cookie
    reply.clearCookie('refresh_token', { path: '/' });
    return reply.send({ message: 'Logged out' });
  });

  // GET /api/auth/me
  app.get('/auth/me', async (request, reply) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ message: 'Missing access token' });
    }
    const token = authHeader.slice(7);
    const { verifyToken } = await import('../services/jwtService');
    const payload = verifyToken(token);
    if (!payload || typeof payload !== 'object' || !('sub' in payload)) {
      return reply.code(401).send({ message: 'Invalid access token' });
    }
    // Return user info (minimal for now)
    return reply.send({
      user: {
        id: (payload as any).sub,
        username: (payload as any).username,
        roles: (payload as any).roles
      }
    });
  });
}
