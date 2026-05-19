import React, { useState, useRef } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <div className="absolute top-[6px] right-4 z-50">
        <audio
          ref={audioRef}
          loop
          src="/Frank Sinatra - L.O.V.E. (lyrics).mp3"
        />
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center transition-colors bg-transparent border-none outline-none focus:outline-none text-gray-400 hover:text-gray-600"
        >
          {isPlaying ? (
            <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
