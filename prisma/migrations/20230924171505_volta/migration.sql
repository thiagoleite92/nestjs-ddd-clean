/*
  Warnings:

  - You are about to drop the column `answer_id` on the `comments` table. All the data in the column will be lost.
  - Made the column `updated_at` on table `comments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_answer_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "answer_id",
ADD COLUMN     "answers_id" TEXT,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_answers_id_fkey" FOREIGN KEY ("answers_id") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
