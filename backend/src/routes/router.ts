import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions } from 'fastify';
import { controller } from '../controller/controller.js';

class Router {
  public routes: FastifyPluginCallback;

  constructor() {
    this.routes = function (fastify: FastifyInstance, options: FastifyPluginOptions, done) {
      // Get current scores
      fastify.get('/scores', controller.getScores);
      // Save a new score
      fastify.post('/score', controller.postScore);

      done();
    };
  }
}

export const router = new Router();
