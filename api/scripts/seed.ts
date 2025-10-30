/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// prisma/seed.ts
import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// CONFIG
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PWD = process.env.SEED_ADMIN_PWD || 'Admin123!';
const ADMIN_PHONE = process.env.SEED_ADMIN_PHONE || '+33600000099';

const N_STUDENTS = parseInt(
  process.env.SEED_STUDENTS || process.env.SEED_COUNT || '200',
  10,
);
const COMPANY_RATIO = Number(process.env.SEED_COMPANY_RATIO ?? 0.2);
const N_COMPANIES = parseInt(
  process.env.SEED_COMPANIES ||
    String(Math.max(1, Math.round(N_STUDENTS * COMPANY_RATIO))),
  10,
);

const DEFAULT_USER_PWD = process.env.SEED_USER_PWD || 'Password123!';
const SALT_ROUNDS = 10;

// ---------- Anti-collision helpers ----------
const usedPhones = new Set<string>();
const usedEmails = new Set<string>();

// charge le stock existant (utile si tu relances le seed)
async function preloadUniqSets() {
  const existing = await prisma.user.findMany({
    select: { phoneNumber: true, email: true },
  });
  for (const u of existing) {
    if (u.phoneNumber) usedPhones.add(u.phoneNumber);
    if (u.email) usedEmails.add(u.email.toLowerCase());
  }
}

// génère un numéro FR séquentiel unique (8 digits après +336 / +337)
function nextUniquePhone(prefix: '+336' | '+337', startCounter = 0) {
  let counter = startCounter;
  while (true) {
    const body = String(10_000_000 + counter).slice(-8); // 00000000 → 99999999
    const phone = `${prefix}${body}`;
    if (!usedPhones.has(phone)) {
      usedPhones.add(phone);
      return { phone, next: counter + 1 };
    }
    counter++;
  }
}

// email réaliste + suffixe si collision
function uniqueStudentEmail(first: string, last: string) {
  const domains = [
    'etu.univ.fr',
    'student.epita.fr',
    'gmail.com',
    'outlook.com',
  ];
  const base = `${first}.${last}`.toLowerCase().replace(/[^a-z]/g, '');
  const domain = faker.helpers.arrayElement(domains);
  let candidate = `${base}@${domain}`;
  let i = 1;
  while (usedEmails.has(candidate)) {
    candidate = `${base}${i}@${domain}`;
    i++;
  }
  usedEmails.add(candidate);
  return candidate;
}
function uniqueCompanyEmail(company: string) {
  const baseDomain =
    company.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'company';
  let candidate = `contact@${baseDomain}.fr`;
  let i = 1;
  while (usedEmails.has(candidate)) {
    candidate = `contact${i}@${baseDomain}.fr`;
    i++;
  }
  usedEmails.add(candidate);
  return candidate;
}

// ---------- Données "réalistes" ----------
const INDUSTRIES = [
  'Logiciels SaaS',
  'FinTech',
  'HealthTech',
  'E-commerce',
  'Énergie',
  'Mobilité',
  'Éducation',
  'Cybersécurité',
  'Médias',
  'Jeux vidéo',
  'Immobilier',
  'RH-Tech',
  'IA/ML',
  'Data',
  'TravelTech',
  'FoodTech',
];
const TECHS = [
  'TypeScript',
  'Node.js',
  'NestJS',
  'Express',
  'React',
  'Next.js',
  'React Native',
  'Vue',
  'Angular',
  'GraphQL',
  'REST',
  'Prisma',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Kafka',
  'gRPC',
  'AWS',
  'GCP',
  'Azure',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Jest',
  'Cypress',
  'Playwright',
  'TailwindCSS',
  'Sass',
  'Webpack',
  'Vite',
  'Python',
  'Django',
  'FastAPI',
  'Go',
  'Rust',
];
const SCHOOLS = [
  'EPITA',
  'EPITECH',
  'ENSIMAG',
  'UTC',
  'INSA Lyon',
  'IMT Atlantique',
  'Sorbonne Université',
  'Paris-Saclay',
  'Polytech Nantes',
  'UTBM',
  'Mines Nancy',
];
const frenchCities = [
  'Paris',
  'Lyon',
  'Lille',
  'Toulouse',
  'Nantes',
  'Bordeaux',
  'Rennes',
  'Marseille',
  'Montpellier',
  'Strasbourg',
  'Grenoble',
  'Nice',
];

