import { list } from "@keystone-6/core";
import { integer, relationship, select, text } from "@keystone-6/core/fields";
import { Roles } from "../enums/roles.enum";
import { createdAt } from "../fields/createdAt";
import { lastModification } from "../fields/lastModification";
import { StatusesOptions } from "../consts/statuses-options.const";
import { Statuses } from "../enums/statuses.enum";

export const UserService = list({
  ui: {
    label: "Студенты: услуги",
    listView: {
      initialColumns: [
        "name",
        "originalPrice",
        "price",
        "student",
        "payed",
        "manager",
      ],
      pageSize: 20,
    },
  },
  fields: {
    name: text(),
    originalPrice: integer(),
    status: select({
      options: StatusesOptions,
      ui: { displayMode: "segmented-control" },
      defaultValue: Statuses.Inactive,
      validation: { isRequired: true },
    }),
    price: integer(),
    student: relationship({ ref: "User" }),
    payed: integer(),
    manager: relationship({ ref: "User" }),
    createdAt,
    lastModification,
  },
  access: {
    operation: {
      delete: ({ session }) => !!session && session.data.role !== Roles.Student,
    },
  },
});
