import React, { useState } from 'react';
import { PlanetPosition, AspectInfo, LunarPhaseInfo, ZodiacSignInfo, CelestialBody } from '../types/astrochem';
import { ZODIAC_ENVIRONMENTS, PLANETARY_REAGENTS } from '../services/chemicalCorrespondence';

interface AstroWheelProps {
  planets: PlanetPosition[];
  aspects: AspectInfo[];
  lunarPhase: LunarPhaseInfo;
  activeTransitSign?: ZodiacSignInfo;
  selectedPlanet?: CelestialBody | null;
  onSelectPlanet?: (body: CelestialBody) => void;
  size?: number;
}

const ZODIAC_GLYPHS: Record<string, { symbol: string; name: string; color: string }> = {
  aries: { symbol: '♈', name: 'Aries', color: '#EF4444' },
  taurus: { symbol: '♉', name: 'Taurus', color: '#10B981' },
  gemini: { symbol: '♊', name: 'Gemini', color: '#38BDF8' },
  cancer: { symbol: '♋', name: 'Cancer', color: '#E2E8F0' },
  leo: { symbol: '♌', name: 'Leo', color: '#F59E0B' },
  virgo: { symbol: '♍', name: 'Virgo', color: '#84CC16' },
  libra: { symbol: '♎', name: 'Libra', color: '#06B6D4' },
  scorpio: { symbol: '♏', name: 'Scorpio', color: '#9333EA' },
  sagittarius: { symbol: '♐', name: 'Sagittarius', color: '#A855F7' },
  capricorn: { symbol: '♑', name: 'Capricorn', color: '#64748B' },
  aquarius: { symbol: '♒', name: 'Aquarius', color: '#0EA5E9' },
  pisces: { symbol: '♓', name: 'Pisces', color: '#3B82F6' },
};

const ASPECT_COLORS: Record<string, string> = {
  conjunction: '#A855F7',
  sextile: '#10B981',
  square: '#EF4444',
  trine: '#06B6D4',
  opposition: '#F59E0B'
};

