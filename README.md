
# Recipe Planner

A modern web application for managing recipes, meal planning, and generating shopping lists built with Angular Material UI.

## Features

### Recipe Management
- Create and manage recipes with detailed ingredients and instructions
- Upload recipe images
- Categorize recipes by meal type and difficulty
- Mark favorite recipes

### Meal Planning
- Drag and drop interface for weekly meal planning
- Organize meals by breakfast, lunch, and dinner
- Filter recipes by meal type
- Save and clear meal plans

### Shopping List
- Auto-generate shopping lists from meal plans
- Mark items as bought
- Combine ingredients with the same units
- Save shopping lists for later

### Ingredients Management
- Manage ingredient categories and units
- Add, edit, and delete ingredients
- Filter ingredients by category

## Tech Stack

- [Angular 19.0.0](https://angular.dev/tools/cli) 
- Angular Material UI
- JSON Server (Backend Mock)

## Prerequisites

- [Node.js (latest LTS version)](https://nodejs.org/en)
- npm package manager

## Installation

### Clone the Repository
```bash
# Clone the repository
git clone https://github.com/your-username/recipe-planner.git
cd recipe-planner
```

### Install Dependencies
```bash
# To download all needed packages
npm install

# Start both the Angular app and JSON Server
npm start
```

## Development Tips

1. Use VS Code Extensions:
    - Angular Language Service
    - Angular Snippets
    - Material Icon Theme
2. Access points:
    - Frontend:  http://localhost:4200
    - API:  http://localhost:3000
    - API Endpoints:
        - `/recipes`
        - `/ingredients`
        - `/mealPlans`
        - `/shoppingLists`
3. Development workflow:
    - Make changes in VS Code
    - Auto-reload on save
    - Check console for errors
    - Test API with Postman/curl
4. Local Storage:
    - Recipe data persists in `db.json`
    - Clear browser cache if needed

## Project Structure
```
recipe-planner/
├── src/                          # Source files
│   ├── app/                      # Application root
│   │   ├── components/           
│   │   │   ├── recipes/         # Recipe management
│   │   │   │   ├── recipe-list/
│   │   │   │   ├── recipe-detail/
│   │   │   │   └── recipe-form/
│   │   │   ├── meal-planner/    # Meal planning
│   │   │   ├── ingredients/     # Ingredient management
│   │   │   └── shopping-list/   # Shopping list
│   │   ├── services/            # API services
│   │   ├── models/              # TypeScript interfaces
│   │   └── shared/              # Shared components
│   ├── assets/                  # Static files
│   └── styles/                  # Global styles
├── node_modules/                # Dependencies
├── angular.json                 # Angular configuration
├── package.json                 # Project configuration
└── db.json                      # JSON Server database
```

## API Endpoints
```http
GET    /recipes        # List all recipes
POST   /recipes        # Create recipe
GET    /ingredients    # List ingredients
POST   /ingredients    # Add ingredient
GET    /mealPlans      # Get meal plans
POST   /mealPlans      # Create meal plan
GET    /shoppingLists  # Get shopping lists
POST   /shoppingLists  # Create shopping list
```

## Core Functionalities

### Recipe Management
- Create, edit, delete recipes
- Add ingredients and instructions
- Upload recipe images
- Categorize recipes

### Meal Planning
- Weekly meal scheduler
- Recipe assignment
- Meal categories
- Plan saving

### Shopping List
- Auto-generate from meal plans
- Manage ingredients
- Save/load lists

### Ingredient Management
- Ingredient database
- Categories
- Units management

## Commands

- `npm start` - Start Angular development server
- `npm run api` - Start JSON Server
- `npm run build` - Build production version
- `npm test` - Run unit tests
- `npm run lint` - Run linter

## Supported Browsers

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## License

MIT License © 2024
