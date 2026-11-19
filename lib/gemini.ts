import { GoogleGenAI, Type } from '@google/genai'

export interface CampaignIdeaHook {
  format: string
  hookLine: string
  visualDirection: string
  cta: string
}

export interface CampaignIdeaResponse {
  conceptTitle: string
  recommendedPackage: string
  estimatedImpact: string
  hooks: CampaignIdeaHook[]
  contentAngles: string[]
  proTip: string
}

export interface CampaignIdeaInput {
  brandName: string
  productName: string
  category: string
  goal: string
  outputLanguage: 'English' | 'Hinglish'
}

export const GEMINI_TEXT_MODEL = 'gemini-4-hydrogen'

export function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || !apiKey.trim()) {
    throw new Error('GEMINI_API_KEY_MISSING')
  }

  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  })
}

export async function generateTechVyroCampaignIdeas(
  input: CampaignIdeaInput
): Promise<CampaignIdeaResponse> {
  const ai = createGeminiClient()

  const languageNote =
    input.outputLanguage === 'Hinglish'
      ? 'Write the spoken hook lines and CTA in energetic, natural Indian Hinglish (Roman script, e.g., "Bhai ye gadget sach mein worth it hai ya sirf hype?") like top Indian tech creators. Keep field labels and visual directions crisp and clear.'
      : 'Write crisp, punchy, high-retention English suitable for Indian Gen-Z and millennial tech enthusiasts.'

  const prompt = [
    `Create a high-converting TechVyro creator campaign concept for:`,
    `- Brand: ${input.brandName}`,
    `- Product: ${input.productName}`,
    `- Category: ${input.category}`,
    `- Primary Campaign Goal: ${input.goal}`,
    `- Style / Language: ${input.outputLanguage}`,
    '',
    'Provide:',
    '1. A catchy conceptTitle (max 8 words).',
    '2. recommendedPackage: pick the best fit from "Starter Bundle", "Growth Bundle", "Mega Campaign", or "Dedicated Sponsored Video".',
    '3. estimatedImpact: realistic projection string based on TechVyro 850K+ audience (e.g., "180K–320K organic views · 7.5%+ engagement").',
    '4. hooks: exactly 3 scroll-stopping video hooks covering (a) Instagram Reel, (b) YouTube Short, and (c) Dedicated YouTube Review.',
    '5. contentAngles: 3 sharp creative differentiators that avoid generic ad scripts.',
    '6. proTip: one actionable conversion tip tailored to this product and goal.',
  ].join('\n')

  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: prompt,
    config: {
      systemInstruction: `You are the Creative Strategist for TechVyro, India's premier tech content creator (850K+ followers across Instagram, YouTube, and Facebook; 165M+ total views). Your job is to craft authentic, high-retention tech video hooks and brand campaign concepts that convert viewers without feeling like scripted ads. ${languageNote}`,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conceptTitle: { type: Type.STRING },
          recommendedPackage: { type: Type.STRING },
          estimatedImpact: { type: Type.STRING },
          hooks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                format: { type: Type.STRING },
                hookLine: { type: Type.STRING },
                visualDirection: { type: Type.STRING },
                cta: { type: Type.STRING },
              },
              required: ['format', 'hookLine', 'visualDirection', 'cta'],
            },
          },
          contentAngles: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          proTip: { type: Type.STRING },
        },
        required: [
          'conceptTitle',
          'recommendedPackage',
          'estimatedImpact',
          'hooks',
          'contentAngles',
          'proTip',
        ],
      },
    },
  })

  const rawText = response.text?.trim()
  if (!rawText) {
    throw new Error('EMPTY_MODEL_RESPONSE')
  }

  const cleanedJson = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const parsed = JSON.parse(cleanedJson) as CampaignIdeaResponse
  if (!parsed.conceptTitle || !Array.isArray(parsed.hooks) || parsed.hooks.length === 0) {
    throw new Error('INVALID_MODEL_RESPONSE')
  }

  return parsed
}
