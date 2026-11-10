import React, { useState } from 'react';
import { 
  ReactorState, 
  CelestialBody, 
  ChemicalReagent, 
  PlanetPosition, 
  AspectInfo, 
  LunarPhaseInfo, 
  ZodiacSignInfo,
  NatalChartData
} from '../types/astrochem';
import { PLANETARY_REAGENTS, ZODIAC_ENVIRONMENTS, hexToRgb } from '../services/chemicalCorrespondence';
import { AlembicCanvas } from './AlembicCanvas';
import { 
  FlaskConical, 
  Flame, 
  Snowflake, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Zap, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface ReactorViewProps {
  reactorState: ReactorState;
  setReactorState: React.Dispatch<React.SetStateAction<ReactorState>>;
  planets: PlanetPosition[];
  aspects: AspectInfo[];
  lunarPhase: LunarPhaseInfo;
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
  natalData: NatalChartData | null;
  onInjectNatal: () => void;
  onResetChamber: () => void;
}

export const ReactorView: React.FC<ReactorViewProps> = ({
  reactorState,
  setReactorState,
  planets,
  aspects,
  lunarPhase,
  currentDate,
  onDateChange,
  natalData,
  onInjectNatal,
  onResetChamber
}) => {
  const [selectedReagent, setSelectedReagent] = useState<ChemicalReagent>(PLANETARY_REAGENTS.sun);
  const [dropVolume, setDropVolume] = useState<number>(25);

  const sunPlanet = planets.find(p => p.body === 'sun');
  const moonPlanet = planets.find(p => p.body === 'moon');
  const sunEnv = sunPlanet ? ZODIAC_ENVIRONMENTS[sunPlanet.sign] : null;

  // Add reagent to beaker
  const handleAddReagent = (reagent: ChemicalReagent) => {
    setSelectedReagent(reagent);
    
    setReactorState(prev => {
      const currentVol = prev.reagentsInVessel.get(reagent.id) || 0;
      const newMap = new Map(prev.reagentsInVessel);
      newMap.set(reagent.id, currentVol + dropVolume);

      // Recalculate mixed fluid color
      const rgb = hexToRgb(reagent.hexColor);
      const totalVol = Array.from(newMap.values()).reduce((a, b) => a + b, 0) + prev.natalVolumeMl;
      const weight = dropVolume / Math.max(1, totalVol);

      const newR = Math.round(prev.fluidColor.r * (1 - weight) + rgb.r * weight);
      const newG = Math.round(prev.fluidColor.g * (1 - weight) + rgb.g * weight);
      const newB = Math.round(prev.fluidColor.b * (1 - weight) + rgb.b * weight);

      // Reagent physical impact
      const tempDelta = reagent.id === 'mars' ? 18 : reagent.id === 'sun' ? 8 : reagent.id === 'saturn' ? -12 : 2;
      const newTemp = Math.max(15, Math.min(98, prev.temperature + tempDelta));
      const newPh = parseFloat(Math.max(1.5, Math.min(12, (prev.ph * 0.7 + reagent.basePh * 0.3))).toFixed(2));
      const newRate = parseFloat(Math.min(3.5, prev.reactionRateK + (reagent.reactivityIndex * 0.08 * lunarPhase.reactionModifier.kineticsMultiplier)).toFixed(3));
      const newCrystals = Math.min(100, prev.crystallizationProgress + (reagent.precipitateLattice !== 'none' ? 12 : 2));

      // Check triggered aspects for this reagent
      const triggered = aspects.filter(a => a.body1 === reagent.id || a.body2 === reagent.id);

      const logEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        event: `Introduced ${dropVolume}mL ${reagent.name} (${reagent.formula}). Valency shift initiated.`,
        type: 'synthesis' as const
      };

      return {
        ...prev,
        reagentsInVessel: newMap,
        fluidColor: { r: newR, g: newG, b: newB, a: 1 },
        temperature: newTemp,
        ph: newPh,
        reactionRateK: newRate,
        crystallizationProgress: newCrystals,
        effervescence: Math.min(1, prev.effervescence + reagent.gasEvolutionRate * 0.05),
        luminescence: Math.min(100, prev.luminescence + (reagent.id === 'sun' || reagent.id === 'uranus' ? 25 : 8)),
        activeAspectsTriggered: triggered.length > 0 ? triggered : prev.activeAspectsTriggered,
        recentLogs: [logEntry, ...prev.recentLogs].slice(0, 10)
      };
    });
  };

  // Adjust heat or cooling
  const handleThermalDelta = (delta: number) => {
    setReactorState(prev => {
      const newTemp = Math.max(10, Math.min(99, prev.temperature + delta));
      const logEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        event: `Thermal adjustment: ${delta > 0 ? '+' : ''}${delta}°C. Vessel temperature now ${newTemp.toFixed(1)}°C.`,
        type: 'info' as const
      };
      return {
        ...prev,
        temperature: newTemp,
        effervescence: delta > 0 ? Math.min(1, prev.effervescence + 0.15) : Math.max(0.1, prev.effervescence - 0.1),
        recentLogs: [logEntry, ...prev.recentLogs].slice(0, 10)
      };
    });
  };

  const stepDate = (days: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + days);
    onDateChange(next);
  };

  return (
    <div className="space-y-6">
      {/* Flattened Astrometric Ribbon with Subtle Hairline */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-slate-800/60 text-xs font-mono">
        {/* Date Transit Scrubber */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900/60 rounded px-1.5 py-1">
            <button
              onClick={() => stepDate(-1)}
              className="p-1 text-slate-400 hover:text-slate-100 transition-colors"
              title="Previous Day Transit"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="px-2.5 text-xs text-slate-200 tabular-nums font-medium">
              {currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button
              onClick={() => stepDate(1)}
              className="p-1 text-slate-400 hover:text-slate-100 transition-colors"
              title="Next Day Transit"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => onDateChange(new Date())}
            className="text-cyan-400 hover:text-cyan-300 text-[11px] underline underline-offset-4"
          >
            Live Clock
          </button>
        </div>

        {/* Ambient Cosmic Alignment Metadata (Zero-Pill Discipline) */}
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <span>
            ☉ Sun: <span className="text-amber-400 font-semibold">{sunPlanet?.sign.toUpperCase()}</span> ({sunPlanet?.degreeInSign}°)
          </span>
          <span aria-hidden="true">·</span>
          <span>
            ☽ Moon: <span className="text-slate-200 font-semibold">{moonPlanet?.sign.toUpperCase()}</span> ({moonPlanet?.degreeInSign}°)
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-cyan-400 font-medium">
            {lunarPhase.phaseName} ({(lunarPhase.illumination * 100).toFixed(0)}%)
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-400">
            Solvent: <span className="text-slate-300">{sunEnv?.solventEnvironment.split('&')[0]}</span>
          </span>
        </div>
      </div>

      {/* Main Laboratory Workspace Grid - Borderless Breathing Glass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reagent Dispenser Rack (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2 font-semibold">
                <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                Planetary Reagent Rack
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                {[10, 25, 50].map(vol => (
                  <button
                    key={vol}
                    onClick={() => setDropVolume(vol)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      dropVolume === vol ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:text-slate-200'
                    }`}
                  >
                    {vol}mL
                  </button>
                ))}
              </div>
            </div>

            {/* Reagents Button Matrix - Borderless Sleek Cards */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PLANETARY_REAGENTS) as CelestialBody[]).map(body => {
                const r = PLANETARY_REAGENTS[body];
                const countInVessel = reactorState.reagentsInVessel.get(body) || 0;
                const isSelected = selectedReagent.id === body;

                return (
                  <button
                    key={body}
                    onClick={() => handleAddReagent(r)}
                    className={`flex flex-col text-left p-2.5 rounded-lg transition-all text-xs font-mono group ${
                      isSelected
                        ? 'bg-slate-800/80 ring-1 ring-cyan-500/50 shadow-sm'
                        : 'bg-slate-900/40 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
                        {r.name.split(' ')[0]}
                      </span>
                      <span className="text-xs font-bold" style={{ color: r.hexColor }}>
                        {r.id.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {r.formula}
                    </div>
                    {countInVessel > 0 && (
                      <div className="mt-1 text-[10px] text-cyan-400 font-semibold">
                        {countInVessel} mL in vessel
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Natal Essence Injector */}
            {natalData ? (
              <div className="mt-4 pt-3 border-t border-slate-800/50">
                <button
                  onClick={onInjectNatal}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-purple-950/30 hover:bg-purple-900/40 transition-colors text-xs font-mono text-purple-200"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Inject {natalData.ownerName}'s Natal Essence
                  </span>
                  <span className="text-purple-300 font-bold">+50mL</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* Active Reagent Chemical Profile Card */}
          <div className="pt-3 border-t border-slate-800/60 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">{selectedReagent.name}</span>
              <span className="text-slate-500 text-[11px]">CAS {selectedReagent.casNumber}</span>
            </div>
            <div className="text-slate-400 leading-relaxed text-[11px]">
              {selectedReagent.description}
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px] pt-1">
              <div>Base pH: <span className="text-slate-200 font-semibold">{selectedReagent.basePh}</span></div>
              <div>Lattice: <span className="text-slate-200 font-semibold capitalize">{selectedReagent.precipitateLattice}</span></div>
            </div>
          </div>
        </div>

        {/* Center Column: Reaction Alembic Chamber (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <AlembicCanvas
            reactorState={reactorState}
            onStir={(intensity) => {
              setReactorState(prev => ({
                ...prev,
                reactionRateK: Math.min(3.5, prev.reactionRateK + intensity * 0.02)
              }));
            }}
            height={440}
          />

          {/* Environmental Reaction Controls */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono py-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleThermalDelta(10)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 rounded transition-colors"
                title="Heat Vessel (+10°C)"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Heat (+10°C)
              </button>
              <button
                onClick={() => handleThermalDelta(-10)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/30 hover:bg-blue-900/50 text-blue-300 rounded transition-colors"
                title="Cool Vessel (-10°C)"
              >
                <Snowflake className="w-3.5 h-3.5 text-blue-400" />
                Cool (-10°C)
              </button>
            </div>

            <button
              onClick={onResetChamber}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Flush Vessel
            </button>
          </div>
        </div>

        {/* Right Column: Telemetry Gauges & Aspect Reaction Monitor (3 Cols) */}
        <div className="lg:col-span-3 space-y-6 font-mono text-xs">
          {/* Scientific Telemetry Panel */}
          <div className="space-y-4 pb-4 border-b border-slate-800/60">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Thermodynamic Telemetry
            </div>

            {/* Metric 1: Temperature */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500">
                Core Temperature
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-slate-100 tabular-nums">
                  {reactorState.temperature.toFixed(1)}
                </span>
                <span className="text-xs uppercase text-slate-500">°C</span>
              </div>
            </div>

            {/* Metric 2: pH */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500">
                Equilibrium pH
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-2xl font-bold tabular-nums ${
                  reactorState.ph < 5 ? 'text-rose-400' : reactorState.ph > 8 ? 'text-blue-400' : 'text-emerald-400'
                }`}>
                  {reactorState.ph.toFixed(2)}
                </span>
                <span className="text-xs uppercase text-slate-500">
                  {reactorState.ph < 5 ? 'Acidic' : reactorState.ph > 8 ? 'Alkaline' : 'Neutral'}
                </span>
              </div>
            </div>

            {/* Metric 3: Kinetic Velocity */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500">
                Reaction Velocity (k)
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-cyan-400 tabular-nums">
                  {reactorState.reactionRateK.toFixed(3)}
                </span>
                <span className="text-xs uppercase text-slate-500">s⁻¹</span>
              </div>
            </div>

            {/* Metric 4: Crystalline Yield */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500">
                Crystalline Precipitate
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-amber-300 tabular-nums">
                  {reactorState.crystallizationProgress.toFixed(1)}
                </span>
                <span className="text-xs uppercase text-slate-500">mg</span>
              </div>
            </div>
          </div>

          {/* Active Astrological Aspect Drivers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5 uppercase text-[11px]">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Active Celestial Transits
              </span>
              <span className="text-slate-500 tabular-nums text-[11px]">
                {aspects.length} aspects
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {aspects.slice(0, 3).map((asp, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/40 text-[11px] space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span className="capitalize">{asp.symbol} {asp.body1} {asp.type} {asp.body2}</span>
                    <span className="text-[10px] text-slate-500 tabular-nums">orb {asp.orb}°</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-snug">
                    {asp.chemicalEffect}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Real-Time Astrochemical Reaction Chronicle */}
      <div className="pt-4 border-t border-slate-800/60">
        <div className="flex items-center justify-between pb-2 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Astrochemical Reaction Chronicle
          </span>
          <span className="text-xs font-mono text-slate-500">
            Real-Time Kinetic Log
          </span>
        </div>

        <div className="space-y-1 font-mono text-xs max-h-32 overflow-y-auto pr-2">
          {reactorState.recentLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 py-0.5">
              <span className="text-slate-500 tabular-nums shrink-0 text-[11px]">{log.timestamp}</span>
              <span className={`text-[11px] ${
                log.type === 'synthesis' ? 'text-cyan-300' :
                log.type === 'aspect_burst' ? 'text-amber-300' :
                log.type === 'precipitation' ? 'text-emerald-300' : 'text-slate-300'
              }`}>
                {log.event}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
