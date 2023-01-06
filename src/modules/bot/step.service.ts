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
  private isHandleStep = false; // для тротлинга

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
        to_message_template_uuid: firstStepTemplate.to_message_template_uuid,
      },
    });
  }

  @Cron('*/1 * * * * *')
  async handleStep(): Promise<void> {
    this.isHandleStep = true;

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
            select: { telegram_message_id: true, step_id: true },
          });

          if (!previosStep.telegram_message_id) {
            throw new Error('No message to delete');
          }

          await this.bot.deleteMessage(
            step.user.telegram_id,
            String(previosStep.telegram_message_id),
          );
          await this.prisma.step.update({
            where: { step_id: previosStep.step_id },
            data: { telegram_message_id: null },
          });
          break;
        }

        case 'Update': {
          const previosStep = await this.prisma.step.findFirstOrThrow({
            where: {
              message_template_uuid: step.message_template_uuid,
              telegram_message_id: { not: null },
              user_id: step.user.user_id,
            },
            select: { telegram_message_id: true },
          });

          if (!previosStep.telegram_message_id) {
            throw new Error('No message to update');
          }

          if (!step.to_message_template_uuid) {
            throw new Error('No message template to update');
          }

          const newMessageTemplate = await this.prisma.messageTemplate.findUniqueOrThrow({
            where: { message_template_uuid: step.to_message_template_uuid },
            include: { message_template_button_items: true, message_template_link_items: true },
          });

          const messageTemplateButtons = await this.prisma.messageTemplateButton.findMany({
            where: {
              message_template_button_uuid: {
                in: newMessageTemplate.message_template_button_items.map(
                  (_) => _.message_template_button_uuid,
                ),
              },
            },
          });

          const messageTemplateLinks = await this.prisma.messageTemplateLink.findMany({
            where: {
              message_template_link_uuid: {
                in: newMessageTemplate.message_template_link_items.map(
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

          await this.bot.editMessageText(newMessageTemplate.text, {
            chat_id: step.user.telegram_id,
            message_id: previosStep.telegram_message_id,
          });

          if (inlineKeyboard) {
            await this.bot.editMessageReplyMarkup(inlineKeyboard.getMarkup(), {
              chat_id: step.user.telegram_id,
              message_id: previosStep.telegram_message_id,
            });
          }

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
            to_message_template_uuid: nextStepTemplates[0].to_message_template_uuid,
          },
        });
      }

      await this.prisma.step.update({
        where: { step_id: step.step_id },
        data: { status: 'Done' },
      });
    }

    this.isHandleStep = false;
  }

  async handleButton(query: CallbackQuery): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { telegram_id: query.from.id },
    });

    const result: Array<{ step_template_uuid: string }> = await this.prisma.$queryRaw`
      SELECT DISTINCT mtb.step_template_uuid FROM step s
      LEFT JOIN public.user u ON u.user_id = s.user_id
      LEFT JOIN message_template mt ON s.message_template_uuid = mt.message_template_uuid
      LEFT JOIN message_template_button_item mtbi ON mtbi.message_template_uuid = mt.message_template_uuid
      LEFT JOIN message_template_button mtb ON mtb.message_template_button_uuid = mtbi.message_template_button_uuid
      WHERE u.telegram_id=${query.from.id}
      AND s.status='Done'
      AND mtb.message_template_button_uuid=${query.data}::uuid
    `;

    if (result.length === 0) {
      throw new Error(`Step template for button ${query.data} not found`);
    }

    if (result.length > 1) {
      throw new Error('Ambiguity result: the button links to multiple step templates');
    }

    const newStepTemplate = await this.prisma.stepTemplate.findUniqueOrThrow({
      where: { step_template_uuid: result[0].step_template_uuid },
    });

    const lastUserSteps = await this.prisma.step.findMany({
      where: { user_id: user.user_id },
      take: 1,
      orderBy: { execution_datetime: 'desc' },
    });

    const lastUserStepTemplate = await this.prisma.stepTemplate.findUniqueOrThrow({
      where: { step_template_uuid: lastUserSteps[0].step_template_uuid },
    });

    // в этом случае кнопка не сможет продвинуть пользователя дальше
    if (newStepTemplate.order < lastUserStepTemplate.order) return;

    const isSameOrder = newStepTemplate.order === lastUserStepTemplate.order;
    const isStepAwaiting =
      lastUserSteps[0].status === 'Awaiting' && new Date() < lastUserSteps[0].execution_datetime;

    // защита от нажатия одной и той же кнопки
    if (isSameOrder && !isStepAwaiting) return;

    await this.prisma.step.updateMany({
      where: {
        user_id: user.user_id,
        status: 'Awaiting',
      },
      data: {
        status: 'Done',
      },
    });

    await this.prisma.step.create({
      data: {
        user_id: user.user_id,
        step_template_uuid: newStepTemplate.step_template_uuid,
        status: 'Awaiting',
        message_template_uuid: newStepTemplate.message_template_uuid,
        execution_datetime: new Date(), // после нажатия кнопки новый шаг должен начаться сразу
        to_message_template_uuid: newStepTemplate.to_message_template_uuid,
      },
    });
  }
}
