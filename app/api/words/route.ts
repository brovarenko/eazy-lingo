import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const words = await db.word.findMany();
  console.log(words);
  return NextResponse.json(words);
}
