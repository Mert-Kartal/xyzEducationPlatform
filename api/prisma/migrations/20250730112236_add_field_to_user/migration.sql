/*
  Warnings:

  - Added the required column `field` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Field" AS ENUM ('ComputerScience', 'Mathematics', 'Physics', 'Chemistry', 'Biology');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "field",
ADD COLUMN     "field" "Field" NOT NULL;
