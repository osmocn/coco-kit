import { getEnvVariable } from "@coco-kit/utils";
import { defineConfig } from "drizzle-kit";

const databaseUrl = getEnvVariable("DATABASE_URL");

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
