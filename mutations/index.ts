import { ExtendGraphqlSchema } from "@keystone-6/core/dist/declarations/src/types/config";
import { graphQLSchemaExtension } from "@keystone-6/core";
import { authWithEmail } from "./authWithEmail";
import { checkout } from "./checkout";
import { payment } from "./payment";
import { againPayment } from "./againPayment";
import { checkPayment } from "./checkPayment";

export const graphql = String.raw;
export const extendGraphqlSchema: ExtendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type PaytureResponse {
      Success: String!
      OrderId: String
      ErrCode: String
      RedirectUrl: String!
      Amount: String
      SessionLifeTime: String
      AttemptsCount: String
      SessionId: String
    }

    type Mutation {
      authWithEmail(email: String!): String
      checkout(userId: String!): PaytureResponse
      payment(orderId: String!): PaytureResponse
    }

    type Query {
      againPayment(paymentId: String!): PaytureResponse
      checkPayment(paymentId: String!): Payment
    }
  `,
  resolvers: {
    Mutation: {
      authWithEmail,
      checkout,
      payment,
    },
    Query: {
      againPayment,
      checkPayment,
    },
  },
});
