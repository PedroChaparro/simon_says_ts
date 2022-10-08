import { FastifyReply, FastifyRequest } from 'fastify';

class Controller {
  // Get current scores
  getScores = (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ scores: [] });
  };

  // Save new score
  postScore = (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ scores: [] });
  };
}

export const controller = new Controller();
