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

  loadCategories(showAll: boolean) {
    if (this.categories.length > 1) {
      if (showAll) {
        this.loadAllMeals();
      }
      return;
    }

    this.recipeService.getCategories().subscribe(res => {
      if (res.meals) {
        for (var i = 0; i < res.meals.length; i++) {
          if (!this.categories.includes(res.meals[i].strCategory)) {
            this.categories.push(res.meals[i].strCategory);
          }
        }
      }

      if (showAll) {
        this.loadAllMeals();
      }
    });
  }

  loadSearchMeals(text: string) {
    this.loading = true;
    this.errorMessage = '';
    this.meals = [];
    this.searchTitle = text + ' recipes';

    this.recipeService.searchMeals(text).subscribe({
      next: res => {
        if (res.meals && res.meals.length > 0) {
          this.meals = res.meals;
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

    this.recipeService.searchMealsByCategory(text).subscribe({
      next: res => {
        this.meals = res.meals || [];

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
      next: res => {
        this.meals = res.meals || [];
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

    var list = this.categories.filter(cat => cat !== 'All');
    var mealList: any[] = [];
    var done = 0;

    if (list.length === 0) {
      this.loading = false;
      return;
    }

    for (var i = 0; i < list.length; i++) {
      let cat = list[i];

      this.recipeService.searchMealsByCategory(cat).subscribe({
        next: res => {
          var data = res.meals || [];

          for (var j = 0; j < data.length; j++) {
            data[j].strCategory = cat;
            mealList.push(data[j]);
          }

          done++;

          if (done === list.length) {
            this.meals = mealList;
            this.loading = false;
            this.changeDetector.detectChanges();
          }
        },
        error: () => {
          done++;

          if (done === list.length) {
            this.meals = mealList;
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
