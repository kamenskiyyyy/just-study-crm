import { KeystoneConfig } from "@keystone-6/core/dist/declarations/src/types/config";
import { FRONTEND_URL, SERVER_PORT } from "./index";

export const server: KeystoneConfig["server"] = {
  port: SERVER_PORT,
  healthCheck: {
    path: "/check",
    data: () => ({
      status: "healthy",
      timestamp: Date.now(),
      uptime: process.uptime(),
    }),
  },
  cors: {
    origin: [FRONTEND_URL],
    credentials: true,
  },
};
