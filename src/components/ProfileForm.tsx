import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  User, 
  Scale, 
  Ruler, 
  Activity, 
  Target, 
  Sparkles, 
  UtensilsCrossed, 
  Lightbulb,
  ClipboardList
} from "lucide-react";

interface ProfileFormProps {
  onSubmit: (profile: UserProfile, foodIntake: string) => void;
  isLoading: boolean;
}

const DIET_EXAMPLES = [
  {
    name: "Standard Balanced Fitness Diet",
    description: "Good distribution of lean proteins, complex carbs, and healthy fats.",
    goal: "general_health" as const,
    profile: {
      age: 28,
      gender: "Male",
      weight: 78,
      height: 180,
      activityLevel: "moderately_active" as const,
      dailyGoal: "general_health" as const
    },
    text: `Breakfast:
2 soft-boiled eggs, 2 slices of toasted whole wheat bread with 1/2 mashed avocado, and a cup of unsweetened green tea.

Lunch:
150g grilled chicken breast with a squeeze of lemon, 1.5 cups of steamed brown rice, and a side of steamed broccoli and carrots.

Snack:
A medium-sized apple with 15 raw almonds and a large glass of water.

Dinner:
150g oven-baked salmon fillet, 1 cup of cooked quinoa, 1 cup of sautéed spinach with olive oil, and 1 small bowl of plain Greek yogurt.

Fluids:
Total water intake: 2.8 liters.`
  },
  {
    name: "Vegetarian Diet (Triggering Protein Gap)",
    description: "Mainly simple carbs, low proteins, low hydration to test deficiency alerts.",
    goal: "muscle_gain" as const,
    profile: {
      age: 25,
      gender: "Female",
      weight: 58,
      height: 165,
      activityLevel: "lightly_active" as const,
      dailyGoal: "muscle_gain" as const
    },
    text: `Breakfast:
1 bowl of sweetened cornflakes with skim milk, 1 cup of orange juice, and a glazed donut.

Lunch:
A large plate of boiled white rice with a light tomato soup, green salad with lettuce and cucumber (no oil dressing, no cheese or protein).

Snack:
1 bag of low-fat potato chips and 1 can of diet soda.

Dinner:
3 pieces of wheat roti with a small serving of potato-pea curry and a cup of tea with sugar.

Fluids:
About 1 liter of fresh tap water.`
  },
  {
    name: "Hearty Muscle Builder Diet",
    description: "Very high calorie, elevated protein logs targeting bulking/muscle goals.",
    goal: "muscle_gain" as const,
    profile: {
      age: 24,
      gender: "Male",
      weight: 85,
      height: 182,
      activityLevel: "very_active" as const,
      dailyGoal: "muscle_gain" as const
    },
    text: `Breakfast:
4 scrambled eggs made with 1 tsp butter, 1 cup of rolled oatmeal cooked in 1 cup of whole milk, topped with 1 sliced banana, 2 tbsp of peanut butter, and 1 scoop of whey protein.

Lunch:
200g lean ground beef cooked with onions and spices, 2 cups of white basmati rice, 1 cup of boiled black beans, and 1 cup of greek salad.

Snack:
A protein bar (20g protein) and 2 handfuls of mixed cashews and walnuts.

Dinner:
200g pan-seared chicken breast, 300g of roasted sweet potato cubes, and a large side plate of sautéed broccoli and cauliflower with olive oil.

Fluids:
Drank approximately 3.8 liters of water throughout the day.`
  }
];

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  // Profile state initialized with clean default values
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<string>("Male");
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [activityLevel, setActivityLevel] = useState<UserProfile["activityLevel"]>("moderately_active");
  const [dailyGoal, setDailyGoal] = useState<UserProfile["dailyGoal"]>("general_health");
  const [foodIntake, setFoodIntake] = useState<string>("");

  const handleApplyExample = (ex: typeof DIET_EXAMPLES[0]) => {
    setAge(ex.profile.age);
    setGender(ex.profile.gender);
    setWeight(ex.profile.weight);
    setHeight(ex.profile.height);
    setActivityLevel(ex.profile.activityLevel);
    setDailyGoal(ex.profile.dailyGoal);
    setFoodIntake(ex.text);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodIntake.trim()) {
      alert("Please describe what you have eaten today so we can analyze it!");
      return;
    }
    const profile: UserProfile = {
      age,
      gender,
      weight,
      height,
      activityLevel,
      dailyGoal,
    };
    onSubmit(profile, foodIntake);
  };

  return (
    <div className="space-y-6" id="profile-entry-container">
      {/* Examples Selection */}
      <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-2xl p-5" id="preset-examples-section">
        <h3 className="text-indigo-950 font-bold text-sm mb-2 flex items-center gap-2">
          <Lightbulb className="w-4.5 h-4.5 text-indigo-600" />
          Guided Food Logs & Presets
        </h3>
        <p className="text-slate-500 text-xs mb-4">
          Select one of our preset logs to instantly populate the clinical form parameters and food diary:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DIET_EXAMPLES.map((ex, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleApplyExample(ex)}
              className="text-left bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs hover:border-indigo-400 hover:shadow-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id={`preset-example-${index}`}
            >
              <h4 className="text-slate-900 font-bold text-xs group-hover:text-indigo-600 transition-colors line-clamp-1">
                {ex.name}
              </h4>
              <p className="text-slate-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                {ex.description}
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <span className="uppercase font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {ex.goal.replace("_", " ")}
                </span>
                <span className="text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1 font-semibold">
                  Load &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main submission form */}
      <form onSubmit={handleFormSubmit} className="space-y-6" id="nutrition-profile-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white/60 p-5 md:p-6 rounded-2xl border border-slate-100" id="demographic-inputs-grid">
          <div className="md:col-span-2 border-b border-slate-100 pb-3 mb-1">
            <h3 className="text-slate-900 font-extrabold text-sm flex items-center gap-2 uppercase tracking-wider text-indigo-950">
              <ClipboardList className="w-4.5 h-4.5 text-indigo-600" />
              1. Metabolism & Goal Settings
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Input metrics to set standard Basal Metabolic Rate (BMR) targets.
            </p>
          </div>

          {/* Age field */}
          <div className="space-y-1" id="form-group-age">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5" htmlFor="field-age">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Age (Years)
            </label>
            <input
              id="field-age"
              type="number"
              min="1"
              max="120"
              required
              value={age}
              onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xs"
              placeholder="e.g. 28"
            />
          </div>

          {/* Gender selection */}
          <div className="space-y-1" id="form-group-gender">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Biological Sex
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {["Male", "Female", "Other"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGender(item)}
                  className={`py-2 text-[11px] font-bold rounded-xl border text-center transition-all ${
                    gender === item
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                      : "bg-slate-50 text-slate-700 border-slate-250 hover:bg-slate-100"
                  }`}
                  id={`gender-btn-${item.toLowerCase()}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Field */}
          <div className="space-y-1" id="form-group-weight">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5" htmlFor="field-weight">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              Weight (kg)
            </label>
            <input
              id="field-weight"
              type="number"
              min="10"
              max="300"
              required
              value={weight}
              onChange={(e) => setWeight(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xs"
              placeholder="e.g. 70"
            />
          </div>

          {/* Height Field */}
          <div className="space-y-1" id="form-group-height">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5" htmlFor="field-height">
              <Ruler className="w-3.5 h-3.5 text-slate-400" />
              Height (cm)
            </label>
            <input
              id="field-height"
              type="number"
              min="50"
              max="250"
              required
              value={height}
              onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xs"
              placeholder="e.g. 175"
            />
          </div>

          {/* Activity Level Field */}
          <div className="space-y-1" id="form-group-activity">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5" htmlFor="field-activity">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              Activity Level
            </label>
            <select
              id="field-activity"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xs"
            >
              <option value="sedentary">Sedentary (Little/no exercise)</option>
              <option value="lightly_active">Lightly Active (Light exercise 1-3 days/week)</option>
              <option value="moderately_active">Moderately Active (Moderate exercise 3-5 days/week)</option>
              <option value="very_active">Very Active (Hard exercise 6-7 days/week)</option>
            </select>
          </div>

          {/* Daily Goal Field */}
          <div className="space-y-1" id="form-group-goal">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5" htmlFor="field-goal">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              Dietary / Daily Goal
            </label>
            <select
              id="field-goal"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xs"
            >
              <option value="general_health">General Health & Balance</option>
              <option value="weight_loss">Weight Loss (Calorie Deficit)</option>
              <option value="weight_gain">Weight Gain (Calorie Surplus)</option>
              <option value="muscle_gain">Muscle Gain (High Protein Emphasis)</option>
            </select>
          </div>
        </div>

        {/* Text area for food logs */}
        <div className="bg-white/60 p-5 rounded-2xl border border-slate-150 space-y-3" id="dietary-entry-section">
          <div>
            <h3 className="text-slate-900 font-extrabold text-sm flex items-center gap-2 uppercase tracking-wider text-indigo-950">
              <UtensilsCrossed className="w-4.5 h-4.5 text-indigo-600" />
              2. Enter Daily Food Diary Logs
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
              Describe everything you ate or drank today. Include portion estimates (e.g. eggs, greek yogurt, apple, rice bowl) so Open Food Facts can look up precise entries!
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              id="food-intake-textarea"
              required
              rows={6}
              value={foodIntake}
              onChange={(e) => setFoodIntake(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xs font-mono leading-relaxed"
              placeholder={`Breakfast:
2 eggs, 2 slices whole wheat bread, milk

Lunch:
Rice, dal, paneer curry

Snack:
Banana, peanuts

Dinner:
Roti, mixed vegetables, curd`}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${
              isLoading 
                ? "bg-slate-400 cursor-not-allowed shadow-none" 
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 border border-indigo-500 shadow-indigo-600/15 hover:shadow-lg active:translate-y-0.5"
            }`}
            id="analyze-nutrition-btn"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Running Diagnostic Audit..." : "Analyze Daily Nutrition"}
          </button>
        </div>
      </form>
    </div>
  );
}
