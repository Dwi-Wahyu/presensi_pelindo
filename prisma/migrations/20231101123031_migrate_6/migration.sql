/*
  Warnings:

  - Added the required column `nama` to the `perizinan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "perizinan" ADD COLUMN     "nama" TEXT NOT NULL;
