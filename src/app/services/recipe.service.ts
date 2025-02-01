import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/recipes';

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  addRecipe(recipe: any): Observable<any> {
    return this.getRecipes().pipe(
      // Wait for the recipes to be fetched
      switchMap(recipes => {
        // Get the max ID from the fetched recipes
        const maxId = Math.max(...recipes.map(r => r.id), 0); // Find the highest ID
        const newRecipe = { ...recipe, id: maxId + 1 }; // Increment the ID
        return this.http.post<any>(this.apiUrl, newRecipe); // Send the new recipe to the server
      })
    );
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${recipe.id}`, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchRecipes(term: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}?q=${term}`);
  }

  getRecipesByCategory(category: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}?category=${category}`);
  }
}