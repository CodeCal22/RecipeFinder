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
  categories: string[] = ['All'];
  selectedCategory = 'All';
  searchTitle = 'All recipes';
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
        this.loadCategories(false);
        this.recipeService.searchText = search;
        this.selectedCategory = 'All';
        this.loadSearchMeals(search);
      } else if (this.recipeService.searchText !== '') {
        this.loadCategories(false);
        this.loadSearchMeals(this.recipeService.searchText);
      } else {
        this.selectedCategory = 'All';
        this.loadCategories(true);
      }
    });
  }

  loadCategories(loadAllAfter: boolean) {
    if (this.categories.length > 1) {
      if (loadAllAfter) {
        this.loadAllMeals();
      }
      return;
    }

    // fetch all categories for dropdown
    this.recipeService.getCategories().subscribe(result => {
      if (result.meals) {
        for (var i = 0; i < result.meals.length; i++) {
          if (!this.categories.includes(result.meals[i].strCategory)) {
            this.categories.push(result.meals[i].strCategory);
          }
        }
      }

      if (loadAllAfter) {
        this.loadAllMeals();
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
    this.loading = true;
    this.errorMessage = '';
    this.meals = [];
    this.searchTitle = text + ' recipes';

    // trying category search if normal search is empty
    this.recipeService.searchMealsByCategory(text).subscribe({
      next: result => {
        this.meals = result.meals || [];

        // category API does not send category name, so adding it here
        for (var i = 0; i < this.meals.length; i++) {
          this.meals[i].strCategory = text;
        }

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
    this.searchTitle = 'Chicken recipes';

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

  loadAllMeals() {
    this.loading = true;
    this.errorMessage = '';
    this.meals = [];
    this.searchTitle = 'All recipes';

    var categoryNames = this.categories.filter(category => category !== 'All');
    var allMeals: any[] = [];
    var finishedRequests = 0;

    if (categoryNames.length === 0) {
      this.loading = false;
      return;
    }

    // fetch meals from every category
    for (var i = 0; i < categoryNames.length; i++) {
      let categoryName = categoryNames[i];

      this.recipeService.searchMealsByCategory(categoryName).subscribe({
        next: result => {
          var categoryMeals = result.meals || [];

          for (var j = 0; j < categoryMeals.length; j++) {
            categoryMeals[j].strCategory = categoryName;
            allMeals.push(categoryMeals[j]);
          }

          finishedRequests++;

          if (finishedRequests === categoryNames.length) {
            this.meals = allMeals;
            this.loading = false;
            this.changeDetector.detectChanges();
          }
        },
        error: () => {
          finishedRequests++;

          if (finishedRequests === categoryNames.length) {
            this.meals = allMeals;
            this.loading = false;
            this.changeDetector.detectChanges();
          }
        }
      });
    }
  }

  changeCategory() {
    if (this.selectedCategory === 'All') {
      this.recipeService.searchText = '';
      this.loadAllMeals();
    } else {
      this.recipeService.searchText = this.selectedCategory;
      this.loadCategoryMeals(this.selectedCategory);
    }
  }
}
