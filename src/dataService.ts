import { getSupabase, isSupabaseConfigured } from './supabase';
import { Profile, CoachClient, WorkoutPlan, DietPlan } from './types';
import {
  INITIAL_PROFILES,
  INITIAL_COACH_CLIENTS,
  INITIAL_WORKOUT_PLANS,
  INITIAL_DIET_PLANS
} from './demoData';

// Local storage keys for local demo mode
const KEYS = {
  PROFILES: 't0_profiles',
  COACH_CLIENTS: 't0_coach_clients',
  WORKOUT_PLANS: 't0_workout_plans',
  DIET_PLANS: 't0_diet_plans',
  SESSION_USER: 't0_session_user'
};

// Initialize LocalStorage with demo data if empty
function initializeLocalStorage() {
  if (!localStorage.getItem(KEYS.PROFILES)) {
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
  }
  if (!localStorage.getItem(KEYS.COACH_CLIENTS)) {
    localStorage.setItem(KEYS.COACH_CLIENTS, JSON.stringify(INITIAL_COACH_CLIENTS));
  }
  if (!localStorage.getItem(KEYS.WORKOUT_PLANS)) {
    localStorage.setItem(KEYS.WORKOUT_PLANS, JSON.stringify(INITIAL_WORKOUT_PLANS));
  }
  if (!localStorage.getItem(KEYS.DIET_PLANS)) {
    localStorage.setItem(KEYS.DIET_PLANS, JSON.stringify(INITIAL_DIET_PLANS));
  }
}
initializeLocalStorage();

// Simple types for Authentication result
export interface AuthResult {
  success: boolean;
  error?: string;
  user?: { id: string; email: string };
  profile?: Profile;
}

