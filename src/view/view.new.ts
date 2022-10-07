import { model } from '../model/model.new.js';
import { controller } from '../controller/controller.new.js';

class View {
  Controller = controller;

  constructor() {
    // *** *** ***
    // Event listeners
    document.getElementById('green-button')?.addEventListener('click', (e) => {
      this.Controller.handlePanelClick(e.target);
    });

    document.getElementById('red-button')?.addEventListener('click', (e) => {
      this.Controller.handlePanelClick(e.target);
    });

    document.getElementById('blue-button')?.addEventListener('click', (e) => {
      this.Controller.handlePanelClick(e.target);
    });

    document.getElementById('yellow-button')?.addEventListener('click', (e) => {
      this.Controller.handlePanelClick(e.target);
    });

    // Show difficulty selection modal
    document.querySelector('button#start-game')?.addEventListener('click', (e) => {
      const difficultyContainer = document.querySelector('div.diffuser-difficulty');

      const startButton: HTMLButtonElement | null = document.querySelector('button#start-game');

      if (difficultyContainer && startButton) {
        difficultyContainer.classList.add('diffuser-difficulty--active');
        startButton.disabled = true;
      }
    });

    // Select difficulty and start a new game
    document.getElementById('button-easy')?.addEventListener('click', (e) => {
      this.Controller.start(1500);

      document
        .querySelector('div.diffuser-difficulty')
        ?.classList.remove('diffuser-difficulty--active');
    });

    document.getElementById('button-normal')?.addEventListener('click', (e) => {
      this.Controller.start(800);

      document
        .querySelector('div.diffuser-difficulty')
        ?.classList.remove('diffuser-difficulty--active');
    });

    document.getElementById('button-hard')?.addEventListener('click', (e) => {
      this.Controller.start(400);

      document
        .querySelector('div.diffuser-difficulty')
        ?.classList.remove('diffuser-difficulty--active');
    });
  }
}

export const view = new View();
