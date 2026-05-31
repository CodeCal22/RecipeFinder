import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
  standalone: false
})
export class RecipeDetailComponent implements OnInit {
  meal: any;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loading = true;

      // calling API here
      this.recipeService.getMealById(id).subscribe(result => {
        if (result.meals && result.meals.length > 0) {
          this.meal = result.meals[0];
        }

        this.loading = false;
        this.changeDetector.detectChanges();
      });
    }
  }
}
