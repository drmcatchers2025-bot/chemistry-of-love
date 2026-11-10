import { 
  CelestialBody, 
  ZodiacSign, 
  ChemicalReagent, 
  ZodiacSignInfo, 
  PlanetPosition, 
  NatalChartData, 
  NatalReagentFormula, 
  ReactorState, 
  AspectInfo, 
  LunarPhaseInfo 
} from '../types/astrochem';
import { 
  calculatePlanetLongitude, 
  longitudeToZodiac, 
  calculateLunarPhase, 
  calculateAspects, 
  dateToJulianDay, 
  getPlanetMeta 
} from './astronomy';

// 10 Classical & Modern Planetary Reagents
export const PLANETARY_REAGENTS: Record<CelestialBody, ChemicalReagent> = {
  sun: {
    id: 'sun',
    name: 'Solar Auric Sol',
    alchemicalName: 'Aurum Vegetabile / Potable Gold',
    formula: 'Au(NP) + HAuCl₄',
    casNumber: '7440-57-5',
    atomicOrMolarMass: '196.97 g/mol',
    primaryElement: 'fire',
    principle: 'sulphur',
    hexColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    basePh: 6.8,
    reactivityIndex: 8.5,
    precipitateLattice: 'dendritic',
    gasEvolutionRate: 4,
    description: 'Colloidal nano-gold sol with radiant photo-luminescence. Serves as an unalterable vitalizing core and photon donor.',
    reactionMechanism: 'Catalytic photon-activated disproportionation; oxidizes lower valence states while preserving solution vitality.'
  },
  moon: {
    id: 'moon',
    name: 'Lunar Argentum Nitrate',
    alchemicalName: 'Argentum Vivum / Diana’s Tree Salt',
    formula: 'AgNO₃ · 2H₂O',
    casNumber: '7761-88-8',
    atomicOrMolarMass: '169.87 g/mol',
    primaryElement: 'water',
    principle: 'salt',
    hexColor: '#E2E8F0',
    glowColor: 'rgba(226, 232, 240, 0.40)',
    basePh: 5.4,
    reactivityIndex: 6.8,
    precipitateLattice: 'dendritic',
    gasEvolutionRate: 1,
    description: 'Photosensitive silver crystallization reagent. In the presence of copper or light, it forms the famous Arbor Dianae.',
    reactionMechanism: 'Rapid single displacement precipitation; forms reflective needle-like silver crystalline arborizations on contact with baser metals.'
  },
  mercury: {
    id: 'mercury',
    name: 'Hermetic Quicksilver Hydrosol',
    alchemicalName: 'Hydrargyrum / Philosophic Quicksilver',
    formula: 'Hg(NO₃)₂ · H₂O ⇌ Hg₂²⁺',
    casNumber: '10045-94-0',
    atomicOrMolarMass: '200.59 g/mol',
    primaryElement: 'air',
    principle: 'mercury',
    hexColor: '#93C5FD',
    glowColor: 'rgba(147, 197, 253, 0.40)',
    basePh: 4.8,
    reactivityIndex: 9.2,
    precipitateLattice: 'amorphous',
    gasEvolutionRate: 6,
    description: 'Oscillating catalytic liquid matrix. Bridges the volatile and fixed states through rapid valency fluctuation.',
    reactionMechanism: 'Belousov-Zhabotinsky oscillating electron transfer; induces periodic chromatic pulsation and rapid ligand exchange.'
  },
  venus: {
    id: 'venus',
    name: 'Venusian Cupric Vitriol',
    alchemicalName: 'Aes Viride / Green Lion Vitriol',
    formula: 'CuSO₄ · 5H₂O',
    casNumber: '7758-99-8',
    atomicOrMolarMass: '249.68 g/mol',
    primaryElement: 'earth',
    principle: 'sulphur',
    hexColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    basePh: 4.0,
    reactivityIndex: 7.2,
    precipitateLattice: 'hexagonal',
    gasEvolutionRate: 2,
    description: 'Deep cerulean-cyan crystalline reagent. Governs harmonic chelation, affinity bonding, and crystalline stability.',
    reactionMechanism: 'Hexaquo-complexation; stabilizes organic ligands and forms vibrant cyan-emerald octahedral crystals upon cooling.'
  },
  mars: {
    id: 'mars',
    name: 'Martian Ferric Peroxide Complex',
    alchemicalName: 'Colcothar / Crocus Martis',
    formula: 'FeCl₃ + H₂O₂ ⇌ Fe³⁺ + •OH',
    casNumber: '7705-08-0',
    atomicOrMolarMass: '162.20 g/mol',
    primaryElement: 'fire',
    principle: 'sulphur',
    hexColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    basePh: 2.2,
    reactivityIndex: 9.8,
    precipitateLattice: 'amorphous',
    gasEvolutionRate: 15,
    description: 'Aggressive Fenton reagent generating intense thermal exothermic bursts, hydroxyl free radicals, and rapid gas boil-up.',
    reactionMechanism: 'Exothermic catalytic peroxide dissociation; violent effervescence, rust-amber plume, and steep temperature escalation.'
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jovian Stannous Crystal Sol',
    alchemicalName: 'Stannum Regale / Royal Tin Salt',
    formula: 'SnCl₂ · 2H₂O',
    casNumber: '10025-69-1',
    atomicOrMolarMass: '225.63 g/mol',
    primaryElement: 'air',
    principle: 'mercury',
    hexColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.40)',
    basePh: 7.9,
    reactivityIndex: 6.4,
    precipitateLattice: 'acicular',
    gasEvolutionRate: 3,
    description: 'Expansive alkaline reducing reagent. Governs dendritic crystalline spreading and volumetric enlargement of salts.',
    reactionMechanism: 'Powerful reduction of noble ions; deposits expansive feather-like metallic crystals and raises solution volume buffer.'
  },
  saturn: {
    id: 'saturn',
    name: 'Saturnine Plumbic Iodide',
    alchemicalName: 'Plumbum Philosophorum / Golden Rain',
    formula: 'PbI₂ (Precipitate)',
    casNumber: '10101-63-0',
    atomicOrMolarMass: '461.01 g/mol',
    primaryElement: 'earth',
    principle: 'salt',
    hexColor: '#FBBF24',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    basePh: 6.2,
    reactivityIndex: 4.5,
    precipitateLattice: 'hexagonal',
    gasEvolutionRate: 0,
    description: 'Dense gravitational precipitant. Cools the reaction vessel and precipitates glittering hexagonal golden-yellow crystalline rain.',
    reactionMechanism: 'Supersaturated crystallization upon thermal decay; forms dense, heavy golden hexagonal platelets that settle via gravity.'
  },
  uranus: {
    id: 'uranus',
    name: 'Uranian Luminescent Actinide',
    alchemicalName: 'Electrum Novum / Astral Phosphor',
    formula: 'UO₂(CH₃COO)₂ · 2H₂O',
    casNumber: '541-09-3',
    atomicOrMolarMass: '424.15 g/mol',
    primaryElement: 'air',
    principle: 'mercury',
    hexColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.50)',
    basePh: 5.1,
    reactivityIndex: 8.8,
    precipitateLattice: 'amorphous',
    gasEvolutionRate: 7,
    description: 'Photoluminescent cerulean-emerald ion complex. Triggers sudden spontaneous fluorescence and quantum electron jumps.',
    reactionMechanism: 'Triplet excitation and spontaneous phosphorescence; sudden valence shifts under ultraviolet excitation.'
  },
  neptune: {
    id: 'neptune',
    name: 'Neptunian Marine Complex',
    alchemicalName: 'Tinctura Caerulea / Oceanic Spirit',
    formula: 'Fe₄[Fe(CN)₆]₃ (Prussian Sol)',
    casNumber: '14038-43-8',
    atomicOrMolarMass: '859.23 g/mol',
    primaryElement: 'water',
    principle: 'mercury',
    hexColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.40)',
    basePh: 6.5,
    reactivityIndex: 5.6,
    precipitateLattice: 'amorphous',
    gasEvolutionRate: 1,
    description: 'Ultramarine colloidal suspension. Creates boundary-dissolving osmotic currents and subtle spectral diffusion.',
    reactionMechanism: 'Colloidal micelle dispersion; infinite optical dilution, deep wave absorption, and smooth solvent permeability.'
  },
  pluto: {
    id: 'pluto',
    name: 'Plutonic Bismuth Rainbow Nitride',
    alchemicalName: 'Caput Mortuum / Rainbow Obsidian',
    formula: 'Bi(NO₃)₃ · 5H₂O ⇌ Bi₂O₃',
    casNumber: '10035-06-0',
    atomicOrMolarMass: '485.07 g/mol',
    primaryElement: 'water',
    principle: 'salt',
    hexColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    basePh: 1.8,
    reactivityIndex: 9.5,
    precipitateLattice: 'dendritic',
    gasEvolutionRate: 8,
    description: 'Profound metamorphic reagent. Hydrolyzes into kaleidoscopic bismuth oxynitrate crystal steps with iridescent light sheen.',
    reactionMechanism: 'Catastrophic phase inversion; breaks stubborn covalent structures and precipitates iridescent stepped crystal pyramids.'
  },
  chiron: {
    id: 'chiron',
    name: 'Chironian Colloidal Platinum Sol',
    alchemicalName: 'Medicina Universalis / Ormus Catalytic Elixir',
    formula: 'Pt(NP) + H₂PtCl₆',
    casNumber: '7440-06-4',
    atomicOrMolarMass: '195.08 g/mol',
    primaryElement: 'air',
    principle: 'mercury',
    hexColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    basePh: 6.4,
    reactivityIndex: 7.8,
    precipitateLattice: 'dendritic',
    gasEvolutionRate: 3,
    description: 'Sub-nanometer colloidal platinum catalyst with deep bio-resonant regenerative kinetics. Bridges wounds in crystalline matrices through electron tunneling.',
    reactionMechanism: 'Catalytic hydrogenation and lattice reconciliation; mends fractured bonding frameworks and accelerates healing reaction pathways.'
  },
  ceres: {
    id: 'ceres',
    name: 'Cererian Organo-Humic Matrix',
    alchemicalName: 'Terra Damnata / Virgin Earth Matrix',
    formula: 'C₁₄H₁₂O₈ · Fe(II)-Chelate',
    casNumber: '1415-93-6',
    atomicOrMolarMass: '308.24 g/mol',
    primaryElement: 'earth',
    principle: 'salt',
    hexColor: '#84CC16',
    glowColor: 'rgba(132, 204, 22, 0.40)',
    basePh: 5.8,
    reactivityIndex: 5.2,
    precipitateLattice: 'hexagonal',
    gasEvolutionRate: 1,
    description: 'Abundant humic-fulvic agricultural mineral complex. Nourishes solution vitality, buffers extreme pH spikes, and fosters organic-crystalline harmony.',
    reactionMechanism: 'Polyvalent mineral chelation; binds excessive free radicals and forms fertile colloidal sedimentation beds.'
  }
};

