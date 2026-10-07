'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GarmentDesign, ColorVariant, SizeOption } from '../types/clothing';
import { playRailClink, playFabricSwoosh, playRackingCascade } from '../utils/audio';

interface ClothesRailProps {
  garments: GarmentDesign[];
  allGarments: GarmentDesign[];
  nextWear?: GarmentDesign;
  firstWear?: GarmentDesign;
  slideDirection?: 'next' | 'prev' | 'fade' | null;
  onSlideNext?: () => void;
  onSlidePrev?: () => void;
  activeGarmentId: string;
  setActiveGarmentId?: (id: string) => void;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  selectedGarment: GarmentDesign | null;
  setSelectedGarment?: (garment: GarmentDesign | null) => void;
  motionEnabled: boolean;
  currentSize: SizeOption;
  viewAngle: 'front' | 'back';
  setViewAngle: (angle: 'front' | 'back') => void;
  activeColorVariant?: ColorVariant;
  categoryKey?: string;
}

export default function ClothesRail({
  garments,
  allGarments = [],
  nextWear,
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
  setViewAngle,
  activeColorVariant,
  categoryKey
}: ClothesRailProps) {
  const railContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isRackingIn, setIsRackingIn] = useState(true);

  // Responsive card spacing: 220px desktop (luxury boutique spacing), 150px tablet, 120px mobile
  const getCardSpacing = useCallback(() => {
    if (typeof window === 'undefined') return 220;
    if (window.innerWidth <= 480) {
      const vw = window.innerWidth;
      return Math.min(130, Math.max(105, Math.floor((vw - 36) / 2.8)));
    }
    return window.innerWidth <= 768 ? 150 : 220;
  }, []);

  const [cardSpacing, setCardSpacing] = useState(220);

  // Total items on rail: visible garments + 1 plus circle if there are remaining garments in archive
  const hasMoreDesigns = allGarments.length > garments.length;
  const totalTrackItems = garments.length + (hasMoreDesigns ? 1 : 0);

  // Track scroll boundaries
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
  const motionEnabledRef = useRef(motionEnabled);
  motionEnabledRef.current = motionEnabled;

  // Trigger Racking Animation on page load & category changes (only when motionEnabled)
  useEffect(() => {
    if (!motionEnabled) {
      setIsRackingIn(false);
      return;
    }
    setIsRackingIn(true);
    playRackingCascade();
    const timer = setTimeout(() => {
      setIsRackingIn(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [categoryKey, motionEnabled]);

  // Immediately freeze all 3D rotations when motion is toggled OFF (Flat Static Catalog Mode)
  useEffect(() => {
    if (!motionEnabled) {
      setIsRackingIn(false);
      for (let i = 0; i < garments.length; i++) {
        cardAnglesRef.current[i] = 0;
        targetAnglesRef.current[i] = 0;
        hoverProgressRef.current[i] = 0;
        targetHoverProgressRef.current[i] = 0;
      }
      setVisualStates(
        garments.map(() => ({
          angle: 0,
          progress: 0
        }))
      );
    }
  }, [motionEnabled, garments]);

  // Resize and Initial Centering Effect
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      const spacing = getCardSpacing();
      setCardSpacing(spacing);

      if (viewportRef.current) {
        const viewportW = viewportRef.current.clientWidth;
        const totalTrackW = totalTrackItems * spacing;
        if (viewportW >= totalTrackW) {
          const center = (viewportW - totalTrackW) / 2;
          targetScrollXRef.current = center;
          currentScrollXRef.current = center;
          setScrollX(center);
        } else {
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
  }, [totalTrackItems, garments, activeGarmentId, getCardSpacing]);

  // Per-Garment 3D Rotation & Easing State
  const activeWinIdx = Math.max(0, garments.findIndex(g => g.id === activeGarmentId));
  const cardAnglesRef = useRef<number[]>(garments.map((_, i) => (i === activeWinIdx ? 0 : -36)));
  const targetAnglesRef = useRef<number[]>(garments.map((_, i) => (i === activeWinIdx ? 0 : -36)));
  const hoverProgressRef = useRef<number[]>(garments.map((_, i) => (i === activeWinIdx ? 1 : 0)));
  const targetHoverProgressRef = useRef<number[]>(garments.map((_, i) => (i === activeWinIdx ? 1 : 0)));

  const [visualStates, setVisualStates] = useState(
    garments.map((_, i) => ({
      angle: i === activeWinIdx ? 0 : -36,
      progress: i === activeWinIdx ? 1 : 0
    }))
  );

  // Keep internal physics arrays synchronized with the visible garments
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
  const clampScroll = useCallback((val: number) => {
    const { minScroll, maxScroll } = getMinMaxScroll();
    return Math.max(minScroll, Math.min(maxScroll, val));
  }, [getMinMaxScroll]);

  // Sync active garment rotation (faces 0deg front, others rest at -36deg)
  // Sync active garment rotation (faces 0deg front / 180deg back, others rest at -36deg / 144deg)
  useEffect(() => {
    if (selectedGarment) return;
    const activeIdx = Math.max(0, garments.findIndex(g => g.id === activeGarmentId));
    const isBack = viewAngle === 'back';
    const activeTargetAngle = isBack ? 180 : 0;
    const restAngle = isBack ? 144 : -36;

    if (!motionEnabled) {
      for (let i = 0; i < garments.length; i++) {
        cardAnglesRef.current[i] = i === activeIdx ? activeTargetAngle : restAngle;
        targetAnglesRef.current[i] = cardAnglesRef.current[i];
      }
      setVisualStates(
        garments.map((_, i) => ({
          angle: i === activeIdx ? activeTargetAngle : restAngle,
          progress: i === activeIdx ? 1 : 0
        }))
      );
      return;
    }

    for (let i = 0; i < garments.length; i++) {
      if (i === activeIdx) {
        targetAnglesRef.current[i] = activeTargetAngle;
        targetHoverProgressRef.current[i] = 1;
      } else if (i !== hoveredIndex) {
        targetAnglesRef.current[i] = restAngle;
        targetHoverProgressRef.current[i] = 0;
      } else {
        targetAnglesRef.current[i] = activeTargetAngle;
        targetHoverProgressRef.current[i] = 1;
      }
    }

    if (!isDraggingRailRef.current) {
      if (!viewportRef.current) return;
      const viewportW = viewportRef.current.clientWidth;
      const totalTrackW = totalTrackItems * cardSpacing;

      if (totalTrackW <= viewportW) {
        const center = (viewportW - totalTrackW) / 2;
        targetScrollXRef.current = center;
        return;
      }

      const targetPos = -(activeIdx * cardSpacing) + (viewportW / 2 - cardSpacing / 2);
      const minScroll = viewportW - totalTrackW - 20;
      targetScrollXRef.current = Math.max(minScroll, Math.min(0, targetPos));
    }
  }, [activeGarmentId, selectedGarment, cardSpacing, garments, totalTrackItems, hoveredIndex, motionEnabled, viewAngle]);

  // 60FPS Smooth Lerp Animation Loop
  useEffect(() => {
    let animId: number;
    const animate = () => {
      if (!motionEnabledRef.current) {
        // In static mode: snap scroll directly, zero 3D rotation lerp
        const scrollDiff = targetScrollXRef.current - currentScrollXRef.current;
        if (Math.abs(scrollDiff) > 0.05) {
          currentScrollXRef.current = targetScrollXRef.current;
          setScrollX(currentScrollXRef.current);
        }
        animId = requestAnimationFrame(animate);
        return;
      }
      const scrollDiff = targetScrollXRef.current - currentScrollXRef.current;
      if (Math.abs(scrollDiff) > 0.05) {
        currentScrollXRef.current += scrollDiff * 0.12;
        setScrollX(currentScrollXRef.current);

        if (viewportRef.current) {
          const viewportW = viewportRef.current.clientWidth;
          const totalTrackW = totalTrackItems * cardSpacing;

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

      let statesChanged = false;
      for (let i = 0; i < garments.length; i++) {
        if (cardAnglesRef.current[i] === undefined) {
          cardAnglesRef.current[i] = i === activeWinIdxRef.current ? 0 : -36;
          targetAnglesRef.current[i] = i === activeWinIdxRef.current ? 0 : -36;
          hoverProgressRef.current[i] = i === activeWinIdxRef.current ? 1 : 0;
          targetHoverProgressRef.current[i] = i === activeWinIdxRef.current ? 1 : 0;
        }

        const angleDiff = targetAnglesRef.current[i] - cardAnglesRef.current[i];
        if (Math.abs(angleDiff) > 0.04) {
          cardAnglesRef.current[i] += angleDiff * 0.08;
          statesChanged = true;
        }

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

    const onWheel = (e: WheelEvent) => {
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
  const handlePointerDownRail = (e: React.PointerEvent) => {
    if (selectedGarment) return;
    isDraggingRailRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    lastDragXRef.current = e.clientX;
  };

  // Pointer Move on Rail Viewport
  const handlePointerMoveRail = (e: React.PointerEvent) => {
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

    // Smooth snap to closest garment on release for intuitive mobile touch carousel
    if (viewportRef.current) {
      const viewportW = viewportRef.current.clientWidth;
      const offset = -targetScrollXRef.current + (viewportW / 2 - cardSpacing / 2);
      const rawIdx = Math.round(offset / cardSpacing);
      const nearestIdx = Math.max(0, Math.min(garments.length - 1, rawIdx));
      if (garments[nearestIdx]) {
        if (setActiveGarmentId) setActiveGarmentId(garments[nearestIdx].id);
        const snapPos = -(nearestIdx * cardSpacing) + (viewportW / 2 - cardSpacing / 2);
        targetScrollXRef.current = clampScroll(snapPos);
      }
    }
  };

  // Direct Garment Click to open individual page
  const handleCardClick = (garment: GarmentDesign) => {
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

  // Card Pointer Interactions
  const handleCardPointerEnter = (e: React.PointerEvent, idx: number) => {
    if (e.pointerType === 'touch') return;
    setHoveredIndex(idx);
    playRailClink();
    if (!motionEnabled) return;
    targetHoverProgressRef.current[idx] = 1;
    targetAnglesRef.current[idx] = 0;
  };

  const handleCardPointerMove = (e: React.PointerEvent, idx: number) => {
    if (e.pointerType === 'touch' || !motionEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (normX >= 0.5) {
      targetAnglesRef.current[idx] = (normX - 0.5) * 30;
    } else {
      const backT = (0.5 - normX) / 0.5;
      targetAnglesRef.current[idx] = backT * 180;
    }
  };

  const handleCardPointerLeave = (e: React.PointerEvent, idx: number) => {
    setHoveredIndex(null);
    if (!motionEnabled) return;
    const isThisActive = garments[idx]?.id === activeGarmentId;
    if (isThisActive) {
      targetHoverProgressRef.current[idx] = 1;
      targetAnglesRef.current[idx] = 0;
    } else {
      targetHoverProgressRef.current[idx] = 0;
      targetAnglesRef.current[idx] = -36;
    }
  };

  // Controlled 3D Drag to Turn on Individual Item Page
  const handlePointerDownTurn = (e: React.PointerEvent) => {
    if (!motionEnabled) return;
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

  const handlePointerMoveTurn = (e: React.PointerEvent) => {
    if (!isTurningRef.current) return;
    const deltaX = e.clientX - turnStartXRef.current;
    const targetAngle = Math.max(-180, Math.min(180, startAngleRef.current + deltaX * 0.45));
    setTurnAngle(targetAngle);
  };

  const handlePointerUpTurn = (e: React.PointerEvent) => {
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

  // Active images for inspected garment (strictly validated against selected garment's variants)
  const inspectedVariant = (selectedGarment && activeColorVariant && selectedGarment.colorVariants.some(v => v.id === activeColorVariant.id))
    ? activeColorVariant
    : (selectedGarment?.colorVariants.find(v => v.id === selectedGarment.defaultColorId) || selectedGarment?.colorVariants[0]);

  const inspectedFrontImg = inspectedVariant?.frontImg || selectedGarment?.colorVariants[0]?.frontImg || '';
  const inspectedBackImg = inspectedVariant?.backImg || selectedGarment?.colorVariants[0]?.backImg || '';

  return (
    <div 
      className="clothes-rail-wrapper"
      ref={railContainerRef}
    >
      {/* Horizontal Metallic Brass/Steel Clothes Rail Rod - Co-located with hangers so clothes NEVER detach on any screen */}
      {!selectedGarment && <div className="metallic-rod" />}

      {/* Ambient Floor Shadow */}
      {!selectedGarment && <div className="ambient-floor-shadow" />}

      {/* ========================================================
          RAIL MODE (SHOWROOM RACK):
          - Distinct designs hanging on the rack
          - Initial racking entrance animation on load & category switch
          - Interactive 3D angle rotation & smooth sliding window
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
          } as React.CSSProperties}
        >
          {(() => {
            interface RenderedCard {
              garment: GarmentDesign;
              animClass: string;
              keySuffix: string;
              isExiting?: boolean;
              isEntering?: boolean;
              originalIdx: number;
            }

            const renderedCards: RenderedCard[] = [];
            if (slideDirection === 'next' && garments.length > 0) {
              renderedCards.push({
                garment: garments[0],
                animClass: 'cloth-slide-out-left',
                keySuffix: '-exit',
                isExiting: true,
                originalIdx: 0
              });
              for (let i = 1; i < garments.length; i++) {
                renderedCards.push({
                  garment: garments[i],
                  animClass: 'cloth-shift-left',
                  keySuffix: '',
                  originalIdx: i
                });
              }
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

              // Front/Back images for rack card (strictly using this garment's own colorways)
              const isSelected = selectedGarment?.id === garment.id;
              const cardVariant = (isSelected && activeColorVariant && garment.colorVariants.some(v => v.id === activeColorVariant.id))
                ? activeColorVariant
                : (garment.colorVariants.find(v => v.id === garment.defaultColorId) || garment.colorVariants[0]);

              const cardFront = cardVariant?.frontImg || garment.colorVariants[0]?.frontImg || '';
              const cardBack = cardVariant?.backImg || garment.colorVariants[0]?.backImg || '';

              const isCardBack = motionEnabled ? (Math.abs(state.angle) >= 90) : (viewAngle === 'back');
              const cardImgSrc = isCardBack ? cardBack : cardFront;
              const cardImgAlt = isCardBack ? `${garment.title} Back View` : `${garment.title} Front View`;
              const cardImgTransform = (isCardBack && motionEnabled) ? 'scaleX(-1)' : 'none';

              const rackingClass = isRackingIn ? 'racking-entry-card' : '';
              const rackingDelay = isRackingIn ? { animationDelay: `${idx * 85}ms` } : {};

              return (
                <div 
                  key={garment.id + item.keySuffix}
                  className={`garment-card ${isCurrent ? 'active-selected' : ''} ${isHovered ? 'hovered' : ''} ${item.animClass} ${rackingClass}`}
                  style={{
                    width: `${cardSpacing}px`,
                    flex: `0 0 ${cardSpacing}px`,
                    zIndex: isHovered ? 50 : 15,
                    ...rackingDelay
                  }}
                  onPointerEnter={(e) => handleCardPointerEnter(e, item.originalIdx)}
                  onPointerMove={(e) => handleCardPointerMove(e, item.originalIdx)}
                  onPointerLeave={(e) => handleCardPointerLeave(e, item.originalIdx)}
                  onClick={() => handleCardClick(garment)}
                  onPointerUp={() => {
                    if (!hasMovedRef.current) {
                      handleCardClick(garment);
                    }
                  }}
                  title={`Inspect ${garment.title}`}
                >
                  <div 
                    className="garment-visual-wrapper"
                    style={{
                      transform: motionEnabled
                        ? `perspective(1000px) rotateY(${state.angle}deg) translateY(${translateY}px) scale(${scale})`
                        : `scale(${scale})`,
                      transition: motionEnabled ? undefined : 'none'
                    }}
                  >
                    <div 
                      className={`card-face ${isCardBack ? 'face-back' : 'face-front'}`}
                      style={{
                        transform: cardImgTransform
                      }}
                    >
                      <Image 
                        src={cardImgSrc}
                        alt={cardImgAlt}
                        width={260}
                        height={isMobile ? 260 : 350}
                        priority={idx < 5}
                        className="garment-img"
                        style={{
                          height: isMobile ? '260px' : '350px',
                          width: 'auto',
                          objectFit: 'contain',
                          filter: cardVariant?.filter || 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            });
          })()}

          {/* Minimalist "+" Circle on the Rail with Pulsing Badge */}
          {hasMoreDesigns && (
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
              title={`Slide next design (${nextWear?.code}. ${nextWear?.title}) onto rail`}
            >
              <div className="rack-circle-visual">
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

                <div className="rack-circle-btn-container">
                  <div className="rack-circle-btn">
                    <span className="rack-circle-pulsing-badge" aria-label={`+${allGarments.length - garments.length} more designs`}>
                      +{allGarments.length - garments.length}
                    </span>

                    <span className="rack-circle-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </span>
                  </div>

                  <div className="rack-circle-hover-card">
                    <div className="hover-card-header">
                      <span className="hover-card-pill">Next Design</span>
                      <span className="hover-card-title truncate">
                        {nextWear ? `${nextWear.code}. ${nextWear.title}` : 'Slide Next'}
                      </span>
                    </div>

                    <p className="hover-card-desc">
                      {nextWear 
                        ? `${nextWear.categoryLabel} · ${nextWear.colorVariants[0]?.name}`
                        : 'Slide next silhouette from archive onto rail'}
                    </p>

                    <div className="hover-card-action">
                      <span>Click to slide onto rail</span>
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
          INDIVIDUAL PIECE INSPECTION STAGE:
          - Centered front face
          - Physical size scaling reflecting selected size
          - 360 degree turntable drag & view angle switch
          - Reflects selected color variant
          ======================================================== */}
      {selectedGarment && (
        <div 
          className="detail-garment-stage"
          onPointerDown={handlePointerDownTurn}
          onPointerMove={handlePointerMoveTurn}
          onPointerUp={handlePointerUpTurn}
          onPointerCancel={handlePointerUpTurn}
        >
          <div 
            className="scaled-silhouette-wrapper"
            style={{
              transform: `scale(${currentSize?.scale || 1.0})`,
              transformOrigin: 'top center'
            }}
          >
            <div 
              key={`${selectedGarment.id}-${activeColorVariant?.id}`}
              className={`turnable-card-3d detail-garment-enter ${isTurningGarment ? 'dragging' : ''}`}
              style={{
                transform: `rotateY(${turnAngle}deg)`
              }}
              title="Drag horizontally to turn 360°"
            >
              {/* Front Face */}
              <div className="card-face face-front">
                <Image 
                  src={inspectedFrontImg} 
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
                  src={inspectedBackImg} 
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
