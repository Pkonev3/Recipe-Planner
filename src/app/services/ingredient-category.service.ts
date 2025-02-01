import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IngredientCategory } from '../models/ingredientCategory.model';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Ingredient } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class IngredientCategoryService {

  private apiUrl = 'http://localhost:3000/ingredient-categories';


  constructor(private http: HttpClient) { }


    getIngredientCategories(): Observable<IngredientCategory[]> {
      return this.http.get<IngredientCategory[]>(this.apiUrl);
    }

    getIngredientCategoryByName(name: string): Observable<IngredientCategory[]> {
      return this.http.get<IngredientCategory[]>(`${this.apiUrl}?name=${name}`);
    }

    saveIngredientCategory(category: string): Observable<any> {
      return this.getIngredientCategories().pipe(
        switchMap((categories: any[]) => {

          const duplicates = categories.find(c => c.name.toLowerCase() === category.toLowerCase());
          if(duplicates){
            throw new Error('Category with this name already exists');
          }
          
          const maxId = Math.max(...categories.map(c => c.id));
          const newCategory = { id: maxId + 1, name: category, ingredients: [] };
          return this.http.post<any>(this.apiUrl, newCategory); // Make the POST request
        })
      );
    }

    updateIngridientCategoryName(categoryToUpdate: {id: number, name: string}): Observable<any>{
      if(categoryToUpdate.id === 0){
        throw Error("Error updating , object with that id does not exist");
      }

      return this.getIngredientCategories().pipe(
        switchMap((categories: any[]) => {

          
          const newCategory = categories.find(category => category.id === categoryToUpdate.id);

          const objectToSave = {...newCategory, name: categoryToUpdate.name} 

          console.log(objectToSave);

          return this.http.put<any>(`${this.apiUrl}/${categoryToUpdate.id}`, objectToSave); // Make the POST request
        })
      );
    }
    
    saveIngredients(id: number, categories: any): Observable<any>{
      return this.http.put<any>(`${this.apiUrl}/${id}`, categories);
    }

    deleteIngredientCategory(id: number): Observable<any>{
      return this.http.delete(`${this.apiUrl}/${id}`).pipe(
        catchError((error) => {
          console.error('Error deleting category');
          return of ({success: false , message: 'Failed to delete category'})
        })
      )
    }
}
