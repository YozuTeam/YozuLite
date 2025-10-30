/*
  Warnings:

  - The primary key for the `CompanyProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CompanyProfile" DROP CONSTRAINT "CompanyProfile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CompanyProfile_id_seq";

-- AlterTable
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StudentProfile_id_seq";
