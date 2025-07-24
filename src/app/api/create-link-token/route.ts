import { NextRequest, NextResponse } from 'next/server';
import { createLinkToken } from '@/services/plaidService';

export async function POST(req: NextRequest) {
  try {
    const response = await createLinkToken();
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 