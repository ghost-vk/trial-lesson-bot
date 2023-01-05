/*
  Warnings:

  - You are about to drop the column `hash` on the `message_template_button` table. All the data in the column will be lost.
  - You are about to drop the column `message_template_button_id` on the `message_template_button_item` table. All the data in the column will be lost.
  - You are about to drop the column `message_template_id` on the `message_template_button_item` table. All the data in the column will be lost.
  - You are about to drop the column `message_template_id` on the `message_template_link_item` table. All the data in the column will be lost.
  - You are about to drop the column `message_template_link_id` on the `message_template_link_item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[message_template_button_uuid]` on the table `message_template_button` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[message_template_link_uuid]` on the table `message_template_link` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `message_template_uuid` on the `message_template` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `message_template_button_uuid` to the `message_template_button` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_template_button_uuid` to the `message_template_button_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_template_uuid` to the `message_template_button_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_template_link_uuid` to the `message_template_link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_template_link_uuid` to the `message_template_link_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_template_uuid` to the `message_template_link_item` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `message_template_uuid` on the `step_template` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "message_template_button_item" DROP CONSTRAINT "message_template_button_item_message_template_button_id_fkey";

-- DropForeignKey
ALTER TABLE "message_template_button_item" DROP CONSTRAINT "message_template_button_item_message_template_id_fkey";

-- DropForeignKey
ALTER TABLE "message_template_link_item" DROP CONSTRAINT "message_template_link_item_message_template_id_fkey";

-- DropForeignKey
ALTER TABLE "message_template_link_item" DROP CONSTRAINT "message_template_link_item_message_template_link_id_fkey";

-- DropForeignKey
ALTER TABLE "step_template" DROP CONSTRAINT "step_template_message_template_uuid_fkey";

-- DropIndex
DROP INDEX "message_template_button_hash_key";

-- AlterTable
ALTER TABLE "message_template" DROP COLUMN "message_template_uuid",
ADD COLUMN     "message_template_uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "message_template_button" DROP COLUMN "hash",
ADD COLUMN     "message_template_button_uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "message_template_button_item" DROP COLUMN "message_template_button_id",
DROP COLUMN "message_template_id",
ADD COLUMN     "message_template_button_uuid" UUID NOT NULL,
ADD COLUMN     "message_template_uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "message_template_link" ADD COLUMN     "message_template_link_uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "message_template_link_item" DROP COLUMN "message_template_id",
DROP COLUMN "message_template_link_id",
ADD COLUMN     "message_template_link_uuid" UUID NOT NULL,
ADD COLUMN     "message_template_uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "step_template" DROP COLUMN "message_template_uuid",
ADD COLUMN     "message_template_uuid" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "message_template_message_template_uuid_key" ON "message_template"("message_template_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "message_template_button_message_template_button_uuid_key" ON "message_template_button"("message_template_button_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "message_template_link_message_template_link_uuid_key" ON "message_template_link"("message_template_link_uuid");

-- AddForeignKey
ALTER TABLE "step_template" ADD CONSTRAINT "step_template_message_template_uuid_fkey" FOREIGN KEY ("message_template_uuid") REFERENCES "message_template"("message_template_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_link_item" ADD CONSTRAINT "message_template_link_item_message_template_link_uuid_fkey" FOREIGN KEY ("message_template_link_uuid") REFERENCES "message_template_link"("message_template_link_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_link_item" ADD CONSTRAINT "message_template_link_item_message_template_uuid_fkey" FOREIGN KEY ("message_template_uuid") REFERENCES "message_template"("message_template_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_button_item" ADD CONSTRAINT "message_template_button_item_message_template_button_uuid_fkey" FOREIGN KEY ("message_template_button_uuid") REFERENCES "message_template_button"("message_template_button_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_button_item" ADD CONSTRAINT "message_template_button_item_message_template_uuid_fkey" FOREIGN KEY ("message_template_uuid") REFERENCES "message_template"("message_template_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
