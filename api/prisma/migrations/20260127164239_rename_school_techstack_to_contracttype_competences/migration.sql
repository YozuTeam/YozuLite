/*
  Warnings:

  - You are about to drop the column `techStack` on the `CompanyProfile` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyProfile" DROP COLUMN "techStack",
ADD COLUMN     "competences" TEXT[],
ADD COLUMN     "contractType" TEXT[];

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "school",
ADD COLUMN     "contractType" TEXT[];
