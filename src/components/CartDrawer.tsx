'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { CartItem } from '../types/clothing';
import { playSoftClick } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout
}: CartDrawerProps) {
  // Close on Escape key
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

  const totalRaw = items.reduce((acc, it) => acc + (it.priceRaw || 0) * (it.quantity || 1), 0);
  const formattedTotal = '₦' + (totalRaw || 0).toLocaleString();
  const totalItemCount = items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  return (
    <div className="cart-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Atelier Bag">
      <div 
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-title-group">
            <h2 className="cart-heading font-serif">
              Atelier Bag
            </h2>
            <span className="cart-badge-count">
              {totalItemCount} {totalItemCount === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playSoftClick();
              onClose();
            }}
            className="cart-close-btn"
            aria-label="Close cart drawer"
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="cart-items-container">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <p className="cart-empty-title font-serif">Your Atelier Bag is Empty</p>
              <p className="cart-empty-desc">
                Select your preferred cut from our showroom rail, choose your colorway and size, and add to bag.
              </p>
            </div>
          ) : (
            items.map((item, idx) => {
              const thumbSrc = item.color?.thumbImg || '/suits/01_tuxedo_front.png';
              const colorName = item.color?.name || (typeof item.color === 'string' ? item.color : 'Selected Color');
              const colorHex = item.color?.hex || (typeof item.color === 'string' ? item.color : '#1a1a1a');
              const fabricFilter = item.color?.filter || 'none';
              const sizeLabel = item.size?.label ? item.size.label.toUpperCase() : 'M';

              return (
                <div 
                  key={`${item.cartItemId || 'cart-item'}-${idx}`}
                  className="cart-item-card"
                >
                  {/* Garment Thumbnail */}
                  <div className="cart-item-thumb">
                    <Image
                      src={thumbSrc}
                      alt={item.title || 'Garment'}
                      fill
                      sizes="70px"
                      className="cart-thumb-img"
                      style={{ filter: fabricFilter }}
                    />
                  </div>

                  {/* Garment Details */}
                  <div className="cart-item-info">
                    <div>
                      <div className="cart-item-top">
                        <h4 className="cart-item-title font-serif truncate">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            playSoftClick();
                            onRemoveItem(item.cartItemId);
                          }}
                          className="cart-item-remove-btn"
                          title="Remove piece from bag"
                          aria-label={`Remove ${item.title}`}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="cart-item-meta">
                        <span className="cart-color-indicator">
                          <span 
                            className="cart-color-dot" 
                            style={{ backgroundColor: colorHex }}
                          />
                          <span className="truncate">{colorName}</span>
                        </span>
                        <span>·</span>
                        <span className="cart-size-label">
                          Size: {sizeLabel}
                        </span>
                      </div>
                    </div>

                    {/* Price & Quantity */}
                    <div className="cart-item-bottom">
                      <span className="cart-item-price font-serif">
                        {item.priceNaira}
                      </span>

                      <div className="cart-qty-ctrl">
                        <button
                          type="button"
                          onClick={() => {
                            playSoftClick();
                            onUpdateQuantity(item.cartItemId, (item.quantity || 1) - 1);
                          }}
                          className="qty-btn"
                          title="Decrease quantity"
                          aria-label="Decrease quantity"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="qty-val">{item.quantity || 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            playSoftClick();
                            onUpdateQuantity(item.cartItemId, (item.quantity || 1) + 1);
                          }}
                          className="qty-btn"
                          title="Increase quantity"
                          aria-label="Increase quantity"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Checkout */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal-row">
              <span className="cart-subtotal-label">Atelier Subtotal</span>
              <span className="cart-subtotal-val font-serif">{formattedTotal}</span>
            </div>

            <p className="cart-footer-note">
              Includes bespoke fitting consultation and hand-tailoring at the Lagos Atelier.
            </p>

            <button
              type="button"
              onClick={() => {
                playSoftClick();
                onProceedCheckout();
              }}
              className="cart-checkout-btn"
            >
              <span>Confirm Bespoke Order</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
