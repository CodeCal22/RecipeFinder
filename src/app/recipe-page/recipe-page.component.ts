import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrl: './recipe-page.component.css',
  standalone: false
})
export class RecipePageComponent implements OnInit {
  meals: any[] = [];
  searchTitle = 'Chicken recipes';
  loading = false;
  errorMessage = '';

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      var search = params['search'];

      if (search) {
        this.recipeService.searchText = search;
        this.loadSearchMeals(search);
      } else if (this.recipeService.searchText !== '') {
        this.loadSearchMeals(this.recipeService.searchText);
      } else {
        this.loadDefaultMeals();
      }
    });
  }

  loadSearchMeals(text: string) {
    this.loading = true;
    this.errorMessage = '';
    this.meals = [];
    this.searchTitle = text + ' recipes';

    // calling API here
    this.recipeService.searchMeals(text).subscribe({
      next: result => {
        if (result.meals && result.meals.length > 0) {
          this.meals = result.meals;
          this.loading = false;
          this.changeDetector.detectChanges();
        } else {
          this.loadCategoryMeals(text);
        }
      },
      error: () => {
        this.loadCategoryMeals(text);
      }
    });
  }

  loadCategoryMeals(text: string) {
    // trying category search if normal search is empty
    this.recipeService.searchMealsByCategory(text).subscribe({
      next: result => {
        this.meals = result.meals || [];
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.meals = [];
        this.errorMessage = 'Could not load recipes. Please try again.';
        this.loading = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  loadDefaultMeals() {
    this.loading = true;
    this.errorMessage = '';
    this.meals = [];

    this.recipeService.getDefaultMeals().subscribe({
      next: result => {
        this.meals = result.meals || [];
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.meals = [];
        this.errorMessage = 'Could not load recipes. Please try again.';
        this.loading = false;
        this.changeDetector.detectChanges();
      }
    });
  }
}
