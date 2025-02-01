export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cookingTime: number;
  isFavorite: boolean;
  servings: number;
  difficulty: string;
  category: string;
  imageUrl: string;
}

interface DayMeals{
  breakfast: Recipe[],
  lunch: Recipe[],
  dinner: Recipe[]
}

interface WeekDay{
  day: string,
  meals: DayMeals
}


export interface WeeklyMealPlan{
  id?: number,
  dayFrom?: string,
  dayTo?: string,
  days: WeekDay[];
}
// For testing purposes - Optional: Type guard to check if an object is a Recipe
export function isRecipe(obj: any): obj is Recipe {
  return obj 
    && typeof obj.id === 'string'
    && typeof obj.name === 'string'
    && Array.isArray(obj.ingredients)
    && Array.isArray(obj.instructions)
    && typeof obj.isFavorite === 'boolean'
    && typeof obj.cookingTime === 'number'
    && typeof obj.servings === 'number'
    && typeof obj.difficulty === 'string'
    && typeof obj.category === 'string'
    && typeof obj.imageUrl === 'string';
}