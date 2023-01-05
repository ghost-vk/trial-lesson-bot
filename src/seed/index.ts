import { PrismaClient } from '@prisma/client';
import xlsx from 'node-xlsx';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], errorFormat: 'pretty' });

const tables = {
  stepTemplate: 0,
  messageTemplate: 1,
  messageTemplateLink: 2,
  messageTemplateLinkItem: 3,
  messageTemplateButton: 4,
  messageTemplateButtonItem: 5,
};

const stepTemplateTable = {
  step_template_uuid: 0,
  step_action: 1,
  message_template_uuid: 2,
  order: 3,
  delay_minutes: 4,
};

const messageTemplateTable = {
  message_template_uuid: 0,
  text: 1,
};

const messageTemplateLinkTable = {
  message_template_link_uuid: 0,
  text: 1,
  url: 2,
};

const messageTemplateLinkItemTable = {
  message_template_link_uuid: 0,
  message_template_uuid: 1,
};

const messageTemplateButtonTable = {
  message_template_button_uuid: 0,
  text: 1,
  step_template_uuid: 2,
};

const messageTemplateButtonItemTable = {
  message_template_button_uuid: 0,
  message_template_uuid: 1,
};

async function seed(): Promise<void> {
  const sheet = xlsx.parse(`${__dirname}/seed.xlsx`);

  await prisma.messageTemplate.deleteMany({});
  await prisma.messageTemplateLink.deleteMany({});
  await prisma.stepTemplate.deleteMany({});
  await prisma.messageTemplateButton.deleteMany({});

  for (let i = 0; i <= sheet[tables.messageTemplate].data.length - 1; i += 1) {
    if (i === 0) continue;
    const row: any = sheet[tables.messageTemplate].data[i];

    await prisma.messageTemplate.create({
      data: {
        message_template_uuid: row[messageTemplateTable.message_template_uuid],
        text: row[messageTemplateTable.text],
      },
    });
  }


  for (let i = 0; i <= sheet[tables.messageTemplateLink].data.length - 1; i += 1) {
    if (i === 0) continue;
    const row: any = sheet[tables.messageTemplateLink].data[i];

    await prisma.messageTemplateLink.create({
      data: {
        message_template_link_uuid: row[messageTemplateLinkTable.message_template_link_uuid],
        text: row[messageTemplateLinkTable.text],
        url: row[messageTemplateLinkTable.url],
      },
    });
  }


  for (let i = 0; i <= sheet[tables.messageTemplateLinkItem].data.length - 1; i += 1) {
    if (i === 0) continue;
    const row: any = sheet[tables.messageTemplateLinkItem].data[i];

    await prisma.messageTemplateLinkItem.create({
      data: {
        message_template_link_uuid: row[messageTemplateLinkItemTable.message_template_link_uuid],
        message_template_uuid: row[messageTemplateLinkItemTable.message_template_uuid],
      },
    });
  }


  for (let i = 0; i <= sheet[tables.stepTemplate].data.length - 1; i += 1) {
    if (i === 0) continue;
    const row: any = sheet[tables.stepTemplate].data[i];

    await prisma.stepTemplate.create({
      data: {
        step_template_uuid: row[stepTemplateTable.step_template_uuid],
        step_action: row[stepTemplateTable.step_action],
        message_template_uuid: row[stepTemplateTable.message_template_uuid],
        order: row[stepTemplateTable.order],
        delay_minutes: row[stepTemplateTable.delay_minutes],
      },
    });
  }

  
  for (let i = 0; i <= sheet[tables.messageTemplateButton].data.length - 1; i += 1) {
    if (i === 0) continue;
    const row: any = sheet[tables.messageTemplateButton].data[i];

    await prisma.messageTemplateButton.create({
      data: {
        message_template_button_uuid: row[messageTemplateButtonTable.message_template_button_uuid],
        text: row[messageTemplateLinkTable.text],
        step_template_uuid: row[messageTemplateButtonTable.step_template_uuid],
      },
    });
  }

  
  for (let i = 0; i <= sheet[tables.messageTemplateButtonItem].data.length - 1; i += 1) {
    if (i === 0) continue;
    const row: any = sheet[tables.messageTemplateButtonItem].data[i];

    await prisma.messageTemplateButtonItem.create({
      data: {
        message_template_button_uuid:
          row[messageTemplateButtonItemTable.message_template_button_uuid],
        message_template_uuid: row[messageTemplateButtonItemTable.message_template_uuid],
      },
    });
  }
}

seed()
  .then(() => {
    console.log('✨ Seeding completed');
  })
  .catch((err) => {
    console.error(`❌ Seeeding error: ${JSON.stringify(err, null, 2)}`);
  });
