'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { playRailClink, playFabricSwoosh } from '../utils/audio';

export default function ClothesRail({
  garments,
  allGarments = [],
  nextWear,
  firstWear,
  slideDirection = null,
  onSlideNext,
  onSlidePrev,
  activeGarmentId,
  setActiveGarmentId,
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

  // Responsive card spacing: 220px desktop (generous luxury spacing), 155px mobile
  const getCardSpacing = useCallback(() => {
    if (typeof window === 'undefined') return 220;
    return window.innerWidth <= 768 ? 155 : 220;
  }, []);

  const [cardSpacing, setCardSpacing] = useState(220);

  // Total items on rail: 5 garments + 1 plus circle = 6 items
  const totalTrackItems = garments.length + 1;

  // Center offset calculator: centers items in the middle of the rack when fitting
  const getCenterOffset = useCallback((spacing = cardSpacing) => {
    if (!viewportRef.current) return 0;
    const viewportW = viewportRef.current.clientWidth;
    const totalTrackW = totalTrackItems * spacing;
    return viewportW > totalTrackW ? (viewportW - totalTrackW) / 2 : 0;
  }, [totalTrackItems, cardSpacing]);

  // Track scroll boundaries (Centered when fitting, bounded when overflowing)
  const getMinMaxScroll = useCallback(() => {
    if (!viewportRef.current) return { minScroll: 0, maxScroll: 0 };
    const viewportW = viewportRef.current.clientWidth;
    const totalTrackW = totalTrackItems * cardSpacing;
    if (viewportW >= totalTrackW) {
      const center = (viewportW - totalTrackW) / 2;
      return { minScroll: center, maxScroll: center };
    } else {
      const minScroll = viewportW - totalTrackW - 20;
      return { minScroll, maxScroll: 0 };
    }
  }, [totalTrackItems, cardSpacing]);

  // Rail Horizontal Scroll State (Centered by default)
  const [scrollX, setScrollX] = useState(0);
  const currentScrollXRef = useRef(0);
  const targetScrollXRef = useRef(0);

  // Resize and Initial Centering Effect
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      const spacing = mobile ? 155 : 220;
      setCardSpacing(spacing);

      if (viewportRef.current) {
        const viewportW = viewportRef.current.clientWidth;
        const totalTrackW = totalTrackItems * spacing;
        if (viewportW >= totalTrackW) {
          // Perfectly center the 5 clothes in the middle of the rail
          const center = (viewportW - totalTrackW) / 2;
          targetScrollXRef.current = center;
          currentScrollXRef.current = center;
          setScrollX(center);
        } else {
          // On mobile / smaller screens, center the active garment
          const activeIdx = Math.max(0, garments.findIndex(g => g.id === activeGarmentId));
          const targetPos = -(activeIdx * spacing) + (viewportW / 2 - spacing / 2);
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
  }, [totalTrackItems, garments, activeGarmentId]);

  // Per-Garment 3D Rotation & Easing State
  const activeWinIdx = Math.max(0, garments.findIndex(g => g.id === activeGarmentId));
  const cardAnglesRef = useRef(garments.map((_, i) => (i === activeWinIdx ? 0 : -36)));
  const targetAnglesRef = useRef(garments.map((_, i) => (i === activeWinIdx ? 0 : -36)));
  const hoverProgressRef = useRef(garments.map((_, i) => (i === activeWinIdx ? 1 : 0)));
  const targetHoverProgressRef = useRef(garments.map((_, i) => (i === activeWinIdx ? 1 : 0)));

  const [visualStates, setVisualStates] = useState(
    garments.map((_, i) => ({
      angle: i === activeWinIdx ? 0 : -36,
      progress: i === activeWinIdx ? 1 : 0
    }))
  );

  // Keep internal physics arrays synchronized with the 5 visible garments
  useEffect(() => {
    while (cardAnglesRef.current.length < garments.length) {
      const idx = cardAnglesRef.current.length;
      cardAnglesRef.current.push(idx === activeWinIdx ? 0 : -36);
      targetAnglesRef.current.push(idx === activeWinIdx ? 0 : -36);
      hoverProgressRef.current.push(idx === activeWinIdx ? 1 : 0);
      targetHoverProgressRef.current.push(idx === activeWinIdx ? 1 : 0);
    }
    if (cardAnglesRef.current.length > garments.length) {
      cardAnglesRef.current = cardAnglesRef.current.slice(0, garments.length);
      targetAnglesRef.current = targetAnglesRef.current.slice(0, garments.length);
      hoverProgressRef.current = hoverProgressRef.current.slice(0, garments.length);
      targetHoverProgressRef.current = targetHoverProgressRef.current.slice(0, garments.length);
    }
    setVisualStates(
      garments.map((_, i) => ({
        angle: cardAnglesRef.current[i] ?? (i === activeWinIdx ? 0 : -36),
        progress: hoverProgressRef.current[i] ?? (i === activeWinIdx ? 1 : 0)
      }))
    );
  }, [garments, activeWinIdx]);

  // Drag tracking without swallow click
  const isDraggingRailRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastDragXRef = useRef(0);

  const activeWinIdxRef = useRef(activeWinIdx);
  activeWinIdxRef.current = activeWinIdx;

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

  // Sync active garment rotation (faces 0deg front, others rest at -36deg)
  useEffect(() => {
    if (selectedGarment) return;
    const activeIdx = Math.max(0, garments.findIndex(g => g.id === activeGarmentId));

    // Spin active piece to front, ease others back to resting angle
    for (let i = 0; i < garments.length; i++) {
      if (i === activeIdx) {
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
      const totalTrackW = totalTrackItems * cardSpacing;

      // When all 5 clothes fit on screen, keep them centered in the middle
      if (totalTrackW <= viewportW) {
        const center = (viewportW - totalTrackW) / 2;
        targetScrollXRef.current = center;
        return;
      }

      // Otherwise center the target garment in viewport
      const targetPos = -(activeIdx * cardSpacing) + (viewportW / 2 - cardSpacing / 2);
      const minScroll = viewportW - totalTrackW - 20;
      targetScrollXRef.current = Math.max(minScroll, Math.min(0, targetPos));
    }
  }, [activeGarmentId, selectedGarment, cardSpacing, garments, totalTrackItems, hoveredIndex]);

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
          const totalTrackW = totalTrackItems * cardSpacing;

          // Only compute active index from scroll when rail actually overflows and scrolls
          if (totalTrackW > viewportW) {
            const offset = -currentScrollXRef.current;
            const rawIndex = Math.round(offset / cardSpacing);
            const activeIdx = Math.max(0, Math.min(garments.length - 1, rawIndex));

            if (activeIdx !== activeWinIdxRef.current) {
              activeWinIdxRef.current = activeIdx;
              if (garments[activeIdx] && setActiveGarmentId) {
                setActiveGarmentId(garments[activeIdx].id);
                playRailClink();
              }
            }
          }
        }
      }

      // 2. Smooth per-garment 3D ease-in / ease-out physics
      let statesChanged = false;
      for (let i = 0; i < garments.length; i++) {
        if (cardAnglesRef.current[i] === undefined) {
          cardAnglesRef.current[i] = i === activeWinIdxRef.current ? 0 : -36;
          targetAnglesRef.current[i] = i === activeWinIdxRef.current ? 0 : -36;
          hoverProgressRef.current[i] = i === activeWinIdxRef.current ? 1 : 0;
          targetHoverProgressRef.current[i] = i === activeWinIdxRef.current ? 1 : 0;
        }

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
            angle: cardAnglesRef.current[i] ?? (i === activeWinIdxRef.current ? 0 : -36),
            progress: hoverProgressRef.current[i] ?? (i === activeWinIdxRef.current ? 1 : 0)
          }))
        );
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [cardSpacing, garments, totalTrackItems, setActiveGarmentId]);

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
    if (setActiveGarmentId) setActiveGarmentId(garment.id);
    if (setSelectedGarment) setSelectedGarment(garment);
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
    const isThisActive = garments[idx]?.id === activeGarmentId;
    if (isThisActive) {
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
          className={`rail-track ${slideDirection === 'fade' ? 'is-fading-switch' : ''}`}
          style={{
            transform: `translateX(${scrollX}px)`,
            '--card-spacing': `${cardSpacing}px`
          }}
        >
          {(() => {
            // Build items array to render, handling smooth slide transitions
            let renderedCards = [];
            if (slideDirection === 'next' && garments.length > 0) {
              // 1st garment smoothly transitions out to the left
              renderedCards.push({
                garment: garments[0],
                animClass: 'cloth-slide-out-left',
                keySuffix: '-exit',
                isExiting: true,
                originalIdx: 0
              });
              // Garments 1..4 smoothly shift left
              for (let i = 1; i < garments.length; i++) {
                renderedCards.push({
                  garment: garments[i],
                  animClass: 'cloth-shift-left',
                  keySuffix: '',
                  originalIdx: i
                });
              }
              // Incoming garment smoothly eases in from the right
              if (nextWear) {
                renderedCards.push({
                  garment: nextWear,
                  animClass: 'cloth-slide-in-right',
                  keySuffix: '-enter',
                  isEntering: true,
                  originalIdx: 5
                });
              }
            } else if (slideDirection === 'prev' && garments.length > 0) {
              // Preceding wear enters from the left
              const cur0Idx = allGarments.findIndex(g => g.id === garments[0].id);
              const prevWear = cur0Idx !== -1 ? allGarments[(cur0Idx - 1 + allGarments.length) % allGarments.length] : null;
              if (prevWear) {
                renderedCards.push({
                  garment: prevWear,
                  animClass: 'cloth-slide-in-left',
                  keySuffix: '-enter',
                  isEntering: true,
                  originalIdx: -1
                });
              }
              for (let i = 0; i < garments.length - 1; i++) {
                renderedCards.push({
                  garment: garments[i],
                  animClass: 'cloth-shift-right',
                  keySuffix: '',
                  originalIdx: i
                });
              }
              renderedCards.push({
                garment: garments[garments.length - 1],
                animClass: 'cloth-slide-out-right',
                keySuffix: '-exit',
                isExiting: true,
                originalIdx: garments.length - 1
              });
            } else {
              // Resting state: exactly 5 garments on rack
              garments.forEach((g, i) => {
                renderedCards.push({
                  garment: g,
                  animClass: '',
                  keySuffix: '',
                  originalIdx: i
                });
              });
            }

            return renderedCards.map((item, idx) => {
              const garment = item.garment;
              const isHovered = hoveredIndex === item.originalIdx;
              const isCurrent = garment.id === activeGarmentId;
              const state = item.isEntering 
                ? { angle: 0, progress: 1 } 
                : item.isExiting 
                  ? { angle: -36, progress: 0 } 
                  : (visualStates[item.originalIdx] || { angle: -36, progress: 0 });
              const sizeScale = isCurrent ? (currentSize?.scale || 1.0) : 1.0;
              const scale = (0.96 + state.progress * 0.11) * sizeScale;
              const translateY = state.progress * -8;

              return (
                <div 
                  key={garment.id + item.keySuffix}
                  className={`garment-card ${isCurrent ? 'active-selected' : ''} ${isHovered ? 'hovered' : ''} ${item.animClass}`}
                  style={{
                    width: `${cardSpacing}px`,
                    flex: `0 0 ${cardSpacing}px`,
                    zIndex: isHovered ? 50 : 15
                  }}
                  onPointerEnter={(e) => handleCardPointerEnter(e, item.originalIdx)}
                  onPointerMove={(e) => handleCardPointerMove(e, item.originalIdx)}
                  onPointerLeave={(e) => handleCardPointerLeave(e, item.originalIdx)}
                  onClick={() => handleCardClick(garment, item.originalIdx)}
                  onPointerUp={() => {
                    if (!hasMovedRef.current) {
                      handleCardClick(garment, item.originalIdx);
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
                        priority={idx < 5}
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
                        priority={idx < 5}
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
            });
          })()}

          {/* Minimalist "+" Circle on the Rail with Pulsing Remaining Wears Badge */}
          {allGarments.length > 5 && (
            <div 
              className={`garment-card rack-circle-more-card ${slideDirection === 'next' ? 'cloth-shift-left' : slideDirection === 'prev' ? 'cloth-shift-right' : ''}`}
              style={{
                width: `${cardSpacing}px`,
                flex: `0 0 ${cardSpacing}px`,
                zIndex: 25
              }}
              onClick={() => {
                if (!hasMovedRef.current) {
                  playRailClink();
                  if (onSlideNext) onSlideNext();
                }
              }}
              title={`Click to slide next wear (${nextWear?.code}. ${nextWear?.title}) onto rack`}
            >
              <div className="rack-circle-visual">
                {/* Thin, minimalist chrome hook looping over the steel rail */}
                <div className="rack-circle-hook-wrap">
                  <svg width="24" height="48" viewBox="0 0 24 48" fill="none" className="rack-circle-hook-svg">
                    <path 
                      d="M 12 46 L 12 24 C 12 13 19 13 19 7.5 C 19 3 15.5 1.8 12 1.8 C 8 1.8 5 4 4 7" 
                      stroke="url(#rack-hook-grad)" 
                      strokeWidth="2.4" 
                      strokeLinecap="round" 
                    />
                    <defs>
                      <linearGradient id="rack-hook-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f3f4f6" />
                        <stop offset="50%" stopColor="#9ca3af" />
                        <stop offset="100%" stopColor="#4b5563" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Minimalist Circle Button with Pulsing Number Badge */}
                <div className="rack-circle-btn-container">
                  <div className="rack-circle-btn">
                    {/* Pulsing Count Badge showing number of remaining wears */}
                    <span className="rack-circle-pulsing-badge" aria-label={`+${allGarments.length - garments.length} more wears`}>
                      +{allGarments.length - garments.length}
                    </span>

                    {/* Clean Plus Icon */}
                    <span className="rack-circle-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </span>
                  </div>

                  {/* Informational Popover on Hover */}
                  <div className="rack-circle-hover-card">
                    <div className="hover-card-header">
                      <span className="hover-card-pill">Next Wear</span>
                      <span className="hover-card-title">
                        {nextWear ? `${nextWear.code}. ${nextWear.title}` : 'Slide Next'}
                      </span>
                    </div>

                    <p className="hover-card-desc">
                      {nextWear 
                        ? `${nextWear.colorName} · Nigerian Senator`
                        : 'Slide next silhouette from archive onto rack'}
                    </p>

                    {nextWear && (
                      <div className="hover-card-dots">
                        <span style={{ backgroundColor: nextWear.colorHex, border: '1.5px solid #c5a059' }} title={nextWear.title} />
                      </div>
                    )}

                    <div className="hover-card-action">
                      <span>Click to slide onto rack</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
              transform: `scale(${currentSize?.scale || 1.0})`,
              transformOrigin: 'top center'
            }}
          >
            {/* 3D Rotatable Garment (Completely Front by default) */}
            <div 
              key={selectedGarment.id}
              className={`turnable-card-3d detail-garment-enter ${isTurningGarment ? 'dragging' : ''}`}
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
