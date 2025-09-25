import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a Set for the verbs
  const verbSet = await prisma.set.create({
    data: {
      name: 'German Verbs',
      isCommon: true,
    },
  });

  // Add 10 German verbs
  const words = [
    {
      english: 'to go',
      german: 'gehen',
      thirdForm: 'ging',
      perfekt: 'ist gegangen',
      setId: verbSet.id,
    },
    {
      english: 'to come',
      german: 'kommen',
      thirdForm: 'kam',
      perfekt: 'ist gekommen',
      setId: verbSet.id,
    },
    {
      english: 'to eat',
      german: 'essen',
      thirdForm: 'aß',
      perfekt: 'hat gegessen',
      setId: verbSet.id,
    },
    {
      english: 'to drink',
      german: 'trinken',
      thirdForm: 'trank',
      perfekt: 'hat getrunken',
      setId: verbSet.id,
    },
    {
      english: 'to sleep',
      german: 'schlafen',
      thirdForm: 'schlief',
      perfekt: 'hat geschlafen',
      setId: verbSet.id,
    },
    {
      english: 'to write',
      german: 'schreiben',
      thirdForm: 'schrieb',
      perfekt: 'hat geschrieben',
      setId: verbSet.id,
    },
    {
      english: 'to read',
      german: 'lesen',
      thirdForm: 'las',
      perfekt: 'hat gelesen',
      setId: verbSet.id,
    },
    {
      english: 'to speak',
      german: 'sprechen',
      thirdForm: 'sprach',
      perfekt: 'hat gesprochen',
      setId: verbSet.id,
    },
    {
      english: 'to see',
      german: 'sehen',
      thirdForm: 'sah',
      perfekt: 'hat gesehen',
      setId: verbSet.id,
    },
    {
      english: 'to find',
      german: 'finden',
      thirdForm: 'fand',
      perfekt: 'hat gefunden',
      setId: verbSet.id,
    },
  ];

  await prisma.word.createMany({ data: words });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
