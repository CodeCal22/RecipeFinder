import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
  standalone: false
})
export class RecipeCardComponent {
  @Input() meal: any;

  constructor(private router: Router) { }

  viewRecipe() {
    this.router.navigate(['/recipe', this.meal.idMeal]);
  }
}
