-- AlterTable
ALTER TABLE "QuestionnaireResponse" ADD COLUMN     "estimatedDepartureDate" TIMESTAMP(3),
ADD COLUMN     "estimatedDurationDays" INTEGER,
ADD COLUMN     "knowsExactDates" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;
