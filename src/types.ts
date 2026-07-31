export interface UserProfile {
  age: number;
  gender: string;
  weight: number; // in kg
  height: number; // in cm
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  dailyGoal: 'general_health' | 'weight_loss' | 'weight_gain' | 'muscle_gain';
}

export interface NutrientDetail {
  value: number;
  target: number;
  unit: string;
  status: 'green' | 'yellow' | 'red'; // Green = Adequate, Yellow = Slightly Low/High, Red = Significant Deficiency or Excess
  percentage: number; // calculated as value / target * 100
}

export interface MicronutrientStatus {
  name: string;
  status: 'adequate' | 'low' | 'high';
  description: string;
}

export interface SearchFoodResult {
  name: string;
  matchedFood: string;
  found: boolean;
  source: 'Open Food Facts API' | 'Generic Clinical Approximation';
  detailRequirementPrompt?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitaminsAndMineralsList?: string[];
}

export interface NutritionAnalysisResult {
  overallScore: number; // out of 100
  calories: NutrientDetail;
  protein: NutrientDetail;
  carbs: NutrientDetail;
  fat: NutrientDetail;
  fiber: NutrientDetail;
  vitamins: MicronutrientStatus[];
  minerals: MicronutrientStatus[];
  hydration: {
    recommended: number; // in liters
    estimated: number; // from intake, in liters
    recommendationText: string;
  };
  nutritionalGaps: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendations: {
    foodsToAdd: string[];
    foodsToReduce: string[];
    nextMealSuggestions: string[];
    simpleDietaryImprovements: string[];
    lifestyleTips: string[];
  };
  recommendedFoodsForGaps: {
    name: string;
    nutrientRichIn: string;
    whyRecommend: string;
    servingSuggestion: string;
  }[];
  searchedFoods: SearchFoodResult[];
}

export interface AnalysisRequest {
  profile: UserProfile;
  foodIntake: string;
}

export interface AnalysisResponse {
  success: boolean;
  result?: NutritionAnalysisResult;
  error?: string;
}