// 12 Zodiac Environments
export const ZODIAC_ENVIRONMENTS: Record<ZodiacSign, ZodiacSignInfo> = {
  aries: {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    modality: 'cardinal',
    ruler: 'mars',
    solventEnvironment: 'Glacial Acetic Acid & Nitric Acid Mist',
    reactionAtmosphere: 'High-Oxygen Pressurized Plasma',
    temperatureDelta: 28,
    phModifier: -1.2,
    kineticAcceleration: 1.75,
    viscosityFactor: 0.65,
    spectralHue: '#EF4444'
  },
  taurus: {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    modality: 'fixed',
    ruler: 'venus',
    solventEnvironment: 'Dense Glycerol & Silicate Brine',
    reactionAtmosphere: 'Inert Argon Blanket (1.2 atm)',
    temperatureDelta: -6,
    phModifier: 0.3,
    kineticAcceleration: 0.85,
    viscosityFactor: 1.65,
    spectralHue: '#10B981'
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    modality: 'mutable',
    ruler: 'mercury',
    solventEnvironment: 'Anhydrous Diethyl Ether & Alcohol',
    reactionAtmosphere: 'Turbulent Nitrogen-Methane Vapor',
    temperatureDelta: 8,
    phModifier: -0.2,
    kineticAcceleration: 1.5,
    viscosityFactor: 0.55,
    spectralHue: '#38BDF8'
  },
  cancer: {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    modality: 'cardinal',
    ruler: 'moon',
    solventEnvironment: 'Deionized Double-Distilled Water Matrix',
    reactionAtmosphere: 'Humid Ambient Vapor with Silver Ions',
    temperatureDelta: -10,
    phModifier: 0.6,
    kineticAcceleration: 0.95,
    viscosityFactor: 1.1,
    spectralHue: '#E2E8F0'
  },
  leo: {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    modality: 'fixed',
    ruler: 'sun',
    solventEnvironment: 'Potassium Nitrate Flux & Gold Sol',
    reactionAtmosphere: 'Hyper-Radiant Solar UV Photons',
    temperatureDelta: 32,
    phModifier: -0.8,
    kineticAcceleration: 1.8,
    viscosityFactor: 0.7,
    spectralHue: '#F59E0B'
  },
  virgo: {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    modality: 'mutable',
    ruler: 'mercury',
    solventEnvironment: 'Purified Zeolite & Kaolinite Slurry',
    reactionAtmosphere: 'Micro-Filtered Laminar Airflow',
    temperatureDelta: -4,
    phModifier: -0.1,
    kineticAcceleration: 1.05,
    viscosityFactor: 1.35,
    spectralHue: '#84CC16'
  },
  libra: {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    modality: 'cardinal',
    ruler: 'venus',
    solventEnvironment: 'Equimolar Buffer Solution (pH 7.00)',
    reactionAtmosphere: 'Equilibrium Nitrogen-Oxygen Carrier',
    temperatureDelta: 2,
    phModifier: 0.0,
    kineticAcceleration: 1.15,
    viscosityFactor: 0.9,
    spectralHue: '#06B6D4'
  },
  scorpio: {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    modality: 'fixed',
    ruler: 'pluto',
    solventEnvironment: 'Concentrated Sulfuric Acid & Thiol Reagents',
    reactionAtmosphere: 'Anoxic Sulfur Dioxide Fumes',
    temperatureDelta: 16,
    phModifier: -1.6,
    kineticAcceleration: 1.6,
    viscosityFactor: 1.25,
    spectralHue: '#9333EA'
  },
  sagittarius: {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    modality: 'mutable',
    ruler: 'jupiter',
    solventEnvironment: 'Refluxing Ethanol & Alkali Hydroxide',
    reactionAtmosphere: 'Superheated Convection Stream',
    temperatureDelta: 22,
    phModifier: 0.9,
    kineticAcceleration: 1.65,
    viscosityFactor: 0.6,
    spectralHue: '#A855F7'
  },
  capricorn: {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    modality: 'cardinal',
    ruler: 'saturn',
    solventEnvironment: 'High-Density Heavy Liquid (Sodium Polytungstate)',
    reactionAtmosphere: 'Cryogenic Carbon Dioxide Pressurized',
    temperatureDelta: -16,
    phModifier: -0.4,
    kineticAcceleration: 0.75,
    viscosityFactor: 1.85,
    spectralHue: '#64748B'
  },
  aquarius: {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    modality: 'fixed',
    ruler: 'uranus',
    solventEnvironment: 'Supercritical Carbon Dioxide Fluid',
    reactionAtmosphere: 'Ionized Ozone & Electrostatic Spark Arc',
    temperatureDelta: 6,
    phModifier: 0.2,
    kineticAcceleration: 1.45,
    viscosityFactor: 0.45,
    spectralHue: '#0EA5E9'
  },
  pisces: {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    modality: 'mutable',
    ruler: 'neptune',
    solventEnvironment: 'Aqueous Marine Mineral Suspension',
    reactionAtmosphere: 'Saturated Nebular Aerosol',
    temperatureDelta: -8,
    phModifier: 0.4,
    kineticAcceleration: 0.9,
    viscosityFactor: 1.15,
    spectralHue: '#3B82F6'
  }
};

