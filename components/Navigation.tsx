'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleThemeToggle = () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('t0-theme', next);
    };

    const themeBtn = document.getElementById('themeToggle');
    themeBtn?.addEventListener('click', handleThemeToggle);

    const savedTheme = localStorage.getItem('t0-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    return () => {
      themeBtn?.removeEventListener('click', handleThemeToggle);
    };
  }, []);

  useEffect(() => {
    const menu = document.getElementById('navDropdownMenu');
    const btn = document.getElementById('menu-toggle-btn');

    const handleMenuToggle = (e: Event) => {
      e.stopPropagation();
      menu?.classList.toggle('show');
      btn?.setAttribute('aria-expanded', menu?.classList.contains('show') ? 'true' : 'false');
    };

    const handleMenuClick = (e: Event) => {
      e.stopPropagation();
    };

    const handleWindowClick = () => {
      menu?.classList.remove('show');
      btn?.setAttribute('aria-expanded', 'false');
    };

    btn?.addEventListener('click', handleMenuToggle);
    menu?.addEventListener('click', handleMenuClick);
    window.addEventListener('click', handleWindowClick);

    return () => {
      btn?.removeEventListener('click', handleMenuToggle);
      menu?.removeEventListener('click', handleMenuClick);
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  if (!mounted) return null;

  return (
    <nav>
      <div className="nav-left-group">
        <Link href="/" className="logo">
          T-0
        </Link>
      </div>
      <div className="nav-right">
        <div className="nav-dropdown-container">
          <button
            type="button"
            className="nav-sidebar-toggle"
            id="menu-toggle-btn"
            aria-controls="navDropdownMenu"
            aria-expanded="false"
            aria-label="Open features menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <div className="nav-dropdown-menu" id="navDropdownMenu">
            <div className="dropdown-item-header">Features & Add-ons</div>
            <button
              className="dropdown-item"
              id="calorie-feature-btn"
              onClick={() => alert('Calorie Calculator — $4.99/mo add-on')}
            >
              <span className="item-icon">🔥</span>
              <div className="item-text">
                <div className="item-title">Calorie Calculator</div>
                <div className="item-desc">Premium Feature Add-on</div>
              </div>
              <span className="item-price">$4.99</span>
            </button>
          </div>
        </div>
        <button type="button" className="theme-toggle" id="themeToggle" aria-label="Toggle dark mode"></button>
      </div>
    </nav>
  );
}
