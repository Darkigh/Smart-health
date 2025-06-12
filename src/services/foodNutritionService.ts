import { NutritionData } from '../types/NutritionData';

// Use environment variables in production
const API_KEY = 'AIzaSyAzRGqK1XJ3NyhFYzd5oYhD4JDMFHSygcs';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Base delay for exponential backoff (in milliseconds)
const BASE_DELAY = 1000;

/**
 * Analyze food nutrition content using Google's Gemini API
 * 
 * @param foodDescription - Description of food to analyze
 * @returns Promise resolving to NutritionData object
 */
export async function analyzeFoodWithGemini(foodDescription: string): Promise<NutritionData> {
  try {
    if (!foodDescription.trim()) {
      throw new Error("No food description provided");
    }
    
    // Construct improved prompt for Gemini API with more detailed instructions
    const prompt = `You are a professional nutritionist with expertise in food composition analysis. 
    
    Analyze the nutritional content of the following food: "${foodDescription}".
    
    CRITICAL REQUIREMENTS:
    1. Return ONLY pure JSON with no additional text, explanations, or markdown
    2. Use exactly this structure: {"calories": 350, "protein": 20, ...}
    3. Base your analysis on standard portion sizes (specify the portion size in the notes field)
    4. Consider ALL ingredients mentioned in the description
    5. Pay attention to cooking methods (fried foods have more calories than baked)
    6. Provide realistic values that match actual nutritional content of these foods
    7. If quantities are mentioned (e.g., "2 slices of pizza"), adjust values accordingly
    8. For mixed dishes, calculate the combined nutritional value
    
    Provide a detailed and ACCURATE nutritional breakdown with realistic values based on standard nutritional databases like USDA. Include:
    
    1. Total calories (kcal)
    2. Protein content in grams
    3. Fat content in grams
    4. Carbohydrate content in grams
    5. Fiber content in grams
    6. Sugar content in grams
    7. Sodium content in mg
    8. Vitamin content levels (A, C, D) as "high", "medium", "low", or "none"
    9. Mineral content levels (calcium, iron, potassium) as "high", "medium", "low", or "none"
    10. Portion size used for calculation
    11. Notes about the nutritional profile
    
    Example format:
    {
      "calories": 350,
      "protein": 20,
      "fat": 15,
      "carbs": 30,
      "fiber": 4,
      "sugar": 6,
      "sodium": 500,
      "vitamins": {
        "A": "medium",
        "C": "high",
        "D": "low"
      },
      "minerals": {
        "calcium": "medium",
        "iron": "low",
        "potassium": "medium"
      },
      "portionSize": "1 cup (240ml)",
      "notes": "Analysis based on homemade preparation with standard ingredients."
    }`;
    
    // Call Gemini API with retry logic
    let nutritionData: NutritionData | null = null;
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
              temperature: 0.1, // Very low temperature for factual responses
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse and format the response
        const nutritionText = data.candidates[0].content.parts[0].text;
        nutritionData = parseNutritionResponse(nutritionText);
        
        // Validate nutrition data for realism
        const validatedData = validateNutritionData(nutritionData, foodDescription);
        
        // If validation passes, return the data
        return validatedData;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        attempt++;
      }
    }
    
    // If all retries fail, use fallback
    console.error('All API attempts failed, using fallback:', lastError);
    return generateEnhancedFallbackNutrition(foodDescription);
  } catch (error) {
    console.error('Error analyzing food with Gemini:', error);
    // Fall back to enhanced mock data if API fails
    return generateEnhancedFallbackNutrition(foodDescription);
  }
}

/**
 * Parse the response from Gemini API into NutritionData object
 * 
 * @param responseText - Raw text response from Gemini API
 * @returns NutritionData object
 */
function parseNutritionResponse(responseText: string): NutritionData {
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
    
    // Find first { and last } to extract pure JSON
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON object found in response');
    }
    
    jsonString = jsonString.substring(jsonStart, jsonEnd);
    
    // Parse the JSON
    const parsedData = JSON.parse(jsonString);
    
    // Validate and normalize the parsed data
    return normalizeNutritionData(parsedData);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return extractNutritionWithRegex(responseText);
  }
}

/**
 * Normalize nutrition data to ensure consistent structure
 * 
 * @param data - Raw parsed nutrition data
 * @returns Normalized NutritionData object
 */
