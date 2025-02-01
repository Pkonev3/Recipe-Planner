import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { Recipe, Ingredient } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { CategoryService } from '../../services/category.service';
import { IngredientCategoryService } from '../../services/ingredient-category.service';
import { UnitsService } from '../../services/units.service';
import { Category } from '../../models/category.model';
import { CategoryIngredient, IngredientCategory } from '../../models/ingredientCategory.model';
import { Unit } from '../../models/unit.model';
import { DifficultyLevelService } from '../../services/difficulty-level.service';
import { DifficultyLevel } from '../../models/difficultyLevel.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule
  ],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  ingredientsForm: FormGroup;
  isEditMode = false;
  newIngredient: Ingredient = {category: '', name: '', amount: 0, unit: '' };
  newInstruction: string = '';



  difficultyLevels: string[] = [];
  categories: string[] = [];
  ingredientCategoriesNames: string[] = [];
  ingredients: string[] = [];
  filteredIngredients: string[] = [];
  units: string[] = [];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private ingredientCategoryService: IngredientCategoryService,
    private unitService: UnitsService,
    private difficultyLevelsService: DifficultyLevelService

  ) {
    this.recipeForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      description: [''],
      ingredients: [[]],
      instructions: [[]],
      isFavorite: false,
      cookingTime: [0, [Validators.required, Validators.min(1)]],
      servings: [0, [Validators.required, Validators.min(1)]],
      difficulty: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: ['']
    });

    this.ingredientsForm = this.fb.group({
      category: [''],
      name: [{value: '', disabled: true}],
      amount: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required]
    });
  }

  fetchIngredientsDropdownOptions(){
    const filteredCategory = this.ingredientsForm.value.category;
    this.filteredIngredients = [];

    
    this.ingredientsForm.get("category")?.valueChanges.subscribe({
      next: () => {
        this.ingredientsForm.get("name")?.setValue('', {emitEvent: false});
      },
      error: (error) => {
        console.error('Error resseting name');  
      }
  
    });

    if(filteredCategory !== ''){
      this.ingredientsForm.controls['name'].enable({emitEvent: false});
    }

    this.ingredientCategoryService.getIngredientCategoryByName(filteredCategory).subscribe({
      next: (returnCategory) => {
        
        if(returnCategory === undefined){}
        if(returnCategory.length > 0){
          this.filteredIngredients = returnCategory[0].ingredients.map(i => i.name);          
        };
      },
      error: (error) => {
        console.error('Error fetching ingredient category:', error);
        this.showSnackBar('Error fetching ingredient category. Please try again.');
      }
    });
    
  }

  fetchDropdownOptions(){
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories.map(c => c.name);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.showSnackBar('Error fetching categories. Please try again.');
      }
    )

    this.ingredientCategoryService.getIngredientCategories().subscribe(
      (ingredientCategories: IngredientCategory[]) =>{
        this.ingredientCategoriesNames = ingredientCategories.map(ic => ic.name);
      },
      (error) =>{
        console.error('Error fetching ingredient categories:', error);
        this.showSnackBar('Error fetching ingredient categories. Please try again.');
      }
    )

    this.unitService.getUnits().subscribe(
      (units: Unit[]) => {
        this.units = units.map(un => un.name);
      },
      (error) => {
        console.error('Error fetching units:', error);
        this.showSnackBar('Error fetching units. Please try again.');
      }
    )


    this.difficultyLevelsService.getDifficultyLevels().subscribe({
      next: (difficultyLevels: DifficultyLevel[]) =>{
        this.difficultyLevels = difficultyLevels.map(dl => dl.name);
      },
      error: (error) => {
        console.error('Error fetching difficulty levels:', error);
        this.showSnackBar('Error fetching difficulty levels. Please try again.');
      }
    })
    
  }
  ngOnInit(): void {
    this.fetchDropdownOptions();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipeService.getRecipe(Number(id)).subscribe(
        (recipe) => {          
          this.recipeForm.patchValue(recipe);
        },
        (error) => {
          console.error('Error fetching recipe:', error);
          this.showSnackBar('Error fetching recipe. Please try again.');
        }
      );
    }else{
      this.isEditMode = false;

      this.recipeForm.patchValue({
        name: '',
        description: '',
        ingredients: [],
        instructions: [],
        cookingTime: 0,
        servings: 0,
        difficulty: '',
        category: '',
        imageUrl: ''
      });
    }

    this.ingredientsForm.valueChanges.subscribe({
      next: () => {
        this.fetchIngredientsDropdownOptions()
      },
      error: (error) => {
        console.error('Error fetching ingredient categories:', error);
        this.showSnackBar('Error fetching ingredient categories. Please try again.');
      }
    });

  
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const recipe: Recipe = this.recipeForm.value;
      
      if (this.isEditMode) {
        this.recipeService.updateRecipe(recipe).subscribe(
          () => {
            this.router.navigate(['/recipe']);
            this.showSnackBar('Recipe updated successfully!');
          },
          (error) => {
            console.error('Error updating recipe:', error);
            this.showSnackBar('Error updating recipe. Please try again.');
          }
        );
      } else {
        this.recipeService.addRecipe(recipe).subscribe(
          () => {
            this.router.navigate(['/recipe']);
            this.showSnackBar('Recipe added successfully!');
          },
          (error) => {
            console.error('Error adding recipe:', error);
            this.showSnackBar('Error adding recipe. Please try again.');
          }
        );
      }
    } else {
      this.showSnackBar('Please fill in all required fields.');
    }
  }

  addIngredient(): void {


    if(this.ingredientsForm.valid && (this.ingredientsForm.value.category !== '') && (this.ingredientsForm.value.name !== '') && (this.ingredientsForm.value.amount !== 0) && (this.ingredientsForm.value.unit !== '')){
      const ingredients = this.recipeForm.get("ingredients")?.value || [];
      const newIngredient = {
        category: this.ingredientsForm.value.category,
        name: this.ingredientsForm.value.name,
        amount: this.ingredientsForm.value.amount,
        unit: this.ingredientsForm.value.unit
      }

      ingredients.push(newIngredient);
      
      this.recipeForm.patchValue({ingredients});
      this.ingredientsForm.reset();
      this.ingredientsForm.controls['name'].disable({emitEvent: false});
    }else{
      
      if(this.ingredientsForm.value.name === ""){
        this.showSnackBar('Please select an ingredient or other category if not available.');
      }else{
        this.showSnackBar('Please fill in all ingredient fields.');
      }
    }
  }

  removeIngredient(index: number): void {
    const ingredients = this.recipeForm.get('ingredients')?.value || [];
    ingredients.splice(index, 1);
    this.recipeForm.patchValue({ ingredients });
  }

  addInstruction(): void {
    if (this.newInstruction.trim()) {
      const instructions = this.recipeForm.get('instructions')?.value || [];
      instructions.push(this.newInstruction.trim());
      this.recipeForm.patchValue({ instructions });
      this.newInstruction = '';
    } else {
      this.showSnackBar('Please enter an instruction.');
    }
  }

  removeInstruction(index: number): void {
    const instructions = this.recipeForm.get('instructions')?.value || [];
    instructions.splice(index, 1);
    this.recipeForm.patchValue({ instructions });
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}