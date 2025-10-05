import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const baseVerbWords = [
  {
    english: 'to go',
    german: 'gehen',
    thirdForm: 'ging',
    perfekt: 'ist gegangen',
  },
  {
    english: 'to come',
    german: 'kommen',
    thirdForm: 'kam',
    perfekt: 'ist gekommen',
  },
  {
    english: 'to eat',
    german: 'essen',
    thirdForm: 'ass',
    perfekt: 'hat gegessen',
  },
  {
    english: 'to drink',
    german: 'trinken',
    thirdForm: 'trank',
    perfekt: 'hat getrunken',
  },
  {
    english: 'to sleep',
    german: 'schlafen',
    thirdForm: 'schlief',
    perfekt: 'hat geschlafen',
  },
  {
    english: 'to write',
    german: 'schreiben',
    thirdForm: 'schrieb',
    perfekt: 'hat geschrieben',
  },
  {
    english: 'to read',
    german: 'lesen',
    thirdForm: 'las',
    perfekt: 'hat gelesen',
  },
  {
    english: 'to speak',
    german: 'sprechen',
    thirdForm: 'sprach',
    perfekt: 'hat gesprochen',
  },
  {
    english: 'to see',
    german: 'sehen',
    thirdForm: 'sah',
    perfekt: 'hat gesehen',
  },
  {
    english: 'to find',
    german: 'finden',
    thirdForm: 'fand',
    perfekt: 'hat gefunden',
  },
];

