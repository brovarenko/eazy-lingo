const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const words = [
    { english: 'to be', german: 'sein' },
    { english: 'to have', german: 'haben' },
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
