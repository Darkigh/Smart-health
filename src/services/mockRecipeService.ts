import { Recipe } from '../types/Recipe';

// Function to generate recipes based on any combination of ingredients
export function generateRecipes(ingredients: string): Recipe[] {
  // Parse ingredients into a list
  const ingredientsList = ingredients
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  if (ingredientsList.length === 0) {
    return getDefaultRecipes();
  }
  
  // Check for common ingredients first
  const hasEggs = ingredientsList.some(i => i.toLowerCase().includes('egg'));
  const hasChicken = ingredientsList.some(i => i.toLowerCase().includes('chicken'));
  const hasBeef = ingredientsList.some(i => i.toLowerCase().includes('beef') || i.toLowerCase().includes('steak'));
  const hasFish = ingredientsList.some(i => 
    ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'shrimp', 'seafood'].some(term => 
      i.toLowerCase().includes(term)
    )
  );
  const hasPork = ingredientsList.some(i => i.toLowerCase().includes('pork') || i.toLowerCase().includes('ham') || i.toLowerCase().includes('bacon'));
  const hasRice = ingredientsList.some(i => i.toLowerCase().includes('rice'));
  const hasPasta = ingredientsList.some(i => 
    ['pasta', 'noodle', 'spaghetti', 'macaroni', 'penne', 'fettuccine'].some(term => 
      i.toLowerCase().includes(term)
    )
  );
  const hasBread = ingredientsList.some(i => 
    ['bread', 'toast', 'bun', 'roll', 'sandwich'].some(term => 
      i.toLowerCase().includes(term)
    )
  );
  const hasCheese = ingredientsList.some(i => 
    ['cheese', 'cheddar', 'mozzarella', 'parmesan', 'swiss'].some(term => 
      i.toLowerCase().includes(term)
    )
  );
  const hasVegetables = ingredientsList.some(i => 
    ['spinach', 'broccoli', 'carrot', 'tomato', 'lettuce', 'vegetable', 'onion', 'pepper', 'cucumber', 'zucchini', 'potato', 'garlic'].some(term => 
      i.toLowerCase().includes(term)
    )
  );
  const hasFruits = ingredientsList.some(i => 
    ['apple', 'banana', 'orange', 'berry', 'fruit', 'strawberry', 'blueberry', 'raspberry', 'lemon', 'lime'].some(term => 
      i.toLowerCase().includes(term)
    )
  );
  
  // Generate recipes based on ingredient combinations
  const recipes: Recipe[] = [];
  
  // Specialized recipes for common combinations
  if (hasBread && hasCheese) {
    recipes.push(createGrilledCheeseRecipe(ingredientsList));
  }
  
  if (hasEggs && hasBread) {
    recipes.push(createEggSandwichRecipe(ingredientsList));
  }
  
  if (hasChicken && hasRice) {
    recipes.push(createChickenRiceRecipe(ingredientsList));
  }
  
  if (hasPasta && hasCheese) {
    recipes.push(createCheesyPastaRecipe(ingredientsList));
  }
  
  // Single ingredient specialized recipes
  if (recipes.length < 2) {
    if (hasEggs) {
      recipes.push(createEggRecipe(ingredientsList));
    }
    
    if (hasChicken && recipes.length < 2) {
      recipes.push(createChickenRecipe(ingredientsList));
    }
    
    if (hasBeef && recipes.length < 2) {
      recipes.push(createBeefRecipe(ingredientsList));
    }
    
    if (hasFish && recipes.length < 2) {
      recipes.push(createFishRecipe(ingredientsList));
    }
    
    if (hasPork && recipes.length < 2) {
      recipes.push(createPorkRecipe(ingredientsList));
    }
    
    if (hasRice && recipes.length < 2) {
      recipes.push(createRiceRecipe(ingredientsList));
    }
    
    if (hasPasta && recipes.length < 2) {
      recipes.push(createPastaRecipe(ingredientsList));
    }
    
    if (hasBread && recipes.length < 2) {
      recipes.push(createSandwichRecipe(ingredientsList));
    }
    
    if (hasVegetables && recipes.length < 2) {
      recipes.push(createVegetableRecipe(ingredientsList));
    }
    
    if (hasFruits && recipes.length < 2) {
      recipes.push(createFruitRecipe(ingredientsList));
    }
  }
  
  // If no specific recipes were created, create dynamic recipes using all ingredients
  if (recipes.length === 0) {
    recipes.push(createDynamicRecipe(ingredientsList, "main"));
    recipes.push(createDynamicRecipe(ingredientsList, "side"));
  }
  
  // Ensure we have at least 2 recipes
  while (recipes.length < 2) {
    const existingTitles = recipes.map(r => r.title);
    let newRecipe;
    
    if (recipes.length === 1 && recipes[0].title.includes("Salad")) {
      newRecipe = createDynamicRecipe(ingredientsList, "main");
    } else {
      newRecipe = createDynamicRecipe(ingredientsList, "side");
    }
    
    // Avoid duplicate titles
    if (!existingTitles.includes(newRecipe.title)) {
      recipes.push(newRecipe);
    } else {
      // Modify title to avoid duplication
      newRecipe.title = "Alternative " + newRecipe.title;
      recipes.push(newRecipe);
    }
  }
  
  return recipes.slice(0, 2);
}

