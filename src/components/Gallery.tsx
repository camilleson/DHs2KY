import React, { useState, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1607504386708-4176d6542d25?auto=format&fit=crop&q=80&w=800',
];

const SWIPE_THRESHOLD = 50;
const ARROW_RESET_DELAY_MS = 150;

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % IMAGES.length);
  }, []);

  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
    if (isExpanded && mainImageRef.current) {
      mainImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Touch handlers
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
    if (dragOffset < -SWIPE_THRESHOLD) {
      goToNext();
    } else if (dragOffset > SWIPE_THRESHOLD) {
      goToPrev();
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartX.current = null;
  };

  // Mouse handlers (desktop drag)
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
    if (dragOffset < -SWIPE_THRESHOLD) {
      goToNext();
    } else if (dragOffset > SWIPE_THRESHOLD) {
      goToPrev();
    }
    setDragOffset(0);
    setIsDragging(false);
    mouseStartX.current = null;
  };

  const handleMouseLeave = () => {
    if (mouseStartX.current !== null) {
      handleMouseUp();
    }
  };

  return (
    <section className="pt-24 pb-10 bg-[#fcfcfc] fade-in" id="gallery-section">
      <div className="text-center mb-10">
        <h3 className="font-serif text-[18px] tracking-[0.25em] text-[#111]">GALLERY</h3>
      </div>

      <div className="w-full mx-auto">
        {/* Main Image Carousel — 화살표를 양쪽 여백에 배치 */}
        <div
          ref={mainImageRef}
          className="flex items-center justify-center gap-3 mb-8 scroll-mt-24 px-4"
        >
          {/* Prev button — 이미지 왼쪽 여백 */}
          <button
            onPointerDown={() => setPrevPressed(true)}
            onPointerUp={() => { goToPrev(); setTimeout(() => setPrevPressed(false), ARROW_RESET_DELAY_MS); }}
            onPointerLeave={() => setTimeout(() => setPrevPressed(false), ARROW_RESET_DELAY_MS)}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center transition-colors duration-150 drop-shadow-md"
            style={{ color: prevPressed ? '#c9a97a' : '#888' }}
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Image wrapper */}
          <div
            className="relative w-full max-w-[280px] overflow-hidden shadow-sm select-none"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {/* Drag-follow image */}
            <img
              src={IMAGES[selectedIndex]}
              alt={`Gallery ${selectedIndex + 1}`}
              className="w-full h-auto object-cover aspect-[2/3]"
              style={{
                transform: `translateX(${dragOffset}px)`,
                transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              loading="lazy"
              draggable={false}
            />

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); handleSelectImage(index); }}
                  className={`rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? 'w-4 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                  aria-label={`${index + 1}번 사진으로 이동`}
                />
              ))}
            </div>
          </div>

          {/* Next button — 이미지 오른쪽 여백 */}
          <button
            onPointerDown={() => setNextPressed(true)}
            onPointerUp={() => { goToNext(); setTimeout(() => setNextPressed(false), ARROW_RESET_DELAY_MS); }}
            onPointerLeave={() => setTimeout(() => setNextPressed(false), ARROW_RESET_DELAY_MS)}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center transition-colors duration-150 drop-shadow-md"
            style={{ color: nextPressed ? '#c9a97a' : '#888' }}
            aria-label="다음 사진"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Image Counter */}
        <p className="text-center text-[11px] text-gray-400 tracking-widest mb-6 select-none">
          {selectedIndex + 1} / {IMAGES.length}
        </p>

        {/* Thumbnails Container */}
        {!isExpanded ? (
          /* Horizontal Carousel (Default) */
          <div
            className="flex gap-3 overflow-x-auto pb-4 px-6 snap-x max-w-md mx-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {IMAGES.map((src, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-20 aspect-square cursor-pointer overflow-hidden snap-center transition-all ${
                  index === selectedIndex ? 'opacity-100 ring-1 ring-[#c9a97a]' : 'opacity-40 hover:opacity-100'
                }`}
                onClick={() => handleSelectImage(index)}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Grid View (Expanded) */
          <div className="grid grid-cols-3 gap-2 px-6 max-w-md mx-auto mb-4">
            {IMAGES.map((src, index) => (
              <div
                key={index}
                className={`w-full aspect-square cursor-pointer overflow-hidden transition-all ${
                  index === selectedIndex ? 'opacity-100 ring-1 ring-[#c9a97a]' : 'opacity-50 hover:opacity-100'
                }`}
                onClick={() => handleSelectImage(index)}
              >
                <img
                  src={src}
                  alt={`Grid Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Toggle Button */}
        <div className="text-center mt-2">
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (isExpanded && mainImageRef.current) {
                mainImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="inline-flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-800 transition-colors px-4 py-2 tracking-wide"
          >
            {isExpanded ? (
              <>접기 <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>더보기 <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
