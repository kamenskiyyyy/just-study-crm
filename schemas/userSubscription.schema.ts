import { graphql, list } from "@keystone-6/core";
import {
  integer,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { Roles } from "../enums/roles.enum";
import { StatusesOptions } from "../consts/statuses-options.const";
import { Statuses } from "../enums/statuses.enum";
import { Lists } from ".keystone/types";
import { createdAt } from "../fields/createdAt";
import { lastModification } from "../fields/lastModification";
import { addDays } from "date-fns";
import format from "date-fns/format";
import { handleStatusUserSubscription } from "../lib/handleStatusUserSubscription";

export const UserSubscription = list({
  ui: {
    label: "Студенты: абонементы",
    labelField: "name",
    listView: {
      initialColumns: [
        "name",
        "visitCount",
        "price",
        "period",
        "status",
        "student",
        "beginDate",
        "endDate",
        "payed",
        "lastCount",
        "manager",
      ],
      pageSize: 20,
    },
  },
  fields: {
    name: text(),
    visitCount: integer(),
    originalPrice: integer(),
    price: integer(),
    period: integer({
      ui: { description: "Количество дней, которое действует абонемент" },
    }),
    status: select({
      options: StatusesOptions,
      ui: { displayMode: "segmented-control" },
      defaultValue: Statuses.Inactive,
      validation: { isRequired: true },
    }),
    student: relationship({ ref: "User" }),
    beginDate: timestamp({
      defaultValue: { kind: "now" },
    }),
    endDate: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item: Lists.UserSubscription.Item) {
          if (item.period && item.beginDate) {
            const endDate = addDays(new Date(item.beginDate), item.period);
            return format(endDate, "yyyy-MM-dd");
          } else {
            return;
          }
        },
      }),
      ui: {
        description: "Рассчитывается автоматически от длительности периода",
      },
    }),
    payed: integer(),
    totalVisited: integer({
      defaultValue: 0,
      validation: { isRequired: true },
    }),
    totalBurned: integer({ defaultValue: 0, validation: { isRequired: true } }),
    lastCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        async resolve(item: Lists.UserSubscription.Item) {
          if (item.visitCount) {
            return item.visitCount - item.totalVisited - item.totalBurned;
          } else {
            return;
          }
        },
      }),
    }),
    manager: relationship({ ref: "User" }),
    createdAt,
    lastModification,
  },
  hooks: {
    afterOperation: handleStatusUserSubscription,
  },
  access: {
    operation: {
      delete: ({ session }) => !!session && session.data.role !== Roles.Student,
    },
  },
});
