import { NextResponse } from 'next/server';
import { getMenuTools, TOOL_CATALOG_SCHEMA_VERSION } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tools = await getMenuTools();
  return NextResponse.json({
    schemaVersion: TOOL_CATALOG_SCHEMA_VERSION,
    tools,
  });
}
