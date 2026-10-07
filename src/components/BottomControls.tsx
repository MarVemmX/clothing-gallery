'use client';

import React from 'react';
import { GarmentDesign, ColorVariant } from '../types/clothing';
import { playRailClink } from '../utils/audio';

interface BottomControlsProps {
  visibleGarments: GarmentDesign[];
  allGarments: GarmentDesign[];
  nextWear?: GarmentDesign;
  activeGarment?: GarmentDesign;
  selectedGarment?: GarmentDesign | null;
  hoveredGarment?: GarmentDesign | null;
  activeColorVariant?: ColorVariant;
  viewAngle?: 'front' | 'back';
  onToggleViewAngle?: (angle: 'front' | 'back') => void;
  onSelectGarment: (garment: GarmentDesign) => void;
  onSlideNext: () => void;
  onSlidePrev: () => void;
}

export default function BottomControls({
  visibleGarments = [],
  allGarments = [],
  nextWear,
  activeGarment,
  selectedGarment,
  hoveredGarment,
  activeColorVariant,
  viewAngle = 'front',
  onToggleViewAngle,
  onSelectGarment,
  onSlideNext,
  onSlidePrev
}: BottomControlsProps) {
  const currentPiece = selectedGarment || hoveredGarment || activeGarment || visibleGarments[0];
  const fullIndex = allGarments.findIndex(g => g.id === currentPiece?.id);
  const displayIndex = currentPiece ? currentPiece.code : String(Math.max(0, fullIndex) + 1).padStart(2, '0');
  const totalCount = String(allGarments.length).padStart(2, '0');

  const handleDesignClick = (garment: GarmentDesign) => {
    playRailClink();
    onSelectGarment(garment);
  };

  const handlePrev = () => {
    playRailClink();
    onSlidePrev();
  };

  const handleNext = () => {
    playRailClink();
    onSlideNext();
  };

  return (
    <footer className={`bottom-controls-bar ${selectedGarment ? 'is-detail-mode' : 'is-rail-mode'}`}>
      {/* Left: 01 —— 09 (Archive Index) */}
      <div className="collection-counter">
        <span className="counter-current">{displayIndex}</span>
        <span className="counter-dash" />
        <span className="counter-total">{totalCount}</span>
        <span className="counter-rack-badge" title="Showroom designs count">
          {selectedGarment ? 'Atelier Detail' : `${visibleGarments.length} on rail`}
        </span>
      </div>

      {/* Center: Dynamic Title + Design Switcher */}
      <div className="center-control-group">
        {selectedGarment ? (
          /* DETAIL MODE: Sleek silhouette cycle between designs in the collection */
          <div className="detail-silhouette-cycler">
            <button
              className="silhouette-cycle-btn"
              onClick={handlePrev}
              title="Inspect previous silhouette in archive"
              aria-label="Previous silhouette"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Prev Silhouette</span>
            </button>

            <div className="silhouette-current-badge">
              <span className="silhouette-badge-category">{selectedGarment.categoryLabel}</span>
              <span className="silhouette-badge-title font-serif">{selectedGarment.title}</span>
              <span className="silhouette-badge-price">{selectedGarment.priceNaira}</span>
            </div>

            <button
              className="silhouette-cycle-btn"
              onClick={handleNext}
              title="Inspect next silhouette in archive"
              aria-label="Next silhouette"
            >
              <span>Next Silhouette</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        ) : (
          /* RAIL BROWSING MODE: Distinct design chips showing 01, 02, 03... */
          <>
            <div className="status-piece-title font-serif">
              {hoveredGarment ? hoveredGarment.title : (activeGarment?.title || 'The Collection')}
            </div>
            <div className="status-piece-sub">
              {hoveredGarment 
                ? `${hoveredGarment.priceNaira} · Click to inspect individual silhouette` 
                : activeGarment 
                  ? `${activeGarment.priceNaira} · ${activeGarment.subtitle}` 
                  : 'Showroom Tailored Silhouettes'}
            </div>

            {/* Front / Back Toggle for clothes on the rail */}
            {onToggleViewAngle && (
              <div className="rack-angle-toggle-group" role="group" aria-label="Showroom rack garment orientation">
                <button
                  type="button"
                  className={`rack-angle-btn ${viewAngle === 'front' ? 'active' : ''}`}
                  onClick={() => onToggleViewAngle('front')}
                  title="Front view of clothes on rail"
                  aria-pressed={viewAngle === 'front'}
                >
                  <span className="angle-btn-dot" />
                  <span>Front View</span>
                </button>
                <button
                  type="button"
                  className={`rack-angle-btn ${viewAngle === 'back' ? 'active' : ''}`}
                  onClick={() => onToggleViewAngle('back')}
                  title="Turn clothes on rail to back view"
                  aria-pressed={viewAngle === 'back'}
                >
                  <span className="angle-btn-dot" />
                  <span>Back View</span>
                </button>
              </div>
            )}

            {/* Design Silhouettes Navigation */}
            <nav className="design-chips-nav" aria-label="Garment designs on showroom rail">
              {allGarments.map((garment) => {
                const isSelected = currentPiece?.id === garment.id;
                const isOnRack = visibleGarments.some(g => g.id === garment.id);

                return (
                  <button
                    key={garment.id}
                    className={`design-chip-btn ${isSelected ? 'active' : ''} ${isOnRack ? 'on-rack' : 'in-vault'}`}
                    onClick={() => handleDesignClick(garment)}
                    title={`${garment.code}. ${garment.title} (${garment.categoryLabel})${isOnRack ? ' · On Rail' : ' · In Vault'}`}
                    aria-label={`Select design ${garment.title}`}
                  >
                    <span className="design-chip-num">{garment.code}</span>
                    {isSelected && <span className="design-chip-pip" />}
                  </button>
                );
              })}

              {/* Next Wear Rail Trigger */}
              {nextWear && (
                <button
                  className="swatch-more-btn"
                  onClick={handleNext}
                  title={`Slide next design (${nextWear.code}. ${nextWear.title}) onto the rail`}
                  aria-label={`Slide next piece ${nextWear.title}`}
                >
                  <span className="swatch-more-icon">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                  <span className="swatch-more-label">
                    + Next: {nextWear.code}
                  </span>
                </button>
              )}
            </nav>
          </>
        )}
      </div>

      {/* Right: Quick Slide Navigation Arrows */}
      <div className="nav-arrows-group">
        <button
          className="circle-nav-btn"
          onClick={handlePrev}
          title={selectedGarment ? "Previous silhouette" : "Slide to previous design on rail"}
          aria-label="Previous design"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          className="circle-nav-btn"
          onClick={handleNext}
          title={selectedGarment ? "Next silhouette" : "Slide to next design on rail"}
          aria-label="Next design"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </footer>
  );
}
