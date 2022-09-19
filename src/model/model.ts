import { gameScore } from './interfaces';

// **** **** ****
// **** Panel ****
// **** **** ****
export const colors: Array<string> = ['green', 'red', 'yellow', 'blue'];

// **** **** ****
// **** LocalStorage ****
// **** **** ****

// Get localstorage on load
export let min_score = 0;
const ls_top = localStorage.getItem('top');
export let gamesScores: Array<gameScore> = []; // Parsed Local Storage

if (ls_top) {
	gamesScores = JSON.parse(ls_top);
	min_score = gamesScores[gamesScores.length - 1].score;
}

console.log(min_score);

export const addScore = (score: gameScore) => {
	// Add new score and sort
	gamesScores.push(score);

	gamesScores
		.sort((a: gameScore, b: gameScore) => {
			return a.score - b.score;
		})
		.reverse();

	console.log('Scores: ', gamesScores);

	// 10 Scores limit
	if (gamesScores.length > 10) {
		gamesScores = gamesScores.slice(0, 10);
	}

	// Update LS
	localStorage.setItem('top', JSON.stringify(gamesScores));
};
