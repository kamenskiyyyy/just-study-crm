import { graphql, list } from "@keystone-6/core";
import { integer, relationship, virtual } from "@keystone-6/core/fields";
import { handleCartItemPrice } from "../lib/handleCartItemPrice";

export const CartItem = list({
  ui: {
    isHidden: true,
    listView: {
      initialColumns: [
        "cart",
        "originalPrice",
        "price",
        "service",
        "subscription",
      ],
    },
  },
  fields: {
    cart: relationship({ ref: "Cart.items" }),
    subscription: relationship({
      ref: "Subscription",
    }),
    service: relationship({
      ref: "Service",
    }),
    originalPrice: virtual({
      field: graphql.field({
        type: graphql.Int,
        async resolve(item, arg, context) {
          let originalPrice = 0;
          if (!item) return originalPrice;

          if (item?.subscriptionId) {
            const subscription = await context.query.Subscription.findOne({
              where: { id: `${item.subscriptionId}` },
              query: `price`,
            });
            originalPrice += subscription.price;
          }

          if (item?.serviceId) {
            const service = await context.query.Service.findOne({
              where: { id: `${item.serviceId}` },
              query: `price`,
            });
            originalPrice += service.price;
          }
          return originalPrice;
        },
      }),
    }),
    price: integer({
      ui: { description: "Цену можно не вписывать, если нет скидки." },
    }),
  },
  hooks: {
    resolveInput: handleCartItemPrice,
  },
});
