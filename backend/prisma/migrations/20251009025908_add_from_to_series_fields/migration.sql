/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `series` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Series` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `series` DROP COLUMN `updatedAt`,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    MODIFY `fromSeries` VARCHAR(191) NOT NULL,
    MODIFY `toSeries` VARCHAR(191) NOT NULL;
