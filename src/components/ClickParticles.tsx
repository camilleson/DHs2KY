import React, { useEffect, useRef } from 'react';
import groomMiniImg from '../assets/미니춘식신랑.png';
import brideMiniImg from '../assets/미니춘식신부.png';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color?: string;
  size: number;
  alpha: number;
  decay: number;
  type: 'pastel' | 'groom' | 'bride';
  rotation?: number;
  rotationSpeed?: number;
}

// 부드러운 분위기를 깨지 않는 은은하고 화사한 파스텔 빛 노랑, 보라, 빨강(로즈), 초록(민트)
const PASTEL_COLORS = [
  'hsla(52, 100%, 82%, 1)',   // 파스텔 노랑
  'hsla(275, 100%, 88%, 1)',  // 파스텔 보라
  'hsla(355, 100%, 86%, 1)',  // 파스텔 빨강 (로즈 핑크)
  'hsla(145, 80%, 86%, 1)'    // 파스텔 초록 (민트)
];

// 미니 춘식 이미지 미리 로드해두기 (클릭 시 딜레이 방지)
const groomImage = new Image();
groomImage.src = groomMiniImg;

const brideImage = new Image();
brideImage.src = brideMiniImg;

export default function ClickParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 클릭/터치 지점에 폭죽 생성
    const createParticles = (x: number, y: number) => {
      const count = 12; // 가벼운 느낌을 주는 최적의 파티클 수
      
      // 1. 일반 파스텔 파티클 생성
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.6 + 1.2; // 흩날리는 속도
        const size = Math.random() * 6 + 4; // 4px ~ 10px 사이의 크기
        const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
        
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2, // 폭발 시 살짝 윗방향 팝핑 효과
          color,
          size,
          alpha: 1.0,
          decay: Math.random() * 0.025 + 0.02, // 0.02 ~ 0.045 사이의 자연스러운 소멸 속도
          type: 'pastel'
        });
      }

      // 2. 최대한 작고 희미한 미니 춘식 신랑 생성 (1개)
      const angleGroom = Math.random() * Math.PI * 2;
      const speedGroom = Math.random() * 1.5 + 1.2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angleGroom) * speedGroom,
        vy: Math.sin(angleGroom) * speedGroom - 1.6, // 가볍게 솟구침
        size: 48, // 기존 32에서 48로 한층 더 키워 시각적 존재감과 매력을 대폭 보강
        alpha: 0.85, // 초기 선명도를 0.55에서 0.85로 크게 상향 조정하여 한층 더 또렷하게 보이도록 개선
        decay: Math.random() * 0.01 + 0.008, // 소멸 감폭 속도를 약간 늦춰 화면에 좀 더 진하게 오래 머물게 함
        type: 'groom',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.06 // 날아가며 살짝 돌아가는 디테일
      });

      // 3. 최대한 작고 희미한 미니 춘식 신부 생성 (1개)
      const angleBride = Math.random() * Math.PI * 2;
      const speedBride = Math.random() * 1.5 + 1.2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angleBride) * speedBride,
        vy: Math.sin(angleBride) * speedBride - 1.6,
        size: 48, // 기존 32에서 48로 한층 더 키워 시각적 존재감 보강
        alpha: 0.85, // 0.85로 상향 조정
        decay: Math.random() * 0.01 + 0.008, // 소멸 감폭 속도 조정
        type: 'bride',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.06
      });
    };

    const handlePointerDown = (e: PointerEvent) => {
      // 마우스/터치 스크린 좌표 캡처
      createParticles(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown);

    const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      
      if (p.type === 'pastel' && p.color) {
        // 번지듯이 몽환적인 둥근 폭죽 알갱이를 위해 Radial Gradient 사용
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        const colorWithAlpha = p.color.replace('1)', `${p.alpha})`);
        
        grad.addColorStop(0, colorWithAlpha);
        grad.addColorStop(0.5, colorWithAlpha.replace(`${p.alpha})`, `${p.alpha * 0.6})`));
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'groom' || p.type === 'bride') {
        const img = p.type === 'groom' ? groomImage : brideImage;
        // 이미지가 로드된 상태에서만 렌더링
        if (img.complete && img.naturalWidth !== 0) {
          // 캐릭터 고유 비율(종횡비)에 맞춰 드로잉 스케일링 (세로 높이 기준으로 가로 비율 계산)
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const drawHeight = p.size;
          const drawWidth = p.size * aspectRatio;

          // 얼굴(위)은 진하게, 아랫부분(아래)은 아주 조금 더 희미하게 그라데이션 마스크 적용
          const offCanvas = document.createElement('canvas');
          offCanvas.width = drawWidth;
          offCanvas.height = drawHeight;
          const offCtx = offCanvas.getContext('2d');

          if (offCtx) {
            // 1. 임시 캔버스에 춘식이 원본 이미지 그리기
            offCtx.drawImage(img, 0, 0, drawWidth, drawHeight);

            // 2. 합성 모드를 destination-in으로 설정하여 투명도 깎아내기 마스킹 진행
            offCtx.globalCompositeOperation = 'destination-in';

            // 3. 위(얼굴)는 선명하고 아래(발)는 희미한 세로 선형 그라데이션 생성
            const maskGrad = offCtx.createLinearGradient(0, 0, 0, drawHeight);
            maskGrad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');    // 머리 정수리 선명하게
            maskGrad.addColorStop(0.4, 'rgba(0, 0, 0, 1.0)');  // 눈코입이 있는 얼굴 영역까지 또렷하게 유지
            maskGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.45)'); // 아랫부분 드레스와 다리 부근 농도를 25%에서 45%로 높여 너무 흐리지 않게 보정

            offCtx.fillStyle = maskGrad;
            offCtx.fillRect(0, 0, drawWidth, drawHeight);

            // 4. 메인 캔버스에 회전, 가로 반전(신부), 투명도를 적용하여 최종 드로잉
            ctx.translate(p.x, p.y);
            if (p.rotation !== undefined) {
              ctx.rotate(p.rotation);
            }
            ctx.globalAlpha = p.alpha; // 시간의 경과에 따른 페이드아웃 감폭 반영
            
            if (p.type === 'bride') {
              ctx.scale(-1, 1);
            }

            ctx.drawImage(offCanvas, -drawWidth / 2, -drawHeight / 2);
          }
        }
      }
      
      ctx.restore();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // 물리 좌표 및 마찰 감쇠
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // 부드러운 중력 낙하
        p.vx *= 0.97; // 공기 저항 감폭
        p.vy *= 0.97;
        
        p.alpha -= p.decay; // 페이드 아웃
        
        // 춘식이 파티클 회전 업데이트
        if ((p.type === 'groom' || p.type === 'bride') && p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }
        
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          drawParticle(ctx, p);
        }
      }
      
      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    const updateAndDrawId = requestAnimationFrame(updateAndDraw);
    animationFrameId = updateAndDrawId;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'multiply' }} // 배경과 자연스러운 투명도 블렌딩을 위함
    />
  );
}
