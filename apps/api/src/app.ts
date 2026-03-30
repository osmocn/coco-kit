import auth from "@coco-kit/auth";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

app
  .use("*", logger())
  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .get("/", (c) => c.text("Hello Hono!"));

app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
  console.error("Unhandled Error:", err);

  return c.json(
    {
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    },
    500,
  );
});

export type AppType = typeof app;
export default app;
