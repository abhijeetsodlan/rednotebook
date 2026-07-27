"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const params = useSearchParams();
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: formData.get("username"), password: formData.get("password") })
    });
    if (response.ok) {
      window.location.href = params.get("next") || "/admin";
      return;
    }
    const data = await response.json().catch(() => ({}));
    setError(data.error || "Login failed.");
  }

  return (
    <form action={submit} className="mx-auto max-w-sm space-y-4 rounded-lg border border-white/10 bg-white/[.035] p-6">
      <input name="username" placeholder="Username" className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" required />
      <input name="password" type="password" placeholder="Password" className="w-full rounded border border-white/10 bg-coal px-4 py-3 text-cream" required />
      <button className="w-full rounded bg-redflag px-4 py-3 font-semibold text-white">Log in</button>
      {error ? <p className="text-sm text-redflag">{error}</p> : null}
    </form>
  );
}
