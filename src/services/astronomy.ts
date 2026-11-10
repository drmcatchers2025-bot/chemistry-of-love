import { 
  CelestialBody, 
  ZodiacSign, 
  PlanetPosition, 
  LunarPhaseInfo, 
  AspectInfo, 
  AspectType,
  ChemicalReagent 
} from '../types/astrochem';

// Orbital elements for planets (J2000 epoch Keplerian approximations)
interface OrbitalElement {
  a: number; // semi-major axis (AU)
  e: number; // eccentricity
  i: number; // inclination (deg)
  L: number; // mean longitude (deg)
  w: number; // longitude of perihelion (deg)
  node: number; // longitude of ascending node (deg)
  rateL: number; // deg/century
  rateW: number;
}

const ORBITAL_DATA: Record<CelestialBody, OrbitalElement> = {
  sun: { a: 1.00000011, e: 0.01671022, i: 0.00005, L: 100.46457166, w: 102.93768193, node: 0, rateL: 35999.37244981, rateW: 0.32327364 },
  moon: { a: 0.00257, e: 0.0549, i: 5.145, L: 218.316, w: 83.353, node: 125.044, rateL: 481267.881, rateW: 40.69 },
  mercury: { a: 0.38709893, e: 0.20563069, i: 7.00487, L: 252.25084522, w: 77.45645, node: 48.33167, rateL: 149472.67411175, rateW: 0.16047689 },
  venus: { a: 0.72333199, e: 0.00677323, i: 3.39471, L: 181.97973, w: 131.572, node: 76.68069, rateL: 58517.81538729, rateW: 0.00268329 },
  mars: { a: 1.52366231, e: 0.09341233, i: 1.85061, L: 355.45332, w: 336.04084, node: 49.57854, rateL: 19140.30268499, rateW: 0.44441088 },
  jupiter: { a: 5.20336301, e: 0.04839266, i: 1.30530, L: 34.40438, w: 14.75385, node: 100.55615, rateL: 3034.74612231, rateW: 0.21252668 },
  saturn: { a: 9.53707032, e: 0.05415060, i: 2.48446, L: 49.94424, w: 92.43194, node: 113.71504, rateL: 1222.49362201, rateW: -0.41897216 },
  uranus: { a: 19.19126393, e: 0.04716771, i: 0.76986, L: 313.23218, w: 170.96424, node: 74.22988, rateL: 428.48202785, rateW: 0.40805281 },
  neptune: { a: 30.06896348, e: 0.00858587, i: 1.76917, L: -55.120029, w: 44.97135, node: 131.72169, rateL: 218.45945325, rateW: -0.32241464 },
  pluto: { a: 39.48168677, e: 0.24880766, i: 17.14175, L: 238.92881, w: 224.06676, node: 110.30347, rateL: 145.20780515, rateW: -0.04062942 },
  chiron: { a: 13.71, e: 0.383, i: 6.93, L: 52.84, w: 339.6, node: 209.3, rateL: 714.2, rateW: 0.12 },
  ceres: { a: 2.767, e: 0.076, i: 10.59, L: 154.2, w: 73.1, node: 80.3, rateL: 7820.6, rateW: 0.28 }
};

const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const PLANET_SYMBOLS: Record<CelestialBody, { name: string; symbol: string }> = {
  sun: { name: 'Sun', symbol: '☉' },
  moon: { name: 'Moon', symbol: '☽' },
  mercury: { name: 'Mercury', symbol: '☿' },
  venus: { name: 'Venus', symbol: '♀' },
  mars: { name: 'Mars', symbol: '♂' },
  jupiter: { name: 'Jupiter', symbol: '♃' },
  saturn: { name: 'Saturn', symbol: '♄' },
  uranus: { name: 'Uranus', symbol: '♅' },
  neptune: { name: 'Neptune', symbol: '♆' },
  pluto: { name: 'Pluto', symbol: '♇' },
  chiron: { name: 'Chiron', symbol: '⚷' },
  ceres: { name: 'Ceres', symbol: '⚳' }
};

export function dateToJulianDay(date: Date): number {
  const time = date.getTime();
  return time / 86400000 + 2440587.5;
}

export function julianCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Solve Kepler's equation M = E - e*sin(E)
function solveKepler(M_rad: number, e: number): number {
  let E = M_rad;
  for (let i = 0; i < 7; i++) {
    const delta = E - e * Math.sin(E) - M_rad;
    E -= delta / (1 - e * Math.cos(E));
  }
  return E;
}