const prepositionVerbWords = [
  {
    english: 'to pay attention to',
    german: 'achten auf',
    thirdForm: '-',
    perfekt: 'hat geachtet',
  },
  {
    english: 'to start with',
    german: 'anfangen mit',
    thirdForm: 'fing an',
    perfekt: 'hat angefangen',
  },
  {
    english: 'to depend on',
    german: 'abhängen von',
    thirdForm: 'hing ab',
    perfekt: 'hat abgehangen',
  },
  {
    english: 'to answer',
    german: 'antworten auf',
    thirdForm: '-',
    perfekt: 'hat geantwortet',
  },
  {
    english: 'to be angry about',
    german: 'sich ärgern über',
    thirdForm: '-',
    perfekt: 'hat sich geärgert',
  },
  {
    english: 'to stop doing',
    german: 'aufhören mit',
    thirdForm: '-',
    perfekt: 'hat aufgehört',
  },
  {
    english: 'to look after',
    german: 'aufpassen auf',
    thirdForm: '-',
    perfekt: 'hat aufgepasst',
  },
  {
    english: 'to thank someone',
    german: 'sich bedanken bei',
    thirdForm: '-',
    perfekt: 'hat sich bedankt',
  },
  {
    english: 'to thank for',
    german: 'sich bedanken für',
    thirdForm: '-',
    perfekt: 'has sich bedankt',
  },
  {
    english: 'to begin with',
    german: 'beginnen mit',
    thirdForm: 'begann',
    perfekt: 'hat begonnen',
  },
  {
    english: 'to complain about',
    german: 'sich beklagen über',
    thirdForm: '-',
    perfekt: 'hat sich beklagt',
  },
  {
    english: 'to strive for',
    german: 'sich bemühen um',
    thirdForm: '-',
    perfekt: 'hat sich bemüht',
  },
  {
    english: 'to report about',
    german: 'berichten über',
    thirdForm: '-',
    perfekt: 'hat berichtet',
  },
  {
    english: 'to complain about',
    german: 'sich beschweren über',
    thirdForm: '-',
    perfekt: 'hat sich beschwert',
  },
  {
    english: 'to insist on',
    german: 'bestehen auf',
    thirdForm: 'bestand',
    perfekt: 'hat bestanden',
  },
  {
    english: 'to consist of',
    german: 'bestehen aus',
    thirdForm: 'bestand',
    perfekt: 'hat bestanden',
  },
  {
    english: 'to apply for',
    german: 'sich bewerben um',
    thirdForm: 'bewarb sich',
    perfekt: 'hat sich beworben',
  },
  {
    english: 'to refer to',
    german: 'sich beziehen auf',
    thirdForm: 'bezog sich',
    perfekt: 'hat sich bezogen',
  },
  {
    english: 'to ask for',
    german: 'bitten um',
    thirdForm: 'bat',
    perfekt: 'hat gebeten',
  },
  {
    english: 'to think of',
    german: 'denken an',
    thirdForm: 'dachte',
    perfekt: 'hat gedacht',
  },
  {
    english: 'to apologise to',
    german: 'sich entschuldigen bei',
    thirdForm: '-',
    perfekt: 'hat sich entschuldigt',
  },
  {
    english: 'to apologise for',
    german: 'sich entschuldigen für',
    thirdForm: '-',
    perfekt: 'hat sich entschuldigt',
  },
  {
    english: 'to remember',
    german: 'sich erinnern an',
    thirdForm: '-',
    perfekt: 'hat sich erinnert',
  },
  {
    english: 'to ask about',
    german: 'fragen nach',
    thirdForm: '-',
    perfekt: 'hat gefragt',
  },
  {
    english: 'to look forward to',
    german: 'sich freuen auf',
    thirdForm: '-',
    perfekt: 'hat sich gefreut',
  },
  {
    english: 'to be happy about',
    german: 'sich freuen über',
    thirdForm: '-',
    perfekt: 'hat sich gefreut',
  },
  {
    english: 'to be about',
    german: 'es geht um',
    thirdForm: 'ging',
    perfekt: 'ist gegangen',
  },
  {
    english: 'to belong to',
    german: 'gehören zu',
    thirdForm: '-',
    perfekt: 'hat gehört',
  },
  {
    english: 'to believe in',
    german: 'glauben an',
    thirdForm: '-',
    perfekt: 'hat geglaubt',
  },
  {
    english: 'to congratulate on',
    german: 'gratulieren zu',
    thirdForm: '-',
    perfekt: 'hat gratuliert',
  },
  {
    english: 'to be about',
    german: 'sich handeln um',
    thirdForm: '-',
    perfekt: 'hat sich gehandelt',
  },
  {
    english: 'to hope for',
    german: 'hoffen auf',
    thirdForm: '-',
    perfekt: 'hat gehofft',
  },
  {
    english: 'to be interested in',
    german: 'sich interessieren für',
    thirdForm: '-',
    perfekt: 'hat sich interessiert',
  },
  {
    english: 'to fight for',
    german: 'kämpfen für',
    thirdForm: '-',
    perfekt: 'hat gekämpft',
  },
  {
    english: 'to fight against',
    german: 'kämpfen gegen',
    thirdForm: '-',
    perfekt: 'hat gekämpft',
  },
  {
    english: 'to laugh about',
    german: 'lachen über',
    thirdForm: '-',
    perfekt: 'hat gelacht',
  },
  {
    english: 'to suffer from (illness)',
    german: 'leiden an',
    thirdForm: 'litt',
    perfekt: 'hat gelitten',
  },
  {
    english: 'to suffer from (situation)',
    german: 'leiden unter',
    thirdForm: 'litt',
    perfekt: 'hat gelitten',
  },
  {
    english: 'to think about',
    german: 'nachdenken über',
    thirdForm: 'dachte nach',
    perfekt: 'hat nachgedacht',
  },
  {
    english: 'to suit',
    german: 'passen zu',
    thirdForm: '-',
    perfekt: 'hat gepasst',
  },
  {
    english: 'to react to',
    german: 'reagieren auf',
    thirdForm: '-',
    perfekt: 'hat reagiert',
  },
  {
    english: 'to write to',
    german: 'schreiben an',
    thirdForm: 'schrieb',
    perfekt: 'hat geschrieben',
  },
  {
    english: 'to write about',
    german: 'schreiben über',
    thirdForm: 'schrieb',
    perfekt: 'hat geschrieben',
  },
  {
    english: 'to worry about',
    german: 'sich sorgen um',
    thirdForm: '-',
    perfekt: 'hat sich gesorgt',
  },
  {
    english: 'to speak with',
    german: 'sprechen mit',
    thirdForm: 'sprach',
    perfekt: 'hat gesprochen',
  },
  {
    english: 'to speak about',
    german: 'sprechen über',
    thirdForm: 'sprach',
    perfekt: 'hat gesprochen',
  },
  {
    english: 'to die of',
    german: 'sterben an',
    thirdForm: 'starb',
    perfekt: 'ist gestorben',
  },
  {
    english: 'to take part in',
    german: 'teilnehmen an',
    thirdForm: 'nahm teil',
    perfekt: 'hat teilgenommen',
  },
  {
    english: 'to dream of',
    german: 'träumen von',
    thirdForm: '-',
    perfekt: 'hat geträumt',
  },
  {
    english: 'to meet with',
    german: 'sich treffen mit',
    thirdForm: 'traf sich',
    perfekt: 'hat sich getroffen',
  },
  {
    english: 'to talk with',
    german: 'sich unterhalten mit',
    thirdForm: 'unterhielt sich',
    perfekt: 'hat sich unterhalten',
  },
  {
    english: 'to talk about',
    german: 'sich unterhalten über',
    thirdForm: 'unterhielt sich',
    perfekt: 'hat sich unterhalten',
  },
  {
    english: 'to say goodbye to',
    german: 'sich verabschieden von',
    thirdForm: '-',
    perfekt: 'hat sich verabschiedet',
  },
  {
    english: 'to rely on',
    german: 'sich verlassen auf',
    thirdForm: 'verließ sich',
    perfekt: 'hat sich verlassen',
  },
  {
    english: 'to fall in love with',
    german: 'sich verlieben in',
    thirdForm: '-',
    perfekt: 'hat sich verliebt',
  },
  {
    english: 'to do without',
    german: 'verzichten auf',
    thirdForm: '-',
    perfekt: 'hat verzichtet',
  },
  {
    english: 'to prepare for',
    german: 'sich vorbereiten auf',
    thirdForm: '-',
    perfekt: 'hat sich vorbereitet',
  },
  {
    english: 'to warn about',
    german: 'warnen vor',
    thirdForm: '-',
    perfekt: 'hat gewarnt',
  },
  {
    english: 'to wait for',
    german: 'warten auf',
    thirdForm: '-',
    perfekt: 'hat gewartet',
  },
  {
    english: 'to wonder about',
    german: 'sich wundern über',
    thirdForm: '-',
    perfekt: 'hat sich gewundert',
  },
  {
    english: 'to doubt',
    german: 'zweifeln an',
    thirdForm: '-',
    perfekt: 'hat gezweifelt',
  },
  {
    english: 'to look after',
    german: 'sich kümmern um',
    thirdForm: '-',
    perfekt: 'hat sich gekümmert',
  },
  {
    english: 'to get used to',
    german: 'sich gewöhnen an',
    thirdForm: '-',
    perfekt: 'hat sich gewöhnt',
  },
  {
    english: 'to inform oneself about',
    german: 'sich informieren über',
    thirdForm: '-',
    perfekt: 'hat sich informiert',
  },
  {
    english: 'to inquire about',
    german: 'sich erkundigen nach',
    thirdForm: '-',
    perfekt: 'has sich erkundigt',
  },
];
async function main() {
  await prisma.word.deleteMany();
  await prisma.set.deleteMany();

  await prisma.set.create({
    data: {
      name: 'German Verbs',
      isCommon: true,
      words: {
        create: baseVerbWords,
      },
    },
  });

  await prisma.set.create({
    data: {
      name: 'Verben mit Praepositionen',
      isCommon: true,
      words: {
        create: prepositionVerbWords,
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
