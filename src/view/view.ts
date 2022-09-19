import { controller_start, controller_updateUserPattern } from '../controller/controller.js';

// Dom selectors
const startBtn: HTMLButtonElement | null = document.querySelector('button#start-game');

export const greenBtn: HTMLDivElement | null = document.querySelector('div#green-button');
export const redBtn: HTMLDivElement | null = document.querySelector('div#red-button');
export const yellowBtn: HTMLDivElement | null = document.querySelector('div#yellow-button');
export const blueBtn: HTMLDivElement | null = document.querySelector('div#blue-button');

// Events
if (startBtn && greenBtn && redBtn && yellowBtn && blueBtn) {
	// Buttons array
	const buttons: Array<HTMLElement> = [greenBtn, redBtn, yellowBtn, blueBtn];

	// Start button
	startBtn.addEventListener('click', () => {
		controller_start();
		startBtn.disabled = true; // Disable button
	});

	buttons.forEach((button) => {
		button.addEventListener('click', (e: Event) => {
			const target = e.target;
			if (target instanceof HTMLDivElement) {
				if (target.dataset.value) controller_updateUserPattern(target.dataset.value);
			}
		});
	});
} else {
	console.error('Some selector was unaccesible');
}
