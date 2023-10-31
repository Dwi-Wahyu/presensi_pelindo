/*
  Warnings:

  - Changed the type of `kode_unik` on the `perizinan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "perizinan" DROP COLUMN "kode_unik",
ADD COLUMN     "kode_unik" INTEGER NOT NULL;
