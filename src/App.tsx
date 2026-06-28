import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import CoachDashboard from './components/CoachDashboard';
import TraineeDashboard from './components/TraineeDashboard';
import CalorieModal from './components/CalorieModal';
import { dataService } from './dataService';
import { Profile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCalorieModalOpen, setIsCalorieModalOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth & Theme
  useEffect(() => {
    // Check dark/light mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Check active session
    const checkSession = async () => {
      try {
        const user = await dataService.getCurrentUser();
        if (user) {
          const profile = await dataService.getProfile(user.id);
          setCurrentUser(user);
          setCurrentProfile(profile);
          setView('dashboard');
        }
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleToggleTheme = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    const themeStr = nextVal ? 'dark' : 'light';
    localStorage.setItem('theme', themeStr);
    document.documentElement.setAttribute('data-theme', themeStr);
  };

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const handleAuthSuccess = (user: { id: string; email: string }, profile: Profile) => {
    setCurrentUser(user);
    setCurrentProfile(profile);
    setView('dashboard');
    handleShowToast(`Welcome back, ${profile.full_name || 'Champ'}! ✓`);
  };

  const handleSignOut = async () => {
    await dataService.signOut();
    setCurrentUser(null);
    setCurrentProfile(null);
    setView('landing');
    handleShowToast('Logged out successfully.');
  };

  const handleUpdateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!currentUser) return false;
    const success = await dataService.updateProfile(currentUser.id, updates);
    if (success) {
      setCurrentProfile((prev) => prev ? { ...prev, ...updates } : null);
    }
    return success;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center items-center">
        <div className="absolute inset-0 hero-bg-grid z-0 opacity-50" />
        <div className="text-center space-y-4 z-10">
          <span className="font-display text-5xl font-black text-brand-orange block animate-pulse">
            T-0
          </span>
          <p className="text-xs text-[#666] uppercase tracking-widest font-sans">
            Initializing athletic terminal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans overflow-x-hidden selection:bg-brand-orange selection:text-white">
      {/* Top persistent Navbar */}
      <Navbar
        profile={currentProfile}
        onSignOut={handleSignOut}
        onNavigateHome={() => {
          if (currentUser) {
            setView('dashboard');
          } else {
            setView('landing');
          }
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenCalorieModal={() => setIsCalorieModalOpen(true)}
      />

      {/* Main interactive views with slide and fade animations */}
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingView
              onStart={() => {
                setAuthInitialTab('signup');
                setView('auth');
              }}
              onLogin={() => {
                setAuthInitialTab('signin');
                setView('auth');
              }}
            />
          </motion.div>
        )}

        {view === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <AuthView
              initialTab={authInitialTab}
              onAuthSuccess={handleAuthSuccess}
              onSignInAction={dataService.signIn.bind(dataService)}
              onSignUpAction={dataService.signUp.bind(dataService)}
            />
          </motion.div>
        )}

        {view === 'dashboard' && currentProfile && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {currentProfile.role === 'coach' ? (
              <CoachDashboard
                coachProfile={currentProfile}
                onUpdateCoachProfile={handleUpdateProfile}
                onShowToast={handleShowToast}
              />
            ) : (
              <TraineeDashboard
                traineeProfile={currentProfile}
                onUpdateTraineeProfile={handleUpdateProfile}
                onShowToast={handleShowToast}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Premium feature calorie calculator modal */}
      <CalorieModal
        isOpen={isCalorieModalOpen}
        onClose={() => setIsCalorieModalOpen(false)}
      />

      {/* Dynamic Floating Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-850 text-white text-xs px-5 py-3.5 rounded-lg shadow-xl font-medium tracking-wide flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
