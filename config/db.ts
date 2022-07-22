import { KeystoneConfig } from "@keystone-6/core/dist/declarations/src/types/config";
import { DATABASE_URL } from "./index";
import { insertSeedData } from "../seed-data";

export const db: KeystoneConfig["db"] = {
  provider: "mysql",
  url: DATABASE_URL,
  idField: { kind: "autoincrement" },
  async onConnect(context) {
    if (process.argv.includes("--seed-data")) {
      await insertSeedData(context);
    } else {
      return;
    }
  },
};
