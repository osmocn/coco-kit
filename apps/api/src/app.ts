import auth from "@coco-kit/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { ApiAuthVariables } from "./lib/auth-env";
import { env } from "./lib/env";
import { normalizeAuthHandlerRequest } from "./lib/normalize-auth-handler-request";
import { routes as allRoutes } from "./routes";
export type { RoutesType } from "./routes";

const app = new Hono<{
  Variables: ApiAuthVariables;
}>();

app.use(
  "*",
  cors({
    origin: env.BETTER_AUTH_TRUSTED_ORIGINS,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", logger());

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);

  return next();
});

const routes = app
  .route("/api", allRoutes)
  .get("/", (c) => c.text("Hello Hono!"))
  .on(["POST", "GET"], "/api/auth/*", async (c) => {
    try {
      const request = await normalizeAuthHandlerRequest(c.req.raw);
      return auth.handler(request);
    } catch (error) {
      return c.json(
        {
          error: "Invalid Callback URL",
          message:
            error instanceof Error
              ? error.message
              : "Callback URL must stay within the app.",
        },
        400,
      );
    }
  });

app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
  console.error("Unhandled Error:", err);

  return c.json(
    {
      error: "Internal Server Error",
      message: env.NODE_ENV === "development" ? err.message : undefined,
    },
    500,
  );
});

export type AppType = typeof routes;
export default app;
