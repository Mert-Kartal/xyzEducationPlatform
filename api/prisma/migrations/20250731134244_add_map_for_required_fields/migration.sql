/*
  Warnings:

  - You are about to drop the column `isCorrect` on the `options` table. All the data in the column will be lost.
  - You are about to drop the column `optionText` on the `options` table. All the data in the column will be lost.
  - You are about to drop the column `optionType` on the `options` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `options` table. All the data in the column will be lost.
  - Added the required column `option_text` to the `options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_type` to the `options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `options` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "options" DROP CONSTRAINT "options_questionId_fkey";

-- AlterTable
ALTER TABLE "options" DROP COLUMN "isCorrect",
DROP COLUMN "optionText",
DROP COLUMN "optionType",
DROP COLUMN "questionId",
ADD COLUMN     "is_correct" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "option_text" TEXT NOT NULL,
ADD COLUMN     "option_type" "OptionLabel" NOT NULL,
ADD COLUMN     "question_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
