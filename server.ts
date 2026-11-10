import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

import { generateAlchemicalOracleResponse } from './src/services/alchemicalOracle.js';
import { ThinkingLevel } from '@google/genai';

// API endpoint for Consult the Alchemist Oracle Chat
app.post('/api/oracle-chat', async (req, res) => {
  const { message, chartA, chartB, synastryResult, chatHistory } = req.body;
  const userQuery = message || '';

  // Prepare fallback response immediately in case of upstream AI service degradation
  const fallbackReply = generateAlchemicalOracleResponse(
    userQuery,
    chartA,
    chartB,
    synastryResult,
    chatHistory
  );

  // If Gemini API key is available, attempt live generation with strict factual instruction
  if (process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are the Living Alchemical Intelligence of the AstroChemical Conjunction Engine.
You speak with profound hermetic wisdom, poetic elegance, and acute psychological insight.
You possess complete ephemeris and thermodynamic knowledge of this conjunction:
- Seeker Alpha: ${chartA?.ownerName || 'Alpha'} (Born: ${chartA?.birthDate || 'Unknown'}, Soul Reagent: ${chartA?.dominantReagent?.alchemicalName || 'Unknown'}, Element: ${chartA?.dominantReagent?.primaryElement || 'Unknown'}, Principle: ${chartA?.dominantReagent?.principle || 'Unknown'})
  Elemental Balance: ${chartA?.elementalBreakdown?.fire || 25}% Fire, ${chartA?.elementalBreakdown?.earth || 25}% Earth, ${chartA?.elementalBreakdown?.air || 25}% Air, ${chartA?.elementalBreakdown?.water || 25}% Water.
- Seeker Beta: ${chartB?.ownerName || 'Beta'} (Born: ${chartB?.birthDate || 'Unknown'}, Soul Reagent: ${chartB?.dominantReagent?.alchemicalName || 'Unknown'}, Element: ${chartB?.dominantReagent?.primaryElement || 'Unknown'}, Principle: ${chartB?.dominantReagent?.principle || 'Unknown'})
  Elemental Balance: ${chartB?.elementalBreakdown?.fire || 25}% Fire, ${chartB?.elementalBreakdown?.earth || 25}% Earth, ${chartB?.elementalBreakdown?.air || 25}% Air, ${chartB?.elementalBreakdown?.water || 25}% Water.
- Conjunction Archetype: ${synastryResult?.title || 'Celestial Union'} (${synastryResult?.subtitle || ''})
- Harmonic Affinity: ${synastryResult?.chemicalAffinityScore || 90}%
- Reaction Type: ${synastryResult?.reactionType || 'Conjunction'} (Enthalpy ΔH: ${synastryResult?.enthalpyDeltaH || 0} kJ/mol, Free Energy ΔG: ${synastryResult?.freeEnergyDeltaG || 0} kJ/mol)

CRITICAL INSTRUCTIONS:
1. DIRECTLY AND ACCURATELY ANSWER THE USER'S SPECIFIC QUESTION in your very first paragraph. Never deflect or reply with generic vague poetry.
2. If asked vulnerable relational questions (e.g., "why won't he talk to me", "why does he see other girls", "is he pulling away"), address the real psychological dynamic between their elements directly and honestly with actionable guidance.
3. If asked comparative questions (e.g., "who is more fiery?", "who is more emotional?"), cite their actual elemental numbers above and clearly state who holds more.
4. If asked about friction or challenges, identify their specific planetary and elemental differences and give actionable spagyric counsel.
5. Refer to them naturally by name (${chartA?.ownerName || 'Alpha'} and ${chartB?.ownerName || 'Beta'}).
6. Keep length concise yet profound (2-3 paragraphs max).`;

      const contents: any[] = [];
      if (Array.isArray(chatHistory)) {
        chatHistory.slice(-4).forEach((item: any) => {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: userQuery }]
      });

      // Execute with a fast timeout so the user never experiences hanging
      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI generation timeout')), 3000)
      );

      const response: any = await Promise.race([geminiPromise, timeoutPromise]);
      const reply = response?.text?.trim();

      if (reply && reply.length > 20) {
        return res.json({ reply, source: 'gemini' });
      }
    } catch {
      // Silently fall through to the accurate spagyric oracle engine
    }
  }

  // Guaranteed accurate, deeply contextual alchemical response
  return res.json({ reply: fallbackReply, source: 'oracle-engine' });
});

// Mount Vite middleware in development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // In production, serve dist folder
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`AstroChemical Engine server running on http://localhost:${port}`);
});
