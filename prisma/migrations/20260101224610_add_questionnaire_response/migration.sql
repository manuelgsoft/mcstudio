-- AlterTable
ALTER TABLE "User" ADD COLUMN     "freeConsult" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "QuestionnaireResponse" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "tripType" TEXT NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "budgetAmount" INTEGER NOT NULL,
    "experiences" TEXT[],
    "flightPrefs" TEXT[],
    "flightCompany" TEXT,
    "accommodationPrefs" TEXT[],
    "accommodationCompany" TEXT,
    "otherDetails" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "QuestionnaireResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionnaireResponse" ADD CONSTRAINT "QuestionnaireResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
