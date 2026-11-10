import React, { useState, useEffect, useRef } from 'react';
import { 
  NatalChartData, 
  SynastryReactionResult 
} from './types/astrochem';
import { 
  synthesizeNatalFormula, 
  calculateSynastryReaction, 
  hexToRgb 
} from './services/chemicalCorrespondence';
import { AlchemicalOracleChat } from './components/AlchemicalOracleChat';
import { 
  Sparkles, 
  Flame, 
  Atom, 
  Copy, 
  Check, 
  Printer, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Shuffle
} from 'lucide-react';

// Preset famous couples for instant 1-click exploration
const FAMOUS_CONJUNCTIONS = [
  {
    label: 'Marie & Pierre Curie',
    nameA: 'Marie Curie',
    dateA: '1867-11-07',
    nameB: 'Pierre Curie',
    dateB: '1859-05-15',
    archetype: 'Volatile Redox Pioneers'
  },
  {
    label: 'Frida Kahlo & Diego Rivera',
    nameA: 'Frida Kahlo',
    dateA: '1907-07-06',
    nameB: 'Diego Rivera',
    dateB: '1886-12-08',
    archetype: 'Oscillating B-Z Passion'
  },
  {
    label: 'Isaac Newton & Edmond Halley',
    nameA: 'Isaac Newton',
    dateA: '1643-01-04',
    nameB: 'Edmond Halley',
    dateB: '1656-11-08',
    archetype: 'The Great Precipitation'
  },
  {
    label: 'Carl Jung & Emma Rauschenbach',
    nameA: 'Carl Jung',
    dateA: '1875-07-26',
    nameB: 'Emma Rauschenbach',
    dateB: '1882-03-30',
    archetype: 'Chromatic Transmutation'
  }
];

