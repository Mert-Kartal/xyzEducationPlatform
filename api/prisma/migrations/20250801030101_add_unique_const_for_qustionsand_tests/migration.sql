/*
  Warnings:

  - A unique constraint covering the columns `[test_id,question_id]` on the table `test_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "test_questions_test_id_question_id_key" ON "test_questions"("test_id", "question_id");
