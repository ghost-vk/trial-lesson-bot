-- CreateEnum
CREATE TYPE "StepActionEnum" AS ENUM ('Create', 'Update', 'Delete');

-- CreateEnum
CREATE TYPE "StepStatusEnum" AS ENUM ('Done', 'Awaiting');

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "telegram_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "step_template" (
    "step_template_id" SERIAL NOT NULL,
    "step_template_uuid" TEXT NOT NULL,
    "step_action" "StepActionEnum" NOT NULL,
    "message_template_uuid" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "delay_minutes" INTEGER NOT NULL,

    CONSTRAINT "step_template_pkey" PRIMARY KEY ("step_template_id")
);

-- CreateTable
CREATE TABLE "step" (
    "step_id" SERIAL NOT NULL,
    "message_template_id" INTEGER NOT NULL,
    "telegram_message_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "step_template_id" INTEGER NOT NULL,
    "status" "StepStatusEnum" NOT NULL,

    CONSTRAINT "step_pkey" PRIMARY KEY ("step_id")
);

-- CreateTable
CREATE TABLE "message_template" (
    "message_template_id" SERIAL NOT NULL,
    "message_template_uuid" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "message_template_pkey" PRIMARY KEY ("message_template_id")
);

-- CreateTable
CREATE TABLE "message_template_link" (
    "message_template_link_id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "message_template_link_pkey" PRIMARY KEY ("message_template_link_id")
);

-- CreateTable
CREATE TABLE "message_template_link_item" (
    "message_template_link_item_id" SERIAL NOT NULL,
    "message_template_link_id" INTEGER NOT NULL,
    "message_template_id" INTEGER NOT NULL,

    CONSTRAINT "message_template_link_item_pkey" PRIMARY KEY ("message_template_link_item_id")
);

-- CreateTable
CREATE TABLE "message_template_button" (
    "message_template_button_id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "step_template_uuid" TEXT NOT NULL,

    CONSTRAINT "message_template_button_pkey" PRIMARY KEY ("message_template_button_id")
);

-- CreateTable
CREATE TABLE "message_template_button_item" (
    "message_template_button_item_id" SERIAL NOT NULL,
    "message_template_button_id" INTEGER NOT NULL,
    "message_template_id" INTEGER NOT NULL,

    CONSTRAINT "message_template_button_item_pkey" PRIMARY KEY ("message_template_button_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_telegram_id_key" ON "user"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "step_template_step_template_uuid_key" ON "step_template"("step_template_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "message_template_message_template_uuid_key" ON "message_template"("message_template_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "message_template_button_hash_key" ON "message_template_button"("hash");

-- AddForeignKey
ALTER TABLE "step_template" ADD CONSTRAINT "step_template_message_template_uuid_fkey" FOREIGN KEY ("message_template_uuid") REFERENCES "message_template"("message_template_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step" ADD CONSTRAINT "step_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "message_template"("message_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step" ADD CONSTRAINT "step_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step" ADD CONSTRAINT "step_step_template_id_fkey" FOREIGN KEY ("step_template_id") REFERENCES "step_template"("step_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_link_item" ADD CONSTRAINT "message_template_link_item_message_template_link_id_fkey" FOREIGN KEY ("message_template_link_id") REFERENCES "message_template_link"("message_template_link_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_link_item" ADD CONSTRAINT "message_template_link_item_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "message_template"("message_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_button" ADD CONSTRAINT "message_template_button_step_template_uuid_fkey" FOREIGN KEY ("step_template_uuid") REFERENCES "step_template"("step_template_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_button_item" ADD CONSTRAINT "message_template_button_item_message_template_button_id_fkey" FOREIGN KEY ("message_template_button_id") REFERENCES "message_template_button"("message_template_button_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_button_item" ADD CONSTRAINT "message_template_button_item_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "message_template"("message_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;
