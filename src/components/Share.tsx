import React, { useEffect } from 'react';
import { useConfig } from '../hooks/useConfig';

const SITE_URL = 'https://dh-s2-ky.vercel.app';

export default function Share() {
  const { config } = useConfig();

  // Initialize Kakao SDK if needed (assuming app key is available)
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // Replace with actual Kakao JS key if you want real sharing
      window.Kakao.init('0d274d521eb3cd12878dce5d82b6fcac');
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('링크가 복사되었습니다.');
    }).catch(() => {
      alert('링크 복사에 실패했습니다.');
    });
  };

  const KAKAO_TEMPLATE_ID = 133307;

  const handleKakaoShare = () => {
    if (window.Kakao) {
      try {
        // Use the dynamic mainPhoto from config if available, else fallback
        const thumbUrl = config?.kakaoThumbnail
          ? `${SITE_URL}${config.kakaoThumbnail}`
          : config?.mainPhoto
            ? `${SITE_URL}${config.mainPhoto}`
            : `${SITE_URL}/images/gallery/main.png`;

        window.Kakao.Share.sendCustom({
          templateId: KAKAO_TEMPLATE_ID,
          templateArgs: {
            THU: thumbUrl,
            SR1: SITE_URL,
            SR2: `${SITE_URL}/map`,
          },
        });
      } catch (error) {
        alert('카카오톡 공유하기 설정이 필요합니다.');
      }
    } else {
      alert('카카오톡 공유 기능을 불러오지 못했습니다.');
    }
  };

  return (
    <section className="pb-24 pt-10 bg-[#fcfcfc] px-6 fade-in">
      <div className="max-w-[360px] mx-auto flex flex-col gap-3">
        <button
          onClick={handleCopyLink}
          className="w-full py-4 bg-[#f4f4f4] text-[#333] text-[15px] font-sans font-medium rounded-sm hover:bg-[#eaeaea] transition-colors"
        >
          공유하기 (링크 복사)
        </button>
        <button
          onClick={handleKakaoShare}
          className="w-full py-4 bg-[#f4f4f4] text-[#333] text-[15px] font-sans font-medium rounded-sm hover:bg-[#eaeaea] transition-colors"
        >
          카카오톡 공유하기
        </button>
      </div>
    </section>
  );
}
