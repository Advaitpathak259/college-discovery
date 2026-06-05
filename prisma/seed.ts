import { PrismaClient, Prisma,OwnershipType,
  Degree, } from "../app/generated/prisma/client";
  import { colleges } from "./data/colleges";
import { programs } from "./data/programs";
import { fees } from "./data/fees";
import { placements } from "./data/placements";
import { cutoffs } from "./data/cutoffs";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});
async function main() {

  // =========================
  // 1. Lookup Tables
  // =========================

  // States
  // Streams
  // Exams
  // Categories
  // Quotas

  // =========================
  // 2. Colleges
  // =========================
  await prisma.state.createMany({
  data: [
    { name: "Maharashtra", code: "MH" },
    { name: "Tamil Nadu", code: "TN" },
    { name: "Delhi", code: "DL" },
    { name: "Karnataka", code: "KA" },
    { name: "Gujarat", code: "GJ" },

    { name: "Uttar Pradesh", code: "UP" },
    { name: "West Bengal", code: "WB" },
    { name: "Rajasthan", code: "RJ" },
    { name: "Telangana", code: "TG" },
  ],
  skipDuplicates: true,
});

  for (const college of colleges) {

    const state = await prisma.state.findUnique({
      where: {
        code: college.stateCode,
      },
    });
console.log("College:", college.name);
console.log("State Code:", college.stateCode);
console.log("State Found:", state); 
    
    await prisma.college.upsert({
      where: {
        slug: college.slug,
      },

      update: {},

      create: {
        name: college.name,
        slug: college.slug,
        shortName: college.shortName,
        city: college.city,
        stateId: state!.id,
        ownershipType: college.ownershipType,
        establishedYear: college.establishedYear,
        website: college.website,
      },
    });
  }

  // =========================
  // 3. Programs
  // =========================

  for (const program of programs) {

    const college = await prisma.college.findUnique({
      where: {
        slug: program.collegeSlug,
      },
    });

    const stream = await prisma.stream.findUnique({
      where: {
        name: program.stream,
      },
    });

    await prisma.program.upsert({
      where: {
        collegeId_name_degree: {
          collegeId: college!.id,
          name: program.name,
          degree: program.degree,
        },
      },

      update: {},

      create: {
        name: program.name,
        degree: program.degree,
        durationYears: program.durationYears,
        seats: program.seats,
        collegeId: college!.id,
        streamId: stream!.id,
      },
    });
  }

  // =========================
  // 4. Fees
  // =========================

  for (const feeRecord of fees) {

    const college = await prisma.college.findUnique({
      where: {
        slug: feeRecord.collegeSlug,
      },
    });

    const program = await prisma.program.findFirst({
      where: {
        collegeId: college!.id,
        name: feeRecord.programName,
      },
    });

    for (const fee of feeRecord.data) {

      await prisma.programFees.upsert({
        where: {
          programId_year: {
            programId: program!.id,
            year: fee.year,
          },
        },

        update: {
          amount: fee.amount,
        },

        create: {
          year: fee.year,
          amount: fee.amount,
          programId: program!.id,
        },
      });
    }
  }

   

// =========================
// 5. Placements
// =========================

for (const placementRecord of placements) {
  const college = await prisma.college.findUnique({
    where: {
      slug: placementRecord.collegeSlug,
    },
  });

  if (!college) continue;

  for (const placement of placementRecord.data) {
    const existingPlacement =
      await prisma.placement.findFirst({
        where: {
          collegeId: college.id,
          year: placement.year,
          programId: null,
        },
      });

    if (!existingPlacement) {
      await prisma.placement.create({
        data: {
          year: placement.year,
          averagePackage: placement.averagePackage,
          medianPackage: placement.medianPackage,
          highestPackage: placement.highestPackage,
          placementRate: placement.placementRate,
          
          collegeId: college.id,
          programId: null,
        },
      });
    }
  }
}

  // =========================
  // 6. Cutoffs
  // =========================

 
await prisma.exam.createMany({
  data: [
    { name: "BITSAT", slug: "bitsat" },
    { name: "VITEEE", slug: "viteee" },
  ],
  skipDuplicates: true,
});
  for (const cutoffRecord of cutoffs) {

    const college = await prisma.college.findUnique({
      where: {
        slug: cutoffRecord.collegeSlug,
      },
    });

    const program = await prisma.program.findFirst({
      where: {
        collegeId: college!.id,
        name: cutoffRecord.programName,
      },
    });

    const exam = await prisma.exam.findUnique({
      where: {
        name: cutoffRecord.exam,
      },
    });

    const category = await prisma.category.findUnique({
      where: {
        name: cutoffRecord.category,
      },
    });

    const quota = await prisma.quota.findUnique({
      where: {
        name: cutoffRecord.quota,
      },
    });
    


    for (const cutoff of cutoffRecord.data) {
if (!college) {
  throw new Error(`College not found: ${cutoffRecord.collegeSlug}`);
}

if (!program) {
  throw new Error(
    `Program not found: ${cutoffRecord.programName} in ${cutoffRecord.collegeSlug}`
  );
}

if (!exam) {
  throw new Error(`Exam not found: ${cutoffRecord.exam}`);
}

if (!category) {
  throw new Error(`Category not found: ${cutoffRecord.category}`);
}

if (!quota) {
  throw new Error(`Quota not found: ${cutoffRecord.quota}`);
}
      await prisma.admission.upsert({
        where: {
          examId_categoryId_quotaId_programId_year: {
            examId: exam!.id,
            categoryId: category!.id,
            quotaId: quota!.id,
            programId: program!.id,
            year: cutoff.year,
          },
        },

        update: {},

        create: {
          year: cutoff.year,
          openingValue: cutoff.openingRank,
          closingValue: cutoff.closingRank,
          examId: exam!.id,
          categoryId: category!.id,
          quotaId: quota!.id,
          programId: program!.id,
        },
      });
    }
  }

  console.log("✅ Seed Complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
