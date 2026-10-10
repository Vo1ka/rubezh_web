import { cookies } from "next/headers";

// RW-16: every write route checks the session on the server — the middleware
// gate alone isn't enough once the site can commit to the repo.

export type Editor = { email: string };

export class AccessDenied extends Error {}

export async function requireEditor(): Promise<Editor> {
  const token = (await cookies()).get("access_token")?.value;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token) throw new AccessDenied("Нет сессии — войдите через форму доступа");
  if (!url || !key) throw new AccessDenied("Supabase не настроен — проверить доступ нельзя");

  const res = await fetch(`${url}/rest/v1/rpc/access_identity`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify({ p_token: token }),
    cache: "no-store",
  });
  if (res.status === 404) throw new AccessDenied("В Supabase нет функции access_identity — выполните миграцию 0016");
  if (!res.ok) throw new AccessDenied(`Проверка доступа не удалась: ${res.status}`);
  const rows = (await res.json()) as { email: string; status: string }[];
  const row = rows[0];
  if (!row || row.status !== "approved") throw new AccessDenied("Доступ не подтверждён");
  return { email: row.email };
}
