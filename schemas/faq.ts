import { list } from "@keystone-6/core";
import { language } from "../fields/language";
import { statusView } from "../fields/statusView";
import { relationship, text } from "@keystone-6/core/fields";
import { createdAt } from "../fields/createdAt";
import { lastModification } from "../fields/lastModification";

export const Faq = list({
  ui: {
    label: "Вопросы и ответы",
    listView: {
      initialColumns: ["language", "title", "desc", "statusView"],
    },
  },
  fields: {
    language,
    statusView,
    products: relationship({ ref: "Product", many: true }),
    title: text({ validation: { isRequired: true } }),
    desc: text({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" },
      db: { nativeType: "VarChar(1000)" },
    }),
    createdAt,
    lastModification,
  },
  access: {
    operation: {
      create: ({ session }) => !!session,
      update: ({ session }) => !!session,
      delete: ({ session }) => !!session,
    },
  },
});