export default function App() {
  // Birthday Space 1 (Essence Alpha)
  const [dateA, setDateA] = useState('1867-11-07');
  const [nameA, setNameA] = useState('Marie Curie');

  // Birthday Space 2 (Essence Beta)
  const [dateB, setDateB] = useState('1859-05-15');
  const [nameB, setNameB] = useState('Pierre Curie');

  // Active reading state
  const [hasCalculated, setHasCalculated] = useState(true);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Behind-the-scenes computed state
  const [chartA, setChartA] = useState<NatalChartData>(() => 
    synthesizeNatalFormula('Marie Curie', '1867-11-07', '12:00', 'Warsaw, Poland')
  );
  const [chartB, setChartB] = useState<NatalChartData>(() => 
    synthesizeNatalFormula('Pierre Curie', '1859-05-15', '02:00', 'Paris, France')
  );
  const [synastryResult, setSynastryResult] = useState<SynastryReactionResult>(() => 
    calculateSynastryReaction(chartA, chartB)
  );

  // Canvas ref for animated reaction beaker
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readingRef = useRef<HTMLDivElement | null>(null);

  // Trigger the behind-the-scenes calculation
  const handleCalculateConjunction = (customA = { name: nameA, date: dateA }, customB = { name: nameB, date: dateB }) => {
    setIsSynthesizing(true);
    
    // Everything complex runs behind the scenes:
    // Keplerian planetary orbital ephemeris, elemental balances,
    // soul reagent correspondences, cross-aspect matrices, and thermodynamic stoichiometry
    setTimeout(() => {
      const cA = synthesizeNatalFormula(
        customA.name || 'Soul Alpha', 
        customA.date, 
        '12:00', 
        'Cosmic Baseline'
      );
      const cB = synthesizeNatalFormula(
        customB.name || 'Soul Beta', 
        customB.date, 
        '12:00', 
        'Cosmic Baseline'
      );
      const res = calculateSynastryReaction(cA, cB);

      setChartA(cA);
      setChartB(cB);
      setSynastryResult(res);
      setHasCalculated(true);
      setIsSynthesizing(false);

      if (readingRef.current) {
        readingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 450);
  };

  // Quick preset loader
  const handleLoadPreset = (preset: typeof FAMOUS_CONJUNCTIONS[0]) => {
    setDateA(preset.dateA);
    setNameA(preset.nameA);
    setDateB(preset.dateB);
    setNameB(preset.nameB);
    handleCalculateConjunction(
      { name: preset.nameA, date: preset.dateA },
      { name: preset.nameB, date: preset.dateB }
    );
  };

  // Random Alchemical Conjunction generator
  const handleRandomConjunction = () => {
    const MYSTICAL_NAMES = [
      'Aurelius', 'Seraphina', 'Hermes', 'Cassiopeia', 'Orion', 'Hypatia', 
      'Paracelsus', 'Artemis', 'Balthazar', 'Vespera', 'Solomon', 'Celeste',
      'Rowan', 'Lyra', 'Dante', 'Beatrix', 'Zephyr', 'Isadora'
    ];

    const getRandomDate = () => {
      const year = Math.floor(Math.random() * (2002 - 1860 + 1)) + 1860;
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const name1 = MYSTICAL_NAMES[Math.floor(Math.random() * MYSTICAL_NAMES.length)];
    let name2 = MYSTICAL_NAMES[Math.floor(Math.random() * MYSTICAL_NAMES.length)];
    while (name2 === name1) {
      name2 = MYSTICAL_NAMES[Math.floor(Math.random() * MYSTICAL_NAMES.length)];
    }

    const randomDateA = getRandomDate();
    const randomDateB = getRandomDate();

    setDateA(randomDateA);
    setNameA(name1);
    setDateB(randomDateB);
    setNameB(name2);

    handleCalculateConjunction(
      { name: name1, date: randomDateA },
      { name: name2, date: randomDateB }
    );
  };

  // Copy full magical reading to clipboard (pure hermetic text, zero raw notation)
  const handleCopyReading = () => {
    if (!synastryResult) return;
    const fourTier = synastryResult.fourTierReading || {
      tier1_genesis: `When ${chartA.ownerName}'s ${chartA.dominantReagent.alchemicalName} merges with ${chartB.ownerName}'s ${chartB.dominantReagent.alchemicalName}, their elemental essences touch.`,
      tier2_conjunction: synastryResult.readingTranslation,
      tier3_transit: 'Planetary alignments reinforce this alchemical equilibrium.',
      tier4_prescription: 'Prescription: Maintain mutual reverence and protect the reaction crucible.'
    };

    const text = `
✨ ALCHEMICAL CONJUNCTION READING: ${synastryResult.title.toUpperCase()} ✨
Archetype: ${synastryResult.subtitle}
Harmonic Affinity: ${synastryResult.chemicalAffinityScore}%

ESSENCE ALPHA (${chartA.ownerName}): ${chartA.dominantReagent.alchemicalName} (${chartA.dominantReagent.primaryElement.toUpperCase()})
ESSENCE BETA (${chartB.ownerName}): ${chartB.dominantReagent.alchemicalName} (${chartB.dominantReagent.primaryElement.toUpperCase()})

--- THE MAGICAL READING ---

I. THE GENESIS FUSION
${fourTier.tier1_genesis}

II. THE CRUCIBLE PHENOMENON
${fourTier.tier2_conjunction}

III. CELESTIAL TRANSIT DYNAMICS
${fourTier.tier3_transit}

IV. SPAGYRIC CRUCIBLE PRESCRIPTION
${fourTier.tier4_prescription}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Real-time canvas animation for the reaction crucible
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = 340;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let phase = 0;
    const bubbles: Array<{ x: number; y: number; vy: number; radius: number; alpha: number }> = [];
    const crystals: Array<{ x: number; y: number; vy: number; radius: number; rot: number }> = [];

    const colorA = hexToRgb(chartA.dominantReagent.hexColor);
    const colorB = hexToRgb(chartB.dominantReagent.hexColor);
    const finalColor = synastryResult.finalColor;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.045;

      const centerX = width / 2;
      const flaskBottomY = height * 0.88;
      const flaskRadius = Math.min(width * 0.32, height * 0.38);
      const flaskCenterY = flaskBottomY - flaskRadius;
      const neckTopY = height * 0.12;

      // 1. Dual Inflow Streams from left and right
      ctx.save();
      // Stream A (Left)
      ctx.beginPath();
      ctx.moveTo(centerX - flaskRadius * 0.65, neckTopY);
      ctx.quadraticCurveTo(
        centerX - flaskRadius * 0.4, flaskCenterY - 15,
        centerX - 8, flaskCenterY + 25
      );
      ctx.strokeStyle = `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, 0.85)`;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Stream B (Right)
      ctx.beginPath();
      ctx.moveTo(centerX + flaskRadius * 0.65, neckTopY);
      ctx.quadraticCurveTo(
        centerX + flaskRadius * 0.4, flaskCenterY - 15,
        centerX + 8, flaskCenterY + 25
      );
      ctx.strokeStyle = `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, 0.85)`;
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();

      // 2. Glass Flask Outline with glowing aura
      ctx.save();
      const glowGrad = ctx.createRadialGradient(
        centerX, flaskCenterY, flaskRadius * 0.2,
        centerX, flaskCenterY, flaskRadius * 1.4
      );
      glowGrad.addColorStop(0, `rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, 0.22)`);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Flask base
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 3. Fluid Layer with reaction-specific physics
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius - 2, 0, Math.PI * 2);
      ctx.clip();

      const fluidLevelY = flaskBottomY - flaskRadius * 1.35;
      const waveAmp = synastryResult.reactionType === 'violent_redox' ? 5.5 : 2.5;

      ctx.beginPath();
      ctx.moveTo(centerX - flaskRadius, fluidLevelY);
      for (let x = centerX - flaskRadius; x <= centerX + flaskRadius; x += 5) {
        const yOffset = Math.sin((x / 22) + phase) * waveAmp;
        ctx.lineTo(x, fluidLevelY + yOffset);
      }
      ctx.lineTo(centerX + flaskRadius, flaskBottomY + 15);
      ctx.lineTo(centerX - flaskRadius, flaskBottomY + 15);
      ctx.closePath();

      if (synastryResult.reactionType === 'inert_standoff') {
        // Two immiscible layers (sovereign stasis)
        const midY = (fluidLevelY + flaskBottomY) / 2;
        const gradTop = ctx.createLinearGradient(centerX, fluidLevelY, centerX, midY);
        gradTop.addColorStop(0, `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, 0.85)`);
        gradTop.addColorStop(1, `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, 0.65)`);
        ctx.fillStyle = gradTop;
        ctx.fill();

        ctx.beginPath();
        ctx.rect(centerX - flaskRadius, midY, flaskRadius * 2, flaskBottomY - midY);
        const gradBot = ctx.createLinearGradient(centerX, midY, centerX, flaskBottomY);
        gradBot.addColorStop(0, `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, 0.7)`);
        gradBot.addColorStop(1, `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, 0.92)`);
        ctx.fillStyle = gradBot;
        ctx.fill();

        // Meniscus line
        ctx.beginPath();
        ctx.moveTo(centerX - flaskRadius * 0.9, midY);
        ctx.lineTo(centerX + flaskRadius * 0.9, midY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      } else {
        // Transmuted Conjunction Fluid
        const fluidGrad = ctx.createLinearGradient(centerX, fluidLevelY, centerX, flaskBottomY);
        fluidGrad.addColorStop(0, `rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, 0.75)`);
        fluidGrad.addColorStop(1, `rgba(${Math.round(finalColor.r * 0.55)}, ${Math.round(finalColor.g * 0.55)}, ${Math.round(finalColor.b * 0.55)}, 0.95)`);
        ctx.fillStyle = fluidGrad;
        ctx.fill();
      }

      // 4. Visual reaction phenomena
      // A. Belousov-Zhabotinsky Concentric Waves
      if (synastryResult.reactionType === 'oscillating_redox') {
        for (let ring = 0; ring < 3; ring++) {
          const rRad = ((phase * 22 + ring * 45) % (flaskRadius * 0.82));
          ctx.beginPath();
          ctx.arc(centerX, flaskCenterY + 15, rRad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(168, 85, 247, ${Math.max(0, 0.45 - (rRad / (flaskRadius * 0.82)) * 0.45)})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      // B. Effervescence & Radical Bubbles
      if (synastryResult.effervescenceLevel > 0.15 || synastryResult.reactionType === 'violent_redox') {
        if (Math.random() < synastryResult.effervescenceLevel * 0.75) {
          bubbles.push({
            x: centerX + (Math.random() - 0.5) * (flaskRadius * 1.3),
            y: flaskBottomY - 10,
            vy: -(Math.random() * 3.2 + 1.8),
            radius: Math.random() * 3 + 1.5,
            alpha: 0.85
          });
        }
      }

      // Render bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y += b.vy;
        b.alpha -= 0.012;
        if (b.y < fluidLevelY || b.alpha <= 0) {
          bubbles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
        ctx.fill();
      }

      // C. Crystalline Golden Salt Precipitation
      if (synastryResult.reactionType === 'crystalline_precipitation' || synastryResult.precipitateMassMg > 25) {
        if (Math.random() < 0.35) {
          crystals.push({
            x: centerX + (Math.random() - 0.5) * (flaskRadius * 1.1),
            y: fluidLevelY + 10,
            vy: Math.random() * 1.2 + 0.6,
            radius: Math.random() * 3.5 + 2,
            rot: Math.random() * Math.PI
          });
        }
      }

      // Render crystals
      for (let i = crystals.length - 1; i >= 0; i--) {
        const c = crystals[i];
        c.y += c.vy;
        c.rot += 0.03;
        if (c.y > flaskBottomY - 5) {
          c.vy = 0;
        }
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.beginPath();
        ctx.rect(-c.radius, -c.radius, c.radius * 2, c.radius * 2);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      // Flask highlights & meniscus sheen
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius - 4, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [chartA, chartB, synastryResult]);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <header className="border-b border-slate-900 bg-[#07090E]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 via-cyan-500/20 to-purple-500/20 border border-slate-700/60 flex items-center justify-center text-amber-400">
              <Atom className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold font-display tracking-tight text-slate-100">
                AstroChemical Engine
              </h1>
              <p className="text-[11px] font-mono text-slate-500">
                Alchemical Conjunction & Celestial Synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasCalculated && (
              <button
                onClick={handleCopyReading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
                title="Copy Full Reading"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Reading'}</span>
              </button>
            )}
            <button
              onClick={() => setShowCertificateModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
              title="Official Astrogram Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
            <Sparkles className="w-3 h-3" />
            <span>Alchemical Birth Chart Conjunction</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-slate-100">
            Discover Your Chemical Reaction
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enter two birthdays to unveil the magical chemical reaction created when your cosmic essences meet in the vessel.
          </p>
        </div>

        {/* The Two Spaces for Birthdays */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 relative mb-6">
          {/* Central Conjunction Glyph (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0B0E17] border border-slate-700/80 items-center justify-center text-amber-400 shadow-xl shadow-black/60 font-mono text-lg pointer-events-none">
            ☌
          </div>

          {/* Space 1: Essence Alpha */}
          <div className="bg-[#0B0E17] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 opacity-60" />
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                First Birthday · Essence Alpha
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Birth Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateA}
                    onChange={(e) => setDateA(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400/70 transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Name / Identifier <span className="text-slate-600">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marie Curie or You"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/70 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Space 2: Essence Beta */}
          <div className="bg-[#0B0E17] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-400 opacity-60" />
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400/90 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Second Birthday · Essence Beta
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Birth Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateB}
                    onChange={(e) => setDateB(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400/70 transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Name / Identifier <span className="text-slate-600">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pierre Curie or Partner"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/70 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Famous Conjunction Presets */}
        <div className="w-full max-w-2xl mb-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Or test famous pairings:</span>
          {FAMOUS_CONJUNCTIONS.map((c) => (
            <button
              key={c.label}
              onClick={() => handleLoadPreset(c)}
              className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-colors text-[11px]"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* The Action & Random Buttons */}
        <div className="w-full max-w-2xl mb-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => handleCalculateConjunction()}
            disabled={isSynthesizing || !dateA || !dateB}
            className={`w-full sm:flex-1 px-6 py-3.5 rounded-xl font-mono text-sm uppercase tracking-wider font-bold transition-all shadow-xl flex items-center justify-center gap-2.5 ${
              isSynthesizing
                ? 'bg-slate-800 text-slate-400 cursor-wait'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/20 active:scale-[0.99]'
            }`}
          >
            {isSynthesizing ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Brewing Alchemical Conjunction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Enter Dates & Get Reaction Reading</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={handleRandomConjunction}
            disabled={isSynthesizing}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-mono text-sm uppercase tracking-wider font-semibold border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 hover:border-amber-500/40 text-slate-200 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-[0.99] shadow-lg shadow-black/40"
            title="Randomize both birthdays and automatically cast the magical chemical reading"
          >
            <Shuffle className="w-4 h-4 text-amber-400" />
            <span>Random Alchemical Conjunction</span>
          </button>
        </div>

        {/* The Magical Chemical Reaction Reading */}
        {hasCalculated && synastryResult && (
          <div ref={readingRef} className="w-full max-w-2xl space-y-6 animate-in fade-in duration-500">
            {/* Reaction Beaker & Visual Conjunction Flask */}
            <div className="bg-[#0B0E17] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-3 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Crucible Reaction</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
                  {synastryResult.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-amber-300/90">
                  {synastryResult.subtitle}
                </p>
              </div>

              {/* Animated Beaker Canvas */}
              <div className="relative w-full h-[300px] flex items-center justify-center my-2">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full block"
                />
              </div>

              {/* Lyrical Alchemical Harmony Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-900 text-center font-mono">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 uppercase block">Harmonic Affinity</span>
                  <span className="text-base font-bold text-amber-400">
                    {synastryResult.chemicalAffinityScore}%
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 uppercase block">Essence Alpha</span>
                  <span className="text-xs font-medium text-amber-300 truncate block mt-0.5">
                    {chartA.dominantReagent.alchemicalName}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 uppercase block">Essence Beta</span>
                  <span className="text-xs font-medium text-cyan-300 truncate block mt-0.5">
                    {chartB.dominantReagent.alchemicalName}
                  </span>
                </div>
              </div>
            </div>

            {/* The 4-Tier Magical Alchemical Reading */}
            <div className="bg-[#0B0E17] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold font-display text-slate-100">
                    The Magical Alchemical Reading
                  </h4>
                  <p className="text-xs font-mono text-slate-500">
                    Conjunction of {chartA.ownerName} & {chartB.ownerName}
                  </p>
                </div>
                <span className="text-amber-400 text-sm font-mono">🜍 🜂 🜄</span>
              </div>

              {/* Tier 1: Genesis Fusion */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  I. The Genesis Fusion (First Contact)
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l border-amber-500/30">
                  {synastryResult.fourTierReading?.tier1_genesis || 
                    `When your ${chartA.dominantReagent.alchemicalName} is introduced to their ${chartB.dominantReagent.alchemicalName}, an immediate elemental recognition takes place. The two fluids do not merely touch—they exchange cosmic memory.`}
                </p>
              </div>

              {/* Tier 2: The Crucible Phenomenon */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  II. The Crucible Phenomenon (Physical Reaction)
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l border-cyan-500/30">
                  {synastryResult.fourTierReading?.tier2_conjunction || synastryResult.readingTranslation}
                </p>
              </div>

              {/* Tier 3: Celestial Transit Influences */}
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  III. Celestial Transit Dynamics
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l border-purple-500/30">
                  {synastryResult.fourTierReading?.tier3_transit || 
                    `Prevailing celestial transits stabilize the solution's matrix. Under the light of the stars, the reaction achieves a steady, luminous equilibrium.`}
                </p>
              </div>

              {/* Tier 4: Spagyric Crucible Prescription */}
              <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  IV. Spagyric Crucible Guidance (The Alchemical Prescription)
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mt-1">
                  {synastryResult.fourTierReading?.tier4_prescription || 
                    `Prescription for the Alchemist: Guard this conjunction against abrupt emotional thermal shocks. Allow the bond to settle at its natural equilibrium, trusting that both essences enhance the other without surrendering their inherent nobility.`}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-900">
                <button
                  onClick={handleCopyReading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Reading Copied to Clipboard!' : 'Copy Magical Reading'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-200 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>View Astrogram Certificate</span>
                  </button>

                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <span>Enter New Dates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* The Alchemical Oracle Chat Interface ("Consult the Alchemist") */}
            <AlchemicalOracleChat
              chartA={chartA}
              chartB={chartB}
              synastryResult={synastryResult}
            />
          </div>
        )}
      </main>

      {/* Official Certificate Modal */}
      {showCertificateModal && synastryResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B0E17] border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative font-mono text-xs text-slate-300">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>

            <div className="text-center border-b border-slate-800 pb-4 mb-4">
              <div className="text-amber-400 text-xs uppercase tracking-widest font-bold">
                AstroChemical Certificate
              </div>
              <h3 className="text-xl font-bold font-display text-slate-100 mt-1">
                Conjunction of Two Born Essences
              </h3>
              <div className="text-[11px] text-slate-500 mt-0.5">
                SERIAL: AC-{Date.now().toString().slice(-8)} · ALCHEMICALLY HARMONIZED
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-4 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Essence Alpha:</span>
                <span className="font-bold text-slate-100 text-sm">{chartA.ownerName}</span>
                <span className="block text-slate-400 text-[11px]">{chartA.birthDate}</span>
                <span className="block text-amber-300 text-[11px] mt-0.5">{chartA.dominantReagent.alchemicalName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Essence Beta:</span>
                <span className="font-bold text-slate-100 text-sm">{chartB.ownerName}</span>
                <span className="block text-slate-400 text-[11px]">{chartB.birthDate}</span>
                <span className="block text-cyan-300 text-[11px] mt-0.5">{chartB.dominantReagent.alchemicalName}</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Alchemical Archetype:</span>
                <span className="text-base font-bold text-slate-100">{synastryResult.title}</span>
                <span className="block text-xs text-amber-300/90">{synastryResult.subtitle}</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 text-center">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Harmonic Affinity</span>
                <span className="text-2xl font-bold text-amber-400">{synastryResult.chemicalAffinityScore}%</span>
              </div>

              <div className="pt-2 text-xs font-sans text-slate-300 leading-relaxed border-t border-slate-900">
                <span className="text-slate-500 font-mono text-[10px] uppercase block mb-1">Crucible Reading:</span>
                {synastryResult.readingTranslation}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-500">
                AstroChemical Engine · Celestial Correspondence
              </span>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:brightness-110 transition-all text-xs"
              >
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#07090E] px-6 py-4 text-center text-xs font-mono text-slate-500">
        AstroChemical Engine · Celestial Conjunction & Alchemical Reading
      </footer>
    </div>
  );
}
