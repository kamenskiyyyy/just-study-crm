import { KeystoneConfig } from "@keystone-6/core/dist/declarations/src/types/config";
import { statelessSessions } from "@keystone-6/core/session";

export const session: KeystoneConfig["session"] = statelessSessions({
  secret: "3494c9e4-49c1-4834-9f4e-6b14baabb5d3",
  maxAge: 60 * 60 * 24,
});
