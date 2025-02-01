import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { IngredientCategory } from '../../models/ingredientCategory.model';
import { MatSnackBar} from '@angular/material/snack-bar';
import { IngredientCategoryService } from '../../services/ingredient-category.service';


@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  categories: Category[] = [];
  ingredientCategories: IngredientCategory[] = [];
  filterForm: FormGroup;
  isGridView = true;

  constructor(
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private ingredientCategoryService: IngredientCategoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      category: [''],
      ingredientCategory: ['']
    });
  }

  ngOnInit(): void {
    this.loadRecipes();
    this.loadCategories();
    this.loadIngredientCategories();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadIngredientCategories(): void {
    this.ingredientCategoryService.getIngredientCategories().subscribe({
      next: (ingredientCategories) => {
        this.ingredientCategories = ingredientCategories;
      },
      error: (error) => {
        console.error('Error loading ingredient categories:', error);
      }
    });
  }

  toggleView(view: 'grid' | 'list'): void {
    if (view === 'grid') {
      this.isGridView = true;
    } else {
      this.isGridView = false;
    }
  }

  applyFilter(): void {
    const filters = this.filterForm.value;
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        let filteredRecipes = recipes;

        if (filters.name) {
          filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.name.toLowerCase().includes(filters.name.toLowerCase())
          );
        }

        if (filters.category) {
          filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.category === filters.category
          );
        }

        if (filters.ingredientCategory) {
          filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.ingredients.some(ingredient => ingredient.category === filters.ingredientCategory)
          );
        }

        this.recipes = filteredRecipes;
      },
      error: (error) => {
        console.error('Error filtering recipes:', error);
      }
    });
  }

  deleteRecipe(id: number): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
          this.recipes = this.recipes.filter(recipe => recipe.id !== id);
        },
        error: (error) => {
          console.error('Error deleting recipe:', error);
        }
      });
    }
  }

  toggleFavorite(recipe: Recipe): void {
    recipe.isFavorite = !recipe.isFavorite;
    const message = recipe.isFavorite 
      ? `${recipe.name} added to favorites` 
      : `${recipe.name} removed from favorites`;
      
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.loadRecipes();
  }
}