import { Hono } from "hono";
import { testEmailRouter } from "./test-email";

export const routes = new Hono()
  .route("/test-email", testEmailRouter);

export type RoutesType = typeof routes;