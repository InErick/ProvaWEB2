/*
  Warnings:

  - You are about to drop the column `driverId` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the `drivers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deliverymanId` to the `deliveries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_driverId_fkey";

-- AlterTable
ALTER TABLE "deliveries" DROP COLUMN "driverId",
ADD COLUMN     "deliverymanId" TEXT NOT NULL;

-- DropTable
DROP TABLE "drivers";

-- CreateTable
CREATE TABLE "deliveryman" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "deliveryVehicle" TEXT NOT NULL,

    CONSTRAINT "deliveryman_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_deliverymanId_fkey" FOREIGN KEY ("deliverymanId") REFERENCES "deliveryman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
