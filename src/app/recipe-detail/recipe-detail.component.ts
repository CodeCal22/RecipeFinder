import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
  standalone: false
})
export class RecipeDetailComponent implements OnInit {
  meal: any;
  ingredients: any[] = [];
  videoUrl: SafeResourceUrl | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loading = true;

      // fetch meal details
      this.recipeService.getMealById(id).subscribe(result => {
        if (result.meals && result.meals.length > 0) {
          this.meal = result.meals[0];
          this.getIngredients();
          this.getVideoUrl();
        }

        this.loading = false;
        this.changeDetector.detectChanges();
      });
    }
  }

  getIngredients() {
    this.ingredients = [];

    // get ingredient and measure fields from API
    for (var i = 1; i <= 20; i++) {
      var ingredient = this.meal['strIngredient' + i];
      var measure = this.meal['strMeasure' + i];

      if (ingredient && ingredient.trim() !== '') {
        this.ingredients.push({
          name: ingredient,
          measure: measure
        });
      }
    }
  }

  getVideoUrl() {
    this.videoUrl = null;

    // show video if available
    if (this.meal.strYoutube) {
      var url = this.meal.strYoutube.replace('watch?v=', 'embed/');
      url = url.replace('youtu.be/', 'www.youtube.com/embed/');
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
