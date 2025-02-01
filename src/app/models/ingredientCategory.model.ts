export interface IngredientCategory {
  id: number;
  name: string;
  ingredients: CategoryIngredient[];
}

export interface CategoryIngredient{
  id?: number;
  name: string;
}