import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

// 부드러운 분위기를 깨지 않는 은은하고 화사한 파스텔 빛 노랑, 보라, 빨강(로즈), 초록(민트)
const PASTEL_COLORS = [
  'hsla(52, 100%, 82%, 1)',   // 파스텔 노랑
  'hsla(275, 100%, 88%, 1)',  // 파스텔 보라
  'hsla(355, 100%, 86%, 1)',  // 파스텔 빨강 (로즈 핑크)
  'hsla(145, 80%, 86%, 1)'    // 파스텔 초록 (민트)
];

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
        });
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // 마우스/터치 스크린 좌표 캡처
      createParticles(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown);

    const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      
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
        
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          drawParticle(ctx, p);
        }
      }
      
      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

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
