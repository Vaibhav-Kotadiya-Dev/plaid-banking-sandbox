import { NextRequest, NextResponse } from 'next/server';
import { getTransactions } from '@/services/plaidService';

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();
    const response = await getTransactions(access_token);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 