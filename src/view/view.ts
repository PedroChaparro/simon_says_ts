import { gameScore } from 'model/interfaces.js';
import {
  controller_start,
  controller_updateUserPattern,
  controller_SaveResult,
  controller_updateMinScore,
} from '../controller/controller.js';

// Dom selectors
export const startBtn: HTMLButtonElement | null = document.querySelector('button#start-game');

export const greenBtn: HTMLDivElement | null = document.querySelector('div#green-button');
export const redBtn: HTMLDivElement | null = document.querySelector('div#red-button');
export const yellowBtn: HTMLDivElement | null = document.querySelector('div#yellow-button');
export const blueBtn: HTMLDivElement | null = document.querySelector('div#blue-button');

export const usernameContainer: HTMLDivElement | null =
  document.querySelector('div.diffuser-player');
const usernameBtn: HTMLButtonElement | null = document.querySelector('button#button-username');
const usernameInput: HTMLInputElement | null = document.querySelector('input#username');

const difficultyContainer: HTMLDivElement | null =
  document.querySelector('div.diffuser-difficulty');
const easyDiff: HTMLButtonElement | null = document.querySelector('button#button-easy');
const normalDiff: HTMLButtonElement | null = document.querySelector('button#button-normal');
const hardDiff: HTMLButtonElement | null = document.querySelector('button#button-hard');

export const scoresTableBody: HTMLElement | null = document.getElementById('scores-body');

// Events
if (
  startBtn &&
  greenBtn &&
  redBtn &&
  yellowBtn &&
  blueBtn &&
  easyDiff &&
  normalDiff &&
  hardDiff &&
  difficultyContainer &&
  usernameContainer &&
  usernameBtn &&
  usernameInput &&
  scoresTableBody
) {
  // Update min score
  controller_updateMinScore();

  // Buttons array
  const panel_buttons: Array<HTMLDivElement> = [greenBtn, redBtn, yellowBtn, blueBtn];
  const diff_buttons: Array<HTMLButtonElement> = [easyDiff, normalDiff, hardDiff];

  // Start button
  startBtn.addEventListener('click', () => {
    // Show difficulty selector
    difficultyContainer.classList.add('diffuser-difficulty--active');
    startBtn.disabled = true; // Disable button
  });

  panel_buttons.forEach((button: HTMLDivElement) => {
    button.addEventListener('click', (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLDivElement) {
        if (target.dataset.value) controller_updateUserPattern(target.dataset.value);
      }
    });
  });

  diff_buttons.forEach((button: HTMLButtonElement) => {
    button.addEventListener('click', (e: Event) => {
      // Hide difficulty selector
      difficultyContainer.classList.remove('diffuser-difficulty--active');

      const target = e.target;
      if (target instanceof HTMLButtonElement) {
        if (target.dataset.delay) controller_start(parseInt(target.dataset.delay));
      }
    });
  });

  usernameBtn.addEventListener('click', () => {
    // Sanitize input
    usernameInput.value = usernameInput.value.trim().replace(/\s\s+/g, ' ');

    // Verify input
    if (usernameInput.value.length < 3) {
      alert('Username must have at least 3 chars');
    } else {
      controller_SaveResult(usernameInput.value);
      usernameContainer.classList.remove('diffuser-player--active');
    }
  });

  // Play with keyboard
  document.addEventListener('keypress', (e: KeyboardEvent) => {
    const pressedKey = e.key;

    switch (pressedKey) {
      case 'w':
        controller_updateUserPattern('green');
        break;
      case 'a':
        controller_updateUserPattern('red');
        break;
      case 's':
        controller_updateUserPattern('yellow');
        break;
      case 'd':
        controller_updateUserPattern('blue');
        break;
      default:
        console.warn('Not supported key');
        break;
    }
  });
} else {
  console.error('Some selector was unaccesible');
}

export const updateTableUI = (scores: Array<gameScore>) => {
  if (scoresTableBody) {
    // Clear current content
    scoresTableBody.innerHTML = '';

    scores.forEach((score) => {
      scoresTableBody.innerHTML += `
        <tr>
						<td>${score.username}</td>
						<td>${score.score}</td>
						<td>${score.difficulty}</td>
					</tr>
      `;
    });
  }
};
