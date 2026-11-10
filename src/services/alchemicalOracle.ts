import { NatalChartData, SynastryReactionResult } from '../types/astrochem';

export interface ChatMessageContext {
  role: 'user' | 'model';
  content: string;
}

/**
 * Generate a direct, accurate, and deeply insightful response to the seeker's question
 * based on the calculated astrological charts, reagents, aspects, and reaction physics.
 */
export function generateAlchemicalOracleResponse(
  query: string,
  chartA?: NatalChartData,
  chartB?: NatalChartData,
  synastryResult?: SynastryReactionResult,
  _history?: ChatMessageContext[]
): string {
  const q = query.toLowerCase().trim();

  const nameA = chartA?.ownerName || 'Essence Alpha';
  const nameB = chartB?.ownerName || 'Essence Beta';
  const reagentA = chartA?.dominantReagent;
  const reagentB = chartB?.dominantReagent;

  const fireA = chartA?.elementalBreakdown?.fire ?? 25;
  const earthA = chartA?.elementalBreakdown?.earth ?? 25;
  const airA = chartA?.elementalBreakdown?.air ?? 25;
  const waterA = chartA?.elementalBreakdown?.water ?? 25;

  const fireB = chartB?.elementalBreakdown?.fire ?? 25;
  const earthB = chartB?.elementalBreakdown?.earth ?? 25;
  const airB = chartB?.elementalBreakdown?.air ?? 25;
  const waterB = chartB?.elementalBreakdown?.water ?? 25;

  const affinity = synastryResult?.chemicalAffinityScore ?? 88;
  const reactionType = synastryResult?.title ?? 'Celestial Conjunction';
  const subtitle = synastryResult?.subtitle ?? 'Alchemical Bond';
  const deltaH = synastryResult?.enthalpyDeltaH ?? -15.4;
  const isExothermic = deltaH < 0;

  // ==========================================
  // REAL-WORLD RELATIONAL & PSYCHOLOGICAL QUESTIONS
  // ==========================================

  // A. Communication Blocks / Silence / "Why won't he talk to me?" / "Why is he ignoring me?"
  if (
    q.includes('wont talk') || 
    q.includes("won't talk") || 
    q.includes('not talking') || 
    q.includes('talk to me') || 
    q.includes('ignoring') || 
    q.includes('silent') || 
    q.includes('silence') || 
    q.includes('shut down') || 
    q.includes('stonewall') || 
    q.includes('ghosting') || 
    q.includes('not texting') || 
    q.includes('stop texting') ||
    q.includes('quiet')
  ) {
    return `When **${nameB}** shuts down or refuses to speak, it is an instinctual **calcination defense** rather than a true absence of feeling.

Looking at your two elemental structures, **${nameA}** carries a high-thermal, urgent signature (${reagentA?.alchemicalName || 'Fire/Vital Sol'}), which processes emotions through confrontation, verbal release, and immediate resolution. But **${nameB}** is anchored in **${reagentB?.alchemicalName || 'Earth/Salt'}**—a structure that contracts into an impenetrable shell when heated too quickly.

Here is the exact crucible dynamic playing out between you:
1. **The Overheating Trap:** When ${nameB} feels criticized, cornered, or pressured by high emotional temperature, his mental valves seize. Speaking feels dangerous to him in that state because he hasn't yet synthesized his thoughts.
2. **The Calcination Shell:** Silence is his emergency cooling mechanism. To ${nameA}, that silence feels like cruel rejection or abandonment; but to ${nameB}, speaking would cause the vessel to fracture entirely.
3. **What You Must Do Right Now:** Lower the thermal flame immediately. Stop sending paragraphs or demanding answers. Step completely back for 48 hours and let the air circulate in the vessel. When an earthy partner realizes the heat has dropped and he is not under siege, his voice and willingness to connect return naturally.`;
  }

  // B. Third-Party Distractions / Other Women / Loyalty / "Why does he see other girls?"
  if (
    q.includes('other girl') || 
    q.includes('other girls') || 
    q.includes('other women') || 
    q.includes('other woman') || 
    q.includes('cheating') || 
    q.includes('cheat') || 
    q.includes('loyalty') || 
    q.includes('faithful') || 
    q.includes('wandering') || 
    q.includes('another girl') || 
    q.includes('another woman') || 
    q.includes('side piece') || 
    q.includes('affair') || 
    q.includes('trust him') || 
    q.includes('can i trust')
  ) {
    return `If **${nameB}** is seeking the attention of other women or dividing his focus, look honestly at the energetic reality of your crucible: this is **an evaporation of containment**.

In sacred alchemy, a transformation cannot take place in a cracked or unsealed vessel. When ${nameB} looks outward, it is rarely about the other women themselves—it is almost always an **avoidance reflex**. The deep, intense conjunction between ${nameA} and ${nameB} under **${reactionType}** is heavy, demanding, and requires total vulnerability. When a man feels overwhelmed or inadequate inside a high-stakes union, he frequently escapes toward lightweight, superficial validation where nothing real is demanded of him.

Here is the alchemical truth you need to hold:
1. **Avoidance of the Crucible:** Other distractions are low-risk escapes. With them, he doesn't have to face the intense expectations, emotional weight, or vulnerability that ${nameA} naturally evokes in him.
2. **The Broken Hermetic Seal:** You cannot continue heating a reaction when one partner refuses to seal the vessel. It depletes ${nameA}'s noble gold (${reagentA?.alchemicalName}) into exhaustion and self-doubt.
3. **The Unbending Boundary:** Do not compete with other women, and do not beg for exclusivity. The alchemical law is absolute: *The Stone is only forged in a closed retort.* Tell him with calm, sovereign dignity: *"I only participate in a vessel that is consecrated and completely sealed to us. If you need outside validation, you are free to seek it—but not while holding space in my crucible."*`;
  }

  // C. Emotional Distance / Pulling Away / "Why is he so distant or cold?"
  if (
    q.includes('distant') || 
    q.includes('pulling away') || 
    q.includes('pulled away') || 
    q.includes('so cold') || 
    q.includes('withdrawn') || 
    q.includes('avoiding me') || 
    q.includes('unreachable') || 
    q.includes('detached') ||
    q.includes('drifting')
  ) {
    return `The distance you are feeling from **${nameB}** is the **endothermic pullback** of your chemical conjunction.

Your reaction dynamic has reached an internal saturation point. When ${nameA} and ${nameB} experience high intimacy or rapid bonding, the energetic temperature spikes. If ${nameB}'s matrix does not have enough time to assimilate that heat, he instinctively retreats to his default baseline to regain his sense of individual self.

Understand this psychological rhythm:
- **He pulls away to find his footing, not because the bond is dead.** Earth and heavy reagents need periods of cold stasis to solidify changes.
- **The Chase Reaction:** If ${nameA} panics and chases him during his retreat, it validates his fear that intimacy means losing his freedom.
- **The Spagyric Antidote:** Anchor yourself in your own solar radiance. When you pull your energy back into your own life and stop monitoring his every move, the magnetic vacuum draws him right back into your orbit.`;
  }

  // D. Does He Love Me? / True Feelings / Care
  if (
    q.includes('love me') || 
    q.includes('does he love') || 
    q.includes('how does he feel') || 
    q.includes('does he care') || 
    q.includes('his feelings') || 
    q.includes('feel about me') || 
    q.includes('in love') ||
    q.includes('real feelings')
  ) {
    return `The question of whether **${nameB}** loves **${nameA}** comes down to the fundamentally different ways your two reagents express affection.

Under the archetype of **${reactionType}**, the energetic link between you is powerful (${affinity}% Affinity)—it is impossible for him not to feel the pull of your presence. However:
- **How ${nameA} Loves:** You love through warmth, verbal reassurance, passionate intensity, and shared emotional vulnerability (${fireA}% Fire / ${waterA}% Water).
- **How ${nameB} Loves:** He demonstrates care through presence, practical consistency, acts of service, and physical proximity rather than emotional poetry (${earthB}% Earth / ${airB}% Air).
- **The Distortion:** Because he does not mirror your specific expressive vocabulary, you often fear he doesn't care at all. Look at his concrete actions when there is no tension: does he protect the space, show up, and make room for you in his physical world? That is where his love resides. If he is withholding even basic respect, then his fear has overpowered his affection.`;
  }

  // E. Hot and Cold / Mixed Signals / Playing Games
  if (
    q.includes('hot and cold') || 
    q.includes('mixed signals') || 
    q.includes('playing games') || 
    q.includes('one day he') || 
    q.includes('inconsistent') || 
    q.includes('confusing')
  ) {
    return `The maddening "hot-and-cold" cycle you are enduring with **${nameB}** is an **oscillating redox wave** between your two charts.

One day, the chemistry between your ${reagentA?.alchemicalName || 'gold'} and his ${reagentB?.alchemicalName || 'vitriol'} ignites brilliantly—producing intense closeness, laughter, and magnetic attraction. But that very closeness triggers an internal alarm inside ${nameB}: *"I am losing control."* Immediately, his system compensates by swinging hard in the opposite direction—turning icy, aloof, and distant.

How to break the cycle:
1. **Refuse to Ride the Rollercoaster:** When he is hot, enjoy it without grasping. When he turns cold, match his distance with calm unbothered poise rather than anxiety.
2. **Set the Standard:** Say plainly: *"I value consistency. When you swing hot and cold, it wastes our energetic yield. I am here for real depth, not an emotional seesaw."*
3. Consistency is the true proof of alchemical maturity.`;
  }

  // F. Will He Come Back? / Miss Me / Breakup & Reconciliation
  if (
    q.includes('come back') || 
    q.includes('will he return') || 
    q.includes('get back together') || 
    q.includes('broken up') || 
    q.includes('broke up') || 
    q.includes('regret') || 
    q.includes('miss me') || 
    q.includes('does he miss')
  ) {
    return `Does **${nameB}** miss **${nameA}**? The astrological stoichiometry is clear: yes. You cannot introduce a high-affinity solar reagent into someone's life without leaving an indelible imprint on their molecular memory.

However, whether he comes back in a healthy way depends entirely on what happens during this phase of **dissolution (Solve)**:
- If you stay connected through arguments, anxious texts, or checking his socials, he never actually experiences your absence. He gets to keep your energy while offering you zero commitment.
- For an earthly, stubborn constitution like ${nameB}'s to experience genuine remorse and desire, the vessel must go completely silent. He has to feel the cold void where your warmth used to be.
- If you give him the gift of total absence, his mind will naturally cycle through the memories of your highest resonance. Let him do the reaching.`;
  }

  // G. What Should I Do Right Now? / Practical Action
  if (
    q.includes('what should i do') || 
    q.includes('what do i do') || 
    q.includes('how should i talk') || 
    q.includes('what should i text') || 
    q.includes('how to respond') || 
    q.includes('how do i handle')
  ) {
    return `Here is your direct alchemical prescription for navigating **${nameB}** right now:

1. **Cease All Thermal Output:** Do not double-text, do not demand emotional explanations, and do not explain yourself again. You have already said enough; words are losing their potency in this state.
2. **Reclaim Your Auric Field:** Pour all the energy you've been obsessing over his behavior back into your own life, passions, beauty, and peace. An alchemist never chases escaping steam—they tend the hearth of their own soul.
3. **Respond Only to Equal Effort:** If he reaches out with breadcrumbs (a low-effort meme or a casual *"hey"*), respond with polite brevity, not an outpouring of emotion. Let his effort match the magnitude of the bond you desire.
4. **Remember Who You Are:** You carry the noble dignity of ${reagentA?.alchemicalName || 'Pure Auric Gold'}. Gold never begs lead to realize its worth.`;
  }

  // 1. Specific Elemental Comparisons (e.g., "Who is more fiery?", "Who is more emotional?")
  if (q.includes('who is more') || q.includes('who has more') || q.includes('which one is more') || q.includes('more fiery') || q.includes('more emotional') || q.includes('more grounded') || q.includes('more airy') || q.includes('more passionate') || q.includes('more patient')) {
    if (q.includes('fire') || q.includes('fiery') || q.includes('passionate') || q.includes('intense') || q.includes('temper')) {
      const moreFiery = fireA >= fireB ? nameA : nameB;
      const lessFiery = fireA >= fireB ? nameB : nameA;
      const valMore = Math.max(fireA, fireB);
      const valLess = Math.min(fireA, fireB);
      const reagentMore = fireA >= fireB ? reagentA?.alchemicalName : reagentB?.alchemicalName;
      const reagentLess = fireA >= fireB ? reagentB?.alchemicalName : reagentA?.alchemicalName;

      return `Looking into the elemental breakdown of both charts, **${moreFiery}** is distinctly more fiery, carrying **${valMore}% Fire** in their celestial matrix (crystallized through ${reagentMore}), compared to **${lessFiery}** with **${valLess}% Fire** (${reagentLess}).

${moreFiery} provides the primary ignition and thermal combustion within your alembic vessel—initiating movement, creative drive, and spontaneous passion. ${lessFiery} acts as the containing counterweight, preventing the thermal energy from blowing out the crucible's seal. When tensions ignite, remember that ${moreFiery}'s heat seeks expression, while ${lessFiery} requires steady containment rather than direct confrontation.`;
    }

    if (q.includes('water') || q.includes('emotional') || q.includes('sensitive') || q.includes('intuitive') || q.includes('feeling')) {
      const moreWater = waterA >= waterB ? nameA : nameB;
      const lessWater = waterA >= waterB ? nameB : nameA;
      const valMore = Math.max(waterA, waterB);
      const valLess = Math.min(waterA, waterB);
      const reagentMore = waterA >= waterB ? reagentA?.alchemicalName : reagentB?.alchemicalName;
      const reagentLess = waterA >= waterB ? reagentB?.alchemicalName : reagentA?.alchemicalName;

      return `In terms of emotional depth and fluid resonance, **${moreWater}** carries the stronger aqueous signature at **${valMore}% Water** (${reagentMore}), whereas **${lessWater}** holds **${valLess}% Water** (${reagentLess}).

${moreWater} feels the psychic undercurrents of the bond first—processing experiences through intuitive absorption, empathy, and visceral memory. ${lessWater} approaches the vessel with more objective detachment or pragmatic structure. Honor ${moreWater}'s need for emotional dissolution and psychological safety; their feelings and insights are the philosophical solvent that softens stubborn precipitates.`;
    }

    if (q.includes('earth') || q.includes('grounded') || q.includes('practical') || q.includes('patient') || q.includes('stable') || q.includes('stubborn')) {
      const moreEarth = earthA >= earthB ? nameA : nameB;
      const lessEarth = earthA >= earthB ? nameB : nameA;
      const valMore = Math.max(earthA, earthB);
      const valLess = Math.min(earthA, earthB);
      const reagentMore = earthA >= earthB ? reagentA?.alchemicalName : reagentB?.alchemicalName;
      const reagentLess = earthA >= earthB ? reagentB?.alchemicalName : reagentA?.alchemicalName;

      return `Upon weighing the salt of both vessels, **${moreEarth}** is the more grounded and structurally anchored partner with **${valMore}% Earth** (${reagentMore}), while **${lessEarth}** registers **${valLess}% Earth** (${reagentLess}).

${moreEarth} anchors the vessel to physical reality, material security, and enduring patience. When abstract visions or emotional storms swirl within the crucible, ${moreEarth} provides the solid crystalline foundation that keeps the union from dissipating into ether.`;
    }

    if (q.includes('air') || q.includes('intellectual') || q.includes('communicative') || q.includes('rational') || q.includes('social') || q.includes('talkative')) {
      const moreAir = airA >= airB ? nameA : nameB;
      const lessAir = airA >= airB ? nameB : nameA;
      const valMore = Math.max(airA, airB);
      const valLess = Math.min(airA, airB);
      const reagentMore = airA >= airB ? reagentA?.alchemicalName : reagentB?.alchemicalName;
      const reagentLess = airA >= airB ? reagentB?.alchemicalName : reagentA?.alchemicalName;

      return `In the sphere of intellect and airy discourse, **${moreAir}** holds the greater mental velocity with **${valMore}% Air** (${reagentMore}), compared to **${lessAir}** with **${valLess}% Air** (${reagentLess}).

${moreAir} governs the dialogue, intellectual curiosity, and communicative respiration between you both. They thrive on exchanging ideas, conceptual synthesis, and verbal clarity to make sense of the chemical interaction occurring in the crucible.`;
    }
  }

  // 2. Harmonizing Elemental Friction / Challenges / Friction Points
  if (q.includes('harmonize') || q.includes('friction') || q.includes('challenge') || q.includes('conflict') || q.includes('clash') || q.includes('tension') || q.includes('argue') || q.includes('problem') || q.includes('weakness')) {
    const squaresAndOppositions = synastryResult?.crossAspects.filter(a => a.type === 'square' || a.type === 'opposition') || [];
    const aspectSummary = squaresAndOppositions.length > 0 
      ? `Specifically, the cross-planetary ${squaresAndOppositions[0].type} between ${squaresAndOppositions[0].body1} and ${squaresAndOppositions[0].body2} creates periodic energetic spikes.`
      : `The primary friction arises from the structural contrast between ${reagentA?.alchemicalName || 'Alpha'} and ${reagentB?.alchemicalName || 'Beta'}.`;

    return `The core alchemical friction between **${nameA}** and **${nameB}** stems from your differing elemental equilibrium. ${aspectSummary}

To harmonize this friction:
1. **Regulate the Thermal Valve:** Because your reaction dynamics produce ${isExothermic ? 'spontaneous exothermic heat' : 'endothermic phase absorption'}, when arguments flare, step away from the reaction vessel for at least 20 minutes to allow the effervescence to subside before resuming discourse.
2. **Assign Alchemical Roles:** Let ${nameA} operate in their natural principle (${reagentA?.principle || 'Sulphur'}, the active spark) while allowing ${nameB} to fulfill their principle (${reagentB?.principle || 'Salt'}, the stabilizing vessel), rather than competing for the same energetic pole.
3. **Neutralize with Solvent:** Whenever stubborn precipitates of resentment form, introduce lunar empathy (listening without rebuttal) as your universal solvent. Patience is the hermetic catalyst that prevents the glassware from fracturing under pressure.`;
  }

  // 3. Hidden Alchemical Strengths / Synergy
  if (q.includes('strength') || q.includes('gift') || q.includes('superpower') || q.includes('power') || q.includes('best') || q.includes('compatible') || q.includes('compatibility')) {
    const trinesAndSextiles = synastryResult?.crossAspects.filter(a => a.type === 'trine' || a.type === 'sextile') || [];
    const aspectDetail = trinesAndSextiles.length > 0
      ? `The harmonious ${trinesAndSextiles[0].type} aspect connecting ${trinesAndSextiles[0].body1} to ${trinesAndSextiles[0].body2} channels an effortless golden conduit of mutual understanding.`
      : `The synergistic resonance of ${affinity}% between your reagents creates natural resilience against external disruption.`;

    return `The greatest hidden alchemical strength of the union between **${nameA}** and **${nameB}** is your **${affinity}% Harmonic Affinity** under the archetype of **${reactionType}**.

${aspectDetail}

Together, ${reagentA?.alchemicalName} and ${reagentB?.alchemicalName} form an alloy of complementary virtues. Where one partner experiences depletion, the other instinctively releases the catalytic reagent needed for regeneration. When you collaborate on shared worldly or creative projects, your combined energetic output exceeds the sum of your individual charts—producing what the spagyrists call the *Multiplication of the Stone*.`;
  }

  // 4. Inquiries about a specific partner (e.g. "Tell me about pinuu", "Who is norm?")
  const mentionsOnlyA = (q.includes(nameA.toLowerCase().split(' ')[0]) || q.includes('alpha')) && !q.includes(nameB.toLowerCase().split(' ')[0]);
  const mentionsOnlyB = (q.includes(nameB.toLowerCase().split(' ')[0]) || q.includes('beta')) && !q.includes(nameA.toLowerCase().split(' ')[0]);

  if (mentionsOnlyA && reagentA) {
    return `**${nameA}** (born ${chartA?.birthDate || 'in cosmic time'}) is governed at the soul level by **${reagentA.alchemicalName}** (${reagentA.name}).

- **Elemental Matrix:** ${fireA}% Fire, ${earthA}% Earth, ${airA}% Air, ${waterA}% Water.
- **Spagyric Principle:** ${reagentA.principle.toUpperCase()} — representing the ${reagentA.principle === 'sulphur' ? 'vital solar consciousness and catalytic spark' : reagentA.principle === 'mercury' ? 'fluid communicative life-force and adaptable spirit' : 'grounded physical vessel and immortal salt'}.
- **Crystalline Lattice:** ${reagentA.precipitateLattice} geometry with a base pH of ${reagentA.basePh}.
- **Core Disposition:** ${reagentA.description}

Within the crucible of this relationship, ${nameA} acts as the ${reagentA.principle === 'sulphur' ? 'igniter of passion and purpose' : 'steady reservoir of emotional and intuitive substance'}.`;
  }

  if (mentionsOnlyB && reagentB) {
    return `**${nameB}** (born ${chartB?.birthDate || 'in cosmic time'}) is anchored by the noble reagent **${reagentB.alchemicalName}** (${reagentB.name}).

- **Elemental Matrix:** ${fireB}% Fire, ${earthB}% Earth, ${airB}% Air, ${waterB}% Water.
- **Spagyric Principle:** ${reagentB.principle.toUpperCase()} — embodying the ${reagentB.principle === 'sulphur' ? 'radiant combustible spark' : reagentB.principle === 'mercury' ? 'transformative bridge and agile intellect' : 'enduring crystalline vessel and purifying salt'}.
- **Crystalline Lattice:** ${reagentB.precipitateLattice} lattice with a base pH of ${reagentB.basePh}.
- **Core Disposition:** ${reagentB.description}

In conjunction with ${nameA}, ${nameB} fulfills the vital function of stabilizing the volatile components and providing deep grounding to the joint energetic matrix.`;
  }

  // 5. Celestial Transits & Atmospheric Pressure
  if (q.includes('transit') || q.includes('upcoming') || q.includes('today') || q.includes('weather') || q.includes('atmosphere') || q.includes('pressure') || q.includes('moon') || q.includes('lunar')) {
    const today = new Date();
    const days = ['Sunday (Solar Day)', 'Monday (Lunar Day)', 'Tuesday (Martian Day)', 'Wednesday (Mercurial Day)', 'Thursday (Jovian Day)', 'Friday (Venerean Day)', 'Saturday (Saturnine Day)'];
    const dayRuler = days[today.getDay()];

    return `The ambient celestial vessel is currently governed by **${dayRuler}**, with atmospheric pressure oscillating around **1.04 bar**.

Under these live celestial dynamics:
- The interaction between ${nameA}'s ${reagentA?.alchemicalName || 'essence'} and ${nameB}'s ${reagentB?.alchemicalName || 'essence'} is accelerated by today's planetary ruler, raising the kinetic reaction constant $k$.
- The current lunar phase encourages **cohobation and reflection**—meaning unresolved conversations from past cycles will resurface to be dissolved and redistilled into clarity.
- Expect higher emotional permeability. Keep the reaction vessel loosely stoppered to allow ethereal vapors to vent without bursting the seal.`;
  }

  // 6. Spagyric Ritual & Preserving the Bond
  if (q.includes('ritual') || q.includes('preserve') || q.includes('prescription') || q.includes('remedy') || q.includes('advice') || q.includes('meditation') || q.includes('crystal') || q.includes('herb')) {
    return `To preserve and consecrate the bond between **${nameA}** and **${nameB}**, the ancient masters prescribe the **Four-Fold Rite of the Circulatory Alembic**:

1. **The Separation (Solve):** Once per lunar cycle, carve out intentional solitude. Step back from the joint vessel so both of you can replenish your individual reagents without energetic enmeshment.
2. **The Purification (Calcinatio):** Write down accumulated resentments, misunderstandings, or unspoken anxieties on parchment and cast it into flame together, releasing the ash into running water.
3. **The Recombination (Coagula):** Share a dedicated meal or sacred tea prepared with rosemary (solar vitality), chamomile (lunar tranquility), and a pinch of pure sea salt (Saturnine devotion).
4. **The Vessel Consecration:** Keep a piece of clear quartz or pyrite near where you sleep to stabilize the electromagnetic field between your two energetic lattices.`;
  }

  // 7. Reaction Dynamics, Thermodynamics, and Reaction Type
  if (q.includes('reaction') || q.includes('thermodynamic') || q.includes('exothermic') || q.includes('endothermic') || q.includes('temperature') || q.includes('ph') || q.includes('what happens') || q.includes('chemical')) {
    return `The union of **${nameA}** and **${nameB}** triggers **${reactionType}** (${subtitle}).

- **Thermodynamic Enthalpy ($\\Delta H$):** ${deltaH} kJ/mol (${isExothermic ? 'Exothermic — releases warmth, passion, and visible radiance upon contact' : 'Endothermic — absorbs ambient tension to forge deep psychological depth'}).
- **Gibbs Free Energy ($\\Delta G$):** ${synastryResult?.freeEnergyDeltaG ?? -24.8} kJ/mol, indicating a thermodynamically spontaneous and naturally occurring bond that requires no artificial forcing.
- **Resulting Equilibrium pH:** ${synastryResult?.finalPh ?? 6.8} (Near-neutral, balanced spagyric tincture).
- **Physical-Metaphorical Manifestation:** Upon contact, ${nameA}'s ${reagentA?.alchemicalName} meets ${nameB}'s ${reagentB?.alchemicalName}, precipitating brilliant crystalline filaments at the bottom of the crucible while releasing gentle effervescent mist into the atmosphere.`;
  }

  // 8. Long-Term Destiny / Will it last?
  if (q.includes('last') || q.includes('long term') || q.includes('future') || q.includes('destiny') || q.includes('forever') || q.includes('marriage')) {
    return `The stars reveal that the conjunction between **${nameA}** and **${nameB}** carries a high survival coefficient (${affinity}% Affinity). Because your bond produces a stable crystalline matrix under **${reactionType}**, it is not a volatile flash-in-the-pan attraction, but an alloy built for endurance.

The longevity of your vessel depends on one hermetic principle: *Do not overheat the alembic.* When life introduces worldly stress (Saturnine compression), avoid compounding it with impulsive accusations. As long as you maintain open circulation of air (${airA + airB}% combined mental dialogue) and nourish each other's elemental roots, your conjunction has every qualification to achieve the *Philosopher's Tincture*—an enduring, lifetime companionship.`;
  }

  // 9. Default / Open-Ended Hermetic Synthesis
  return `Consulting the celestial ephemerides for **${nameA}** and **${nameB}**:

Your conjunction in the crucible represents the sacred union of **${reagentA?.alchemicalName || 'Alpha Reagent'}** and **${reagentB?.alchemicalName || 'Beta Reagent'}**, converging under the archetype of **${reactionType}** with **${affinity}% Harmonic Affinity**.

Regarding your inquiry: every chemical reaction between human souls is a mirror of celestial stoichiometry. ${nameA} contributes ${fireA}% Fire and ${waterA}% Water, providing the spiritual warmth and intuitive depth, while ${nameB} contributes ${earthB}% Earth and ${airB}% Air, ensuring structural stability and intellectual perspective. 

When you honor both the active transformation and the quiet preservation of your vessel, what began as raw base metal is steadily refined into pure spiritual gold. Trust the timing of your phase transitions.`;
}
