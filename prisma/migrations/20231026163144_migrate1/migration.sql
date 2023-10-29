-- CreateTable
CREATE TABLE "pkl" (
    "nomor" SERIAL NOT NULL,
    "nama" VARCHAR(500) NOT NULL,
    "jenis_kelamin" VARCHAR(100) NOT NULL,
    "kode_unik" INTEGER NOT NULL,
    "namaSekolah" TEXT,

    CONSTRAINT "pkl_pkey" PRIMARY KEY ("nomor")
);

-- CreateTable
CREATE TABLE "presensi_pkl" (
    "id" TEXT NOT NULL,
    "namaSiswa" TEXT,
    "waktuDatang" TEXT NOT NULL,
    "waktuPulang" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "presensi_pkl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sekolah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magang" (
    "nomor" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "kode_unik" INTEGER NOT NULL,
    "namaKampus" TEXT,

    CONSTRAINT "magang_pkey" PRIMARY KEY ("nomor")
);

-- CreateTable
CREATE TABLE "kampus" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "kampus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presensi_magang" (
    "id" TEXT NOT NULL,
    "namaMahasiswa" TEXT,
    "waktuDatang" TEXT NOT NULL,
    "waktuPulang" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "presensi_magang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pkl_nama_key" ON "pkl"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "sekolah_nama_key" ON "sekolah"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "magang_nama_key" ON "magang"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "kampus_nama_key" ON "kampus"("nama");

-- AddForeignKey
ALTER TABLE "pkl" ADD CONSTRAINT "pkl_namaSekolah_fkey" FOREIGN KEY ("namaSekolah") REFERENCES "sekolah"("nama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi_pkl" ADD CONSTRAINT "presensi_pkl_namaSiswa_fkey" FOREIGN KEY ("namaSiswa") REFERENCES "pkl"("nama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magang" ADD CONSTRAINT "magang_namaKampus_fkey" FOREIGN KEY ("namaKampus") REFERENCES "kampus"("nama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi_magang" ADD CONSTRAINT "presensi_magang_namaMahasiswa_fkey" FOREIGN KEY ("namaMahasiswa") REFERENCES "magang"("nama") ON DELETE SET NULL ON UPDATE CASCADE;
