import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Calculator, Sparkles, Plus, Dumbbell, Apple, Info } from 'lucide-react';

interface CalorieModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalorieModal({ isOpen, onClose }: CalorieModalProps) {
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('moderate');
  const [goal, setGoal] = useState<'loss' | 'maintain' | 'gain' | 'bulk'>('maintain');
  
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    target: number;
    protein: number;
    fat: number;
    carbs: number;
  } | null>(null);

  const calculateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    // BMR using Mifflin-St Jeor
    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // TDEE multiplier
    let multiplier = 1.2;
    if (activity === 'light') multiplier = 1.375;
    else if (activity === 'moderate') multiplier = 1.55;
    else if (activity === 'active') multiplier = 1.725;

    const tdee = bmr * multiplier;

    // Adjusted Target
    let target = tdee;
    if (goal === 'loss') target = tdee - 500;
    else if (goal === 'gain') target = tdee + 250;
    else if (goal === 'bulk') target = tdee + 500;

    // Macro distribution
    // Protein: 2.2g per kg bodyweight
    const proteinGrams = Math.round(w * 2.2);
    const proteinCalories = proteinGrams * 4;

    // Fat: 25% of target calories
    const fatCalories = target * 0.25;
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: Rest of the calories
    const carbCalories = target - (proteinCalories + fatCalories);
    const carbGrams = Math.round(Math.max(0, carbCalories / 4));

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(target),
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbGrams
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/85 backdrop-blur-md z-[60] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#111] border border-[#222] rounded-3xl p-6 relative text-left shadow-2xl divide-y divide-[#222] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#888] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B2B]/10 flex items-center justify-center text-[#FF6B2B]">
              <Flame className="w-4 h-4 fill-[#FF6B2B]/10" />
            </div>
            <h2 className="font-display text-2xl font-black text-white tracking-wide uppercase">
              Calorie & Macro Calculator
            </h2>
          </div>
          <p className="text-xs text-[#888] mt-1">
            Premium trainer add-on module. Instantly calculate daily energy expenditure and macronutrient targets.
          </p>
        </div>

        {/* Modal body split in grid */}
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Inputs Column */}
          <form onSubmit={calculateTarget} className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-brand-orange tracking-widest">
              Biometric Inputs
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-850 focus:border-brand-orange text-xs rounded px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-850 focus:border-brand-orange text-xs rounded px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">
                  Age (years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-850 focus:border-brand-orange text-xs rounded px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-850 focus:border-brand-orange text-xs rounded px-3 py-2 text-white outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">
                Weekly Physical Activity
              </label>
              <select
                value={activity}
                onChange={(e: any) => setActivity(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-850 focus:border-brand-orange text-xs rounded px-3.5 py-2.5 text-white outline-none"
              >
                <option value="sedentary">Sedentary (No workouts / Office work)</option>
                <option value="light">Lightly Active (1 - 3 light workouts/week)</option>
                <option value="moderate">Moderately Active (3 - 5 sports sessions/week)</option>
                <option value="active">Extremely Active (6+ heavy weight sessions/week)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">
                Target Fitness Goal
              </label>
              <select
                value={goal}
                onChange={(e: any) => setGoal(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-850 focus:border-brand-orange text-xs rounded px-3.5 py-2.5 text-white outline-none"
              >
                <option value="loss">Fat Loss (-500 kcal deficit)</option>
                <option value="maintain">Body Recomposition / Maintenance</option>
                <option value="gain">Lean Muscle Gain (+250 kcal surplus)</option>
                <option value="bulk">Aggressive Muscle Bulk (+500 kcal surplus)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold uppercase text-xs tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-orange/15"
            >
              <Calculator className="w-4 h-4" /> Calculate Daily Portions
            </button>
          </form>

          {/* Results Column */}
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-lg p-4 flex flex-col justify-center">
            {result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 text-left"
              >
                <div className="text-center pb-3 border-b border-neutral-850">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                    Daily Adjusted Calories
                  </span>
                  <div className="font-display text-4xl font-black text-brand-orange mt-1">
                    {result.target} <span className="text-sm font-sans font-medium text-neutral-400">kcal / day</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-light flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      Protein Goal (2.2g/kg)
                    </span>
                    <span className="font-bold text-white font-mono">{result.protein}g <span className="text-neutral-500 font-normal font-sans text-[10px]">({result.protein * 4} kcal)</span></span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-light flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                      Healthy Fats (25% Split)
                    </span>
                    <span className="font-bold text-white font-mono">{result.fat}g <span className="text-neutral-500 font-normal font-sans text-[10px]">({result.fat * 9} kcal)</span></span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-light flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                      Complex Carbs (Remaining)
                    </span>
                    <span className="font-bold text-white font-mono">{result.carbs}g <span className="text-neutral-500 font-normal font-sans text-[10px]">({result.carbs * 4} kcal)</span></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-850 space-y-1 text-[10px] text-neutral-500 font-light leading-relaxed">
                  <div className="flex justify-between">
                    <span>Basal Metabolic Rate (BMR):</span>
                    <span className="font-semibold text-neutral-400">{result.bmr} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Daily Expenditure (TDEE):</span>
                    <span className="font-semibold text-neutral-400">{result.tdee} kcal</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-neutral-500 py-10 space-y-2">
                <Sparkles className="w-8 h-8 text-neutral-700 mx-auto animate-pulse" />
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Waiting for Inputs
                </p>
                <p className="text-[10px] text-neutral-600 max-w-xs mx-auto">
                  Provide body metrics on the left, then click Calculate to review your macronutrient split.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 hover:border-neutral-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Dismiss Calculator
          </button>
        </div>
      </motion.div>
    </div>
  );
}
