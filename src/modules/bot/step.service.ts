import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { addMinutes } from 'date-fns';
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import { InlineKeyboard, InlineKeyboardButton, Row } from 'node-telegram-keyboard-wrapper';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StepService {
  private readonly logger = new Logger(StepService.name);
  private _bot: TelegramBot;

  constructor(private readonly prisma: PrismaService) {}

  get bot(): TelegramBot {
    return this._bot;
  }

  set bot(bot: TelegramBot) {
    this._bot = bot;
  }

  async makeFirstStep(user: { user_id: number }): Promise<void> {
    const isAlreadyStartedDialog =
      (await this.prisma.step.count({ where: { user_id: user.user_id } })) > 0;

    if (isAlreadyStartedDialog) return;

    const firstStepTemplate = await this.prisma.stepTemplate.findFirstOrThrow({
      where: { order: 0 },
    });

    await this.prisma.step.create({
      data: {
        user_id: user.user_id,
        step_template_uuid: firstStepTemplate.step_template_uuid,
        status: 'Awaiting',
        message_template_uuid: firstStepTemplate.message_template_uuid,
        execution_datetime: addMinutes(new Date(), firstStepTemplate.delay_minutes),
      },
    });
  }

  @Cron('*/5 * * * * *')
  async handleStep(): Promise<void> {
    const activeSteps = await this.prisma.step.findMany({
      where: { status: 'Awaiting', execution_datetime: { lte: new Date() } },
      include: { user: true },
    });

    for (const step of activeSteps) {
      const stepTemplate = await this.prisma.stepTemplate.findUniqueOrThrow({
        where: { step_template_uuid: step.step_template_uuid },
      });

      switch (stepTemplate.step_action) {
        case 'Create': {
          const messageTemplate = await this.prisma.messageTemplate.findUniqueOrThrow({
            where: { message_template_uuid: stepTemplate.message_template_uuid },
            include: { message_template_button_items: true, message_template_link_items: true },
          });

          const messageTemplateButtons = await this.prisma.messageTemplateButton.findMany({
            where: {
              message_template_button_uuid: {
                in: messageTemplate.message_template_button_items.map(
                  (_) => _.message_template_button_uuid,
                ),
              },
            },
          });

          const messageTemplateLinks = await this.prisma.messageTemplateLink.findMany({
            where: {
              message_template_link_uuid: {
                in: messageTemplate.message_template_link_items.map(
                  (_) => _.message_template_link_uuid,
                ),
              },
            },
          });

          let inlineKeyboard: InlineKeyboard | null = null;

          if (messageTemplateButtons.length > 0 || messageTemplateLinks.length > 0) {
            inlineKeyboard = new InlineKeyboard();

            for (const messageTemplateButton of messageTemplateButtons) {
              inlineKeyboard.push(
                new Row<InlineKeyboardButton>(
                  new InlineKeyboardButton(
                    messageTemplateButton.text,
                    'callback_data',
                    messageTemplateButton.message_template_button_uuid,
                  ),
                ),
              );
            }

            for (const messageTemplateLink of messageTemplateLinks) {
              inlineKeyboard.push(
                new Row<InlineKeyboardButton>(
                  new InlineKeyboardButton(
                    messageTemplateLink.text,
                    'url',
                    messageTemplateLink.url,
                  ),
                ),
              );
            }
          }

          const message = await this.bot.sendMessage(step.user.telegram_id, messageTemplate.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: inlineKeyboard ? inlineKeyboard.getMarkup() : undefined,
          });

          await this.prisma.step.update({
            where: { step_id: step.step_id },
            data: { telegram_message_id: message.message_id },
          });

          break;
        }
        case 'Delete': {
          const previosStep = await this.prisma.step.findFirstOrThrow({
            where: {
              message_template_uuid: step.message_template_uuid,
              telegram_message_id: { not: null },
              user_id: step.user.user_id,
            },
            select: { telegram_message_id: true },
          });

          if (!previosStep.telegram_message_id) {
            throw new Error('No message to delete');
          }

          await this.bot.deleteMessage(step.user.telegram_id, String(previosStep.telegram_message_id));
          break;
        }
        default: {
          throw new Error('Wrong step_action');
        }
      }

      const nextStepTemplates = await this.prisma.stepTemplate.findMany({
        where: { order: stepTemplate.order + 1 },
      });

      if (nextStepTemplates.length > 1) {
        this.logger.error('More than 1 step template found for order=' + stepTemplate.order + 1);
      }

      if (nextStepTemplates.length > 0) {
        await this.prisma.step.create({
          data: {
            user_id: step.user.user_id,
            step_template_uuid: nextStepTemplates[0].step_template_uuid,
            status: 'Awaiting',
            message_template_uuid: nextStepTemplates[0].message_template_uuid,
            execution_datetime: addMinutes(new Date(), nextStepTemplates[0].delay_minutes),
          },
        });
      }

      await this.prisma.step.update({
        where: { step_id: step.step_id },
        data: { status: 'Done' },
      });
    }
  }

  async handleButton(query: CallbackQuery): Promise<void> {
    console.log(JSON.stringify(query, null, 2));

    const result = await this.prisma.$queryRaw`SELECT s.* FROM step s
      LEFT JOIN public.user u ON u.user_id = s.user_id
      LEFT JOIN message_template mt ON s.message_template_uuid = mt.message_template_uuid
      LEFT JOIN message_template_button_item mtbi ON mtbi.message_template_uuid = mt.message_template_uuid
      LEFT JOIN message_template_button mtb ON mtb.message_template_button_uuid = mtbi.message_template_button_uuid
      WHERE u.telegram_id=${query.from.id}
      AND s.status='Done'
      AND mtb.message_template_button_uuid=${query.data}::uuid
    `;

    console.log(JSON.stringify(result, null, 2));
  }
}
