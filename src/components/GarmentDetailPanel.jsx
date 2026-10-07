'use client';

import React from 'react';
import { SIZES } from '../data/senators';
import { playSoftClick, playFabricSwoosh } from '../utils/audio';

export default function GarmentDetailPanel({
  garment,
  currentSize,
  setCurrentSize,
  viewAngle,
  setViewAngle,
  onOpenCommission
}) {
  if (!garment) return null;

  return (
    <aside className="detail-info-panel" key={garment.id}>
      {/* Series Tag */}
      <span className="panel-series">{garment.series}</span>

      {/* Garment Title */}
      <h2 className="panel-title">{garment.title}</h2>

      {/* Price */}
      <div className="panel-price">{garment.priceNaira}</div>

      {/* Front / Back Toggle with Drag Hint */}
      <div className="view-switch-row">
        <button
          className={`view-btn ${viewAngle === 'front' ? 'active' : ''}`}
          onClick={() => {
            playFabricSwoosh();
            setViewAngle('front');
          }}
        >
          Front
        </button>
        <button
          className={`view-btn ${viewAngle === 'back' ? 'active' : ''}`}
          onClick={() => {
            playFabricSwoosh();
            setViewAngle('back');
          }}
        >
          Back
        </button>
        <span className="view-hint">Drag the outfit to turn</span>
      </div>

      {/* Color Swatch & Stock Availability */}
      <div className="color-status-row">
        <div className="color-indicator">
          <span 
            className="color-dot-small" 
            style={{ backgroundColor: garment.dotColor }}
          />
          <span>{garment.colorName}</span>
        </div>
        <span className="stock-status">{garment.stockInfo}</span>
      </div>

      {/* Size Selector Box Row */}
      <div className="size-selector-row">
        {SIZES.map((size) => {
          const isActive = (currentSize?.key || currentSize?.id) === (size.key || size.id);
          return (
            <button
              key={size.key}
              className={`size-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                playSoftClick();
                setCurrentSize(size);
              }}
              title={`Chest ${size.chest} · Tunic Length ${size.length}`}
            >
              {size.label}
            </button>
          );
        })}
      </div>

      {/* Primary Action Button */}
      <button 
        className="cta-button"
        onClick={() => {
          playSoftClick();
          onOpenCommission(garment);
        }}
      >
        <span>Commission at Atelier</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>

      {/* Editorial Disclaimers & Tailoring Notes */}
      <p className="panel-disclaimer">
        Visual size preview · proportions are illustrative.
      </p>
      <p className="panel-order-info">
        Orders are tailored at the Lagos Atelier. Final sizes, availability and price are confirmed with your personal stylist.
      </p>
    </aside>
  );
}
