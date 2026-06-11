import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download } from 'lucide-react';

import { useConfig } from '../hooks/useConfig';

const SWIPE_THRESHOLD = 50;

function ImageWithSkeleton({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`w-full aspect-square cursor-pointer overflow-hidden relative ${!loaded ? 'bg-gray-200 animate-pulse' : 'bg-gray-100'}`}
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={src}
        alt={alt}
        className={`pointer-events-none w-full h-full object-cover transition-all duration-700 hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0 scale-105'}`}
        loading="lazy"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function Gallery() {
  const { config } = useConfig();
  const IMAGES = config?.galleryPhotos || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const [orientations, setOrientations] = useState<Record<number, 'portrait' | 'landscape'>>({});

  const handleImageLoad = (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setOrientations(prev => ({
      ...prev,
      [index]: naturalHeight > naturalWidth ? 'portrait' : 'landscape'
    }));
  };

  const goToPrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (IMAGES.length === 0) return;
    setSelectedIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  }, [IMAGES.length]);

  const goToNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (IMAGES.length === 0) return;
    setSelectedIndex((prev) => (prev + 1) % IMAGES.length);
  }, [IMAGES.length]);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.setProperty('overflow', 'hidden');
    } else {
      document.body.style.removeProperty('overflow');
    }
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isModalOpen]);

  // Touch handlers for modal
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    setDragOffset(diff);
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    if (dragOffset < -SWIPE_THRESHOLD) goToNext();
    else if (dragOffset > SWIPE_THRESHOLD) goToPrev();
    setDragOffset(0);
    setIsDragging(false);
    touchStartX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const diff = e.clientX - mouseStartX.current;
    setDragOffset(diff);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (dragOffset < -SWIPE_THRESHOLD) goToNext();
    else if (dragOffset > SWIPE_THRESHOLD) goToPrev();
    setDragOffset(0);
    setIsDragging(false);
    mouseStartX.current = null;
  };

  const handleMouseLeave = () => {
    if (mouseStartX.current !== null) handleMouseUp();
  };

  const visibleImages = isExpanded ? IMAGES : IMAGES.slice(0, 9);

  return (
    <section className="pt-24 pb-10 bg-[#fcfcfc] fade-in" id="gallery-section">
      <div className="text-center mb-10 px-4">
        <h3 className="font-serif text-[18px] tracking-[0.25em] text-[#111] mb-6">GALLERY</h3>
        <p className="text-[14px] text-gray-500 font-light leading-relaxed">
          사진을 클릭하시면 전체 화면 보기가<br />가능합니다.
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto">
        {/* Grid View */}
        <div className="grid grid-cols-3 gap-[2px] mb-6">
          {visibleImages.map((src, index) => (
            <ImageWithSkeleton
              key={index}
              src={src}
              alt={`Gallery thumbnail ${index + 1}`}
              onClick={() => openModal(index)}
            />
          ))}
        </div>

        {/* Toggle Button */}
        {IMAGES.length > 9 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex flex-col items-center gap-2 text-[13px] text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-5 h-5 text-gray-400 font-light" strokeWidth={1} />
                  <span>접기</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 text-gray-400 font-light" strokeWidth={1} />
                  <span>더 보기</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] bg-white flex flex-col"
            >
              {/* Top bar */}
              <div className="flex justify-end p-4">
                <button onClick={closeModal} className="p-2 text-gray-500 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Image Container */}
              <div
                className="flex-1 overflow-hidden relative flex items-center justify-center select-none touch-none w-full"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="relative w-full h-full flex items-center justify-center"
                  style={{
                    transform: `translateX(${dragOffset * 0.3}px)`, // Slight parallax drag effect
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                  }}
                >
                  {IMAGES.map((src, index) => (
                    <div 
                      key={index} 
                      className={`absolute inset-0 w-full h-full flex items-center justify-center px-4 transition-opacity duration-500 ease-in-out ${
                        index === selectedIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Fullscreen ${index + 1}`}
                        onLoad={(e) => handleImageLoad(index, e)}
                        className={`pointer-events-none mx-auto ${orientations[index] === 'landscape'
                            ? 'w-full max-w-[500px] h-auto object-contain'
                            : 'w-full max-w-[320px] aspect-[2/3] object-cover'
                          }`}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between px-6 py-6 pb-12">
                <button onClick={goToPrev} className="p-2 text-gray-400 hover:text-black transition-colors">
                  <ChevronLeft className="w-6 h-6" strokeWidth={1} />
                </button>
                <span className="text-[14px] text-gray-600 tracking-widest font-light">
                  {selectedIndex + 1} / {IMAGES.length}
                </span>
                <button onClick={goToNext} className="p-2 text-gray-400 hover:text-black transition-colors">
                  <ChevronRight className="w-6 h-6" strokeWidth={1} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
