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
  #handleStepAnimation: Function;
  #generateNewLevel: Function;
  #generateStep: Function;
  #reset: Function;
  #randomColorIndex: Function;
  #compareLastIndex: Function;
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

    // Click event handler
    this.handlePanelClick = async (button: HTMLElement): Promise<void> => {
      if (this.#isUserTurn && this.#gamePattern.length !== this.#userPattern.length) {
        if (button.dataset.value) {
          // Play confirmation sound
          const audio = new Audio('/lib/sounds/ping_confirmation.mp3');
          audio.play();

          // animate button
          button.classList.add('panel-button--animated');
          this.#userPattern.push(button.dataset.value);

          window.setTimeout(() => {
            button.classList.remove('panel-button--animated');
          }, this.#currentTimeout / 2);

          // *** *** ***
          // Validate user entry
          const isCorrect = this.#compareLastIndex();

          if (isCorrect && this.#gamePattern.length === this.#userPattern.length) {
            // Continue to the next level
            const audio = new Audio('/lib/sounds/next_level.mp3');
            audio.play();

            window.setTimeout(() => {
              this.#currentLevel++;
              //console.log('Aumentado a: ', this.#currentLevel)
              this.#generateNewLevel();
            }, 1000);
          } else if (!isCorrect) {
            // End level
            const audio = new Audio('/lib/sounds/wrong answer.mp3');
            audio.play();

            // Show username dialog as needed
            const scores: Array<Iscore> = await this.Model.getCurrentScores();
            const minScore: number = scores[scores.length - 1].score;

            if (scores.length < 10 || this.#currentLevel > minScore) {
              document
                .querySelector('div.diffuser-player')
                ?.classList.add('diffuser-player--active');
            } else {
              this.#reset();
              // Unlock start button
              const startButton: HTMLButtonElement | null =
                document.querySelector('button#start-game');

              if (startButton) {
                startButton.disabled = false;
              }
            }
          }
        }
      }
    };

    //  Handle username when game finish
    this.handleUsernameField = (username: string): void => {
      const scoreObject: Iscore = {
        username,
        score: this.#currentLevel,
        difficulty: 'Unknown',
      };

      if (this.#currentTimeout === 1500) {
        scoreObject.difficulty = 'Easy';
      } else if (this.#currentLevel === 800) {
        scoreObject.difficulty = 'Normal';
      } else {
        scoreObject.difficulty = 'Easy';
      }

      this.Model.saveNewScore(scoreObject);
      this.#reset();
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
        // Play your turn audio
        window.setTimeout(() => {
          const audio = new Audio('/lib/sounds/your_turn.mp3');
          audio.play();
        }, 500);

        this.#isUserTurn = true;
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
      this.#generateNewLevel();
      this.#currentTimeout = delay;
    };
  }
}

export const controller = new Controller();
