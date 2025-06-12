// AI Recipe Service - Simulated Gemini API
// This service simulates AI-generated recipe responses

interface RecipeNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
  nutrition: RecipeNutrition;
  cookingTime: string;
  servings: number;
}

// Function to generate recipes based on ingredients and meal type
export const generateRecipes = async (
  ingredients: string,
  mealTypes: Record<string, boolean>
): Promise<Recipe[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get selected meal types
  const selectedMealTypes = Object.entries(mealTypes)
    .filter(([_, isSelected]) => isSelected)
    .map(([type]) => type);
  
  // Default to all meal types if none selected
  const mealTypeToUse = selectedMealTypes.length > 0 
    ? selectedMealTypes[0] 
    : 'lunch';
  
  // Parse ingredients from input
  const ingredientsList = ingredients
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  // Generate recipes based on ingredients and meal type
  return simulateGeminiResponse(ingredientsList, mealTypeToUse);
};

// Simulate Gemini AI response
const simulateGeminiResponse = (
  ingredientsList: string[],
  mealType: string
): Recipe[] => {
  // Use ingredients to determine recipe types
  const hasProtein = ingredientsList.some(i => 
    ['chicken', 'beef', 'fish', 'tofu', 'eggs', 'meat', 'pork', 'turkey', 'lamb', 'shrimp'].some(p => 
      i.toLowerCase().includes(p)
    )
  );
  
  const hasVegetables = ingredientsList.some(i => 
    ['spinach', 'broccoli', 'carrot', 'tomato', 'lettuce', 'vegetable', 'onion', 'pepper', 'cucumber', 'zucchini', 'eggplant', 'celery'].some(v => 
      i.toLowerCase().includes(v)
    )
  );
  
  const hasCarbs = ingredientsList.some(i => 
    ['rice', 'pasta', 'bread', 'potato', 'noodle', 'flour', 'quinoa', 'oats', 'barley', 'corn'].some(c => 
      i.toLowerCase().includes(c)
    )
  );

  const hasFruits = ingredientsList.some(i => 
    ['apple', 'banana', 'orange', 'berry', 'strawberry', 'blueberry', 'raspberry', 'mango', 'pineapple', 'peach', 'pear', 'grape', 'melon', 'watermelon', 'kiwi', 'avocado'].some(f => 
      i.toLowerCase().includes(f)
    )
  );

  const hasDairy = ingredientsList.some(i => 
    ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'dairy'].some(d => 
      i.toLowerCase().includes(d)
    )
  );

  const hasNuts = ingredientsList.some(i => 
    ['nut', 'almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'peanut'].some(n => 
      i.toLowerCase().includes(n)
    )
  );

  // Identify specific ingredients
  const specificIngredients = identifySpecificIngredients(ingredientsList);

  // Generate appropriate recipes based on available ingredients
  const recipes: Recipe[] = [];
  
  // Recipe 1
  if (mealType === 'breakfast') {
    recipes.push(generateBreakfastRecipe(ingredientsList, hasProtein, hasVegetables, hasCarbs, hasFruits, hasDairy, hasNuts, specificIngredients));
  } else if (mealType === 'lunch') {
    recipes.push(generateLunchRecipe(ingredientsList, hasProtein, hasVegetables, hasCarbs, hasFruits, hasDairy, hasNuts, specificIngredients));
  } else if (mealType === 'dinner') {
    recipes.push(generateDinnerRecipe(ingredientsList, hasProtein, hasVegetables, hasCarbs, hasFruits, hasDairy, hasNuts, specificIngredients));
  } else if (mealType === 'snack') {
    recipes.push(generateSnackRecipe(ingredientsList, hasProtein, hasVegetables, hasCarbs, hasFruits, hasDairy, hasNuts, specificIngredients));
  }
  
  // Always add a second recipe option
  recipes.push(generateAlternativeRecipe(ingredientsList, mealType, specificIngredients));
  
  // Add a third healthy option
  recipes.push(generateHealthyRecipe(ingredientsList, mealType, specificIngredients));
  
  return recipes;
};

