'use client';

import React from 'react';
import { playRailClink } from '../utils/audio';

export default function BottomControls({
  garments,
  currentIndex,
  setCurrentIndex,
  hoveredGarment,
  selectedGarment,
  onSelectGarment
}) {
  const activeGarment = selectedGarment || hoveredGarment || garments[currentIndex];
  const activeIndex = selectedGarment 
    ? garments.findIndex(g => g.id === selectedGarment.id)
    : (hoveredGarment ? garments.findIndex(g => g.id === hoveredGarment.id) : currentIndex);

  const displayIndex = String(activeIndex + 1).padStart(2, '0');
  const totalCount = String(garments.length).padStart(2, '0');

  // Next / Prev actions bounded to 01..07 (No infinite scroll)
  const handlePrev = () => {
    if (activeIndex > 0) {
      const nextIdx = activeIndex - 1;
      playRailClink();
      setCurrentIndex(nextIdx);
      if (selectedGarment) {
        onSelectGarment(garments[nextIdx]);
      }
    }
  };

  const handleNext = () => {
    if (activeIndex < garments.length - 1) {
      const nextIdx = activeIndex + 1;
      playRailClink();
      setCurrentIndex(nextIdx);
      if (selectedGarment) {
        onSelectGarment(garments[nextIdx]);
      }
    }
  };

  const handleDotClick = (garment, idx) => {
    playRailClink();
    setCurrentIndex(idx);
    if (selectedGarment) {
      onSelectGarment(garment);
    }
  };

  return (
    <footer className="bottom-controls-bar">
      {/* Left: 01 —— 07 */}
      <div className="collection-counter">
        <span className="counter-current">{displayIndex}</span>
        <span className="counter-dash" />
        <span className="counter-total">{totalCount}</span>
      </div>

      {/* Center: Dynamic Title + Subtitle + Color Pagination Dots */}
      <div className="center-control-group">
        {selectedGarment ? (
          <>
            <div className="status-piece-title">{selectedGarment.title}</div>
            <div className="status-piece-sub">
              {selectedGarment.priceNaira} · Individual Bespoke Silhouette
            </div>
          </>
        ) : hoveredGarment ? (
          <>
            <div className="status-piece-title">{hoveredGarment.title}</div>
            <div className="status-piece-sub">
              {hoveredGarment.priceNaira} · Click to open individual page
            </div>
          </>
        ) : (
          <>
            <div className="status-piece-title">The collection</div>
            <div className="status-piece-sub">Hover to inspect front · Click to view individual page</div>
          </>
        )}

        {/* 7 Color Swatch Pagination Dots */}
        <nav className="color-dots-nav" aria-label="Senator color swatches">
          {garments.map((garment, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={garment.id}
                className={`swatch-dot-button ${isSelected ? 'active' : ''}`}
                onClick={() => handleDotClick(garment, idx)}
                title={`${garment.title} (${garment.colorName})`}
                aria-label={`Select ${garment.title}`}
              >
                <span 
                  className="swatch-dot-fill" 
                  style={{ backgroundColor: garment.dotColor }} 
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: < and > navigation arrows (Bounded 01 to 07) */}
      <div className="nav-arrows-group">
        <button 
          className="circle-nav-btn"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          title="Previous garment"
          aria-label="Previous garment"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button 
          className="circle-nav-btn"
          onClick={handleNext}
          disabled={activeIndex === garments.length - 1}
          title="Next garment"
          aria-label="Next garment"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </footer>
  );
}
