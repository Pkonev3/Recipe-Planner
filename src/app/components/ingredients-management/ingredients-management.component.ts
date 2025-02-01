import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import {MatSelect } from '@angular/material/select';
import { IngredientCategoryService } from '../../services/ingredient-category.service';
import { MatButtonModule } from '@angular/material/button';
import { IngredientCategory } from '../../models/ingredientCategory.model';
import { Category } from '../../models/category.model';


@Component({
  selector: 'app-ingredients-management',
  templateUrl: './ingredients-management.component.html',
  styleUrls: ['./ingredients-management.component.css'],
  imports: [CommonModule,ReactiveFormsModule,MatButtonModule, MatInputModule,MatCardModule, MatList, MatListItem, MatIconModule, MatFormFieldModule, MatSelect, MatOptionModule, MatDialogModule]
})
export class IngredientsManagementComponent implements OnInit{  
  categoryForm: FormGroup;
  ingredientForm: FormGroup;

  ingredientCategories: IngredientCategory[] = []
  categories: Category[] = [];
  selectedCategoryId?: number;
  ingredients: any[] = []
  categoryErrorMessage: string = ''
  categorySucessfullMessage: string = ''
  isEditingCategory = false;
  isEditingIngredient = false;

  
  editingName?: string;
  editingCategoryId?: number;
  
  filteredIngredients: any[] | undefined = [];
  

  constructor(private fb: FormBuilder, private ingredientCategoryService: IngredientCategoryService) {
    this.categoryForm = this.fb.group({
      id: [0],
      name: ['', Validators.required]
    });

    this.ingredientForm = this.fb.group({
      categoryId: [0, Validators.required],
      ingredientName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchData();
    this.ingredientForm.valueChanges.subscribe({
      next : (response) =>{
        
        const id: number = parseInt(this.ingredientForm.value.categoryId);
        const categoryWithId = this.ingredientCategories.find(category => category.id == id);
        this.selectedCategoryId = id;
        this.filteredIngredients = categoryWithId?.ingredients.map(ing => ing.name);
        
      },
      error : (error) =>{
        console.error(error);
      }
    })
  }

  
  editIngredient(ingredient: string): void {
    this.isEditingIngredient = true;
    this.ingredientForm.patchValue({ ingredientName: ingredient });

    const itemToBeUpdated = {...this.ingredientForm.value};

    this.editingCategoryId = this.ingredientForm.value.categoryId;
    this.editingName = ingredient;

  }

  handleIngredientSubmit(): void {
    

    if (this.ingredientForm.invalid){return;}
    const id: number = parseInt(this.ingredientForm.value.categoryId);
    const ingredient = this.ingredientForm.value.ingredientName;
    const categoryWithId = this.ingredientCategories.find(category => category.id == id);
    
    if(this.isEditingIngredient){
      console.log(this.editingCategoryId, this.editingName);
      
      console.log(this.ingredientCategories[this.editingCategoryId! - 1]);
      this.ingredientCategories[this.editingCategoryId! - 1].ingredients.map(ingredient =>{
        if(ingredient.name === this.editingName){
          ingredient.name = this.ingredientForm.value.ingredientName;
        }
      })

      console.log(categoryWithId);


      this.ingredientCategoryService.saveIngredients(id, categoryWithId).subscribe(
        {
          next: (response) =>{
            console.log(response);
            
          },
          error: (error) => {
            console.error(error);
          } 
        }
      )
      
      return;
      
    }

    categoryWithId?.ingredients.map(name => {
      if(name.name === ingredient){
        throw Error("Ingredient already contained in category");
      }
    })
    console.log(this.isEditingIngredient);
    


    categoryWithId?.ingredients.push({name: ingredient});


    this.ingredientCategoryService.saveIngredients(id, categoryWithId).subscribe(
      {
        next: (response) =>{
          console.log(response);
          
        },
        error: (error) => {
          console.error(error);
        } 
      }
    )


    this.fetchData();
    this.isEditingIngredient = false;
  }
  
  fetchData(){
    this.ingredientCategoryService.getIngredientCategories().subscribe({
      next: (response) =>{
        this.categories = response.map((category) => ({
          id: category.id, 
          name: category.name
        }));

        this.ingredients = response.flatMap(res => res.ingredients.map(ing => ing.name));
        this.ingredientCategories = response;
 
      }
    })
  }

  addCategory(){

    if (this.categoryForm.invalid) {
      return; 
    }
    
    const categoryName = this.categoryForm.value.name;
    this.ingredientCategoryService.saveIngredientCategory(categoryName).subscribe({
      next: (response: any) =>{
        console.log("Category saved sucessfully ", response);
        this.categoryErrorMessage = '';
        this.categorySucessfullMessage = "Sucessfully saved category";

        this.categoryForm.setValue({
          id: 0,
          name: ' '
        })

        this.fetchData();

      },
      error: (error: any) =>{
        console.error("Error saving category ", error);
        this.categoryErrorMessage = error.message;
        this.categorySucessfullMessage = '';
      }
    })
  }

  updateCategory(){
    if(this.categoryForm.invalid){
      return;
    }
    const newCategoryName = this.categoryForm.value.name;
    const categoryId = this.categoryForm.value.id;
    console.log(categoryId);
    
    console.log(newCategoryName);

    const objectToUpdate = {
      id: categoryId,
      name: newCategoryName
    }

    this.ingredientCategoryService.updateIngridientCategoryName(objectToUpdate).subscribe({
      next: (response: any) =>{
        console.log("Category saved sucessfully ", response);
        this.categoryErrorMessage = '';
        this.categorySucessfullMessage = "Sucessfully updated category";

        this.categoryForm.setValue({
          id: 0,
          name: ' '
        })

        this.fetchData();
      },
      error: (error: any) =>{
        console.error("Error updating category ", error);
        this.categoryErrorMessage = error.message;
        this.categorySucessfullMessage = '';
      }
    })
  }

  editCategory(category: Category): void {
    this.categoryForm.setValue({
      id: category.id,
      name: category.name
    })

    this.isEditingCategory = true;
  }

  deleteCategory(id: number): void {
    
    this.ingredientCategoryService.deleteIngredientCategory(id).subscribe({
      next: (response: any) =>{
        console.log("Category deleted sucessfully ", response);
        this.categoryErrorMessage = '';
        this.categorySucessfullMessage = "Sucessfully deleted category";
        this.fetchData();
      },
      error: (error: any) =>{
        console.error("Error deleting category ", error);
        this.categoryErrorMessage = error.message;
        this.categorySucessfullMessage = '';
      }
    })  }     

  deleteIngredient(name: string): void {


    let categoryWithId = this.ingredientCategories.find(category => category.id == this.selectedCategoryId);


    if(categoryWithId?.ingredients && categoryWithId){
      console.log(categoryWithId);
      
      categoryWithId.ingredients = categoryWithId.ingredients.filter(ing => {
        return ing.name != name
      })

      console.log(categoryWithId);
    }


    console.log(categoryWithId);
    

    this.ingredientCategoryService.saveIngredients(this.selectedCategoryId!, categoryWithId).subscribe(
      {
        next: (response) =>{
          console.log(response);
          
        },
        error: (error) => {
          console.error(error);
        } 
      }
    )

    this.fetchData();
  }
  
}