export const dataService = {
  // ─── AUTHENTICATION ───
  async getCurrentUser(): Promise<{ id: string; email: string } | null> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user) {
          return { id: session.user.id, email: session.user.email || '' };
        }
      }
    }
    // Demo Mode session
    const stored = localStorage.getItem(KEYS.SESSION_USER);
    return stored ? JSON.parse(stored) : null;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await (sb as any)
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (!error && data) {
          return data as Profile;
        }
      }
    }
    // Demo Mode
    const profiles: Profile[] = JSON.parse(localStorage.getItem(KEYS.PROFILES) || '[]');
    return profiles.find(p => p.id === userId) || null;
  },

  async signIn(email: string, pass: string): Promise<AuthResult> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const profile = await this.getProfile(data.user.id);
          return {
            success: true,
            user: { id: data.user.id, email: data.user.email || '' },
            profile: profile || undefined
          };
        }
      }
    }

    // Demo Mode Signing In
    const profiles: Profile[] = JSON.parse(localStorage.getItem(KEYS.PROFILES) || '[]');
    // For demo purposes, we allow logging in with any email. 
    // If the email exists, we log in as that user.
    // If it doesn't, we create a default user on the fly or prompt.
    let profile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    
    if (!profile) {
      // Create a default role-based user based on email domain or default to trainee
      const isCoach = email.toLowerCase().includes('coach');
      profile = {
        id: `demo-user-${Math.random().toString(36).substr(2, 9)}`,
        full_name: email.split('@')[0],
        email: email,
        role: isCoach ? 'coach' : 'trainee',
        specialty: isCoach ? 'Personal Training' : undefined,
        bio: isCoach ? 'Your friendly neighborhood trainer.' : undefined
      };
      profiles.push(profile);
      localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
    }

    const user = { id: profile.id, email: profile.email };
    localStorage.setItem(KEYS.SESSION_USER, JSON.stringify(user));

    return {
      success: true,
      user,
      profile
    };
  },

  async signUp(name: string, email: string, pass: string, role: 'coach' | 'trainee'): Promise<AuthResult> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await sb.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              full_name: name,
              role: role
            }
          }
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          // In Supabase, the trigger handles creating the profile, but we can also manually upsert to be safe.
          const newProfile: Profile = {
            id: data.user.id,
            full_name: name,
            email: email,
            role: role,
            updated_at: new Date().toISOString()
          };
          await (sb as any).from('profiles').upsert(newProfile);
          return {
            success: true,
            user: { id: data.user.id, email: data.user.email || '' },
            profile: newProfile
          };
        }
      }
    }

    // Demo Mode Signing Up
    const profiles: Profile[] = JSON.parse(localStorage.getItem(KEYS.PROFILES) || '[]');
    if (profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already exists in demo database.' };
    }

    const newId = `demo-user-${Math.random().toString(36).substr(2, 9)}`;
    const newProfile: Profile = {
      id: newId,
      full_name: name,
      email: email,
      role: role,
      specialty: role === 'coach' ? 'General Fitness' : undefined,
      bio: role === 'coach' ? 'Certified fitness instructor.' : undefined,
      updated_at: new Date().toISOString()
    };

    profiles.push(newProfile);
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));

    const user = { id: newId, email: email };
    localStorage.setItem(KEYS.SESSION_USER, JSON.stringify(user));

    return {
      success: true,
      user,
      profile: newProfile
    };
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        await sb.auth.signOut();
      }
    }
    localStorage.removeItem(KEYS.SESSION_USER);
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { error } = await (sb as any)
          .from('profiles')
          .update(updates)
          .eq('id', userId);
        return !error;
      }
    }

    // Demo Mode update
    const profiles: Profile[] = JSON.parse(localStorage.getItem(KEYS.PROFILES) || '[]');
    const idx = profiles.findIndex(p => p.id === userId);
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
      return true;
    }
    return false;
  },

  // ─── COACH ACTIONS ───
  async getCoachClients(coachId: string): Promise<CoachClient[]> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await (sb as any)
          .from('coach_clients')
          .select('*, trainee:profiles!coach_clients_trainee_id_fkey(*)')
          .eq('coach_id', coachId)
          .order('created_at');
        if (!error && data) {
          return data as CoachClient[];
        }
      }
    }

    // Demo Mode fetch
    const coachClients: CoachClient[] = JSON.parse(localStorage.getItem(KEYS.COACH_CLIENTS) || '[]');
    const profiles: Profile[] = JSON.parse(localStorage.getItem(KEYS.PROFILES) || '[]');
    
    return coachClients
      .filter(cc => cc.coach_id === coachId)
      .map(cc => ({
        ...cc,
        trainee: profiles.find(p => p.id === cc.trainee_id) || undefined
      }));
  },

  async updateCoachClient(coachId: string, traineeId: string, updates: Partial<CoachClient>): Promise<boolean> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { error } = await (sb as any)
          .from('coach_clients')
          .update(updates)
          .eq('coach_id', coachId)
          .eq('trainee_id', traineeId);
        return !error;
      }
    }

    // Demo Mode Update
    const coachClients: CoachClient[] = JSON.parse(localStorage.getItem(KEYS.COACH_CLIENTS) || '[]');
    const idx = coachClients.findIndex(cc => cc.coach_id === coachId && cc.trainee_id === traineeId);
    if (idx !== -1) {
      coachClients[idx] = { ...coachClients[idx], ...updates };
      localStorage.setItem(KEYS.COACH_CLIENTS, JSON.stringify(coachClients));
      return true;
    }
    return false;
  },

  async findTraineeProfileById(traineeId: string): Promise<Profile | null> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await (sb as any)
          .from('profiles')
          .select('*')
          .eq('id', traineeId)
          .eq('role', 'trainee')
          .maybeSingle();
        if (!error && data) return data as Profile;
      }
    }
    // Demo Mode lookup
    const profiles: Profile[] = JSON.parse(localStorage.getItem(KEYS.PROFILES) || '[]');
    return profiles.find(p => p.id === traineeId && p.role === 'trainee') || null;
  },

  async addClientToRoster(coachId: string, traineeId: string, initialData: { goal: string; weight: string; notes: string }): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        // Insert relation
        const newRel = {
          coach_id: coachId,
          trainee_id: traineeId,
          goal: initialData.goal,
          weight: initialData.weight,
          notes: initialData.notes,
          tag: 'new',
          progress: 0
        };
        const { error } = await (sb as any).from('coach_clients').insert(newRel);
        if (error) {
          if (error.code === '23505') return { success: false, error: 'This trainee is already on your roster.' };
          return { success: false, error: error.message };
        }
        return { success: true };
      }
    }

    // Demo Mode Insert
    const coachClients: CoachClient[] = JSON.parse(localStorage.getItem(KEYS.COACH_CLIENTS) || '[]');
    if (coachClients.some(cc => cc.coach_id === coachId && cc.trainee_id === traineeId)) {
      return { success: false, error: 'This trainee is already on your roster.' };
    }

    const newRelation: CoachClient = {
      id: Date.now(),
      coach_id: coachId,
      trainee_id: traineeId,
      goal: initialData.goal,
      weight: initialData.weight,
      notes: initialData.notes,
      progress: 0,
      tag: 'new'
    };
    coachClients.push(newRelation);
    localStorage.setItem(KEYS.COACH_CLIENTS, JSON.stringify(coachClients));
    return { success: true };
  },

  // ─── TRAINEE ACTIONS ───
  async getTraineeCoachRelation(traineeId: string): Promise<CoachClient | null> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await (sb as any)
          .from('coach_clients')
          .select('*, coach:profiles!coach_clients_coach_id_fkey(*)')
          .eq('trainee_id', traineeId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!error && data) {
          // Shape it to include coach under "coach" property or just cast
          const coachData = data.coach;
          return {
            ...data,
            // Attach coach profile to the return object
            coachProfile: coachData
          } as CoachClient & { coachProfile?: Profile };
        }
      }
    }

    // Demo Mode fetch
    const coachClients: CoachClient[] = JSON.parse(localStorage.getItem(KEYS.COACH_CLIENTS) || '[]');
    const profiles: Profile[] = JSON.parse(localStorage.getItem(KEYS.PROFILES) || '[]');
    const relation = coachClients.find(cc => cc.trainee_id === traineeId);
    
    if (relation) {
      return {
        ...relation,
        // Include coach details
        coachProfile: profiles.find(p => p.id === relation.coach_id) || undefined
      } as CoachClient & { coachProfile?: Profile };
    }
    return null;
  },

  // ─── PLANS (WORKOUTS & DIETS) ───
  async getWorkoutPlan(coachId: string, traineeId: string): Promise<WorkoutPlan[]> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await (sb as any)
          .from('workout_plans')
          .select('*')
          .eq('coach_id', coachId)
          .eq('trainee_id', traineeId)
          .order('sort_order');
        if (!error && data) return data as WorkoutPlan[];
      }
    }

    // Demo Mode fetch
    const workouts: WorkoutPlan[] = JSON.parse(localStorage.getItem(KEYS.WORKOUT_PLANS) || '[]');
    return workouts
      .filter(w => w.coach_id === coachId && w.trainee_id === traineeId)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async saveWorkoutPlan(coachId: string, traineeId: string, days: Omit<WorkoutPlan, 'id' | 'coach_id' | 'trainee_id'>[]): Promise<boolean> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        // Delete existing, then insert fresh
        await (sb as any).from('workout_plans').delete().eq('coach_id', coachId).eq('trainee_id', traineeId);
        if (days.length > 0) {
          const rows = days.map(d => ({
            coach_id: coachId,
            trainee_id: traineeId,
            day_label: d.day_label,
            items: d.items,
            sort_order: d.sort_order
          }));
          const { error } = await (sb as any).from('workout_plans').insert(rows);
          return !error;
        }
        return true;
      }
    }

    // Demo Mode save
    let workouts: WorkoutPlan[] = JSON.parse(localStorage.getItem(KEYS.WORKOUT_PLANS) || '[]');
    // Filter out previous items for this specific combination
    workouts = workouts.filter(w => !(w.coach_id === coachId && w.trainee_id === traineeId));
    
    // Add the new ones
    days.forEach((day, idx) => {
      workouts.push({
        id: Date.now() + idx,
        coach_id: coachId,
        trainee_id: traineeId,
        day_label: day.day_label,
        items: day.items,
        sort_order: day.sort_order
      });
    });

    localStorage.setItem(KEYS.WORKOUT_PLANS, JSON.stringify(workouts));
    return true;
  },

  async getDietPlan(coachId: string, traineeId: string): Promise<DietPlan[]> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await (sb as any)
          .from('diet_plans')
          .select('*')
          .eq('coach_id', coachId)
          .eq('trainee_id', traineeId)
          .order('sort_order');
        if (!error && data) return data as DietPlan[];
      }
    }

    // Demo Mode fetch
    const diets: DietPlan[] = JSON.parse(localStorage.getItem(KEYS.DIET_PLANS) || '[]');
    return diets
      .filter(d => d.coach_id === coachId && d.trainee_id === traineeId)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async saveDietPlan(coachId: string, traineeId: string, days: Omit<DietPlan, 'id' | 'coach_id' | 'trainee_id'>[]): Promise<boolean> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        // Delete existing, then insert fresh
        await (sb as any).from('diet_plans').delete().eq('coach_id', coachId).eq('trainee_id', traineeId);
        if (days.length > 0) {
          const rows = days.map(d => ({
            coach_id: coachId,
            trainee_id: traineeId,
            day_label: d.day_label,
            items: d.items,
            sort_order: d.sort_order
          }));
          const { error } = await (sb as any).from('diet_plans').insert(rows);
          return !error;
        }
        return true;
      }
    }

    // Demo Mode save
    let diets: DietPlan[] = JSON.parse(localStorage.getItem(KEYS.DIET_PLANS) || '[]');
    // Filter out previous items for this specific combination
    diets = diets.filter(d => !(d.coach_id === coachId && d.trainee_id === traineeId));
    
    // Add the new ones
    days.forEach((day, idx) => {
      diets.push({
        id: Date.now() + idx,
        coach_id: coachId,
        trainee_id: traineeId,
        day_label: day.day_label,
        items: day.items,
        sort_order: day.sort_order
      });
    });

    localStorage.setItem(KEYS.DIET_PLANS, JSON.stringify(diets));
    return true;
  }
};
