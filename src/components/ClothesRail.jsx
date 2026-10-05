'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { playRailClink, playFabricSwoosh } from '../utils/audio';

export default function ClothesRail({
  garments,
  currentIndex,
  setCurrentIndex,
  hoveredIndex,
  setHoveredIndex,
  selectedGarment,
  setSelectedGarment,
  motionEnabled,
  currentSize,
  viewAngle,
  setViewAngle
}) {
  const railContainerRef = useRef(null);
  const viewportRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive card spacing
  // Responsive card spacing: 160px desktop, 130px mobile
  const getCardSpacing = useCallback(() => {
    if (typeof window === 'undefined') return 160;
    return window.innerWidth <= 768 ? 130 : 160;
  }, []);

  const [cardSpacing, setCardSpacing] = useState(160);

  // Center offset calculator: centers the 7 clothes in the middle of the rack
  const getCenterOffset = useCallback((spacing = cardSpacing) => {
    if (!viewportRef.current) return 0;
    const viewportW = viewportRef.current.clientWidth;
    const totalTrackW = garments.length * spacing;
    return viewportW > totalTrackW ? (viewportW - totalTrackW) / 2 : 0;
  }, [garments.length, cardSpacing]);

  // Track scroll boundaries (Centered when fitting, bounded when overflowing)
  const getMinMaxScroll = useCallback(() => {
    if (!viewportRef.current) return { minScroll: 0, maxScroll: 0 };
    const viewportW = viewportRef.current.clientWidth;
    const totalTrackW = garments.length * cardSpacing;
    if (viewportW >= totalTrackW) {
      const center = (viewportW - totalTrackW) / 2;
      return { minScroll: center, maxScroll: center };
    } else {
      const minScroll = viewportW - totalTrackW - 20;
      return { minScroll, maxScroll: 0 };
    }
  }, [garments.length, cardSpacing]);

  // Rail Horizontal Scroll State (Centered by default)
  const [scrollX, setScrollX] = useState(0);
  const currentScrollXRef = useRef(0);
  const targetScrollXRef = useRef(0);

  // Resize and Initial Centering Effect
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      const spacing = mobile ? 130 : 160;
      setCardSpacing(spacing);

      if (viewportRef.current) {
        const viewportW = viewportRef.current.clientWidth;
        const totalTrackW = garments.length * spacing;
        if (viewportW >= totalTrackW) {
          // Perfectly center the 7 clothes in the middle of the rail
          const center = (viewportW - totalTrackW) / 2;
          targetScrollXRef.current = center;
          currentScrollXRef.current = center;
          setScrollX(center);
        } else {
          // On mobile / smaller screens, center the active garment
          const targetPos = -(currentIndexRef.current * spacing) + (viewportW / 2 - spacing / 2);
          const minScroll = viewportW - totalTrackW - 20;
          const clamped = Math.max(minScroll, Math.min(0, targetPos));
          targetScrollXRef.current = clamped;
          currentScrollXRef.current = clamped;
          setScrollX(clamped);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [garments.length]);

  // Per-Garment 3D Rotation & Easing State
  // Active garment starts at 0deg (front), others at resting angle -36deg (~40% towards front)
  const cardAnglesRef = useRef(garments.map((_, i) => (i === currentIndex ? 0 : -36)));
  const targetAnglesRef = useRef(garments.map((_, i) => (i === currentIndex ? 0 : -36)));
  const hoverProgressRef = useRef(garments.map((_, i) => (i === currentIndex ? 1 : 0)));
  const targetHoverProgressRef = useRef(garments.map((_, i) => (i === currentIndex ? 1 : 0)));

  const [visualStates, setVisualStates] = useState(
    garments.map((_, i) => ({
      angle: i === currentIndex ? 0 : -36,
      progress: i === currentIndex ? 1 : 0
    }))
  );

  // Drag tracking without swallow click
  const isDraggingRailRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastDragXRef = useRef(0);

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // 3D Garment Turn drag state (Detail view)
  const [turnAngle, setTurnAngle] = useState(0);
  const [isTurningGarment, setIsTurningGarment] = useState(false);
  const isTurningRef = useRef(false);
  const turnStartXRef = useRef(0);
  const startAngleRef = useRef(0);

  // Sync turnAngle when viewAngle is switched via buttons
  useEffect(() => {
    if (viewAngle === 'front') {
      setTurnAngle(0);
    } else {
      setTurnAngle(180);
    }
  }, [viewAngle]);

  // Clamp scroll inside valid boundaries
  const clampScroll = useCallback((val) => {
    const { minScroll, maxScroll } = getMinMaxScroll();
    return Math.max(minScroll, Math.min(maxScroll, val));
  }, [getMinMaxScroll]);

  // Sync external index changes (e.g. from forward > and backward < buttons, keyboard, or color swatches)
  // SPINS NEW ACTIVE CLOTHE TO THE FRONT (0deg) and eases previous clothes back to resting angle (-36deg)!
  useEffect(() => {
    if (selectedGarment) return;

    // Spin active piece to front, ease others back to resting angle
    for (let i = 0; i < garments.length; i++) {
      if (i === currentIndex) {
        targetAnglesRef.current[i] = 0;
        targetHoverProgressRef.current[i] = 1;
      } else if (i !== hoveredIndex) {
        targetAnglesRef.current[i] = -36;
        targetHoverProgressRef.current[i] = 0;
      }
    }

    if (!isDraggingRailRef.current) {
      if (!viewportRef.current) return;
      const viewportW = viewportRef.current.clientWidth;
      const totalTrackW = garments.length * cardSpacing;

      // When all clothes fit on screen, keep them centered in the middle
      if (totalTrackW <= viewportW) {
        const center = (viewportW - totalTrackW) / 2;
        targetScrollXRef.current = center;
        return;
      }

      // Otherwise center the target garment in viewport
      const targetPos = -(currentIndex * cardSpacing) + (viewportW / 2 - cardSpacing / 2);
      const minScroll = viewportW - totalTrackW - 20;
      targetScrollXRef.current = Math.max(minScroll, Math.min(0, targetPos));
    }
  }, [currentIndex, selectedGarment, cardSpacing, garments.length, hoveredIndex]);

  // 60FPS Smooth Lerp Animation Loop
  // Handles rail scroll AND per-garment ease-in / ease-out 3D turning!
  useEffect(() => {
    let animId;
    const animate = () => {
      // 1. Smooth scroll lerp
      const scrollDiff = targetScrollXRef.current - currentScrollXRef.current;
      if (Math.abs(scrollDiff) > 0.05) {
        currentScrollXRef.current += scrollDiff * 0.12;
        setScrollX(currentScrollXRef.current);

        if (viewportRef.current) {
          const viewportW = viewportRef.current.clientWidth;
          const totalTrackW = garments.length * cardSpacing;

          // Only compute active index from scroll when rail actually overflows and scrolls
          if (totalTrackW > viewportW) {
            const offset = -currentScrollXRef.current;
            const rawIndex = Math.round(offset / cardSpacing);
            const activeIdx = Math.max(0, Math.min(garments.length - 1, rawIndex));

            if (activeIdx !== currentIndexRef.current) {
              currentIndexRef.current = activeIdx;
              setCurrentIndex(activeIdx);
              playRailClink();
            }
          }
        }
      }

      // 2. Smooth per-garment 3D ease-in / ease-out physics
      let statesChanged = false;
      for (let i = 0; i < garments.length; i++) {
        // Continuous organic lerp for rotation angle
        const angleDiff = targetAnglesRef.current[i] - cardAnglesRef.current[i];
        if (Math.abs(angleDiff) > 0.04) {
          // Velvet smooth ease-in / ease-out factor (0.08)
          cardAnglesRef.current[i] += angleDiff * 0.08;
          statesChanged = true;
        }

        // Smooth elevation & scale progress (0 to 1)
        const progDiff = targetHoverProgressRef.current[i] - hoverProgressRef.current[i];
        if (Math.abs(progDiff) > 0.004) {
          hoverProgressRef.current[i] += progDiff * 0.08;
          statesChanged = true;
        }
      }

      if (statesChanged) {
        setVisualStates(
          garments.map((_, i) => ({
            angle: cardAnglesRef.current[i],
            progress: hoverProgressRef.current[i]
          }))
        );
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [cardSpacing, garments, setCurrentIndex]);

  // Gentle Mouse Wheel Scroll while Hovering over the Rail
  useEffect(() => {
    const el = railContainerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (selectedGarment) return;
      e.preventDefault();

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const step = delta * 0.6;
      targetScrollXRef.current = clampScroll(targetScrollXRef.current - step);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [selectedGarment, clampScroll]);

  // Pointer Down on Rail Viewport
  const handlePointerDownRail = (e) => {
    if (selectedGarment) return;
    isDraggingRailRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    lastDragXRef.current = e.clientX;
  };

  // Pointer Move on Rail Viewport
  const handlePointerMoveRail = (e) => {
    if (!isDraggingRailRef.current || selectedGarment) return;
    const deltaX = e.clientX - lastDragXRef.current;
    lastDragXRef.current = e.clientX;

    const dist = Math.hypot(
      e.clientX - dragStartRef.current.x,
      e.clientY - dragStartRef.current.y
    );

    if (dist > 5) {
      hasMovedRef.current = true;
      targetScrollXRef.current = clampScroll(targetScrollXRef.current + deltaX);
    }
  };

  // Pointer Up on Rail Viewport
  const handlePointerUpRail = () => {
    if (!isDraggingRailRef.current) return;
    isDraggingRailRef.current = false;
  };

  // Direct Garment Click to open individual page
  const handleCardClick = (garment, index) => {
    if (hasMovedRef.current) return;

    playFabricSwoosh();
    setSelectedGarment(garment);
    setCurrentIndex(index);
    setViewAngle('front');
    setTurnAngle(0);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('piece', garment.id);
      window.history.pushState({ piece: garment.id }, '', url.toString());
    }
  };

  // =========================================================================
  // CARD INTERACTION: Smooth Ease-in/out & Mouse Back-and-Forth Scrubbing
  // =========================================================================
  const handleCardPointerEnter = (e, idx) => {
    setHoveredIndex(idx);
    playRailClink();
    targetHoverProgressRef.current[idx] = 1;
    // On hover, gently eases in to Front (0deg)
    targetAnglesRef.current[idx] = 0;
  };

  const handleCardPointerMove = (e, idx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // normX: 0.0 (left edge) to 1.0 (right edge)
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    // Dynamic back-to-front rotation driven by mouse movement back and forth:
    // Moving mouse left (normX < 0.5) turns towards BACK (180deg)
    // Moving mouse right (normX >= 0.5) turns towards FRONT (0deg)
    if (normX >= 0.5) {
      targetAnglesRef.current[idx] = (normX - 0.5) * 30; // 0° to +15°
    } else {
      const backT = (0.5 - normX) / 0.5; // 0 to 1
      targetAnglesRef.current[idx] = backT * 180; // 0° to 180°
    }
  };

  const handleCardPointerLeave = (e, idx) => {
    setHoveredIndex(null);
    if (idx === currentIndex) {
      // The active piece stays facing front
      targetHoverProgressRef.current[idx] = 1;
      targetAnglesRef.current[idx] = 0;
    } else {
      // Non-active piece eases out nicely back to resting angle (-36deg)
      targetHoverProgressRef.current[idx] = 0;
      targetAnglesRef.current[idx] = -36;
    }
  };

  // Controlled 3D Drag to Turn on Individual Item Page (Clamped -180 to +180 deg)
  const handlePointerDownTurn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isTurningRef.current = true;
    setIsTurningGarment(true);
    turnStartXRef.current = e.clientX;
    startAngleRef.current = turnAngle;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMoveTurn = (e) => {
    if (!isTurningRef.current) return;
    const deltaX = e.clientX - turnStartXRef.current;
    const targetAngle = Math.max(-180, Math.min(180, startAngleRef.current + deltaX * 0.45));
    setTurnAngle(targetAngle);
  };

  const handlePointerUpTurn = (e) => {
    if (!isTurningRef.current) return;
    isTurningRef.current = false;
    setIsTurningGarment(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (Math.abs(turnAngle) > 90) {
      setTurnAngle(180);
      setViewAngle('back');
      playFabricSwoosh();
    } else {
      setTurnAngle(0);
      setViewAngle('front');
      playFabricSwoosh();
    }
  };

  return (
    <div 
      className="clothes-rail-wrapper"
      ref={railContainerRef}
    >
      {/* ========================================================
          RAIL MODE (HOMEPAGE):
          - Clothes hung angled (40% turned towards front, ~36° angle)
          - Mouse back & forth movements over pieces rotates back to front (0° to 180°)
          - Eases in nicely and eases out nicely (60FPS organic lerp)
          - Clicking opens individual item page
          ======================================================== */}
      <div 
        ref={viewportRef}
        className="rail-viewport"
        style={{
          opacity: selectedGarment ? 0 : 1,
          pointerEvents: selectedGarment ? 'none' : 'auto',
          transition: 'opacity 0.4s ease'
        }}
        onPointerDown={handlePointerDownRail}
        onPointerMove={handlePointerMoveRail}
        onPointerUp={handlePointerUpRail}
        onPointerCancel={handlePointerUpRail}
      >
        <div 
          className="rail-track"
          style={{
            transform: `translateX(${scrollX}px)`
          }}
        >
          {garments.map((garment, idx) => {
            const isHovered = hoveredIndex === idx;
            const isCurrent = currentIndex === idx;
            const state = visualStates[idx] || { angle: -36, progress: 0 };
            const scale = 0.96 + state.progress * 0.11;
            const translateY = state.progress * -8;

            return (
              <div 
                key={garment.id}
                className={`garment-card ${isCurrent ? 'active-selected' : ''} ${isHovered ? 'hovered' : ''}`}
                style={{
                  width: `${cardSpacing}px`,
                  flex: `0 0 ${cardSpacing}px`,
                  zIndex: isHovered ? 50 : 15
                }}
                onPointerEnter={(e) => handleCardPointerEnter(e, idx)}
                onPointerMove={(e) => handleCardPointerMove(e, idx)}
                onPointerLeave={(e) => handleCardPointerLeave(e, idx)}
                onClick={() => handleCardClick(garment, idx)}
                onPointerUp={() => {
                  if (!hasMovedRef.current) {
                    handleCardClick(garment, idx);
                  }
                }}
                title={`Click to view ${garment.title}`}
              >
                <div 
                  className="garment-visual-wrapper"
                  style={{
                    transform: `perspective(1000px) rotateY(${state.angle}deg) translateY(${translateY}px) scale(${scale})`
                  }}
                >
                  {/* Front Face (Visible at 0deg) */}
                  <div className="card-face face-front">
                    <Image 
                      src={garment.frontImg}
                      alt={`${garment.title} Front View`}
                      width={260}
                      height={isMobile ? 260 : 350}
                      priority={idx < 4}
                      className="garment-img"
                      style={{
                        height: isMobile ? '260px' : '350px',
                        width: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Back Face (Visible at 180deg) */}
                  <div className="card-face face-back">
                    <Image 
                      src={garment.backImg}
                      alt={`${garment.title} Back View`}
                      width={260}
                      height={isMobile ? 260 : 350}
                      priority={idx < 4}
                      className="garment-img"
                      style={{
                        height: isMobile ? '260px' : '350px',
                        width: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          INDIVIDUAL ITEM PAGE (DETAIL INSPECTION MODE):
          - Clothe is COMPLETELY FACING FRONT (rotateY: 0deg)
          - Hanger hook sits directly on the metallic rail rod
          - Front / Back inspection & physical size adjustment
          ======================================================== */}
      {selectedGarment && (
        <div 
          className="detail-garment-stage"
          onPointerDown={handlePointerDownTurn}
          onPointerMove={handlePointerMoveTurn}
          onPointerUp={handlePointerUpTurn}
          onPointerCancel={handlePointerUpTurn}
        >
          {/* Dynamic Physical Size Scaler with top-center origin */}
          <div 
            className="scaled-silhouette-wrapper"
            style={{
              transform: `scale(${currentSize.scale})`,
              transformOrigin: 'top center'
            }}
          >
            {/* 3D Rotatable Garment (Completely Front by default) */}
            <div 
              className={`turnable-card-3d ${isTurningGarment ? 'dragging' : ''}`}
              style={{
                transform: `rotateY(${turnAngle}deg)`
              }}
              title="Drag horizontally to turn the Senator attire"
            >
              {/* Front Face (Completely facing front at 0deg) */}
              <div className="card-face face-front">
                <Image 
                  src={selectedGarment.frontImg} 
                  alt={`${selectedGarment.title} Front View`}
                  width={340}
                  height={isMobile ? 290 : 410}
                  priority
                  className="garment-img"
                  style={{
                    height: isMobile ? '290px' : '410px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Back Face */}
              <div className="card-face face-back">
                <Image 
                  src={selectedGarment.backImg} 
                  alt={`${selectedGarment.title} Back View`}
                  width={340}
                  height={isMobile ? 290 : 410}
                  priority
                  className="garment-img"
                  style={{
                    height: isMobile ? '290px' : '410px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
