import { KeystoneContext } from "@keystone-6/core/dist/declarations/src/types";
import { FRONTEND_URL } from "../config";
import { Currency } from "../enums/currency.enum";

const { paytureRuInit } = require("../utils/paytureRu");
const { paytureEnInit } = require("../utils/paytureEn");

interface Arguments {
  orderId: string;
}

/**
 * Создаем платеж и получаем ссылку на оплату
 * @param root
 * @param orderId
 * @param context
 */
export const payment = async (
  root: any,
  { orderId }: Arguments,
  context: KeystoneContext
) => {
  const order = await context.query.Order.findOne({
    where: { id: orderId },
    query: `label currency amount nextPayment student { id }`,
  });
  if (!order) {
    throw new Error("Sorry! The order does not exist!");
  }

  const payment = await context.query.Payment.createOne({
    data: {
      order: { connect: { id: orderId } },
      currency: order.currency,
      student: { connect: { id: order.student.id } },
      amount: order.nextPayment,
    },
    query: `id amount currency`,
  });

  if (!payment) {
    throw new Error("Sorry! The payment does not exist!");
  }

  const paytureData = {
    OrderId: payment.id,
    Amount: payment.amount * 100,
    SessionType: "Pay",
    Url: `${FRONTEND_URL}/result?orderid={orderid}&result={success}`,
    Product: order.label,
    Total: order.nextPayment,
  };

  if (payment.currency === Currency.RUB) {
    const res = await paytureRuInit(paytureData);

    if (res) {
      await context.query.Payment.updateOne({
        where: { id: payment.id },
        data: {
          sessionId: res.SessionId,
        },
      });
    }
    return res;
  }

  if (payment.currency === Currency.USD) {
    const res = await paytureEnInit(paytureData);

    if (res) {
      await context.query.Payment.updateOne({
        where: { id: payment.id },
        data: {
          sessionId: res.SessionId,
        },
      });
    }
    return res;
  }
};
