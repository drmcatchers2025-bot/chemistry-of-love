import React, { useState, useEffect, useRef } from 'react';
import { 
  NatalChartData, 
  SynastryReactionResult, 
  AspectInfo,
  ReactorState
} from '../types/astrochem';
import { 
  synthesizeNatalFormula, 
  calculateSynastryReaction, 
  HISTORICAL_PRESETS,
  hexToRgb 
} from '../services/chemicalCorrespondence';
import { 
  Flame, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Zap, 
  Atom, 
  FileText, 
  ShieldAlert, 
  HeartHandshake,
  ArrowRight,
  Droplets,
  ChevronRight
} from 'lucide-react';

interface SynastryCrucibleViewProps {
  onInjectIntoReactor: (result: SynastryReactionResult, nameA: string, nameB: string) => void;
  onOpenCertificateWithSynastry?: (result: SynastryReactionResult, chartA: NatalChartData, chartB: NatalChartData) => void;
  initialPartnerA?: { name: string; date: string; time: string; loc: string };
  initialPartnerB?: { name: string; date: string; time: string; loc: string };
}

export const SynastryCrucibleView: React.FC<SynastryCrucibleViewProps> = ({
  onInjectIntoReactor,
  initialPartnerA,
  initialPartnerB
}) => {
  // Partner A state
  const [partnerA, setPartnerA] = useState<{ name: string; date: string; time: string; loc: string }>(() => initialPartnerA || {
    name: 'Marie Curie',
    date: '1867-11-07',
    time: '12:00',
    loc: 'Warsaw, Poland'
  });

  // Partner B state
  const [partnerB, setPartnerB] = useState<{ name: string; date: string; time: string; loc: string }>(() => initialPartnerB || {
    name: 'Pierre Curie',
    date: '1859-05-15',
    time: '02:00',
    loc: 'Paris, France'
  });

  // Update when initial partner props change
  useEffect(() => {
    if (initialPartnerA) setPartnerA(initialPartnerA);
    if (initialPartnerB) setPartnerB(initialPartnerB);
  }, [initialPartnerA, initialPartnerB]);

  const [chartA, setChartA] = useState<NatalChartData>(() => 
    synthesizeNatalFormula(partnerA.name, partnerA.date, partnerA.time, partnerA.loc)
  );

  const [chartB, setChartB] = useState<NatalChartData>(() => 
    synthesizeNatalFormula(partnerB.name, partnerB.date, partnerB.time, partnerB.loc)
  );

  const [synastryResult, setSynastryResult] = useState<SynastryReactionResult>(() => 
    calculateSynastryReaction(chartA, chartB)
  );

  const [isReacting, setIsReacting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Recalculate when either partner changes
  const handleRecalculate = (newA = partnerA, newB = partnerB) => {
    const cA = synthesizeNatalFormula(newA.name, newA.date, newA.time, newA.loc);
    const cB = synthesizeNatalFormula(newB.name, newB.date, newB.time, newB.loc);
    const res = calculateSynastryReaction(cA, cB);
    setChartA(cA);
    setChartB(cB);
    setSynastryResult(res);
    setIsReacting(true);
    setTimeout(() => setIsReacting(false), 1500);
  };

  // Synastry Crucible Animation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = 360;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let phase = 0;
    const bubbles: Array<{ x: number; y: number; vy: number; radius: number; alpha: number }> = [];
    const crystals: Array<{ x: number; y: number; vy: number; radius: number; rot: number }> = [];

    const colorA = hexToRgb(chartA.dominantReagent.hexColor);
    const colorB = hexToRgb(chartB.dominantReagent.hexColor);
    const finalColor = synastryResult.finalColor;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.05;

      const centerX = width / 2;
      const flaskBottomY = height * 0.88;
      const flaskRadius = Math.min(width * 0.32, height * 0.40);
      const flaskCenterY = flaskBottomY - flaskRadius;
      const neckWidth = flaskRadius * 0.44;
      const neckTopY = height * 0.14;

      // 1. Dual Inflow Streams from left and right necks
      ctx.save();
      // Stream A (Left)
      ctx.beginPath();
      ctx.moveTo(centerX - flaskRadius * 0.6, neckTopY);
      ctx.quadraticCurveTo(
        centerX - flaskRadius * 0.4, flaskCenterY - 20,
        centerX - 10, flaskCenterY + 30
      );
      ctx.strokeStyle = `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, 0.75)`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Stream B (Right)
      ctx.beginPath();
      ctx.moveTo(centerX + flaskRadius * 0.6, neckTopY);
      ctx.quadraticCurveTo(
        centerX + flaskRadius * 0.4, flaskCenterY - 20,
        centerX + 10, flaskCenterY + 30
      );
      ctx.strokeStyle = `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, 0.75)`;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // 2. Glass Flask Outline
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 3. Fluid Layer with reaction-specific mechanics
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius - 2, 0, Math.PI * 2);
      ctx.clip();

      const fluidLevelY = flaskBottomY - flaskRadius * 1.35;
      const waveAmp = synastryResult.reactionType === 'violent_redox' ? 6 : 2.5;

      ctx.beginPath();
      ctx.moveTo(centerX - flaskRadius, fluidLevelY);
      for (let x = centerX - flaskRadius; x <= centerX + flaskRadius; x += 5) {
        const yOffset = Math.sin((x / 20) + phase) * waveAmp;
        ctx.lineTo(x, fluidLevelY + yOffset);
      }
      ctx.lineTo(centerX + flaskRadius, flaskBottomY + 10);
      ctx.lineTo(centerX - flaskRadius, flaskBottomY + 10);
      ctx.closePath();

      // Reaction-specific coloring
      if (synastryResult.reactionType === 'inert_standoff') {
        // Two separate immiscible layers with clean division!
        const midY = (fluidLevelY + flaskBottomY) / 2;
        const gradTop = ctx.createLinearGradient(centerX, fluidLevelY, centerX, midY);
        gradTop.addColorStop(0, `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, 0.8)`);
        gradTop.addColorStop(1, `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, 0.6)`);
        ctx.fillStyle = gradTop;
        ctx.fill();

        ctx.beginPath();
        ctx.rect(centerX - flaskRadius, midY, flaskRadius * 2, flaskBottomY - midY);
        const gradBot = ctx.createLinearGradient(centerX, midY, centerX, flaskBottomY);
        gradBot.addColorStop(0, `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, 0.7)`);
        gradBot.addColorStop(1, `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, 0.9)`);
        ctx.fillStyle = gradBot;
        ctx.fill();

        // Sharp dividing meniscus line
        ctx.beginPath();
        ctx.moveTo(centerX - flaskRadius * 0.9, midY);
        ctx.lineTo(centerX + flaskRadius * 0.9, midY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        // Blended/Transmuted color gradient
        const fluidGrad = ctx.createLinearGradient(centerX, fluidLevelY, centerX, flaskBottomY);
        fluidGrad.addColorStop(0, `rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, 0.7)`);
        fluidGrad.addColorStop(1, `rgba(${Math.round(finalColor.r * 0.6)}, ${Math.round(finalColor.g * 0.6)}, ${Math.round(finalColor.b * 0.6)}, 0.95)`);
        ctx.fillStyle = fluidGrad;
        ctx.fill();
      }

      // Reaction-specific effects:
      // A. Oscillating Belousov-Zhabotinsky rings
      if (synastryResult.reactionType === 'oscillating_redox') {
        for (let ring = 0; ring < 3; ring++) {
          const rRad = ((phase * 22 + ring * 40) % (flaskRadius * 0.8));
          ctx.beginPath();
          ctx.arc(centerX, flaskCenterY + 15, rRad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(168, 85, 247, ${Math.max(0, 0.45 - (rRad / (flaskRadius * 0.8)) * 0.45)})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      // B. Violent Redox Bubbles
      if (synastryResult.reactionType === 'violent_redox' || synastryResult.effervescenceLevel > 0.3) {
        if (Math.random() < synastryResult.effervescenceLevel * 0.8) {
          bubbles.push({
            x: centerX + (Math.random() - 0.5) * (flaskRadius * 1.3),
            y: flaskBottomY - 10,
            vy: -(Math.random() * 3.5 + 2.0),
            radius: Math.random() * 3.5 + 1.5,
            alpha: 0.8
          });
        }
      }

      // C. Crystalline Precipitation
      if (synastryResult.reactionType === 'crystalline_precipitation' || synastryResult.precipitateMassMg > 20) {
        if (Math.random() < 0.45) {
          crystals.push({
            x: centerX + (Math.random() - 0.5) * (flaskRadius * 1.1),
            y: fluidLevelY + 10,
            vy: Math.random() * 1.2 + 0.6,
            radius: Math.random() * 3.5 + 2,
            rot: Math.random() * Math.PI
          });
        }
      }

      // Render Bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y += b.vy;
        if (b.y <= fluidLevelY) {
          bubbles.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.6})`;
          ctx.fill();
        }
      }

      // Render Falling Crystals
      for (let i = crystals.length - 1; i >= 0; i--) {
        const c = crystals[i];
        c.y += c.vy;
        if (c.y >= flaskBottomY - 12) {
          crystals.splice(i, 1);
        } else {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rot);
          ctx.beginPath();
          ctx.moveTo(0, -c.radius);
          ctx.lineTo(c.radius * 0.8, 0);
          ctx.lineTo(0, c.radius);
          ctx.lineTo(-c.radius * 0.8, 0);
          ctx.closePath();
          ctx.fillStyle = '#FDE047';
          ctx.fill();
          ctx.restore();
        }
      }

      // Permanent crystalline bed if precipitate
      if (synastryResult.precipitateMassMg > 15) {
        ctx.beginPath();
        ctx.ellipse(centerX, flaskBottomY - 6, flaskRadius * 0.6, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.75)';
        ctx.fill();
      }

      ctx.restore(); // End fluid clip

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [synastryResult, chartA, chartB]);

  return (
    <div className="space-y-6">
      {/* Astrochemical Synastry Header - Flattened Glass */}
      <div className="pb-4 border-b border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-cyan-400" />
            Astrochemical Synastry & Dual-Reagent Crucible
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Calculates the literal chemical stoichiometry and thermodynamics when two birthday natal reagents meet in the reaction crucible.
          </p>
        </div>

        <button
          onClick={() => handleRecalculate()}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold rounded text-xs transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-Synthesize Reaction
        </button>
      </div>

      {/* Dual Operator / Birthday Inputs - Flattened & Airy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Vessel A Card */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartA.dominantReagent.hexColor }} />
              Vessel A: {partnerA.name}
            </span>
            <span className="text-slate-400 text-[11px]">
              ☉ {chartA.planets.find(p => p.body === 'sun')?.sign.toUpperCase()} · ☽ {chartA.planets.find(p => p.body === 'moon')?.sign.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <label className="text-slate-500 block mb-1">Name</label>
              <input
                type="text"
                value={partnerA.name}
                onChange={(e) => {
                  const updated = { ...partnerA, name: e.target.value };
                  setPartnerA(updated);
                  handleRecalculate(updated, partnerB);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-800/80 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Birth Date</label>
              <input
                type="date"
                value={partnerA.date}
                onChange={(e) => {
                  const updated = { ...partnerA, date: e.target.value };
                  setPartnerA(updated);
                  handleRecalculate(updated, partnerB);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-800/80 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="py-2 text-[11px] space-y-1 text-slate-400">
            <div className="flex items-center justify-between">
              <span>Dominant Reagent:</span>
              <span className="font-semibold text-slate-200">{chartA.dominantReagent.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Formula / pH:</span>
              <span className="text-cyan-400">{chartA.synthesizedFormula.chemicalIUPAC.split('@')[0]} (pH {chartA.synthesizedFormula.equilibriumPh})</span>
            </div>
          </div>
        </div>

        {/* Vessel B Card */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartB.dominantReagent.hexColor }} />
              Vessel B: {partnerB.name}
            </span>
            <span className="text-slate-400 text-[11px]">
              ☉ {chartB.planets.find(p => p.body === 'sun')?.sign.toUpperCase()} · ☽ {chartB.planets.find(p => p.body === 'moon')?.sign.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <label className="text-slate-500 block mb-1">Name</label>
              <input
                type="text"
                value={partnerB.name}
                onChange={(e) => {
                  const updated = { ...partnerB, name: e.target.value };
                  setPartnerB(updated);
                  handleRecalculate(partnerA, updated);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-800/80 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Birth Date</label>
              <input
                type="date"
                value={partnerB.date}
                onChange={(e) => {
                  const updated = { ...partnerB, date: e.target.value };
                  setPartnerB(updated);
                  handleRecalculate(partnerA, updated);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-800/80 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="py-2 text-[11px] space-y-1 text-slate-400">
            <div className="flex items-center justify-between">
              <span>Dominant Reagent:</span>
              <span className="font-semibold text-slate-200">{chartB.dominantReagent.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Formula / pH:</span>
              <span className="text-cyan-400">{chartB.synthesizedFormula.chemicalIUPAC.split('@')[0]} (pH {chartB.synthesizedFormula.equilibriumPh})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Crucible Reaction Chamber & Alchemical Reading */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-slate-800/60">
        {/* Crucible Beaker Canvas (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-mono font-semibold uppercase text-slate-300">
              Crucible Reaction Core
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold tabular-nums">
              Affinity: {synastryResult.chemicalAffinityScore}%
            </span>
          </div>

          <div className="relative w-full rounded-xl overflow-hidden bg-[#0A0D14] border border-slate-800/60 shadow-xl">
            <canvas
              ref={canvasRef}
              className="w-full block"
              style={{ height: '360px' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Enthalpy: <strong className="text-slate-200 tabular-nums">{synastryResult.enthalpyDeltaH} kJ/mol</strong></span>
            <span>Rate k: <strong className="text-cyan-400 tabular-nums">{synastryResult.reactionRateK} s⁻¹</strong></span>
          </div>
        </div>

        {/* Reaction Reading & Stoichiometric Translation (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 font-mono text-xs">
          <div className="space-y-3">
            <div className="border-b border-slate-800/60 pb-3">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold block">
                Astrochemical Reaction Archetype
              </span>
              <h3 className="text-xl font-bold font-display text-slate-100 mt-0.5">
                {synastryResult.title}
              </h3>
              <div className="text-slate-400 text-xs mt-0.5">
                {synastryResult.subtitle}
              </div>
            </div>

            {/* The Authentic Alchemical Reading Translation */}
            <div className="p-4 rounded bg-slate-900/40 text-slate-200 text-sm leading-relaxed italic border-l-2 border-l-cyan-500">
              "{synastryResult.readingTranslation}"
            </div>

            {/* 4-Tier Alchemical Deep Breakdown */}
            {synastryResult.fourTierReading && (
              <div className="space-y-2 pt-1">
                <div className="p-3 rounded bg-slate-900/30 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Tier I: Elemental Genesis</div>
                  <div className="text-[11px] text-slate-300 leading-relaxed italic">{synastryResult.fourTierReading.tier1_genesis}</div>
                </div>

                <div className="p-3 rounded bg-slate-900/30 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-cyan-400">Tier II: Stoichiometric Conjunction</div>
                  <div className="text-[11px] text-slate-300 leading-relaxed italic">{synastryResult.fourTierReading.tier2_conjunction}</div>
                </div>

                <div className="p-3 rounded bg-slate-900/30 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Tier III: Environmental Transits & Daily Catalyst</div>
                  <div className="text-[11px] text-slate-300 leading-relaxed italic">{synastryResult.fourTierReading.tier3_transit}</div>
                </div>

                <div className="p-3 rounded bg-purple-950/20 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-purple-300">Tier IV: The Alchemical Prescription</div>
                  <div className="text-[11px] text-purple-200 leading-relaxed font-medium">{synastryResult.fourTierReading.tier4_prescription}</div>
                </div>
              </div>
            )}

            {/* Stoichiometric Chemical Equation */}
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                Rigorous Stoichiometric Equation
              </span>
              <div className="p-3 rounded bg-slate-900/60 text-cyan-300 font-bold text-xs break-all">
                {synastryResult.scientificEquation}
              </div>
            </div>

            {/* 4 Quantitative Telemetry Badges */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              <div className="py-2 px-1 rounded bg-slate-900/30">
                <div className="text-[9px] uppercase text-slate-500">Enthalpy (ΔH)</div>
                <div className={`text-xs font-bold tabular-nums mt-0.5 ${synastryResult.enthalpyDeltaH < 0 ? 'text-rose-400' : 'text-blue-400'}`}>
                  {synastryResult.enthalpyDeltaH} <span className="text-[9px] font-normal text-slate-400">kJ</span>
                </div>
              </div>

              <div className="py-2 px-1 rounded bg-slate-900/30">
                <div className="text-[9px] uppercase text-slate-500">Thermal ΔT</div>
                <div className="text-xs font-bold text-slate-100 tabular-nums mt-0.5">
                  {synastryResult.temperatureDelta > 0 ? `+${synastryResult.temperatureDelta}` : synastryResult.temperatureDelta}°C
                </div>
              </div>

              <div className="py-2 px-1 rounded bg-slate-900/30">
                <div className="text-[9px] uppercase text-slate-500">Yield Precipitate</div>
                <div className="text-xs font-bold text-amber-300 tabular-nums mt-0.5">
                  {synastryResult.precipitateMassMg} <span className="text-[9px] font-normal text-slate-400">mg</span>
                </div>
              </div>

              <div className="py-2 px-1 rounded bg-slate-900/30">
                <div className="text-[9px] uppercase text-slate-500">Equilibrium pH</div>
                <div className="text-xs font-bold text-cyan-400 tabular-nums mt-0.5">
                  {synastryResult.finalPh}
                </div>
              </div>
            </div>

            {/* Cross Planetary Aspects */}
            <div className="pt-2 border-t border-slate-800/60">
              <div className="text-slate-400 uppercase text-[10px] tracking-wider mb-2 flex items-center justify-between">
                <span>Inter-Chart Aspect Chords</span>
                <span className="tabular-nums text-slate-500">{synastryResult.crossAspects.length} chords</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {synastryResult.crossAspects.slice(0, 4).map((asp, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-900/60 text-[11px]">
                    <span className="font-semibold text-slate-300 capitalize">
                      {partnerA.name}'s {asp.body1} {asp.symbol} {partnerB.name}'s {asp.body2}
                    </span>
                    <span className="text-slate-500 tabular-nums text-[10px]">orb {asp.orb}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800/60">
              <button
                onClick={() => onInjectIntoReactor(synastryResult, partnerA.name, partnerB.name)}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-mono font-semibold rounded transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <Sparkles className="w-4 h-4" />
                Inject Synastry Mixture Into Laboratory Beaker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
