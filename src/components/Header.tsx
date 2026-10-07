'use client';

import React from 'react';
import { CategoryId, CategoryInfo } from '../types/clothing';
import { playSoftClick, setSoundEnabled } from '../utils/audio';

interface HeaderProps {
  categories: CategoryInfo[];
  activeCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  motionEnabled: boolean;
  setMotionEnabled: (val: boolean) => void;
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
  onResetView: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({
  categories,
  activeCategory,
  onSelectCategory,
  motionEnabled,
  setMotionEnabled,
  soundOn,
  setSoundOn,
  onResetView,
  cartCount,
  onOpenCart
}: HeaderProps) {
  return (
    <header className="top-nav">
      {/* 1. Left: Brand Logo */}
      <div className="nav-left">
        <a
          href="#"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            playSoftClick();
            onResetView();
          }}
          title="Return to Showroom Rail"
        >
          <span>àrèwà</span>
          <span className="dot" />
        </a>
      </div>

      {/* 2. Center: Luxury Category Switcher */}
      <nav className="category-nav-bar" aria-label="Collections">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playSoftClick();
                onSelectCategory(cat.id);
              }}
              className={`category-pill-btn ${isActive ? 'active' : ''}`}
              title={cat.tagline}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Right: Audio, Motion, and Bag Trigger */}
      <div className="nav-actions">
        {/* Sound toggle */}
        <button
          className={`icon-sound ${soundOn ? 'sound-active' : 'sound-muted'}`}
          onClick={() => {
            const nextSound = !soundOn;
            setSoundEnabled(nextSound);
            setSoundOn(nextSound);
            if (nextSound) {
              playSoftClick();
            }
          }}
          title={soundOn ? 'Mute audio cues' : 'Unmute audio cues'}
          aria-label="Toggle Sound"
        >
          {soundOn ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        {/* Motion on / Motion off */}
        <button
          className={`pill-toggle ${motionEnabled ? 'motion-on' : 'motion-off'}`}
          onClick={() => {
            playSoftClick();
            setMotionEnabled(!motionEnabled);
          }}
          title={motionEnabled ? 'Turn off 3D motion and rail tilt (Static Mode)' : 'Turn on 3D motion and animations'}
          aria-label={motionEnabled ? 'Turn motion off' : 'Turn motion on'}
          aria-pressed={motionEnabled}
        >
          {motionEnabled ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="motion-status-icon">
              {/* Dynamic 3D Gyro / Kinetic orbit icon */}
              <circle cx="12" cy="12" r="9" />
              <path d="M3.6 9h16.8" />
              <path d="M3.6 15h16.8" />
              <path d="M12 3a14 14 0 0 1 0 18" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="motion-status-icon static">
              {/* Static / Paused slash icon */}
              <circle cx="12" cy="12" r="9" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          )}
          <span className="motion-label-text">{motionEnabled ? 'Motion on' : 'Motion off'}</span>
          <span className={`motion-indicator-pip ${motionEnabled ? 'active' : 'inactive'}`} />
        </button>

        {/* Atelier Bag Trigger */}
        <button
          className="bag-pill-btn"
          onClick={() => {
            playSoftClick();
            onOpenCart();
          }}
          title="Open Atelier Shopping Bag"
          aria-label="Open Bag"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span className="bag-label-text">Bag</span>
          {cartCount > 0 && (
            <span className="bag-badge-counter">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
