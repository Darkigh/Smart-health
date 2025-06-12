export interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins: {
    A: string;
    C: string;
    D: string;
  };
  minerals: {
    calcium: string;
    iron: string;
    potassium: string;
  };
  portionSize: string;
  notes: string;
}
