import { controller_start, controller_updateUserPattern } from '../controller/controller.js';

// Dom selectors
const startBtn: HTMLButtonElement | null = document.querySelector('button#start-game');

export const greenBtn: HTMLDivElement | null = document.querySelector('div#green-button');
export const redBtn: HTMLDivElement | null = document.querySelector('div#red-button');
export const yellowBtn: HTMLDivElement | null = document.querySelector('div#yellow-button');
export const blueBtn: HTMLDivElement | null = document.querySelector('div#blue-button');

const difficultyContainer: HTMLDivElement | null =
	document.querySelector('div.diffuser-difficulty');
const easyDiff: HTMLButtonElement | null = document.querySelector('button#button-easy');
const normalDiff: HTMLButtonElement | null = document.querySelector('button#button-normal');
const hardDiff: HTMLButtonElement | null = document.querySelector('button#button-hard');

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
	difficultyContainer
) {
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
				if (target.dataset.delay) controller_start(target.dataset.delay);
			}
		});
	});
} else {
	console.error('Some selector was unaccesible');
}
