import { NextRequest, NextResponse } from 'next/server';
import { getTransactionsWithInstitution } from '@/services/plaidService';

export async function POST(req: NextRequest) {
  try {
    const { access_token, start_date } = await req.json();
    const response = await getTransactionsWithInstitution(access_token, start_date);
    return NextResponse.json(response);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 