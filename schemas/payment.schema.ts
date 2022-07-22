import { list } from "@keystone-6/core";
import { integer, relationship, select, text } from "@keystone-6/core/fields";
import { PaymentStatusOptions } from "../consts/payment-status-options.const";
import { PaymentStatus } from "../enums/payment-status.enum";
import { handleReceiptToNalog } from "../lib/handleReceiptToNalog";
import { createdAt } from "../fields/createdAt";
import { lastModification } from "../fields/lastModification";
import { currency } from "../fields/currency";

export const Payment = list({
  ui: {
    label: "Платежи",
    listView: {
      initialColumns: ["id", "order", "status", "amount"],
      pageSize: 20,
    },
  },
  fields: {
    order: relationship({ ref: "Order.payments" }),
    currency,
    student: relationship({ ref: "User" }),
    amount: integer({ defaultValue: 0 }),
    sessionId: text(),
    receiptId: text(),
    status: select({
      type: "enum",
      options: PaymentStatusOptions,
      defaultValue: PaymentStatus.Created,
      ui: { displayMode: "segmented-control" },
      validation: { isRequired: true },
    }),
    createdAt,
    lastModification,
  },
  hooks: {
    afterOperation: handleReceiptToNalog,
  },
  access: {
    operation: {
      query: ({ session }) => !!session,
      create: ({ session }) => !!session,
      update: ({ session }) => !!session,
      delete: ({ session }) => !!session,
    },
  },
});