const pickSome = <T>(arr: T[], min: number, max: number) => {
  const n = faker.number.int({ min, max });
  const copy = faker.helpers.shuffle(arr);
  return Array.from(new Set(copy.slice(0, n)));
};

const companyDescription = (industry: string) =>
  `Nous concevons des solutions ${industry.toLowerCase()} avec une stack moderne, une culture qualité (tests, CI/CD) et un focus produit.`;

// ---------- MAIN ----------
async function main() {
  console.log(
    `Seeding — admin + ${N_STUDENTS} students + ${N_COMPANIES} companies...`,
  );

  await preloadUniqSets();

  // ADMIN
  const adminHashed = await bcrypt.hash(ADMIN_PWD, SALT_ROUNDS);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { password: adminHashed, role: 'ADMIN', phoneNumber: ADMIN_PHONE },
    create: {
      email: ADMIN_EMAIL,
      password: adminHashed,
      phoneNumber: ADMIN_PHONE,
      role: 'ADMIN',
    },
  });
  usedEmails.add(ADMIN_EMAIL.toLowerCase());
  usedPhones.add(ADMIN_PHONE);
  console.log(`-> Admin ready: ${ADMIN_EMAIL} / ${ADMIN_PHONE}`);

  // Compteurs séparés pour éviter chevauchement +336 (students) / +337 (companies)
  let studentPhoneCounter = 0;
  let companyPhoneCounter = 0;

  // STUDENTS
  let studentCreated = 0;
  for (let i = 0; i < N_STUDENTS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = uniqueStudentEmail(firstName, lastName);
    const { phone, next } = nextUniquePhone('+336', studentPhoneCounter);
    studentPhoneCounter = next;

    const school = faker.helpers.arrayElement(SCHOOLS);
    const bio =
      `Étudiant(e) ${faker.helpers.arrayElement(['en alternance', 'en stage', 'en dernière année'])} ` +
      `intéressé(e) par ${faker.helpers.arrayElement(['le backend', 'le frontend', 'le mobile', 'la data', 'la sécurité'])}. ` +
      `Basé(e) à ${faker.helpers.arrayElement(frenchCities)}.`;
    const skills = pickSome(TECHS, 3, 7);

    const hashed = await bcrypt.hash(DEFAULT_USER_PWD, SALT_ROUNDS);

    try {
      const user = await prisma.user.create({
        data: { email, password: hashed, phoneNumber: phone, role: 'STUDENT' },
      });

      await prisma.studentProfile.create({
        data: { userId: user.id, firstName, lastName, bio, school, skills },
      });

      studentCreated++;
      if (studentCreated % 25 === 0) {
        console.log(`  • students: ${studentCreated}/${N_STUDENTS}`);
      }
    } catch (err: any) {
      console.warn(`  ! student skipped ${email} (${phone}) → ${err?.message}`);
    }
  }

  // COMPANIES
  let companyCreated = 0;
  for (let i = 0; i < N_COMPANIES; i++) {
    const companyName = faker.company.name();
    const industry = faker.helpers.arrayElement(INDUSTRIES);
    const techStack = pickSome(TECHS, 4, 10);
    const description = companyDescription(industry);
    const email = uniqueCompanyEmail(companyName);
    const { phone, next } = nextUniquePhone('+337', companyPhoneCounter);
    companyPhoneCounter = next;

    const hashed = await bcrypt.hash(DEFAULT_USER_PWD, SALT_ROUNDS);

    try {
      const user = await prisma.user.create({
        data: { email, password: hashed, phoneNumber: phone, role: 'COMPANY' },
      });

      await prisma.companyProfile.create({
        data: {
          userId: user.id,
          companyName,
          description,
          industry,
          techStack,
        },
      });

      companyCreated++;
      if (companyCreated % 10 === 0) {
        console.log(`  • companies: ${companyCreated}/${N_COMPANIES}`);
      }
    } catch (err: any) {
      console.warn(`  ! company skipped ${email} (${phone}) → ${err?.message}`);
    }
  }

  console.log(
    `Done. Created: ${studentCreated} students, ${companyCreated} companies.`,
  );
  console.log(`Admin: ${ADMIN_EMAIL} (pwd: ${ADMIN_PWD})`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Seeding failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
