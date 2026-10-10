import { redirect } from "next/navigation";

// RW-14: the directions overview is the site's entry point; the old team
// dashboard lives on at /dashboard.
export default function Home() {
  redirect("/directions");
}