// Day of week planetary rulers
export const DAY_OF_WEEK_RULERS: Array<{ day: string; planet: CelestialBody; element: string }> = [
  { day: 'Sunday', planet: 'sun', element: 'Fire' },
  { day: 'Monday', planet: 'moon', element: 'Water' },
  { day: 'Tuesday', planet: 'mars', element: 'Fire' },
  { day: 'Wednesday', planet: 'mercury', element: 'Air' },
  { day: 'Thursday', planet: 'jupiter', element: 'Air/Fire' },
  { day: 'Friday', planet: 'venus', element: 'Earth/Water' },
  { day: 'Saturday', planet: 'saturn', element: 'Earth' },
];

export function getDayRuler(date: Date): { day: string; planet: CelestialBody; reagent: ChemicalReagent } {
  const dayIndex = date.getDay(); // 0 is Sunday
  const ruler = DAY_OF_WEEK_RULERS[dayIndex];
  return {
    day: ruler.day,
    planet: ruler.planet,
    reagent: PLANETARY_REAGENTS[ruler.planet]
  };
}

// Calculate full planetary chart for a given date and approximate coordinates
export function computePlanetaryChart(date: Date): {
  planets: PlanetPosition[];
  lunarPhase: LunarPhaseInfo;
  aspects: AspectInfo[];
  sunSign: ZodiacSignInfo;
  moonSign: ZodiacSignInfo;
} {
  const jd = dateToJulianDay(date);
  const bodies: CelestialBody[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'ceres'];

  const planets: PlanetPosition[] = bodies.map((body, index) => {
    const { longitude, speed, isRetrograde } = calculatePlanetLongitude(body, jd);
    const { sign, degreeInSign, minutesInSign, decan } = longitudeToZodiac(longitude);
    const meta = getPlanetMeta(body);

    // Decan subruler calculation (traditional Chaldean / Triplicity)
    const decanRuler: CelestialBody = decan === 1 ? body : decan === 2 ? 'venus' : 'jupiter';

    // Approximate house distribution (Equal house with Sun in 1st for noon baseline, or standard transit)
    const house = ((Math.floor(longitude / 30) + 12 - Math.floor(calculatePlanetLongitude('sun', jd).longitude / 30)) % 12) + 1;

    return {
      body,
      name: meta.name,
      symbol: meta.symbol,
      longitude,
      latitude: 0,
      speed,
      isRetrograde,
      sign,
      degreeInSign,
      minutesInSign,
      house,
      decan,
      decanRuler,
      chemicalReagent: PLANETARY_REAGENTS[body]
    };
  });

  const sunLong = planets.find(p => p.body === 'sun')!.longitude;
  const moonLong = planets.find(p => p.body === 'moon')!.longitude;
  const lunarPhase = calculateLunarPhase(moonLong, sunLong);
  const aspects = calculateAspects(planets);

  const sunSign = ZODIAC_ENVIRONMENTS[planets.find(p => p.body === 'sun')!.sign];
  const moonSign = ZODIAC_ENVIRONMENTS[planets.find(p => p.body === 'moon')!.sign];

  return {
    planets,
    lunarPhase,
    aspects,
    sunSign,
    moonSign
  };
}

