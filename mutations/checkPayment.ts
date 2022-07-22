import { KeystoneContext } from "@keystone-6/core/dist/declarations/src/types";
import { Currency } from "../enums/currency.enum";
import { PaymentStatus } from "../enums/payment-status.enum";

const { paytureRuStatus } = require("../utils/paytureRu");
const { paytureEnStatus } = require("../utils/paytureEn");

interface Arguments {
  paymentId: string;
}

export const checkPayment = async (
  root: any,
  { paymentId }: Arguments,
  context: KeystoneContext
) => {
  let payment = await context.query.Payment.findOne({
    where: { id: paymentId },
    query: `id currency order { id leftPayments }`,
  });
  if (!payment) {
    throw new Error("Sorry! The payment does not exist!");
  }

  let res = { Success: "False" };

  if (payment.currency === Currency.RUB) {
    console.log("test ru");
    res = await paytureRuStatus(payment.id);
  }

  if (payment.currency === Currency.USD) {
    console.log("test usd");
    res = await paytureEnStatus(payment.id);
  }

  if (res.Success === "True") {
    await context.query.Order.updateOne({
      where: { id: payment.order.id },
      data: {
        leftPayments: payment.order.leftPayments - 1,
      },
    });
    return await context.query.Payment.updateOne({
      where: { id: paymentId },
      data: { status: PaymentStatus.Successfully },
      query: `id order { id } currency student { id } amount sessionId receiptId status createdAt lastModification`,
    });
  } else {
    throw new Error("Sorry! The payment does not successful.");
  }
};
