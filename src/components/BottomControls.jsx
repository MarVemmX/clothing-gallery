'use client';

import React from 'react';
import { playRailClink } from '../utils/audio';

export default function BottomControls({
  visibleGarments = [],
  allGarments = [],
  nextWear,
  activeGarment,
  onSelectPiece,
  onSlideNext,
  onSlidePrev,
  hoveredGarment,
  selectedGarment,
  onSelectGarment
}) {
  const currentPiece = selectedGarment || hoveredGarment || activeGarment || visibleGarments[0];
  const fullIndex = allGarments.findIndex(g => g.id === currentPiece?.id);
  const displayIndex = currentPiece ? currentPiece.code : String(Math.max(0, fullIndex) + 1).padStart(2, '0');
  const totalCount = String(allGarments.length).padStart(2, '0');

  const handleDotClick = (garment) => {
    playRailClink();
    if (onSelectPiece) onSelectPiece(garment);
    if (selectedGarment && onSelectGarment) {
      onSelectGarment(garment);
    }
  };

  const handlePrev = () => {
    playRailClink();
    if (onSlidePrev) onSlidePrev();
  };

  const handleNext = () => {
    playRailClink();
    if (onSlideNext) onSlideNext();
  };

  return (
    <footer className="bottom-controls-bar">
      {/* Left: 01 —— 09 (5 on rack) */}
      <div className="collection-counter">
        <span className="counter-current">{displayIndex}</span>
        <span className="counter-dash" />
        <span className="counter-total">{totalCount}</span>
        <span className="counter-rack-badge" title="Exactly 5 pieces on the showroom rail at a time">
          5 on rack
        </span>
      </div>

      {/* Center: Dynamic Title + Subtitle + Color Pagination Dots for all 9 garments */}
      <div className="center-control-group">
        {selectedGarment ? (
          <>
            <div className="status-piece-title">{selectedGarment.title}</div>
            <div className="status-piece-sub">
              {selectedGarment.priceNaira} · Individual Bespoke Silhouette ({selectedGarment.colorName})
            </div>
          </>
        ) : hoveredGarment ? (
          <>
            <div className="status-piece-title">{hoveredGarment.title}</div>
            <div className="status-piece-sub">
              {hoveredGarment.priceNaira} · Click to inspect individual silhouette
            </div>
          </>
        ) : (
          <>
            <div className="status-piece-title">{activeGarment?.title || 'The collection'}</div>
            <div className="status-piece-sub">
              {activeGarment ? `${activeGarment.priceNaira} · ${activeGarment.colorName}` : '5 Curated Silhouettes on Showroom Rail'}
            </div>
          </>
        )}

        {/* Color Swatch Pagination Dots */}
        <nav className="color-dots-nav" aria-label="Senator color swatches">
          {allGarments.map((garment) => {
            const isSelected = currentPiece?.id === garment.id;
            const isOnRack = visibleGarments.some(g => g.id === garment.id);

            return (
              <button
                key={garment.id}
                className={`swatch-dot-button ${isSelected ? 'active' : ''} ${isOnRack ? 'on-rack' : 'in-vault'}`}
                onClick={() => handleDotClick(garment)}
                title={`${garment.code}. ${garment.title} (${garment.colorName})${isOnRack ? ' · On Rack' : ' · In Vault'}`}
                aria-label={`Select ${garment.title}`}
              >
                <span 
                  className="swatch-dot-fill" 
                  style={{ backgroundColor: garment.dotColor }} 
                />
              </button>
            );
          })}

          {/* Luxury Next Wear Button */}
          {nextWear && (
            <button
              className="swatch-more-btn"
              onClick={handleNext}
              title={`Slide next piece (${nextWear.code}. ${nextWear.title}) onto the rail`}
              aria-label={`Slide next piece ${nextWear.title}`}
            >
              <span className="swatch-more-icon">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
              <span className="swatch-more-label">
                Next: {nextWear.code}
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Right: < and > navigation arrows */}
      <div className="nav-arrows-group">
        <button 
          className="circle-nav-btn"
          onClick={handlePrev}
          title="Slide rail backward"
          aria-label="Slide rail backward"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button 
          className="circle-nav-btn"
          onClick={handleNext}
          title={`Slide rail forward (+${nextWear?.code})`}
          aria-label="Slide rail forward"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </footer>
  );
}
