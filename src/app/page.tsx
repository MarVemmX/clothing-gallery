'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import ClothesRail from '../components/ClothesRail';
import GarmentStudioViewer from '../components/GarmentStudioViewer';
import GarmentDetailPanel from '../components/GarmentDetailPanel';
import BottomControls from '../components/BottomControls';
import CommissionModal from '../components/CommissionModal';
import RealLifeModelCard from '../components/RealLifeModelCard';
import CartDrawer from '../components/CartDrawer';
import { CATEGORIES, SIZES, getGarmentsByCategory, ALL_GARMENTS } from '../data/clothing';
import { CategoryId, GarmentDesign, ColorVariant, SizeOption, CartItem } from '../types/clothing';
import { playFabricSwoosh, playRailClink, playSoftClick, setSoundEnabled } from '../utils/audio';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  // Sync initial sound state from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arewa_sound_enabled');
        if (saved !== null) {
          const enabled = saved === 'true';
          setSoundOn(enabled);
          setSoundEnabled(enabled);
          return;
        }
      } catch {}
      setSoundEnabled(true);
    }
  }, []);

  // Guarantee global audio synthesis state strictly matches soundOn
  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  // Responsive mobile detection (3 garments on mobile, 5 on desktop)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Current category's garments (3 on mobile, 5 on desktop)
  const categoryGarments = getGarmentsByCategory(activeCategory);
  const windowCapacity = isMobile ? 3 : 5;
  const WINDOW_SIZE = Math.min(windowCapacity, categoryGarments.length);

  const [startIndex, setStartIndex] = useState(0);
  const [activeGarmentId, setActiveGarmentId] = useState<string>(categoryGarments[0]?.id || '');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<GarmentDesign | null>(null);
  const [activeColorVariant, setActiveColorVariant] = useState<ColorVariant>(
    categoryGarments[0]?.colorVariants[0]
  );
  const [currentSize, setCurrentSize] = useState<SizeOption>(SIZES[2]); // Default 'm' (Medium, scale 1.0)
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');

  // Modal & Cart States
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Sliding transitions for rack
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | 'fade' | null>(null);
  const isSlidingRef = useRef(false);

  // Exactly 5 (or fewer if category has fewer) garments on the rack at all times
  const visibleGarments = Array.from({ length: WINDOW_SIZE }, (_, i) => {
    return categoryGarments[(startIndex + i) % categoryGarments.length];
  });

  const activeGarment = categoryGarments.find(g => g.id === activeGarmentId) || visibleGarments[0];
  const nextWear = categoryGarments.length > WINDOW_SIZE 
    ? categoryGarments[(startIndex + WINDOW_SIZE) % categoryGarments.length] 
    : undefined;
  const firstWear = visibleGarments[0];

  // Sync active color variant when selectedGarment or activeGarment changes
  useEffect(() => {
    const targetGarment = selectedGarment || activeGarment;
    if (targetGarment) {
      const isVariantValid = targetGarment.colorVariants.some(v => v.id === activeColorVariant?.id);
      if (!isVariantValid) {
        const defaultVariant = targetGarment.colorVariants.find(
          v => v.id === targetGarment.defaultColorId
        ) || targetGarment.colorVariants[0];
        setActiveColorVariant(defaultVariant);
      }
    }
  }, [selectedGarment, activeGarment, activeColorVariant]);

  // Read URL query parameter ?piece=... on mount and browser back/forward buttons
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const pieceId = params.get('piece');
      if (pieceId) {
        const found = ALL_GARMENTS.find(g => g.id === pieceId);
        if (found) {
          setSelectedGarment(found);
          setActiveCategory(found.category);
          const defaultVar = found.colorVariants.find(v => v.id === found.defaultColorId) || found.colorVariants[0];
          setActiveColorVariant(defaultVar);
          return;
        }
      }
      setSelectedGarment(null);
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Handle Category Switching
  const handleSelectCategory = useCallback((catId: CategoryId) => {
    setActiveCategory(catId);
    setStartIndex(0);
    const newGarments = getGarmentsByCategory(catId);
    if (newGarments.length > 0) {
      setActiveGarmentId(newGarments[0].id);
      const defaultVariant = newGarments[0].colorVariants.find(
        v => v.id === newGarments[0].defaultColorId
      ) || newGarments[0].colorVariants[0];
      setActiveColorVariant(defaultVariant);
      if (selectedGarment) {
        setSelectedGarment(newGarments[0]);
      }
    }
  }, [selectedGarment]);

  // Slide rack forward: smoothly transitions out the 1st piece and eases in the next piece
  const handleSlideNext = useCallback(() => {
    if (isSlidingRef.current || categoryGarments.length <= 1) return;
    isSlidingRef.current = true;
    playRailClink();
    setSlideDirection('next');

    setTimeout(() => {
      setStartIndex(prev => {
        const nextStart = (prev + 1) % categoryGarments.length;
        const incoming = categoryGarments[(nextStart + WINDOW_SIZE - 1) % categoryGarments.length];
        setActiveGarmentId(incoming.id);
        const incomingDefault = incoming.colorVariants.find(
          v => v.id === incoming.defaultColorId
        ) || incoming.colorVariants[0];
        setActiveColorVariant(incomingDefault);
        if (selectedGarment) {
          setSelectedGarment(incoming);
        }
        return nextStart;
      });
      setSlideDirection(null);
      isSlidingRef.current = false;
    }, 420);
  }, [selectedGarment, categoryGarments, WINDOW_SIZE]);

  // Slide rack backward: smoothly transitions out the 5th piece and eases in the previous piece
  const handleSlidePrev = useCallback(() => {
    if (isSlidingRef.current || categoryGarments.length <= 1) return;
    isSlidingRef.current = true;
    playRailClink();
    setSlideDirection('prev');

    setTimeout(() => {
      setStartIndex(prev => {
        const prevStart = (prev - 1 + categoryGarments.length) % categoryGarments.length;
        const incoming = categoryGarments[prevStart];
        setActiveGarmentId(incoming.id);
        const incomingDefault = incoming.colorVariants.find(
          v => v.id === incoming.defaultColorId
        ) || incoming.colorVariants[0];
        setActiveColorVariant(incomingDefault);
        if (selectedGarment) {
          setSelectedGarment(incoming);
        }
        return prevStart;
      });
      setSlideDirection(null);
      isSlidingRef.current = false;
    }, 420);
  }, [selectedGarment, categoryGarments]);

  // Return to rail
  const handleBackToRail = useCallback(() => {
    playFabricSwoosh();
    setSelectedGarment(null);
    setViewAngle('front');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('piece');
      window.history.pushState(null, '', url.pathname);
    }
  }, []);

  // Open individual garment page
  const handleOpenGarment = useCallback((garment: GarmentDesign) => {
    if (!garment) return;
    playFabricSwoosh();
    setSelectedGarment(garment);
    setActiveGarmentId(garment.id);

    const defaultVariant = garment.colorVariants.find(
      v => v.id === garment.defaultColorId
    ) || garment.colorVariants[0];
    setActiveColorVariant(defaultVariant);

    const fullIdx = categoryGarments.findIndex(g => g.id === garment.id);
    if (fullIdx !== -1) {
      const inWindow = visibleGarments.some(g => g.id === garment.id);
      if (!inWindow && categoryGarments.length > WINDOW_SIZE) {
        const newStart = (fullIdx - 2 + categoryGarments.length) % categoryGarments.length;
        setStartIndex(newStart);
      }
    }
    setViewAngle('front');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('piece', garment.id);
      window.history.pushState({ piece: garment.id }, '', url.toString());
    }
  }, [categoryGarments, visibleGarments, WINDOW_SIZE]);

  // Cart Management
  const handleAddToCart = useCallback(() => {
    if (!selectedGarment || !activeColorVariant) return;

    const newItem: CartItem = {
      cartItemId: `${selectedGarment.id}-${activeColorVariant.id}-${currentSize.key}-${Date.now()}`,
      garmentId: selectedGarment.id,
      title: selectedGarment.title,
      category: selectedGarment.category,
      color: {
        id: activeColorVariant.id,
        name: activeColorVariant.name,
        hex: activeColorVariant.dotColor,
        thumbImg: activeColorVariant.frontImg,
        filter: activeColorVariant.filter
      },
      size: currentSize,
      priceNaira: selectedGarment.priceNaira,
      priceRaw: selectedGarment.priceRaw,
      quantity: 1
    };

    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        it => it.garmentId === newItem.garmentId && 
              it.color.id === newItem.color.id && 
              it.size.key === newItem.size.key
      );
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [newItem, ...prev];
    });

    playSoftClick();
    setIsCartOpen(true);
  }, [selectedGarment, activeColorVariant, currentSize]);

  const handleUpdateQuantity = useCallback((cartItemId: string, newQty: number) => {
    setCartItems(prev => {
      if (newQty <= 0) {
        return prev.filter(it => it.cartItemId !== cartItemId);
      }
      return prev.map(it => it.cartItemId === cartItemId ? { ...it, quantity: newQty } : it);
    });
  }, []);

  const handleRemoveCartItem = useCallback((cartItemId: string) => {
    setCartItems(prev => prev.filter(it => it.cartItemId !== cartItemId));
  }, []);

  const handleProceedCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCommissionOpen(true);
  }, []);



  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommissionOpen || isCartOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentWinIdx = visibleGarments.findIndex(g => g.id === activeGarmentId);
        if (currentWinIdx > 0) {
          const prevG = visibleGarments[currentWinIdx - 1];
          setActiveGarmentId(prevG.id);
          if (selectedGarment) {
            setSelectedGarment(prevG);
            setActiveColorVariant(prevG.colorVariants[0]);
          }
          playRailClink();
        } else {
          handleSlidePrev();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const currentWinIdx = visibleGarments.findIndex(g => g.id === activeGarmentId);
        if (currentWinIdx < visibleGarments.length - 1) {
          const nextG = visibleGarments[currentWinIdx + 1];
          setActiveGarmentId(nextG.id);
          if (selectedGarment) {
            setSelectedGarment(nextG);
            setActiveColorVariant(nextG.colorVariants[0]);
          }
          playRailClink();
        } else {
          handleSlideNext();
        }
      } else if (e.key === 'Escape') {
        if (isCartOpen) {
          setIsCartOpen(false);
        } else if (selectedGarment) {
          handleBackToRail();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeGarmentId,
    visibleGarments,
    selectedGarment,
    isCommissionOpen,
    isCartOpen,
    handleSlideNext,
    handleSlidePrev,
    handleBackToRail
  ]);

  const activeHoveredGarment = hoveredIndex !== null ? visibleGarments[hoveredIndex] : null;
  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <main className={`app-container ${motionEnabled ? 'motion-active' : 'motion-disabled'} ${selectedGarment ? 'mode-detail' : 'mode-rail'}`}>
      {/* 1. TOP NAVBAR - Hidden on individual piece view (?piece=...) */}
      {!selectedGarment && (
        <Header
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          motionEnabled={motionEnabled}
          setMotionEnabled={setMotionEnabled}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          onResetView={handleBackToRail}
          cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* 2. EDITORIAL SUBHEADER - Hidden on individual piece view (?piece=...) */}
      {!selectedGarment && (
        <section className="editorial-header">
          <div className="editorial-header-top">
            <h1 className="main-title font-serif">
              {currentCategoryObj.name}
            </h1>

            <div className="rail-metadata">
              <span className="title font-serif">{currentCategoryObj.badge || 'Showroom'}</span>
              <span className="metadata-dot">·</span>
              <span className="metadata-edition">Bespoke Edition / 2026</span>
            </div>
          </div>

          <div className="editorial-subtitle-row">
            <span className="editorial-tagline font-medium">
              {currentCategoryObj.tagline}
            </span>

            <div className="editorial-actions-wrap">
              {/* Showroom Rail View Angle Toggle Pills */}
              <div className="rail-view-toggle-bar" role="group" aria-label="Showroom rail view orientation">
                <button
                  type="button"
                  className={`rail-view-pill ${viewAngle === 'front' ? 'active' : ''}`}
                  onClick={() => {
                    playFabricSwoosh();
                    setViewAngle('front');
                  }}
                  title="Front view of clothes on the rail"
                  aria-pressed={viewAngle === 'front'}
                >
                  <span className="pill-dot" />
                  <span>Front View</span>
                </button>
                <button
                  type="button"
                  className={`rail-view-pill ${viewAngle === 'back' ? 'active' : ''}`}
                  onClick={() => {
                    playFabricSwoosh();
                    setViewAngle('back');
                  }}
                  title="Turn clothes on the rail to back view"
                  aria-pressed={viewAngle === 'back'}
                >
                  <span className="pill-dot" />
                  <span>Back View</span>
                </button>
              </div>

              {nextWear && (
                <button
                  className="editorial-more-toggle-btn"
                  onClick={handleSlideNext}
                  title={`Slide next design (${nextWear.code}. ${nextWear.title}) onto rail`}
                >
                  <span className="toggle-symbol">+</span>
                  <span>Next Design ({nextWear.code})</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. SHOWROOM RAIL (BROWSING) OR ATELIER STUDIO (INSPECTING) */}
      {!selectedGarment ? (
        <section className="runway-stage is-rail-view">
          {/* Clothes Rail Component with integrated metallic rod and shadow */}
          <ClothesRail
            garments={visibleGarments}
            allGarments={categoryGarments}
            nextWear={nextWear}
            firstWear={firstWear}
            slideDirection={slideDirection}
            onSlideNext={handleSlideNext}
            onSlidePrev={handleSlidePrev}
            activeGarmentId={activeGarmentId}
            setActiveGarmentId={setActiveGarmentId}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            selectedGarment={selectedGarment}
            setSelectedGarment={handleOpenGarment}
            motionEnabled={motionEnabled}
            currentSize={currentSize}
            viewAngle={viewAngle}
            setViewAngle={setViewAngle}
            activeColorVariant={activeColorVariant}
            categoryKey={activeCategory}
          />
        </section>
      ) : (
        <section className="atelier-detail-studio">
          {/* Ambient Studio Lighting Glow */}
          <div className="studio-ambient-glow" aria-hidden="true" />

          {/* Floating Top Navigation when main header tag is hidden in piece inspection */}
          <div className="studio-top-floating-bar">
            <button
              type="button"
              className="studio-back-rail-floating"
              onClick={handleBackToRail}
              title="Return to browsing the showroom rail"
              aria-label="Return to showroom rail"
            >
              <svg 
                className="floating-btn-icon"
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Return to Showroom Rail</span>
            </button>

            <button
              type="button"
              className="studio-cart-floating"
              onClick={() => setIsCartOpen(true)}
              title="Open Atelier Shopping Bag"
              aria-label="Open shopping bag"
            >
              <svg 
                className="floating-btn-icon"
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Atelier Bag</span>
              {cartItems.length > 0 && (
                <span className="floating-cart-count">
                  {cartItems.reduce((acc, it) => acc + it.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* FAR LEFT END OF SCREEN: REAL DEAL LIVE MODEL CARD */}
          {activeColorVariant && (
            <RealLifeModelCard
              garment={selectedGarment}
              activeColorVariant={activeColorVariant}
              currentSize={currentSize}
            />
          )}

          {/* STUDIO VISUAL COLUMN: Hanger on boutique mount + 360° Drag */}
          <div className="studio-visual-column">
            <GarmentStudioViewer
              garment={selectedGarment}
              activeColorVariant={activeColorVariant}
              currentSize={currentSize}
              viewAngle={viewAngle}
              setViewAngle={setViewAngle}
              motionEnabled={motionEnabled}
            />
          </div>

          {/* RIGHT ATELIER DETAIL COLUMN: Garment Specification, Colors, Sizes & CTA */}
          <div className="studio-detail-column">
            <GarmentDetailPanel
              garment={selectedGarment}
              activeColorVariant={activeColorVariant}
              onSelectColorVariant={setActiveColorVariant}
              currentSize={currentSize}
              onSelectSize={setCurrentSize}
              viewAngle={viewAngle}
              setViewAngle={setViewAngle}
              onAddToCart={handleAddToCart}
              onOpenCommission={() => setIsCommissionOpen(true)}
              onBackToRail={handleBackToRail}
            />
          </div>
        </section>
      )}

      {/* 4. BOTTOM CONTROLS BAR */}
      <BottomControls
        visibleGarments={visibleGarments}
        allGarments={categoryGarments}
        nextWear={nextWear}
        activeGarment={activeGarment}
        selectedGarment={selectedGarment}
        hoveredGarment={activeHoveredGarment}
        activeColorVariant={activeColorVariant}
        viewAngle={viewAngle}
        onToggleViewAngle={setViewAngle}
        onSelectGarment={handleOpenGarment}
        onSlideNext={handleSlideNext}
        onSlidePrev={handleSlidePrev}
      />

      {/* 5. SLIDE-OVER ATELIER SHOPPING BAG DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* 6. BESPOKE COMMISSION MODAL */}
      <CommissionModal
        isOpen={isCommissionOpen}
        onClose={() => setIsCommissionOpen(false)}
        garment={selectedGarment}
        selectedSize={currentSize}
        activeColorVariant={activeColorVariant}
      />
    </main>
  );
}
