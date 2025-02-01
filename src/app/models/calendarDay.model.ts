import { Recipe } from "./recipe.model";

export interface CalendarDay{
    day: string;
    breakfast: Recipe[];
    lunch: Recipe[];
    dinner: Recipe[];
  }
  