/*
  Warnings:

  - The values [Chemistry,Biology] on the enum `Field` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Field_new" AS ENUM ('ComputerScience', 'DataScience', 'Frontend', 'Backend', 'FullStack', 'CyberSecurity', 'AI', 'GameDevelopment', 'Mathematics', 'Physics');
ALTER TABLE "users" ALTER COLUMN "field" TYPE "Field_new" USING ("field"::text::"Field_new");
ALTER TABLE "questions" ALTER COLUMN "field" TYPE "Field_new" USING ("field"::text::"Field_new");
ALTER TABLE "tests" ALTER COLUMN "field" TYPE "Field_new" USING ("field"::text::"Field_new");
ALTER TYPE "Field" RENAME TO "Field_old";
ALTER TYPE "Field_new" RENAME TO "Field";
DROP TYPE "Field_old";
COMMIT;
