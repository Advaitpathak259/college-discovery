-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS');

-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('BTECH', 'MTECH', 'MBBS', 'MD', 'MBA', 'MCA', 'BCA', 'BSC', 'MSC', 'BA', 'MA', 'LLB', 'BARCH', 'BPHARM', 'MPHARM', 'PHD');

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quota" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortName" TEXT,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "establishedYear" INTEGER,
    "ownershipType" "OwnershipType" NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" "Degree" NOT NULL,
    "durationYears" INTEGER NOT NULL,
    "seats" INTEGER,
    "collegeId" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramFees" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "ProgramFees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admission" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "openingValue" DOUBLE PRECISION,
    "closingValue" DOUBLE PRECISION,
    "examId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "quotaId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "Admission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "averagePackage" DOUBLE PRECISION,
    "medianPackage" DOUBLE PRECISION,
    "highestPackage" DOUBLE PRECISION,
    "placementRate" DOUBLE PRECISION,
    "totalOffers" INTEGER,
    "collegeId" TEXT NOT NULL,
    "programId" TEXT,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "placementRating" DOUBLE PRECISION,
    "facultyRating" DOUBLE PRECISION,
    "campusRating" DOUBLE PRECISION,
    "collegeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeStats" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lowestFees" INTEGER,
    "highestFees" INTEGER,
    "averagePackage" DOUBLE PRECISION,
    "overallRating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "CollegeStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "State_code_key" ON "State"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_name_key" ON "Stream"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_name_key" ON "Exam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_slug_key" ON "Exam"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Quota_name_key" ON "Quota"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE INDEX "College_stateId_idx" ON "College"("stateId");

-- CreateIndex
CREATE INDEX "Program_collegeId_idx" ON "Program"("collegeId");

-- CreateIndex
CREATE INDEX "Program_streamId_idx" ON "Program"("streamId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_collegeId_name_degree_key" ON "Program"("collegeId", "name", "degree");

-- CreateIndex
CREATE INDEX "ProgramFees_programId_idx" ON "ProgramFees"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramFees_programId_year_key" ON "ProgramFees"("programId", "year");

-- CreateIndex
CREATE INDEX "Admission_examId_categoryId_quotaId_programId_idx" ON "Admission"("examId", "categoryId", "quotaId", "programId");

-- CreateIndex
CREATE INDEX "Admission_year_idx" ON "Admission"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Admission_examId_categoryId_quotaId_programId_year_key" ON "Admission"("examId", "categoryId", "quotaId", "programId", "year");

-- CreateIndex
CREATE INDEX "Placement_collegeId_idx" ON "Placement"("collegeId");

-- CreateIndex
CREATE INDEX "Placement_programId_idx" ON "Placement"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "Placement_collegeId_programId_year_key" ON "Placement"("collegeId", "programId", "year");

-- CreateIndex
CREATE INDEX "Review_collegeId_idx" ON "Review"("collegeId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "CollegeStats_collegeId_idx" ON "CollegeStats"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeStats_collegeId_year_key" ON "CollegeStats"("collegeId", "year");

-- CreateIndex
CREATE INDEX "Ranking_collegeId_idx" ON "Ranking"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_collegeId_source_year_key" ON "Ranking"("collegeId", "source", "year");

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramFees" ADD CONSTRAINT "ProgramFees_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "Quota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeStats" ADD CONSTRAINT "CollegeStats_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