// Helper function to identify specific ingredients from the list
const identifySpecificIngredients = (ingredientsList: string[]): Record<string, string> => {
  const result: Record<string, string> = {};
  
  // Protein types
  const proteinTypes = [
    'chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 
    'salmon', 'tuna', 'shrimp', 'tofu', 'eggs', 'bacon', 'ham', 'sausage'
  ];
  
  // Vegetable types
  const vegetableTypes = [
    'spinach', 'broccoli', 'carrot', 'tomato', 'lettuce', 'onion', 
    'pepper', 'cucumber', 'zucchini', 'eggplant', 'celery', 'potato',
    'sweet potato', 'garlic', 'mushroom', 'asparagus', 'kale'
  ];
  
  // Fruit types
  const fruitTypes = [
    'apple', 'banana', 'orange', 'strawberry', 'blueberry', 'raspberry',
    'mango', 'pineapple', 'peach', 'pear', 'grape', 'watermelon', 'kiwi', 'avocado'
  ];
  
  // Carb types
  const carbTypes = [
    'rice', 'pasta', 'bread', 'potato', 'noodle', 'flour', 'quinoa', 
    'oats', 'barley', 'corn', 'tortilla', 'couscous'
  ];
  
  // Dairy types
  const dairyTypes = [
    'milk', 'cheese', 'yogurt', 'cream', 'butter', 'sour cream', 'cottage cheese'
  ];
  
  // Nut types
  const nutTypes = [
    'almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'peanut', 'hazelnut'
  ];
  
  // Check for each ingredient type
  for (const ingredient of ingredientsList) {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Check protein
    for (const protein of proteinTypes) {
      if (lowerIngredient.includes(protein)) {
        result.protein = protein;
        break;
      }
    }
    
    // Check vegetables
    for (const vegetable of vegetableTypes) {
      if (lowerIngredient.includes(vegetable)) {
        result.vegetable = vegetable;
        break;
      }
    }
    
    // Check fruits
    for (const fruit of fruitTypes) {
      if (lowerIngredient.includes(fruit)) {
        result.fruit = fruit;
        break;
      }
    }
    
    // Check carbs
    for (const carb of carbTypes) {
      if (lowerIngredient.includes(carb)) {
        result.carb = carb;
        break;
      }
    }
    
    // Check dairy
    for (const dairy of dairyTypes) {
      if (lowerIngredient.includes(dairy)) {
        result.dairy = dairy;
        break;
      }
    }
    
    // Check nuts
    for (const nut of nutTypes) {
      if (lowerIngredient.includes(nut)) {
        result.nut = nut;
        break;
      }
    }
  }
  
  return result;
};

// Helper functions to generate specific recipe types
const generateBreakfastRecipe = (
  ingredients: string[], 
  hasProtein: boolean, 
  hasVegetables: boolean, 
  hasCarbs: boolean,
  hasFruits: boolean,
  hasDairy: boolean,
  hasNuts: boolean,
  specificIngredients: Record<string, string>
): Recipe => {
  // Prioritize user ingredients in recipe
  if (specificIngredients.protein === 'eggs' || (hasProtein && ingredients.some(i => i.toLowerCase().includes('egg')))) {
    let title = 'Vegetable Omelette';
    let recipeIngredients = [
      '3 eggs',
      '1/4 cup diced bell peppers',
      '1/4 cup diced onions',
      '1/4 cup diced tomatoes',
      '1/4 cup spinach',
      '1 tbsp olive oil',
      'Salt and pepper to taste'
    ];
    
    // Customize with user ingredients
    if (specificIngredients.vegetable) {
      title = `${capitalizeFirstLetter(specificIngredients.vegetable)} Omelette`;
      recipeIngredients.push(`1/4 cup diced ${specificIngredients.vegetable}`);
    }
    
    if (specificIngredients.dairy && specificIngredients.dairy !== 'milk') {
      recipeIngredients.push(`2 tbsp ${specificIngredients.dairy}`);
    }
    
    return {
      title: title,
      ingredients: recipeIngredients,
      steps: [
        'Heat olive oil in a non-stick pan over medium heat.',
        'Sauté diced vegetables until softened, about 3-4 minutes.',
        'Beat eggs in a bowl, season with salt and pepper.',
        'Pour eggs over vegetables in the pan.',
        'Cook until edges are set, then fold omelette in half.',
        'Cook for another minute until eggs are fully set but still moist.',
        'Serve immediately.'
      ],
      nutrition: {
        calories: 285,
        protein: 18,
        fat: 22,
        carbs: 6
      },
      cookingTime: '15 minutes',
      servings: 1
    };
  } else if (specificIngredients.protein && ['bacon', 'ham', 'sausage'].includes(specificIngredients.protein)) {
    return {
      title: `${capitalizeFirstLetter(specificIngredients.protein)} and Egg Breakfast Sandwich`,
      ingredients: [
        `4 slices ${specificIngredients.protein}`,
        '4 eggs',
        '2 English muffins, split and toasted',
        '2 slices cheese',
        '1 tbsp butter',
        'Salt and pepper to taste'
      ],
      steps: [
        `Cook ${specificIngredients.protein} in a skillet until crispy, about 5 minutes. Remove and set aside.`,
        'In the same skillet, melt butter over medium heat.',
        'Crack eggs into the skillet and cook to desired doneness.',
        'Season eggs with salt and pepper.',
        'Place a slice of cheese on each bottom half of English muffin.',
        `Top with cooked eggs and ${specificIngredients.protein}.`,
        'Add the top half of the English muffin.',
        'Serve hot.'
      ],
      nutrition: {
        calories: 450,
        protein: 22,
        fat: 24,
        carbs: 38
      },
      cookingTime: '15 minutes',
      servings: 2
    };
  } else if (hasFruits && hasDairy) {
    let title = 'Fruit and Yogurt Parfait';
    let fruitType = specificIngredients.fruit || 'mixed berries';
    
    return {
      title: `${capitalizeFirstLetter(fruitType)} and Yogurt Parfait`,
      ingredients: [
        '1 cup Greek yogurt',
        `1/2 cup ${fruitType}`,
        '1/4 cup granola',
        '1 tbsp honey',
        '1 tsp chia seeds'
      ],
      steps: [
        'In a glass or bowl, layer half of the yogurt at the bottom.',
        `Add a layer of ${fruitType}.`,
        'Sprinkle half of the granola.',
        'Repeat layers with remaining yogurt and fruit.',
        'Top with remaining granola and chia seeds.',
        'Drizzle honey over the top.',
        'Serve immediately or refrigerate for up to 1 hour.'
      ],
      nutrition: {
        calories: 310,
        protein: 20,
        fat: 8,
        carbs: 42
      },
      cookingTime: '5 minutes',
      servings: 1
    };
  } else if (hasCarbs) {
    let carbType = specificIngredients.carb || 'oatmeal';
    let title = `${capitalizeFirstLetter(carbType)} Breakfast Bowl`;
    
    return {
      title: title,
      ingredients: [
        `1 cup cooked ${carbType}`,
        '1 banana, sliced',
        '1/4 cup berries',
        '1 tbsp honey or maple syrup',
        '2 tbsp chopped nuts',
        '1 tsp cinnamon',
        '1 cup milk or plant-based alternative'
      ],
      steps: [
        `Cook ${carbType} according to package instructions.`,
        'Transfer to a serving bowl.',
        'Top with sliced banana, berries, and chopped nuts.',
        'Drizzle with honey or maple syrup.',
        'Sprinkle with cinnamon.',
        'Pour milk around the edges.',
        'Serve warm.'
      ],
      nutrition: {
        calories: 420,
        protein: 12,
        fat: 10,
        carbs: 75
      },
      cookingTime: '10 minutes',
      servings: 1
    };
  } else {
    return {
      title: 'Simple Breakfast Toast',
      ingredients: [
        '2 slices whole grain bread',
        '1 tbsp butter or olive oil',
        '1 tsp honey or jam',
        'Pinch of cinnamon or salt (optional)'
      ],
      steps: [
        'Toast bread slices until golden brown.',
        'Spread with butter or drizzle with olive oil.',
        'Top with honey or jam.',
        'Sprinkle with cinnamon for sweet toast or salt for savory toast.',
        'Serve immediately.'
      ],
      nutrition: {
        calories: 220,
        protein: 6,
        fat: 8,
        carbs: 32
      },
      cookingTime: '5 minutes',
      servings: 1
    };
  }
};

