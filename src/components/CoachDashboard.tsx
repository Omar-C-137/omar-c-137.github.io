import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Users,
  Search,
  Dumbbell,
  Apple,
  FileText,
  Copy,
  Plus,
  Trash2,
  X,
  TrendingUp,
  Activity,
  ArrowLeft,
  Grid,
  Menu,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Profile, CoachClient, WorkoutPlan, DietPlan } from '../types';
import { dataService } from '../dataService';

interface CoachDashboardProps {
  coachProfile: Profile;
  onUpdateCoachProfile: (updates: Partial<Profile>) => Promise<boolean>;
  onShowToast: (msg: string) => void;
}

export default function CoachDashboard({
  coachProfile,
  onUpdateCoachProfile,
  onShowToast
}: CoachDashboardProps) {
  // Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'clients' | 'client-detail'>('profile');

  // Client list and search states
  const [clients, setClients] = useState<CoachClient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  // Profile Form States
  const [profName, setProfName] = useState(coachProfile.full_name || '');
  const [profSpecialty, setProfSpecialty] = useState(coachProfile.specialty || '');
  const [profBio, setProfBio] = useState(coachProfile.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Client Detail States
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'profile' | 'workout' | 'diet'>('profile');
  
  // Client Detail Form States
  const [clientFormWeight, setClientFormWeight] = useState('');
  const [clientFormGoal, setClientFormGoal] = useState('');
  const [clientFormSessions, setClientFormSessions] = useState('');
  const [clientFormNotes, setClientFormNotes] = useState('');
  const [clientFormProgress, setClientFormProgress] = useState(0);
  const [clientFormTag, setClientFormTag] = useState<'new' | 'active' | 'inactive'>('new');
  const [isSavingClient, setIsSavingClient] = useState(false);

  // Workout and Diet Plan Editor States
  const [workoutDays, setWorkoutDays] = useState<Omit<WorkoutPlan, 'id' | 'coach_id' | 'trainee_id'>[]>([]);
  const [dietDays, setDietDays] = useState<Omit<DietPlan, 'id' | 'coach_id' | 'trainee_id'>[]>([]);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // Add Client Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addTraineeId, setAddTraineeId] = useState('');
  const [searchedTrainee, setSearchedTrainee] = useState<Profile | null>(null);
  const [addGoal, setAddGoal] = useState('');
  const [addWeight, setAddWeight] = useState('');
  const [addNotes, setAddNotes] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  // Load clients roster
  const loadRoster = async () => {
    setIsLoadingClients(true);
    const data = await dataService.getCoachClients(coachProfile.id);
    setClients(data);
    setIsLoadingClients(false);
  };

  useEffect(() => {
    loadRoster();
  }, [coachProfile.id]);

  // Handle Coach Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const success = await onUpdateCoachProfile({
      full_name: profName,
      specialty: profSpecialty,
      bio: profBio
    });
    setIsSavingProfile(false);
    if (success) {
      onShowToast('Profile saved successfully ✓');
    } else {
      onShowToast('Failed to save profile.');
    }
  };

  // Copy User ID
  const handleCopyId = (idString: string) => {
    navigator.clipboard.writeText(idString);
    onShowToast('User ID copied to clipboard!');
  };

  // Handle Client Search
  const filteredClients = clients.filter(c => 
    (c.trainee?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.trainee?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open Client Details
  const handleOpenClient = async (traineeId: string) => {
    const clientRel = clients.find(c => c.trainee_id === traineeId);
    if (!clientRel) return;

    setSelectedClientId(traineeId);
    setDetailTab('profile');

    // Populate Client Profile Forms
    setClientFormWeight(clientRel.weight || '');
    setClientFormGoal(clientRel.goal || '');
    setClientFormSessions(clientRel.weekly_sessions || '');
    setClientFormNotes(clientRel.notes || '');
    setClientFormProgress(clientRel.progress || 0);
    setClientFormTag(clientRel.tag || 'new');

    // Fetch existing workout and diet plans
    const workouts = await dataService.getWorkoutPlan(coachProfile.id, traineeId);
    setWorkoutDays(workouts.map(w => ({
      day_label: w.day_label,
      items: w.items,
      sort_order: w.sort_order
    })));

    const diets = await dataService.getDietPlan(coachProfile.id, traineeId);
    setDietDays(diets.map(d => ({
      day_label: d.day_label,
      items: d.items,
      sort_order: d.sort_order
    })));

    setActiveTab('client-detail');
  };

  // Save client profile updates
  const handleSaveClientDetails = async () => {
    if (!selectedClientId) return;
    setIsSavingClient(true);
    const updates = {
      weight: clientFormWeight,
      goal: clientFormGoal,
      weekly_sessions: clientFormSessions,
      notes: clientFormNotes,
      progress: clientFormProgress,
      tag: clientFormTag
    };
    const success = await dataService.updateCoachClient(coachProfile.id, selectedClientId, updates);
    setIsSavingClient(false);
    if (success) {
      onShowToast('Client profile updated ✓');
      loadRoster(); // Reload to sync with roster and sidebar list
    } else {
      onShowToast('Error updating client data.');
    }
  };

  // Trainee ID Real-time search in modal
  useEffect(() => {
    if (addTraineeId.length < 10) {
      setSearchedTrainee(null);
      return;
    }
    const timeout = setTimeout(async () => {
      const trainee = await dataService.findTraineeProfileById(addTraineeId);
      setSearchedTrainee(trainee);
    }, 400);
    return () => clearTimeout(timeout);
  }, [addTraineeId]);

  // Handle Add Client Submit
  const handleAddClientSubmit = async () => {
    if (!addTraineeId) {
      onShowToast('Please provide a Trainee User ID');
      return;
    }
    if (!searchedTrainee) {
      onShowToast('No active trainee profile found with that ID');
      return;
    }

    setIsAddingClient(true);
    const res = await dataService.addClientToRoster(coachProfile.id, searchedTrainee.id, {
      goal: addGoal,
      weight: addWeight,
      notes: addNotes
    });
    setIsAddingClient(false);

    if (res.success) {
      onShowToast(`${searchedTrainee.full_name} added successfully! ✓`);
      setIsAddModalOpen(false);
      setAddTraineeId('');
      setAddGoal('');
      setAddWeight('');
      setAddNotes('');
      setSearchedTrainee(null);
      loadRoster();
    } else {
      onShowToast(res.error || 'Failed to add trainee.');
    }
  };

  // Plan editor helper methods
  const handleAddWorkoutDay = () => {
    setWorkoutDays([...workoutDays, {
      day_label: `Day ${workoutDays.length + 1}`,
      items: [],
      sort_order: workoutDays.length
    }]);
  };

  const handleAddDietDay = () => {
    setDietDays([...dietDays, {
      day_label: `Day ${dietDays.length + 1}`,
      items: [],
      sort_order: dietDays.length
    }]);
  };

  const handleRemoveWorkoutDay = (idx: number) => {
    setWorkoutDays(workoutDays.filter((_, i) => i !== idx).map((day, i) => ({ ...day, sort_order: i })));
  };

  const handleRemoveDietDay = (idx: number) => {
    setDietDays(dietDays.filter((_, i) => i !== idx).map((day, i) => ({ ...day, sort_order: i })));
  };

  const handleDayLabelChange = (type: 'workout' | 'diet', dayIdx: number, val: string) => {
    if (type === 'workout') {
      const updated = [...workoutDays];
      updated[dayIdx].day_label = val;
      setWorkoutDays(updated);
    } else {
      const updated = [...dietDays];
      updated[dayIdx].day_label = val;
      setDietDays(updated);
    }
  };

  const handleAddItem = (type: 'workout' | 'diet', dayIdx: number) => {
    if (type === 'workout') {
      const updated = [...workoutDays];
      updated[dayIdx].items = [...updated[dayIdx].items, ''];
      setWorkoutDays(updated);
    } else {
      const updated = [...dietDays];
      updated[dayIdx].items = [...updated[dayIdx].items, ''];
      setDietDays(updated);
    }
  };

  const handleItemChange = (type: 'workout' | 'diet', dayIdx: number, itemIdx: number, val: string) => {
    if (type === 'workout') {
      const updated = [...workoutDays];
      updated[dayIdx].items[itemIdx] = val;
      setWorkoutDays(updated);
    } else {
      const updated = [...dietDays];
      updated[dayIdx].items[itemIdx] = val;
      setDietDays(updated);
    }
  };

  const handleRemoveItem = (type: 'workout' | 'diet', dayIdx: number, itemIdx: number) => {
    if (type === 'workout') {
      const updated = [...workoutDays];
      updated[dayIdx].items = updated[dayIdx].items.filter((_, i) => i !== itemIdx);
      setWorkoutDays(updated);
    } else {
      const updated = [...dietDays];
      updated[dayIdx].items = updated[dayIdx].items.filter((_, i) => i !== itemIdx);
      setDietDays(updated);
    }
  };

  const handleSaveWorkoutPlan = async () => {
    if (!selectedClientId) return;
    setIsSavingPlan(true);
    // filter empty items
    const cleaned = workoutDays.map(day => ({
      ...day,
      items: day.items.map(it => it.trim()).filter(Boolean)
    }));
    const success = await dataService.saveWorkoutPlan(coachProfile.id, selectedClientId, cleaned);
    setIsSavingPlan(false);
    if (success) {
      onShowToast('Workout plan saved ✓');
    } else {
      onShowToast('Failed to save workout plan.');
    }
  };

  const handleSaveDietPlan = async () => {
    if (!selectedClientId) return;
    setIsSavingPlan(true);
    // filter empty items
    const cleaned = dietDays.map(day => ({
      ...day,
      items: day.items.map(it => it.trim()).filter(Boolean)
    }));
    const success = await dataService.saveDietPlan(coachProfile.id, selectedClientId, cleaned);
    setIsSavingPlan(false);
    if (success) {
      onShowToast('Diet plan saved ✓');
    } else {
      onShowToast('Failed to save diet plan.');
    }
  };

  const selectedClientRel = clients.find(c => c.trainee_id === selectedClientId);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white flex pt-[70px]">
      <div className="absolute inset-0 hero-bg-grid z-0" />

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`bg-[#111] border-r border-[#222] transition-all duration-300 flex flex-col z-20 ${
          isSidebarCollapsed ? 'w-0 overflow-hidden opacity-0 pointer-events-none md:w-16 md:opacity-100 md:pointer-events-auto' : 'w-64'
        }`}
      >
        <div className="p-4 border-b border-[#222] flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm text-white truncate">{coachProfile.full_name || 'Coach Terminal'}</h3>
              <span className="text-[9px] bg-[#FF6B2B]/10 text-[#FF6B2B] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider mt-1 inline-block">
                Coach
              </span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white hover:border-neutral-700 cursor-pointer hidden md:block"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          <p className={`text-[10px] font-bold text-[#666] uppercase tracking-widest px-2.5 py-1 ${isSidebarCollapsed && 'sr-only'}`}>
            Terminal Menu
          </p>
          
          <button
            onClick={() => {
              setActiveTab('profile');
              setSelectedClientId(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#FF6B2B] text-black'
                : 'text-neutral-400 hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <User className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>My Profile</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab('clients');
              setSelectedClientId(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-[#FF6B2B] text-black'
                : 'text-neutral-400 hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>My Trainees</span>}
          </button>

          {/* Roster submenu (only visible when sidebar is expanded) */}
          {!isSidebarCollapsed && clients.length > 0 && (
            <div className="pt-4 space-y-1">
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest px-2.5 py-1">
                Active Roster ({clients.length})
              </p>
              <div className="pl-2 space-y-0.5 border-l border-[#222]">
                {clients.map(c => {
                  const isActiveClient = selectedClientId === c.trainee_id;
                  return (
                    <button
                      key={c.trainee_id}
                      onClick={() => handleOpenClient(c.trainee_id)}
                      className={`w-full text-left truncate px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer ${
                        isActiveClient 
                          ? 'bg-[#FF6B2B]/15 text-[#FF6B2B] font-bold'
                          : 'text-neutral-400 hover:text-white hover:bg-[#1A1A1A]/50'
                      }`}
                    >
                      ● {c.trainee?.full_name || 'Trainee'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden z-10 relative">
        
        {/* TOP FLOATING TOGGLE BUTTON FOR MOBILE */}
        <div className="flex md:hidden items-center justify-between mb-4">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg bg-[#1A1A1A] border border-[#222] text-neutral-400 flex items-center gap-2 text-xs font-semibold"
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-[#FF6B2B] hover:bg-[#D95520] text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Client
          </button>
        </div>

        {/* HEADER AREA */}
        <div className="hidden md:flex items-center justify-between border-b border-[#222] pb-5 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#666] tracking-widest block mb-1">
              Welcome Back Terminal
            </span>
            <h1 className="text-3xl font-bold tracking-tight">
              Aesthetics Hub: <span className="text-[#FF6B2B]">{coachProfile.full_name || 'Coach'}</span>
            </h1>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#FF6B2B] hover:bg-[#D95520] text-black rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#FF6B2B]/20 hover:shadow-brand-orange/35 transition-all transform hover:-translate-y-0.5 cursor-pointer animate-pulse-subtle"
          >
            <Plus className="w-4 h-4" /> Add Trainee
          </button>
        </div>

        {/* TAB 1: MY PROFILE */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl"
          >
            {/* ID Chip */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-[#FF6B2B] uppercase tracking-widest block mb-1">
                  Coach Referral Code
                </span>
                <p className="text-xs text-[#888]">
                  Share this unique code with your trainees. They need it to link their profiles to your roster.
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => handleCopyId(coachProfile.id)}
                className="user-id-chip select-all text-left flex items-center gap-2 group w-full sm:w-auto bg-[#1A1A1A] border border-[#222] px-4 py-2.5 rounded-xl"
              >
                <span className="truncate text-xs font-mono text-white">{coachProfile.id}</span>
                <Copy className="w-3.5 h-3.5 text-[#666] group-hover:text-[#FF6B2B] flex-shrink-0" />
              </button>
            </div>

            {/* Profile Info Card */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#222]">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#222] flex items-center justify-center font-bold text-2xl text-[#FF6B2B] shadow-inner">
                    {(profName || 'C').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-lg text-white">{profName || 'Trainer'}</h3>
                    <p className="text-xs text-[#888]">{coachProfile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                      Coach Full Name
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

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                      Professional Specialty
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Strength & Conditioning, Fat Loss"
                      value={profSpecialty}
                      onChange={(e) => setProfSpecialty(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-[#666]"
                    />
                  </div>

                  <div className="space-y-1.5 text-left sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                      Coach Bio / Motivation
                    </label>
                    <textarea
                      placeholder="Describe your training credentials, certifications, philosophy, and success rate..."
                      value={profBio}
                      onChange={(e) => setProfBio(e.target.value)}
                      rows={4}
                      className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-[#666] resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-3 bg-[#FF6B2B] hover:bg-[#D95520] text-black font-bold uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 2: MY CLIENTS ROSTER GRID */}
        {activeTab === 'clients' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and stats bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input
                  type="text"
                  placeholder="Search trainees by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl pl-10 pr-4 py-3 text-white outline-none transition-all placeholder:text-[#666]"
                />
              </div>
              
              <div className="text-xs text-[#888] font-bold tracking-wider bg-[#111] px-4 py-3 border border-[#222] rounded-xl w-full sm:w-auto text-center sm:text-right shadow-sm">
                Showing <span className="text-[#FF6B2B] font-bold">{filteredClients.length}</span> of <span className="text-white font-bold">{clients.length}</span> linked trainees
              </div>
            </div>

            {isLoadingClients ? (
              <div className="py-20 text-center text-[#888] text-sm">
                Synchronizing roster from database...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="bg-[#111] border border-[#222] rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                <div className="text-3xl">🏋️‍♂️</div>
                <h3 className="font-bold text-white text-lg">No Trainees Registered</h3>
                <p className="text-xs text-[#888] max-w-sm mx-auto leading-relaxed">
                  Your roster is currently empty, or your query did not yield any results. Share your Coach ID or add client IDs manually to initialize relationships.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-[#FF6B2B] hover:bg-[#D95520] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Add Client Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(c => {
                  const traineeName = c.trainee?.full_name || 'Trainee';
                  const traineeInitials = traineeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <motion.div
                      key={c.trainee_id}
                      onClick={() => handleOpenClient(c.trainee_id)}
                      whileHover={{ y: -3 }}
                      className="bg-[#111] border border-[#222] rounded-3xl p-6 hover:border-[#FF6B2B]/40 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                    >
                      <div>
                        {/* Top layout */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#222] flex items-center justify-center font-bold text-xs text-[#FF6B2B]">
                              {traineeInitials}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="font-bold text-sm text-white group-hover:text-[#FF6B2B] transition-colors truncate">
                                {traineeName}
                              </h4>
                              <p className="text-[10px] text-neutral-500 truncate">{c.trainee?.email}</p>
                            </div>
                          </div>

                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider ${
                            c.tag === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : c.tag === 'new'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {c.tag}
                          </span>
                        </div>

                        {/* Middle details */}
                        <div className="space-y-2 py-2 border-t border-b border-[#222] my-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#888] font-light">Body Weight</span>
                            <span className="text-white font-semibold">{c.weight || 'Not Logged'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[#888] font-light">Focus/Goal</span>
                            <span className="text-white font-semibold truncate max-w-[150px]">{c.goal || 'General Fitness'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar info */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                          <span className="text-[#888]">Monthly Progress</span>
                          <span className="text-[#FF6B2B]">{c.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#FF6B2B] rounded-full transition-all duration-800"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: CLIENT DETAILED PORTAL (PROFILE, WORKOUT, DIET) */}
        {activeTab === 'client-detail' && selectedClientId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-left"
          >
            {/* Breadcrumb row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('clients')}
                className="p-2 rounded-xl bg-[#111] border border-[#222] hover:border-[#333] text-[#888] hover:text-white transition-all cursor-pointer flex items-center justify-center"
                title="Back to roster"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <div className="text-xs text-[#888]">
                My Trainees <span className="mx-1 text-[#222]">/</span>{' '}
                <span className="text-white font-bold">{selectedClientRel?.trainee?.full_name}</span>
              </div>
            </div>

            {/* Client Top Hero Banner */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#222] flex items-center justify-center font-bold text-lg text-[#FF6B2B] shadow-inner">
                {(selectedClientRel?.trainee?.full_name || 'T').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-white">{selectedClientRel?.trainee?.full_name}</h2>
                <p className="text-xs text-[#888] mt-0.5">
                  Goal: <span className="text-white font-semibold">{selectedClientRel?.goal || 'Not set'}</span>
                  {'  '}•{'  '}
                  Weight: <span className="text-white font-semibold">{selectedClientRel?.weight || 'Not logged'}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest uppercase text-[#666]">Progress:</span>
                <span className="font-display text-3xl font-black text-[#FF6B2B]">{selectedClientRel?.progress}%</span>
              </div>
            </div>

            {/* Details tabs */}
            <div className="flex gap-4 border-b border-[#222]">
              <button
                onClick={() => setDetailTab('profile')}
                className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  detailTab === 'profile'
                    ? 'text-white border-[#FF6B2B]'
                    : 'text-neutral-400 border-transparent hover:text-white'
                }`}
              >
                <User className="w-4 h-4" /> Trainee Profile
              </button>

              <button
                onClick={() => setDetailTab('workout')}
                className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  detailTab === 'workout'
                    ? 'text-white border-[#FF6B2B]'
                    : 'text-neutral-400 border-transparent hover:text-white'
                }`}
              >
                <Dumbbell className="w-4 h-4" /> Workout Planner
              </button>

              <button
                onClick={() => setDetailTab('diet')}
                className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  detailTab === 'diet'
                    ? 'text-white border-[#FF6B2B]'
                    : 'text-neutral-400 border-transparent hover:text-white'
                }`}
              >
                <Apple className="w-4 h-4" /> Nutrition Planner
              </button>
            </div>

            {/* TAB SUBVIEW CONTENT */}
            <AnimatePresence mode="wait">
              
              {/* DETAIL SUB-TAB: PROFILE DETAIL */}
              {detailTab === 'profile' && (
                <motion.div
                  key="sub-prof"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#111] border border-[#222] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 border-b border-[#222] pb-3">
                    Relationship Metrics & Notes
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                        Trainee Full Name
                      </label>
                      <input
                        type="text"
                        value={selectedClientRel?.trainee?.full_name || ''}
                        disabled
                        className="w-full bg-[#1A1A1A]/40 border border-[#222]/60 text-sm rounded-xl px-4 py-3 text-[#666] outline-none cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                        Current Body Weight
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 85 kg"
                        value={clientFormWeight}
                        onChange={(e) => setClientFormWeight(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-[#666]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                        Training Goal / Focus
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Fat Loss, Muscle Tone"
                        value={clientFormGoal}
                        onChange={(e) => setClientFormGoal(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-[#666]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                        Weekly Sessions (Sessions per Week)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 4"
                        value={clientFormSessions}
                        onChange={(e) => setClientFormSessions(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-[#666]"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider flex justify-between">
                        <span>Overall Progress Target Completion</span>
                        <span className="text-[#FF6B2B] font-bold font-mono">{clientFormProgress}%</span>
                      </label>
                      <div className="flex items-center gap-4 bg-[#1A1A1A]/50 p-4 rounded-xl border border-[#222]">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={clientFormProgress}
                          onChange={(e) => setClientFormProgress(Number(e.target.value))}
                          className="flex-1 accent-[#FF6B2B] h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="w-10 text-right text-sm font-bold text-white">{clientFormProgress}%</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                        Roster Status Category
                      </label>
                      <select
                        value={clientFormTag}
                        onChange={(e: any) => setClientFormTag(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl px-4 py-3 text-white outline-none transition-all"
                      >
                        <option value="new">New trainee (First month)</option>
                        <option value="active">Active regular training</option>
                        <option value="inactive">Inactive / Frozen account</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                        Confidential Coach Notes / Medical History
                      </label>
                      <textarea
                        placeholder="Injuries, knee pain, lower back discomfort, food allergies, supplement routine..."
                        value={clientFormNotes}
                        onChange={(e) => setClientFormNotes(e.target.value)}
                        rows={4}
                        className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-sm rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-[#666] resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-[#222]">
                    <button
                      type="button"
                      disabled={isSavingClient}
                      onClick={handleSaveClientDetails}
                      className="px-6 py-3 bg-[#FF6B2B] hover:bg-[#D95520] text-black font-bold uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingClient ? 'Saving Metrics...' : 'Save Trainee Profile'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* DETAIL SUB-TAB: WORKOUT PLANNER */}
              {detailTab === 'workout' && (
                <motion.div
                  key="sub-work"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#111] border border-[#222] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-[#222] pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                      Weekly Workout Scheduler
                    </h3>
                    <button
                      onClick={handleSaveWorkoutPlan}
                      disabled={isSavingPlan}
                      className="px-5 py-2 bg-[#FF6B2B] hover:bg-[#D95520] text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingPlan ? 'Saving...' : 'Save Plan'}
                    </button>
                  </div>

                  {workoutDays.length === 0 ? (
                    <div className="py-12 text-center text-neutral-500 text-sm space-y-3">
                      <p>No workout days prescribed yet for this client.</p>
                      <button
                        onClick={handleAddWorkoutDay}
                        className="px-4 py-2 border border-dashed border-[#222] hover:border-[#FF6B2B] rounded-xl text-xs font-bold text-[#888] hover:text-[#FF6B2B] transition-all cursor-pointer"
                      >
                        + Add First Workout Day
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {workoutDays.map((day, dIdx) => (
                        <div 
                          key={dIdx}
                          className="bg-[#1A1A1A] p-4 sm:p-5 rounded-2xl border border-[#222] space-y-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <input
                              type="text"
                              value={day.day_label}
                              onChange={(e) => handleDayLabelChange('workout', dIdx, e.target.value)}
                              placeholder="e.g. Monday (Chest & Triceps)"
                              className="bg-transparent text-sm font-bold text-[#FF6B2B] border-b border-neutral-800 hover:border-neutral-600 focus:border-[#FF6B2B] px-1 py-1 outline-none w-full max-w-[280px]"
                            />
                            <button
                              onClick={() => handleRemoveWorkoutDay(dIdx)}
                              className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                              title="Delete this day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Items of exercises */}
                          <div className="space-y-2">
                            {day.items.map((item, iIdx) => (
                              <div key={iIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleItemChange('workout', dIdx, iIdx, e.target.value)}
                                  placeholder="e.g. Flat Bench Press: 4 sets x 10 reps"
                                  className="flex-1 bg-[#0A0A0A] border border-[#222] focus:border-[#FF6B2B] text-xs rounded-xl px-3 py-2.5 text-white outline-none placeholder:text-[#666]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem('workout', dIdx, iIdx)}
                                  className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => handleAddItem('workout', dIdx)}
                            className="text-[11px] font-bold text-neutral-400 hover:text-[#FF6B2B] flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Exercise
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={handleAddWorkoutDay}
                        className="w-full py-3 border border-dashed border-[#222] hover:border-[#FF6B2B] rounded-xl text-xs font-bold text-neutral-400 hover:text-[#FF6B2B] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Next Training Day
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* DETAIL SUB-TAB: DIET PLANNER */}
              {detailTab === 'diet' && (
                <motion.div
                  key="sub-diet"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#111] border border-[#222] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-[#222] pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                      Weekly Meal & Macro Planner
                    </h3>
                    <button
                      onClick={handleSaveDietPlan}
                      disabled={isSavingPlan}
                      className="px-5 py-2 bg-[#FF6B2B] hover:bg-[#D95520] text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingPlan ? 'Saving...' : 'Save Plan'}
                    </button>
                  </div>

                  {dietDays.length === 0 ? (
                    <div className="py-12 text-center text-neutral-500 text-sm space-y-3">
                      <p>No nutrition schedules prescribed yet for this client.</p>
                      <button
                        onClick={handleAddDietDay}
                        className="px-4 py-2 border border-dashed border-[#222] hover:border-[#FF6B2B] rounded-xl text-xs font-bold text-[#888] hover:text-[#FF6B2B] transition-all cursor-pointer"
                      >
                        + Add First Diet Day
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {dietDays.map((day, dIdx) => (
                        <div 
                          key={dIdx}
                          className="bg-[#1A1A1A] p-4 sm:p-5 rounded-2xl border border-[#222] space-y-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <input
                              type="text"
                              value={day.day_label}
                              onChange={(e) => handleDayLabelChange('diet', dIdx, e.target.value)}
                              placeholder="e.g. Training Days (Low Carb / High Protein)"
                              className="bg-transparent text-sm font-bold text-[#FF6B2B] border-b border-neutral-800 hover:border-[#FF6B2B] px-1 py-1 outline-none w-full max-w-[280px]"
                            />
                            <button
                              onClick={() => handleRemoveDietDay(dIdx)}
                              className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                              title="Delete this day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Items of exercises */}
                          <div className="space-y-2">
                            {day.items.map((item, iIdx) => (
                              <div key={iIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleItemChange('diet', dIdx, iIdx, e.target.value)}
                                  placeholder="e.g. Meal 1: 5 egg whites, 50g oatmeal, handful of berries"
                                  className="flex-1 bg-[#0A0A0A] border border-[#222] focus:border-[#FF6B2B] text-xs rounded-xl px-3 py-2.5 text-white outline-none placeholder:text-[#666]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem('diet', dIdx, iIdx)}
                                  className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => handleAddItem('diet', dIdx)}
                            className="text-[11px] font-bold text-neutral-400 hover:text-[#FF6B2B] flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Meal
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={handleAddDietDay}
                        className="w-full py-3 border border-dashed border-[#222] hover:border-[#FF6B2B] rounded-xl text-xs font-bold text-neutral-400 hover:text-[#FF6B2B] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Next Nutrition Template
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* MODAL: ADD CLIENT MANUALLY BY COPIED USER ID */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/85 backdrop-blur-md z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#111] border border-[#222] rounded-3xl p-6 relative text-left shadow-2xl divide-y divide-[#222]"
          >
            {/* Header */}
            <div className="pb-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-display text-2xl font-black text-white tracking-wide">
                Link Client to Roster
              </h2>
              <p className="text-xs text-[#888] mt-1">
                Establish direct relationship by entering the client's unique User ID.
              </p>
            </div>

            {/* Inputs Body */}
            <div className="py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                  Client Unique ID
                </label>
                <input
                  type="text"
                  placeholder="Paste client's User ID from their profile screen..."
                  value={addTraineeId}
                  onChange={(e) => setAddTraineeId(e.target.value.trim())}
                  className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-xs rounded-xl px-4 py-3 text-white outline-none transition-all"
                />
              </div>

              {/* Dynamic Live Look-up result box */}
              {addTraineeId && (
                <div className="p-3.5 bg-[#1A1A1A]/50 rounded-xl border border-[#222] text-xs">
                  {searchedTrainee ? (
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-bold text-emerald-400 block">✓ Valid Client ID found</span>
                      <div className="font-bold text-white text-sm">{searchedTrainee.full_name}</div>
                      <div className="text-neutral-400 text-[10px]">{searchedTrainee.email}</div>
                    </div>
                  ) : (
                    <span className="text-neutral-500 italic">Searching active trainee database...</span>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                  Main Client Goal / Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lose 10kg fat, gain strength"
                  value={addGoal}
                  onChange={(e) => setAddGoal(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-xs rounded-xl px-4 py-3 text-white outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                  Starting Body Weight
                </label>
                <input
                  type="text"
                  placeholder="e.g. 85 kg"
                  value={addWeight}
                  onChange={(e) => setAddWeight(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-xs rounded-xl px-4 py-3 text-white outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[#888] tracking-wider">
                  Initial Notes / Coach Reminders
                </label>
                <textarea
                  placeholder="e.g. Knee issue, avoids dairy, trains early morning..."
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1A1A1A] border border-[#222] focus:border-[#FF6B2B] text-xs rounded-xl px-4 py-3 text-white outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 border border-[#222] hover:border-neutral-700 text-[#888] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAddingClient || !searchedTrainee}
                onClick={handleAddClientSubmit}
                className="px-5 py-2.5 bg-[#FF6B2B] hover:bg-[#D95520] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {isAddingClient ? 'Linking Roster...' : 'Confirm Link Roster'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
