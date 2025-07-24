import { NextRequest, NextResponse } from 'next/server';
import { exchangePublicToken } from '@/services/plaidService';

export async function POST(req: NextRequest) {
  try {
    const { public_token } = await req.json();
    const response = await exchangePublicToken(public_token);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 