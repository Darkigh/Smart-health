import { Recipe } from '../types/Recipe';

// Use environment variables in production
const API_KEY = 'AIzaSyAzRGqK1XJ3NyhFYzd5oYhD4JDMFHSygcs';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Base delay for exponential backoff (in milliseconds)
const BASE_DELAY = 1000;

/**
 * Generate recipes using Google's Gemini API based on provided ingredients and meal type
 * 
 * @param ingredients - Comma-separated list of ingredients
 * @param mealType - Object with meal type selections (breakfast, lunch, dinner, snack)
 * @returns Promise resolving to an array of Recipe objects
 */
export async function generateRecipeWithGemini(
  ingredients: string,
  mealType: Record<string, boolean>
): Promise<Recipe[]> {
  try {
    // Determine selected meal types
    const selectedMealTypes = Object.entries(mealType)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
    
    // Default to lunch if no meal type selected
    const mealTypeToUse = selectedMealTypes.length > 0 
      ? selectedMealTypes.join(", ") 
      : 'lunch';
    
    // Clean ingredients - preserve quantities and format
    const cleanedIngredients = ingredients.trim();
    
    // Parse ingredients into a list
    const ingredientsList = cleanedIngredients
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    if (ingredientsList.length === 0) {
      throw new Error("No ingredients provided");
    }
    
    // Construct improved prompt for Gemini API with strict instructions
    const prompt = `You are a professional chef and nutrition expert. Generate exactly 2 creative, detailed, and gourmet recipes for ${mealTypeToUse} meals that MUST use ALL of these ingredients as the main components: ${cleanedIngredients}.

CRITICAL REQUIREMENTS:
1. The recipes MUST prominently feature and use ALL of the user's ingredients listed above.
2. Return ONLY pure JSON with no additional text, explanations, or markdown
3. Use exactly this structure: [{"title": "...", ...}]
4. Pay careful attention to any quantities mentioned in ingredients
5. Include herbs, spices, and seasonings to make the dish flavorful
6. Provide at least 5-7 detailed cooking steps for each recipe
7. Ensure nutrition information is accurate and realistic
8. Make the recipes creative and interesting, not basic or generic

For each recipe, include:
- A creative title that mentions main ingredients
- Complete ingredients list with precise measurements (MUST include ALL user ingredients)
- Detailed step-by-step cooking instructions
- Nutrition information (calories, protein, fat, carbs)
- Realistic cooking time
- Number of servings

Example format:
[
  {
    "title": "Fluffy Scrambled Eggs with Fresh Herbs",
    "ingredients": [
      "4 large eggs",
      "2 tbsp milk",
      "1 tbsp butter",
      "1 tbsp fresh chives, chopped"
    ],
    "steps": [
      "Crack eggs into a bowl...",
      "Add milk and whisk..."
    ],
    "nutrition": {
      "calories": 220,
      "protein": 14,
      "fat": 17,
      "carbs": 2
    },
    "cookingTime": "10 minutes",
    "servings": 2
  }
]`;
    
    // Call Gemini API with retry logic
    let recipes: Recipe[] = [];
    let attempt = 0;
    let lastError: Error | null = null;
    
    while (attempt < MAX_RETRIES) {
      try {
        // Exponential backoff delay for retries
        if (attempt > 0) {
          const delay = BASE_DELAY * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.6, // Slightly lower temperature for more consistent outputs
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract and parse the response
        const responseText = data.candidates[0].content.parts[0].text;
        recipes = parseRecipeResponse(responseText);
        
        // Validate that recipes use the provided ingredients
        const validatedRecipes = validateRecipesUseIngredients(recipes, ingredientsList);
        
        if (validatedRecipes.length > 0) {
          return validatedRecipes;
        } else {
          // If validation fails, try again
          throw new Error("Generated recipes did not include all required ingredients");
        }
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        attempt++;
      }
    }
    
    // If all retries fail, use fallback
    console.error('All API attempts failed, using fallback:', lastError);
    return generateFallbackRecipesWithIngredients(ingredientsList, mealTypeToUse);
  } catch (error) {
    console.error('Error generating recipe with Gemini:', error);
    const ingredientsList = ingredients
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    return generateFallbackRecipesWithIngredients(ingredientsList, 'lunch');
  }
}

/**
 * Parse the response from Gemini API into Recipe objects
 * 
 * @param responseText - Raw text response from Gemini API
 * @returns Array of Recipe objects
 */
function parseRecipeResponse(responseText: string): Recipe[] {
  try {
    // Try to extract JSON from response
    let jsonString = responseText;
    
    // Remove markdown code blocks if present
    if (jsonString.includes('```json')) {
      jsonString = jsonString.replace(/```json/g, '');
    }
    if (jsonString.includes('```')) {
      jsonString = jsonString.replace(/```/g, '');
    }
    
    // Find first [ and last ] to extract pure JSON
    const jsonStart = jsonString.indexOf('[');
    const jsonEnd = jsonString.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON array found in response');
    }
    
    jsonString = jsonString.substring(jsonStart, jsonEnd);
    
    // Parse the JSON
    const parsedData = JSON.parse(jsonString);
    
    // Handle different response formats
    if (Array.isArray(parsedData)) {
      return validateRecipeStructure(parsedData);
    } else if (parsedData.recipes && Array.isArray(parsedData.recipes)) {
      return validateRecipeStructure(parsedData.recipes);
    } else if (typeof parsedData === 'object') {
      return validateRecipeStructure([parsedData]);
    }
    
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('JSON parsing error:', error);
    return extractRecipeWithRegex(responseText);
  }
}

/**
 * Validate that recipe objects have the expected structure
 * 
 * @param recipes - Array of potential recipe objects
 * @returns Array of validated Recipe objects
 */
function validateRecipeStructure(recipes: any[]): Recipe[] {
  return recipes.filter(recipe => {
    return (
      recipe &&
      typeof recipe.title === 'string' &&
      Array.isArray(recipe.ingredients) &&
      Array.isArray(recipe.steps) &&
      recipe.nutrition &&
      typeof recipe.cookingTime === 'string' &&
      typeof recipe.servings === 'number'
    );
  }).map(recipe => ({
    title: recipe.title,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    nutrition: {
      calories: Number(recipe.nutrition.calories) || 0,
      protein: Number(recipe.nutrition.protein) || 0,
      fat: Number(recipe.nutrition.fat) || 0,
      carbs: Number(recipe.nutrition.carbs) || 0
    },
    cookingTime: recipe.cookingTime,
    servings: Number(recipe.servings) || 2
  }));
}

/**
 * Extract recipe information using regex when JSON parsing fails
 * 
 * @param text - Raw text response from Gemini API
 * @returns Array of Recipe objects
 */
function extractRecipeWithRegex(text: string): Recipe[] {
  const recipes: Recipe[] = [];
  
  // Split into recipe sections
  const recipeBlocks = text.split(/(?:Recipe \d+:|Recipe:|#{1,3} )/i)
    .filter(block => block.trim().length > 0)
    .slice(0, 2); // Limit to 2 recipes

  for (const block of recipeBlocks) {
    try {
      // Extract title - more flexible matching
      const titleMatch = block.match(/(?:Title:?\s*)?([^\n]+)/i);
      const title = titleMatch ? titleMatch[1].trim() : "Gourmet Recipe";

      // Extract ingredients
      const ingredientsMatch = block.match(/(?:Ingredients:?\s*)([\s\S]*?)(?=(?:Steps|Instructions|Directions|Method|Nutrition|Cooking|Servings|$))/i);
      const ingredientsText = ingredientsMatch ? ingredientsMatch[1].trim() : "";
      const ingredients = ingredientsText
        .split('\n')
        .map(line => line.replace(/^- /, '').trim())
        .filter(line => line.length > 0 && !line.match(/ingredients:/i));

      // Extract steps
      const stepsMatch = block.match(/(?:Steps|Instructions|Directions|Method):?\s*([\s\S]*?)(?=(?:Nutrition|Cooking Time|Servings|Notes|$))/i);
      const stepsText = stepsMatch ? stepsMatch[1].trim() : "";
      const steps = stepsText
        .split(/(?:\d+\.|\n\s*-\s*|\n\s*\*\s*)/)
        .map(step => step.trim().replace(/^[.\s]+/, ''))
        .filter(step => step.length > 0 && !step.match(/(?:steps|instructions|directions):/i));

      // Extract nutrition info
      const nutrition = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
      };

      const nutritionMatch = block.match(/(?:Nutrition|Nutrition Facts|Nutrition Information):?\s*([\s\S]*?)(?=(?:Cooking Time|Servings|$))/i);
      if (nutritionMatch) {
        const nutritionText = nutritionMatch[1];
        const caloriesMatch = nutritionText.match(/(?:calories:?\s*)(\d+)/i);
        const proteinMatch = nutritionText.match(/(?:protein:?\s*)(\d+)/i);
        const fatMatch = nutritionText.match(/(?:fat:?\s*)(\d+)/i);
        const carbsMatch = nutritionText.match(/(?:carbs|carbohydrates:?\s*)(\d+)/i);
        
        nutrition.calories = caloriesMatch ? parseInt(caloriesMatch[1]) : 350;
        nutrition.protein = proteinMatch ? parseInt(proteinMatch[1]) : 20;
        nutrition.fat = fatMatch ? parseInt(fatMatch[1]) : 15;
        nutrition.carbs = carbsMatch ? parseInt(carbsMatch[1]) : 30;
      }

      // Extract cooking time
      const cookingTimeMatch = block.match(/(?:cook|total) time:?\s*([^\n]+)/i);
      const cookingTime = cookingTimeMatch ? cookingTimeMatch[1].trim() : "30 minutes";

      // Extract servings
      const servingsMatch = block.match(/(?:servings|yields|serves):?\s*(\d+)/i);
      const servings = servingsMatch ? parseInt(servingsMatch[1]) : 4;

      recipes.push({
        title,
        ingredients,
        steps,
        nutrition,
        cookingTime,
        servings
      });
    } catch (e) {
      console.error('Error extracting recipe with regex:', e);
    }
  }
  
  return recipes;
}

/**
 * Validate that recipes use all the provided ingredients
 * 
 * @param recipes - Array of Recipe objects to validate
 * @param userIngredients - Array of ingredient strings provided by the user
 * @returns Array of validated Recipe objects
 */
function validateRecipesUseIngredients(recipes: Recipe[], userIngredients: string[]): Recipe[] {
  if (userIngredients.length === 0) {
    return recipes;
  }
  
  // Normalize ingredients for comparison
  const normalizedUserIngredients = userIngredients.map(ingredient => {
    // Remove quantities and units
    return ingredient
      .replace(/^\d+\s*(?:cups?|tablespoons?|teaspoons?|tbsp|tsp|oz|ounces?|pounds?|lbs?|grams?|g|ml|l|liters?|pieces?|slices?)\s*/gi, '')
      .replace(/[^a-z\s]/gi, '')
      .trim()
      .toLowerCase();
  });
  
  return recipes.filter(recipe => {
    const recipeIngredientsText = recipe.ingredients
      .join(' ')
      .toLowerCase()
      .replace(/[^a-z\s]/gi, '');
    
    return normalizedUserIngredients.every(ingredient => {
      return recipeIngredientsText.includes(ingredient);
    });
  });
}

/**
 * Generate fallback recipes that definitely use the provided ingredients
 * 
 * @param ingredients - Array of ingredient strings
 * @param mealType - String representing the meal type
 * @returns Array of Recipe objects
 */
function generateFallbackRecipesWithIngredients(ingredients: string[], mealType: string): Recipe[] {
  const recipes: Recipe[] = [];
  
  // Normalize ingredients
  const normalizedIngredients = ingredients.map(ingredient => {
    return {
      original: ingredient,
      normalized: ingredient
        .replace(/^\d+\s*(?:cups?|tablespoons?|teaspoons?|tbsp|tsp|oz|ounces?|pounds?|lbs?|grams?|g|ml|l|liters?|pieces?|slices?)\s*/gi, '')
        .trim()
        .toLowerCase()
    };
  });
  
  // Check for common ingredients
  const hasEggs = normalizedIngredients.some(i => i.normalized.includes('egg'));
  const hasChicken = normalizedIngredients.some(i => i.normalized.includes('chicken'));
  const hasBeef = normalizedIngredients.some(i => i.normalized.includes('beef') || i.normalized.includes('steak'));
  const hasFish = normalizedIngredients.some(i => i.normalized.includes('fish') || i.normalized.includes('salmon') || i.normalized.includes('tuna'));
  const hasPork = normalizedIngredients.some(i => i.normalized.includes('pork') || i.normalized.includes('bacon'));
  const hasRice = normalizedIngredients.some(i => i.normalized.includes('rice'));
  const hasPasta = normalizedIngredients.some(i => i.normalized.includes('pasta') || i.normalized.includes('noodle') || i.normalized.includes('spaghetti'));
  const hasVegetables = normalizedIngredients.some(i => 
    ['spinach', 'broccoli', 'carrot', 'tomato', 'lettuce', 'vegetable', 'onion', 'pepper', 'cucumber', 'zucchini', 'potato'].some(v => 
      i.normalized.includes(v)
    )
  );
  
  // Generate recipes based on ingredients with priority
  const recipeGenerators: (() => Recipe)[] = [];
  
  if (hasEggs) {
    recipeGenerators.push(() => createEggRecipe(normalizedIngredients, mealType));
  }
  
  if (hasChicken) {
    recipeGenerators.push(() => createChickenRecipe(normalizedIngredients, mealType));
  } 
  
  if (hasBeef) {
    recipeGenerators.push(() => createBeefRecipe(normalizedIngredients, mealType));
  } 
  
  if (hasFish) {
    recipeGenerators.push(() => createFishRecipe(normalizedIngredients, mealType));
  }
  
  if (hasPork) {
    recipeGenerators.push(() => createPorkRecipe(normalizedIngredients, mealType));
  }
  
  if (hasRice) {
    recipeGenerators.push(() => createRiceRecipe(normalizedIngredients, mealType));
  } 
  
  if (hasPasta) {
    recipeGenerators.push(() => createPastaRecipe(normalizedIngredients, mealType));
  }
  
  if (hasVegetables) {
    recipeGenerators.push(() => createVegetableRecipe(normalizedIngredients, mealType));
  }
  
  // Fill with generic recipes if needed
  while (recipeGenerators.length < 2) {
    recipeGenerators.push(() => createGenericRecipe(normalizedIngredients, mealType));
  }
  
  // Generate up to 2 recipes
  for (let i = 0; i < Math.min(2, recipeGenerators.length); i++) {
    recipes.push(recipeGenerators[i]());
  }
  
  return recipes;
}

// Helper functions to create specific recipes
function createEggRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Gourmet Herb & Vegetable Omelette",
    ingredients: [
      ...userIngredients,
      "1/4 tsp salt",
      "1/4 tsp freshly ground black pepper",
      "1 tbsp butter or olive oil",
      "1 tbsp fresh herbs (parsley, chives, or basil), chopped"
    ],
    steps: [
      "Prepare all ingredients, chopping vegetables finely.",
      "In a bowl, whisk eggs until well combined and slightly frothy.",
      "Season with salt and pepper.",
      "Heat butter or oil in a non-stick skillet over medium heat.",
      "Add any vegetables that need cooking and sauté until softened.",
      "Pour in the egg mixture and let it cook for 30 seconds.",
      "Using a spatula, gently push the eggs from the edges toward the center of the pan.",
      "When eggs are mostly set but still slightly moist on top, add any remaining ingredients.",
      "Fold the omelette in half and cook for another 30 seconds.",
      "Sprinkle with fresh herbs before serving."
    ],
    nutrition: {
      calories: 320,
      protein: 18,
      fat: 24,
      carbs: 6
    },
    cookingTime: "15 minutes",
    servings: 2
  };
}

function createChickenRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Herb-Roasted Chicken with Garden Vegetables",
    ingredients: [
      ...userIngredients,
      "2 tbsp olive oil",
      "3 cloves garlic, minced",
      "1 tbsp fresh rosemary, chopped",
      "1 tbsp fresh thyme, chopped",
      "1 lemon, zested and juiced",
      "Salt and freshly ground black pepper to taste"
    ],
    steps: [
      "Preheat oven to 375°F (190°C).",
      "Prepare all ingredients, cutting vegetables into even-sized pieces.",
      "In a small bowl, combine olive oil, minced garlic, herbs, lemon zest, salt, and pepper.",
      "Pat chicken dry and rub herb mixture all over it.",
      "Arrange vegetables in a roasting pan and toss with remaining herb mixture.",
      "Place chicken on top of vegetables.",
      "Roast for 45-60 minutes until chicken reaches an internal temperature of 165°F (74°C).",
      "Let rest for 10 minutes before slicing.",
      "Drizzle with lemon juice before serving."
    ],
    nutrition: {
      calories: 420,
      protein: 35,
      fat: 25,
      carbs: 12
    },
    cookingTime: "1 hour 15 minutes",
    servings: 4
  };
}

function createBeefRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Savory Beef & Vegetable Stir-Fry",
    ingredients: [
      ...userIngredients,
      "2 tbsp vegetable oil",
      "2 cloves garlic, minced",
      "1 tbsp fresh ginger, grated",
      "3 tbsp soy sauce",
      "1 tbsp honey",
      "1 tsp sesame oil",
      "1/4 tsp red pepper flakes (optional)"
    ],
    steps: [
      "Prepare all ingredients, slicing beef thinly against the grain and cutting vegetables into bite-sized pieces.",
      "In a small bowl, mix soy sauce, honey, and sesame oil to make the sauce.",
      "Heat vegetable oil in a large wok or skillet over high heat.",
      "Add beef and stir-fry until browned, about 2-3 minutes. Remove and set aside.",
      "In the same pan, add garlic and ginger, stir for 30 seconds until fragrant.",
      "Add vegetables, starting with the firmest ones first, and stir-fry until crisp-tender.",
      "Return beef to the pan, add sauce, and toss to combine.",
      "Cook for another 1-2 minutes until everything is well-coated and heated through.",
      "Serve hot, garnished with sesame seeds if desired."
    ],
    nutrition: {
      calories: 380,
      protein: 28,
      fat: 22,
      carbs: 18
    },
    cookingTime: "25 minutes",
    servings: 4
  };
}

function createFishRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Citrus-Herb Baked Fish with Seasonal Vegetables",
    ingredients: [
      ...userIngredients,
      "2 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 lemon, sliced",
      "2 tbsp fresh parsley, chopped",
      "1 tbsp fresh dill, chopped",
      "Salt and freshly ground black pepper to taste"
    ],
    steps: [
      "Preheat oven to 375°F (190°C).",
      "Prepare all ingredients, cutting vegetables into even-sized pieces.",
      "In a small bowl, mix olive oil, garlic, half the herbs, salt, and pepper.",
      "Place fish and vegetables on a large sheet of parchment paper or aluminum foil.",
      "Drizzle with the herb-oil mixture and toss to coat.",
      "Top with lemon slices and remaining herbs.",
      "Fold the parchment or foil to create a sealed packet.",
      "Bake for 15-20 minutes until fish flakes easily with a fork.",
      "Carefully open the packet (watch for steam) and serve immediately."
    ],
    nutrition: {
      calories: 320,
      protein: 28,
      fat: 18,
      carbs: 12
    },
    cookingTime: "30 minutes",
    servings: 2
  };
}

function createPorkRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Maple-Glazed Pork with Roasted Vegetables",
    ingredients: [
      ...userIngredients,
      "2 tbsp olive oil",
      "2 tbsp maple syrup",
      "1 tbsp Dijon mustard",
      "2 cloves garlic, minced",
      "1 tsp dried thyme",
      "Salt and freshly ground black pepper to taste"
    ],
    steps: [
      "Preheat oven to 400°F (200°C).",
      "Prepare all ingredients, cutting vegetables into even-sized pieces.",
      "In a small bowl, mix maple syrup, mustard, half the olive oil, garlic, thyme, salt, and pepper.",
      "Rub the mixture all over the pork.",
      "Toss vegetables with remaining olive oil, salt, and pepper.",
      "Place pork in the center of a roasting pan and arrange vegetables around it.",
      "Roast for 25-30 minutes until pork reaches an internal temperature of 145°F (63°C).",
      "Let pork rest for 5 minutes before slicing.",
      "Serve with roasted vegetables."
    ],
    nutrition: {
      calories: 390,
      protein: 30,
      fat: 22,
      carbs: 18
    },
    cookingTime: "45 minutes",
    servings: 4
  };
}

function createRiceRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Savory Vegetable Rice Pilaf",
    ingredients: [
      ...userIngredients,
      "2 tbsp olive oil or butter",
      "1 onion, finely diced",
      "2 cloves garlic, minced",
      "2 cups vegetable or chicken broth",
      "1 bay leaf",
      "1/4 cup fresh parsley, chopped",
      "Salt and freshly ground black pepper to taste"
    ],
    steps: [
      "Prepare all ingredients, chopping vegetables finely.",
      "Heat oil or butter in a large saucepan over medium heat.",
      "Add onion and sauté until translucent, about 3-4 minutes.",
      "Add garlic and cook for another 30 seconds until fragrant.",
      "Add rice and stir to coat with oil, toasting lightly for 1-2 minutes.",
      "Add any firm vegetables and sauté for 2 minutes.",
      "Pour in broth, add bay leaf, salt, and pepper, and bring to a boil.",
      "Reduce heat to low, cover, and simmer for 15-20 minutes until rice is tender.",
      "Remove from heat and let stand, covered, for 5 minutes.",
      "Fluff with a fork, stir in parsley and any remaining vegetables, and serve."
    ],
    nutrition: {
      calories: 310,
      protein: 6,
      fat: 8,
      carbs: 54
    },
    cookingTime: "35 minutes",
    servings: 4
  };
}

function createPastaRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Garden Vegetable Pasta Primavera",
    ingredients: [
      ...userIngredients,
      "2 tbsp olive oil",
      "3 cloves garlic, minced",
      "1/4 cup white wine or vegetable broth",
      "1/4 cup grated Parmesan cheese",
      "2 tbsp fresh basil, chopped",
      "1 tbsp fresh parsley, chopped",
      "Salt and freshly ground black pepper to taste",
      "Red pepper flakes (optional)"
    ],
    steps: [
      "Bring a large pot of salted water to a boil and cook pasta according to package instructions.",
      "Meanwhile, prepare all vegetables, cutting them into bite-sized pieces.",
      "Heat olive oil in a large skillet over medium heat.",
      "Add garlic and cook for 30 seconds until fragrant.",
      "Add vegetables, starting with the firmest ones first, and sauté until tender-crisp.",
      "Pour in wine or broth and simmer for 2 minutes.",
      "Drain pasta, reserving 1/2 cup of pasta water.",
      "Add pasta to the skillet with vegetables and toss to combine.",
      "Add a splash of pasta water if needed to create a light sauce.",
      "Stir in Parmesan, herbs, salt, and pepper. Serve immediately."
    ],
    nutrition: {
      calories: 380,
      protein: 12,
      fat: 10,
      carbs: 58
    },
    cookingTime: "25 minutes",
    servings: 4
  };
}

function createVegetableRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Roasted Vegetable Medley with Herbs",
    ingredients: [
      ...userIngredients,
      "3 tbsp olive oil",
      "3 cloves garlic, minced",
      "1 tbsp fresh rosemary, chopped",
      "1 tbsp fresh thyme, chopped",
      "1 tsp balsamic vinegar",
      "Salt and freshly ground black pepper to taste"
    ],
    steps: [
      "Preheat oven to 425°F (220°C).",
      "Prepare all vegetables, cutting them into even-sized pieces.",
      "In a small bowl, mix olive oil, garlic, herbs, salt, and pepper.",
      "Place vegetables on a large baking sheet, ensuring they're not overcrowded.",
      "Drizzle with the herb-oil mixture and toss to coat evenly.",
      "Arrange in a single layer for even roasting.",
      "Roast for 25-30 minutes, stirring halfway through, until vegetables are tender and caramelized.",
      "Drizzle with balsamic vinegar and toss gently.",
      "Adjust seasoning if needed and serve hot."
    ],
    nutrition: {
      calories: 180,
      protein: 3,
      fat: 14,
      carbs: 12
    },
    cookingTime: "40 minutes",
    servings: 4
  };
}

function createGenericRecipe(ingredients: {original: string, normalized: string}[], mealType: string): Recipe {
  // Include all user ingredients
  const userIngredients = ingredients.map(i => i.original);
  
  return {
    title: "Custom Kitchen Sink Bowl",
    ingredients: [
      ...userIngredients,
      "2 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 tsp dried mixed herbs",
      "Salt and freshly ground black pepper to taste",
      "1 lemon, cut into wedges (for serving)"
    ],
    steps: [
      "Prepare all ingredients, cutting them into appropriate sizes.",
      "Heat olive oil in a large skillet over medium heat.",
      "Add garlic and cook for 30 seconds until fragrant.",
      "Add ingredients that need longer cooking times first.",
      "Continue adding ingredients in order of cooking time needed.",
      "Season with herbs, salt, and pepper.",
      "Cook until all ingredients are properly cooked through.",
      "Adjust seasoning to taste.",
      "Serve hot with lemon wedges on the side."
    ],
    nutrition: {
      calories: 350,
      protein: 15,
      fat: 18,
      carbs: 30
    },
    cookingTime: "30 minutes",
    servings: 2
  };
}
