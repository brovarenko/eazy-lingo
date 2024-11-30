-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_setId_fkey";

-- AlterTable
ALTER TABLE "Word" ALTER COLUMN "setId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE SET NULL ON UPDATE CASCADE;
