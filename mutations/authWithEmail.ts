import { KeystoneContext } from "@keystone-6/core/dist/declarations/src/types";
import { graphql } from "./index";

interface Arguments {
  email: string;
}

export const authWithEmail = async (
  root: any,
  { email }: Arguments,
  context: KeystoneContext
) => {
  let user = await context.query.User.findOne({
    where: { email },
    query: `email id`,
  });
  if (!user) {
    throw new Error("Sorry! The user does not exist");
  }

  const setMagicToken = graphql`
    mutation ($email: String!) {
      sendUserMagicAuthLink(email: $email)
    }
  `;

  await context.graphql.raw({
    query: setMagicToken,
    variables: { email: user.email },
  });

  user = await context.query.User.findOne({
    where: { email },
    query: `email id magicLinkToken`,
  });

  if (user.magicLinkToken) {
    return user.magicLinkToken;
  } else {
    throw new Error("Sorry! Authorization does not work");
  }
};
