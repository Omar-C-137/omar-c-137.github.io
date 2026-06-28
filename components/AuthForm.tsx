'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import './auth-form.css';

type Role = 'coach' | 'trainee';
type Tab = 'signin' | 'signup';

export default function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');
  const [selectedRole, setSelectedRole] = useState<Role>('coach');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  useEffect(() => {
    const unsubscribe = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const role = profile?.role || 'trainee';
        router.push(role === 'coach' ? '/coach' : '/trainee');
      }
    });

    return () => unsubscribe.data?.subscription.unsubscribe();
  }, [router]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setError('Please fill in all fields.');
      return;
    }

    clearMessages();
    setIsLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });

    setIsLoading(false);

    if (err) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    clearMessages();
    setIsLoading(true);

    const { error: err } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: {
          full_name: signUpName,
          role: selectedRole,
        },
      },
    });

    setIsLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSuccess('Account created! Check your email to confirm, then sign in.');
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
  };

  const handleGoogleAuth = async () => {
    clearMessages();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          typeof window !== 'undefined' && window.location.hostname.includes('github.io')
            ? 'https://omar-c-137.github.io/T-0/auth'
            : window.location.origin + '/auth',
      },
    });

    if (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="hero-bg-grid"></div>
      <div className="glow-orb orb1"></div>
      <div className="glow-orb orb2"></div>

      <div className="auth-box">
        <div className="auth-logo">T-0</div>
        <div className="auth-tagline">Train smarter. Track better.</div>

        <div className="auth-tabs">
          <div
            className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
            onClick={() => {
              setTab('signin');
              clearMessages();
            }}
          >
            Sign In
          </div>
          <div
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setTab('signup');
              clearMessages();
            }}
          >
            Sign Up
          </div>
        </div>

        {error && <div className="auth-error show">{error}</div>}
        {success && <div className="auth-success show">{success}</div>}

        {/* SIGN IN FORM */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn}>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-orange btn-auth"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="auth-divider">or</div>
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Omar Ahmed"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field" style={{ marginBottom: '0.5rem' }}>
              <label>I am a...</label>
            </div>
            <div className="role-row">
              <div
                className={`role-pill ${selectedRole === 'coach' ? 'selected' : ''}`}
                onClick={() => setSelectedRole('coach')}
              >
                <span className="rp-icon">🏅</span>
                <span className="rp-label">Coach</span>
                <span className="rp-desc">I train clients</span>
              </div>
              <div
                className={`role-pill ${selectedRole === 'trainee' ? 'selected' : ''}`}
                onClick={() => setSelectedRole('trainee')}
              >
                <span className="rp-icon">💪</span>
                <span className="rp-label">Trainee</span>
                <span className="rp-desc">I follow plans</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-orange btn-auth"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
            <div className="auth-divider">or</div>
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
