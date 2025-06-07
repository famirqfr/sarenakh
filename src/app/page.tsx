// src/app/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role) {
    redirect("/dashboard");
  }

  redirect("/auth/login");
}
