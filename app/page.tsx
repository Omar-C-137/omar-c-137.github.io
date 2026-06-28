'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => router.push('/auth');
  const handleLogin = () => router.push('/auth');

  if (!mounted) return null;

  return (
    <>
      <Navigation />
      <div className="page active">
        <div className="hero">
          <div className="hero-bg-grid"></div>
          <div className="glow-orb orb1"></div>
          <div className="glow-orb orb2"></div>
          <div className="glow-orb orb3"></div>
          <h1>
            <span className="line1">Start your journey</span>
          </h1>
          <div className="hero-btns">
            <button className="btn btn-yellow hero-btn-custom" onClick={handleStart}>
              start for free
            </button>
            <button className="btn btn-outline hero-btn-custom" onClick={handleLogin}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
