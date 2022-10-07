import { model } from '../model/model.new.js';

class Controller {
  // Attributes
  #gamePattern: Array<string> = [];
  #userPattern: Array<string> = [];
  colors: Array<string> = ['green', 'red', 'blue', 'yellow'];
  #currentLevel: number = 1;
  #currentTimeout: number = 1200;
  #isUserTurn: boolean = false;

  // Functions
  handlePanelClick: Function;
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
    this.handlePanelClick = (button: HTMLElement): void => {
      if (this.#isUserTurn && this.#gamePattern.length != this.#userPattern.length) {
        if (button.dataset.value) {
          // Play confirmation sound
          const audio = new Audio('/lib/sounds/ping_confirmation.mp3');
          audio.play();

          // animate button
          button.classList.add('panel-button--animated');
          this.#userPattern.push(button.dataset.value);

          setTimeout(() => {
            button.classList.remove('panel-button--animated');
          }, this.#currentTimeout / 2);

          // Validate user entry
          const isCorrect = this.#compareLastIndex();

          if (isCorrect && this.#gamePattern.length === this.#userPattern.length) {
            // Continue to the next level
            const audio = new Audio('/lib/sounds/next_level.mp3');
            audio.play();

            setTimeout(() => {
              this.#currentLevel++;
              this.#generateNewLevel();
            }, 1000);
          } else if (!isCorrect) {
            // End level
            const audio = new Audio('/lib/sounds/wrong answer.mp3');
            audio.play();
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

        setTimeout(() => {
          panelItem.classList.remove('panel-button--animated');
        }, this.#currentTimeout / 2);
      }
    };

    // Generate a single step
    this.#generateStep = (remaining: number): void => {
      // Get random color and play color audio
      const randomColor = this.colors[this.#randomColorIndex()];
      const audio = new Audio(`/lib/sounds/${randomColor}.mp3`);
      this.#gamePattern.push(randomColor);
      this.#handleStepAnimation(randomColor);
      audio.play();

      // Recursively iterate
      if (--remaining) {
        setTimeout(() => {
          this.#generateStep(remaining);
        }, this.#currentTimeout);
      } else {
        // Play your turn audio
        setTimeout(() => {
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
    this.start = (timeout: number): void => {
      this.#reset();
      this.#generateNewLevel();
    };
  }
}

export const controller = new Controller();