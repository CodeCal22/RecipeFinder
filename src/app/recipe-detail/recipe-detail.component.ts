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

      this.recipeService.getMealById(id).subscribe(res => {
        if (res.meals && res.meals.length > 0) {
          this.meal = res.meals[0];
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

    for (var i = 1; i <= 20; i++) {
      var name = this.meal['strIngredient' + i];
      var amount = this.meal['strMeasure' + i];

      if (name && name.trim() !== '') {
        this.ingredients.push({
          name: name,
          measure: amount
        });
      }
    }
  }

  getVideoUrl() {
    this.videoUrl = null;

    if (this.meal.strYoutube) {
      var url = this.meal.strYoutube.replace('watch?v=', 'embed/');
      url = url.replace('youtu.be/', 'www.youtube.com/embed/');
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
