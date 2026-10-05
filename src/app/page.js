'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ClothesRail from '../components/ClothesRail';
import GarmentDetailPanel from '../components/GarmentDetailPanel';
import BottomControls from '../components/BottomControls';
import CommissionModal from '../components/CommissionModal';
import { SENATOR_COLLECTION, SIZES } from '../data/senators';
import { playFabricSwoosh } from '../utils/audio';

export default function Home() {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [currentSize, setCurrentSize] = useState(SIZES[2]); // Default 'm' (Medium, scale 1.0)
  const [viewAngle, setViewAngle] = useState('front');
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);

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
    const idx = SENATOR_COLLECTION.findIndex(g => g.id === garment.id);
    if (idx !== -1) setCurrentIndex(idx);
    setViewAngle('front');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('piece', garment.id);
      window.history.pushState({ piece: garment.id }, '', url.toString());
    }
  }, []);

  // Handle URL query param on mount and browser Back/Forward (popstate)
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const pieceId = params.get('piece');
      if (pieceId) {
        const found = SENATOR_COLLECTION.find(g => g.id === pieceId);
        if (found) {
          setSelectedGarment(found);
          const idx = SENATOR_COLLECTION.findIndex(g => g.id === found.id);
          if (idx !== -1) setCurrentIndex(idx);
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

  // Bounded Keyboard navigation (No infinite scroll)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCommissionOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          const nextIdx = currentIndex - 1;
          setCurrentIndex(nextIdx);
          if (selectedGarment) {
            handleOpenGarment(SENATOR_COLLECTION[nextIdx]);
          }
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < SENATOR_COLLECTION.length - 1) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          if (selectedGarment) {
            handleOpenGarment(SENATOR_COLLECTION[nextIdx]);
          }
        }
      } else if (e.key === 'Escape') {
        if (selectedGarment) {
          handleBackToRail();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedGarment, isCommissionOpen, handleOpenGarment, handleBackToRail]);

  const activeHoveredGarment = hoveredIndex !== null ? SENATOR_COLLECTION[hoveredIndex] : null;

  return (
    <main className={`app-container ${motionEnabled ? 'motion-active' : ''}`}>
      {/* 1. TOP NAVBAR */}
      <Header 
        motionEnabled={motionEnabled}
        setMotionEnabled={setMotionEnabled}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        onResetView={handleBackToRail}
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
              title="Return to browsing the complete rail"
            >
              <span>✕</span>
              <span>Back to the rail</span>
            </button>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Nigerian Senator Attire · 7 Exclusive Silhouettes
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

        {/* Clothes Rail Component */}
        <ClothesRail 
          garments={SENATOR_COLLECTION}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
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
        garments={SENATOR_COLLECTION}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
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
