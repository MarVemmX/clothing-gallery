'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import ClothesRail from '../components/ClothesRail';
import GarmentDetailPanel from '../components/GarmentDetailPanel';
import BottomControls from '../components/BottomControls';
import CommissionModal from '../components/CommissionModal';
import { SENATOR_COLLECTION, SIZES } from '../data/senators';
import { playFabricSwoosh, playRailClink, playSoftClick } from '../utils/audio';

export default function Home() {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const WINDOW_SIZE = 5;
  const [startIndex, setStartIndex] = useState(0); // 0 to 8: Start index of the 5-garment window
  const [activeGarmentId, setActiveGarmentId] = useState(SENATOR_COLLECTION[0].id);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [currentSize, setCurrentSize] = useState(SIZES[2]); // Default 'm' (Medium, scale 1.0)
  const [viewAngle, setViewAngle] = useState('front');
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);

  const [slideDirection, setSlideDirection] = useState(null); // 'next' | 'prev' | 'fade' | null
  const isSlidingRef = useRef(false);

  // Exactly 5 garments on the rack at all times (revolving sliding window)
  const visibleGarments = Array.from({ length: WINDOW_SIZE }, (_, i) => {
    return SENATOR_COLLECTION[(startIndex + i) % SENATOR_COLLECTION.length];
  });

  const activeGarment = SENATOR_COLLECTION.find(g => g.id === activeGarmentId) || visibleGarments[0];
  const nextWear = SENATOR_COLLECTION[(startIndex + WINDOW_SIZE) % SENATOR_COLLECTION.length];
  const firstWear = visibleGarments[0];

  // Slide rack forward: smoothly transitions out the 1st piece and eases in the next piece
  const handleSlideNext = useCallback(() => {
    if (isSlidingRef.current) return;
    isSlidingRef.current = true;
    playRailClink();
    setSlideDirection('next');

    setTimeout(() => {
      setStartIndex(prev => {
        const nextStart = (prev + 1) % SENATOR_COLLECTION.length;
        const incoming = SENATOR_COLLECTION[(nextStart + WINDOW_SIZE - 1) % SENATOR_COLLECTION.length];
        setActiveGarmentId(incoming.id);
        if (selectedGarment) setSelectedGarment(incoming);
        return nextStart;
      });
      setSlideDirection(null);
      isSlidingRef.current = false;
    }, 440);
  }, [selectedGarment]);

  // Slide rack backward: smoothly transitions out the 5th piece and eases in the previous piece
  const handleSlidePrev = useCallback(() => {
    if (isSlidingRef.current) return;
    isSlidingRef.current = true;
    playRailClink();
    setSlideDirection('prev');

    setTimeout(() => {
      setStartIndex(prev => {
        const prevStart = (prev - 1 + SENATOR_COLLECTION.length) % SENATOR_COLLECTION.length;
        const incoming = SENATOR_COLLECTION[prevStart];
        setActiveGarmentId(incoming.id);
        if (selectedGarment) setSelectedGarment(incoming);
        return prevStart;
      });
      setSlideDirection(null);
      isSlidingRef.current = false;
    }, 440);
  }, [selectedGarment]);

  // Select a piece from swatches or rail: ensures it is within the 5 visible garments
  const handleSelectPiece = useCallback((garment) => {
    if (!garment || isSlidingRef.current) return;
    playRailClink();
    setActiveGarmentId(garment.id);
    const fullIdx = SENATOR_COLLECTION.findIndex(g => g.id === garment.id);
    if (fullIdx !== -1) {
      const inWindow = visibleGarments.some(g => g.id === garment.id);
      if (!inWindow) {
        // Crossfade transition when jumping across the archive
        isSlidingRef.current = true;
        setSlideDirection('fade');
        setTimeout(() => {
          const newStart = (fullIdx - 2 + SENATOR_COLLECTION.length) % SENATOR_COLLECTION.length;
          setStartIndex(newStart);
          setSlideDirection(null);
          isSlidingRef.current = false;
        }, 320);
      }
    }
  }, [visibleGarments]);

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
  const handleOpenGarment = useCallback((garment) => {
    if (!garment) return;
    playFabricSwoosh();
    setSelectedGarment(garment);
    setActiveGarmentId(garment.id);
    const fullIdx = SENATOR_COLLECTION.findIndex(g => g.id === garment.id);
    if (fullIdx !== -1) {
      const inWindow = visibleGarments.some(g => g.id === garment.id);
      if (!inWindow) {
        const newStart = (fullIdx - 2 + SENATOR_COLLECTION.length) % SENATOR_COLLECTION.length;
        setStartIndex(newStart);
      }
    }
    setViewAngle('front');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('piece', garment.id);
      window.history.pushState({ piece: garment.id }, '', url.toString());
    }
  }, [visibleGarments]);

  // Handle URL query param on mount and browser Back/Forward (popstate)
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const pieceId = params.get('piece');
      if (pieceId) {
        const found = SENATOR_COLLECTION.find(g => g.id === pieceId);
        if (found) {
          const fullIdx = SENATOR_COLLECTION.findIndex(g => g.id === found.id);
          const newStart = (fullIdx - 2 + SENATOR_COLLECTION.length) % SENATOR_COLLECTION.length;
          setStartIndex(newStart);
          setSelectedGarment(found);
          setActiveGarmentId(found.id);
          setViewAngle('front');
          return;
        }
      }
      setSelectedGarment(null);
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Keyboard navigation: smoothly slides rack left/right across 5-garment window
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCommissionOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentWinIdx = visibleGarments.findIndex(g => g.id === activeGarmentId);
        if (currentWinIdx > 0) {
          const prevG = visibleGarments[currentWinIdx - 1];
          setActiveGarmentId(prevG.id);
          if (selectedGarment) setSelectedGarment(prevG);
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
          if (selectedGarment) setSelectedGarment(nextG);
          playRailClink();
        } else {
          handleSlideNext();
        }
      } else if (e.key === 'Escape') {
        if (selectedGarment) {
          handleBackToRail();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGarmentId, visibleGarments, selectedGarment, isCommissionOpen, handleSlideNext, handleSlidePrev, handleBackToRail]);

  const activeHoveredGarment = hoveredIndex !== null ? visibleGarments[hoveredIndex] : null;

  return (
    <main className={`app-container ${motionEnabled ? 'motion-active' : ''}`}>
      {/* 1. TOP NAVBAR */}
      <Header 
        motionEnabled={motionEnabled}
        setMotionEnabled={setMotionEnabled}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        onResetView={handleBackToRail}
        collectionCount={5}
        totalCount={SENATOR_COLLECTION.length}
      />

      {/* 2. EDITORIAL SUBHEADER */}
      <section className="editorial-header">
        <div className="collection-heading-group">
          <h1 className="main-title">
            {selectedGarment ? selectedGarment.title : 'The collection.'}
          </h1>
          {selectedGarment ? (
            <button 
              className="back-to-rail-btn"
              onClick={handleBackToRail}
              title="Return to browsing the showroom rail"
            >
              <span>✕</span>
              <span>Back to the rail</span>
            </button>
          ) : (
            <div className="editorial-subtitle-row">
              <span>Nigerian Senator Attire · 5 on Rack ({firstWear.code}–{visibleGarments[4].code})</span>
              <button 
                className="editorial-more-toggle-btn"
                onClick={handleSlideNext}
                title={`Slide next silhouette (${nextWear.code}. ${nextWear.title}) onto rack`}
              >
                <span className="toggle-symbol">+</span>
                <span>Next Wear ({nextWear.code})</span>
              </button>
            </div>
          )}
        </div>

        <div className="rail-metadata">
          <div className="title">The rail</div>
          <div>Volume 001 / 2026</div>
        </div>
      </section>

      {/* 3. RUNWAY STAGE / CLOTHES RAIL */}
      <section className="runway-stage">
        {/* Horizontal Steel Clothes Rail Rod: Fixed across the whole stage at top: 60px (desktop) / 48px (mobile) */}
        <div className="metallic-rod" />

        {/* Ambient Floor Shadow */}
        <div className="ambient-floor-shadow" />

        {/* Clothes Rail Component: Always 5 garments on rack */}
        <ClothesRail 
          garments={visibleGarments}
          allGarments={SENATOR_COLLECTION}
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
        />

        {/* Right Product Detail Information Panel (Individual Item Page) */}
        {selectedGarment && (
          <GarmentDetailPanel 
            garment={selectedGarment}
            currentSize={currentSize}
            setCurrentSize={setCurrentSize}
            viewAngle={viewAngle}
            setViewAngle={setViewAngle}
            onOpenCommission={() => setIsCommissionOpen(true)}
          />
        )}
      </section>

      {/* 4. BOTTOM CONTROLS BAR */}
      <BottomControls 
        visibleGarments={visibleGarments}
        allGarments={SENATOR_COLLECTION}
        nextWear={nextWear}
        activeGarment={activeGarment}
        onSelectPiece={handleSelectPiece}
        onSlideNext={handleSlideNext}
        onSlidePrev={handleSlidePrev}
        hoveredGarment={activeHoveredGarment}
        selectedGarment={selectedGarment}
        onSelectGarment={handleOpenGarment}
      />

      {/* 5. BESPOKE COMMISSION MODAL */}
      <CommissionModal 
        isOpen={isCommissionOpen}
        onClose={() => setIsCommissionOpen(false)}
        garment={selectedGarment}
        selectedSize={currentSize}
      />
    </main>
  );
}
