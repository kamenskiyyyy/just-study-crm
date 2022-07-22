import { KeystoneContext } from '@keystone-6/core/dist/declarations/src/types';
import { Roles } from '../enums/roles.enum';
import format from 'date-fns/format';
import { MAIL_USER } from '../config';
import { baseTemplateEmail } from '../mailTemplate/base';
import { mailer } from '../lib/nodemailer';
import { Lists } from '.keystone/types';
import { fieldsEmail } from '../lib/fieldsEmail';

/**
 * Уведомление для менеджера о новом лиде
 * @param client
 * @param ctx
 */
export const notifyNewClient = async (
  client: Lists.User.Item,
  ctx: KeystoneContext
) => {
  const managers = await ctx.query.User.findMany({
    where: { role: { in: [Roles.Admin, Roles.Manager] } },
    query: `email`,
  });

  const managersEmail = managers.map((user) => user.email);

  const clientInfo = `
    <div style='display:flex; flex-direction: column; gap: 8px'>
    ${fieldsEmail("Имя", client.name)}
    ${fieldsEmail("Телефон", `${client.phone}`)}
    ${fieldsEmail(
      "Дата",
      `${format(
        new Date(client.createdAt as unknown as string),
        "dd.MM.yyyy HH:mm"
      )}`
    )}
    ${fieldsEmail("Email", client.email)}
    ${fieldsEmail("Коммент", client.comment)}
</div>
  `;

  await mailer.sendMail({
    to: managersEmail,
    from: MAIL_USER,
    subject: "У вас новый лид",
    html: baseTemplateEmail("Новый лид", clientInfo),
  });
};