// Helper function to create a dynamic recipe based on any ingredients
function createDynamicRecipe(ingredients: string[], type: "main" | "side" | "dessert" | "breakfast"): Recipe {
  // Extract main ingredient for title
  const mainIngredient = ingredients[0];
  
  // Generate a title based on the main ingredient and type
  let title = "";
  let cookingMethod = "";
  let cookingTime = "";
  let servings = 2;
  
  if (type === "main") {
    const mainDishMethods = ["Roasted", "Pan-Seared", "Grilled", "Baked", "Stir-Fried", "Slow-Cooked"];
    const mainDishTypes = ["Delight", "Special", "Medley", "Fusion Dish", "Creation"];
    cookingMethod = mainDishMethods[Math.floor(Math.random() * mainDishMethods.length)];
    const dishType = mainDishTypes[Math.floor(Math.random() * mainDishTypes.length)];
    title = `${cookingMethod} ${capitalizeFirstLetter(mainIngredient)} ${dishType}`;
    cookingTime = "30 minutes";
    servings = 2;
  } else if (type === "side") {
    const sideDishMethods = ["Fresh", "Simple", "Zesty", "Savory", "Hearty"];
    const sideDishTypes = ["Salad", "Side", "Mix", "Medley", "Combo"];
    cookingMethod = sideDishMethods[Math.floor(Math.random() * sideDishMethods.length)];
    const dishType = sideDishTypes[Math.floor(Math.random() * sideDishTypes.length)];
    title = `${cookingMethod} ${capitalizeFirstLetter(mainIngredient)} ${dishType}`;
    cookingTime = "15 minutes";
    servings = 4;
  } else if (type === "dessert") {
    const dessertMethods = ["Sweet", "Decadent", "Creamy", "Delightful"];
    const dessertTypes = ["Treat", "Dessert", "Delight", "Surprise"];
    cookingMethod = dessertMethods[Math.floor(Math.random() * dessertMethods.length)];
    const dishType = dessertTypes[Math.floor(Math.random() * dessertTypes.length)];
    title = `${cookingMethod} ${capitalizeFirstLetter(mainIngredient)} ${dishType}`;
    cookingTime = "25 minutes";
    servings = 4;
  } else if (type === "breakfast") {
    const breakfastMethods = ["Morning", "Sunrise", "Energizing", "Hearty"];
    const breakfastTypes = ["Breakfast", "Start", "Meal", "Plate"];
    cookingMethod = breakfastMethods[Math.floor(Math.random() * breakfastMethods.length)];
    const dishType = breakfastTypes[Math.floor(Math.random() * breakfastTypes.length)];
    title = `${cookingMethod} ${capitalizeFirstLetter(mainIngredient)} ${dishType}`;
    cookingTime = "15 minutes";
    servings = 2;
  }
  
  // Generate recipe ingredients
  const recipeIngredients = [
    ...ingredients.map(i => formatIngredient(i)),
    "Salt and pepper to taste",
    "2 tbsp olive oil or butter",
    "Fresh herbs for garnish (optional)"
  ];
  
  // Generate cooking steps based on the cooking method
  let steps: string[] = [];
  
  if (cookingMethod.includes("Roasted") || cookingMethod.includes("Baked")) {
    steps = [
      `Preheat oven to 375°F (190°C).`,
      `Prepare all ingredients: wash, chop, and measure as needed.`,
      `In a bowl, combine ${ingredients.join(", ")} with olive oil, salt, and pepper.`,
      `Transfer to a baking dish or sheet pan.`,
      `Bake for 20-25 minutes until ingredients are cooked through and slightly browned.`,
      `Remove from oven and let rest for 5 minutes before serving.`,
      `Garnish with fresh herbs if desired and serve hot.`
    ];
  } else if (cookingMethod.includes("Pan-Seared") || cookingMethod.includes("Stir-Fried")) {
    steps = [
      `Prepare all ingredients: wash, chop, and measure as needed.`,
      `Heat oil in a large skillet or wok over medium-high heat.`,
      `Add ${ingredients[0]} and cook for 2-3 minutes until it starts to brown.`,
      `Add remaining ingredients and stir frequently.`,
      `Cook for another 5-7 minutes until everything is cooked through.`,
      `Season with salt and pepper to taste.`,
      `Serve hot, garnished with fresh herbs if desired.`
    ];
  } else if (cookingMethod.includes("Grilled")) {
    steps = [
      `Preheat grill to medium-high heat.`,
      `Prepare all ingredients: wash, chop, and measure as needed.`,
      `In a bowl, toss ${ingredients.join(", ")} with olive oil, salt, and pepper.`,
      `Place ingredients on the grill, either directly or in a grill basket.`,
      `Grill for 8-10 minutes, turning occasionally, until cooked through and showing grill marks.`,
      `Remove from grill and let rest for 3 minutes.`,
      `Serve hot, garnished with fresh herbs if desired.`
    ];
  } else if (cookingMethod.includes("Fresh") || cookingMethod.includes("Simple") || cookingMethod.includes("Zesty")) {
    steps = [
      `Wash and dry all ingredients thoroughly.`,
      `Chop or slice ingredients into bite-sized pieces.`,
      `In a large bowl, combine all ingredients.`,
      `In a small bowl, whisk together olive oil, a splash of vinegar or lemon juice, salt, and pepper.`,
      `Pour dressing over the ingredients and toss gently to coat.`,
      `Let sit for 5 minutes to allow flavors to meld.`,
      `Serve at room temperature or chilled.`
    ];
  } else if (cookingMethod.includes("Sweet") || cookingMethod.includes("Decadent") || cookingMethod.includes("Creamy")) {
    steps = [
      `Prepare all ingredients: wash, measure, and chop as needed.`,
      `In a mixing bowl, combine the main ingredients.`,
      `Add sweetener (sugar, honey, or maple syrup) to taste.`,
      `Gently fold in any delicate ingredients.`,
      `Transfer to serving dishes or a decorative bowl.`,
      `Refrigerate for at least 30 minutes before serving.`,
      `Garnish with mint leaves or a sprinkle of cinnamon before serving.`
    ];
  } else if (cookingMethod.includes("Morning") || cookingMethod.includes("Sunrise") || cookingMethod.includes("Energizing")) {
    steps = [
      `Prepare all ingredients: wash, chop, and measure as needed.`,
      `Heat a non-stick pan over medium heat.`,
      `Add butter or oil to the pan.`,
      `Add main ingredients and cook for 3-4 minutes, stirring occasionally.`,
      `Add any remaining ingredients and cook for another 2-3 minutes.`,
      `Season with salt and pepper to taste.`,
      `Serve hot with your favorite breakfast sides.`
    ];
  } else {
    // Default steps
    steps = [
      `Prepare all ingredients: wash, chop, and measure as needed.`,
      `Combine all ingredients in a suitable container.`,
      `Mix thoroughly to ensure even distribution of flavors.`,
      `Cook using your preferred method until done to your liking.`,
      `Season with salt and pepper to taste.`,
      `Let rest for a few minutes before serving.`,
      `Garnish as desired and serve.`
    ];
  }
  
  // Generate nutrition information based on ingredients
  const nutrition = generateNutritionInfo(ingredients, type);
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition,
    cookingTime,
    servings
  };
}

