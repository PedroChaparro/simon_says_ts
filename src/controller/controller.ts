import { colors } from '../model/model.js';
import { startBtn, greenBtn, redBtn, yellowBtn, blueBtn } from '../view/view.js';

// **** **** ****
// **** Game variables ****
// **** **** ****

let userTurn = false;
let currentLvl = 0;
let currentDelay = 1000;
let gamePattern: Array<string> = [];
let userPattern: Array<string> = [];

// **** **** ****
// **** Panel ****
// **** **** ****

function getRandomColorIndex(): number {
	return Math.floor(Math.random() * 4);
}

export function controller_start(delay: number): void {
	// Reset values
	currentLvl = 1;
	userPattern = [];
	gamePattern = [];
	currentDelay = delay;

	create_lvl(currentLvl);
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
			const audio = new Audio(`lib/sounds/${random}.mp3`);
			audio.play();

			let lastAnimatedButton: HTMLDivElement | null;

			// Modify UI
			switch (random) {
				case 'green':
					greenBtn?.classList.add('panel-button--animated');
					lastAnimatedButton = greenBtn;
					break;
				case 'yellow':
					yellowBtn?.classList.add('panel-button--animated');
					lastAnimatedButton = yellowBtn;
					break;
				case 'blue':
					blueBtn?.classList.add('panel-button--animated');
					lastAnimatedButton = blueBtn;
					break;
				case 'red':
					redBtn?.classList.add('panel-button--animated');
					lastAnimatedButton = redBtn;
					break;
			}

			// Remove animation class
			setTimeout(() => {
				lastAnimatedButton?.classList.remove('panel-button--animated');
			}, currentDelay / 2);

			// Add to the game pattern
			gamePattern.push(random);

			// Recursively iterate
			if (--lvl) {
				animate(lvl, currentDelay);
			} else {
				userTurn = true;
			}
		}, timeout);
	})(lvl, 0);

	console.log('Game: ', gamePattern);
}

export function controller_updateUserPattern(userSelection: string): void {
	// Receive while lenghts are not equals
	if (userTurn && gamePattern.length !== userPattern.length) {
		userPattern.push(userSelection);

		const correct = compareLastIndex(gamePattern, userPattern);

		if (correct && gamePattern.length === userPattern.length) {
			// Continue to the next lvl
			currentLvl++;
			create_lvl(currentLvl);
		} else if (!correct) {
			// User loose
			const audio = new Audio('lib/sounds/wrong answer.mp3');
			audio.play();
			userTurn = false;

			// Allow start a new game
			if (startBtn) startBtn.disabled = false;
		}
	}
}

function compareLastIndex(gamePattern: Array<string>, userPattern: Array<string>): boolean {
	const min_i = Math.min(gamePattern.length, userPattern.length) - 1;
	return gamePattern[min_i] === userPattern[min_i];
}
