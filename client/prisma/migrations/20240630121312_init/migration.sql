-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "english" TEXT NOT NULL,
    "german" TEXT NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);
