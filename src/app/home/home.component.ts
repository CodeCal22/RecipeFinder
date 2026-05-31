import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})
export class HomeComponent {
  categories = [
    { name: 'Beef', image: 'https://www.themealdb.com/images/category/beef.png' },
    { name: 'Chicken', image: 'https://www.themealdb.com/images/category/chicken.png' },
    { name: 'Dessert', image: 'https://www.themealdb.com/images/category/dessert.png' },
    { name: 'Pasta', image: 'https://www.themealdb.com/images/category/pasta.png' },
    { name: 'Seafood', image: 'https://www.themealdb.com/images/category/seafood.png' },
    { name: 'Vegetarian', image: 'https://www.themealdb.com/images/category/vegetarian.png' },
    { name: 'Breakfast', image: 'https://www.themealdb.com/images/category/breakfast.png' },
    { name: 'Lamb', image: 'https://www.themealdb.com/images/category/lamb.png' },
    { name: 'Side', image: 'https://www.themealdb.com/images/category/side.png' },
    { name: 'Vegan', image: 'https://www.themealdb.com/images/category/vegan.png' },
    { name: 'Starter', image: 'https://www.themealdb.com/images/category/starter.png' },
    { name: 'Miscellaneous', image: 'https://www.themealdb.com/images/category/miscellaneous.png' }
  ];

  inspirationList = [
    'Try making Chicken Curry today!',
    'Sweet tooth? Go for Chocolate Dessert!',
    'Maybe a simple Pasta dish sounds good.',
    'Seafood pasta could be a nice dinner idea.'
  ];

  todayIdea = this.inspirationList[Math.floor(Math.random() * this.inspirationList.length)];

  constructor(private recipeService: RecipeService, private router: Router) { }

  openCategory(categoryName: string) {
    // navigate to recipes page
    this.recipeService.searchText = categoryName;
    this.router.navigate(['/recipes'], { queryParams: { search: categoryName } });
  }
}