const generateLunchRecipe = (
  ingredients: string[], 
  hasProtein: boolean, 
  hasVegetables: boolean, 
  hasCarbs: boolean,
  hasFruits: boolean,
  hasDairy: boolean,
  hasNuts: boolean,
  specificIngredients: Record<string, string>
): Recipe => {
  if (specificIngredients.protein && hasVegetables) {
    const proteinType = specificIngredients.protein;
    const vegetableType = specificIngredients.vegetable || 'mixed vegetables';
    
    const title = proteinType === 'chicken' ? `Grilled Chicken and ${capitalizeFirstLetter(vegetableType)} Salad` :
                 proteinType === 'beef' ? `Beef and ${capitalizeFirstLetter(vegetableType)} Stir-Fry` :
                 proteinType === 'pork' ? `Pork and ${capitalizeFirstLetter(vegetableType)} Skewers` :
                 proteinType === 'turkey' ? `Turkey and ${capitalizeFirstLetter(vegetableType)} Wrap` :
                 proteinType === 'fish' || proteinType === 'salmon' || proteinType === 'tuna' ? `Grilled ${capitalizeFirstLetter(proteinType)} with ${capitalizeFirstLetter(vegetableType)}` :
                 proteinType === 'shrimp' ? `Shrimp and ${capitalizeFirstLetter(vegetableType)} Pasta` :
                 proteinType === 'tofu' ? `Tofu and ${capitalizeFirstLetter(vegetableType)} Stir-Fry` :
                 `${capitalizeFirstLetter(proteinType)} and ${capitalizeFirstLetter(vegetableType)} Bowl`;
    
    return {
      title: title,
      ingredients: [
        `6 oz ${proteinType}`,
        `2 cups ${vegetableType}`,
        '1/4 cup sauce or dressing',
        '2 tbsp olive oil',
        'Herbs and spices to taste',
        'Salt and pepper to taste'
      ],
      steps: [
        `Prepare ${proteinType} by cutting into appropriate pieces.`,
        'Season with salt, pepper, and desired spices.',
        'Heat olive oil in a pan over medium heat.',
        `Cook ${proteinType} until done (internal temperature varies by protein type).`,
        `Add ${vegetableType} and cook until tender.`,
        'Add sauce or dressing and toss to coat.',
        'Adjust seasoning as needed.',
        'Serve hot.'
      ],
      nutrition: {
        calories: 380,
        protein: 35,
        fat: 22,
        carbs: 10
      },
      cookingTime: '20 minutes',
      servings: 1
    };
  } else if (hasCarbs && hasVegetables) {
    const carbType = specificIngredients.carb || 'pasta';
    const vegetableType = specificIngredients.vegetable || 'mixed vegetables';
    
    return {
      title: `${capitalizeFirstLetter(vegetableType)} ${capitalizeFirstLetter(carbType)} Salad`,
      ingredients: [
        `2 cups cooked ${carbType}`,
        `1 cup ${vegetableType}, prepared appropriately`,
        '1/2 cup cucumber, diced',
        '1/4 cup red onion, diced',
        '1/4 cup olives, sliced',
        '1/4 cup feta cheese, crumbled',
        '2 tbsp olive oil',
        '1 tbsp lemon juice',
        '1 tsp dried herbs',
        'Salt and pepper to taste'
      ],
      steps: [
        `Cook ${carbType} according to package instructions. Drain and cool.`,
        `In a large bowl, combine cooled ${carbType}, ${vegetableType}, cucumber, red onion, and olives.`,
        'In a small bowl, whisk together olive oil, lemon juice, herbs, salt, and pepper.',
        'Pour dressing over mixture and toss to coat.',
        'Sprinkle with crumbled feta cheese.',
        'Refrigerate for at least 30 minutes before serving.',
        'Serve chilled.'
      ],
      nutrition: {
        calories: 420,
        protein: 12,
        fat: 18,
        carbs: 55
      },
      cookingTime: '15 minutes (plus chilling time)',
      servings: 2
    };
  } else if (hasFruits && hasNuts) {
    const fruitType = specificIngredients.fruit || 'mixed berries';
    const nutType = specificIngredients.nut || 'mixed nuts';
    
    return {
      title: `${capitalizeFirstLetter(fruitType)} and ${capitalizeFirstLetter(nutType)} Salad`,
      ingredients: [
        '4 cups mixed greens',
        `1 cup ${fruitType}, prepared appropriately`,
        `1/4 cup ${nutType}, chopped`,
        '1/4 cup feta or goat cheese, crumbled',
        '2 tbsp olive oil',
        '1 tbsp balsamic vinegar',
        '1 tsp honey',
        'Salt and pepper to taste'
      ],
      steps: [
        'In a large bowl, combine mixed greens, prepared fruit, and nuts.',
        'In a small bowl, whisk together olive oil, balsamic vinegar, honey, salt, and pepper.',
        'Pour dressing over salad and toss gently.',
        'Top with crumbled cheese.',
        'Serve immediately.'
      ],
      nutrition: {
        calories: 320,
        protein: 8,
        fat: 24,
        carbs: 22
      },
      cookingTime: '10 minutes',
      servings: 2
    };
  } else {
    return {
      title: 'Simple Sandwich',
      ingredients: [
        '2 slices bread',
        '2 tbsp spread (hummus, mayo, or mustard)',
        '1/2 cup lettuce or greens',
        '1/4 cup sliced vegetables',
        'Salt and pepper to taste',
        'Optional: 2 oz protein (cheese, deli meat, or tofu)'
      ],
      steps: [
        'Spread condiment of choice on both slices of bread.',
        'Layer lettuce or greens on one slice.',
        'Add sliced vegetables and optional protein.',
        'Season with salt and pepper if desired.',
        'Top with second slice of bread.',
        'Cut in half and serve.'
      ],
      nutrition: {
        calories: 280,
        protein: 10,
        fat: 12,
        carbs: 35
      },
      cookingTime: '5 minutes',
      servings: 1
    };
  }
};

