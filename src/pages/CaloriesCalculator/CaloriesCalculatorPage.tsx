import React from 'react';
import { analyzeFoodWithGemini } from '../../services/foodNutritionService';
import { NutritionData } from '../../types/NutritionData';
import foodBg from '../../assets/food-background.jpg';

const CaloriesCalculatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('food');
  const [foodDescription, setFoodDescription] = React.useState('');
  const [nutritionData, setNutritionData] = React.useState<NutritionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Body calories form state
  const [formData, setFormData] = React.useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'sedentary'
  });
  const [calorieData, setCalorieData] = React.useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const analyzeFoodNutrition = async () => {
    if (!foodDescription.trim()) {
      setError("Please enter a food description");
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    
    try {
      // Call Gemini API for food nutrition analysis
      const data = await analyzeFoodWithGemini(foodDescription);
      setNutritionData(data);
    } catch (error) {
      console.error('Error analyzing food nutrition:', error);
      setError("Failed to analyze food nutrition. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateCalorieNeeds = () => {
    // Validate inputs
    if (!formData.age || !formData.height || !formData.weight) {
      setError("Please fill in all required fields");
      return;
    }
    
    setError(null);
    
    // Calculate BMR using Mifflin-St Jeor formula
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    
    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Apply activity factor
    const activityFactors: {[key: string]: number} = {
      'sedentary': 1.2,
      'lightly_active': 1.375,
      'moderately_active': 1.55,
      'very_active': 1.725,
      'super_active': 1.9
    };
    
    const tdee = bmr * activityFactors[formData.activityLevel];
    
    // Calculate calorie deficit and weight loss using BMR instead of calories eaten
    // Daily Calorie Deficit = TDEE - BMR
    const dailyCalorieDeficit = tdee - bmr;
    
    // Daily Weight Loss (kg) = Daily Deficit / 7700
    const dailyWeightLossKg = dailyCalorieDeficit / 7700;
    
    // Daily Weight Loss (grams) = Daily Weight Loss (kg) × 1000
    const dailyWeightLossGrams = dailyWeightLossKg * 1000;
    
    // Weekly Calorie Deficit = Daily Deficit × 7
    const weeklyCalorieDeficit = dailyCalorieDeficit * 7;
    
    // Weekly Weight Loss (kg) = Weekly Deficit / 7700
    const weeklyWeightLossKg = weeklyCalorieDeficit / 7700;
    
    // Weekly Weight Loss (grams) = Weekly Weight Loss (kg) × 1000
    const weeklyWeightLossGrams = weeklyWeightLossKg * 1000;
    
    setCalorieData({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalorieDeficit: Math.round(dailyCalorieDeficit),
      weeklyCalorieDeficit: Math.round(weeklyCalorieDeficit),
      dailyWeightLossKg: dailyWeightLossKg.toFixed(2),
      dailyWeightLossGrams: Math.round(dailyWeightLossGrams),
      weeklyWeightLossKg: weeklyWeightLossKg.toFixed(2),
      weeklyWeightLossGrams: Math.round(weeklyWeightLossGrams)
    });
  };

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${foodBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex mb-6">
            <button
              className={`flex-1 py-3 px-4 text-center rounded-tl-lg rounded-bl-lg font-semibold ${
                activeTab === 'food' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-200 text-gray-700 hover:bg-green-300'
              }`}
              onClick={() => setActiveTab('food')}
            >
              Food Calories
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center rounded-tr-lg rounded-br-lg font-semibold ${
                activeTab === 'body' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-200 text-gray-700 hover:bg-green-300'
              }`}
              onClick={() => setActiveTab('body')}
            >
              Body Calories
            </button>
          </div>
          
          {/* Food Calories Section */}
          {activeTab === 'food' && (
            <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Food Calories Analysis</h2>
              
              <div className="mb-4">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe the food you ate (e.g., 2 slices of pepperoni pizza with extra cheese, a bowl of spaghetti with meatballs)"
                  value={foodDescription}
                  onChange={(e) => setFoodDescription(e.target.value)}
                  rows={3}
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
              
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                onClick={analyzeFoodNutrition}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Nutrition'}
              </button>
              
              {nutritionData && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Nutrition Information</h3>
                  
                  {nutritionData.portionSize && (
                    <div className="mb-3 text-gray-700">
                      <span className="font-medium">Portion Size:</span> {nutritionData.portionSize}
                    </div>
                  )}
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-sm">Calories</span>
                        <span className="text-xl font-bold text-green-700">{nutritionData.calories} kcal</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-sm">Protein</span>
                        <span className="text-xl font-bold text-green-700">{nutritionData.protein}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-sm">Fat</span>
                        <span className="text-xl font-bold text-green-700">{nutritionData.fat}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-sm">Carbohydrates</span>
                        <span className="text-xl font-bold text-green-700">{nutritionData.carbs}g</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-sm">Fiber</span>
                        <span className="text-lg font-bold text-green-700">{nutritionData.fiber}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-sm">Sugar</span>
                        <span className="text-lg font-bold text-green-700">{nutritionData.sugar}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-sm">Sodium</span>
                        <span className="text-lg font-bold text-green-700">{nutritionData.sodium}mg</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2">Vitamin Content</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-sm">Vitamin A</span>
                          <span className={`font-bold ${
                            nutritionData.vitamins.A === 'high' ? 'text-green-600' :
                            nutritionData.vitamins.A === 'medium' ? 'text-yellow-600' :
                            nutritionData.vitamins.A === 'low' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {nutritionData.vitamins.A.charAt(0).toUpperCase() + nutritionData.vitamins.A.slice(1)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-sm">Vitamin C</span>
                          <span className={`font-bold ${
                            nutritionData.vitamins.C === 'high' ? 'text-green-600' :
                            nutritionData.vitamins.C === 'medium' ? 'text-yellow-600' :
                            nutritionData.vitamins.C === 'low' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {nutritionData.vitamins.C.charAt(0).toUpperCase() + nutritionData.vitamins.C.slice(1)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-sm">Vitamin D</span>
                          <span className={`font-bold ${
                            nutritionData.vitamins.D === 'high' ? 'text-green-600' :
                            nutritionData.vitamins.D === 'medium' ? 'text-yellow-600' :
                            nutritionData.vitamins.D === 'low' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {nutritionData.vitamins.D.charAt(0).toUpperCase() + nutritionData.vitamins.D.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2">Mineral Content</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-sm">Calcium</span>
                          <span className={`font-bold ${
                            nutritionData.minerals.calcium === 'high' ? 'text-green-600' :
                            nutritionData.minerals.calcium === 'medium' ? 'text-yellow-600' :
                            nutritionData.minerals.calcium === 'low' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {nutritionData.minerals.calcium.charAt(0).toUpperCase() + nutritionData.minerals.calcium.slice(1)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-sm">Iron</span>
                          <span className={`font-bold ${
                            nutritionData.minerals.iron === 'high' ? 'text-green-600' :
                            nutritionData.minerals.iron === 'medium' ? 'text-yellow-600' :
                            nutritionData.minerals.iron === 'low' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {nutritionData.minerals.iron.charAt(0).toUpperCase() + nutritionData.minerals.iron.slice(1)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-sm">Potassium</span>
                          <span className={`font-bold ${
                            nutritionData.minerals.potassium === 'high' ? 'text-green-600' :
                            nutritionData.minerals.potassium === 'medium' ? 'text-yellow-600' :
                            nutritionData.minerals.potassium === 'low' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {nutritionData.minerals.potassium.charAt(0).toUpperCase() + nutritionData.minerals.potassium.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {nutritionData.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                        <p className="text-gray-700">{nutritionData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Body Calories Section */}
          {activeTab === 'body' && (
            <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Calorie Needs Calculator</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Age:</label>
                  <input
                    type="number"
                    name="age"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Gender:</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-green-600"
                      />
                      <span className="ml-2 text-gray-700">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-green-600"
                      />
                      <span className="ml-2 text-gray-700">Female</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Height:</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="height"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formData.height}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2 text-gray-700">cm</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Weight:</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="weight"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2 text-gray-700">kg</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Activity Level:</label>
                  <div className="space-y-2">
                    <label className="block">
                      <input 
                        type="radio" 
                        name="activityLevel"
                        value="sedentary"
                        checked={formData.activityLevel === 'sedentary'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-green-600 mr-2"
                      />
                      Sedentary (little or no exercise)
                    </label>
                    <label className="block">
                      <input 
                        type="radio" 
                        name="activityLevel"
                        value="lightly_active"
                        checked={formData.activityLevel === 'lightly_active'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-green-600 mr-2"
                      />
                      Lightly active (light exercise 1-3 days/week)
                    </label>
                    <label className="block">
                      <input 
                        type="radio" 
                        name="activityLevel"
                        value="moderately_active"
                        checked={formData.activityLevel === 'moderately_active'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-green-600 mr-2"
                      />
                      Moderately active (moderate exercise 3-5 days/week)
                    </label>
                    <label className="block">
                      <input 
                        type="radio" 
                        name="activityLevel"
                        value="very_active"
                        checked={formData.activityLevel === 'very_active'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-green-600 mr-2"
                      />
                      Very active (hard exercise 6-7 days/week)
                    </label>
                    <label className="block">
                      <input 
                        type="radio" 
                        name="activityLevel"
                        value="super_active"
                        checked={formData.activityLevel === 'super_active'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-green-600 mr-2"
                      />
                      Super active (very hard exercise & physical job or training twice a day)
                    </label>
                  </div>
                </div>
                
                {error && <p className="text-red-500">{error}</p>}
                
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                  onClick={calculateCalorieNeeds}
                >
                  Calculate
                </button>
              </div>
              
              {calorieData && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Daily Calorie Needs</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Basal Metabolic Rate (BMR):</p>
                        <p className="text-xl font-bold text-green-700">{calorieData.bmr} calories/day</p>
                        <p className="text-xs text-gray-500 mt-1">Calories your body needs at complete rest</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Daily Energy Expenditure (TDEE):</p>
                        <p className="text-xl font-bold text-green-700">{calorieData.tdee} calories/day</p>
                        <p className="text-xs text-gray-500 mt-1">Calories you burn daily with activity</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2">Weight Management Goals</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-yellow-50 p-3 rounded">
                          <p className="font-medium text-yellow-800">Weight Loss</p>
                          <p className="text-yellow-700">{Math.round(calorieData.tdee * 0.8)} calories/day</p>
                          <p className="text-xs text-yellow-600 mt-1">20% calorie deficit</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-medium text-green-800">Maintenance</p>
                          <p className="text-green-700">{calorieData.tdee} calories/day</p>
                          <p className="text-xs text-green-600 mt-1">Maintain current weight</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-medium text-blue-800">Weight Gain</p>
                          <p className="text-blue-700">{Math.round(calorieData.tdee * 1.1)} calories/day</p>
                          <p className="text-xs text-blue-600 mt-1">10% calorie surplus</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaloriesCalculatorPage;
