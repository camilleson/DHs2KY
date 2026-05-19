import React, { useEffect, useState } from 'react';

export default function Calendar() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  // October 2026 starts on Thursday (index 4)
  const blanks = Array(4).fill(null); 
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const allDays = [...blanks, ...dates];

  const [dDay, setDDay] = useState(0);

  useEffect(() => {
    const weddingDate = new Date('2026-10-17T15:00:00+09:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;
    const daysLeft = Math.ceil(distance / (1000 * 60 * 60 * 24));
    setDDay(daysLeft > 0 ? daysLeft : 0);
  }, []);

  return (
    <section className="py-24 bg-[#F6F6F6] fade-in border-t border-gray-100">
      <div className="text-center mb-8">
        <h3 className="font-serif text-[18px] tracking-[0.25em] text-[#111]">WEDDING DAY</h3>
      </div>

      <div className="text-center font-sans text-[15px] text-[#444] tracking-wide mb-14">
        2026년 10월 17일 토요일 오후 3시 00분
      </div>

      <div className="px-10 max-w-[360px] mx-auto">
        <div className="text-center mb-6 font-sans text-[17px] tracking-[0.2em] text-[#333]">
          Oct.
        </div>
        
        <div className="grid grid-cols-7 gap-y-6 text-center font-sans">
          {days.map((day, idx) => (
            <div key={`header-${idx}`} className={`text-[13px] ${idx === 0 ? 'text-[#ff6b6b]' : 'text-[#333]'}`}>
              {day}
            </div>
          ))}
          {allDays.map((date, idx) => {
            const isWeddingDay = date === 17;
            return (
              <div key={`date-${idx}`} className="flex justify-center items-center h-8 relative">
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
        
        <div className="mt-14 pt-8 border-t border-gray-100 text-center">
          <p className="font-sans text-[14px] tracking-wide text-[#555]">
            결혼식이 <span className="font-bold text-[#b49071]">{dDay}일</span> 남았습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