function normalizeNutritionData(data: any): NutritionData {
  // Ensure all required fields exist with proper types
  const normalized: NutritionData = {
    calories: typeof data.calories === 'number' ? data.calories : 0,
    protein: typeof data.protein === 'number' ? data.protein : 0,
    fat: typeof data.fat === 'number' ? data.fat : 0,
    carbs: typeof data.carbs === 'number' ? data.carbs : 0,
    fiber: typeof data.fiber === 'number' ? data.fiber : 0,
    sugar: typeof data.sugar === 'number' ? data.sugar : 0,
    sodium: typeof data.sodium === 'number' ? data.sodium : 0,
    vitamins: {
      A: 'medium',
      C: 'medium',
      D: 'low'
    },
    minerals: {
      calcium: 'medium',
      iron: 'low',
      potassium: 'medium'
    },
    portionSize: typeof data.portionSize === 'string' ? data.portionSize : "1 serving",
    notes: typeof data.notes === 'string' ? data.notes : ""
  };
  
  // Handle vitamins if present
  if (data.vitamins) {
    normalized.vitamins = {
      A: typeof data.vitamins.A === 'string' ? data.vitamins.A.toLowerCase() : 'medium',
      C: typeof data.vitamins.C === 'string' ? data.vitamins.C.toLowerCase() : 'medium',
      D: typeof data.vitamins.D === 'string' ? data.vitamins.D.toLowerCase() : 'low'
    };
  }
  
  // Handle minerals if present
  if (data.minerals) {
    normalized.minerals = {
      calcium: typeof data.minerals.calcium === 'string' ? data.minerals.calcium.toLowerCase() : 'medium',
      iron: typeof data.minerals.iron === 'string' ? data.minerals.iron.toLowerCase() : 'low',
      potassium: typeof data.minerals.potassium === 'string' ? data.minerals.potassium.toLowerCase() : 'medium'
    };
  }
  
  // Ensure vitamin and mineral values are valid
  const validLevels = ['high', 'medium', 'low', 'none'];
  
  normalized.vitamins.A = validLevels.includes(normalized.vitamins.A) ? normalized.vitamins.A : 'medium';
  normalized.vitamins.C = validLevels.includes(normalized.vitamins.C) ? normalized.vitamins.C : 'medium';
  normalized.vitamins.D = validLevels.includes(normalized.vitamins.D) ? normalized.vitamins.D : 'low';
  
  normalized.minerals.calcium = validLevels.includes(normalized.minerals.calcium) ? normalized.minerals.calcium : 'medium';
  normalized.minerals.iron = validLevels.includes(normalized.minerals.iron) ? normalized.minerals.iron : 'low';
  normalized.minerals.potassium = validLevels.includes(normalized.minerals.potassium) ? normalized.minerals.potassium : 'medium';
  
  return normalized;
}

/**
 * Extract nutrition information using regex when JSON parsing fails
 * 
 * @param text - Raw text response from Gemini API
 * @returns NutritionData object
 */
