import { ListHooks } from '@keystone-6/core/dist/declarations/src/types/config/hooks';
import { Lists } from '.keystone/types';
import { Statuses } from '../enums/statuses.enum';

/**
 * Обрабатываем статус пользовательского абонемента по количеству оставшихся занятий
 * @param context
 * @param item
 * @param operation
 */
export const handleStatusUserSubscription: ListHooks<Lists.UserSubscription.TypeInfo>["afterOperation"] =
  async ({ context, item, operation }) => {
    if (operation === "update") {
      const subscription = await context.query.UserSubscription.findOne({
        where: { id: `${item?.id}` },
        query: `lastCount`,
      });

      if (!subscription) return;

      if (subscription.lastCount === 0) {
        await context.query.UserSubscription.updateOne({
          where: { id: `${item?.id}` },
          data: { status: Statuses.Finished },
        });
      }

      if (subscription.lastCount >= 1) {
        await context.query.UserSubscription.updateOne({
          where: { id: `${item?.id}` },
          data: { status: Statuses.Active },
        });
      }
    }
    return;
  };
