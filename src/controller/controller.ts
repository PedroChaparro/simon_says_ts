import { gameScore } from '../model/interfaces.js';
import { colors, min_score, addScore, gamesScores } from '../model/model.js';
import {
	startBtn,
	greenBtn,
	redBtn,
	yellowBtn,
	blueBtn,
	usernameContainer,
	scoresTableBody,
} from '../view/view.js';

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
			const audio = new Audio(`lib/sounds/${random}.mp3`);
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
					const audio = new Audio('lib/sounds/your_turn.mp3');
					audio.play();
				}, 500);
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

export function controller_updateScoresTable(): void {
	if (scoresTableBody) {
		scoresTableBody.innerHTML = '';

		gamesScores.forEach((score: gameScore) => {
			if (scoresTableBody) {
				scoresTableBody.innerHTML += `
					<tr>
						<td>${score.user}</td>
						<td>${score.score}</td>
						<td>${score.difficulty}</td>
					</tr>
				`;
			}
		});
	}
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

		// Animate panel
		animate_panel_option(userSelection);

		if (correct && gamePattern.length === userPattern.length) {
			// Continue to the next lvl
			currentLvl++;
			create_lvl(currentLvl);
		} else if (!correct) {
			// Play loose audio
			const audio = new Audio('lib/sounds/wrong answer.mp3');
			audio.play();
			userTurn = false;

			// Add to local storage (As needed)
			if ((currentLvl > min_score || gamesScores.length < 10) && currentLvl > 1) {
				usernameContainer?.classList.add('diffuser-player--active');
			}

			// Allow start a new game
			if (startBtn) startBtn.disabled = false;
		}
	}
}

export function controller_addToLS(username: string): void {
	const record: gameScore = {
		user: username,
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

	addScore(record);
	controller_updateScoresTable();
}
