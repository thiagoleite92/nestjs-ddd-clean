/*
  Warnings:

  - You are about to drop the column `answers_id` on the `comments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_answers_id_fkey";

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "answer_id" TEXT,
ADD COLUMN     "question_id" TEXT;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "answers_id",
ADD COLUMN     "answer_id" TEXT,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
