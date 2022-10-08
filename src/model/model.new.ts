import { Iscore } from '../interfaces/interfaces.js';

class Model {
  getCurrentScores: Function;
  saveNewScore: Function;
  getCurrentMinScore: Function;

  constructor() {
    this.getCurrentScores = async (): Promise<Array<Iscore>> => {
      const call = await fetch('http://localhost:3030/scores');
      const results = await call.json();
      return results.scores;
    };

    this.saveNewScore = async (score: Iscore): Promise<void> => {
      const call = await fetch('http://localhost:3030/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(score),
      });
    };

    this.getCurrentMinScore = async (): Promise<number> => {
      const call = await fetch('http://localhost:3030/scores');
      const response = await call.json();
      const scores: Array<Iscore> = response.scores;
      return scores[scores.length - 1].score;
    };
  }
}

export const model = new Model();
