/*
  Warnings:

  - Added the required column `author_id` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `tests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field` to the `tests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Field" ADD VALUE 'DataScience';
ALTER TYPE "Field" ADD VALUE 'Frontend';
ALTER TYPE "Field" ADD VALUE 'Backend';
ALTER TYPE "Field" ADD VALUE 'FullStack';
ALTER TYPE "Field" ADD VALUE 'CyberSecurity';
ALTER TYPE "Field" ADD VALUE 'AI';
ALTER TYPE "Field" ADD VALUE 'GameDevelopment';

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "field" "Field" NOT NULL;

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "field" "Field" NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
