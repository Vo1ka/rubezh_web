const COOKIE_NAME = "access_token";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAccessToken(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}
