// import { gameScore } from './interfaces';

// **** **** ****
// **** Panel ****
// **** **** ****

export const colors: Array<string> = ['green', 'red', 'yellow', 'blue'];

// **** **** ****
// **** LocalStorage ****
// **** **** ****

const gamesScores: string = localStorage.getItem('top') || '[]';
console.log(gamesScores);
