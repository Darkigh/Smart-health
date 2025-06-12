import React, { useState } from 'react';
import foodBg from '../../assets/food-background.jpg';
import { generateRecipeWithGemini } from '../../services/geminiApiService';
import { generateRecipes } from '../../services/mockRecipeService';
import { Recipe } from '../../types/Recipe';

const RecipeFinderPage: React.FC = () => {
  const [mealType, setMealType] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false
  });
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleMealTypeChange = (type: string) => {
    setMealType({
      ...mealType,
      [type]: !mealType[type as keyof typeof mealType]
    });
  };

  const handleSubmit = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // First try to use the Gemini AI recipe service
      let aiRecipes: Recipe[] = [];
      
      try {
        aiRecipes = await generateRecipeWithGemini(ingredients, mealType);
      } catch (err) {
        console.error("Gemini API error:", err);
        // If Gemini API fails, we'll use the fallback below
        aiRecipes = [];
      }
      
      // If no recipes were generated or the API failed, use our guaranteed fallback
      if (aiRecipes.length === 0) {
        console.log("Using fallback recipe generation");
        aiRecipes = generateRecipes(ingredients);
      }
      
      setRecipes(aiRecipes);
    } catch (err) {
      // This should never happen now that we have a guaranteed fallback
      console.error("Recipe generation error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${foodBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Recipe Finder</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Meal Type</h3>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-green-600"
                  checked={mealType.breakfast}
                  onChange={() => handleMealTypeChange('breakfast')}
                />
                <span className="ml-2 text-gray-700">Breakfast</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-green-600"
                  checked={mealType.lunch}
                  onChange={() => handleMealTypeChange('lunch')}
                />
                <span className="ml-2 text-gray-700">Lunch</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-green-600"
                  checked={mealType.dinner}
                  onChange={() => handleMealTypeChange('dinner')}
                />
                <span className="ml-2 text-gray-700">Dinner</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-green-600"
                  checked={mealType.snack}
                  onChange={() => handleMealTypeChange('snack')}
                />
                <span className="ml-2 text-gray-700">Snack</span>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Enter Your Ingredients</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="List ingredients you have, separated by commas (e.g., eggs, milk, flour)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={5}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Generating AI Recipes...' : 'Generate Recipes'}
          </button>
        </div>
        
        {recipes.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-white text-center mb-4">AI-Generated Recipes</h2>
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-white bg-opacity-90 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-green-600">
                  <h3 className="text-xl font-bold text-white">{recipe.title}</h3>
                  <p className="text-green-100">Cooking Time: {recipe.cookingTime} | Servings: {recipe.servings}</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3">Ingredients:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {recipe.ingredients.map((ingredient, i) => (
                          <li key={i} className="text-gray-700">{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3">Nutrition Information:</h4>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-600">Calories:</p>
                            <p className="text-xl font-bold text-green-700">{recipe.nutrition.calories} kcal</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Protein:</p>
                            <p className="text-xl font-bold text-green-700">{recipe.nutrition.protein}g</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fat:</p>
                            <p className="text-xl font-bold text-green-700">{recipe.nutrition.fat}g</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Carbs:</p>
                            <p className="text-xl font-bold text-green-700">{recipe.nutrition.carbs}g</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-bold text-gray-800 mb-3">Cooking Instructions:</h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="text-gray-700">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeFinderPage;
