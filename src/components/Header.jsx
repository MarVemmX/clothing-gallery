'use client';

import React from 'react';
import { playSoftClick } from '../utils/audio';

export default function Header({ 
  motionEnabled, 
  setMotionEnabled, 
  soundOn, 
  setSoundOn,
  onResetView 
}) {
  return (
    <header className="top-nav">
      <div className="nav-left">
        <a 
          href="#" 
          className="brand-logo" 
          onClick={(e) => { 
            e.preventDefault(); 
            playSoftClick(); 
            onResetView(); 
          }}
          title="Return to full rail"
        >
          <span>àrèwà</span>
          <span className="dot" />
        </a>
      </div>

      <nav className="nav-links">
        <a 
          href="#" 
          className="nav-link active" 
          onClick={(e) => { 
            e.preventDefault(); 
            playSoftClick(); 
            onResetView(); 
          }}
        >
          The collection <span style={{ opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>07</span>
        </a>
        <a 
          href="#store" 
          className="nav-link secondary" 
          onClick={(e) => { 
            e.preventDefault(); 
            playSoftClick(); 
          }}
        >
          Official store
        </a>
      </nav>

      <div className="nav-actions">
        {/* Sound toggle */}
        <button 
          className="icon-sound" 
          onClick={() => {
            playSoftClick();
            setSoundOn(!soundOn);
          }}
          title={soundOn ? "Mute audio cues" : "Unmute audio cues"}
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

        {/* II Motion on / Motion off */}
        <button 
          className={`pill-toggle ${motionEnabled ? 'active' : ''}`}
          onClick={() => {
            playSoftClick();
            setMotionEnabled(!motionEnabled);
          }}
        >
          <span>II</span>
          <span>{motionEnabled ? 'Motion on' : 'Motion off'}</span>
        </button>
      </div>
    </header>
  );
}
