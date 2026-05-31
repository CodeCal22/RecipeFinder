import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  searchText = '';
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  constructor(private http: HttpClient) { }

  searchMeals(query: string) {
    // calling API here
    return this.http.get<any>(this.apiUrl + '/search.php?s=' + encodeURIComponent(query));
  }

  searchMealsByCategory(category: string) {
    // searching by category here
    return this.http.get<any>(this.apiUrl + '/filter.php?c=' + encodeURIComponent(category));
  }

  getDefaultMeals() {
    return this.searchMeals('chicken');
  }

  getMealById(id: string) {
    return this.http.get<any>(this.apiUrl + '/lookup.php?i=' + encodeURIComponent(id));
  }
}
