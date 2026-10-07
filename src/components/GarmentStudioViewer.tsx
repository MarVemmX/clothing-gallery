'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { GarmentDesign, ColorVariant, SizeOption } from '../types/clothing';
import { playFabricSwoosh } from '../utils/audio';

interface GarmentStudioViewerProps {
  garment: GarmentDesign;
  activeColorVariant?: ColorVariant;
  currentSize: SizeOption;
  viewAngle: 'front' | 'back';
  setViewAngle: (angle: 'front' | 'back') => void;
  motionEnabled: boolean;
}

export default function GarmentStudioViewer({
  garment,
  activeColorVariant,
  currentSize,
  viewAngle,
  setViewAngle,
  motionEnabled
}: GarmentStudioViewerProps) {
  const [turnAngle, setTurnAngle] = useState(viewAngle === 'back' ? 180 : 0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const startAngleRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const [displayFace, setDisplayFace] = useState<'front' | 'back'>(viewAngle);
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync turnAngle and displayFace when viewAngle prop changes (e.g. from buttons)
  useEffect(() => {
    if (isDragging) return;

    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
      flipTimerRef.current = null;
    }

    if (!motionEnabled) {
      setTurnAngle(0);
      setDisplayFace(viewAngle);
      return;
    }

    if (viewAngle === 'back') {
      setTurnAngle(180);
      // Switch image at the midpoint (200ms) when card is edge-on at 90°
      flipTimerRef.current = setTimeout(() => {
        setDisplayFace('back');
      }, 200);
    } else {
      setTurnAngle(0);
      // Switch image at the midpoint (200ms) when card is edge-on at 90°
      flipTimerRef.current = setTimeout(() => {
        setDisplayFace('front');
      }, 200);
    }

    return () => {
      if (flipTimerRef.current) {
        clearTimeout(flipTimerRef.current);
      }
    };
  }, [viewAngle, isDragging, motionEnabled]);

  // Pointer drag to turn 360 degrees
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!motionEnabled) return;
    e.preventDefault();
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    startAngleRef.current = turnAngle;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }
    const nextAngle = startAngleRef.current + deltaX * 0.55;
    // Normalize between -180 and 180 for intuitive rotation
    const normalized = Math.max(-180, Math.min(180, nextAngle));
    setTurnAngle(normalized);
    setDisplayFace(Math.abs(normalized) >= 90 ? 'back' : 'front');
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    playFabricSwoosh();
    // Snap to nearest face (Front 0° or Back 180°)
    if (Math.abs(turnAngle) > 90) {
      setTurnAngle(180);
      setDisplayFace('back');
      setViewAngle('back');
    } else {
      setTurnAngle(0);
      setDisplayFace('front');
      setViewAngle('front');
    }
  };

  // Resolve active variant & images
  const inspectedVariant = (activeColorVariant && garment.colorVariants.some(v => v.id === activeColorVariant.id))
    ? activeColorVariant
    : (garment.colorVariants.find(v => v.id === garment.defaultColorId) || garment.colorVariants[0]);

  const frontSrc = inspectedVariant?.frontImg || garment.colorVariants[0]?.frontImg || '';
  const backSrc = inspectedVariant?.backImg || garment.colorVariants[0]?.backImg || '';
  const fabricFilter = inspectedVariant?.filter || 'none';

  const isBack = isDragging 
    ? Math.abs(turnAngle) >= 90 
    : displayFace === 'back';

  const activeSrc = isBack ? backSrc : frontSrc;
  const activeAlt = isBack ? `${garment.title} Back View` : `${garment.title} Front View`;
  const faceTransform = (isBack && motionEnabled) ? 'scaleX(-1)' : 'none';

  return (
    <div className="studio-viewer-container" aria-label={`${garment.title} 360° garment viewer`}>
      {/* 3D Turntable Stage */}
      <div
        className="studio-turntable-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Click & drag horizontally to turn 360°"
      >
        {/* Boutique Wall Mount Rail Rack Fixture - directly behind & under the hanger hook throat */}
        <div className="studio-hanger-fixture" aria-hidden="true">
          <div className="fixture-bracket left-bracket" />
          <div className="fixture-rod-center" />
          <div className="fixture-bracket right-bracket" />
        </div>

        <div
          className="studio-scaler-wrapper"
          style={{
            transform: `scale(${currentSize?.scale || 1.0})`,
            transformOrigin: '50% 28px'
          }}
        >
          <div
            className={`studio-3d-card ${isDragging ? 'is-dragging' : ''}`}
            style={{
              transform: motionEnabled ? `rotateY(${turnAngle}deg)` : 'none'
            }}
          >
            <div 
              className={`studio-card-face ${isBack ? 'face-back' : 'face-front'}`}
              style={{
                transform: faceTransform
              }}
            >
              <Image
                src={activeSrc}
                alt={activeAlt}
                width={360}
                height={430}
                priority
                className="studio-garment-image"
                style={{
                  filter: fabricFilter,
                  transition: 'filter 0.35s ease'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Visual Controls under the Garment */}
      <div className="studio-view-toggle-bar">
        <div className="studio-toggle-group">
          <button
            type="button"
            className={`studio-angle-btn ${viewAngle === 'front' ? 'active' : ''}`}
            onClick={() => {
              playFabricSwoosh();
              setViewAngle('front');
              setTurnAngle(0);
            }}
            aria-pressed={viewAngle === 'front'}
          >
            <span className="angle-btn-dot" />
            <span>Front View</span>
          </button>

          <button
            type="button"
            className={`studio-angle-btn ${viewAngle === 'back' ? 'active' : ''}`}
            onClick={() => {
              playFabricSwoosh();
              setViewAngle('back');
              setTurnAngle(180);
            }}
            aria-pressed={viewAngle === 'back'}
          >
            <span className="angle-btn-dot" />
            <span>Back View</span>
          </button>
        </div>

        <div className="studio-drag-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>Drag outfit to turn 360°</span>
        </div>
      </div>
    </div>
  );
}
