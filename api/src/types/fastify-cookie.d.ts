import 'fastify';
import { IncomingMessage, ServerResponse } from 'http';

declare module 'fastify' {
  interface FastifyRequest {
    cookies: Record<string, string>;
  }
  interface FastifyReply {
    setCookie(name: string, value: string, options?: any): void;
    clearCookie(name: string, options?: any): void;
  }
}