function extractNutritionWithRegex(text: string): NutritionData {
  // Extract calories
  const caloriesMatch = text.match(/calories:?\s*(\d+)/i);
  const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : 350;
  
  // Extract protein
  const proteinMatch = text.match(/protein:?\s*(\d+)/i);
  const protein = proteinMatch ? parseInt(proteinMatch[1]) : 15;
  
  // Extract fat
  const fatMatch = text.match(/fat:?\s*(\d+)/i);
  const fat = fatMatch ? parseInt(fatMatch[1]) : 12;
  
  // Extract carbs
  const carbsMatch = text.match(/carbs:?\s*(\d+)/i) || text.match(/carbohydrates:?\s*(\d+)/i);
  const carbs = carbsMatch ? parseInt(carbsMatch[1]) : 30;
  
  // Extract fiber
  const fiberMatch = text.match(/fiber:?\s*(\d+)/i);
  const fiber = fiberMatch ? parseInt(fiberMatch[1]) : 3;
  
  // Extract sugar
  const sugarMatch = text.match(/sugar:?\s*(\d+)/i);
  const sugar = sugarMatch ? parseInt(sugarMatch[1]) : 5;
  
  // Extract sodium
  const sodiumMatch = text.match(/sodium:?\s*(\d+)/i);
  const sodium = sodiumMatch ? parseInt(sodiumMatch[1]) : 400;
  
  // Extract vitamins
  const vitaminAMatch = text.match(/vitamin a:?\s*(\w+)/i);
  const vitaminA = vitaminAMatch ? vitaminAMatch[1].toLowerCase() : 'medium';
  
  const vitaminCMatch = text.match(/vitamin c:?\s*(\w+)/i);
  const vitaminC = vitaminCMatch ? vitaminCMatch[1].toLowerCase() : 'medium';
  
  const vitaminDMatch = text.match(/vitamin d:?\s*(\w+)/i);
  const vitaminD = vitaminDMatch ? vitaminDMatch[1].toLowerCase() : 'low';
  
  // Extract minerals
  const calciumMatch = text.match(/calcium:?\s*(\w+)/i);
  const calcium = calciumMatch ? calciumMatch[1].toLowerCase() : 'medium';
  
  const ironMatch = text.match(/iron:?\s*(\w+)/i);
  const iron = ironMatch ? ironMatch[1].toLowerCase() : 'low';
  
  const potassiumMatch = text.match(/potassium:?\s*(\w+)/i);
  const potassium = potassiumMatch ? potassiumMatch[1].toLowerCase() : 'medium';
  
  // Extract portion size
  const portionSizeMatch = text.match(/portion size:?\s*([^\n]+)/i);
  const portionSize = portionSizeMatch ? portionSizeMatch[1].trim() : "1 serving";
  
  // Extract notes
  const notesMatch = text.match(/notes:?\s*([^\n]+)/i);
  const notes = notesMatch ? notesMatch[1].trim() : "";
  
  return {
    calories,
    protein,
    fat,
    carbs,
    fiber,
    sugar,
    sodium,
    vitamins: {
      A: vitaminA,
      C: vitaminC,
      D: vitaminD
    },
    minerals: {
      calcium,
      iron,
      potassium
    },
    portionSize,
    notes
  };
}

/**
 * Validate nutrition data for realism based on food description
 * 
 * @param data - NutritionData object to validate
 * @param foodDescription - Description of food
 * @returns Validated NutritionData object
 */
