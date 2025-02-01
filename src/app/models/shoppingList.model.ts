import { Ingredient, Recipe } from "./recipe.model";

export interface TemporaryMeals {
    breakfast: Recipe[];
    lunch: Recipe[];
    dinner: Recipe[];
}

export interface temporaryDays {
    day: string;
    meals: TemporaryMeals
}


export type MealsList = Ingredient[];


export interface TemporaryWeekPlan {
    id: number;
    dayFrom: string;
    dayTo: string;
    days: temporaryDays[]
}
export interface ShoppingListItem {
    name: string;
    amount: number;
    unit: string;
    bought: boolean;
}

export interface ShoppingList {
    id: number;
    items: ShoppingListItem[];
}

export interface TemporaryShoppingList { id?: number, name: string, amount: number, unit: string, bought: boolean };
