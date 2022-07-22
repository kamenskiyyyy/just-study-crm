import { KeystoneContext } from "@keystone-6/core/dist/declarations/src/types";
import { Currency } from "../enums/currency.enum";

const { paytureRuPay } = require("../utils/paytureRu");
const { paytureEnPay } = require("../utils/paytureEn");

interface Arguments {
  paymentId: string;
}

export const againPayment = async (
  root: any,
  { paymentId }: Arguments,
  context: KeystoneContext
) => {
  const payment = await context.query.Payment.findOne({
    where: { id: paymentId },
    query: `id currency sessionId`,
  });
  if (!payment) {
    throw new Error("Sorry! The payment does not exist!");
  }

  if (payment.currency === Currency.RUB) {
    const res = await paytureRuPay(payment.sessionId);
    console.log(res);
    return res;
  }

  if (payment.currency === Currency.USD) {
    return await paytureEnPay(payment.sessionId);
  }
};
