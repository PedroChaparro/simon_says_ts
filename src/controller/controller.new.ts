import { model } from '../model/model.new.js';
import { Iscore } from '../interfaces/interfaces.js';

class Controller {
  // Attributes
  Model = model;
  #gamePattern: Array<string> = [];
  #userPattern: Array<string> = [];
  colors: Array<string> = ['green', 'red', 'blue', 'yellow'];
  #currentLevel: number = 1;
  #currentTimeout: number = 1200;
  #currentTimeover: number = -1;
  #isUserTurn: boolean = false;

  // Functions
  handlePanelClick: Function;
  handleUsernameField: Function;
  drawTable: Function;
  #handleStepAnimation: Function;
  #generateNewLevel: Function;
  #generateStep: Function;
  #reset: Function;
  #randomColorIndex: Function;
  #compareLastIndex: Function;
  #endGame: Function;
  start: Function;

  constructor() {
    this.#reset = (): void => {
      // Attributes (Default values)
      this.#gamePattern = [];
      this.#userPattern = [];
      this.#currentLevel = 1;
      this.#currentTimeout = 1200;
      this.#isUserTurn = false;
      this.#currentTimeover = -1;
    };

    this.#randomColorIndex = (): number => {
      let random = Math.floor(Math.random() * 4);

      // Dont use repeated colors
      if (this.#gamePattern.length != 0) {
        while (this.colors[random] === this.#gamePattern[this.#gamePattern.length - 1]) {
          random = Math.floor(Math.random() * 4);
        }
      }

      return random;
    };

    // Loose handler
    this.#endGame = async (): Promise<void> => {
      this.#isUserTurn = false;

      // Remove current timeout as needed
      if (this.#currentTimeover !== -1) window.clearTimeout(this.#currentTimeover);
      // Show username dialog as needed
      const scores: Array<Iscore> = await this.Model.getCurrentScores();
      const minScore: number = scores.length !== 0 ? scores[scores.length - 1].score : 1;
      if (scores.length < 10 || this.#currentLevel > minScore) {
        document.querySelector('div.diffuser-player')?.classList.add('diffuser-player--active');
      } else {
        this.#reset();
      }

      // Unlock start button
      const startButton: HTMLButtonElement | null = document.querySelector('button#start-game');

      if (startButton) {
        startButton.disabled = false;
      }
    };

    // Click event handler
    this.handlePanelClick = async (color: string): Promise<void> => {
      const button: HTMLElement | null = document.getElementById(`${color}-button`);

      if (button) {
        if (this.#isUserTurn && this.#gamePattern.length !== this.#userPattern.length) {
          if (button.dataset.value) {
            // Play confirmation sound
            const audio = new Audio('/lib/sounds/ping_confirmation.mp3');
            audio.play();

            // animate button
            button.classList.add('panel-button--animated');
            this.#userPattern.push(color);

            window.setTimeout(() => {
              button.classList.remove('panel-button--animated');
            }, this.#currentTimeout / 2);

            // *** *** ***
            // Validate user entry
            const isCorrect = this.#compareLastIndex();

            if (isCorrect && this.#gamePattern.length === this.#userPattern.length) {
              // Clear previous time limit
              if (this.#currentTimeover !== -1) window.clearTimeout(this.#currentTimeover);

              // Continue to the next level
              const audio = new Audio('/lib/sounds/next_level.mp3');
              audio.play();

              // Reset game array
              this.#gamePattern = [];
              this.#userPattern = [];

              window.setTimeout(() => {
                this.#currentLevel++;
                this.#generateNewLevel();
              }, 1000);
            } else if (!isCorrect) {
              // End level
              const audio = new Audio('/lib/sounds/wrong answer.mp3');
              audio.play();

              this.#endGame();
            }
          }
        }
      }
    };

    //  Handle username when game finish
    this.handleUsernameField = async (username: string): Promise<void> => {
      // console.log(this.#currentTimeout);

      const scoreObject: Iscore = {
        username,
        score: this.#currentLevel,
        difficulty: 'Unknown',
      };

      if (this.#currentTimeout === 1500) {
        scoreObject.difficulty = 'Easy';
      } else if (this.#currentTimeout === 800) {
        scoreObject.difficulty = 'Normal';
      } else {
        scoreObject.difficulty = 'Hard';
      }

      await this.Model.saveNewScore(scoreObject);
      this.drawTable();
      this.#reset();
    };

    // Draw / update scores table
    this.drawTable = async (): Promise<void> => {
      const tableBody: HTMLElement | null = document.getElementById('scores-body');

      if (tableBody) {
        const scores: Array<Iscore> = await this.Model.getCurrentScores();
        tableBody.innerHTML = '';

        scores.forEach((score) => {
          tableBody.innerHTML += `
	    <tr>
	      <td>${score.username}</td>
	      <td>${score.score}</td>
	      <td>${score.difficulty}</td>
	    </tr>
	  `;
        });
      }
    };

    // Compare last user patter index against game pattern
    this.#compareLastIndex = (): boolean => {
      //console.log(this.#gamePattern);
      //console.log(this.#userPattern);
      const lastIndex = this.#userPattern.length - 1;
      return this.#gamePattern[lastIndex] === this.#userPattern[lastIndex];
    };

    // Animate UI when a new level is being created
    this.#handleStepAnimation = (color: string): void => {
      const panelItem = document.getElementById(`${color}-button`);
      if (panelItem) {
        panelItem.classList.add('panel-button--animated');

        window.setTimeout(() => {
          panelItem.classList.remove('panel-button--animated');
        }, this.#currentTimeout / 2);
      }
    };

    // Generate a single step
    this.#generateStep = async (remaining: number): Promise<void> => {
      // Get random color and play color audio
      this.#isUserTurn = false;
      const randomColor = this.colors[this.#randomColorIndex()];
      const audio = new Audio(`/lib/sounds/${randomColor}.mp3`);
      this.#gamePattern.push(randomColor);
      this.#handleStepAnimation(randomColor);
      audio.play();

      if (--remaining) {
        window.setTimeout(() => {
          this.#generateStep(remaining);
        }, this.#currentTimeout);
      } else {
        this.#isUserTurn = true;

        // Play your turn audio
        window.setTimeout(() => {
          const audio = new Audio('/lib/sounds/your_turn.mp3');
          audio.play();
        }, 500);

        // Create new time limit
        this.#currentTimeover = window.setTimeout(() => {
          const audio = new Audio('/lib/sounds/timeover.mp3');
          audio.play();

          this.#endGame();
        }, this.#currentTimeout * this.#gamePattern.length + 2000);
      }
    };

    // Start a new level (First step of the level)
    this.#generateNewLevel = function (): void {
      this.#isUserTurn = false;
      this.#gamePattern = [];
      this.#userPattern = [];
      this.#generateStep(this.#currentLevel);
    };

    // Start a new game (From level 1)
    this.start = (delay: number): void => {
      this.#reset();
      this.#currentTimeout = delay;
      this.#generateNewLevel();
    };
  }
}

export const controller = new Controller();
