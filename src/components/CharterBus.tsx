import React from 'react';
import { useConfig } from '../hooks/useConfig';

export default function CharterBus() {
  const { config } = useConfig();
  const busConfig = config?.charterBus;

  // 비활성화 설정된 경우 렌더링하지 않음 (기본값은 true)
  if (busConfig?.enabled === false) {
    return null;
  }

  const title = busConfig?.title !== undefined ? busConfig.title : '전세버스 안내';
  const subtitle = busConfig?.subtitle !== undefined ? busConfig.subtitle : '멀리서 귀한 걸음 해주시는 하객 여러분께서\n편히 오실 수 있도록 전세버스를 마련하였습니다.';
  
  const departureLabel = busConfig?.departureTimeLabel || '[출발일시]';
  const departureTime = busConfig?.departureTime !== undefined ? busConfig.departureTime : '0000년 0월 0일(0요일)\n오전 00시 00분 출발';
  
  const boardingLabel = busConfig?.boardingPlaceLabel || '[탑승장소]';
  const boardingPlace = busConfig?.boardingPlace !== undefined ? busConfig.boardingPlace : '00시 00구 00역 0번 출구 앞';
  
  const returnLabel = busConfig?.returnTimeLabel || '[복귀일시]';
  const returnTime = busConfig?.returnTime !== undefined ? busConfig.returnTime : '예식 종료 후 오후 00시 00분 출발 예정';
  
  const busNumberLabel = busConfig?.busNumberLabel || '[차량번호]';
  const busNumber = busConfig?.busNumber !== undefined ? busConfig.busNumber : '전세버스 〇〇〇〇호';
  
  const notes = busConfig?.notes !== undefined ? busConfig.notes : '* 출발 10분 전 도착 부탁드립니다.\n* 정시 출발로 늦을 시 탑승이 불가할 수 있습니다.\n* 복귀 시간은 현장 사정에 따라 조정될 수 있습니다.';

  const showDeparture = busConfig?.departureTimeEnabled !== false && departureTime;
  const showBoarding = busConfig?.boardingPlaceEnabled !== false && boardingPlace;
  const showReturn = busConfig?.returnTimeEnabled !== false && returnTime;
  const showBusNumber = busConfig?.busNumberEnabled !== false && busNumber;
  const showNotes = busConfig?.notesEnabled !== false && notes;

  return (
    <section className="pt-8 pb-12 bg-white fade-in px-5 sm:px-6">
      <div className="max-w-[380px] mx-auto bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 relative shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow">
        {/* 카드 헤더 (제목 & 서브문구) */}
        {(title || subtitle) && (
          <div className="text-center mb-7">
            {title && (
              <h4 className="font-sans font-bold text-[19px] text-[#222] mb-3.5 tracking-tight">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="font-sans text-[14.5px] text-[#555] leading-[1.7] whitespace-pre-line">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* 상세 안내 목록 */}
        <div className="font-sans text-[14.5px] text-[#333] space-y-4">
          {showDeparture && (
            <div>
              <p className="font-medium text-[#222] text-[15px] mb-1">{departureLabel}</p>
              <p className="text-[#444] leading-relaxed whitespace-pre-line">{departureTime}</p>
            </div>
          )}

          {showBoarding && (
            <div>
              <p className="font-medium text-[#222] text-[15px] mb-1">{boardingLabel}</p>
              <p className="text-[#444] leading-relaxed whitespace-pre-line">{boardingPlace}</p>
            </div>
          )}

          {showReturn && (
            <div>
              <p className="font-medium text-[#222] text-[15px] mb-1">{returnLabel}</p>
              <p className="text-[#444] leading-relaxed whitespace-pre-line">{returnTime}</p>
            </div>
          )}

          {showBusNumber && (
            <div>
              <p className="font-medium text-[#222] text-[15px] mb-1">{busNumberLabel}</p>
              <p className="text-[#444] leading-relaxed whitespace-pre-line">{busNumber}</p>
            </div>
          )}

          {showNotes && (
            <div className="pt-2">
              <p className="text-[13.5px] text-[#666] leading-[1.8] whitespace-pre-line">
                {notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
