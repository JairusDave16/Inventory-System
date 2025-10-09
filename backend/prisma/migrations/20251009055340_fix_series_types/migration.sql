/*
  Warnings:

  - You are about to alter the column `fromSeries` on the `series` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `toSeries` on the `series` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `series` MODIFY `fromSeries` INTEGER NOT NULL,
    MODIFY `toSeries` INTEGER NOT NULL;
