/*
  Warnings:

  - You are about to drop the column `optionType` on the `questions` table. All the data in the column will be lost.
  - Added the required column `optionType` to the `options` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "options" ADD COLUMN     "optionType" "OptionLabel" NOT NULL;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "optionType";