// Helper function to format an ingredient with quantity
function formatIngredient(ingredient: string): string {
  // Check if ingredient already has a quantity
  if (/^\d+\s+/.test(ingredient)) {
    return ingredient;
  }
  
  // Add a reasonable quantity based on the ingredient
  if (ingredient.toLowerCase().includes('egg')) {
    return `2 ${ingredient}s`;
  } else if (ingredient.toLowerCase().includes('chicken') || 
             ingredient.toLowerCase().includes('beef') || 
             ingredient.toLowerCase().includes('fish') ||
             ingredient.toLowerCase().includes('pork')) {
    return `8 oz ${ingredient}`;
  } else if (ingredient.toLowerCase().includes('rice') || 
             ingredient.toLowerCase().includes('pasta') ||
             ingredient.toLowerCase().includes('flour')) {
    return `1 cup ${ingredient}`;
  } else if (ingredient.toLowerCase().includes('cheese')) {
    return `1/2 cup ${ingredient}, shredded or cubed`;
  } else if (ingredient.toLowerCase().includes('bread')) {
    return `2 slices ${ingredient}`;
  } else if (ingredient.toLowerCase().includes('milk') || 
             ingredient.toLowerCase().includes('cream') ||
             ingredient.toLowerCase().includes('broth') ||
             ingredient.toLowerCase().includes('stock')) {
    return `1 cup ${ingredient}`;
  } else if (ingredient.toLowerCase().includes('butter') || 
             ingredient.toLowerCase().includes('oil')) {
    return `2 tbsp ${ingredient}`;
  } else if (ingredient.toLowerCase().includes('salt') || 
             ingredient.toLowerCase().includes('pepper') ||
             ingredient.toLowerCase().includes('spice')) {
    return `1 tsp ${ingredient}`;
  } else if (ingredient.toLowerCase().includes('garlic')) {
    return `2 cloves ${ingredient}, minced`;
  } else if (ingredient.toLowerCase().includes('onion')) {
    return `1 ${ingredient}, diced`;
  } else if (ingredient.toLowerCase().includes('tomato')) {
    return `2 ${ingredient}es, diced`;
  } else if (ingredient.toLowerCase().includes('potato')) {
    return `2 ${ingredient}es, cubed`;
  } else if (ingredient.toLowerCase().includes('carrot')) {
    return `2 ${ingredient}s, sliced`;
  } else if (ingredient.toLowerCase().includes('pub')) {
    return `1 visit to your favorite ${ingredient}`;
  } else {
    // Default quantity for other ingredients
    return `1/2 cup ${ingredient}`;
  }
}

