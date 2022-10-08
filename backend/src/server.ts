import Fastify, { FastifyInstance } from 'fastify';
import FastifyCors from '@fastify/cors';
import { router } from './routes/router.js';

class Server {
  app: FastifyInstance;

  constructor() {
    this.app = Fastify({ logger: true });
    this.config();
    this.start();
  }

  config(): void {
    this.app.register(router.routes);
    this.app.register(FastifyCors, {
      origin: '*',
      methods: ['POST', 'GET'],
    });
  }

  start(): void {
    try {
      this.app.listen({ port: 3030 });
    } catch (error) {
      this.app.log.error(error);
    }
  }
}

const server = new Server();
