/*
  Warnings:

  - You are about to drop the column `name` on the `series` table. All the data in the column will be lost.
  - Added the required column `from` to the `Series` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Series` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `series` DROP COLUMN `name`,
    ADD COLUMN `from` INTEGER NOT NULL,
    ADD COLUMN `itemId` INTEGER NOT NULL,
    ADD COLUMN `to` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Series` ADD CONSTRAINT `Series_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
