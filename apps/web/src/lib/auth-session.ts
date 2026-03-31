import type { AuthSessionResponse } from "@coco-kit/zod/schema";
import { authSessionResponseSchema } from "@coco-kit/zod/schema";
import { env } from "@/lib/env";

type GetAuthSessionOptions = {
  headers?: HeadersInit;
};

export async function getAuthSession(
  options: GetAuthSessionOptions = {},
): Promise<AuthSessionResponse> {
  const requestInit = {
    cache: "no-store" as const,
    ...(options.headers ? { headers: options.headers } : {}),
  };

  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
    {
      ...requestInit,
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  const parsedSession = authSessionResponseSchema.safeParse(payload);

  return parsedSession.success ? parsedSession.data : null;

}