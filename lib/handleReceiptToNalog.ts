import { PaymentStatus } from "../enums/payment-status.enum";
import { ListHooks } from "@keystone-6/core/dist/declarations/src/types/config/hooks";
import { Lists } from ".keystone/types";
import { NALOG_INN, NALOG_PASSWORD } from "../config";
import {
  notifySuccessfulPaymentForClient,
  notifySuccessfulPaymentForManagers,
} from "../notifications/successfulPayment";

const { NalogApi } = require("lknpd-nalog-api");

/**
 * Отправляем платеж в налоговую если платеж имеет статус Successfully, и отменяем его, если статус Cancelled
 * @param operation
 * @param item
 * @param context
 */
export const handleReceiptToNalog: ListHooks<Lists.Payment.TypeInfo>["afterOperation"] =
  async ({ item, context, operation }) => {
    if (operation === "update") {
      const nalogApi = new NalogApi({
        inn: NALOG_INN,
        password: NALOG_PASSWORD,
      });

      if (!nalogApi) return;

      if (item?.status === PaymentStatus.Successfully && !item.receiptId) {
        const order = await context.query.Order.findOne({
          where: { id: `${item.orderId}` },
          query: `student { id name }`,
        });
        const receiptId = await nalogApi.addIncome({
          name: `Консультационные услуги для клиента ${order.student.name}`,
          amount: item.amount,
          quantity: 1,
        });
        await context.query.Payment.updateOne({
          where: { id: `${item.id}` },
          data: {
            receiptId,
          },
        });
        await notifySuccessfulPaymentForClient(
          order.student.id,
          item.id,
          context
        );
        await notifySuccessfulPaymentForManagers(
          order.student.id,
          item.id,
          context
        );
      }

      if (item?.status === PaymentStatus.Cancelled && item.receiptId) {
        const receiptId = item.receiptId;
        await nalogApi.cancelIncome(receiptId, "Платеж отменен");
        await context.query.Payment.updateOne({
          where: { id: `${item.id}` },
          data: { receiptId: "" },
        });
      }
    }
  };