// Helper function to generate nutrition information
function generateNutritionInfo(ingredients: string[], type: string): { calories: number; protein: number; fat: number; carbs: number } {
  let baseCalories = 0;
  let baseProtein = 0;
  let baseFat = 0;
  let baseCarbs = 0;
  
  // Set base nutrition values based on dish type
  if (type === "main") {
    baseCalories = 350;
    baseProtein = 25;
    baseFat = 15;
    baseCarbs = 30;
  } else if (type === "side") {
    baseCalories = 150;
    baseProtein = 5;
    baseFat = 8;
    baseCarbs = 20;
  } else if (type === "dessert") {
    baseCalories = 300;
    baseProtein = 5;
    baseFat = 15;
    baseCarbs = 40;
  } else if (type === "breakfast") {
    baseCalories = 400;
    baseProtein = 15;
    baseFat = 20;
    baseCarbs = 35;
  }
  
  // Adjust nutrition based on ingredients
  for (const ingredient of ingredients) {
    const lowerIngredient = ingredient.toLowerCase();
    
    if (lowerIngredient.includes('egg')) {
      baseCalories += 70;
      baseProtein += 6;
      baseFat += 5;
      baseCarbs += 0;
    } else if (lowerIngredient.includes('chicken') || lowerIngredient.includes('turkey')) {
      baseCalories += 120;
      baseProtein += 25;
      baseFat += 3;
      baseCarbs += 0;
    } else if (lowerIngredient.includes('beef') || lowerIngredient.includes('steak')) {
      baseCalories += 150;
      baseProtein += 20;
      baseFat += 8;
      baseCarbs += 0;
    } else if (lowerIngredient.includes('fish') || lowerIngredient.includes('salmon')) {
      baseCalories += 130;
      baseProtein += 22;
      baseFat += 5;
      baseCarbs += 0;
    } else if (lowerIngredient.includes('pork') || lowerIngredient.includes('ham')) {
      baseCalories += 140;
      baseProtein += 18;
      baseFat += 7;
      baseCarbs += 0;
    } else if (lowerIngredient.includes('rice')) {
      baseCalories += 130;
      baseProtein += 3;
      baseFat += 0;
      baseCarbs += 28;
    } else if (lowerIngredient.includes('pasta')) {
      baseCalories += 150;
      baseProtein += 5;
      baseFat += 1;
      baseCarbs += 30;
    } else if (lowerIngredient.includes('bread')) {
      baseCalories += 80;
      baseProtein += 3;
      baseFat += 1;
      baseCarbs += 15;
    } else if (lowerIngredient.includes('cheese')) {
      baseCalories += 100;
      baseProtein += 7;
      baseFat += 8;
      baseCarbs += 1;
    } else if (lowerIngredient.includes('milk')) {
      baseCalories += 50;
      baseProtein += 3;
      baseFat += 2;
      baseCarbs += 5;
    } else if (lowerIngredient.includes('butter')) {
      baseCalories += 100;
      baseProtein += 0;
      baseFat += 11;
      baseCarbs += 0;
    } else if (lowerIngredient.includes('oil')) {
      baseCalories += 120;
      baseProtein += 0;
      baseFat += 14;
      baseCarbs += 0;
    } else if (lowerIngredient.includes('sugar') || lowerIngredient.includes('honey')) {
      baseCalories += 50;
      baseProtein += 0;
      baseFat += 0;
      baseCarbs += 13;
    } else if (lowerIngredient.includes('potato')) {
      baseCalories += 130;
      baseProtein += 3;
      baseFat += 0;
      baseCarbs += 30;
    } else if (lowerIngredient.includes('pub')) {
      baseCalories += 200; // A pub visit usually involves some calories!
      baseProtein += 5;
      baseFat += 10;
      baseCarbs += 15;
    } else {
      // Default for other ingredients (assuming vegetables or herbs)
      baseCalories += 25;
      baseProtein += 1;
      baseFat += 0;
      baseCarbs += 5;
    }
  }
  
  // Round to reasonable numbers
  return {
    calories: Math.round(baseCalories / 10) * 10,
    protein: Math.round(baseProtein),
    fat: Math.round(baseFat),
    carbs: Math.round(baseCarbs)
  };
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Specialized recipe creators
function createGrilledCheeseRecipe(ingredients: string[]): Recipe {
  // Extract bread and cheese from ingredients if they exist
  const breadIngredient = ingredients.find(i => i.toLowerCase().includes('bread')) || 'bread';
  const cheeseIngredient = ingredients.find(i => i.toLowerCase().includes('cheese')) || 'cheese';
  
  // Add other ingredients from the list
  const otherIngredients = ingredients.filter(i => 
    !i.toLowerCase().includes('bread') && !i.toLowerCase().includes('cheese')
  );
  
  const title = `Gourmet ${capitalizeFirstLetter(cheeseIngredient)} Grilled Sandwich`;
  
  const recipeIngredients = [
    `2 slices ${breadIngredient}`,
    `2 slices ${cheeseIngredient}`,
    `1 tbsp butter`,
    ...otherIngredients.map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Butter one side of each slice of bread.`,
    `Place one slice of bread, butter side down, in a skillet over medium heat.`,
    `Layer cheese on top of the bread.`,
    otherIngredients.length > 0 ? `Add ${otherIngredients.join(", ")} on top of the cheese.` : `Add any additional seasonings if desired.`,
    `Top with the second slice of bread, butter side up.`,
    `Cook for 2-3 minutes until the bottom is golden brown.`,
    `Flip the sandwich and cook for another 2-3 minutes until the other side is golden and the cheese is melted.`,
    `Remove from heat, cut in half, and serve hot.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 350,
      protein: 12,
      fat: 22,
      carbs: 28
    },
    cookingTime: "10 minutes",
    servings: 1
  };
}

