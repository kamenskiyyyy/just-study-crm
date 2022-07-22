import { graphql, list } from "@keystone-6/core";
import { integer, text, virtual } from "@keystone-6/core/fields";
import { Roles } from "../enums/roles.enum";
import { language } from "../fields/language";
import { createdAt } from "../fields/createdAt";
import { lastModification } from "../fields/lastModification";
import { statusView } from "../fields/statusView";
import { content } from "../fields/document";
import { Lists } from ".keystone/types";
import { getCurrencyForLanguage } from "../lib/getCurrency";

export const Subscription = list({
  ui: {
    label: "Шаблоны абонементов",
    labelField: "label",
    listView: {
      initialColumns: [
        "label",
        "language",
        "statusView",
        "visitCount",
        "period",
      ],
    },
  },
  fields: {
    language,
    label: virtual({
      // @ts-ignore
      field: graphql.field({
        type: graphql.String,
        resolve(item: Lists.Subscription.Item) {
          if (!item) return;
          return `${item.name} - ${item.price} ${getCurrencyForLanguage(
            item.language
          )}`;
        },
      }),
    }),
    statusView,
    name: text({ validation: { isRequired: true } }),
    description: content,
    visitCount: integer({
      defaultValue: 10,
      validation: { isRequired: true },
    }),
    price: integer({ validation: { isRequired: true } }),
    period: integer({ defaultValue: 45 }),
    createdAt,
    lastModification,
  },
  access: {
    operation: {
      create: ({ session }) => !!session && session.data.role !== Roles.Student,
      update: ({ session }) => !!session && session.data.role !== Roles.Student,
      delete: ({ session }) => !!session && session.data.role !== Roles.Student,
    },
  },
});
