import React, { useState } from 'react';
import { Flame, LogOut, Sun, Moon, Menu, User, Dumbbell } from 'lucide-react';
import { Profile } from '../types';

interface NavbarProps {
  profile: Profile | null;
  onSignOut: () => void;
  onNavigateHome: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenCalorieModal: () => void;
}

export default function Navbar({
  profile,
  onSignOut,
  onNavigateHome,
  isDarkMode,
  onToggleTheme,
  onOpenCalorieModal
}: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-[70px] bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222] flex items-center justify-between px-6 z-50 transition-colors">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onNavigateHome}
      >
        <span className="font-display text-3xl font-extrabold tracking-tight text-[#FF6B2B] group-hover:text-brand-orange-dark transition-colors">
          T-0
        </span>
        <span className="hidden sm:inline-block font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-[#666]">
          High Performance Hub
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Supabase Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#FF6B2B]/10 rounded-full border border-[#FF6B2B]/20">
          <div className="w-2 h-2 bg-[#FF6B2B] rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-[#FF6B2B] uppercase tracking-wider">
            Live Database Connected
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="relative w-12 h-6 rounded-full bg-neutral-800 dark:bg-neutral-900 border border-neutral-700 dark:border-neutral-800 p-0.5 cursor-pointer flex items-center transition-all duration-300"
          aria-label="Toggle dark mode"
        >
          <div 
            className={`w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center transition-transform duration-300 transform ${
              isDarkMode ? 'translate-x-6 bg-brand-orange' : 'translate-x-0'
            }`}
          >
            {isDarkMode ? (
              <Moon className="w-3 h-3 text-white" />
            ) : (
              <Sun className="w-3 h-3 text-neutral-950" />
            )}
          </div>
        </button>

        {/* User Account Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 hover:border-brand-orange/40 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {profile ? (
              <span className="font-bold text-sm text-brand-orange">
                {(profile.full_name || profile.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {isDropdownOpen && (
            <>
              {/* Back drop to close dropdown */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
              
              <div className="absolute right-0 mt-3 w-72 bg-[#111] border border-[#222] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-[#222] animate-in fade-in slide-in-from-top-2 duration-150">
                {profile ? (
                  <div className="p-4 bg-[#1A1A1A]/45">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FF6B2B]/10 border border-[#FF6B2B]/30 flex items-center justify-center font-bold text-[#FF6B2B]">
                        {(profile.full_name || profile.email).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-semibold text-sm text-white truncate">
                          {profile.full_name || 'Fitness Member'}
                        </h4>
                        <p className="text-xs text-[#888] truncate">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 inline-block px-2 py-0.5 bg-[#FF6B2B]/10 text-[#FF6B2B] text-[10px] font-bold uppercase tracking-wider rounded">
                      {profile.role}
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-xs text-[#888] font-medium">T-0 Fitness Hub</p>
                  </div>
                )}

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenCalorieModal();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-900 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <Flame className="w-4 h-4 fill-brand-orange/10" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Calorie Calculator</div>
                      <div className="text-[10px] text-neutral-400">Premium Add-on Feature</div>
                    </div>
                    <span className="text-[10px] font-bold bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded">
                      $4.99
                    </span>
                  </button>
                </div>

                {profile && (
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-950/20 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-950/30 flex items-center justify-center text-red-400">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Sign Out</div>
                        <div className="text-[10px] text-red-500/80">Exit your session securely</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
