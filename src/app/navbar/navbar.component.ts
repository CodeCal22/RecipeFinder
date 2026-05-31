import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: false
})
export class NavbarComponent {
  searchText = '';
  typingTimer: any;

  constructor(private recipeService: RecipeService, private router: Router) { }

  searchOnTyping() {
    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
      this.searchRecipe();
    }, 500);
  }

  searchRecipe() {
    var text = this.searchText.trim();

    if (text !== '') {
      this.recipeService.searchText = text;
      this.router.navigate(['/recipes'], { queryParams: { search: text } });
    }
  }
}