// Calculate Ecliptic Longitude for a celestial body at a given Julian Day
export function calculatePlanetLongitude(body: CelestialBody, jd: number): { longitude: number; speed: number; isRetrograde: boolean } {
  const T = julianCenturies(jd);
  const orb = ORBITAL_DATA[body];

  // Mean anomaly M
  const L = normalizeDegrees(orb.L + orb.rateL * T);
  const w = normalizeDegrees(orb.w + orb.rateW * T);
  const M = normalizeDegrees(L - w);

  const e = orb.e;
  const E = solveKepler(toRad(M), e);

  // True anomaly v
  const xv = orb.a * (Math.cos(E) - e);
  const yv = orb.a * (Math.sqrt(1 - e * e) * Math.sin(E));
  const v = normalizeDegrees(toDeg(Math.atan2(yv, xv)));

  // Heliocentric longitude
  let lH = normalizeDegrees(v + w);

  // For Moon, apply simple perturbation models
  if (body === 'moon') {
    const sunL = normalizeDegrees(ORBITAL_DATA.sun.L + ORBITAL_DATA.sun.rateL * T);
    const D = normalizeDegrees(L - sunL); // mean elongation
    lH = normalizeDegrees(L + 6.289 * Math.sin(toRad(M)) + 1.274 * Math.sin(toRad(2 * D - M)) + 0.658 * Math.sin(toRad(2 * D)));
  }

  // Calculate speed by sampling 1 day later
  const jdNext = jd + 1;
  const TNext = julianCenturies(jdNext);
  const LNext = normalizeDegrees(orb.L + orb.rateL * TNext);
  const wNext = normalizeDegrees(orb.w + orb.rateW * TNext);
  const MNext = normalizeDegrees(LNext - wNext);
  const ENext = solveKepler(toRad(MNext), e);
  const xvNext = orb.a * (Math.cos(ENext) - e);
  const yvNext = orb.a * (Math.sqrt(1 - e * e) * Math.sin(ENext));
  const vNext = normalizeDegrees(toDeg(Math.atan2(yvNext, xvNext)));
  let lHNext = normalizeDegrees(vNext + wNext);
  if (body === 'moon') {
    const sunLNext = normalizeDegrees(ORBITAL_DATA.sun.L + ORBITAL_DATA.sun.rateL * TNext);
    const DNext = normalizeDegrees(LNext - sunLNext);
    lHNext = normalizeDegrees(LNext + 6.289 * Math.sin(toRad(MNext)) + 1.274 * Math.sin(toRad(2 * DNext - MNext)) + 0.658 * Math.sin(toRad(2 * DNext)));
  }

  let speed = lHNext - lH;
  if (speed < -180) speed += 360;
  if (speed > 180) speed -= 360;

  return {
    longitude: lH,
    speed,
    isRetrograde: speed < 0
  };
}

export function longitudeToZodiac(longitude: number): {
  sign: ZodiacSign;
  degreeInSign: number;
  minutesInSign: number;
  decan: 1 | 2 | 3;
} {
  const norm = normalizeDegrees(longitude);
  const signIndex = Math.floor(norm / 30);
  const sign = ZODIAC_ORDER[signIndex % 12];
  const totalDegreesInSign = norm % 30;
  const degreeInSign = Math.floor(totalDegreesInSign);
  const minutesInSign = Math.floor((totalDegreesInSign - degreeInSign) * 60);
  
  const decan: 1 | 2 | 3 = totalDegreesInSign < 10 ? 1 : totalDegreesInSign < 20 ? 2 : 3;

  return {
    sign,
    degreeInSign,
    minutesInSign,
    decan
  };
}

