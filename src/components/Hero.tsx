import React from 'react';

export default function Hero() {
  return (
    <section
      className="relative w-full min-h-[100svh] flex flex-col justify-between items-center py-10 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("/main-texture4.png")' }}
    >
      {/* Subtle Noise Background overlaying the texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      {/* Top Name */}
      <div className="z-10 w-full text-center fade-in pt-12">
        <h1 className="font-cursive text-[clamp(36px,10vw,50px)] text-[#333333] font-light tracking-wide">
          Dongho
        </h1>
      </div>

      {/* Center Image */}
      <div className="z-10 w-[85%] max-w-[380px] aspect-[4/5] relative my-2 fade-in mx-auto">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/hero-photo2.png")',
            maskImage: 'radial-gradient(55% 55%, black 70%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(55% 55%, black 70%, transparent 90%)'
          }}
        ></div>
      </div>

      {/* Bottom Name */}
      <div className="z-10 w-full text-center fade-in pb-10">
        <h1 className="font-cursive text-[clamp(36px,10vw,50px)] text-[#333333] font-light tracking-wide">
          Kayoung
        </h1>
      </div>

      {/* Details at Bottom */}
      <div className="z-10 w-full px-8 flex justify-between items-end fade-in mt-auto pb-2 whitespace-nowrap">
        <div className="text-left">
          <p className="font-sans text-[13.5px] tracking-widest text-black font-bold mb-1 whitespace-nowrap">
            THE BMK WEDDING
          </p>
          <p className="font-sans text-[13.5px] tracking-widest text-black font-bold whitespace-nowrap">
            ASTIN HALL
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-[13.5px] tracking-widest text-black font-bold mb-1 whitespace-nowrap">
            2026. 10. 17 SAT
          </p>
          <p className="font-sans text-[13.5px] tracking-widest text-black font-bold whitespace-nowrap">
            03:00 PM
          </p>
        </div>
      </div>
    </section>
  );
}
