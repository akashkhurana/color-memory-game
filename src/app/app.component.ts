import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  themes = {
    colors: ['#FF0055', '#33FF57', '#3357FF', '#FFD700', '#FF33FF', '#00FFFF'],
    emojis: ['🎮', '🚀', '🌈', '💎', '🔥', '⚡'],
    cyber: ['◈', '⬡', '⌬', '⏣', '⎔', '✦'],
    abstract: ['●', '▲', '■', '◆', '★', '✚']
  };

  currentTheme: keyof typeof this.themes = 'colors';
  randomOrderedArray: { content: string; revealed: boolean; matched: boolean }[] = [];
  
  firstSelection: number | null = null;
  secondSelection: number | null = null;
  isProcessing = false;
  isPreloading = true;
  
  moves = 0;
  matches = 0;
  seconds = 60; // Start with 60 seconds
  timerInterval: any;
  isLowTime = false;

  bestMoves = Number(localStorage.getItem('bestMoves')) || 0;
  bestTime = Number(localStorage.getItem('bestTime')) || 0;

  constructor() {
    this.initGame();
  }

  setTheme(themeName: string) {
    this.currentTheme = themeName as keyof typeof this.themes;
    this.initGame();
  }

  initGame() {
    this.isPreloading = true;
    this.stopTimer();
    this.seconds = 60;
    this.isLowTime = false;
    
    const items = this.themes[this.currentTheme];
    const doubled = [...items, ...items];
    this.randomOrderedArray = doubled
      .sort(() => Math.random() - 0.5)
      .map(content => ({ content, revealed: false, matched: false }));
    
    this.moves = 0;
    this.matches = 0;
    this.firstSelection = null;
    this.secondSelection = null;
    this.isProcessing = false;

    // Simulate preloader delay
    setTimeout(() => this.isPreloading = false, 800);
  }

  startTimer() {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      this.seconds--;
      if (this.seconds <= 10) this.isLowTime = true;
      if (this.seconds <= 0) {
        this.stopTimer();
        this.handleWin(); // Or handleLoss
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  onClickOfBox(index: number): void {
    const selected = this.randomOrderedArray[index];
    if (this.isProcessing || selected.revealed || selected.matched || index === this.firstSelection) return;

    if (this.moves === 0 && this.firstSelection === null) {
      this.startTimer();
    }

    selected.revealed = true;

    if (this.firstSelection === null) {
      this.firstSelection = index;
    } else {
      this.secondSelection = index;
      this.moves++;
      this.checkMatch();
    }
  }

  checkMatch(): void {
    const first = this.randomOrderedArray[this.firstSelection!];
    const second = this.randomOrderedArray[this.secondSelection!];

    if (first.content === second.content) {
      first.matched = true;
      second.matched = true;
      this.matches++;
      this.resetSelections();
      
      if (this.matches === this.randomOrderedArray.length / 2) {
        this.handleWin();
      }
    } else {
      this.isProcessing = true;
      setTimeout(() => {
        first.revealed = false;
        second.revealed = false;
        this.resetSelections();
        this.isProcessing = false;
      }, 1000);
    }
  }

  handleWin() {
    this.stopTimer();
    if (!this.bestMoves || this.moves < this.bestMoves) {
      this.bestMoves = this.moves;
      localStorage.setItem('bestMoves', String(this.moves));
    }
    if (!this.bestTime || this.seconds < this.bestTime) {
      this.bestTime = this.seconds;
      localStorage.setItem('bestTime', String(this.seconds));
    }
  }

  formatTime(s: number): string {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  resetSelections(): void {
    this.firstSelection = null;
    this.secondSelection = null;
  }
}
