import { IScore, IScoreFile } from '../interfaces/interfaces.js';
import { readFileSync, writeFileSync } from 'fs';

// Import path module on ESmodules
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Model {
  // *** *** ***
  // Functions
  #readFile: Function;
  getScores: Function;
  saveScore: Function;

  constructor() {
    this.#readFile = (): Array<IScore> => {
      const file = readFileSync(join(__dirname, '../data/scores.history.json'), {
        encoding: 'utf-8',
      });
      const scores: IScoreFile = JSON.parse(file);
      return scores.scores;
    };

    this.getScores = (): Array<IScore> => {
      return this.#readFile();
    };

    this.saveScore = (score: IScore): boolean => {
      let currentScores: Array<IScore> = this.#readFile();
      currentScores.push(score);

      // Sort
      currentScores.sort((a, b) => a.score - b.score).reverse();
      if (currentScores.length > 10) currentScores = currentScores.slice(0, 10);

      // Write file
      try {
        writeFileSync(
          join(__dirname, '../data/scores.history.json'),
          JSON.stringify({ scores: currentScores }, null, 2),
        );
        return true;
      } catch (error) {
        return false;
      }
    };
  }
}

export const model = new Model();
