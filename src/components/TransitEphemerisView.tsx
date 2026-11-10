import React from 'react';
import { 
  PlanetPosition, 
  AspectInfo, 
  LunarPhaseInfo, 
  CelestialBody 
} from '../types/astrochem';
import { AstroWheel } from './AstroWheel';
import { getDayRuler } from '../services/chemicalCorrespondence';
import { 
  Compass, 
  Calendar, 
  Zap, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface TransitEphemerisViewProps {
  planets: PlanetPosition[];
  aspects: AspectInfo[];
  lunarPhase: LunarPhaseInfo;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedPlanet: CelestialBody | null;
  onSelectPlanet: (body: CelestialBody) => void;
}

export const TransitEphemerisView: React.FC<TransitEphemerisViewProps> = ({
  planets,
  aspects,
  lunarPhase,
  currentDate,
  onDateChange,
  selectedPlanet,
  onSelectPlanet
}) => {
  const dayRuler = getDayRuler(currentDate);

  const stepDays = (days: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + days);
    onDateChange(next);
  };

  const jumpToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Astrometric Header */}
      <div className="bg-[#0B0E17] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => stepDays(-1)}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 text-xs font-mono text-slate-200 tabular-nums">
              {currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <button
              onClick={() => stepDays(1)}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={jumpToday}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
          >
            Reset to Current Transit
          </button>
        </div>

        {/* Day Ruler and Lunar Phase */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-slate-300">
            Day Ruler: <span className="text-amber-400 font-bold">{dayRuler.planet.toUpperCase()} ({dayRuler.reagent.formula})</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Phase: <span className="text-cyan-400 font-semibold">{lunarPhase.phaseName}</span> ({(lunarPhase.illumination * 100).toFixed(0)}%)
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Aspect Matrix: <span className="text-slate-200 font-bold tabular-nums">{aspects.length} chords</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Astrolabe Wheel (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0B0E17] border border-slate-800 rounded-xl p-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Celestial Astrolabe
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Orbital Vectors
            </span>
          </div>

          <AstroWheel
            planets={planets}
            aspects={aspects}
            lunarPhase={lunarPhase}
            selectedPlanet={selectedPlanet}
            onSelectPlanet={onSelectPlanet}
            size={400}
          />

          <div className="mt-4 text-center text-xs font-mono text-slate-400">
            Click any planetary glyph or aspect chord on the wheel to inspect its chemical properties.
          </div>
        </div>

        {/* Right Column: Ephemeris & Chemical Placements Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Ephemeris Table */}
          <div className="bg-[#0B0E17] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-300">
                Planetary Ephemeris & Assigned Chemical Reagents
              </h3>
              <span className="text-xs font-mono text-slate-500">
                J2000 Keplerian Coordinates
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2 px-2.5">Body</th>
                    <th className="py-2 px-2.5">Zodiac Pos</th>
                    <th className="py-2 px-2.5">Longitude</th>
                    <th className="py-2 px-2.5">Velocity</th>
                    <th className="py-2 px-2.5">Reagent Formula</th>
                    <th className="py-2 px-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {planets.map((p) => {
                    const isSelected = selectedPlanet === p.body;
                    return (
                      <tr
                        key={p.body}
                        className={`hover:bg-slate-900/60 transition-colors ${
                          isSelected ? 'bg-cyan-950/20 text-cyan-200' : 'text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-2.5 font-bold flex items-center gap-1.5">
                          <span style={{ color: p.chemicalReagent.hexColor }}>{p.symbol}</span>
                          <span>{p.name}</span>
                          {p.isRetrograde && (
                            <span className="text-[10px] text-amber-400 font-semibold ml-1">℞</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2.5 capitalize">
                          {p.degreeInSign}°{p.minutesInSign.toString().padStart(2, '0')}' {p.sign}
                        </td>
                        <td className="py-2.5 px-2.5 tabular-nums text-slate-400">
                          {p.longitude.toFixed(2)}°
                        </td>
                        <td className="py-2.5 px-2.5 tabular-nums">
                          {p.speed > 0 ? `+${p.speed.toFixed(2)}` : p.speed.toFixed(2)}°/d
                        </td>
                        <td className="py-2.5 px-2.5 text-slate-200 font-semibold">
                          {p.chemicalReagent.formula}
                        </td>
                        <td className="py-2.5 px-2.5">
                          <button
                            onClick={() => onSelectPlanet(p.body)}
                            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Planetary Aspects & Chemical Reaction Matrix */}
          <div className="bg-[#0B0E17] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Planetary Aspect Tension & Reaction Matrix
              </h3>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {aspects.length} Active Configurations
              </span>
            </div>

            <div className="space-y-2">
              {aspects.map((asp, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span className="flex items-center gap-2 capitalize">
                      <span className="text-amber-400">{asp.symbol}</span>
                      {asp.body1} {asp.type} {asp.body2}
                    </span>
                    <span className="text-slate-400 tabular-nums text-[11px]">
                      Exact: {asp.exactAngle}° (Orb: {asp.orb}°)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    {asp.chemicalEffect}
                  </div>
                </div>
              ))}
              {aspects.length === 0 && (
                <div className="text-slate-500 font-mono text-xs py-4 text-center">
                  No aspects within active orbs on this transit date.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
