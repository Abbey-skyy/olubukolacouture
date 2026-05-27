import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { content, subject } = await req.json();

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are a luxury fashion copywriter for Olubukola Couture, a premium women's fashion brand.

The brand's voice is: elegant, aspirational, warm, and modern. The color palette is Ivory, Ebony, and Gold.

Please improve the following newsletter draft for the email subject "${subject || 'Newsletter'}".
Enhance the copy to be more compelling, on-brand, and engaging.
Return ONLY the improved HTML content (no explanation or preamble).

Draft:
${content}`,
        },
      ],
    });

    const improved = message.content[0]?.text || content;
    return NextResponse.json({ improved });
  } catch (err) {
    console.error('[IMPROVE NEWSLETTER]', err);
    return NextResponse.json({ error: 'Claude API error.' }, { status: 500 });
  }
}
