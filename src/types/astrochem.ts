export type CelestialBody = 
  | 'sun' 
  | 'moon' 
  | 'mercury' 
  | 'venus' 
  | 'mars' 
  | 'jupiter' 
  | 'saturn' 
  | 'uranus' 
  | 'neptune' 
  | 'pluto'
  | 'chiron'
  | 'ceres';

export type ZodiacSign = 
  | 'aries' 
  | 'taurus' 
  | 'gemini' 
  | 'cancer' 
  | 'leo' 
  | 'virgo' 
  | 'libra' 
  | 'scorpio' 
  | 'sagittarius' 
  | 'capricorn' 
  | 'aquarius' 
  | 'pisces';

export type AstrologicalElement = 'fire' | 'earth' | 'air' | 'water';

export type AstrologicalModality = 'cardinal' | 'fixed' | 'mutable';

export type AlchemicalPrinciple = 'sulphur' | 'mercury' | 'salt';

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

export interface AspectInfo {
  body1: CelestialBody;
  body2: CelestialBody;
  type: AspectType;
  angle: number;
  exactAngle: number;
  orb: number;
  symbol: string;
  chemicalEffect: string;
}

export interface PlanetPosition {
  body: CelestialBody;
  name: string;
  symbol: string;
  longitude: number; // 0 - 360 degrees
  latitude: number;
  speed: number; // degrees per day
  isRetrograde: boolean;
  sign: ZodiacSign;
  degreeInSign: number; // 0 - 30
  minutesInSign: number;
  house: number; // 1 - 12
  decan: 1 | 2 | 3;
  decanRuler: CelestialBody;
  chemicalReagent: ChemicalReagent;
}

export interface LunarPhaseInfo {
  phaseName: string;
  phaseAngle: number; // 0 - 360 (Moon - Sun)
  illumination: number; // 0.0 - 1.0
  isWaxing: boolean;
  reactionModifier: {
    kineticsMultiplier: number;
    crystallizationBias: number;
    luminescenceFactor: number;
    description: string;
  };
}

export interface ZodiacSignInfo {
  id: ZodiacSign;
  name: string;
  symbol: string;
  element: AstrologicalElement;
  modality: AstrologicalModality;
  ruler: CelestialBody;
  solventEnvironment: string;
  reactionAtmosphere: string;
  temperatureDelta: number; // in °C (-15 to +35)
  phModifier: number; // -1.5 to +1.5
  kineticAcceleration: number; // 0.7 to 1.8
  viscosityFactor: number; // 0.5 to 2.0
  spectralHue: string; // CSS color
}

export interface ChemicalReagent {
  id: CelestialBody;
  name: string;
  alchemicalName: string;
  formula: string;
  casNumber: string;
  atomicOrMolarMass: string;
  primaryElement: AstrologicalElement;
  principle: AlchemicalPrinciple;
  hexColor: string;
  glowColor: string;
  basePh: number;
  reactivityIndex: number; // 1 - 10
  precipitateLattice: 'dendritic' | 'hexagonal' | 'amorphous' | 'acicular' | 'none';
  gasEvolutionRate: number; // bubbles/sec when activated
  description: string;
  reactionMechanism: string;
}

export interface NatalChartData {
  ownerName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  latitude: number;
  longitude: number;
  locationName: string;
  planets: PlanetPosition[];
  ascendant: number;
  midheaven: number;
  lunarPhase: LunarPhaseInfo;
  aspects: AspectInfo[];
  elementalBreakdown: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  dominantReagent: ChemicalReagent;
  synthesizedFormula: NatalReagentFormula;
}

export interface NatalReagentFormula {
  name: string;
  code: string;
  chemicalIUPAC: string;
  primarySolvent: string;
  equilibriumPh: number;
  activationEnergy: number; // kJ/mol
  crystallizationThreshold: number; // °C
  baseColor: string;
  luminescenceWavelength: number; // nm
  composition: Array<{
    reagent: ChemicalReagent;
    percentage: number;
    role: 'Primary Solute' | 'Catalyst' | 'Chelating Agent' | 'Luminescent Core' | 'Stabilizer';
  }>;
  esotericNotes: string;
}

export interface BeakerReagentDrop {
  id: string;
  reagent: ChemicalReagent;
  volumeMl: number;
  timestamp: number;
  x: number;
}

export interface ReactorState {
  temperature: number; // in Celsius (ambient ~22°C to boiling 100°C)
  targetTemperature: number;
  ph: number;
  targetPh: number;
  fluidColor: { r: number; g: number; b: number; a: number };
  targetFluidColor: { r: number; g: number; b: number; a: number };
  effervescence: number; // 0 to 1 intensity
  crystallizationProgress: number; // 0 to 100 mg
  reactionRateK: number; // s^-1
  viscosity: number; // mPa*s
  turbidity: number; // NTU (0 to 100)
  luminescence: number; // cd/m^2
  spectrogramPeakNm: number;
  reagentsInVessel: Map<CelestialBody, number>; // body -> ml
  natalVolumeMl: number;
  activeAspectsTriggered: AspectInfo[];
  recentLogs: Array<{
    id: string;
    timestamp: string;
    event: string;
    type: 'synthesis' | 'aspect_burst' | 'phase_shift' | 'precipitation' | 'info';
  }>;
}

export type SynastryReactionType = 
  | 'inert_standoff' 
  | 'violent_redox' 
  | 'crystalline_precipitation' 
  | 'chromatic_complexation' 
  | 'oscillating_redox';

export interface SynastryReactionResult {
  reactionType: SynastryReactionType;
  title: string;
  subtitle: string;
  scientificEquation: string;
  readingTranslation: string;
  enthalpyDeltaH: number; // kJ/mol (negative = exothermic, positive = endothermic)
  freeEnergyDeltaG: number; // kJ/mol (negative = spontaneous)
  reactionRateK: number; // s^-1
  precipitateMassMg: number; // mg
  temperatureDelta: number; // °C
  finalPh: number;
  finalColor: { r: number; g: number; b: number; hex: string };
  effervescenceLevel: number; // 0 to 1
  chemicalAffinityScore: number; // 0 - 100%
  crossAspects: AspectInfo[];
  fourTierReading?: {
    tier1_genesis: string;
    tier2_conjunction: string;
    tier3_transit: string;
    tier4_prescription: string;
  };
}

export interface BestChemicalMatch {
  category: 'Harmonizing Counterpart' | 'Catalytic Spark' | 'Sovereign Peer';
  title: string;
  archetypeDescription: string;
  partnerReagent: ChemicalReagent;
  partnerSunSign: string;
  samplePartnerName: string;
  sampleBirthDate: string;
  chemicalReactionPreview: string;
  expectedThermodynamics: string;
}

export interface CoreReagentProfile {
  primaryReagent: ChemicalReagent;
  secondaryCatalyst: ChemicalReagent;
  tertiarySolvent: ZodiacSignInfo;
  spagyricRole: string;
  crystallineStructure: string;
  pHTendency: string;
  fourTierReading: {
    tier1_elementalGenesis: string;
    tier2_stoichiometricConjunction: string;
    tier3_environmentalTransits: string;
    tier4_alchemicalPrescription: string;
  };
  bestChemicalMatches: BestChemicalMatch[];
}


