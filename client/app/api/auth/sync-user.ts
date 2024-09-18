import { getAuth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';

export default async function handler(req, res) {
  res.status(200).json({ message: 'User synchronized' });
}
