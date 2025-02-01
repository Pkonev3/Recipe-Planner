import { Routes } from '@angular/router';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { MealPlannerComponent } from './components/meal-planner/meal-planner.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { IngredientsManagementComponent } from './components/ingredients-management/ingredients-management.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


export const routes: Routes = [
  { path: '', redirectTo: '/recipe', pathMatch: 'full' },
  { path: 'recipe', component: RecipeListComponent},
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'add-recipe', component: RecipeFormComponent },
  { path: 'edit-recipe/:id', component: RecipeFormComponent },
  { path: 'meal-planner', component: MealPlannerComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'ingredients', component: IngredientsManagementComponent},
  { path: '**', component: NotFoundComponent, title: "Not Found"}
];