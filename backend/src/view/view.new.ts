import { model } from '../model/model.new.js';
import { controller } from '../controller/controller.new.js';

class View {
  Controller = controller;

  constructor() {
    // *** *** ***
    // Event listeners
    document.getElementById('green-button')?.addEventListener('click', (e) => {
      this.Controller.handlePanelClick('green');
    });

    document.getElementById('red-button')?.addEventListener('click', (e) => {
      this.Controller.handlePanelClick('red');
    });

    document.getElementById('blue-button')?.addEventListener('click', (e) => {
      this.Controller.handlePanelClick('blue');
    });

    document.getElementById('yellow-button')?.addEventListener('click', (e) => {
      this.Controller.handlePanelClick('yellow');
    });

    // *** *** ***
    // Play with arrows

    document.addEventListener('keypress', (e: KeyboardEvent) => {
      const key = e.key;

      switch (key) {
        case 'w':
          this.Controller.handlePanelClick('green');
          break;
        case 'a':
          this.Controller.handlePanelClick('red');
          break;
        case 's':
          this.Controller.handlePanelClick('yellow');
          break;
        case 'd':
          this.Controller.handlePanelClick('blue');
          break;
      }
    });

    // *** *** ***
    // Show table on load
    window.addEventListener('load', () => {
      this.Controller.drawTable();
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

    // Username field
    document.getElementById('button-username')?.addEventListener('click', (e) => {
      // Get input value and sanitize it
      const usernameInput: HTMLInputElement | null = document.querySelector('input#username');

      if (usernameInput) {
        // "Sanitize"
        usernameInput.value = usernameInput.value.trim().replace(/\s\s+/g, ' ');

        // Validate
        if (usernameInput.value.length < 3) {
          alert('Username must have at least 3 chars');
        } else {
          this.Controller.handleUsernameField(usernameInput.value);
        }

        // Hide modal
        document.querySelector('div.diffuser-player')?.classList.remove('diffuser-player--active');
      }
    });
  }
}

export const view = new View();
