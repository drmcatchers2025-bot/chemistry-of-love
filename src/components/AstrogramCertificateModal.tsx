import React, { useState } from 'react';
import { NatalChartData, ReactorState, PlanetPosition } from '../types/astrochem';
import { X, Copy, Check, Printer, ShieldCheck, Atom } from 'lucide-react';

interface AstrogramCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  natalData: NatalChartData | null;
  reactorState: ReactorState;
  planets: PlanetPosition[];
}

export const AstrogramCertificateModal: React.FC<AstrogramCertificateModalProps> = ({
  isOpen,
  onClose,
  natalData,
  reactorState,
  planets
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sun = planets.find(p => p.body === 'sun');
  const moon = planets.find(p => p.body === 'moon');

  const reportData = {
    serialNumber: `AC-${Date.now().toString().slice(-8)}`,
    timestamp: new Date().toISOString(),
    operator: natalData?.ownerName || 'Cosmic Operator',
    birthDate: natalData ? `${natalData.birthDate} ${natalData.birthTime} UTC` : 'N/A (Ambient Transit)',
    location: natalData?.locationName || 'Universal Baseline',
    formulaName: natalData?.synthesizedFormula.name || 'Solar-Lunar Ambient Hydrosol',
    chemicalIUPAC: natalData?.synthesizedFormula.chemicalIUPAC || '[HAuCl₄]·[AgNO₃]@[Aqueous Matrix]',
    equilibriumPh: natalData?.synthesizedFormula.equilibriumPh ?? reactorState.ph,
    activationEnergy: natalData?.synthesizedFormula.activationEnergy ?? 52,
    coreTemperature: `${reactorState.temperature.toFixed(1)} °C`,
    crystallizationYield: `${reactorState.crystallizationProgress.toFixed(1)} mg`,
    reactionRateK: `${reactorState.reactionRateK.toFixed(3)} s⁻¹`,
    luminescencePeak: `${natalData?.synthesizedFormula.luminescenceWavelength.toFixed(0) ?? 532} nm`,
    dominantSign: `${sun?.sign.toUpperCase()} (${sun?.degreeInSign}°)`,
    lunarSign: `${moon?.sign.toUpperCase()} (${moon?.degreeInSign}°)`,
    elementalBreakdown: natalData?.elementalBreakdown || { fire: 30, earth: 25, air: 25, water: 20 }
  };

  const handleCopy = () => {
    const text = `
ASTROCHEMICAL SYNTHESIS CERTIFICATE
Serial: ${reportData.serialNumber}
Date: ${reportData.timestamp}
Operator: ${reportData.operator}
Birth: ${reportData.birthDate} | ${reportData.location}

FORMULA: ${reportData.formulaName}
IUPAC: ${reportData.chemicalIUPAC}
Equilibrium pH: ${reportData.equilibriumPh}
Core Temp: ${reportData.coreTemperature}
Kinetic Rate: ${reportData.reactionRateK}
Yield: ${reportData.crystallizationYield}
Luminescence Peak: ${reportData.luminescencePeak}

ELEMENTAL RATIOS:
Fire: ${reportData.elementalBreakdown.fire}% | Earth: ${reportData.elementalBreakdown.earth}% | Air: ${reportData.elementalBreakdown.air}% | Water: ${reportData.elementalBreakdown.water}%

CELESTIAL TRANSIT:
Sun: ${reportData.dominantSign} | Moon: ${reportData.lunarSign}
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0B0E17] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative font-mono text-xs text-slate-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-100 rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center border-b border-slate-800 pb-5 mb-5 space-y-1">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <Atom className="w-4 h-4" />
            Empirical Astrochemical Certificate
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 tracking-tight">
            Synthesis & Stoichiometric Analysis
          </h2>
          <div className="text-slate-500 text-[11px] tabular-nums">
            SERIAL: {reportData.serialNumber} · TIMESTAMP: {reportData.timestamp}
          </div>
        </div>

        {/* Subject & Origin Box */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3.5 mb-4 grid grid-cols-2 gap-3">
          <div>
            <span className="text-slate-500 uppercase text-[10px]">Subject / Operator:</span>
            <div className="font-bold text-slate-100 text-sm">{reportData.operator}</div>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px]">Birth Ephemeris:</span>
            <div className="text-slate-300">{reportData.birthDate}</div>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px]">Solar Ingress:</span>
            <div className="text-amber-400 font-semibold">{reportData.dominantSign}</div>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px]">Lunar Placement:</span>
            <div className="text-slate-200 font-semibold">{reportData.lunarSign}</div>
          </div>
        </div>

        {/* Synthesized Formula Specifications */}
        <div className="border border-slate-800 rounded-lg p-4 mb-4 space-y-3 bg-slate-950/40">
          <div>
            <span className="text-slate-500 uppercase text-[10px]">Synthesized Formula Name:</span>
            <div className="font-bold text-cyan-400 text-base">{reportData.formulaName}</div>
          </div>

          <div>
            <span className="text-slate-500 uppercase text-[10px]">Complex Stoichiometry:</span>
            <div className="text-slate-200 font-semibold break-all text-xs bg-slate-900/60 p-2 rounded border border-slate-800 mt-1">
              {reportData.chemicalIUPAC}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-[11px]">
            <div>
              <span className="text-slate-500">Equilibrium pH:</span>
              <div className="text-amber-400 font-bold text-sm tabular-nums">{reportData.equilibriumPh}</div>
            </div>
            <div>
              <span className="text-slate-500">Core Reaction Temp:</span>
              <div className="text-slate-100 font-bold text-sm tabular-nums">{reportData.coreTemperature}</div>
            </div>
            <div>
              <span className="text-slate-500">Kinetic Velocity:</span>
              <div className="text-cyan-400 font-bold text-sm tabular-nums">{reportData.reactionRateK}</div>
            </div>
          </div>
        </div>

        {/* Elemental Fractions */}
        <div className="border border-slate-800 rounded-lg p-3.5 mb-5 space-y-2">
          <div className="text-slate-500 uppercase text-[10px]">Elemental Balance:</div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30 text-rose-300">
              Fire: <strong className="text-slate-100 tabular-nums">{reportData.elementalBreakdown.fire}%</strong>
            </div>
            <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30 text-emerald-300">
              Earth: <strong className="text-slate-100 tabular-nums">{reportData.elementalBreakdown.earth}%</strong>
            </div>
            <div className="p-2 rounded bg-sky-950/20 border border-sky-900/30 text-sky-300">
              Air: <strong className="text-slate-100 tabular-nums">{reportData.elementalBreakdown.air}%</strong>
            </div>
            <div className="p-2 rounded bg-blue-950/20 border border-blue-900/30 text-blue-300">
              Water: <strong className="text-slate-100 tabular-nums">{reportData.elementalBreakdown.water}%</strong>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Certificate Data'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-colors text-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