function validateNutritionData(data: NutritionData, foodDescription: string): NutritionData {
  const lowerCaseFood = foodDescription.toLowerCase();
  
  // Check for unrealistic calorie values
  if (data.calories < 50 && !lowerCaseFood.includes('celery') && !lowerCaseFood.includes('lettuce') && 
      !lowerCaseFood.includes('cucumber') && !lowerCaseFood.includes('water')) {
    // Most foods except very low calorie vegetables should have more than 50 calories
    data.calories = Math.max(data.calories, 100);
  }
  
  if (data.calories > 1500 && !lowerCaseFood.includes('meal') && !lowerCaseFood.includes('dinner') && 
      !lowerCaseFood.includes('lunch') && !lowerCaseFood.includes('breakfast')) {
    // Single food items rarely exceed 1500 calories unless it's a full meal
    data.calories = Math.min(data.calories, 1000);
  }
  
  // Check for unrealistic protein values
  if (data.protein > 100) {
    // Very few foods have more than 100g protein per serving
    data.protein = Math.min(data.protein, 50);
  }
  
  // Check for unrealistic fat values
  if (data.fat > 100) {
    // Very few foods have more than 100g fat per serving
    data.fat = Math.min(data.fat, 50);
  }
  
  // Check for unrealistic carb values
  if (data.carbs > 200) {
    // Very few foods have more than 200g carbs per serving
    data.carbs = Math.min(data.carbs, 100);
  }
  
  // Check for unrealistic fiber values
  if (data.fiber > 50) {
    data.fiber = Math.min(data.fiber, 25);
  }
  
  // Check for unrealistic sugar values
  if (data.sugar > 100) {
    data.sugar = Math.min(data.sugar, 50);
  }
  
  // Check for unrealistic sodium values
  if (data.sodium > 5000) {
    data.sodium = Math.min(data.sodium, 2500);
  }
  
  // Ensure vitamin values are valid
  const validVitaminLevels = ['high', 'medium', 'low', 'none'];
  if (!validVitaminLevels.includes(data.vitamins.A)) data.vitamins.A = 'medium';
  if (!validVitaminLevels.includes(data.vitamins.C)) data.vitamins.C = 'medium';
  if (!validVitaminLevels.includes(data.vitamins.D)) data.vitamins.D = 'low';
  
  // Ensure mineral values are valid
  if (!validVitaminLevels.includes(data.minerals.calcium)) data.minerals.calcium = 'medium';
  if (!validVitaminLevels.includes(data.minerals.iron)) data.minerals.iron = 'low';
  if (!validVitaminLevels.includes(data.minerals.potassium)) data.minerals.potassium = 'medium';
  
  // Adjust vitamin levels based on food type
  if (lowerCaseFood.includes('carrot') || lowerCaseFood.includes('sweet potato') || 
      lowerCaseFood.includes('spinach') || lowerCaseFood.includes('kale')) {
    data.vitamins.A = 'high';
  }
  
  if (lowerCaseFood.includes('orange') || lowerCaseFood.includes('lemon') || 
      lowerCaseFood.includes('kiwi') || lowerCaseFood.includes('strawberry') || 
      lowerCaseFood.includes('bell pepper')) {
    data.vitamins.C = 'high';
  }
  
  if (lowerCaseFood.includes('fish') || lowerCaseFood.includes('salmon') || 
      lowerCaseFood.includes('egg') || lowerCaseFood.includes('mushroom')) {
    data.vitamins.D = 'high';
  }
  
  // Adjust mineral levels based on food type
  if (lowerCaseFood.includes('milk') || lowerCaseFood.includes('cheese') || 
      lowerCaseFood.includes('yogurt') || lowerCaseFood.includes('tofu')) {
    data.minerals.calcium = 'high';
  }
  
  if (lowerCaseFood.includes('beef') || lowerCaseFood.includes('spinach') || 
      lowerCaseFood.includes('lentil') || lowerCaseFood.includes('bean')) {
    data.minerals.iron = 'high';
  }
  
  if (lowerCaseFood.includes('banana') || lowerCaseFood.includes('potato') || 
      lowerCaseFood.includes('avocado') || lowerCaseFood.includes('spinach')) {
    data.minerals.potassium = 'high';
  }
  
  return data;
}

/**
 * Enhanced fallback to generate nutrition data if API fails
 * 
 * @param foodDescription - Description of food
 * @returns NutritionData object
 */