function createEggSandwichRecipe(ingredients: string[]): Recipe {
  const breadIngredient = ingredients.find(i => i.toLowerCase().includes('bread')) || 'bread';
  
  const title = "Classic Egg Breakfast Sandwich";
  
  const recipeIngredients = [
    `2 slices ${breadIngredient}`,
    `2 eggs`,
    `1 slice cheese (optional)`,
    `1 tbsp butter`,
    ...ingredients.filter(i => !i.toLowerCase().includes('bread') && !i.toLowerCase().includes('egg')).map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Heat a non-stick pan over medium heat and melt half the butter.`,
    `Crack eggs into the pan and cook to your preference (scrambled or fried).`,
    `Season eggs with salt and pepper.`,
    `Toast bread slices.`,
    `Spread remaining butter on one side of each toast slice.`,
    `Place eggs on one slice of toast.`,
    `Add cheese and any other ingredients you're using.`,
    `Top with the second slice of toast and serve hot.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 380,
      protein: 18,
      fat: 22,
      carbs: 28
    },
    cookingTime: "10 minutes",
    servings: 1
  };
}

function createChickenRiceRecipe(ingredients: string[]): Recipe {
  const title = "One-Pot Chicken and Rice";
  
  const recipeIngredients = [
    `2 chicken breasts, diced`,
    `1 cup rice`,
    `2 cups chicken broth`,
    `2 tbsp olive oil`,
    `1 onion, diced`,
    `2 cloves garlic, minced`,
    ...ingredients.filter(i => 
      !i.toLowerCase().includes('chicken') && 
      !i.toLowerCase().includes('rice')
    ).map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Heat olive oil in a large pan over medium-high heat.`,
    `Add diced chicken and cook until browned on all sides, about 5 minutes.`,
    `Add onion and garlic, cooking until softened, about 2 minutes.`,
    `Stir in rice and any other ingredients you're using.`,
    `Pour in chicken broth and bring to a boil.`,
    `Reduce heat to low, cover, and simmer for 15-20 minutes until rice is tender and liquid is absorbed.`,
    `Remove from heat and let stand, covered, for 5 minutes.`,
    `Fluff with a fork, season with salt and pepper, and serve.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 450,
      protein: 30,
      fat: 12,
      carbs: 55
    },
    cookingTime: "30 minutes",
    servings: 2
  };
}

function createCheesyPastaRecipe(ingredients: string[]): Recipe {
  const pastaIngredient = ingredients.find(i => i.toLowerCase().includes('pasta')) || 'pasta';
  const cheeseIngredient = ingredients.find(i => i.toLowerCase().includes('cheese')) || 'cheese';
  
  const title = `Creamy ${capitalizeFirstLetter(cheeseIngredient)} ${capitalizeFirstLetter(pastaIngredient)}`;
  
  const recipeIngredients = [
    `8 oz ${pastaIngredient}`,
    `1 cup ${cheeseIngredient}, grated`,
    `2 tbsp butter`,
    `2 tbsp flour`,
    `1 cup milk`,
    ...ingredients.filter(i => 
      !i.toLowerCase().includes('pasta') && 
      !i.toLowerCase().includes('cheese')
    ).map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Bring a large pot of salted water to a boil.`,
    `Cook pasta according to package directions until al dente. Drain and set aside.`,
    `In the same pot, melt butter over medium heat.`,
    `Add flour and whisk constantly for 1-2 minutes to make a roux.`,
    `Gradually whisk in milk and cook until the sauce thickens, about 3-4 minutes.`,
    `Reduce heat to low and stir in grated cheese until melted and smooth.`,
    `Add any additional ingredients you're using.`,
    `Return pasta to the pot and toss to coat with the cheese sauce.`,
    `Season with salt and pepper to taste and serve hot.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 480,
      protein: 18,
      fat: 22,
      carbs: 55
    },
    cookingTime: "20 minutes",
    servings: 2
  };
}

function createEggRecipe(ingredients: string[]): Recipe {
  const title = "Perfect Fluffy Scrambled Eggs";
  
  const recipeIngredients = [
    `4 eggs`,
    `2 tbsp milk or cream`,
    `1 tbsp butter`,
    ...ingredients.filter(i => !i.toLowerCase().includes('egg')).map(i => formatIngredient(i)),
    `Salt and pepper to taste`,
    `Fresh herbs for garnish (optional)`
  ];
  
  const steps = [
    `Crack eggs into a bowl and whisk with milk, salt, and pepper until well combined.`,
    `Heat a non-stick pan over medium-low heat and add butter.`,
    `Once butter is melted, pour in the egg mixture.`,
    `Let it cook for about 15 seconds, then use a spatula to gently push the eggs from the edges toward the center.`,
    `Continue this motion as the eggs cook, creating soft folds.`,
    `Add any additional ingredients you're using.`,
    `When eggs are mostly set but still slightly wet (about 2 minutes total), remove from heat.`,
    `Serve immediately, garnished with fresh herbs if desired.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 220,
      protein: 14,
      fat: 16,
      carbs: 2
    },
    cookingTime: "5 minutes",
    servings: 2
  };
}

function createChickenRecipe(ingredients: string[]): Recipe {
  const title = "Herb-Roasted Chicken";
  
  const recipeIngredients = [
    `2 chicken breasts`,
    `2 tbsp olive oil`,
    `2 cloves garlic, minced`,
    `1 tsp dried rosemary`,
    `1 tsp dried thyme`,
    ...ingredients.filter(i => !i.toLowerCase().includes('chicken')).map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Preheat oven to 375°F (190°C).`,
    `Pat chicken breasts dry with paper towels.`,
    `In a small bowl, mix olive oil, minced garlic, rosemary, thyme, salt, and pepper.`,
    `Rub the herb mixture all over the chicken breasts.`,
    `Place chicken in a baking dish along with any additional ingredients you're using.`,
    `Bake for 20-25 minutes until chicken reaches an internal temperature of 165°F (74°C).`,
    `Let rest for 5 minutes before slicing and serving.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 280,
      protein: 35,
      fat: 15,
      carbs: 2
    },
    cookingTime: "30 minutes",
    servings: 2
  };
}

function createBeefRecipe(ingredients: string[]): Recipe {
  const title = "Pan-Seared Beef Steak";
  
  const recipeIngredients = [
    `2 beef steaks (8 oz each)`,
    `2 tbsp olive oil`,
    `2 cloves garlic, minced`,
    `2 sprigs fresh rosemary`,
    `2 tbsp butter`,
    ...ingredients.filter(i => !i.toLowerCase().includes('beef') && !i.toLowerCase().includes('steak')).map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Remove steaks from refrigerator 30 minutes before cooking to bring to room temperature.`,
    `Pat steaks dry and season generously with salt and pepper on both sides.`,
    `Heat olive oil in a heavy skillet over high heat until almost smoking.`,
    `Carefully place steaks in the pan and sear for 3-4 minutes without moving.`,
    `Flip steaks and add butter, garlic, rosemary, and any additional ingredients you're using.`,
    `Tilt the pan slightly and use a spoon to baste the steaks with the butter mixture for another 3-4 minutes for medium-rare.`,
    `Transfer steaks to a plate and tent with foil to rest for 5 minutes.`,
    `Slice against the grain and serve with the pan sauce drizzled over top.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 480,
      protein: 40,
      fat: 28,
      carbs: 8
    },
    cookingTime: "25 minutes",
    servings: 2
  };
}

function createFishRecipe(ingredients: string[]): Recipe {
  const title = "Lemon Herb Baked Fish";
  
  const recipeIngredients = [
    `2 fish fillets (such as tilapia, cod, or salmon)`,
    `2 tbsp olive oil`,
    `1 lemon, sliced`,
    `2 cloves garlic, minced`,
    `1 tbsp fresh dill, chopped`,
    ...ingredients.filter(i => 
      !i.toLowerCase().includes('fish') && 
      !i.toLowerCase().includes('salmon') && 
      !i.toLowerCase().includes('tilapia') && 
      !i.toLowerCase().includes('cod')
    ).map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Preheat oven to 400°F (200°C).`,
    `Pat fish fillets dry with paper towels and season with salt and pepper.`,
    `In a small bowl, combine olive oil, minced garlic, and dill.`,
    `Place fish in a baking dish and drizzle with the herb mixture.`,
    `Add any additional ingredients you're using.`,
    `Arrange lemon slices on top of the fish.`,
    `Bake for 12-15 minutes until fish flakes easily with a fork.`,
    `Serve hot with additional lemon wedges if desired.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 240,
      protein: 30,
      fat: 12,
      carbs: 4
    },
    cookingTime: "20 minutes",
    servings: 2
  };
}

function createPorkRecipe(ingredients: string[]): Recipe {
  const title = "Garlic and Herb Pork Chops";
  
  const recipeIngredients = [
    `2 pork chops`,
    `2 tbsp olive oil`,
    `3 cloves garlic, minced`,
    `1 tsp dried thyme`,
    `1 tsp dried rosemary`,
    ...ingredients.filter(i => !i.toLowerCase().includes('pork')).map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Pat pork chops dry with paper towels and season with salt and pepper.`,
    `In a small bowl, mix olive oil, garlic, thyme, and rosemary.`,
    `Rub the herb mixture all over the pork chops.`,
    `Heat a large skillet over medium-high heat.`,
    `Add pork chops and cook for 4-5 minutes on each side until golden brown and internal temperature reaches 145°F (63°C).`,
    `Add any additional ingredients you're using during the last few minutes of cooking.`,
    `Remove from heat and let rest for 3 minutes before serving.`,
    `Serve with your favorite sides.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 320,
      protein: 28,
      fat: 22,
      carbs: 4
    },
    cookingTime: "20 minutes",
    servings: 2
  };
}

function createRiceRecipe(ingredients: string[]): Recipe {
  const title = "Flavorful Rice Pilaf";
  
  const recipeIngredients = [
    `1 cup rice`,
    `2 cups broth (chicken or vegetable)`,
    `2 tbsp butter or olive oil`,
    `1 onion, finely diced`,
    `2 cloves garlic, minced`,
    ...ingredients.filter(i => !i.toLowerCase().includes('rice')).map(i => formatIngredient(i)),
    `Salt and pepper to taste`,
    `Fresh herbs for garnish (optional)`
  ];
  
  const steps = [
    `Rinse rice under cold water until water runs clear. Drain well.`,
    `In a medium saucepan, heat butter or oil over medium heat.`,
    `Add onion and sauté until translucent, about 3-4 minutes.`,
    `Add garlic and cook for another 30 seconds until fragrant.`,
    `Add rice and stir to coat with oil. Toast for 1-2 minutes.`,
    `Add any additional ingredients you're using.`,
    `Pour in broth and season with salt and pepper.`,
    `Bring to a boil, then reduce heat to low, cover, and simmer for 15-18 minutes until liquid is absorbed.`,
    `Remove from heat and let stand, covered, for 5 minutes.`,
    `Fluff rice with a fork, garnish with fresh herbs if desired, and serve.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 220,
      protein: 5,
      fat: 8,
      carbs: 35
    },
    cookingTime: "30 minutes",
    servings: 4
  };
}

function createPastaRecipe(ingredients: string[]): Recipe {
  const title = "Simple Garlic Pasta";
  
  const recipeIngredients = [
    `8 oz pasta (any type)`,
    `3 tbsp olive oil`,
    `4 cloves garlic, minced`,
    `1/4 tsp red pepper flakes`,
    `2 tbsp fresh parsley, chopped`,
    ...ingredients.filter(i => !i.toLowerCase().includes('pasta')).map(i => formatIngredient(i)),
    `Salt and pepper to taste`,
    `Grated Parmesan cheese for serving (optional)`
  ];
  
  const steps = [
    `Bring a large pot of salted water to a boil. Cook pasta according to package directions until al dente.`,
    `Reserve 1/2 cup of pasta cooking water before draining.`,
    `While pasta is cooking, heat olive oil in a large skillet over medium-low heat.`,
    `Add garlic and red pepper flakes, cooking until fragrant but not browned, about 1-2 minutes.`,
    `Add any additional ingredients you're using and cook briefly.`,
    `Add drained pasta to the skillet and toss to coat with the garlic oil.`,
    `Add a splash of reserved pasta water to create a light sauce.`,
    `Season with salt and pepper to taste.`,
    `Garnish with fresh parsley and Parmesan cheese if desired.`,
    `Serve immediately.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 380,
      protein: 10,
      fat: 16,
      carbs: 48
    },
    cookingTime: "15 minutes",
    servings: 2
  };
}

function createSandwichRecipe(ingredients: string[]): Recipe {
  const title = "Gourmet Sandwich";
  
  const recipeIngredients = [
    `2 slices bread of your choice`,
    `2 tbsp mayonnaise or mustard`,
    `2 leaves lettuce`,
    `1 tomato, sliced`,
    ...ingredients.filter(i => !i.toLowerCase().includes('bread')).map(i => formatIngredient(i)),
    `Salt and pepper to taste`
  ];
  
  const steps = [
    `Lay out bread slices on a clean work surface.`,
    `Spread mayonnaise or mustard on one or both slices of bread.`,
    `Layer lettuce, tomato, and any additional ingredients you're using.`,
    `Season with salt and pepper to taste.`,
    `Top with the second slice of bread.`,
    `Cut in half diagonally and serve.`,
    `Optional: Toast the sandwich in a pan with a little butter for a warm, crispy exterior.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 350,
      protein: 12,
      fat: 18,
      carbs: 35
    },
    cookingTime: "10 minutes",
    servings: 1
  };
}

function createVegetableRecipe(ingredients: string[]): Recipe {
  const title = "Roasted Vegetable Medley";
  
  const recipeIngredients = [
    `4 cups mixed vegetables (use what you have)`,
    `3 tbsp olive oil`,
    `3 cloves garlic, minced`,
    `1 tsp dried herbs (thyme, rosemary, or herbes de Provence)`,
    ...ingredients.filter(i => 
      !['spinach', 'broccoli', 'carrot', 'tomato', 'lettuce', 'vegetable', 'onion', 'pepper', 'cucumber', 'zucchini'].some(v => 
        i.toLowerCase().includes(v)
      )
    ).map(i => formatIngredient(i)),
    `Salt and pepper to taste`,
    `1 tbsp balsamic vinegar (optional)`
  ];
  
  const steps = [
    `Preheat oven to 425°F (220°C).`,
    `Wash and cut all vegetables into similar-sized pieces for even cooking.`,
    `In a large bowl, toss vegetables with olive oil, garlic, dried herbs, salt, and pepper.`,
    `Add any additional ingredients you're using.`,
    `Spread vegetables in a single layer on a baking sheet.`,
    `Roast for 20-25 minutes, stirring halfway through, until vegetables are tender and caramelized at the edges.`,
    `Remove from oven and drizzle with balsamic vinegar if using.`,
    `Serve hot as a side dish or over grains for a main course.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 180,
      protein: 4,
      fat: 14,
      carbs: 12
    },
    cookingTime: "30 minutes",
    servings: 4
  };
}

function createFruitRecipe(ingredients: string[]): Recipe {
  const title = "Fresh Fruit Salad";
  
  const recipeIngredients = [
    `4 cups mixed fruits (use what you have)`,
    `2 tbsp honey or maple syrup`,
    `1 tbsp fresh lemon juice`,
    `1/4 tsp cinnamon (optional)`,
    ...ingredients.filter(i => 
      !['apple', 'banana', 'orange', 'berry', 'fruit', 'strawberry', 'blueberry', 'raspberry'].some(f => 
        i.toLowerCase().includes(f)
      )
    ).map(i => formatIngredient(i)),
    `Fresh mint leaves for garnish (optional)`
  ];
  
  const steps = [
    `Wash all fruits thoroughly.`,
    `Peel and chop fruits as needed into bite-sized pieces.`,
    `In a small bowl, whisk together honey or maple syrup, lemon juice, and cinnamon if using.`,
    `Place all fruit in a large bowl.`,
    `Pour the dressing over the fruit and gently toss to coat.`,
    `Add any additional ingredients you're using.`,
    `Refrigerate for at least 30 minutes to allow flavors to meld.`,
    `Garnish with fresh mint leaves before serving if desired.`
  ];
  
  return {
    title,
    ingredients: recipeIngredients,
    steps,
    nutrition: {
      calories: 120,
      protein: 1,
      fat: 0,
      carbs: 30
    },
    cookingTime: "15 minutes",
    servings: 4
  };
}

