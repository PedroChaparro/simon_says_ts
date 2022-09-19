import { colors } from '../model/model.js';
//import { greenBtn, redBtn, yellowBtn, blueBtn } from '../view/view.js';

// **** **** ****
// **** Game variables ****
// **** **** ****

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

	(function animate(lvl, timeout) {
		setTimeout(function () {
			// Get random color
			const random = colors[getRandomColorIndex()];
			// Play the color
			const audio = new Audio(`lib/sounds/${random}.mp3`);
			audio.play();
			// Add to the game pattern
			gamePattern.push(random);
			// Recursively iterate
			if (--lvl) animate(lvl, currentDelay);
		}, timeout);
	})(lvl, 0);

	console.log('Game: ', gamePattern);
}

export function controller_updateUserPattern(userSelection: string): void {
	// Receive while lenghts are not equals
	if (gamePattern.length !== userPattern.length) {
		userPattern.push(userSelection);

		// Verify lenght after push
		if (gamePattern.length === userPattern.length) {
			const correct = conparePatterns(gamePattern, userPattern);

			if (correct) {
				// Continue to the next lvl
				currentLvl++;
				create_lvl(currentLvl);
			} else {
				// User loose
				const audio = new Audio('lib/sounds/wrong answer.mp3');
				audio.play();
			}
		}
	}
}

export function conparePatterns(gamePattern: Array<string>, userPattern: Array<string>): boolean {
	let correct = true;

	for (let i = 0; i < gamePattern.length; i++) {
		if (gamePattern[i] !== userPattern[i]) {
			correct = false;
			break;
		}
	}

	return correct;
}
