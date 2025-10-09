/*
  Warnings:

  - You are about to drop the column `from` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `series` table. All the data in the column will be lost.
  - Added the required column `fromSeries` to the `Series` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toSeries` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `series` DROP COLUMN `from`,
    DROP COLUMN `to`,
    ADD COLUMN `fromSeries` INTEGER NOT NULL,
    ADD COLUMN `toSeries` INTEGER NOT NULL;
