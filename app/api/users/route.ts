import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { id, email } = req.body;

  try {
    await db.user.create({
      data: {
        id,
        email,
      },
    });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
}
