import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const pw = await hash("password123", 12);

  // Conference
  const conference = await prisma.conference.upsert({
    where: { year: 2026 },
    update: {},
    create: { name: "Río Texas Annual Conference 2026", year: 2026, date: new Date("2026-06-04") },
  });

  // Users
  const secretary = await prisma.user.upsert({
    where: { email: "secretary@riotexas.org" },
    update: {},
    create: { email: "secretary@riotexas.org", name: "María García", passwordHash: pw, role: "SECRETARY" },
  });

  const admin = await prisma.user.upsert({
    where: { email: "assistant@riotexas.org" },
    update: {},
    create: { email: "assistant@riotexas.org", name: "Carlos Mendoza", passwordHash: pw, role: "ADMIN" },
  });

  const chair1 = await prisma.user.upsert({
    where: { email: "chair-csr@riotexas.org" },
    update: {},
    create: { email: "chair-csr@riotexas.org", name: "Rev. Ana Martínez", passwordHash: pw, role: "COMMITTEE_CHAIR" },
  });

  const chair2 = await prisma.user.upsert({
    where: { email: "chair-bot@riotexas.org" },
    update: {},
    create: { email: "chair-bot@riotexas.org", name: "Rev. David Kim", passwordHash: pw, role: "COMMITTEE_CHAIR" },
  });

  const petitioner = await prisma.user.upsert({
    where: { email: "delegate@riotexas.org" },
    update: {},
    create: { email: "delegate@riotexas.org", name: "Sarah Johnson", passwordHash: pw, role: "PETITIONER", church: "First UMC San Antonio" },
  });

  const petitioner2 = await prisma.user.upsert({
    where: { email: "delegado@riotexas.org" },
    update: {},
    create: { email: "delegado@riotexas.org", name: "Roberto Díaz", passwordHash: pw, role: "PETITIONER", preferredLocale: "ES", church: "Iglesia Metodista El Buen Pastor" },
  });

  // Committees
  const committees = [
    { name: "Church and Society", abbreviation: "CSR" },
    { name: "Board of Trustees", abbreviation: "BOT" },
    { name: "Board of Pensions", abbreviation: "BOP" },
    { name: "Commission on Equitable Compensation", abbreviation: "COE" },
    { name: "Committee on Administrative Review", abbreviation: "CAH" },
    { name: "Board of Ordained Ministry", abbreviation: "BOM" },
    { name: "Finance and Administration", abbreviation: "FT" },
    { name: "Uniting Peoples Vision Team", abbreviation: "UPVT" },
    { name: "Vital Congregations Vision Team", abbreviation: "VCVT" },
    { name: "Developing Leaders Vision Team", abbreviation: "DLVT" },
    { name: "Transforming Communities Vision Team", abbreviation: "TCVT" },
  ];

  for (const c of committees) {
    await prisma.committee.upsert({
      where: { abbreviation: c.abbreviation },
      update: {},
      create: c,
    });
  }

  // Assign chairs
  const csr = await prisma.committee.findUnique({ where: { abbreviation: "CSR" } });
  const bot = await prisma.committee.findUnique({ where: { abbreviation: "BOT" } });

  if (csr) {
    await prisma.committeeMembership.upsert({
      where: { userId_committeeId: { userId: chair1.id, committeeId: csr.id } },
      update: {},
      create: { userId: chair1.id, committeeId: csr.id, isChair: true },
    });
  }

  if (bot) {
    await prisma.committeeMembership.upsert({
      where: { userId_committeeId: { userId: chair2.id, committeeId: bot.id } },
      update: {},
      create: { userId: chair2.id, committeeId: bot.id, isChair: true },
    });
  }

  // Standing Rules
  await prisma.standingRule.upsert({
    where: { number: "SR-14" },
    update: {},
    create: {
      number: "SR-14",
      title_en: "Referral of Resolutions with Financial Implications",
      title_es: "Referencia de Resoluciones con Implicaciones Financieras",
      text_en: "Any resolution presented to the Annual Conference which has financial implications shall be referred to the Council on Finance and Administration for review and recommendation before being considered by the Annual Conference.",
      text_es: "Toda resolución presentada a la Conferencia Anual que tenga implicaciones financieras será referida al Consejo de Finanzas y Administración para revisión y recomendación antes de ser considerada por la Conferencia Anual.",
    },
  });

  console.log("Seeded:");
  console.log(`  Conference: ${conference.name}`);
  console.log(`  Users: secretary, assistant, 2 chairs, 2 petitioners`);
  console.log(`  Committees: ${committees.map((c) => c.abbreviation).join(", ")}`);
  console.log(`  Standing Rules: SR-14`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
