import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealPlanService } from '../../services/meal-plan.service';
import { MealsList, ShoppingList, TemporaryShoppingList, TemporaryWeekPlan } from '../../models/shoppingList.model';
import { of, switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingListService } from '../../services/shopping-list.service';
import { TruncateDecimalPipe } from '../../pipes/truncate-decimal.pipe';
import { Ingredient } from '../../models/recipe.model';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    TruncateDecimalPipe,
  ],
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  shoppingForm: FormGroup;
  weeklyMealPlan: TemporaryWeekPlan = {} as TemporaryWeekPlan;
  allMeals: MealsList[] = [];
  flattenMeals: Ingredient[] = [];
  ingredients: Map<string, Map<string, number>> = new Map();
  shoppingList: TemporaryShoppingList[] = [];
  savedItems: Map<string, TemporaryShoppingList[]> = new Map(); // Changed to store arrays of items

  constructor(
    private mealPlanService: MealPlanService,
    private shoppingListService: ShoppingListService,
    private fb: FormBuilder
  ) {
    this.shoppingForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  get itemsFormArray() {
    return this.shoppingForm.get('items') as FormArray;
  }

  loadSavedShoppingList() {
    return this.shoppingListService.getShoppingList().pipe(
      switchMap((response: any) => {
        if (response && response[0]?.items) {
          this.savedItems.clear();

          response[0].items.forEach((item: TemporaryShoppingList) => {
            const key = `${item.name}-${item.unit}`;
            if (!this.savedItems.has(key)) {
              this.savedItems.set(key, []);
            }
            this.savedItems.get(key)?.push(item);
          });

          while (this.itemsFormArray.length) {
            this.itemsFormArray.removeAt(0);
          }

          response[0].items.forEach((item: TemporaryShoppingList) => {
            this.itemsFormArray.push(
              this.fb.group({
                name: [item.name],
                amount: [item.amount],
                unit: [item.unit],
                bought: [item.bought]
              })
            );
          });

          this.shoppingList = response[0].items;
        }
        return of(response);
      })
    );
  }
  private merge(items: TemporaryShoppingList[]): TemporaryShoppingList[] {
    return items.reduce((acc: TemporaryShoppingList[], item) => {
      const existing = acc.find(
        (i) => i.name === item.name && i.unit === item.unit && i.bought === item.bought
      );

      if (existing) {
        existing.amount += item.amount;
      } else {
        acc.push({ ...item });
      }

      return acc;
    }, []);
  }
  private mergeShoppingLists() {
    console.log(this.savedItems);

    let mergedList: TemporaryShoppingList[] = [];

    this.ingredients.forEach((unitMap, name) => {
      unitMap.forEach((newAmount, unit) => {
        const key = `${name}-${unit}`;
        const savedItemsList = this.savedItems.get(key) || [];



        if (savedItemsList.length > 0) {

          const totalSavedAmount = savedItemsList.reduce((sum, item) => sum + (item.amount || 0), 0);



          if (newAmount > totalSavedAmount) {
            savedItemsList.forEach(savedItem => {
              mergedList.push({
                name: savedItem.name,
                amount: savedItem.amount,
                unit: savedItem.unit,
                bought: savedItem.bought
              });
            });

            const remainingAmount = newAmount - totalSavedAmount;
            if (remainingAmount > 0) {
              mergedList.push({
                name,
                amount: remainingAmount,
                unit,
                bought: false
              });
            }
          } else if (newAmount < totalSavedAmount) {
            const reduction = totalSavedAmount - newAmount;
            let remainingReduction = reduction;

            savedItemsList.forEach((savedItem, index) => {
              if (index === savedItemsList.length - 1) {
                const newAmount = Math.max(0, savedItem.amount - remainingReduction);
                if (newAmount > 0) {
                  mergedList.push({
                    ...savedItem,
                    amount: newAmount
                  });
                }
              } else {
                const proportion = savedItem.amount / totalSavedAmount;
                const itemReduction = reduction * proportion;
                remainingReduction -= itemReduction;

                const newAmount = Math.max(0, savedItem.amount - itemReduction);
                if (newAmount > 0) {
                  mergedList.push({
                    ...savedItem,
                    amount: newAmount
                  });
                }
              }
            });
          } else {
            savedItemsList.forEach(savedItem => {
              mergedList.push({ ...savedItem });
            });
          }
        } else {


          mergedList.push({
            name,
            amount: newAmount,
            unit,
            bought: false
          });
        }
      });
    });

    this.savedItems.forEach((savedItemsList, key) => {
      const [name, unit] = key.split('-');
      const existsInNew = this.ingredients.has(name) &&
        this.ingredients.get(name)?.has(unit);

      if (!existsInNew) {
        savedItemsList.forEach(savedItem => {
          mergedList.push({ ...savedItem });
        });
      }
    });


    mergedList = this.merge(mergedList);

    return mergedList;
  }

  saveShoppingList() {
    const formValue = this.shoppingForm.value;
    const saveObject: ShoppingList = {
      id: 1,
      items: formValue.items
    };

    this.shoppingListService.saveShoppingList(saveObject).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.error('Error saving shopping list:', error);
      }
    });
  }

  generateShoppingList() {
    this.allMeals = [];
    this.flattenMeals = [];
    this.ingredients.clear();

    this.loadSavedShoppingList().subscribe({
      next: () => {
        this.getWeeklyMealPlan();
      },
      error: (error) => {
        console.error('Error loading saved shopping list:', error);
        this.getWeeklyMealPlan();
      }
    });
  }

  clearShoppingList() {
    this.shoppingList = [];
    this.savedItems.clear();
    while (this.itemsFormArray.length) {
      this.itemsFormArray.removeAt(0);
    }
    this.saveShoppingList();
  }

  private createShoppingListItems() {
    const mergedList = this.mergeShoppingLists();

    while (this.itemsFormArray.length) {
      this.itemsFormArray.removeAt(0);
    }

    mergedList.forEach(item => {
      this.itemsFormArray.push(
        this.fb.group({
          name: [item.name],
          amount: [item.amount],
          unit: [item.unit],
          bought: [item.bought]
        })
      );
    });

    this.shoppingList = mergedList;
    this.saveShoppingList();
  }

  private setupFormSubscription() {
    this.shoppingForm.valueChanges.subscribe(formValue => {
      this.shoppingList = formValue.items;
      this.saveShoppingList();
    });
  }

  ngOnInit() {
    this.loadSavedShoppingList().subscribe({
      complete: () => {
        this.setupFormSubscription();
      }
    });
  }

  getMeals() {
    if (!this.weeklyMealPlan.days) return;

    this.weeklyMealPlan.days.forEach(day => {
      if (day.meals.breakfast.length > 0) {
        day.meals.breakfast.forEach(ingredient => {
          this.allMeals.push(ingredient.ingredients);
        });
      }
      if (day.meals.lunch.length > 0) {
        day.meals.lunch.forEach(ingredient => {
          this.allMeals.push(ingredient.ingredients);
        });
      }
      if (day.meals.dinner.length > 0) {
        day.meals.dinner.forEach(ingredient => {
          this.allMeals.push(ingredient.ingredients);
        });
      }
    });

    this.flattenMeals = this.allMeals.flat();
  }

  filterMeals() {
    this.flattenMeals.forEach(meal => {
      if (!this.ingredients.has(meal.name)) {
        this.ingredients.set(meal.name, new Map<string, number>([[meal.unit, meal.amount]]));
      } else {
        const unitMap = this.ingredients.get(meal.name);
        if (unitMap?.has(meal.unit)) {
          const currentAmount = unitMap.get(meal.unit) || 0;
          unitMap.set(meal.unit, currentAmount + meal.amount);
        } else {
          unitMap?.set(meal.unit, meal.amount);
        }
      }
    });
  }

  getWeeklyMealPlan() {
    this.mealPlanService.getMealPlanNew().pipe(
      switchMap((response) => {
        this.weeklyMealPlan = response;
        this.getMeals();
        this.filterMeals();
        this.createShoppingListItems();
        return of(response);
      })
    ).subscribe({
      error: (error) => {
        console.error('Error getting meal plan:', error);
      }
    });
  }
}