import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateTechVyroCampaignIdeas } from '@/lib/gemini'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const requestSchema = z.object({
  brandName: z.string().trim().min(1, 'Brand name is required').max(80),
  productName: z.string().trim().min(2, 'Product or app name is required').max(120),
  category: z.string().trim().min(2).max(60),
  goal: z.string().trim().min(2).max(80),
  outputLanguage: z.enum(['English', 'Hinglish']).default('Hinglish'),
})

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const rl = rateLimit(`ai-ideas:${ip}`, 12, 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many concept requests. Please wait a minute and try again.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Please fill in all campaign fields.'
    return NextResponse.json({ error: firstIssue }, { status: 400 })
  }

  try {
    const result = await generateTechVyroCampaignIdeas(parsed.data)
    return NextResponse.json({ ok: true, concept: result }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[ai/campaign-ideas] generation failed:', message)

    if (message === 'GEMINI_API_KEY_MISSING') {
      return NextResponse.json(
        {
          error:
            'AI Campaign Studio is not configured yet (server GEMINI_API_KEY is missing). Please contact the site administrator or send your brief directly below.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error:
          'Unable to generate campaign concepts right now. Please try again in a moment.',
      },
      { status: 502 }
    )
  }
}
