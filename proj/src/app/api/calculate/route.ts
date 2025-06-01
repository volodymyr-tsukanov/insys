/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { NextResponse } from 'next/server';
import { proc } from '@/lib/data/proc';

export const dynamic = 'force-dynamic'; // optional: allow dynamic behavior


export async function GET() {
  const result = await proc();

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=60',
    },
  });
}
