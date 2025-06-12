# Smart Health Assistant - Site Structure Design

## Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   └── Footer
├── Pages
│   ├── HomePage
│   ├── RecipeFinderPage
│   │   ├── MealTypeSelector
│   │   ├── IngredientsInput
│   │   ├── AllergyInput
│   │   ├── RecipeGenerator
│   │   └── RecipeDisplay
│   │       ├── RecipeCard
│   │       └── ScreenshotButton
│   ├── CaloriesCalculatorPage
│   │   ├── FoodCaloriesSection
│   │   │   ├── FoodInput
│   │   │   └── NutritionDisplay
│   │   └── BodyCaloriesSection
│   │       ├── PersonalDataForm
│   │       └── CalorieNeedsDisplay
│   └── ScreenshotSuccessPage
└── Shared Components
    ├── Button
    ├── Card
    ├── Input
    ├── Dropdown
    └── ResultsDisplay
```

## Navigation Routes

- `/` - Home Page
- `/recipe-finder` - Recipe Finder Page
- `/calories-calculator` - Calories Calculator Page
- `/screenshot-success` - Screenshot Success Page

## Page Layouts

### Home Page
- Hero section with title and brief description
- Two main cards for navigation:
  - Recipe Finder card with icon and description
  - Calories Calculator card with icon and description
- Consistent navbar and footer

### Recipe Finder Page
- Form section with:
  - Meal type dropdown (Breakfast/Lunch/Dinner)
  - Ingredients input field (text or tags)
  - Allergy input field
  - Submit button
- Results section with:
  - 3 recipe cards, each containing:
    - Recipe title
    - Ingredients list
    - Preparation steps
    - Nutrition information table
    - Screenshot button

### Calories Calculator Page
- Tab navigation between two sections:
  - Food Calories Section:
    - Food description input
    - Submit button
    - Results display with nutrition information
  - Body Calories Section:
    - Form with personal data inputs
    - Submit button
    - Results display with calorie needs and recommendations

### Screenshot Success Page
- Success message
- "Back to Home" button
- Consistent navbar and footer

## Shared Elements

### Navbar
- Logo/Site title
- Navigation links:
  - Home
  - Recipe Finder
  - Calories Calculator
- Mobile-responsive hamburger menu

### Footer
- Copyright information
- Project credits
- Optional: links to related resources

## Design Considerations

- **Responsive Design**: All pages will be responsive and work on mobile, tablet, and desktop
- **Accessibility**: Ensure proper contrast, semantic HTML, and keyboard navigation
- **Theme**: Clean, modern health-focused design with a consistent color scheme
- **State Management**: Use React context for sharing data between components when needed
- **Error Handling**: Include error states for form submissions and API calls

## Implementation Plan

1. Set up routing with React Router
2. Create shared layout components (Navbar, Footer)
3. Implement individual pages starting with Home
4. Develop form components for user inputs
5. Implement calculation logic for nutrition and calories
6. Add screenshot functionality
7. Connect all components and test navigation flow