export const AstroWheel: React.FC<AstroWheelProps> = ({
  planets,
  aspects,
  lunarPhase,
  selectedPlanet,
  onSelectPlanet,
  size = 460
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<AspectInfo | null>(null);

  const center = size / 2;
  const radius = size * 0.44;
  const innerRadius = radius * 0.82;
  const planetTrackRadius = radius * 0.65;
  const coreRadius = radius * 0.35;

  const signs = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  // Helper to convert degree to coordinate on wheel (Aries 0 starts at East / 90° or standard Astrological Ascendant at 180°)
  // In astrological wheels, 0° Aries is traditionally at the East (left, 180° in polar) or counter-clockwise
  const degreeToCoord = (deg: number, r: number) => {
    // 0° Aries placed at 180° (9 o'clock) counter-clockwise
    const angleRad = ((180 - deg) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad)
    };
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none"
      >
        <defs>
          <radialGradient id="wheelCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#0B0E17" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#07090E" stopOpacity="0.9" />
          </radialGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Astrolabe Ring Background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* Zodiac Sector Rings */}
        {signs.map((sign, idx) => {
          const startDeg = idx * 30;
          const endDeg = (idx + 1) * 30;
          const midDeg = startDeg + 15;
          const glyph = ZODIAC_GLYPHS[sign];
          const env = ZODIAC_ENVIRONMENTS[sign as keyof typeof ZODIAC_ENVIRONMENTS];

          const p1 = degreeToCoord(startDeg, radius);
          const p2 = degreeToCoord(endDeg, radius);
          const p3 = degreeToCoord(endDeg, innerRadius);
          const p4 = degreeToCoord(startDeg, innerRadius);

          const arcPath = `
            M ${p1.x} ${p1.y}
            A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            A ${innerRadius} ${innerRadius} 0 0 0 ${p4.x} ${p4.y}
            Z
          `;

          const labelPos = degreeToCoord(midDeg, (radius + innerRadius) / 2);

          return (
            <g key={sign} className="cursor-default">
              <path
                d={arcPath}
                fill={idx % 2 === 0 ? 'rgba(30, 41, 59, 0.25)' : 'rgba(15, 23, 42, 0.45)'}
                stroke="#1E293B"
                strokeWidth="1"
              />
              {/* Radial divider lines */}
              <line
                x1={degreeToCoord(startDeg, innerRadius).x}
                y1={degreeToCoord(startDeg, innerRadius).y}
                x2={p1.x}
                y2={p1.y}
                stroke="#334155"
                strokeWidth="1"
              />
              {/* Zodiac glyph */}
              <text
                x={labelPos.x}
                y={labelPos.y + 4}
                textAnchor="middle"
                fontSize="13"
                fill={glyph.color}
                className="font-mono font-bold"
              >
                {glyph.symbol}
              </text>
            </g>
          );
        })}

        {/* Inner Boundary Ring */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Planet Track Ring */}
        <circle
          cx={center}
          cy={center}
          r={planetTrackRadius}
          fill="none"
          stroke="#1E293B"
          strokeWidth="1"
          strokeDasharray="2,3"
        />

        {/* Aspect Lines Matrix */}
        <g className="aspect-lines">
          {aspects.map((aspect, aIdx) => {
            const p1 = planets.find(p => p.body === aspect.body1);
            const p2 = planets.find(p => p.body === aspect.body2);
            if (!p1 || !p2) return null;

            const c1 = degreeToCoord(p1.longitude, planetTrackRadius * 0.9);
            const c2 = degreeToCoord(p2.longitude, planetTrackRadius * 0.9);
            const color = ASPECT_COLORS[aspect.type] || '#64748B';
            const isHovered = hoveredAspect === aspect;

            return (
              <line
                key={`asp-${aIdx}`}
                x1={c1.x}
                y1={c1.y}
                x2={c2.x}
                y2={c2.y}
                stroke={color}
                strokeWidth={isHovered ? 2.5 : aspect.type === 'conjunction' || aspect.type === 'opposition' ? 1.5 : 1}
                strokeOpacity={isHovered ? 1 : 0.6}
                strokeDasharray={aspect.type === 'square' ? '4,3' : aspect.type === 'sextile' ? '2,2' : undefined}
                className="transition-all cursor-pointer"
                onMouseEnter={() => setHoveredAspect(aspect)}
                onMouseLeave={() => setHoveredAspect(null)}
              />
            );
          })}
        </g>

        {/* Center Celestial Core */}
        <circle
          cx={center}
          cy={center}
          r={coreRadius}
          fill="url(#wheelCoreGrad)"
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* Center Display: Lunar Phase & Solar Coordinates */}
        <text
          x={center}
          y={center - 18}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="10"
          className="font-mono tracking-wider uppercase"
        >
          LUNAR ILLUMINATION
        </text>
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          fill="#E2E8F0"
          fontSize="17"
          className="font-mono font-bold tabular-nums"
        >
          {(lunarPhase.illumination * 100).toFixed(1)}%
        </text>
        <text
          x={center}
          y={center + 24}
          textAnchor="middle"
          fill="#38BDF8"
          fontSize="11"
          className="font-mono font-medium"
        >
          {lunarPhase.phaseName}
        </text>

        {/* Planetary Position Markers */}
        {planets.map((p) => {
          const coord = degreeToCoord(p.longitude, planetTrackRadius);
          const isSelected = selectedPlanet === p.body;
          const isHovered = hoveredPlanet?.body === p.body;
          const reagent = PLANETARY_REAGENTS[p.body];

          return (
            <g
              key={p.body}
              className="cursor-pointer transition-transform"
              onClick={() => onSelectPlanet && onSelectPlanet(p.body)}
              onMouseEnter={() => setHoveredPlanet(p)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              {/* Outer halo if selected or hovered */}
              {(isSelected || isHovered) && (
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="16"
                  fill={reagent.glowColor}
                  filter="url(#glowFilter)"
                />
              )}

              {/* Planet disc */}
              <circle
                cx={coord.x}
                cy={coord.y}
                r={isSelected ? 11 : 9}
                fill="#0F172A"
                stroke={isSelected ? '#38BDF8' : reagent.hexColor}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />

              {/* Planet Symbol */}
              <text
                x={coord.x}
                y={coord.y + 4}
                textAnchor="middle"
                fontSize={isSelected ? 12 : 10}
                fill={reagent.hexColor}
                className="font-bold select-none"
              >
                {p.symbol}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredPlanet && (
        <div className="mt-3 w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs font-mono shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base text-cyan-400 font-bold">{hoveredPlanet.symbol}</span>
              <span className="font-semibold text-slate-100">{hoveredPlanet.name} in {hoveredPlanet.sign.toUpperCase()}</span>
            </div>
            <span className="text-slate-400 tabular-nums">
              {hoveredPlanet.degreeInSign}°{hoveredPlanet.minutesInSign.toString().padStart(2, '0')}'
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Chemical Reagent:</span>
            <span className="font-semibold text-amber-300">{hoveredPlanet.chemicalReagent.name}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 mt-1">
            <span className="text-slate-400">Formula / Lattice:</span>
            <span className="text-slate-200">{hoveredPlanet.chemicalReagent.formula} ({hoveredPlanet.chemicalReagent.precipitateLattice})</span>
          </div>
        </div>
      )}

      {hoveredAspect && (
        <div className="mt-3 w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs font-mono shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-semibold text-amber-400 capitalize">
              {hoveredAspect.symbol} {hoveredAspect.body1} {hoveredAspect.type} {hoveredAspect.body2}
            </span>
            <span className="text-slate-400 tabular-nums">Orb: {hoveredAspect.orb}°</span>
          </div>
          <div className="text-slate-300">
            {hoveredAspect.chemicalEffect}
          </div>
        </div>
      )}
    </div>
  );
};
