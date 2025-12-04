/*
  Warnings:

  - You are about to drop the column `model_name` on the `message` table. All the data in the column will be lost.
  - Added the required column `modelName` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "model_name",
ADD COLUMN     "modelName" TEXT NOT NULL;