const generateDinnerRecipe = (
  ingredients: string[], 
  hasProtein: boolean, 
  hasVegetables: boolean, 
  hasCarbs: boolean,
  hasFruits: boolean,
  hasDairy: boolean,
  hasNuts: boolean,
  specificIngredients: Record<string, string>
): Recipe => {
  if (specificIngredients.protein && hasCarbs) {
    const proteinType = specificIngredients.protein;
    const carbType = specificIngredients.carb || 'rice';
    
    const title = proteinType === 'chicken' ? `One-Pot Chicken and ${capitalizeFirstLetter(carbType)}` :
                 proteinType === 'beef' ? `Beef and Vegetable Stew with ${capitalizeFirstLetter(carbType)}` :
                 proteinType === 'pork' ? `Pork Chops with ${capitalizeFirstLetter(carbType)}` :
                 proteinType === 'turkey' ? `Turkey and Vegetable ${capitalizeFirstLetter(carbType)} Casserole` :
                 proteinType === 'fish' || proteinType === 'salmon' ? `Baked ${capitalizeFirstLetter(proteinType)} with ${capitalizeFirstLetter(carbType)}` :
                 proteinType === 'shrimp' ? `Shrimp Scampi with ${capitalizeFirstLetter(carbType)}` :
                 proteinType === 'tofu' ? `Tofu Stir-Fry with ${capitalizeFirstLetter(carbType)}` :
                 `${capitalizeFirstLetter(proteinType)} and ${capitalizeFirstLetter(carbType)} Dinner`;
    
    return {
      title: title,
      ingredients: [
        `1 lb ${proteinType}`,
        `1 cup ${carbType}`,
        '2 cups broth',
        '1 onion, diced',
        '2 cloves garlic, minced',
        '1 bell pepper, diced',
        '1 carrot, diced',
        '1 tbsp olive oil',
        'Herbs and spices to taste',
        'Salt and pepper to taste'
      ],
      steps: [
        'Heat olive oil in a large pot over medium-high heat.',
        `Season ${proteinType} with salt, pepper, and desired spices.`,
        `Add ${proteinType} to the pot and cook until browned.`,
        'Add diced onion and garlic, cook until softened.',
        'Add vegetables and cook for another 2 minutes.',
        `Add ${carbType} and coat with oil.`,
        'Pour in broth and bring to a boil.',
        `Reduce heat, cover, and simmer until ${carbType} is tender and liquid is absorbed.`,
        'Let stand, covered, for 5 minutes before serving.',
        'Garnish with fresh herbs if desired.'
      ],
      nutrition: {
        calories: 450,
        protein: 30,
        fat: 15,
        carbs: 45
      },
      cookingTime: '35 minutes',
      servings: 4
    };
  } else if (specificIngredients.protein && hasVegetables) {
    const proteinType = specificIngredients.protein;
    const vegetableType = specificIngredients.vegetable || 'mixed vegetables';
    
    const title = proteinType === 'chicken' ? `Herb-Roasted Chicken with ${capitalizeFirstLetter(vegetableType)}` :
                 proteinType === 'beef' ? `Beef and ${capitalizeFirstLetter(vegetableType)} Stir-Fry` :
                 proteinType === 'pork' ? `Pork Tenderloin with Roasted ${capitalizeFirstLetter(vegetableType)}` :
                 proteinType === 'turkey' ? `Turkey Meatballs with ${capitalizeFirstLetter(vegetableType)} Sauce` :
                 proteinType === 'fish' || proteinType === 'salmon' ? `Herb-Crusted ${capitalizeFirstLetter(proteinType)} with Roasted ${capitalizeFirstLetter(vegetableType)}` :
                 proteinType === 'shrimp' ? `Garlic Shrimp with Sautéed ${capitalizeFirstLetter(vegetableType)}` :
                 proteinType === 'tofu' ? `Tofu and ${capitalizeFirstLetter(vegetableType)} Stir-Fry` :
                 `${capitalizeFirstLetter(proteinType)} with Roasted ${capitalizeFirstLetter(vegetableType)}`;
    
    return {
      title: title,
      ingredients: [
        `1 lb ${proteinType}`,
        `2 cups ${vegetableType}`,
        '2 tbsp olive oil',
        '2 cloves garlic, minced',
        'Herbs and spices to taste',
        'Salt and pepper to taste',
        'Lemon wedges for serving'
      ],
      steps: [
        'Preheat oven to 425°F (220°C).',
        `Prepare ${vegetableType} by cutting into appropriate pieces.`,
        'Toss vegetables with 1 tbsp olive oil, salt, and pepper.',
        'Spread vegetables on a baking sheet.',
        `Season ${proteinType} with salt, pepper, and desired herbs.`,
        `Cook ${proteinType} using appropriate method (baking, grilling, sautéing).`,
        'Roast vegetables until tender and slightly caramelized.',
        'Serve protein with roasted vegetables and lemon wedges.'
      ],
      nutrition: {
        calories: 380,
        protein: 34,
        fat: 22,
        carbs: 12
      },
      cookingTime: '30 minutes',
      servings: 4
    };
  } else if (hasVegetables && hasCarbs) {
    const vegetableType = specificIngredients.vegetable || 'mixed vegetables';
    const carbType = specificIngredients.carb || 'rice';
    
    return {
      title: `Roasted ${capitalizeFirstLetter(vegetableType)} with ${capitalizeFirstLetter(carbType)}`,
      ingredients: [
        `2 cups ${vegetableType}`,
        `1 cup ${carbType}`,
        '2 tbsp olive oil',
        '2 cloves garlic, minced',
        '1 tsp dried herbs',
        'Salt and pepper to taste',
        '1/4 cup vegetable broth',
        '2 tbsp lemon juice'
      ],
      steps: [
        'Preheat oven to 425°F (220°C).',
        `Prepare ${vegetableType} by cutting into appropriate pieces.`,
        'Toss vegetables with 1 tbsp olive oil, garlic, herbs, salt, and pepper.',
        'Spread vegetables on a baking sheet.',
        'Roast for 20-25 minutes until tender and caramelized.',
        `Meanwhile, cook ${carbType} according to package instructions.`,
        `In a large bowl, combine roasted ${vegetableType} with cooked ${carbType}.`,
        'Drizzle with remaining olive oil and lemon juice.',
        'Add vegetable broth for moisture if needed.',
        'Adjust seasoning and serve hot.'
      ],
      nutrition: {
        calories: 320,
        protein: 8,
        fat: 12,
        carbs: 48
      },
      cookingTime: '35 minutes',
      servings: 2
    };
  } else {
    return {
      title: 'Simple Vegetable Soup',
      ingredients: [
        '4 cups vegetable broth',
        '1 onion, diced',
        '2 carrots, diced',
        '2 celery stalks, diced',
        '1 potato, diced',
        '1 cup green beans, trimmed and cut',
        '1 can (14 oz) diced tomatoes',
        '2 cloves garlic, minced',
        '1 bay leaf',
        '1 tsp dried thyme',
        '2 tbsp olive oil',
        'Salt and pepper to taste',
        '2 tbsp fresh parsley, chopped'
      ],
      steps: [
        'Heat olive oil in a large pot over medium heat.',
        'Add onion, carrots, and celery. Cook until softened, about 5 minutes.',
        'Add garlic and cook for another minute.',
        'Add potato, green beans, diced tomatoes, bay leaf, and thyme.',
        'Pour in vegetable broth and bring to a boil.',
        'Reduce heat, cover, and simmer for 20 minutes until vegetables are tender.',
        'Season with salt and pepper to taste.',
        'Remove bay leaf before serving.',
        'Garnish with fresh parsley.'
      ],
      nutrition: {
        calories: 220,
        protein: 5,
        fat: 8,
        carbs: 35
      },
      cookingTime: '35 minutes',
      servings: 4
    };
  }
};

