import type auth from "@coco-kit/auth";
import { createMiddleware } from "hono/factory";

type AuthEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const session = c.get("session");
  const user = c.get("user");
  if (!user || !session) return c.body(null, 401);
  await next();
});
