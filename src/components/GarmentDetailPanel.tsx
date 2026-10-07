'use client';

import React from 'react';
import { GarmentDesign, ColorVariant, SizeOption } from '../types/clothing';
import { SIZES } from '../data/clothing';
import { playSoftClick, playFabricSwoosh } from '../utils/audio';

interface GarmentDetailPanelProps {
  garment: GarmentDesign;
  activeColorVariant: ColorVariant;
  onSelectColorVariant: (variant: ColorVariant) => void;
  currentSize: SizeOption;
  onSelectSize: (size: SizeOption) => void;
  viewAngle: 'front' | 'back';
  setViewAngle: (angle: 'front' | 'back') => void;
  onAddToCart: () => void;
  onOpenCommission: () => void;
  onBackToRail?: () => void;
}

export default function GarmentDetailPanel({
  garment,
  activeColorVariant,
  onSelectColorVariant,
  currentSize,
  onSelectSize,
  viewAngle,
  setViewAngle,
  onAddToCart,
  onOpenCommission,
  onBackToRail
}: GarmentDetailPanelProps) {
  if (!garment) return null;

  const currentVariant = (activeColorVariant && garment.colorVariants.some(v => v.id === activeColorVariant.id))
    ? activeColorVariant
    : (garment.colorVariants.find(v => v.id === garment.defaultColorId) || garment.colorVariants[0]);

  return (
    <aside 
      className="detail-info-panel" 
      key={garment.id}
    >
      {/* Back to rail breadcrumb link */}
      {onBackToRail && (
        <button
          className="panel-back-crumb-btn"
          onClick={onBackToRail}
          title="Return to browsing the showroom rail"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Return to Showroom Rail</span>
        </button>
      )}

      {/* Category & Series Tag */}
      <div className="panel-tag-row">
        <span className="panel-category-badge">{garment.categoryLabel}</span>
        <span className="panel-tag-separator">·</span>
        <span className="panel-series-tag">{garment.series}</span>
      </div>

      {/* Garment Title & Subtitle */}
      <h2 className="panel-title">{garment.title}</h2>
      <p className="panel-subtitle">{garment.subtitle}</p>

      {/* Price */}
      <div className="panel-price">{garment.priceNaira}</div>

      {/* Front / Back Toggle with Drag Hint */}
      <div className="view-switch-row">
        <button
          type="button"
          className={`view-btn ${viewAngle === 'front' ? 'active' : ''}`}
          onClick={() => {
            playFabricSwoosh();
            setViewAngle('front');
          }}
          aria-pressed={viewAngle === 'front'}
        >
          Front View
        </button>
        <button
          type="button"
          className={`view-btn ${viewAngle === 'back' ? 'active' : ''}`}
          onClick={() => {
            playFabricSwoosh();
            setViewAngle('back');
          }}
          aria-pressed={viewAngle === 'back'}
        >
          Back View
        </button>
        <span className="view-hint">Drag outfit to turn 360°</span>
      </div>

      {/* Color Selection FOR THIS SPECIFIC DESIGN */}
      <div className="detail-section-block">
        <div className="detail-section-header">
          <span className="detail-section-title">Colorway</span>
          <span className="detail-section-value">{currentVariant?.name}</span>
        </div>

        <div className="color-swatches-list">
          {garment.colorVariants.map((variant) => {
            const isSelected = currentVariant?.id === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => {
                  playSoftClick();
                  onSelectColorVariant(variant);
                }}
                className={`color-swatch-item ${isSelected ? 'active' : ''}`}
                title={`Select ${variant.name}`}
              >
                <span
                  className="color-swatch-bullet"
                  style={{ backgroundColor: variant.dotColor }}
                />
                <span className="color-swatch-label">{variant.name}</span>
                {isSelected && (
                  <span className="color-swatch-check">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Stock & Availability Status */}
        <div className="color-status-note">
          <span className="status-pill-green">● {currentVariant?.status || 'Ready to Tailor'}</span>
          {currentVariant?.stockSlots && (
            <span className="status-slots-text">{currentVariant.stockSlots} atelier slots remaining</span>
          )}
        </div>
      </div>

      {/* Size Selector Box Row */}
      <div className="detail-section-block">
        <div className="detail-section-header">
          <span className="detail-section-title">Atelier Size</span>
          <span className="detail-section-value">Chest {currentSize.chest} · Length {currentSize.length}</span>
        </div>

        <div className="size-selector-row">
          {SIZES.map((size) => {
            const isActive = currentSize.key === size.key;
            return (
              <button
                key={size.key}
                className={`size-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  playSoftClick();
                  onSelectSize(size);
                }}
                title={`Chest ${size.chest} · Length ${size.length}`}
              >
                {size.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="panel-actions-wrapper">
        <button
          className="cta-add-to-bag"
          onClick={() => {
            playSoftClick();
            onAddToCart();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span>Add to Atelier Bag</span>
          <span className="cta-price-hint">({garment.priceNaira})</span>
        </button>

        <button
          className="cta-bespoke-outline"
          onClick={() => {
            playSoftClick();
            onOpenCommission();
          }}
        >
          <span>Commission Custom Measurement</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      {/* Specifications Checklist */}
      <div className="panel-specs-box">
        <div className="spec-row">
          <span className="spec-label">Fabric:</span>
          <span className="spec-val">{garment.fabric}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Cut:</span>
          <span className="spec-val">{garment.cut}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Collar / Lapel:</span>
          <span className="spec-val">{garment.lapelOrCollar}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Lead Time:</span>
          <span className="spec-val">{garment.leadTime}</span>
        </div>
      </div>

      <p className="panel-order-info">
        Visual size preview. Orders are hand-tailored at the Lagos Atelier. Final sizes, availability and price are confirmed with your personal stylist.
      </p>
    </aside>
  );
}
