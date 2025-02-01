import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { WeeklyMealPlan } from '../models/recipe.model';
import { TemporaryWeekPlan } from '../models/shoppingList.model';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  
  private apiUrl = "http://localhost:3000/mealPlan";
  private readonly PLAN_ID = 1;


  constructor(private http: HttpClient) {}

  getMealPlan(): Observable<WeeklyMealPlan>{
    return this.http.get<WeeklyMealPlan[]>(this.apiUrl).pipe(
      map(plans => plans[0] || null)
    );
  }


  getMealPlanNew(): Observable<TemporaryWeekPlan>{
    return this.http.get<TemporaryWeekPlan[]>(this.apiUrl).pipe(
      map(plans => plans[0] || null)
    );
  }

  saveMealPlan(weeklyMealPlan: WeeklyMealPlan): Observable<WeeklyMealPlan>{
    

    const planToSave = {
      ...weeklyMealPlan,
      id: this.PLAN_ID
    };

    return this.http.get<WeeklyMealPlan>(`${this.apiUrl}/${this.PLAN_ID}`).pipe(
      catchError(() => of(null)), // Handle case when no plan exists yet
      switchMap(existingPlan => {
        console.log(existingPlan);
        
        if (existingPlan === null) {
          // Create first plan with ID 1
          return this.http.post<WeeklyMealPlan>(this.apiUrl, planToSave);
        } else {
          // Update existing plan with ID 1
          return this.http.put<WeeklyMealPlan>(`${this.apiUrl}/${this.PLAN_ID}`, planToSave);
        }
      })
    );
  }

  //   this.http.get<any[]>(this.apiUrl).subscribe({
  //     next: (response) => {
        
  //       allMealPlans = [...response];
  //     },
  //     error: (error) => {
  //       //To remove
  //       console.error("Error saveMealPlan() meal-plan-service.ts", error);
  //     }
  //   })

  //   console.log(allMealPlans);
    
  //   if (allMealPlans.length === 0){
  //     console.log(allMealPlans);
  //     return this.http.post<WeeklyMealPlan>(this.apiUrl, weeklyMealPlan);
  //   }else{
  //     return this.http.put<WeeklyMealPlan>(`${this.apiUrl}/${weeklyMealPlan.id}`, weeklyMealPlan);
  //   }
  // }
}