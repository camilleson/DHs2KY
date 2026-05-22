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

// 둥근 모서리 패스를 그리는 크로스 브라우징 안전 헬퍼 함수
const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radii: [number, number, number, number]
) => {
  const [tl, tr, br, bl] = radii;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  ctx.arcTo(x + width, y, x + width, y + tr, tr);
  ctx.lineTo(x + width, y + height - br);
  ctx.arcTo(x + width, y + height, x + width - br, y + height, br);
  ctx.lineTo(x + bl, y + height);
  ctx.arcTo(x, y + height, x, y + height - bl, bl);
  ctx.lineTo(x, y + tl);
  ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
};

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
        alpha: 0.75, // 0.55에서 0.75로 투명도를 조율하여 몸체와 발끝까지 형태가 선명하게 잘 보이도록 개선
        decay: Math.random() * 0.012 + 0.01, // 서서히 오래 머물며 감상되게 약간 느린 소멸속도
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
        alpha: 0.75, // 0.75로 투명도를 조정해 신랑과 완전히 동일하게 선명한 형태로 보이도록 통일
        decay: Math.random() * 0.012 + 0.01,
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

          ctx.translate(p.x, p.y);
          if (p.rotation !== undefined) {
            ctx.rotate(p.rotation);
          }
          ctx.globalAlpha = p.alpha; // 시간의 경과에 따른 페이드아웃 감폭 반영
          
          if (p.type === 'bride') {
            ctx.scale(-1, 1);
          }

          // 아랫부분 잘린 단면이 부드러운 곡선이 되도록 하단에 14px 래디어스 클리핑 처리
          // 위(얼굴)는 춘식이의 머리/귀 고유 실루엣을 보존하도록 2px만 깎고, 아래는 14px 래디어스 적용
          ctx.save();
          drawRoundedRect(ctx, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight, [2, 2, 14, 14]);
          ctx.clip();

          ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          ctx.restore();
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