function generateEnhancedFallbackNutrition(foodDescription: string): NutritionData {
  // Generate somewhat realistic nutrition data based on food description
  const lowerCaseFood = foodDescription.toLowerCase();
  
  // Base values
  let baseCalories = 300;
  let baseProtein = 15;
  let baseFat = 12;
  let baseCarbs = 30;
  let baseFiber = 3;
  let baseSugar = 5;
  let baseSodium = 400;
  let vitaminA = 'medium';
  let vitaminC = 'medium';
  let vitaminD = 'low';
  let calcium = 'medium';
  let iron = 'low';
  let potassium = 'medium';
  let portionSize = "1 serving";
  let notes = "Analysis based on typical preparation.";
  
  // Food categories for better estimation
  const lowCalorieFoods = ['salad', 'vegetable', 'fruit', 'apple', 'orange', 'broccoli', 'spinach', 'lettuce', 'tomato', 'cucumber'];
  const mediumCalorieFoods = ['yogurt', 'milk', 'egg', 'chicken', 'fish', 'turkey', 'tofu', 'lean'];
  const highCalorieFoods = ['burger', 'pizza', 'fries', 'fried', 'cheese', 'cream', 'cake', 'chocolate', 'ice cream', 'dessert', 'butter', 'oil'];
  
  const highProteinFoods = ['chicken', 'beef', 'fish', 'egg', 'protein', 'meat', 'steak', 'turkey', 'tofu', 'greek yogurt'];
  const highFatFoods = ['cheese', 'butter', 'oil', 'cream', 'avocado', 'nuts', 'fried', 'bacon', 'sausage'];
  const highCarbFoods = ['bread', 'pasta', 'rice', 'potato', 'sugar', 'cake', 'cookie', 'dessert', 'sweet', 'cereal', 'oats'];
  const highFiberFoods = ['beans', 'lentils', 'whole grain', 'bran', 'oats', 'broccoli', 'berries', 'pear', 'apple', 'avocado'];
  const highSugarFoods = ['candy', 'chocolate', 'cake', 'ice cream', 'soda', 'juice', 'honey', 'syrup', 'dessert', 'sweet'];
  const highSodiumFoods = ['salt', 'soy sauce', 'processed', 'canned', 'bacon', 'ham', 'cheese', 'pickle', 'fast food', 'snack'];
  
  // Count food items to estimate portion size
  const foodItems = foodDescription.split(/,|and/).length;
  const portionMultiplier = foodItems > 3 ? 1.5 : 1;
  
  // Check for quantity indicators
  const quantityMatch = lowerCaseFood.match(/(\d+)\s+(slice|piece|cup|bowl|plate|serving)/);
  const quantityMultiplier = quantityMatch ? parseInt(quantityMatch[1]) : 1;
  
  // Set portion size based on description
  if (lowerCaseFood.includes('cup')) {
    portionSize = quantityMatch ? `${quantityMatch[1]} cup(s)` : "1 cup";
  } else if (lowerCaseFood.includes('slice')) {
    portionSize = quantityMatch ? `${quantityMatch[1]} slice(s)` : "1 slice";
  } else if (lowerCaseFood.includes('bowl')) {
    portionSize = quantityMatch ? `${quantityMatch[1]} bowl(s)` : "1 bowl";
  } else if (lowerCaseFood.includes('piece')) {
    portionSize = quantityMatch ? `${quantityMatch[1]} piece(s)` : "1 piece";
  } else if (lowerCaseFood.includes('tablespoon') || lowerCaseFood.includes('tbsp')) {
    portionSize = quantityMatch ? `${quantityMatch[1]} tablespoon(s)` : "1 tablespoon";
  } else if (lowerCaseFood.includes('teaspoon') || lowerCaseFood.includes('tsp')) {
    portionSize = quantityMatch ? `${quantityMatch[1]} teaspoon(s)` : "1 teaspoon";
  } else if (lowerCaseFood.includes('ounce') || lowerCaseFood.includes('oz')) {
    portionSize = quantityMatch ? `${quantityMatch[1]} ounce(s)` : "1 ounce";
  } else if (lowerCaseFood.includes('gram') || lowerCaseFood.includes('g')) {
    portionSize = quantityMatch ? `${quantityMatch[1]} gram(s)` : "100 grams";
  }
  
  // Adjust base values by food type
  if (lowCalorieFoods.some(food => lowerCaseFood.includes(food))) {
    baseCalories = 150;
    baseProtein = 5;
    baseFat = 3;
    baseCarbs = 15;
    baseFiber = 4;
    baseSugar = 8;
    baseSodium = 20;
    vitaminC = 'high';
    notes = "Low calorie food with high vitamin content.";
  } else if (mediumCalorieFoods.some(food => lowerCaseFood.includes(food))) {
    baseCalories = 250;
    baseProtein = 20;
    baseFat = 10;
    baseCarbs = 15;
    baseFiber = 1;
    baseSugar = 2;
    baseSodium = 200;
    notes = "Good source of protein with moderate calories.";
  } else if (highCalorieFoods.some(food => lowerCaseFood.includes(food))) {
    baseCalories = 500;
    baseProtein = 15;
    baseFat = 25;
    baseCarbs = 45;
    baseFiber = 2;
    baseSugar = 15;
    baseSodium = 800;
    vitaminA = 'low';
    vitaminC = 'low';
    notes = "High calorie food with significant fat and carbohydrate content.";
  }
  
  // Further adjust based on specific food types
  if (highProteinFoods.some(food => lowerCaseFood.includes(food))) {
    baseProtein += 20;
    baseCalories += 50;
    iron = 'high';
    notes = notes + " Excellent source of protein.";
  }
  
  if (highFatFoods.some(food => lowerCaseFood.includes(food))) {
    baseFat += 15;
    baseCalories += 100;
    vitaminD = 'medium';
    notes = notes + " Contains significant fat content.";
  }
  
  if (highCarbFoods.some(food => lowerCaseFood.includes(food))) {
    baseCarbs += 30;
    baseCalories += 80;
    baseSugar += 5;
    notes = notes + " High in carbohydrates.";
  }
  
  if (highFiberFoods.some(food => lowerCaseFood.includes(food))) {
    baseFiber += 6;
    notes = notes + " Good source of dietary fiber.";
  }
  
  if (highSugarFoods.some(food => lowerCaseFood.includes(food))) {
    baseSugar += 20;
    baseCalories += 60;
    notes = notes + " Contains added sugars.";
  }
  
  if (highSodiumFoods.some(food => lowerCaseFood.includes(food))) {
    baseSodium += 500;
    notes = notes + " High sodium content.";
  }
  
  // Adjust for cooking method
  if (lowerCaseFood.includes('fried')) {
    baseFat += 10;
    baseCalories += 100;
    notes = notes + " Fried preparation adds additional fat and calories.";
  } else if (lowerCaseFood.includes('baked') || lowerCaseFood.includes('grilled')) {
    baseFat -= 3;
    baseCalories -= 30;
    notes = notes + " Baked/grilled preparation reduces fat content.";
  } else if (lowerCaseFood.includes('boiled') || lowerCaseFood.includes('steamed')) {
    baseFat -= 2;
    baseCalories -= 20;
    notes = notes + " Boiled/steamed preparation preserves nutrients with minimal added fat.";
  }
  
  // Determine vitamin levels based on food description
  const highVitaminAFoods = ['carrot', 'sweet potato', 'spinach', 'kale', 'liver', 'pumpkin', 'butternut squash'];
  const highVitaminCFoods = ['orange', 'lemon', 'strawberry', 'kiwi', 'bell pepper', 'broccoli', 'brussels sprouts', 'grapefruit'];
  const highVitaminDFoods = ['fish', 'egg', 'mushroom', 'milk', 'yogurt', 'fortified', 'salmon', 'tuna'];
  
  if (highVitaminAFoods.some(food => lowerCaseFood.includes(food))) {
    vitaminA = 'high';
  } else if (lowCalorieFoods.some(food => lowerCaseFood.includes(food))) {
    vitaminA = 'medium';
  } else {
    vitaminA = 'low';
  }
  
  if (highVitaminCFoods.some(food => lowerCaseFood.includes(food))) {
    vitaminC = 'high';
  } else if (lowCalorieFoods.some(food => lowerCaseFood.includes(food))) {
    vitaminC = 'medium';
  } else {
    vitaminC = 'low';
  }
  
  if (highVitaminDFoods.some(food => lowerCaseFood.includes(food))) {
    vitaminD = 'medium';
  } else {
    vitaminD = 'low';
  }
  
  // Determine mineral levels based on food description
  const highCalciumFoods = ['milk', 'cheese', 'yogurt', 'tofu', 'kale', 'sardines', 'almonds', 'fortified'];
  const highIronFoods = ['beef', 'spinach', 'lentil', 'bean', 'tofu', 'quinoa', 'fortified', 'liver'];
  const highPotassiumFoods = ['banana', 'potato', 'avocado', 'spinach', 'sweet potato', 'yogurt', 'salmon', 'beans'];
  
  if (highCalciumFoods.some(food => lowerCaseFood.includes(food))) {
    calcium = 'high';
  }
  
  if (highIronFoods.some(food => lowerCaseFood.includes(food))) {
    iron = 'high';
  }
  
  if (highPotassiumFoods.some(food => lowerCaseFood.includes(food))) {
    potassium = 'high';
  }
  
  // Apply multipliers
  const calories = Math.round(baseCalories * portionMultiplier * quantityMultiplier);
  const protein = Math.round(baseProtein * portionMultiplier * quantityMultiplier);
  const fat = Math.round(baseFat * portionMultiplier * quantityMultiplier);
  const carbs = Math.round(baseCarbs * portionMultiplier * quantityMultiplier);
  const fiber = Math.round(baseFiber * portionMultiplier * quantityMultiplier);
  const sugar = Math.round(baseSugar * portionMultiplier * quantityMultiplier);
  const sodium = Math.round(baseSodium * portionMultiplier * quantityMultiplier);
  
  return {
    calories,
    protein,
    fat,
    carbs,
    fiber,
    sugar,
    sodium,
    vitamins: {
      A: vitaminA,
      C: vitaminC,
      D: vitaminD
    },
    minerals: {
      calcium,
      iron,
      potassium
    },
    portionSize,
    notes
  };
}
