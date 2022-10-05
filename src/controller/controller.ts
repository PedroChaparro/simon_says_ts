import { gameScore } from '../model/interfaces.js';
import { colors } from '../model/model.js';
import {
  updateTableUI,
  startBtn,
  greenBtn,
  redBtn,
  yellowBtn,
  blueBtn,
  usernameContainer,
} from '../view/view.js';

// **** **** ****
// **** Game variables ****
// **** **** ****

let userTurn = false;
let currentLvl = 0;
let currentDelay = 1000;
let currentTimeout: number;
let currentMinScore: number;
let gamePattern: Array<string> = [];
let userPattern: Array<string> = [];

// **** **** ****
// **** Panel ****
// **** **** ****

function getRandomColorIndex(): number {
  let random = Math.floor(Math.random() * 4);

  // Dont use repeated colors
  if (gamePattern.length !== 0) {
    do {
      random = Math.floor(Math.random() * 4);
    } while (colors[random] === gamePattern[gamePattern.length - 1]);
  }

  return random;
}

function compareLastIndex(gamePattern: Array<string>, userPattern: Array<string>): boolean {
  const min_i = Math.min(gamePattern.length, userPattern.length) - 1;
  return gamePattern[min_i] === userPattern[min_i];
}

function create_lvl(lvl: number): void {
  gamePattern = [];
  userPattern = [];
  userTurn = false;

  (function animate(lvl, timeout) {
    setTimeout(function () {
      // Get random color
      const random = colors[getRandomColorIndex()];

      // Play the color
      const audio = new Audio(`/public/lib/sounds/${random}.mp3`);
      audio.play();

      // Animate panel
      animate_panel_option(random);

      // Add to the game pattern
      gamePattern.push(random);

      // Recursively iterate
      if (--lvl) {
        animate(lvl, currentDelay);
      } else {
        userTurn = true;

        // Your turn audio
        setTimeout(() => {
          const audio = new Audio('/public/lib/sounds/your_turn.mp3');
          audio.play();
        }, 500);

        // Set current timeout (Max time limit)
        currentTimeout = setTimeout(() => {
          timeout_loose();
        }, currentDelay * gamePattern.length + 1500);
      }
    }, timeout);
  })(lvl, 0);

  console.log('Game: ', gamePattern);
}

function animate_panel_option(color: string): void {
  // Show animation
  let lastAnimatedButton: HTMLDivElement | null;

  switch (color) {
    case 'green':
      greenBtn?.classList.add('panel-button--animated');
      lastAnimatedButton = greenBtn;
      break;
    case 'red':
      redBtn?.classList.add('panel-button--animated');
      lastAnimatedButton = redBtn;
      break;
    case 'yellow':
      yellowBtn?.classList.add('panel-button--animated');
      lastAnimatedButton = yellowBtn;
      break;
    case 'blue':
      blueBtn?.classList.add('panel-button--animated');
      lastAnimatedButton = blueBtn;
      break;
  }

  // Remove animation class
  setTimeout(() => {
    if (lastAnimatedButton) lastAnimatedButton.classList.remove('panel-button--animated');
  }, currentDelay / 2);
}

function timeout_loose(): void {
  // Play loose audio
  const audio = new Audio('/public/lib/sounds/timeover.mp3');
  audio.play();
  userTurn = false;

  // Add to local storage (As needed)
  if (currentLvl > 1) {
    usernameContainer?.classList.add('diffuser-player--active');
  }

  // Allow start a new game
  if (startBtn) startBtn.disabled = false;
}

export function controller_updateScoresTable(): void {
  console.log('Update table');
}

export function controller_start(delay: number): void {
  // Reset values
  currentLvl = 1;
  userPattern = [];
  gamePattern = [];
  currentDelay = delay;
  console.log('Started');

  create_lvl(currentLvl);
}

export function controller_updateUserPattern(userSelection: string): void {
  // Receive while lenghts are not equals
  if (userTurn && gamePattern.length !== userPattern.length) {
    userPattern.push(userSelection);

    // Verify if is correct
    const correct = compareLastIndex(gamePattern, userPattern);

    // Sound
    const audio = new Audio('/public/lib/sounds/ping_confirmation.mp3');
    audio.play();

    // Animate panel
    animate_panel_option(userSelection);

    if (correct && gamePattern.length === userPattern.length) {
      // Continue to the next lvl
      currentLvl++;
      const audio = new Audio('/public/lib/sounds/next_level.mp3');
      audio.play();
      if (currentTimeout) clearTimeout(currentTimeout); // Clear max time timeout

      // Create the next level
      setTimeout(() => {
        create_lvl(currentLvl);
      }, 1000);
    } else if (!correct) {
      // Play loose audio
      clearTimeout(currentTimeout);
      const audio = new Audio('/public/lib/sounds/wrong answer.mp3');
      audio.play();
      userTurn = false;

      // Add to local storage (As needed)
      if (currentLvl > 1) {
        usernameContainer?.classList.add('diffuser-player--active');
      }

      // Allow start a new game
      if (startBtn) startBtn.disabled = false;
    }
  }
}

export async function controller_SaveResult(username: string): Promise<void> {
  const record: gameScore = {
    username: username,
    score: currentLvl,
    difficulty: '',
  };

  if (currentDelay === 1000) {
    record.difficulty = 'Normal';
  } else if (currentDelay === 1500) {
    record.difficulty = 'Easy';
  } else {
    record.difficulty = 'Hard';
  }

  // Fetch api to save the new result
  const response = await fetch('http://localhost:3030/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  const newScores = await response.json();

  // Update current min
  controller_updateMinScore();

  // Update UI table
  updateTableUI(newScores.scores);
}

export async function controller_updateMinScore(): Promise<void> {
  const results = await fetch('http://localhost:3030/scores');
  const resultsJson = await results.json();
  currentMinScore = resultsJson.scores[resultsJson.scores.length - 1].score || 1;
}
