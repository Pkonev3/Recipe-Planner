import { CommonModule } from '@angular/common';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, DragDropModule} from '@angular/cdk/drag-drop';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Recipe, WeeklyMealPlan } from '../../models/recipe.model';
import { CalendarDay } from '../../models/calendarDay.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MealPlanService } from '../../services/meal-plan.service';


@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, 
          DragDropModule, MatIconModule, MatCardContent,
          MatFormField, MatButtonModule, MatInputModule],
  templateUrl: './meal-planner.component.html',
  styleUrl: './meal-planner.component.css'
})

export class MealPlannerComponent implements OnInit{
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;
  dropListIds: string[] = [];


  searchForm: FormGroup;

  saveMessage: { text: string, type: 'success' | 'error' } | null = null;

  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  filteredMealName: string = 'all';

  calendarDays: CalendarDay[] = [
    {day: "Monday", breakfast: [], lunch: [], dinner: []},
    {day: "Tuesday", breakfast: [], lunch: [], dinner: []},
    {day: "Wednesday", breakfast: [], lunch: [], dinner: []},
    {day: "Thursday", breakfast: [], lunch: [], dinner: []},
    {day: "Friday", breakfast: [], lunch: [], dinner: []},
    {day: "Saturday", breakfast: [], lunch: [], dinner: []},
    {day: "Sunday", breakfast: [], lunch: [], dinner: []}
  ];

  constructor(private recipeService: RecipeService, private mealPlanService: MealPlanService, private fb: FormBuilder){
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }


  ngOnInit() {
    this.calendarDays.forEach((_, index) => {
      this.dropListIds.push(`breakfast-${index}`);
      this.dropListIds.push(`lunch-${index}`);
      this.dropListIds.push(`dinner-${index}`);
    });

    console.log(this.calendarDays)

    this.fetchRecipes();

    this.searchForm.get("searchTerm")?.valueChanges.subscribe({
      next: (term) =>{
        this.searchRecipes(term);
      }
    })
    this.loadMealPlan();
  }

  filterByMealType(meal: string){
    
    if(this.filteredMealName === meal){
      this.filteredMealName = "all";
    }else{
      this.filteredMealName = meal;
    } 

    console.log(this.filteredMealName);
    console.log(meal);

    if(this.filteredMealName === "all"){
      this.filteredRecipes = [...this.recipes];
    }else{
      this.filteredRecipes = this.recipes.filter(recipe => recipe.category === meal);
    }
  
  }

  searchRecipes(term: string){
    console.log(term);
    
    if(this.filteredMealName === "Breakfast" || this.filteredMealName === "Lunch" || this.filteredMealName === "Dinner"){
      this.filteredRecipes = this.recipes.filter(recipe => recipe.name.toLowerCase().includes(term.toLowerCase()) && recipe.category === this.filteredMealName)
    }else if (!term){
      this.filteredRecipes = [...this.recipes]
    }else if (this.filteredMealName === "all"){      
      this.filteredRecipes = this.recipes.filter(recipe => recipe.name.toLowerCase().includes(term.toLowerCase()));
    }
  }

  fetchRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (recipes: Recipe[]) =>{
        this.recipes = recipes;
        this.filteredRecipes = [...recipes];
      },
      error: (error) =>{
        console.error("Error has occured during fetching recipes", error);
      }
    })    
  }
  
  getMealLists() {
    return this.dropListIds;
  }

  onDrop(event: CdkDragDrop<Recipe[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (event.previousContainer.data === this.filteredRecipes) {
        const recipeCopy = JSON.parse(JSON.stringify(event.previousContainer.data[event.previousIndex]));
        console.log("Kopija");
        recipeCopy.ingredients = recipeCopy.ingredients.map((ing: {category: string, name: string, amount: number, unit: string, bought: boolean}) => ({
          ...ing,
          bought: false
        }));

        console.log(recipeCopy);
        
        
        event.container.data.splice(event.currentIndex, 0, recipeCopy);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  saveMealPlan() {
    // Create the data to save
    let mealPlanData: WeeklyMealPlan = {
      dayFrom: new Date().toISOString(), // You might want to add a date picker for this
      dayTo: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), 
      days: this.calendarDays.map(day => ({
        day: day.day,
        meals: {

          breakfast: day.breakfast.map(recipe => ({
            ...recipe,
            ingredients: recipe.ingredients.map(ing => ({...ing, bought: false}))
          })),
          lunch: day.lunch.map(recipe => ({
            ...recipe,
            ingredients: recipe.ingredients.map(ing => ({...ing, bought: false}))
          })),
          dinner: day.dinner.map(recipe => ({
            ...recipe,
            ingredients: recipe.ingredients.map(ing => ({...ing, bought: false}))
          }))
        }
      }))
    };

    this.mealPlanService.saveMealPlan(mealPlanData).subscribe({
      next: (response) =>{
        console.log("Sucessfully saved ", response);
      },
      error: (error) => {
        console.error("Error whie saving saveMealPlan() ", error);
      }
    })
  };

  loadMealPlan() {
    this.mealPlanService.getMealPlan()
      .subscribe({
        next: (response: WeeklyMealPlan) => {
          if(response){
          this.calendarDays = response.days.map(day => ({
            day: day.day,
            breakfast: day.meals.breakfast || [],
            lunch: day.meals.lunch || [],
            dinner: day.meals.dinner || []
          }));
          console.log("Here" ,response);
          
        }else{
          console.log(`Response ${response}`);
        }
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
  
  clearMealPlan() {
    
    const emptyObject: WeeklyMealPlan = {
      dayFrom: new Date().toISOString(),
      dayTo: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      days: this.calendarDays.map(({day}) => ({
        day,
        meals: {breakfast: [], lunch: [], dinner: []}
      }))
    }

    this.mealPlanService.saveMealPlan(emptyObject).subscribe({
      next: (response) =>{
        console.log("Object sucessfully saved ", response);
      },
      error: (error) =>{
        console.error("Object cannot be saved , clearMealPlan() ", error);
      }
    })

    this.calendarDays = this.calendarDays.map(day => ({
      ...day,
      breakfast: [],
      lunch: [],
      dinner: []
    }))
    
}
}