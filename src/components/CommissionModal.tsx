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
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div style={{ fontSize: '42px', marginBottom: '14px' }}>👑</div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '10px' }}>
              Commission Confirmed
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '22px' }}>
              Your order for the <strong>{garment.title}</strong> in {modalVariant?.name || 'Selected Colorway'} (Size {selectedSize.label.toUpperCase()}) has been registered at our Lagos Atelier. Our bespoke master tailor is ready to verify your measurements.
            </p>

            <a
              href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                `Hello Arewa Master Tailor,\n\nI have confirmed a bespoke commission for the ${garment.title} (${modalVariant?.name}, Size ${selectedSize.label.toUpperCase()}) on your atelier portal.\n\nClient: ${formData.fullName}\nPhone: ${formData.phone}\nLocation: ${formData.city}${bespokeMode ? `\n\nCustom Measurements:\n• Chest: ${formData.chest || 'Standard'}"\n• Sleeve: ${formData.sleeve || 'Standard'}"\n• Length: ${formData.length || 'Standard'}"\n• Waist: ${formData.waist || 'Standard'}"` : ''}\n\nPlease verify tailoring schedule.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-whatsapp-btn"
              onClick={() => playSoftClick()}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginBottom: '12px' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Chat with Master Tailor on WhatsApp</span>
            </a>

            <button className="modal-submit-btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={handleReset}>
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
