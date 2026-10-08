'use client';

import React, { useState, useEffect } from 'react';
import { playSoftClick } from '../utils/audio';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryLabel?: string;
  onOpenCommission?: () => void;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  categoryLabel = 'Atelier Garment',
  onOpenCommission
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Measurements in Inches and Centimeters
  const sizeData = [
    {
      size: 'S',
      label: 'Small',
      in: { chest: '36–38"', shoulder: '17.5"', sleeve: '24.5"', tunicLen: '39"', waist: '30–32"', outseam: '40"' },
      cm: { chest: '91–96 cm', shoulder: '44.5 cm', sleeve: '62 cm', tunicLen: '99 cm', waist: '76–81 cm', outseam: '102 cm' }
    },
    {
      size: 'M',
      label: 'Medium (Standard)',
      in: { chest: '39–41"', shoulder: '18.5"', sleeve: '25.5"', tunicLen: '41"', waist: '33–35"', outseam: '41"' },
      cm: { chest: '99–104 cm', shoulder: '47 cm', sleeve: '65 cm', tunicLen: '104 cm', waist: '84–89 cm', outseam: '104 cm' }
    },
    {
      size: 'L',
      label: 'Large',
      in: { chest: '42–44"', shoulder: '19.5"', sleeve: '26.0"', tunicLen: '42.5"', waist: '36–38"', outseam: '42"' },
      cm: { chest: '107–112 cm', shoulder: '49.5 cm', sleeve: '66 cm', tunicLen: '108 cm', waist: '91–97 cm', outseam: '107 cm' }
    },
    {
      size: 'XL',
      label: 'Extra Large',
      in: { chest: '45–47"', shoulder: '20.5"', sleeve: '26.5"', tunicLen: '43.5"', waist: '39–41"', outseam: '42.5"' },
      cm: { chest: '114–119 cm', shoulder: '52 cm', sleeve: '67.5 cm', tunicLen: '110 cm', waist: '99–104 cm', outseam: '108 cm' }
    },
    {
      size: 'XXL',
      label: 'Double Extra Large',
      in: { chest: '48–51"', shoulder: '21.5"', sleeve: '27.0"', tunicLen: '44.5"', waist: '42–45"', outseam: '43"' },
      cm: { chest: '122–130 cm', shoulder: '54.5 cm', sleeve: '68.5 cm', tunicLen: '113 cm', waist: '107–114 cm', outseam: '109 cm' }
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Size Guide">
      <div className="size-guide-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="size-guide-header">
          <div>
            <div className="size-guide-badge">Bespoke Atelier Sizing</div>
            <h3 className="size-guide-title font-serif">Measurement & Fit Guide</h3>
            <p className="size-guide-subtitle">
              Precision sizing matrix tailored for {categoryLabel} cuts
            </p>
          </div>

          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={() => {
              playSoftClick();
              onClose();
            }}
            aria-label="Close size guide"
          >
            ✕
          </button>
        </div>

        {/* Unit Selector Toggle */}
        <div className="size-guide-unit-bar">
          <span className="unit-label">Display Measurements:</span>
          <div className="unit-toggle-group">
            <button
              type="button"
              className={`unit-toggle-btn ${unit === 'in' ? 'active' : ''}`}
              onClick={() => {
                playSoftClick();
                setUnit('in');
              }}
            >
              Inches (in)
            </button>
            <button
              type="button"
              className={`unit-toggle-btn ${unit === 'cm' ? 'active' : ''}`}
              onClick={() => {
                playSoftClick();
                setUnit('cm');
              }}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="size-guide-table-scroll">
          <table className="size-guide-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Shoulder</th>
                <th>Sleeve</th>
                <th>Length</th>
                <th>Waist</th>
                <th>Outseam</th>
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row) => {
                const values = unit === 'in' ? row.in : row.cm;
                return (
                  <tr key={row.size}>
                    <td className="size-cell">
                      <span className="size-tag">{row.size}</span>
                      <span className="size-sub">{row.label}</span>
                    </td>
                    <td>{values.chest}</td>
                    <td>{values.shoulder}</td>
                    <td>{values.sleeve}</td>
                    <td>{values.tunicLen}</td>
                    <td>{values.waist}</td>
                    <td>{values.outseam}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Atelier Fitting Notes */}
        <div className="size-guide-fit-notes">
          <div className="fit-note-item">
            <span className="fit-note-icon">📐</span>
            <div>
              <strong>Monarch Drape Allowance:</strong> Traditional Senators are tailored with a refined 2-inch comfort allowance around the chest for a fluid sovereign posture.
            </div>
          </div>
          <div className="fit-note-item">
            <span className="fit-note-icon">✂️</span>
            <div>
              <strong>Between sizes?</strong> We recommend sizing up for a relaxed regal silhouette, or commissioning a bespoke custom fit with our master tailors.
            </div>
          </div>
        </div>

        {/* Custom Measurement CTA */}
        {onOpenCommission && (
          <div className="size-guide-footer-cta">
            <span className="cta-note">Have non-standard proportions?</span>
            <button
              type="button"
              className="size-guide-commission-btn"
              onClick={() => {
                playSoftClick();
                onClose();
                onOpenCommission();
              }}
            >
              <span>Provide Custom Body Measurements</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
