'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navigation from '@/components/Navigation';

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

export default function TraineeDashboard() {
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
            <div>
              <div id="sb-trainee-name" style={{ fontWeight: 700 }}>
                {profile?.full_name || 'Trainee'}
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(255,107,43,0.12)',
                    color: 'var(--orange)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '3px',
                  }}
                >
                  Trainee
                </span>
              </div>
            </div>
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
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Overview
          </div>
          <div className="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            My Profile
          </div>
          <div className="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h12M6 12h12M6 18h12" />
            </svg>
            Workout Plan
          </div>
          <div className="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
            Diet Plan
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
                <div className="dash-subtitle">Trainee Dashboard</div>
                <h1>
                  Let&apos;s get to work, <span className="accent-orange">{profile?.full_name?.split(' ')[0] || 'Champ'}!</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div>
            <div className="stats-row">
              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-col)',
                  borderRadius: '6px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-sec)' }}>
                  Progress
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>—</div>
              </div>
              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-col)',
                  borderRadius: '6px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-sec)' }}>
                  Weight
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>—</div>
              </div>
              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-col)',
                  borderRadius: '6px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-sec)' }}>
                  Goal
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>—</div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="dash-tabs" style={{ marginTop: '2rem' }}>
              <div className="dash-tab active">My Profile</div>
              <div className="dash-tab pointer">Workout Plan</div>
              <div className="dash-tab pointer">Diet Plan</div>
            </div>

            <div className="profile-card">
              <div className="avatar-wrapper">
                <div className="avatar">{profile?.full_name?.split(' ').map((n) => n[0]).join('') || 'T'}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {profile?.full_name || 'Trainee'}
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
                  <label>Email</label>
                  <input type="email" disabled style={{ opacity: 0.6 }} defaultValue={profile?.email || ''} />
                </div>
                <div className="form-group full">
                  <label>Bio</label>
                  <textarea placeholder="Tell your coach about yourself..."></textarea>
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
    </>
  );
}