export function calculateLunarPhase(moonLong: number, sunLong: number): LunarPhaseInfo {
  const phaseAngle = normalizeDegrees(moonLong - sunLong);
  const illumination = (1 - Math.cos(toRad(phaseAngle))) / 2;
  const isWaxing = phaseAngle < 180;

  let phaseName = 'New Moon';
  let kineticsMultiplier = 0.8;
  let crystallizationBias = 0.4;
  let luminescenceFactor = 0.2;
  let description = 'Quiescent latency: High activation energy barrier, low thermal kinetics.';

  if (phaseAngle >= 22.5 && phaseAngle < 67.5) {
    phaseName = 'Waxing Crescent';
    kineticsMultiplier = 1.05;
    crystallizationBias = 0.6;
    luminescenceFactor = 0.4;
    description = 'Nucleation Phase: Fine seed crystallization initiates in aqueous solution.';
  } else if (phaseAngle >= 67.5 && phaseAngle < 112.5) {
    phaseName = 'First Quarter';
    kineticsMultiplier = 1.25;
    crystallizationBias = 0.75;
    luminescenceFactor = 0.6;
    description = 'Thermal Activation: Accelerating reaction velocity with sharp crystal edges.';
  } else if (phaseAngle >= 112.5 && phaseAngle < 157.5) {
    phaseName = 'Waxing Gibbous';
    kineticsMultiplier = 1.45;
    crystallizationBias = 0.9;
    luminescenceFactor = 0.85;
    description = 'High Potency Synthesis: Rapid reagent chelation and rising luminescence.';
  } else if (phaseAngle >= 157.5 && phaseAngle < 202.5) {
    phaseName = 'Full Moon';
    kineticsMultiplier = 1.75;
    crystallizationBias = 1.0;
    luminescenceFactor = 1.0;
    description = 'Peak Chemical Exaltation: Maximum reaction velocity, intense fluorescence.';
  } else if (phaseAngle >= 202.5 && phaseAngle < 247.5) {
    phaseName = 'Waning Gibbous';
    kineticsMultiplier = 1.35;
    crystallizationBias = 0.85;
    luminescenceFactor = 0.75;
    description = 'Precipitate Maturation: Crystalline lattices settle and clarify.';
  } else if (phaseAngle >= 247.5 && phaseAngle < 292.5) {
    phaseName = 'Last Quarter';
    kineticsMultiplier = 1.15;
    crystallizationBias = 0.65;
    luminescenceFactor = 0.55;
    description = 'Ionic Stabilization: Exothermic decay and chemical equilibrium stabilization.';
  } else if (phaseAngle >= 292.5 && phaseAngle < 337.5) {
    phaseName = 'Waning Crescent';
    kineticsMultiplier = 0.9;
    crystallizationBias = 0.5;
    luminescenceFactor = 0.35;
    description = 'Sedimentation: Supernatant liquor separates cleanly from fixed salt precipitate.';
  }

  return {
    phaseName,
    phaseAngle,
    illumination,
    isWaxing,
    reactionModifier: {
      kineticsMultiplier,
      crystallizationBias,
      luminescenceFactor,
      description
    }
  };
}

// Calculate Aspects between all celestial bodies
const ASPECT_SPECS: Array<{ type: AspectType; angle: number; orb: number; symbol: string; chemicalEffect: string }> = [
  { type: 'conjunction', angle: 0, orb: 7.5, symbol: '☌', chemicalEffect: 'Synthesis Synergy: Rapid covalent complexing and mutual amplification.' },
  { type: 'sextile', angle: 60, orb: 5.5, symbol: '⚹', chemicalEffect: 'Catalytic Acceleration: 1.6x reaction velocity boost without energy degradation.' },
  { type: 'square', angle: 90, orb: 6.5, symbol: '□', chemicalEffect: 'Thermal Stress & Effervescence: High kinetic friction, radical oxidation, gas bubbling.' },
  { type: 'trine', angle: 120, orb: 7.5, symbol: '△', chemicalEffect: 'Harmonic Crystallization: Stable dendritic lattice geometry and uniform luminescence.' },
  { type: 'opposition', angle: 180, orb: 7.5, symbol: '☍', chemicalEffect: 'Oscillating Red-Ox Pulses: Belousov-Zhabotinsky periodic chromatic wave shifting.' }
];

export function calculateAspects(planets: PlanetPosition[]): AspectInfo[] {
  const aspects: AspectInfo[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const spec of ASPECT_SPECS) {
        const orb = Math.abs(diff - spec.angle);
        if (orb <= spec.orb) {
          aspects.push({
            body1: p1.body,
            body2: p2.body,
            type: spec.type,
            angle: diff,
            exactAngle: spec.angle,
            orb: parseFloat(orb.toFixed(2)),
            symbol: spec.symbol,
            chemicalEffect: spec.chemicalEffect
          });
          break;
        }
      }
    }
  }

  return aspects;
}

export function getPlanetMeta(body: CelestialBody) {
  return PLANET_SYMBOLS[body];
}
