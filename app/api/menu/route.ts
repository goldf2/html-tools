import { NextResponse } from 'next/server';
import { saveMenuConfig } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();
  const tools = await saveMenuConfig({
    order: Array.isArray(body.order) ? body.order : [],
    hidden: body.hidden && typeof body.hidden === 'object' ? body.hidden : {},
  });
  return NextResponse.json({ tools });
}
