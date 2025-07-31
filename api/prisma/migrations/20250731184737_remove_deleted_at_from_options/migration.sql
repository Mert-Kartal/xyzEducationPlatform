/*
  Warnings:

  - You are about to drop the column `optionId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `options` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `test_questions` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `test_questions` table. All the data in the column will be lost.
  - Added the required column `option_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `test_questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_id` to the `test_questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_optionId_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_testId_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_userId_fkey";

-- DropForeignKey
ALTER TABLE "test_questions" DROP CONSTRAINT "test_questions_questionId_fkey";

-- DropForeignKey
ALTER TABLE "test_questions" DROP CONSTRAINT "test_questions_testId_fkey";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "optionId",
DROP COLUMN "questionId",
DROP COLUMN "testId",
DROP COLUMN "userId",
ADD COLUMN     "option_id" TEXT NOT NULL,
ADD COLUMN     "question_id" TEXT NOT NULL,
ADD COLUMN     "test_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "options" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "test_questions" DROP COLUMN "questionId",
DROP COLUMN "testId",
ADD COLUMN     "question_id" TEXT NOT NULL,
ADD COLUMN     "test_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
