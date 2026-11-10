import React, { useRef, useEffect, useState } from 'react';
import { ReactorState, ChemicalReagent } from '../types/astrochem';

interface AlembicCanvasProps {
  reactorState: ReactorState;
  onStir?: (intensity: number) => void;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: string;
  type: 'bubble' | 'crystal' | 'spark' | 'vapor';
  life: number;
  maxLife: number;
}

export const AlembicCanvas: React.FC<AlembicCanvasProps> = ({
  reactorState,
  onStir,
  height = 420
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const stirSpeedRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let canvasHeight = height;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.clientWidth;
      canvasHeight = height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = canvasHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);

    // Initialize initial crystal and bubble seed particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          x: width / 2 + (Math.random() - 0.5) * 120,
          y: canvasHeight * 0.72 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.8 - 0.2,
          radius: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.6 + 0.3,
          hue: '#F59E0B',
          type: 'bubble',
          life: Math.random() * 100,
          maxLife: 120 + Math.random() * 100
        });
      }
    }

    let wavePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, canvasHeight);
      wavePhase += 0.04 + stirSpeedRef.current * 0.05;
      stirSpeedRef.current *= 0.95;

      const centerX = width / 2;
      const flaskBottomY = canvasHeight * 0.86;
      const flaskRadius = Math.min(width * 0.34, canvasHeight * 0.38);
      const flaskCenterY = flaskBottomY - flaskRadius;
      const neckWidth = flaskRadius * 0.42;
      const neckTopY = canvasHeight * 0.12;

      // 1. Draw subtle background glow based on vessel luminescence and active aspects
      const glowIntensity = Math.min(1, (reactorState.luminescence / 80) + 0.2);
      const radialGlow = ctx.createRadialGradient(
        centerX, flaskCenterY, flaskRadius * 0.2,
        centerX, flaskCenterY, flaskRadius * 1.5
      );
      const { r, g, b } = reactorState.fluidColor;
      radialGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.18 * glowIntensity})`);
      radialGlow.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${0.05 * glowIntensity})`);
      radialGlow.addColorStop(1, 'rgba(7, 9, 14, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, canvasHeight);

      // 2. Draw Flask Outer Contour (Glass Alembic Shape)
      ctx.save();
      ctx.beginPath();
      // Lip at neck top
      ctx.ellipse(centerX, neckTopY, neckWidth / 2 + 6, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Neck and bulb path
      ctx.beginPath();
      // Left neck
      ctx.moveTo(centerX - neckWidth / 2, neckTopY);
      ctx.lineTo(centerX - neckWidth / 2, flaskCenterY - flaskRadius * 0.55);
      // Left shoulder curve to bulb
      ctx.quadraticCurveTo(
        centerX - flaskRadius * 0.6, flaskCenterY - flaskRadius * 0.3,
        centerX - flaskRadius, flaskCenterY
      );
      // Bottom bulb arc
      ctx.arc(centerX, flaskCenterY, flaskRadius, Math.PI, 0, true);
      // Right shoulder curve to bulb
      ctx.quadraticCurveTo(
        centerX + flaskRadius * 0.6, flaskCenterY - flaskRadius * 0.3,
        centerX + neckWidth / 2, flaskCenterY - flaskRadius * 0.55
      );
      // Right neck
      ctx.lineTo(centerX + neckWidth / 2, neckTopY);

      // Glass inner shading
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 3. Fluid Layer (Clipped to Flask Bulb)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius - 3, 0, Math.PI * 2);
      ctx.clip();

      // Compute fluid surface level based on total volume
      const totalVolume = Array.from(reactorState.reagentsInVessel.values()).reduce((a, b) => a + b, 0) + reactorState.natalVolumeMl;
      const fillPercentage = Math.min(0.85, Math.max(0.2, (totalVolume || 50) / 450));
      const fluidLevelY = flaskBottomY - (flaskRadius * 2 * fillPercentage);

      // Oscillating fluid meniscus
      ctx.beginPath();
      const waveAmplitude = 3 + (reactorState.temperature > 50 ? 3 : 1) + stirSpeedRef.current * 8;
      ctx.moveTo(centerX - flaskRadius, fluidLevelY);

      for (let x = centerX - flaskRadius; x <= centerX + flaskRadius; x += 6) {
        const distFromCenter = Math.abs(x - centerX);
        const yOffset = Math.sin((x / 25) + wavePhase) * waveAmplitude * (1 - distFromCenter / (flaskRadius * 1.2));
        ctx.lineTo(x, fluidLevelY + yOffset);
      }

      ctx.lineTo(centerX + flaskRadius, flaskBottomY + 10);
      ctx.lineTo(centerX - flaskRadius, flaskBottomY + 10);
      ctx.closePath();

      // Fluid gradient with thermodynamic color
      const fluidGrad = ctx.createLinearGradient(centerX, fluidLevelY, centerX, flaskBottomY);
      fluidGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.65)`);
      fluidGrad.addColorStop(0.5, `rgba(${Math.round(r * 0.85)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.85)}, 0.85)`);
      fluidGrad.addColorStop(1, `rgba(${Math.round(r * 0.5)}, ${Math.round(g * 0.5)}, ${Math.round(b * 0.5)}, 0.95)`);
      ctx.fillStyle = fluidGrad;
      ctx.fill();

      // Belousov-Zhabotinsky concentric wave if Opposition aspect is active
      const hasOpposition = reactorState.activeAspectsTriggered.some(a => a.type === 'opposition');
      if (hasOpposition) {
        const numRings = 4;
        for (let ring = 0; ring < numRings; ring++) {
          const ringRad = ((wavePhase * 25 + ring * 35) % (flaskRadius * 0.85));
          ctx.beginPath();
          ctx.arc(centerX, flaskCenterY + 20, ringRad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(244, 114, 182, ${Math.max(0, 0.4 - (ringRad / (flaskRadius * 0.85)) * 0.4)})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }

      // 4. Update & Render Particles (Bubbles, Crystals, Vapors)
      const isExothermic = reactorState.temperature > 40;
      const effervescenceRate = Math.max(0.2, reactorState.effervescence);

      // Spawn bubbles
      if (Math.random() < effervescenceRate * 0.65) {
        particlesRef.current.push({
          x: centerX + (Math.random() - 0.5) * (flaskRadius * 1.2),
          y: flaskBottomY - 10 - Math.random() * 20,
          vx: (Math.random() - 0.5) * 0.8 + (stirSpeedRef.current * 0.4),
          vy: -(Math.random() * 2.2 + 1.2 + (reactorState.temperature / 35)),
          radius: Math.random() * 2.8 + 1,
          alpha: 0.75,
          hue: '#FFFFFF',
          type: 'bubble',
          life: 0,
          maxLife: 100
        });
      }

      // Spawn crystal seeds if crystallization progress is notable
      if (reactorState.crystallizationProgress > 15 && Math.random() < 0.25) {
        particlesRef.current.push({
          x: centerX + (Math.random() - 0.5) * (flaskRadius * 1.1),
          y: fluidLevelY + Math.random() * 20,
          vx: (Math.random() - 0.5) * 0.3,
          vy: Math.random() * 0.8 + 0.3, // sinks down
          radius: Math.random() * 3.5 + 1.5,
          alpha: 0.85,
          hue: '#FDE047',
          type: 'crystal',
          life: 0,
          maxLife: 200
        });
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.type === 'bubble') {
          // Bubble popping at surface
          if (p.y <= fluidLevelY) {
            ctx.beginPath();
            ctx.arc(p.x, fluidLevelY, p.radius * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.4})`;
            ctx.stroke();
            return false;
          }
          // Render bubble
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.55})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.85})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        } else if (p.type === 'crystal') {
          // Sinks to bottom and stops
          if (p.y >= flaskBottomY - 8) {
            p.vy = 0;
            p.vx = 0;
          }
          // Render crystalline platelet/diamond
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.life * 0.02));
          ctx.beginPath();
          ctx.moveTo(0, -p.radius);
          ctx.lineTo(p.radius * 0.7, 0);
          ctx.lineTo(0, p.radius);
          ctx.lineTo(-p.radius * 0.7, 0);
          ctx.closePath();
          ctx.fillStyle = p.hue;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
        }

        return p.life < p.maxLife && p.x > centerX - flaskRadius && p.x < centerX + flaskRadius;
      });

      // Render bottom crystalline bed
      if (reactorState.crystallizationProgress > 5) {
        const bedHeight = Math.min(24, reactorState.crystallizationProgress * 0.28);
        ctx.beginPath();
        ctx.ellipse(centerX, flaskBottomY - 4, flaskRadius * 0.55, bedHeight, 0, 0, Math.PI * 2);
        const bedGrad = ctx.createRadialGradient(centerX, flaskBottomY, 5, centerX, flaskBottomY, flaskRadius * 0.55);
        bedGrad.addColorStop(0, 'rgba(253, 224, 71, 0.75)');
        bedGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.45)');
        bedGrad.addColorStop(1, 'rgba(202, 138, 4, 0.05)');
        ctx.fillStyle = bedGrad;
        ctx.fill();
      }

      ctx.restore(); // Exit fluid clip

      // 5. Draw Beaker Graduation Marks
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';

      const gradSteps = [100, 200, 300, 400];
      gradSteps.forEach((ml, idx) => {
        const gy = flaskBottomY - (flaskRadius * 1.8 * ((idx + 1) / 5));
        ctx.beginPath();
        ctx.moveTo(centerX - flaskRadius * 0.75, gy);
        ctx.lineTo(centerX - flaskRadius * 0.62, gy);
        ctx.stroke();
        ctx.fillText(`${ml}ml`, centerX - flaskRadius * 0.78, gy + 3);
      });
      ctx.restore();

      // 6. Draw Glass Highlights and Rim Reflections
      ctx.save();
      // Left specular reflection curve
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius - 5, Math.PI * 0.75, Math.PI * 1.15);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Subtle right reflection
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius - 5, -Math.PI * 0.2, -Math.PI * 0.05);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Neck specular highlight
      ctx.beginPath();
      ctx.moveTo(centerX - neckWidth / 2 + 3, neckTopY + 8);
      ctx.lineTo(centerX - neckWidth / 2 + 3, flaskCenterY - flaskRadius * 0.5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 7. Vapor plumes from flask mouth if high temperature
      if (reactorState.temperature > 55) {
        const vaporCount = 3;
        for (let v = 0; v < vaporCount; v++) {
          const vx = centerX + Math.sin(wavePhase * 2 + v) * 12;
          const vy = neckTopY - 10 - (wavePhase * 15 + v * 20) % 50;
          const vAlpha = Math.max(0, 0.35 - (neckTopY - vy) / 60);
          ctx.beginPath();
          ctx.arc(vx, vy, 8 + (neckTopY - vy) * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 232, 240, ${vAlpha * (reactorState.temperature / 100)})`;
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reactorState, height]);

  // Handle interactive stirring on mouse drag
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      stirSpeedRef.current = Math.min(5, stirSpeedRef.current + Math.abs(e.movementX) * 0.05);
      if (onStir) {
        onStir(stirSpeedRef.current);
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden bg-[#0A0D14] border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDraggingRef.current = false;
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full cursor-grab active:cursor-grabbing block"
        style={{ height: `${height}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* Floating HUD Telemetry Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-sm pointer-events-none">
        <span className="text-cyan-400">ALEMBIC REACTION CORE</span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums font-semibold text-slate-200">
          {(Array.from(reactorState.reagentsInVessel.values()).reduce((a, b) => a + b, 0) + reactorState.natalVolumeMl).toFixed(0)} mL
        </span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2 text-xs font-mono bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-sm pointer-events-none">
        <span className="text-slate-400">KINETIC FLUX:</span>
        <span className="tabular-nums font-semibold text-emerald-400">
          {reactorState.reactionRateK.toFixed(3)} s⁻¹
        </span>
      </div>

      {isHovered && (
        <div className="absolute bottom-3 text-[11px] font-mono text-slate-400/90 bg-slate-950/90 px-3 py-1 rounded border border-slate-800 backdrop-blur-sm pointer-events-none">
          Click & drag inside beaker to swirl convection currents
        </div>
      )}
    </div>
  );
};
