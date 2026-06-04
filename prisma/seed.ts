import { PrismaClient, Prisma,OwnershipType,
  Degree, } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});
async function main() {
  console.log("🌱 Starting Seed...");

  // ==========================
  // STATES
  // ==========================

  await prisma.state.createMany({
    data: [
      { name: "Maharashtra", code: "MH" },
      { name: "Tamil Nadu", code: "TN" },
      { name: "Delhi", code: "DL" },
      { name: "Karnataka", code: "KA" },
      { name: "Gujarat", code: "GJ" },
    ],
    skipDuplicates: true,
  });

  // ==========================
  // STREAMS
  // ==========================

  await prisma.stream.createMany({
    data: [
      { name: "Engineering" },
      { name: "Medical" },
      { name: "Management" },
      { name: "Law" },
    ],
    skipDuplicates: true,
  });

  // ==========================
  // EXAMS
  // ==========================

  await prisma.exam.createMany({
    data: [
      {
        name: "JEE Main",
        slug: "jee-main",
      },
      {
        name: "JEE Advanced",
        slug: "jee-advanced",
      },
      {
        name: "NEET",
        slug: "neet",
      },
      {
        name: "CAT",
        slug: "cat",
      },
    ],
    skipDuplicates: true,
  });

  // ==========================
  // CATEGORIES
  // ==========================

  await prisma.category.createMany({
    data: [
      { name: "OPEN" },
      { name: "EWS" },
      { name: "OBC_NCL" },
      { name: "SC" },
      { name: "ST" },
    ],
    skipDuplicates: true,
  });

  // ==========================
  // QUOTAS
  // ==========================

  await prisma.quota.createMany({
    data: [
      { name: "AI" },
      { name: "HS" },
      { name: "OS" },
    ],
    skipDuplicates: true,
  });

  // ==========================
  // FETCH LOOKUPS
  // ==========================

  const maharashtra = await prisma.state.findUnique({
    where: { code: "MH" },
  });

  const engineering = await prisma.stream.findUnique({
    where: { name: "Engineering" },
  });

  const jeeAdvanced = await prisma.exam.findUnique({
    where: { slug: "jee-advanced" },
  });

  const openCategory = await prisma.category.findUnique({
    where: { name: "OPEN" },
  });

  const aiQuota = await prisma.quota.findUnique({
    where: { name: "AI" },
  });

  if (
    !maharashtra ||
    !engineering ||
    !jeeAdvanced ||
    !openCategory ||
    !aiQuota
  ) {
    throw new Error("Required lookup data not found.");
  }

  // ==========================
  // IIT BOMBAY
  // ==========================

  const iitBombay = await prisma.college.upsert({
    where: {
      slug: "iit-bombay",
    },
    update: {},
    create: {
      name: "Indian Institute of Technology Bombay",
      slug: "iit-bombay",
      shortName: "IIT Bombay",
      city: "Mumbai",
      stateId: maharashtra.id,
      ownershipType: OwnershipType.GOVERNMENT,
      establishedYear: 1958,
      website: "https://www.iitb.ac.in",
      description:
        "Premier engineering institute of India.",
    },
  });

  // ==========================
  // PROGRAM
  // ==========================

  const cse = await prisma.program.upsert({
    where: {
      collegeId_name_degree: {
        collegeId: iitBombay.id,
        name: "Computer Science and Engineering",
        degree: Degree.BTECH,
      },
    },
    update: {},
    create: {
      name: "Computer Science and Engineering",
      degree: Degree.BTECH,
      durationYears: 4,
      seats: 120,
      collegeId: iitBombay.id,
      streamId: engineering.id,
    },
  });

  // ==========================
  // FEES
  // ==========================

  await prisma.programFees.createMany({
    data: [
      {
        year: 2023,
        amount: 230000,
        programId: cse.id,
      },
      {
        year: 2024,
        amount: 240000,
        programId: cse.id,
      },
      {
        year: 2025,
        amount: 250000,
        programId: cse.id,
      },
    ],
    skipDuplicates: true,
  });

  // ==========================
  // PLACEMENTS
  // ==========================

  await prisma.placement.createMany({
    data: [
      {
        year: 2023,
        averagePackage: 22,
        medianPackage: 18,
        highestPackage: 120,
        placementRate: 92,
        totalOffers: 250,
        collegeId: iitBombay.id,
        programId: cse.id,
      },
      {
        year: 2024,
        averagePackage: 24,
        medianPackage: 20,
        highestPackage: 130,
        placementRate: 94,
        totalOffers: 280,
        collegeId: iitBombay.id,
        programId: cse.id,
      },
      {
        year: 2025,
        averagePackage: 25,
        medianPackage: 21,
        highestPackage: 140,
        placementRate: 95,
        totalOffers: 300,
        collegeId: iitBombay.id,
        programId: cse.id,
      },
    ],
    skipDuplicates: true,
  });

  // ==========================
  // CUTOFFS
  // ==========================

  await prisma.admission.createMany({
    data: [
      {
        year: 2023,
        openingValue: 1,
        closingValue: 67,
        examId: jeeAdvanced.id,
        categoryId: openCategory.id,
        quotaId: aiQuota.id,
        programId: cse.id,
      },
      {
        year: 2024,
        openingValue: 1,
        closingValue: 68,
        examId: jeeAdvanced.id,
        categoryId: openCategory.id,
        quotaId: aiQuota.id,
        programId: cse.id,
      },
      {
        year: 2025,
        openingValue: 1,
        closingValue: 70,
        examId: jeeAdvanced.id,
        categoryId: openCategory.id,
        quotaId: aiQuota.id,
        programId: cse.id,
      },
    ],
    skipDuplicates: true,
  });

  // ==========================
  // COLLEGE STATS
  // ==========================

  await prisma.collegeStats.upsert({
    where: {
      collegeId_year: {
        collegeId: iitBombay.id,
        year: 2025,
      },
    },
    update: {},
    create: {
      collegeId: iitBombay.id,
      year: 2025,
      lowestFees: 230000,
      highestFees: 250000,
      averagePackage: 25,
      overallRating: 4.8,
      reviewCount: 1250,
    },
  });

  // ==========================
  // RANKING
  // ==========================

  await prisma.ranking.createMany({
    data: [
      {
        source: "NIRF",
        rank: 3,
        year: 2025,
        collegeId: iitBombay.id,
      },
      {
        source: "NIRF",
        rank: 3,
        year: 2024,
        collegeId: iitBombay.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed successfully");
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