// Synthesize Natal Reagent Formula from Birth Chart
export function synthesizeNatalFormula(
  ownerName: string,
  birthDate: string,
  birthTime: string,
  locationName: string,
  latitude = 40.7128,
  longitude = -74.0060
): NatalChartData {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hours, mins] = birthTime.split(':').map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day, hours, mins));

  const chart = computePlanetaryChart(dateObj);

  // Calculate elemental breakdown
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  chart.planets.forEach(p => {
    const env = ZODIAC_ENVIRONMENTS[p.sign];
    counts[env.element]++;
  });

  const total = chart.planets.length;
  const elementalBreakdown = {
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    air: Math.round((counts.air / total) * 100),
    water: Math.round((counts.water / total) * 100),
  };

  // Determine dominant planetary reagent based on Sun sign ruler and celestial dignities
  const sunPlanet = chart.planets.find(p => p.body === 'sun')!;
  const moonPlanet = chart.planets.find(p => p.body === 'moon')!;
  const sunEnv = ZODIAC_ENVIRONMENTS[sunPlanet.sign];
  const dominantReagent = PLANETARY_REAGENTS[sunEnv.ruler] || PLANETARY_REAGENTS.sun;

  // Synthesize custom formula properties
  const formulaCode = `NC-${ownerName.slice(0, 3).toUpperCase()}-${sunPlanet.sign.slice(0, 3).toUpperCase()}${moonPlanet.sign.slice(0, 3).toUpperCase()}`;
  
  const composition = chart.planets.slice(0, 5).map((p, idx) => {
    const reagent = PLANETARY_REAGENTS[p.body];
    const roles: Array<'Primary Solute' | 'Catalyst' | 'Chelating Agent' | 'Luminescent Core' | 'Stabilizer'> = [
      'Primary Solute',
      'Catalyst',
      'Chelating Agent',
      'Luminescent Core',
      'Stabilizer'
    ];
    const pct = idx === 0 ? 40 : idx === 1 ? 25 : idx === 2 ? 15 : idx === 3 ? 12 : 8;
    return {
      reagent,
      percentage: pct,
      role: roles[idx]
    };
  });

  const equilibriumPh = parseFloat(Math.max(1.8, Math.min(10.5, 7.0 + sunEnv.phModifier + (elementalBreakdown.fire > 30 ? -1.2 : 0.8))).toFixed(2));
  const activationEnergy = Math.round(45 + (elementalBreakdown.earth * 0.8) - (elementalBreakdown.fire * 0.5));
  const crystallizationThreshold = Math.round(18 + sunEnv.temperatureDelta * 0.4);

  const synthesizedFormula: NatalReagentFormula = {
    name: `${ownerName}'s ${sunPlanet.sign.toUpperCase()} Quintessence`,
    code: formulaCode,
    chemicalIUPAC: `[${dominantReagent.formula}]·[${PLANETARY_REAGENTS[moonPlanet.body].formula}]@[${sunEnv.solventEnvironment}]`,
    primarySolvent: sunEnv.solventEnvironment,
    equilibriumPh,
    activationEnergy,
    crystallizationThreshold,
    baseColor: dominantReagent.hexColor,
    luminescenceWavelength: 480 + (elementalBreakdown.air * 2) - (elementalBreakdown.water * 1.5),
    composition,
    esotericNotes: `Synthesized under ${chart.lunarPhase.phaseName} in ${sunEnv.name}. Modulated by ${chart.aspects.length} celestial aspect lines with dominant ${sunEnv.element} baseline thermodynamics.`
  };

  return {
    ownerName,
    birthDate,
    birthTime,
    latitude,
    longitude,
    locationName,
    planets: chart.planets,
    ascendant: (sunPlanet.longitude + 90) % 360,
    midheaven: (sunPlanet.longitude + 180) % 360,
    lunarPhase: chart.lunarPhase,
    aspects: chart.aspects,
    elementalBreakdown,
    dominantReagent,
    synthesizedFormula
  };
}

// Classical historical chart presets
export const HISTORICAL_PRESETS: Array<{
  name: string;
  subtitle: string;
  birthDate: string;
  birthTime: string;
  location: string;
  lat: number;
  lng: number;
}> = [
  {
    name: 'Marie Curie',
    subtitle: 'Radium & Polonium Pioneer, 2x Nobel Laureate',
    birthDate: '1867-11-07',
    birthTime: '12:00',
    location: 'Warsaw, Poland',
    lat: 52.2297,
    lng: 21.0122
  },
  {
    name: 'Isaac Newton',
    subtitle: 'Mathematician, Physicist & Master Alchemist',
    birthDate: '1643-01-04',
    birthTime: '01:00',
    location: 'Woolsthorpe, UK',
    lat: 52.8093,
    lng: -0.6304
  },
  {
    name: 'Paracelsus',
    subtitle: 'Father of Spagyrics & Toxicological Chemistry',
    birthDate: '1493-11-11',
    birthTime: '04:00',
    location: 'Einsiedeln, Switzerland',
    lat: 47.1287,
    lng: 8.7464
  },
  {
    name: 'Carl Gustav Jung',
    subtitle: 'Psychologist & Alchemical Symbolism Researcher',
    birthDate: '1875-07-26',
    birthTime: '19:20',
    location: 'Kesswil, Switzerland',
    lat: 47.5992,
    lng: 9.3175
  }
];

