/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `magang` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `pkl` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `magang` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `pkl` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "magang" ADD COLUMN     "id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pkl" ADD COLUMN     "id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "magang_id_key" ON "magang"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pkl_id_key" ON "pkl"("id");
