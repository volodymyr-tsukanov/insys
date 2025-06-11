/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { NextRequest, NextResponse } from 'next/server';
import { getMainEvents } from '@/lib/data/getter';

export const dynamic = 'force-dynamic'; // optional: allow dynamic behavior


export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') ?? '';

  if (!type || type.length < 3) return NextResponse.json(
    { success: false, error: 'no type specified in request' }, { status: 401 }
  );

  let result: any;
  switch (type) {
    case 'events':
      result = await getMainEvents();
      break;
    default:
      return NextResponse.json(
        { success: false, error: 'type not found' }, { status: 404 }
      );
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=60',
    },
  });
}
