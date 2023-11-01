/*
  Warnings:

  - Added the required column `waktu_izin` to the `perizinan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "perizinan" ADD COLUMN     "waktu_izin" TEXT NOT NULL;
