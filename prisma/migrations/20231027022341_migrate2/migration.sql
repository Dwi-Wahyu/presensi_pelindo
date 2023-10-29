/*
  Warnings:

  - You are about to drop the column `namaKampus` on the `magang` table. All the data in the column will be lost.
  - You are about to drop the column `namaSekolah` on the `pkl` table. All the data in the column will be lost.
  - You are about to drop the column `namaMahasiswa` on the `presensi_magang` table. All the data in the column will be lost.
  - You are about to drop the column `waktuDatang` on the `presensi_magang` table. All the data in the column will be lost.
  - You are about to drop the column `waktuPulang` on the `presensi_magang` table. All the data in the column will be lost.
  - You are about to drop the column `namaSiswa` on the `presensi_pkl` table. All the data in the column will be lost.
  - You are about to drop the column `waktuDatang` on the `presensi_pkl` table. All the data in the column will be lost.
  - You are about to drop the column `waktuPulang` on the `presensi_pkl` table. All the data in the column will be lost.
  - Added the required column `waktu_datang` to the `presensi_magang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_pulang` to the `presensi_magang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_datang` to the `presensi_pkl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_pulang` to the `presensi_pkl` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "magang" DROP CONSTRAINT "magang_namaKampus_fkey";

-- DropForeignKey
ALTER TABLE "pkl" DROP CONSTRAINT "pkl_namaSekolah_fkey";

-- DropForeignKey
ALTER TABLE "presensi_magang" DROP CONSTRAINT "presensi_magang_namaMahasiswa_fkey";

-- DropForeignKey
ALTER TABLE "presensi_pkl" DROP CONSTRAINT "presensi_pkl_namaSiswa_fkey";

-- AlterTable
ALTER TABLE "magang" DROP COLUMN "namaKampus",
ADD COLUMN     "nama_kampus" TEXT;

-- AlterTable
ALTER TABLE "pkl" DROP COLUMN "namaSekolah",
ADD COLUMN     "nama_sekolah" TEXT;

-- AlterTable
ALTER TABLE "presensi_magang" DROP COLUMN "namaMahasiswa",
DROP COLUMN "waktuDatang",
DROP COLUMN "waktuPulang",
ADD COLUMN     "nama_mahasiswa" TEXT,
ADD COLUMN     "waktu_datang" TEXT NOT NULL,
ADD COLUMN     "waktu_pulang" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "presensi_pkl" DROP COLUMN "namaSiswa",
DROP COLUMN "waktuDatang",
DROP COLUMN "waktuPulang",
ADD COLUMN     "nama_siswa" TEXT,
ADD COLUMN     "waktu_datang" TEXT NOT NULL,
ADD COLUMN     "waktu_pulang" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "pkl" ADD CONSTRAINT "pkl_nama_sekolah_fkey" FOREIGN KEY ("nama_sekolah") REFERENCES "sekolah"("nama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi_pkl" ADD CONSTRAINT "presensi_pkl_nama_siswa_fkey" FOREIGN KEY ("nama_siswa") REFERENCES "pkl"("nama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magang" ADD CONSTRAINT "magang_nama_kampus_fkey" FOREIGN KEY ("nama_kampus") REFERENCES "kampus"("nama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi_magang" ADD CONSTRAINT "presensi_magang_nama_mahasiswa_fkey" FOREIGN KEY ("nama_mahasiswa") REFERENCES "magang"("nama") ON DELETE SET NULL ON UPDATE CASCADE;
