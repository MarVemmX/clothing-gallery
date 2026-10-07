'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GarmentDesign, SizeOption, ColorVariant } from '../types/clothing';
import { playSoftClick } from '../utils/audio';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  garment: GarmentDesign | null;
  selectedSize: SizeOption;
  activeColorVariant?: ColorVariant;
}

export default function CommissionModal({
  isOpen,
  onClose,
  garment,
  selectedSize,
  activeColorVariant
}: CommissionModalProps) {
  const [bespokeMode, setBespokeMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Lagos',
    chest: '',
    sleeve: '',
    length: '',
    waist: ''
  });

  if (!isOpen || !garment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSoftClick();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  const modalVariant = (activeColorVariant && garment.colorVariants.some(v => v.id === activeColorVariant.id))
    ? activeColorVariant
    : (garment.colorVariants.find(v => v.id === garment.defaultColorId) || garment.colorVariants[0]);

  const thumbImg = modalVariant?.frontImg || garment.colorVariants[0]?.frontImg || '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: '42px', marginBottom: '16px' }}>👑</div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '10px' }}>
              Commission Confirmed
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              Your order for the <strong>{garment.title}</strong> in {activeColorVariant?.name || 'Selected Colorway'} (Size {selectedSize.label.toUpperCase()}) has been registered at our Lagos Atelier. Our bespoke master tailor will reach out on WhatsApp to verify measurements.
            </p>
            <button className="modal-submit-btn" onClick={handleReset}>
              Return to Collection
            </button>
          </div>
        ) : (
          <>
            <h3 className="modal-title font-serif">Commission Bespoke Fit</h3>
            <p className="modal-subtitle">
              Hand-tailored {garment.categoryLabel} · Lagos High Fashion Atelier
            </p>

            {/* Garment summary badge */}
            <div className="modal-garment-summary">
              <div className="modal-garment-thumb" style={{ position: 'relative' }}>
                <Image 
                  src={thumbImg} 
                  alt={garment.title} 
                  fill 
                  sizes="60px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{garment.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {modalVariant?.name} · Size: <strong>{selectedSize.label.toUpperCase()}</strong>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {garment.priceNaira}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-field-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Chief / Dr / Mr"
                    className="form-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+234 800 000 0000"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Delivery Location</label>
                <select 
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="Lagos">Lagos (Ikoyi / Victoria Island / Lekki / Mainland)</option>
                  <option value="Abuja">Abuja (Maitama / Asokoro / Central Area)</option>
                  <option value="Port Harcourt">Port Harcourt (GRA / Old GRA)</option>
                  <option value="Kano">Kano / Kaduna / Northern Hubs</option>
                  <option value="Enugu">Enugu / Owerri / South East Hubs</option>
                  <option value="International">International Express DHL (UK / US / Canada / Europe)</option>
                </select>
              </div>

              {/* Bespoke measurement toggle */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={bespokeMode} 
                    onChange={(e) => setBespokeMode(e.target.checked)}
                  />
                  <span>Provide exact custom body measurements now (optional)</span>
                </label>
              </div>

              {bespokeMode && (
                <div className="modal-field-grid" style={{ marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Chest (inches)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 42" 
                      className="form-input"
                      value={formData.chest}
                      onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sleeve Length (inches)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 26" 
                      className="form-input"
                      value={formData.sleeve}
                      onChange={(e) => setFormData({ ...formData, sleeve: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Garment Length (inches)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 41" 
                      className="form-input"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trouser Waist (inches)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 34" 
                      className="form-input"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="modal-submit-btn">
                Confirm Bespoke Commission · {garment.priceNaira}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
