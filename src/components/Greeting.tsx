import React, { useState } from 'react';
import { Phone, Mail, X } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';
import invitationBg from '../assets/invitation.jpg';

const DEFAULT_GREETING = `봄날의 햇살처럼 따뜻하고,
가을의 바람처럼 편안한 사람을 만났습니다.

함께 걷는 길, 때로는 비바람이 불어도
서로의 온기로 꼭 안아주며 평생을 함께하겠습니다.

부부라는 이름의 첫 시작,
그 설렘의 순간에 소중한 분들을 초대합니다.`;

export default function Greeting() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { config } = useConfig();
  
  const greetingText = config?.greetingMessage || DEFAULT_GREETING;

  return (
    <section className="relative py-14 px-6 text-center fade-in">
      {/* Background Image with top fade-in transition */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url(${invitationBg})`,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
        }}
      ></div>
      {/* Light overlay to ensure text is readable against the background */}
      <div className="absolute inset-0 bg-white/40 z-0 mix-blend-overlay"></div>

      <div className="relative z-10 mb-12">
        <h3 className="font-serif text-[22px] tracking-[0.15em] text-[#111]">INVITATION</h3>
      </div>
      
      <div className="relative z-10 font-sans text-[13px] leading-[1.9] text-[#444] mb-10 tracking-wide whitespace-pre-wrap">
        {greetingText}
      </div>

      <div className="relative z-10 flex flex-col gap-5 items-center font-sans text-[16px] mb-16">
        <div className="flex items-center gap-3">
          <span className="text-[#333] font-medium">남택천 · 손향남</span>
          <span className="text-[14px] text-[#888]">의</span>
          <span className="text-[14px] text-[#888] mr-1">장남</span>
          <span className="font-bold text-[#111] text-[17px]">남동호</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#333] font-medium">손중만 · 장옥화</span>
          <span className="text-[14px] text-[#888]">의</span>
          <span className="text-[14px] text-[#888] mr-1">장녀</span>
          <span className="font-bold text-[#111] text-[17px]">손가영</span>
        </div>
      </div>

      <button 
        onClick={() => setIsContactModalOpen(true)}
        className="relative z-10 bg-[#f4f4f4] text-[#555] font-sans text-[15px] py-4 px-12 rounded-sm tracking-widest hover:bg-[#eaeaea] transition-colors"
      >
        축하 연락하기
      </button>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-md shadow-xl overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h4 className="font-sans font-medium text-[16px] text-[#111]">축하 연락하기</h4>
              <button onClick={() => setIsContactModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex p-5">
              {/* Groom Side */}
              <div className="flex-1 flex flex-col items-center border-r border-gray-100 pr-2">
                <h5 className="font-sans font-medium text-[15px] mb-6 text-[#111]">신랑측</h5>
                
                <div className="w-full flex flex-col gap-6">
                  <div className="text-center">
                    <p className="text-[14px] text-[#666] mb-3"><span className="text-[#888] text-[13px] mr-1">신랑</span> 남동호</p>
                    <div className="flex justify-center gap-4">
                      <a href="tel:01031437732" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Phone size={18} /></a>
                      <a href="sms:01031437732" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Mail size={18} /></a>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[14px] text-[#666] mb-3"><span className="text-[#888] text-[13px] mr-1">아버님</span> 남택천</p>
                    <div className="flex justify-center gap-4">
                      <a href="tel:01084888407" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Phone size={18} /></a>
                      <a href="sms:01084888407" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Mail size={18} /></a>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[14px] text-[#666] mb-3"><span className="text-[#888] text-[13px] mr-1">어머님</span> 손향남</p>
                    <div className="flex justify-center gap-4">
                      <a href="tel:01028405496" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Phone size={18} /></a>
                      <a href="sms:01028405496" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Mail size={18} /></a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bride Side */}
              <div className="flex-1 flex flex-col items-center pl-2">
                <h5 className="font-sans font-medium text-[15px] mb-6 text-[#111]">신부측</h5>
                
                <div className="w-full flex flex-col gap-6">
                  <div className="text-center">
                    <p className="text-[14px] text-[#666] mb-3"><span className="text-[#888] text-[13px] mr-1">신부</span> 손가영</p>
                    <div className="flex justify-center gap-4">
                      <a href="tel:01023870509" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Phone size={18} /></a>
                      <a href="sms:01023870509" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Mail size={18} /></a>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[14px] text-[#666] mb-3"><span className="text-[#888] text-[13px] mr-1">아버님</span> 손중만</p>
                    <div className="flex justify-center gap-4">
                      <a href="tel:01095530388" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Phone size={18} /></a>
                      <a href="sms:01095530388" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Mail size={18} /></a>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[14px] text-[#666] mb-3"><span className="text-[#888] text-[13px] mr-1">어머님</span> 장옥화</p>
                    <div className="flex justify-center gap-4">
                      <a href="tel:01042250388" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Phone size={18} /></a>
                      <a href="sms:01042250388" className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><Mail size={18} /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-4"></div>
          </div>
        </div>
      )}
    </section>
  );
}

