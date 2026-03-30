import "./lib/env";
import { serve } from "@hono/node-server";
import app from "./app";

const port = 3060;

serve({ fetch: app.fetch, port }, () => {
  console.log(`Grove API running on http://localhost:${port}`);
});
