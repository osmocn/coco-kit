import { trustedOrigins } from "./auth";

export type HeaderLookup = {
  get(name: string): string | null;
};

function getOriginFromHeaderValue(value: string | null) {
  if (!value || !URL.canParse(value)) {
    return null;
  }

  return new URL(value).origin;
}

export function isSafeRelativeCallbackPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//");
}

export function isTrustedAbsoluteCallbackURL(value: string) {
  if (!URL.canParse(value)) {
    return false;
  }

  const url = new URL(value);

  return trustedOrigins.includes(url.origin);
}

export function getTrustedCallbackOrigin(headers: HeaderLookup) {
  const origin = getOriginFromHeaderValue(headers.get("origin"));

  if (origin && trustedOrigins.includes(origin)) {
    return origin;
  }

  const refererOrigin = getOriginFromHeaderValue(headers.get("referer"));

  if (refererOrigin && trustedOrigins.includes(refererOrigin)) {
    return refererOrigin;
  }

  return trustedOrigins[0];
}

export function normalizeTrustedCallbackURL(
  value: string,
  headers: HeaderLookup,
) {
  const nextValue = value.trim();

  if (isSafeRelativeCallbackPath(nextValue)) {
    return new URL(nextValue, getTrustedCallbackOrigin(headers)).toString();
  }

  if (isTrustedAbsoluteCallbackURL(nextValue)) {
    return new URL(nextValue).toString();
  }

  throw new Error("Callback URL must stay within the app.");
}

export function resolveTrustedCallbackURL(
  value: string | undefined,
  headers: HeaderLookup,
  fallbackPath: string,
) {
  if (value === undefined) {
    return new URL(fallbackPath, getTrustedCallbackOrigin(headers)).toString();
  }

  return normalizeTrustedCallbackURL(value, headers);
}
