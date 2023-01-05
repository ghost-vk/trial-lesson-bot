import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient({ errorFormat: 'pretty' });

async function seed(): Promise<void> {
  const mtUuid0 = randomUUID();

  await prisma.stepTemplate.create({
    data: {
      step_action: 'Create',
      message_template_uuid: mtUuid0,
      order: 0,
      delay_minutes: 0,
      step_template_uuid: randomUUID(),
    },
  });
}

seed()
  .then(() => {
    console.log('✨ Seeding completed');
  })
  .catch((err) => {
    console.error(`❌ Seeeding error: ${JSON.stringify(err, null, 2)}`);
  });