const generateSnackRecipe = (
  ingredients: string[], 
  hasProtein: boolean, 
  hasVegetables: boolean, 
  hasCarbs: boolean,
  hasFruits: boolean,
  hasDairy: boolean,
  hasNuts: boolean,
  specificIngredients: Record<string, string>
): Recipe => {
  if (specificIngredients.protein) {
    const proteinType = specificIngredients.protein;
    
    const title = proteinType === 'chicken' ? 'Chicken and Vegetable Skewers' :
                 proteinType === 'beef' ? 'Beef Jerky Bites' :
                 proteinType === 'pork' ? 'Pork Rinds with Dip' :
                 proteinType === 'turkey' ? 'Turkey Roll-Ups' :
                 proteinType === 'eggs' ? 'Deviled Eggs' :
                 proteinType === 'tuna' ? 'Tuna Salad Cucumber Bites' :
                 `${capitalizeFirstLetter(proteinType)} Protein Snack`;
    
    return {
      title: title,
      ingredients: [
        `1 cup ${proteinType}`,
        '1/2 cup complementary ingredients',
        '1/4 cup sauce or seasoning',
        'Herbs and spices to taste',
        'Vegetables for serving'
      ],
      steps: [
        `Prepare ${proteinType} by cutting into appropriate pieces.`,
        'Mix with seasonings or sauce.',
        'Arrange on serving plate with vegetables.',
        'Refrigerate until ready to serve.',
        'Serve chilled or at room temperature.'
      ],
      nutrition: {
        calories: 120,
        protein: 15,
        fat: 7,
        carbs: 5
      },
      cookingTime: '15 minutes',
      servings: 4
    };
  } else if (hasVegetables) {
    const vegetableType = specificIngredients.vegetable || 'mixed vegetables';
    
    return {
      title: `${capitalizeFirstLetter(vegetableType)} Hummus Cups`,
      ingredients: [
        '1 cup hummus',
        `1 cup ${vegetableType}, prepared appropriately`,
        '1 bell pepper, sliced',
        '1 carrot, cut into sticks',
        '2 tbsp olive oil',
        '1 tsp lemon juice',
        'Salt and pepper to taste',
        'Fresh herbs for garnish'
      ],
      steps: [
        'Divide hummus into small serving cups or bowls.',
        'Arrange vegetable slices and sticks for dipping.',
        'Drizzle vegetables with a mixture of olive oil and lemon juice.',
        'Season with salt and pepper.',
        'Garnish with fresh herbs.',
        'Serve immediately or refrigerate for up to 24 hours.'
      ],
      nutrition: {
        calories: 180,
        protein: 6,
        fat: 12,
        carbs: 14
      },
      cookingTime: '10 minutes',
      servings: 4
    };
  } else if (hasFruits && hasNuts) {
    const fruitType = specificIngredients.fruit || 'mixed berries';
    const nutType = specificIngredients.nut || 'mixed nuts';
    
    return {
      title: `${capitalizeFirstLetter(fruitType)} and ${capitalizeFirstLetter(nutType)} Trail Mix`,
      ingredients: [
        `1/2 cup ${nutType}`,
        `1/2 cup dried ${fruitType}`,
        '1/4 cup dark chocolate chips',
        '1/4 cup seeds',
        '1/4 tsp cinnamon',
        '1/8 tsp sea salt'
      ],
      steps: [
        'Combine all ingredients in a large bowl.',
        'Mix well to distribute evenly.',
        'Store in an airtight container.',
        'Portion into small bags or containers for on-the-go snacking.'
      ],
      nutrition: {
        calories: 150,
        protein: 5,
        fat: 10,
        carbs: 12
      },
      cookingTime: '5 minutes',
      servings: 8
    };
  } else {
    return {
      title: 'Simple Crackers and Dip',
      ingredients: [
        '1 cup whole grain crackers',
        '1/2 cup hummus or dip of choice',
        '1/4 cup sliced vegetables (optional)',
        'Herbs and spices for garnish'
      ],
      steps: [
        'Arrange crackers on a serving plate.',
        'Place dip in a small bowl in the center.',
        'Surround with sliced vegetables if using.',
        'Garnish dip with herbs or spices if desired.',
        'Serve immediately.'
      ],
      nutrition: {
        calories: 180,
        protein: 5,
        fat: 8,
        carbs: 22
      },
      cookingTime: '5 minutes',
      servings: 2
    };
  }
};

