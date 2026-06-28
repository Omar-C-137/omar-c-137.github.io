export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'coach' | 'trainee';
  specialty?: string;
  bio?: string;
  updated_at?: string;
}

export interface CoachClient {
  id: number;
  coach_id: string;
  trainee_id: string;
  goal?: string;
  weight?: string;
  weekly_sessions?: string;
  notes?: string;
  progress: number; // 0 to 100
  tag: 'new' | 'active' | 'inactive';
  created_at?: string;
  trainee?: Profile; // Joined profile
}

export interface WorkoutPlan {
  id: number;
  coach_id: string;
  trainee_id: string;
  day_label: string;
  items: string[]; // string array of exercises
  sort_order: number;
  created_at?: string;
}

export interface DietPlan {
  id: number;
  coach_id: string;
  trainee_id: string;
  day_label: string;
  items: string[]; // string array of meals
  sort_order: number;
  created_at?: string;
}
