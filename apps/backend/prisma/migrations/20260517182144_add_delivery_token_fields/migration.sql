-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "deliveryToken" TEXT,
ADD COLUMN     "deliveryTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "locationExpiresAt" TIMESTAMP(3);
