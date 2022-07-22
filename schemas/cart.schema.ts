import { graphql, list } from "@keystone-6/core";
import { integer, relationship, virtual } from "@keystone-6/core/fields";
import { lastModification } from "../fields/lastModification";
import { Lists } from ".keystone/types";
import { currency } from "../fields/currency";

export const Cart = list({
  ui: {
    label: "Корзины",
    description: "Корзина для клиентов",
    listView: {
      initialColumns: ["user", "quantityPayments"],
      pageSize: 20,
    },
  },
  fields: {
    user: relationship({
      ref: "User.cart",
      ui: {
        hideCreate: true,
      },
    }),
    currency,
    items: relationship({
      ref: "CartItem.cart",
      many: true,
      ui: {
        description:
          "В каждом item может быть ВНИМАНИЕ! либо абонемент, либо услуга.",
        displayMode: "cards",
        cardFields: ["subscription", "service", "originalPrice", "price"],
        inlineEdit: { fields: ["subscription", "service", "price"] },
        linkToItem: true,
        inlineConnect: true,
        inlineCreate: { fields: ["subscription", "service", "price"] },
      },
    }),
    amount: virtual({
      // @ts-ignore
      field: graphql.field({
        type: graphql.Int,
        async resolve(item: Lists.Cart.Item, arg, context) {
          const cartItems = await context.query.CartItem.findMany({
            where: { cart: { id: { equals: item.id } } },
            query: `price`,
          });
          if (cartItems) {
            return cartItems.reduce((tally, item) => tally + item.price, 0);
          }
        },
      }),
    }),
    quantityPayments: integer({ defaultValue: 1 }),
    lastModification,
  },
  access: {
    operation: {
      query: ({ session }) => !!session,
      update: ({ session }) => !!session,
      delete: ({ session }) => !!session,
    },
  },
  graphql: {
    omit: ["create"],
  },
});