const generateAlternativeRecipe = (
  ingredients: string[], 
  mealType: string,
  specificIngredients: Record<string, string>
): Recipe => {
  if (mealType === 'breakfast') {
    return {
      title: 'Breakfast Burrito',
      ingredients: [
        '2 large flour tortillas',
        '4 eggs, scrambled',
        '1/4 cup black beans, rinsed and drained',
        '1/4 cup diced bell peppers',
        '1/4 cup diced onions',
        '1/4 cup shredded cheese',
        '2 tbsp salsa',
        '1 avocado, sliced',
        'Salt and pepper to taste',
        'Hot sauce (optional)'
      ],
      steps: [
        'Heat a non-stick pan over medium heat.',
        'Sauté diced bell peppers and onions until softened, about 3-4 minutes.',
        'Add black beans and heat through.',
        'Pour beaten eggs into the pan and scramble until just set.',
        'Warm tortillas in the microwave for 20 seconds or in a dry pan.',
        'Divide egg mixture between tortillas.',
        'Top with shredded cheese, salsa, and avocado slices.',
        'Season with salt, pepper, and hot sauce if desired.',
        'Fold in sides of tortilla, then roll up from bottom.',
        'Serve immediately or wrap in foil to take on the go.'
      ],
      nutrition: {
        calories: 450,
        protein: 22,
        fat: 24,
        carbs: 38
      },
      cookingTime: '20 minutes',
      servings: 2
    };
  } else if (mealType === 'lunch') {
    return {
      title: 'Quinoa Bowl with Roasted Vegetables',
      ingredients: [
        '1 cup quinoa, rinsed',
        '2 cups vegetable broth',
        '1 cup sweet potato, diced',
        '1 cup broccoli florets',
        '1 bell pepper, diced',
        '1 red onion, sliced',
        '2 tbsp olive oil',
        '1 tsp cumin',
        '1 tsp paprika',
        '1/2 tsp garlic powder',
        'Salt and pepper to taste',
        '1/4 cup tahini',
        '2 tbsp lemon juice',
        '1 tbsp water',
        '1 clove garlic, minced'
      ],
      steps: [
        'Preheat oven to 425°F (220°C).',
        'In a medium saucepan, combine quinoa and vegetable broth. Bring to a boil, then reduce heat and simmer for 15 minutes until liquid is absorbed.',
        'Toss sweet potato, broccoli, bell pepper, and red onion with olive oil, cumin, paprika, garlic powder, salt, and pepper.',
        'Spread vegetables on a baking sheet and roast for 20-25 minutes, stirring halfway through.',
        'In a small bowl, whisk together tahini, lemon juice, water, and minced garlic to make the dressing.',
        'Fluff quinoa with a fork and divide between bowls.',
        'Top with roasted vegetables.',
        'Drizzle with tahini dressing.',
        'Serve warm.'
      ],
      nutrition: {
        calories: 380,
        protein: 12,
        fat: 18,
        carbs: 45
      },
      cookingTime: '35 minutes',
      servings: 2
    };
  } else if (mealType === 'dinner') {
    const proteinOption = specificIngredients.protein || 'chicken';
    return {
      title: `${capitalizeFirstLetter(proteinOption)} Fajitas`,
      ingredients: [
        `1 lb ${proteinOption}, sliced into strips`,
        '2 bell peppers, sliced',
        '1 onion, sliced',
        '2 tbsp olive oil',
        '2 cloves garlic, minced',
        '1 tsp cumin',
        '1 tsp chili powder',
        '1/2 tsp paprika',
        'Salt and pepper to taste',
        '8 small flour tortillas',
        '1/2 cup sour cream',
        '1/2 cup guacamole',
        '1/2 cup salsa',
        '1/2 cup shredded cheese'
      ],
      steps: [
        'In a bowl, combine cumin, chili powder, paprika, salt, and pepper.',
        `Toss ${proteinOption} strips with half of the spice mixture.`,
        'Heat 1 tbsp olive oil in a large skillet over medium-high heat.',
        `Cook ${proteinOption} strips until browned and cooked through, about 5-7 minutes. Remove from skillet.`,
        'Add remaining olive oil to the skillet.',
        'Add bell peppers and onion, sprinkle with remaining spice mixture.',
        'Cook until vegetables are tender-crisp, about 5-6 minutes.',
        `Return ${proteinOption} to the skillet and toss with vegetables.`,
        'Warm tortillas according to package instructions.',
        `Serve ${proteinOption} and vegetable mixture with tortillas, sour cream, guacamole, salsa, and shredded cheese.`
      ],
      nutrition: {
        calories: 420,
        protein: 28,
        fat: 22,
        carbs: 30
      },
      cookingTime: '30 minutes',
      servings: 4
    };
  } else {
    return {
      title: 'Greek Yogurt Parfait',
      ingredients: [
        '2 cups Greek yogurt',
        '1 cup mixed berries',
        '1/2 cup granola',
        '2 tbsp honey',
        '1 tbsp chia seeds',
        '1/2 tsp vanilla extract',
        'Mint leaves for garnish'
      ],
      steps: [
        'Mix Greek yogurt with vanilla extract.',
        'In serving glasses, create alternating layers of yogurt and berries.',
        'Top with granola and chia seeds.',
        'Drizzle with honey.',
        'Garnish with mint leaves.',
        'Serve immediately or refrigerate for up to 2 hours.'
      ],
      nutrition: {
        calories: 220,
        protein: 15,
        fat: 8,
        carbs: 25
      },
      cookingTime: '10 minutes',
      servings: 4
    };
  }
};

