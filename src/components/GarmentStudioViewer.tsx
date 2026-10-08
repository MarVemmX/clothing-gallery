'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GarmentDesign, ColorVariant, SizeOption } from '../types/clothing';
import { playFabricSwoosh, playLensZoom, playTurntableWhir } from '../utils/audio';

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
  const [isSpinning, setIsSpinning] = useState(false);
  const dragStartXRef = useRef(0);
  const startAngleRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Fabric Loupe Magnifier state
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [loupeData, setLoupeData] = useState({
    x: 0,
    y: 0,
    percentX: 50,
    percentY: 50,
    visible: false
  });
  const stageRef = useRef<HTMLDivElement>(null);

  const [displayFace, setDisplayFace] = useState<'front' | 'back'>(viewAngle);
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync turnAngle and displayFace when viewAngle prop changes (e.g. from buttons)
  useEffect(() => {
    if (isDragging || isSpinning) return;

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
      flipTimerRef.current = setTimeout(() => {
        setDisplayFace('back');
      }, 200);
    } else {
      setTurnAngle(0);
      flipTimerRef.current = setTimeout(() => {
        setDisplayFace('front');
      }, 200);
    }

    return () => {
      if (flipTimerRef.current) {
        clearTimeout(flipTimerRef.current);
      }
    };
  }, [viewAngle, isDragging, isSpinning, motionEnabled]);

  // Pointer drag to turn 360 degrees
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!motionEnabled || isSpinning || isLoupeActive) return;
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
    // Loupe tracking
    if (isLoupeActive && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));
        setLoupeData({ x, y, percentX, percentY, visible: true });
      } else {
        setLoupeData(prev => ({ ...prev, visible: false }));
      }
      return;
    }

    // 3D drag rotation
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }
    const nextAngle = startAngleRef.current + deltaX * 0.55;
    const normalized = Math.max(-180, Math.min(180, nextAngle));
    setTurnAngle(normalized);
    setDisplayFace(Math.abs(normalized) >= 90 ? 'back' : 'front');
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isLoupeActive) {
      setLoupeData(prev => ({ ...prev, visible: false }));
      return;
    }

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

  // 360° Automatic Turntable Spin
  const handleAutoSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsLoupeActive(false);
    playTurntableWhir();

    const start = turnAngle;
    const target = start + 360;
    const duration = 1200;
    const startTime = performance.now();

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic ease-in-out
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const current = start + (target - start) * ease;
      const normalizedAngle = ((current + 180) % 360) - 180;
      setTurnAngle(current % 360);
      setDisplayFace(Math.abs(normalizedAngle) >= 90 ? 'back' : 'front');

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setTurnAngle(0);
        setDisplayFace('front');
        setViewAngle('front');
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animateSpin);
  }, [turnAngle, isSpinning, setViewAngle]);

  // Toggle Fabric Loupe
  const handleToggleLoupe = () => {
    playLensZoom();
    setIsLoupeActive(prev => !prev);
    setLoupeData(prev => ({ ...prev, visible: false }));
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
        ref={stageRef}
        className={`studio-turntable-stage ${isLoupeActive ? 'loupe-mode-active' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => setLoupeData(prev => ({ ...prev, visible: false }))}
        title={isLoupeActive ? "Hover over garment to inspect weave in 2.2× optical zoom" : "Click & drag horizontally to turn 360°"}
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

        {/* High-Definition Optical Fabric Loupe */}
        {isLoupeActive && loupeData.visible && (
          <div
            className="studio-fabric-loupe"
            style={{
              left: `${loupeData.x}px`,
              top: `${loupeData.y}px`,
              backgroundImage: `url(${activeSrc})`,
              backgroundPosition: `${loupeData.percentX}% ${loupeData.percentY}%`,
              filter: fabricFilter
            }}
            aria-hidden="true"
          >
            <div className="loupe-reticle" />
            <span className="loupe-badge">2.2× WEAVE</span>
          </div>
        )}
      </div>

      {/* Quick Visual Controls under the Garment */}
      <div className="studio-view-toggle-bar">
        <div className="studio-toggle-group">
          {/* Front View */}
          <button
            type="button"
            className={`studio-angle-btn ${viewAngle === 'front' && !isLoupeActive ? 'active' : ''}`}
            onClick={() => {
              playFabricSwoosh();
              setViewAngle('front');
              setTurnAngle(0);
              setIsLoupeActive(false);
            }}
            aria-pressed={viewAngle === 'front' && !isLoupeActive}
            title="Front silhouette view"
          >
            <span className="angle-btn-dot" />
            <span>Front</span>
          </button>

          {/* Back View */}
          <button
            type="button"
            className={`studio-angle-btn ${viewAngle === 'back' && !isLoupeActive ? 'active' : ''}`}
            onClick={() => {
              playFabricSwoosh();
              setViewAngle('back');
              setTurnAngle(180);
              setIsLoupeActive(false);
            }}
            aria-pressed={viewAngle === 'back' && !isLoupeActive}
            title="Back silhouette view"
          >
            <span className="angle-btn-dot" />
            <span>Back</span>
          </button>

          {/* 360° Auto Spin Button */}
          <button
            type="button"
            className={`studio-angle-btn ${isSpinning ? 'spinning-active' : ''}`}
            onClick={handleAutoSpin}
            disabled={isSpinning}
            title="Automatic 360° carousel rotation"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={isSpinning ? "animate-spin-fast" : ""}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>360° Spin</span>
          </button>

          {/* Fabric Weave Loupe / Magnifier */}
          <button
            type="button"
            className={`studio-angle-btn ${isLoupeActive ? 'active loupe-button' : ''}`}
            onClick={handleToggleLoupe}
            title="Inspect fabric weave and embroidery in 2.2× optical zoom"
            aria-pressed={isLoupeActive}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>{isLoupeActive ? 'Exit Lens' : 'Weave Zoom'}</span>
          </button>
        </div>

        <div className="studio-drag-hint">
          {isLoupeActive ? (
            <span>Move cursor over garment to magnify threads</span>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9l6 6-6 6M10 15L4 9l6-6" />
              </svg>
              <span>Drag horizontally to rotate</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
