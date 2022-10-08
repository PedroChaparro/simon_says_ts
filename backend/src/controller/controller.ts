import { FastifyReply, FastifyRequest } from 'fastify';
import { IScore } from '../interfaces/interfaces.js';
import { model } from '../model/model.js';
class Controller {
  #Model = model;

  // Get current scores
  getScores = (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const scores = this.#Model.getScores();
      return reply.send({ error: false, message: 'OK', scores });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: false, message: 'Unexpected error' });
    }
  };

  // Save new score
  postScore = (
    // Validate body format
    request: FastifyRequest<{
      Body: IScore;
    }>,
    reply: FastifyReply,
  ) => {
    if (!request.body)
      return reply.code(400).send({ error: true, message: 'Json body was not provided' });

    // Get data from json body
    const { username, score, difficulty } = request.body;

    if (username && score && difficulty) {
      // Update json
      this.#Model.saveScore({ username, score, difficulty });
      const scores = this.#Model.getScores();

      // Send response
      return reply.send({ error: false, message: 'Score was added successfully', scores });
    } else {
      return reply.code(400).send({
        error: true,
        message: 'usename, score and difficulty are all required on json body',
      });
    }
  };
}

export const controller = new Controller();
