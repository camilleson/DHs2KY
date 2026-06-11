import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spin: number;
  opacity: number;
  blur: number;
}

export default function FlowerParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const petals: Petal[] = [];
    // 모바일 기기 성능 최적화를 위해 적절한 갯수(25개) 유지
    const maxPetals = 25; 

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 꽃잎 속성 생성기
    const createPetal = (isInitial = false): Petal => {
      const w = canvas.width;
      const h = canvas.height;
      
      const size = Math.random() * 8 + 7; // 7px ~ 15px
      return {
        x: Math.random() * w,
        // 처음 마운트 될 때는 화면 전체에 흩뿌려진 상태로 시작, 그 이후엔 위쪽에서 서서히 젠(spawn)됨
        y: isInitial ? Math.random() * h : -20,
        size,
        speedY: Math.random() * 0.7 + 0.9, // 낙하 속도 약간 상향 (0.9 ~ 1.6)
        speedX: Math.random() * 0.5 - 0.25, // 가로 흔들림 약간 상향
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() * 0.015 - 0.0075) * Math.PI, // 회전 속도
        opacity: Math.random() * 0.45 + 0.35, // 0.35 ~ 0.8 사이의 은은한 반투명도
        blur: size > 11 ? 1 : 0, 
      };
    };

    // 초기 꽃잎 리스트 빌드
    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    const drawPetal = (ctx: CanvasRenderingContext2D, petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.angle);
      
      // y축 기준 스케일을 angle 회전각에 바인딩하여 3D 뒤집힘 효과 극대화
      ctx.scale(1, Math.sin(petal.angle) * 0.45 + 0.55);
      
      // 번지듯이 부드러운 꽃잎의 깊이감을 위해 Radial Gradient 적용
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size);
      grad.addColorStop(0, `rgba(255, 255, 255, ${petal.opacity})`);
      grad.addColorStop(0.4, `rgba(255, 248, 248, ${petal.opacity * 0.85})`);
      grad.addColorStop(0.8, `rgba(255, 255, 255, ${petal.opacity * 0.15})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = grad;
      
      // 베지에 곡선(Bezier Curve)을 사용해 둥그스름하면서 끝은 날렵한 '진짜 꽃잎' 형태 드로잉
      ctx.beginPath();
      // 상단 꼭짓점
      ctx.moveTo(0, -petal.size);
      // 좌측 볼륨
      ctx.bezierCurveTo(-petal.size * 0.85, -petal.size * 0.4, -petal.size * 0.85, petal.size * 0.4, 0, petal.size);
      // 우측 볼륨
      ctx.bezierCurveTo(petal.size * 0.85, petal.size * 0.4, petal.size * 0.85, -petal.size * 0.4, 0, -petal.size);
      ctx.closePath();
      
      ctx.fill();
      ctx.restore();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((petal, idx) => {
        // 물리 좌표 계산 업데이트
        petal.y += petal.speedY;
        // 삼각함수를 통한 은은한 바람 불림 움직임(sine wave) 연출
        petal.x += petal.speedX + Math.sin(petal.y / 40) * 0.35;
        petal.angle += petal.spin;

        // 경계를 벗어나면 재생성
        if (petal.y > canvas.height + 20 || petal.x < -20 || petal.x > canvas.width + 20) {
          petals[idx] = createPetal(false);
        } else {
          drawPetal(ctx, petal);
        }
      });

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
