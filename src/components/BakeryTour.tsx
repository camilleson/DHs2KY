import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

import imgTitle from '../assets/대전빵지순례/제목.png';
import imgLePain from '../assets/대전빵지순례/르뺑99-1.jpg';
import imgSungSimDang from '../assets/대전빵지순례/성심당.jpg';
import imgJeonDong from '../assets/대전빵지순례/정동문화사.jpg';
import imgColmar from '../assets/대전빵지순례/콜마르베이커리.jpg';
import imgHareHare from '../assets/대전빵지순례/하레하레.jpg';
import imgHaruPang from '../assets/대전빵지순례/하루팡.jpg';

const BAKERY_DATA = [
  { src: imgTitle, url: null },
  { src: imgSungSimDang, url: 'https://map.naver.com/p/search/성심당' },
  { src: imgLePain, url: 'https://map.naver.com/p/search/르뺑99-1' },
  { src: imgJeonDong, url: 'https://map.naver.com/p/search/정동문화사' },
  { src: imgColmar, url: 'https://map.naver.com/p/search/콜마르베이커리' },
  { src: imgHareHare, url: 'https://map.naver.com/p/search/하레하레' },
  { src: imgHaruPang, url: 'https://map.naver.com/p/search/하루팡' },
];

export default function BakeryTour() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const prevSlide = () => {
    setSelectedIndex((prev) => (prev === 0 ? BAKERY_DATA.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setSelectedIndex((prev) => (prev === BAKERY_DATA.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="pt-6 pb-10 bg-[#fcfcfc] fade-in">
      <div className="text-center mb-6">
        <h3 className="font-serif text-[18px] tracking-[0.25em] text-[#111]">DAEJEON BAKERY TOUR</h3>
      </div>

      <div className="w-full mx-auto relative px-6">
        <div className="w-full max-w-[350px] mx-auto overflow-hidden shadow-sm relative group rounded-md">
          {/* Main Image Carousel */}
          <div 
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
          >
            {BAKERY_DATA.map((item, index) => (
              <div key={index} className="w-full flex-shrink-0 relative aspect-[4/5]">
                <img 
                  src={item.src} 
                  alt={`Bakery ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[13px] px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5 hover:bg-black/80 transition-colors z-20 whitespace-nowrap"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    지도에서 보기
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors z-30"
            aria-label="이전 이미지"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors z-30"
            aria-label="다음 이미지"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {BAKERY_DATA.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? 'bg-[#111]' : 'bg-gray-300'}`}
              aria-label={`이미지 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
