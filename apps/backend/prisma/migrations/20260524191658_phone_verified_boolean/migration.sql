/*
  Warnings:

  - The `phoneVerified` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "phoneVerified" TYPE BOOLEAN USING ("phoneVerified" IS NOT NULL);
ALTER TABLE "user" ALTER COLUMN "phoneVerified" SET DEFAULT false;
ALTER TABLE "user" ALTER COLUMN "phoneVerified" SET NOT NULL;
