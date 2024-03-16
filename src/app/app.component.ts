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
  colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];
  randomOrderedArray = [...this.colors, ...this.colors].sort(() => Math.random() - 0.5).map(item => ({ color: item, value: 0}))
  previousColor: string | undefined;
  currentColor: string | undefined;
  
  onClickOfBox(index: number): void {
    this.previousColor = this.currentColor ? this.currentColor : '';
    this.currentColor = this.randomOrderedArray[index].color;
    this.randomOrderedArray[index].value = 1;
    if(this.previousColor && this.previousColor === this.currentColor) {
      this.previousColor = this.currentColor = undefined;
      this.randomOrderedArray.forEach(item => {
        if (item.color === this.currentColor) {
          item.value = 1
        }
      });
    }
  }
}
