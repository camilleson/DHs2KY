import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FireworkOverlayProps = {
  isActive: boolean;
  onClose: () => void;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  drag: number;
  color: string;
  shape: 'rect' | 'circle' | 'star';
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
};

const COLORS = [
  '#FF6B6B', // Red-pink
  '#FFD93D', // Yellow
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#B185DB', // Purple
  '#FF9FF3', // Light pink
  '#FF8080', // Coral
];

export default function FireworkOverlay({ isActive, onClose }: FireworkOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [groomHasError, setGroomHasError] = React.useState(false);
  const [brideHasError, setBrideHasError] = React.useState(false);

  // 컴포넌트가 활성화될 때마다 이미지 에러 상태를 리셋하여 다시 시도할 수 있게 처리
  useEffect(() => {
    if (isActive) {
      setGroomHasError(false);
      setBrideHasError(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    // 3.5초 후 자동으로 닫히도록 설정
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [isActive, onClose]);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // 캔버스 크기 맞춤 (부모 absolute 컨테이너 크기에 대응)
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 360;
      canvas.height = rect?.height || 640;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 별 모양을 그리는 헬퍼 함수
    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    };

    // 단일 파티클 생성 함수 (아래에서 위로 뿜어지는 컨페티)
    const createParticle = (x: number, y: number, direction: 'left' | 'right'): Particle => {
      const angle =
        direction === 'left'
          ? (Math.random() * 60 + 20) * (Math.PI / 180) // 20~80도 (더 넓고 가파른 발사각)
          : (Math.random() * 60 + 100) * (Math.PI / 180); // 100~160도 (더 넓고 가파른 발사각)

      const speed = Math.random() * 24 + 20; // 초기 발사 속도 상향 (20 ~ 44)하여 화면 꼭대기까지 올라감
      const shapeType = Math.random();
      let shape: 'rect' | 'circle' | 'star' = 'rect';

      if (shapeType > 0.7) {
        shape = 'star';
      } else if (shapeType > 0.4) {
        shape = 'circle';
      }

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        gravity: 0.21, // 중력 더 완화하여 더 높게 날아감
        drag: 0.98, // 공기 마찰 감쇠 완화로 힘차게 날아감
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape,
        size: Math.random() * 9 + 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 1.0,
      };
    };

    // 공중 폭죽(Radial Explosion)을 위한 360도 구형 파티클 생성 함수
    const createRadialParticle = (x: number, y: number, color: string): Particle => {
      const angle = Math.random() * Math.PI * 2; // 360도 전방향
      const speed = Math.random() * 10 + 4; // 폭발 속도 (4 ~ 14)
      const shapeType = Math.random();
      let shape: 'rect' | 'circle' | 'star' = 'circle';

      if (shapeType > 0.6) {
        shape = 'star';
      } else if (shapeType > 0.3) {
        shape = 'rect';
      }

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.14, // 가볍게 낙하
        drag: 0.982,
        color,
        shape,
        size: Math.random() * 8 + 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1.0,
      };
    };

    // 특정 지점에서 공중 폭발을 일으키는 헬퍼 함수
    const explode = (x: number, y: number) => {
      const particleCount = 40; // 폭발당 파티클 수
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < particleCount; i++) {
        particles.push(createRadialParticle(x, y, color));
      }
    };

    // 폭죽 발사! (춘식이가 올라오기 시작할 때 첫 발사 후 공중 폭발 연속 트리거)
    const activeTimers: NodeJS.Timeout[] = [];

    // 1. 기본 좌우 컨페티 분수 발사 (총 240개로 대폭 증량)
    const launchTimer1 = setTimeout(() => {
      const leftSourceX = 60;
      const leftSourceY = canvas.height - 60;
      const rightSourceX = canvas.width - 60;
      const rightSourceY = canvas.height - 60;

      for (let i = 0; i < 120; i++) {
        particles.push(createParticle(leftSourceX, leftSourceY, 'left'));
        particles.push(createParticle(rightSourceX, rightSourceY, 'right'));
      }
    }, 250);
    activeTimers.push(launchTimer1);

    // 2. 공중 폭죽 1차 폭발 (좌측 상단)
    const launchTimer2 = setTimeout(() => {
      explode(canvas.width * 0.3, canvas.height * 0.25);
    }, 450);
    activeTimers.push(launchTimer2);

    // 3. 공중 폭죽 2차 폭발 (우측 상단)
    const launchTimer3 = setTimeout(() => {
      explode(canvas.width * 0.7, canvas.height * 0.2);
    }, 700);
    activeTimers.push(launchTimer3);

    // 4. 공중 폭죽 3차 대형 폭발 (중앙 상단)
    const launchTimer4 = setTimeout(() => {
      explode(canvas.width * 0.5, canvas.height * 0.35);
      explode(canvas.width * 0.5, canvas.height * 0.35); // 2중 겹쳐서 매우 화려하게 터짐
    }, 950);
    activeTimers.push(launchTimer4);

    // 애니메이션 루프
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // 물리 갱신
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.0055; // 서서히 투명해짐

        // 화면 밖으로 완전히 벗어나거나 투명해진 파티클 제거
        if (p.opacity <= 0 || p.y > canvas.height + 20) {
          particles.splice(index, 1);
          return;
        }

        // 파티클 그리기
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2.5);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      activeTimers.forEach(clearTimeout);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);

  return (
    <>
      {/* 백그라운드 이미지 프리로드 및 캐싱 가드 (화면에 보이지 않게 처리) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <img
          src="/groom_chunsik.png"
          alt="groom preload"
          onError={() => setGroomHasError(true)}
        />
        <img
          src="/bride_chunsik.png"
          alt="bride preload"
          onError={() => setBrideHasError(true)}
        />
      </div>

      <AnimatePresence>
        {isActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {/* 파티클 캔버스 */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-45"
            />

            {/* 좌측 캐릭터 (신랑춘식) & 폭죽 */}
            {!groomHasError && (
              <motion.div
                initial={{ y: 150, rotate: 12 }}
                animate={{ y: 0, rotate: 12 }}
                exit={{ y: 150, rotate: 12 }}
                transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                className="absolute left-[-15px] bottom-[-15px] w-28 h-28 origin-bottom z-50 flex items-end justify-start"
                style={{ mixBlendMode: 'multiply' }}
              >
                <img
                  src="/groom_chunsik.png"
                  alt="groom chunsik"
                  className="w-24 h-24 object-contain"
                  onError={() => setGroomHasError(true)}
                />
              </motion.div>
            )}

            {/* 우측 캐릭터 (신부춘식) & 폭죽 */}
            {!brideHasError && (
              <motion.div
                initial={{ y: 150, rotate: -12 }}
                animate={{ y: 0, rotate: -12 }}
                exit={{ y: 150, rotate: -12 }}
                transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                className="absolute right-[-15px] bottom-[-15px] w-28 h-28 origin-bottom z-50 flex items-end justify-end"
                style={{ mixBlendMode: 'multiply' }}
              >
                <img
                  src="/bride_chunsik.png"
                  alt="bride chunsik"
                  className="w-24 h-24 object-contain"
                  style={{ transform: 'scaleX(-1)' }}
                  onError={() => setBrideHasError(true)}
                />
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
