import { NextResponse } from "next/server";
import { loadRegistry } from "@/lib/directions/registry";

// RW-13: the registry for client components (pickers, filters). The GitHub
// token stays on the server; the file itself is cached by loadRegistry.
export type DirectionOption = { id: string; name: string; state: string };

export async function GET() {
  const registry = await loadRegistry();
  if (!registry.ok) {
    return NextResponse.json({ error: registry.error }, { status: 502 });
  }
  const directions: DirectionOption[] = registry.directions.map((d) => ({
    id: d.id,
    name: d.name,
    state: d.state,
  }));
  return NextResponse.json({ directions });
}
