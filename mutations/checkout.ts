import { KeystoneContext } from "@keystone-6/core/dist/declarations/src/types";
import { graphql } from "./index";

interface Arguments {
  userId: string;
}

export const checkout = async (
  root: any,
  { userId }: Arguments,
  context: KeystoneContext
) => {
  let user = await context.query.User.findOne({
    where: { id: userId },
    query: `id name cart {id}`,
  });
  if (!user) {
    throw new Error("Sorry! The user does not exist!");
  }

  let orderText = user.name;

  const cart = await context.query.Cart.findOne({
    where: { id: user.cart.id },
    query: `id currency items { id subscription { id name } service { id name } price } quantityPayments amount`,
  });

  const subscriptionsIds = cart.items
    .filter((item: any) => item.subscription)
    .map((item: any) => {
      return {
        id: item?.subscription?.id,
        price: item.price,
        name: item?.subscription?.name,
      };
    });
  const servicesIds = cart.items
    .filter((item: any) => item.service)
    .map((item: any) => {
      return {
        id: item?.service?.id,
        price: item.price,
        name: item?.service?.name,
      };
    });

  orderText += ": " + subscriptionsIds.map((item: any) => item.name).join(", ");
  orderText += ", " + servicesIds.map((item: any) => item.name).join(", ");

  const order = await context.query.Order.createOne({
    data: {
      label: orderText,
      currency: cart.currency,
      student: { connect: { id: userId } },
      leftPayments: cart.quantityPayments,
      amount: cart.amount,
    },
    query: `id`,
  });

  if (subscriptionsIds) {
    subscriptionsIds.map(
      async ({ id, price }: { id: string; price: number }) => {
        const subscriptionTemplate = await context.query.Subscription.findOne({
          where: { id },
          query: `name visitCount price period`,
        });

        const userSubscription = await context.query.UserSubscription.createOne(
          {
            data: {
              name: subscriptionTemplate.name,
              visitCount: subscriptionTemplate.visitCount,
              originalPrice: subscriptionTemplate.price,
              price,
              period: subscriptionTemplate.period,
              student: { connect: { id: userId } },
            },
            query: `id`,
          }
        );
        await context.query.Order.updateOne({
          where: { id: order.id },
          data: {
            subscriptions: { connect: { id: userSubscription.id } },
          },
        });
      }
    );
  }

  if (servicesIds) {
    servicesIds.map(async ({ id, price }: { id: string; price: number }) => {
      const serviceTemplate = await context.query.Service.findOne({
        where: { id },
        query: `name price`,
      });

      const userService = await context.query.UserService.createOne({
        data: {
          name: serviceTemplate.name,
          originalPrice: serviceTemplate.price,
          price,
          student: { connect: { id: userId } },
        },
        query: `id`,
      });
      await context.query.Order.updateOne({
        where: { id: order.id },
        data: {
          services: { connect: { id: userService.id } },
        },
      });
    });
  }

  const cartItemsIds = await context.query.CartItem.findMany({
    where: { cart: { id: { equals: cart.id } } },
    query: `id`,
  });

  if (cartItemsIds) {
    await context.query.CartItem.deleteMany({
      where: cartItemsIds,
    });
  }

  await context.query.Cart.updateOne({
    where: { id: cart.id },
    data: { quantityPayments: 1 },
  });

  const res = await context.graphql.raw({
    variables: { orderId: order.id },
    query: graphql`
      mutation ($orderId: String!) {
        payment(orderId: $orderId) {
          Success
          OrderId
          ErrCode
          RedirectUrl
          Amount
          SessionLifeTime
          AttemptsCount
          SessionId
        }
      }
    `,
  });

  return res.data?.payment;
};
