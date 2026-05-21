import React, { useEffect, useState } from 'react';
import FireworkOverlay from './FireworkOverlay';

export default function Calendar() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  // October 2026 starts on Thursday (index 4)
  const blanks = Array(4).fill(null); 
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const allDays = [...blanks, ...dates];

  const [dDay, setDDay] = useState(0);
  const [showFirework, setShowFirework] = useState(false);

  useEffect(() => {
    const weddingDate = new Date('2026-10-17T15:00:00+09:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;
    const daysLeft = Math.ceil(distance / (1000 * 60 * 60 * 24));
    setDDay(daysLeft > 0 ? daysLeft : 0);
  }, []);

  const handleFireworkClick = () => {
    // 이미 켜져 있다면 잠깐 껐다가(reset) 다시 켜서 연속 발사가 원활하게 작동하도록 처리
    setShowFirework(false);
    setTimeout(() => {
      setShowFirework(true);
    }, 50);
  };

  return (
    <section className="pt-14 pb-20 bg-[#F6F6F6] fade-in border-t border-gray-100 relative">
      {/* 폭죽 오버레이 컴포넌트 */}
      <FireworkOverlay isActive={showFirework} onClose={() => setShowFirework(false)} />

      <div className="text-center mb-8">
        <h3 className="font-serif text-[18px] tracking-[0.25em] text-[#111]">WEDDING DAY</h3>
      </div>

      <div className="text-center font-sans text-[15px] text-[#444] tracking-wide mb-8">
        2026년 10월 17일 토요일 오후 3시 00분
      </div>

      <div className="px-10 max-w-[360px] mx-auto">
        <div className="text-center mb-6 font-sans text-[17px] tracking-[0.2em] text-[#333]">
          Oct.
        </div>
        
        <div className="grid grid-cols-7 gap-y-2 text-center font-sans">
          {days.map((day, idx) => (
            <div key={`header-${idx}`} className={`text-[13px] ${idx === 0 ? 'text-[#ff6b6b]' : 'text-[#333]'}`}>
              {day}
            </div>
          ))}
          {allDays.map((date, idx) => {
            const isWeddingDay = date === 17;
            return (
              <div key={`date-${idx}`} className="flex justify-center items-center h-7 relative">
                {isWeddingDay && (
                  <div className="absolute inset-0 bg-[#999] rounded-full shadow-md scale-110"></div>
                )}
                <span className={`relative z-10 text-[14px] ${
                  isWeddingDay ? 'text-white font-medium' : 
                  !date ? '' : 
                  'text-[#555] font-light'
                }`}>
                  {date || ''}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center flex flex-col items-center gap-4">
          <p className="font-sans text-[14px] tracking-wide text-[#555]">
            결혼식이 <span className="font-bold text-[#b49071]">{dDay}일</span> 남았습니다.
          </p>
          
          <button
            onClick={handleFireworkClick}
            className="mt-2 px-6 py-3 bg-[#f5ebe0] text-[#8e7f70] font-sans font-medium text-[13px] rounded-full shadow-[0_4px_12px_rgba(245,235,224,0.4)] hover:bg-[#e3d5ca] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 tracking-wide cursor-pointer outline-none border-none"
          >
            <span className="text-[16px]">🎉</span> 축하 폭죽 쏘기
          </button>
        </div>
      </div>
    </section>
  );
}
