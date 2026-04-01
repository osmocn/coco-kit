import { Hono } from "hono";
import { accountRouter } from "./account";

export const routes = new Hono()
  .route("/account", accountRouter);

export type RoutesType = typeof routes;
