import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  LayoutDashboard,
  Dumbbell,
  Apple,
  Copy,
  TrendingUp,
  Activity,
  Award,
  Menu,
  ChevronRight,
  Info
} from 'lucide-react';
import { Profile, CoachClient, WorkoutPlan, DietPlan } from '../types';
import { dataService } from '../dataService';

interface TraineeDashboardProps {
  traineeProfile: Profile;
  onUpdateTraineeProfile: (updates: Partial<Profile>) => Promise<boolean>;
  onShowToast: (msg: string) => void;
}

export default function TraineeDashboard({
  traineeProfile,
  onUpdateTraineeProfile,
  onShowToast
}: TraineeDashboardProps) {
  // Sidebar and Section navigation states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'workout' | 'diet'>('overview');

  // Linked Coach relationship data state
  const [relation, setRelation] = useState<(CoachClient & { coachProfile?: Profile }) | null>(null);
  const [isLoadingRelation, setIsLoadingRelation] = useState(false);

  // Form profile edits
  const [profName, setProfName] = useState(traineeProfile.full_name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Plans state
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan[]>([]);
  const [dietPlan, setDietPlan] = useState<DietPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const loadRelationData = async () => {
    setIsLoadingRelation(true);
    const data = await dataService.getTraineeCoachRelation(traineeProfile.id);
    setRelation(data);
    setIsLoadingRelation(false);
  };

  const loadPlans = async () => {
    if (!relation) return;
    setIsLoadingPlans(true);
    const workouts = await dataService.getWorkoutPlan(relation.coach_id, traineeProfile.id);
    setWorkoutPlan(workouts);

    const diets = await dataService.getDietPlan(relation.coach_id, traineeProfile.id);
    setDietPlan(diets);
    setIsLoadingPlans(false);
  };

  useEffect(() => {
    loadRelationData();
  }, [traineeProfile.id]);

  useEffect(() => {
    if (relation) {
      loadPlans();
    }
  }, [relation]);

  // Save profile updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const success = await onUpdateTraineeProfile({
      full_name: profName
    });
    setIsSavingProfile(false);
    if (success) {
      onShowToast('Profile saved successfully ✓');
    } else {
      onShowToast('Failed to save profile.');
    }
  };

  // Copy trainee ID for roster addition
  const handleCopyId = (idStr: string) => {
    navigator.clipboard.writeText(idStr);
    onShowToast('Trainee User ID copied to clipboard!');
  };

  const coachInitials = (relation?.coachProfile?.full_name || 'Coach').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex pt-[70px]">
      <div className="absolute inset-0 hero-bg-grid z-0" />

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`bg-[#0A0A0A] border-r border-[#222] transition-all duration-300 flex flex-col z-20 ${
          isSidebarCollapsed ? 'w-0 overflow-hidden opacity-0 pointer-events-none md:w-16 md:opacity-100 md:pointer-events-auto' : 'w-64'
        }`}
      >
        <div className="p-4 border-b border-[#222] flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm text-white truncate">{traineeProfile.full_name || 'Champ'}</h3>
              <span className="text-[9px] bg-[#FF6B2B]/10 text-[#FF6B2B] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider mt-1 inline-block">
                Trainee
              </span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg bg-[#111] border border-[#222] text-[#888] hover:text-white hover:border-[#333] cursor-pointer hidden md:block"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          <p className={`text-[10px] font-bold text-[#666] uppercase tracking-widest px-2.5 py-1 ${isSidebarCollapsed && 'sr-only'}`}>
            Trainee Portal
          </p>
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#FF6B2B] text-black font-bold'
                : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Overview</span>}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#FF6B2B] text-black font-bold'
                : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <User className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>My Profile</span>}
          </button>

          <button
            onClick={() => setActiveTab('workout')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'workout'
                ? 'bg-[#FF6B2B] text-black font-bold'
                : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Workout Plan</span>}
          </button>

          <button
            onClick={() => setActiveTab('diet')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'diet'
                ? 'bg-[#FF6B2B] text-black font-bold'
                : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Diet Plan</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden z-10 relative">
        
        {/* MOBILE SIDEBAR TOGGLE */}
        <div className="flex md:hidden items-center justify-between mb-4">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center gap-2 text-xs font-semibold"
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
        </div>

        {/* HEADER AREA */}
        <div className="flex items-center justify-between border-b border-[#222] pb-5 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#666] tracking-widest block mb-1">
              Active Member Dashboard
            </span>
            <h1 className="text-3xl font-bold tracking-tight">
              Let's work, <span className="text-[#FF6B2B]">{traineeProfile.full_name || 'Champ'}!</span>
            </h1>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & STATISTICS */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl text-left"
          >
            {isLoadingRelation ? (
              <div className="py-20 text-center text-[#888] text-sm">
                Fetching linked coaching session details...
              </div>
            ) : relation ? (
              <div className="space-y-6">
                {/* Linked Coach Profile Summary Block */}
                <div className="bg-[#111] border border-[#222] rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#FF6B2B]/15 border border-[#FF6B2B]/30 flex items-center justify-center font-bold text-[#FF6B2B] text-lg">
                    {coachInitials}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold text-[#FF6B2B] uppercase tracking-wider block mb-1">
                      Assigned Coach Terminal
                    </span>
                    <h3 className="font-bold text-base text-white">{relation.coachProfile?.full_name || 'Trainer'}</h3>
                    <p className="text-xs text-[#888] mt-1 max-w-xl font-light">
                      {relation.coachProfile?.bio || 'Certified specialist assisting in your athletic transformation.'}
                    </p>
                  </div>
                  {relation.coachProfile?.specialty && (
                    <div className="px-3.5 py-1.5 bg-[#1A1A1A] border border-[#222] rounded-xl text-xs font-semibold text-neutral-350">
                      {relation.coachProfile.specialty}
                    </div>
                  )}
                </div>

                {/* Dashboard stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#111] border border-[#222] rounded-3xl p-6 text-left relative overflow-hidden group shadow-sm">
                    <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1 block">
                      Program Goal
                    </div>
                    <div className="font-display text-2xl font-black text-white truncate max-w-full">
                      {relation.goal || 'General Focus'}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center absolute right-4 top-4 text-[#666]">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="bg-[#111] border border-[#222] rounded-3xl p-6 text-left relative overflow-hidden shadow-sm">
                    <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1 block">
                      Body Weight
                    </div>
                    <div className="font-display text-2xl font-black text-white">
                      {relation.weight || 'Not Logged'}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center absolute right-4 top-4 text-[#666]">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="bg-[#111] border border-[#222] rounded-3xl p-6 text-left relative overflow-hidden shadow-sm">
                    <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1 block">
                      Schedules / Wk
                    </div>
                    <div className="font-display text-2xl font-black text-white">
                      {relation.weekly_sessions ? `${relation.weekly_sessions}x Weekly` : 'N/A'}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center absolute right-4 top-4 text-[#666]">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="bg-[#111] border border-[#222] rounded-3xl p-6 text-left relative overflow-hidden shadow-sm">
                    <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1 block">
                      Transformation
                    </div>
                    <div className="font-display text-2xl font-black text-[#FF6B2B]">
                      {relation.progress}% Complete
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center absolute right-4 top-4 text-[#666]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Progress Visual card */}
                <div className="bg-[#111] border border-[#222] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#888]">Monthly Roster Milestones</span>
                    <span className="text-[#FF6B2B] text-xs font-bold">{relation.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#1A1A1A] rounded-full overflow-hidden mb-1">
                    <div 
                      className="h-full bg-[#FF6B2B] rounded-full transition-all duration-1000"
                      style={{ width: `${relation.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#666] italic mt-1">
                    Your coach keeps this slider synced based on your strength milestones and weigh-ins.
                  </p>
                </div>

                {/* Notes by coach */}
                {relation.notes && (
                  <div className="bg-[#111] border border-[#222] rounded-3xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-[#FF6B2B]" /> Coach Directives & Special Considerations
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed font-light whitespace-pre-line">
                      {relation.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* No coach link prompt */
              <div className="bg-[#111] border border-[#222] rounded-3xl p-10 text-center max-w-xl mx-auto space-y-6 shadow-sm">
                <div className="text-4xl">🏋️‍♂️</div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">Not Linked to a Coach</h3>
                  <p className="text-xs text-[#888] max-w-md mx-auto leading-relaxed">
                    You have not been added to any coach's roster yet. Provide your coach with your unique User ID listed below so they can link your profile.
                  </p>
                </div>
                
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-[#FF6B2B] uppercase tracking-widest block mb-2">
                    Your Unique Trainee ID
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleCopyId(traineeProfile.id)}
                    className="user-id-chip select-all text-left flex items-center gap-2 mx-auto bg-[#1A1A1A] border border-[#222] px-4 py-2.5 rounded-xl group text-xs hover:border-[#FF6B2B] transition-all cursor-pointer"
                  >
                    <span>{traineeProfile.id}</span>
                    <Copy className="w-3.5 h-3.5 text-[#666] group-hover:text-[#FF6B2B]" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: MY PROFILE DATA */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl text-left"
          >
            {/* Trainee ID clipboard widget */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-[#FF6B2B] uppercase tracking-widest block mb-1">
                  My Profile Client ID
                </span>
                <p className="text-xs text-[#888]">
                  Provide this code to your Personal Trainer to establish direct plan synchronization.
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => handleCopyId(traineeProfile.id)}
                className="user-id-chip select-all text-left flex items-center gap-2 group w-full sm:w-auto bg-[#1A1A1A] border border-[#222] px-4 py-2 rounded-xl"
              >
                <span className="truncate text-xs font-mono text-white">{traineeProfile.id}</span>
                <Copy className="w-3.5 h-3.5 text-[#666] group-hover:text-[#FF6B2B] flex-shrink-0" />
              </button>
            </div>

            {/* Profile editing card */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#222]">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#222] flex items-center justify-center font-bold text-2xl text-[#FF6B2B] shadow-inner">
                    {(profName || 'T').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-lg text-white">{profName || 'Athlete'}</h3>
                    <p className="text-xs text-[#888]">{traineeProfile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                      My Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Omar Ahmed"
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-[#666]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 text-left sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                      Registered Email Address (Disabled)
                    </label>
                    <input
                      type="text"
                      value={traineeProfile.email}
                      disabled
                      className="w-full bg-[#1A1A1A]/40 border border-[#222]/60 text-sm rounded-xl px-4 py-3 text-[#666] outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-3 bg-[#FF6B2B] hover:bg-[#D95520] text-black font-bold uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile ? 'Updating Name...' : 'Update Profile Name'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 3: WORKOUT PLANS - READ ONLY */}
        {activeTab === 'workout' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl text-left"
          >
            <div>
              <h2 className="text-xl font-bold text-white">My Workout Schedule</h2>
              <p className="text-xs text-[#888] mt-1">
                Your coach curates and updates this roster of training days dynamically.
              </p>
            </div>

            {isLoadingPlans ? (
              <div className="py-12 text-center text-neutral-450 text-sm">
                Synchronizing exercise list...
              </div>
            ) : workoutPlan.length === 0 ? (
              <div className="bg-[#111] border border-[#222] rounded-3xl p-10 text-center text-[#666] text-sm italic">
                Your coach has not assigned any workout routines to this plan yet.
              </div>
            ) : (
              <div className="space-y-5">
                {workoutPlan.map((day, dIdx) => (
                  <div 
                    key={day.id || dIdx}
                    className="bg-[#111] border border-[#222] rounded-3xl p-6 space-y-3 hover:border-[#333] transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2 border-b border-[#222] pb-2 mb-1">
                      <span className="text-xs font-black uppercase text-[#FF6B2B] bg-[#FF6B2B]/10 px-2 py-0.5 rounded">
                        Day {dIdx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-white tracking-wide">{day.day_label}</h3>
                    </div>

                    <div className="divide-y divide-[#222]">
                      {day.items.map((ex, exIdx) => (
                        <div 
                          key={exIdx} 
                          className="py-3 flex items-start gap-3.5 text-xs text-neutral-300 font-light"
                        >
                          <span className="w-5 h-5 rounded bg-[#1A1A1A] border border-[#222] flex items-center justify-center font-bold text-[10px] text-[#FF6B2B] flex-shrink-0">
                            {exIdx + 1}
                          </span>
                          <span className="leading-relaxed">{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: DIET PLANS - READ ONLY */}
        {activeTab === 'diet' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl text-left"
          >
            <div>
              <h2 className="text-xl font-bold text-white">My Prescribed Nutrition</h2>
              <p className="text-xs text-[#888] mt-1">
                Your customized macro goals and portion directives loaded directly.
              </p>
            </div>

            {isLoadingPlans ? (
              <div className="py-12 text-center text-neutral-450 text-sm">
                Synchronizing meal schedules...
              </div>
            ) : dietPlan.length === 0 ? (
              <div className="bg-[#111] border border-[#222] rounded-3xl p-10 text-center text-[#666] text-sm italic">
                Your coach has not assigned any diet schedule to this plan yet.
              </div>
            ) : (
              <div className="space-y-5">
                {dietPlan.map((day, dIdx) => (
                  <div 
                    key={day.id || dIdx}
                    className="bg-[#111] border border-[#222] rounded-3xl p-6 space-y-3 hover:border-[#333] transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2 border-b border-[#222] pb-2 mb-1">
                      <span className="text-xs font-black uppercase text-[#FF6B2B] bg-[#FF6B2B]/10 px-2 py-0.5 rounded">
                        Option {dIdx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-white tracking-wide">{day.day_label}</h3>
                    </div>

                    <div className="divide-y divide-[#222]">
                      {day.items.map((meal, mIdx) => (
                        <div 
                          key={mIdx} 
                          className="py-3 flex items-start gap-3.5 text-xs text-neutral-300 font-light"
                        >
                          <span className="w-5 h-5 rounded bg-[#1A1A1A] border border-[#222] flex items-center justify-center font-bold text-[10px] text-[#FF6B2B] flex-shrink-0">
                            M{mIdx + 1}
                          </span>
                          <span className="leading-relaxed">{meal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </main>
    </div>
  );
}
