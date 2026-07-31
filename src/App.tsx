import { useState, useEffect } from "react";
import ProfileForm from "./components/ProfileForm";
import { NutritionAnalysisResult, UserProfile, SearchFoodResult } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Activity, 
  Droplet, 
  Flame, 
  AlertTriangle, 
  CheckCircle, 
  Apple, 
  Heart,
  ChevronRight,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Search,
  Database,
  HelpCircle,
  Lightbulb,
  Info,
  Calendar
} from "lucide-react";

// Score circular gauge component with elegant glow & startup dashboard look
function ScoreCircleGauge({ score }: { score: number }) {
  const radius = 38;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Gradient selection based on the score strength
  const strokeColor = score >= 85 ? "#4F46E5" : score >= 70 ? "#7C3AED" : "#EC4899";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Background glow filter */}
      <div 
        className="absolute w-16 h-16 rounded-full opacity-20 blur-lg transition-colors duration-1000"
        style={{ backgroundColor: strokeColor }}
      />
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="stroke-slate-100/80 fill-none"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          className="fill-none transition-all duration-1000 ease-out"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          strokeLinecap="round"
          stroke={strokeColor}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-slate-900 leading-none">
          {(score / 10).toFixed(1)}<span className="text-xs font-semibold text-slate-400">/10</span>
        </span>
        <span className="text-[8px] uppercase font-bold text-slate-400 mt-1">Score</span>
      </div>
    </div>
  );
}

