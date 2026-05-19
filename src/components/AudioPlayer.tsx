import React, { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play attempt on mount, often blocked by browsers
  useEffect(() => {
    const playAudio = async () => {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.5;
          // Most browsers will block this without user interaction
          // We handle the error gracefully
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {
        console.log("Auto-play blocked by browser, user needs to click play.");
        setIsPlaying(false);
      }
    };
    playAudio();
  }, []);

  // Hide the banner after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

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
      {/* Background Music Banner */}
      <div
        className={`absolute top-0 left-0 w-full h-11 bg-[#777]/80 backdrop-blur-sm flex items-center justify-center z-40 transition-opacity duration-1000 ${showMessage ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <span className="text-white text-[13px] font-sans tracking-wide">
          배경음악이 준비되어 있습니다
        </span>
      </div>

      <div className="absolute top-[6px] right-4 z-50">
        <audio
          ref={audioRef}
          loop
          src="/Frank Sinatra - L.O.V.E. (lyrics).mp3"
        />
        <button
          onClick={togglePlay}
          className={`w-8 h-8 flex items-center justify-center transition-colors bg-transparent border-none outline-none focus:outline-none ${showMessage ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
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
