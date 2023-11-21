/*
  Warnings:

  - Added the required column `pasangan` to the `pengguna` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pengguna" ADD COLUMN     "pasangan" INTEGER NOT NULL;
