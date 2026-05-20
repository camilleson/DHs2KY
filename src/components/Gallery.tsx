import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const IMAGES = [
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1607504386708-4176d6542d25?auto=format&fit=crop&q=80&w=800',
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
    // 선택 시 위쪽 메인 사진으로 부드럽게 스크롤
    if (isExpanded && mainImageRef.current) {
      mainImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="pt-24 pb-10 bg-[#fcfcfc] fade-in" id="gallery-section">
      <div className="text-center mb-10">
        <h3 className="font-serif text-[18px] tracking-[0.25em] text-[#111]">GALLERY</h3>
      </div>

      <div className="w-full mx-auto">
        {/* Main Image */}
        <div ref={mainImageRef} className="w-full max-w-[300px] mx-auto mb-8 overflow-hidden shadow-sm scroll-mt-24">
          <img 
            src={IMAGES[selectedIndex]} 
            alt={`Gallery ${selectedIndex + 1}`} 
            className="w-full h-auto object-cover aspect-[2/3] transition-opacity duration-300"
            loading="lazy"
          />
        </div>

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
                  index === selectedIndex ? 'opacity-100 ring-1 ring-gray-400' : 'opacity-40 hover:opacity-100'
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
                  index === selectedIndex ? 'opacity-100 ring-2 ring-gray-400' : 'opacity-50 hover:opacity-100'
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
                // 접을 때도 메인 이미지 쪽으로 화면을 유지
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

