const { PrismaClient } = require('@prisma/client');

import { db } from '@/lib/db';

async function main() {
  await db.word.deleteMany({});
  const words = [
    { english: 'to be', german: 'sein', thirdForm: 'ist', perfekt: 'gewesen' },
    {
      english: 'to have',
      german: 'haben',
      thirdForm: 'hat',
      perfekt: 'gehabt',
    },
    {
      english: 'to take',
      german: 'nehmen',
      thirdForm: 'nimmt',
      perfekt: 'genommen',
    },
    {
      english: 'to give',
      german: 'geben',
      thirdForm: 'gibt',
      perfekt: 'gegeben',
    },
    {
      english: 'to mean',
      german: 'bedeuten',
      thirdForm: 'bedeutet',
      perfekt: 'bedeutet',
    },
    {
      english: 'to answer',
      german: 'antworten',
      thirdForm: 'antwortet',
      perfekt: 'geantwortet',
    },
    {
      english: 'to know (a person)',
      german: 'kennen',
      thirdForm: 'kennt',
      perfekt: 'gekannt',
    },
    {
      english: 'to know (a fact)',
      german: 'wissen',
      thirdForm: 'weiß',
      perfekt: 'gewusst',
    },
    { english: 'to do', german: 'tun', thirdForm: 'tut', perfekt: 'getan' },
    {
      english: 'to like',
      german: 'mögen',
      thirdForm: 'mag',
      perfekt: 'gemocht',
    },
    { english: 'can', german: 'können', thirdForm: 'kann', perfekt: 'gekonnt' },
    {
      english: 'must',
      german: 'müssen',
      thirdForm: 'muss',
      perfekt: 'gemusst',
    },
    {
      english: 'to go',
      german: 'gehen',
      thirdForm: 'geht',
      perfekt: 'gegangen',
    },
    {
      english: 'to want',
      german: 'wollen',
      thirdForm: 'will',
      perfekt: 'gewollt',
    },
    {
      english: 'to think',
      german: 'denken',
      thirdForm: 'denkt',
      perfekt: 'gedacht',
    },
    {
      english: 'to drive/go (by vehicle)',
      german: 'fahren',
      thirdForm: 'fährt',
      perfekt: 'gefahren',
    },
    {
      english: 'to see',
      german: 'sehen',
      thirdForm: 'sieht',
      perfekt: 'gesehen',
    },
    {
      english: 'to read',
      german: 'lesen',
      thirdForm: 'liest',
      perfekt: 'gelesen',
    },
    {
      english: 'to speak',
      german: 'sprechen',
      thirdForm: 'spricht',
      perfekt: 'gesprochen',
    },
    {
      english: 'to write',
      german: 'schreiben',
      thirdForm: 'schreibt',
      perfekt: 'geschrieben',
    },
    {
      english: 'to improve',
      german: 'verbessern',
      thirdForm: 'verbessert',
      perfekt: 'verbessert',
    },
    {
      english: 'to understand',
      german: 'verstehen',
      thirdForm: 'versteht',
      perfekt: 'verstanden',
    },
    {
      english: 'to stand',
      german: 'stehen',
      thirdForm: 'steht',
      perfekt: 'gestanden',
    },
    {
      english: 'to help',
      german: 'helfen',
      thirdForm: 'hilft',
      perfekt: 'geholfen',
    },
    {
      english: 'to meet',
      german: 'treffen',
      thirdForm: 'trifft',
      perfekt: 'getroffen',
    },
    {
      english: 'to hold/keep',
      german: 'halten',
      thirdForm: 'hält',
      perfekt: 'gehalten',
    },
    {
      english: 'to come',
      german: 'kommen',
      thirdForm: 'kommt',
      perfekt: 'gekommen',
    },
    {
      english: 'to eat',
      german: 'essen',
      thirdForm: 'isst',
      perfekt: 'gegessen',
    },
    {
      english: 'to drink',
      german: 'trinken',
      thirdForm: 'trinkt',
      perfekt: 'getrunken',
    },
    {
      english: 'to forget',
      german: 'vergessen',
      thirdForm: 'vergisst',
      perfekt: 'vergessen',
    },
  ];

  for (const word of words) {
    await db.word.create({
      data: word,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
