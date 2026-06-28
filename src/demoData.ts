import { Profile, CoachClient, WorkoutPlan, DietPlan } from './types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'coach-omar-id',
    full_name: 'Omar Ahmed',
    email: 'omar.ahmed@example.com',
    role: 'coach',
    specialty: 'Strength & Conditioning & Fat Loss',
    bio: 'Dedicated fitness coach with 8+ years of experience helping athletes and everyday individuals achieve their dream physics and optimal health.',
  },
  {
    id: 'trainee-ahmed-id',
    full_name: 'Ahmed J.',
    email: 'ahmed.j@example.com',
    role: 'trainee',
  },
  {
    id: 'trainee-sarah-id',
    full_name: 'Sarah M.',
    email: 'sarah.m@example.com',
    role: 'trainee',
  },
  {
    id: 'trainee-john-id',
    full_name: 'John D.',
    email: 'john.d@example.com',
    role: 'trainee',
  }
];

export const INITIAL_COACH_CLIENTS: CoachClient[] = [
  {
    id: 1,
    coach_id: 'coach-omar-id',
    trainee_id: 'trainee-ahmed-id',
    goal: 'Fat Loss & Strength',
    weight: '85 kg',
    weekly_sessions: '3',
    notes: 'Ahmed is highly motivated. Prefers high-protein low-carb diet. Keep cardio high.',
    progress: 65,
    tag: 'active',
  },
  {
    id: 2,
    coach_id: 'coach-omar-id',
    trainee_id: 'trainee-sarah-id',
    goal: 'Hypertrophy & Tone',
    weight: '62 kg',
    weekly_sessions: '4',
    notes: 'Slight discomfort in left shoulder, avoid heavy overhead pressing. Focus on core stability.',
    progress: 40,
    tag: 'active',
  },
  {
    id: 3,
    coach_id: 'coach-omar-id',
    trainee_id: 'trainee-john-id',
    goal: 'Endurance & Cardio',
    weight: '78 kg',
    weekly_sessions: '5',
    notes: 'Prepping for a local 10K run. Focus on cardiovascular efficiency and high reps.',
    progress: 12,
    tag: 'new',
  }
];

export const INITIAL_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 1,
    coach_id: 'coach-omar-id',
    trainee_id: 'trainee-ahmed-id',
    day_label: 'Monday (Chest & Triceps)',
    items: [
      'Incline Barbell Bench Press: 4 sets x 8 reps (warmup included)',
      'Flat Dumbbell Press: 3 sets x 10 reps (focus on squeeze)',
      'Cable Chest Flyes (High to Low): 3 sets x 12 reps',
      'Overhead Dumbbell Tricep Extension: 4 sets x 12 reps',
      'Tricep Rope Pushdowns: 3 sets x 15 reps (hold contraction for 1s)'
    ],
    sort_order: 0,
  },
  {
    id: 2,
    coach_id: 'coach-omar-id',
    trainee_id: 'trainee-ahmed-id',
    day_label: 'Wednesday (Legs & Shoulders)',
    items: [
      'Barbell Squats: 4 sets x 8-10 reps (deep squat, controlled descent)',
      'Leg Press (focused on quads): 3 sets x 12 reps',
      'Seated Dumbbell Shoulder Press: 4 sets x 10 reps',
      'Dumbbell Lateral Raises: 4 sets x 15 reps (strict form, no swing)',
      'Standing Calf Raises: 4 sets x 20 reps'
    ],
    sort_order: 1,
  },
  {
    id: 3,
    coach_id: 'coach-omar-id',
    trainee_id: 'trainee-ahmed-id',
    day_label: 'Friday (Back & Biceps)',
    items: [
      'Conventional Deadlifts: 3 sets x 5 reps',
      'Lat Pulldowns (Wide Grip): 4 sets x 10 reps',
      'One-Arm Dumbbell Rows: 3 sets x 12 reps',
      'Standing EZ-Bar Bicep Curls: 4 sets x 12 reps',
      'Incline Dumbbell Hammer Curls: 3 sets x 12 reps'
    ],
    sort_order: 2,
  }
];

export const INITIAL_DIET_PLANS: DietPlan[] = [
  {
    id: 1,
    coach_id: 'coach-omar-id',
    trainee_id: 'trainee-ahmed-id',
    day_label: 'Training Days (High Carb / High Protein)',
    items: [
      'Meal 1 (Breakfast): 5 egg whites + 1 whole egg scrambled, 60g oatmeal with 10g almond butter and handful of blueberries.',
      'Meal 2 (Lunch): 200g grilled chicken breast, 150g cooked white jasmine rice, 100g steamed broccoli.',
      'Meal 3 (Pre-Workout Snack): 1 scoop whey protein isolate mixed in water, 1 medium banana, 1 rice cake.',
      'Meal 4 (Post-Workout Dinner): 200g extra lean beef fillet, 200g baked sweet potato, large green leaf salad with lemon dressing.'
    ],
    sort_order: 0,
  },
  {
    id: 2,
    coach_id: 'coach-omar-id',
    trainee_id: 'trainee-ahmed-id',
    day_label: 'Rest Days (Low Carb / Healthy Fats)',
    items: [
      'Meal 1 (Breakfast): 4 scrambled eggs with spinach and cherry tomatoes, cooked in 1 tsp olive oil + half an avocado.',
      'Meal 2 (Lunch): 200g pan-seared Atlantic salmon, grilled asparagus spears with sea salt.',
      'Meal 3 (Snack): 200g unsweetened fat-free Greek yogurt with a pinch of cinnamon and 15g walnuts.',
      'Meal 4 (Dinner): 200g grilled turkey breast, mixed roasted zucchini, bell peppers, and eggplant.'
    ],
    sort_order: 1,
  }
];
