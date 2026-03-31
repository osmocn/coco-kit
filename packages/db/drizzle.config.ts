import path from "node:path";
import { getEnvVariable } from "@coco-kit/utils";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: path.resolve(__dirname, "../../apps/api/.env") });

const databaseUrl = getEnvVariable("DATABASE_URL");

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
