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
  colors = ['#FF0055', '#33FF57', '#3357FF', '#FFD700', '#FF33FF', '#00FFFF'];
  randomOrderedArray: { color: string; revealed: boolean; matched: boolean }[] = [];
  
  firstSelection: number | null = null;
  secondSelection: number | null = null;
  isProcessing = false;
  moves = 0;
  matches = 0;

  constructor() {
    this.initGame();
  }

  initGame() {
    const doubledColors = [...this.colors, ...this.colors];
    this.randomOrderedArray = doubledColors
      .sort(() => Math.random() - 0.5)
      .map(color => ({ color, revealed: false, matched: false }));
    this.moves = 0;
    this.matches = 0;
    this.firstSelection = null;
    this.secondSelection = null;
    this.isProcessing = false;
  }

  onClickOfBox(index: number): void {
    const selected = this.randomOrderedArray[index];

    // Prevent clicking if processing, or if tile is already revealed/matched
    if (this.isProcessing || selected.revealed || selected.matched || index === this.firstSelection) {
      return;
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

    if (first.color === second.color) {
      first.matched = true;
      second.matched = true;
      this.matches++;
      this.resetSelections();
      
      if (this.matches === this.colors.length) {
        // Game Over logic could go here
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

  resetSelections(): void {
    this.firstSelection = null;
    this.secondSelection = null;
  }
}
