'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GarmentDesign, ColorVariant, SizeOption } from '../types/clothing';
import { playSoftClick } from '../utils/audio';

interface RealLifeModelCardProps {
  garment: GarmentDesign;
  activeColorVariant: ColorVariant;
  currentSize: SizeOption;
}

export default function RealLifeModelCard({
  garment,
  activeColorVariant,
  currentSize
}: RealLifeModelCardProps) {
  const [isExpandedModal, setIsExpandedModal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const modelVariant = (activeColorVariant && garment.colorVariants.some(v => v.id === activeColorVariant.id))
    ? activeColorVariant
    : (garment.colorVariants.find(v => v.id === garment.defaultColorId) || garment.colorVariants[0]);

  const modelImageSrc = modelVariant?.modelImg || garment.colorVariants[0]?.modelImg;
  const caption = modelVariant?.modelCaption || `Editorial Model wearing ${garment.title} (${currentSize.label.toUpperCase()})`;

  return (
    <>
      {/* Floating Corner Model Dock */}
      <aside 
        className={`model-card-dock ${isMinimized ? 'is-minimized' : ''}`}
        aria-label="Real life dress model preview"
      >
        {isMinimized ? (
          <button
            onClick={() => {
              playSoftClick();
              setIsMinimized(false);
            }}
            className="model-pill-minimized"
            title="Expand Real-Life Runway Model"
          >
            <span className="live-dot-ping">
              <span className="live-dot-wave" />
              <span className="live-dot-solid" />
            </span>
            <span className="model-pill-text">Real Deal Model</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        ) : (
          <div className="model-preview-card">
            {/* Header Tag Bar */}
            <div className="model-card-header">
              <div className="model-card-tag">
                <span className="live-dot-ping">
                  <span className="live-dot-wave" />
                  <span className="live-dot-solid" />
                </span>
                <span className="model-tag-label">Real Life Model</span>
              </div>
              <div className="model-card-controls">
                {/* Minimize Button */}
                <button
                  onClick={() => {
                    playSoftClick();
                    setIsMinimized(true);
                  }}
                  className="model-ctrl-btn"
                  title="Minimize model badge"
                  aria-label="Minimize model preview"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                {/* Fullscreen Expand Button */}
                <button
                  onClick={() => {
                    playSoftClick();
                    setIsExpandedModal(true);
                  }}
                  className="model-ctrl-btn"
                  title="View full-size runway photograph"
                  aria-label="Expand photo"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Model Photograph Preview */}
            <div 
              className="model-img-wrapper"
              onClick={() => {
                playSoftClick();
                setIsExpandedModal(true);
              }}
              title="Click to view full editorial resolution"
            >
              <Image
                src={modelImageSrc}
                alt={`${garment.title} worn by real-life model`}
                fill
                sizes="(max-width: 640px) 140px, 185px"
                className="model-photo"
                priority
              />
              <div className="model-img-vignette" />

              {/* Hover overlay hint */}
              <div className="model-hover-overlay">
                <span className="model-inspect-badge">Inspect Fit ↗</span>
              </div>

              {/* Color variant label badge inside bottom of image */}
              <div className="model-bottom-color-pill">
                <span className="model-color-name">{activeColorVariant?.name || 'Standard Cut'}</span>
                <span 
                  className="model-color-bullet"
                  style={{ backgroundColor: activeColorVariant?.dotColor || '#151515' }}
                />
              </div>
            </div>

            {/* Micro Caption */}
            <div className="model-card-caption">
              <span className="model-caption-size">Size: {currentSize.label.toUpperCase()}</span>
              <span className="model-caption-fit">100% Real Fit</span>
            </div>
          </div>
        )}
      </aside>

      {/* Full-Screen Runway Lightbox Modal */}
      {isExpandedModal && (
        <div 
          className="modal-backdrop"
          onClick={() => {
            playSoftClick();
            setIsExpandedModal(false);
          }}
        >
          <div 
            className="model-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                playSoftClick();
                setIsExpandedModal(false);
              }}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* High-Res Photo Container */}
            <div className="lightbox-photo-pane">
              <Image
                src={modelImageSrc}
                alt={`${garment.title} runway editorial`}
                fill
                sizes="(max-width: 768px) 100vw, 65vw"
                className="lightbox-photo"
                priority
              />
              <div className="lightbox-tag-pill">Atelier Runway Photography</div>
            </div>

            {/* Editorial Fit Details Sidebar */}
            <div className="lightbox-info-pane">
              <div>
                <span className="panel-category-badge">
                  {garment.categoryLabel}
                </span>
                <h3 className="lightbox-title">
                  {garment.title}
                </h3>
                <p className="lightbox-subtitle">
                  {garment.subtitle}
                </p>

                <div className="lightbox-details-list">
                  <div className="lightbox-detail-item">
                    <span className="detail-item-label">Active Colorway</span>
                    <div className="detail-color-preview">
                      <span 
                        className="color-swatch-bullet"
                        style={{ backgroundColor: activeColorVariant?.dotColor }}
                      />
                      <span className="detail-color-name">{activeColorVariant?.name}</span>
                    </div>
                  </div>

                  <div className="lightbox-detail-item">
                    <span className="detail-item-label">Model Specification</span>
                    <p className="detail-item-desc">{caption}</p>
                  </div>

                  <div className="lightbox-detail-item">
                    <span className="detail-item-label">Tailoring Cut</span>
                    <p className="detail-item-desc">{garment.cut} · {garment.lapelOrCollar}</p>
                  </div>

                  <div className="lightbox-detail-item">
                    <span className="detail-item-label">Textile</span>
                    <p className="detail-item-desc">{garment.fabric}</p>
                  </div>
                </div>
              </div>

              <div className="lightbox-footer">
                <div className="lightbox-price-row">
                  <span className="lightbox-price-label">Atelier Value</span>
                  <span className="lightbox-price-value">{garment.priceNaira}</span>
                </div>
                <button
                  onClick={() => setIsExpandedModal(false)}
                  className="modal-submit-btn"
                >
                  Return to Showroom Rail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
