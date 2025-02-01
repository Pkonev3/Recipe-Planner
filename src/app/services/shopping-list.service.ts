import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShoppingList, TemporaryShoppingList } from '../models/shoppingList.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private readonly apiUrl = "http://localhost:3000/shoppingList";

  constructor(private http: HttpClient) {}

  saveShoppingList(shoppingList: ShoppingList): Observable<ShoppingList>{
    return this.http.put<ShoppingList>(`${this.apiUrl}/1`, shoppingList);
  }

  getShoppingList(): Observable<TemporaryShoppingList[]>{
    return this.http.get<TemporaryShoppingList[]>(this.apiUrl);
  }
  
}
