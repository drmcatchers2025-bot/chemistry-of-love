import React, { useState, useMemo } from 'react';
import { NatalChartData } from '../types/astrochem';
import { 
  synthesizeNatalFormula, 
  generateCoreReagentProfile, 
  HISTORICAL_PRESETS 
} from '../services/chemicalCorrespondence';
import { 
  Sparkles, 
  FlaskRound, 
  Atom, 
  FileText, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain, 
  HeartHandshake 
} from 'lucide-react';

interface NatalSynthesizerProps {
  natalData: NatalChartData | null;
  onSetNatalData: (data: NatalChartData) => void;
  onInjectIntoReactor: () => void;
  onOpenCertificate: () => void;
  onLoadMatchIntoSynastry?: (partnerName: string, partnerDate: string) => void;
}

export const NatalSynthesizer: React.FC<NatalSynthesizerProps> = ({
  natalData,
  onSetNatalData,
  onInjectIntoReactor,
  onOpenCertificate,
  onLoadMatchIntoSynastry
}) => {
  const [viewMode, setViewMode] = useState<'oracle' | 'stoichiometry'>('oracle');
  const [name, setName] = useState<string>(natalData?.ownerName || 'Marie Curie');
  const [birthDate, setBirthDate] = useState<string>(natalData?.birthDate || '1867-11-07');
  const [birthTime, setBirthTime] = useState<string>(natalData?.birthTime || '12:00');
  const [location, setLocation] = useState<string>(natalData?.locationName || 'Warsaw, Poland');

  // Compute Core Reagent Profile & 4-Tier Readings
  const coreProfile = useMemo(() => {
    if (!natalData) return null;
    return generateCoreReagentProfile(natalData);
  }, [natalData]);

  const handleSynthesize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const data = synthesizeNatalFormula(name, birthDate, birthTime, location);
    onSetNatalData(data);
  };

  const loadPreset = (preset: typeof HISTORICAL_PRESETS[0]) => {
    setName(preset.name);
    setBirthDate(preset.birthDate);
    setBirthTime(preset.birthTime);
    setLocation(preset.location);
    const data = synthesizeNatalFormula(preset.name, preset.birthDate, preset.birthTime, preset.location, preset.lat, preset.lng);
    onSetNatalData(data);
  };

  return (
    <div className="space-y-6">
      {/* Header Info - Clean & Flattened */}
      <div className="pb-4 border-b border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Atom className="w-5 h-5 text-cyan-400" />
            Discover Your Core Reagent & Best Chemical Match
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Calculates your personal elemental reagent, crystalline structure, and 4-tier alchemical initiation reading, then identifies your ideal thermodynamic match partners.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setViewMode('oracle')}
            className={`px-3 py-1.5 rounded transition-colors ${
              viewMode === 'oracle' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Personal Oracle & Matches
          </button>
          <button
            onClick={() => setViewMode('stoichiometry')}
            className={`px-3 py-1.5 rounded transition-colors ${
              viewMode === 'stoichiometry' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Advanced Stoichiometry
          </button>
        </div>
      </div>

      {/* Preset Charts Strip */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
        <span>Presets:</span>
        {HISTORICAL_PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => loadPreset(p)}
            className="px-2.5 py-1 rounded bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 transition-colors whitespace-nowrap"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Birth Input Form (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-400 pb-2 border-b border-slate-800/60">
            Astrological Ephemeris Input
          </h3>

          <form onSubmit={handleSynthesize} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Your Name / Operator</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800/80 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Marie Curie"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Birth Date</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800/80 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Birth Time</label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800/80 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Birthplace / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800/80 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
                placeholder="City, Country"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Atom className="w-4 h-4" />
              Discover Your Reagent
            </button>
          </form>

          {natalData && coreProfile && (
            <div className="pt-3 border-t border-slate-800/60 font-mono text-xs space-y-2 text-slate-400">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Sun Sign:</span>
                <span className="text-amber-400 font-semibold">{natalData.planets.find(p => p.body === 'sun')?.sign.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Moon Sign:</span>
                <span className="text-slate-200 font-semibold">{natalData.planets.find(p => p.body === 'moon')?.sign.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Lunar Phase:</span>
                <span className="text-cyan-400 font-medium">{natalData.lunarPhase.phaseName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Oracle & Best Chemical Match (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {natalData && coreProfile ? (
            viewMode === 'oracle' ? (
              <div className="space-y-6">
                {/* 1. Core Reagent Identity Card - Flattened Glass */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold block">
                        Your Innate Elemental Reagent
                      </span>
                      <h3 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2 mt-0.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: coreProfile.primaryReagent.hexColor }} />
                        {coreProfile.primaryReagent.name}
                      </h3>
                      <div className="text-amber-300 text-xs font-semibold mt-0.5">
                        Spagyric Signature: {coreProfile.spagyricRole}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-sm text-cyan-300 font-bold">
                        {coreProfile.primaryReagent.formula}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        CAS {coreProfile.primaryReagent.casNumber}
                      </div>
                    </div>
                  </div>

                  {/* Molecular & Physical Parameters */}
                  <div className="grid grid-cols-3 gap-3 text-center text-[11px]">
                    <div className="py-2 bg-slate-900/40 rounded">
                      <div className="text-slate-500 uppercase text-[9px]">Lattice Structure</div>
                      <div className="text-slate-200 font-bold mt-0.5 capitalize">
                        {coreProfile.crystallineStructure}
                      </div>
                    </div>
                    <div className="py-2 bg-slate-900/40 rounded">
                      <div className="text-slate-500 uppercase text-[9px]">pH Tendency</div>
                      <div className="text-amber-400 font-bold mt-0.5">
                        pH {natalData.synthesizedFormula.equilibriumPh}
                      </div>
                    </div>
                    <div className="py-2 bg-slate-900/40 rounded">
                      <div className="text-slate-500 uppercase text-[9px]">Primary Element</div>
                      <div className="text-cyan-400 font-bold mt-0.5 uppercase">
                        {coreProfile.primaryReagent.primaryElement}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. The 4-Tier First-Person Alchemical Initiation Reading */}
                <div className="space-y-4 font-mono text-xs pt-2 border-t border-slate-800/60">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      The Four Alchemical Tiers
                    </span>
                    <span className="text-slate-500 text-[11px]">Personal Molecular Reading</span>
                  </div>

                  <div className="space-y-3">
                    {/* Tier I */}
                    <div className="p-3.5 rounded bg-slate-900/40 space-y-1">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        Tier I: The Elemental Genesis (Who You Are)
                      </div>
                      <div className="text-slate-200 leading-relaxed text-xs italic">
                        "{coreProfile.fourTierReading.tier1_elementalGenesis}"
                      </div>
                    </div>

                    {/* Tier II */}
                    <div className="p-3.5 rounded bg-slate-900/40 space-y-1">
                      <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                        Tier II: The Stoichiometric Conjunction (How You Bond)
                      </div>
                      <div className="text-slate-200 leading-relaxed text-xs italic">
                        "{coreProfile.fourTierReading.tier2_stoichiometricConjunction}"
                      </div>
                    </div>

                    {/* Tier III */}
                    <div className="p-3.5 rounded bg-slate-900/40 space-y-1">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        Tier III: Environmental Transits & Daily Catalyst
                      </div>
                      <div className="text-slate-200 leading-relaxed text-xs italic">
                        "{coreProfile.fourTierReading.tier3_environmentalTransits}"
                      </div>
                    </div>

                    {/* Tier IV */}
                    <div className="p-3.5 rounded bg-purple-950/20 space-y-1">
                      <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                        Tier IV: The Alchemical Prescription
                      </div>
                      <div className="text-purple-200 leading-relaxed text-xs font-medium">
                        "{coreProfile.fourTierReading.tier4_alchemicalPrescription}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Find My Best Chemical Match Oracle */}
                <div className="space-y-4 font-mono text-xs pt-2 border-t border-slate-800/60">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-cyan-400" />
                      Your Ideal Astrochemical Counterparts
                    </span>
                    <span className="text-slate-500 text-[11px]">3 Stoichiometric Matches</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {coreProfile.bestChemicalMatches.map((match, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/40 hover:bg-slate-900/70 rounded-lg p-3.5 flex flex-col justify-between space-y-3 transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${
                            match.category === 'Harmonizing Counterpart' ? 'text-amber-400' :
                            match.category === 'Catalytic Spark' ? 'text-rose-400' : 'text-cyan-400'
                          }`}>
                            {match.category}
                          </div>
                          <div className="font-bold text-slate-100 text-sm">
                            {match.title}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-relaxed">
                            {match.archetypeDescription}
                          </div>
                          <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-300 space-y-0.5">
                            <div>Partner: <span className="font-bold text-slate-200">{match.partnerReagent.name}</span></div>
                            <div>Sun Sign: <span className="text-amber-300 font-semibold">{match.partnerSunSign}</span></div>
                          </div>
                        </div>

                        {/* Action: Pour Into Crucible */}
                        <button
                          onClick={() => {
                            if (onLoadMatchIntoSynastry) {
                              onLoadMatchIntoSynastry(match.samplePartnerName, match.sampleBirthDate);
                            }
                          }}
                          className="w-full py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded transition-colors text-[11px] flex items-center justify-center gap-1.5 mt-2"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Pour Into Crucible
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Advanced Stoichiometry Mode */
              <div className="space-y-5 font-mono text-xs">
                {/* Formula Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-2">
                  <div>
                    <div className="text-xs text-cyan-400 font-semibold tracking-wide">
                      {natalData.synthesizedFormula.code}
                    </div>
                    <h3 className="text-xl font-bold font-display text-slate-100">
                      {natalData.synthesizedFormula.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>Equilibrium:</span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      pH {natalData.synthesizedFormula.equilibriumPh}
                    </span>
                  </div>
                </div>

                {/* Chemical IUPAC & Solvent Matrix */}
                <div className="bg-slate-900/40 p-3.5 rounded space-y-2">
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                    Stoichiometric Molecular Complex:
                  </div>
                  <div className="text-slate-200 font-semibold text-sm break-all">
                    {natalData.synthesizedFormula.chemicalIUPAC}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Primary Solute Matrix: <span className="text-slate-300">{natalData.synthesizedFormula.primarySolvent}</span>
                  </div>
                </div>

                {/* Elemental Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider">
                    <span>Astrochemical Elemental Fractions</span>
                    <span>100% Normalized</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-rose-950/20 p-2.5 rounded">
                      <div className="flex items-center justify-center gap-1 text-rose-400 text-[11px]">
                        <Flame className="w-3 h-3" /> Fire
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1 tabular-nums">
                        {natalData.elementalBreakdown.fire}%
                      </div>
                    </div>

                    <div className="bg-emerald-950/20 p-2.5 rounded">
                      <div className="flex items-center justify-center gap-1 text-emerald-400 text-[11px]">
                        <Mountain className="w-3 h-3" /> Earth
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1 tabular-nums">
                        {natalData.elementalBreakdown.earth}%
                      </div>
                    </div>

                    <div className="bg-sky-950/20 p-2.5 rounded">
                      <div className="flex items-center justify-center gap-1 text-sky-400 text-[11px]">
                        <Wind className="w-3 h-3" /> Air
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1 tabular-nums">
                        {natalData.elementalBreakdown.air}%
                      </div>
                    </div>

                    <div className="bg-blue-950/20 p-2.5 rounded">
                      <div className="flex items-center justify-center gap-1 text-blue-400 text-[11px]">
                        <Droplets className="w-3 h-3" /> Water
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1 tabular-nums">
                        {natalData.elementalBreakdown.water}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onInjectIntoReactor}
                    className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded transition-colors flex items-center justify-center gap-2 text-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    Inject Into Reaction Alembic
                  </button>
                  <button
                    onClick={onOpenCertificate}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium rounded transition-colors flex items-center gap-2 text-xs"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Astrogram Certificate
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono text-xs space-y-2">
              <FlaskRound className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="font-semibold text-slate-400">Discover Your Core Reagent</div>
              <div>Enter your birth details on the left to reveal your elemental reagent and 3 best matches.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
