-- CreateTable
CREATE TABLE "perizinan" (
    "id" TEXT NOT NULL,
    "kode_unik" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "perizinan_pkey" PRIMARY KEY ("id")
);