// Helper to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(ch => ch + ch).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Calculate cross-aspects between two natal charts
export function calculateCrossAspects(chartA: NatalChartData, chartB: NatalChartData): AspectInfo[] {
  const aspects: AspectInfo[] = [];
  const ASPECT_SPECS: Array<{ type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition'; angle: number; orb: number; symbol: string; chemicalEffect: string }> = [
    { type: 'conjunction', angle: 0, orb: 8.0, symbol: '☌', chemicalEffect: 'Direct Molecular Fusion: Overlapping orbitals induce instantaneous coordination bonding.' },
    { type: 'sextile', angle: 60, orb: 6.0, symbol: '⚹', chemicalEffect: 'Catalytic Synchronization: Low-energy pathway acceleration without degradation.' },
    { type: 'square', angle: 90, orb: 7.0, symbol: '□', chemicalEffect: 'Thermal Friction & Radical Discharge: High orbital stress, violent redox, enthalpy surge.' },
    { type: 'trine', angle: 120, orb: 8.0, symbol: '△', chemicalEffect: 'Harmonic Lattice Resonance: Effortless crystalline bonding and solution clarity.' },
    { type: 'opposition', angle: 180, orb: 8.0, symbol: '☍', chemicalEffect: 'Polar Redox Oscillation: Periodic wave shifting across opposing chemical states.' }
  ];

  chartA.planets.forEach(pA => {
    chartB.planets.forEach(pB => {
      let diff = Math.abs(pA.longitude - pB.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const spec of ASPECT_SPECS) {
        const orb = Math.abs(diff - spec.angle);
        if (orb <= spec.orb) {
          aspects.push({
            body1: pA.body,
            body2: pB.body,
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
    });
  });

  return aspects;
}

// Calculate the Synastry Chemical Reaction between two birthday natal charts
export function calculateSynastryReaction(chartA: NatalChartData, chartB: NatalChartData): import('../types/astrochem').SynastryReactionResult {
  const crossAspects = calculateCrossAspects(chartA, chartB);
  
  const dominantA = chartA.dominantReagent.id;
  const dominantB = chartB.dominantReagent.id;

  const squares = crossAspects.filter(a => a.type === 'square');
  const oppositions = crossAspects.filter(a => a.type === 'opposition');
  const trines = crossAspects.filter(a => a.type === 'trine');
  const conjunctions = crossAspects.filter(a => a.type === 'conjunction');

  const fireA = chartA.elementalBreakdown.fire;
  const fireB = chartB.elementalBreakdown.fire;
  const earthA = chartA.elementalBreakdown.earth;
  const earthB = chartB.elementalBreakdown.earth;
  const waterA = chartA.elementalBreakdown.water;
  const waterB = chartB.elementalBreakdown.water;
  const airA = chartA.elementalBreakdown.air;
  const airB = chartB.elementalBreakdown.air;

  // Calculate dynamic aspect affinity score based on exact cross-planetary angles
  const softAspects = crossAspects.filter(a => a.type === 'trine' || a.type === 'sextile' || a.type === 'conjunction');
  const hardAspects = crossAspects.filter(a => a.type === 'square' || a.type === 'opposition');
  const dynamicAffinity = Math.min(98, Math.max(46, 68 + (trines.length * 6) + (conjunctions.length * 5) - (squares.length * 4) + (oppositions.length * 2)));

  // Calculate modality friction (Cardinal initiating sparks, Fixed endurance, Mutable oscillation)
  const isSameReagent = dominantA === dominantB;

  // 1. Check for Same Reagent Homoconjunction (Two identical elemental baselines)
  const isHomologousFriction = isSameReagent && (squares.length > 0 || oppositions.length > 0 || fireA + fireB > 50);
  const isHomologousHarmony = isSameReagent && !isHomologousFriction;

  // 2. Check for Noble/Inert match (Sun + Moon, or noble air elements with high stability and no hard squares)
  const isSunMoonNoble = (dominantA === 'sun' && dominantB === 'moon') || (dominantA === 'moon' && dominantB === 'sun');
  const isNobleInert = !isSameReagent && ((isSunMoonNoble && squares.length === 0) || (airA > 35 && airB > 35 && squares.length === 0));

  // 3. Check for Violent Redox (Mars or Pluto involved, or high Fire + Fire with hard squares, or homoconjunction friction)
  const hasViolentReagents = dominantA === 'mars' || dominantB === 'mars' || dominantA === 'pluto' || dominantB === 'pluto';
  const isViolentRedox = isHomologousFriction || (hasViolentReagents && squares.length > 0) || (fireA + fireB > 60 && squares.length >= 1);

  // 4. Check for Precipitate Formation (Saturn involved, or high Earth + Water with stabilizing trines/conjunctions)
  const hasPrecipitateReagents = dominantA === 'saturn' || dominantB === 'saturn' || dominantA === 'moon' || dominantB === 'moon';
  const isPrecipitate = (hasPrecipitateReagents && (earthA + earthB > 40 || waterA + waterB > 40)) || (trines.length >= 2 && earthA + earthB > 35);

  // 5. Check for Oscillating Redox (Mercury involved with multiple oppositions or high air/fire waves)
  const isOscillating = (dominantA === 'mercury' || dominantB === 'mercury' || oppositions.length >= 1);

  // Selection
  if (isViolentRedox) {
    return {
      reactionType: 'violent_redox',
      title: isHomologousFriction ? `${chartA.dominantReagent.alchemicalName} Homoconjunction` : 'Volatile Conjunction',
      subtitle: isHomologousFriction ? `Dual ${chartA.dominantReagent.primaryElement.toUpperCase()} Polarity & Radical High-Energy Friction` : 'Violent Redox Reaction & Free Radical Thermal Surge',
      scientificEquation: 'Fe²⁺ + H₂O₂ + H⁺ → Fe³⁺ + •OH + H₂O   |   ΔH = -124.6 kJ/mol',
      readingTranslation: 'Volatile Conjunction! The crucible instantly boils over. The aggressive oxidative force of the first shatters the electron shell of the second, releasing a torrent of radical energy and thermal stress. This union generates immense passion, friction, and rapid evolution—handle with extreme care, lest the beaker shatter.',
      enthalpyDeltaH: -124.6,
      freeEnergyDeltaG: -88.4,
      reactionRateK: 2.85,
      precipitateMassMg: 8.2,
      temperatureDelta: 42.5,
      finalPh: 2.1,
      finalColor: { r: 239, g: 68, b: 68, hex: '#EF4444' },
      effervescenceLevel: 0.95,
      chemicalAffinityScore: Math.min(96, Math.max(52, dynamicAffinity - 4)),
      crossAspects,
      fourTierReading: {
        tier1_genesis: `When ${chartA.ownerName}'s ${chartA.dominantReagent.alchemicalName} meets ${chartB.ownerName}'s ${chartB.dominantReagent.alchemicalName}, the interface between your two energetic fields experiences an immediate shockwave. Neither of your charts operates in subdued tones; both arrive at this conjunction with saturated elemental valencies that refuse compromise. The fiery, volatile spirit of the first immediately strips the defensive boundary of the second, instigating a rapid transfer of psychological and spiritual electrons. In this initial moment of contact, there is no polite hesitation—only an overwhelming, instinctual recognition of a force capable of testing your limits.`,
        tier2_conjunction: `Within the alembic vessel, a volatile redox reaction ignites. The fluid violently boils and froths as reactive radicals surge through the solution, causing an abrupt thermal spike that warms the glass to scorching intensity. Microscopic steam plumes ascend the neck of the flask while the fluid shifts into an incandescent crimson luminescence. Metaphorically and physically, your union generates intense heat, raw creative passion, and rapid evolutionary friction. What would take decades to process in solitude is stripped to bare essence in hours together. The bond possesses immense catalytic potency, capable of incinerating falsehoods and forging pure gold—provided the vessel does not crack under the pressure.`,
        tier3_transit: `Prevailing celestial vectors exacerbate this chemical volatility. Cross-chart square alignments act as sharp orbital friction points, funneled through martial and plutonian corridors. When the Moon passes through cardinal angles or the Sun makes hard aspect to Mars, the ionic agitation in your shared matrix surges toward a boiling point. Atmospheric pressure within your crucible does not remain dormant; it demands periodic, conscious release through intense collaborative labor, creative breakthroughs, or physical exertion to prevent chaotic rupture.`,
        tier4_prescription: `Spagyric Prescription for the Alchemists: Respect the thermal threshold of your vessel. When you feel the crucible begin to rattle and hiss, do not add more caustic fuel; step back and install a cooling bath of patience and conscious solitude. Channel this combustible energy into a joint monumental work—whether an ambitious venture, an artistic creation, or an odyssey—where your shared fire can illuminate rather than destroy. Remember that the fiercest flames forge the most unyielding blades, but only when tempered in cool, living waters.`
      }
    };
  }

  if (isPrecipitate) {
    return {
      reactionType: 'crystalline_precipitation',
      title: isHomologousHarmony ? 'Harmonic Homologous Fusion' : 'The Great Precipitation',
      subtitle: isHomologousHarmony ? `Dual ${chartA.dominantReagent.primaryElement.toUpperCase()} Resonant Salt Matrix & Effortless Co-Crystallization` : 'Insoluble Golden Salt Lattice & Gravitational Bonding',
      scientificEquation: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s, hexagonal platelets) ↓   |   K_sp = 7.9 × 10⁻⁹',
      readingTranslation: 'The Great Precipitation. Individually transparent, when mixed they instantly anchor one another, forming a dense, unshakeable crystalline lattice that settles to the core of the vessel. A binding, structural destiny; they take shape together, creating a permanent monument of solid salt.',
      enthalpyDeltaH: -48.2,
      freeEnergyDeltaG: -56.1,
      reactionRateK: 0.82,
      precipitateMassMg: 78.4,
      temperatureDelta: -6.2,
      finalPh: 6.4,
      finalColor: { r: 245, g: 158, b: 11, hex: '#F59E0B' },
      effervescenceLevel: 0.08,
      chemicalAffinityScore: Math.min(99, Math.max(68, dynamicAffinity + 5)),
      crossAspects,
      fourTierReading: {
        tier1_genesis: `As ${chartA.ownerName}'s ${chartA.dominantReagent.alchemicalName} flows toward ${chartB.ownerName}'s ${chartB.dominantReagent.alchemicalName}, ambient Brownian motion abruptly decelerates. Individually, your essences carry high dissolution capacity and subtle gravity, moving through the world with measured precision. Yet the instant your liquid boundaries intertwine, a deep, silent recognition ripples through the medium. Your atomic geometries are reciprocal complements: where one soul possesses a structural void, the other carries the precise geometric key to fill it. The atmosphere in the laboratory grows tranquil and weighted with purpose.`,
        tier2_conjunction: `The Great Precipitation manifests with breathtaking elegance. Before your eyes, the once-clear liquid gives birth to millions of shimmering hexagonal crystalline platelets—a radiant golden rain drifting downward through the amber solution. Upon reaching the bottom of the flask, these micro-crystals interlock into a dense, permanent salt lattice. This is not a fleeting vapor or an ephemeral spark; it is the manifestation of tangible reality. In partnership, you do not disperse each other into thin air; you anchor one another to the earth, constructing a fortress of shared loyalty, unshakeable stability, and enduring material legacy.`,
        tier3_transit: `Saturnian and earthen transits govern the pace of this crystallization. Under slow-moving planetary cycles and stabilizing trine aspects, the facets of your shared salt matrix grow harder and more reflective. Lunar tides do not disturb this precipitate; rather, each full moon tightens the packing density of your lattice. The cosmic environment surrounding this conjunction is remarkably resistant to chaotic external disturbances, maintaining its low entropy even during turbulent astrological seasons.`,
        tier4_prescription: `Spagyric Prescription for the Alchemists: Guard your golden crystal bed against unnecessary agitation. Once your mutual trust and foundation have crystallized, resist the temptation of modern cynicism or restless boredom to shake the flask. Allow the structural weight of your devotion to be your anchor in worldly storms. Provide each other with clear responsibilities, quiet rituals of shared domesticity, and patience for the slow accumulation of wisdom. What has precipitated between you is designed to outlive the passing centuries.`
      }
    };
  }

  if (isNobleInert) {
    return {
      reactionType: 'inert_standoff',
      title: 'The Sovereign Stasis',
      subtitle: 'Noble Element Immiscibility & Unalterable Valence',
      scientificEquation: 'Au⁰(colloid) + AgNO₃(aq) → Au⁰(s) + Ag⁺ + NO₃⁻   |   ΔH ≈ 0 kJ/mol',
      readingTranslation: 'A sovereign stasis. When these two essences meet, they maintain a polite, unyielding distance. Like noble metals in an inert vault, neither is willing to alter its electron configuration for the other. High mutual respect, but zero catalytic transformation.',
      enthalpyDeltaH: -1.2,
      freeEnergyDeltaG: +4.8,
      reactionRateK: 0.005,
      precipitateMassMg: 0.0,
      temperatureDelta: 0.2,
      finalPh: 6.9,
      finalColor: { r: 226, g: 232, b: 240, hex: '#E2E8F0' },
      effervescenceLevel: 0.02,
      chemicalAffinityScore: Math.min(78, Math.max(44, dynamicAffinity - 12)),
      crossAspects,
      fourTierReading: {
        tier1_genesis: `The encounter between ${chartA.ownerName}'s ${chartA.dominantReagent.alchemicalName} and ${chartB.ownerName}'s ${chartB.dominantReagent.alchemicalName} is marked by majestic stillness. Both souls are born under complete, self-sufficient electron configurations; neither arrives at the crucible with hungry valencies or unresolved deficits demanding fulfillment. When introduced into the same chamber, you gaze upon each other with profound, almost aristocratic reverence. There is no nervous entanglement or desperate craving—only the clean recognition of an equal whose sovereignty matches your own.`,
        tier2_conjunction: `Inside the vessel, the two fluids demonstrate the phenomenon of sovereign stasis. Rather than dissolving or reacting, they form two pristine, immiscible layers separated by a razor-sharp, reflective meniscus. The top phase glows with silvery luminescence while the lower phase maintains its rich auric luster. Not a single calorie of excess heat is wasted; no caustic precipitate clouds the clarity of the carrier liquid. You occupy the same sanctuary, share the same air, and honor the same ideals, yet your inner core remains completely untarnished, uncompromised, and whole.`,
        tier3_transit: `Planetary movements glide over this conjunction without inducing turbulence. Because your bond relies on parallel alignment rather than needy entanglement, harsh planetary squares fail to ignite toxic friction. Even during chaotic solar storms or mercury retrogrades, your communication retains an impeccable, dignified grace. The celestial transits confirm that your mutual sphere is an embassy of peace amidst the noise of the cosmos.`,
        tier4_prescription: `Spagyric Prescription for the Alchemists: Do not attempt to force an artificial emulsion. In the lesser world, people mistakenly believe intimacy requires enmeshment and the erosion of individual identity; in the Royal Art, sovereign stasis is revered as the highest form of companionship. Never pour caustic acids or emotional drama into the glass in an attempt to trigger a false reaction. Celebrate your immaculate boundaries, grant each other vast freedom, and revel in the quiet majesty of standing side by side as kings and queens of your own realms.`
      }
    };
  }

  if (isOscillating) {
    return {
      reactionType: 'oscillating_redox',
      title: 'Periodic Astrochemical Pulsation',
      subtitle: 'Belousov-Zhabotinsky Non-Equilibrium Wave Dynamic',
      scientificEquation: '2H⁺ + BrO₃⁻ + 2CH₂(COOH)₂ ⟶ 2BrCH(COOH)₂ + 3H₂O + CO₂ ↑',
      readingTranslation: 'Periodic Astrochemical Pulsation. Caught between opposing gravitational pulls, the combined solution refuses a static equilibrium. Waves of sapphire and amber radiate rhythmically across the crucible—a dynamic, perpetually stimulating relationship that thrives on cycles of ebb and flow.',
      enthalpyDeltaH: -34.0,
      freeEnergyDeltaG: -42.0,
      reactionRateK: 1.15,
      precipitateMassMg: 14.5,
      temperatureDelta: 8.4,
      finalPh: 4.8,
      finalColor: { r: 168, g: 85, b: 247, hex: '#A855F7' },
      effervescenceLevel: 0.45,
      chemicalAffinityScore: Math.min(95, Math.max(58, dynamicAffinity)),
      crossAspects,
      fourTierReading: {
        tier1_genesis: `The meeting of ${chartA.ownerName}'s ${chartA.dominantReagent.alchemicalName} with ${chartB.ownerName}'s ${chartB.dominantReagent.alchemicalName} generates an electrifying current. Both of your spirits possess acute mental quickness, curiosity, and an innate aversion to monotony. As the streams blend, the solution refuses to settle into a predictable state. Your intellectual frequencies interlace into an intricate feedback loop: an idea sparked by one instantly catalyzes a counter-melody in the other, setting the entire emotional vessel into spontaneous, harmonious vibration.`,
        tier2_conjunction: `Before your eyes, a living Belousov-Zhabotinsky clockwork unfurls. Concentric rings of electric violet and warm gold ripple outward from the center of the crucible in perpetual, rhythmic choreography. For a moment, the solution appears tranquil and deep; then, with clockwork precision, a wave of incandescent luminescence sweeps through the flask, shifting the hue from royal amethyst back to twilight sapphire. Your relationship is a living organism governed by rhythmic tides of closeness and intellectual debate, passionate reunion and expansive independence. You cannot be summarized in a single static chapter; you are a continuous, mesmerizing performance.`,
        tier3_transit: `Planetary oppositions and mercurial ephemerides act as the cosmic pendulum for this reaction. When Mercury or the Moon aligns with your opposing planetary vectors, the frequency of your chromatic pulses accelerates, bringing flashes of visionary inspiration, lively discourse, and mutual reinvention. Transits do not wear down this bond; they recharge its battery, ensuring that you will never run out of mysteries to unravel within each other's minds.`,
        tier4_prescription: `Spagyric Prescription for the Alchemists: Surrender to the oscillation. The greatest peril for your union is attempting to force an artificial, motionless plateau. When one of you recedes like the tide, do not panic; trust that the alchemical waves must draw back into the ocean before returning with fresh pearls. Welcome the periodic reinvention of your routines, travel together to strange lands, and continuously introduce new philosophies and projects into your shared crucible to keep the sacred rhythm humming.`
      }
    };
  }

  // Default: Chromatic Complexation (Venusian Cupric / Jupiter / Coordination Complex)
  return {
    reactionType: 'chromatic_complexation',
    title: 'Chromatic Transmutation',
    subtitle: 'Coordination Complex Chelation & Spectral Transition',
    scientificEquation: '[Cu(H₂O)₆]²⁺ + 4NH₃ ⇌ [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O   |   log β₄ = 12.6',
    readingTranslation: 'Chromatic Transmutation. The very nature of the solution shifts before the eye, turning from a cool sapphire to a deep, royal amethyst. Their combined aura alters the ambient environment, proving that their interaction yields an entirely new compound neither possessed alone.',
    enthalpyDeltaH: -54.8,
    freeEnergyDeltaG: -68.3,
    reactionRateK: 1.42,
    precipitateMassMg: 28.0,
    temperatureDelta: 12.0,
    finalPh: 8.4,
    finalColor: { r: 147, g: 51, b: 234, hex: '#9333EA' },
    effervescenceLevel: 0.22,
    chemicalAffinityScore: Math.min(99, Math.max(72, dynamicAffinity + 6)),
    crossAspects,
    fourTierReading: {
      tier1_genesis: `When ${chartA.ownerName}'s ${chartA.dominantReagent.alchemicalName} is poured into the sacred vessel alongside ${chartB.ownerName}'s ${chartB.dominantReagent.alchemicalName}, a miraculous chemical resonance occurs. Your individual elemental charts do not compete for supremacy; instead, the open valence orbitals of the first embrace the ligand donor matrix of the second in seamless mathematical symmetry. The initial contact feels uncanny—like hearing the second half of a melody you have whistled in secret since childhood. An immediate sense of elevation and sacred belonging fills the atmosphere.`,
      tier2_conjunction: `A sublime chromatic transmutation takes place within the alembic. As the two solutions intertwine, the pale cerulean blue deepens into a royal, velvety amethyst, radiating an ethereal ultraviolet aura that illuminates the darker corners of the laboratory. Through this coordination chelation, both original elements are permanently transformed: neither could achieve this depth of color or thermodynamic stability alone. Your conjunction generates an entirely new substance—an elixir of mutual uplift that brings grace, aesthetic elevation, and profound healing to everyone who enters your shared sphere.`,
      tier3_transit: `Benefic planetary trines, Venusian ingress, and Jupiterian expansions bathe this conjunction in golden cosmic light. Under prevailing celestial harmonies, the thermodynamic stability of your complexation reaches maximum potency ($\Delta G = -68.3\text{ kJ/mol}$). Hard external transits that shatter lesser bonds are effortlessly neutralized and absorbed by the flexible coordination geometry of your mutual devotion. You exist in an orbital sanctuary of mutual grace.`,
      tier4_prescription: `Spagyric Prescription for the Alchemists: Pour this precious tincture into an airtight crystal phial and seal it with philosophic wax. The transmutation you have achieved is rare in this world. Use your combined radiance to enrich your community, foster beauty, and heal those who walk in spiritual poverty. Feed your bond with exquisite art, heartfelt gratitude, and sacred music. Yours is the fabled *Tinctura Magna*—the Great Elixir that turns the lead of daily life into spiritual gold.`
    }
  };
}

// Generate the Personal Core Reagent Profile with First-Person Alchemical Initiation & Match Oracle
export function generateCoreReagentProfile(chart: NatalChartData, currentDate = new Date()): import('../types/astrochem').CoreReagentProfile {
  const sunPlanet = chart.planets.find(p => p.body === 'sun')!;
  const moonPlanet = chart.planets.find(p => p.body === 'moon')!;
  const primaryReagent = chart.dominantReagent;
  const secondaryCatalyst = PLANETARY_REAGENTS[moonPlanet.body];
  const tertiarySolvent = ZODIAC_ENVIRONMENTS[sunPlanet.sign];

  const dayRuler = getDayRuler(currentDate);

  // Assign Spagyric Signature Role
  let spagyricRole = 'The Universal Chelator';
  if (primaryReagent.id === 'sun') spagyricRole = 'The Radiant Solar Core & Photon Donor';
  else if (primaryReagent.id === 'moon') spagyricRole = 'The Silver Crystallizer & Lunar Mirror';
  else if (primaryReagent.id === 'mercury') spagyricRole = 'The Volatile Transmuter & Oscillating Catalyst';
  else if (primaryReagent.id === 'venus') spagyricRole = 'The Harmonic Chelate & Emerald Octahedron';
  else if (primaryReagent.id === 'mars') spagyricRole = 'The Radical Oxidizer & Exothermic Spark';
  else if (primaryReagent.id === 'jupiter') spagyricRole = 'The Dendritic Expander & Royal Reducing Agent';
  else if (primaryReagent.id === 'saturn') spagyricRole = 'The Stabilizing Precipitate & Gravitational Anchor';
  else if (primaryReagent.id === 'uranus') spagyricRole = 'The Quantum Phosphor & Spontaneous Ionizer';
  else if (primaryReagent.id === 'neptune') spagyricRole = 'The Oceanic Micelle & Spectral Diffuser';
  else if (primaryReagent.id === 'pluto') spagyricRole = 'The Metamorphic Salt & Caput Mortuum';

  // 4-Tier First-Person Initiation Reading
  const fourTierReading = {
    tier1_elementalGenesis: `Look into your glass, Alchemist. Your natal celestial architecture fixes your baseline as ${primaryReagent.name} (${primaryReagent.formula})—a ${primaryReagent.primaryElement}-governed ${primaryReagent.precipitateLattice} lattice with an innate equilibrium pH of ${chart.synthesizedFormula.equilibriumPh}. Governed by ${sunPlanet.sign.toUpperCase()} and catalyzed by a ${moonPlanet.sign.toUpperCase()} Moon, you carry a molecular stability that resists superficial disruption while holding immense latent energy.`,
    tier2_stoichiometricConjunction: `When your essence enters an interactive vessel, you act as ${spagyricRole.toLowerCase()}. You do not bond casually; your electron configuration demands either deep coordination chelation or a deliberate, grounding precipitation. Those who approach your crucible must understand that your activation energy barrier is ${chart.synthesizedFormula.activationEnergy} kJ/mol—once breached, your transformation is absolute.`,
    tier3_environmentalTransits: `Today's Crucible Pressure: Under the cosmic transit of ${dayRuler.planet.toUpperCase()} (${dayRuler.reagent.formula}) with a ${chart.lunarPhase.phaseName} at ${(chart.lunarPhase.illumination * 100).toFixed(0)}% illumination, your vessel's kinetic flux accelerates by ${(chart.lunarPhase.reactionModifier.kineticsMultiplier).toFixed(2)}x. Expect heightened sensitivity in aqueous communication and spontaneous micro-crystallization.`,
    tier4_alchemicalPrescription: `Prescription for the Alchemist: Guard your solvent purity today. Avoid caustic unbuffered environments. Feed your interior flame steadily, and allow any newly precipitated insights to settle undisturbed for three diurnal cycles.`
  };

  // Derive Curated Best Chemical Matches
  const bestChemicalMatches: import('../types/astrochem').BestChemicalMatch[] = [
    {
      category: 'Harmonizing Counterpart',
      title: 'The Insoluble Golden Bond',
      archetypeDescription: 'A heavy metal or alkaline chelate that bonds with your ions to create an enduring, unbreakable crystalline salt precipitate.',
      partnerReagent: primaryReagent.id === 'saturn' ? PLANETARY_REAGENTS.moon : PLANETARY_REAGENTS.saturn,
      partnerSunSign: primaryReagent.id === 'saturn' ? 'Cancer' : 'Capricorn',
      samplePartnerName: primaryReagent.id === 'saturn' ? 'Lunar Argentum Alchemist' : 'Saturnine Plumbic Architect',
      sampleBirthDate: primaryReagent.id === 'saturn' ? '1992-07-14' : '1989-01-08',
      chemicalReactionPreview: 'Pb²⁺ + 2I⁻ → PbI₂ (Golden Rain Platelets) ↓',
      expectedThermodynamics: 'ΔH = -48.2 kJ/mol · Spontaneous Crystalline Matrix · High Gravitational Gravity'
    },
    {
      category: 'Catalytic Spark',
      title: 'The Exothermic Redox Dynamo',
      archetypeDescription: 'A high-energy radical oxidizer that shatters your outer electron barriers and injects vibrant thermal passion and rapid phase velocity.',
      partnerReagent: primaryReagent.id === 'mars' ? PLANETARY_REAGENTS.uranus : PLANETARY_REAGENTS.mars,
      partnerSunSign: primaryReagent.id === 'mars' ? 'Aquarius' : 'Aries',
      samplePartnerName: primaryReagent.id === 'mars' ? 'Electric Uranian Innovator' : 'Martian Fenton Catalyst',
      sampleBirthDate: primaryReagent.id === 'mars' ? '1995-02-11' : '1991-04-03',
      chemicalReactionPreview: 'Fe²⁺ + H₂O₂ + H⁺ → Fe³⁺ + •OH + H₂O (Thermal Surge)',
      expectedThermodynamics: 'ΔH = -124.6 kJ/mol · Kinetic Acceleration 2.8x · Intense Luminescence'
    },
    {
      category: 'Sovereign Peer',
      title: 'The Noble Invariant Ally',
      archetypeDescription: 'An equally noble, unreactive metallic matrix that honors your personal boundaries without forcing phase alteration or corrosive dissolution.',
      partnerReagent: primaryReagent.id === 'sun' ? PLANETARY_REAGENTS.moon : PLANETARY_REAGENTS.sun,
      partnerSunSign: primaryReagent.id === 'sun' ? 'Taurus' : 'Leo',
      samplePartnerName: primaryReagent.id === 'sun' ? 'Venusian Cupric Diplomat' : 'Solar Auric Sovereign',
      sampleBirthDate: primaryReagent.id === 'sun' ? '1990-05-04' : '1988-08-12',
      chemicalReactionPreview: 'Au⁰(colloid) + AgNO₃(aq) → Mutual Noble Equilibrium',
      expectedThermodynamics: 'ΔH ≈ 0 kJ/mol · Zero Corrosive Friction · Unyielding Mutual Sovereignty'
    }
  ];

  return {
    primaryReagent,
    secondaryCatalyst,
    tertiarySolvent,
    spagyricRole,
    crystallineStructure: primaryReagent.precipitateLattice.toUpperCase(),
    pHTendency: primaryReagent.basePh < 5 ? 'Strongly Acidic / Proton Donor' : primaryReagent.basePh > 8 ? 'Basic Alkaline / Electron Donor' : 'Neutral Buffered Buffer',
    fourTierReading,
    bestChemicalMatches
  };
}


