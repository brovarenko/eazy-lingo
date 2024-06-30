const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.word.deleteMany({});
  const words = [
    { english: 'to be', german: 'sein' },
    { english: 'to have', german: 'haben' },
    { english: 'to take', german: 'nehmen' },
    { english: 'to give', german: 'geben' },
    { english: 'to mean', german: 'bedeuten' },
    { english: 'to answer', german: 'antworten' },
  ];

  for (const word of words) {
    await prisma.word.create({
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
    await prisma.$disconnect();
  });
