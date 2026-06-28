'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navigation from '@/components/Navigation';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  specialty: string;
  bio: string;
}

export default function CoachDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setProfile({
          ...profileData,
          email: session.user.email || '',
        });
      }
    };

    loadProfile();
  }, [router]);



  return (
    <>
      <Navigation />
      <div className="dashboard-layout">
        <div className="hero-bg-grid"></div>
        <div className="glow-orb orb-dash-1"></div>
        <div className="glow-orb orb-dash-2"></div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-brand">
            <span>{profile?.full_name || 'Coach'}</span>
            <button type="button" className="sidebar-toggle-btn toggle-sidebar-trigger" title="Collapse">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          </div>
          <div className="sidebar-section-label">Menu</div>
          <div className="sidebar-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            My Profile
          </div>
          <div className="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            My Clients
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="dash-header">
            <div className="header-title-area">
              <button type="button" className="sidebar-toggle-floating toggle-sidebar-trigger" title="Expand Sidebar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>
              <div>
                <div className="dash-subtitle">Coach Dashboard</div>
                <h1>
                  Welcome, <span className="accent-orange">{profile?.full_name?.split(' ')[0] || 'Coach'}!</span>
                </h1>
              </div>
            </div>
            <button type="button" className="btn btn-orange">
              + Add client
            </button>
          </div>

          {/* Profile Section */}
          <div>
            <div className="dash-tabs">
              <div className="dash-tab active">My Profile</div>
              <div className="dash-tab pointer">My Clients</div>
            </div>

            <div className="profile-card">
              <div className="avatar-wrapper">
                <div className="avatar">{profile?.full_name?.split(' ').map((n) => n[0]).join('') || 'C'}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {profile?.full_name || 'Coach'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sec)' }}>{profile?.email}</div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full name</label>
                  <input type="text" placeholder="Your name" defaultValue={profile?.full_name || ''} />
                </div>
                <div className="form-group">
                  <label>Specialty</label>
                  <input type="text" placeholder="Strength & Conditioning" defaultValue={profile?.specialty || ''} />
                </div>
                <div className="form-group full">
                  <label>Bio</label>
                  <textarea placeholder="Tell your clients about your experience..." defaultValue={profile?.bio || ''}></textarea>
                </div>
                <div className="form-group form-actions-right gap08">
                  <button type="button" className="btn btn-orange btn-sm">
                    Save profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout button - accessed via menu */}
      <style jsx>{`
        .nav-dropdown-menu {
          display: none;
          position: absolute;
          top: 44px;
          right: 0;
          background: var(--surface);
          border: 1px solid var(--border-col);
          border-radius: 8px;
          width: 280px;
          z-index: 250;
        }
        .nav-dropdown-menu.show {
          display: block;
        }
      `}</style>
    </>
  );
}
