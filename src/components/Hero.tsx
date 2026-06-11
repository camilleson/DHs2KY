import React, { useState, useEffect } from 'react';
import FlowerParticles from './FlowerParticles';
import { useConfig } from '../hooks/useConfig';

export default function Hero() {
  const { config } = useConfig();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Only show image after config is loaded — no fallback to avoid flash of wrong image
  const mainImage = config?.mainPhoto ?? null;
  const isNoEffect = config?.mainBackgroundPhoto === 'none';
  const bgImage = isNoEffect ? mainImage : (config?.mainBackgroundPhoto || '/main-texture4.png');

  useEffect(() => {
    if (mainImage) {
      setImageLoaded(false);
      const img = new Image();
      img.src = mainImage;
      img.onload = () => {
        setImageLoaded(true);
      };
    }
  }, [mainImage]);

  useEffect(() => {
    if (bgImage) {
      setBgLoaded(false);
      const img = new Image();
      img.src = bgImage;
      img.onload = () => {
        setBgLoaded(true);
      };
    }
  }, [bgImage]);

  return (
    <section
      className="relative w-full min-h-[100vh] flex flex-col justify-between items-center py-10 overflow-hidden"
    >
      {/* Background Image with Fade */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out z-[-1] ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url("${bgImage}")` }}
      ></div>

      <FlowerParticles />
      {/* Subtle Noise Background overlaying the texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      {/* Top Name */}
      {!config?.hideHeroText && (
        <div className="z-10 w-full text-center fade-in pt-2">
          <h1 
            className="font-cursive font-light tracking-wide inline-block" 
            style={{ 
              color: config?.heroTextColor || '#333333',
              fontSize: `calc(clamp(36px, 10vw, 50px) * ${config?.heroTextScale || 1})`,
              transform: `translate(${config?.heroTopNameX || 0}px, ${config?.heroTopNameY || 0}px)`
            }}
          >
            {config?.heroTopName || 'Dongho'}
          </h1>
        </div>
      )}

      {/* Center Image — only render once config is loaded */}
      <div className="z-10 w-[85%] max-w-[380px] aspect-[4/5] relative my-2 mx-auto">
        {mainImage && !isNoEffect && (
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url('${mainImage}')`,
              maskImage: 'radial-gradient(55% 55%, black 70%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(55% 55%, black 70%, transparent 90%)'
            }}
          ></div>
        )}
      </div>

      {/* Bottom Name */}
      {!config?.hideHeroText && (
        <div className="z-10 w-full text-center fade-in pt-2 pb-10">
          <h1 
            className="font-cursive font-light tracking-wide inline-block" 
            style={{ 
              color: config?.heroTextColor || '#333333',
              fontSize: `calc(clamp(36px, 10vw, 50px) * ${config?.heroTextScale || 1})`,
              transform: `translate(${config?.heroBottomNameX || 0}px, ${config?.heroBottomNameY || 0}px)`
            }}
          >
            {config?.heroBottomName || 'Kayoung'}
          </h1>
        </div>
      )}

      {/* Details at Bottom */}
      <div className="z-10 w-full px-8 flex justify-between items-end fade-in mt-auto pb-6 whitespace-nowrap" style={{ color: config?.heroBottomTextColor || '#000000' }}>
        <div className="text-left">
          <p className="font-sans text-[clamp(10px,3vw,12px)] tracking-widest font-bold mb-1 whitespace-nowrap">
            THE BMK WEDDING
          </p>
          <p className="font-sans text-[clamp(10px,3vw,12px)] tracking-widest font-bold whitespace-nowrap">
            ASTIN HALL
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-[clamp(10px,3vw,12px)] tracking-widest font-bold mb-1 whitespace-nowrap">
            2026. 10. 17 SAT
          </p>
          <p className="font-sans text-[clamp(10px,3vw,12px)] tracking-widest font-bold whitespace-nowrap">
            03:00 PM
          </p>
        </div>
      </div>

      {/* Smooth bottom white gradient overlay to dissolve into Greeting section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-0"></div>
    </section>
  );
}