// Circular progress indicator component for beautiful metrics dashboards
function CircularProgressMetric({ value, target, percentage, color, icon: Icon, label, unit }: {
  value: number;
  target: number;
  percentage: number;
  color: string; // 'indigo' | 'purple' | 'pink' | 'orange'
  icon: any;
  label: string;
  unit: string;
}) {
  const radius = 32;
  const stroke = 5.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, percentage) / 100) * circumference;

  // Colour styling mappings mapping back to our brand colors
  const colorMap = {
    indigo: {
      stroke: "#4F46E5",
      bg: "bg-indigo-50/70 border-indigo-100",
      text: "text-indigo-600",
      glowBg: "rgba(79, 70, 229, 0.12)"
    },
    purple: {
      stroke: "#7C3AED",
      bg: "bg-purple-50/70 border-purple-100",
      text: "text-purple-600",
      glowBg: "rgba(124, 58, 237, 0.12)"
    },
    pink: {
      stroke: "#EC4899",
      bg: "bg-pink-50/70 border-pink-100",
      text: "text-pink-600",
      glowBg: "rgba(236, 72, 153, 0.12)"
    },
    orange: {
      stroke: "#F97316",
      bg: "bg-orange-50/70 border-orange-100",
      text: "text-orange-600",
      glowBg: "rgba(249, 115, 22, 0.12)"
    }
  }[color as 'indigo' | 'purple' | 'pink' | 'orange'] || {
    stroke: "#4F46E5",
    bg: "bg-slate-50 border-slate-100",
    text: "text-slate-600",
    glowBg: "rgba(0,0,0,0.05)"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-100/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative group overflow-hidden"
    >
      {/* Background visual highlight */}
      <div 
        className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none filter blur-lg"
        style={{ backgroundColor: colorMap.glowBg }}
      />
      
      {/* Small top metric status dot */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: colorMap.stroke }} />
      </div>

      <div className="relative w-18 h-18 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="36"
            cy="36"
            r={radius}
            className="stroke-slate-100 fill-none"
            strokeWidth={stroke}
          />
          <motion.circle
            cx="36"
            cy="36"
            r={radius}
            className="fill-none transition-all duration-1000 ease-out"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            strokeLinecap="round"
            stroke={colorMap.stroke}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-slate-700 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      <div className="mt-4 space-y-1.5 w-full">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{label}</span>
        <div className="flex items-baseline justify-center gap-0.5">
          <span className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {value.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-500">{unit}</span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium border-t border-slate-50 pt-1.5 mt-1">
          Target: {target.toLocaleString()}{unit} ({percentage.toFixed(0)}%)
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NutritionAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"macros" | "database" | "gaps" | "micro" | "foods">("macros");
  const [lastSubmittedProfile, setLastSubmittedProfile] = useState<UserProfile | null>(null);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState<number>(0);

  const loadingPhrases = [
    "Querying Open Food Facts core API database...",
    "Extracting specific food log keywords...",
    "Calibrating quantities and weights...",
    "Estimating macro and micro metrics...",
    "Conducting clinical nutrient saturation checks...",
    "Compiling lifestyle suggestions & swaps..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 2500);
    } else {
      setLoadingPhraseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (profile: UserProfile, foodIntake: string) => {
    setIsLoading(true);
    setError(null);
    setLastSubmittedProfile(profile);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile, foodIntake }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.result) {
        setResult(data.result);
        setActiveTab("macros");
      } else {
        throw new Error(data.error || "Failed to analyze food entries.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred while communicating with the AI server.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return {
          bg: "bg-indigo-500",
          text: "text-indigo-700",
          border: "border-indigo-100",
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
          label: "Adequate"
        };
      case "yellow":
        return {
          bg: "bg-purple-500",
          text: "text-purple-700",
          border: "border-purple-100",
          badge: "bg-purple-50 text-purple-700 border-purple-200/50",
          label: "Moderate Shift"
        };
      case "red":
        return {
          bg: "bg-pink-500",
          text: "text-pink-700",
          border: "border-pink-100",
          badge: "bg-pink-50 text-pink-700 border-pink-200/50",
          label: "Critical Deviancy"
        };
      default:
        return {
          bg: "bg-slate-400",
          text: "text-slate-600",
          border: "border-slate-100",
          badge: "bg-slate-50 text-slate-600 border-slate-200",
          label: "Pending"
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased relative overflow-hidden">
      {/* Premium background visual shapes (Headspace & Stripe aesthetic) */}
      <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-200/25 blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-200/20 blur-3xl pointer-events-none -z-10 animate-pulse-subtle [animation-delay:1.5s]" />
      <div className="absolute top-[40%] right-[15%] w-[350px] h-[350px] rounded-full bg-pink-100/15 blur-3xl pointer-events-none -z-10 animate-pulse-subtle [animation-delay:3s]" />

      {/* Hero Section */}
      <header className="pt-12 pb-8 px-4 md:px-8 text-center max-w-7xl mx-auto w-full" id="landing-header">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-indigo-100 shadow-xs mb-5"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-[10px] font-bold tracking-wider text-indigo-950 uppercase">
            Clinical Food Database lookup
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight" 
          id="main-app-title"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            Daily Nutrition Analyzer
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 text-sm md:text-base mt-2.5 max-w-xl mx-auto font-medium" 
          id="main-app-subtitle"
        >
          Understand your nutrition. Optimize your health.
        </motion.p>
      </header>

      {/* Main Grid content flow */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="app-workspace-grid">
        
        {/* Left Side Column: Form parameters and journal entries */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/60 shadow-xl shadow-slate-100/50" 
            id="left-glass-panel"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-slate-900 font-extrabold text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Journal Record
                </h2>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Define your daily profile & diet log</p>
              </div>
              
              {result && (
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl px-3 py-2 flex items-center gap-1.5 border border-indigo-100 shadow-xs transition-all font-semibold"
                  title="Clear results and log a new diary"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            <ProfileForm onSubmit={handleAnalyze} isLoading={isLoading} />
          </motion.div>
        </div>

        {/* Right Side Column: Dynamic outcomes and statistics */}
        <div className="lg:col-span-7 space-y-6">
          
          <AnimatePresence mode="wait">
            
            {/* 1. Default Pre-submit State */}
            {!result && !isLoading && !error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="bg-white/70 backdrop-blur-xl p-8 md:p-12 text-center rounded-3xl border border-white/70 shadow-xl shadow-slate-100/40 flex flex-col items-center justify-center min-h-[500px]" 
                id="pre-submit-placeholder"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/10 mb-6">
                  <Apple className="w-7 h-7" />
                </div>
                <h3 className="text-slate-900 text-xl font-extrabold tracking-tight">Active Nutrition Monitor</h3>
                <p className="text-slate-500 max-w-sm text-xs mt-2 font-medium leading-relaxed">
                  Provide your active metabolic specs, customize your food intake text logs, then trigger our deep nutritional audit engine.
                </p>

                <div className="mt-8 border-t border-slate-100 pt-6 w-full max-w-sm">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">
                    Active verification algorithms
                  </span>
                  <div className="grid grid-cols-2 gap-3.5 text-left">
                    <div className="p-3.5 bg-slate-50/60 rounded-2xl border border-slate-100 text-xs hover:border-indigo-100 hover:bg-white transition-all">
                      <strong className="text-indigo-950 block font-bold mb-1">Open Food Facts</strong>
                      Real-time database query checks for ingredients.
                    </div>
                    <div className="p-3.5 bg-slate-50/60 rounded-2xl border border-slate-100 text-xs hover:border-purple-100 hover:bg-white transition-all">
                      <strong className="text-purple-950 block font-bold mb-1">Dynamic Prompting</strong>
                      Feedback queries highlighting unverified foods.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Loading State: Pulsating Skeletal Dashboard Layout for optimal perceived speed */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6" 
                id="loading-skeleton-dashboard"
              >
                {/* Active Diagnostic Status Strip */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Advanced Diagnostic Active</span>
                  </div>
                  <div className="h-4 overflow-hidden flex items-center">
                    <AnimatePresence mode="popLayout">
                      <motion.p 
                        key={loadingPhraseIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="text-indigo-600 text-xs font-bold tracking-tight"
                      >
                        {loadingPhrases[loadingPhraseIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Score & Hydration Skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-5 bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center animate-pulse">
                    <div className="w-24 h-24 rounded-full bg-slate-200/80 mb-4" />
                    <div className="w-32 h-4 bg-slate-200 rounded-md" />
                  </div>
                  <div className="md:col-span-7 bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-slate-100 flex flex-col justify-between animate-pulse">
                    <div className="space-y-3">
                      <div className="w-40 h-4 bg-slate-200 rounded-md" />
                      <div className="w-24 h-8 bg-slate-200 rounded-md mt-2" />
                      <div className="w-full h-12 bg-slate-100 rounded-xl" />
                    </div>
                    <div className="w-full h-6 bg-slate-200 rounded-md mt-4" />
                  </div>
                </div>

                {/* 5 Ring Progress Skeletons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 animate-pulse">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div key={idx} className="bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-slate-100 flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-200 rounded-full mb-3" />
                      <div className="w-12 h-3.5 bg-slate-100 rounded-md" />
                      <div className="w-20 h-5 bg-slate-200 rounded-lg mt-2" />
                    </div>
                  ))}
                </div>

                {/* Tabs detailed skeleton body */}
                <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-slate-100 space-y-4 animate-pulse">
                  <div className="flex gap-2 border-b border-slate-150 pb-3">
                    <div className="w-16 h-8 bg-slate-200 rounded-lg" />
                    <div className="w-16 h-8 bg-slate-100 rounded-lg" />
                    <div className="w-16 h-8 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="space-y-2.5 pt-2">
                    <div className="w-full h-14 bg-slate-50 rounded-xl" />
                    <div className="w-full h-14 bg-slate-50 rounded-xl" />
                  </div>
                </div>

                {/* Bottom recommendation boxes skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                  <div className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-slate-100 space-y-3">
                    <div className="w-36 h-4 bg-slate-200 rounded-md" />
                    <div className="w-full h-8 bg-slate-50 rounded-lg" />
                    <div className="w-full h-8 bg-slate-50 rounded-lg" />
                  </div>
                  <div className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-slate-100 space-y-3">
                    <div className="w-36 h-4 bg-slate-200 rounded-md" />
                    <div className="w-full h-8 bg-slate-50 rounded-lg" />
                    <div className="w-full h-8 bg-slate-50 rounded-lg" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Error Alert State */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-pink-50/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-pink-100 shadow-xl shadow-slate-100/30" 
                id="error-alert-panel"
              >
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 fflex-1">
                    <h3 className="text-pink-900 font-extrabold text-base">Analysis Halted</h3>
                    <p className="text-pink-700 text-sm leading-relaxed">{error}</p>
                    <p className="text-slate-500 text-xs mt-4">
                      Suggested Fix: Verify your ingredients, increase the diary list clarity, and confirm that your environment variables have <strong>GEMINI_API_KEY</strong> set.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Complete Audit Outcomes (Dashboard Presentation) */}
            {result && !isLoading && !error && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6" 
                id="analysis-results-root"
              >
                {/* Score & Hydration Section Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="analysis-summary-top">
                  
                  {/* Balanced Score Component */}
                  <div className="md:col-span-5 bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-100/90 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden" id="report-score-card">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl rounded-full pointer-events-none" />
                    <ScoreCircleGauge score={result.overallScore} />
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mt-4">Overall Nutrition Balance</h4>
                    
                    <span className="mt-3.5 px-3 py-1 bg-indigo-50 text-[10px] font-bold text-indigo-700 border border-indigo-100 rounded-full uppercase tracking-wider">
                      {result.overallScore >= 85 ? "Optimum Balance" : result.overallScore >= 70 ? "Healthy Matrix" : result.overallScore >= 50 ? "Moderate Shift" : "Deficit Alert"}
                    </span>
                  </div>

                  {/* Water / Hydration Insights Panel */}
                  <div className="md:col-span-7 bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-100/90 shadow-sm flex flex-col justify-between relative" id="hydration-insights-card">
                    <div className="space-y-1">
                      <h3 className="text-slate-900 font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 text-indigo-600">
                        <Droplet className="w-4 h-4" />
                        Hydration Assessment
                      </h3>
                      <div className="flex items-baseline gap-2 pt-2">
                        <span className="text-3xl font-extrabold text-slate-900">
                          {result.hydration.estimated.toFixed(1)} L
                        </span>
                        <span className="text-slate-400 text-xs font-semibold">consumed</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-indigo-950 text-xs font-bold bg-indigo-50/60 px-2.5 py-0.5 rounded-md">
                          Target {result.hydration.recommended.toFixed(1)} L
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-3.5 font-medium leading-relaxed">
                        {result.hydration.recommendationText}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400">Fulfillment Level</span>
                      <span className={`font-bold ${
                        result.hydration.estimated >= result.hydration.recommended 
                          ? "text-indigo-600" 
                          : result.hydration.estimated > result.hydration.recommended * 0.7 
                            ? "text-purple-600" 
                            : "text-pink-600"
                      }`}>
                        {((result.hydration.estimated / result.hydration.recommended) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                </div>

                {/* Main Results Dashboard Metric Cards (Calories, Protein, Carbs, Fat, Fiber) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4" id="essential-metrics-dashboard">
                  <CircularProgressMetric 
                    value={result.calories.value} 
                    target={result.calories.target} 
                    percentage={result.calories.percentage} 
                    color="indigo" 
                    icon={Flame} 
                    label="Calories" 
                    unit="kcal" 
                  />
                  <CircularProgressMetric 
                    value={result.protein.value} 
                    target={result.protein.target} 
                    percentage={result.protein.percentage} 
                    color="purple" 
                    icon={Activity} 
                    label="Protein" 
                    unit="g" 
                  />
                  <CircularProgressMetric 
                    value={result.carbs.value} 
                    target={result.carbs.target} 
                    percentage={result.carbs.percentage} 
                    color="pink" 
                    icon={Apple} 
                    label="Carbs" 
                    unit="g" 
                  />
                  <CircularProgressMetric 
                    value={result.fat.value} 
                    target={result.fat.target} 
                    percentage={result.fat.percentage} 
                    color="orange" 
                    icon={Heart} 
                    label="Fats" 
                    unit="g" 
                  />
                  <CircularProgressMetric 
                    value={result.fiber.value} 
                    target={result.fiber.target} 
                    percentage={result.fiber.percentage} 
                    color="indigo" 
                    icon={Droplet} 
                    label="Dietary Fiber" 
                    unit="g" 
                  />
                </div>

                {/* Tabbed Diagnostic Information Panels */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-100" id="tabbed-details-panel">
                  
                  {/* Tabs Header Grid */}
                  <div className="border-b border-slate-100 bg-slate-5/40 p-2 flex flex-wrap gap-1" id="tabbed-header-container">
                    <button
                      onClick={() => setActiveTab("macros")}
                      className={`flex-1 min-w-[95px] text-xs font-bold px-3 py-2.5 rounded-2ch transition-all flex items-center justify-center gap-1.5 focus:outline-none rounded-xl ${
                        activeTab === "macros"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Macros
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("database")}
                      className={`flex-1 min-w-[120px] text-xs font-bold px-3 py-2.5 rounded-2ch transition-all flex items-center justify-center gap-1.5 focus:outline-none rounded-xl ${
                        activeTab === "database"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      Food Lookup
                    </button>

                    <button
                      onClick={() => setActiveTab("gaps")}
                      className={`flex-1 min-w-[95px] text-xs font-bold px-3 py-2.5 rounded-2ch transition-all flex items-center justify-center gap-1.5 focus:outline-none rounded-xl ${
                        activeTab === "gaps"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Gaps
                    </button>

                    <button
                      onClick={() => setActiveTab("micro")}
                      className={`flex-1 min-w-[110px] text-xs font-bold px-3 py-2.5 rounded-2ch transition-all flex items-center justify-center gap-1.5 focus:outline-none rounded-xl ${
                        activeTab === "micro"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      Micro Labs
                    </button>

                    <button
                      onClick={() => setActiveTab("foods")}
                      className={`flex-1 min-w-[110px] text-xs font-bold px-3 py-2.5 rounded-2ch transition-all flex items-center justify-center gap-1.5 focus:outline-none rounded-xl ${
                        activeTab === "foods"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Apple className="w-3.5 h-3.5" />
                      Remedies
                    </button>
                  </div>

                  {/* Individual Tab content render areas */}
                  <div className="p-6 md:p-8" id="tab-content-render-area">
                    
                    {/* A. Macros Tab Details */}
                    {activeTab === "macros" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6" 
                        id="macros-breakdown-tab"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase">Core Energy & Balance Target</h4>
                            <p className="text-[11px] text-slate-400 font-medium">Estimated metabolic allowances based on calculations</p>
                          </div>
                          
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full" /> Good</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-500 rounded-full" /> Shifted</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-pink-500 rounded-full" /> Deviation</span>
                          </div>
                        </div>

                        <div className="space-y-4" id="macro-targets-progress-bars">
                          {([
                            { label: "Calories Intake", data: result.calories, colorClass: "bg-indigo-500" },
                            { label: "Protein Consumption", data: result.protein, colorClass: "bg-purple-500" },
                            { label: "Carbohydrates", data: result.carbs, colorClass: "bg-pink-500" },
                            { label: "Total Lipids & Fats", data: result.fat, colorClass: "bg-orange-500" },
                            { label: "Dietary Soluble Fiber", data: result.fiber, colorClass: "bg-indigo-600" }
                          ]).map((el, index) => {
                            const statusStyle = getStatusStyle(el.data.status);
                            return (
                              <div key={index} className="space-y-1.5 p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-extrabold text-slate-800">{el.label}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-500 font-semibold">{el.data.value}{el.data.unit} / {el.data.target}{el.data.unit}</span>
                                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${statusStyle.badge}`}>
                                      {statusStyle.label}
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full h-2 bg-slate-200/50 rounded-full overflow-hidden relative mt-1">
                                  <motion.div 
                                    className={`h-full rounded-full ${el.colorClass}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, el.data.percentage)}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                  />
                                </div>
                                <div className="text-right text-[10px] text-slate-400 font-bold">
                                  {el.data.percentage.toFixed(0)}% Completed
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* B. Food Database Tab Details (Open Food Facts API Matches) */}
                    {activeTab === "database" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6" 
                        id="integrated-database-lookups-tab"
                      >
                        <div className="border-b border-slate-100 pb-4">
                          <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
                            <Database className="w-4 h-4 text-indigo-600" />
                            Live Food Database Entries
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">Real-time stats from Open Food Facts API and fallback clinical formulations</p>
                        </div>

                        <div className="space-y-4">
                          {result.searchedFoods && result.searchedFoods.length > 0 ? (
                            result.searchedFoods.map((item, idx) => (
                              <div 
                                key={idx} 
                                className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:border-indigo-100 shadow-xs hover:shadow-sm transition-all duration-300 space-y-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2.5">
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Identified Keyword</span>
                                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                                      {item.name}
                                      {item.matchedFood && (
                                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50/80 border border-indigo-100 rounded-lg px-2.5 py-0.5">
                                          ({item.matchedFood})
                                        </span>
                                      )}
                                    </h5>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                                      item.found 
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200/50" 
                                        : "bg-amber-50 text-amber-700 border-amber-200/50"
                                    }`}>
                                      <Search className="w-3 h-3" />
                                      {item.source}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2.5 bg-white/70 p-3.5 rounded-xl border border-slate-50 text-center font-mono text-[10px] sm:text-xs">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-slate-400 uppercase font-semibold font-sans block">Energy</span>
                                    <strong className="text-slate-800">{item.calories.toFixed(0)} kcal</strong>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-slate-400 uppercase font-semibold font-sans block">Protein</span>
                                    <strong className="text-slate-800">{item.protein.toFixed(1)}g</strong>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-slate-400 uppercase font-semibold font-sans block">Carbs</span>
                                    <strong className="text-slate-800">{item.carbs.toFixed(1)}g</strong>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-slate-400 uppercase font-semibold font-sans block">Lipid Fat</span>
                                    <strong className="text-slate-800">{item.fat.toFixed(1)}g</strong>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-slate-400 uppercase font-semibold font-sans block">Fiber</span>
                                    <strong className="text-slate-800">{item.fiber.toFixed(1)}g</strong>
                                  </div>
                                </div>

                                {item.vitaminsAndMineralsList && item.vitaminsAndMineralsList.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-1">
                                    <span>Rich Minerals/Vitamins:</span>
                                    {item.vitaminsAndMineralsList.map((m, mIdx) => (
                                      <span key={mIdx} className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                                        {m}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Interactive prompt requesting detail input if fallback calculation used */}
                                {!item.found && item.detailRequirementPrompt && (
                                  <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 flex gap-2.5 items-start mt-2">
                                    <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                    <div className="space-y-1">
                                      <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider block">Database Verification Warning</span>
                                      <p className="text-amber-900 text-xs leading-relaxed font-medium">
                                        {item.detailRequirementPrompt}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-2xl">
                              <Info className="w-8 h-8 text-indigo-400 mx-auto" />
                              <h5 className="font-bold text-slate-700 mt-2">No individual food items mapped</h5>
                              <p className="text-slate-400 text-xs px-4 mt-1">Please re-submit your journal values in structured text format.</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* C. Identified Gaps Tab */}
                    {activeTab === "gaps" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6" 
                        id="gaps-list-tab"
                      >
                        <div className="border-b border-slate-100 pb-4">
                          <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
                            <AlertTriangle className="w-4.5 h-4.5 text-pink-500" />
                            Macro Deficit Gaps
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">Critical dietary shortcomings detected in today's entry</p>
                        </div>

                        <div className="space-y-4" id="gaps-listing-container">
                          {result.nutritionalGaps.length === 0 ? (
                            <div className="text-center py-10 bg-indigo-50/40 border border-indigo-100 rounded-2xl">
                              <CheckCircle className="w-8 h-8 text-indigo-600 mx-auto" />
                              <h5 className="font-bold text-indigo-900 text-sm mt-2">Balanced Diary Target</h5>
                              <p className="text-indigo-700 text-xs px-4 mt-1">Nutrient values match daily clinical recommendations perfectly!</p>
                            </div>
                          ) : (
                            result.nutritionalGaps.map((gap, index) => {
                              const isHigh = gap.severity === "high";
                              const isMed = gap.severity === "medium";
                              return (
                                <div 
                                  key={index} 
                                  className={`border rounded-2xl p-4.5 flex gap-4 items-start transition-all ${
                                    isHigh 
                                      ? "bg-pink-50/50 border-pink-100" 
                                      : isMed 
                                        ? "bg-purple-50/50 border-purple-100" 
                                        : "bg-slate-50/60 border-slate-100"
                                  }`}
                                  id={`gap-item-card-${index}`}
                                >
                                  <div className={`p-2 rounded-xl shrink-0 ${
                                    isHigh 
                                      ? "bg-pink-100 text-pink-700" 
                                      : isMed 
                                        ? "bg-purple-100 text-purple-700" 
                                        : "bg-slate-100 text-slate-700"
                                  }`}>
                                    <AlertTriangle className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h5 className={`font-extrabold text-sm ${isHigh ? "text-pink-950" : isMed ? "text-purple-950" : "text-slate-900"}`}>
                                        {gap.title}
                                      </h5>
                                      <span className={`text-[8.5px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                                        isHigh 
                                          ? "bg-pink-100 text-pink-800 border border-pink-200" 
                                          : isMed 
                                            ? "bg-purple-100 text-purple-800 border border-purple-200" 
                                            : "bg-slate-200 text-slate-700 border border-slate-300"
                                      }`}>
                                        {gap.severity} severity
                                      </span>
                                    </div>
                                    <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                                      {gap.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* D. Micronutrients (Vitamins & Minerals Screen) */}
                    {activeTab === "micro" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6" 
                        id="micronutrients-list-tab"
                      >
                        <div className="border-b border-slate-100 pb-4">
                          <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase">Vitamins & Minerals Tracker</h4>
                          <p className="text-[11px] text-slate-400 font-medium">Clinical saturation indicators mapping essential elements</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="micro-columns-grid">
                          {/* Vitamins */}
                          <div className="space-y-4" id="vitamins-sublist">
                            <h5 className="font-extrabold text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 flex items-center justify-between">
                              <span>Vitamins Group</span>
                              <span className="text-[9px] text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase font-bold">Estimated</span>
                            </h5>
                            <div className="space-y-3" id="vitamins-items-stack">
                              {result.vitamins.map((vit, idx) => (
                                <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-150 flex justify-between items-start gap-4 hover:bg-white transition-all">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-900 text-xs block">{vit.name}</span>
                                    <p className="text-[11px] text-slate-500 font-medium leading-normal">{vit.description}</p>
                                  </div>
                                  <span className={`text-[8.5px] uppercase font-mono font-bold px-2 py-0.5 rounded-md ${
                                    vit.status === "adequate" 
                                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200/50" 
                                      : vit.status === "low" 
                                        ? "bg-pink-50 text-pink-700 border border-pink-200/50" 
                                        : "bg-purple-50 text-purple-700 border border-purple-200/50"
                                  }`}>
                                    {vit.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Minerals */}
                          <div className="space-y-4" id="minerals-sublist">
                            <h5 className="font-extrabold text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 flex items-center justify-between">
                              <span>Essential Minerals</span>
                              <span className="text-[9px] text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase font-bold">Estimated</span>
                            </h5>
                            <div className="space-y-3" id="minerals-items-stack">
                              {result.minerals.map((min, idx) => (
                                <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-150 flex justify-between items-start gap-4 hover:bg-white transition-all">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-900 text-xs block">{min.name}</span>
                                    <p className="text-[11px] text-slate-500 font-medium leading-normal">{min.description}</p>
                                  </div>
                                  <span className={`text-[8.5px] uppercase font-mono font-bold px-2 py-0.5 rounded-md ${
                                    min.status === "adequate" 
                                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200/50" 
                                      : min.status === "low" 
                                        ? "bg-pink-50 text-pink-700 border border-pink-200/50" 
                                        : "bg-purple-50 text-purple-700 border border-purple-200/50"
                                  }`}>
                                    {min.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* E. Gap Fillers (Recommended Foods to remedy elements) */}
                    {activeTab === "foods" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6" 
                        id="gap-fillers-tab"
                      >
                        <div className="border-b border-slate-100 pb-4">
                          <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
                            <Apple className="w-5 h-5 text-indigo-600" />
                            Recommended Remedy Suggestions
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">Standard clean food items rich in your active target deficiency categories</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="recommended-gap-filler-foods-grid">
                          {result.recommendedFoodsForGaps.map((food, index) => (
                            <div key={index} className="bg-slate-50/50 hover:bg-white rounded-2xl p-4.5 border border-slate-100 hover:border-indigo-200 shadow-xs hover:shadow-sm transition-all duration-300" id={`gap-filler-food-item-${index}`}>
                              <div className="flex gap-2 justify-between items-start">
                                <h5 className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-600" />
                                  {food.name}
                                </h5>
                                <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100/50 uppercase px-2.5 py-0.5 rounded-lg font-mono">
                                  {food.nutrientRichIn}
                                </span>
                              </div>
                              
                              <p className="text-slate-600 text-xs mt-3 bg-white/80 p-3 rounded-xl border border-slate-100 font-semibold leading-relaxed">
                                <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider mb-1">Nutrition Purpose</span>
                                {food.whyRecommend}
                              </p>

                              <div className="mt-3.5 pt-3.5 border-t border-slate-100/80 flex items-center gap-1.5 text-xs">
                                <span className="font-bold text-[9px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md shrink-0 uppercase">Portion Option</span>
                                <span className="text-slate-600 italic font-medium truncate" title={food.servingSuggestion}>{food.servingSuggestion}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  </div>
                </div>

                {/* Swaps & Daily Habits Recommendations Panel Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="personalized-action-coaching-box">
                  
                  {/* Swaps & Diet Trims Card */}
                  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4" id="card-dietary-coaching">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                      <TrendingDown className="w-4.5 h-4.5 text-pink-500" />
                      Swaps & dietary cuts
                    </h4>

                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-indigo-700 block">Immediate Supps Today</span>
                        <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                          {result.recommendations.foodsToAdd.map((food, index) => (
                            <li key={index} className="flex items-center gap-2.5">
                              <span className="w-5 h-5 bg-indigo-50 text-indigo-700 rounded-full font-bold flex items-center justify-center shrink-0 text-xs">+</span>
                              <span>{food}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-pink-700 block">Limit or avoid today</span>
                        <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                          {result.recommendations.foodsToReduce.map((food, index) => (
                            <li key={index} className="flex items-center gap-2.5">
                              <span className="w-5 h-5 bg-pink-50 text-pink-700 rounded-full font-bold flex items-center justify-center shrink-0 text-xs">-</span>
                              <span>{food}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Routine & Lifestyle Tips Card */}
                  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4" id="card-lifestyle-clinical">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                      <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
                      Upcoming meal scheduler
                    </h4>

                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-indigo-700 block">Recommended Upcoming Meals</span>
                        <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                          {result.recommendations.nextMealSuggestions.map((meal, index) => (
                            <li key={index} className="flex items-center gap-2.5">
                              <span className="w-5 h-5 bg-indigo-50 text-indigo-700 rounded-full font-bold flex items-center justify-center shrink-0 text-xs">✓</span>
                              <span>{meal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-purple-700 block">Habit & Lifestyle Improvement</span>
                        <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                          {result.recommendations.simpleDietaryImprovements.concat(result.recommendations.lifestyleTips || []).slice(0, 4).map((tip, index) => (
                            <li key={index} className="flex items-start gap-2.5">
                              <span className="w-5 h-5 bg-purple-50 text-purple-750 rounded-full font-bold flex items-center justify-center shrink-0 text-xs font-mono">i</span>
                              <span className="mt-0.5 leading-relaxed">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* Modern minimal footer */}
      <footer className="bg-white border-t border-slate-150 py-10 px-4 md:px-8 text-center text-[11px] text-slate-400 mt-auto" id="application-footer">
        <div className="max-w-7xl mx-auto space-y-2.5 font-medium">
          <p>© 2026 Daily Nutrition Analyzer • Advanced Wellness Diagnostics</p>
          <p className="max-w-2xl mx-auto leading-relaxed text-[10px] text-slate-400/80">
            Disclaimer: All database matches, estimates of caloric intakes, and clinical status suggestions are calculated via Google Gemini models, and the public Open Food Facts search index. This analyzer does not provide formal medical diagnoses, prescription advice, or clinician approvals. Always consult a general practitioner or dietician before structural dietary transformations.
          </p>
        </div>
      </footer>
    </div>
  );
}
