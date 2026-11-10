import React from 'react';

export type ActiveTab = 'reactor' | 'natal' | 'synastry' | 'transit' | 'codex';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCertificate: () => void;
  onResetChamber: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCertificate,
  onResetChamber
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#07090E]/95 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xl font-bold font-display tracking-tight text-slate-100 whitespace-nowrap">
          AstroChem Engine
        </span>
        <span className="hidden sm:inline-block text-xs font-mono text-slate-500">
          v2.4·Synthesizer
        </span>
      </div>

      {/* Zone 2: 5 clean single-line text navigation links */}
      <nav className="flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => onSelectTab('reactor')}
          className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs uppercase tracking-wider font-mono ${
            activeTab === 'reactor'
              ? 'text-cyan-400 border-cyan-400 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Celestial Reactor
        </button>
        <button
          onClick={() => onSelectTab('natal')}
          className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs uppercase tracking-wider font-mono ${
            activeTab === 'natal'
              ? 'text-cyan-400 border-cyan-400 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Natal Synthesizer
        </button>
        <button
          onClick={() => onSelectTab('synastry')}
          className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs uppercase tracking-wider font-mono ${
            activeTab === 'synastry'
              ? 'text-cyan-400 border-cyan-400 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Synastry Crucible
        </button>
        <button
          onClick={() => onSelectTab('transit')}
          className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs uppercase tracking-wider font-mono ${
            activeTab === 'transit'
              ? 'text-cyan-400 border-cyan-400 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Transit Ephemeris
        </button>
        <button
          onClick={() => onSelectTab('codex')}
          className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs uppercase tracking-wider font-mono ${
            activeTab === 'codex'
              ? 'text-cyan-400 border-cyan-400 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Chemical Codex
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onResetChamber}
          className="hidden md:inline-flex px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
        >
          Flush Vessel
        </button>
        <button
          onClick={onOpenCertificate}
          className="px-3.5 py-1.5 text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded shadow-sm shadow-cyan-950 transition-colors whitespace-nowrap shrink-0"
        >
          Export Astrogram
        </button>
      </div>
    </header>
  );
};