// Default recipes if no ingredients are provided
function getDefaultRecipes(): Recipe[] {
  return [
    {
      title: "Simple Mixed Salad",
      ingredients: [
        "2 cups mixed greens",
        "1 tomato, diced",
        "1 cucumber, sliced",
        "1/4 red onion, thinly sliced",
        "1/4 cup olive oil",
        "2 tbsp balsamic vinegar",
        "1 tsp honey",
        "Salt and pepper to taste"
      ],
      steps: [
        "Wash and dry all vegetables thoroughly.",
        "In a large bowl, combine mixed greens, tomato, cucumber, and red onion.",
        "In a small bowl, whisk together olive oil, balsamic vinegar, honey, salt, and pepper.",
        "Drizzle dressing over the salad and toss gently to coat.",
        "Serve immediately as a side dish or add protein for a main course."
      ],
      nutrition: {
        calories: 150,
        protein: 2,
        fat: 14,
        carbs: 8
      },
      cookingTime: "10 minutes",
      servings: 2
    },
    {
      title: "Basic Avocado Toast",
      ingredients: [
        "2 slices whole grain bread",
        "1 ripe avocado",
        "1 tbsp lemon juice",
        "1/4 tsp red pepper flakes",
        "Salt and pepper to taste",
        "2 eggs (optional)"
      ],
      steps: [
        "Toast the bread slices until golden brown.",
        "Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.",
        "Add lemon juice, salt, and pepper to the avocado and mash with a fork.",
        "Spread the avocado mixture evenly on the toast slices.",
        "Sprinkle with red pepper flakes.",
        "If using eggs, cook them to your preference and place on top of the avocado toast.",
        "Serve immediately."
      ],
      nutrition: {
        calories: 280,
        protein: 6,
        fat: 18,
        carbs: 28
      },
      cookingTime: "10 minutes",
      servings: 2
    }
  ];
}
