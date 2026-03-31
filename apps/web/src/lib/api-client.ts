import type { AppType } from "@coco-kit/api";
import { hc } from "hono/client";
import { env } from "@/lib/env";

export const apiClient = hc<AppType>(`${env.NEXT_PUBLIC_API_URL}/api`, {
  init: {
    credentials: "include",
  },
});
