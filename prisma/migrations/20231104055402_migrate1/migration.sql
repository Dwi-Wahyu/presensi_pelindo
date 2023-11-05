-- CreateTable
CREATE TABLE "perizinan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode_unik" INTEGER NOT NULL,
    "tanggal" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "waktu_izin" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "perizinan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "kode_unik" INTEGER NOT NULL,
    "namaAsal" TEXT,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rekapitulasi" (
    "id" TEXT NOT NULL,
    "namaPengguna" TEXT,
    "waktu_datang" TEXT NOT NULL,
    "waktu_pulang" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "kehadiran" TEXT NOT NULL,

    CONSTRAINT "rekapitulasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asal" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,

    CONSTRAINT "asal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_nama_key" ON "pengguna"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "asal_nama_key" ON "asal"("nama");

-- AddForeignKey
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_namaAsal_fkey" FOREIGN KEY ("namaAsal") REFERENCES "asal"("nama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rekapitulasi" ADD CONSTRAINT "rekapitulasi_namaPengguna_fkey" FOREIGN KEY ("namaPengguna") REFERENCES "pengguna"("nama") ON DELETE SET NULL ON UPDATE CASCADE;
