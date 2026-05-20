import React, { useState, useEffect, useRef } from 'react';
import diveAudio from '../assets/Dive.mp3';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 3.5초 후 배경음악 안내 배너 사라짐
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // 자동재생 시도 (브라우저 정책 우회)
  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current || isPlaying || isManuallyPaused) return;
      
      try {
        audioRef.current.volume = 0.5;
        await audioRef.current.play();
        setIsPlaying(true);
        
        // 재생 성공 시 이벤트 리스너 제거
        window.removeEventListener('click', playAudio);
        window.removeEventListener('touchstart', playAudio);
        window.removeEventListener('scroll', playAudio);
      } catch (err) {
        // 브라우저가 아직 상호작용을 요구함
      }
    };

    if (!isManuallyPaused) {
      // 1. 마운트 시 즉시 시도
      playAudio();

      // 2. 사용자의 첫 상호작용 시 자동재생 시도 (클릭, 터치, 스크롤)
      window.addEventListener('click', playAudio, { passive: true });
      window.addEventListener('touchstart', playAudio, { passive: true });
      window.addEventListener('scroll', playAudio, { passive: true });
    }

    return () => {
      window.removeEventListener('click', playAudio);
      window.removeEventListener('touchstart', playAudio);
      window.removeEventListener('scroll', playAudio);
    };
  }, [isPlaying, isManuallyPaused]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsManuallyPaused(true); // 사용자가 직접 멈춤
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setIsManuallyPaused(false); // 사용자가 다시 재생시킴
      }
    }
  };

  return (
    <>
      {/* 배경음악 안내 배너 - 3.5초 후 사라짐 */}
      <div
        className={`absolute top-0 left-0 w-full h-11 bg-[#777]/80 backdrop-blur-sm flex items-center justify-center z-40 transition-opacity duration-1000 ${
          showMessage ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
          autoPlay
          src={diveAudio}
        />
        <button
          onClick={togglePlay}
          className={`w-8 h-8 flex items-center justify-center transition-colors bg-transparent border-none outline-none focus:outline-none ${
            showMessage ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'
          }`}
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