const generateHealthyRecipe = (
  ingredients: string[], 
  mealType: string,
  specificIngredients: Record<string, string>
): Recipe => {
  if (mealType === 'breakfast') {
    const fruitType = specificIngredients.fruit || 'banana';
    
    return {
      title: 'Green Smoothie Bowl',
      ingredients: [
        `1 frozen ${fruitType}`,
        '1 cup spinach',
        '1/2 avocado',
        '1/2 cup Greek yogurt',
        '1/4 cup almond milk',
        '1 tbsp honey',
        '1/4 cup granola',
        '1 tbsp chia seeds',
        '1/4 cup berries'
      ],
      steps: [
        `In a blender, combine frozen ${fruitType}, spinach, avocado, Greek yogurt, almond milk, and honey.`,
        'Blend until smooth and creamy.',
        'Pour into a bowl.',
        'Top with granola, chia seeds, and berries.',
        'Serve immediately.'
      ],
      nutrition: {
        calories: 320,
        protein: 14,
        fat: 15,
        carbs: 38
      },
      cookingTime: '10 minutes',
      servings: 1
    };
  } else if (mealType === 'lunch') {
    const vegetableType = specificIngredients.vegetable || 'cucumber';
    
    return {
      title: `Mediterranean Chickpea and ${capitalizeFirstLetter(vegetableType)} Salad`,
      ingredients: [
        '1 can (15 oz) chickpeas, drained and rinsed',
        `1 cup ${vegetableType}, prepared appropriately`,
        '1 cup cherry tomatoes, halved',
        '1/2 red onion, finely diced',
        '1/4 cup feta cheese, crumbled',
        '1/4 cup kalamata olives, pitted and sliced',
        '1/4 cup fresh parsley, chopped',
        '3 tbsp olive oil',
        '2 tbsp lemon juice',
        '1 clove garlic, minced',
        '1 tsp dried oregano',
        'Salt and pepper to taste'
      ],
      steps: [
        `In a large bowl, combine chickpeas, ${vegetableType}, cherry tomatoes, red onion, feta cheese, olives, and parsley.`,
        'In a small bowl, whisk together olive oil, lemon juice, garlic, oregano, salt, and pepper.',
        'Pour dressing over salad and toss gently to combine.',
        'Refrigerate for at least 30 minutes to allow flavors to meld.',
        'Serve chilled.'
      ],
      nutrition: {
        calories: 350,
        protein: 12,
        fat: 22,
        carbs: 30
      },
      cookingTime: '15 minutes (plus chilling time)',
      servings: 4
    };
  } else if (mealType === 'dinner') {
    const proteinOption = specificIngredients.protein || 'salmon';
    const vegetableType = specificIngredients.vegetable || 'broccoli';
    
    return {
      title: `Baked ${capitalizeFirstLetter(proteinOption)} with Quinoa and ${capitalizeFirstLetter(vegetableType)}`,
      ingredients: [
        `4 ${proteinOption} fillets (6 oz each)`,
        '1 cup quinoa, rinsed',
        '2 cups vegetable or chicken broth',
        `2 cups ${vegetableType}, prepared appropriately`,
        '2 tbsp olive oil',
        '2 cloves garlic, minced',
        '1 lemon, sliced',
        '2 tbsp fresh herbs (dill, parsley, or thyme)',
        'Salt and pepper to taste'
      ],
      steps: [
        'Preheat oven to 400°F (200°C).',
        'In a medium saucepan, combine quinoa and broth. Bring to a boil, then reduce heat and simmer for 15 minutes until liquid is absorbed.',
        `Toss ${vegetableType} with 1 tbsp olive oil, half the garlic, salt, and pepper.`,
        `Spread ${vegetableType} on a baking sheet and roast for 15-20 minutes.`,
        `Season ${proteinOption} with remaining garlic, salt, and pepper.`,
        `Place ${proteinOption} on a separate baking sheet, drizzle with remaining olive oil.`,
        `Top ${proteinOption} with lemon slices and herbs.`,
        `Bake ${proteinOption} for 12-15 minutes until it flakes easily with a fork.`,
        'Fluff quinoa with a fork and divide between plates.',
        `Top with roasted ${vegetableType} and baked ${proteinOption}.`,
        'Garnish with additional herbs if desired.'
      ],
      nutrition: {
        calories: 420,
        protein: 35,
        fat: 18,
        carbs: 30
      },
      cookingTime: '35 minutes',
      servings: 4
    };
  } else {
    const fruitType = specificIngredients.fruit || 'mixed berries';
    
    return {
      title: `${capitalizeFirstLetter(fruitType)} and Yogurt Parfait`,
      ingredients: [
        '1 cup Greek yogurt',
        `1/2 cup ${fruitType}`,
        '1/4 cup granola',
        '1 tbsp honey',
        '1 tsp chia seeds'
      ],
      steps: [
        'In a glass or bowl, layer half of the yogurt at the bottom.',
        `Add a layer of ${fruitType}.`,
        'Sprinkle half of the granola.',
        'Repeat layers with remaining yogurt and fruit.',
        'Top with remaining granola and chia seeds.',
        'Drizzle honey over the top.',
        'Serve immediately or refrigerate for up to 1 hour.'
      ],
      nutrition: {
        calories: 310,
        protein: 20,
        fat: 8,
        carbs: 42
      },
      cookingTime: '5 minutes',
      servings: 1
    };
  }
};

// Helper function to capitalize first letter of a string
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
