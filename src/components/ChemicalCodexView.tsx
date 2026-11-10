import React, { useState } from 'react';
import { CelestialBody, ZodiacSign, ChemicalReagent, ZodiacSignInfo } from '../types/astrochem';
import { PLANETARY_REAGENTS, ZODIAC_ENVIRONMENTS } from '../services/chemicalCorrespondence';
import { BookOpen, Search, Filter, ShieldCheck, Flame, Droplets, Wind, Mountain, Sparkles } from 'lucide-react';

export const ChemicalCodexView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElementFilter, setSelectedElementFilter] = useState<'all' | 'fire' | 'earth' | 'air' | 'water'>('all');
  const [activeTab, setActiveTab] = useState<'reagents' | 'environments'>('reagents');
  const [inspectedReagent, setInspectedReagent] = useState<ChemicalReagent>(PLANETARY_REAGENTS.sun);

  // Filter reagents
  const reagentList = Object.values(PLANETARY_REAGENTS).filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.alchemicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesElement = selectedElementFilter === 'all' || r.primaryElement === selectedElementFilter;
    return matchesSearch && matchesElement;
  });

  // Filter environments
  const environmentList = Object.values(ZODIAC_ENVIRONMENTS).filter(env => {
    const matchesSearch = 
      env.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      env.solventEnvironment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      env.reactionAtmosphere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      env.ruler.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesElement = selectedElementFilter === 'all' || env.element === selectedElementFilter;
    return matchesSearch && matchesElement;
  });

  return (
    <div className="space-y-6">
      {/* Codex Header */}
      <div className="bg-[#0B0E17] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Astrochemical Codex & Correspondence Matrix
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Empirical database cross-referencing celestial planetary frequencies with verified chemical reagents, stoichiometry, CAS registries, and thermodynamic phase kinetics.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('reagents')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  activeTab === 'reagents' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Planetary Reagents
              </button>
              <button
                onClick={() => setActiveTab('environments')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  activeTab === 'environments' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Zodiac Environments
              </button>
            </div>
          </div>
        </div>

        {/* Search & Element Filtering Toolbar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by formula, element, or CAS..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 mr-1">Element:</span>
            {(['all', 'fire', 'earth', 'air', 'water'] as const).map((el) => (
              <button
                key={el}
                onClick={() => setSelectedElementFilter(el)}
                className={`px-2.5 py-1 rounded transition-colors uppercase text-[11px] font-semibold ${
                  selectedElementFilter === el
                    ? 'bg-slate-700 text-slate-100'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {el}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Codex Content */}
      {activeTab === 'reagents' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Reagents Card Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reagentList.map((r) => {
              const isSelected = inspectedReagent.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setInspectedReagent(r)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all text-xs font-mono space-y-2 ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500/70 shadow-lg'
                      : 'bg-[#0B0E17] border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.hexColor }} />
                      <span className="font-bold text-slate-100">{r.name}</span>
                    </div>
                    <span className="text-slate-400 uppercase text-[10px]">{r.primaryElement}</span>
                  </div>

                  <div className="text-sm font-semibold text-cyan-300">
                    {r.formula}
                  </div>

                  <div className="text-slate-400 text-[11px] line-clamp-2">
                    {r.alchemicalName}
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Base pH: <strong className="text-slate-200">{r.basePh}</strong></span>
                    <span>Mass: <strong className="text-slate-200">{r.atomicOrMolarMass.split(' ')[0]}</strong></span>
                    <span className="capitalize text-amber-400">{r.principle}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep Inspection Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0B0E17] border border-slate-800 rounded-xl p-5 space-y-4 text-xs font-mono">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
                Celestial Reagent Dossier
              </div>
              <h3 className="text-xl font-bold font-display text-slate-100 mt-0.5">
                {inspectedReagent.name}
              </h3>
              <div className="text-slate-400 text-xs italic mt-0.5">
                {inspectedReagent.alchemicalName}
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Chemical Formula:</span>
                <span className="font-bold text-cyan-300 text-sm">{inspectedReagent.formula}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">CAS Registry:</span>
                <span className="text-slate-200 font-semibold">{inspectedReagent.casNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Molar Mass:</span>
                <span className="text-slate-200 font-semibold">{inspectedReagent.atomicOrMolarMass}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Equilibrium Base pH:</span>
                <span className="text-amber-400 font-semibold">{inspectedReagent.basePh}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Precipitate Lattice:</span>
                <span className="text-slate-200 font-semibold capitalize">{inspectedReagent.precipitateLattice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reactivity Index:</span>
                <span className="text-rose-400 font-semibold">{inspectedReagent.reactivityIndex}/10</span>
              </div>
            </div>

            <div>
              <div className="text-slate-400 uppercase text-[11px] tracking-wider mb-1">Empirical Mechanism</div>
              <div className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800/80">
                {inspectedReagent.reactionMechanism}
              </div>
            </div>

            <div>
              <div className="text-slate-400 uppercase text-[11px] tracking-wider mb-1">Spagyric & Energetic Lore</div>
              <div className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800/80">
                {inspectedReagent.description}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Zodiac Environments Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {environmentList.map((env) => (
            <div key={env.id} className="bg-[#0B0E17] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: env.spectralHue }}>{env.symbol}</span>
                  <span className="font-bold text-slate-100 text-sm">{env.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 uppercase">
                  <span>{env.element}</span>
                  <span aria-hidden="true">·</span>
                  <span>{env.modality}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div>
                  <span className="text-slate-400">Solvent Matrix: </span>
                  <span className="text-slate-200 font-semibold">{env.solventEnvironment}</span>
                </div>
                <div>
                  <span className="text-slate-400">Atmosphere: </span>
                  <span className="text-slate-300">{env.reactionAtmosphere}</span>
                </div>
                <div>
                  <span className="text-slate-400">Ruling Planet: </span>
                  <span className="text-amber-400 font-semibold capitalize">{env.ruler}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <div className="text-slate-500 uppercase text-[9px]">Thermal Delta</div>
                  <div className="text-slate-200 font-bold tabular-nums">
                    {env.temperatureDelta > 0 ? `+${env.temperatureDelta}` : env.temperatureDelta}°C
                  </div>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <div className="text-slate-500 uppercase text-[9px]">Kinetic Rate</div>
                  <div className="text-cyan-400 font-bold tabular-nums">
                    {env.kineticAcceleration}x
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
