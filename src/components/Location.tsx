import React from 'react';

export default function Location() {
  return (
    <section className="pt-12 pb-10 bg-white fade-in">
      <div className="text-center mb-10">
        <h3 className="font-serif text-[18px] tracking-[0.25em] text-[#111]">LOCATION</h3>
      </div>

      <div className="text-center px-6 mb-8">
        <h4 className="font-sans font-bold text-[18px] text-[#222] mb-2 tracking-wide">The BMK 컨벤션 웨딩홀</h4>
        <p className="font-sans text-[14px] text-[#555] mb-1">4층 아스틴홀</p>
        <p className="font-sans text-[14px] text-[#777]">대전 중구 서문로 133</p>
      </div>

      {/* Map Area */}
      <div className="px-6 mb-8">
        <div className="w-full h-64 bg-[#f4f4f4] rounded-lg overflow-hidden border border-gray-100">
          <iframe 
            src="https://maps.google.com/maps?q=36.319964,127.4054838&hl=ko&z=16&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          ></iframe>
        </div>
      </div>

      {/* Transport Info */}
      <div className="px-6 text-[14px] text-[#555] font-sans leading-relaxed space-y-6 mb-10">
        <div>
          <h5 className="font-bold text-[#222] mb-2 text-[15px]">지하철</h5>
          <p>1호선 서대전네거리역 2번 출구에서</p>
          <p>도보 10분 내외</p>
        </div>
        <div>
          <h5 className="font-bold text-[#222] mb-2 text-[15px]">버스</h5>
          <p>간선버스 201, 202, 314, 613 (서대전역 하차)</p>
        </div>
        <div>
          <h5 className="font-bold text-[#222] mb-2 text-[15px]">주차</h5>
          <p>The BMK 컨벤션 웨딩홀 전용 주차장 이용</p>
        </div>
      </div>

      {/* Map Buttons */}
      <div className="px-6 flex gap-2">
        <a 
          href="https://map.naver.com/p/search/thebmk/place/33794156?c=15.00,0,0,3,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202605191109&locale=ko&svcName=map_pcv5&searchText=thebmk"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-[#f8f9fa] rounded-md text-center text-[13px] font-sans text-[#444] border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <span className="w-4 h-4 bg-green-500 rounded-full text-white font-bold text-[10px] flex items-center justify-center">N</span>
          네이버 지도
        </a>
        <a 
          href="https://map.kakao.com/?urlX=590939.0000000012&urlY=784024.9999999977&urlLevel=3&itemId=22301957&q=%EB%8D%94BMK%EC%BB%A8%EB%B2%A4%EC%85%98&srcid=22301957&map_type=TYPE_MAP"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-[#f8f9fa] rounded-md text-center text-[13px] font-sans text-[#444] border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <span className="w-4 h-4 bg-yellow-400 rounded-sm text-yellow-900 font-bold text-[10px] flex items-center justify-center">K</span>
          카카오맵
        </a>
      </div>
    </section>
  );
}

